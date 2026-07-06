"""Liked-songs routes: list / add / remove for the current user.

User-scoped via get_current_user. Additive — uses the existing LikedSong and
Song models. The frontend may also keep a localStorage cache for instant UX,
but this is the durable, cross-device source of truth.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import LikedSong, Song, User
from routes.auth import get_current_user
from routes._songs import SongIn, get_or_create_song

router = APIRouter()


class SongOut(BaseModel):
    id: int
    yt_id: str
    title: str
    artist: str
    thumbnail: str | None
    duration: int
    mood: str

    class Config:
        from_attributes = True


@router.get("/likes", response_model=list[SongOut])
def list_likes(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = (
        db.query(Song)
        .join(LikedSong, LikedSong.song_id == Song.id)
        .filter(LikedSong.user_id == user.id)
        .order_by(LikedSong.id.desc())  # most-recently-liked first
        .all()
    )
    return [SongOut.model_validate(s) for s in rows]


@router.post("/likes", response_model=SongOut, status_code=201)
def add_like(
    body: SongIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    song = get_or_create_song(db, body)
    exists = (
        db.query(LikedSong)
        .filter(LikedSong.user_id == user.id, LikedSong.song_id == song.id)
        .first()
    )
    if not exists:
        db.add(LikedSong(user_id=user.id, song_id=song.id))
        db.commit()
    return SongOut.model_validate(song)


@router.delete("/likes/{yt_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_like(
    yt_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    song = db.query(Song).filter(Song.yt_id == yt_id).first()
    if not song:
        # Song was never persisted to the DB (e.g. liked while offline or
        # from the landing page). Nothing to delete server-side — succeed silently.
        return None
    link = (
        db.query(LikedSong)
        .filter(LikedSong.user_id == user.id, LikedSong.song_id == song.id)
        .first()
    )
    if not link:
        return None
    db.delete(link)
    db.commit()
    return None
