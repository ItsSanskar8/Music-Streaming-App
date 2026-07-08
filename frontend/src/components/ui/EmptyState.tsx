"use client";

// EmptyState — friendly icon + text shown when a collection is empty.

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-nova-blue">
        <Icon size={26} />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {subtitle && (
        <p className="mt-1 max-w-sm text-sm text-white/45">{subtitle}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
