/**
 * Real-world proof: your office photos (Contact page) and your own video
 * (homepage About section).
 *
 * Use ONLY your own photos/videos. Put files in /public/images/office/ and
 * /public/videos/, then list them below.
 *
 * While a list is empty, the site shows dashed "add your photo here"
 * frames on your own computer (development) only — visitors to the live site
 * never see empty placeholders.
 */

export type ShowcasePhoto = {
  src: string;
  alt: string;
  /** Short caption, e.g. "Our counselling room in Kathmandu" */
  caption?: string;
};

/** Office & team photos: office front with your logo, reception, a counselling session… (3–6 is ideal) */
export const officePhotos: ShowcasePhoto[] = [];

/**
 * Your own short video (15–60 s): an office walk-through or a counsellor saying hello.
 * Either a file in /public/videos/ (e.g. "/videos/office-tour.mp4") or a YouTube
 * embed link (e.g. "https://www.youtube.com/embed/VIDEO_ID").
 * When set, it replaces the stock campus clip in the About section.
 */
export const ownVideo: { src: string; poster?: string; title: string } | null = null;

/** Link to your public Google reviews page, shown beside student stories. */
export const googleReviewsUrl: string | null = null;

/** Shows placeholder frames for missing content — on your computer only. */
export const showPlaceholders = process.env.NODE_ENV === "development";
