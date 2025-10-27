from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID
from backend.app.core.database import Base
from backend.app.models.booking import Booking

class UserRole(str, enum.Enum):
    admin = "admin"
    student = "student"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String(255), nullable=False, index=True)
    role = Column(Enum(UserRole), default=UserRole.student)    
    bookings_made = relationship("Booking", back_populates="owner", foreign_keys="Booking.user_id")
    bookings_updated = relationship("Booking", back_populates="updated_by_admin", foreign_keys="Booking.updated_by_admin_id")