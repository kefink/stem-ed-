from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.site_settings import SiteSetting
from app.schemas.site_settings import (
    SiteSettingResponse,
    SettingsGroupResponse,
    SettingsUpdateRequest
)

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require admin role"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/settings", response_model=SettingsGroupResponse)
async def get_all_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get all site settings grouped by category.
    Requires admin authentication.
    """
    settings = db.query(SiteSetting).all()
    
    # Group settings by category
    grouped_settings = {
        "contact": {},
        "social": {},
        "hours": {},
        "seo": {},
        "company": {}
    }
    
    for setting in settings:
        category = setting.setting_category
        # Extract the key after the category prefix (e.g., "contact.phone" -> "phone")
        key_parts = setting.setting_key.split(".", 1)
        if len(key_parts) == 2:
            key = key_parts[1]
        else:
            key = setting.setting_key
        
        if category in grouped_settings:
            grouped_settings[category][key] = setting.setting_value
    
    return SettingsGroupResponse(**grouped_settings)


@router.put("/settings")
async def update_settings(
    settings_update: SettingsUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Update site settings.
    Requires admin authentication.
    """
    updated_count = 0
    
    # Map of category to settings dict
    category_map = {
        "contact": settings_update.contact,
        "social": settings_update.social,
        "hours": settings_update.hours,
        "seo": settings_update.seo,
        "company": settings_update.company
    }
    
    for category, settings_dict in category_map.items():
        if settings_dict is not None:
            for key, value in settings_dict.items():
                # Construct the full setting key (e.g., "contact.phone")
                setting_key = f"{category}.{key}"
                
                # Find and update the setting
                setting = db.query(SiteSetting).filter(
                    SiteSetting.setting_key == setting_key
                ).first()
                
                if setting:
                    setting.setting_value = value
                    setting.updated_by_user_id = current_user.id
                    updated_count += 1
                else:
                    # Create new setting if it doesn't exist
                    new_setting = SiteSetting(
                        setting_key=setting_key,
                        setting_value=value,
                        setting_category=category,
                        updated_by_user_id=current_user.id
                    )
                    db.add(new_setting)
                    updated_count += 1
    
    db.commit()
    
    return {
        "message": f"Successfully updated {updated_count} settings",
        "updated_count": updated_count
    }


@router.get("/settings/raw", response_model=List[SiteSettingResponse])
async def get_all_settings_raw(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get all site settings as raw list (for debugging).
    Requires admin authentication.
    """
    settings = db.query(SiteSetting).all()
    return settings
