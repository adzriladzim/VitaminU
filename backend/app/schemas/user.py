from pydantic import BaseModel, EmailStr, ConfigDict
from ..models import UserRole
class UserBase(BaseModel):
    email: EmailStr
class UserCreate(UserBase):
    password: str
class UserResponse(UserBase):
    id: int
    role: UserRole

    class Config:
        model_config = ConfigDict(from_attributes=True)