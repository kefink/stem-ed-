from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.db.session import get_db
from app.models.media import MediaFile, MediaFolder
from app.models.user import User
from app.schemas.media import (
    FolderCreate, FolderUpdate, FolderResponse, FoldersListResponse,
    FileUpdate, FileResponse, FilesListResponse
)
from app.api.deps import get_current_user
from app.core.file_storage import save_upload_file, delete_file, get_folder_path


router = APIRouter()


# ===== FOLDER ENDPOINTS =====
@router.get("/folders", response_model=FoldersListResponse)
async def list_folders(
    parent_folder_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all folders or subfolders (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    query = db.query(MediaFolder)
    
    if parent_folder_id:
        query = query.filter(MediaFolder.parent_folder_id == parent_folder_id)
    else:
        query = query.filter(MediaFolder.parent_folder_id.is_(None))
    
    folders = query.order_by(MediaFolder.name).all()
    
    # Add file and subfolder counts
    folders_with_counts = []
    for folder in folders:
        file_count = db.query(func.count(MediaFile.id)).filter(MediaFile.folder_id == folder.id).scalar()
        subfolder_count = db.query(func.count(MediaFolder.id)).filter(MediaFolder.parent_folder_id == folder.id).scalar()
        
        folder_dict = {
            "id": folder.id,
            "name": folder.name,
            "parent_folder_id": folder.parent_folder_id,
            "created_at": folder.created_at,
            "created_by_user_id": folder.created_by_user_id,
            "file_count": file_count,
            "subfolder_count": subfolder_count
        }
        folders_with_counts.append(FolderResponse(**folder_dict))
    
    return FoldersListResponse(items=folders_with_counts, total=len(folders_with_counts))


@router.post("/folders", response_model=FolderResponse, status_code=status.HTTP_201_CREATED)
async def create_folder(
    data: FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new folder (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Check if parent folder exists
    if data.parent_folder_id:
        parent = db.query(MediaFolder).filter(MediaFolder.id == data.parent_folder_id).first()
        if not parent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent folder not found")
    
    # Create folder
    folder = MediaFolder(
        name=data.name,
        parent_folder_id=data.parent_folder_id,
        created_by_user_id=current_user.id
    )
    db.add(folder)
    db.commit()
    db.refresh(folder)
    
    return FolderResponse(
        id=folder.id,
        name=folder.name,
        parent_folder_id=folder.parent_folder_id,
        created_at=folder.created_at,
        created_by_user_id=folder.created_by_user_id,
        file_count=0,
        subfolder_count=0
    )


@router.put("/folders/{folder_id}", response_model=FolderResponse)
async def update_folder(
    folder_id: int,
    data: FolderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a folder (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    folder = db.query(MediaFolder).filter(MediaFolder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
    
    # Update fields
    if data.name is not None:
        folder.name = data.name
    if data.parent_folder_id is not None:
        # Prevent circular reference
        if data.parent_folder_id == folder_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot set folder as its own parent")
        folder.parent_folder_id = data.parent_folder_id
    
    db.commit()
    db.refresh(folder)
    
    file_count = db.query(func.count(MediaFile.id)).filter(MediaFile.folder_id == folder.id).scalar()
    subfolder_count = db.query(func.count(MediaFolder.id)).filter(MediaFolder.parent_folder_id == folder.id).scalar()
    
    return FolderResponse(
        id=folder.id,
        name=folder.name,
        parent_folder_id=folder.parent_folder_id,
        created_at=folder.created_at,
        created_by_user_id=folder.created_by_user_id,
        file_count=file_count,
        subfolder_count=subfolder_count
    )


@router.delete("/folders/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_folder(
    folder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a folder (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    folder = db.query(MediaFolder).filter(MediaFolder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")
    
    # Check if folder has files or subfolders
    file_count = db.query(func.count(MediaFile.id)).filter(MediaFile.folder_id == folder.id).scalar()
    subfolder_count = db.query(func.count(MediaFolder.id)).filter(MediaFolder.parent_folder_id == folder.id).scalar()
    
    if file_count > 0 or subfolder_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete folder with files or subfolders. Delete contents first."
        )
    
    db.delete(folder)
    db.commit()
    return None


# ===== FILE ENDPOINTS =====
@router.post("/upload", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    folder_id: Optional[int] = None,
    alt_text: Optional[str] = None,
    title: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a file (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Get folder path if folder_id provided
    folder_path = get_folder_path(folder_id, db) if folder_id else None
    
    # Save file to disk
    try:
        file_info = await save_upload_file(file, folder_path)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )
    
    # Create database record
    media_file = MediaFile(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_url=file_info["file_url"],
        file_type=file_info["file_type"],
        mime_type=file_info["mime_type"],
        file_size=file_info["file_size"],
        width=file_info["width"],
        height=file_info["height"],
        folder_id=folder_id,
        alt_text=alt_text,
        title=title or file_info["original_filename"],
        description=description,
        uploaded_by_user_id=current_user.id
    )
    
    db.add(media_file)
    db.commit()
    db.refresh(media_file)
    
    return media_file


@router.get("/files", response_model=FilesListResponse)
async def list_files(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    folder_id: Optional[int] = None,
    file_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all files with pagination and filters (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    query = db.query(MediaFile)
    
    # Apply filters
    if folder_id is not None:
        if folder_id == 0:  # Root folder (no folder)
            query = query.filter(MediaFile.folder_id.is_(None))
        else:
            query = query.filter(MediaFile.folder_id == folder_id)
    
    if file_type:
        query = query.filter(MediaFile.file_type == file_type)
    
    if search:
        query = query.filter(
            (MediaFile.original_filename.ilike(f"%{search}%")) |
            (MediaFile.title.ilike(f"%{search}%")) |
            (MediaFile.description.ilike(f"%{search}%"))
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    files = query.order_by(MediaFile.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    total_pages = (total + page_size - 1) // page_size
    
    return FilesListResponse(
        items=files,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/files/{file_id}", response_model=FileResponse)
async def get_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get file details (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    file = db.query(MediaFile).filter(MediaFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    return file


@router.put("/files/{file_id}", response_model=FileResponse)
async def update_file(
    file_id: int,
    data: FileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update file metadata (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    file = db.query(MediaFile).filter(MediaFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(file, field, value)
    
    db.commit()
    db.refresh(file)
    
    return file


@router.delete("/files/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file_endpoint(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a file (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    file = db.query(MediaFile).filter(MediaFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    # Delete physical file
    delete_file(file.file_path)
    
    # Delete database record
    db.delete(file)
    db.commit()
    
    return None
