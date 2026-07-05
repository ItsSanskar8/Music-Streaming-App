// Playlist API — talks to the additive FastAPI routes in backend/routes/playlists.py.
// Reuses the shared axios instance (JWT interceptor) from services/api.ts.

import { api } from "@/services/api";
import type { Song } from "@/types";

export interface PlaylistSummary {
  id: number;
  name: string;
  cover_url: string | null;
  song_count: number;
}

export interface PlaylistDetail extends PlaylistSummary {
  songs: Song[];
}

export async function listPlaylists(): Promise<PlaylistSummary[]> {
  const { data } = await api.get<PlaylistSummary[]>("/playlists");
  return data;
}

export async function createPlaylist(
  name: string,
  coverUrl?: string
): Promise<PlaylistSummary> {
  const { data } = await api.post<PlaylistSummary>("/playlists", {
    name,
    cover_url: coverUrl ?? null,
  });
  return data;
}

export async function getPlaylist(id: number): Promise<PlaylistDetail> {
  const { data } = await api.get<PlaylistDetail>(`/playlists/${id}`);
  return data;
}

export async function updatePlaylist(
  id: number,
  patch: { name?: string; cover_url?: string }
): Promise<PlaylistSummary> {
  const { data } = await api.patch<PlaylistSummary>(`/playlists/${id}`, patch);
  return data;
}

export async function deletePlaylist(id: number): Promise<void> {
  await api.delete(`/playlists/${id}`);
}

// The backend upserts the song by yt_id — send the full track payload.
export async function addSongToPlaylist(
  id: number,
  song: Song
): Promise<PlaylistDetail> {
  const { data } = await api.post<PlaylistDetail>(`/playlists/${id}/songs`, {
    yt_id: song.yt_id,
    title: song.title,
    artist: song.artist,
    thumbnail: song.thumbnail ?? null,
    duration: song.duration ?? 0,
    mood: song.mood ?? null,
  });
  return data;
}

export async function removeSongFromPlaylist(
  id: number,
  songId: number
): Promise<PlaylistDetail> {
  const { data } = await api.delete<PlaylistDetail>(`/playlists/${id}/songs/${songId}`);
  return data;
}
