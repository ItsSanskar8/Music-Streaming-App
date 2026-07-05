"""Playlist routes: user-scoped CRUD plus add/remove songs.

Every endpoint requires a valid Bearer token (get_current_user) and enforces
ownership — a user can only see or mutate their own playlists. Purely additive:
uses the existing Playlist / PlaylistSong / Song models.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Playlist, PlaylistSong, Song, User
from routes.auth import get_current_user
from routes._songs import SongIn, get_or_create_song

router = APIRouter()


# ----------------------------- Schemas ---------------------------------- #
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


class PlaylistCreate(BaseModel):
    name: str
    cover_url: str | None = None


class PlaylistUpdate(BaseModel):
    name: str | None = None
    cover_url: str | None = None


class PlaylistOut(BaseModel):
    id: int
    name: str
    cover_url: str | None
    song_count: int = 0

    class Config:
        from_attributes = True


class PlaylistDetail(PlaylistOut):
    songs: list[SongOut] = []


# ----------------------------- Helpers ---------------------------------- #
def _owned_playlist(db: Session, playlist_id: int, user: User) -> Playlist:
    """Fetch a playlist owned by `user` or raise 404 (don't leak existence)."""
    playlist = (
        db.query(Playlist)
        .filter(Playlist.id == playlist_id, Playlist.user_id == user.id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist


def _to_out(db: Session, playlist: Playlist) -> PlaylistOut:
    count = (
        db.query(PlaylistSong)
        .filter(PlaylistSong.playlist_id == playlist.id)
        .count()
    )
    return PlaylistOut(
        id=playlist.id,
        name=playlist.name,
        cover_url=playlist.cover_url,
        song_count=count,
    )


# ------------------------------ Routes ---------------------------------- #
@router.get("/playlists", response_model=list[PlaylistOut])
def list_playlists(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlists = (
        db.query(Playlist).filter(Playlist.user_id == user.id).order_by(Playlist.id.desc()).all()
    )
    return [_to_out(db, p) for p in playlists]


@router.post("/playlists", response_model=PlaylistOut, status_code=201)
def create_playlist(
    body: PlaylistCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = Playlist(user_id=user.id, name=body.name.strip() or "Untitled", cover_url=body.cover_url)
    db.add(playlist)
    db.commit()
    db.refresh(playlist)
    return _to_out(db, playlist)


@router.get("/playlists/{playlist_id}", response_model=PlaylistDetail)
def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = _owned_playlist(db, playlist_id, user)
    rows = (
        db.query(Song)
        .join(PlaylistSong, PlaylistSong.song_id == Song.id)
        .filter(PlaylistSong.playlist_id == playlist.id)
        .order_by(PlaylistSong.id.asc())
        .all()
    )
    base = _to_out(db, playlist)
    return PlaylistDetail(**base.model_dump(), songs=[SongOut.model_validate(s) for s in rows])


@router.patch("/playlists/{playlist_id}", response_model=PlaylistOut)
def update_playlist(
    playlist_id: int,
    body: PlaylistUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = _owned_playlist(db, playlist_id, user)
    if body.name is not None:
        playlist.name = body.name.strip() or playlist.name
    if body.cover_url is not None:
        playlist.cover_url = body.cover_url
    db.commit()
    db.refresh(playlist)
    return _to_out(db, playlist)


@router.delete("/playlists/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = _owned_playlist(db, playlist_id, user)
    db.delete(playlist)
    db.commit()
    return None


@router.post("/playlists/{playlist_id}/songs", response_model=PlaylistDetail)
def add_song(
    playlist_id: int,
    body: SongIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = _owned_playlist(db, playlist_id, user)
    song = get_or_create_song(db, body)

    exists = (
        db.query(PlaylistSong)
        .filter(PlaylistSong.playlist_id == playlist.id, PlaylistSong.song_id == song.id)
        .first()
    )
    if not exists:
        db.add(PlaylistSong(playlist_id=playlist.id, song_id=song.id))
        db.commit()

    return get_playlist(playlist_id, db, user)


@router.delete("/playlists/{playlist_id}/songs/{song_id}", response_model=PlaylistDetail)
def remove_song(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    playlist = _owned_playlist(db, playlist_id, user)
    link = (
        db.query(PlaylistSong)
        .filter(PlaylistSong.playlist_id == playlist.id, PlaylistSong.song_id == song_id)
        .first()
    )
    if link:
        db.delete(link)
        db.commit()
    return get_playlist(playlist_id, db, user)
