from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


# Statistics Schemas
class StatisticBase(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    value: str = Field(..., min_length=1, max_length=50)
    icon: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class StatisticCreate(StatisticBase):
    pass


class StatisticUpdate(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    icon: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class StatisticResponse(StatisticBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Testimonials Schemas
class TestimonialBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=255)
    organization: Optional[str] = None
    quote: str = Field(..., min_length=1)
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    organization: Optional[str] = None
    quote: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Featured Products Schemas
class FeaturedProductBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = None
    link_url: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class FeaturedProductCreate(FeaturedProductBase):
    pass


class FeaturedProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    link_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class FeaturedProductResponse(FeaturedProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Hero Slides Schemas
class HeroSlideBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class HeroSlideCreate(HeroSlideBase):
    pass


class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class HeroSlideResponse(HeroSlideBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Mission/Vision Schemas
class MissionVisionBase(BaseModel):
    section_type: str = Field(..., pattern="^(mission|vision|identity)$")
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    icon: Optional[str] = None


class MissionVisionCreate(MissionVisionBase):
    pass


class MissionVisionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    icon: Optional[str] = None


class MissionVisionResponse(MissionVisionBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
