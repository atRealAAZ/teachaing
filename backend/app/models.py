import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String

from .database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)
    plan = Column(String, default="free")
    has_seen_onboarding = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=_now)


class UsageRecord(Base):
    __tablename__ = "usage_records"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, nullable=False, index=True)
    tokens = Column(Integer, nullable=False, default=0)
    model_used = Column(String, nullable=True)
    action = Column(String, nullable=False, default="run")
    created_at = Column(DateTime, default=_now, index=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, nullable=True, index=True)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=True)
    resource_id = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    metadata_ = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=_now, index=True)
