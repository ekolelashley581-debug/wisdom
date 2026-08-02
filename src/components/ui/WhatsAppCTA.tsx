"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  buildWhatsAppLink,
  type WhatsAppMessageType,
} from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

interface Props {
  type: WhatsAppMessageType;
  phone: string;
  itemName?: string;
  label?: string;
  className?: string;
  fulfillment?: "delivery" | "dine-in";
  size?: string;
  quantity?: number | string;
  date?: string;
  time?: string;
}

export function WhatsAppCTA({
  type,
  phone,
  itemName,
  label,
  className,
  fulfillment = "delivery",
  size,
  quantity,
  date,
  time,
}: Props) {
  const [redirecting, setRedirecting] = useState(false);

  const defaultLabel =
    type === "order"
      ? "Order"
      : type === "booking"
        ? "Book Now"
        : type === "buy"
          ? "Buy"
          : "Chat";

  const href = buildWhatsAppLink({
    type,
    phone,
    itemName,
    fulfillment,
    size,
    quantity,
    date,
    time,
  });

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    trackEvent({
      type: "whatsapp_click",
      label: itemName || label || defaultLabel,
      path: typeof window !== "undefined" ? window.location.pathname : "/",
      meta: { cta: type },
    });
    setRedirecting(true);
    setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
      setRedirecting(false);
    }, 700);
  }

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={className ?? "btn-whatsapp"}
        title={`WhatsApp +${phone}`}
      >
        <MessageCircle size={18} />
        {label ?? defaultLabel}
      </a>
      {redirecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-surface-elevated px-8 py-6 text-center shadow-lift">
            <p className="font-display text-xl text-white">Redirecting…</p>
            <p className="mt-1 text-sm text-silver-mute">Opening WhatsApp</p>
          </div>
        </div>
      )}
    </>
  );
}
