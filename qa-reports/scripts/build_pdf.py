import json, sys
from collections import Counter
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = sys.argv[1]
pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))
from reportlab.lib.fonts import addMapping
addMapping("Arial", 0, 0, "Arial"); addMapping("Arial", 1, 0, "Arial-Bold")

D = json.load(open("final.json", encoding="utf8"))
G = json.load(open("guide.json", encoding="utf8"))
BUGS, R = D["bugs"], D["results"]
c = Counter(r["status"] for r in R)

NAVY = colors.HexColor("#1F3A5F")
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Title"], fontName="Arial-Bold", fontSize=20, textColor=NAVY, alignment=0, spaceAfter=4)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], fontName="Arial-Bold", fontSize=13, textColor=NAVY, spaceBefore=10, spaceAfter=5)
B = ParagraphStyle("B", parent=ss["BodyText"], fontName="Arial", fontSize=9.5, leading=13)
S = ParagraphStyle("S", parent=B, fontSize=8, leading=10.5)
SB = ParagraphStyle("SB", parent=S, fontName="Arial-Bold", textColor=colors.white)
SMALL = ParagraphStyle("SM", parent=B, fontSize=8.5, textColor=colors.HexColor("#555555"))

clean = lambda t: escape(str(t)).replace("\u2630", "menu (three lines)").replace("\u2713", "(ticked)")
P = lambda t, st=B: Paragraph(clean(t), st)


def table(head, rows, widths):
    data = [[Paragraph(clean(h), SB) for h in head]] + [[Paragraph(clean(v), S) for v in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), NAVY), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C9D3E0")),
                           ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F7FB")]),
                           ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4)]))
    return t


def box(lines, title=None):
    return KeepTogether(([P(title, H2)] if title else []) + [P(f"\u2022 {l}") for l in lines])


st = []
st += [P("Cerebellum website: QA to-do list & tester guide", H1),
       P("Run 22 November 2026 on a local production build (not the live site). Full detail is in Cerebellum_QA_Test_Workbook.xlsx.", SMALL), Spacer(1, 6)]

st.append(P("Result at a glance", H2))
st.append(table(["Total tests", "Pass", "Fail", "Blocked", "Not Tested", "Bugs (High / Medium / Low)", "Critical bugs"],
                [[len(R), c["Pass"], c["Fail"], c["Blocked"], c["Not Tested"], "1 / 5 / 4", "0"]], [24 * mm, 18 * mm, 18 * mm, 20 * mm, 22 * mm, 46 * mm, 26 * mm]))
st.append(Spacer(1, 4))
st.append(P("Most things work: every page loads, all links and images work, layouts fit phone to desktop, forms validate in the browser and on the server, "
            "login and admin pages are protected, uploads only accept real images, and text typed into the Admin Panel can't inject code. "
            "No Critical bugs were found. The items below are what is left."))

TODO = [
    ("1", "Must do before launch", "Connect enquiry delivery (Resend email or a webhook) on the server, then send a TEST message and check it arrives.", "Owner / developer", "Without it, no enquiry reaches the office."),
    ("2", "Must do before launch", "Fix BUG-001: the login lockout can be bypassed by faking the X-Forwarded-For header.", "Developer", "High"),
    ("3", "Must do before launch", "Fill in real phone, WhatsApp, email, address, fees and the 5 hidden FAQ answers in the Admin Panel (or confirm they are already in the database).", "Owner", "Many are empty in code"),
    ("4", "Must do before launch", "Set SESSION_SECRET (32+ random characters) on the server; on the live HTTPS site check the admin cookie is marked Secure.", "Developer", "Blocked test"),
    ("5", "Should do", "Fix BUG-002: logging out / changing password does not end other sessions.", "Developer", "Medium"),
    ("6", "Should do", "Fix BUG-004: add a Content-Security-Policy header.", "Developer", "Medium"),
    ("7", "Should do", "Fix BUG-005: the Admin Panel says 'Saved' while silently blanking invalid links.", "Developer", "Medium"),
    ("8", "Should do", "Fix BUG-003: a new blog post shows 'This page has moved on' on its first visit (two fixes tried, not solved).", "Developer", "Medium"),
    ("9", "Should do", "Fix BUG-007 and turn on Cloudflare Turnstile spam protection for the forms.", "Developer", "Medium"),
    ("10", "Nice to have", "BUG-006 (1 MB save limit crash), BUG-008 (unlimited enquiry body size), BUG-009 (first 404 returns 200), BUG-010 (820 KB JavaScript).", "Developer", "Low"),
    ("11", "Needs access", "Start the PostgreSQL database and re-run the Database tests; share the live URL and run the Blocked tests and Lighthouse.", "Owner", "Blocked"),
    ("12", "Needs a person", "Visual check on phones and other browsers, keyboard/screen-reader check, click through the Admin editor (7 Not Tested rows).", "Tester", "Not Tested"),
    ("13", "Housekeeping", "Remove or document the unused Prisma setup; legal review of the Privacy Policy and Terms.", "Owner / developer", "Low"),
]
st.append(P("To-do list", H2))
st.append(table(["#", "Priority", "Task", "Who", "Note"], TODO, [8 * mm, 28 * mm, 92 * mm, 26 * mm, 26 * mm]))

st.append(P("Bugs found", H2))
st.append(table(["Bug", "Severity", "What happens", "Fix"], [[b["id"], b["sev"], b["title"], b["fix"]] for b in BUGS], [17 * mm, 16 * mm, 62 * mm, 85 * mm]))

st.append(P("What could not be tested, and why", H2))
st.append(table(["Test", "Status", "Why"], [[f'{r["id"]}: {r["scenario"]}', r["status"], r["remarks"].split(" Evidence:")[0]] for r in R if r["status"] in ("Blocked", "Not Tested")],
                [70 * mm, 20 * mm, 90 * mm]))
st.append(Spacer(1, 4))
st.append(P("Environment notes: the local PostgreSQL database (127.0.0.1:5433) refused connections, so saving was tested with local-file storage. "
            "The developer's own 'next dev' server on port 3000 was crashing ('Jest worker' error) and should be restarted.", SMALL))

st.append(PageBreak())
st.append(P("Guide for a new tester", H1))
st.append(P("You don't need to know the code. Follow the steps on the live website and record what you see in the Excel workbook.", SMALL))
st.append(box(G["before"], "Before you start"))
st.append(P("Step by step", H2))
st.append(table(["#", "Where", "What to do", "Data to enter", "What you should see", "It's a bug if..."],
                [[s["n"], s["where"], s["do"], s["data"], s["verify"], s["bug"]] for s in G["steps"]], [8 * mm, 26 * mm, 42 * mm, 32 * mm, 42 * mm, 30 * mm]))
st.append(box(G["bug"], "How to recognise a bug"))
st.append(box(G["record"], "How to record results and evidence"))


def footer(canvas, doc):
    canvas.saveState(); canvas.setFont("Arial", 7.5); canvas.setFillColor(colors.HexColor("#777777"))
    canvas.drawString(15 * mm, 10 * mm, "Cerebellum website QA, 22 Nov 2026")
    canvas.drawRightString(A4[0] - 15 * mm, 10 * mm, f"Page {doc.page}"); canvas.restoreState()


SimpleDocTemplate(OUT, pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=14 * mm, bottomMargin=16 * mm,
                  title="Cerebellum QA to-do & tester guide").build(st, onFirstPage=footer, onLaterPages=footer)
print("saved", OUT)
