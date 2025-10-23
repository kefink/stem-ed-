from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import List, Optional
from pydantic import BaseModel, EmailStr

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require admin role"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    is_verified: bool
    is_locked: bool
    two_factor_enabled: bool
    created_at: Optional[str] = ""  # Optional since User model doesn't have this field
    
    class Config:
        from_attributes = True


class UsersListResponse(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class UserCreateRequest(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    password: str
    role: str = "user"
    is_verified: bool = False
    is_locked: bool = False


class UserUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_verified: Optional[bool] = None
    is_locked: Optional[bool] = None
    password: Optional[str] = None


@router.get("/users", response_model=UsersListResponse)
async def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[str] = None,
    is_verified: Optional[bool] = None
):
    """
    List all users with pagination and filtering.
    Requires admin authentication.
    """
    query = db.query(User)
    
    # Apply filters
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                User.email.ilike(search_pattern),
                User.full_name.ilike(search_pattern)
            )
        )
    
    if role:
        query = query.filter(User.role == role)
    
    if is_verified is not None:
        query = query.filter(User.is_verified == is_verified)
    
    # Get total count
    total = query.count()
    
    # Calculate pagination
    total_pages = (total + page_size - 1) // page_size
    offset = (page - 1) * page_size
    
    # Get paginated results
    users = query.order_by(desc(User.id)).offset(offset).limit(page_size).all()
    
    # Convert to response format
    user_responses = [
        UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_verified=user.is_email_verified,
            is_locked=user.is_locked,
            two_factor_enabled=user.two_factor_enabled,
            created_at=user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else ""
        )
        for user in users
    ]
    
    return UsersListResponse(
        items=user_responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get a single user by ID.
    Requires admin authentication.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_verified=user.is_email_verified,
        is_locked=user.is_locked,
        two_factor_enabled=user.two_factor_enabled,
        created_at=user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else ""
    )


@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Create a new user.
    Requires admin authentication.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=user_data.role,
        is_email_verified=user_data.is_verified,
        is_locked=user_data.is_locked
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        is_verified=new_user.is_email_verified,
        is_locked=new_user.is_locked,
        two_factor_enabled=new_user.two_factor_enabled,
        created_at=new_user.created_at.isoformat() if hasattr(new_user, 'created_at') and new_user.created_at else ""
    )


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Update a user.
    Requires admin authentication.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from demoting themselves
    if user.id == current_user.id and user_data.role and user_data.role != "admin":
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    # Update fields
    if user_data.email:
        # Check if email is already taken by another user
        existing = db.query(User).filter(
            User.email == user_data.email,
            User.id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        user.email = user_data.email
    
    if user_data.full_name is not None:
        user.full_name = user_data.full_name
    
    if user_data.role:
        user.role = user_data.role
    
    if user_data.is_verified is not None:
        user.is_email_verified = user_data.is_verified
    
    if user_data.is_locked is not None:
        user.is_locked = user_data.is_locked
    
    if user_data.password:
        user.hashed_password = hash_password(user_data.password)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_verified=user.is_email_verified,
        is_locked=user.is_locked,
        two_factor_enabled=user.two_factor_enabled,
        created_at=user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else ""
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Delete a user.
    Requires admin authentication.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully", "user_id": user_id}
