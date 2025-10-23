from typing import List, Any
from fastapi import APIRouter, Depends, status, HTTPException, Response, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app import models, schemas, repository
from backend.app.api import dependencies
from backend.app.core.database import get_db
import shutil
import os
from uuid import uuid4, UUID

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)

UPLOAD_DIRECTORY = "./static/images/rooms" 
# Pastikan folder static/images/rooms ada di root backend Anda
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/", response_model=schemas.RoomResponse, status_code=status.HTTP_201_CREATED)
def create_new_room(
    name: str = Form(...),
    capacity: int = Form(...),
    description: str = Form(None),
    status: models.RoomStatus = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    # Validasi: Cek apakah nama ruangan sudah terdaftar
    existing_room = repository.rooms.get_room_by_name(db, name=name)
    if existing_room:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Room with name '{name}' already exists."
        )

    if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Only JPG, PNG, WEBP allowed.")

    # Simpan file gambar
    try:
        # Buat nama file unik (misal: abcdef123.jpg)
        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        # Buat URL relatif untuk disimpan di DB (misal: /static/images/rooms/abcdef123.jpg)
        image_url = f"/static/images/rooms/{unique_filename}" 

    except Exception as e:
        print(f"Error saving image: {e}") # Log error
        raise HTTPException(status_code=500, detail="Could not save image file.")
    finally:
        image.file.close() # Selalu tutup file

    # Buat objek skema RoomCreate dari data Form
    room_data = schemas.RoomCreate(
        name=name,
        capacity=capacity,
        description=description,
        location=location,
        status=status
    )

    return repository.rooms.create_room(db=db, room=room_data, image_url=image_url)


@router.get("/", response_model=List[schemas.RoomResponse])
def get_all_rooms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    return repository.rooms.get_all_rooms(db)


@router.get("/{room_id}", response_model=schemas.RoomResponse)
def get_room_by_id(
    room_id: UUID,
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
    room_id: UUID,
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
    
    # Validasi nama unik (tetap sama)
    if room_update.name and room_update.name != db_room.name:
        existing_room = repository.rooms.get_room_by_name(db, name=room_update.name)
        if existing_room and existing_room.id != db_room.id: # Pastikan bukan room yg sama
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Room with name '{room_update.name}' already exists."
            )

    # Panggil repository untuk update (tetap sama)
    return repository.rooms.update_room(db=db, db_obj=db_room, obj_in=room_update)

@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_room(
    room_id: UUID,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(dependencies.get_current_admin_user)
):
    """
    Menghapus ruangan dari database.
    Hanya bisa dilakukan oleh admin.
    """
    deleted = repository.rooms.delete_room(db=db, room_id=room_id)
    if not deleted: # Fungsi delete sebaiknya return boolean/objek
         raise HTTPException(status_code=404, detail="Room not found")

    return Response(status_code=status.HTTP_204_NO_CONTENT)