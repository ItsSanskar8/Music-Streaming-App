"use client";

// Forgot password — email input, glass toast success.

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPassword } from "@/services/api";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      setSent(true);
      // In dev mode the backend returns the token directly.
      if (res.reset_token) setResetToken(res.reset_token);
      toast.success(res.detail || "Reset link sent!", { id: "forgot-pw" });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong", { id: "forgot-pw" });
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
            <Mail size={24} className="text-nova-cyan" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
            Forgot your password?
          </h1>
          <p className="text-sm text-white/50">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-nova-cyan/15">
              <Mail size={20} className="text-nova-cyan" />
            </div>
            <p className="text-sm font-medium text-white">
              Check your email for the reset link.
            </p>
            {resetToken && (
              <Link
                href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
              >
                Reset Password Now
              </Link>
            )}
            <p className="mt-4 text-xs text-white/40">
              In production, the link would be sent via email.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40 focus:shadow-glow-cyan focus:bg-white/[0.06]"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-nova-blue to-nova-cyan py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

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
