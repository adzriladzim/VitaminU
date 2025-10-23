from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.router import api_router

app = FastAPI(
    title="Classify",
    description="API for booking and managing classroom sessions.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
     "http://127.0.0.1:5173", # Ganti dengan port frontend Anda jika berbeda (misal: 3000 untuk React)
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Mengizinkan semua metode (GET, POST, dll.)
    allow_headers=["*"], # Mengizinkan semua header
    expose_headers=["Authorization"]
)

# Sertakan router utama yang sudah menggabungkan semua endpoint
app.include_router(api_router)

@app.get("/health", tags=["Health Check"])
def health_check():
    return {"status": "ok"}
