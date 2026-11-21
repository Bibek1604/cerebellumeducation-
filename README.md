# Cerebellum Education Network — Website

Public website for an international medical education consultancy.
Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Framer Motion · React Hook Form + Zod.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Copy `.env.example` to `.env.local` and fill in the values.

## Before launch — owner checklist (`TODO(owner)` in code)

Nothing has been invented; empty values are hidden on the site. Search the code for `TODO(owner)`.

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, hours, map, social links | `src/config/site.ts` → `contact`, `social` |
| Company registration, PAN, approvals | `src/config/site.ts` → `company` (shows on About + footer) |
| Enquiry email: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (or `ENQUIRY_WEBHOOK_URL`) | `.env.local` / hosting env, see `.env.example` |
| Production URL `NEXT_PUBLIC_SITE_URL` | hosting env |
| Verified fees per destination | `src/data/destinations.ts` → `indicativeCosts` |
| Genuine testimonials (with written consent) | `src/data/testimonials.ts` (home section hidden while empty) |
| Team members | `src/data/team.ts` (About section hidden while empty) |
| FAQ answers: total cost, hostel & food, safety, internship, refund policy | `src/data/faqs.ts` (hidden until answered) |
| Verify India note and set `lastChecked` | `src/data/nepal-guidance.ts` |
| High-resolution logo (current one is 196×65) | `public/logos/`, `src/config/branding.ts` |
| Legal review of Privacy Policy and Terms | `src/app/privacy-policy`, `src/app/terms-and-conditions` |

## Structure

```
src/
  app/            routes, sitemap.ts, robots.ts, opengraph-image.tsx, api/enquiry
  components/     brand, layout, sections (home + shared), destinations, programmes,
                  universities, testimonials, forms, ui
  config/         site.ts (business details), branding.ts, navigation.ts
  data/           destinations, programmes, universities, faqs, process, testimonials, scholarships, sources
  lib/            seo.ts, validations.ts (shared Zod schemas), enquiry-delivery.ts
  types/          content model
```

## Forms

`/book-counselling` and `/contact` post to `/api/enquiry`, which validates with the same Zod schema as the client,
checks a honeypot, rate-limits per IP and forwards to `ENQUIRY_WEBHOOK_URL`. If no webhook is configured, the API
returns 503 and the form shows an error with the direct contact options. It never shows a false success. Turnstile
spam protection can be enabled with environment variables.

Counselling links can pre-select fields: `/book-counselling?country=georgia&programme=md`.
# cerebellumeducation-
