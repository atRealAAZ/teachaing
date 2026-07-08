import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from .database import get_db
from .models import User

JWT_SECRET = os.getenv("JWT_SECRET")
_AUTH_DISABLED = JWT_SECRET is None
if _AUTH_DISABLED:
    # Ephemeral secret so token code paths still function in dev.
    JWT_SECRET = secrets.token_hex(32)

LOCAL_USER_ID = "local-dev-user"
SESSION_COOKIE = "session"
TOKEN_TTL = timedelta(days=14)
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN") or None

_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + TOKEN_TTL,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def set_auth_cookie(response: Response, user_id: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=create_token(user_id),
        max_age=int(TOKEN_TTL.total_seconds()),
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        domain=COOKIE_DOMAIN,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=SESSION_COOKIE, domain=COOKIE_DOMAIN, path="/"
    )


def _get_or_create_local_user(db: Session) -> User:
    user = db.query(User).filter(User.id == LOCAL_USER_ID).first()
    if user is None:
        user = User(id=LOCAL_USER_ID, email="dev@localhost", plan="free")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    if _AUTH_DISABLED:
        return _get_or_create_local_user(db)

    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Session expired")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Unknown user")
    return user
