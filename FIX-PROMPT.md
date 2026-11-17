# Fix prompt — Cerebellum Education Network website (audit of 2026-11-17)

Paste everything below the line into Claude Code, run from `E:\Work\Cerebellum`.

---

You are fixing verified defects in the Cerebellum Education Network website (Next.js 16.4 App Router, `cacheComponents` + `partialPrefetching` enabled, Tailwind CSS v4, Framer Motion). Read `AGENTS.md` and the relevant guide in `node_modules/next/dist/docs/` before changing any Next.js behaviour. Do not change the brand palette, page structure, copy policy or data files except where a task says so. Never invent business facts (numbers, partners, testimonials, contact details).

Work through the tasks in priority order. After each group, run `npx tsc --noEmit`, `npx eslint` and `npm run build`. All three must pass before you move on.

## P0 — Broken in the browser

### 1. White headings render dark navy on dark backgrounds (site-wide)
**Cause:** `src/app/globals.css` sets `h1, h2, h3, h4 { color: var(--brand-dark) }` outside any CSS layer. Unlayered CSS beats Tailwind v4 utilities, which live in `@layer utilities`, so every `text-white` heading is overridden.
**Affected (verified):** the footer column titles "Explore / Support / Destinations" on every page, and every `CtaBand` heading. On the homepage: the featured MBBS programme card title, all destination bento tile titles, the "Why Cerebellum" H2 and all 7 service titles, and "Still have a question?". Also the About page "Our mission / Our vision" cards, Scholarships "Financial guidance", and Book Counselling "What to expect".
**Fix:** move the global element rules (`html`, `body`, `h1–h4`, `p`, `::selection`, `:focus-visible`) into `@layer base { … }`. Keep `.prose-brand`, `.bg-dot-grid` and the gradient helpers as they are, or move them to `@layer components`.
**Done when:** no `h1–h4` that has the `text-white` class has a computed colour other than `rgb(255, 255, 255)`, on any route, at 390px and 1440px.

### 2. Content is invisible until JavaScript runs (bad for LCP, no-JS visitors and slow networks)
**Cause:** `Reveal` (Framer Motion, `initial={{ opacity: 0 }}`) server-renders `style="opacity:0"`. 56 elements on the homepage, including the hero H1, are hidden in the server HTML.
**Fix:**
- In `src/components/sections/home/hero.tsx`, remove `Reveal` from the H1, intro paragraph, bullets and CTA buttons. The LCP content must render visible immediately. A short CSS-only fade is allowed if it starts at opacity ≥ 0.01 with no delay.
- In `Reveal`, add a `data-reveal` attribute. Then add `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>` to `src/app/layout.tsx` (inside `<head>` or at the top of `<body>`).
**Done when:** with JavaScript disabled, the homepage hero H1, intro and CTAs are visible and no section heading is hidden. With JavaScript on, the scroll animations still work and still respect reduced motion.

## P1 — Layout and UX defects

### 3. Desktop navigation labels wrap onto two lines at 1280px and 1440px
"About Us", "Study Destinations" and "Admission Process" each wrap to two lines.
**Fix (in `src/components/layout/header-client.tsx` and `src/components/brand/logo.tsx`):**
- Add `whitespace-nowrap` to the nav items.
- Reduce the horizontal padding (`px-2.5`) and font size (`text-[0.875rem]`) at `xl`.
- Cap the header logo at `h-11` on `xl` and below.
- If the items still don't fit at 1280px, shorten the CTA to "Free Counselling" below `2xl` (full text at `2xl`).
- Keep the hamburger menu below `xl`.
**Done when:** every top-level nav item is a single line at 1280px, 1440px and 1920px, and nothing overlaps the CTA.

### 4. Next.js dev error on `/destinations/[slug]` and `/programs/[slug]`
Error: "Route … Next.js encountered URL data during prerendering … `params` accessed outside of `<Suspense>`" (`instant-shell-url-data`).
**Fix:** follow `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
- Keep `generateStaticParams` and `notFound()`.
- Move the part of each page that awaits `params` into an inner async component, rendered inside `<Suspense fallback={<…Skeleton/>}>`. The fallback should be a lightweight skeleton that uses the page's hero layout.
- `generateMetadata` may still await `params`.
- Do not use `dynamicParams`; it is incompatible with Cache Components.
**Done when:** loading `/destinations/georgia` and `/programs/mbbs` in dev logs no console error, the "1 Insight" badge is gone, and `npm run build` still prerenders every slug.

### 5. Destination detail hero doesn't match the redesign
`src/app/destinations/[slug]/page.tsx` still uses `bg-muted` for its hero. Change it to `bg-brand-gradient-soft` with the same dot-grid and arc decoration as `PageHero`.

### 6. Decorative logo arcs look like glitches
- **Homepage hero:** the `BrandArc` behind `HeroVisual` shows only as a thin orange sliver on the panel's left edge. Either position it so a clear, intentional part of the "C" sweep wraps the panel's top-left corner, or remove it.
- **`about-split.tsx`:** the arc overlaps the white logo plate, and orange at 60% opacity on blue turns muddy brown. Move it to the bottom-right, behind the pillar grid, and use full-opacity gold at a thin stroke or `text-white/15`.
**Done when:** a 1440px screenshot shows no partially clipped arc fragments and no brown-looking strokes.

### 7. Destination bento tiles are cluttered
The large outlined country code ("BD", "IN", "CN") sits behind the tile title. Add a `showCode` prop to `DestinationArt` (default `true`) and pass `false` from `destinations-bento.tsx`.

### 8. Hero map label clipped
In `hero-visual.tsx` the "Philippines" label runs off the right edge at every width. For pins with x > 380, use `textAnchor="end"` with a negative x offset (or move the pin inward).

### 9. University initials are wrong
`UniversityCard` derives initials from words, so Sechenov University shows "ISF". Add a required `shortCode` field to `University` in `src/types/content.ts`, set it in `src/data/universities.ts` (TSMU, Sechenov, KFU, KazNMU, ZJU), and render it.

### 10. Tap targets below the WCAG 2.2 minimum (24px)
"Learn more …" links on programme cards and "Ask a counsellor" in the bento are 20px tall on mobile. Give these inline-flex text links `min-h-6` (or `py-1.5`) without changing their visual weight.
**Done when:** no visible `a` or `button` outside the footer is under 24px tall at 390px, except the skip link.

### 11. Mobile has no persistent primary CTA
Below `sm` the header hides "Book Free Counselling". Add a slim sticky bottom bar under 640px only:
- "Book Free Counselling", plus a WhatsApp button only when `siteConfig.contact.whatsapp` is set.
- Hide it while the mobile menu is open and on `/book-counselling`.
- Respect the iOS safe area.
- Make sure it doesn't overlap the WhatsApp floating button: move the button up, or drop it on mobile when the bar is present.
- Add bottom padding to `<main>` on mobile so the footer isn't covered.

### 12. Counselling-mode toggle accessibility
The "In person / Online" toggle in `counselling-widget.tsx` uses `role="radio"` buttons without arrow-key support. Replace it with visually styled native `<input type="radio">` elements in a `<fieldset>`, or implement roving tabindex with arrow keys.

### 13. Hero pill wraps awkwardly on mobile
On mobile, "Education consultancy | MBBS & medical study abroad" wraps inside the pill. Below `sm`, show only the "Education consultancy" chip.

## P2 — Honest-content corrections

### 14. Success stories copy contradicts the empty state
When `testimonials.length === 0`, change the section description in `stories-section.tsx` and the `/success-stories` hero. They must not say "these are their experiences", because none are published yet. Example: "Student stories will be shared here, with their permission."

### 15. The "1 Dedicated counsellor" counter is not a meaningful statistic
In `stats-strip.tsx`, replace the 4th stat with a non-numeric tile ("Free — first consultation"), rendered without `CountUp`. Keep the other three counters, which come from the site's data.

## Owner actions (do NOT fabricate — list them in your final report)
- High-resolution logo: replace `public/logos/cerebellum-logo.png` (currently 196×65, cropped from a 200px avatar) and update `branding.logo.width/height`. It renders soft on high-DPI screens.
- Real contact details in `src/config/site.ts`.
- `ENQUIRY_WEBHOOK_URL` and `NEXT_PUBLIC_SITE_URL` in `.env.local`.
- Confirm or replace the university list and review the destination content.

## Verification (required before you report done)
1. `npx tsc --noEmit`, `npx eslint` and `npm run build` all pass. Every destination and programme slug is still prerendered.
2. Restart the dev server after deleting `.next/dev`. A stale dev CSS bundle was observed during this audit.
3. Using a real browser at 390×844 (mobile emulation) and 1280 / 1440 widths, on all 15 routes, check that there is:
   - no horizontal overflow,
   - no `text-white` heading with a non-white computed colour,
   - no nav item taller than one line,
   - no console errors,
   - no broken images,
   - no visible tap target under 24px.
4. Load the homepage with JavaScript disabled and confirm the hero is visible.
5. Report what changed per task number, with before/after evidence, and list any task you could not complete and why.
