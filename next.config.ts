import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Browsers only honour this over HTTPS; it tells them to never use plain http for this site again.
  ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // WebP only: AVIF takes the server many times longer to create, and the first visitor waits for it.
    formats: ["image/webp"],
    // Keep converted images for 31 days. Uploads get a new file name each time, so they never go stale.
    minimumCacheTTL: 2678400,
    qualities: [75, 100],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Browsers, CDNs and proxies must ask the server for pages every time, or Admin Panel changes would show late.
      // Files (anything with a dot, /_next, /media), the API and the Admin Panel keep their own caching rules.
      {
        source: "/((?!_next/|api/|admin|media/|opengraph-image|.*[.]).*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=0, must-revalidate" }],
      },
      // Bundled pictures and videos: browsers keep them for a week.
      { source: "/:dir(images|videos|logos)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
