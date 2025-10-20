from sqlalchemy import String, Boolean, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="student", index=True)
    
    # Email verification fields
    is_email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verification_token: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    verification_token_expires: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Password reset fields
    password_reset_token: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    password_reset_token_expires: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Account lockout fields
    is_locked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
