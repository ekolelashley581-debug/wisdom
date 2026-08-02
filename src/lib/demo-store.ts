import {
  menuItems as seedMenu,
  spaServices as seedSpa,
  spaProducts as seedProducts,
  blogPosts as seedBlog,
  settings as seedSettings,
} from "@/data/seed";
import type {
  MenuItem,
  SpaService,
  SpaProduct,
  BlogPost,
  SiteSettings,
  SpaBooking,
  DeliveryOrder,
  PaymentSettings,
  ActivityLogEntry,
} from "@/types";

const DEMO_KEY = "wisdom_demo_admin";

const defaultPayments: PaymentSettings = {
  momo_enabled: true,
  orange_enabled: true,
  fapshi_enabled: false,
  momo_number: "237670000000",
  orange_number: "237690000000",
  fapshi_merchant_id: "",
  note: "Online gateways coming soon — guests prefer payment on WhatsApp for now.",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function log(action: string, entity: string, entity_id: string) {
  if (typeof window === "undefined") return;
  const entry: ActivityLogEntry = {
    id: `log-${Date.now()}`,
    user_id: "demo-admin",
    action,
    entity,
    entity_id,
    created_at: new Date().toISOString(),
  };
  const list = read<ActivityLogEntry[]>("wisdom_activity", []);
  write("wisdom_activity", [entry, ...list].slice(0, 200));
}

/** Client-side demo store helpers (browser only) */
export const demoStore = {
  getMenu(): MenuItem[] {
    return read("wisdom_menu", seedMenu);
  },
  setMenu(items: MenuItem[]) {
    write("wisdom_menu", items);
    log("update", "menu", String(items.length));
  },
  getSpa(): SpaService[] {
    return read("wisdom_spa", seedSpa);
  },
  setSpa(items: SpaService[]) {
    write("wisdom_spa", items);
    log("update", "spa", String(items.length));
  },
  getProducts(): SpaProduct[] {
    return read("wisdom_products", seedProducts);
  },
  setProducts(items: SpaProduct[]) {
    write("wisdom_products", items);
    log("update", "products", String(items.length));
  },
  getBlog(): BlogPost[] {
    return read("wisdom_blog", seedBlog);
  },
  setBlog(items: BlogPost[]) {
    write("wisdom_blog", items);
    log("update", "blog", String(items.length));
  },
  getSettings(): SiteSettings {
    return read("wisdom_settings", seedSettings);
  },
  setSettings(s: SiteSettings) {
    write("wisdom_settings", s);
    log("update", "settings", "site");
  },
  getBookings(): SpaBooking[] {
    return read<SpaBooking[]>("wisdom_bookings", []);
  },
  addBooking(b: SpaBooking) {
    const list = this.getBookings();
    write("wisdom_bookings", [b, ...list]);
    log("create", "booking", b.id);
  },
  updateBooking(id: string, patch: Partial<SpaBooking>) {
    const list = this.getBookings().map((b) =>
      b.id === id ? { ...b, ...patch } : b
    );
    write("wisdom_bookings", list);
    log("update", "booking", id);
  },
  cancelBooking(id: string) {
    this.updateBooking(id, {
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    });
  },
  getDeliveries(): DeliveryOrder[] {
    return read<DeliveryOrder[]>("wisdom_deliveries", []);
  },
  addDelivery(o: DeliveryOrder) {
    const list = this.getDeliveries();
    write("wisdom_deliveries", [o, ...list]);
    log("create", "delivery", o.id);
  },
  updateDelivery(id: string, patch: Partial<DeliveryOrder>) {
    const list = this.getDeliveries().map((o) =>
      o.id === id ? { ...o, ...patch, updated_at: new Date().toISOString() } : o
    );
    write("wisdom_deliveries", list);
    log("update", "delivery", id);
  },
  getPaymentSettings(): PaymentSettings {
    return read("wisdom_payments", defaultPayments);
  },
  setPaymentSettings(p: PaymentSettings) {
    write("wisdom_payments", p);
    log("update", "payments", "config");
  },
  getActivity(): ActivityLogEntry[] {
    return read<ActivityLogEntry[]>("wisdom_activity", []);
  },
  getAdminTheme(): "dark" | "light" {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("wisdom_admin_theme") as "dark" | "light") || "dark";
  },
  setAdminTheme(theme: "dark" | "light") {
    localStorage.setItem("wisdom_admin_theme", theme);
  },
  getRole(): "admin" | "editor" | "viewer" {
    if (typeof window === "undefined") return "admin";
    return (
      (localStorage.getItem("wisdom_admin_role") as "admin" | "editor" | "viewer") ||
      "admin"
    );
  },
  setRole(role: "admin" | "editor" | "viewer") {
    localStorage.setItem("wisdom_admin_role", role);
  },
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(DEMO_KEY) === "1";
  },
  login() {
    sessionStorage.setItem(DEMO_KEY, "1");
  },
  logout() {
    sessionStorage.removeItem(DEMO_KEY);
  },
};
