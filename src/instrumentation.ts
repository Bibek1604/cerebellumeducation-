import type { Instrumentation } from "next";
import { logger } from "@/lib/logger";

const log = logger("server");

/** Runs once when the server starts (Node.js only): configuration check and crash safety net. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") (await import("./instrumentation-node")).registerNode();
}

/** Every uncaught server error (pages, API routes, server actions, proxy), with the digest shown to the visitor. */
export const onRequestError: Instrumentation.onRequestError = (err, request, context) => {
  const e = err as { digest?: unknown; message?: unknown };
  // Redirects and not-found are control flow, not failures.
  if (typeof e?.digest === "string" && /^(NEXT_REDIRECT|NEXT_HTTP_ERROR_FALLBACK|NEXT_NOT_FOUND)/.test(e.digest)) return;
  log.error("Request failed", {
    digest: typeof e?.digest === "string" ? e.digest : undefined,
    method: request.method,
    path: request.path.split("?")[0],
    route: context.routePath,
    type: context.routeType,
    err,
  });
};
