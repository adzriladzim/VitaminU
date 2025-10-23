from pydantic import BaseModel, ConfigDict
from typing import Optional
from ..models.room import RoomStatus
from uuid import UUID

class RoomBase(BaseModel):
    name: str
    capacity: int
    description: Optional[str] = None
    location: str
    status: RoomStatus

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    name: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[RoomStatus] = None
    description: Optional[str] = None
    location: Optional[str] = None

class RoomResponse(RoomBase):
    id: UUID
    image_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)