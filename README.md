# 🎧 SoundVerse — Futuristic Music Streaming UI

A premium, animated, dark, futuristic music app **UI only** built with
Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion and
Lucide React.

> No backend, no auth, no real audio — just a beautiful, responsive interface
> ready for you to plug your own music logic into.

## ✨ Features / Sections

- **Sidebar** — logo + nav (Discover, Library, Playlists, Artists, Albums, Downloads, Settings). Collapses to a drawer on mobile.
- **TopBar** — search input, theme/action button, notifications, profile chip.
- **HeroSection** — featured song with floating artwork, mood tags, Play Now & Add to Queue.
- **MoodDiscovery** — animated mood cards (Focus, Coding, Gym, Chill, Rainy, Late Night, Party, Deep Work).
- **TrendingSongs** — song rows with cover, title, artist, duration, like/play/queue.
- **PlaylistGalaxy** — glowing floating playlist cards.
- **NowPlayingPanel** — artwork, **CSS-only waveform**, queue preview, lyrics preview.
- **BottomPlayer** — sticky player: transport controls, progress bar, volume, shuffle/repeat, queue icon.

Design: glassmorphism, neon gradients, animated aurora background, glowing borders, floating cards, smooth hover effects, fully responsive.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## 🗂️ Project Structure

```
app/
  layout.tsx          # Root layout: fonts, aurora bg, PlayerProvider
  page.tsx            # Assembles all sections
  globals.css         # Glass / neon / aurora / waveform / slider styles
components/
  AuroraBackground.tsx
  Sidebar.tsx
  TopBar.tsx
  HeroSection.tsx
  MoodDiscovery.tsx
  TrendingSongs.tsx
  PlaylistGalaxy.tsx
  NowPlayingPanel.tsx
  BottomPlayer.tsx
  SongCard.tsx        # reusable
  PlaylistCard.tsx    # reusable
lib/
  mockData.ts         # songs, playlists, moods, queue (swap for real API later)
  PlayerContext.tsx   # placeholder handlers + shared UI state
```

## 🔌 Where to write YOUR logic later

All music logic lives in **`lib/PlayerContext.tsx`** as placeholder handlers.
Each one just updates a little UI state and `console.log`s for now:

`handlePlay`, `handlePause`, `handleNext`, `handlePrevious`, `handleLike`,
`handleSearch`, `handleAddToQueue`, `handleSelectSong`, `handleSelectPlaylist`.

To connect a **FastAPI + MySQL** backend later:

1. Replace the arrays in `lib/mockData.ts` with data fetched from your API
   (keep the same `type` shapes and the whole UI keeps working).
2. Fill in the bodies of the handlers in `lib/PlayerContext.tsx`
   (e.g. control an `<audio>` element, call your endpoints).

That's it — the UI is fully decoupled from the logic.
