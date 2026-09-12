"""Assessment and predictions list tests."""


def test_assessment_flow(client):
    assessment_payload = {
        "customer_id": "CUST-TEST-100",
        "applicant_id": 100001,
        "personal_data": {"age": 35, "education": "Higher education"},
        "financial_data": {"monthly_income": 120000, "credit_amount": 500000},
        "transaction_data": {"monthly_inflows": 110000},
        "payment_data": {"on_time_ratio": 0.98},
        "dti": 25.5,
        "status": "completed",
    }
    create_res = client.post("/api/assessments", json=assessment_payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert "id" in created
    assessment_id = created["id"]

    # Retrieve by id
    get_res = client.get(f"/api/assessments/{assessment_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == assessment_id

    # List assessments
    list_res = client.get("/api/assessments?limit=5")
    assert list_res.status_code == 200
    items = list_res.json()
    assert isinstance(items, list)

    # Predict linked with assessment
    pred_res = client.post(
        "/api/predict",
        json={"applicant_id": 100001, "assessment_id": assessment_id, "explain": True},
    )
    assert pred_res.status_code == 200
    pred = pred_res.json()
    assert pred["assessment_id"] == assessment_id
    assert pred["shap_summary"] is not None
    assert len(pred["shap_summary"]) > 0

    # List predictions
    list_preds = client.get("/api/predictions?limit=5")
    assert list_preds.status_code == 200
    assert isinstance(list_preds.json(), list)
