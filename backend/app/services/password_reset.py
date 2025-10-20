"""Password reset service"""
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.core.config import settings
from app.core.security import hash_password


def generate_reset_token() -> str:
    """Generate a secure random token for password reset"""
    return secrets.token_urlsafe(32)


async def create_reset_token(db: AsyncSession, user: User) -> str:
    """Create and store reset token for user (15 minute expiry)"""
    token = generate_reset_token()
    user.password_reset_token = token
    user.password_reset_token_expires = datetime.utcnow() + timedelta(minutes=15)
    
    await db.commit()
    await db.refresh(user)
    
    return token


async def send_reset_email(user: User, token: str) -> None:
    """Send password reset email to user"""
    # Frontend URL (configurable)
    frontend_url = "http://localhost:3000"
    
    # If SMTP is not configured, just print the link
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print(f"⚠️ Email provider not configured. Password reset email not sent.")
        print(f"🔗 Reset link: {frontend_url}/reset-password?token={token}")
        return
    
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    # Email content
    subject = "Reset Your Password - STEM-ED-ARCHITECTS"
    body = f"""
Hello {user.full_name or 'User'},

You requested to reset your password for STEM-ED-ARCHITECTS.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
STEM-ED-ARCHITECTS Team
"""
    
    # Create message
    message = MIMEMultipart()
    message["From"] = settings.SMTP_FROM or settings.SMTP_USER
    message["To"] = user.email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    
    try:
        # Send email via SMTP
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
        
        print(f"✅ Password reset email sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send reset email: {str(e)}")
        # Still print link for testing
        print(f"🔗 Reset link: {reset_link}")
        raise


async def verify_reset_token(db: AsyncSession, token: str) -> User | None:
    """Verify reset token and return user if valid"""
    result = await db.execute(
        select(User).where(User.password_reset_token == token)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    # Check if token is expired (15 minutes)
    if not user.password_reset_token_expires:
        return None
    
    if datetime.utcnow() > user.password_reset_token_expires:
        return None
    
    return user


async def reset_password(db: AsyncSession, user: User, new_password: str) -> None:
    """Reset user's password and clear reset token"""
    # Hash new password
    user.hashed_password = hash_password(new_password)
    
    # Clear reset token (one-time use)
    user.password_reset_token = None
    user.password_reset_token_expires = None
    
    await db.commit()
    await db.refresh(user)
