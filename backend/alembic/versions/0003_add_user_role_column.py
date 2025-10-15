from alembic import op
import sqlalchemy as sa

revision = "0003_add_user_role_column"
down_revision = "0002_add_refresh_tokens_table"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column("users", sa.Column("role", sa.String(length=32), nullable=False, server_default="student"))
    op.create_index("ix_users_role", "users", ["role"])
    # Remove server_default so future inserts rely on application default
    op.alter_column("users", "role", server_default=None)


def downgrade() -> None:
    op.drop_index("ix_users_role", table_name="users")
    op.drop_column("users", "role")
