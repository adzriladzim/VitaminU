from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID
from backend.app.core.database import Base

class BookingStatus(str, enum.Enum):
    pending = "pending"       
    approved = "approved"
    rejected = "rejected"
    canceled = "canceled"
    completed = "completed"

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.pending)
    
    # Foreign Keys dan Relationships
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    updated_by_admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    room = relationship("Room", back_populates="bookings")
    owner = relationship("User", foreign_keys=[user_id], back_populates="bookings_made")
    updated_by_admin = relationship("User", foreign_keys=[updated_by_admin_id], back_populates="bookings_updated")