from sqlalchemy.orm import Session
from backend.app import models, schemas
from backend.app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    """
    Fungsi untuk mencari user berdasarkan email.
    """
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """
    Fungsi untuk membuat user baru di database.
    """
    # 1. Hash password
    hashed_password = get_password_hash(user.password)
    
    # 2. Buat instance model SQLAlchemy
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password
        # Role akan menggunakan nilai default dari model
    )
    
    # 3. Simpan ke database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user