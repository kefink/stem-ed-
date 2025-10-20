from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from pydantic import BaseModel, EmailStr

from app.db.session import get_session
from app.core.deps import require_role
from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription
from app.models.user import User
from app.services.account_lockout import unlock_account


router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_role("admin"))])


@router.get("/contact-messages")
async def list_contact_messages(
  db: AsyncSession = Depends(get_session),
  limit: int = Query(50, ge=1, le=200),
  offset: int = Query(0, ge=0),
  q: str | None = Query(None, description="Search by name/email/organization/service"),
):
  base = select(ContactMessage)
  if q:
    like = f"%{q}%"
    base = base.where(
      (ContactMessage.name.ilike(like))
      | (ContactMessage.email.ilike(like))
      | (ContactMessage.organization.ilike(like))
      | (ContactMessage.service.ilike(like))
    )
  total_res = await db.execute(select(func.count()).select_from(base.subquery()))
  total = total_res.scalar_one()
  res = await db.execute(base.order_by(desc(ContactMessage.created_at)).limit(limit).offset(offset))
  items = res.scalars().all()
  return {
    "items": [
      {
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "organization": i.organization,
        "phone": i.phone,
        "service": i.service,
        "message": i.message,
        "created_at": i.created_at.isoformat() if i.created_at else None,
      }
      for i in items
    ],
    "total": total,
    "limit": limit,
    "offset": offset,
  }


@router.get("/newsletter-subscribers")
async def list_newsletter_subscribers(
  db: AsyncSession = Depends(get_session),
  limit: int = Query(50, ge=1, le=200),
  offset: int = Query(0, ge=0),
  q: str | None = Query(None, description="Search by email/name/organization/role"),
):
  base = select(NewsletterSubscription)
  if q:
    like = f"%{q}%"
    base = base.where(
      (NewsletterSubscription.email.ilike(like))
      | (NewsletterSubscription.first_name.ilike(like))
      | (NewsletterSubscription.last_name.ilike(like))
      | (NewsletterSubscription.organization.ilike(like))
      | (NewsletterSubscription.role.ilike(like))
    )
  total_res = await db.execute(select(func.count()).select_from(base.subquery()))
  total = total_res.scalar_one()
  res = await db.execute(base.order_by(desc(NewsletterSubscription.created_at)).limit(limit).offset(offset))
  items = res.scalars().all()
  return {
    "items": [
      {
        "id": i.id,
        "email": i.email,
        "first_name": i.first_name,
        "last_name": i.last_name,
        "organization": i.organization,
        "role": i.role,
        "interests": (i.interests or "").split(",") if i.interests else [],
        "created_at": i.created_at.isoformat() if i.created_at else None,
      }
      for i in items
    ],
    "total": total,
    "limit": limit,
    "offset": offset,
  }


class UnlockAccountRequest(BaseModel):
    email: EmailStr


@router.post("/unlock-account")
async def unlock_user_account(
    payload: UnlockAccountRequest,
    db: AsyncSession = Depends(get_session),
):
    """Manually unlock a user account (admin only)"""
    # Find user by email
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Unlock the account
    await unlock_account(db, user)
    
    return {
        "message": f"Account {user.email} has been unlocked successfully",
        "email": user.email,
        "was_locked": True,
    }
