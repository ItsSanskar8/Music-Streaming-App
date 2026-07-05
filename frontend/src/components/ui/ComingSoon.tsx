"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

// Elegant placeholder for pages arriving in a later Nova phase. Keeps the app
// fully navigable (no dead 404s) while the design system is in place.

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan"
        >
          <Sparkles size={26} className="text-black" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-white/50">{description}</p>
        <span className="pill mt-6">Coming soon to Nova</span>
      </div>
    </AuthGuard>
  );
}
