from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SiteSettingBase(BaseModel):
    setting_key: str = Field(..., max_length=100)
    setting_value: str
    setting_category: str = Field(..., max_length=50)


class SiteSettingCreate(SiteSettingBase):
    pass


class SiteSettingUpdate(BaseModel):
    setting_value: str


class SiteSettingResponse(SiteSettingBase):
    id: int
    updated_at: datetime
    updated_by_user_id: Optional[int] = None

    class Config:
        from_attributes = True


class SettingsGroupResponse(BaseModel):
    """Grouped settings by category"""
    contact: dict[str, str] = {}
    social: dict[str, str] = {}
    hours: dict[str, str] = {}
    seo: dict[str, str] = {}
    company: dict[str, str] = {}


class SettingsUpdateRequest(BaseModel):
    """Request body for updating multiple settings"""
    contact: Optional[dict[str, str]] = None
    social: Optional[dict[str, str]] = None
    hours: Optional[dict[str, str]] = None
    seo: Optional[dict[str, str]] = None
    company: Optional[dict[str, str]] = None
