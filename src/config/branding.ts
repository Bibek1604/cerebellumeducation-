/**
 * Brand assets & colour values.
 *
 * The current logo file was cropped from a 200×200 social-media avatar, so it
 * is low resolution. Replace /public/logos/cerebellum-logo.png with the
 * original high-resolution file (SVG or transparent PNG) when available and
 * update `width` / `height` to its intrinsic size.
 */
export const branding = {
  logo: {
    /** e.g. "/logos/cerebellum-logo.svg" — null uses the placeholder wordmark */
    src: "/logos/cerebellum-logo.png" as string | null,
    /** Version for dark backgrounds (footer). If null, the footer shows `src` on a white plate. */
    srcOnDark: null as string | null,
    width: 196,
    height: 65,
    alt: "Cerebellum Education Network",
  },
  /** Mirror of the CSS tokens — used where CSS variables aren't available (OG images). */
  colors: {
    primary: "#2468ae",
    primaryDark: "#1b5290",
    secondary: "#e89633",
    accent: "#d9741a",
    dark: "#262b5c",
    muted: "#f4f6fa",
  },
  /**
   * Optional licensed photography. Leave null to use the built-in brand
   * artwork. Put files in /public/images/ and reference them here.
   */
  heroImage: null as { src: string; alt: string } | null,
} as const;
