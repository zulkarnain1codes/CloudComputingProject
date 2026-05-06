from fastapi import APIRouter, Body
from server.controllers import music_controller

router = APIRouter()


@router.post("/music")
def post_music(schema: dict = Body(...)):
    return music_controller.get_music(schema)


@router.post("/music/subscribe")
def subscribe(schema: dict = Body(...)):
    return music_controller.subscribe_music(schema)


@router.post("/music/subscriptions")
def get_subscriptions(schema: dict = Body(...)):
    return music_controller.get_subscriptions(schema)


@router.delete("/music/unsubscribe")
def unsubscribe(schema: dict = Body(...)):
    return music_controller.remove_subscription(schema)