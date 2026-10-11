"""
Apply 01_init_supabase.sql using a direct Postgres connection.

Requires one of:
  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.<ref>.supabase.co:5432/postgres
  SUPABASE_DB_PASSWORD=YOUR_PASSWORD   (uses db.<project-ref>.supabase.co)

Get the password from: Supabase Dashboard → Project Settings → Database → Database password
"""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import quote_plus

BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.config import get_settings  # noqa: E402


def build_database_url() -> str:
    settings = get_settings()
    if settings.database_url.strip():
        return settings.database_url.strip()

    password = settings.supabase_db_password.strip()
    if not password:
        raise RuntimeError(
            "Set DATABASE_URL or SUPABASE_DB_PASSWORD in backend/.env\n"
            "Find it in Supabase → Project Settings → Database → Database password"
        )

    if not settings.supabase_url:
        raise RuntimeError("SUPABASE_URL is required to build the DB connection string")

    ref = settings.supabase_url.split("//")[1].split(".")[0]
    # Direct connection host
    return (
        f"postgresql://postgres:{quote_plus(password)}"
        f"@db.{ref}.supabase.co:5432/postgres"
    )


def apply_migration() -> None:
    try:
        import psycopg
    except ImportError as exc:
        raise RuntimeError("Install psycopg: pip install 'psycopg[binary]'") from exc

    sql_path = BACKEND_ROOT / "migrations" / "01_init_supabase.sql"
    sql = sql_path.read_text(encoding="utf-8")
    db_url = build_database_url()

    print(f"Applying {sql_path.name} ...")
    with psycopg.connect(db_url, connect_timeout=30) as conn:
        conn.execute(sql)
        conn.commit()
    print("Migration applied successfully.")


if __name__ == "__main__":
    try:
        apply_migration()
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}")
        sys.exit(1)
