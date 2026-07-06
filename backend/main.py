"""Nova FastAPI application entrypoint.

Run:  uvicorn main:app --reload --port 8000
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import Base, SessionLocal, engine
from routes import auth as auth_routes
from routes import music as music_routes
from routes import player as player_routes
from routes import playlists as playlist_routes
from routes import likes as likes_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and seed trending songs on startup.
    Base.metadata.create_all(bind=engine)

    # --- SQLite migration: add play_count column if missing ---
    with engine.connect() as conn:
        cols = [r[1] for r in conn.execute(
            text("PRAGMA table_info(songs)")
        ).fetchall()]
        if "play_count" not in cols:
            conn.execute(text("ALTER TABLE songs ADD COLUMN play_count INTEGER DEFAULT 0"))
            conn.commit()

    db = SessionLocal()
    try:
        music_routes.seed_trending(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Nova Music API", version="1.0.0", lifespan=lifespan)

# CORS — origins come from ALLOWED_ORIGINS (comma-separated) so the deployed
# Vercel frontend can be added without a code change. Falls back to the local
# Next.js dev server. expose_headers lets the browser read Content-Range/
# Accept-Ranges for seeking-related requests.
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")
allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "X-Audio-Source"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(music_routes.router, prefix="/api", tags=["music"])
app.include_router(player_routes.router, prefix="/api", tags=["player"])
app.include_router(playlist_routes.router, prefix="/api", tags=["playlists"])
app.include_router(likes_routes.router, prefix="/api", tags=["likes"])


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "nova"}
