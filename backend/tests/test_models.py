import pytest
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, SQLModel, select

from app.db import make_engine
from app.models import (
    Career,
    ChatMessage,
    Lineup,
    Match,
    MatchEvent,
    Player,
    ScoutReport,
    TrainingLog,
)
from app.models.enums import (
    ChatRole,
    EventType,
    Formation,
    MatchStatus,
    PlayerStatus,
    Position,
)


@pytest.fixture
def session():
    engine = make_engine("sqlite://")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as db:
        yield db


def _player(career_id: int, **overrides) -> Player:
    data = dict(
        career_id=career_id,
        name="Ivo Keller",
        age=23,
        nationality="Portugal",
        position=Position.ST,
        biography="Finalizador de área.",
        personality={"traits": ["frio"]},
        pace=78,
        shooting=80,
        passing=64,
        dribbling=74,
        defending=32,
        physical=70,
        goalkeeping=8,
        potential=86,
        overall=74,
        status=PlayerStatus.AVAILABLE,
        transfer_fee=1_200_000,
        wage=12_000,
        discovered_round=1,
    )
    data.update(overrides)
    return Player(**data)


def test_career_and_player_roundtrip(session: Session):
    career = Career(club_name="Atlético do Porto", manager_name="Pedro")
    session.add(career)
    session.commit()
    session.refresh(career)

    session.add(_player(career.id))
    session.commit()

    loaded = session.get(Career, career.id)
    assert loaded is not None
    assert loaded.budget == 5_000_000
    assert loaded.current_round == 1
    assert loaded.market_ready_for_round is None
    assert len(loaded.players) == 1
    player = loaded.players[0]
    assert player.name == "Ivo Keller"
    assert player.position == Position.ST
    assert player.personality == {"traits": ["frio"]}
    assert player.overall == 74


def test_database_rejects_an_attribute_outside_1_to_99(session: Session):
    career = Career(club_name="Atlético do Porto", manager_name="Pedro")
    session.add(career)
    session.commit()
    session.refresh(career)

    session.add(_player(career.id, pace=0))
    with pytest.raises(IntegrityError):
        session.commit()


def test_one_training_per_player_per_round(session: Session):
    career = Career(club_name="Atlético do Porto", manager_name="Pedro")
    session.add(career)
    session.commit()
    session.refresh(career)
    player = _player(career.id, status=PlayerStatus.CONTRACTED)
    session.add(player)
    session.commit()
    session.refresh(player)

    session.add(TrainingLog(player_id=player.id, round_number=1, focus="passing", before=64, after=66))
    session.commit()
    session.add(TrainingLog(player_id=player.id, round_number=1, focus="shooting", before=80, after=81))
    with pytest.raises(IntegrityError):
        session.commit()


def test_deleting_a_career_removes_the_save(session: Session):
    career = Career(club_name="Atlético do Porto", manager_name="Pedro")
    session.add(career)
    session.commit()
    session.refresh(career)

    player = _player(career.id, status=PlayerStatus.CONTRACTED)
    session.add(player)
    session.commit()
    session.refresh(player)

    match = Match(
        career_id=career.id,
        round_number=1,
        status=MatchStatus.FINISHED,
        seed=67,
        opponent_name="Rio Norte",
        opponent_squad=[{"name": "R. Almeida", "position": "GK"}],
        home_score=1,
        away_score=0,
    )
    session.add(match)
    session.commit()
    session.refresh(match)

    session.add(Lineup(career_id=career.id, formation=Formation.FOUR_THREE_THREE, slots=[]))
    session.add(
        MatchEvent(
            match_id=match.id,
            minute=67,
            sequence=81,
            type=EventType.GOAL,
            payload={
                "team": "user",
                "scorer_id": player.id,
                "scorer_name": player.name,
                "xg": 0.18,
            },
            commentary="Keller chega na frente da área.",
        )
    )
    session.add(TrainingLog(player_id=player.id, round_number=1, focus="shooting", before=80, after=81))
    session.add(ScoutReport(player_id=player.id, body="Finaliza com o pé direito."))
    session.add(ChatMessage(career_id=career.id, role=ChatRole.USER, content="Como escalo?"))
    session.commit()

    session.delete(career)
    session.commit()

    assert session.get(Career, career.id) is None
    assert session.exec(select(Player)).all() == []
    assert session.exec(select(Lineup)).all() == []
    assert session.exec(select(Match)).all() == []
    assert session.exec(select(MatchEvent)).all() == []
    assert session.exec(select(TrainingLog)).all() == []
    assert session.exec(select(ScoutReport)).all() == []
    assert session.exec(select(ChatMessage)).all() == []
