"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Users,
  Newspaper,
  Info,
  MapPin,
  Clock,
  Phone,
  Share2,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types";

const NAV = [
  { href: "/", label: "Home", icon: null as null },
  { href: "/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/spa", label: "Spa", icon: Sparkles },
  { href: "/product", label: "Shop", icon: ShoppingBag },
  { href: "/about", label: "About", icon: Info },
  { href: "/team", label: "Team", icon: Users },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/contact", label: "Contact", icon: Mail },
];

const QUICK = [
  { href: "/restaurant", label: "Order food", icon: UtensilsCrossed },
  { href: "/spa", label: "Book spa", icon: Sparkles },
  { href: "/product", label: "Shop products", icon: ShoppingBag },
  { href: "/team", label: "Meet the team", icon: Users },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({
  logoUrl = "/branding/wisdom-logo.png",
  restaurantCta = "Explore Menu",
  spaCta = "Book Spa",
  phone = "237673949163",
  settings,
}: {
  logoUrl?: string;
  restaurantCta?: string;
  spaCta?: string;
  phone?: string;
  settings?: SiteSettings;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;
  const wa = buildWhatsAppLink({ type: "general", phone });
  const mapsQuery =
    settings?.maps_query || settings?.address || "Wisdom Lounge Restaurant Limbe";
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery
  )}`;
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = settings?.opening_hours?.find(
    (h) => h.day.toLowerCase() === todayName.toLowerCase()
  );

  const mobileMenu =
    mounted &&
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[9999] flex flex-col bg-primary md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <Link
            href="/"
            aria-label="WISDOM home"
            onClick={() => setOpen(false)}
            className="relative flex items-center"
          >
            <Image
              src={logoUrl}
              alt="WISDOM"
              width={100}
              height={34}
              className="h-7 w-auto object-contain"
              unoptimized={logoUrl.startsWith("/uploads/")}
            />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-silver-light hover:bg-white/5 hover:text-secondary-glow"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 pb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-silver-dark">
            Quick actions
          </p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {QUICK.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-silver-light active:border-secondary/50"
                >
                  <Icon size={16} className="shrink-0 text-secondary-glow" />
                  {q.label}
                </Link>
              );
            })}
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <Link
              href="/restaurant"
              onClick={() => setOpen(false)}
              className="btn-primary text-center !py-3 !text-sm"
            >
              {restaurantCta}
            </Link>
            <Link
              href="/spa"
              onClick={() => setOpen(false)}
              className="btn-outline text-center !py-3 !text-sm"
            >
              {spaCta}
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-whatsapp text-center !py-3 !text-sm"
            >
              Chat on WhatsApp
            </a>
          </div>

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-silver-dark">
            Navigate
          </p>
          <nav className="mb-6 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium",
                    active
                      ? "bg-secondary/20 text-secondary-glow"
                      : "text-silver-light active:bg-white/5"
                  )}
                >
                  {Icon ? (
                    <Icon size={16} className="shrink-0 opacity-70" />
                  ) : (
                    <span className="w-4" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-silver-dark">
              Visit
            </p>
            <ul className="space-y-3 text-sm text-silver-mute">
              {settings?.address && (
                <li className="flex gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {settings.address}
                  </a>
                </li>
              )}
              <li className="flex gap-2">
                <Clock size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
                <span>
                  {todayHours
                    ? todayHours.closed
                      ? "Closed today"
                      : `Today · ${todayHours.open} – ${todayHours.close}`
                    : "See hours on contact"}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  WhatsApp +{phone.replace(/^237/, "237 ")}
                </a>
              </li>
            </ul>
            {(settings?.social_links?.instagram || settings?.social_links?.facebook) && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {settings.social_links.instagram && (
                  <a
                    href={settings.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-silver-light"
                    onClick={() => setOpen(false)}
                  >
                    <Share2 size={14} />
                    Instagram
                  </a>
                )}
                {settings.social_links.facebook && (
                  <a
                    href={settings.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-silver-light"
                    onClick={() => setOpen(false)}
                  >
                    <Share2 size={14} />
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
          solid
            ? "border-b border-silver/15 bg-primary/95 shadow-lg backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="container-wisdom flex h-[3.2rem] items-center justify-between md:h-16">
          <Link
            href="/"
            className="relative flex items-center gap-2 transition duration-300 hover:opacity-90"
            aria-label="WISDOM home"
            onClick={() => setOpen(false)}
          >
            <Image
              src={logoUrl}
              alt="WISDOM"
              width={112}
              height={38}
              className="h-8 w-auto object-contain md:h-[2.4rem]"
              priority
              unoptimized={logoUrl.startsWith("/uploads/")}
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[13px] font-medium tracking-wide transition duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-secondary-glow after:transition-all after:duration-300 hover:text-white hover:after:w-full",
                    active ? "text-secondary-glow after:w-full" : "text-silver-mute"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/restaurant"
              className="btn-primary !px-4 !py-2 !text-[11px] hover:scale-[1.03]"
            >
              {restaurantCta}
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-silver-light transition hover:bg-white/5 hover:text-secondary-glow md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
