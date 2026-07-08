import asyncio
import json
import os
import random
import secrets
from typing import Optional

import openai
from fastapi import Depends, FastAPI, Header, HTTPException, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .audit import log_action
from .auth import (
    clear_auth_cookie,
    get_current_user,
    hash_password,
    set_auth_cookie,
    verify_password,
)
from .database import get_db
from .models import User
from .providers.registry import AVAILABLE_MODELS, get_provider
from .pyrunner import RUN_TIMEOUT, run_python
from .usage import get_monthly_usage, record_usage

app = FastAPI(title="Python Lab API")

# Optional shared classroom passcode. Unset ⇒ open, matching local dev.
# Set on hosted deployments to keep the code-execution and LLM endpoints out
# of reach of anyone who isn't in the training (they only have the URL).
LAB_PASSCODE = os.getenv("LAB_PASSCODE")


def require_lab_passcode(x_lab_passcode: Optional[str] = Header(default=None)) -> None:
    if LAB_PASSCODE is None:
        return
    if not x_lab_passcode or not secrets.compare_digest(x_lab_passcode, LAB_PASSCODE):
        raise HTTPException(status_code=401, detail="Wrong or missing classroom passcode.")

_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip().rstrip("/") for o in _raw if o.strip()],
    allow_credentials=True,  # cookie auth ⇒ explicit origins, never "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------- lab config

LAB_DEFAULT_MODEL = "gpt-5.4-mini"
LAB_MONTHLY_TOKEN_LIMIT = 100_000  # a training group must not stall mid-exercise
LAB_MAX_RETRIES = 3  # ~10 people on one API key can trip 429/transient 5xx
LAB_RETRY_BASE_DELAY = 0.5
LAB_BUSY_MESSAGE = "It's a bit busy — wait a few seconds and try again."
LAB_GENERIC_ERROR = "Something went wrong while running. Try again in a moment."


def _is_retryable(e: Exception) -> bool:
    if isinstance(e, openai.RateLimitError):
        return True
    if isinstance(e, (openai.APIConnectionError, openai.APITimeoutError)):
        return True
    if isinstance(e, openai.APIStatusError) and e.status_code >= 500:
        return True
    status = getattr(e, "status_code", None)
    if status == 429 or (isinstance(status, int) and status >= 500):
        return True
    return type(e).__name__ in (
        "RateLimitError",
        "APIConnectionError",
        "APITimeoutError",
        "InternalServerError",
        "OverloadedError",
    )


def _friendly_message(e: Exception) -> str:
    if _is_retryable(e):
        return LAB_BUSY_MESSAGE
    return LAB_GENERIC_ERROR


def _http_error(e: Exception) -> HTTPException:
    if isinstance(e, openai.RateLimitError) or getattr(e, "status_code", None) == 429:
        return HTTPException(status_code=429, detail=LAB_BUSY_MESSAGE)
    if _is_retryable(e):
        return HTTPException(status_code=503, detail=LAB_BUSY_MESSAGE)
    return HTTPException(status_code=500, detail=LAB_GENERIC_ERROR)


async def _backoff(attempt: int) -> None:
    delay = LAB_RETRY_BASE_DELAY * (2**attempt) + random.uniform(0, 0.4)
    await asyncio.sleep(delay)


def _check_lab_tokens(db: Session, user: User) -> None:
    if get_monthly_usage(db, user.id) >= LAB_MONTHLY_TOKEN_LIMIT:
        raise HTTPException(
            status_code=429,
            detail="You've hit this month's lab limit. Ask your trainer for a fresh account.",
        )


def _check_model_access(model: str) -> None:
    if not any(m["id"] == model for m in AVAILABLE_MODELS):
        raise HTTPException(status_code=400, detail=f"Unknown model: {model}")


def _get_provider_or_503(model: str):
    try:
        return get_provider(model)
    except Exception:
        # Typically a missing API key — the trainer's problem, not the trainee's.
        raise HTTPException(
            status_code=503,
            detail="The AI coach isn't set up (missing API key). The rest of the lab works fine without it.",
        )


# ------------------------------------------------------------------- schemas


class RegisterRequest(BaseModel):
    email: str
    password: str
    accepted_terms: bool = False


class LoginRequest(BaseModel):
    email: str
    password: str


class LabRunRequest(BaseModel):
    prompt: str
    system_message: Optional[str] = None
    model: str = LAB_DEFAULT_MODEL


class PythonRunRequest(BaseModel):
    code: str
    csv: str


# --------------------------------------------------------------------- misc


@app.get("/health")
def health():
    return {"status": "ok", "app": "Python Lab API"}


@app.post("/lab/passcode-check", dependencies=[Depends(require_lab_passcode)])
def passcode_check():
    return {"ok": True}


@app.get("/models/")
def list_models():
    return AVAILABLE_MODELS


# --------------------------------------------------------------------- auth


@app.post("/auth/register")
def register(body: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    if not body.accepted_terms:
        raise HTTPException(status_code=400, detail="You must accept the terms.")
    email = body.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="That email is already registered.")
    user = User(email=email, password_hash=hash_password(body.password))
    db.add(user)
    log_action(db, user.id, "auth.register", "user", user.id)
    db.commit()
    set_auth_cookie(response, user.id)
    return {"id": user.id, "email": user.email}


@app.post("/auth/login")
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.password_hash or not verify_password(user.password_hash, body.password):
        raise HTTPException(status_code=401, detail="Wrong email or password.")
    log_action(db, user.id, "auth.login", "user", user.id)
    db.commit()
    set_auth_cookie(response, user.id)
    return {"id": user.id, "email": user.email}


@app.post("/auth/logout")
def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}


@app.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "plan": user.plan}


# ------------------------------------------------------------ lab endpoints


@app.post("/lab/run/", dependencies=[Depends(require_lab_passcode)])
async def lab_run(
    request: LabRunRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Type a prompt first.")
    _check_model_access(request.model)
    _check_lab_tokens(db, user)
    provider = _get_provider_or_503(request.model)

    messages = []
    if request.system_message:
        messages.append({"role": "system", "content": request.system_message})
    messages.append({"role": "user", "content": request.prompt})

    last_error: Optional[Exception] = None
    for attempt in range(LAB_MAX_RETRIES):
        try:
            output = await provider.generate(messages, request.model)
            break
        except Exception as e:
            last_error = e
            if _is_retryable(e) and attempt < LAB_MAX_RETRIES - 1:
                await _backoff(attempt)
                continue
            raise _http_error(e)
    else:
        raise _http_error(last_error or RuntimeError())

    est_tokens = (len(request.prompt) + len(output)) // 4
    record_usage(db, user.id, est_tokens, request.model, "run")
    log_action(db, user.id, "lab.run", "lab", None, None, {"model": request.model})
    db.commit()
    return {"llm_output": output, "model": request.model}


@app.post("/lab/run/stream", dependencies=[Depends(require_lab_passcode)])
async def lab_run_stream(
    request: LabRunRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Type a prompt first.")
    _check_model_access(request.model)
    _check_lab_tokens(db, user)
    provider = _get_provider_or_503(request.model)

    messages = []
    if request.system_message:
        messages.append({"role": "system", "content": request.system_message})
    messages.append({"role": "user", "content": request.prompt})

    user_id = user.id
    model_val = request.model
    prompt_len = len(request.prompt)

    async def generate():
        full_output = ""
        # Retry ONLY before the first token is emitted — once text has
        # streamed to the client, retrying would duplicate output.
        for attempt in range(LAB_MAX_RETRIES):
            started = False
            try:
                async for token in provider.generate_stream(messages, model_val):
                    started = True
                    full_output += token
                    yield f"data: {json.dumps({'token': token})}\n\n"
                est_tokens = (prompt_len + len(full_output)) // 4
                record_usage(db, user_id, est_tokens, model_val, "run")
                log_action(db, user_id, "lab.run", "lab", None, None, {"model": model_val, "stream": True})
                db.commit()
                yield f"data: {json.dumps({'done': True, 'full_output': full_output})}\n\n"
                return
            except Exception as e:
                if not started and _is_retryable(e) and attempt < LAB_MAX_RETRIES - 1:
                    await _backoff(attempt)
                    full_output = ""
                    continue
                yield f"data: {json.dumps({'error': _friendly_message(e)})}\n\n"
                return

    return StreamingResponse(generate(), media_type="text/event-stream")


# --------------------------------------------------------------- python run


@app.post("/python/run", dependencies=[Depends(require_lab_passcode)])
async def python_run(
    request: PythonRunRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Fill in at least one building block first.")
    if not request.csv.strip():
        raise HTTPException(status_code=400, detail="Pick a dataset first.")
    if len(request.code) > 20_000 or len(request.csv) > 200_000:
        raise HTTPException(status_code=400, detail="That's too large for the lab.")

    result = await run_in_threadpool(run_python, request.code, request.csv)
    log_action(
        db, user.id, "lab.python_run", "lab", None, None,
        {"exit_code": result["exit_code"], "timed_out": result["timed_out"]},
    )
    db.commit()
    result["timeout_seconds"] = RUN_TIMEOUT
    return result


# ---------------------------------------------------------- static frontend
# Present only in production builds (see frontend/dist); in local dev the
# frontend is served separately by `npm run dev` and this directory is absent.

_FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.isdir(_FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=_FRONTEND_DIST, html=True), name="frontend")
