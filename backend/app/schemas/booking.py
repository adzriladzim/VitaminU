from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from .user import UserResponse
from .room import RoomResponse 
from ..models.booking import BookingStatus
class BookingBase(BaseModel):
    room_id: int
    start_time: datetime
    end_time: datetime

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None

class BookingResponse(BookingBase):
    id: int
    status: BookingStatus
    owner: UserResponse
    room: RoomResponse
    
    model_config = ConfigDict(from_attributes=True)