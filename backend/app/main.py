from fastapi import FastAPI

from app.core.config import settings
from app.core.cors import setup_cors
from app.core.logging import logger
from app.api.router import api_router


def create_application() -> FastAPI:
    """
    FastAPI Application Factory.
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Configure CORS middleware
    setup_cors(app)

    # Mount API routes
    app.include_router(api_router)

    @app.on_event("startup")
    async def startup_event():
        logger.info("%s v%s starting up...", settings.PROJECT_NAME, settings.VERSION)

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("%s shutting down...", settings.PROJECT_NAME)

    return app


app = create_application()
