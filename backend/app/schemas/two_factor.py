from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class TwoFactorChallengeResponse(BaseModel):
    requires_two_factor: bool = True
    challenge_token: str
    methods: list[str] = ["totp", "backup_code"]
    backup_codes_remaining: int | None = None
    message: str = "Two-factor authentication required"
    expires_in_seconds: int | None = 300


class TwoFactorVerifyRequest(BaseModel):
    challenge_token: str
    code: str
    method: Literal["totp", "backup_code"] = "totp"


class TwoFactorSetupResponse(BaseModel):
    secret: str
    otpauth_uri: str
    backup_codes: list[str]


class TwoFactorEnableRequest(BaseModel):
    code: str


class TwoFactorDisableRequest(BaseModel):
    password: str
    code: str
    method: Literal["totp", "backup_code"] = "totp"


class TwoFactorStatusResponse(BaseModel):
    enabled: bool
    backup_codes_remaining: int
    confirmed_at: datetime | None = None
    last_verified_at: datetime | None = None


class TwoFactorRegenerateResponse(BaseModel):
    backup_codes: list[str]
    total: int
