import type { Scholarship } from "@/types/content";

/**
 * Scholarship listings with verified availability for the current cycle.
 *
 * Add an entry only after checking the official source. Always record
 * `verifiedOn`, and remove entries once the deadline passes. Never present
 * a scholarship as guaranteed.
 */
export const scholarships: Scholarship[] = [];

/** General scholarship categories — educational content, not offers. */
export const scholarshipTypes = [
  {
    title: "Government scholarships",
    description:
      "Some governments fund international students through national schemes, for example, the Chinese Government Scholarship administered by the China Scholarship Council. These are competitive, have fixed application windows and may exclude certain programmes or nationalities.",
    href: "https://www.campuschina.org/",
    linkLabel: "Campus China (CSC portal)",
  },
  {
    title: "University merit awards",
    description:
      "Universities sometimes offer tuition reductions based on academic results. Eligibility, value and renewal conditions are set by each university and can change from year to year.",
  },
  {
    title: "Bilateral & home-country schemes",
    description:
      "Some home governments and partner countries run scholarship quotas under bilateral agreements. These are announced by the relevant ministry or embassy, often with entrance tests.",
  },
  {
    title: "Need-based support & instalments",
    description:
      "Rather than scholarships, some universities allow fees to be paid in instalments. This can ease cash flow but does not reduce the total cost.",
  },
];
