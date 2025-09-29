from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ... import schemas
from ...models import User, Class, UserRole # Impor model spesifik dari package 'models'
from ...core.database import get_db
from ...core import security # Kita butuh 'get_current_user' untuk keamanan

router = APIRouter(
    prefix="/classes",
    tags=["Classes"]
)

@router.get("/", response_model=List[schemas.ClassResponse])
def list_classes(db: Session = Depends(get_db)):
    """
    Mengambil daftar semua kelas yang tersedia.
    """
    classes = db.query(Class).all()
    return classes

@router.post("/", response_model=schemas.ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(
    class_data: schemas.ClassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user) # <- PERUBAHAN UTAMA
):
    """
    Membuat kelas baru. Hanya bisa dilakukan oleh user dengan role 'admin'.
    """
    # 1. Otorisasi: Cek role dari user yang sedang login (dari token)
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action. Admin access required."
        )

    # 2. Logika pembuatan kelas (sudah benar)
    new_class = Class(**class_data.dict())
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class