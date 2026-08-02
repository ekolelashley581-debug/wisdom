"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { demoStore } from "@/lib/demo-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/format";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(isLogin);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(demoStore.getAdminTheme());
  }, []);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }

    async function check() {
      const supabase = createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setReady(true);
          return;
        }
      }
      if (demoStore.isLoggedIn()) {
        setReady(true);
        return;
      }
      router.replace("/admin/login");
    }
    check();
  }, [router, isLogin]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    demoStore.setAdminTheme(next);
  }

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-silver">
        Loading admin…
      </div>
    );
  }

  const light = theme === "light";
  const isEditor = pathname.startsWith("/admin/editor");

  if (isEditor) {
    return <div className="min-h-screen bg-[#0c0f12]">{children}</div>;
  }

  return (
    <div
      className={cn(
        "flex min-h-screen",
        light ? "bg-[#f4f6f8] text-ink" : "bg-[#0f1419] text-silver-light"
      )}
    >
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-end gap-2 border-b border-white/10 px-6 py-3">
          <span className="text-xs text-silver-mute">Role: {demoStore.getRole()}</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs transition hover:border-secondary"
            aria-label="Toggle admin theme"
          >
            {light ? <Moon size={14} /> : <Sun size={14} />}
            {light ? "Dark" : "Light"}
          </button>
        </div>
        <div
          className={cn(
            "mx-auto max-w-6xl p-6 md:p-8",
            light && "[&_h1]:text-ink [&_.text-white]:text-ink [&_.text-silver]:text-ink/60"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
