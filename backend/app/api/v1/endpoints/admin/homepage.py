from fastapi import APIRouter, Depends, HTTPException, status
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
from app.models.user import User
from app.schemas.homepage import (
    StatisticCreate, StatisticUpdate, StatisticResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse,
    FeaturedProductCreate, FeaturedProductUpdate, FeaturedProductResponse,
    HeroSlideCreate, HeroSlideUpdate, HeroSlideResponse,
    MissionVisionCreate, MissionVisionUpdate, MissionVisionResponse,
)
from app.api.deps import get_current_user


router = APIRouter()


# ===== STATISTICS ENDPOINTS =====
@router.get("/statistics", response_model=List[StatisticResponse])
async def list_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all statistics (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    stats = db.query(HomepageStatistic).order_by(HomepageStatistic.order_index).all()
    return stats


@router.post("/statistics", response_model=StatisticResponse, status_code=status.HTTP_201_CREATED)
async def create_statistic(data: StatisticCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new statistic (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    stat = HomepageStatistic(**data.model_dump())
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat


@router.put("/statistics/{stat_id}", response_model=StatisticResponse)
async def update_statistic(stat_id: int, data: StatisticUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a statistic (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    stat = db.query(HomepageStatistic).filter(HomepageStatistic.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Statistic not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stat, field, value)
    
    db.commit()
    db.refresh(stat)
    return stat


@router.delete("/statistics/{stat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_statistic(stat_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a statistic (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    stat = db.query(HomepageStatistic).filter(HomepageStatistic.id == stat_id).first()
    if not stat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Statistic not found")
    
    db.delete(stat)
    db.commit()
    return None


# ===== TESTIMONIALS ENDPOINTS =====
@router.get("/testimonials", response_model=List[TestimonialResponse])
async def list_testimonials(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all testimonials (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    testimonials = db.query(HomepageTestimonial).order_by(HomepageTestimonial.order_index).all()
    return testimonials


@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(data: TestimonialCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new testimonial (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    testimonial = HomepageTestimonial(**data.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(testimonial_id: int, data: TestimonialUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a testimonial (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    testimonial = db.query(HomepageTestimonial).filter(HomepageTestimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)
    
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a testimonial (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    testimonial = db.query(HomepageTestimonial).filter(HomepageTestimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    
    db.delete(testimonial)
    db.commit()
    return None


# ===== FEATURED PRODUCTS ENDPOINTS =====
@router.get("/featured-products", response_model=List[FeaturedProductResponse])
async def list_featured_products(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all featured products (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    products = db.query(HomepageFeaturedProduct).order_by(HomepageFeaturedProduct.order_index).all()
    return products


@router.post("/featured-products", response_model=FeaturedProductResponse, status_code=status.HTTP_201_CREATED)
async def create_featured_product(data: FeaturedProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new featured product (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    product = HomepageFeaturedProduct(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/featured-products/{product_id}", response_model=FeaturedProductResponse)
async def update_featured_product(product_id: int, data: FeaturedProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a featured product (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    product = db.query(HomepageFeaturedProduct).filter(HomepageFeaturedProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/featured-products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_featured_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a featured product (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    product = db.query(HomepageFeaturedProduct).filter(HomepageFeaturedProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None


# ===== HERO SLIDES ENDPOINTS =====
@router.get("/hero-slides", response_model=List[HeroSlideResponse])
async def list_hero_slides(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all hero slides (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    slides = db.query(HomepageHeroSlide).order_by(HomepageHeroSlide.order_index).all()
    return slides


@router.post("/hero-slides", response_model=HeroSlideResponse, status_code=status.HTTP_201_CREATED)
async def create_hero_slide(data: HeroSlideCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new hero slide (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    slide = HomepageHeroSlide(**data.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


@router.put("/hero-slides/{slide_id}", response_model=HeroSlideResponse)
async def update_hero_slide(slide_id: int, data: HeroSlideUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a hero slide (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    slide = db.query(HomepageHeroSlide).filter(HomepageHeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(slide, field, value)
    
    db.commit()
    db.refresh(slide)
    return slide


@router.delete("/hero-slides/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hero_slide(slide_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a hero slide (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    slide = db.query(HomepageHeroSlide).filter(HomepageHeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    
    db.delete(slide)
    db.commit()
    return None


# ===== MISSION/VISION ENDPOINTS =====
@router.get("/mission-vision", response_model=List[MissionVisionResponse])
async def list_mission_vision(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all mission/vision/identity sections (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    sections = db.query(HomepageMissionVision).all()
    return sections


@router.put("/mission-vision/{section_type}", response_model=MissionVisionResponse)
async def update_mission_vision(section_type: str, data: MissionVisionUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update a mission/vision/identity section (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if section_type not in ['mission', 'vision', 'identity']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid section type")
    
    section = db.query(HomepageMissionVision).filter(HomepageMissionVision.section_type == section_type).first()
    
    if not section:
        # Create if doesn't exist
        section = HomepageMissionVision(
            section_type=section_type,
            title=data.title or section_type.capitalize(),
            content=data.content or "",
            icon=data.icon
        )
        db.add(section)
    else:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(section, field, value)
    
    db.commit()
    db.refresh(section)
    return section
