import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { SiteSettings, SiteDesign } from "@/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const CREATOR_WA =
  "https://wa.me/237654532920?text=" +
  encodeURIComponent("Hi EKOLE LASHLEY EKOLE! I found your work on the WISDOM website.");

export function Footer({
  settings,
  design,
}: {
  settings: SiteSettings;
  design: SiteDesign;
}) {
  const wa = buildWhatsAppLink({
    type: "general",
    phone: settings.whatsapp_number,
  });
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.maps_query
  )}`;

  return (
    <footer className="border-t border-white/10 bg-primary text-silver-light">
      <div className="container-wisdom section-pad grid gap-12 md:grid-cols-12">
        {/* Brand column — B&W style */}
        <div className="md:col-span-5">
          <Image
            src={design.logo_url || "/branding/wisdom-logo.png"}
            alt="WISDOM"
            width={160}
            height={56}
            className="mb-5 h-12 w-auto object-contain"
            unoptimized={(design.logo_url || "").startsWith("/uploads/")}
          />
          <p className="max-w-sm text-sm leading-relaxed text-silver-mute">
            {design.footer_blurb}
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 !py-2.5 !text-xs"
          >
            WhatsApp 24/7
          </a>
        </div>

        {/* Explore */}
        <div className="md:col-span-3">
          <h3 className="mb-4 font-display text-lg text-white">Explore</h3>
          <ul className="space-y-2.5 text-sm text-silver-mute">
            <li>
              <Link href="/restaurant" className="link-hover">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/spa" className="link-hover">
                Spa & Wellness
              </Link>
            </li>
            <li>
              <Link href="/product" className="link-hover">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="link-hover">
                About
              </Link>
            </li>
            <li>
              <Link href="/team" className="link-hover">
                Team
              </Link>
            </li>
            <li>
              <Link href="/blog" className="link-hover">
                Journal
              </Link>
            </li>
            <li>
              <Link href="/#testimonials" className="link-hover">
                Voices
              </Link>
            </li>
            <li>
              <Link href="/#nearby" className="link-hover">
                What&apos;s Nearby
              </Link>
            </li>
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-hover">
                Reserve / Order
              </a>
            </li>
          </ul>
        </div>

        {/* Visit */}
        <div id="contact" className="md:col-span-4">
          <h3 className="mb-4 font-display text-lg text-white">Visit</h3>
          <p className="mb-3 text-sm">
            <Link href="/contact" className="link-hover text-secondary-glow">
              Contact form →
            </Link>
          </p>
          <ul className="space-y-3 text-sm text-silver-mute">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover"
              >
                {settings.address}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
              <a href={wa} className="link-hover" target="_blank" rel="noopener noreferrer">
                +{settings.whatsapp_number.replace(/^237/, "237 ")} WhatsApp
              </a>
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-secondary-glow" />
              <a href={`mailto:${settings.email}`} className="link-hover">
                {settings.email}
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-silver-dark">
              Follow
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {settings.social_links.instagram && (
                <a
                  href={settings.social_links.instagram}
                  className="link-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
              {settings.social_links.facebook && (
                <a
                  href={settings.social_links.facebook}
                  className="link-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              )}
              {settings.social_links.tiktok && (
                <a
                  href={settings.social_links.tiktok}
                  className="link-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok
                </a>
              )}
            </div>
          </div>

          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-6 !py-2.5 !text-xs"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Bottom bar — B&W inspired + creator credit */}
      <div className="border-t border-white/10">
        <div className="container-wisdom flex flex-col items-start justify-between gap-3 py-5 text-xs text-silver-dark sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} WISDOM · Limbe. All rights reserved.</p>
          <a
            href={CREATOR_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-right text-silver-mute transition duration-300 hover:text-secondary-glow"
            title="Message EKOLE LASHLEY EKOLE on WhatsApp"
          >
            Created By EKOLE LASHLEY EKOLE
          </a>
        </div>
      </div>
    </footer>
  );
}
