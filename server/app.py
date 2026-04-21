from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.music_route import router as music_router
from server.routes.auth_route import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(music_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}