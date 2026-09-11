"""Prediction request/response schemas."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    applicant_id: int = Field(..., description="Demo applicant SK_ID_CURR")
    assessment_id: Optional[str] = None
    explain: bool = False


class ShapItem(BaseModel):
    feature: str
    impact: Optional[float] = None
    direction: Optional[str] = None
    error: Optional[str] = None


class PredictionResponse(BaseModel):
    id: Optional[str] = None
    assessment_id: Optional[str] = None
    applicant_id: int
    default_probability: float
    default_probability_percent: float
    credit_score: int
    score_scale: str = "300-900"
    risk_band: str
    model_version: str
    shap_summary: Optional[List[Dict[str, Any]]] = None
    created_at: Optional[str] = None
    source: str = "ml_ensemble"
