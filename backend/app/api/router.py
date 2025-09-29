from fastapi import APIRouter

# 1. Impor semua router dari folder endpoints
from .endpoints import auth, users, classes, bookings

# 2. Buat satu router utama dengan prefix global
api_router = APIRouter()

# 3. Gabungkan semua router individual ke dalam router utama
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(classes.router, prefix="/classes", tags=["Classes"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])