from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_session
from app.models.user import User
from app.services.users import get_user_by_email


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_session)
) -> User:
    try:
        # Support cookie session: if no bearer token provided, try cookie
        if not token and request.cookies:
            cookie_token = request.cookies.get("stemed_session")
            if cookie_token:
                token = cookie_token
        payload = decode_token(token)
        scope = payload.get("scope")
        if scope and scope != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token scope")
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Accept either user ID (int) or email in sub
    user: User | None = None
    try:
        user_id = int(sub)  # type: ignore[arg-type]
        user = await db.get(User, user_id)
    except (TypeError, ValueError):
        user = await get_user_by_email(db, str(sub))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_role(*allowed: str):
    async def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user
    return checker
