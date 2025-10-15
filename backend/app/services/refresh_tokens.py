import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.refresh_token import RefreshToken
from app.models.user import User


REFRESH_BYTE_LENGTH = 48  # 64 url-safe chars approx


def _hash(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def generate_refresh_token_value() -> str:
    return secrets.token_urlsafe(REFRESH_BYTE_LENGTH)


async def create_refresh_token(db: AsyncSession, user: User, raw_token: str, user_agent: str | None, ip: str | None) -> RefreshToken:
    expires = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    rt = RefreshToken(
        user_id=user.id,
        token_hash=_hash(raw_token),
        created_at=datetime.now(timezone.utc),
        expires_at=expires,
        user_agent=user_agent[:255] if user_agent else None,
        ip=ip[:64] if ip else None,
    )
    db.add(rt)
    await db.commit()
    await db.refresh(rt)
    return rt


async def get_refresh_token(db: AsyncSession, raw_token: str) -> Optional[RefreshToken]:
    h = _hash(raw_token)
    res = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == h))
    return res.scalars().first()


async def revoke_refresh_token(db: AsyncSession, raw_token: str) -> None:
    h = _hash(raw_token)
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.token_hash == h, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(timezone.utc))
    )
    await db.commit()


async def rotate_refresh_token(db: AsyncSession, old_raw: str, user: User, user_agent: str | None, ip: str | None) -> tuple[str, RefreshToken]:
    # revoke old
    await revoke_refresh_token(db, old_raw)
    # create new
    new_raw = generate_refresh_token_value()
    await create_refresh_token(db, user, new_raw, user_agent, ip)
    return new_raw, await get_refresh_token(db, new_raw)  # type: ignore


def is_refresh_token_active(token: RefreshToken) -> bool:
    now = datetime.now(timezone.utc)
    if token.revoked_at is not None:
        return False
    if token.expires_at <= now:
        return False
    return True
