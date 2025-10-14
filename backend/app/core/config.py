from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "STEM-ED-ARCHITECTS API"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_PORT: int = 8000
    APP_HOST: str = "0.0.0.0"

    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"

    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"

    CORS_ORIGINS: str = "http://localhost:3000"

    REDIS_URL: str | None = None

    STORAGE_PROVIDER: str | None = None
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_S3_REGION: str | None = None
    AWS_S3_BUCKET: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()

def get_cors_origins() -> list[str]:
    raw = settings.CORS_ORIGINS.strip()
    if not raw:
        return []
    if raw.startswith("["):
        # JSON-like list
        cleaned = raw.strip("[] ")
        parts = [p.strip().strip('"\'') for p in cleaned.split(',') if p.strip()]
        return parts
    return [o.strip() for o in raw.split(",") if o.strip()]
