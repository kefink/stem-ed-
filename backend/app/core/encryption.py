from __future__ import annotations

import base64
import hashlib
from functools import lru_cache
from typing import Optional

from cryptography.fernet import Fernet, InvalidToken

from app.core.config import settings


@lru_cache(maxsize=1)
def _get_fernet() -> Fernet:
    # Derive a 32-byte key from SECRET_KEY using SHA256, then base64-url encode it for Fernet
    digest = hashlib.sha256(settings.SECRET_KEY.encode("utf-8")).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_string(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    fernet = _get_fernet()
    token = fernet.encrypt(value.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_string(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    fernet = _get_fernet()
    try:
        plain = fernet.decrypt(value.encode("utf-8"))
    except InvalidToken:
        return None
    return plain.decode("utf-8")
