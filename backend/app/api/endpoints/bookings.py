from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from backend.app import schemas, models
from backend.app.api import dependencies
from backend.app.repository import bookings as repository
from backend.app.models import Booking, Room, User, BookingStatus
from backend.app.core.database import get_db
from backend.app.core import security
from uuid import uuid4, UUID

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.post("/", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_a_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Endpoint untuk user membuat permintaan booking baru.
    """
    return repository.create_booking(db=db, booking=booking, user_id=current_user.id)

@router.get("/me", response_model=List[schemas.BookingResponse])
def read_my_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Endpoint untuk user melihat riwayat booking mereka.
    """
    return repository.get_bookings_by_user(db=db, user_id=current_user.id)

# === ENDPOINT KHUSUS ADMIN ===

@router.get("/", response_model=List[schemas.BookingResponse])
def read_all_bookings(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Endpoint untuk admin melihat semua booking yang masuk.
    """
    return repository.get_all_bookings(db=db)

@router.put("/{booking_id}/status", response_model=schemas.BookingResponse)
def update_a_booking_status(
    booking_id: UUID,
    booking_update: schemas.BookingUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Endpoint untuk admin mengubah status booking (approve/reject).
    """
    db_booking = repository.get_booking(db, booking_id=booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    return repository.update_booking_status(db, booking_id=booking_id, new_status=booking_update.status)