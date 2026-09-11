"""Machine learning service wrapping HomeCreditPredictor."""

from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Any, Dict, Optional

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)

_ml_service: Optional["MLService"] = None


class MLService:
    """Singleton wrapper around the Home Credit 10-fold LightGBM ensemble."""

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self.settings = settings or get_settings()
        self.predictor = None
        self.loaded = False
        self.models_count = 0
        self.error: Optional[str] = None

    def load(self) -> None:
        home_credit_root = (self.settings.model_dir.parent).resolve()
        root_str = str(home_credit_root)
        if root_str not in sys.path:
            sys.path.insert(0, root_str)

        # Align predict_model module paths with configured dirs before import/init
        import predict_model as pm

        pm.MODEL_DIR = str(self.settings.model_dir)
        pm.ARTIFACTS_DIR = str(self.settings.artifacts_dir)
        pm.FEATURE_FILE = str(Path(pm.ARTIFACTS_DIR) / "demo_features.pkl")
        pm.FEATURE_COLUMNS_FILE = str(Path(pm.ARTIFACTS_DIR) / "feature_columns.pkl")
        pm.FEATURE_MAP_FILE = str(Path(pm.ARTIFACTS_DIR) / "feature_name_map.json")
        pm.APPLICANTS_FILE = str(Path(pm.ARTIFACTS_DIR) / "demo_applicants.csv")

        # Reset module singleton so it reloads with our paths
        pm._predictor = None
        self.predictor = pm.get_predictor()
        self.models_count = len(self.predictor.models)
        self.loaded = True
        self.error = None
        logger.info(
            "MLService loaded %s LightGBM fold models (%s)",
            self.models_count,
            self.settings.model_version,
        )

    def predict_demo_applicant(
        self,
        applicant_id: int,
        explain: bool = False,
    ) -> Dict[str, Any]:
        if not self.loaded or self.predictor is None:
            raise RuntimeError("ML models are not loaded")

        raw = self.predictor.predict(int(applicant_id), explain=explain)
        return {
            "applicant_id": int(raw["SK_ID_CURR"]),
            "default_probability": float(raw["default_probability"]),
            "default_probability_percent": float(raw["default_probability_percent"]),
            "credit_score": int(raw["credit_score"]),
            "score_scale": raw.get("score_scale", "300-900"),
            "risk_band": raw["risk_level"],
            "model_version": self.settings.model_version,
            "shap_summary": raw.get("shap"),
            "source": "ml_ensemble",
        }

    def applicant_exists(self, applicant_id: int) -> bool:
        if not self.loaded or self.predictor is None:
            return False
        ids = self.predictor.applicants["SK_ID_CURR"].astype(int).values
        return int(applicant_id) in {int(x) for x in ids}


def get_ml_service() -> MLService:
    global _ml_service
    if _ml_service is None:
        _ml_service = MLService()
    return _ml_service


def set_ml_service(service: Optional[MLService]) -> None:
    global _ml_service
    _ml_service = service
