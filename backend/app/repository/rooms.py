from sqlalchemy.orm import Session
from ...app import models, schemas
from sqlalchemy import func
from datetime import datetime, timezone
from typing import List
import enum
from uuid import UUID

# Fungsi yang sudah ada (asumsi)
def get_all_rooms(db: Session) -> List[dict] :
    """
    Mengambil semua ruangan dan menentukan statusnya secara dinamis
    berdasarkan booking yang sedang berlangsung (approved),
    booking yang pending, atau status maintenance.
    """
    rooms = db.query(models.Room).all()
    rooms_with_status = []
    now_utc = datetime.now(timezone.utc)
    
    for room in rooms:
        # Tentukan status awal berdasarkan status dasar ruangan
        if room.status == models.RoomStatus.maintenance:
            calculated_status = models.RoomStatus.maintenance
        else:
            # Cek booking 'approved' yang sedang berlangsung (in_use)
            ongoing_booking = db.query(models.Booking).filter(
                models.Booking.room_id == room.id,
                models.Booking.status == models.BookingStatus.approved,
                models.Booking.start_time <= now_utc,
                models.Booking.end_time > now_utc
            ).order_by(models.Booking.start_time.asc()).first()

            if ongoing_booking:
                calculated_status = models.RoomStatus.in_use
            else:
                # Cek booking 'pending'
                pending_booking = db.query(models.Booking).filter(
                    models.Booking.room_id == room.id,
                    models.Booking.status == models.BookingStatus.pending
                ).first()

                if pending_booking:
                    calculated_status = models.BookingStatus.pending
                else:
                    calculated_status = models.RoomStatus.available

        # Konversi objek Room ke dictionary
        room_dict = {
            "id": room.id,
            "name": room.name,
            "capacity": room.capacity,
            "description": room.description,
            "location": room.location,
            "image_url": room.image_url,
            "status": calculated_status.value if isinstance(calculated_status, enum.Enum) else calculated_status
        }
        rooms_with_status.append(room_dict)

    return rooms_with_status

def create_room(db: Session, room: schemas.RoomCreate, image_url: str | None = None) -> models.Room:
    """
    Creates a new room in the database, including optional image URL.
    """
    db_room = models.Room(
        name=room.name,
        capacity=room.capacity,
        description=room.description,
        location=room.location,     
        status=room.status,         
        image_url=image_url
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


def get_room(db: Session, room_id: UUID):
    """Mengambil satu ruangan berdasarkan ID."""
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_room_by_name(db: Session, name: str):
    """Mengambil satu ruangan berdasarkan nama (untuk validasi)."""
    return db.query(models.Room).filter(models.Room.name == name).first()

def update_room(db: Session, db_obj: models.Room, obj_in: schemas.RoomUpdate):
    """Memperbarui data ruangan."""
    # Ambil data dari Pydantic schema sebagai dictionary
    update_data = obj_in.dict(exclude_unset=True) 
    
    # Loop melalui data dan update field di objek SQLAlchemy
    for field, value in update_data.items():
        if value is not None: # Hanya update jika value diberikan
             setattr(db_obj, field, value)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_room(db: Session, room_id: UUID)-> models.Room | None:
    """Menghapus ruangan berdasarkan ID."""
    db_obj = get_room(db, room_id=room_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj