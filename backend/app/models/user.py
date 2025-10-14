from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
import enum
from backend.app.core.database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    student = "student"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student)    