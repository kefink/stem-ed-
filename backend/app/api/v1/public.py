from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.contact import ContactCreate, ContactRead, NewsletterSubscribe, NewsletterRead
from app.services.contact import create_contact_message, subscribe_newsletter
from app.api.v1.endpoints.public.blog import router as blog_router
from app.api.v1.endpoints.public.homepage import router as homepage_router


router = APIRouter(prefix="/public", tags=["public"])

# Include public blog routes
router.include_router(blog_router, prefix="/blog", tags=["blog-public"])

# Include public homepage routes
router.include_router(homepage_router, prefix="/homepage", tags=["homepage-public"])


@router.post("/contact", response_model=ContactRead, status_code=201)
async def submit_contact(payload: ContactCreate, db: AsyncSession = Depends(get_session)):
    cm = await create_contact_message(
        db,
        name=payload.name,
        email=payload.email,
        organization=payload.organization,
        phone=payload.phone,
        service=payload.service,
        message=payload.message,
    )
    return cm


@router.post("/newsletter", response_model=NewsletterRead, status_code=201)
async def subscribe(payload: NewsletterSubscribe, db: AsyncSession = Depends(get_session)):
    sub = await subscribe_newsletter(
        db,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        organization=payload.organization,
        role=payload.role,
        interests=payload.interests or [],
    )
    return sub
