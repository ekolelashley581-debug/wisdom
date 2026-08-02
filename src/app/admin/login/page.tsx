"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { demoStore } from "@/lib/demo-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/admin");
        router.refresh();
        return;
      }

      // Demo mode (no Supabase): password wisdom-admin or ADMIN_DEMO_PASSWORD
      const demoPass = "wisdom-admin";
      if (password === demoPass || (email && password === demoPass)) {
        demoStore.login();
        router.push("/admin");
        return;
      }
      setError("Demo mode: use password wisdom-admin (or connect Supabase).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          <p className="mt-1 text-sm text-silver">Sign in to manage WISDOM</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-silver">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        <p className="mt-6 text-center text-xs text-silver-dark">
          Without Supabase: password <code className="text-secondary-glow">wisdom-admin</code>
        </p>
      </div>
    </div>
  );
}
