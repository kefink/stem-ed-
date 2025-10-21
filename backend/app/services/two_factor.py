from __future__ import annotations

import json
import secrets
from datetime import datetime, timezone
from typing import Iterable, Tuple

import pyotp
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.encryption import encrypt_string, decrypt_string
from app.core.security import hash_password, verify_password
from app.models.user import User

TWO_FACTOR_ISSUER = "STEM-ED-ARCHITECTS"
DEFAULT_BACKUP_CODE_COUNT = 10


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def generate_totp_secret() -> str:
    return pyotp.random_base32()


def build_provisioning_uri(user: User, secret: str) -> str:
    label = user.email
    return pyotp.TOTP(secret).provisioning_uri(name=label, issuer_name=TWO_FACTOR_ISSUER)


def generate_backup_codes(count: int = DEFAULT_BACKUP_CODE_COUNT) -> list[str]:
    codes: set[str] = set()
    while len(codes) < count:
        part_a = secrets.randbelow(10_000)
        part_b = secrets.randbelow(10_000)
        codes.add(f"{part_a:04d}-{part_b:04d}")
    return sorted(codes)


def _load_backup_hashes(user: User) -> list[str]:
    if not user.two_factor_backup_codes:
        return []
    try:
        values = json.loads(user.two_factor_backup_codes)
        if isinstance(values, list):
            return [str(v) for v in values]
    except json.JSONDecodeError:
        return []
    return []


def _dump_backup_hashes(hashes: Iterable[str]) -> str:
    return json.dumps(list(hashes))


def get_backup_codes_remaining(user: User) -> int:
    return len(_load_backup_hashes(user))


def decrypt_totp_secret(user: User) -> str | None:
    return decrypt_string(user.two_factor_secret)


def verify_totp_code(user: User, code: str, valid_window: int = 1) -> bool:
    secret = decrypt_totp_secret(user)
    if not secret:
        return False
    normalized = (code or "").strip().replace(" ", "").replace("-", "")
    if not normalized:
        return False
    totp = pyotp.TOTP(secret)
    return bool(totp.verify(normalized, valid_window=valid_window))


def hash_backup_codes(codes: Iterable[str]) -> list[str]:
    return [hash_password(code) for code in codes]


def verify_and_consume_backup_code(user: User, code: str) -> tuple[bool, list[str]]:
    hashed_codes = _load_backup_hashes(user)
    normalized = (code or "").strip().upper()
    # Accept codes with or without dash
    normalized = normalized.replace(" ", "")
    if len(normalized) == 8 and "-" not in normalized:
        normalized = f"{normalized[:4]}-{normalized[4:]}"
    remaining: list[str] = []
    consumed = False
    for hashed in hashed_codes:
        if not consumed and verify_password(normalized, hashed):
            consumed = True
            continue
        remaining.append(hashed)
    return consumed, remaining


async def start_two_factor_setup(db: AsyncSession, user: User) -> tuple[str, list[str], str]:
    secret = generate_totp_secret()
    backup_codes = generate_backup_codes()
    user.two_factor_secret = encrypt_string(secret)
    user.two_factor_backup_codes = _dump_backup_hashes(hash_backup_codes(backup_codes))
    user.two_factor_enabled = False
    user.two_factor_confirmed_at = None
    user.two_factor_last_verified_at = None
    await db.commit()
    await db.refresh(user)
    uri = build_provisioning_uri(user, secret)
    return secret, backup_codes, uri


async def enable_two_factor(db: AsyncSession, user: User, code: str) -> bool:
    if not verify_totp_code(user, code):
        return False
    user.two_factor_enabled = True
    user.two_factor_confirmed_at = _now_utc()
    user.two_factor_last_verified_at = _now_utc()
    await db.commit()
    await db.refresh(user)
    return True


async def disable_two_factor(db: AsyncSession, user: User) -> None:
    user.two_factor_enabled = False
    user.two_factor_secret = None
    user.two_factor_backup_codes = None
    user.two_factor_confirmed_at = None
    user.two_factor_last_verified_at = None
    await db.commit()
    await db.refresh(user)


async def update_backup_code_hashes(db: AsyncSession, user: User, hashes: Iterable[str]) -> None:
    user.two_factor_backup_codes = _dump_backup_hashes(hashes)
    await db.commit()
    await db.refresh(user)


async def regenerate_backup_codes(db: AsyncSession, user: User) -> tuple[list[str], int]:
    codes = generate_backup_codes()
    hashed = hash_backup_codes(codes)
    user.two_factor_backup_codes = _dump_backup_hashes(hashed)
    await db.commit()
    await db.refresh(user)
    return codes, len(hashed)


async def mark_two_factor_verified(db: AsyncSession, user: User) -> None:
    user.two_factor_last_verified_at = _now_utc()
    await db.commit()
    await db.refresh(user)
