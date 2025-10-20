"""Email verification service"""
from datetime import datetime, timedelta
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.services.email import get_email_provider
from app.core.config import settings


def generate_verification_token() -> str:
    """Generate a secure random verification token"""
    return secrets.token_urlsafe(32)


async def create_verification_token(db: AsyncSession, user: User) -> str:
    """Create and store verification token for user"""
    token = generate_verification_token()
    user.verification_token = token
    user.verification_token_expires = datetime.utcnow() + timedelta(hours=24)  # Valid for 24 hours
    await db.commit()
    await db.refresh(user)
    return token


async def send_verification_email(user: User, token: str, frontend_url: str = "http://localhost:3000") -> bool:
    """Send verification email to user"""
    email_provider = get_email_provider()
    if not email_provider:
        print("⚠️ Email provider not configured. Verification email not sent.")
        print(f"📧 Verification link: {frontend_url}/verify-email?token={token}")
        return False
    
    verification_link = f"{frontend_url}/verify-email?token={token}"
    
    subject = "Verify Your Email - STEM-ED-ARCHITECTS"
    body = f"""
Hello {user.full_name or 'there'},

Thank you for registering with STEM-ED-ARCHITECTS!

Please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
STEM-ED-ARCHITECTS Team
    """
    
    try:
        await email_provider.send(
            subject=subject,
            body=body,
            to=user.email,
            from_addr=settings.SMTP_FROM or "noreply@stem-ed-architects.com"
        )
        print(f"✅ Verification email sent to {user.email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send verification email: {str(e)}")
        print(f"📧 Verification link: {verification_link}")
        return False


async def verify_email_token(db: AsyncSession, token: str) -> User | None:
    """Verify email token and mark user as verified"""
    result = await db.execute(
        select(User).where(User.verification_token == token)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    # Check if token is expired
    if user.verification_token_expires and user.verification_token_expires < datetime.utcnow():
        return None
    
    # Mark user as verified
    user.is_email_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    await db.commit()
    await db.refresh(user)
    
    return user


async def resend_verification_email(db: AsyncSession, email: str, frontend_url: str = "http://localhost:3000") -> bool:
    """Resend verification email to user"""
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        return False
    
    if user.is_email_verified:
        return False  # Already verified
    
    # Generate new token
    token = await create_verification_token(db, user)
    
    # Send email
    return await send_verification_email(user, token, frontend_url)
