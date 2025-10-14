from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from backend.app import models, repository
from backend.app.core.database import get_db
from backend.app.core.settings import settings

# Beritahu FastAPI di mana endpoint login berada
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> models.User:
    """
    Fungsi ini adalah 'penjaga keamanan' standar.
    Tugasnya: Membaca token, memvalidasinya, dan mengambil data user dari database.
    Jika token tidak valid, akses akan ditolak.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = repository.user.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

def get_current_admin_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Fungsi ini adalah 'penjaga keamanan' untuk area VIP (Admin).
    Tugasnya: Memanggil penjaga standar dulu, lalu memeriksa apakah user punya 'role' admin.
    Jika bukan admin, akses ditolak.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="The user doesn't have enough privileges"
        )
    return current_user