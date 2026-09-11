"""Application configuration loaded from environment variables."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND_ROOT.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    # Optional direct Postgres URL for migrations (Settings → Database → URI)
    database_url: str = ""
    supabase_db_password: str = ""

    port: int = 8000
    host: str = "0.0.0.0"
    environment: str = "development"

    cors_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ]
    )

    model_dir: Path = REPO_ROOT / "HomeCreditProject" / "models"
    artifacts_dir: Path = REPO_ROOT / "HomeCreditProject" / "artifacts"
    model_version: str = "lightgbm-homecredit-10fold-v1"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []
            if text.startswith("["):
                try:
                    return json.loads(text)
                except json.JSONDecodeError:
                    pass
            return [part.strip() for part in text.split(",") if part.strip()]
        return value

    @field_validator("model_dir", "artifacts_dir", mode="before")
    @classmethod
    def resolve_path(cls, value: object) -> Path:
        path = Path(str(value))
        if not path.is_absolute():
            path = (BACKEND_ROOT / path).resolve()
        return path

    @property
    def supabase_configured(self) -> bool:
        url = (self.supabase_url or "").strip()
        key = (self.supabase_service_role_key or "").strip()
        if not url or not key:
            return False
        placeholders = ("your-project", "your-supabase", "example.com", "changeme")
        lowered = f"{url} {key}".lower()
        return not any(token in lowered for token in placeholders)

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
