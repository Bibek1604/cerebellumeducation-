import { logger } from "@/lib/logger";

const log = logger("server");

/** Runs once when the server starts: reports missing or unsafe configuration. */
export function registerNode() {
  const prod = process.env.NODE_ENV === "production";
  const problems: string[] = [];
  const warnings: string[] = [];

  const secret = process.env.SESSION_SECRET ?? "";
  if (prod && secret.length < 32) problems.push("SESSION_SECRET is missing or shorter than 32 characters: admin sign-in is disabled.");

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (prod && (!site || site.includes("your-domain"))) warnings.push("NEXT_PUBLIC_SITE_URL is not set to the real website address: canonical links and the sitemap will be wrong.");
  if (prod && site.startsWith("http://")) warnings.push("NEXT_PUBLIC_SITE_URL uses http://. Serve the site over https.");

  const email = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  const webhook = Boolean(process.env.ENQUIRY_WEBHOOK_URL);
  if (!email && !webhook) warnings.push("No enquiry delivery is configured (RESEND_API_KEY + CONTACT_TO_EMAIL, or ENQUIRY_WEBHOOK_URL): forms will tell visitors to contact you directly.");
  if (process.env.RESEND_API_KEY && !process.env.CONTACT_FROM_EMAIL) warnings.push("CONTACT_FROM_EMAIL is not set: Resend's test sender will be used, which only delivers to your own Resend account.");

  if (prod && !process.env.DATABASE_URL) warnings.push("DATABASE_URL is not set: Admin Panel content is stored in the .data folder on this server. Back it up.");

  for (const p of problems) log.error(`Configuration problem: ${p}`);
  for (const w of warnings) log.warn(`Configuration: ${w}`);
  log.info("Server started", {
    env: process.env.NODE_ENV,
    storage: process.env.DATABASE_URL ? "postgresql" : "files",
    enquiryDelivery: email ? "email" : webhook ? "webhook" : "none",
  });

  // Last-resort safety net: log, don't crash silently.
  process.on("unhandledRejection", (reason) => log.error("Unhandled promise rejection", { err: reason }));
}

