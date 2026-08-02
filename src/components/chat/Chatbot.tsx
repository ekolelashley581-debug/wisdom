"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageSquare, X, Send } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string; whatsappUrl?: string };

const QUICK = ["Menu", "Book", "Hours", "Contact"] as const;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm the WISDOM assistant — friendly help for menu, spa, hours, and more. Tap a button or ask anything.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setLoading(true);

    const mapped =
      trimmed === "Menu"
        ? "Show me the restaurant menu"
        : trimmed === "Book"
          ? "I want to book a spa service"
          : trimmed === "Hours"
            ? "What are your opening hours?"
            : trimmed === "Contact" || trimmed === "WhatsApp"
              ? "Connect me to WhatsApp"
              : trimmed;

    try {
      if (trimmed === "Menu") {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "Explore our restaurant menu — appetizers, mains, drinks, and lounge classics. Open menu →",
          },
        ]);
        setLoading(false);
        window.location.href = "/restaurant";
        return;
      }
      if (trimmed === "Book") {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "Browse spa services and tap Book Now — we'll confirm on WhatsApp.",
          },
        ]);
        setLoading(false);
        window.location.href = "/spa";
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: mapped,
          action: trimmed === "WhatsApp" || trimmed === "Contact" ? "whatsapp" : undefined,
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply ?? "Something went wrong — try WhatsApp.",
          whatsappUrl: data.whatsappUrl,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Connection issue. Please try again or use WhatsApp." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open WISDOM assistant"
          className="fixed bottom-20 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-secondary/40 bg-primary text-secondary-glow shadow-teal-glow transition hover:scale-105 hover:bg-secondary hover:text-white md:bottom-5 md:right-20"
        >
          <MessageSquare size={18} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-40 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-elevated shadow-lift animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-white/10 bg-primary px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">WISDOM Assistant</p>
              <p className="text-[10px] text-secondary-glow">Friendly · Helpful</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-silver-mute hover:bg-white/5 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-secondary text-white"
                      : "border border-white/10 bg-primary text-silver-light"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.role === "bot" && msg.text.toLowerCase().includes("menu") && (
                    <Link
                      href="/restaurant"
                      className="mt-2 inline-block text-xs font-semibold text-secondary-glow underline"
                      onClick={() => setOpen(false)}
                    >
                      Open menu →
                    </Link>
                  )}
                  {msg.whatsappUrl && (
                    <a
                      href={msg.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-whatsapp underline"
                    >
                      Open WhatsApp →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-primary px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-silver" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-silver [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-silver [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 py-2">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-silver-mute transition hover:border-secondary-glow hover:text-secondary-glow"
              >
                {q}
              </button>
            ))}
            <Link
              href="/spa"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-silver-mute transition hover:border-secondary-glow hover:text-secondary-glow"
            >
              Spa
            </Link>
          </div>

          <form
            className="flex gap-2 border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-full border border-white/15 bg-primary px-3 py-2 text-sm text-white outline-none placeholder:text-silver-dark focus:border-secondary"
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white transition hover:bg-secondary-light"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
