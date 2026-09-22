from fastapi.testclient import TestClient

from app.main import app


def test_health_reports_the_process_is_up():
    with TestClient(app) as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
