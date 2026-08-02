"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
  ShoppingBag,
  Newspaper,
  CalendarDays,
  Truck,
  BarChart3,
  ScrollText,
  Wallet,
  ImageIcon,
  Palette,
  FileText,
  Users,
  PencilRuler,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/format";
import { demoStore } from "@/lib/demo-store";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/editor", label: "Elementor", icon: PencilRuler },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/spa", label: "Spa", icon: Sparkles },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/pages", label: "Page texts", icon: FileText },
  { href: "/admin/design", label: "Design", icon: Palette },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/activity", label: "Activity", icon: ScrollText },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    demoStore.logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-primary text-silver-light">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <Image
          src="/branding/wisdom-logo.png"
          alt="WISDOM"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
        />
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-glow">
          Admin
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-secondary/20 text-white"
                  : "text-silver hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-silver hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-silver hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
