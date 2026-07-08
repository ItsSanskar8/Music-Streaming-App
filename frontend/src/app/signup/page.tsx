"use client";

// Premium Nova signup — clear error handling for duplicate emails.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name.trim(), email.trim().toLowerCase(), password);
      toast.success("Account created!", { id: "auth-success" });
      router.push("/dashboard");
    } catch (err: any) {
      const raw = err?.message || "Unable to create account.";
      // Detect duplicate-email scenario from common backend messages.
      const msg = /already|exists|register/i.test(raw)
        ? "Email already registered. Try logging in or reset your password."
        : raw;
      setError(msg);
      toast.error(msg, { id: "auth-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nova-blue/10 blur-[140px]" />
        <div className="absolute right-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-nova-cyan/8 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-md">
              <Sparkles size={20} className="text-[#0F0F12]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nova</span>
          </Link>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
          Create your account
        </h1>
        <p className="mb-8 text-center text-sm text-white/40">
          Start streaming in seconds.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/35 outline-none transition-all focus:border-white/[0.12] focus:bg-white/[0.05]"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/35 outline-none transition-all focus:border-white/[0.12] focus:bg-white/[0.05]"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/35 outline-none transition-all focus:border-white/[0.12] focus:bg-white/[0.05]"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-medium text-red-400"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-white/60 transition-colors hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
