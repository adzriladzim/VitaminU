from typing import List, Any
from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from backend.app import models, schemas, repository
from backend.app.api import dependencies
from backend.app.core.database import get_db

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)

@router.post("/", response_model=schemas.RoomResponse, status_code=status.HTTP_201_CREATED)
def create_new_room(
    room: schemas.RoomCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    # Validasi: Cek apakah nama ruangan sudah terdaftar
    existing_room = repository.rooms.get_room_by_name(db, name=room.name)
    if existing_room:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room with name '{room.name}' already exists."
        )
    return repository.rooms.create_room(db=db, room=room)


@router.get("/", response_model=List[schemas.RoomResponse])
def get_all_rooms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return repository.rooms.get_all_rooms(db)


@router.get("/{room_id}", response_model=schemas.RoomResponse)
def get_room_by_id(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Mengambil detail satu ruangan berdasarkan ID-nya.
    """
    db_room = repository.rooms.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    return db_room


@router.put("/{room_id}", response_model=schemas.RoomResponse)
def update_room_details(
    room_id: int,
    room_update: schemas.RoomUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Memperbarui detail ruangan (misal: nama atau status).
    Hanya bisa dilakukan oleh admin.
    """
    db_room = repository.rooms.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    
    if room_update.name and room_update.name != db_room.name:
        existing_room = repository.rooms.get_room_by_name(db, name=room_update.name)
        if existing_room:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Room with name '{room_update.name}' already exists."
            )

    return repository.rooms.update_room(db=db, db_obj=db_room, obj_in=room_update)

@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Menghapus ruangan dari database.
    Hanya bisa dilakukan oleh admin.
    """
    db_room = repository.rooms.get_room(db, room_id=room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")

    repository.rooms.delete_room(db=db, room_id=room_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)