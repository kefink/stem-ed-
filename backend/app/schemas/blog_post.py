from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


# Base schema with common fields
class BlogPostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    published: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


# Schema for creating a new blog post
class BlogPostCreate(BlogPostBase):
    pass


# Schema for updating a blog post
class BlogPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    published: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


# Schema for author information
class BlogPostAuthor(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


# Schema for blog post response
class BlogPostResponse(BlogPostBase):
    id: int
    author_id: int
    author: BlogPostAuthor
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema for public blog post listing (no author details)
class BlogPostPublic(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    author_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema for paginated blog posts
class BlogPostsListResponse(BaseModel):
    posts: list[BlogPostResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
