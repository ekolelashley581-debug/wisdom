import type { SiteSettings } from "@/types";

export function HoursStrip({ settings }: { settings: SiteSettings }) {
  return (
    <section className="border-y border-white/10 bg-surface py-10">
      <div className="container-wisdom">
        <h2 className="mb-6 font-display text-2xl text-white">Opening hours</h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {settings.opening_hours.map((h) => (
            <div
              key={h.day}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-elevated px-4 py-3 text-sm transition duration-300 hover:border-secondary/40 hover:shadow-teal-glow"
            >
              <span className="font-medium text-silver-light">{h.day}</span>
              <span className="text-silver-mute">
                {h.closed ? "Closed" : `${h.open} – ${h.close}`}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-silver-mute">
          Delivery: {settings.delivery_radius}. Minimum order{" "}
          <strong className="text-secondary-glow">
            {settings.min_order.toLocaleString("en-US")} XAF
          </strong>
          .
        </p>
      </div>
    </section>
  );
}
