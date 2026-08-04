export type PublishStatus = "draft" | "published";
export type CategoryType = "restaurant" | "spa";
export type UserRole = "admin" | "editor" | "viewer";
export type SpiceLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Category {
  id: string;
  type: CategoryType;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  /** Full / detail hero image(s). images[0] is the main image. */
  images: string[];
  /** Card / list thumbnail. Falls back to images[0] when empty. */
  thumbnail?: string;
  ingredients: string[];
  allergens: string[];
  prep_time: string;
  spice_level: SpiceLevel;
  is_chefs_special: boolean;
  is_available: boolean;
  status: PublishStatus;
}

export interface PriceByLevel {
  junior: number;
  senior: number;
  master: number;
}

export interface SpaService {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price_by_level: PriceByLevel;
  duration: string;
  images: string[];
  thumbnail?: string;
  is_package: boolean;
  status: PublishStatus;
  is_available: boolean;
}

export interface SpaProductSize {
  label: string;
  price: number;
}

export interface SpaProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  sizes: SpaProductSize[];
  price: number;
  images: string[];
  thumbnail?: string;
  status: PublishStatus;
  is_available?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  /** Main image on the post page */
  featured_image: string;
  /** Card / list thumbnail. Falls back to featured_image when empty. */
  thumbnail?: string;
  category: string;
  author: string;
  tags: string[];
  status: PublishStatus;
  published_at: string | null;
  scheduled_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image: string;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface SiteSettings {
  whatsapp_number: string;
  opening_hours: OpeningHours[];
  delivery_radius: string;
  min_order: number;
  /** Flat delivery fee (XAF) when distance unknown / zone base */
  delivery_fee_base: number;
  /** Extra delivery fee per km (XAF) */
  delivery_fee_per_km: number;
  /** When true, catalog CTAs go to forms (not direct WhatsApp) */
  require_order_forms: boolean;
  /** Show blog subscribe + notify admin on publish */
  blog_alerts_enabled: boolean;
  social_links: SocialLinks;
  address: string;
  maps_query: string;
  email: string;
  tagline: string;
}

export interface SiteDesign {
  logo_url: string;
  favicon_url: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  /** Extra hero slides (photos/videos). First slide can mirror hero_image_url. */
  hero_media_urls?: string[];
  /** Play hero media as an auto-advancing slideshow */
  hero_slideshow?: boolean;
  /** Seconds between slides */
  hero_slideshow_interval?: number;
  primary_color: string;
  secondary_color: string;
  silver_color: string;
  glow_color: string;
  restaurant_cta: string;
  spa_cta: string;
  footer_blurb: string;
  /** Signature “three worlds” identity band */
  triad_visible?: boolean;
  triad_eyebrow?: string;
  triad_title?: string;
  triad_body?: string;
  triad_items?: TriadItem[];
}

export interface TriadItem {
  id: string;
  label: string;
  line: string;
  href: string;
  media_url?: string;
  visible?: boolean;
}

export interface SeoFields {
  meta_title: string;
  meta_description: string;
}

/** Editable card — add / remove / change link without code */
export interface ContentCard {
  id: string;
  title: string;
  body: string;
  note?: string;
  /** Primary / first media (kept for backward compatibility) */
  media_url: string;
  /** Extra thumbnail / gallery media (photos or videos) */
  media_urls?: string[];
  /** single = first image only · slideshow = auto-rotate all media */
  media_mode?: "single" | "slideshow";
  link_url: string;
  link_label?: string;
  visible: boolean;
}

export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  notes?: string;
}

export interface PageSectionCopy {
  eyebrow: string;
  title: string;
  body: string;
  cta?: string;
  /** Where the CTA button goes (e.g. /spa or WhatsApp URL) */
  cta_link?: string;
  image_url?: string;
  media_kind?: "image" | "video";
  /** Hide whole section on the public site */
  visible?: boolean;
  cards?: ContentCard[];
}

export interface TestimonialCopy {
  id?: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
  /** Guest / reviewer portrait thumbnail */
  photo_url?: string;
  visible?: boolean;
}

export interface PageCopy {
  home_discover: PageSectionCopy;
  home_chefs: PageSectionCopy;
  home_spa_glimpse: PageSectionCopy;
  home_shop: PageSectionCopy;
  home_testimonials: PageSectionCopy & {
    items: TestimonialCopy[];
  };
  restaurant: PageSectionCopy & { seo: SeoFields };
  spa: PageSectionCopy & { seo: SeoFields };
  product: PageSectionCopy & { seo: SeoFields };
  blog: PageSectionCopy & { seo: SeoFields };
  about: PageSectionCopy & {
    story: string;
    mission: string;
    seo: SeoFields;
  };
  team: PageSectionCopy & { seo: SeoFields };
  home_seo: SeoFields;
}

export type StaffDepartment = "spa" | "restaurant" | "lounge" | "management";

export interface StaffMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  department: StaffDepartment;
  bio: string;
  short_bio: string;
  photo_url: string;
  thumbnail?: string;
  specialties: string[];
  /** Spa service slugs this person performs */
  service_slugs: string[];
  level?: "junior" | "senior" | "master";
  years_experience?: number;
  status: PublishStatus;
  sort_order: number;
  meta_title: string;
  meta_description: string;
}

export interface WhatsAppPaymentConfig {
  instructions: string;
  accepted_note: string;
  momo_hint: string;
  orange_hint: string;
  cash_hint: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  alt_text: string;
  folder: string;
  size: number;
  created_at: string;
  usage_refs: string[];
  kind?: "image" | "video";
}

export interface SiteConfig {
  settings: SiteSettings;
  design: SiteDesign;
  payments: WhatsAppPaymentConfig;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  created_at: string;
}

export type AdminNotificationType =
  | "contact_message"
  | "blog_published"
  | "content_updated"
  | "system";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  created_at: string;
  meta?: Record<string, string>;
}

export interface MediaAsset {
  id: string;
  url: string;
  alt_text: string;
  folder: string;
  usage_refs: string[];
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type DeliveryStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface SpaBooking {
  id: string;
  service_name: string;
  service_slug: string;
  stylist_level: "junior" | "senior" | "master";
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  status: BookingStatus;
  created_at: string;
  cancelled_at: string | null;
}

export interface DeliveryOrder {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  customer_name: string;
  customer_phone: string;
  address: string;
  notes: string;
  /** pickup = collect at venue · delivery = bring to address */
  fulfillment: "pickup" | "delivery";
  delivery_km: number;
  delivery_fee: number;
  subtotal: number;
  total: number;
  status: DeliveryStatus;
  payment_method: "whatsapp" | "momo" | "orange" | "fapshi" | "cash";
  payment_status: "unpaid" | "pending" | "paid" | "failed";
  created_at: string;
  updated_at: string;
}

export interface ShopOrder {
  id: string;
  product_name: string;
  product_slug: string;
  size: string;
  quantity: number;
  unit_price: number;
  fulfillment: "pickup" | "delivery";
  delivery_km: number;
  delivery_fee: number;
  subtotal: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  notes: string;
  status: DeliveryStatus;
  payment_method: "whatsapp" | "momo" | "orange" | "fapshi" | "cash";
  payment_status: "unpaid" | "pending" | "paid" | "failed";
  created_at: string;
  updated_at: string;
}

export interface TableReservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  customer_name: string;
  customer_phone: string;
  notes: string;
  status: BookingStatus;
  created_at: string;
  cancelled_at: string | null;
}

export interface BlogSubscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  active: boolean;
}

export interface AnalyticsEvent {
  id: string;
  type:
    | "page_view"
    | "whatsapp_click"
    | "booking_start"
    | "order_start"
    | "reservation_start";
  label: string;
  path: string;
  meta?: Record<string, string>;
  visitor_id?: string;
  created_at: string;
}

export interface PaymentSettings {
  momo_enabled: boolean;
  orange_enabled: boolean;
  fapshi_enabled: boolean;
  momo_number: string;
  orange_number: string;
  fapshi_merchant_id: string;
  note: string;
}
