from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.app import repository
from backend.app.core import security
from backend.app.core.database import get_db
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


router = APIRouter(tags=["Authentication"])


@router.post("/login", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Endpoint untuk login user (admin atau mahasiswa).
    Menerima 'username' (yang akan kita gunakan sebagai email) dan 'password'.
    """
    # 1. Cari user di database berdasarkan email
    user = repository.users.get_user_by_email(db, email=form_data.username)

    # 2. Jika user tidak ada ATAU password salah, kirim error
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Jika berhasil, buat token
    access_token = security.create_access_token(data={"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}
