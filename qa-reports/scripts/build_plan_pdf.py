import json, sys
from collections import OrderedDict
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.fonts import addMapping
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import CondPageBreak, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = sys.argv[1]
pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf")); pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))
addMapping("Arial", 0, 0, "Arial"); addMapping("Arial", 1, 0, "Arial-Bold")
D = json.load(open("plan.json", encoding="utf8")); G = json.load(open("guide.json", encoding="utf8"))
PFX = {"Functional Testing": "FT", "Form Validation Testing": "FV", "Authentication Testing": "AU", "Security and Injection Testing": "SE", "API Testing": "AP", "Image-File Upload Testing": "UP", "Database Testing": "DB", "UI-Responsive Testing": "UI", "Performance Testing": "PF"}

NAVY = colors.HexColor("#1F3A5F"); ORANGE = colors.HexColor("#C55A11")
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", fontName="Arial-Bold", fontSize=20, textColor=NAVY, leading=24, spaceAfter=4)
PART = ParagraphStyle("PART", fontName="Arial-Bold", fontSize=17, textColor=ORANGE, leading=21, spaceAfter=6)
H2 = ParagraphStyle("H2", fontName="Arial-Bold", fontSize=13, textColor=NAVY, spaceBefore=10, spaceAfter=4, leading=16)
B = ParagraphStyle("B", fontName="Arial", fontSize=9.5, leading=13)
S = ParagraphStyle("S", fontName="Arial", fontSize=7.8, leading=10)
SB = ParagraphStyle("SB", parent=S, fontName="Arial-Bold", textColor=colors.white)
SMALL = ParagraphStyle("SM", parent=B, fontSize=8.5, textColor=colors.HexColor("#555555"))
cl = lambda t: escape(str(t)).replace("\n", "<br/>").replace("\u203a", "&gt;")
P = lambda t, st=B: Paragraph(cl(t), st)


def table(head, rows, widths):
    data = [[Paragraph(cl(h), SB) for h in head]] + [[Paragraph(cl(v), S) for v in r] for r in rows]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), NAVY), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C9D3E0")),
                           ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F7FB")]), ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3)]))
    return t


# Collect cases with their workbook IDs, grouped by side then module
groups = {"Admin": OrderedDict(), "User": OrderedDict(), "Other": OrderedDict()}
for sheet, cases in D["sheets"].items():
    for i, c in enumerate(cases, 1):
        side = "Admin" if c["module"].startswith("Admin") else "User" if c["module"].startswith("User") else "Other"
        mod = c["module"].split("\u203a", 1)[-1].strip() if side != "Other" else c["module"]
        groups[side].setdefault(mod, []).append((f"{PFX[sheet]}-{i:03d}", c))
TYPE_ORDER = ["Login", "Create", "Read", "Update", "Hide", "Reorder", "Delete", "Restore", "Business rule", "Unsaved", "Navigation", "SEO", "Logout", "Session", "Validation", "Error", "Image - valid", "Image - size", "Image - type",
              "Image - display", "Image - replace", "Image - delete", "Image - path", "Image - mobile", "Image - security", "Security", "Access control", "SQL injection", "XSS", "Transport", "Information leak", "API",
              "Persistence", "Concurrency", "Duplicates", "Relationships", "Integrity", "Database down", "Responsive", "Browser", "Accessibility", "Performance"]
rank = lambda cat: TYPE_ORDER.index(cat) if cat in TYPE_ORDER else 99

INTRO = {
    "Login & Admin users": ("<site>/admin/login, then sidebar > Admin users", "Who can sign in to the Admin Panel. Test sign-in, wrong passwords, lockout, sign-out, adding/removing admins and changing passwords."),
    "Pages editor": ("Dashboard > Pages > (any page)", "Text, images, buttons and sections of each public page. Every page uses the same editor, so learn it once on About Us and repeat the key checks on the others."),
    "Shared content": ("Dashboard > Shared content", "Lists used in many places: countries, programmes, contact details, team, admission steps and the Nepal/India guidance box."),
    "Reels / Videos / Blog": ("Dashboard > Shared content > Reels / Videos / Blog posts", "Reels link out to Facebook/TikTok/Instagram; videos play on the site; blog posts get their own page at /blog/<address>. Their headings on the homepage are edited in Pages > Homepage."),
    "Image upload": ("Any field with an 'Upload image' button", "Only JPG, PNG, WebP, AVIF and GIF up to 5 MB are allowed. The real file type is checked, not the name."),
    "Public pages": ("The live website, signed out", "What visitors see. Check every page loads, links work, and admin changes show up."),
    "Contact & counselling forms": ("/contact and /book-counselling", "The two forms that send enquiries to the office. Test empty, wrong and correct data, and confirm the enquiry really arrives."),
    "Layout & browsers": ("Phone, tablet, laptop; several browsers", "The site must work and look right on every screen size and common browser."),
}

st = [P("Cerebellum website: Admin & User testing guide", H1),
      P("How to test every part of the Admin Panel and the public website, with example data, plus bug reports for the Admin side and the User side. "
        "Every test here has the same ID as in the Excel workbook 'Cerebellum_Manual_Test_Plan_Admin_and_User.xlsx', where you record the results.", SMALL), Spacer(1, 6)]

st.append(P("How to use this guide", H2))
for t in ["Open the Excel workbook next to the website. Start with the 'Tester Guide' and 'Test Data' sheets.",
          "Pick a test by its ID (e.g. FT-012), follow 'Steps', type the 'Example data', and compare with 'Expected'.",
          "In Excel write what actually happened in 'Actual Result' and set Status to Pass, Fail, Blocked (could not test, say why) or Not Tested.",
          "For every Fail: take a screenshot named <ID>_<short-name>.png and add a row to the 'Bug Reports' sheet (see Part D).",
          "Columns marked yellow in Excel are the ones you fill in. The 'Final Testing Summary' sheet counts everything automatically for the Admin side and the User side."]:
    st.append(P("\u2022 " + t))
st.append(P("Safety rules (very important on the live site)", H2))
for t in ["Use a test admin account made for you. Never use the owner's account.", "Start every title with TEST, and delete your TEST items when finished.",
          "NEVER click 'Restore original' on the live site: it deletes the real saved content of that page. Only test it on a staging copy.",
          "When you change real text (e.g. a heading), change it back straight away.", "Tell the office before sending TEST enquiries, and only use your own email/phone.",
          "Developer-only tests (Postman/curl, cookies, headers) are marked 'Developer'. Skip them if you are not technical."]:
    st.append(P("\u2022 " + t))
st.append(P("The Admin Panel controls you will use", H2))
st.append(table(["Control", "Where it is", "What it does"], [
    ["Save & publish", "Top of every editor", "Saves your changes and puts them on the live site within seconds."],
    ["Restore original", "Top of every editor", "Throws away ALL saved changes for that page/list (staging only!)."],
    ["Tick box on a section", "Section header in page editors", "Unticked = section 'Hidden' from the website, content kept."],
    ["Tick box on a list item", "Left of each item (reel, post, country...)", "Unticked = that item hidden from the website."],
    ["Show on website", "Next to some fields", "Hides only that element (e.g. an intro text)."],
    ["Move up / Move down", "Arrow buttons", "Changes the order of sections or items."],
    ["Remove (bin)", "Right of each item/section", "Deletes it (after Save & publish)."],
    ["Add <item> / Add to end of page", "Bottom of a list / page", "Adds a new item or section."],
    ["Upload image / Replace image / Remove", "Image fields", "Uploads a picture; describe it in the alt-text box; choose a focus point."],
], [42 * mm, 55 * mm, 83 * mm]))

for side, title in [("Admin", "Part A - Admin side (Admin Panel)"), ("User", "Part B - User side (public website)")]:
    st += [PageBreak(), P(title, PART)]
    for mod, items in groups[side].items():
        where, what = INTRO.get(mod, ("", ""))
        st.append(CondPageBreak(60 * mm))
        st.append(P(f"{side} > {mod}  ({len(items)} tests)", H2))
        if where: st.append(P(f"<b>Where:</b> {escape(where)}<br/><b>What it controls:</b> {escape(what)}".replace("&gt;", ">"), B) if False else Paragraph(f"<b>Where:</b> {escape(where)}<br/><b>What it controls:</b> {escape(what)}", B))
        st.append(Spacer(1, 3))
        items = sorted(items, key=lambda x: (rank(x[1]["cat"]), x[0]))
        st.append(table(["ID", "Type", "What to test", "Steps", "Example data", "Expected result"],
                        [[i, c["cat"], c["scen"] + (f"\n[{c['bug']} known]" if c["bug"] else ""), c["steps"], c["data"], c["exp"] + (f"\nNote: {c['rem']}" if c["rem"] and "Known open bug" not in c["rem"] else "")] for i, c in items],
                        [14 * mm, 17 * mm, 33 * mm, 52 * mm, 30 * mm, 36 * mm]))

st += [PageBreak(), P("Part C - Site-wide and developer checks", PART)]
for mod, items in groups["Other"].items():
    st.append(P(mod, H2))
    st.append(table(["ID", "Type", "What to test", "Steps", "Expected result"], [[i, c["cat"], c["scen"], c["steps"], c["exp"]] for i, c in items], [14 * mm, 20 * mm, 40 * mm, 60 * mm, 48 * mm]))

st += [PageBreak(), P("Part D - Bug reports (Admin side and User side)", PART),
       P("Developers fix bugs from these reports, so each one must let someone else reproduce the problem without asking you anything.", B), Spacer(1, 4),
       P("How to write a good bug report", H2)]
st.append(table(["Field", "What to write", "Example"], [
    ["Bug ID", "Next number in the 'Bug Reports' sheet", "BUG-011"], ["Side", "Admin (Admin Panel) or User (public website)", "Admin"], ["Module", "Area from the test case", "Reels"],
    ["Severity", "Critical: data loss, security hole, site down. High: main feature broken, no workaround. Medium: feature wrong but workaround exists. Low: cosmetic/minor.", "Medium"],
    ["Title", "One line: what is wrong + where", "Reel cover image not shown on homepage after upload"],
    ["Steps to reproduce", "Numbered steps from a fresh start, with the exact data", "1. Admin > Reels > TEST reel > Upload image (cover.jpg, 1 MB)\n2. Save & publish\n3. Open homepage, Ctrl+F5"],
    ["Expected / Actual", "What should happen / what happened", "Card shows the photo / Card shows only blue background"],
    ["Test Case ID", "The test that found it", "UP-001"], ["Evidence", "Screenshot or screen recording file name; browser + device", "UP-001_reel-cover-missing.png, Chrome 131, Windows 11"],
], [30 * mm, 80 * mm, 72 * mm]))
for side in ["Admin", "User"]:
    rows = [[k[0], k[3], k[2], k[4], k[5], k[6], k[7], k[8]] for k in D["known"] if k[1] == side]
    st.append(CondPageBreak(50 * mm))
    st.append(P(f"Open bugs to fix - {side} side ({len(rows)})", H2))
    st.append(P("Found in the automated analysis on 22 Nov 2026. Retest each one with the matching test case after it is fixed, and record it in 'Retesting and Regression'.", SMALL))
    st.append(table(["Bug", "Severity", "Module", "Problem", "How to reproduce", "Expected", "Actual", "Recommended fix"], rows, [14 * mm, 14 * mm, 20 * mm, 32 * mm, 30 * mm, 18 * mm, 20 * mm, 34 * mm]))
st.append(P("Blank bug report form", H2))
st.append(table(["Field", "Fill in"], [[f, ""] for f in ["Bug ID", "Side (Admin / User)", "Module", "Severity", "Title", "Steps to reproduce\n\n\n", "Expected", "Actual", "Test Case ID", "Evidence (file, browser, device)", "Reported by / date"]], [50 * mm, 132 * mm]))


def footer(c, doc):
    c.saveState(); c.setFont("Arial", 7.5); c.setFillColor(colors.HexColor("#777777"))
    c.drawString(14 * mm, 9 * mm, "Cerebellum website - Admin & User testing guide"); c.drawRightString(A4[0] - 14 * mm, 9 * mm, f"Page {doc.page}"); c.restoreState()


SimpleDocTemplate(OUT, pagesize=A4, leftMargin=14 * mm, rightMargin=14 * mm, topMargin=13 * mm, bottomMargin=15 * mm, title="Cerebellum Admin & User testing guide").build(st, onFirstPage=footer, onLaterPages=footer)
print("pdf", OUT)
