# Python Lab — the capstone

An interactive teaching tool for the final exercise of a two-day Python training.
Participants combine **everything** from the course — variables & datatypes, lists,
dicts, logic & functions, NumPy, pandas and matplotlib — into one working analysis
script, built block by block.

## How the lab works

1. **Choose your data** — pick one of four preset datasets (coffee bar sales,
   weather stations, fitness club check-ins, webshop orders), each with a data
   preview and a "mission" question — or paste your own CSV.
2. **Build your script** — seven building blocks, one per course topic.
   Participants type real Python; hoverable examples are tailored to the chosen
   dataset (click to insert when stuck). The script assembles live in the dark
   panel on the right.
3. **Run & learn** — the backend executes the script and returns the printed
   output, any traceback, and the matplotlib chart as an image. Crashing is part
   of the lesson: read the traceback, go back, tweak, run again. An optional
   **AI coach** reviews the script per course topic (needs an OpenAI key).

There is also a one-page **cheatsheet** with the whole course in snippets.

## Running it

```bash
# backend  → http://localhost:8000
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python run.py

# frontend → http://localhost:5173
cd frontend
npm install
npm run dev
```

Optionally, for the AI coach, copy `backend/.env.example` to `backend/.env` and
set `OPENAI_API_KEY`. Everything else works without it.

## Using it in a training

- Run both servers on your laptop and share your local IP with the group
  (`http://<your-ip>:5173`), or let everyone browse to it on a beamer machine.
  If participants connect from another origin, add it to `CORS_ORIGINS` and
  start Vite with `--host`, and set `VITE_API_URL` to the backend's address.
- Without `JWT_SECRET`, auth is disabled and everyone shares one dev user —
  intended for classroom use. Auth endpoints exist for hosted setups.
- Participant scripts run in a subprocess on the backend machine with a
  15-second timeout (`PY_RUN_TIMEOUT`). Participants are trusted classroom
  users; don't expose this endpoint to the open internet.
- The AI coach pins `gpt-5.4-mini`, retries transient errors, and maps
  rate limits to a calm "it's busy" message so ten people can share one key.

## Stack

FastAPI + SQLAlchemy + Alembic (SQLite in dev) · React 18 + TypeScript + Vite +
Chakra UI v2 · script execution via subprocess with numpy/pandas/matplotlib ·
AI coach via SSE streaming with a provider registry (OpenAI, Anthropic).
