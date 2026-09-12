"""ML prediction endpoints."""

from typing import List
from fastapi import APIRouter, HTTPException, Query

from app import database as db
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.ml_service import get_ml_service

router = APIRouter(prefix="/api", tags=["prediction"])


@router.get("/predictions", response_model=List[PredictionResponse])
def list_predictions(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> List[PredictionResponse]:
    rows = db.list_predictions(limit=limit, offset=offset)
    return [
        PredictionResponse(
            id=row.get("id"),
            assessment_id=row.get("assessment_id"),
            applicant_id=int(row["applicant_id"]),
            default_probability=float(row["default_probability"]),
            default_probability_percent=float(row["default_probability_percent"]),
            credit_score=int(row["credit_score"]),
            score_scale=row.get("score_scale", "300-900"),
            risk_band=row["risk_band"],
            model_version=row["model_version"],
            shap_summary=row.get("shap_summary"),
            created_at=row.get("created_at"),
            source="ml_ensemble",
        )
        for row in rows
    ]


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
