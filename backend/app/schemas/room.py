from pydantic import BaseModel, ConfigDict
from typing import Optional
from ..models.room import RoomStatus
from uuid import UUID

class RoomBase(BaseModel):
    name: str
    capacity: int
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    name: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[RoomStatus] = None

class RoomResponse(RoomBase):
    id: UUID
    status: RoomStatus
    
    model_config = ConfigDict(from_attributes=True)