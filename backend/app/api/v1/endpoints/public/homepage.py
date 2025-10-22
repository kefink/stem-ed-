from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.homepage import (
    HomepageStatistic,
    HomepageTestimonial,
    HomepageFeaturedProduct,
    HomepageHeroSlide,
    HomepageMissionVision,
)
from app.schemas.homepage import (
    StatisticResponse,
    TestimonialResponse,
    FeaturedProductResponse,
    HeroSlideResponse,
    MissionVisionResponse,
)


router = APIRouter()


@router.get("/statistics", response_model=List[StatisticResponse])
async def get_active_statistics(db: Session = Depends(get_db)):
    """Get all active statistics for homepage"""
    stats = db.query(HomepageStatistic)\
        .filter(HomepageStatistic.is_active == True)\
        .order_by(HomepageStatistic.order_index)\
        .all()
    return stats


@router.get("/testimonials", response_model=List[TestimonialResponse])
async def get_active_testimonials(db: Session = Depends(get_db)):
    """Get all active testimonials for homepage"""
    testimonials = db.query(HomepageTestimonial)\
        .filter(HomepageTestimonial.is_active == True)\
        .order_by(HomepageTestimonial.order_index)\
        .all()
    return testimonials


@router.get("/featured-products", response_model=List[FeaturedProductResponse])
async def get_active_featured_products(db: Session = Depends(get_db)):
    """Get all active featured products for homepage"""
    products = db.query(HomepageFeaturedProduct)\
        .filter(HomepageFeaturedProduct.is_active == True)\
        .order_by(HomepageFeaturedProduct.order_index)\
        .all()
    return products


@router.get("/hero-slides", response_model=List[HeroSlideResponse])
async def get_active_hero_slides(db: Session = Depends(get_db)):
    """Get all active hero slides for homepage"""
    slides = db.query(HomepageHeroSlide)\
        .filter(HomepageHeroSlide.is_active == True)\
        .order_by(HomepageHeroSlide.order_index)\
        .all()
    return slides


@router.get("/mission-vision", response_model=List[MissionVisionResponse])
async def get_mission_vision(db: Session = Depends(get_db)):
    """Get mission, vision, and identity sections for homepage"""
    sections = db.query(HomepageMissionVision).all()
    return sections
