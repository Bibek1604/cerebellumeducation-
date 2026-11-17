import { Logo } from "@/components/brand/logo";
import { mainNav } from "@/config/navigation";
import { phoneLink } from "@/config/site";
import { destinations } from "@/data/destinations";
import { programmes } from "@/data/programmes";
import { HeaderClient } from "./header-client";

export function SiteHeader() {
  return (
    <HeaderClient
      logo={<Logo priority />}
      nav={mainNav}
      phone={phoneLink()}
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
