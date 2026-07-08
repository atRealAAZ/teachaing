import os

from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///./data/app.db")

# Railway (and Heroku-style providers) hand out "postgres://", but SQLAlchemy
# 1.4+ requires the "postgresql://" scheme.
if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace(
        "postgres://", "postgresql://", 1
    )
