import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { addMediaItem, UPLOADS_DIR } from "@/lib/site-store";
import type { MediaItem } from "@/types";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") || "");
    const folder = String(form.get("folder") || "general");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isVideo = VIDEO_TYPES.includes(file.type);
    const isImage = IMAGE_TYPES.includes(file.type);
    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only images (JPG/PNG/WebP/GIF) or videos (MP4/WebM/MOV) allowed" },
        { status: 400 }
      );
    }

    const maxBytes = isVideo ? 50 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: isVideo
            ? "Video too large (max 50MB)"
            : "Image too large (max 8MB)",
        },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "jpg");
    const safeBase = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);
    const filename = `${Date.now()}-${safeBase || (isVideo ? "video" : "image")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

    const item: MediaItem = {
      id: `media-${Date.now()}`,
      url: `/uploads/${filename}`,
      name: file.name,
      alt_text: alt || safeBase || file.name,
      folder,
      size: file.size,
      created_at: new Date().toISOString(),
      usage_refs: [],
      kind: isVideo ? "video" : "image",
    };

    const items = await addMediaItem(item);
    return NextResponse.json({ item, items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
