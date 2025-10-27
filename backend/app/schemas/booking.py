from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional
from .user import UserResponse
from .room import RoomResponse 
from ..models.booking import BookingStatus
from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    full_name: Optional[str] = None
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)
class BookingBase(BaseModel):
    room_id: UUID
    start_time: datetime
    end_time: datetime

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None

class BookingResponse(BookingBase):
    id: UUID
    status: BookingStatus
    owner: UserResponse
    room: RoomResponse
    updated_by_admin: Optional[UserResponse] = None
    
    model_config = ConfigDict(from_attributes=True)