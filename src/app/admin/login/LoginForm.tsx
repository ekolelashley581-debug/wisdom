"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { demoStore } from "@/lib/demo-store";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        router.push("/admin");
        router.refresh();
        return;
      }

      if (password === "wisdom-admin") {
        demoStore.login();
        router.push("/admin");
        return;
      }
      setError("Invalid email or password.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(
        message === "Invalid login credentials"
          ? "Invalid email or password. Ask an admin to register your account in Supabase."
          : message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/branding/wisdom-logo.png"
            alt="WISDOM"
            width={160}
            height={56}
            className="h-14 w-auto object-contain"
          />
          <h1 className="mt-4 font-display text-2xl text-white">Admin Center</h1>
          <p className="mt-1 text-center text-sm text-silver">
            {configured
              ? "Sign in with your registered email and password"
              : "Local demo login"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-silver">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white outline-none focus:border-secondary"
              placeholder="admin@wisdomlimbe.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-silver">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white outline-none focus:border-secondary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
