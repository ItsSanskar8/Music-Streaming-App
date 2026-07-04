"use client";

// ------------------------------------------------------------------
//  SoundVerse — PLAYER CONTEXT
// ------------------------------------------------------------------
//  A tiny React context that keeps track of the "currently selected"
//  song, the play/pause state, and the queue so every component
//  (BottomPlayer, NowPlayingPanel, SongCard...) can share them.
//
//  IMPORTANT: The handlers below are PLACEHOLDERS only. They update
//  a little UI state and console.log what happened. You will replace
//  the bodies with your real music logic later (e.g. call your
//  FastAPI backend, control an <audio> element, etc.).
// ------------------------------------------------------------------

import React, { createContext, useContext, useMemo, useState } from "react";
import { queue as initialQueue, songs, featuredSong } from "./mockData";
import type { Song, Playlist } from "./mockData";

type PlayerContextType = {
  currentSong: Song;
  isPlaying: boolean;
  queue: Song[];
  likedIds: string[];

  // Placeholder handlers — write your real logic inside these later.
  handlePlay: (song?: Song) => void;
  handlePause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleLike: (song: Song) => void;
  handleSearch: (query: string) => void;
  handleAddToQueue: (song: Song) => void;
  handleSelectSong: (song: Song) => void;
  handleSelectPlaylist: (playlist: Playlist) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // --- UI state (safe to keep — this is not "music logic") ---
  const [currentSong, setCurrentSong] = useState<Song>(featuredSong);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queueList, setQueueList] = useState<Song[]>(initialQueue);
  const [likedIds, setLikedIds] = useState<string[]>(
    songs.filter((s) => s.liked).map((s) => s.id)
  );

  // --------------------------------------------------------------
  //  PLACEHOLDER HANDLERS
  //  TODO(you): connect these to your real audio / backend logic.
  // --------------------------------------------------------------

  const handlePlay = (song?: Song) => {
    // TODO: start real playback here.
    if (song) setCurrentSong(song);
    setIsPlaying(true);
    console.log("[handlePlay]", song?.title ?? currentSong.title);
  };

  const handlePause = () => {
    // TODO: pause real playback here.
    setIsPlaying(false);
    console.log("[handlePause]");
  };

  const handleNext = () => {
    // TODO: advance to the next real track.
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const next = songs[(idx + 1) % songs.length];
    setCurrentSong(next);
    console.log("[handleNext]", next.title);
  };

  const handlePrevious = () => {
    // TODO: go to the previous real track.
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setCurrentSong(prev);
    console.log("[handlePrevious]", prev.title);
  };

  const handleLike = (song: Song) => {
    // TODO: persist the like on your backend.
    setLikedIds((prev) =>
      prev.includes(song.id)
        ? prev.filter((id) => id !== song.id)
        : [...prev, song.id]
    );
    console.log("[handleLike]", song.title);
  };

  const handleSearch = (query: string) => {
    // TODO: run a real search against your API.
    console.log("[handleSearch]", query);
  };

  const handleAddToQueue = (song: Song) => {
    // TODO: add to the real queue.
    setQueueList((prev) => [...prev, song]);
    console.log("[handleAddToQueue]", song.title);
  };

  const handleSelectSong = (song: Song) => {
    // TODO: open / focus this song. For now we just set it as current.
    setCurrentSong(song);
    console.log("[handleSelectSong]", song.title);
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    // TODO: open this playlist's detail view.
    console.log("[handleSelectPlaylist]", playlist.name);
  };

  const value = useMemo<PlayerContextType>(
    () => ({
      currentSong,
      isPlaying,
      queue: queueList,
      likedIds,
      handlePlay,
      handlePause,
      handleNext,
      handlePrevious,
      handleLike,
      handleSearch,
      handleAddToQueue,
      handleSelectSong,
      handleSelectPlaylist,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSong, isPlaying, queueList, likedIds]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// Handy hook so components can do: const { handlePlay } = usePlayer();
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}
