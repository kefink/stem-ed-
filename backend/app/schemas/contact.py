from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    organization: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str = Field(..., min_length=1)


class ContactRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    organization: Optional[str]
    phone: Optional[str]
    service: Optional[str]
    message: str

    class Config:
        from_attributes = True


class NewsletterSubscribe(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    interests: Optional[List[str]] = None


class NewsletterRead(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True
