// Axios wrapper with a JWT interceptor plus typed API helper functions.

import axios from "axios";
import type { AuthResponse, Song, User } from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "nova_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),

  set: (t: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, t);
    }
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
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

// Better FastAPI error message helper.
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg).join(", ");
    }

    if (typeof detail === "string") {
      return detail;
    }

    return error.response?.data?.message || error.message || "Request failed";
  }

  return "Something went wrong";
}

// --------------------------- Auth --------------------------- //
export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    // Important fix: save token after successful signup
    if (data.access_token) {
      tokenStore.set(data.access_token);
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    // Important fix: save token after successful login
    if (data.access_token) {
      tokenStore.set(data.access_token);
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getMe(): Promise<User> {
  try {
    const { data } = await api.get<User>("/auth/me");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function logout() {
  tokenStore.clear();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export interface ForgotResponse {
  detail: string;
  reset_token?: string | null;
}

export async function forgotPassword(email: string): Promise<ForgotResponse> {
  try {
    const { data } = await api.post<ForgotResponse>("/auth/forgot-password", {
      email: email.trim().toLowerCase(),
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/reset-password", {
      token,
      password,
    });
    if (data.access_token) tokenStore.set(data.access_token);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
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

export async function incrementPlayCount(ytId: string): Promise<void> {
  await api.post(`/songs/${ytId}/play`);
}

export async function getExplore(limit = 20): Promise<Song[]> {
  const { data } = await api.get<Song[]>("/explore", { params: { limit } });
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