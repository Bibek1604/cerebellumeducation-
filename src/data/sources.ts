import type { ExternalSource } from "@/types/content";

/**
 * Official bodies referenced across the site. Recognition and licensing
 * rules are set by these organisations — always point students to them
 * rather than paraphrasing rules that change.
 */
export const globalSources = {
  wdoms: {
    label: "World Directory of Medical Schools",
    href: "https://search.wdoms.org/",
    publisher: "World Federation for Medical Education & FAIMER",
  },
  ecfmg: {
    label: "ECFMG: Educational Commission for Foreign Medical Graduates",
    href: "https://www.ecfmg.org/",
    publisher: "Intealth",
  },
  wfme: {
    label: "World Federation for Medical Education",
    href: "https://wfme.org/",
    publisher: "WFME",
  },
} satisfies Record<string, ExternalSource>;

/** Home-country medical regulators students commonly need to check. */
export const homeRegulators: ExternalSource[] = [
  {
    label: "Nepal Medical Council",
    href: "https://nmc.org.np/",
    publisher: "Nepal",
  },
  {
    label: "National Medical Commission",
    href: "https://www.nmc.org.in/",
    publisher: "India",
  },
  {
    label: "Bangladesh Medical and Dental Council",
    href: "https://bmdc.org.bd/",
    publisher: "Bangladesh",
  },
];
