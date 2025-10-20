"""Add email verification fields

Revision ID: 0005_add_email_verification
Revises: 0004_add_contact_and_newsletter_tables
Create Date: 2025-10-19

"""
from alembic import op
import sqlalchemy as sa

revision = "0005_add_email_verification"
down_revision = "0004_add_contact_and_newsletter_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add email verification columns to users table
    op.add_column("users", sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default="0"))
    op.add_column("users", sa.Column("verification_token", sa.String(length=255), nullable=True))
    op.add_column("users", sa.Column("verification_token_expires", sa.DateTime(), nullable=True))
    
    # Create index for verification token lookup
    op.create_index("ix_users_verification_token", "users", ["verification_token"])
    
    # Mark all existing users as verified (grandfather clause)
    op.execute("UPDATE users SET is_email_verified = 1 WHERE id IS NOT NULL")


def downgrade() -> None:
    op.drop_index("ix_users_verification_token", table_name="users")
    op.drop_column("users", "verification_token_expires")
    op.drop_column("users", "verification_token")
    op.drop_column("users", "is_email_verified")
