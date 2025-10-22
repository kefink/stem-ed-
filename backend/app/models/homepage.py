from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class HomepageStatistic(Base):
    __tablename__ = "homepage_statistics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    label = Column(String(100), nullable=False)
    value = Column(String(50), nullable=False)
    icon = Column(String(50), nullable=True)
    order_index = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class HomepageTestimonial(Base):
    __tablename__ = "homepage_testimonials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    quote = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)
    image_url = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class HomepageFeaturedProduct(Base):
    __tablename__ = "homepage_featured_products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=True)
    link_url = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class HomepageHeroSlide(Base):
    __tablename__ = "homepage_hero_slides"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    cta_text = Column(String(100), nullable=True)
    cta_link = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False, default=0, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class HomepageMissionVision(Base):
    __tablename__ = "homepage_mission_vision"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    section_type = Column(String(50), nullable=False, unique=True, index=True)  # 'mission', 'vision', 'identity'
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    icon = Column(String(50), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
