from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None


class RefreshRequest(BaseModel):
    token: str


class LogoutRequest(BaseModel):
    token: str
