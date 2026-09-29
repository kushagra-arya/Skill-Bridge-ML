from fastapi.testclient import TestClient

from skill_bridge.api import app


def test_health_and_model_info():
    with TestClient(app) as client:
        health = client.get("/health")
        info = client.get("/model/info")

    assert health.status_code == 200
    assert health.json()["models_loaded"] == {
        "classification": True,
        "regression": True,
    }
    assert info.status_code == 200
    assert info.json()["algorithms"]["classification"] == "LogisticRegression"


def test_single_and_batch_prediction(student):
    with TestClient(app) as client:
        single = client.post("/predict", json=student)
        batch = client.post("/predict/batch", json={"students": [student, student]})

    assert single.status_code == 200
    assert single.json()["success"] is True
    assert batch.status_code == 200
    assert batch.json()["count"] == 2


def test_invalid_profile_is_rejected(student):
    student["cgpa"] = 12
    with TestClient(app) as client:
        response = client.post("/predict", json=student)

    assert response.status_code == 422
