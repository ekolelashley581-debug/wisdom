import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSettings } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WISDOM_MAPS } from "@/data/seed";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact WISDOM restaurant, lounge & spa in Limbe — message us or visit.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const wa = buildWhatsAppLink({
    type: "general",
    phone: settings.whatsapp_number,
  });

  return (
    <div className="section-pad bg-primary pt-28">
      <div className="container-wisdom grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="heading-display !text-4xl md:!text-6xl">Talk to WISDOM</h1>
          <p className="mt-4 max-w-md text-muted">
            Reservations, spa bookings, catering, or feedback — leave a message and
            we&apos;ll get back to you. For the fastest reply, use WhatsApp.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-silver-mute">
            <li>
              <span className="text-silver-dark">Address · </span>
              {settings.address || WISDOM_MAPS.address}
            </li>
            <li>
              <span className="text-silver-dark">Email · </span>
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-glow hover:underline"
              >
                WhatsApp chat →
              </a>
            </li>
            <li>
              <a href="/#find-us" className="hover:text-white">
                View map & directions →
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-elevated p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
