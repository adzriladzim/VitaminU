from backend.app.core.database import Base
from sqlalchemy import Column, Integer, String, Enum, Text, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID

class RoomStatus(str, enum.Enum):
    available = "available"
    in_use = "in_use"
    maintenance = "maintenance"
class Room(Base):
    __tablename__ = "rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(Enum(RoomStatus), nullable=False, default=RoomStatus.available)
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    image_url = Column(String(255), nullable=True)