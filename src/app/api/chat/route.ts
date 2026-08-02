import { NextResponse } from "next/server";
import { faqs } from "@/data/seed";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { DEFAULT_WHATSAPP } from "@/data/seed";

export const runtime = "nodejs";

function matchFaq(message: string): string | null {
  const lower = message.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const faq of faqs) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (lower.includes(kw.toLowerCase())) score += 1;
    }
    if (faq.question.toLowerCase().split(" ").some((w) => w.length > 3 && lower.includes(w))) {
      score += 0.5;
    }
    if (!best || score > best.score) {
      best = { score, answer: faq.answer };
    }
  }
  if (best && best.score >= 1) return best.answer;
  return null;
}

async function openRouterReply(message: string): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  const model =
    process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com",
        "X-Title": "WISDOM Limbe Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are the friendly WISDOM assistant for a restaurant, lounge, and spa in Limbe, Cameroon.
Be warm, concise, and helpful. For orders, bookings, or purchases, tell the guest you'll connect them to WhatsApp.
Never invent prices — suggest browsing the menu/spa pages or WhatsApp for confirmation.
Currency is XAF.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.6,
        max_tokens: 280,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").trim();
  const action = String(body.action ?? "");

  const wa = buildWhatsAppLink({
    type: "general",
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP,
  });

  if (action === "whatsapp" || /order|book|buy|reserve/i.test(message)) {
    return NextResponse.json({
      reply:
        "Perfect — I'll connect you to WhatsApp so our team can confirm your order or booking.",
      whatsappUrl: wa,
      quickReplies: ["Menu", "Book", "Hours", "Contact"],
    });
  }

  if (!message) {
    return NextResponse.json({
      reply: "Hi! I'm the WISDOM assistant. Ask about hours, menu, spa, or delivery — or tap a quick action.",
      quickReplies: ["Menu", "Book", "Hours", "Contact"],
    });
  }

  const faq = matchFaq(message);
  if (faq) {
    return NextResponse.json({
      reply: faq,
      quickReplies: ["Menu", "Book", "Contact", "Hours"],
    });
  }

  const ai = await openRouterReply(message);
  if (ai) {
    return NextResponse.json({
      reply: ai,
      quickReplies: ["Menu", "Book", "WhatsApp", "Hours"],
    });
  }

  return NextResponse.json({
    reply:
      "I'm not sure about that yet. Tap WhatsApp and our team will help you right away.",
    whatsappUrl: wa,
    quickReplies: ["WhatsApp", "Menu", "Hours", "Book"],
  });
}
