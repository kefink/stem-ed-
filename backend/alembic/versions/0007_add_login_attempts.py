"""Add login attempts tracking

Revision ID: 0007_add_login_attempts
Revises: 0006_add_password_reset
Create Date: 2025-01-20 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "0007_add_login_attempts"
down_revision = "0006_add_password_reset"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create login_attempts table for tracking failed login attempts and lockouts
    op.create_table(
        "login_attempts",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("ip_address", sa.String(45), nullable=True),  # IPv6 can be up to 45 chars
        sa.Column("attempt_time", sa.DateTime(), nullable=False),
        sa.Column("success", sa.Boolean(), nullable=False, default=False),
        sa.Column("user_agent", sa.String(255), nullable=True),
        
        # Foreign key to users table
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    
    # Add indexes for performance
    op.create_index("ix_login_attempts_user_id", "login_attempts", ["user_id"])
    op.create_index("ix_login_attempts_attempt_time", "login_attempts", ["attempt_time"])
    op.create_index("ix_login_attempts_user_id_time", "login_attempts", ["user_id", "attempt_time"])
    
    # Add lockout fields to users table
    op.add_column("users", sa.Column("is_locked", sa.Boolean(), nullable=False, server_default="0"))
    op.add_column("users", sa.Column("locked_until", sa.DateTime(), nullable=True))
    op.add_column("users", sa.Column("failed_login_attempts", sa.Integer(), nullable=False, server_default="0"))
    
    # Create index for locked users
    op.create_index("ix_users_is_locked", "users", ["is_locked"])


def downgrade() -> None:
    op.drop_index("ix_users_is_locked", table_name="users")
    op.drop_column("users", "failed_login_attempts")
    op.drop_column("users", "locked_until")
    op.drop_column("users", "is_locked")
    
    op.drop_index("ix_login_attempts_user_id_time", table_name="login_attempts")
    op.drop_index("ix_login_attempts_attempt_time", table_name="login_attempts")
    op.drop_index("ix_login_attempts_user_id", table_name="login_attempts")
    op.drop_table("login_attempts")
