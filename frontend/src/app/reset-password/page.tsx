"use client";

// Reset password — token from URL query, new password + confirm, validation, redirect.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "@/services/api";

const EASE = [0.22, 1, 0.36, 1] as const;

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing reset token. Please request a new link.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset! Signing you in…", { id: "reset-pw" });
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.message || "Reset link is invalid or expired.";
      setError(msg);
      toast.error(msg, { id: "reset-pw" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nova-blue/10 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
              <Sparkles size={20} className="text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nova</span>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <Lock size={24} className="text-nova-cyan" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
            Reset your password
          </h1>
          <p className="text-sm text-white/50">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40 focus:shadow-glow-cyan focus:bg-white/[0.06]"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors hover:text-nova-cyan">
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={28} className="animate-spin text-nova-cyan" />
      </div>
    }>
      <ResetPasswordInner />
    </Suspense>
  );
}
