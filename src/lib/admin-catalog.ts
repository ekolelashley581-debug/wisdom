"use client";

/** Persist catalog to disk (server) so public pages see admin changes. */
export async function saveCatalog(
  section: "menu" | "spa" | "products" | "blog" | "staff",
  items: unknown[]
) {
  const res = await fetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, items }),
  });
  if (!res.ok) {
    throw new Error(`Failed to save ${section}`);
  }
  return res.json();
}

export async function loadCatalog<T>(
  section: "menu" | "spa" | "products" | "blog" | "staff"
): Promise<T[]> {
  const res = await fetch(`/api/content?section=${section}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: T[] };
  return data.items ?? [];
}
