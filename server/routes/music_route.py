from fastapi import APIRouter, Body,Query
from server.controllers import music_controller

router = APIRouter()

@router.get("/music")
def get_music(
    artist: str = Query(None),
    title: str = Query(None),
    year: str = Query(None),
    album: str = Query(None)
):
    schema = {k: v for k, v in {
        "artist": artist,
        "title": title,
        "year": year,
        "album": album
    }.items() if v is not None and v != "None"}
    
    return music_controller.get_music(schema)

@router.post("/music/subscribe")
def subscribe(schema: dict = Body(...)):
    return music_controller.subscribe_music(schema)


@router.get("/music/subscriptions")
def get_subscriptions(user_email: str = Query(...)):
    schema = {"user_email": user_email}
    return music_controller.get_subscriptions(schema)


@router.delete("/music/unsubscribe")
def unsubscribe(schema: dict = Body(...)):
    return music_controller.remove_subscription(schema)