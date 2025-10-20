from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.users import create_user, get_user_by_email
from app.core.deps import get_current_user
from app.models.user import User
from app.core.password_policy import validate_password, PasswordValidationError
from app.core.security import hash_password
from app.services.email_verification import create_verification_token, send_verification_email

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=201)
async def create_user_endpoint(payload: UserCreate, db: AsyncSession = Depends(get_session)):
    # Validate password policy
    try:
        validate_password(payload.password)
    except PasswordValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    existing = await get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    role = payload.role or "student"
    user = await create_user(db, payload.email, payload.password, payload.full_name, role)
    
    # Create and send verification email
    try:
        token = await create_verification_token(db, user)
        await send_verification_email(user, token)
    except Exception as e:
        print(f"⚠️ Failed to send verification email: {str(e)}")
        # Don't block registration if email fails
    
    return user


@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
async def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    # Check if email is being changed and if it's already in use
    if payload.email and payload.email != current_user.email:
        existing = await get_user_by_email(db, payload.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = payload.email
    
    # Update full name if provided
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    
    # Update password if provided
    if payload.password:
        try:
            validate_password(payload.password)
        except PasswordValidationError as e:
            raise HTTPException(status_code=422, detail=str(e))
        current_user.hashed_password = hash_password(payload.password)
    
    await db.commit()
    await db.refresh(current_user)
    return current_user
