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
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Password policy
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_DIGIT: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True

    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_LOGIN_MAX_ATTEMPTS: int = 5
    RATE_LIMIT_LOGIN_WINDOW_SECONDS: int = 300  # 5 minutes

    # Cookie sessions (optional mode alongside JWT)
    COOKIE_SESSION_ENABLED: bool = True
    COOKIE_NAME: str = "stemed_session"
    COOKIE_DOMAIN: str | None = None  # Set for production (e.g., ".yourdomain.com")
    COOKIE_SECURE: bool = False  # Set True in production (requires HTTPS)
    COOKIE_SAMESITE: str = "lax"  # "lax", "strict", or "none"

    CORS_ORIGINS: str = "http://localhost:3000"
    # Optional: allow any LAN dev origin via regex (useful when IP changes)
    # Example: ^http://(localhost|192\\.168\\.\\d{1,3}\\.\\d{1,3}):3000$
    CORS_ORIGIN_REGEX: str | None = None

    REDIS_URL: str | None = None

    STORAGE_PROVIDER: str | None = None
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_S3_REGION: str | None = None
    AWS_S3_BUCKET: str | None = None

    # SMTP (optional for notifications)
    SMTP_HOST: str | None = None
    SMTP_PORT: int | None = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM: str | None = None
    SMTP_TO: str | None = None
    SMTP_TLS: bool = True

    # Google Sheets Integration (optional - for saving contact messages & newsletter)
    GOOGLE_SHEETS_CREDENTIALS_FILE: str | None = None
    GOOGLE_SHEETS_CONTACT_SHEET_ID: str | None = None
    GOOGLE_SHEETS_NEWSLETTER_SHEET_ID: str | None = None

    # Cloudflare R2 Storage Configuration
    R2_ACCOUNT_ID: str | None = None
    R2_ENDPOINT: str | None = None
    R2_ACCESS_KEY: str | None = None
    R2_SECRET_KEY: str | None = None
    R2_BUCKET_NAME: str | None = None
    R2_PUBLIC_URL: str | None = None
    STORAGE_MODE: str = "local"  # 'local' or 'r2'

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
