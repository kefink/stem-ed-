#!/usr/bin/env python3
"""
Quick script to promote a user to admin role.
Usage: python make_admin.py user@example.com
"""
import sys
import asyncio
from sqlalchemy import select, update
from app.db.session import SessionLocal
from app.models.user import User


async def make_admin(email: str):
    async with SessionLocal() as db:
        # Check if user exists
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print(f"❌ User not found: {email}")
            print("\nAvailable users:")
            all_users = await db.execute(select(User))
            for u in all_users.scalars():
                print(f"  - {u.email} (role: {u.role})")
            return False
        
        if user.role == "admin":
            print(f"✅ User {email} is already an admin")
            return True
        
        # Update to admin
        await db.execute(
            update(User)
            .where(User.email == email)
            .values(role="admin")
        )
        await db.commit()
        
        print(f"✅ Successfully promoted {email} to admin role")
        return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    success = asyncio.run(make_admin(email))
    sys.exit(0 if success else 1)
