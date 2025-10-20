from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app import repository, schemas, models
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user

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

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(
    current_user: models.User = Depends(get_current_user) # Tetap pakai models.User
):
    """
    Mengambil data untuk user yang sedang login.
    Endpoint ini tidak perlu memanggil repository,
    karena dependency 'get_current_user' sudah melakukannya.
    """
    return current_user


# --- Endpoint 3: GET Semua User (Hanya Admin) (BARU) ---
@router.get("/", response_model=List[schemas.UserResponse])
def read_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Mengambil daftar semua user. Hanya bisa diakses oleh admin.
    """
    # 1. Otorisasi: Cek apakah user adalah admin
    if current_user.role != models.UserRole.admin: # Pastikan impor models.UserRole
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource."
        )
    
    # 2. Panggil fungsi repository untuk mengambil semua user
    users = repository.users.get_users(db=db)
    return users