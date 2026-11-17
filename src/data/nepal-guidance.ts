import type { ExternalSource } from "@/types/content";

/**
 * Home-country rules for Nepali (and Indian) students.
 *
 * Wording reflects only what the official sites state. Re-check before each
 * intake and update `lastChecked`. If a statement cannot be confirmed on the
 * official site, remove it rather than paraphrase from memory.
 */
export type GuidanceBlock = {
  id: string;
  title: string;
  audience: string;
  points: string[];
  sources: ExternalSource[];
  /** ISO date the points were last checked against `sources`; null = not yet verified */
  lastChecked: string | null;
};

export const nepalGuidance: GuidanceBlock = {
  id: "nepal",
  title: "Before you apply: rules for Nepali students",
  audience: "Nepali citizens",
  points: [
    "Before going abroad for a medical degree, obtain an Eligibility Letter (Eligibility Certificate) from Nepal's Medical Education Commission (MEC). MEC states it must be taken before you go.",
    "Eligibility is generally linked to passing MEC's bachelor-level entrance exam, MECEE-BL. The MEC FAQ describes limited exceptions. Check the current rules before relying on one.",
    "MEC does not issue the letter for programmes that cannot be registered with Nepal's professional council, for example programmes shorter than Nepal's equivalent.",
    "MEC's FAQ states that registration with the professional council follows only after applying with the Eligibility Letter.",
    "On return, Nepal Medical Council (NMC) conducts a licensing examination before registration.",
  ],
  sources: [
    { label: "Medical Education Commission FAQ", href: "https://mec.gov.np/frontfaq", publisher: "Government of Nepal" },
    { label: "MEC Eligibility Certificate portal", href: "http://eligibility.mec.gov.np/onl", publisher: "Medical Education Commission" },
    { label: "Nepal Medical Council", href: "https://nmc.org.np/", publisher: "Nepal" },
  ],
  lastChecked: "2026-11-17",
};

export const indiaGuidance: GuidanceBlock = {
  id: "india",
  title: "Note for Indian students",
  audience: "Indian citizens",
  points: [
    "India's National Medical Commission sets rules for foreign medical graduates, including entrance-exam (NEET-UG) eligibility before studying abroad, course duration, internship and medium of instruction. Confirm the current regulations before choosing a university.",
  ],
  sources: [{ label: "National Medical Commission (India)", href: "https://www.nmc.org.in/", publisher: "Government of India" }],
  // TODO(owner): verify against the current NMC India Foreign Medical Graduate regulations, then set the date.
  lastChecked: null,
};

export function formatChecked(iso: string | null) {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
