# 🌌 Nova — Keyless Music Streaming

Premium, dark-mode, Apple-aesthetic music app. Real-time YouTube Music
search + streaming (with seek), MP3 download, and a local TextBlob mood
recommender. **Zero API keys** — audio is proxied through a local yt-dlp +
FastAPI backend.

```
backend/    FastAPI + SQLite + yt-dlp + TextBlob  (port 8000)
frontend/   Next.js 14 App Router + Tailwind      (port 3000)
```

## ✅ Verified working

- JWT signup / login / me (bcrypt hashing)
- Trending seed + TextBlob mood tagging
- Search (public Piped instances → yt-dlp fallback), saved to SQLite with a mood
- **Streaming with HTTP Range → `206 Partial Content` (seeking works)**
- MP3 download → real 192 kbps file as an attachment

## Prerequisites

- **Python 3.11+**
- **Node 18+**
- **ffmpeg** on your PATH (required for MP3 download conversion)
  - macOS: `brew install ffmpeg` · Ubuntu: `sudo apt install ffmpeg`

## 1) Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> ⚠️ **Keep yt-dlp current.** YouTube changes frequently and breaks older
> yt-dlp releases (symptom: streaming returns 404 "Requested format is not
> available"). Fix with `pip install --upgrade yt-dlp`.

API docs: <http://localhost:8000/docs>

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>. `frontend/.env.local` already points
`NEXT_PUBLIC_API_URL` at `http://localhost:8000`.

## How seeking works (the critical bit)

`frontend` sets `<audio>.src = http://localhost:8000/api/stream/{yt_id}`.
When you scrub, the browser sets `audio.currentTime`, which fires a ranged
`GET` (`Range: bytes=…`). `backend/routes/player.py` resolves the direct
audio URL via yt-dlp (cached 1h), forwards your `Range` header upstream, and
mirrors the upstream `206` + `Content-Range` + `Content-Length` back — so the
scrub bar seeks instantly instead of re-downloading from zero.

## Endpoints

| Method | Path | Purpose |
|-------|------|---------|
| POST | `/api/auth/signup` · `/api/auth/login` | Auth → JWT |
| GET | `/api/auth/me` | Current user (Bearer) |
| GET | `/api/search?q=` | Search + mood-tag + persist |
| GET | `/api/trending` | Seeded trending list |
| GET | `/api/recommend?mood=` | Songs by mood |
| GET | `/api/stream/{yt_id}` | Ranged audio proxy (seek) |
| GET | `/api/download/{yt_id}` | MP3 attachment |
