from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from jose import JWTError

from app.core.security import create_access_token, decode_token
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
from app.schemas.two_factor import TwoFactorChallengeResponse, TwoFactorVerifyRequest
from app.services.refresh_tokens import (
    generate_refresh_token_value,
    create_refresh_token,
    get_refresh_token,
    is_refresh_token_active,
    rotate_refresh_token,
    revoke_refresh_token,
)
from app.services.users import get_user_by_email
from app.models.user import User
from app.services.email_verification import verify_email_token, resend_verification_email
from app.schemas.verification import (
    VerifyEmailRequest,
    VerifyEmailResponse,
    ResendVerificationRequest,
    ResendVerificationResponse
)
from app.services.password_reset import (
    create_reset_token,
    send_reset_email,
    verify_reset_token,
    reset_password as reset_user_password
)
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse
)
from app.core.password_policy import validate_password, PasswordValidationError
from app.services.account_lockout import (
    is_account_locked,
    record_failed_attempt,
    record_successful_login
)
from app.services.two_factor import (
    get_backup_codes_remaining,
    verify_totp_code,
    verify_and_consume_backup_code,
    update_backup_code_hashes,
    mark_two_factor_verified,
)


router = APIRouter(prefix="/auth", tags=["auth"]) 


INVALID_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect email or password",
    headers={"WWW-Authenticate": "Bearer"},
)


# Google OAuth models
class GoogleLoginRequest(BaseModel):
    email: EmailStr
    full_name: str
    google_id: str


class GoogleLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=Token | TwoFactorChallengeResponse)
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
    
    # First, check if user exists (we need the user object for lockout check)
    user = await get_user_by_email(db, form_data.username)
    
    # If user doesn't exist, return generic error (prevent email enumeration)
    if not user:
        raise INVALID_CREDENTIALS
    
    # Check if account is locked
    is_locked, locked_until = await is_account_locked(db, user)
    if is_locked:
        if locked_until:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Account is locked due to multiple failed login attempts. Try again after {locked_until.strftime('%Y-%m-%d %H:%M:%S UTC')}",
            )
        else:
            # Permanently locked by admin
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Account is locked. Please contact support.",
            )
    
    # Authenticate user (check password)
    authenticated_user = await authenticate_user(db, form_data.username, form_data.password)
    
    if not authenticated_user:
        # Record failed attempt
        ua = request.headers.get("user-agent")
        was_locked = await record_failed_attempt(db, user, ip_address=ip, user_agent=ua)
        
        if was_locked:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Account is now locked due to {user.failed_login_attempts} failed login attempts. Try again in 15 minutes.",
            )
        
        # Show remaining attempts
        remaining_attempts = 5 - user.failed_login_attempts
        if remaining_attempts > 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Incorrect email or password. {remaining_attempts} attempts remaining before account lockout.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            raise INVALID_CREDENTIALS
    
    # Check if email is verified
    if not authenticated_user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your email for verification link."
        )

    ua = request.headers.get("user-agent")

    if authenticated_user.two_factor_enabled:
        claims = {
            "scope": "two_factor_challenge",
            "challenge_id": str(uuid4()),
            "ip": ip,
            "ua": ua or "",
        }
        challenge_token = create_access_token(
            subject=authenticated_user.email,
            expires_minutes=5,
            additional_claims=claims,
        )
        response.status_code = status.HTTP_202_ACCEPTED
        return TwoFactorChallengeResponse(
            challenge_token=challenge_token,
            backup_codes_remaining=get_backup_codes_remaining(authenticated_user),
            message="Two-factor authentication required to complete login.",
            expires_in_seconds=300,
        )

    # Successful login - record it and clear failed attempts
    await record_successful_login(db, authenticated_user, ip_address=ip, user_agent=ua)
    await rate_limiter.reset(rate_key)

    access_token = create_access_token(
        subject=authenticated_user.email,
        additional_claims={"scope": "access"},
    )
    refresh_raw = generate_refresh_token_value()
    await create_refresh_token(db, authenticated_user, refresh_raw, ua, ip)
    
    # Optional: Set cookies if cookie session mode is enabled
    if settings.COOKIE_SESSION_ENABLED:
        set_session_cookie(response, access_token)
        set_refresh_cookie(response, refresh_raw)
        # Generate and set CSRF token for cookie-based sessions
        csrf = generate_csrf_token()
        set_csrf_cookie(response, csrf)
    
    return Token(access_token=access_token, refresh_token=refresh_raw)


@router.post("/login/two-factor", response_model=Token)
async def verify_two_factor_login(
    request: Request,
    response: Response,
    payload: TwoFactorVerifyRequest,
    db: AsyncSession = Depends(get_session),
):
    ip = request.client.host if request.client else "unknown"
    tf_rate_key = f"twofactor:{ip}"

    is_limited, _ = await rate_limiter.is_rate_limited(
        tf_rate_key,
        settings.RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
        settings.RATE_LIMIT_LOGIN_WINDOW_SECONDS,
    )
    if is_limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many verification attempts. Please try again later.",
        )

    try:
        decoded = decode_token(payload.challenge_token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired challenge token")

    if decoded.get("scope") != "two_factor_challenge":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid challenge token")

    email = decoded.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid challenge token")

    challenge_ip = decoded.get("ip")
    if challenge_ip and challenge_ip != ip:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Challenge token does not match this device")

    user = await get_user_by_email(db, email)
    if not user or not user.two_factor_enabled:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Two-factor authentication is not enabled for this account")

    method = payload.method
    verified = False

    if method == "backup_code":
        consumed, remaining_hashes = verify_and_consume_backup_code(user, payload.code)
        if consumed:
            await update_backup_code_hashes(db, user, remaining_hashes)
            verified = True
    else:
        verified = verify_totp_code(user, payload.code)

    if not verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")

    ua_claim = decoded.get("ua") or request.headers.get("user-agent")
    final_ip = challenge_ip or ip

    await record_successful_login(db, user, ip_address=final_ip, user_agent=ua_claim)
    await mark_two_factor_verified(db, user)
    await rate_limiter.reset(tf_rate_key)
    await rate_limiter.reset(f"login:{final_ip}")

    access_token = create_access_token(
        subject=user.email,
        additional_claims={"scope": "access"},
    )
    refresh_raw = generate_refresh_token_value()
    await create_refresh_token(db, user, refresh_raw, ua_claim, final_ip)

    if settings.COOKIE_SESSION_ENABLED:
        set_session_cookie(response, access_token)
        set_refresh_cookie(response, refresh_raw)
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
    new_access = create_access_token(
        subject=user.email,
        additional_claims={"scope": "access"},
    )
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


@router.post("/google-login", response_model=GoogleLoginResponse)
async def google_login(
    request: Request,
    response: Response,
    payload: GoogleLoginRequest,
    db: AsyncSession = Depends(get_session),
):
    """
    Handle Google OAuth login/registration.
    If user exists, return tokens. If not, create user and return tokens.
    """
    try:
        # Check if user exists by email
        result = await db.execute(
            User.__table__.select().where(User.email == payload.email)
        )
        user = result.first()
        
        if user:
            # User exists - just create tokens
            user_dict = dict(user._mapping)
            user_id = user_dict['id']
            user_email = user_dict['email']
            user_name = user_dict['full_name']
            user_role = user_dict['role']
        else:
            # Create new user from Google data
            new_user = User(
                email=payload.email,
                full_name=payload.full_name,
                role="user",
                hashed_password="",  # No password for Google users
                is_email_verified=True,  # Google users are pre-verified
            )
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)
            
            user_id = new_user.id
            user_email = new_user.email
            user_name = new_user.full_name
            user_role = new_user.role
        
        # Create tokens
        access_token = create_access_token(
            subject=user_email,
            additional_claims={"scope": "access"},
        )
        refresh_raw = generate_refresh_token_value()
        
        # Get user object for refresh token creation
        user_obj = await get_user_by_email(db, user_email)
        if user_obj:
            ua = request.headers.get("user-agent")
            ip = request.client.host if request.client else None
            await create_refresh_token(db, user_obj, refresh_raw, ua, ip)
        
        # Set cookies if enabled
        if settings.COOKIE_SESSION_ENABLED:
            set_session_cookie(response, access_token)
            set_refresh_cookie(response, refresh_raw)
            csrf = generate_csrf_token()
            set_csrf_cookie(response, csrf)
        
        return GoogleLoginResponse(
            access_token=access_token,
            refresh_token=refresh_raw,
            user={
                "id": user_id,
                "email": user_email,
                "full_name": user_name,
                "role": user_role,
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process Google login: {str(e)}"
        )


@router.post("/verify-email", response_model=VerifyEmailResponse)
async def verify_email(
    payload: VerifyEmailRequest,
    db: AsyncSession = Depends(get_session)
):
    """Verify user's email address with token"""
    user = await verify_email_token(db, payload.token)
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )
    
    return VerifyEmailResponse(
        message="Email verified successfully! You can now log in.",
        email=user.email
    )


@router.post("/resend-verification", response_model=ResendVerificationResponse)
async def resend_verification(
    payload: ResendVerificationRequest,
    db: AsyncSession = Depends(get_session)
):
    """Resend verification email to user"""
    success = await resend_verification_email(db, payload.email)
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Email not found or already verified"
        )
    
    return ResendVerificationResponse(
        message="Verification email sent! Please check your inbox."
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_session)
):
    """Request password reset email"""
    user = await get_user_by_email(db, payload.email)
    
    # Always return success even if user doesn't exist (security best practice)
    # This prevents email enumeration attacks
    if not user:
        return ForgotPasswordResponse(
            message="If that email exists, a password reset link has been sent."
        )
    
    try:
        # Create reset token and send email
        token = await create_reset_token(db, user)
        await send_reset_email(user, token)
    except Exception as e:
        print(f"⚠️ Failed to send reset email: {str(e)}")
        # Don't expose error to user
    
    return ForgotPasswordResponse(
        message="If that email exists, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_session)
):
    """Reset password with valid token"""
    # Verify token
    user = await verify_reset_token(db, payload.token)
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    # Validate new password
    try:
        validate_password(payload.new_password)
    except PasswordValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    # Reset password
    await reset_user_password(db, user, payload.new_password)
    
    return ResetPasswordResponse(
        message="Password reset successfully! You can now log in with your new password.",
        email=user.email
    )
