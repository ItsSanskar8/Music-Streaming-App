// ------------------------------------------------------------------
//  SoundVerse — MOCK DATA
// ------------------------------------------------------------------
//  This is all placeholder data so the UI has something to render.
//  Later you can replace these arrays with data coming from your
//  FastAPI + MySQL backend. Keep the shapes (the `type`s below) the
//  same and the whole UI will keep working.
//
//  NOTE: Artwork uses CSS gradients (no real image files needed) so
//  the app runs fully offline. Swap `cover` for a real image URL later.
// ------------------------------------------------------------------

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // display string e.g. "3:45"
  cover: string; // tailwind gradient classes used as artwork
  liked: boolean;
  moods: string[];
};

export type Playlist = {
  id: string;
  name: string;
  mood: string;
  songsCount: number;
  cover: string; // tailwind gradient classes
  accent: string; // rgba glow color for the card
};

export type Mood = {
  id: string;
  name: string;
  emoji: string;
  gradient: string; // tailwind gradient classes
};

// ------------------------------------------------------------------
//  SONGS
// ------------------------------------------------------------------
export const songs: Song[] = [
  {
    id: "s1",
    title: "Neon Dreams",
    artist: "Astra Vale",
    album: "Hologram",
    duration: "3:42",
    cover: "from-fuchsia-500 via-purple-600 to-indigo-700",
    liked: true,
    moods: ["Late Night", "Chill"],
  },
  {
    id: "s2",
    title: "Quantum Pulse",
    artist: "Nova Kite",
    album: "Signal",
    duration: "4:11",
    cover: "from-cyan-400 via-sky-500 to-blue-700",
    liked: false,
    moods: ["Focus", "Coding"],
  },
  {
    id: "s3",
    title: "Midnight Circuit",
    artist: "Echo Prism",
    album: "Voltage",
    duration: "2:58",
    cover: "from-rose-500 via-pink-600 to-fuchsia-700",
    liked: false,
    moods: ["Party", "Gym"],
  },
  {
    id: "s4",
    title: "Gravity Fall",
    artist: "Lumen Sky",
    album: "Orbit",
    duration: "3:27",
    cover: "from-emerald-400 via-teal-500 to-cyan-700",
    liked: true,
    moods: ["Deep Work", "Focus"],
  },
  {
    id: "s5",
    title: "Aurora Bloom",
    artist: "Vela Ross",
    album: "Northern",
    duration: "5:03",
    cover: "from-violet-500 via-purple-600 to-blue-700",
    liked: false,
    moods: ["Chill", "Rainy"],
  },
  {
    id: "s6",
    title: "Hyperdrive",
    artist: "Zenith 9",
    album: "Warp",
    duration: "3:15",
    cover: "from-orange-400 via-rose-500 to-purple-700",
    liked: false,
    moods: ["Gym", "Party"],
  },
  {
    id: "s7",
    title: "Rain On Mars",
    artist: "Astra Vale",
    album: "Hologram",
    duration: "4:36",
    cover: "from-sky-400 via-indigo-500 to-violet-700",
    liked: true,
    moods: ["Rainy", "Late Night"],
  },
  {
    id: "s8",
    title: "Silent Frequency",
    artist: "Nova Kite",
    album: "Signal",
    duration: "3:49",
    cover: "from-teal-400 via-emerald-500 to-green-700",
    liked: false,
    moods: ["Deep Work", "Coding"],
  },
];

// ------------------------------------------------------------------
//  PLAYLISTS  (the "Playlist Galaxy")
// ------------------------------------------------------------------
export const playlists: Playlist[] = [
  {
    id: "p1",
    name: "Cosmic Focus",
    mood: "Deep Work",
    songsCount: 42,
    cover: "from-indigo-500 via-purple-600 to-fuchsia-700",
    accent: "rgba(168, 85, 247, 0.5)",
  },
  {
    id: "p2",
    name: "Neon Nights",
    mood: "Late Night",
    songsCount: 28,
    cover: "from-fuchsia-500 via-pink-600 to-rose-700",
    accent: "rgba(236, 72, 153, 0.5)",
  },
  {
    id: "p3",
    name: "Hyper Cardio",
    mood: "Gym",
    songsCount: 55,
    cover: "from-orange-400 via-red-500 to-rose-700",
    accent: "rgba(251, 146, 60, 0.5)",
  },
  {
    id: "p4",
    name: "Liquid Chill",
    mood: "Chill",
    songsCount: 33,
    cover: "from-cyan-400 via-sky-500 to-indigo-700",
    accent: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: "p5",
    name: "Rain Sessions",
    mood: "Rainy",
    songsCount: 19,
    cover: "from-slate-400 via-sky-600 to-blue-800",
    accent: "rgba(99, 102, 241, 0.5)",
  },
  {
    id: "p6",
    name: "Code & Coffee",
    mood: "Coding",
    songsCount: 47,
    cover: "from-emerald-400 via-teal-500 to-cyan-700",
    accent: "rgba(52, 211, 153, 0.5)",
  },
];

// ------------------------------------------------------------------
//  MOODS  (the "Mood Discovery" grid)
// ------------------------------------------------------------------
export const moods: Mood[] = [
  { id: "m1", name: "Focus", emoji: "🎯", gradient: "from-indigo-500 to-blue-600" },
  { id: "m2", name: "Coding", emoji: "💻", gradient: "from-emerald-500 to-teal-600" },
  { id: "m3", name: "Gym", emoji: "🔥", gradient: "from-orange-500 to-red-600" },
  { id: "m4", name: "Chill", emoji: "🌊", gradient: "from-cyan-500 to-sky-600" },
  { id: "m5", name: "Rainy", emoji: "🌧️", gradient: "from-slate-500 to-indigo-600" },
  { id: "m6", name: "Late Night", emoji: "🌙", gradient: "from-violet-600 to-purple-700" },
  { id: "m7", name: "Party", emoji: "🎉", gradient: "from-pink-500 to-fuchsia-600" },
  { id: "m8", name: "Deep Work", emoji: "🧠", gradient: "from-fuchsia-600 to-purple-700" },
];

// ------------------------------------------------------------------
//  QUEUE  (preview list shown in Now Playing + player)
//  Just reuses a few songs from above.
// ------------------------------------------------------------------
export const queue: Song[] = [songs[1], songs[3], songs[6], songs[4], songs[7]];

// The song featured in the Hero section.
export const featuredSong: Song = songs[0];

// A short lyrics preview (placeholder text).
export const lyricsPreview: string[] = [
  "City lights dissolve in violet rain,",
  "We chase the signal down the neon lane,",
  "Every heartbeat syncs to the machine,",
  "Lost inside a dream we've never seen...",
];
