"""Manual test plan workbook (17 sheets from the brief + Test Data + Tester Guide) and the Admin/User testing guide PDF.
No tests are executed here: every case starts as 'Not Tested'."""
import json, sys
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.formatting.rule import CellIsRule
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
from plan_cases import ADMIN, USER

XLSX, PDF, PREV = sys.argv[1], sys.argv[2], sys.argv[3]
F = "Arial"
HFILL = PatternFill("solid", start_color="1F3A5F"); HFONT = Font(name=F, bold=True, color="FFFFFF", size=10)
BODY = Font(name=F, size=10); BOLD = Font(name=F, size=10, bold=True); TITLE = Font(name=F, size=14, bold=True, color="1F3A5F")
NOTE = Font(name=F, size=9, italic=True, color="555555")
INPUT = PatternFill("solid", start_color="FFF9DB")
THIN = Side(style="thin", color="C9D3E0"); BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
STATUS_FILL = {"Pass": "D9F2E1", "Fail": "F8D7DA", "Blocked": "FFF0C2", "Not Tested": "EEF1F5"}
SEV_FILL = {"Critical": "E06666", "High": "F4B183", "Medium": "FFE699", "Low": "DDEBF7"}

# ───────────── Known open bugs (from the 22 Nov 2026 run) — to retest after fixing ─────────────
KNOWN = [
    ("BUG-001", "Admin", "Admin Login", "High", "Login lockout (6 wrong passwords) can be bypassed by sending a different X-Forwarded-For header", "Developer: 6 wrong logins, then the 7th with header X-Forwarded-For: 10.0.0.99", "Still locked out", "Signed in", "Count failures per email too; trust only your proxy's client IP; store counts in the database."),
    ("BUG-002", "Admin", "Sessions / Logout", "Medium", "Logout or password change doesn't end other sessions (a copied cookie keeps working for 8 h)", "Sign in, copy cookie cen_admin, log out, restore cookie, open /admin", "Login page", "Dashboard opens", "Add a session version per admin; bump it on logout / password change."),
    ("BUG-005", "Admin", "All editors", "Medium", "Invalid links/dates/emails are silently blanked; the admin sees 'Saved' and the item disappears", "Reels > add link 'tiktok.com/x' (no https) > Save & publish", "Warning next to the field", "'Saved'; reel missing on site", "Return rejected fields from the save and show them; validate in the editor."),
    ("BUG-006", "Admin", "Save & publish", "Low", "Saving more than ~1 MB at once gives a server error instead of the 'too much content' message", "Save a very large blog list (1.1 MB)", "Friendly message", "HTTP 500 / generic error", "Set serverActions.bodySizeLimit to '2mb' or lower the app's check."),
    ("BUG-003", "User", "Blog post page", "Medium", "A newly added blog post shows 'This page has moved on' on its first visit; refresh shows it", "Add a post, open /blog/<address> for the first time", "Post shows", "'This page has moved on'", "Warm the URL after saving or render the post page dynamically; check Next 16.4 ISR guide."),
    ("BUG-004", "User", "Whole site", "Medium", "No Content-Security-Policy header", "curl -I the homepage", "CSP header present", "Missing", "Add a CSP (Report-Only first) allowing YouTube/Vimeo/Facebook/Google Maps frames."),
    ("BUG-007", "User", "Contact / counselling forms", "Medium", "Form rate limit bypassed by changing X-Forwarded-For", "Developer: 7 submissions each with a different X-Forwarded-For", "Refused after 5", "All accepted", "Trust only proxy IP; enable Cloudflare Turnstile."),
    ("BUG-008", "User", "Enquiry API", "Low", "Enquiry API reads very large bodies (8 MB)", "Developer: POST 8 MB JSON to /api/enquiry", "413 refused", "Read fully", "Check Content-Length (~32 KB) before parsing; cap in proxy."),
    ("BUG-009", "User", "Unknown pages", "Low", "First visit to an unknown country/programme/blog address returns HTTP 200 (page shows 'not found', noindex)", "Open /programs/anything once", "HTTP 404", "HTTP 200 first time", "Optional: return 404 early for unknown slugs."),
    ("BUG-010", "User", "Performance", "Low", "Homepage loads ~820 KB JavaScript (uncompressed)", "Sum /_next/static/*.js on homepage", "< 600 KB", "820 KB", "Bundle analyser; lazy-load quiz/carousels."),
]

# ───────────── Developer-level API cases (Postman / curl) ─────────────
API = [
    ("Admin › Image upload API", "POST /api/admin/media", "Upload without signing in", "1. Postman: POST <site>/api/admin/media, Body form-data, key 'file' = any JPG, no cookie.", "photo.jpg", "401 {\"error\":\"Please sign in again.\"}"),
    ("Admin › Image upload API", "POST /api/admin/media", "Upload with an admin session", "1. Copy cookie 'cen_admin' from the browser after signing in.\n2. Add header Cookie: cen_admin=<value>.\n3. POST form-data file=photo.jpg.", "photo.jpg", "200 {\"src\":\"/media/<24 hex>.jpg\"}"),
    ("Admin › Image upload API", "POST /api/admin/media", "Missing file field", "1. Same as above but form-data key 'image' instead of 'file'.", "-", "400 {\"error\":\"Choose an image to upload.\"}"),
    ("Admin › Image upload API", "POST /api/admin/media", "Wrong type / too big", "1. Send fake.jpg (really text) and a 6 MB image.", "fake.jpg, 6MB.jpg", "415 for fake.jpg; 413 for 6 MB."),
    ("Admin › Media serving", "GET /media/<id>", "Read an uploaded image", "1. GET the src returned by the upload.", "/media/<id>.jpg", "200, Content-Type image/jpeg, X-Content-Type-Options: nosniff, Content-Security-Policy: default-src 'none'..."),
    ("Admin › Media serving", "GET /media/<id>", "Path tricks", "1. GET /media/..%2f..%2fadmins.json and /media/abc.png", "-", "404 for both, no file contents."),
    ("User › Enquiry API", "POST /api/enquiry", "Valid contact message", "1. POST JSON, header Content-Type: application/json.", '{"type":"contact","fullName":"TEST Ram","phone":"+977 9800000000","email":"test+1@yourcompany.com","consent":true,"subject":"TEST","message":"This is a test message"}', "200 {\"ok\":true} and the email/webhook arrives. (503 not_configured if delivery is not set up.)"),
    ("User › Enquiry API", "POST /api/enquiry", "Valid counselling request", "1. POST JSON.", '{"type":"counselling","fullName":"TEST Ram","phone":"+977 9800000000","email":"test+1@yourcompany.com","consent":true,"location":"Kathmandu","qualification":"Completed Grade 12 / A-levels (or equivalent)","programme":"MBBS / General Medicine","country":"China","intake":"Next available intake","mode":"Online (video)"}', "200 {\"ok\":true}."),
    ("User › Enquiry API", "POST /api/enquiry", "Validation errors", "1. POST the contact JSON with email 'abc' and consent false.", '{"type":"contact", ... "email":"abc","consent":false}', "422 validation_failed with issues for email and consent."),
    ("User › Enquiry API", "POST /api/enquiry", "Programme not offered in that country", "1. Counselling JSON with programme Nursing, country Russia.", '"programme":"Nursing","country":"Russia"', "422 'This programme isn't offered in the selected country'."),
    ("User › Enquiry API", "POST /api/enquiry", "Wrong content type / broken JSON / GET", "1. Send form-encoded body.\n2. Send '{bad'.\n3. Send GET.", "-", "415, 400 invalid_json, 405."),
    ("User › Enquiry API", "POST /api/enquiry", "Honeypot field filled", "1. Valid contact JSON plus \"website\":\"http://spam.example\".", "-", "Refused (422/400); nothing delivered."),
    ("User › Enquiry API", "POST /api/enquiry", "Rate limit", "1. Send the valid contact JSON 6 times within 10 minutes from one machine.", "6 x", "6th returns 429 rate_limited."),
    ("User › Enquiry API", "OPTIONS /api/enquiry", "CORS", "1. OPTIONS with header Origin: https://evil.example.", "-", "No Access-Control-Allow-Origin header."),
    ("Admin › Server actions", "Save & publish", "Save from another website (CSRF)", "1. Developer: replay the 'Save & publish' request with Origin: https://evil.example.", "-", "Rejected (no 'ok':true)."),
    ("Whole site", "Headers", "Security headers", "1. curl -I <site>/", "-", "X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Strict-Transport-Security present; no X-Powered-By. (CSP missing = BUG-004)"),
]

DB = [
    ("Admin › All editors", "Persistence", "Saved content survives a server restart", "Developer restarts the app (or redeploys)", "1. Save a TEST change.\n2. Ask the developer to restart the app.\n3. View the page.", "-", "Change still there."),
    ("Admin › All editors", "Persistence", "Saved content visible to another admin", "Two admin accounts", "1. Admin A saves a TEST change.\n2. Admin B opens the same editor.", "-", "Admin B sees A's change."),
    ("Admin › All editors", "Concurrency", "Two admins edit the same page", "Two admins, same page open", "1. Both open Shared content > Reels.\n2. A adds 'TEST A' and saves.\n3. B (without reloading) adds 'TEST B' and saves.\n4. Reload.", "TEST A / TEST B", "Ideally a warning. Today the last save wins: 'TEST A' is lost. Record what happens."),
    ("Admin › Blog posts", "Duplicates", "Duplicate web addresses are made unique", "Signed in", "1. Two posts with the same title, empty web address. Save. Reload.", "Same title x2", "Addresses end with '' and '-2'."),
    ("Admin › Countries", "Duplicates", "Duplicate country web address", "Signed in", "1. Two countries with address 'test-land'. Save.", "-", "Second becomes 'test-land-2'."),
    ("Admin › Admin users", "Duplicates", "Duplicate admin email (any capitals)", "Signed in", "1. Add admin with an existing email in CAPITALS.", "QA.TESTER@YOURCOMPANY.COM", "'An admin with this email already exists.'"),
    ("Admin › Countries / Programmes", "Relationships", "Programme removed that countries still offer", "Staging only", "1. Hide a programme that a country offers. Save.\n2. View that country page and the counselling form.", "-", "No broken links/empty rows; the programme is not offered anywhere."),
    ("Admin › Image upload", "Integrity", "Removed image is not broken elsewhere", "Same image used in 2 places", "1. Remove the image in one place. Save.\n2. Check the other place.", "-", "The other place still shows it."),
    ("Whole site", "Database down", "Site keeps working if the database is down", "Staging; developer stops the database", "1. Open several public pages.\n2. Try 'Save & publish' in admin.", "-", "Public pages show built-in content; admin shows 'The content database could not be reached...'. No blank pages."),
    ("Admin › Restore original", "Integrity", "'Restore original' only resets the chosen page (STAGING)", "Staging", "1. Edit About and FAQs.\n2. Restore original on About only.", "-", "About resets; FAQs keeps its edits."),
]

GUIDE = json.load(open("guide.json", encoding="utf8"))

# ───────────── Sort every case into the brief's 17-sheet structure ─────────────
SHEETS = {k: [] for k in ["Functional Testing", "Form Validation Testing", "Authentication Testing", "Security and Injection Testing", "API Testing", "Image-File Upload Testing", "Database Testing", "UI-Responsive Testing", "Performance Testing"]}
PFX = {"Functional Testing": "FT", "Form Validation Testing": "FV", "Authentication Testing": "AU", "Security and Injection Testing": "SE", "API Testing": "AP", "Image-File Upload Testing": "UP", "Database Testing": "DB", "UI-Responsive Testing": "UI", "Performance Testing": "PF"}
AUTH_TYPES = {"Login", "Logout", "Session"}


def target(group, typ):
    if group == "Admin - Image Upload": return "Image-File Upload Testing"
    if group == "Admin - Login & Users" or typ in AUTH_TYPES: return "Authentication Testing"
    if typ == "Security": return "Security and Injection Testing"
    if typ == "Validation" or typ == "Error": return "Form Validation Testing"
    if typ in ("Responsive", "Browser", "Accessibility"): return "UI-Responsive Testing"
    if typ == "Performance": return "Performance Testing"
    return "Functional Testing"


def mod_name(side, group, scen):
    area = {"Admin - Login & Users": "Login & Admin users", "Admin - Page Editor": "Pages editor", "Admin - Shared Content": "Shared content", "Admin - Reels Videos Blog": "Reels / Videos / Blog",
            "Admin - Image Upload": "Image upload", "User - Public Pages": "Public pages", "User - Forms": "Contact & counselling forms", "User - Responsive & Browsers": "Layout & browsers"}[group]
    return f"{side} › {area}"


KNOWN_IN = {"BUG-002": "Sign out", "BUG-005": "Link without https|Button link must be|http:// link", "BUG-003": "Post page shows everything", "BUG-009": "Unknown address"}
for side, groups in (("Admin", ADMIN), ("User", USER)):
    for group, cases in groups.items():
        for typ, scen, pre, steps, data, exp, rem in cases:
            t = target(group, typ)
            feature = scen.split(" (")[0]
            bug = next((b for b, pat in KNOWN_IN.items() if any(p in scen for p in pat.split("|"))), "")
            SHEETS[t].append(dict(module=mod_name(side, group, scen), feature=feature, cat=typ, scen=scen, steps=(f"Before: {pre}\n" if pre and pre != "-" else "") + steps, data=data, exp=exp, bug=bug, rem=rem))
for m, feat, scen, steps, data, exp in API:
    SHEETS["API Testing"].append(dict(module=m, feature=feat, cat="API", scen=scen, steps="Before: Postman or curl (developer)\n" + steps, data=data, exp=exp, bug="BUG-007" if "Rate limit" in scen else "", rem="Developer test. On the live site use TEST data only."))
for m, cat, scen, pre, steps, data, exp in DB:
    SHEETS["Database Testing"].append(dict(module=m, feature=scen, cat=cat, scen=scen, steps=f"Before: {pre}\n{steps}", data=data, exp=exp, bug="", rem=""))
SHEETS["Security and Injection Testing"] += [
    dict(module="Admin › All editors", feature="Admin page by direct address", cat="Access control", scen="Each admin editor needs sign-in", steps="Before: signed out / private window\n1. Open /admin/settings/blog, /admin/settings/site, /admin/pages/home, /admin/users directly.", data="-", exp="Every address goes to the login page.", bug="", rem=""),
    dict(module="Admin › All editors", feature="Unknown editor address", cat="Access control", scen="Made-up admin addresses", steps="Before: signed in\n1. Open /admin/settings/passwords and /admin/pages/../users.", data="-", exp="'Not found' page, no error details.", bug="", rem=""),
    dict(module="User › Contact & counselling forms", feature="SQL text in forms", cat="SQL injection", scen="SQL text is treated as normal text", steps="1. Put the SQL text in the name and message, submit.", data="Name: TEST'); DROP TABLE cms_content;--", exp="Validated or sent as plain text; no error page; site keeps working.", bug="", rem=""),
    dict(module="User › Public pages", feature="Script in the address", cat="XSS", scen="Script in a URL is not run", steps="1. Open /book-counselling?country=<script>alert(1)</script>", data="-", exp="No pop-up; the form ignores the unknown country.", bug="", rem=""),
    dict(module="Whole site", feature="HTTPS", cat="Transport", scen="Site always uses HTTPS", steps="1. Open http://<site> (without s).", data="-", exp="Redirects to https://; padlock shown.", bug="", rem=""),
    dict(module="Whole site", feature="Error details", cat="Information leak", scen="Errors don't show code or server details", steps="1. Trigger any error you find (bad address, broken form).", data="-", exp="Friendly message only; no stack traces, file paths or database names.", bug="", rem=""),
]
SHEETS["Performance Testing"] += [
    dict(module="Admin › All editors", feature="Save speed", cat="Performance", scen="'Save & publish' finishes quickly", steps="1. Save a large page (Homepage) and time it.", data="-", exp="Under 3 seconds; change visible on the site within 10 seconds.", bug="", rem=""),
    dict(module="User › Public pages", feature="Image weight", cat="Performance", scen="Uploaded photos are optimised", steps="1. DevTools > Network > Img on the homepage.", data="-", exp="Images served as AVIF/WebP, mostly under 300 KB each.", bug="", rem=""),
    dict(module="User › Public pages", feature="JavaScript size", cat="Performance", scen="Homepage JavaScript is not too heavy", steps="1. DevTools > Network > JS, reload homepage, read the transferred total.", data="-", exp="Under ~300 KB transferred (compressed).", bug="BUG-010", rem=""),
]

# ───────────── Workbook ─────────────
wb = Workbook(); wb.remove(wb.active)


def sheet(name, headers, rows, widths, title, note=None, freeze_col=2):
    ws = wb.create_sheet(name)
    ws.cell(1, 1, title).font = TITLE
    if note: ws.cell(2, 1, note).font = NOTE
    r0 = 4
    for c, h in enumerate(headers, 1):
        x = ws.cell(r0, c, h); x.font = HFONT; x.fill = HFILL; x.alignment = Alignment(wrap_text=True, vertical="center"); x.border = BOX
    for i, row in enumerate(rows, r0 + 1):
        for c, v in enumerate(row, 1):
            x = ws.cell(i, c, v); x.font = BODY; x.alignment = WRAP; x.border = BOX
    for c, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(c)].width = w
    ws.freeze_panes = ws.cell(r0 + 1, freeze_col)
    if rows: ws.auto_filter.ref = f"A{r0}:{get_column_letter(len(headers))}{r0 + len(rows)}"
    return ws, r0


# 1–4 copied from the analysis workbook (project understanding doesn't change)
prev = load_workbook(PREV)
for name in ["Project Overview", "Completed Features", "Incomplete Features", "Admin Module Inventory"]:
    src = prev[name]
    rows = [[c.value for c in row] for row in src.iter_rows(min_row=5)]
    headers = [c.value for c in src[4]]
    widths = [src.column_dimensions[get_column_letter(i)].width or 20 for i in range(1, len(headers) + 1)]
    note = {"Completed Features": "From the automated analysis run on 22 Nov 2026 (see Cerebellum_QA_Test_Workbook.xlsx). Re-verify on the live site with this plan."}.get(name, src.cell(2, 1).value)
    sheet(name, headers, [r for r in rows if any(v is not None for v in r)], widths, src.cell(1, 1).value, note, 1)

HEAD = ["Test Case ID", "Module", "Feature", "Testing Category", "Test Scenario", "Steps to Perform", "Test Data", "Expected Result", "Actual Result", "Status", "Bug ID", "Severity", "Recommended Fix", "Retest Status", "Remarks"]
W = [11, 24, 24, 15, 36, 52, 30, 40, 30, 12, 10, 10, 26, 14, 34]
counts = {}
for name, cases in SHEETS.items():
    cases.sort(key=lambda c: (0 if c["module"].startswith("Admin") else 1 if c["module"].startswith("User") else 2))
    rows = []
    for i, c in enumerate(cases, 1):
        rem = c["rem"]
        if c["bug"]: rem = (rem + " " if rem else "") + f"Known open bug {c['bug']} - this case is its retest."
        rows.append([f"{PFX[name]}-{i:03d}", c["module"], c["feature"], c["cat"], c["scen"], c["steps"], c["data"], c["exp"], "", "Not Tested", c["bug"], "", "", "", rem])
    counts[name] = len(rows)
    ws, r0 = sheet(name, HEAD, rows, W, name.replace("-", " / ", 1) if name.startswith(("Image", "UI")) else name,
                   "Fill in the yellow columns: Actual Result, Status, Bug ID, Severity, Recommended Fix (if known), Retest Status, Remarks (add the screenshot file name). Module starts with 'Admin ›' or 'User ›'.")
    last = r0 + len(rows)
    for col in "IJKLMNO":
        for r in range(r0 + 1, last + 1): ws[f"{col}{r}"].fill = INPUT
    dv = DataValidation(type="list", formula1='"Not Tested,Pass,Fail,Blocked"'); ws.add_data_validation(dv); dv.add(f"J{r0+1}:J{last+100}")
    dv2 = DataValidation(type="list", formula1='"Critical,High,Medium,Low"', allow_blank=True); ws.add_data_validation(dv2); dv2.add(f"L{r0+1}:L{last+100}")
    dv3 = DataValidation(type="list", formula1='"Not Retested,Pass,Fail"', allow_blank=True); ws.add_data_validation(dv3); dv3.add(f"N{r0+1}:N{last+100}")
    for st, col in STATUS_FILL.items():
        ws.conditional_formatting.add(f"J{r0+1}:J{last+100}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", start_color=col)))
    for sv, col in SEV_FILL.items():
        ws.conditional_formatting.add(f"L{r0+1}:L{last+100}", CellIsRule(operator="equal", formula=[f'"{sv}"'], fill=PatternFill("solid", start_color=col)))

# 14 Bug Reports — split by side, known bugs pre-filled + an example of how to write one
BH = ["Bug ID", "Side", "Module", "Severity", "Title", "Steps to reproduce", "Expected", "Actual", "Test Case ID", "Screenshot / evidence", "Reported by", "Date", "Status", "Recommended fix"]
brow = [[b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], "", "", "QA run 22 Nov 2026", "2026-11-22", "Open", b[8]] for b in KNOWN]
brow.append(["BUG-011", "Admin", "Reels (EXAMPLE - replace)", "Medium", "Reel cover image not shown on homepage after upload",
             "1. Admin > Reels > TEST reel > Upload image (cover.jpg, 1 MB)\n2. Save & publish\n3. Open homepage, refresh", "Reel card shows the cover photo", "Card shows only the blue background", "UP-001", "UP-001_reel-cover-missing.png", "Your name", "2026-11-25", "New", ""])
ws, r0 = sheet("Bug Reports", BH, brow, [10, 8, 22, 10, 40, 42, 24, 24, 12, 24, 16, 11, 10, 40], "Bug Reports (Admin side and User side)",
               "Rows BUG-001…BUG-010 are open bugs from the 22 Nov analysis. BUG-011 is an EXAMPLE of a well-written report - overwrite it with your first real bug. Filter column B for Admin or User.")
dv = DataValidation(type="list", formula1='"New,Open,In progress,Fixed,Verified,Closed,Won\'t fix"'); ws.add_data_validation(dv); dv.add(f"M{r0+1}:M{r0+200}")
dv = DataValidation(type="list", formula1='"Admin,User"'); ws.add_data_validation(dv); dv.add(f"B{r0+1}:B{r0+200}")
for sv, col in SEV_FILL.items():
    ws.conditional_formatting.add(f"D{r0+1}:D{r0+200}", CellIsRule(operator="equal", formula=[f'"{sv}"'], fill=PatternFill("solid", start_color=col)))
for c in range(1, len(BH) + 1): ws.cell(r0 + len(brow), c).font = Font(name=F, size=10, italic=True, color="7F7F7F")

# 15 Bug Fix Tracking
ft = [[b[0], b[1], b[3], b[4], "", "", "", "Open", "", ""] for b in KNOWN]
ws, r0 = sheet("Bug Fix Tracking", ["Bug ID", "Side", "Severity", "Title", "Assigned to", "Root cause found", "Fix made (what changed)", "Status", "Fixed on", "Fixed in version / commit"], ft, [10, 8, 10, 46, 16, 36, 40, 12, 12, 20],
               "Bug Fix Tracking", "Developers fill this in. Add a row for every new bug from 'Bug Reports'.")
dv = DataValidation(type="list", formula1='"Open,In progress,Fixed,Verified,Won\'t fix"'); ws.add_data_validation(dv); dv.add(f"H{r0+1}:H{r0+200}")

# 16 Retesting and Regression
rt = [[f"RT-{i:03d}", b[0], b[1], "Retest after fix", b[5], b[6], "", "Not Tested", "", ""] for i, b in enumerate(KNOWN, 1)]
reg = ["Admin: sign in, sign out, wrong password", "Admin: add / edit / hide / delete a reel, video and blog post", "Admin: upload JPG ok, PDF refused, 6 MB refused", "Admin: edit a heading on About and Save & publish",
       "User: open every page in the top menu and footer", "User: contact + counselling form validation (empty and bad data)", "User: send one TEST enquiry and receive it", "User: homepage on a phone, no sideways scrolling"]
rt += [[f"RG-{i:03d}", "-", "Admin" if s.startswith("Admin") else "User", "Regression (after every release)", s, "Works as before", "", "Not Tested", "", ""] for i, s in enumerate(reg, 1)]
ws, r0 = sheet("Retesting and Regression", ["ID", "Bug ID", "Side", "Type", "What to do", "Expected", "Actual", "Status", "Tested by", "Date"], rt, [9, 10, 8, 24, 52, 26, 30, 12, 14, 12], "Retesting and Regression",
               "When a bug is marked Fixed: retest it here, then run the RG checklist to make sure nothing else broke.")
dv = DataValidation(type="list", formula1='"Not Tested,Pass,Fail,Blocked"'); ws.add_data_validation(dv); dv.add(f"H{r0+1}:H{r0+200}")
for st, col in STATUS_FILL.items():
    ws.conditional_formatting.add(f"H{r0+1}:H{r0+200}", CellIsRule(operator="equal", formula=[f'"{st}"'], fill=PatternFill("solid", start_color=col)))

# 17 Final Testing Summary (live formulas, split Admin / User)
ws = wb.create_sheet("Final Testing Summary")
ws.cell(1, 1, "Final Testing Summary").font = TITLE
ws.cell(2, 1, "All numbers are formulas: they update as testers change the Status column. Pending = Not Tested.").font = NOTE
hdr = ["Sheet", "Side", "Total", "Pass", "Fail", "Blocked", "Pending (Not Tested)", "% done"]
for c, h in enumerate(hdr, 1):
    x = ws.cell(4, c, h); x.font = HFONT; x.fill = HFILL; x.border = BOX
r = 5
for name in SHEETS:
    for side in ["Admin", "User", "Other"]:
        rngM, rngS = f"'{name}'!$B$5:$B$2000", f"'{name}'!$J$5:$J$2000"
        crit = f'"{side}*"' if side != "Other" else None
        ws.cell(r, 1, name); ws.cell(r, 2, side)
        if crit:
            ws.cell(r, 3, f"=COUNTIFS({rngM},{crit})")
            for c, st in zip(range(4, 8), ["Pass", "Fail", "Blocked", "Not Tested"]):
                ws.cell(r, c, f'=COUNTIFS({rngM},{crit},{rngS},"{st}")')
        else:
            ws.cell(r, 3, f'=COUNTA({rngS})-COUNTIFS({rngM},"Admin*")-COUNTIFS({rngM},"User*")')
            for c, st in zip(range(4, 8), ["Pass", "Fail", "Blocked", "Not Tested"]):
                ws.cell(r, c, f'=COUNTIF({rngS},"{st}")-COUNTIFS({rngM},"Admin*",{rngS},"{st}")-COUNTIFS({rngM},"User*",{rngS},"{st}")')
        ws.cell(r, 8, f"=IF(C{r}=0,0,(D{r}+E{r}+F{r})/C{r})").number_format = "0%"
        r += 1
end = r - 1
for label, crit in [("TOTAL ADMIN SIDE", "Admin"), ("TOTAL USER SIDE", "User"), ("TOTAL ALL", None)]:
    ws.cell(r, 1, label).font = BOLD
    for c in range(3, 8):
        L = get_column_letter(c)
        ws.cell(r, c, f'=SUMIF($B$5:$B${end},"{crit}",{L}5:{L}{end})' if crit else f"=SUM({L}5:{L}{end})").font = BOLD
    ws.cell(r, 8, f"=IF(C{r}=0,0,(D{r}+E{r}+F{r})/C{r})").number_format = "0%"
    r += 1
for row in ws.iter_rows(min_row=5, max_row=r - 1, max_col=8):
    for x in row:
        x.border = BOX
        if not x.font.bold: x.font = BODY
r += 1
ws.cell(r, 1, "Open bugs by severity").font = BOLD
for j, sv in enumerate(["Critical", "High", "Medium", "Low"]):
    ws.cell(r + 1 + j, 1, sv).font = BODY
    ws.cell(r + 1 + j, 2, f"=COUNTIFS('Bug Reports'!$D$5:$D$500,\"{sv}\",'Bug Reports'!$M$5:$M$500,\"<>Closed\",'Bug Reports'!$M$5:$M$500,\"<>Verified\",'Bug Reports'!$C$5:$C$500,\"<>*EXAMPLE*\")").font = BODY
r += 6
ws.cell(r, 1, "Must be fixed / confirmed before going live").font = BOLD
for k, t in enumerate(["Enquiry delivery: TEST messages from both forms must arrive in the office inbox (User › forms).", "BUG-001 login lockout bypass (High).", "Real contact details, fees and FAQ answers filled in (Admin › Shared content).",
                       "Admin cookie marked Secure on HTTPS; SESSION_SECRET set on the server.", "No Critical or High bug left Open in 'Bug Reports'."], 1):
    ws.cell(r + k, 1, f"{k}. {t}").font = BODY
for c, w in zip("ABCDEFGH", [32, 10, 10, 9, 9, 10, 18, 9]): ws.column_dimensions[c].width = w

# Extra: Test Data and Tester Guide
TD = [
    ("Admin test account", "qa.tester@yourcompany.com / password from the owner", "Ask the owner to create it in Admin users. Never use the owner's own account."),
    ("TEST naming", "Start every title with 'TEST' (e.g. 'TEST reel - campus tour')", "So test items are easy to find and delete."),
    ("Valid email", "test+1@yourcompany.com, test+2@yourcompany.com", "Use your company inbox with +numbers."),
    ("Invalid emails", "ram@   |   ram.gmail.com   |   @gmail.com", ""),
    ("Valid phones", "+977 9800000000   |   +91 98765 43210", ""),
    ("Invalid phones", "hello   |   12345   |   +977-abc", ""),
    ("Valid links", "/book-counselling   |   https://example.com", "Internal pages start with /, outside sites with https://"),
    ("Invalid links", "www.google.com   |   google.com   |   javascript:alert(1)   |   http://example.com (for https-only fields)", ""),
    ("Reel links", "TikTok: https://www.tiktok.com/@<page>/video/<number>\nFacebook: https://www.facebook.com/reel/<number>\nInstagram: https://www.instagram.com/reel/<code>/", "Copy real public reels with the platform's Share > Copy link."),
    ("Video links", "https://www.youtube.com/watch?v=<id>   |   https://youtu.be/<id>   |   https://www.youtube.com/shorts/<id>   |   https://vimeo.com/<number>", ""),
    ("Dates", "Valid: 2026-11-25   Invalid: 25/11/2026, 2026-13-45", "Format is always YYYY-MM-DD."),
    ("Long text", "Paste 'Lorem ipsum' text 10 times (about 2,000 characters)", "For length-limit tests."),
    ("Code text", "<script>alert(1)</script>   |   <b>bold?</b>   |   '); DROP TABLE cms_content;--", "Must always appear as plain text."),
    ("Image files to prepare", "photo.jpg (1-3 MB), big-photo.jpg (4.8 MB), huge-photo.jpg (6+ MB), logo.png (transparent), image.webp, small.gif, icon.svg, document.pdf, fake.jpg (a renamed PDF), file.docx, clip.mp4", "Put them in one folder before you start."),
    ("Screenshot naming", "<TestCaseID>_<short-name>.png  e.g. FT-012_reel-missing.png", "Write the file name in Remarks / Bug Reports."),
]
sheet("Test Data", ["What", "Example values", "Notes"], TD, [24, 80, 50], "Test Data to use", "Copy these values into the forms. Prepare the image files first.", 1)
steps = [[s["n"], s["where"], s["do"], s["data"], s["verify"], s["bug"]] for s in GUIDE["steps"]]
ws, r0 = sheet("Tester Guide", ["Step", "Where", "What to do / click", "Data to enter", "What you should see", "It's a bug if..."], steps, [6, 26, 55, 30, 45, 40], "Quick guide for a new tester",
               "Start here. Full instructions with examples for every module are in the PDF 'Cerebellum_Admin_and_User_Testing_Guide.pdf'.", 1)
r = r0 + len(steps) + 2
for title, items in [("Before you start", GUIDE["before"]), ("How to recognise a bug", GUIDE["bug"]), ("How to record results and evidence", GUIDE["record"])]:
    ws.cell(r, 1, title).font = BOLD; r += 1
    for it in items: ws.cell(r, 2, "• " + it).font = BODY; ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6); ws.cell(r, 2).alignment = WRAP; ws.row_dimensions[r].height = 28; r += 1
    r += 1

order = ["Tester Guide", "Test Data", "Project Overview", "Completed Features", "Incomplete Features", "Admin Module Inventory", *SHEETS.keys(), "Bug Reports", "Bug Fix Tracking", "Retesting and Regression", "Final Testing Summary"]
wb._sheets = [wb[n] for n in order]
wb.save(XLSX)
print("xlsx", XLSX, counts, "total", sum(counts.values()))
json.dump({"sheets": SHEETS, "known": KNOWN, "counts": counts}, open("plan.json", "w", encoding="utf8"), ensure_ascii=False)
