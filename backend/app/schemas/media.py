from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ===== FOLDER SCHEMAS =====
class FolderBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    parent_folder_id: Optional[int] = None


class FolderCreate(FolderBase):
    pass


class FolderUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    parent_folder_id: Optional[int] = None


class FolderResponse(FolderBase):
    id: int
    created_at: datetime
    created_by_user_id: int
    file_count: int = 0
    subfolder_count: int = 0

    class Config:
        from_attributes = True


# ===== FILE SCHEMAS =====
class FileBase(BaseModel):
    folder_id: Optional[int] = None
    alt_text: Optional[str] = Field(None, max_length=255)
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None


class FileCreate(FileBase):
    pass


class FileUpdate(BaseModel):
    folder_id: Optional[int] = None
    alt_text: Optional[str] = Field(None, max_length=255)
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None


class FileResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_path: str
    file_url: str
    file_type: str
    mime_type: str
    file_size: int
    width: Optional[int]
    height: Optional[int]
    folder_id: Optional[int]
    alt_text: Optional[str]
    title: Optional[str]
    description: Optional[str]
    uploaded_by_user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FilesListResponse(BaseModel):
    items: List[FileResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class FoldersListResponse(BaseModel):
    items: List[FolderResponse]
    total: int
