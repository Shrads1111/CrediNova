"""Assessment ingestion endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app import database as db
from app.schemas.assessment import AssessmentRequest, AssessmentResponse

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.post("", response_model=AssessmentResponse, status_code=201)
def create_assessment(body: AssessmentRequest) -> AssessmentResponse:
    if body.applicant_id is not None:
        applicant = db.get_applicant(body.applicant_id)
        if applicant is None:
            raise HTTPException(
                status_code=404,
                detail=f"Applicant {body.applicant_id} not found",
            )

    record = db.create_assessment(body.model_dump())
    return AssessmentResponse(**record)


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: str) -> AssessmentResponse:
    record = db.get_assessment(assessment_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return AssessmentResponse(**record)
