"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { demoStore } from "@/lib/demo-store";

type Mode = "password" | "magic";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Sign-in failed. Try again or use email.");
    }
  }, [searchParams]);

  async function signInWithGoogle() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured");
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/admin`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        if (mode === "magic") {
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
            },
          });
          if (otpError) throw otpError;
          setInfo("Check your email for the magic link.");
          return;
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        router.push("/admin");
        router.refresh();
        return;
      }

      const demoPass = "wisdom-admin";
      if (password === demoPass) {
        demoStore.login();
        router.push("/admin");
        return;
      }
      setError("Invalid email or password.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(
        message === "Invalid login credentials"
          ? "Invalid email or password."
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
          <p className="mt-1 text-sm text-silver">Sign in with Google or email</p>
        </div>

        {configured && (
          <div className="mb-5 space-y-3">
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white/90 disabled:opacity-60"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-silver-dark">
              <span className="h-px flex-1 bg-white/10" />
              or email
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </div>
        )}

        {configured && (
          <div className="mb-4 flex gap-2">
            {(
              [
                ["password", "Password"],
                ["magic", "Magic link"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`flex-1 rounded-full border px-3 py-1.5 text-xs transition ${
                  mode === id
                    ? "border-secondary-glow bg-secondary/20 text-secondary-glow"
                    : "border-white/15 text-silver-mute"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-silver">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white outline-none focus:border-secondary"
              placeholder="you@example.com"
            />
          </div>
          {mode === "password" && (
            <div>
              <label className="mb-1 block text-xs text-silver">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode === "password"}
                className="w-full rounded-xl border border-white/15 bg-primary px-4 py-3 text-sm text-white outline-none focus:border-secondary"
                placeholder="••••••••"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-secondary-glow">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "magic"
                ? "Send magic link"
                : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 14 24 14c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.3 5.2C39.2 37.1 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
