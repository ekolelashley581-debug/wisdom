"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFloat({ phone }: { phone: string }) {
  const [showHint, setShowHint] = useState(false);
  const href = buildWhatsAppLink({ type: "general", phone });

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {showHint && (
        <span className="rounded-lg bg-primary px-3 py-1.5 text-xs text-silver-light shadow-lg">
          +{phone}
        </span>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowHint(true)}
        onMouseLeave={() => setShowHint(false)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-wa-glow transition hover:scale-105 hover:brightness-110"
      >
        <MessageCircle size={22} />
      </a>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-40 rounded-full border border-silver/30 bg-primary/90 px-3 py-2 text-xs font-medium text-silver-light shadow-glass backdrop-blur transition hover:border-secondary-glow hover:text-secondary-glow"
      aria-label="Back to top"
    >
      ↑ Top
    </button>
  );
}
