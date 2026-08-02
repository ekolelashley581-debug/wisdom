export type WhatsAppMessageType = "order" | "booking" | "buy" | "general";

export interface WhatsAppPayload {
  type: WhatsAppMessageType;
  itemName?: string;
  date?: string;
  time?: string;
  size?: string;
  quantity?: number | string;
  fulfillment?: "delivery" | "dine-in";
  phone?: string;
}

export function normalizeWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function buildWhatsAppMessage(payload: WhatsAppPayload): string {
  switch (payload.type) {
    case "order":
      return `Hi WISDOM! I'd like to order ${payload.itemName ?? "an item"} for ${
        payload.fulfillment ?? "delivery"
      }`;
    case "booking":
      return `Hi WISDOM! I want to book ${payload.itemName ?? "a spa service"} for ${
        payload.date ?? "[Date]"
      } at ${payload.time ?? "[Time]"}`;
    case "buy":
      return `Hi WISDOM! I'd like to buy ${payload.itemName ?? "a product"} - ${
        payload.size ?? "Standard"
      } and ${payload.quantity ?? 1}`;
    default:
      return "Hi WISDOM! I'd like to know more about your restaurant and spa.";
  }
}

export function buildWhatsAppLink(payload: WhatsAppPayload): string {
  const phone = normalizeWhatsAppNumber(payload.phone ?? "237673949163");
  const text = encodeURIComponent(buildWhatsAppMessage(payload));
  return `https://wa.me/${phone}?text=${text}`;
}
