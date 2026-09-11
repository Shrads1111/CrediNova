"""Assessment request/response schemas."""

from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class AssessmentRequest(BaseModel):
    customer_id: Optional[str] = None
    applicant_id: Optional[int] = Field(
        default=None,
        description="Optional linked Home Credit demo applicant (SK_ID_CURR).",
    )
    personal_data: Dict[str, Any]
    financial_data: Dict[str, Any]
    transaction_data: Dict[str, Any]
    payment_data: Dict[str, Any]
    dti: Optional[float] = None
    status: str = "completed"


class AssessmentResponse(BaseModel):
    id: str
    customer_id: Optional[str] = None
    applicant_id: Optional[int] = None
    personal_data: Dict[str, Any]
    financial_data: Dict[str, Any]
    transaction_data: Dict[str, Any]
    payment_data: Dict[str, Any]
    dti: Optional[float] = None
    status: str = "completed"
    created_at: Optional[str] = None
    prediction: Optional[Dict[str, Any]] = None
