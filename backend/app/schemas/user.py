from pydantic import BaseModel, EmailStr, ConfigDict
from ..models import UserRole
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr
from backend.app.models.user import UserRole
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDBBase(UserBase):
    id: Optional[uuid.UUID] = None # Ini akan diisi oleh database
    is_active: bool = True
    role: UserRole = UserRole.student

    class Config:
        from_attributes = True

class UserResponse(UserInDBBase):
    pass
class UserResponse(UserBase):
    id: UUID
    role: UserRole

    class Config:
        model_config = ConfigDict(from_attributes=True)