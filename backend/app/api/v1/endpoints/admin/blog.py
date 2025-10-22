from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional

from app.db.session import get_db
from app.models.blog_post import BlogPost
from app.models.user import User
from app.schemas.blog_post import (
    BlogPostCreate,
    BlogPostUpdate,
    BlogPostResponse,
    BlogPostsListResponse,
    BlogPostPublic,
)
from app.api.deps import get_current_user


router = APIRouter()


def generate_unique_slug(db: Session, base_slug: str, post_id: Optional[int] = None) -> str:
    """Generate a unique slug by appending numbers if necessary"""
    slug = base_slug
    counter = 1
    
    while True:
        query = db.query(BlogPost).filter(BlogPost.slug == slug)
        if post_id:
            query = query.filter(BlogPost.id != post_id)
        
        if not query.first():
            return slug
        
        slug = f"{base_slug}-{counter}"
        counter += 1


@router.get("/posts", response_model=BlogPostsListResponse)
async def list_blog_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    published: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all blog posts (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access blog posts"
        )

    # Build query
    query = db.query(BlogPost)

    # Apply filters
    if search:
        query = query.filter(
            or_(
                BlogPost.title.ilike(f"%{search}%"),
                BlogPost.content.ilike(f"%{search}%"),
                BlogPost.excerpt.ilike(f"%{search}%"),
            )
        )
    
    if category:
        query = query.filter(BlogPost.category == category)
    
    if published is not None:
        query = query.filter(BlogPost.published == published)

    # Get total count
    total = query.count()

    # Apply pagination
    posts = (
        query.order_by(BlogPost.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    total_pages = (total + page_size - 1) // page_size

    return BlogPostsListResponse(
        posts=posts,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/posts", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post_data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new blog post (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create blog posts"
        )

    # Ensure slug is unique
    unique_slug = generate_unique_slug(db, post_data.slug)

    # Create blog post
    new_post = BlogPost(
        title=post_data.title,
        slug=unique_slug,
        content=post_data.content,
        excerpt=post_data.excerpt,
        category=post_data.category,
        featured_image=post_data.featured_image,
        published=post_data.published,
        seo_title=post_data.seo_title,
        seo_description=post_data.seo_description,
        author_id=current_user.id,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.get("/posts/{post_id}", response_model=BlogPostResponse)
async def get_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific blog post by ID (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access blog posts"
        )

    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    return post


@router.put("/posts/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: int,
    post_data: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a blog post (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update blog posts"
        )

    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    # Update fields
    update_data = post_data.model_dump(exclude_unset=True)
    
    # If slug is being updated, ensure it's unique
    if "slug" in update_data:
        update_data["slug"] = generate_unique_slug(db, update_data["slug"], post_id)

    for field, value in update_data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)

    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a blog post (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete blog posts"
        )

    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    db.delete(post)
    db.commit()

    return None


@router.get("/categories", response_model=list[str])
async def list_categories(
    db: Session = Depends(get_db),
):
    """Get list of all unique categories"""
    categories = (
        db.query(BlogPost.category)
        .filter(BlogPost.category.isnot(None))
        .distinct()
        .all()
    )
    return [cat[0] for cat in categories if cat[0]]
