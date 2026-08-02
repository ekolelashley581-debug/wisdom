import type { SiteSettings, SiteDesign } from "@/types";

export function RestaurantJsonLd({
  settings,
  design,
}: {
  settings: SiteSettings;
  design: SiteDesign;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "WISDOM",
    description: design.footer_blurb || settings.tagline,
    image: design.logo_url || `${siteUrl}/branding/wisdom-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Limbe",
      addressRegion: "South-West",
      addressCountry: "CM",
    },
    url: siteUrl,
    servesCuisine: ["Cameroonian", "Seafood", "African"],
    priceRange: "$$",
    telephone: `+${settings.whatsapp_number}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  settings,
  design,
}: {
  settings: SiteSettings;
  design: SiteDesign;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "WISDOM Spa & Restaurant",
    description: settings.tagline,
    image: design.logo_url || `${siteUrl}/branding/wisdom-logo.png`,
    telephone: `+${settings.whatsapp_number}`,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Limbe",
      addressRegion: "South-West",
      addressCountry: "CM",
    },
    url: siteUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({
  name,
  jobTitle,
  description,
  image,
  url,
}: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    image: image || undefined,
    url,
    worksFor: {
      "@type": "Organization",
      name: "WISDOM",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AboutPageJsonLd({
  settings,
  description,
}: {
  settings: SiteSettings;
  description: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About WISDOM",
    description,
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "WISDOM",
      telephone: `+${settings.whatsapp_number}`,
      email: settings.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Limbe",
        addressCountry: "CM",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
