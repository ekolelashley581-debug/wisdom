import { ElementorEditor } from "@/components/builder/ElementorEditor";
import { readLayouts } from "@/lib/page-builder-store";
import {
  getDesign,
  getMenuItems,
  getSettings,
  getSpaProducts,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminElementorPage() {
  const [layouts, design, settings, specials, products] = await Promise.all([
    readLayouts(),
    getDesign(),
    getSettings(),
    getMenuItems({ chefsSpecial: true, publishedOnly: false }),
    getSpaProducts(),
  ]);

  return (
    <ElementorEditor
      initial={layouts}
      design={design}
      settings={settings}
      specials={specials}
      products={products}
    />
  );
}
