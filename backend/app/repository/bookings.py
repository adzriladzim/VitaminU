from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from fastapi import HTTPException, status
from backend.app import models, schemas

def create_booking(db: Session, booking: schemas.BookingCreate, user_id: int):
    """
    Membuat booking baru dengan validasi tumpang tindih jadwal.
    """
    # === LOGIKA VALIDASI PALING PENTING ===
    # Cari booking yang sudah disetujui untuk ruangan yang sama dan memiliki waktu yang tumpang tindih.
    # Kondisi tumpang tindih: (StartA < EndB) and (EndA > StartB)
    existing_booking = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.status == models.BookingStatus.approved,
        booking.start_time < models.Booking.end_time,
        booking.end_time > models.Booking.start_time
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room is already booked for the requested time slot."
        )
    # =======================================

    db_booking = models.Booking(
        **booking.dict(), 
        user_id=user_id,
        status=models.BookingStatus.pending # Status awal selalu pending
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking(db: Session, booking_id: int):
    """Mengambil satu booking berdasarkan ID."""
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def get_bookings_by_user(db: Session, user_id: int):
    """Mengambil semua booking milik satu user."""
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()

def get_all_bookings(db: Session):
    """Mengambil semua booking (untuk admin)."""
    return db.query(models.Booking).all()

def update_booking_status(db: Session, booking_id: int, new_status: models.BookingStatus):
    """Memperbarui status sebuah booking (untuk admin)."""
    db_booking = get_booking(db, booking_id=booking_id)
    if not db_booking:
        return None
    
    db_booking.status = new_status
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking