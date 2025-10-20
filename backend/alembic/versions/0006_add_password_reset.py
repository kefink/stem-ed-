"""Add password reset fields

Revision ID: 0006_add_password_reset
Revises: 0005_add_email_verification
Create Date: 2025-01-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "0006_add_password_reset"
down_revision = "0005_add_email_verification"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add password reset columns to users table
    op.add_column("users", sa.Column("password_reset_token", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("password_reset_token_expires", sa.DateTime(), nullable=True))
    
    # Create index for faster token lookups
    op.create_index(
        "ix_users_password_reset_token",
        "users",
        ["password_reset_token"],
        unique=False
    )


def downgrade() -> None:
    op.drop_index("ix_users_password_reset_token", table_name="users")
    op.drop_column("users", "password_reset_token_expires")
    op.drop_column("users", "password_reset_token")
