"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Circular artist portrait with name + optional metric (e.g. monthly listeners).

interface Props {
  name: string;
  image?: string | null;
  meta?: string;
  index?: number;
  href?: string;
  onClick?: () => void;
}

export default function ArtistCard({ name, image, meta, index = 0, href, onClick }: Props) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col items-center text-center"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/[0.08] bg-white/5 ring-0 transition-all duration-300 group-hover:ring-2 group-hover:ring-nova-cyan/40">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 30vw, 160px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-white">{name}</p>
      {meta && <p className="truncate text-xs text-white/45">{meta}</p>}
    </motion.div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <div>{inner}</div>;
}
