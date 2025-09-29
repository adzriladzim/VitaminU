from app.core.database import Base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum
class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    building = Column(String, nullable=False)
    description = Column(String, nullable=True)
    bookings = relationship("Booking", back_populates="class_ref")