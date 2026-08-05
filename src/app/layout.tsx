import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getDesign, getSettings } from "@/lib/content";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";

export async function generateMetadata(): Promise<Metadata> {
  const design = await getDesign();
  const icon =
    design.favicon_url || design.logo_url || "/branding/wisdom-logo.png";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "WISDOM - Restaurant, Spa & Lounge in Limbe, Cameroon",
      template: "%s | WISDOM Limbe",
    },
    description:
      "Experience WISDOM in Limbe: a premium restaurant, lounge, and spa. Enjoy authentic Cameroonian cuisine, luxurious spa services, and a warm atmosphere.",
    openGraph: {
      type: "website",
      locale: "en_CM",
      url: siteUrl,
      siteName: "WISDOM",
      title: "WISDOM - Restaurant, Spa & Lounge in Limbe, Cameroon",
      description:
        "Experience WISDOM in Limbe: a premium restaurant, lounge, and spa.",
      images: [
        {
          url: design.logo_url || icon,
          width: 1200,
          height: 630,
          alt: "WISDOM",
        },
      ],
    },
    icons: {
      icon: [{ url: icon }],
      shortcut: icon,
      apple: [{ url: icon }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, design] = await Promise.all([getSettings(), getDesign()]);

  const cssVars = {
    ["--color-primary" as string]: design.primary_color,
    ["--color-secondary" as string]: design.secondary_color,
    ["--color-silver" as string]: design.silver_color,
    ["--color-glow" as string]: design.glow_color,
    ["--background" as string]: design.primary_color,
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        className="min-h-screen bg-primary font-sans text-silver-light antialiased"
        style={cssVars}
      >
        <SiteChrome settings={settings} design={design}>
          {children}
        </SiteChrome>
        <SpeedInsights />
      </body>
    </html>
  );
}
