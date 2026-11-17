import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { branding } from "@/config/branding";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} | International Medical Education Consultancy`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function logoDataUri(src: string) {
  "use cache";
  cacheLife("max");
  return `data:image/png;base64,${(await readFile(join(process.cwd(), "public", src))).toString("base64")}`;
}

export default async function OpengraphImage() {
  const c = branding.colors;
  const logo = branding.logo.src ? await logoDataUri(branding.logo.src) : null;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: c.dark,
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {logo ? (
          <div style={{ display: "flex", background: "white", borderRadius: 24, padding: "18px 28px", alignSelf: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={branding.logo.width * 1.6} height={branding.logo.height * 1.6} alt="" />
          </div>
        ) : (
          <div style={{ fontSize: 34, fontWeight: 800 }}>Cerebellum Education Network</div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>Your Medical Dreams.</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, color: c.secondary }}>A World of Opportunities.</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,.75)" }}>Guidance for studying medicine abroad</div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 14, background: c.primary }} />
      </div>
    ),
    size,
  );
}
