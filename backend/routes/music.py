"""Music routes: search, trending, recommend-by-mood, MP3 download.

Search strategy (NO API KEYS):
  1. Try a rotating list of public Piped instances (JSON search).
  2. Fall back to yt-dlp's own `ytsearch` if every instance is down.
Every discovered track is mood-tagged and upserted into SQLite.
"""

import os
import shutil
import tempfile
import time

import httpx
import yt_dlp
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette.background import BackgroundTask
from starlette.concurrency import run_in_threadpool

from database import get_db
from models import Song
from mood_engine import assign_mood

router = APIRouter()

# Public Piped instances (keyless). We try them in order until one answers.
PIPED_INSTANCES = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.adminforge.de",
    "https://api.piped.private.coffee",
    "https://pipedapi.leptons.xyz",
]

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


# ------------------------------- Schemas -------------------------------- #
class SongOut(BaseModel):
    id: int
    yt_id: str
    title: str
    artist: str
    thumbnail: str | None
    duration: int
    mood: str
    play_count: int = 0

    class Config:
        from_attributes = True


# ------------------------------ Helpers --------------------------------- #
def _video_id_from_url(url: str) -> str | None:
    """Extract the 11-char video id from a Piped '/watch?v=ID' url."""
    if not url:
        return None
    if "v=" in url:
        return url.split("v=", 1)[1].split("&", 1)[0]
    return url.rsplit("/", 1)[-1]


def _upsert_song(db: Session, *, yt_id: str, title: str, artist: str,
                 thumbnail: str | None, duration: int) -> Song:
    """Insert the song if new (with a mood tag) or return the existing row."""
    song = db.query(Song).filter(Song.yt_id == yt_id).first()
    if song:
        return song
    song = Song(
        yt_id=yt_id,
        title=title or "Unknown",
        artist=artist or "Unknown Artist",
        thumbnail=thumbnail,
        duration=int(duration or 0),
        mood=assign_mood(title or "", artist or ""),
    )
    db.add(song)
    db.commit()
    db.refresh(song)
    return song


async def _search_piped(q: str) -> list[dict]:
    """Query Piped instances; return normalized track dicts (may be empty)."""
    async with httpx.AsyncClient(timeout=8.0, headers={"User-Agent": BROWSER_UA}) as client:
        for base in PIPED_INSTANCES:
            try:
                resp = await client.get(
                    f"{base}/search",
                    params={"q": q, "filter": "music_songs"},
                )
                if resp.status_code != 200:
                    continue
                items = resp.json().get("items", [])
                results = []
                for it in items:
                    if it.get("type") not in (None, "stream"):
                        continue
                    yt_id = _video_id_from_url(it.get("url", ""))
                    if not yt_id:
                        continue
                    thumb = it.get("thumbnail")
                    results.append({
                        "yt_id": yt_id,
                        "title": it.get("title", "Unknown"),
                        "artist": it.get("uploaderName", "Unknown Artist"),
                        "thumbnail": thumb,
                        "duration": it.get("duration", 0) or 0,
                    })
                if results:
                    return results
            except (httpx.HTTPError, ValueError):
                continue
    return []


def _search_ytdlp(q: str, limit: int = 12) -> list[dict]:
    """Fallback search using yt-dlp's flat extraction (blocking)."""
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "default_search": "ytsearch",
        "skip_download": True,
    }
    results: list[dict] = []
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"ytsearch{limit}:{q}", download=False)
    for e in (info or {}).get("entries", []) or []:
        if not e:
            continue
        thumbs = e.get("thumbnails") or []
        thumb = thumbs[-1]["url"] if thumbs else e.get("thumbnail")
        results.append({
            "yt_id": e.get("id"),
            "title": e.get("title", "Unknown"),
            "artist": e.get("uploader") or e.get("channel") or "Unknown Artist",
            "thumbnail": thumb,
            "duration": int(e.get("duration") or 0),
        })
    return results


# ------------------------- YouTube trending ------------------------------ #
# In-memory cache so we don't hammer Piped on every page load.
_TRENDING_CACHE: dict = {"data": None, "ts": 0.0}
_TRENDING_TTL = 600  # 10 minutes


async def _fetch_trending_piped(limit: int = 20) -> list[dict]:
    """Fetch trending music from a Piped instance."""
    async with httpx.AsyncClient(timeout=10.0, headers={"User-Agent": BROWSER_UA}) as client:
        for base in PIPED_INSTANCES:
            try:
                resp = await client.get(
                    f"{base}/trending",
                    params={"filter": "music_songs"},
                )
                if resp.status_code != 200:
                    continue
                items = resp.json().get("items", [])
                results = []
                for it in items:
                    if it.get("type") not in (None, "stream"):
                        continue
                    yt_id = _video_id_from_url(it.get("url", ""))
                    if not yt_id:
                        continue
                    thumb = it.get("thumbnail")
                    results.append({
                        "yt_id": yt_id,
                        "title": it.get("title", "Unknown"),
                        "artist": it.get("uploaderName", "Unknown Artist"),
                        "thumbnail": thumb,
                        "duration": it.get("duration", 0) or 0,
                    })
                    if len(results) >= limit:
                        break
                if results:
                    return results
            except (httpx.HTTPError, ValueError):
                continue
    return []


def _fetch_trending_ytdlp(limit: int = 20) -> list[dict]:
    """Fallback: search YouTube for "trending music" using yt-dlp."""
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "default_search": "ytsearch",
        "skip_download": True,
    }
    results: list[dict] = []
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"ytsearch{limit}:trending music 2024", download=False)
    for e in (info or {}).get("entries", []) or []:
        if not e:
            continue
        thumbs = e.get("thumbnails") or []
        thumb = thumbs[-1]["url"] if thumbs else e.get("thumbnail")
        results.append({
            "yt_id": e.get("id"),
            "title": e.get("title", "Unknown"),
            "artist": e.get("uploader") or e.get("channel") or "Unknown Artist",
            "thumbnail": thumb,
            "duration": int(e.get("duration") or 0),
        })
    return results


# Seed data used by main.py on startup and by the trending endpoint fallback.
TRENDING_SEED = [
    ("4NRXx6U8ABQ", "Blinding Lights", "The Weeknd"),
    ("H5v3kku4y6Q", "As It Was", "Harry Styles"),
    ("TUVcZfQe-Kw", "Levitating", "Dua Lipa"),
    ("kTJczUoc26U", "Stay", "The Kid LAROI & Justin Bieber"),
    ("JGwWNGJdvx8", "Shape of You", "Ed Sheeran"),
    ("DyDfgMOUjCI", "bad guy", "Billie Eilish"),
    ("E07s5ZYygMg", "Watermelon Sugar", "Harry Styles"),
    ("tQ0yjYUFKAE", "Peaches", "Justin Bieber"),
    ("b1kbLwvqugk", "Flowers", "Miley Cyrus"),
    ("mRD0-GxqHVo", "Heat Waves", "Glass Animals"),
]


def _yt_thumb(yt_id: str) -> str:
    return f"https://i.ytimg.com/vi/{yt_id}/hqdefault.jpg"


def seed_trending(db: Session) -> None:
    """Populate the Song table with trending tracks if it is empty."""
    if db.query(Song).count() > 0:
        return
    for yt_id, title, artist in TRENDING_SEED:
        _upsert_song(
            db, yt_id=yt_id, title=title, artist=artist,
            thumbnail=_yt_thumb(yt_id), duration=0,
        )


# ------------------------------- Routes --------------------------------- #
@router.get("/search", response_model=list[SongOut])
async def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    tracks = await _search_piped(q)
    if not tracks:
        # yt-dlp fallback runs in a threadpool so we don't block the loop.
        tracks = await run_in_threadpool(_search_ytdlp, q)
    if not tracks:
        raise HTTPException(status_code=502, detail="No results (all sources unavailable)")

    saved = []
    for t in tracks:
        if not t.get("yt_id"):
            continue
        song = _upsert_song(
            db,
            yt_id=t["yt_id"],
            title=t["title"],
            artist=t["artist"],
            thumbnail=t.get("thumbnail") or _yt_thumb(t["yt_id"]),
            duration=t.get("duration", 0),
        )
        saved.append(song)
    return saved


@router.get("/trending", response_model=list[SongOut])
async def trending(response: Response, db: Session = Depends(get_db)):
    # Return cached results if fresh.
    now = time.time()
    if _TRENDING_CACHE["data"] and now - _TRENDING_CACHE["ts"] < _TRENDING_TTL:
        # Stale-while-revalidate: serve from memory instantly, let client
        # know the data is fresh for 60s (CDN/browser) then revalidate.
        response.headers["Cache-Control"] = (
            "public, max-age=60, stale-while-revalidate=300"
        )
        return _TRENDING_CACHE["data"]

    # Try fetching live trending from YouTube via Piped (async),
    # then fall back to yt-dlp (sync, runs in threadpool).
    tracks: list[dict] = []
    try:
        tracks = await _fetch_trending_piped()
        if not tracks:
            tracks = await run_in_threadpool(_fetch_trending_ytdlp)
    except Exception:
        tracks = []

    # If YouTube is unreachable, fall back to seed data.
    if not tracks:
        seed_trending(db)
        songs = (
            db.query(Song)
            .order_by(Song.created_at.asc())
            .limit(20)
            .all()
        )
        response.headers["Cache-Control"] = (
            "public, max-age=60, stale-while-revalidate=300"
        )
        return songs

    # Upsert fetched tracks into the DB and return them.
    saved: list[Song] = []
    for t in tracks:
        if not t.get("yt_id"):
            continue
        song = _upsert_song(
            db,
            yt_id=t["yt_id"],
            title=t["title"],
            artist=t["artist"],
            thumbnail=t.get("thumbnail") or _yt_thumb(t["yt_id"]),
            duration=t.get("duration", 0),
        )
        saved.append(song)

    # Cache as plain dicts to avoid DetachedInstanceError across requests.
    _TRENDING_CACHE["data"] = [SongOut.model_validate(s).model_dump() for s in saved]
    _TRENDING_CACHE["ts"] = now
    response.headers["Cache-Control"] = (
        "public, max-age=60, stale-while-revalidate=300"
    )
    return saved


@router.get("/recommend", response_model=list[SongOut])
def recommend(mood: str = Query(...), db: Session = Depends(get_db)):
    songs = (
        db.query(Song)
        .filter(Song.mood == mood.lower().strip())
        .order_by(Song.created_at.desc())
        .limit(30)
        .all()
    )
    return songs


@router.post("/songs/{yt_id}/play")
def increment_play_count(yt_id: str, db: Session = Depends(get_db)):
    """Increment the play count for a song."""
    song = db.query(Song).filter(Song.yt_id == yt_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    song.play_count = (song.play_count or 0) + 1
    db.commit()
    return {"play_count": song.play_count}


@router.get("/explore", response_model=list[SongOut])
def explore(limit: int = Query(30, ge=1, le=50), db: Session = Depends(get_db)):
    """Return songs sorted by play count (most played first)."""
    songs = (
        db.query(Song)
        .order_by(Song.play_count.desc(), Song.created_at.desc())
        .limit(limit)
        .all()
    )
    return songs


def _download_mp3(yt_id: str) -> tuple[str, str, str]:
    """Run yt-dlp to produce an MP3 file. Returns (path, filename, tmpdir).

    Requires ffmpeg on PATH for the MP3 post-processing step.
    """
    tmpdir = tempfile.mkdtemp(prefix="nova_dl_")
    outtmpl = os.path.join(tmpdir, "%(title)s.%(ext)s")
    opts = {
        "format": "bestaudio/best",
        "outtmpl": outtmpl,
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={yt_id}", download=True)

    title = info.get("title", yt_id)
    # After post-processing the file has an .mp3 extension.
    mp3_path = None
    for fname in os.listdir(tmpdir):
        if fname.lower().endswith(".mp3"):
            mp3_path = os.path.join(tmpdir, fname)
            break
    if not mp3_path:
        shutil.rmtree(tmpdir, ignore_errors=True)
        raise RuntimeError("MP3 conversion failed (is ffmpeg installed?)")

    safe = "".join(c for c in title if c.isalnum() or c in " -_()").strip() or yt_id
    return mp3_path, f"{safe}.mp3", tmpdir


@router.get("/download/{yt_id}")
async def download(yt_id: str):
    try:
        path, filename, tmpdir = await run_in_threadpool(_download_mp3, yt_id)
    except Exception as exc:  # noqa: BLE001 - surface a clean 500 to the client
        raise HTTPException(status_code=500, detail=f"Download failed: {exc}")

    # Delete the temp dir once the response has been fully streamed.
    return FileResponse(
        path,
        media_type="audio/mpeg",
        filename=filename,
        background=BackgroundTask(shutil.rmtree, tmpdir, ignore_errors=True),
    )
