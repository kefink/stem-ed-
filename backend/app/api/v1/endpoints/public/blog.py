from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostPublic


router = APIRouter()


@router.get("/posts", response_model=list[BlogPostPublic])
async def list_public_blog_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List published blog posts (public endpoint)"""
    query = db.query(BlogPost).filter(BlogPost.published == True)

    if category:
        query = query.filter(BlogPost.category == category)

    posts = (
        query.order_by(BlogPost.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Transform to public schema
    public_posts = []
    for post in posts:
        public_posts.append(
            BlogPostPublic(
                id=post.id,
                title=post.title,
                slug=post.slug,
                excerpt=post.excerpt,
                category=post.category,
                featured_image=post.featured_image,
                author_name=post.author.full_name if post.author else None,
                created_at=post.created_at,
                updated_at=post.updated_at,
            )
        )

    return public_posts


@router.get("/posts/{slug}")
async def get_public_blog_post(
    slug: str,
    db: Session = Depends(get_db),
):
    """Get a published blog post by slug (public endpoint)"""
    post = db.query(BlogPost).filter(
        BlogPost.slug == slug,
        BlogPost.published == True
    ).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )

    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "content": post.content,
        "excerpt": post.excerpt,
        "category": post.category,
        "featured_image": post.featured_image,
        "author_name": post.author.full_name if post.author else None,
        "author_email": post.author.email if post.author else None,
        "seo_title": post.seo_title,
        "seo_description": post.seo_description,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }
