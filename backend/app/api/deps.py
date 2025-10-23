from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.db.session import get_db
from app.models.user import User
from app.core.config import settings


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token.
    Accepts tokens where `sub` is either the user ID or the email.
    Requires scope to be 'access' when provided.
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        scope = payload.get("scope")
        if scope and scope != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token scope")
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    user = None
    # Try to resolve by ID when sub looks like an integer
    try:
        user_id = int(sub)
        user = db.query(User).filter(User.id == user_id).first()
    except (TypeError, ValueError):
        # Not an int; treat as email
        user = db.query(User).filter(User.email == str(sub)).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user
