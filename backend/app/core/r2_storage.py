"""
Cloudflare R2 Storage Integration
S3-compatible object storage with zero egress fees
"""
import uuid
import io
from typing import Optional, BinaryIO
from pathlib import Path

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile, HTTPException

from app.core.config import settings


class R2Storage:
    """Cloudflare R2 storage client using boto3 S3-compatible API"""

    def __init__(self):
        """Initialize R2 client with credentials from settings"""
        if not all([
            settings.R2_ENDPOINT,
            settings.R2_ACCESS_KEY,
            settings.R2_SECRET_KEY,
            settings.R2_BUCKET_NAME
        ]):
            raise ValueError(
                "R2 credentials not configured. Please set R2_ENDPOINT, "
                "R2_ACCESS_KEY, R2_SECRET_KEY, and R2_BUCKET_NAME in .env"
            )

        # Initialize S3-compatible client for R2
        self.client = boto3.client(
            's3',
            endpoint_url=settings.R2_ENDPOINT,
            aws_access_key_id=settings.R2_ACCESS_KEY,
            aws_secret_access_key=settings.R2_SECRET_KEY,
            config=Config(
                signature_version='s3v4',
                region_name='auto'  # R2 uses 'auto' region
            )
        )
        self.bucket_name = settings.R2_BUCKET_NAME
        self.public_url = settings.R2_PUBLIC_URL

    def upload_file(
        self,
        file: UploadFile,
        folder_path: Optional[str] = None,
        custom_filename: Optional[str] = None
    ) -> dict:
        """
        Upload a file to R2 storage

        Args:
            file: FastAPI UploadFile object
            folder_path: Optional folder path in bucket (e.g., 'products', 'blog')
            custom_filename: Optional custom filename (otherwise generates UUID)

        Returns:
            dict with file metadata (filename, file_path, file_url, etc.)
        """
        try:
            # Generate unique filename if not provided
            if custom_filename:
                unique_filename = custom_filename
            else:
                file_ext = Path(file.filename).suffix
                unique_filename = f"{uuid.uuid4().hex}{file_ext}"

            # Construct object key (path in bucket)
            if folder_path:
                object_key = f"{folder_path.strip('/')}/{unique_filename}"
            else:
                object_key = unique_filename

            # Read file content
            file_content = file.file.read()
            file_size = len(file_content)

            # Reset file pointer for potential reuse
            file.file.seek(0)

            # Upload to R2
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=object_key,
                Body=file_content,
                ContentType=file.content_type or 'application/octet-stream',
                CacheControl='public, max-age=31536000',  # 1 year cache
                Metadata={
                    'original-filename': file.filename,
                    'uploaded-by': 'stem-ed-architects'
                }
            )

            # Generate public URL
            file_url = f"{self.public_url}/{object_key}"

            return {
                "filename": unique_filename,
                "original_filename": file.filename,
                "file_path": object_key,  # R2 object key
                "file_url": file_url,
                "file_type": self._get_file_type(file.content_type),
                "mime_type": file.content_type,
                "file_size": file_size,
            }

        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_msg = e.response.get('Error', {}).get('Message', str(e))
            raise HTTPException(
                status_code=500,
                detail=f"R2 upload failed [{error_code}]: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"R2 upload error: {str(e)}"
            )

    def upload_file_obj(
        self,
        file_obj: BinaryIO,
        filename: str,
        content_type: str,
        folder_path: Optional[str] = None
    ) -> dict:
        """
        Upload a file-like object to R2

        Args:
            file_obj: File-like object (e.g., BytesIO)
            filename: Original filename
            content_type: MIME type
            folder_path: Optional folder path

        Returns:
            dict with file metadata
        """
        try:
            # Generate unique filename
            file_ext = Path(filename).suffix
            unique_filename = f"{uuid.uuid4().hex}{file_ext}"

            # Construct object key
            if folder_path:
                object_key = f"{folder_path.strip('/')}/{unique_filename}"
            else:
                object_key = unique_filename

            # Get file size
            file_obj.seek(0, 2)  # Seek to end
            file_size = file_obj.tell()
            file_obj.seek(0)  # Reset to beginning

            # Upload to R2
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=object_key,
                Body=file_obj,
                ContentType=content_type,
                CacheControl='public, max-age=31536000',
                Metadata={
                    'original-filename': filename
                }
            )

            # Generate public URL
            file_url = f"{self.public_url}/{object_key}"

            return {
                "filename": unique_filename,
                "original_filename": filename,
                "file_path": object_key,
                "file_url": file_url,
                "file_type": self._get_file_type(content_type),
                "mime_type": content_type,
                "file_size": file_size,
            }

        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            error_msg = e.response.get('Error', {}).get('Message', str(e))
            raise HTTPException(
                status_code=500,
                detail=f"R2 upload failed [{error_code}]: {error_msg}"
            )

    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from R2 storage

        Args:
            file_path: Object key (path) in R2 bucket

        Returns:
            bool: True if deleted successfully
        """
        try:
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code', 'Unknown')
            if error_code == 'NoSuchKey':
                # File doesn't exist, consider it "deleted"
                return True
            raise HTTPException(
                status_code=500,
                detail=f"R2 delete failed: {str(e)}"
            )

    def get_file_url(self, file_path: str) -> str:
        """
        Get public URL for a file in R2

        Args:
            file_path: Object key (path) in R2 bucket

        Returns:
            str: Public URL to access the file
        """
        return f"{self.public_url}/{file_path}"

    def file_exists(self, file_path: str) -> bool:
        """
        Check if a file exists in R2

        Args:
            file_path: Object key (path) in R2 bucket

        Returns:
            bool: True if file exists
        """
        try:
            self.client.head_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except ClientError as e:
            if e.response.get('Error', {}).get('Code') == '404':
                return False
            raise

    def list_files(self, prefix: Optional[str] = None, max_keys: int = 1000) -> list[dict]:
        """
        List files in R2 bucket

        Args:
            prefix: Optional prefix to filter files (e.g., 'products/')
            max_keys: Maximum number of files to return

        Returns:
            list of dicts with file metadata
        """
        try:
            params = {
                'Bucket': self.bucket_name,
                'MaxKeys': max_keys
            }
            if prefix:
                params['Prefix'] = prefix

            response = self.client.list_objects_v2(**params)

            files = []
            for obj in response.get('Contents', []):
                files.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'],
                    'url': self.get_file_url(obj['Key'])
                })

            return files

        except ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"R2 list failed: {str(e)}"
            )

    def get_storage_info(self) -> dict:
        """
        Get R2 storage configuration info

        Returns:
            dict with storage configuration
        """
        return {
            "storage_mode": "r2",
            "bucket_name": self.bucket_name,
            "endpoint": settings.R2_ENDPOINT,
            "public_url": self.public_url,
            "status": "connected"
        }

    @staticmethod
    def _get_file_type(mime_type: Optional[str]) -> str:
        """
        Determine file type from MIME type

        Args:
            mime_type: MIME type string

        Returns:
            str: File type category (image, document, video, etc.)
        """
        if not mime_type:
            return "other"

        mime_lower = mime_type.lower()

        if mime_lower.startswith('image/'):
            return "image"
        elif mime_lower.startswith('video/'):
            return "video"
        elif mime_lower.startswith('audio/'):
            return "audio"
        elif 'pdf' in mime_lower:
            return "document"
        elif any(doc in mime_lower for doc in ['word', 'document', 'text', 'spreadsheet', 'presentation']):
            return "document"
        elif 'zip' in mime_lower or 'compressed' in mime_lower:
            return "archive"
        else:
            return "other"


# Global R2 storage instance (initialized on demand)
_r2_storage: Optional[R2Storage] = None


def get_r2_storage() -> R2Storage:
    """
    Get or create R2 storage instance

    Returns:
        R2Storage: Configured R2 storage client
    """
    global _r2_storage
    if _r2_storage is None:
        _r2_storage = R2Storage()
    return _r2_storage
