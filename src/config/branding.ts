/**
 * Brand assets & colour values.
 *
 * Logo: transparent PNG cropped from the official artwork (812×242).
 * Replace with an SVG when one is available and update width / height.
 */
export const branding = {
  logo: {
    /** e.g. "/logos/cerebellum-logo.svg" — null uses the placeholder wordmark */
    src: "/logos/cerebellum-logo-full.png" as string | null,
    /** Version for dark backgrounds (footer). If null, the footer shows `src` on a white plate. */
    srcOnDark: "/logos/cerebellum-logo-white.png" as string | null,
    width: 812,
    height: 242,
    alt: "Cerebellum Education Network",
  },
  /** Mirror of the CSS tokens — used where CSS variables aren't available (OG images). */
  colors: {
    primary: "#1a73d4",
    primaryDark: "#135ca6",
    secondary: "#f8820d",
    accent: "#e46400",
    dark: "#123a6b",
    sky: "#3cb4f8",
    muted: "#f3f8fd",
  },
  /**
   * Hero photo: transparent cut-out shown on the right of the homepage hero.
   * Source: Pexels photo 3807735 (Pexels licence: free commercial use, no
   * attribution required). Files live in /public/images/.
   */
  heroImage: {
    src: "/images/hero-student.png",
    alt: "Smiling university student in glasses holding a stack of books",
    width: 573,
    height: 820,
  } as { src: string; alt: string; width: number; height: number } | null,
  /** About-section photo. Source: Pexels photo 16461275 by Sanket Mishra (Pexels licence). */
  aboutImage: {
    src: "/images/about-student.jpg",
    alt: "Smiling student reading a book between library shelves",
    width: 1600,
    height: 1067,
  },
} as const;
