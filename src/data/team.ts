import type { ImageAsset } from "@/types/content";

export type TeamMember = {
  name: string;
  role: string;
  /** Short, factual bio — qualifications only as stated on certificates */
  bio?: string;
  languages?: string[];
  photo?: ImageAsset;
};

/**
 * TODO(owner): add real team members (with their permission to publish
 * name, role and photo). The About page hides the Team section while empty.
 */
export const team: TeamMember[] = [];
