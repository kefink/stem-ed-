"""
Google OAuth authentication endpoint
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from app.models.user import User
from app.core.security import create_access_token, create_refresh_token
from app.services.refresh_tokens import create_refresh_token_for_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class GoogleLoginRequest(BaseModel):
    email: EmailStr
    full_name: str
    google_id: str


class GoogleLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/google-login", response_model=GoogleLoginResponse)
async def google_login(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Handle Google OAuth login/registration.
    If user exists, return tokens. If not, create user and return tokens.
    """
    try:
        # Check if user exists by email
        user = db.query(User).filter(User.email == request.email).first()
        
        if user:
            # User exists - update Google ID if not set
            if not hasattr(user, 'google_id') or not user.google_id:
                user.google_id = request.google_id
                db.commit()
                db.refresh(user)
            
            logger.info(f"Existing user logged in via Google: {user.email}")
        else:
            # Create new user
            user = User(
                email=request.email,
                full_name=request.full_name,
                google_id=request.google_id,
                role="user",  # Default role
                # No password for Google users - they auth via Google
                hashed_password=""
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            logger.info(f"New user created via Google: {user.email}")
        
        # Create tokens
        access_token = create_access_token(subject=str(user.id))
        refresh_token_str = create_refresh_token(subject=str(user.id))
        
        # Store refresh token in database
        await create_refresh_token_for_user(db, user.id, refresh_token_str)
        
        return GoogleLoginResponse(
            access_token=access_token,
            refresh_token=refresh_token_str,
            user={
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
            }
        )
        
    except Exception as e:
        logger.error(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process Google login: {str(e)}"
        )
