// Axios wrapper with a JWT interceptor plus typed API helper functions.

import axios from "axios";
import type { AuthResponse, Song, User } from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "nova_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Attach the Bearer token to every request if we have one.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------- Auth --------------------------- //
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password,
  });
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

// --------------------------- Music -------------------------- //
export async function searchSongs(q: string): Promise<Song[]> {
  const { data } = await api.get<Song[]>("/search", { params: { q } });
  return data;
}

export async function getTrending(): Promise<Song[]> {
  const { data } = await api.get<Song[]>("/trending");
  return data;
}

export async function recommendByMood(mood: string): Promise<Song[]> {
  const { data } = await api.get<Song[]>("/recommend", { params: { mood } });
  return data;
}

// --------------------- Streaming / Download ----------------- //
// The <audio> element points its src straight at this proxy URL so the
// browser can issue Range requests against the backend for seeking.
export function getStreamUrl(ytId: string): string {
  return `${API_URL}/api/stream/${ytId}`;
}

export function getDownloadUrl(ytId: string): string {
  return `${API_URL}/api/download/${ytId}`;
}

// Trigger a real browser download via the backend attachment response.
export function triggerDownload(song: Song) {
  const a = document.createElement("a");
  a.href = getDownloadUrl(song.yt_id);
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
