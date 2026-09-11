"""Supabase client factory with offline CSV/in-memory fallback."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import pandas as pd

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)

_client = None
_offline_applicants: Optional[pd.DataFrame] = None
_offline_assessments: Dict[str, Dict[str, Any]] = {}
_offline_predictions: Dict[str, Dict[str, Any]] = {}
_mode: str = "uninitialized"
_mode_detail: str = ""


def get_db_mode() -> str:
    return _mode


def get_db_mode_detail() -> str:
    return _mode_detail


def is_offline() -> bool:
    return _mode == "offline"


def init_database(settings: Optional[Settings] = None) -> str:
    """Initialize Supabase or fall back to local CSV/memory stores."""
    global _client, _offline_applicants, _mode, _mode_detail

    settings = settings or get_settings()

    if settings.supabase_configured:
        try:
            from supabase import create_client

            _client = create_client(
                settings.supabase_url,
                settings.supabase_service_role_key,
            )
            # Lightweight connectivity probe
            _client.table("demo_applicants").select("sk_id_curr").limit(1).execute()
            _mode = "supabase"
            _mode_detail = "connected"
            logger.info("Supabase client connected")
            return _mode
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            if "Could not find the table" in msg or "PGRST205" in msg:
                _mode_detail = (
                    "Supabase credentials OK but tables missing. "
                    "Run migrations/01_init_supabase.sql in the Supabase SQL Editor, "
                    "then: python scripts/import_demo.py"
                )
            else:
                _mode_detail = f"Supabase probe failed: {msg[:240]}"
            logger.warning("%s; using offline mode", _mode_detail)
    else:
        _mode_detail = "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured"

    csv_path = settings.artifacts_dir / "demo_applicants.csv"
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Offline mode requires demo applicants CSV at {csv_path}"
        )

    _offline_applicants = pd.read_csv(csv_path)
    _offline_applicants.columns = [
        str(c).strip().lower() for c in _offline_applicants.columns
    ]
    _client = None
    _mode = "offline"
    logger.info(
        "Offline DB mode active (%s applicants from CSV)",
        len(_offline_applicants),
    )
    return _mode


def get_supabase():
    if _client is None:
        raise RuntimeError("Supabase client is not available (offline mode)")
    return _client


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def list_applicants(limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    limit = max(1, min(limit, 100))
    offset = max(0, offset)

    summary_cols = [
        "sk_id_curr",
        "amt_income_total",
        "amt_credit",
        "amt_annuity",
        "amt_goods_price",
        "days_birth",
        "ext_source_1",
        "ext_source_2",
        "ext_source_3",
        "credit_to_income_ratio",
        "annuity_to_income_ratio",
    ]

    if is_offline():
        assert _offline_applicants is not None
        frame = _offline_applicants.iloc[offset : offset + limit]
        rows: List[Dict[str, Any]] = []
        for _, row in frame.iterrows():
            item = {}
            for col in summary_cols:
                if col in row.index:
                    val = row[col]
                    item[col] = None if pd.isna(val) else (
                        int(val) if col == "sk_id_curr" else float(val)
                        if isinstance(val, (int, float)) else val
                    )
            rows.append(item)
        return rows

    select_cols = ",".join(summary_cols)
    response = (
        get_supabase()
        .table("demo_applicants")
        .select(select_cols)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return response.data or []


def get_applicant(applicant_id: int) -> Optional[Dict[str, Any]]:
    if is_offline():
        assert _offline_applicants is not None
        matches = _offline_applicants[
            _offline_applicants["sk_id_curr"].astype(int) == int(applicant_id)
        ]
        if matches.empty:
            return None
        row = matches.iloc[0].where(pd.notnull(matches.iloc[0]), None).to_dict()
        row["sk_id_curr"] = int(row["sk_id_curr"])
        return row

    response = (
        get_supabase()
        .table("demo_applicants")
        .select("*")
        .eq("sk_id_curr", int(applicant_id))
        .limit(1)
        .execute()
    )
    data = response.data or []
    return data[0] if data else None


def create_assessment(payload: Dict[str, Any]) -> Dict[str, Any]:
    record = {
        "customer_id": payload.get("customer_id"),
        "applicant_id": payload.get("applicant_id"),
        "personal_data": payload["personal_data"],
        "financial_data": payload["financial_data"],
        "transaction_data": payload["transaction_data"],
        "payment_data": payload["payment_data"],
        "dti": payload.get("dti"),
        "status": payload.get("status", "completed"),
    }

    if is_offline():
        assessment_id = str(uuid.uuid4())
        stored = {
            "id": assessment_id,
            **record,
            "created_at": _now_iso(),
        }
        _offline_assessments[assessment_id] = stored
        return stored

    response = get_supabase().table("assessments").insert(record).execute()
    data = response.data or []
    if not data:
        raise RuntimeError("Failed to create assessment in Supabase")
    return data[0]


def get_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    if is_offline():
        assessment = _offline_assessments.get(assessment_id)
        if not assessment:
            return None
        linked = [
            pred
            for pred in _offline_predictions.values()
            if pred.get("assessment_id") == assessment_id
        ]
        result = dict(assessment)
        result["prediction"] = linked[-1] if linked else None
        return result

    response = (
        get_supabase()
        .table("assessments")
        .select("*")
        .eq("id", assessment_id)
        .limit(1)
        .execute()
    )
    data = response.data or []
    if not data:
        return None

    assessment = data[0]
    pred_response = (
        get_supabase()
        .table("predictions")
        .select("*")
        .eq("assessment_id", assessment_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    preds = pred_response.data or []
    assessment["prediction"] = preds[0] if preds else None
    return assessment


def create_prediction(payload: Dict[str, Any]) -> Dict[str, Any]:
    record = {
        "assessment_id": payload.get("assessment_id"),
        "applicant_id": int(payload["applicant_id"]),
        "default_probability": float(payload["default_probability"]),
        "default_probability_percent": float(payload["default_probability_percent"]),
        "credit_score": int(payload["credit_score"]),
        "score_scale": payload.get("score_scale", "300-900"),
        "risk_band": payload["risk_band"],
        "model_version": payload["model_version"],
        "shap_summary": payload.get("shap_summary"),
    }

    if is_offline():
        prediction_id = str(uuid.uuid4())
        stored = {
            "id": prediction_id,
            **record,
            "created_at": _now_iso(),
        }
        _offline_predictions[prediction_id] = stored
        return stored

    response = get_supabase().table("predictions").insert(record).execute()
    data = response.data or []
    if not data:
        raise RuntimeError("Failed to create prediction in Supabase")
    return data[0]


def reset_offline_stores() -> None:
    """Test helper — clear in-memory assessment/prediction stores."""
    _offline_assessments.clear()
    _offline_predictions.clear()
