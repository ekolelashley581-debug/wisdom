import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1 text-sm text-silver-mute"
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} />}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-secondary-glow">
              {item.label}
            </Link>
          ) : (
            <span className="text-silver-light">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
