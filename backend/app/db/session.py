from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy import create_engine

from app.core.config import settings


class Base(DeclarativeBase):
    pass


# Async engine and session
engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Sync engine and session for blog endpoints
# Convert aiomysql URL to pymysql for sync operations
sync_db_url = settings.DATABASE_URL.replace("aiomysql", "pymysql").replace("+aiomysql", "")
sync_engine = create_engine(sync_db_url, echo=False)
SyncSessionLocal = sessionmaker(bind=sync_engine, class_=Session, expire_on_commit=False)


async def get_session() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


def get_db() -> Session:
    """Synchronous database session for legacy endpoints"""
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()
