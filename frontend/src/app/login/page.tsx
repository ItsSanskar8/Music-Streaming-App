"use client";

// Premium Nova login — clear 401 handling, toast, forgot-password link.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success("Welcome back!", { id: "auth-success" });
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password. Please try again.";
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nova</span>
          </Link>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mb-8 text-center text-sm font-medium text-white/50">
          Sign in to continue to Nova.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40 focus:shadow-glow-cyan focus:bg-white/[0.06]"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40 focus:shadow-glow-cyan focus:bg-white/[0.06]"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-nova-blue to-nova-cyan py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/forgot-password" className="text-sm font-medium text-white/40 transition-colors hover:text-nova-cyan">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-sm text-white/40">
            New to Nova?{" "}
            <Link href="/signup" className="font-medium text-nova-cyan transition-colors hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
