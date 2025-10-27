from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timezone
from typing import List
from backend.app import schemas, models
from backend.app.repository import bookings as repository
from backend.app.api import dependencies
from backend.app.core.database import get_db
from uuid import UUID

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
    current_admin: models.User = Depends(dependencies.get_current_admin_user) # Kita punya admin di sini
):
    """
    Endpoint untuk admin mengubah status booking (approve/reject/cancel).
    """
    if booking_update.status is None:
         raise HTTPException(status_code=400, detail="New status must be provided")

    updated_booking = repository.update_booking_status(
        db,
        booking_id=booking_id,
        new_status=booking_update.status,
        admin_id=current_admin.id 
    )
    if updated_booking is None:
         raise HTTPException(status_code=404, detail="Booking not found or update failed")

    return updated_booking

@router.patch("/{booking_id}/finish", response_model=schemas.BookingResponse)
def finish_booking_early(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Endpoint untuk admin mengakhiri booking yang sedang berlangsung lebih awal.
    """
    updated_booking = repository.finish_booking(
        db,
        booking_id=booking_id,
        admin_id=current_admin.id
    )
    if not updated_booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active approved booking not found or it may have already finished."
        )
    return updated_booking