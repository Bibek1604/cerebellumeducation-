import { z } from "zod";

export const qualificationOptions = [
  "Currently in Grade 11 / 12 (or equivalent)",
  "Completed Grade 12 / A-levels (or equivalent)",
  "Bachelor's degree (completed or in progress)",
  "Other",
] as const;

export const intakeOptions = [
  "Next available intake",
  "Within 6 months",
  "6–12 months from now",
  "More than 12 months from now",
  "Not sure yet",
] as const;

export const NOT_SURE = "Not sure yet (I'd like advice)";
export const ANOTHER_COUNTRY = "Another country";

/** Counselling modes. `value` is used in URLs (?mode=online), `label` is shown and submitted. */
export const counsellingModes = [
  { value: "in-person", label: "In person" },
  { value: "online", label: "Online (video)" },
  { value: "phone", label: "Phone call" },
] as const;
export const counsellingModeLabels = counsellingModes.map((m) => m.label) as [string, ...string[]];

const phoneRegex = /^\+?[\d\s()-]{7,20}$/;

const base = {
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number")
    .regex(phoneRegex, "Please enter a valid phone number, including country code"),
  email: z.string().trim().min(1, "Please enter your email address").pipe(z.email("Please enter a valid email address")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree to the privacy policy so we can contact you",
  }),
  /** Honeypot — must stay empty. Hidden from humans. */
  website: z.string().max(0).optional(),
  /** Spam-protection token (e.g. Cloudflare Turnstile) when configured */
  captchaToken: z.string().max(4096).optional(),
};

export const counsellingSchema = z.object({
  type: z.literal("counselling"),
  ...base,
  location: z.string().trim().min(2, "Please tell us where you are currently based").max(120),
  qualification: z.string().trim().min(1, "Please select your current qualification").max(120),
  programme: z.string().trim().min(1, "Please select a programme").max(120),
  country: z.string().trim().min(1, "Please select a preferred country").max(120),
  intake: z.string().trim().min(1, "Please select an expected intake").max(120),
  mode: z.enum(counsellingModeLabels, { error: "Please choose how you'd like your counselling session" }),
  message: z.string().trim().max(2000, "Please keep your message under 2000 characters").optional(),
});

export const contactSchema = z.object({
  type: z.literal("contact"),
  ...base,
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please write a short message (at least 10 characters)")
    .max(2000, "Please keep your message under 2000 characters"),
});

export const enquirySchema = z.discriminatedUnion("type", [counsellingSchema, contactSchema]);

export type CounsellingInput = z.input<typeof counsellingSchema>;
export type CounsellingValues = z.output<typeof counsellingSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;
