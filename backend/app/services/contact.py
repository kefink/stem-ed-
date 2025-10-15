from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription
from app.core.config import settings
from app.services.email import get_email_provider
from app.services.google_sheets import get_sheets_service


async def create_contact_message(
    db: AsyncSession,
    *,
    name: str,
    email: str,
    organization: str | None,
    phone: str | None,
    service: str | None,
    message: str,
) -> ContactMessage:
    cm = ContactMessage(
        name=name,
        email=email,
        organization=organization,
        phone=phone,
        service=service,
        message=message,
    )
    db.add(cm)
    await db.commit()
    await db.refresh(cm)
    
    # Save to Google Sheets (non-blocking)
    try:
        sheets_service = get_sheets_service()
        sheets_service.add_contact_message(
            name=cm.name,
            email=cm.email,
            organization=cm.organization,
            phone=cm.phone,
            service=cm.service,
            message=cm.message,
            created_at=cm.created_at
        )
    except Exception as e:
        print(f"⚠️  Failed to save to Google Sheets: {e}")
    
    # Optional: send email notification
    try:
        await _maybe_send_contact_email(cm)
    except Exception:
        # Do not fail the request if email sending fails
        pass
    return cm


async def subscribe_newsletter(
    db: AsyncSession,
    *,
    email: str,
    first_name: str | None,
    last_name: str | None,
    organization: str | None,
    role: str | None,
    interests: list[str] | None,
) -> NewsletterSubscription:
    # Upsert-like: if exists, update fields
    res = await db.execute(select(NewsletterSubscription).where(NewsletterSubscription.email == email))
    existing = res.scalars().first()
    if existing:
        existing.first_name = first_name
        existing.last_name = last_name
        existing.organization = organization
        existing.role = role
        existing.interests = ",".join(interests) if interests else None
        await db.commit()
        await db.refresh(existing)
        
        # Save to Google Sheets (non-blocking)
        try:
            sheets_service = get_sheets_service()
            sheets_service.add_newsletter_subscriber(
                email=existing.email,
                first_name=existing.first_name,
                last_name=existing.last_name,
                organization=existing.organization,
                role=existing.role,
                interests=existing.interests.split(",") if existing.interests else None,
                created_at=existing.created_at
            )
        except Exception as e:
            print(f"⚠️  Failed to save to Google Sheets: {e}")
        
        return existing

    sub = NewsletterSubscription(
        email=email,
        first_name=first_name,
        last_name=last_name,
        organization=organization,
        role=role,
        interests=",".join(interests) if interests else None,
    )
    db.add(sub)
    await db.commit()
    await db.refresh(sub)
    
    # Save to Google Sheets (non-blocking)
    try:
        sheets_service = get_sheets_service()
        sheets_service.add_newsletter_subscriber(
            email=sub.email,
            first_name=sub.first_name,
            last_name=sub.last_name,
            organization=sub.organization,
            role=sub.role,
            interests=sub.interests.split(",") if sub.interests else None,
            created_at=sub.created_at
        )
    except Exception as e:
        print(f"⚠️  Failed to save to Google Sheets: {e}")
    
    return sub


async def _maybe_send_contact_email(cm: ContactMessage):
    provider = get_email_provider()
    if not provider:
        return
    to = getattr(settings, "SMTP_TO", None) or getattr(settings, "SMTP_FROM", None)
    if not to:
        return
    subject = f"New Contact Message from {cm.name}"
    body = (
        f"Name: {cm.name}\n"
        f"Email: {cm.email}\n"
        f"Organization: {cm.organization or '-'}\n"
        f"Phone: {cm.phone or '-'}\n"
        f"Service: {cm.service or '-'}\n\n"
        f"Message:\n{cm.message}\n"
    )
    await provider.send(subject=subject, body=body, to=to, from_addr=getattr(settings, "SMTP_FROM", None))
