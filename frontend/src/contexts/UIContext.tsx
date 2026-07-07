"use client";

// UIContext — lightweight global UI state for the chrome overlays:
// the Now-Playing right panel, the Queue drawer, and the Command Palette.
// Kept separate from PlayerContext so playback logic stays clean.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface UIContextValue {
  nowPlayingOpen: boolean;
  queueOpen: boolean;
  commandOpen: boolean;
  sidebarOpen: boolean;
  toggleNowPlaying: () => void;
  setNowPlaying: (v: boolean) => void;
  toggleQueue: () => void;
  setQueue: (v: boolean) => void;
  openCommand: () => void;
  setCommand: (v: boolean) => void;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Cmd+K / Ctrl+K to open the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleNowPlaying = useCallback(() => setNowPlayingOpen((v) => !v), []);
  const toggleQueue = useCallback(() => setQueueOpen((v) => !v), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <UIContext.Provider
      value={{
        nowPlayingOpen,
        queueOpen,
        commandOpen,
        sidebarOpen,
        toggleNowPlaying,
        setNowPlaying: setNowPlayingOpen,
        toggleQueue,
        setQueue: setQueueOpen,
        openCommand,
        setCommand: setCommandOpen,
        toggleSidebar,
        setSidebar: setSidebarOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}
