from app.core.database import Base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum

class BookingStatus(str, enum.Enum):
    booked = "booked"
    cancelled = "cancelled"
    inuse = "inuse"
    available = "available"

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.booked)
    class_ref = relationship("Class", back_populates="bookings")
    user_ref = relationship("User")