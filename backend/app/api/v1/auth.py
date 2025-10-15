from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token
from app.core.config import settings
from app.core.rate_limit import rate_limiter
from app.core.cookie_session import (
    set_session_cookie,
    set_refresh_cookie,
    clear_session_cookie,
    clear_refresh_cookie,
    generate_csrf_token,
    set_csrf_cookie,
    validate_csrf,
)
from app.db.session import get_session
from app.services.users import authenticate_user
from app.schemas.token import Token, RefreshRequest, LogoutRequest
from app.services.refresh_tokens import (
    generate_refresh_token_value,
    create_refresh_token,
    get_refresh_token,
    is_refresh_token_active,
    rotate_refresh_token,
    revoke_refresh_token,
)
from app.services.users import get_user_by_email


router = APIRouter(prefix="/auth", tags=["auth"]) 


INVALID_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect email or password",
    headers={"WWW-Authenticate": "Bearer"},
)


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session),
):
    # Rate limiting check
    ip = request.client.host if request.client else "unknown"
    rate_key = f"login:{ip}"
    
    is_limited, remaining = await rate_limiter.is_rate_limited(
        rate_key,
        settings.RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
        settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS
    )
    
    if is_limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Please try again later.",
            headers={"Retry-After": str(settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS)}
        )
    
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise INVALID_CREDENTIALS
    
    # Successful login - optionally reset rate limit
    # await rate_limiter.reset(rate_key)  # Uncomment to reset on success
    
    access_token = create_access_token(subject=user.email)
    refresh_raw = generate_refresh_token_value()
    ua = request.headers.get("user-agent")
    await create_refresh_token(db, user, refresh_raw, ua, ip)
    
    # Optional: Set cookies if cookie session mode is enabled
    if settings.COOKIE_SESSION_ENABLED:
        set_session_cookie(response, access_token)
        set_refresh_cookie(response, refresh_raw)
        # Generate and set CSRF token for cookie-based sessions
        csrf = generate_csrf_token()
        set_csrf_cookie(response, csrf)
    
    return Token(access_token=access_token, refresh_token=refresh_raw)


@router.post("/refresh", response_model=Token, dependencies=[Depends(validate_csrf)])
async def refresh(request: Request, payload: RefreshRequest, db: AsyncSession = Depends(get_session)):
    token = payload.token
    # In cookie session mode, allow refresh token to be read from httpOnly cookie
    if settings.COOKIE_SESSION_ENABLED and (not token or token == "cookie"):
        token = request.cookies.get(f"{settings.COOKIE_NAME}_refresh")
    stored = await get_refresh_token(db, token)
    if not stored or not is_refresh_token_active(stored):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    # load user
    user = await get_user_by_email(db, stored.user.email)  # type: ignore
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    new_access = create_access_token(subject=user.email)
    new_refresh_raw, _ = await rotate_refresh_token(
        db,
        token,
        user,
        request.headers.get("user-agent"),
        request.client.host if request.client else None,
    )
    return Token(access_token=new_access, refresh_token=new_refresh_raw)


@router.post("/logout", dependencies=[Depends(validate_csrf)])
async def logout(request: Request, response: Response, payload: LogoutRequest, db: AsyncSession = Depends(get_session)):
    token = payload.token
    if settings.COOKIE_SESSION_ENABLED and not token:
        token = request.cookies.get(f"{settings.COOKIE_NAME}_refresh")
    if token:
        await revoke_refresh_token(db, token)
    
    # Clear cookies if cookie session mode is enabled
    if settings.COOKIE_SESSION_ENABLED:
        clear_session_cookie(response)
        clear_refresh_cookie(response)
    
    return {"status": "ok"}
