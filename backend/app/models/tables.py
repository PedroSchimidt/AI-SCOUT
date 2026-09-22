from datetime import datetime, timezone
from enum import StrEnum
from typing import Any, Optional

from sqlalchemy import CheckConstraint, Column, Index, UniqueConstraint
from sqlalchemy.types import JSON
from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import (
    ChatRole,
    EventType,
    Formation,
    MatchStatus,
    Mentality,
    PlayerStatus,
    Position,
    Pressing,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _one_of(column: str, vocabulary: type[StrEnum], name: str) -> CheckConstraint:
    listed = ", ".join(f"'{item.value}'" for item in vocabulary)
    return CheckConstraint(f"{column} IN ({listed})", name=name)


def _between(column: str, low: int, high: int, name: str) -> CheckConstraint:
    return CheckConstraint(f"{column} BETWEEN {low} AND {high}", name=name)


class Career(SQLModel, table=True):
    __tablename__ = "careers"
    __table_args__ = (
        _between("reputation", 1, 100, "ck_career_reputation"),
        CheckConstraint("budget >= 0", name="ck_career_budget"),
        CheckConstraint("current_round >= 1", name="ck_career_round"),
    )

    id: int | None = Field(default=None, primary_key=True)
    club_name: str
    manager_name: str
    budget: int = 5_000_000
    reputation: int = 40
    current_round: int = 1
    # Round whose market was already generated. Empty means the current round still needs a scouting call.
    market_ready_for_round: int | None = None
    created_at: datetime = Field(default_factory=_utcnow)

    players: list["Player"] = Relationship(back_populates="career", cascade_delete=True)
    lineup: Optional["Lineup"] = Relationship(back_populates="career", cascade_delete=True)
    matches: list["Match"] = Relationship(back_populates="career", cascade_delete=True)
    messages: list["ChatMessage"] = Relationship(back_populates="career", cascade_delete=True)


class Player(SQLModel, table=True):
    __tablename__ = "players"
    __table_args__ = (
        Index("ix_player_career_status", "career_id", "status"),
        _one_of("position", Position, "ck_player_position"),
        _one_of("status", PlayerStatus, "ck_player_status"),
        _between("pace", 1, 99, "ck_player_pace"),
        _between("shooting", 1, 99, "ck_player_shooting"),
        _between("passing", 1, 99, "ck_player_passing"),
        _between("dribbling", 1, 99, "ck_player_dribbling"),
        _between("defending", 1, 99, "ck_player_defending"),
        _between("physical", 1, 99, "ck_player_physical"),
        _between("goalkeeping", 1, 99, "ck_player_goalkeeping"),
        _between("potential", 1, 99, "ck_player_potential"),
        _between("overall", 1, 99, "ck_player_overall"),
        CheckConstraint("potential >= overall", name="ck_player_potential_gte_overall"),
        CheckConstraint("transfer_fee >= 0", name="ck_player_fee"),
        CheckConstraint("wage >= 0", name="ck_player_wage"),
        _between("fitness", 0, 100, "ck_player_fitness"),
        _between("morale", 0, 100, "ck_player_morale"),
        CheckConstraint("matches_played >= 0", name="ck_player_matches"),
        CheckConstraint("goals >= 0", name="ck_player_goals"),
        CheckConstraint("assists >= 0", name="ck_player_assists"),
        CheckConstraint("discovered_round >= 1", name="ck_player_discovered_round"),
    )

    id: int | None = Field(default=None, primary_key=True)
    career_id: int = Field(foreign_key="careers.id", ondelete="CASCADE")
    name: str
    age: int
    nationality: str
    position: str
    biography: str = ""
    personality: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    pace: int
    shooting: int
    passing: int
    dribbling: int
    defending: int
    physical: int
    goalkeeping: int
    potential: int
    overall: int
    status: str
    transfer_fee: int
    wage: int
    discovered_round: int
    fitness: int = 100
    morale: int = 50
    matches_played: int = 0
    goals: int = 0
    assists: int = 0

    career: Career = Relationship(back_populates="players")
    training_logs: list["TrainingLog"] = Relationship(back_populates="player", cascade_delete=True)
    scout_reports: list["ScoutReport"] = Relationship(back_populates="player", cascade_delete=True)


class Lineup(SQLModel, table=True):
    __tablename__ = "lineups"
    __table_args__ = (
        _one_of("formation", Formation, "ck_lineup_formation"),
        _one_of("mentality", Mentality, "ck_lineup_mentality"),
        _one_of("pressing", Pressing, "ck_lineup_pressing"),
    )

    id: int | None = Field(default=None, primary_key=True)
    career_id: int = Field(foreign_key="careers.id", unique=True, ondelete="CASCADE")
    formation: str = Formation.FOUR_THREE_THREE
    mentality: str = Mentality.BALANCED
    pressing: str = Pressing.MEDIUM
    # Eleven slots. Each item is {"position": "ST", "player_id": 12} with player_id null while the slot is open.
    slots: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))

    career: Career = Relationship(back_populates="lineup")


class Match(SQLModel, table=True):
    __tablename__ = "matches"
    __table_args__ = (
        _one_of("status", MatchStatus, "ck_match_status"),
        CheckConstraint("round_number >= 1", name="ck_match_round"),
        CheckConstraint("home_score >= 0", name="ck_match_home_score"),
        CheckConstraint("away_score >= 0", name="ck_match_away_score"),
        UniqueConstraint("career_id", "round_number", name="uq_match_career_round"),
    )

    id: int | None = Field(default=None, primary_key=True)
    career_id: int = Field(foreign_key="careers.id", ondelete="CASCADE")
    round_number: int
    status: str = MatchStatus.SCHEDULED
    seed: int
    opponent_name: str
    opponent_squad: list[dict[str, Any]] = Field(
        default_factory=list, sa_column=Column(JSON, nullable=False)
    )
    # Copied from the lineup at kickoff. Empty until the match starts.
    user_lineup: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    home_score: int = 0
    away_score: int = 0

    career: Career = Relationship(back_populates="matches")
    events: list["MatchEvent"] = Relationship(back_populates="match", cascade_delete=True)


class MatchEvent(SQLModel, table=True):
    __tablename__ = "match_events"
    __table_args__ = (
        UniqueConstraint("match_id", "sequence", name="uq_match_event_sequence"),
        Index("ix_match_event_match_sequence", "match_id", "sequence"),
        _one_of("type", EventType, "ck_match_event_type"),
        CheckConstraint("minute >= 0", name="ck_match_event_minute"),
        CheckConstraint("sequence >= 1", name="ck_match_event_sequence"),
    )

    id: int | None = Field(default=None, primary_key=True)
    match_id: int = Field(foreign_key="matches.id", ondelete="CASCADE")
    minute: int
    sequence: int
    type: str
    payload: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON, nullable=False))
    commentary: str | None = None

    match: Match = Relationship(back_populates="events")


class TrainingLog(SQLModel, table=True):
    __tablename__ = "training_logs"
    __table_args__ = (
        UniqueConstraint("player_id", "round_number", name="uq_training_player_round"),
        CheckConstraint("round_number >= 1", name="ck_training_round"),
    )

    id: int | None = Field(default=None, primary_key=True)
    player_id: int = Field(foreign_key="players.id", ondelete="CASCADE")
    round_number: int
    focus: str
    before: int
    after: int

    player: Player = Relationship(back_populates="training_logs")


class ScoutReport(SQLModel, table=True):
    __tablename__ = "scout_reports"

    id: int | None = Field(default=None, primary_key=True)
    player_id: int = Field(foreign_key="players.id", ondelete="CASCADE")
    body: str
    created_at: datetime = Field(default_factory=_utcnow)

    player: Player = Relationship(back_populates="scout_reports")


class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    __table_args__ = (_one_of("role", ChatRole, "ck_chat_role"),)

    id: int | None = Field(default=None, primary_key=True)
    career_id: int = Field(foreign_key="careers.id", ondelete="CASCADE")
    role: str
    content: str
    created_at: datetime = Field(default_factory=_utcnow)

    career: Career = Relationship(back_populates="messages")
