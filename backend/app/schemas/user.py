from pydantic import BaseModel, EmailStr
from ..models import UserRole
class UserBase(BaseModel):
    email: EmailStr
class UserCreate(UserBase):
    password: str
class UserResponse(UserBase):
    id: int
    role: UserRole

    class Config:
        orm_mode = True