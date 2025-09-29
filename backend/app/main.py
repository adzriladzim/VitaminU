from fastapi import FastAPI
from .api.router import api_router # Impor router utama dari app/api/router.py

app = FastAPI(
    title="Classify",
    description="API for booking and managing classroom sessions.",
    version="1.0.0"
)

# Sertakan router utama yang sudah menggabungkan semua endpoint
app.include_router(api_router)

@app.get("/health", tags=["Health Check"])
def health_check():
    """
    Endpoint sederhana untuk memeriksa apakah API sedang berjalan.
    """
    return {"status": "ok"}