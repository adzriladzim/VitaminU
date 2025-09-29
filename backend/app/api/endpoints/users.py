from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Impor yang spesifik dan benar
from ... import schemas
from ...models import User  # Hanya butuh model User
from ...core.database import get_db
from ...core.security import get_password_hash # Butuh fungsi untuk hash password

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
    """
    # 1. Validasi: Cek apakah email sudah terdaftar
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # 2. Hash password sebelum disimpan ke database
    hashed_password = get_password_hash(user_data.password)

    # 3. Buat objek User baru
    # Perhatikan: role tidak diatur di sini, default-nya adalah 'student'
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user