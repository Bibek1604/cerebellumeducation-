import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { TopBar } from "@/components/layout/top-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { StickyCta } from "@/components/layout/sticky-cta";
import { MotionProvider } from "@/components/providers/motion-provider";
import { JsonLd } from "@/components/ui/json-ld";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/cms/content";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { SiteContactProvider } from "@/components/providers/site-contact";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Body & UI: friendly, modern sans. Headings: classic academic serif. */
const jakarta = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-heading", subsets: ["latin"], display: "swap", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Medical Counselling in Nepal | ${siteConfig.shortName}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Contact details & company: Admin → Contact details & company.
  const settings = await getSiteSettings();
  const { phone, phoneHref, email, whatsapp } = settings.contact;
  return (
    <html lang="en" className={`${jakarta.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
        <MotionProvider>
          <SiteContactProvider value={{ phone, phoneHref, email, whatsapp }}>
            <ChromeGate>
              <TopBar />
              <SiteHeader />
            </ChromeGate>
            <main id="main" className="flex-1">
              {children}
            </main>
            <ChromeGate>
              <SiteFooter />
              <WhatsAppFab />
              <StickyCta besideFab={Boolean(whatsapp || (phone && phoneHref))} />
            </ChromeGate>
          </SiteContactProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
