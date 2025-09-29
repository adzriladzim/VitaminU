from pydantic import BaseModel
from datetime import date, time
from typing import Optional


# Class
class ClassBase(BaseModel):
    name: str
    building: str
    description: Optional[str]

class ClassCreate(ClassBase):
    pass

class ClassResponse(ClassBase):
    id: int
    class Config:
        orm_mode = True