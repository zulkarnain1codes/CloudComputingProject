from server.controllers import login_controller
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/login")
def login(schema: dict = Body(...)):
    return login_controller.login(schema)
