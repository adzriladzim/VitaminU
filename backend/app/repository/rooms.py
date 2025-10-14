from sqlalchemy.orm import Session
from ...app import models, schemas

# Fungsi yang sudah ada (asumsi)
def get_all_rooms(db: Session):
    return db.query(models.Room).all()

def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


def get_room(db: Session, room_id: int):
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
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_room(db: Session, room_id: int):
    """Menghapus ruangan berdasarkan ID."""
    db_obj = db.query(models.Room).filter(models.Room.id == room_id).first()
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj