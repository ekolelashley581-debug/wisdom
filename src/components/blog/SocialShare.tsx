"use client";

import { Share2 } from "lucide-react";

export function SocialShare({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}%20${encoded}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-silver-dark">
        <Share2 size={14} /> Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-silver-mute transition hover:border-secondary-glow hover:text-secondary-glow"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
