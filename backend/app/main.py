"""CrediNova FastAPI application entrypoint."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import get_settings
from app.database import init_database
from app.routes import applicants, assessment, health, prediction
from app.services.ml_service import set_ml_service, MLService

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("credinova")


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    logger.info("Starting CrediNova backend (%s)", settings.environment)

    db_mode = init_database(settings)
    logger.info("Database mode: %s", db_mode)

    ml = MLService(settings)
    try:
        ml.load()
        set_ml_service(ml)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to load ML models: %s", exc)
        ml.loaded = False
        ml.error = str(exc)
        set_ml_service(ml)

    yield

    logger.info("Shutting down CrediNova backend")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="CrediNova Backend",
        version="1.0.0",
        description=(
            "FastAPI bridge between the CrediNova React frontend, "
            "Supabase PostgreSQL, and the Home Credit LightGBM ensemble."
        ),
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(applicants.router)
    app.include_router(assessment.router)
    app.include_router(prediction.router)

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        _request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        detail = exc.detail
        if isinstance(detail, dict):
            payload = detail
        else:
            payload = {"detail": detail}
        return JSONResponse(status_code=exc.status_code, content=payload)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={"detail": "Validation error", "errors": exc.errors()},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        _request: Request, exc: Exception
    ) -> JSONResponse:
        logger.exception("Unhandled error: %s", exc)
        detail = "Internal server error"
        if not settings.is_production:
            detail = f"Internal server error: {exc}"
        return JSONResponse(status_code=500, content={"detail": detail})

    return app


app = create_app()
