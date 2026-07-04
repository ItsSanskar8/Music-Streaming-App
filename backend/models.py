"""SQLAlchemy ORM models: User, Song, Playlist, PlaylistSong, LikedSong."""

from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_pw = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)

    playlists = relationship("Playlist", back_populates="owner", cascade="all, delete")
    liked = relationship("LikedSong", back_populates="user", cascade="all, delete")


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    yt_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    thumbnail = Column(String, nullable=True)
    duration = Column(Integer, default=0)  # seconds
    mood = Column(String, index=True, default="chill")
    created_at = Column(DateTime, default=datetime.utcnow)


class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    cover_url = Column(String, nullable=True)

    owner = relationship("User", back_populates="playlists")
    songs = relationship("PlaylistSong", back_populates="playlist", cascade="all, delete")


class PlaylistSong(Base):
    __tablename__ = "playlist_songs"
    __table_args__ = (UniqueConstraint("song_id", "playlist_id", name="uq_playlist_song"),)

    id = Column(Integer, primary_key=True, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)

    playlist = relationship("Playlist", back_populates="songs")
    song = relationship("Song")


class LikedSong(Base):
    __tablename__ = "liked_songs"
    __table_args__ = (UniqueConstraint("user_id", "song_id", name="uq_liked_song"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)

    user = relationship("User", back_populates="liked")
    song = relationship("Song")
