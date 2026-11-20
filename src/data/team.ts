import type { ImageAsset } from "@/types/content";

export type TeamMember = {
  name: string;
  /** Shown in blue under the name, e.g. "Senior Counsellor" */
  role: string;
  /** Shown in grey under the role, e.g. "MBBS admissions: China & Bangladesh" */
  focus?: string;
  /** e.g. "5+ years" — only what you can stand behind */
  experience?: string;
  /** Short, factual bio — qualifications only as stated on certificates */
  bio?: string;
  languages?: string[];
  photo?: ImageAsset;
};

/** URL-safe anchor for a member's profile on the About page. */
export function memberAnchor(name: string) {
  return `team-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

/**
 * TODO(owner): add real team members (with their permission to publish
 * name, role and photo). The About page hides the Team section while empty.
 */
export const team: TeamMember[] = [];
