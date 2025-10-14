from fastapi import APIRouter

# 1. Impor semua router dari folder endpoints
from backend.app.api.endpoints import auth, users, rooms, bookings

# 2. Buat satu router utama dengan prefix global
api_router = APIRouter()

# 3. Gabungkan semua router individual ke dalam router utama
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(rooms.router)
api_router.include_router(bookings.router)