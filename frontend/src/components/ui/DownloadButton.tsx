"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Song } from "@/types";
import { triggerDownload } from "@/services/api";

// Triggers a backend MP3 download (GET /api/download/{yt_id}) via a hidden
// anchor. Local (imported) songs can't be re-downloaded from the backend.

interface Props {
  song: Song;
  size?: number;
  className?: string;
}

export default function DownloadButton({ song, size = 18, className = "" }: Props) {
  const [busy, setBusy] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.isLocal) {
      toast("This track is a local import", { icon: "💾" });
      return;
    }
    setBusy(true);
    triggerDownload(song);
    toast.success(`Preparing “${song.title}”…`);
    // The browser handles the streamed attachment; clear the spinner shortly.
    setTimeout(() => setBusy(false), 2500);
  };

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-label="Download MP3"
      className={`text-white/45 transition-colors hover:text-nova-cyan disabled:opacity-60 ${className}`}
    >
      {busy ? <Loader2 size={size} className="animate-spin" /> : <Download size={size} />}
    </button>
  );
}
