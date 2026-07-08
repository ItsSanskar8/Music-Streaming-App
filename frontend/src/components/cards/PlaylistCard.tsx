"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

// Glass playlist card. Uses a cover image when present, else a branded
// gradient tile. Links to the playlist detail route when href is given.

interface Props {
  title: string;
  subtitle?: string;
  cover?: string | null;
  gradient?: string;
  href?: string;
  index?: number;
  onClick?: () => void;
}

export default function PlaylistCard({
  title,
  subtitle,
  cover,
  gradient = "from-nova-blue/40 to-nova-cyan/30",
  href,
  index = 0,
  onClick,
}: Props) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -6 }}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-shadow hover:shadow-glow-indigo"
    >
      <div className={`relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}>
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width:768px) 45vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 size={40} className="text-white/70" />
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        {subtitle && <p className="truncate text-xs text-white/50">{subtitle}</p>}
      </div>
    </motion.div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <div onClick={onClick}>{inner}</div>;
}
