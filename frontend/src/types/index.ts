// Shared domain types for Nova. These mirror the backend Pydantic schemas.

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export type Mood =
  | "chill"
  | "energetic"
  | "ambient"
  | "focus"
  | "happy"
  | "melancholic";

export interface Song {
  id: number;
  yt_id: string;
  title: string;
  artist: string;
  thumbnail?: string | null;
  duration: number; // seconds
  mood: Mood | string;
  play_count?: number;
  // Set for locally-imported MP3s: a blob URL used directly as the <audio>
  // src (bypasses the backend stream proxy). Undefined for streamed songs.
  localUrl?: string;
  isLocal?: boolean;
}

export interface Playlist {
  id: number;
  user_id: number;
  name: string;
  cover_url?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
