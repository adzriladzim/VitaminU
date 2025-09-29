from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional

# Impor yang spesifik dan benar
from ... import schemas
from ...models import Booking, Class, User, BookingStatus
from ...core.database import get_db
from ...core import security

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

@router.get("/", response_model=List[schemas.BookingResponse])
def list_bookings(
    date_filter: Optional[date] = Query(None, description="Filter bookings by a specific date"),
    db: Session = Depends(get_db)
):
    """
    Mengambil daftar booking. Bisa difilter berdasarkan tanggal.
    Jika tidak ada tanggal, akan mengembalikan semua booking.
    """
    query = db.query(Booking)
    if date_filter:
        query = query.filter(Booking.date == date_filter)
    
    bookings = query.all()
    return bookings

@router.post("/", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user) # <- Ambil user dari token
):
    """
    Membuat booking baru. User hanya bisa membuat booking untuk dirinya sendiri.
    Mencegah double booking untuk kelas, tanggal, dan waktu yang sama.
    """
    # 1. Validasi: Cek apakah kelas yang akan di-booking ada
    class_to_book = db.query(Class).filter(Class.id == booking_data.class_id).first()
    if not class_to_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Class not found")

    # 2. Validasi: Cek apakah sudah ada booking di jadwal yang sama
    existing_booking = db.query(Booking).filter(
        Booking.class_id == booking_data.class_id,
        Booking.date == booking_data.date,
        Booking.time == booking_data.time,
        Booking.status == BookingStatus.booked # Hanya cek yang statusnya masih 'booked'
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Class '{class_to_book.name}' is already booked at this date and time."
        )

    # 3. Buat objek booking baru dengan user_id dari token
    new_booking = Booking(
        **booking_data.dict(),
        user_id=current_user.id # <- user_id diambil dari user yang login, bukan dari input
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking