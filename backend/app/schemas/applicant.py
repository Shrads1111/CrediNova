"""Applicant request/response schemas."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ApplicantSummary(BaseModel):
    sk_id_curr: int
    amt_income_total: Optional[float] = None
    amt_credit: Optional[float] = None
    amt_annuity: Optional[float] = None
    amt_goods_price: Optional[float] = None
    days_birth: Optional[float] = None
    ext_source_1: Optional[float] = None
    ext_source_2: Optional[float] = None
    ext_source_3: Optional[float] = None
    credit_to_income_ratio: Optional[float] = None
    annuity_to_income_ratio: Optional[float] = None


class ApplicantListResponse(BaseModel):
    items: List[ApplicantSummary]
    limit: int
    offset: int
    count: int


class ApplicantDetailResponse(BaseModel):
    sk_id_curr: int
    data: Dict[str, Any] = Field(default_factory=dict)
