from fastapi import APIRouter, Body
from server.controllers import music_controller

router = APIRouter(prefix="/music", tags=["music"])


@router.post("/")
def post_music(schema: dict = Body(...)):
    return music_controller.get_music(schema)


@router.post("/subscribe")
def subscribe(schema: dict = Body(...)):
    return music_controller.subscribe_music(schema)


@router.post("/subscriptions")
def get_subscriptions(schema: dict = Body(...)):
    return music_controller.get_subscriptions(schema)


@router.delete("/unsubscribe")
def unsubscribe(schema: dict = Body(...)):
    return music_controller.remove_subscription(schema)