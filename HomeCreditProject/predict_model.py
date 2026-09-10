
"""
Fast inference for the trained Home Credit LightGBM ensemble.

This file DOES NOT retrain the model.
It loads the 10 saved fold models and uses the post-training
feature cache created by prepare_demo.py.
"""

import os
import json
import pickle
import glob

import numpy as np
import pandas as pd
import lightgbm as lgb


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_DIR = os.path.join(BASE_DIR, "models")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

FEATURE_FILE = os.path.join(
    ARTIFACTS_DIR,
    "demo_features.pkl"
)

FEATURE_COLUMNS_FILE = os.path.join(
    ARTIFACTS_DIR,
    "feature_columns.pkl"
)

FEATURE_MAP_FILE = os.path.join(
    ARTIFACTS_DIR,
    "feature_name_map.json"
)

APPLICANTS_FILE = os.path.join(
    ARTIFACTS_DIR,
    "demo_applicants.csv"
)


# ============================================================
# CREDIT SCORE
# ============================================================

def credit_score(default_probability: float) -> int:
    """
    Convert model default probability into a project credit score.

    Score:
        300 = highest risk
        900 = lowest risk

    IMPORTANT:
    This is a project-defined score based on the ML model.
    It is NOT an official CIBIL/Experian score.
    """

    p = float(
        np.clip(
            default_probability,
            0.000001,
            0.999999
        )
    )

    # Probability -> odds
    odds = (1.0 - p) / p

    # Odds-based score conversion
    score = 600.0 + 50.0 * np.log2(
        odds / 4.0
    )

    # Keep score inside 300-900
    score = np.clip(
        round(score),
        300,
        900
    )

    return int(score)


# ============================================================
# RISK LEVEL
# ============================================================

def risk_band(score: int) -> str:

    if score >= 800:
        return "Excellent"

    if score >= 750:
        return "Good"

    if score >= 700:
        return "Fair"

    if score >= 600:
        return "Moderate"

    return "High Risk"


# ============================================================
# MAIN PREDICTOR
# ============================================================

class HomeCreditPredictor:

    def __init__(self):

        # ----------------------------------------------------
        # Check required files
        # ----------------------------------------------------

        required = [
            FEATURE_FILE,
            FEATURE_COLUMNS_FILE,
            FEATURE_MAP_FILE,
            APPLICANTS_FILE
        ]

        missing = [
            path
            for path in required
            if not os.path.exists(path)
        ]

        if missing:

            raise FileNotFoundError(
                "Missing demo artifacts.\n"
                "Run: python prepare_demo.py\n\n"
                "Missing:\n"
                + "\n".join(missing)
            )

        # ----------------------------------------------------
        # Load feature matrix
        # ----------------------------------------------------

        with open(
            FEATURE_FILE,
            "rb"
        ) as f:

            self.X = pickle.load(f)

        # ----------------------------------------------------
        # Load feature column names
        # ----------------------------------------------------

        with open(
            FEATURE_COLUMNS_FILE,
            "rb"
        ) as f:

            self.feature_columns = pickle.load(f)

        # ----------------------------------------------------
        # Load feature name mapping
        # ----------------------------------------------------

        with open(
            FEATURE_MAP_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            self.feature_map = json.load(f)

        # ----------------------------------------------------
        # Load applicant IDs
        # ----------------------------------------------------

        self.applicants = pd.read_csv(
            APPLICANTS_FILE
        )

        # ----------------------------------------------------
        # Load all 10 LightGBM models
        # ----------------------------------------------------

        model_paths = sorted(
            glob.glob(
                os.path.join(
                    MODEL_DIR,
                    "lightgbm_fold_*.txt"
                )
            )
        )

        if len(model_paths) != 10:

            raise FileNotFoundError(
                f"Expected 10 saved fold models "
                f"in {MODEL_DIR}, "
                f"found {len(model_paths)}."
            )

        self.models = [
            lgb.Booster(
                model_file=path
            )
            for path in model_paths
        ]

        # ----------------------------------------------------
        # Safety check
        # ----------------------------------------------------

        model_features = (
            self.models[0].num_feature()
        )

        if model_features != len(
            self.feature_columns
        ):

            raise ValueError(
                f"Feature mismatch: "
                f"model expects {model_features}, "
                f"cache has {len(self.feature_columns)}."
            )

    # ========================================================
    # GET APPLICANT ROW
    # ========================================================

    def _row(
        self,
        applicant_id: int
    ) -> pd.DataFrame:

        applicant_id = int(
            applicant_id
        )

        ids = (
            self.applicants[
                "SK_ID_CURR"
            ]
            .astype(int)
            .values
        )

        matches = np.where(
            ids == applicant_id
        )[0]

        if len(matches) == 0:

            raise ValueError(
                f"SK_ID_CURR {applicant_id} "
                "was not found in the demo "
                "applicant cache."
            )

        row = self.X.iloc[
            [matches[0]]
        ][
            self.feature_columns
        ].copy()

        return row

    # ========================================================
    # PREDICTION
    # ========================================================

    def predict(
        self,
        applicant_id: int,
        explain: bool = False
    ) -> dict:

        # Get applicant features
        X_row = self._row(
            applicant_id
        )

        # ----------------------------------------------------
        # LightGBM predictions from all 10 folds
        # ----------------------------------------------------

        predictions = []

        for model in self.models:

            prediction = model.predict(
                X_row
            )[0]

            predictions.append(
                float(prediction)
            )

        # Average the 10 model predictions
        probability = float(
            np.mean(predictions)
        )

        # ----------------------------------------------------
        # Convert probability to score
        # ----------------------------------------------------

        score = credit_score(
            probability
        )

        # ----------------------------------------------------
        # Determine risk
        # ----------------------------------------------------

        risk = risk_band(
            score
        )

        # ----------------------------------------------------
        # API response
        # ----------------------------------------------------

        result = {

            "SK_ID_CURR": int(
                applicant_id
            ),

            "default_probability": round(
                probability,
                6
            ),

            "default_probability_percent": round(
                probability * 100,
                2
            ),

            # THIS IS THE ACTUAL SCORE
            "credit_score": score,

            # Only tells frontend the scale
            "score_scale": "300-900",

            "risk_level": risk
        }

        # ----------------------------------------------------
        # Optional SHAP explanation
        # ----------------------------------------------------

        if explain:

            result["shap"] = self.explain(
                applicant_id
            )

        return result

    # ========================================================
    # SHAP EXPLANATION
    # ========================================================

    def explain(
        self,
        applicant_id: int,
        top_n: int = 8
    ) -> list:

        try:

            import shap

        except ImportError:

            return [
                {
                    "feature": "SHAP",
                    "error":
                        "Install SHAP with: "
                        "python -m pip install shap"
                }
            ]

        # ----------------------------------------------------
        # Get applicant row
        # ----------------------------------------------------

        X_row = self._row(
            applicant_id
        )

        # ----------------------------------------------------
        # IMPORTANT:
        # Convert every feature to float64.
        # This fixes the LightGBM/SHAP int64 error.
        # ----------------------------------------------------

        X_row = X_row.astype(
            np.float64
        )

        # Replace infinity values
        X_row = X_row.replace(
            [np.inf, -np.inf],
            np.nan
        )

        # ----------------------------------------------------
        # Store SHAP values
        # ----------------------------------------------------

        total = np.zeros(
            len(self.feature_columns),
            dtype=float
        )

        # ----------------------------------------------------
        # Explain using all 10 models
        # ----------------------------------------------------

        for model in self.models:

            explainer = (
                shap.TreeExplainer(
                    model
                )
            )

            values = (
                explainer.shap_values(
                    X_row
                )
            )

            # SHAP versions may return
            # either a list or ndarray.

            if isinstance(
                values,
                list
            ):

                values = values[1]

            values = np.asarray(
                values
            )

            # Handle possible 3D output
            if values.ndim == 3:

                values = values[
                    :,
                    :,
                    1
                ]

            total += values[0]

        # Average across 10 models
        total /= len(
            self.models
        )

        # ----------------------------------------------------
        # Select strongest features
        # ----------------------------------------------------

        order = np.argsort(
            np.abs(total)
        )[::-1][:top_n]

        output = []

        for idx in order:

            safe_name = (
                self.feature_columns[idx]
            )

            impact = float(
                total[idx]
            )

            readable_name = (
                self.feature_map.get(
                    safe_name,
                    safe_name
                )
            )

            output.append(
                {
                    "feature":
                        readable_name,

                    "impact":
                        round(
                            impact,
                            6
                        ),

                    "direction":
                        (
                            "increases default risk"
                            if impact > 0
                            else
                            "reduces default risk"
                        )
                }
            )

        return output


# ============================================================
# SINGLETON PREDICTOR
# ============================================================

_predictor = None


def get_predictor():

    global _predictor

    if _predictor is None:

        _predictor = (
            HomeCreditPredictor()
        )

    return _predictor


# ============================================================
# DIRECT TEST
# ============================================================

if __name__ == "__main__":

    predictor = get_predictor()

    # First applicant in demo cache
    sample_id = int(
        predictor.applicants.iloc[0][
            "SK_ID_CURR"
        ]
    )

    # Test prediction
    result = predictor.predict(
        sample_id,
        explain=False
    )

    print("\nPrediction Result:")
    print(result)

    print("\nActual Credit Score:")
    print(result["credit_score"])

    print("\nRisk Level:")
    print(result["risk_level"])
