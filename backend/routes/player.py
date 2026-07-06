"""Audio streaming proxy with HTTP Range support (enables seeking).

Flow:
  1. yt-dlp extracts the direct googlevideo audio URL for a video id
     (cached for an hour to avoid re-extraction on every range request).
  2. We proxy the client's `Range` header upstream and mirror the upstream
     `206 Partial Content` / `Content-Range` / `Content-Length` back down.

Because the browser's <audio> element issues range requests when the user
seeks, mirroring 206 + Content-Range is what makes the scrub bar work.
"""

import os
import time

import httpx
import yt_dlp
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from starlette.concurrency import run_in_threadpool

router = APIRouter()

# Optional residential/rotating proxies. YouTube blocks datacenter IPs (Render,
# AWS, GCP) with a bot-check, so on those hosts extraction must run through a
# proxy. Set PROXY_URL to ONE proxy or a COMMA-SEPARATED LIST, e.g.
#   http://user:pass@host1:port,http://user:pass@host2:port
# We try them in order and use the first that resolves — so when a single proxy
# IP gets blocked, the backend auto-fails-over to the next with no redeploy.
# Left unset (local dev on a residential IP), everything works proxy-free.
PROXY_LIST = [p.strip() for p in os.environ.get("PROXY_URL", "").split(",") if p.strip()]
# `None` means "no proxy / direct connection" — the local-dev path.
_PROXY_CANDIDATES = PROXY_LIST or [None]

# Legal, freely-usable demo audio served when yt-dlp cannot resolve a stream
# (e.g. YouTube's "Sign in to confirm you're not a bot" bot check on the host).
# Keeps the <audio> player working instead of surfacing a 404.
FALLBACK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# yt_id -> (direct_url, proxy_used, expires_at_epoch). We cache the proxy too
# because a googlevideo URL is IP-locked to whichever proxy extracted it, so the
# byte-stream fetch must reuse that exact proxy.
_URL_CACHE: dict[str, tuple[str, str | None, float]] = {}
_CACHE_TTL = 3600  # seconds


# YouTube's "confirm you're not a bot" wall targets datacenter IPs (Render, AWS,
# GCP). The default `web` client trips it almost every time from a server. The
# mobile/tv/embedded player APIs use different endpoints that frequently DON'T,
# and — critically — need NO cookies. We try them in order and take the first
# that yields an audio URL. This is the load-bearing keyless-fetch trick.
_PLAYER_CLIENTS = ["android", "ios", "tv", "web_embedded", "web"]


def _proxy_tag(proxy: str | None) -> str:
    """Short, password-free label for a proxy, for log lines."""
    if not proxy:
        return "direct"
    host = proxy.split("@")[-1]  # drop user:pass@ if present
    return f"proxy[{host}]"


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


def _extract_audio_url(yt_id: str) -> tuple[str, str | None]:
    """Resolve (and cache) the direct audio stream URL via yt-dlp. Blocking.

    Returns (audio_url, proxy_used) — the caller must reuse `proxy_used` for the
    byte-stream fetch because googlevideo URLs are IP-locked to the extractor.

    Tries each proxy candidate, and within each, multiple YouTube player clients,
    so a bot-check on one client OR a blocked proxy IP doesn't sink the request.
    Auto-fails-over to the next proxy in the list. No cookies.
    """
    now = time.time()
    cached = _URL_CACHE.get(yt_id)
    if cached and cached[2] > now:
        return cached[0], cached[1]

    watch_url = f"https://www.youtube.com/watch?v={yt_id}"
    last_err: Exception | None = None

    for proxy in _PROXY_CANDIDATES:
        for client in _PLAYER_CLIENTS:
            opts = {
                "format": "bestaudio/best",
                "quiet": True,
                "no_warnings": True,
                "skip_download": True,
                "noplaylist": True,
                "extractor_args": {"youtube": {"player_client": [client]}},
            }
            if proxy:
                opts["proxy"] = proxy
            try:
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(watch_url, download=False)
                url = _url_from_info(info)
                if url:
                    _URL_CACHE[yt_id] = (url, proxy, now + _CACHE_TTL)
                    return url, proxy
                last_err = RuntimeError("No audio URL in info")
            except Exception as exc:  # noqa: BLE001 — try next client/proxy
                last_err = exc
                tag = _proxy_tag(proxy)
                print(f"[player] {tag} client {client!r} failed for {yt_id!r}: {exc!r}")

    raise RuntimeError(f"All proxies/clients failed: {last_err!r}")


@router.get("/stream/{yt_id}")
async def stream(yt_id: str, request: Request):
    used_fallback = False
    stream_proxy: str | None = None
    try:
        audio_url, stream_proxy = await run_in_threadpool(_extract_audio_url, yt_id)
    except Exception as exc:  # noqa: BLE001
        # Don't 404 — YouTube may reject extraction (bot check, geo, throttling).
        # Fall back to a legal demo track so the player keeps working. The proxy
        # logic below is source-agnostic and preserves Range/seeking for it too.
        print(f"[player] yt-dlp failed for {yt_id!r}: {exc!r} — using fallback audio")
        audio_url = FALLBACK_AUDIO_URL
        used_fallback = True

    # Forward the client's Range header (or default to the whole file).
    range_header = request.headers.get("range")
    upstream_headers = {"User-Agent": BROWSER_UA, "Accept-Encoding": "identity"}
    if range_header:
        upstream_headers["Range"] = range_header

    # googlevideo URLs are locked to the IP that extracted them, so the audio
    # fetch must go through the SAME proxy that _extract_audio_url used. The
    # SoundHelix fallback is public and needs no proxy — fetch it directly.
    if used_fallback:
        stream_proxy = None
    client = httpx.AsyncClient(timeout=None, follow_redirects=True, proxy=stream_proxy)
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
