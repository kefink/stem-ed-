"""
Cookie Session Helpers

Provides optional httpOnly cookie-based session support alongside JWT tokens.
Useful for:
- SSR (server-side rendering) scenarios
- Tighter security (cookies not accessible to JavaScript)
- Cross-subdomain authentication

CSRF Protection Notes:
- When using cookies, implement CSRF token validation for state-changing operations
- Exclude CSRF checks for GET/HEAD/OPTIONS
- Double-submit cookie pattern or synchronizer token pattern recommended
- See: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
"""

from fastapi import Response
from app.core.config import settings


def set_session_cookie(response: Response, token: str, max_age: int | None = None):
    """
    Set httpOnly session cookie with security flags.
    
    Args:
        response: FastAPI Response object
        token: Session token (JWT or session ID)
        max_age: Cookie lifetime in seconds (None = session cookie)
    """
    if not settings.COOKIE_SESSION_ENABLED:
        return
    
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        max_age=max_age or settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,  # Not accessible via JavaScript (XSS protection)
        secure=settings.COOKIE_SECURE,  # Only sent over HTTPS (production)
        samesite=settings.COOKIE_SAMESITE,  # CSRF protection
        domain=settings.COOKIE_DOMAIN,  # Cross-subdomain if needed
        path="/",
    )


def clear_session_cookie(response: Response):
    """Remove session cookie (for logout)."""
    if not settings.COOKIE_SESSION_ENABLED:
        return
    
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )


def set_refresh_cookie(response: Response, token: str):
    """
    Set httpOnly refresh token cookie (longer-lived).
    
    Separate from access token cookie for better security.
    """
    if not settings.COOKIE_SESSION_ENABLED:
        return
    
    response.set_cookie(
        key=f"{settings.COOKIE_NAME}_refresh",
        value=token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        path="/api/v1/auth/refresh",  # Restrict to refresh endpoint
    )


def clear_refresh_cookie(response: Response):
    """Remove refresh token cookie."""
    if not settings.COOKIE_SESSION_ENABLED:
        return
    
    response.delete_cookie(
        key=f"{settings.COOKIE_NAME}_refresh",
        domain=settings.COOKIE_DOMAIN,
        path="/api/v1/auth/refresh",
    )


# CSRF Token Generation (simple example - enhance for production)
import secrets

def generate_csrf_token() -> str:
    """Generate a random CSRF token."""
    return secrets.token_urlsafe(32)


def set_csrf_cookie(response: Response, token: str):
    """
    Set CSRF token cookie (readable by JavaScript for inclusion in requests).
    
    Double-submit cookie pattern: 
    - Cookie holds token (secure, httpOnly=False so JS can read)
    - Client sends same token in header (X-CSRF-Token)
    - Server verifies they match
    """
    if not settings.COOKIE_SESSION_ENABLED:
        return
    
    response.set_cookie(
        key="csrf_token",
        value=token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=False,  # JS needs to read this
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )


# Example CSRF validation dependency (use in routes if cookie mode enabled)
from fastapi import Header, HTTPException, status, Cookie

async def validate_csrf(
    csrf_token: str | None = Header(None, alias="X-CSRF-Token"),
    csrf_cookie: str | None = Cookie(None, alias="csrf_token")
):
    """
    Validate CSRF token (double-submit pattern).
    
    Use as dependency on state-changing endpoints when cookie sessions are enabled.
    """
    if not settings.COOKIE_SESSION_ENABLED:
        return  # Skip if not using cookies
    
    if not csrf_token or not csrf_cookie or csrf_token != csrf_cookie:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token validation failed"
        )
