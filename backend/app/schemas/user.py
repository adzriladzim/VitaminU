from pydantic import BaseModel, EmailStr, ConfigDict
from ..models import UserRole
from uuid import UUID
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
class UserCreate(UserBase):
    password: str
class UserResponse(UserBase):
    id: UUID
    role: UserRole

    class Config:
        model_config = ConfigDict(from_attributes=True)