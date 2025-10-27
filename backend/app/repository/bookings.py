from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from backend.app import models, schemas
from typing import List
from uuid import UUID 
from datetime import datetime, timezone

def create_booking(db: Session, booking: schemas.BookingCreate, user_id: UUID):
    """
    Membuat booking baru dengan validasi tumpang tindih jadwal.
    """
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
        **booking.model_dump(),
        user_id=user_id,
        status=models.BookingStatus.pending
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_booking(db: Session, booking_id: UUID) -> models.Booking | None :
    """Mengambil satu booking berdasarkan ID."""
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def get_bookings_by_user(db: Session, user_id: UUID) -> List[models.Booking]:
    """Mengambil semua booking milik satu user."""
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).order_by(models.Booking.start_time.desc()).all()

# def get_all_bookings(db: Session) -> List[models.Booking]:
#     """Mengambil semua booking (untuk admin)."""
#     return db.query(models.Booking).order_by(models.Booking.start_time.desc()).all()

def get_all_bookings(db: Session) -> List[models.Booking]:
    """Mengambil semua booking (untuk admin) dengan data user dan admin terkait."""
    return db.query(models.Booking)\
             .options(
                 joinedload(models.Booking.owner), 
                 joinedload(models.Booking.room),
                 joinedload(models.Booking.updated_by_admin)
             )\
             .order_by(models.Booking.start_time.desc())\
             .all()

def update_booking_status(db: Session, booking_id: UUID, new_status: models.BookingStatus, admin_id: UUID) -> models.Booking | None:
    """Memperbarui status sebuah booking dan mencatat admin yang mengubah."""
    db_booking = get_booking(db, booking_id=booking_id)
    if not db_booking:
        return None

    db_booking.status = new_status
    db_booking.updated_by_admin_id = admin_id

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def finish_booking(db: Session, booking_id: UUID, admin_id: UUID) -> models.Booking | None:
    """
    Mengakhiri booking 'approved', mengubah end_time, status ke 'completed',
    dan mencatat admin yang mengubah.
    """
    now_utc = datetime.now(timezone.utc)
    db_booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.status == models.BookingStatus.approved,
        models.Booking.start_time <= now_utc,
        models.Booking.end_time > now_utc
    ).first()

    if not db_booking:
        return None

    db_booking.end_time = now_utc
    # Pastikan 'completed' ada di enum BookingStatus Anda
    if 'completed' in models.BookingStatus.__members__:
         db_booking.status = models.BookingStatus.completed
    db_booking.updated_by_admin_id = admin_id

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking