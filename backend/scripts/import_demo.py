"""
Import HomeCreditProject/artifacts/demo_applicants.csv into Supabase.

Usage:
  cd backend
  .venv\\Scripts\\python scripts/import_demo.py
  .venv\\Scripts\\python scripts/import_demo.py --chunk-size 500 --limit 1000
"""

from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.config import get_settings  # noqa: E402


def _normalize_columns(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    frame.columns = [str(c).strip().lower() for c in frame.columns]
    return frame


def _row_to_record(row: pd.Series) -> Dict[str, Any]:
    record: Dict[str, Any] = {}
    for key, value in row.items():
        if pd.isna(value):
            record[str(key)] = None
        elif isinstance(value, (int, float)) and not isinstance(value, bool):
            if isinstance(value, float) and value.is_integer():
                record[str(key)] = int(value)
            else:
                record[str(key)] = float(value) if isinstance(value, float) else int(value)
        else:
            record[str(key)] = value
    return record


def import_demo(chunk_size: int = 500, limit: int | None = None) -> int:
    settings = get_settings()
    if not settings.supabase_configured:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and "
            "SUPABASE_SERVICE_ROLE_KEY in backend/.env first."
        )

    from supabase import create_client

    csv_path = settings.artifacts_dir / "demo_applicants.csv"
    if not csv_path.exists():
        raise FileNotFoundError(f"Missing CSV: {csv_path}")

    print(f"Reading {csv_path} ...")
    frame = _normalize_columns(pd.read_csv(csv_path))
    if limit is not None:
        frame = frame.head(limit)

    client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    total = len(frame)
    chunks = math.ceil(total / chunk_size) if total else 0
    inserted = 0

    print(f"Importing {total} rows in {chunks} chunk(s) of {chunk_size}...")
    for i in range(0, total, chunk_size):
        batch = frame.iloc[i : i + chunk_size]
        records: List[Dict[str, Any]] = [_row_to_record(row) for _, row in batch.iterrows()]
        client.table("demo_applicants").upsert(records, on_conflict="sk_id_curr").execute()
        inserted += len(records)
        print(f"  upserted {inserted}/{total}")

    print(f"Done. Imported {inserted} applicants.")
    return inserted


def main() -> None:
    parser = argparse.ArgumentParser(description="Import demo applicants into Supabase")
    parser.add_argument("--chunk-size", type=int, default=500)
    parser.add_argument("--limit", type=int, default=None, help="Optional row cap for smoke tests")
    args = parser.parse_args()
    import_demo(chunk_size=args.chunk_size, limit=args.limit)


if __name__ == "__main__":
    main()
