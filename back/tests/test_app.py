from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)


def test_get_todos():
    response = client.get("/api/todos")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
