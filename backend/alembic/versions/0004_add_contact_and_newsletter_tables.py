from alembic import op
import sqlalchemy as sa


revision = "0004_add_contact_and_newsletter_tables"
down_revision = "0003_add_user_role_column"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("organization", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("service", sa.String(length=64), nullable=True),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contact_messages_email", "contact_messages", ["email"])

    op.create_table(
        "newsletter_subscriptions",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("first_name", sa.String(length=100), nullable=True),
        sa.Column("last_name", sa.String(length=100), nullable=True),
        sa.Column("organization", sa.String(length=255), nullable=True),
        sa.Column("role", sa.String(length=64), nullable=True),
        sa.Column("interests", sa.String(length=512), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_newsletter_subscriptions_email", "newsletter_subscriptions", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_newsletter_subscriptions_email", table_name="newsletter_subscriptions")
    op.drop_table("newsletter_subscriptions")
    op.drop_index("ix_contact_messages_email", table_name="contact_messages")
    op.drop_table("contact_messages")
