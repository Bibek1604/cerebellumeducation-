import type { University } from "@/types/content";
import { destinations } from "./destinations";

/**
 * University directory.
 *
 * CONTENT POLICY — READ BEFORE EDITING
 * - List only institutions the consultancy genuinely helps students apply to.
 * - Names and websites must be the official ones.
 * - `isPartner` must stay false unless a written agreement exists.
 * - Do not add rankings, accreditations or recognition claims; put verified
 *   notes in `recognitionNotes` only after checking the official source.
 * - Fill `mediumOfInstruction`, `tuitionRange`, `intakes`, `wdomsUrl` only
 *   with details confirmed with the university for the current intake.
 *
 * TODO(owner): confirm every entry below is a university you actively place
 * students at (they are well-known public institutions included for layout
 * and are NOT claimed as partners), and add verified details.
 *
 * TODO(owner): Bangladesh — add the medical colleges you work with.
 * TODO(owner): India — add the medical colleges you work with.
 * TODO(owner): Philippines — add the medical schools you work with.
 * Countries without entries show an "Ask a counsellor" card automatically.
 */
const all: University[] = [
  {
    slug: "tbilisi-state-medical-university",
    enabled: true,
    name: "Tbilisi State Medical University",
    shortName: "TSMU",
    country: "georgia",
    city: "Tbilisi",
    programmes: ["md", "dentistry"],
    intro: "A public medical university in Georgia's capital offering English-taught medical and dental programmes.",
    officialUrl: "https://tsmu.edu/",
    isPartner: false,
  },
  {
    slug: "sechenov-university",
    enabled: true,
    name: "I.M. Sechenov First Moscow State Medical University (Sechenov University)",
    shortName: "Sechenov",
    country: "russia",
    city: "Moscow",
    programmes: ["mbbs"],
    intro: "One of Russia's oldest medical universities, offering General Medicine for international students.",
    officialUrl: "https://www.sechenov.ru/eng/",
    isPartner: false,
  },
  {
    slug: "kazan-federal-university",
    enabled: true,
    name: "Kazan Federal University",
    shortName: "KFU",
    country: "russia",
    city: "Kazan",
    programmes: ["mbbs"],
    intro: "A large federal university whose Institute of Fundamental Medicine and Biology teaches General Medicine.",
    officialUrl: "https://kpfu.ru/eng",
    isPartner: false,
  },
  {
    slug: "kaznmu",
    enabled: true,
    name: "Asfendiyarov Kazakh National Medical University",
    shortName: "KazNMU",
    country: "kazakhstan",
    city: "Almaty",
    programmes: ["mbbs"],
    intro: "Kazakhstan's national medical university in Almaty, admitting international students to General Medicine.",
    officialUrl: "https://kaznmu.edu.kz/en/",
    isPartner: false,
  },
  {
    slug: "zhejiang-university",
    enabled: true,
    name: "Zhejiang University",
    shortName: "ZJU",
    country: "china",
    city: "Hangzhou",
    programmes: ["mbbs"],
    intro: "A comprehensive research university whose School of Medicine teaches international students.",
    officialUrl: "https://www.zju.edu.cn/english/",
    isPartner: false,
  },
];

const enabledDestinationSlugs = new Set(destinations.map((d) => d.slug));

export const universities = all.filter((u) => u.enabled && enabledDestinationSlugs.has(u.country));

export function getUniversity(slug: string) {
  return universities.find((u) => u.slug === slug);
}

export function universitiesForDestination(slug: string) {
  return universities.filter((u) => u.country === slug);
}

export function universitiesForProgramme(slug: string) {
  return universities.filter((u) => u.programmes.includes(slug));
}
