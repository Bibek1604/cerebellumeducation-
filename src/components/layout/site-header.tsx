import { Logo } from "@/components/brand/logo";
import { mainNav } from "@/config/navigation";
import { getSiteSettings, phoneLinkFrom } from "@/cms/content";
import { getDestinations } from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const { contact } = await getSiteSettings();
  return (
    <HeaderClient
      logo={<Logo priority />}
      nav={mainNav}
      phone={phoneLinkFrom(contact)}
      menus={{
        destinations: {
          links: destinations.map((d) => ({ label: d.name, href: `/destinations/${d.slug}`, description: d.tagline })),
          allLabel: "Compare all destinations",
          allHref: "/destinations",
        },
        programmes: {
          links: programmes.map((p) => ({ label: p.name, href: `/programs/${p.slug}`, description: p.summary })),
          allLabel: "View all programmes",
          allHref: "/programs",
        },
      }}
    />
  );
}
