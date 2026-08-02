"use client";

import { useMemo, useState } from "react";
import { MapPin, Navigation, Route } from "lucide-react";
import type { SiteSettings } from "@/types";
import { nearbyLandmarks, WISDOM_MAPS } from "@/data/seed";
import { cn } from "@/lib/format";

type Spot = (typeof nearbyLandmarks)[number];

export function NearbyAndMap({ settings }: { settings: SiteSettings }) {
  const [active, setActive] = useState<Spot | null>(null);

  const placeEmbed = WISDOM_MAPS.embedUrl;
  const destination = WISDOM_MAPS.destinationQuery;

  const mapSrc = useMemo(() => {
    if (!active) return placeEmbed;
    return `https://www.google.com/maps?saddr=${encodeURIComponent(
      active.query
    )}&daddr=${encodeURIComponent(destination)}&output=embed`;
  }, [active, placeEmbed, destination]);

  const directionsLink = active
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        active.query
      )}&destination=${encodeURIComponent(destination)}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destination
      )}&travelmode=driving`;

  function selectSpot(spot: Spot) {
    setActive(spot);
    requestAnimationFrame(() => {
      document.getElementById("find-us")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <>
      <section id="nearby" className="section-pad bg-primary">
        <div className="container-wisdom">
          <p className="eyebrow">Location</p>
          <h2 className="heading-display mb-4 !text-4xl md:!text-5xl">
            What&apos;s nearby
          </h2>
          <p className="mb-10 max-w-xl text-muted">
            Tap a landmark to open directions to WISDOM — your starting point becomes
            the route origin on the map.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {nearbyLandmarks.map((spot) => {
              const selected = active?.name === spot.name;
              return (
                <li key={spot.name}>
                  <button
                    type="button"
                    onClick={() => selectSpot(spot)}
                    className={cn(
                      "group h-full w-full rounded-2xl border px-5 py-6 text-left transition duration-500 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-teal-glow",
                      selected
                        ? "border-secondary-glow bg-secondary/15 shadow-teal-glow"
                        : "border-white/10 bg-surface-elevated"
                    )}
                  >
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-secondary-glow transition group-hover:border-secondary-glow">
                      <Navigation size={16} />
                    </span>
                    <p className="font-display text-lg text-white">{spot.name}</p>
                    <p className="mt-1 text-sm text-secondary-glow">{spot.distance}</p>
                    <p className="mt-2 text-xs text-silver-mute">
                      Tap for directions →
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="find-us" className="scroll-mt-24 bg-surface-elevated">
        <div className="container-wisdom py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-white md:text-4xl">Find us</h2>
              <p className="mt-2 text-sm text-silver-mute">
                {settings.address || WISDOM_MAPS.address}
              </p>
            </div>
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline hover:scale-[1.03]"
            >
              {active ? "Open full directions" : "Get Directions"}
            </a>
          </div>

          {active && (
            <div className="mb-6 flex gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
              <Route size={20} className="mt-0.5 shrink-0 text-secondary-glow" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Route from {active.name} → {WISDOM_MAPS.placeName}
                </p>
                <p className="mt-1 text-sm text-silver-mute">{active.tip}</p>
                <p className="mt-2 text-xs text-secondary-glow">
                  About {active.distance} by road · map below shows the path
                </p>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="mt-3 text-xs text-silver-mute underline hover:text-white"
                >
                  Reset to venue map
                </button>
              </div>
            </div>
          )}

          {!active && (
            <p className="mb-4 flex items-center gap-2 text-sm text-silver-mute">
              <MapPin size={14} className="text-secondary-glow" />
              Wisdom Lounge Restaurant — Limbe
            </p>
          )}
        </div>
        <div className="h-[360px] w-full overflow-hidden border-t border-white/10 md:h-[460px]">
          <iframe
            title={
              active
                ? `Directions from ${active.name} to WISDOM`
                : "WISDOM location map"
            }
            src={mapSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
