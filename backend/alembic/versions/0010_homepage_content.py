"""create homepage content tables

Revision ID: 0010_homepage_content
Revises: 0009_create_blog_posts
Create Date: 2025-10-22 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0010_homepage_content'
down_revision: Union[str, None] = '0009_create_blog_posts'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Statistics table
    op.create_table(
        'homepage_statistics',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('label', sa.String(length=100), nullable=False),
        sa.Column('value', sa.String(length=50), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, default=0),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index('ix_statistics_order', 'homepage_statistics', ['order_index'])
    
    # Testimonials table
    op.create_table(
        'homepage_testimonials',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=255), nullable=False),
        sa.Column('organization', sa.String(length=255), nullable=True),
        sa.Column('quote', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, default=0),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index('ix_testimonials_order', 'homepage_testimonials', ['order_index'])
    
    # Featured Products table
    op.create_table(
        'homepage_featured_products',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('link_url', sa.String(length=500), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, default=0),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index('ix_featured_products_order', 'homepage_featured_products', ['order_index'])
    
    # Hero Slides table
    op.create_table(
        'homepage_hero_slides',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('subtitle', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('cta_text', sa.String(length=100), nullable=True),
        sa.Column('cta_link', sa.String(length=500), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, default=0),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index('ix_hero_slides_order', 'homepage_hero_slides', ['order_index'])
    
    # Mission/Vision/Identity table
    op.create_table(
        'homepage_mission_vision',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('section_type', sa.String(length=50), nullable=False),  # 'mission', 'vision', 'identity'
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index('ix_mission_vision_type', 'homepage_mission_vision', ['section_type'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_mission_vision_type', table_name='homepage_mission_vision')
    op.drop_table('homepage_mission_vision')
    
    op.drop_index('ix_hero_slides_order', table_name='homepage_hero_slides')
    op.drop_table('homepage_hero_slides')
    
    op.drop_index('ix_featured_products_order', table_name='homepage_featured_products')
    op.drop_table('homepage_featured_products')
    
    op.drop_index('ix_testimonials_order', table_name='homepage_testimonials')
    op.drop_table('homepage_testimonials')
    
    op.drop_index('ix_statistics_order', table_name='homepage_statistics')
    op.drop_table('homepage_statistics')
