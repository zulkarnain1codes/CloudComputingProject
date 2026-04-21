from server.controllers import login_controller
from fastapi import APIRouter, Body

router = APIRouter(prefix="/login", tags=["login"])

@router.post("/")
def login(schema: dict = Body(...)):
    return login_controller.login(schema)
