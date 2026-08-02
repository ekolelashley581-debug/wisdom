"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { getEvents } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    menu: 0,
    spa: 0,
    products: 0,
    posts: 0,
    bookings: 0,
    deliveries: 0,
    waClicks: 0,
  });

  useEffect(() => {
    const events = getEvents();
    setStats({
      menu: demoStore.getMenu().length,
      spa: demoStore.getSpa().length,
      products: demoStore.getProducts().length,
      posts: demoStore.getBlog().length,
      bookings: demoStore.getBookings().length,
      deliveries: demoStore.getDeliveries().length,
      waClicks: events.filter((e) => e.type === "whatsapp_click").length,
    });
  }, []);

  const cards = [
    { label: "Menu items", value: stats.menu, href: "/admin/restaurant" },
    { label: "Spa services", value: stats.spa, href: "/admin/spa" },
    { label: "Bookings", value: stats.bookings, href: "/admin/bookings" },
    { label: "Deliveries", value: stats.deliveries, href: "/admin/deliveries" },
    { label: "Products", value: stats.products, href: "/admin/products" },
    { label: "Blog posts", value: stats.posts, href: "/admin/blog" },
    { label: "WA clicks", value: stats.waClicks, href: "/admin/analytics" },
  ];

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-silver">Phase 3 control center</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-secondary/40"
          >
            <p className="text-xs uppercase tracking-wider text-silver">{c.label}</p>
            <p className="mt-2 font-display text-3xl text-white">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-xl text-white">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/bookings" className="btn-primary !text-xs">
            Manage bookings
          </Link>
          <Link href="/admin/deliveries" className="btn-primary !text-xs">
            Manage deliveries
          </Link>
          <Link href="/admin/analytics" className="btn-primary !text-xs">
            Analytics
          </Link>
          <Link href="/admin/payments" className="btn-outline !text-xs">
            Payments
          </Link>
        </div>
        <p className="mt-6 text-xs text-silver-dark">
          Min order: {formatPrice(demoStore.getSettings().min_order)}. Payments are
          preference stubs until MoMo/Orange/Fapshi gateways are connected.
        </p>
      </div>
    </div>
  );
}
