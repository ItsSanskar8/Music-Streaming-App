// Liked-songs API — backend/routes/likes.py. Durable, cross-device likes.
// (The PlayerContext also keeps a localStorage cache for instant UX; a later
// phase syncs the two. These helpers are the server source of truth.)

import { api } from "@/services/api";
import type { Song } from "@/types";

export async function listLikes(): Promise<Song[]> {
  const { data } = await api.get<Song[]>("/likes");
  return data;
}

export async function addLike(song: Song): Promise<Song> {
  const { data } = await api.post<Song>("/likes", {
    yt_id: song.yt_id,
    title: song.title,
    artist: song.artist,
    thumbnail: song.thumbnail ?? null,
    duration: song.duration ?? 0,
    mood: song.mood ?? null,
  });
  return data;
}

export async function removeLike(ytId: string): Promise<void> {
  await api.delete(`/likes/${ytId}`);
}
