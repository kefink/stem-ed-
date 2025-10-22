from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class MediaFolder(Base):
    __tablename__ = "media_folders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    parent_folder_id = Column(Integer, ForeignKey("media_folders.id", ondelete="CASCADE"), nullable=True, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    parent_folder = relationship("MediaFolder", remote_side=[id], backref="subfolders")
    created_by = relationship("User", foreign_keys=[created_by_user_id])
    files = relationship("MediaFile", back_populates="folder", cascade="all, delete-orphan")


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False, index=True)  # image, video, document, etc.
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    width = Column(Integer, nullable=True)  # for images
    height = Column(Integer, nullable=True)  # for images
    folder_id = Column(Integer, ForeignKey("media_folders.id", ondelete="SET NULL"), nullable=True, index=True)
    alt_text = Column(String(255), nullable=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    uploaded_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    folder = relationship("MediaFolder", back_populates="files")
    uploaded_by = relationship("User", foreign_keys=[uploaded_by_user_id])
