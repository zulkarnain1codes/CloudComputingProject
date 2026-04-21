from fastapi import APIRouter,Body
from server.controllers import music_controller

router = APIRouter(prefix="/music", tags=["music"])


@router.post("/")
def post_music(schema: dict = Body(...)):
    return music_controller.get_music(schema)
   