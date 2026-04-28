from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.music_route import router as music_router
from server.routes.auth_route import router as auth_router
from server.routes.login_route import router as login_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(music_router)
app.include_router(auth_router)
app.include_router(login_router)


@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}