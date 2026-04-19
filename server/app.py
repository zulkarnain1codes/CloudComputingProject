
from fastapi import FastAPI
from server.routes.music_route import router as music_router

app = FastAPI()

# register routes
app.include_router(music_router)


@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}