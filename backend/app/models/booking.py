from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import enum
from backend.app.core.database import Base

class BookingStatus(str, enum.Enum):
    pending = "pending"       # Permintaan baru, menunggu persetujuan admin
    approved = "approved"     # Disetujui oleh admin (ini sama dengan konsep "booked")
    rejected = "rejected"     # Ditolak oleh admin
    canceled = "canceled"     # Dibatalkan oleh mahasiswa

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.pending)
    
    # Foreign Keys dan Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    
    owner = relationship("User")
    room = relationship("Room")