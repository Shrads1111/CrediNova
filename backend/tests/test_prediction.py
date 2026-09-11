"""Prediction endpoint tests."""

VALID_BANDS = {"Excellent", "Good", "Fair", "Moderate", "High Risk"}


def test_predict_demo_applicant(client):
    response = client.post(
        "/api/predict",
        json={"applicant_id": 100001, "explain": False},
    )
    assert response.status_code == 200
    payload = response.json()

    assert payload["applicant_id"] == 100001
    assert 0.0 <= payload["default_probability"] <= 1.0
    assert 0.0 <= payload["default_probability_percent"] <= 100.0
    assert 300 <= payload["credit_score"] <= 900
    assert payload["risk_band"] in VALID_BANDS
    assert payload["model_version"] == "lightgbm-homecredit-10fold-v1"
    assert payload["source"] == "ml_ensemble"
    assert payload["score_scale"] == "300-900"


def test_predict_not_found(client):
    response = client.post("/api/predict", json={"applicant_id": 999999})
    assert response.status_code == 404


def test_predict_invalid_body(client):
    response = client.post("/api/predict", json={})
    assert response.status_code == 422
