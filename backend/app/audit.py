from typing import Any, Optional

from sqlalchemy.orm import Session

from .models import AuditLog


def log_action(
    db: Session,
    user_id: Optional[str],
    action: str,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    ip: Optional[str] = None,
    metadata: Optional[dict[str, Any]] = None,
) -> None:
    """Adds an audit row; does NOT commit — caller owns the transaction."""
    db.add(
        AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip=ip,
            metadata_=metadata,
        )
    )
