"""Account lockout service for handling failed login attempts"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.core.config import settings


# Constants
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15


async def record_login_attempt(
    db: AsyncSession,
    user: User,
    success: bool,
    ip_address: str | None = None,
    user_agent: str | None = None
) -> None:
    """Record a login attempt (successful or failed)"""
    attempt = LoginAttempt(
        user_id=user.id,
        ip_address=ip_address,
        attempt_time=datetime.utcnow(),
        success=success,
        user_agent=user_agent
    )
    db.add(attempt)
    await db.commit()


async def is_account_locked(db: AsyncSession, user: User) -> tuple[bool, datetime | None]:
    """
    Check if account is locked.
    Returns (is_locked, locked_until)
    """
    # Check if manually locked with expiry
    if user.is_locked and user.locked_until:
        # Check if lockout has expired
        if datetime.utcnow() < user.locked_until:
            return True, user.locked_until
        else:
            # Lockout expired, unlock account
            await unlock_account(db, user)
            return False, None
    
    # Check if manually locked without expiry (admin lock)
    if user.is_locked and not user.locked_until:
        return True, None
    
    return False, None


async def record_failed_attempt(
    db: AsyncSession,
    user: User,
    ip_address: str | None = None,
    user_agent: str | None = None
) -> bool:
    """
    Record a failed login attempt and lock account if threshold reached.
    Returns True if account was locked, False otherwise.
    """
    # Record the failed attempt
    await record_login_attempt(db, user, success=False, ip_address=ip_address, user_agent=user_agent)
    
    # Increment failed attempts counter
    user.failed_login_attempts += 1
    
    # Check if we've hit the threshold
    if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
        # Lock the account
        user.is_locked = True
        user.locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
        
        await db.commit()
        await db.refresh(user)
        
        # Send lockout notification email
        try:
            await send_lockout_email(user)
        except Exception as e:
            print(f"⚠️ Failed to send lockout email: {str(e)}")
        
        return True
    
    await db.commit()
    await db.refresh(user)
    return False


async def record_successful_login(
    db: AsyncSession,
    user: User,
    ip_address: str | None = None,
    user_agent: str | None = None
) -> None:
    """Record a successful login and clear failed attempts counter"""
    # Record the successful attempt
    await record_login_attempt(db, user, success=True, ip_address=ip_address, user_agent=user_agent)
    
    # Reset failed attempts counter
    user.failed_login_attempts = 0
    
    # If account was auto-locked (has expiry), unlock it
    if user.is_locked and user.locked_until:
        user.is_locked = False
        user.locked_until = None
    
    await db.commit()
    await db.refresh(user)


async def unlock_account(db: AsyncSession, user: User) -> None:
    """Unlock a user account (admin action or automatic after expiry)"""
    user.is_locked = False
    user.locked_until = None
    user.failed_login_attempts = 0
    
    await db.commit()
    await db.refresh(user)


async def send_lockout_email(user: User) -> None:
    """Send email notification when account is locked"""
    # Frontend URL (configurable)
    frontend_url = "http://localhost:3000"
    
    # If SMTP is not configured, just print the notification
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print(f"⚠️ Email provider not configured. Lockout notification not sent.")
        print(f"🔒 Account locked: {user.email} - Locked until {user.locked_until}")
        return
    
    # Email content
    subject = "Security Alert: Account Locked - STEM-ED-ARCHITECTS"
    
    locked_until_str = user.locked_until.strftime("%Y-%m-%d %H:%M:%S UTC") if user.locked_until else "Unknown"
    
    body = f"""
Hello {user.full_name or 'User'},

Your STEM-ED-ARCHITECTS account has been temporarily locked due to multiple failed login attempts.

Account Email: {user.email}
Locked Until: {locked_until_str}
Lockout Duration: {LOCKOUT_DURATION_MINUTES} minutes

This is a security measure to protect your account. You can try logging in again after the lockout period expires.

If you didn't attempt to log in, please:
1. Reset your password immediately: {frontend_url}/forgot-password
2. Contact our support team if you believe your account has been compromised

Security Tips:
- Use a strong, unique password
- Never share your password
- Enable two-factor authentication when available

Best regards,
STEM-ED-ARCHITECTS Security Team
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
        
        print(f"🔒 Lockout notification sent to {user.email}")
    except Exception as e:
        print(f"❌ Failed to send lockout email: {str(e)}")
        # Still print notification for debugging
        print(f"🔒 Account locked: {user.email} - Locked until {locked_until_str}")
        raise


async def get_recent_failed_attempts(db: AsyncSession, user: User, minutes: int = 60) -> int:
    """Get count of failed login attempts in the last N minutes"""
    cutoff_time = datetime.utcnow() - timedelta(minutes=minutes)
    
    result = await db.execute(
        select(func.count(LoginAttempt.id))
        .where(
            LoginAttempt.user_id == user.id,
            LoginAttempt.success == False,
            LoginAttempt.attempt_time >= cutoff_time
        )
    )
    
    count = result.scalar()
    return count or 0
