from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.blog_post import BlogPost
from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription
from app.models.media import MediaFile

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require admin role"""
    if current_user.role != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Dict[str, Any]:
    """
    Get comprehensive dashboard statistics.
    Requires admin authentication.
    """
    
    # Calculate date ranges
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)
    seven_days_ago = now - timedelta(days=7)
    
    # User Statistics
    total_users = db.query(func.count(User.id)).scalar() or 0
    users_last_30_days = db.query(func.count(User.id)).filter(
        User.created_at >= thirty_days_ago
    ).scalar() or 0
    users_last_7_days = db.query(func.count(User.id)).filter(
        User.created_at >= seven_days_ago
    ).scalar() or 0
    admin_users = db.query(func.count(User.id)).filter(
        User.role == "admin"
    ).scalar() or 0
    verified_users = db.query(func.count(User.id)).filter(
        User.is_verified == True
    ).scalar() or 0
    
    # Blog Statistics
    total_blog_posts = db.query(func.count(BlogPost.id)).scalar() or 0
    published_posts = db.query(func.count(BlogPost.id)).filter(
        BlogPost.published == True
    ).scalar() or 0
    draft_posts = total_blog_posts - published_posts
    posts_last_30_days = db.query(func.count(BlogPost.id)).filter(
        BlogPost.created_at >= thirty_days_ago
    ).scalar() or 0
    
    # Get recent blog posts
    recent_posts = db.query(BlogPost).order_by(desc(BlogPost.created_at)).limit(5).all()
    recent_posts_data = [{
        "id": post.id,
        "title": post.title,
        "published": post.published,
        "created_at": post.created_at.isoformat() if post.created_at else None
    } for post in recent_posts]
    
    # Contact Messages Statistics
    total_messages = db.query(func.count(ContactMessage.id)).scalar() or 0
    messages_last_30_days = db.query(func.count(ContactMessage.id)).filter(
        ContactMessage.created_at >= thirty_days_ago
    ).scalar() or 0
    messages_last_7_days = db.query(func.count(ContactMessage.id)).filter(
        ContactMessage.created_at >= seven_days_ago
    ).scalar() or 0
    
    # Get recent messages
    recent_messages = db.query(ContactMessage).order_by(
        desc(ContactMessage.created_at)
    ).limit(5).all()
    recent_messages_data = [{
        "id": msg.id,
        "name": msg.name,
        "email": msg.email,
        "service": msg.service,
        "created_at": msg.created_at.isoformat() if msg.created_at else None
    } for msg in recent_messages]
    
    # Newsletter Statistics
    total_subscribers = db.query(func.count(NewsletterSubscription.id)).scalar() or 0
    subscribers_last_30_days = db.query(func.count(NewsletterSubscription.id)).filter(
        NewsletterSubscription.created_at >= thirty_days_ago
    ).scalar() or 0
    subscribers_last_7_days = db.query(func.count(NewsletterSubscription.id)).filter(
        NewsletterSubscription.created_at >= seven_days_ago
    ).scalar() or 0
    
    # Media Library Statistics
    total_media_files = db.query(func.count(MediaFile.id)).scalar() or 0
    total_media_size = db.query(func.sum(MediaFile.file_size)).scalar() or 0
    image_files = db.query(func.count(MediaFile.id)).filter(
        MediaFile.file_type == "image"
    ).scalar() or 0
    document_files = db.query(func.count(MediaFile.id)).filter(
        MediaFile.file_type == "document"
    ).scalar() or 0
    
    # Format media size in MB
    total_media_size_mb = round((total_media_size or 0) / (1024 * 1024), 2)
    
    # Popular blog categories
    category_stats = db.query(
        BlogPost.category,
        func.count(BlogPost.id).label('count')
    ).filter(
        BlogPost.category.isnot(None),
        BlogPost.published == True
    ).group_by(BlogPost.category).all()
    
    categories_data = [
        {"category": cat, "count": count}
        for cat, count in category_stats
    ]
    
    # Service request breakdown from contact messages
    service_stats = db.query(
        ContactMessage.service,
        func.count(ContactMessage.id).label('count')
    ).filter(
        ContactMessage.service.isnot(None)
    ).group_by(ContactMessage.service).all()
    
    services_data = [
        {"service": srv, "count": count}
        for srv, count in service_stats
    ]
    
    return {
        "users": {
            "total": total_users,
            "last_30_days": users_last_30_days,
            "last_7_days": users_last_7_days,
            "admin_count": admin_users,
            "verified_count": verified_users,
            "verification_rate": round((verified_users / total_users * 100) if total_users > 0 else 0, 1)
        },
        "blog": {
            "total": total_blog_posts,
            "published": published_posts,
            "drafts": draft_posts,
            "last_30_days": posts_last_30_days,
            "recent_posts": recent_posts_data,
            "categories": categories_data
        },
        "messages": {
            "total": total_messages,
            "last_30_days": messages_last_30_days,
            "last_7_days": messages_last_7_days,
            "recent": recent_messages_data,
            "by_service": services_data
        },
        "newsletter": {
            "total": total_subscribers,
            "last_30_days": subscribers_last_30_days,
            "last_7_days": subscribers_last_7_days
        },
        "media": {
            "total_files": total_media_files,
            "total_size_mb": total_media_size_mb,
            "images": image_files,
            "documents": document_files
        },
        "growth_trends": {
            "users_weekly": users_last_7_days,
            "users_monthly": users_last_30_days,
            "messages_weekly": messages_last_7_days,
            "messages_monthly": messages_last_30_days,
            "subscribers_weekly": subscribers_last_7_days,
            "subscribers_monthly": subscribers_last_30_days
        }
    }


@router.get("/activity-log")
async def get_activity_log(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Get recent activity across the platform.
    Requires admin authentication.
    """
    
    activities = []
    
    # Recent users
    recent_users = db.query(User).order_by(desc(User.created_at)).limit(10).all()
    for user in recent_users:
        activities.append({
            "type": "user_registered",
            "description": f"New user registered: {user.email}",
            "timestamp": user.created_at.isoformat() if user.created_at else None,
            "user_email": user.email
        })
    
    # Recent blog posts
    recent_posts = db.query(BlogPost).order_by(desc(BlogPost.created_at)).limit(10).all()
    for post in recent_posts:
        activities.append({
            "type": "blog_post_created",
            "description": f"Blog post {'published' if post.published else 'created'}: {post.title}",
            "timestamp": post.created_at.isoformat() if post.created_at else None,
            "post_id": post.id
        })
    
    # Recent contact messages
    recent_messages = db.query(ContactMessage).order_by(desc(ContactMessage.created_at)).limit(10).all()
    for msg in recent_messages:
        activities.append({
            "type": "contact_message",
            "description": f"New message from {msg.name} ({msg.service})",
            "timestamp": msg.created_at.isoformat() if msg.created_at else None,
            "message_id": msg.id
        })
    
    # Recent newsletter subscriptions
    recent_subs = db.query(NewsletterSubscription).order_by(desc(NewsletterSubscription.created_at)).limit(10).all()
    for sub in recent_subs:
        name = f"{sub.first_name} {sub.last_name}".strip() or sub.email
        activities.append({
            "type": "newsletter_subscription",
            "description": f"New newsletter subscriber: {name}",
            "timestamp": sub.created_at.isoformat() if sub.created_at else None,
            "subscriber_id": sub.id
        })
    
    # Sort all activities by timestamp
    activities.sort(key=lambda x: x['timestamp'] or '', reverse=True)
    
    return activities[:limit]
