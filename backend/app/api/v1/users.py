from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.user import UserCreate, UserRead
from app.services.users import create_user, get_user_by_email

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=201)
async def create_user_endpoint(payload: UserCreate, db: AsyncSession = Depends(get_session)):
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    # NOTE: not hashing for smoke test; replace with proper hashing later
    user = await create_user(db, payload.email, payload.password, payload.full_name)
    return user
