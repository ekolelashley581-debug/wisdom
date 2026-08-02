"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Save,
  Monitor,
  Smartphone,
  Layers,
  Box,
} from "lucide-react";
import { cn } from "@/lib/format";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { CardListEditor } from "@/components/admin/CardListEditor";
import { MultiMediaPicker } from "@/components/admin/MultiMediaPicker";
import { PublicPageRenderer } from "@/components/builder/PublicPageRenderer";
import { createElement, createSection } from "@/lib/page-builder-store-client";
import { collectMediaUrls } from "@/components/ui/MediaSlideshow";
import {
  PAGE_IDS,
  WIDGET_CATALOG,
  type BuilderElement,
  type BuilderPage,
  type BuilderPageId,
  type BuilderSection,
  type ElementType,
  type SiteLayouts,
} from "@/types/page-builder";
import type { MenuItem, SiteDesign, SiteSettings, SpaProduct } from "@/types";

type Sel =
  | { kind: "section"; sectionId: string }
  | { kind: "element"; sectionId: string; elementId: string }
  | null;

export function ElementorEditor({
  initial,
  design,
  settings,
  specials,
  products,
}: {
  initial: SiteLayouts;
  design: SiteDesign;
  settings: SiteSettings;
  specials: MenuItem[];
  products: SpaProduct[];
}) {
  const [layouts, setLayouts] = useState(initial);
  const [pageId, setPageId] = useState<BuilderPageId>("home");
  const [sel, setSel] = useState<Sel>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"widgets" | "structure">("structure");
  const [history, setHistory] = useState<SiteLayouts[]>([initial]);
  const [histIndex, setHistIndex] = useState(0);

  const page = layouts.pages[pageId];

  const pushHistory = useCallback((next: SiteLayouts) => {
    setLayouts(next);
    setHistory((h) => {
      const sliced = h.slice(0, histIndex + 1);
      const updated = [...sliced, next].slice(-30);
      setHistIndex(updated.length - 1);
      return updated;
    });
  }, [histIndex]);

  function undo() {
    if (histIndex <= 0) return;
    const i = histIndex - 1;
    setHistIndex(i);
    setLayouts(history[i]);
  }

  function redo() {
    if (histIndex >= history.length - 1) return;
    const i = histIndex + 1;
    setHistIndex(i);
    setLayouts(history[i]);
  }

  function updatePage(mutator: (p: BuilderPage) => BuilderPage) {
    const next: SiteLayouts = {
      ...layouts,
      pages: { ...layouts.pages, [pageId]: mutator(page) },
    };
    pushHistory(next);
  }

  function selectedElement(): BuilderElement | null {
    if (sel?.kind !== "element") return null;
    const sec = page.sections.find((s) => s.id === sel.sectionId);
    return sec?.elements.find((e) => e.id === sel.elementId) || null;
  }

  function selectedSection(): BuilderSection | null {
    if (!sel) return null;
    return page.sections.find((s) => s.id === sel.sectionId) || null;
  }

  function patchElement(sectionId: string, elementId: string, patch: Partial<BuilderElement>) {
    updatePage((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              elements: s.elements.map((e) =>
                e.id === elementId ? { ...e, ...patch } : e
              ),
            }
      ),
    }));
  }

  function patchSection(sectionId: string, patch: Partial<BuilderSection>) {
    updatePage((p) => ({
      ...p,
      sections: p.sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    }));
  }

  function addSection() {
    updatePage((p) => ({
      ...p,
      sections: [
        ...p.sections,
        createSection("New section", [
          createElement("heading", { title: "New section", eyebrow: "Section" }),
        ]),
      ],
    }));
  }

  function addWidget(type: ElementType, sectionId?: string) {
    const el = createElement(type);
    const sid =
      sectionId ||
      (sel?.kind === "section" || sel?.kind === "element" ? sel.sectionId : null);
    if (sid) {
      updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === sid ? { ...s, elements: [...s.elements, el] } : s
        ),
      }));
      setSel({ kind: "element", sectionId: sid, elementId: el.id });
    } else {
      const sec = createSection("New section", [el]);
      updatePage((p) => ({ ...p, sections: [...p.sections, sec] }));
      setSel({ kind: "element", sectionId: sec.id, elementId: el.id });
    }
    setTab("structure");
  }

  useEffect(() => {
    (
      window as unknown as {
        __builderDrop?: (sectionId: string, type: string) => void;
      }
    ).__builderDrop = (sectionId, type) => {
      addWidget(type as ElementType, sectionId);
    };
    return () => {
      delete (
        window as unknown as {
          __builderDrop?: (sectionId: string, type: string) => void;
        }
      ).__builderDrop;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts, pageId, sel, histIndex]);

  function onDragStartWidget(e: React.DragEvent, type: ElementType) {
    e.dataTransfer.setData("application/x-widget-type", type);
    e.dataTransfer.effectAllowed = "copy";
  }

  function moveSectionTo(fromId: string, toId: string) {
    if (fromId === toId) return;
    updatePage((p) => {
      const from = p.sections.findIndex((s) => s.id === fromId);
      const to = p.sections.findIndex((s) => s.id === toId);
      if (from < 0 || to < 0) return p;
      const sections = [...p.sections];
      const [item] = sections.splice(from, 1);
      sections.splice(to, 0, item);
      return { ...p, sections };
    });
  }

  function moveSection(id: string, dir: -1 | 1) {
    updatePage((p) => {
      const i = p.sections.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.sections.length) return p;
      const sections = [...p.sections];
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...p, sections };
    });
  }

  function moveElement(sectionId: string, elementId: string, dir: -1 | 1) {
    updatePage((p) => ({
      ...p,
      sections: p.sections.map((s) => {
        if (s.id !== sectionId) return s;
        const i = s.elements.findIndex((e) => e.id === elementId);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= s.elements.length) return s;
        const elements = [...s.elements];
        [elements[i], elements[j]] = [elements[j], elements[i]];
        return { ...s, elements };
      }),
    }));
  }

  function deleteSelected() {
    if (!sel) return;
    if (!confirm("Delete selected item?")) return;
    if (sel.kind === "section") {
      updatePage((p) => ({
        ...p,
        sections: p.sections.filter((s) => s.id !== sel.sectionId),
      }));
    } else {
      updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id !== sel.sectionId
            ? s
            : { ...s, elements: s.elements.filter((e) => e.id !== sel.elementId) }
        ),
      }));
    }
    setSel(null);
  }

  function duplicateSelected() {
    if (sel?.kind === "element") {
      const el = selectedElement();
      if (!el) return;
      const copy = { ...structuredClone(el), id: createElement(el.type).id };
      updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id !== sel.sectionId ? s : { ...s, elements: [...s.elements, copy] }
        ),
      }));
    }
  }

  async function save() {
    const res = await fetch("/api/page-layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layouts),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else alert("Save failed");
  }

  const el = selectedElement();
  const sec = selectedSection();

  const previewPage = useMemo(() => page, [page]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        void save();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts, histIndex, history]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#0c0f12] text-silver-light">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-3">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-xs text-silver-mute hover:text-white">
            ← Admin
          </Link>
          <span className="font-display text-lg text-white">Elementor</span>
          <select
            className="rounded-lg border border-white/15 bg-primary px-2 py-1 text-xs"
            value={pageId}
            onChange={(e) => {
              setPageId(e.target.value as BuilderPageId);
              setSel(null);
            }}
          >
            {PAGE_IDS.map((id) => (
              <option key={id} value={id}>
                {layouts.pages[id].title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={cn(
              "rounded p-1.5",
              device === "desktop" ? "text-secondary-glow" : "text-silver-mute"
            )}
            title="Desktop"
          >
            <Monitor size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={cn(
              "rounded p-1.5",
              device === "mobile" ? "text-secondary-glow" : "text-silver-mute"
            )}
            title="Mobile"
          >
            <Smartphone size={16} />
          </button>
          <button type="button" onClick={undo} className="text-xs text-silver-mute hover:text-white">
            Undo
          </button>
          <button type="button" onClick={redo} className="text-xs text-silver-mute hover:text-white">
            Redo
          </button>
          <a
            href={pageId === "home" ? "/" : `/${pageId === "product" ? "product" : pageId}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-silver-mute hover:text-white"
          >
            View live
          </a>
          <button type="button" onClick={save} className="btn-primary !px-3 !py-1.5 !text-xs">
            <Save size={12} className="mr-1 inline" />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#10151a]">
          <div className="flex border-b border-white/10">
            <button
              type="button"
              className={cn(
                "flex-1 py-2 text-xs",
                tab === "structure" ? "text-secondary-glow" : "text-silver-mute"
              )}
              onClick={() => setTab("structure")}
            >
              <Layers size={12} className="mr-1 inline" />
              Structure
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-2 text-xs",
                tab === "widgets" ? "text-secondary-glow" : "text-silver-mute"
              )}
              onClick={() => setTab("widgets")}
            >
              <Box size={12} className="mr-1 inline" />
              Widgets
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {tab === "widgets" && (
              <div className="space-y-3">
                {(["basic", "media", "layout", "dynamic"] as const).map((group) => (
                  <div key={group}>
                    <p className="mb-1 px-1 text-[10px] uppercase tracking-wider text-silver-dark">
                      {group}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {WIDGET_CATALOG.filter((w) => w.group === group).map((w) => (
                        <button
                          key={w.type}
                          type="button"
                          draggable
                          onDragStart={(e) => onDragStartWidget(e, w.type)}
                          onClick={() => addWidget(w.type)}
                          className="cursor-grab rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-left text-[11px] hover:border-secondary/40 active:cursor-grabbing"
                          title={`${w.description} — drag onto canvas or click to add`}
                        >
                          <Plus size={10} className="mb-1 text-secondary-glow" />
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "structure" && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={addSection}
                  className="mb-2 w-full rounded-lg border border-dashed border-white/20 py-2 text-xs text-secondary-glow"
                >
                  + Add section
                </button>
                {page.sections.map((s) => (
                  <div
                    key={s.id}
                    className="mb-1"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/x-section-id", s.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const from = e.dataTransfer.getData("application/x-section-id");
                      if (from) moveSectionTo(from, s.id);
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSel({ kind: "section", sectionId: s.id })}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs",
                        sel?.sectionId === s.id && sel.kind === "section"
                          ? "bg-secondary/20 text-secondary-glow"
                          : "hover:bg-white/5"
                      )}
                    >
                      <span className="truncate font-medium">{s.label}</span>
                      <span className="flex gap-0.5">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            patchSection(s.id, { visible: !s.visible });
                          }}
                        >
                          {s.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        </span>
                      </span>
                    </button>
                    <div className="ml-2 border-l border-white/10 pl-1">
                      {s.elements.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() =>
                            setSel({
                              kind: "element",
                              sectionId: s.id,
                              elementId: e.id,
                            })
                          }
                          className={cn(
                            "flex w-full items-center justify-between rounded px-2 py-1 text-left text-[11px]",
                            sel?.kind === "element" && sel.elementId === e.id
                              ? "bg-secondary/15 text-secondary-glow"
                              : "text-silver-mute hover:bg-white/5"
                          )}
                        >
                          <span className="truncate">{e.label || e.type}</span>
                          {!e.visible && <EyeOff size={10} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main className="relative min-w-0 flex-1 overflow-auto bg-[#151a20] p-4">
          <div
            className={cn(
              "mx-auto min-h-full overflow-hidden rounded-xl border border-white/10 bg-primary shadow-2xl transition-all",
              device === "mobile" ? "max-w-[390px]" : "max-w-5xl"
            )}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData("application/x-widget-type");
                if (type) addWidget(type as ElementType);
              }}
            >
              <PublicPageRenderer
                page={previewPage}
                design={design}
                settings={settings}
                specials={specials}
                products={products}
                preview
                selected={sel}
                onSelect={setSel}
              />
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-silver-dark">
            Drag widgets onto the canvas · click any block to edit · drop zones accept widgets
          </p>
        </main>

        {/* Right inspector */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-white/10 bg-[#10151a]">
          <div className="border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-silver-dark">
            {el ? `Edit · ${el.label}` : sec ? `Section · ${sec.label}` : "Inspector"}
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {!sel && (
              <p className="text-sm text-silver-mute">
                Select a section or widget from Structure, or add a widget from the Widgets tab.
              </p>
            )}

            {sel && (
              <div className="flex flex-wrap gap-1">
                {sel.kind === "section" && (
                  <>
                    <button
                      type="button"
                      className="rounded border border-white/15 p-1"
                      onClick={() => moveSection(sel.sectionId, -1)}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 p-1"
                      onClick={() => moveSection(sel.sectionId, 1)}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </>
                )}
                {sel.kind === "element" && (
                  <>
                    <button
                      type="button"
                      className="rounded border border-white/15 p-1"
                      onClick={() => moveElement(sel.sectionId, sel.elementId, -1)}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 p-1"
                      onClick={() => moveElement(sel.sectionId, sel.elementId, 1)}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="rounded border border-white/15 p-1"
                      onClick={duplicateSelected}
                    >
                      <Copy size={14} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="rounded border border-red-500/40 p-1 text-red-400"
                  onClick={deleteSelected}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {sel?.kind === "section" && sec && (
              <>
                <Field
                  label="Section name"
                  value={sec.label}
                  onChange={(label) => patchSection(sec.id, { label })}
                />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={sec.visible}
                    onChange={(e) => patchSection(sec.id, { visible: e.target.checked })}
                  />
                  Visible
                </label>
                <ColorField
                  label="Background color"
                  value={sec.styles.background || "#0A0A0A"}
                  onChange={(background) =>
                    patchSection(sec.id, {
                      styles: { ...sec.styles, background },
                    })
                  }
                />
                <ColorField
                  label="Text color"
                  value={sec.styles.textColor || "#C0C0C0"}
                  onChange={(textColor) =>
                    patchSection(sec.id, {
                      styles: { ...sec.styles, textColor },
                    })
                  }
                />
                <Select
                  label="Padding"
                  value={sec.styles.paddingY || "lg"}
                  options={["none", "sm", "md", "lg", "xl"]}
                  onChange={(paddingY) =>
                    patchSection(sec.id, {
                      styles: {
                        ...sec.styles,
                        paddingY: paddingY as BuilderSection["styles"]["paddingY"],
                      },
                    })
                  }
                />
              </>
            )}

            {el && sel?.kind === "element" && (
              <ElementInspector
                el={el}
                onChange={(patch) => patchElement(sel.sectionId, sel.elementId, patch)}
              />
            )}

            <div className="border-t border-white/10 pt-3">
              <p className="mb-2 text-[10px] uppercase text-silver-dark">Page SEO</p>
              <Field
                label="Meta title"
                value={page.seo.meta_title}
                onChange={(meta_title) =>
                  updatePage((p) => ({ ...p, seo: { ...p.seo, meta_title } }))
                }
              />
              <Field
                label="Meta description"
                value={page.seo.meta_description}
                onChange={(meta_description) =>
                  updatePage((p) => ({
                    ...p,
                    seo: { ...p.seo, meta_description },
                  }))
                }
                rows={2}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="mb-2">
      <label className="text-[10px] uppercase text-silver-dark">{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          className="mt-1 w-full rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-2">
      <label className="text-[10px] uppercase text-silver-dark">{label}</label>
      <select
        className="mt-1 w-full rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ElementInspector({
  el,
  onChange,
}: {
  el: BuilderElement;
  onChange: (p: Partial<BuilderElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <Field label="Label" value={el.label} onChange={(label) => onChange({ label })} />
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={el.visible}
          onChange={(e) => onChange({ visible: e.target.checked })}
        />
        Visible
      </label>

      {["heading", "dynamic_chefs", "dynamic_products", "testimonials"].includes(el.type) && (
        <>
          <Field
            label="Eyebrow"
            value={el.eyebrow || ""}
            onChange={(eyebrow) => onChange({ eyebrow })}
          />
          <Field label="Title" value={el.title || ""} onChange={(title) => onChange({ title })} />
        </>
      )}

      {["text", "dynamic_chefs", "dynamic_products", "testimonials", "heading"].includes(
        el.type
      ) &&
        el.type !== "heading" && (
          <Field
            label="Body"
            value={el.body || ""}
            rows={3}
            onChange={(body) => onChange({ body })}
          />
        )}

      {el.type === "button" && (
        <>
          <Field label="Button text" value={el.title || ""} onChange={(title) => onChange({ title })} />
          <Field label="Link URL" value={el.href || ""} onChange={(href) => onChange({ href })} />
          <Select
            label="Style"
            value={el.button_variant || "primary"}
            options={["primary", "outline", "whatsapp", "silver"]}
            onChange={(button_variant) =>
              onChange({
                button_variant: button_variant as BuilderElement["button_variant"],
              })
            }
          />
        </>
      )}

      {(el.type === "dynamic_chefs" || el.type === "dynamic_products") && (
        <>
          <Field label="CTA label" value={el.cta || ""} onChange={(cta) => onChange({ cta })} />
          <Field
            label="CTA link"
            value={el.cta_link || ""}
            onChange={(cta_link) => onChange({ cta_link })}
          />
        </>
      )}

      {el.type === "media" && (
        <>
          <MultiMediaPicker
            label="Images or videos"
            folder="general"
            urls={collectMediaUrls(el.media_url, el.media_urls)}
            onChange={(urls) =>
              onChange({
                media_urls: urls,
                media_url: urls[0] || "",
              })
            }
          />
          <label className="flex items-center gap-2 text-xs text-silver-mute">
            <input
              type="checkbox"
              checked={el.media_mode !== "single"}
              onChange={(e) =>
                onChange({
                  media_mode: e.target.checked ? "slideshow" : "single",
                })
              }
            />
            Auto slideshow (runs when 2+ media)
          </label>
        </>
      )}

      {el.type === "cards" && (
        <CardListEditor
          cards={el.cards || []}
          onChange={(cards) => onChange({ cards })}
        />
      )}

      {el.type === "spacer" && (
        <Field
          label="Height (px)"
          value={String(el.spacer_height || 48)}
          onChange={(v) => onChange({ spacer_height: Number(v) || 48 })}
        />
      )}

      {el.type === "buttons" && (
        <div className="space-y-2">
          {(el.buttons || []).map((b, i) => (
            <div key={b.id} className="rounded border border-white/10 p-2">
              <Field
                label="Label"
                value={b.label}
                onChange={(label) => {
                  const buttons = [...(el.buttons || [])];
                  buttons[i] = { ...buttons[i], label };
                  onChange({ buttons });
                }}
              />
              <Field
                label="URL"
                value={b.href}
                onChange={(href) => {
                  const buttons = [...(el.buttons || [])];
                  buttons[i] = { ...buttons[i], href };
                  onChange({ buttons });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-secondary-glow"
            onClick={() =>
              onChange({
                buttons: [
                  ...(el.buttons || []),
                  {
                    id: createElement("button").id,
                    label: "New",
                    href: "/",
                    variant: "outline",
                  },
                ],
              })
            }
          >
            + Add button
          </button>
        </div>
      )}

      {el.type === "testimonials" && (
        <div className="space-y-2">
          <Field
            label="Section title"
            value={el.title || ""}
            onChange={(title) => onChange({ title })}
          />
          {(el.testimonials || []).map((t, i) => (
            <div key={t.id || i} className="space-y-2 rounded border border-white/10 p-2">
              <ImagePicker
                label="Guest photo"
                folder="testimonials"
                accept="all"
                value={t.photo_url || ""}
                onChange={(photo_url) => {
                  const testimonials = [...(el.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], photo_url };
                  onChange({ testimonials });
                }}
              />
              <Field
                label="Name"
                value={t.name}
                onChange={(name) => {
                  const testimonials = [...(el.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], name };
                  onChange({ testimonials });
                }}
              />
              <Field
                label="Role / location"
                value={t.role}
                onChange={(role) => {
                  const testimonials = [...(el.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], role };
                  onChange({ testimonials });
                }}
              />
              <Field
                label="Initials (fallback)"
                value={t.initials}
                onChange={(initials) => {
                  const testimonials = [...(el.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], initials };
                  onChange({ testimonials });
                }}
              />
              <Field
                label="Quote"
                value={t.quote}
                rows={2}
                onChange={(quote) => {
                  const testimonials = [...(el.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], quote };
                  onChange({ testimonials });
                }}
              />
              <button
                type="button"
                className="text-[10px] text-red-400"
                onClick={() =>
                  onChange({
                    testimonials: (el.testimonials || []).filter((_, idx) => idx !== i),
                  })
                }
              >
                Delete quote
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs text-secondary-glow"
            onClick={() =>
              onChange({
                testimonials: [
                  ...(el.testimonials || []),
                  {
                    id: `t-${Date.now()}`,
                    name: "Guest",
                    role: "Limbe",
                    quote: "A wonderful visit.",
                    initials: "G",
                    photo_url: "",
                    visible: true,
                  },
                ],
              })
            }
          >
            + Add testimonial
          </button>
        </div>
      )}

      <ColorField
        label="Background"
        value={el.styles.background || ""}
        onChange={(background) =>
          onChange({ styles: { ...el.styles, background } })
        }
      />
      <ColorField
        label="Text color"
        value={el.styles.textColor || ""}
        onChange={(textColor) =>
          onChange({ styles: { ...el.styles, textColor } })
        }
      />
      <Select
        label="Text align"
        value={el.styles.textAlign || "left"}
        options={["left", "center", "right"]}
        onChange={(textAlign) =>
          onChange({
            styles: {
              ...el.styles,
              textAlign: textAlign as BuilderElement["styles"]["textAlign"],
            },
          })
        }
      />
      <Select
        label="Padding"
        value={el.styles.paddingY || "md"}
        options={["none", "sm", "md", "lg", "xl"]}
        onChange={(paddingY) =>
          onChange({
            styles: {
              ...el.styles,
              paddingY: paddingY as BuilderElement["styles"]["paddingY"],
            },
          })
        }
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hex = value && /^#/.test(value) ? value : "#0D7377";
  return (
    <div className="mb-2">
      <label className="text-[10px] uppercase text-silver-dark">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-primary px-2 py-1.5 text-xs"
          value={value}
          placeholder="#0D7377 or empty"
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="text-[10px] text-silver-mute"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
