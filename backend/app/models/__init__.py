"""Importing this package registers every table on SQLModel.metadata."""

from app.models.tables import (
    Career,
    ChatMessage,
    Lineup,
    Match,
    MatchEvent,
    Player,
    ScoutReport,
    TrainingLog,
)

__all__ = [
    "Career",
    "ChatMessage",
    "Lineup",
    "Match",
    "MatchEvent",
    "Player",
    "ScoutReport",
    "TrainingLog",
]
