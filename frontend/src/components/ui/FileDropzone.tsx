"use client";

// FileDropzone — drag & drop MP3 files to play them locally via blob URLs.

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, File, Music } from "lucide-react";
import toast from "react-hot-toast";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Song } from "@/types";

export default function FileDropzone() {
  const { registerSongs, playSong } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const mp3Files = Array.from(files).filter(
        (f) => f.type === "audio/mpeg" || f.name.endsWith(".mp3")
      );

      if (mp3Files.length === 0) {
        toast.error("No MP3 files found");
        return;
      }

      const songs: Song[] = mp3Files.map((file, i) => {
        // Parse filename to extract title/artist (e.g., "Artist - Title.mp3")
        const nameWithoutExt = file.name.replace(/\.mp3$/i, "");
        const parts = nameWithoutExt.split(" - ");
        const artist = parts.length > 1 ? parts[0].trim() : "Unknown Artist";
        const title = parts.length > 1 ? parts[1].trim() : nameWithoutExt;

        return {
          id: Date.now() + i,
          yt_id: `local_${Date.now()}_${i}`,
          title,
          artist,
          thumbnail: null,
          duration: 0,
          mood: "chill",
          localUrl: URL.createObjectURL(file),
          isLocal: true,
        };
      });

      registerSongs(songs);
      toast.success(`Imported ${songs.length} track${songs.length > 1 ? "s" : ""}`);

      // Auto-play first imported song
      if (songs.length > 0) {
        playSong(songs[0], songs);
      }
    },
    [registerSongs, playSong]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
        isDragging
          ? "border-brand-cyan/60 bg-brand-cyan/10"
          : "border-white/[0.12] bg-white/[0.03] hover:border-brand-lavender/40 hover:bg-white/[0.05]"
      }`}
    >
      <div className="relative z-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {isDragging ? (
            <Upload size={28} className="text-brand-cyan" />
          ) : (
            <Music size={28} className="text-brand-lavender" />
          )}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-white">
          {isDragging ? "Drop your files" : "Import Local MP3s"}
        </h3>
        <p className="mb-6 text-sm text-white/45">
          Drag & drop MP3 files or click to browse
        </p>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-lavender/30 bg-brand-lavender/10 px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
          <File size={16} />
          Choose Files
          <input
            type="file"
            multiple
            accept="audio/mpeg,.mp3"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Glow effect on drag */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute inset-0 bg-gradient-radial from-brand-cyan/20 to-transparent"
        />
      )}
    </motion.div>
  );
}
