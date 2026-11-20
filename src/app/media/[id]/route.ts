import { readMedia } from "@/cms/store";
import { logger } from "@/lib/logger";

const log = logger("media");

/** Serves images uploaded in the Admin Panel. File names are random and never reused, so they cache forever. */
export async function GET(_request: Request, { params }: RouteContext<"/media/[id]">) {
  const { id } = await params;
  let media;
  try {
    media = await readMedia(id);
  } catch (err) {
    log.error("Could not read uploaded image", { id, err });
    return new Response("Image temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "30" } });
  }
  if (!media) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(new Uint8Array(media.bytes), {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(media.bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    },
  });
}
