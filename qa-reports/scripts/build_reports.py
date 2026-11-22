"""Builds the QA workbook (.xlsx) and the to-do / tester-guide PDF from recorded results."""
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

OUT = sys.argv[1]
R = json.load(open("results.json", encoding="utf8"))
RUN = "2026-11-22"
ENV = "Local production build (next build + next start, port 3400), local-file storage, temporary test admins. Not the live site."

# ───────────────────────── Extra rows run in Chrome (real results) ─────────────────────────
def add(sheet, pfx, **kw):
    n = sum(1 for r in R if r["id"].startswith(pfx)) + 1
    base = dict(id=f"{pfx}-{n:03d}", sheet=sheet, severity="", fix="", remarks="")
    base.update(kw)
    R.append(base)

pages16 = "/, /about, /admission-process, /contact, /destinations, /destinations/china, /programs, /programs/mbbs, /scholarships, /faqs, /book-counselling, /success-stories, /blog, /videos, /privacy-policy, /admin/login"
for w, res in [(390, "All 17 pages: page width 375 px (viewport minus scrollbar) or 390 px, no horizontal scroll"), (768, "All 16 pages: page width 753–768 px, no horizontal scroll"), (1440, "6 key pages: page width 1425 px, no horizontal scroll")]:
    add("UI", "UI", module="Public website", feature=f"Layout at {w}px", cat="Responsive", scenario=f"No page scrolls sideways at {w}px wide", steps=f"Open each page in a {w}px-wide window (Chrome) and compare the page width with the window width",
        data=pages16 if w != 1440 else "/, /destinations, /programs/mbbs, /book-counselling, /blog, /videos", expected="Page width never larger than the window", actual=res, status="Pass",
        remarks="Checked in Chrome with same-origin iframes. Decorative background shapes extend past the edge but are clipped. Visual look (spacing, overlaps, text wrapping) was NOT reviewed — see the Not Tested rows.")
for p, n, msgs in [("/contact", 6, "name, phone, email, subject, message, consent"), ("/book-counselling", 9, "name, phone, email, location, qualification, programme, country, intake, consent")]:
    add("Validation", "FV", module="Contact form" if p == "/contact" else "Book counselling form", feature="Browser-side validation", cat="Frontend validation",
        scenario=f"{p}: submitting empty / bad data shows an error under each field before anything is sent", steps="Open the page, click Submit with the form empty, then enter email 'not-an-email', phone 'abc', name 'A' and submit again",
        data="empty; then not-an-email / abc / A", expected="Each invalid field is marked and explained; nothing is sent", actual=f"{n} fields marked invalid ({msgs}); messages such as 'Please enter a valid email address'", status="Pass",
        remarks="Run in Chrome. Server-side validation of the same rules was tested separately (FV-017 … FV-028).")

NT = [  # (sheet, prefix, module, feature, cat, scenario, steps, expected, status, remarks)
    ("Database", "DB", "CMS storage (PostgreSQL)", "Save & read", "Database", "Content saved in the Admin Panel is written to PostgreSQL and read back", "With the database running, save any page, restart the app, reload the page",
     "Change is still there after a restart", "Blocked", "Local PostgreSQL (127.0.0.1:5433 from .env) refused connections during testing. All saving was tested with local-file storage instead (same code path above the storage layer)."),
    ("Database", "DB", "CMS storage (PostgreSQL)", "Auto-created tables", "Database", "Tables cms_content, cms_media and cms_admins are created on first start", "Start the app against an empty database, then list tables", "3 tables exist", "Blocked", "Same reason: database not reachable."),
    ("Database", "DB", "CMS storage (PostgreSQL)", "Database down", "Error handling", "When the database is down, visitors still see the site with built-in content", "Stop PostgreSQL and open the homepage", "Homepage renders with original content; admin shows a clear storage error",
     "Pass", "Observed during this session: with PostgreSQL refusing connections the public site rendered built-in defaults (server log: 'Could not read content, showing built-in defaults')."),
    ("Database", "DB", "CMS storage (PostgreSQL)", "Queries", "SQL injection", "All database queries use parameters ($1, $2 …), never string building", "Code review of src/cms/store.ts", "Only parameterised queries",
     "Pass", "Verified by reading every query in src/cms/store.ts. Not executed against PostgreSQL (database down)."),
    ("Database", "DB", "CMS storage", "Concurrent edits", "Data integrity", "Two admins editing the same page at the same time do not silently overwrite each other", "Open the same page in two browsers, save in both",
     "Second save warns that the page changed", "Not Tested", "From code: saves are last-write-wins with no version check. Expect the second save to overwrite the first without warning — confirm and decide if it matters."),
    ("API", "AP", "Enquiry API", "Spam protection", "Turnstile", "With Cloudflare Turnstile switched on, submissions without a valid token are refused", "Set TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY, submit the form", "Bots without a token get captcha_failed",
     "Not Tested", "Turnstile is not configured, and the widget is not rendered in the forms yet (integration point only)."),
    ("Auth", "AU", "Admin Login", "Session cookie on HTTPS", "Cookie flags", "On the live HTTPS site the session cookie has the Secure flag", "Sign in on the live site, check the cookie in DevTools → Application → Cookies", "cen_admin shows Secure ✓, HttpOnly ✓, SameSite Lax",
     "Blocked", "Needs the live site URL. Locally the flag is off on purpose (plain HTTP)."),
    ("UI", "UI", "Public website", "Visual check", "Responsive", "Every page looks right on a phone, tablet and desktop (no overlaps, clipped text, broken images)", "Open each page at 390, 768, 1280 and 1440 px; scroll top to bottom", "No visual defects",
     "Not Tested", "Needs a human eye. Only horizontal overflow was checked automatically."),
    ("UI", "UI", "Public website", "Cross-browser", "Compatibility", "Site works in Chrome, Edge, Firefox, Safari (iPhone) and Samsung Internet", "Repeat the main flows in each browser", "Same behaviour everywhere", "Not Tested", "Only Chrome was available."),
    ("UI", "UI", "Public website", "Keyboard & screen reader", "Accessibility", "Menus, forms and the FAQ accordion work with the keyboard and a screen reader", "Tab through each page; use NVDA/VoiceOver on the forms", "Everything reachable and announced", "Not Tested", ""),
    ("UI", "UI", "Admin Panel", "Editor interactions", "Functional UI", "Add, move, hide and delete sections; add/remove list items; image upload button", "Admin → Pages → Homepage: add a section, move it, untick 'Show on website', save, check the site", "Each change appears on the site after Save",
     "Not Tested", "The server side of saving was tested (FT-040…FT-051). Clicking through the editor UI itself was not."),
    ("UI", "UI", "Admin Panel", "Admin on a phone", "Responsive", "The Admin Panel is usable on a phone", "Open /admin on a phone, edit and save a reel", "Usable without zooming", "Not Tested", ""),
    ("Performance", "PF", "Public website", "Real-world speed", "Lighthouse / Core Web Vitals", "Live site scores well on mobile (LCP < 2.5 s, CLS < 0.1, INP < 200 ms)", "Run PageSpeed Insights on the live homepage, a country page and /book-counselling", "Green Core Web Vitals",
     "Blocked", "Needs the live URL. Local timings above only measure the server."),
    ("Functional", "FT", "Live website", "Deployed site", "Smoke test", "The deployed website matches this code (new Reels / Videos / Blog sections exist)", "Open the live homepage, /blog and /videos", "All load", "Blocked", "No deployed URL was provided."),
]
for sheet, pfx, module, feature, cat, scen, steps, exp, status, rem in NT:
    actual = {"Blocked": "Not executed — blocked (see Remarks)", "Not Tested": "Not executed"}.get(status, "See Remarks")
    add(sheet, pfx, module=module, feature=feature, cat=cat, scenario=scen, steps=steps, data="-", expected=exp, actual=actual, status=status, remarks=rem)

# ───────────────────────── Bugs ─────────────────────────
BUGS = [
    dict(id="BUG-001", title="Login brute-force limit can be bypassed by changing the X-Forwarded-For header", sev="High", tests=["SE-009"], module="Admin Login",
         cause="The limit key is 'IP|email' and the IP is read directly from the client-supplied X-Forwarded-For header (src/app/admin/actions.ts, loginAction). An attacker sends a new fake IP with every guess.",
         fix="Also count failures per email alone (e.g. 10 per 15 min); trust X-Forwarded-For only from your own proxy (right-most trusted hop) or use the platform's real client IP; keep counts in the database/Redis so restarts and multiple instances share them.",
         steps="1) Enter a wrong password 6 times. 2) Send the 7th attempt with header X-Forwarded-For: 10.0.0.99 and the right password. Result: signed in."),
    dict(id="BUG-002", title="Signing out or changing the password does not end other sessions", sev="Medium", tests=["AU-017", "AU-018"], module="Admin Panel / Sessions",
         cause="Sessions are stateless signed tokens valid for 8 hours (src/cms/auth.ts). Logout only deletes the browser's cookie; nothing on the server marks the token as revoked.",
         fix="Add a 'sessionVersion' (or token id list) to each admin record, include it in the token, compare on every request, and bump it on logout, password change and admin removal.",
         steps="1) Sign in and copy the cen_admin cookie. 2) Sign out (or change password). 3) Put the copied cookie back. Result: dashboard opens."),
    dict(id="BUG-003", title="A newly added blog post shows 'This page has moved on' on its first visit", sev="Medium", tests=["FT-046"], module="Blog (/blog/[slug])",
         cause="Not fully confirmed. Posts added after the build are not prerendered. With Cache Components the first request is answered from the build-time state (where the post did not exist), and the correct page is only generated in the background for later visits. Two fixes were tried and did NOT help: reading params inside <Suspense> (docs pattern) and calling connection() before the lookup. Both were reverted.",
         fix="Options to investigate: (a) after saving blog posts, warm the new URL with a server-side fetch so the first real visitor gets the finished page; (b) render the post page fully dynamically; (c) check with the Next.js 16.4 'ISR with Cache Components' guide / issue tracker. Same behaviour is likely for countries and programmes added after the build (not tested).",
         steps="1) Admin → Blog posts → add a post with web address 'test-post' → Save. 2) Open /blog/test-post. Result: 'This page has moved on'. 3) Reload: the post appears."),
    dict(id="BUG-004", title="No Content-Security-Policy header on pages", sev="Medium", tests=["SE-006"], module="Whole site",
         cause="next.config.ts sets nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy and HSTS, but no CSP.",
         fix="Add a CSP (start in Report-Only): default-src 'self'; script-src 'self' with nonces; img-src 'self' data: https://i.ytimg.com; frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.facebook.com https://www.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'.",
         steps="curl -I the homepage: no Content-Security-Policy header."),
    dict(id="BUG-005", title="Invalid links and values are silently blanked when saving — the admin is told 'Saved'", sev="Medium", tests=["FV-001"], module="Admin Panel (all editors)",
         cause="src/cms/sanitize.ts turns any invalid https/href/date/email value into '' and the save still returns ok. Items with an empty link (reels, videos) then disappear from the site with no warning.",
         fix="Return a list of fields that were rejected from saveContentAction and show them next to the fields; or validate in the editor before saving (e.g. 'Link must start with https://').",
         steps="Admin → Reels → add a reel with link 'tiktok.com/@x/video/1' (no https) → Save. 'Saved' appears, but the reel never shows on the homepage."),
    dict(id="BUG-006", title="Saving more than ~1 MB of content crashes with a server error instead of the friendly message", sev="Low", tests=["FV-006"], module="Admin Panel (save)",
         cause="Next.js limits server-action bodies to 1 MB by default. The app's own check (2 MB, 'This page has too much content…') is never reached; a 1.1 MB save already returns HTTP 500.",
         fix="Set experimental.serverActions.bodySizeLimit: '2mb' in next.config.ts, or lower the app's check to match 1 MB.",
         steps="Save a blog list totalling ~1.1 MB (e.g. many long posts). Result: HTTP 500 / generic error."),
    dict(id="BUG-007", title="Enquiry form rate limit can be bypassed by changing X-Forwarded-For", sev="Medium", tests=["SE-025"], module="Enquiry API",
         cause="src/app/api/enquiry/route.ts trusts the client-supplied X-Forwarded-For; the limit is also in memory per server process.",
         fix="Use the proxy-provided client IP only; turn on Cloudflare Turnstile (already prepared in enquiry-delivery.ts) — this is the real protection against spam floods.",
         steps="Send 7 valid enquiries, each with a different X-Forwarded-For value. None is refused."),
    dict(id="BUG-008", title="Enquiry API reads very large request bodies (8 MB accepted)", sev="Low", tests=["AP-010"], module="Enquiry API",
         cause="request.json() reads the whole body before validation; there is no size check.",
         fix="Refuse requests whose Content-Length is over ~32 KB before parsing, and cap body size in the reverse proxy (e.g. nginx client_max_body_size).",
         steps="POST an 8 MB JSON body to /api/enquiry. It is fully read and processed."),
    dict(id="BUG-009", title="First visit to an unknown country / programme / blog address returns HTTP 200 instead of 404", sev="Low", tests=["FT-032", "FT-033", "FT-034", "FT-080"], module="Dynamic pages",
         cause="Unknown addresses are streamed: the 200 status is sent before notFound() runs. The page shows 'not found' and has noindex, and later visits return 404.",
         fix="Acceptable for SEO because of noindex, but monitoring tools will see 200. If needed, check slugs in proxy.ts (or middleware) against the list and return 404 early.",
         steps="Open /programs/anything-new once: HTTP 200 with the 'not found' page. Open it again: HTTP 404."),
    dict(id="BUG-010", title="Homepage loads about 820 KB of JavaScript (uncompressed)", sev="Low", tests=["PF-007"], module="Performance",
         cause="14 script files on the homepage (Framer Motion, React, forms, quiz, carousels).",
         fix="Run 'next build' with the bundle analyser; lazy-load the quiz and carousels; check gzip/brotli size on the live server (real transfer size is much smaller).",
         steps="Sum the size of the /_next/static/*.js files the homepage loads."),
]
bug_of = {t: b["id"] for b in BUGS for t in b["tests"]}
sev_of = {b["id"]: b["sev"] for b in BUGS}
fix_of = {b["id"]: b["fix"] for b in BUGS}
for r in R:
    if r["id"] in bug_of:
        b = bug_of[r["id"]]; r["bug"] = b; r["severity"] = sev_of[b]; r["fix"] = fix_of[b]
    else:
        r.setdefault("bug", "")
    if r["id"] == "FT-046":
        r["actual"] = "First visit (curl and Chrome): 'This page has moved on' (not-found page). Second visit: correct post. " + r["actual"]
    if r["id"] == "SE-010":
        r["remarks"] = "Rejected, but as HTTP 500 rather than 403. Harmless; noted only."
    if r["id"] == "AU-008" and not r["remarks"]:
        pass
    r["retest"] = {"FT-046": "Retested twice after fixes — still Fail (fixes reverted)"}.get(r["id"], "Not retested" if r["status"] == "Fail" else ("N/A" if r["status"] == "Pass" else "Pending"))
    if r["status"] in ("Pass", "Fail"):
        r["remarks"] = (r["remarks"] + " " if r["remarks"] else "") + f"Evidence: automated run {RUN}."
        if r["sheet"] in ("UI",) and "Chrome" in r["remarks"]:
            pass

# ───────────────────────── Workbook styling helpers ─────────────────────────
F = "Arial"
HFILL = PatternFill("solid", start_color="1F3A5F")
HFONT = Font(name=F, bold=True, color="FFFFFF", size=10)
BODY = Font(name=F, size=10)
BOLD = Font(name=F, size=10, bold=True)
TITLE = Font(name=F, size=14, bold=True, color="1F3A5F")
THIN = Side(style="thin", color="C9D3E0")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
STATUS_FILL = {"Pass": "D9F2E1", "Fail": "F8D7DA", "Blocked": "FFF0C2", "Not Tested": "E7EAF0"}
SEV_FILL = {"Critical": "C00000", "High": "F4B183", "Medium": "FFE699", "Low": "DDEBF7"}

wb = Workbook()
wb.remove(wb.active)


def sheet(name, headers, rows, widths, title=None, note=None):
    ws = wb.create_sheet(name)
    r0 = 1
    if title:
        ws.cell(1, 1, title).font = TITLE
        if note:
            ws.cell(2, 1, note).font = Font(name=F, size=9, italic=True, color="555555")
        r0 = 4
    for c, h in enumerate(headers, 1):
        cell = ws.cell(r0, c, h); cell.font = HFONT; cell.fill = HFILL; cell.alignment = Alignment(wrap_text=True, vertical="center"); cell.border = BOX
    for i, row in enumerate(rows, r0 + 1):
        for c, v in enumerate(row, 1):
            cell = ws.cell(i, c, v); cell.font = BODY; cell.alignment = WRAP; cell.border = BOX
    for c, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.freeze_panes = ws.cell(r0 + 1, 2 if len(headers) > 3 else 1)
    if rows:
        ws.auto_filter.ref = f"A{r0}:{get_column_letter(len(headers))}{r0 + len(rows)}"
    return ws, r0


TC_HEAD = ["Test Case ID", "Module", "Feature", "Testing Category", "Test Scenario", "Steps to Perform", "Test Data", "Expected Result", "Actual Result", "Status", "Bug ID", "Severity", "Recommended Fix", "Retest Status", "Remarks"]
TC_W = [11, 20, 20, 18, 40, 40, 22, 32, 40, 11, 10, 10, 40, 18, 40]


def tc_sheet(name, keys, title):
    rows = [[r["id"], r["module"], r["feature"], r["cat"], r["scenario"], r["steps"], r["data"], r["expected"], r["actual"], r["status"], r["bug"], r["severity"], r["fix"], r["retest"], r["remarks"]]
            for r in R if r["sheet"] in keys]
    ws, r0 = sheet(name, TC_HEAD, rows, TC_W, title, f"Run {RUN}. Environment: {ENV} Status values: Not Tested / Pass / Fail / Blocked.")
    last = r0 + len(rows)
    dv = DataValidation(type="list", formula1='"Not Tested,Pass,Fail,Blocked"', allow_blank=False)
    ws.add_data_validation(dv); dv.add(f"J{r0+1}:J{last+200}")
    for st, col in STATUS_FILL.items():
        ws.conditional_formatting.add(f"J{r0+1}:J{last+200}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", start_color=col)))
    for sv, col in SEV_FILL.items():
        ws.conditional_formatting.add(f"L{r0+1}:L{last+200}", CellIsRule(operator="equal", formula=[f'"{sv}"'], fill=PatternFill("solid", start_color=col), font=Font(name=F, color="FFFFFF" if sv == "Critical" else "000000")))
    return ws, r0, last


# 1. Project overview
ov = [
    ("Project", "Cerebellum Education Network — public website + Admin Panel (CMS)"),
    ("What it does", "Marketing and enquiry website for a consultancy that helps students (mainly from Nepal and India) study medicine abroad. Visitors browse study destinations, programmes, the admission process, FAQs, scholarships, success stories, blog posts and videos/reels, and send a contact message or book a free counselling session. Staff edit almost all text, images and lists in the Admin Panel."),
    ("Frontend", "Next.js 16.4.6 (App Router, Cache Components, Partial Prefetching), React 19.3, TypeScript, Tailwind CSS 4.3, Framer Motion, React Hook Form + Zod, lucide-react icons"),
    ("Backend", "Next.js server components, server actions (admin saves, login, users) and route handlers: /api/enquiry, /api/admin/media, /media/[id], sitemap.xml, robots.txt, opengraph-image"),
    ("Database / storage", "PostgreSQL via 'pg' when DATABASE_URL is set (tables cms_content, cms_media, cms_admins created automatically); otherwise JSON files and images in ./.data. Prisma is installed but its schema (one 'User' model) is NOT used by the app."),
    ("Content model", "Each page is a list of sections; shared content (countries, programmes, contact details, team, admission steps, guidance, reels, videos, blog posts) is stored per key as JSON, cleaned by src/cms/sanitize.ts before saving."),
    ("User roles", "1) Visitor (no account). 2) Admin — every admin has the same full rights (edit all content, upload images, add/remove admins). There are no other roles or permission levels."),
    ("Authentication", "Email + password (scrypt hashes), signed 8-hour session cookie 'cen_admin' (HMAC-SHA256 with SESSION_SECRET), in-memory login rate limit (6 failures / 15 min per IP+email)."),
    ("Integrations", "Enquiry delivery by Resend email or a webhook (not configured in this environment); optional Cloudflare Turnstile (not configured); YouTube/Vimeo/Facebook embeds; Google Maps embed (if configured)."),
    ("Codebase size", "153 source files, ~15,400 lines under src/"),
    ("Repository", "github.com/Bibek1604/cerebellumeducation- (branch main)"),
    ("Tested on", f"{RUN}. {ENV}"),
    ("Access that was missing", "• Live/deployed website URL • A running PostgreSQL database (127.0.0.1:5433 refused connections) • Email/webhook inbox to confirm enquiry delivery • Real admin credentials were NOT needed: temporary test admins were created in local files and removed afterwards."),
    ("How results were produced", "An automated test script sent real HTTP requests (pages, forms, API, server actions, uploads, forged cookies) and recorded each response. Browser checks (layout widths, form validation, the blog first-visit bug) were run in Chrome. Nothing is marked Pass unless it was executed; code-review-only checks say so in Remarks."),
]
ws, _ = sheet("Project Overview", ["Item", "Details"], ov, [26, 120], "Project Overview", "Study of the source code and running application.")

# 2. Completed features
done = [
    ("Public website", "17 public pages + 7 country pages + 6 programme pages", "Verified — all return 200 (FT-001…FT-030)"),
    ("Public website", "Not-found page for unknown addresses", "Verified — works, but first visit returns 200 (BUG-009)"),
    ("Public website", "Internal links and images", "Verified — 30 links and 19 images all load (FT-038, FT-039)"),
    ("Public website", "Responsive layout (no sideways scrolling at 390 / 768 / 1440 px)", "Verified in Chrome (UI rows)"),
    ("Public website", "SEO: titles, one H1 per page, sitemap.xml, robots.txt, Open Graph image, JSON-LD", "Verified (UI-001…UI-027, FT-015…FT-017)"),
    ("Contact form", "Browser and server validation, honeypot, rate limit, honest 'not connected' error", "Verified (FV-017…FV-024, SE-021, AP-005, AP-008)"),
    ("Book counselling form", "Validation incl. 'programme must be offered in that country'", "Verified (FV-025…FV-028, AP-007)"),
    ("Admin Panel", "Login, logout, 8-hour sessions, protected pages and actions", "Verified (AU-001…AU-016, SE-013…SE-015)"),
    ("Admin Panel", "Edit 12 pages and 11 shared-content areas", "Verified — every editor opens (FT-057…FT-079); saving verified for reels, videos, blog"),
    ("Admin Panel", "Show/hide items, list limits, length limits, unknown-field stripping", "Verified (FT-044, FV-002, FV-003, DB-001)"),
    ("Admin Panel", "Restore original content", "Verified (FT-051)"),
    ("Admin Users", "Add admin, remove admin, change password, password rules", "Verified (FT-052…FT-056, FV-009…FV-016)"),
    ("Media", "Image upload: type detected from bytes, 5 MB limit, safe serving headers, path traversal blocked", "Verified (UP-001…UP-017)"),
    ("Reels", "Admin → Reels (title + Facebook/TikTok/Instagram/YouTube link), homepage section, /videos", "Verified (FT-040…FT-044)"),
    ("Videos", "Admin → Videos with YouTube/Vimeo/Facebook embeds, homepage section, /videos page", "Verified (FT-050, FV-008)"),
    ("Blog", "Admin → Blog posts, /blog list (newest first), post pages, homepage section, sitemap", "Verified, except first visit to a new post (BUG-003)"),
    ("Security", "Security headers (nosniff, frame, referrer, permissions, HSTS), XSS escaping, javascript: links blocked, CSRF origin check", "Verified (SE-001…SE-019)"),
    ("Resilience", "Site keeps working on built-in content if the database is down", "Observed (DB rows)"),
]
sheet("Completed Features", ["Module", "Feature", "Verification"], done, [22, 70, 60], "Completed Features", "Only features confirmed by a test or observation are listed as verified.")

# 3. Incomplete features
inc = [
    ("Enquiry delivery", "No email (Resend) or webhook is configured here, so contact and counselling forms cannot send anything. Live status unknown.", "High", "Set RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL) or ENQUIRY_WEBHOOK_URL on the server, then run AP-006."),
    ("Spam protection", "Cloudflare Turnstile is only an integration point; the widget is not rendered in the forms.", "Medium", "Add the widget and keys (see src/lib/enquiry-delivery.ts)."),
    ("Business details", "Phone, WhatsApp, email, address, hours, map, social links and company registration are empty in code (TODO(owner)). They may already be filled in the Admin Panel database — could not check (database down).", "High", "Fill in Admin → Contact details & company."),
    ("Fees", "Verified fee figures per destination are missing (7 TODO(owner) markers).", "Medium", "Add in Admin → Countries."),
    ("FAQs", "Five FAQ answers (total cost, hostel & food, safety, internship, refund policy) are hidden until answered.", "Medium", "Answer them in Admin → Pages → FAQs."),
    ("Team, testimonials", "No team members or student stories in the defaults; sections stay hidden until added.", "Low", "Add real, consented profiles."),
    ("Guidance", "India guidance note needs checking against current NMC rules and a 'last checked' date.", "Medium", "Update Admin → Nepal & India guidance."),
    ("Legal", "Privacy Policy and Terms need legal review (README checklist).", "Medium", "Lawyer review."),
    ("Blog", "Blog text is plain paragraphs + sub-headings only (no bold, links, images inside the article).", "Low", "Optional: add a rich-text field."),
    ("Admin roles", "All admins have full rights, including adding/removing admins. No editor/viewer role and no activity history screen (audit log goes only to server logs).", "Low", "Optional: add roles if more staff will use it."),
    ("Media library", "Uploaded images cannot be listed or deleted from the Admin Panel; unused images stay stored.", "Low", "Optional: add a media page."),
    ("Prisma", "Prisma is installed with an unused 'User' model; the app uses its own SQL. This can confuse future developers ('migrations' do nothing).", "Low", "Remove Prisma or document that it is unused."),
    ("Live deployment", "No deployed URL was available, so the live site was not tested.", "High", "Share the URL and repeat the Blocked tests."),
]
sheet("Incomplete Features", ["Area", "What is missing / not verified", "Priority", "What to do"], inc, [20, 80, 10, 55], "Incomplete Features & Gaps")

# 4. Admin module inventory
inv = [
    ("/admin/login", "Login", "Email, Password, Sign in", "loginAction", "Rate limit 6/15 min; generic error message"),
    ("/admin", "Dashboard", "Cards for every page and shared-content area, last-edited info, storage type", "—", ""),
    ("/admin/pages/home", "Homepage", "Hero & booking box, About, Programmes, Destinations, Quiz, Online band, Why, Trust, Process, Team, Reels, Videos, Blog, FAQs, Verify; Add section, move, hide, delete, Save, Restore original", "saveContentAction, resetContentAction", "Hero is fixed (cannot move/delete)"),
]
for slug, title in [("about", "About Us"), ("admission-process", "Admission Process"), ("destinations", "Study Destinations"), ("programmes", "Programmes"), ("scholarships", "Scholarships"), ("faqs", "FAQs"), ("success-stories", "Success Stories"),
                    ("contact", "Contact"), ("book-counselling", "Book Counselling"), ("privacy-policy", "Privacy Policy"), ("terms-and-conditions", "Terms & Conditions")]:
    inv.append((f"/admin/pages/{slug}", title, "Page header + page sections; add generic sections (Text block, Icon cards, Checklist, Highlighted statement); show/hide; Save; Restore original", "saveContentAction, resetContentAction", ""))
for slug, title, what in [("destinations", "Countries", "List of countries: name, web address, card, page content, programmes offered, images"), ("destination-page", "Country page layout", "Shared headings/blocks for every country page"),
                          ("programmes", "Programme list", "List of programmes and their pages"), ("programme-page", "Programme page layout", "Shared headings/blocks for programme pages"),
                          ("site", "Contact details & company", "Phone, WhatsApp, email, address, hours, map, social links, registration"), ("team", "Team", "Counsellor profiles with photo"),
                          ("steps", "Admission steps", "Up to 12 steps used on Admission Process and homepage"), ("guidance", "Nepal & India guidance", "Rules box and official source links"),
                          ("reels", "Reels", "Title + link (Facebook/TikTok/Instagram/YouTube) + optional cover"), ("videos", "Videos", "Title + YouTube/Vimeo/Facebook link + description"), ("blog", "Blog posts", "Title, web address, date, author, summary, cover, article body")]:
    inv.append((f"/admin/settings/{slug}", title, what + "; Save; Restore original", "saveContentAction, resetContentAction", ""))
inv += [("/admin/users", "Admin users", "List admins; Add admin (name, email, temporary password); Remove; Change my password", "createAdminAction, deleteAdminAction, changePasswordAction", "Cannot remove yourself or the last admin"),
        ("(any image field)", "Image upload", "Upload button in image fields", "POST /api/admin/media", "JPG/PNG/WebP/AVIF/GIF, 5 MB max"),
        ("(sidebar)", "Log out", "Log out button", "logoutAction", "See BUG-002"),
        ("(sidebar)", "View website", "Opens the public site in a new tab", "—", "")]
sheet("Admin Module Inventory", ["Admin address", "Module", "Fields, buttons and actions", "Server action / API", "Notes"], inv, [30, 24, 80, 34, 34], "Admin Module Inventory", "Discovered from src/app/admin, src/cms/schema*.ts and the build's server-action manifest.")

# 5–13 test case sheets
tc_sheet("Functional Testing", ["Functional"], "Functional Testing")
tc_sheet("Form Validation Testing", ["Validation"], "Form Validation Testing")
tc_sheet("Authentication Testing", ["Auth"], "Authentication Testing")
tc_sheet("Security and Injection Testing", ["Security"], "Security and Injection Testing")
tc_sheet("API Testing", ["API"], "API Testing")
tc_sheet("Image File Upload Testing", ["Upload"], "Image / File Upload Testing")
tc_sheet("Database Testing", ["Database"], "Database Testing")
tc_sheet("UI Responsive Testing", ["UI"], "UI / Responsive Testing")
tc_sheet("Performance Testing", ["Performance"], "Performance Testing")

# 14. Bug reports
brow = [[b["id"], b["title"], b["module"], b["sev"], ", ".join(b["tests"]), b["steps"], b["cause"], b["fix"], "Open", RUN] for b in BUGS]
ws, r0 = sheet("Bug Reports", ["Bug ID", "Title", "Module", "Severity", "Found by test(s)", "Steps to reproduce", "Root cause (why it happens)", "Recommended fix", "Status", "Found on"], brow, [10, 40, 20, 10, 16, 45, 55, 55, 10, 12],
               "Bug Reports", "No Critical bugs were found. Environment issues (database down, dev-server crash) are listed in the Final Testing Summary, not here.")
for sv, col in SEV_FILL.items():
    ws.conditional_formatting.add(f"D{r0+1}:D{r0+len(brow)}", CellIsRule(operator="equal", formula=[f'"{sv}"'], fill=PatternFill("solid", start_color=col)))

# 15. Bug fix tracking
ft = []
for b in BUGS:
    if b["id"] == "BUG-003":
        ft.append([b["id"], b["sev"], "Fix attempted (this session)", "Claude (QA run)", "Attempt 1: read params inside <Suspense> (docs pattern). Attempt 2: also call connection() before the lookup. Neither fixed it; both reverted — code is as on GitHub.", "src/app/blog/[slug]/page.tsx", "Open", ""])
    else:
        ft.append([b["id"], b["sev"], "Not started — reported only", "", "", "", "Open", ""])
ws, r0 = sheet("Bug Fix Tracking", ["Bug ID", "Severity", "Fix status", "Assigned to", "What was changed", "Files", "Current status", "Fixed on"], ft, [10, 10, 26, 16, 70, 30, 14, 12], "Bug Fix Tracking",
               "Fixes were not applied without your go-ahead, except one attempt on the blog page I built earlier in this session.")
dv = DataValidation(type="list", formula1='"Open,In progress,Fixed,Verified,Won\'t fix"'); ws.add_data_validation(dv); dv.add(f"G{r0+1}:G{r0+60}")

# 16. Retesting & regression
rt = [
    ["RT-001", "BUG-003", "FT-046", "Retest after attempt 1 (params read inside <Suspense>)", "Saved a new post, opened it for the first time with curl", "Post shown", "Page shell with skeleton; post not in the first response", "Fail", RUN],
    ["RT-002", "BUG-003", "FT-046", "Browser retest after attempt 1", "Opened a never-visited post in Chrome", "Post shown", "'This page has moved on'; a second request returned the post", "Fail", RUN],
    ["RT-003", "BUG-003", "FT-046", "Retest after attempt 2 (connection() added)", "Saved another new post, opened it in Chrome", "Post shown", "'This page has moved on'", "Fail", RUN],
    ["RT-004", "BUG-003", "—", "Revert", "git checkout src/app/blog/[slug]/page.tsx", "Code equals the pushed version", "Clean working tree", "Pass", RUN],
    ["RG-001", "—", "All automated", "Full regression run on the build with fix attempt 1", "Re-ran all 215 automated tests", "No new failures", "200 Pass / 14 Fail / 1 Blocked — same failures as the first run, no new ones", "Pass", RUN],
    ["TS-001", "—", "FT-041", "Test-script correction", "First run looked for the text 'Watch on TikTok' but React inserts <!-- --> inside it", "-", "Check fixed; reels confirmed on the homepage", "Pass", RUN],
    ["TS-002", "—", "AU-005, AU-006, AU-015, AU-016, AU-017, AU-018", "Test-script correction", "First run set forged cookies for the wrong domain, so they were never sent. Re-run with correct cookies", "-", "Forged/expired cookies still rejected (Pass); cookie reuse after logout/password change now correctly detected (Fail → BUG-002)", "Pass", RUN],
    ["TS-003", "—", "AP-007", "Test-script correction", "First run used MBBS + Georgia, but Georgia only offers MD and Dentistry", "-", "Re-run with MBBS + China: valid request accepted", "Pass", RUN],
]
for b in BUGS:
    if b["id"] != "BUG-003":
        rt.append([f"RT-{len(rt)+1:03d}", b["id"], ", ".join(b["tests"]), "Retest after fix", "Re-run the listed tests once fixed", "Test passes", "Not retested — bug not fixed yet", "Not Tested", ""])
ws, r0 = sheet("Retesting and Regression", ["ID", "Bug ID", "Test(s)", "Type", "What was done", "Expected", "Actual", "Status", "Date"], rt, [9, 10, 22, 34, 50, 22, 55, 11, 12], "Retesting and Regression")
for st, col in STATUS_FILL.items():
    ws.conditional_formatting.add(f"H{r0+1}:H{r0+len(rt)}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", start_color=col)))

# 17. Final summary (formulas)
ws = wb.create_sheet("Final Testing Summary")
ws.cell(1, 1, "Final Testing Summary").font = TITLE
ws.cell(2, 1, f"Run {RUN}. Counts are live formulas over the test sheets: change a Status and they update.").font = Font(name=F, size=9, italic=True, color="555555")
hdr = ["Test sheet", "Total", "Pass", "Fail", "Blocked", "Not Tested", "Pass rate"]
for c, h in enumerate(hdr, 1):
    cell = ws.cell(4, c, h); cell.font = HFONT; cell.fill = HFILL; cell.border = BOX
tsheets = ["Functional Testing", "Form Validation Testing", "Authentication Testing", "Security and Injection Testing", "API Testing", "Image File Upload Testing", "Database Testing", "UI Responsive Testing", "Performance Testing"]
for i, sname in enumerate(tsheets, 5):
    rng = f"'{sname}'!$J$5:$J$1000"
    ws.cell(i, 1, sname)
    ws.cell(i, 2, f'=COUNTA({rng})')
    for c, st in zip(range(3, 7), ["Pass", "Fail", "Blocked", "Not Tested"]):
        ws.cell(i, c, f'=COUNTIF({rng},"{st}")')
    ws.cell(i, 7, f"=IF(B{i}=0,0,C{i}/B{i})").number_format = "0.0%"
end = 4 + len(tsheets)
tot = end + 1
ws.cell(tot, 1, "TOTAL").font = BOLD
for c in range(2, 7):
    L = get_column_letter(c); ws.cell(tot, c, f"=SUM({L}5:{L}{end})").font = BOLD
ws.cell(tot, 7, f"=IF(B{tot}=0,0,C{tot}/B{tot})").number_format = "0.0%"
for row in ws.iter_rows(min_row=5, max_row=tot, max_col=7):
    for cell in row:
        cell.border = BOX
        if cell.font != BOLD: cell.font = BODY if cell.row != tot else BOLD
r = tot + 2
ws.cell(r, 1, "Bugs by severity").font = BOLD
for j, sv in enumerate(["Critical", "High", "Medium", "Low"]):
    ws.cell(r + 1 + j, 1, sv).font = BODY
    ws.cell(r + 1 + j, 2, f"=COUNTIF('Bug Reports'!$D$5:$D$200,\"{sv}\")").font = BODY
ws.cell(r + 5, 1, "Open bugs").font = BOLD
ws.cell(r + 5, 2, "=COUNTIF('Bug Reports'!$I$5:$I$200,\"Open\")").font = BOLD
r += 7
ws.cell(r, 1, "Must fix before going live").font = BOLD
musts = [
    "1. Connect enquiry delivery (email or webhook) and test it end to end — otherwise no enquiry reaches the office (Incomplete Features; AP-006 Blocked).",
    "2. BUG-001 (High): login brute-force limit bypass via X-Forwarded-For.",
    "3. Fill in real contact details, fees and FAQ answers in the Admin Panel (or confirm they are already in the database).",
    "4. Set SESSION_SECRET (32+ random characters) on the server and confirm the admin cookie is Secure on HTTPS (AU row Blocked).",
    "5. Strongly recommended: BUG-002 (sessions not revoked), BUG-004 (Content-Security-Policy), BUG-005 (silent blanking of invalid links), BUG-003 (new blog post first visit).",
]
for k, t in enumerate(musts):
    ws.cell(r + 1 + k, 1, t).font = BODY
r += len(musts) + 2
ws.cell(r, 1, "Environment issues found (not code bugs)").font = BOLD
envs = ["• Local PostgreSQL in .env (127.0.0.1:5433) refused connections — database tests Blocked; the site fell back to built-in content.",
        "• The developer's own 'next dev' server on port 3000 logged 'Jest worker encountered 2 child process exceptions' and returned 500 for unknown pages. Restarting it should clear this.",
        "• No live URL, inbox or webhook was available."]
for k, t in enumerate(envs):
    ws.cell(r + 1 + k, 1, t).font = BODY
ws.column_dimensions["A"].width = 34
for c in "BCDEFG": ws.column_dimensions[c].width = 12

# 18. Tester guide (sheet version)
GUIDE = json.load(open("guide.json", encoding="utf8"))
rows = [[s["n"], s["where"], s["do"], s["data"], s["verify"], s["bug"]] for s in GUIDE["steps"]]
ws, _ = sheet("New Tester Guide", ["Step", "Where", "What to do / click", "Data to enter", "What you should see", "It's a bug if…"], rows, [6, 26, 55, 30, 45, 40], "Guide for a New Tester",
              "Use the LIVE website. Never use real student data — always write TEST in names. Record every result in the test sheets (Status, Actual Result, Remarks + screenshot file name).")

wb.save(OUT)
json.dump({"bugs": BUGS, "results": R}, open("final.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("saved", OUT, len(R), "test rows")
