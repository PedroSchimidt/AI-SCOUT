from enum import Enum


class Position(str, Enum):
    GK = "GK"
    RB = "RB"
    CB = "CB"
    LB = "LB"
    DM = "DM"
    CM = "CM"
    AM = "AM"
    RW = "RW"
    LW = "LW"
    ST = "ST"


class PlayerStatus(str, Enum):
    AVAILABLE = "available"
    CONTRACTED = "contracted"
    RELEASED = "released"


class Formation(str, Enum):
    F433 = "4-3-3"
    F442 = "4-4-2"
    F4231 = "4-2-3-1"
    F352 = "3-5-2"


class Mentality(str, Enum):
    DEFENSIVE = "defensive"
    BALANCED = "balanced"
    ATTACKING = "attacking"


class Pressing(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    FINISHED = "finished"


class EventType(str, Enum):
    TICK = "tick"
    CHANCE = "chance"
    GOAL = "goal"
    SAVE = "save"
    MISS = "miss"
    FOUL = "foul"
    YELLOW = "yellow"
    RED = "red"
    PENALTY = "penalty"
    INJURY = "injury"
    HALFTIME = "halftime"
    FULLTIME = "fulltime"


class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
