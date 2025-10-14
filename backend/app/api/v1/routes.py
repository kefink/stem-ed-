from fastapi import APIRouter
from .users import router as users_router
from .auth import router as auth_router

router = APIRouter()


@router.get("/ping", tags=["health"])
async def ping():
    return {"message": "pong"}


api_router = APIRouter()
api_router.include_router(router)
api_router.include_router(users_router)
api_router.include_router(auth_router)
