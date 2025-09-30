from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

# Dummy users untuk login
DUMMY_USERS = {
    "khidhir@admin.com": {"password": "!Admin123", "role": "admin"},
    "ojan@gmail.com": {"password": "!Student123", "role": "student"},
}

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    user = DUMMY_USERS.get(request.email)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Dummy token
    token = f"fake-jwt-token-for-{request.email}"
    return LoginResponse(access_token=token, role=user["role"])
