import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/cms/auth";
import { MEDIA_TYPES, saveMedia } from "@/cms/store";
import { audit, logger } from "@/lib/logger";

const log = logger("media");

const MAX_BYTES = 5 * 1024 * 1024;

/** Detects the real image type from its first bytes (never trust the file name or browser type). */
function sniff(b: Buffer): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (b.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  if (b.subarray(0, 6).toString("ascii") === "GIF87a" || b.subarray(0, 6).toString("ascii") === "GIF89a") return "image/gif";
  return null;
}

/** Image upload for the Admin Panel. Signed-in admins only. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime || !MEDIA_TYPES[mime]) return NextResponse.json({ error: "Use a JPG, PNG, WebP, AVIF or GIF image." }, { status: 415 });

  try {
    const id = await saveMedia(bytes, mime, file.name, admin.email);
    audit.info("Image uploaded", { by: admin.email, id, type: mime, bytes: bytes.length });
    return NextResponse.json({ src: `/media/${id}` });
  } catch (e) {
    log.error("Upload failed", { by: admin.email, err: e });
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
