"""create blog posts table

Revision ID: 0009_create_blog_posts
Revises: 0008_add_two_factor_auth
Create Date: 2025-10-22 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '0009_create_blog_posts'
down_revision: Union[str, None] = '0008_add_two_factor_auth'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'blog_posts',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False, unique=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('excerpt', sa.Text(), nullable=True),
        sa.Column('author_id', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
        sa.Column('published', sa.Boolean(), default=False, nullable=False),
        sa.Column('seo_title', sa.String(length=255), nullable=True),
        sa.Column('seo_description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'], ondelete='CASCADE'),
    )
    
    # Create index on slug for faster lookups
    op.create_index('ix_blog_posts_slug', 'blog_posts', ['slug'])
    # Create index on published for filtering
    op.create_index('ix_blog_posts_published', 'blog_posts', ['published'])
    # Create index on category for filtering
    op.create_index('ix_blog_posts_category', 'blog_posts', ['category'])
    # Create index on created_at for sorting
    op.create_index('ix_blog_posts_created_at', 'blog_posts', ['created_at'])


def downgrade() -> None:
    op.drop_index('ix_blog_posts_created_at', table_name='blog_posts')
    op.drop_index('ix_blog_posts_category', table_name='blog_posts')
    op.drop_index('ix_blog_posts_published', table_name='blog_posts')
    op.drop_index('ix_blog_posts_slug', table_name='blog_posts')
    op.drop_table('blog_posts')
