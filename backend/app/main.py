from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings, get_cors_origins
from .api.v1.routes import api_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])  # simple health check
def health():
    return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")
