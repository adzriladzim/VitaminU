from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app import repository, schemas
from backend.app.core.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Mendaftarkan user baru (Register).
    Logika endpoint sekarang jauh lebih ringkas.
    """
    # 1. Cek apakah user sudah ada dengan memanggil fungsi dari crud
    existing_user = repository.users.get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
        
    # 2. Buat user baru dengan memanggil fungsi dari crud
    new_user = repository.users.create_user(db=db, user=user_data)
    
    return new_user