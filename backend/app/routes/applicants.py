"""Demo applicant endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app import database as db
from app.schemas.applicant import (
    ApplicantDetailResponse,
    ApplicantListResponse,
    ApplicantSummary,
)

router = APIRouter(prefix="/api/applicants", tags=["applicants"])


@router.get("", response_model=ApplicantListResponse)
def list_applicants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> ApplicantListResponse:
    rows = db.list_applicants(limit=limit, offset=offset)
    items = [ApplicantSummary(**row) for row in rows]
    return ApplicantListResponse(
        items=items,
        limit=limit,
        offset=offset,
        count=len(items),
    )


@router.get("/{applicant_id}", response_model=ApplicantDetailResponse)
def get_applicant(applicant_id: int) -> ApplicantDetailResponse:
    row = db.get_applicant(applicant_id)
    if row is None:
        raise HTTPException(status_code=404, detail=f"Applicant {applicant_id} not found")
    return ApplicantDetailResponse(sk_id_curr=int(row["sk_id_curr"]), data=row)
