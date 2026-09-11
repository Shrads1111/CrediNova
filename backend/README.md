# CrediNova Backend

FastAPI service that connects the CrediNova React frontend to:

1. Supabase PostgreSQL (or offline CSV fallback)
2. The Home Credit 10-fold LightGBM ensemble (`HomeCreditProject/`)

## Architecture notes

- Frontend MSME form fields are **not** mapped onto the 658 engineered ML features.
- Phase 1 scoring uses demo applicants (`SK_ID_CURR`, e.g. `100001`) and pre-computed feature vectors.
- Model files stay on the backend. The Supabase service role key never ships to the browser.

## Quick start

```powershell
cd d:\CrediNova\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env with Supabase credentials when ready
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

Without valid Supabase credentials the API still runs in **offline mode**:
applicants are served from `HomeCreditProject/artifacts/demo_applicants.csv`,
and assessments/predictions are stored in memory.

## Environment

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only service role key |
| `CORS_ORIGINS` | Allowed frontend origins (JSON list) |
| `MODEL_DIR` | Path to `lightgbm_fold_*.txt` |
| `ARTIFACTS_DIR` | Path to `demo_features.pkl` + CSV |
| `MODEL_VERSION` | Default `lightgbm-homecredit-10fold-v1` |

## Database migration

Run `migrations/01_init_supabase.sql` in the Supabase SQL editor, then import demo rows:

```powershell
.\.venv\Scripts\python scripts\import_demo.py
# optional smoke import
.\.venv\Scripts\python scripts\import_demo.py --limit 100
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness + ML load status |
| `GET` | `/api/applicants` | Paginated demo applicants |
| `GET` | `/api/applicants/{id}` | Applicant detail |
| `POST` | `/api/assessments` | Store frontend assessment payload |
| `GET` | `/api/assessments/{id}` | Retrieve assessment (+ linked prediction) |
| `POST` | `/api/predict` | Run 10-fold ensemble for a demo applicant |

### Score formula

\[
odds = \frac{1-p}{p},\quad
score = \mathrm{round}\big(600 + 50\log_2(odds/4)\big)\ \in [300,900]
\]

Risk bands: Excellent (≥800), Good (≥750), Fair (≥700), Moderate (≥600), High Risk (<600).

## Curl examples

```powershell
curl http://127.0.0.1:8000/health
curl "http://127.0.0.1:8000/api/applicants?limit=5"
curl http://127.0.0.1:8000/api/applicants/100001
curl -X POST http://127.0.0.1:8000/api/predict `
  -H "Content-Type: application/json" `
  -d "{\"applicant_id\": 100001}"
```

## Tests

```powershell
cd d:\CrediNova\backend
.\.venv\Scripts\pytest -v tests/
```

First run loads ~213 MB of LightGBM models and may take 30–90 seconds.

## Frontend

Set `VITE_API_URL=http://127.0.0.1:8000` in `frontend/.env` (optional; this is the default).
