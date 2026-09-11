"""Health endpoint tests."""


def test_health_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "credinova-backend"
    assert payload["ml_loaded"] is True
    assert payload["models_count"] == 10
