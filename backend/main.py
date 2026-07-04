"""Nova FastAPI application entrypoint.

Run:  uvicorn main:app --reload --port 8000
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, SessionLocal, engine
from routes import auth as auth_routes
from routes import music as music_routes
from routes import player as player_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and seed trending songs on startup.
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        music_routes.seed_trending(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Nova Music API", version="1.0.0", lifespan=lifespan)

# CORS — the Next.js dev server runs on :3000. expose_headers lets the browser
# read Content-Range/Accept-Ranges for seeking-related requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(music_routes.router, prefix="/api", tags=["music"])
app.include_router(player_routes.router, prefix="/api", tags=["player"])


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "nova"}
