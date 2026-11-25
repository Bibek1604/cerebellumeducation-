import { on, sectionsOf } from "./content";
import type { ImageValue, PageContent, Section } from "./types";

export type StoryRow = {
  consent: string;
  studentName: string;
  destination: string;
  university: string;
  programme: string;
  admissionYear: string;
  quote: string;
  photo: ImageValue;
  videoUrl: string;
};

/** Stories of one section that may be shown: permission on file, with a name and a quote. */
export const publishedStories = (section: Section) => on<StoryRow>(section.data.stories).filter((r) => r.consent === "yes" && r.studentName && r.quote);

/** Every story a visitor can see on the Success Stories page. */
export const storiesOf = (page: PageContent) => sectionsOf(page).filter((s) => s.kind === "storyList").flatMap(publishedStories);
