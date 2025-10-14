from backend.app.core.database import Base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum

class RoomStatus(str, enum.Enum):
    available = "available"
    in_use = "in_use"
    maintenance = "maintenance"
class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    status = Column(Enum(RoomStatus), nullable=False, default=RoomStatus.available)