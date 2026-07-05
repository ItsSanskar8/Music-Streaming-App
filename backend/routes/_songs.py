"""Shared song helpers for the playlist/likes routers.

Songs originate from the search flow (`routes/music.py`) and are keyed by their
YouTube id. When a client adds a song to a playlist or to Liked, it sends the
full track payload it already holds from a search/trending response, so we can
upsert it here without re-hitting YouTube. This mirrors the private
`_upsert_song` in `routes/music.py` but is exposed for reuse.
"""

from pydantic import BaseModel
from sqlalchemy.orm import Session

from models import Song
from mood_engine import assign_mood


class SongIn(BaseModel):
    """Track payload sent by the client (from a search/trending result)."""

    yt_id: str
    title: str
    artist: str
    thumbnail: str | None = None
    duration: int = 0
    mood: str | None = None


def get_or_create_song(db: Session, payload: SongIn) -> Song:
    """Return the existing Song for this yt_id, or insert a new one."""
    song = db.query(Song).filter(Song.yt_id == payload.yt_id).first()
    if song:
        return song

    song = Song(
        yt_id=payload.yt_id,
        title=payload.title or "Unknown",
        artist=payload.artist or "Unknown Artist",
        thumbnail=payload.thumbnail,
        duration=int(payload.duration or 0),
        mood=(payload.mood or assign_mood(payload.title or "", payload.artist or "")),
    )
    db.add(song)
    db.commit()
    db.refresh(song)
    return song
