import type { Testimonial } from "@/types/content";

/**
 * Student testimonials.
 *
 * Only add genuine stories from real students who have given written
 * permission to publish their name, photo and words. Never write or
 * paraphrase reviews on a student's behalf.
 *
 * Example entry (do not publish as-is):
 * {
 *   id: "jane-doe-2026",
 *   studentName: "Jane Doe",
 *   destination: "georgia",
 *   university: "Tbilisi State Medical University",
 *   programme: "MD",
 *   admissionYear: "2026",
 *   quote: "…student's own words…",
 *   photo: { src: "/images/students/jane-doe.jpg", alt: "Jane Doe on campus" },
 *   videoUrl: "https://www.youtube.com/embed/…", // optional
 *   consentOnFile: true,
 * }
 */
export const testimonials: Testimonial[] = [];
