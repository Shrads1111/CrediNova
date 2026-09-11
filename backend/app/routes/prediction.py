"""ML prediction endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app import database as db
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.ml_service import get_ml_service

router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(body: PredictionRequest) -> PredictionResponse:
    ml = get_ml_service()
    if not ml.loaded:
        raise HTTPException(status_code=503, detail="ML models are not loaded")

    applicant = db.get_applicant(body.applicant_id)
    if applicant is None and not ml.applicant_exists(body.applicant_id):
        raise HTTPException(
            status_code=404,
            detail=f"Applicant {body.applicant_id} not found",
        )

    if body.assessment_id:
        assessment = db.get_assessment(body.assessment_id)
        if assessment is None:
            raise HTTPException(status_code=404, detail="Assessment not found")

    try:
        result = ml.predict_demo_applicant(body.applicant_id, explain=body.explain)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    stored = db.create_prediction(
        {
            "assessment_id": body.assessment_id,
            **result,
        }
    )

    return PredictionResponse(
        id=stored.get("id"),
        assessment_id=stored.get("assessment_id"),
        applicant_id=result["applicant_id"],
        default_probability=result["default_probability"],
        default_probability_percent=result["default_probability_percent"],
        credit_score=result["credit_score"],
        score_scale=result["score_scale"],
        risk_band=result["risk_band"],
        model_version=result["model_version"],
        shap_summary=result.get("shap_summary"),
        created_at=stored.get("created_at"),
        source="ml_ensemble",
    )
