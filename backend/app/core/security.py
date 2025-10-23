from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from backend.app.core.settings import settings
from backend.app import models, repository
from backend.app.core.database import get_db
import bcrypt

# ==============================
# KONFIGURASI PASSWORD & JWT
# ==============================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BCRYPT_MAX_BYTES = 72

# ==============================
# FUNGSI PASSWORD
# ==============================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Memverifikasi password mentah (plain_password) dengan hash di database.
    bcrypt.checkpw() hanya menerima bytes, jadi harus di-encode dulu.
    """
    # Potong password jika lebih dari 72 byte (batas bcrypt)
    truncated_password = plain_password[:BCRYPT_MAX_BYTES]

    # Convert string ke bytes sebelum dicek
    return bcrypt.checkpw(
        truncated_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def get_password_hash(password: str) -> str:
    """
    Membuat hash bcrypt dari password.
    bcrypt hanya membaca 72 byte pertama dari password.
    """
    if len(password.encode('utf-8')) > BCRYPT_MAX_BYTES:
        password = password.encode('utf-8')[:BCRYPT_MAX_BYTES].decode('utf-8', errors='ignore')

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# ==============================
# FUNGSI TOKEN
# ==============================

def create_access_token(data: dict) -> str:
    """
    Membuat JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

# ==============================
# FUNGSI AUTENTIKASI USER
# ==============================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Membaca token, memvalidasinya, dan mengambil data user dari database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = repository.users.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    return user


def get_current_admin_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    """
    Memastikan user yang login adalah admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
