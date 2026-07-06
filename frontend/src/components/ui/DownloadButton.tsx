"use client";

import { useState } from "react";
import { Download, Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Song } from "@/types";
import { triggerDownload } from "@/services/api";
import { usePlayer } from "@/contexts/PlayerContext";

// Downloads or removes a song from the downloads list.

interface Props {
  song: Song;
  size?: number;
  className?: string;
}

export default function DownloadButton({ song, size = 18, className = "" }: Props) {
  const [busy, setBusy] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addDownload, removeDownload, isDownloaded } = usePlayer();
  const downloaded = isDownloaded(song);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (downloaded) {
      removeDownload(song.yt_id);
      return;
    }

    if (song.isLocal) {
      toast("This track is a local import", { icon: "💾" });
      return;
    }
    setBusy(true);
    addDownload(song);
    triggerDownload(song);
    toast.success(`Preparing "${song.title}"…`);
    setTimeout(() => setBusy(false), 2500);
  };

  return (
    <span className="ml-0.5 flex h-7 w-7 items-center justify-center">
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={busy}
        aria-label={downloaded ? "Remove from downloads" : "Download MP3"}
        title={downloaded ? "Remove from downloads" : "Download MP3"}
        className={`transition-colors disabled:opacity-60 ${
          downloaded
            ? hovered
              ? "text-red-400"
              : "text-nova-cyan"
            : "text-white/45 hover:text-nova-cyan"
        } ${className}`}
      >
        {busy ? (
          <Loader2 size={size} className="animate-spin" />
        ) : downloaded ? (
          hovered ? <X size={size} /> : <Check size={size} />
        ) : (
          <Download size={size} />
        )}
      </button>
    </span>
  );
}
