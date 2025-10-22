"""add site settings table

Revision ID: 0012_site_settings
Revises: 0011_media_library
Create Date: 2025-10-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Text, Integer


# revision identifiers, used by Alembic.
revision = '0012_site_settings'
down_revision = '0011_media_library'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create site_settings table
    op.create_table(
        'site_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('setting_key', sa.String(100), nullable=False),
        sa.Column('setting_value', sa.Text(), nullable=False),
        sa.Column('setting_category', sa.String(50), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_by_user_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('setting_key'),
        sa.ForeignKeyConstraint(['updated_by_user_id'], ['users.id'], ondelete='SET NULL')
    )
    
    # Create index on setting_category for faster queries
    op.create_index('idx_setting_category', 'site_settings', ['setting_category'])
    
    # Insert default settings
    site_settings_table = table(
        'site_settings',
        column('setting_key', String),
        column('setting_value', Text),
        column('setting_category', String)
    )
    
    default_settings = [
        # Contact Settings
        {'setting_key': 'contact.phone', 'setting_value': '0705204870', 'setting_category': 'contact'},
        {'setting_key': 'contact.email', 'setting_value': 'info@stem-ed-architects.com', 'setting_category': 'contact'},
        {'setting_key': 'contact.location', 'setting_value': 'Nairobi, Kenya', 'setting_category': 'contact'},
        {'setting_key': 'contact.address', 'setting_value': 'Nairobi, Kenya', 'setting_category': 'contact'},
        
        # Social Media Settings
        {'setting_key': 'social.youtube', 'setting_value': '', 'setting_category': 'social'},
        {'setting_key': 'social.facebook', 'setting_value': '', 'setting_category': 'social'},
        {'setting_key': 'social.tiktok', 'setting_value': '', 'setting_category': 'social'},
        {'setting_key': 'social.instagram', 'setting_value': '', 'setting_category': 'social'},
        {'setting_key': 'social.linkedin', 'setting_value': '', 'setting_category': 'social'},
        {'setting_key': 'social.twitter', 'setting_value': '', 'setting_category': 'social'},
        
        # Business Hours Settings
        {'setting_key': 'hours.weekdays', 'setting_value': 'Monday - Friday: 9:00 AM - 5:00 PM', 'setting_category': 'hours'},
        {'setting_key': 'hours.saturday', 'setting_value': 'Saturday: 10:00 AM - 2:00 PM', 'setting_category': 'hours'},
        {'setting_key': 'hours.sunday', 'setting_value': 'Closed', 'setting_category': 'hours'},
        
        # SEO Settings
        {'setting_key': 'seo.site_title', 'setting_value': 'STEM-ED-ARCHITECTS - Building Future Innovators', 'setting_category': 'seo'},
        {'setting_key': 'seo.site_description', 'setting_value': 'Leading STEM education provider in Kenya offering robotics, coding, AI, and innovative learning solutions for schools and students.', 'setting_category': 'seo'},
        {'setting_key': 'seo.keywords', 'setting_value': 'STEM education, robotics, coding, Kenya, schools, AI, innovation, education technology', 'setting_category': 'seo'},
        
        # Company Settings
        {'setting_key': 'company.name', 'setting_value': 'STEM-ED-ARCHITECTS', 'setting_category': 'company'},
        {'setting_key': 'company.tagline', 'setting_value': 'Building Future Innovators', 'setting_category': 'company'},
        {'setting_key': 'company.founded_year', 'setting_value': '2020', 'setting_category': 'company'},
    ]
    
    op.bulk_insert(site_settings_table, default_settings)


def downgrade() -> None:
    op.drop_index('idx_setting_category', table_name='site_settings')
    op.drop_table('site_settings')
