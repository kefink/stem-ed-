from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.core.security import verify_password
from app.db.session import get_session
from app.models.user import User
from app.schemas.two_factor import (
    TwoFactorDisableRequest,
    TwoFactorEnableRequest,
    TwoFactorRegenerateResponse,
    TwoFactorSetupResponse,
    TwoFactorStatusResponse,
)
from app.services.two_factor import (
    disable_two_factor,
    enable_two_factor,
    get_backup_codes_remaining,
    regenerate_backup_codes,
    start_two_factor_setup,
    update_backup_code_hashes,
    verify_and_consume_backup_code,
    verify_totp_code,
)

router = APIRouter(prefix="/auth/2fa", tags=["two-factor"])


@router.get("/status", response_model=TwoFactorStatusResponse)
async def get_status(current_user: User = Depends(get_current_user)):
    return TwoFactorStatusResponse(
        enabled=bool(current_user.two_factor_enabled),
        backup_codes_remaining=get_backup_codes_remaining(current_user),
        confirmed_at=current_user.two_factor_confirmed_at,
        last_verified_at=current_user.two_factor_last_verified_at,
    )


@router.post("/setup", response_model=TwoFactorSetupResponse, status_code=status.HTTP_201_CREATED)
async def setup_two_factor(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="Two-factor authentication is already enabled. Disable it before reconfiguring.")

    secret, backup_codes, uri = await start_two_factor_setup(db, current_user)
    return TwoFactorSetupResponse(secret=secret, otpauth_uri=uri, backup_codes=backup_codes)


@router.post("/enable", response_model=TwoFactorStatusResponse)
async def enable_two_factor_endpoint(
    payload: TwoFactorEnableRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if not current_user.two_factor_secret:
        raise HTTPException(status_code=400, detail="Start two-factor setup before enabling it.")

    success = await enable_two_factor(db, current_user, payload.code)
    if not success:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")

    return TwoFactorStatusResponse(
        enabled=True,
        backup_codes_remaining=get_backup_codes_remaining(current_user),
        confirmed_at=current_user.two_factor_confirmed_at,
        last_verified_at=current_user.two_factor_last_verified_at,
    )


@router.post("/disable", response_model=TwoFactorStatusResponse)
async def disable_two_factor_endpoint(
    payload: TwoFactorDisableRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if not current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="Two-factor authentication is already disabled.")

    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    if payload.method == "backup_code":
        consumed, remaining = verify_and_consume_backup_code(current_user, payload.code)
        if not consumed:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid backup code")
        # Persist removal so the consumed code cannot be reused during disable flow race conditions
        await update_backup_code_hashes(db, current_user, remaining)
    else:
        if not verify_totp_code(current_user, payload.code):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")

    await disable_two_factor(db, current_user)

    return TwoFactorStatusResponse(
        enabled=False,
        backup_codes_remaining=0,
        confirmed_at=None,
        last_verified_at=None,
    )


@router.post("/backup-codes/regenerate", response_model=TwoFactorRegenerateResponse)
async def regenerate_codes(
    payload: TwoFactorEnableRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    if not current_user.two_factor_enabled:
        raise HTTPException(status_code=400, detail="Enable two-factor authentication before regenerating backup codes.")

    if not verify_totp_code(current_user, payload.code):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")

    backup_codes, total = await regenerate_backup_codes(db, current_user)

    return TwoFactorRegenerateResponse(backup_codes=backup_codes, total=total)
