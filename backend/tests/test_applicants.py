"""Applicant endpoint tests."""


def test_list_applicants(client):
    response = client.get("/api/applicants?limit=5")
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert payload["count"] >= 1
    assert payload["items"][0]["sk_id_curr"] == 100001


def test_get_applicant_found(client):
    response = client.get("/api/applicants/100001")
    assert response.status_code == 200
    payload = response.json()
    assert payload["sk_id_curr"] == 100001
    assert "amt_income_total" in payload["data"]


def test_get_applicant_not_found(client):
    response = client.get("/api/applicants/999999")
    assert response.status_code == 404
