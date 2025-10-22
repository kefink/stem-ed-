"""Add two-factor authentication fields

Revision ID: 0008_add_two_factor_auth
Revises: 0007_add_login_attempts
Create Date: 2025-10-20

"""
from alembic import op
import sqlalchemy as sa


revision = "0008_add_two_factor_auth"
down_revision = "0007_add_login_attempts"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("two_factor_enabled", sa.Boolean(), nullable=False, server_default="0"),
    )
    op.add_column(
        "users",
        sa.Column("two_factor_secret", sa.Text(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("two_factor_backup_codes", sa.Text(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("two_factor_confirmed_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("two_factor_last_verified_at", sa.DateTime(), nullable=True),
    )

    op.execute("UPDATE users SET two_factor_enabled = 0 WHERE two_factor_enabled IS NULL")


def downgrade() -> None:
    op.drop_column("users", "two_factor_last_verified_at")
    op.drop_column("users", "two_factor_confirmed_at")
    op.drop_column("users", "two_factor_backup_codes")
    op.drop_column("users", "two_factor_secret")
    op.drop_column("users", "two_factor_enabled")
