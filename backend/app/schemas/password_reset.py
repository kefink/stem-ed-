"""Password reset schemas"""
from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    """Request to initiate password reset"""
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    """Response after requesting password reset"""
    message: str


class ResetPasswordRequest(BaseModel):
    """Request to reset password with token"""
    token: str
    new_password: str


class ResetPasswordResponse(BaseModel):
    """Response after password reset"""
    message: str
    email: str
