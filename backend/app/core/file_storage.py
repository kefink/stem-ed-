import os
import uuid
import shutil
from pathlib import Path
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException, status
from PIL import Image
import mimetypes

# Configuration
UPLOAD_DIR = Path("uploads/media")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_DOCUMENT_TYPES

# Ensure upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_file_type(mime_type: str) -> str:
    """Determine file type category from MIME type"""
    if mime_type.startswith("image/"):
        return "image"
    elif mime_type.startswith("video/"):
        return "video"
    elif mime_type in ALLOWED_DOCUMENT_TYPES:
        return "document"
    else:
        return "other"


def validate_file(file: UploadFile) -> None:
    """Validate file size and type"""
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    # Check file type
    mime_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
    
    if mime_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: images and PDF documents"
        )


def generate_unique_filename(original_filename: str) -> str:
    """Generate unique filename while preserving extension"""
    ext = Path(original_filename).suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    return unique_name


def get_image_dimensions(file_path: Path) -> Optional[Tuple[int, int]]:
    """Get image dimensions if file is an image"""
    try:
        with Image.open(file_path) as img:
            return img.size  # (width, height)
    except Exception:
        return None


async def save_upload_file(
    file: UploadFile,
    folder_path: Optional[str] = None
) -> dict:
    """
    Save uploaded file to disk and return file info
    
    Returns:
        dict: File information including path, size, dimensions, etc.
    """
    # Validate file
    validate_file(file)
    
    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename)
    
    # Determine save path
    if folder_path:
        save_dir = UPLOAD_DIR / folder_path
        save_dir.mkdir(parents=True, exist_ok=True)
        file_path = save_dir / unique_filename
        relative_path = f"{folder_path}/{unique_filename}"
    else:
        file_path = UPLOAD_DIR / unique_filename
        relative_path = unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    finally:
        file.file.close()
    
    # Get file info
    file_size = file_path.stat().st_size
    mime_type = file.content_type or mimetypes.guess_type(file.filename)[0] or "application/octet-stream"
    file_type = get_file_type(mime_type)
    
    # Get image dimensions if applicable
    width, height = None, None
    if file_type == "image":
        dimensions = get_image_dimensions(file_path)
        if dimensions:
            width, height = dimensions
    
    # Generate URL (relative to static serve path)
    file_url = f"/uploads/media/{relative_path}"
    
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": str(file_path),
        "file_url": file_url,
        "file_type": file_type,
        "mime_type": mime_type,
        "file_size": file_size,
        "width": width,
        "height": height,
    }


def delete_file(file_path: str) -> bool:
    """Delete a file from disk"""
    try:
        path = Path(file_path)
        if path.exists() and path.is_file():
            path.unlink()
            return True
        return False
    except Exception:
        return False


def get_folder_path(folder_id: Optional[int], db) -> Optional[str]:
    """Get folder path for organizing uploads"""
    if not folder_id:
        return None
    
    from app.models.media import MediaFolder
    folder = db.query(MediaFolder).filter(MediaFolder.id == folder_id).first()
    
    if not folder:
        return None
    
    # Build path from folder hierarchy
    path_parts = [folder.name]
    current_folder = folder
    
    while current_folder.parent_folder_id:
        current_folder = db.query(MediaFolder).filter(
            MediaFolder.id == current_folder.parent_folder_id
        ).first()
        if current_folder:
            path_parts.insert(0, current_folder.name)
        else:
            break
    
    return "/".join(path_parts)
