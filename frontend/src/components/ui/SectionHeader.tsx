"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Consistent section title (+ optional subtitle / "see all" link) used to
// head every dashboard/landing row. Animates in on scroll.

interface Props {
  title: string;
  subtitle?: string;
  href?: string;
  action?: string;
}

export default function SectionHeader({ title, subtitle, href, action = "See all" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5 flex items-end justify-between gap-4"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-white/50">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-sm font-medium text-white/60 transition-colors hover:text-nova-cyan"
        >
          {action}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </motion.div>
  );
}
