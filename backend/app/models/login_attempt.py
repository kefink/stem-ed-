"""Login attempt model for tracking authentication attempts"""
from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.db.session import Base


class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    attempt_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    user_agent: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Relationship to User (optional, for easier queries)
    # user: Mapped["User"] = relationship(back_populates="login_attempts")
