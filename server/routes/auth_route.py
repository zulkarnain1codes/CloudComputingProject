from fastapi import APIRouter
from pydantic import BaseModel
from server.controllers.auth_controller import register_user

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    user_name: str
    password: str

@router.post("/register")
def register(data: RegisterRequest):
    return register_user(data)