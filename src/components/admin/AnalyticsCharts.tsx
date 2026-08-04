"use client";

type DayPoint = {
  date: string;
  views: number;
  visitors: number;
  wa: number;
  bookings: number;
  orders: number;
};

export function VisitorsChart({ data }: { data: DayPoint[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.views, d.visitors)));
  const w = 560;
  const h = 180;
  const pad = 24;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  function x(i: number) {
    return pad + (i / Math.max(1, data.length - 1)) * innerW;
  }
  function y(v: number) {
    return pad + innerH - (v / max) * innerH;
  }

  const viewsPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.views).toFixed(1)}`)
    .join(" ");
  const visitorsPath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.visitors).toFixed(1)}`
    )
    .join(" ");

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-2 text-silver">
          <span className="h-2 w-2 rounded-full bg-secondary-glow" /> Page views
        </span>
        <span className="inline-flex items-center gap-2 text-silver">
          <span className="h-2 w-2 rounded-full bg-white/70" /> Visitors
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full min-w-[320px]">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={w - pad}
            y1={pad + innerH * (1 - t)}
            y2={pad + innerH * (1 - t)}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        <path d={viewsPath} fill="none" stroke="#14B8A6" strokeWidth="2.5" />
        <path d={visitorsPath} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        {data.map((d, i) => (
          <g key={d.date}>
            <circle cx={x(i)} cy={y(d.views)} r="2.5" fill="#14B8A6" />
            {(i === 0 || i === data.length - 1 || i % 3 === 0) && (
              <text
                x={x(i)}
                y={h - 4}
                textAnchor="middle"
                fill="rgba(192,192,192,0.55)"
                fontSize="9"
              >
                {d.date.slice(5)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BarChart({
  title,
  items,
  valueKey = "count",
  labelKey = "label",
}: {
  title: string;
  items: Array<Record<string, string | number>>;
  valueKey?: string;
  labelKey?: string;
}) {
  const max = Math.max(1, ...items.map((i) => Number(i[valueKey] || 0)));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-display text-lg text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {!items.length && (
          <li className="text-sm text-silver-mute">No data yet.</li>
        )}
        {items.map((item) => {
          const label = String(item[labelKey] ?? "");
          const value = Number(item[valueKey] || 0);
          const pct = (value / max) * 100;
          return (
            <li key={label}>
              <div className="mb-1 flex justify-between gap-2 text-xs">
                <span className="truncate text-silver">{label}</span>
                <span className="text-secondary-glow">{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ActivityBars({ data }: { data: DayPoint[] }) {
  const max = Math.max(
    1,
    ...data.map((d) => d.wa + d.bookings + d.orders)
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-display text-lg text-white">Engagement (14 days)</h3>
      <p className="mt-1 text-xs text-silver-mute">
        WhatsApp · bookings/reservations · orders
      </p>
      <div className="mt-5 flex h-40 items-end gap-1.5">
        {data.map((d) => {
          const total = d.wa + d.bookings + d.orders;
          const h = Math.max(4, (total / max) * 100);
          return (
            <div
              key={d.date}
              className="group relative flex flex-1 flex-col items-center justify-end"
              title={`${d.date}: WA ${d.wa}, book ${d.bookings}, orders ${d.orders}`}
            >
              <div
                className="w-full rounded-t bg-gradient-to-t from-secondary/40 to-secondary-glow transition group-hover:brightness-110"
                style={{ height: `${h}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-silver-dark">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
