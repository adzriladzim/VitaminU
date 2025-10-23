# backend/app/api/endpoints/users.py (KODE YANG DIPERBAIKI SEMENTARA)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app import repository, schemas, models
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user, get_current_admin_user
from backend.app.models.user import UserRole

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
    Create a new user.
    """
    db_user = repository.users.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return repository.users.create_user(db=db, user=user_data)


@router.get("/me", response_model=schemas.UserResponse)
# ... (kode lainnya tetap sama)
def read_users_me(
    current_user: models.User = Depends(get_current_user)
):
    return current_user


# ... (lanjutan endpoint GET / tetap sama, karena endpoint ini butuh DB)
@router.get("/", response_model=List[schemas.UserResponse])
def read_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    # ... (logic body endpoint)
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource."
        )

    users = repository.users.get_users(db=db)
    return users
