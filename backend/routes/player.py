"""Audio streaming proxy with HTTP Range support (enables seeking).

Flow:
  1. yt-dlp extracts the direct googlevideo audio URL for a video id
     (cached for an hour to avoid re-extraction on every range request).
  2. We proxy the client's `Range` header upstream and mirror the upstream
     `206 Partial Content` / `Content-Range` / `Content-Length` back down.

Because the browser's <audio> element issues range requests when the user
seeks, mirroring 206 + Content-Range is what makes the scrub bar work.
"""

import time

import httpx
import yt_dlp
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from starlette.concurrency import run_in_threadpool

router = APIRouter()

# Legal, freely-usable demo audio served when yt-dlp cannot resolve a stream
# (e.g. YouTube's "Sign in to confirm you're not a bot" bot check on the host).
# Keeps the <audio> player working instead of surfacing a 404.
FALLBACK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# yt_id -> (direct_url, expires_at_epoch)
_URL_CACHE: dict[str, tuple[str, float]] = {}
_CACHE_TTL = 3600  # seconds


# YouTube's "confirm you're not a bot" wall targets datacenter IPs (Render, AWS,
# GCP). The default `web` client trips it almost every time from a server. The
# mobile/tv/embedded player APIs use different endpoints that frequently DON'T,
# and — critically — need NO cookies. We try them in order and take the first
# that yields an audio URL. This is the load-bearing keyless-fetch trick.
_PLAYER_CLIENTS = ["android", "ios", "tv", "web_embedded", "web"]


def _url_from_info(info: dict) -> str | None:
    """Pull a usable audio URL out of a yt-dlp info dict, if present."""
    url = info.get("url")
    if url:
        return url
    # Some extractions nest the URL inside `requested_formats` / `formats`.
    formats = info.get("requested_formats") or info.get("formats") or []
    for f in reversed(formats):
        if f.get("acodec") not in (None, "none") and f.get("url"):
            return f["url"]
    return None


def _extract_audio_url(yt_id: str) -> str:
    """Resolve (and cache) the direct audio stream URL via yt-dlp. Blocking.

    Tries multiple YouTube player clients so a bot-check on one (typically
    `web` from a datacenter IP) doesn't sink the whole request. No cookies.
    """
    now = time.time()
    cached = _URL_CACHE.get(yt_id)
    if cached and cached[1] > now:
        return cached[0]

    watch_url = f"https://www.youtube.com/watch?v={yt_id}"
    last_err: Exception | None = None

    for client in _PLAYER_CLIENTS:
        opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "noplaylist": True,
            "extractor_args": {"youtube": {"player_client": [client]}},
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(watch_url, download=False)
            url = _url_from_info(info)
            if url:
                _URL_CACHE[yt_id] = (url, now + _CACHE_TTL)
                return url
            last_err = RuntimeError("No audio URL in info")
        except Exception as exc:  # noqa: BLE001 — try the next client
            last_err = exc
            print(f"[player] client {client!r} failed for {yt_id!r}: {exc!r}")

    raise RuntimeError(f"All player clients failed: {last_err!r}")


@router.get("/stream/{yt_id}")
async def stream(yt_id: str, request: Request):
    try:
        audio_url = await run_in_threadpool(_extract_audio_url, yt_id)
    except Exception as exc:  # noqa: BLE001
        # Don't 404 — YouTube may reject extraction (bot check, geo, throttling).
        # Fall back to a legal demo track so the player keeps working. The proxy
        # logic below is source-agnostic and preserves Range/seeking for it too.
        print(f"[player] yt-dlp failed for {yt_id!r}: {exc!r} — using fallback audio")
        audio_url = FALLBACK_AUDIO_URL

    # Forward the client's Range header (or default to the whole file).
    range_header = request.headers.get("range")
    upstream_headers = {"User-Agent": BROWSER_UA, "Accept-Encoding": "identity"}
    if range_header:
        upstream_headers["Range"] = range_header

    client = httpx.AsyncClient(timeout=None, follow_redirects=True)
    upstream_req = client.build_request("GET", audio_url, headers=upstream_headers)
    try:
        upstream = await client.send(upstream_req, stream=True)
    except httpx.HTTPError as exc:
        await client.aclose()
        raise HTTPException(status_code=502, detail=f"Upstream error: {exc}")

    if upstream.status_code >= 400:
        status = upstream.status_code
        await upstream.aclose()
        await client.aclose()
        raise HTTPException(status_code=status, detail="Upstream rejected the request")

    # Mirror the upstream's range/length headers so the browser can seek.
    resp_headers = {
        "Accept-Ranges": "bytes",
        "Content-Type": upstream.headers.get("Content-Type", "audio/mpeg"),
        "Cache-Control": "no-store",
    }
    if "Content-Range" in upstream.headers:
        resp_headers["Content-Range"] = upstream.headers["Content-Range"]
    if "Content-Length" in upstream.headers:
        resp_headers["Content-Length"] = upstream.headers["Content-Length"]

    async def body():
        try:
            async for chunk in upstream.aiter_bytes(chunk_size=65536):
                yield chunk
        finally:
            await upstream.aclose()
            await client.aclose()

    # 206 when a Range was served, else 200 — StreamingResponse honors it.
    return StreamingResponse(
        body(),
        status_code=upstream.status_code,
        headers=resp_headers,
    )
