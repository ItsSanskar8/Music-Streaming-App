"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

// Circular royal-blue→cyan gradient play/pause button. Reused everywhere.

interface Props {
  playing?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const SIZES = {
  sm: { box: "h-9 w-9", icon: 15 },
  md: { box: "h-12 w-12", icon: 20 },
  lg: { box: "h-16 w-16", icon: 26 },
};

export default function PlayButton({
  playing = false,
  onClick,
  size = "md",
  className = "",
  label,
}: Props) {
  const s = SIZES[size];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label={label ?? (playing ? "Pause" : "Play")}
      className={`flex ${s.box} items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan transition-shadow hover:shadow-glow-blue ${className}`}
    >
      {playing ? (
        <Pause size={s.icon} className="fill-black" />
      ) : (
        <Play size={s.icon} className="translate-x-[1px] fill-black" />
      )}
    </motion.button>
  );
}
