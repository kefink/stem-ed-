"""Fix alembic version in database"""
import asyncio
from app.db.session import engine
from sqlalchemy import text

async def fix_version():
    async with engine.begin() as conn:
        # Check current version
        result = await conn.execute(text("SELECT version_num FROM alembic_version"))
        current = result.fetchone()
        print(f"Current version: {current[0] if current else 'None'}")
        
        # Update to skip two-factor migration since it's already applied
        await conn.execute(text("UPDATE alembic_version SET version_num='0008_add_two_factor_auth'"))
        print("✓ Updated version to 0008_add_two_factor_auth (skipping duplicate migration)")

asyncio.run(fix_version())
