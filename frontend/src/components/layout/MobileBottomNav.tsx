"use client";

// Mobile-only bottom navigation — refined v5. Cleaner active states, muted colors.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, TrendingUp, Heart, ListMusic } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Compass },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/liked", label: "Liked", icon: Heart },
  { href: "/playlists", label: "Library", icon: ListMusic },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-white/[0.06] bg-nova-bg/85 backdrop-blur-2xl md:hidden"
    >
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
              active ? "text-nova-blue" : "text-white/35"
            }`}
          >
            <Icon size={19} strokeWidth={active ? 2.2 : 1.7} />
            {label}
          </Link>
        );
      })}
    </motion.nav>
  );
}
