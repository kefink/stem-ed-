from sqlalchemy import String, Boolean, DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
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

    # Two-factor authentication fields
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    two_factor_secret: Mapped[str | None] = mapped_column(Text, nullable=True)
    two_factor_backup_codes: Mapped[str | None] = mapped_column(Text, nullable=True)
    two_factor_confirmed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    two_factor_last_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationships
    blog_posts = relationship("BlogPost", back_populates="author", lazy="dynamic")
