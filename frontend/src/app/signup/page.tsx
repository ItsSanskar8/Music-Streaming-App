"use client";

// Minimalist Apple-style signup form.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const EASE = [0.25, 0.1, 0.25, 1] as const;

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
      await signup(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-sm"
      >
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-nova-primary">
          Create your account
        </h1>
        <p className="mb-8 text-center text-sm font-medium text-nova-secondary">
          Start streaming in seconds.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-nova-surface px-4 py-3 text-sm font-medium text-nova-primary placeholder:text-nova-secondary outline-none transition-colors focus:border-nova-cyan/40"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-nova-surface px-4 py-3 text-sm font-medium text-nova-primary placeholder:text-nova-secondary outline-none transition-colors focus:border-nova-cyan/40"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-nova-surface px-4 py-3 text-sm font-medium text-nova-primary placeholder:text-nova-secondary outline-none transition-colors focus:border-nova-cyan/40"
          />

          {error && (
            <p className="text-center text-xs font-medium text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-nova-primary py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-nova-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-nova-cyan">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
