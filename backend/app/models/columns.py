from datetime import datetime, timezone

from sqlalchemy import Column, ForeignKey, Integer


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def cascade_fk(target: str, *, primary_key: bool = False, index: bool = False) -> Column:
    return Column(
        Integer,
        ForeignKey(target, ondelete="CASCADE"),
        primary_key=primary_key,
        nullable=False,
        index=index,
    )
