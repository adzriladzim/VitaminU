from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from .user import UserResponse
from .room import ClassResponse

# Booking
class BookingBase(BaseModel):
    class_id: int
    user_id: int
    date: date
    time: time

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    user: UserResponse
    class_ref: ClassResponse
    class Config:
        orm_mode = True