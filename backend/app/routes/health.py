"""Health check endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from app.database import get_db_mode, get_db_mode_detail
from app.services.ml_service import get_ml_service

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    ml = get_ml_service()
    return {
        "status": "ok",
        "service": "credinova-backend",
        "ml_loaded": bool(ml.loaded),
        "models_count": int(ml.models_count),
        "db_mode": get_db_mode(),
        "db_detail": get_db_mode_detail(),
        "model_version": ml.settings.model_version if ml.loaded else None,
    }
