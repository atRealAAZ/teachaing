from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from .models import UsageRecord


def record_usage(
    db: Session, user_id: str, tokens: int, model: str, action: str
) -> None:
    """Adds a usage row; does NOT commit — caller owns the transaction."""
    db.add(
        UsageRecord(
            user_id=user_id, tokens=tokens, model_used=model, action=action
        )
    )


def get_monthly_usage(db: Session, user_id: str) -> int:
    now = datetime.now(timezone.utc)
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    total = (
        db.query(func.coalesce(func.sum(UsageRecord.tokens), 0))
        .filter(
            UsageRecord.user_id == user_id,
            UsageRecord.created_at >= month_start.replace(tzinfo=None),
        )
        .scalar()
    )
    return int(total or 0)
