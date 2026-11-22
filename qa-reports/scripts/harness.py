"""QA harness for Cerebellum, run against an isolated local production server (port 3400, local-file storage).
Every result recorded here is what the server actually returned. Nothing is assumed."""
import base64, hashlib, hmac, html, io, json, re, sys, time, urllib.parse
import requests

B = "http://localhost:3400"
SECRET = b"qa-local-only-secret-0123456789abcdef0123"
ADMIN = ("qa.admin@example.test", "QaTestPass2026")
SECOND = ("qa.second@example.test", "QaSecond2026x")
A = {
    "login": "601bc76845e404e329045b26e808211994bc9944fb",
    "logout": "005400855d4257c98d196f3ca4d7e77c0b3479bac2",
    "save": "6088dc093e1b015a1e5d750a275dda08f10ada22e6",
    "reset": "406b41f9d0ceb0fc6f5ae62d28fdd9077705b65c1b",
    "delete": "409f5df87b156484d68223c9bf13915cedde25e6e0",
    "status": "40da42a184396f4dd918659dc54caf58cb197d3df7",
    "cache": "c0343be17d47a38f0c7cc5eaf90b15e255e731fdf8",
}
R = []
counter = {}


def rec(sheet, module, feature, cat, scenario, steps, data, expected, actual, ok, sev="", fix="", remarks=""):
    p = {"Functional": "FT", "Validation": "FV", "Auth": "AU", "Security": "SE", "API": "AP", "Upload": "UP", "Database": "DB", "UI": "UI", "Performance": "PF"}[sheet]
    counter[p] = counter.get(p, 0) + 1
    status = ok if isinstance(ok, str) else ("Pass" if ok else "Fail")
    R.append(dict(id=f"{p}-{counter[p]:03d}", sheet=sheet, module=module, feature=feature, cat=cat, scenario=scenario, steps=steps, data=data,
                  expected=expected, actual=str(actual)[:600], status=status, severity=sev if status == "Fail" else "", fix=fix if status == "Fail" else "", remarks=remarks))
    print(f"{R[-1]['id']:7} {status:8} {scenario[:90]} -> {str(actual)[:140]}")


def login(email, pw, xff=None, s=None):
    s = s or requests.Session()
    page = s.get(B + "/admin/login").text
    form = re.search(r"<form.*?</form>", page, re.S).group(0)
    fields = {html.unescape(n): html.unescape(v) for n, v in re.findall(r'<input type="hidden" name="([^"]+)"(?: value="([^"]*)")?', form)}
    fields.update(email=email, password=pw)
    h = {"Origin": B}
    if xff: h["X-Forwarded-For"] = xff
    r = s.post(B + "/admin/login", files={k: (None, v) for k, v in fields.items()}, headers=h, allow_redirects=False)
    return s, r


def act(s, path, aid, args, origin=B, extra=None):
    h = {"Next-Action": aid, "Content-Type": "text/plain;charset=UTF-8", "Accept": "text/x-component"}
    if origin: h["Origin"] = origin
    if extra: h.update(extra)
    return s.post(B + path, data=json.dumps(args), headers=h, allow_redirects=False)


def form_post(s, path, must_have, values, origin=B):
    page = s.get(B + path).text
    for form in re.findall(r"<form.*?</form>", page, re.S):
        if f'name="{must_have}"' in form:
            fields = {html.unescape(n): html.unescape(v) for n, v in re.findall(r'<input type="hidden" name="([^"]+)"(?: value="([^"]*)")?', form)}
            fields.update(values)
            return s.post(B + path, files={k: (None, v) for k, v in fields.items()}, headers={"Origin": origin}, allow_redirects=False)
    return None


def token(uid, exp_ms, secret=SECRET):
    payload = base64.urlsafe_b64encode(json.dumps({"uid": uid, "exp": exp_ms}).encode()).rstrip(b"=").decode()
    sig = base64.urlsafe_b64encode(hmac.new(secret, payload.encode(), hashlib.sha256).digest()).rstrip(b"=").decode()
    return f"{payload}.{sig}"


def is_admin_page(r):
    return r.status_code == 200 and "Admin Panel" in r.text and "Welcome," in r.text


anon = requests.Session()


def text(path):
    """Page HTML with React's text-node separators removed, so visible text can be matched."""
    return anon.get(B + path).text.replace("<!-- -->", "")


# ───────────────────────────── Public pages (functional) ─────────────────────────────
DEST = ["china", "bangladesh", "india", "russia", "georgia", "kazakhstan", "philippines"]
PROG = ["mbbs", "md", "dentistry", "nursing", "pharmacy", "biomedical-sciences"]
routes = ["/", "/about", "/admission-process", "/contact", "/destinations", "/programs", "/scholarships", "/faqs", "/book-counselling",
          "/success-stories", "/privacy-policy", "/terms-and-conditions", "/blog", "/videos", "/sitemap.xml", "/robots.txt", "/opengraph-image"]
routes += [f"/destinations/{d}" for d in DEST] + [f"/programs/{p}" for p in PROG]
pages = {}
for path in routes:
    t = time.perf_counter()
    r = anon.get(B + path)
    ms = (time.perf_counter() - t) * 1000
    pages[path] = (r, ms)
    rec("Functional", "Public website", path, "Page load", f"Open {path} as a visitor", f"Visit {B}{path}", "-", "HTTP 200 and the page renders", f"HTTP {r.status_code}, {len(r.content)} bytes", r.status_code == 200,
        "High", "Find the server error in the log for this route and fix it.")

for path in ["/does-not-exist", "/programs/nope", "/destinations/nope", "/blog/nope", "/blog/__none__"]:
    r = anon.get(B + path)
    rec("Functional", "Public website", "Not-found handling", "Error handling", f"Unknown address {path} shows the 404 page", f"Visit {path}", path, "HTTP 404 with the site's 'not found' page",
        f"HTTP {r.status_code}", r.status_code == 404, "Medium", "Make sure notFound() is reached and returns 404, not a 500.")

# Footer / nav links and new Blog + Videos links
home = pages["/"][0].text
for label, href in [("Blog", "/blog"), ("Videos", "/videos")]:
    rec("Functional", "Navigation", "Footer links", "Navigation", f"Footer has a '{label}' link", "Scroll to the footer on the homepage", "-", f"A link to {href}", f'href="{href}" present: {f"href=\"{href}\"" in home}', f'href="{href}"' in home, "Low", "Add the link to footerNav.")

# ───────────────────────────── Broken links / images crawl ─────────────────────────────
internal, imgs = set(), set()
for path, (r, _) in pages.items():
    if "html" not in r.headers.get("content-type", ""): continue
    for h in re.findall(r'href="(/[^"#?]*)', r.text):
        if not h.startswith("/_next"): internal.add(h)
    for src in re.findall(r'<img[^>]+src="([^"]+)"', r.text):
        imgs.add(html.unescape(src))
broken = []
for h in sorted(internal):
    c = anon.get(B + h, allow_redirects=True).status_code
    if c >= 400: broken.append((h, c))
rec("Functional", "Public website", "Internal links", "Broken links", "Every internal link on every public page works", "Crawl all pages and request each internal link", f"{len(internal)} unique links", "All return HTTP 200",
    f"{len(broken)} broken: {broken[:10]}" if broken else f"All {len(internal)} links OK", not broken, "Medium", "Fix or remove the broken links listed.")
badimg = []
for src in sorted(imgs):
    u = src if src.startswith("http") else B + src
    if src.startswith("data:"): continue
    c = anon.get(u).status_code
    if c >= 400: badimg.append((src[:80], c))
rec("Functional", "Public website", "Images", "Broken images", "Every image on every public page loads", "Collect all <img> sources and request each", f"{len(imgs)} unique images", "All return HTTP 200",
    f"{len(badimg)} broken: {badimg[:8]}" if badimg else f"All {len(imgs)} images OK", not badimg, "Medium", "Replace the missing images.")

# ───────────────────────────── UI / accessibility basics (HTML checks) ─────────────────────────────
for path, (r, _) in pages.items():
    if "html" not in r.headers.get("content-type", ""): continue
    t = r.text
    h1 = len(re.findall(r"<h1[\s>]", t))
    noalt = [m for m in re.findall(r"<img(?![^>]*\balt=)[^>]*>", t)]
    vp = 'name="viewport"' in t
    lang = re.search(r'<html[^>]*\blang="', t) is not None
    title = re.search(r"<title>(.*?)</title>", t, re.S)
    ok = h1 == 1 and not noalt and vp and lang and title
    rec("UI", "Public website", path, "HTML structure / accessibility", f"{path}: one H1, images have alt text, viewport + lang set, has a title", "Open page source and check", "-",
        "Exactly 1 <h1>, 0 images without alt, viewport meta, <html lang>, <title>", f"h1={h1}, images without alt={len(noalt)}, viewport={vp}, lang={lang}, title={'yes' if title else 'no'}", bool(ok), "Low",
        "Use exactly one H1 per page and give every image an alt attribute.")

# ───────────────────────────── Performance (local production server) ─────────────────────────────
for path in ["/", "/destinations", "/programs/mbbs", "/blog", "/videos", "/book-counselling"]:
    times = []
    for _ in range(3):
        t = time.perf_counter(); r = anon.get(B + path); times.append((time.perf_counter() - t) * 1000)
    med = sorted(times)[1]
    size = len(r.content)
    rec("Performance", "Public website", path, "Server response time", f"{path} responds quickly from the server", "Request the page 3 times, take the median", "3 requests, local machine",
        "Median under 500 ms and HTML under 400 KB", f"median {med:.0f} ms, HTML {size/1024:.0f} KB", med < 500 and size < 400 * 1024, "Low", "Check what part of the page is slow (database, large inline data).",
        "Measured on the local machine, not the hosting server. Repeat on the live site with Lighthouse / PageSpeed Insights.")
r = anon.get(B + "/")
js = sorted(set(re.findall(r'src="(/_next/static/[^"]+\.js)"', r.text)))
tot = 0
for j in js:
    jr = anon.get(B + j); tot += len(jr.content)
cc = anon.get(B + js[0]).headers.get("cache-control", "") if js else ""
rec("Performance", "Public website", "JavaScript size", "Bundle size", "Homepage JavaScript is a reasonable size", "Sum the size of every script the homepage loads", f"{len(js)} scripts", "Under 600 KB uncompressed",
    f"{tot/1024:.0f} KB across {len(js)} files", tot < 600 * 1024, "Low", "Look for large client components and split them.")
rec("Performance", "Public website", "Static asset caching", "Caching", "Scripts are cached long-term by browsers", "Check Cache-Control on a /_next/static file", js[0] if js else "-", "public, max-age=31536000, immutable", cc,
    "immutable" in cc, "Low", "Serve /_next/static with long-lived caching.")

# ───────────────────────────── Security headers ─────────────────────────────
h = anon.get(B + "/").headers
for name, want in [("X-Content-Type-Options", "nosniff"), ("X-Frame-Options", "SAMEORIGIN"), ("Referrer-Policy", "strict-origin-when-cross-origin"), ("Permissions-Policy", "camera=()")]:
    v = h.get(name, "")
    rec("Security", "Whole site", "Security headers", "HTTP headers", f"{name} header is sent", "curl -I the homepage", "-", f"Contains '{want}'", v or "(missing)", want in v, "Medium", f"Add {name} in next.config.ts headers().")
rec("Security", "Whole site", "Security headers", "HTTP headers", "Strict-Transport-Security (HSTS) is sent in production", "curl -I the homepage on the production build", "-", "max-age=31536000", h.get("Strict-Transport-Security", "(missing)"),
    "max-age" in h.get("Strict-Transport-Security", ""), "Medium", "Keep the HSTS header for production.")
rec("Security", "Whole site", "Security headers", "HTTP headers", "Content-Security-Policy is sent on pages", "curl -I the homepage", "-", "A CSP header limiting scripts and frames", h.get("Content-Security-Policy", "(missing)"),
    "Content-Security-Policy" in h, "Medium", "Add a Content-Security-Policy (script-src 'self' plus nonces; frame-src youtube-nocookie.com, player.vimeo.com, facebook.com).",
    "Without a CSP, any future XSS bug is not contained. Needs care: the site embeds YouTube/Vimeo/Facebook/Google Maps iframes.")
rec("Security", "Whole site", "Server fingerprinting", "HTTP headers", "X-Powered-By header is hidden", "curl -I the homepage", "-", "No X-Powered-By header", h.get("X-Powered-By", "(absent)"), "X-Powered-By" not in h, "Low", "Set poweredByHeader: false.")

# ───────────────────────────── Authentication ─────────────────────────────
r = anon.get(B + "/admin", allow_redirects=False)
rec("Auth", "Admin Panel", "Access gate", "Access control", "Opening /admin while signed out redirects to the login page", "Visit /admin without signing in", "no cookie", "Redirect (307) to /admin/login",
    f"HTTP {r.status_code} -> {r.headers.get('location')}", r.status_code in (302, 303, 307) and "/admin/login" in r.headers.get("location", ""), "Critical", "Keep the proxy redirect and requireAdmin().")
for p in ["/admin/pages/home", "/admin/settings/reels", "/admin/users"]:
    r = anon.get(B + p, allow_redirects=False)
    rec("Auth", "Admin Panel", "Access gate", "Access control", f"{p} is protected when signed out", f"Visit {p} without signing in", "no cookie", "Redirect to /admin/login",
        f"HTTP {r.status_code} -> {r.headers.get('location')}", r.status_code in (302, 303, 307), "Critical", "Protect the page with requireAdmin().")
s = requests.Session(); s.cookies.set("cen_admin", "garbage")
r = s.get(B + "/admin")
rec("Auth", "Admin Panel", "Session cookie", "Session tampering", "A made-up session cookie does not grant access", "Set cookie cen_admin=garbage, open /admin", "cen_admin=garbage", "Login page is shown, not the dashboard",
    "dashboard shown" if is_admin_page(r) else f"not admin (final URL {r.url})", not is_admin_page(r), "Critical", "Verify the HMAC signature on every request.")
s = requests.Session(); s.cookies.set("cen_admin", token("anything", int(time.time() * 1000) + 3600_000, secret=b"wrong-secret"))
r = s.get(B + "/admin")
rec("Auth", "Admin Panel", "Session cookie", "Session tampering", "A cookie signed with the wrong secret is rejected", "Forge a token with another key, open /admin", "forged HMAC", "Not signed in",
    "dashboard shown" if is_admin_page(r) else "rejected", not is_admin_page(r), "Critical", "Verify the HMAC signature on every request.")

# Real login
s_admin, r = login(*ADMIN)
setc = r.headers.get("set-cookie", "")
rec("Auth", "Admin Login", "Sign in", "Valid login", "Sign in with a correct email and password", "Open /admin/login, enter the test admin's email and password, click Sign in", ADMIN[0] + " / (valid password)",
    "Redirect to /admin and a session cookie is set", f"HTTP {r.status_code}, cookie set={'cen_admin=' in setc}", "cen_admin=" in setc, "Critical", "Check loginAction.")
rec("Auth", "Admin Login", "Session cookie", "Cookie flags", "Session cookie is HttpOnly and SameSite=Lax", "Inspect the Set-Cookie header after signing in", "-", "HttpOnly; SameSite=lax; Max-Age=28800 (8 h)",
    re.sub(r"cen_admin=[^;]+", "cen_admin=<token>", setc), "HttpOnly" in setc and "SameSite=lax" in setc.replace("Lax", "lax") and "Max-Age=28800" in setc, "High", "Set httpOnly, sameSite and maxAge on the cookie.",
    "The Secure flag is absent here only because this QA run sets ADMIN_INSECURE_COOKIE=true for plain-HTTP localhost. On the live HTTPS site, check that the cookie shows 'Secure'.")
r = s_admin.get(B + "/admin")
rec("Auth", "Admin Login", "Sign in", "Valid login", "After sign-in the dashboard opens", "Open /admin after signing in", "-", "Dashboard with 'Welcome, QA'", "dashboard shown" if is_admin_page(r) else f"HTTP {r.status_code}", is_admin_page(r), "Critical", "-")

_, r = login(ADMIN[0].upper(), ADMIN[1], xff="10.0.0.50")
rec("Auth", "Admin Login", "Sign in", "Valid login", "Email is not case-sensitive", "Sign in with the email in CAPITALS", ADMIN[0].upper(), "Signed in", f"cookie set={'cen_admin=' in r.headers.get('set-cookie','')}", "cen_admin=" in r.headers.get("set-cookie", ""), "Low", "Lower-case the email before lookup.")


def login_msg(r):
    m = re.search(r"(Incorrect email or password\.|Enter your email and password\.|Too many attempts[^\"<]*)", r.text)
    return m.group(1) if m else f"HTTP {r.status_code}, no message found"


_, r = login(ADMIN[0], "WrongPassword1", xff="10.0.0.1")
rec("Auth", "Admin Login", "Sign in", "Invalid login", "Wrong password is refused", "Enter the right email with a wrong password", "WrongPassword1", "'Incorrect email or password.' and no cookie", login_msg(r) + f"; cookie={'cen_admin=' in r.headers.get('set-cookie','')}",
    "Incorrect" in r.text and "cen_admin=" not in r.headers.get("set-cookie", ""), "Critical", "-")
_, r = login("nobody@example.test", "WrongPassword1", xff="10.0.0.2")
rec("Auth", "Admin Login", "Sign in", "User enumeration", "Unknown email gives the same message as a wrong password", "Sign in with an email that has no account", "nobody@example.test", "Same 'Incorrect email or password.' message", login_msg(r),
    "Incorrect email or password." in r.text, "Medium", "Use one generic message for both cases.")
_, r = login("", "", xff="10.0.0.3")
rec("Auth", "Admin Login", "Sign in", "Invalid login", "Empty email and password are refused", "Submit the form empty (bypassing the browser's 'required' check)", "empty", "'Enter your email and password.'", login_msg(r), "Enter your email" in r.text, "Medium", "-")
_, r = login("' OR '1'='1", "' OR '1'='1", xff="10.0.0.4")
rec("Security", "Admin Login", "Sign in", "SQL injection", "SQL injection in the login form does not sign in", "Enter ' OR '1'='1 as email and password", "' OR '1'='1", "Refused, no 500 error", login_msg(r) + f"; HTTP {r.status_code}",
    "cen_admin=" not in r.headers.get("set-cookie", "") and r.status_code < 500, "Critical", "Use parameterised queries (already used: $1).")

# Brute-force limit
codes = []
for i in range(6):
    _, r = login(SECOND[0], f"Wrong{i}Password", xff="10.0.0.9")
    codes.append(login_msg(r)[:22])
_, r = login(*SECOND, xff="10.0.0.9")
blocked = "Too many attempts" in r.text and "cen_admin=" not in r.headers.get("set-cookie", "")
rec("Auth", "Admin Login", "Brute-force protection", "Rate limiting", "After 6 wrong passwords, even the right password is blocked for 15 minutes", "Enter a wrong password 6 times, then the correct one", "6 x wrong, then correct",
    "'Too many attempts. Please wait 15 minutes…'", f"attempts 1-6: {codes}; 7th (correct): {login_msg(r)}", blocked, "High", "-")
_, r = login(*SECOND, xff="10.0.0.99")
bypass = "cen_admin=" in r.headers.get("set-cookie", "")
rec("Security", "Admin Login", "Brute-force protection", "Rate-limit bypass", "Changing the X-Forwarded-For header does not reset the login limit", "After being blocked, send the next attempt with a different X-Forwarded-For header", "X-Forwarded-For: 10.0.0.99",
    "Still blocked", "signed in, limit bypassed" if bypass else "still blocked", not bypass, "High",
    "Key the limit on the email alone as well as the IP, and only trust X-Forwarded-For set by your own reverse proxy (take the right-most trusted hop). Consider a persistent store so limits survive restarts.",
    "The key is 'IP|email' and the IP is read straight from the client-supplied X-Forwarded-For header, so an attacker can rotate it on every request.")

# Session expiry / deleted account / logout replay (using the known local QA secret)
admins = json.load(open("E:/Work/Cerebellum/.data/admins.json"))
uid = admins[0]["id"]
s = requests.Session(); s.cookies.set("cen_admin", token(uid, int(time.time() * 1000) - 1000))
r = s.get(B + "/admin")
rec("Auth", "Admin Panel", "Session expiry", "Session timeout", "An expired session (older than 8 hours) is refused", "Use a correctly signed token whose expiry is in the past", "exp = now - 1s", "Not signed in", "dashboard shown" if is_admin_page(r) else "rejected", not is_admin_page(r), "High", "-",
    "Token forged with the local QA secret to simulate the 8-hour expiry without waiting.")
s = requests.Session(); s.cookies.set("cen_admin", token("deadbeefdeadbeefdead", int(time.time() * 1000) + 3600_000))
r = s.get(B + "/admin")
rec("Auth", "Admin Panel", "Removed accounts", "Session validity", "A valid token for an account that no longer exists is refused", "Use a signed token with an unknown admin id", "uid=deadbeef…", "Not signed in", "dashboard shown" if is_admin_page(r) else "rejected", not is_admin_page(r), "High", "-")

s_tmp, _ = login(*ADMIN, xff="10.0.1.1")
old = s_tmp.cookies.get("cen_admin")
r = act(s_tmp, "/admin", A["logout"], [])
s_replay = requests.Session(); s_replay.cookies.set("cen_admin", old)
r2 = s_replay.get(B + "/admin")
rec("Auth", "Admin Panel", "Sign out", "Session revocation", "After signing out, a copy of the old session cookie no longer works", "Sign in, copy the cookie, sign out, then reuse the copied cookie", "copied cen_admin cookie",
    "Old cookie is refused", "old cookie STILL opens the dashboard" if is_admin_page(r2) else "refused", not is_admin_page(r2), "Medium",
    "Store a per-admin 'sessionVersion' (or a server-side session id) and bump it on logout and on password change; reject tokens with an old version.",
    "Sessions are stateless HMAC tokens valid for 8 hours. Logging out only deletes the browser cookie. A stolen cookie keeps working until it expires, even after a password change.")

# ───────────────────────────── CSRF / CORS ─────────────────────────────
r = act(s_admin, "/admin", A["save"], ["settings:reels", json.dumps({"version": 1, "hidden": [], "data": {"reels": []}})], origin="https://evil.example")
rec("Security", "Admin Panel", "Save content", "CSRF", "A save request from another website is refused", "Send the save action with a valid cookie but Origin: https://evil.example", "Origin: https://evil.example",
    "Request rejected (Next.js checks Origin against Host)", f"HTTP {r.status_code}: {r.text[:120]}", r.status_code >= 400 or '"ok":true' not in r.text, "High", "Keep Next.js server-action origin checking; do not add allowedOrigins wildcards.")
r = anon.options(B + "/api/enquiry", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
acao = r.headers.get("Access-Control-Allow-Origin")
rec("Security", "Enquiry API", "/api/enquiry", "CORS", "Other websites are not allowed to call the enquiry API from a browser", "Send a CORS preflight from https://evil.example", "OPTIONS + Origin", "No Access-Control-Allow-Origin header", f"HTTP {r.status_code}, ACAO={acao}", acao is None, "Medium", "Do not add CORS headers to the API.")
r = anon.post(B + "/api/admin/media", files={"file": ("a.png", b"\x89PNG\r\n\x1a\n" + b"0" * 100, "image/png")}, headers={"Origin": "https://evil.example"})
rec("Security", "Media upload", "/api/admin/media", "CSRF", "Cross-site upload without a session is refused", "POST a file with no cookie", "no cookie", "HTTP 401", f"HTTP {r.status_code}", r.status_code == 401, "High", "-",
    "With a cookie, a cross-site POST is still blocked because the cookie is SameSite=Lax. The route itself does not check Origin.")

# ───────────────────────────── Server actions: authorisation ─────────────────────────────
r = act(anon, "/admin", A["save"], ["page:home", "{}"])
rec("Security", "Admin Panel", "Save content", "Broken access control", "Calling the save action without signing in is refused", "POST the save action directly with no cookie", "Next-Action: saveContentAction", "Redirect to login, nothing saved",
    f"HTTP {r.status_code}, x-action-redirect={r.headers.get('x-action-redirect')}", '"ok":true' not in r.text, "Critical", "requireAdmin() at the top of every action.")
r = act(anon, "/admin", A["reset"], ["page:home"])
rec("Security", "Admin Panel", "Restore original", "Broken access control", "Calling the restore action without signing in is refused", "POST resetContentAction with no cookie", "-", "Refused", f"HTTP {r.status_code}, x-action-redirect={r.headers.get('x-action-redirect')}", '"ok":true' not in r.text, "Critical", "-")
r = act(anon, "/admin", A["delete"], [admins[1]["id"]])
still = len(json.load(open("E:/Work/Cerebellum/.data/admins.json"))) == 2
rec("Security", "Admin Users", "Remove admin", "Broken access control", "Removing an admin without signing in is refused", "POST deleteAdminAction with another admin's id and no cookie", "id of qa.second", "Refused, account still exists", f"HTTP {r.status_code}; account still exists={still}", still, "Critical", "-")
r = act(anon, "/admin", A["cache"], ["settings:site"])
rec("Security", "Whole site", "Internal cache functions", "Broken access control", "Internal cached functions cannot be called like public actions", "POST with Next-Action set to the id of the cached content loader", "id from server-reference-manifest", "Refused / no data",
    f"HTTP {r.status_code}, {len(r.text)} bytes, contains data={'contact' in r.text}", "contact" not in r.text, "Low", "Upgrade Next.js / report upstream.", "Content is public anyway; this only checks for unexpected exposure.")

# ───────────────────────────── Save content: functional + validation + injection ─────────────────────────────
def save(key, data):
    r = act(s_admin, "/admin", A["save"], [key, json.dumps(data)])
    return r, ('"ok":true' in r.text)


def stored(key):
    try: return json.load(open(f"E:/Work/Cerebellum/.data/content/{key.replace(':', '_')}.json", encoding="utf8"))["data"]
    except FileNotFoundError: return None


reel = lambda t, u, i="r1": {"_id": i, "enabled": True, "title": t, "url": u, "thumbnail": {"src": "", "alt": "", "position": ""}}
r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel("QA reel TikTok", "https://www.tiktok.com/@qa/video/7300000000000000001"), reel("QA reel Facebook", "https://www.facebook.com/reel/123456789", "r2")]}})
rec("Functional", "Admin → Reels", "Create", "CRUD - Create", "Add two reels (TikTok and Facebook) and save", "Admin → Reels → Add reel → enter title and link → Save", "TikTok + Facebook links", "'Saved' and both reels stored", f"ok={ok}; stored={len((stored('settings:reels') or {}).get('data', {}).get('reels', []))} reels", ok, "High", "-")
hp = text("/")
rec("Functional", "Homepage", "Reels section", "CRUD - Read", "Saved reels appear on the homepage with 'Watch on TikTok' / 'Watch on Facebook'", "Open the homepage after saving", "-", "Both reel titles and platform labels visible",
    f"TikTok={'QA reel TikTok' in hp and 'Watch on TikTok' in hp}, Facebook={'QA reel Facebook' in hp and 'Watch on Facebook' in hp}", "QA reel TikTok" in hp and "Watch on Facebook" in hp, "High", "Check updateTag on save and the homeReels section.")
rec("Functional", "Homepage", "Reels section", "Links", "Reel cards link to the reel and open in a new tab safely", "Inspect a reel card link", "-", 'href is the reel URL with target="_blank" rel="noopener noreferrer"',
    "ok" if re.search(r'href="https://www.tiktok.com/@qa/video/7300000000000000001" target="_blank" rel="noopener noreferrer"', hp) else "attributes not found", bool(re.search(r'href="https://www.tiktok.com/@qa/video/7300000000000000001" target="_blank" rel="noopener noreferrer"', hp)), "Low", "-")

r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel("QA reel TikTok — edited", "https://www.tiktok.com/@qa/video/7300000000000000001")]}})
hp = text("/")
rec("Functional", "Admin → Reels", "Update / Delete", "CRUD - Update/Delete", "Edit one reel's title and delete the other", "Change the title, remove the second reel, Save", "-", "Homepage shows the new title; the deleted reel is gone",
    f"edited shown={'QA reel TikTok — edited' in hp or 'QA reel TikTok &#x27;' in hp or 'edited' in hp}, deleted gone={'QA reel Facebook' not in hp}", ok and "edited" in hp and "QA reel Facebook" not in hp, "High", "-")

r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [{**reel("Hidden reel", "https://www.tiktok.com/@qa/video/7300000000000000002"), "enabled": False}, reel("Visible reel", "https://www.tiktok.com/@qa/video/7300000000000000003", "r3")]}})
hp = text("/")
rec("Functional", "Admin → Reels", "Show on website tick", "Visibility", "A reel with 'Show on website' unticked is hidden", "Untick one reel, Save, open homepage", "-", "Hidden reel not shown, other reel shown", f"hidden shown={'Hidden reel' in hp}, visible shown={'Visible reel' in hp}", "Hidden reel" not in hp and "Visible reel" in hp, "Medium", "-")

xss = '<img src=x onerror=alert(1)><script>alert(2)</script>'
r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel(xss, "https://www.tiktok.com/@qa/video/1"), reel("JS link reel", "javascript:alert(document.cookie)", "r4")]}})
js_ok = ok
hp = text("/")
raw = "<script>alert(2)</script>" in hp or "<img src=x onerror" in hp
rec("Security", "Admin → Reels", "Reel title", "Stored XSS", "HTML/script typed into a reel title is shown as text, not run", "Save a reel titled <img src=x onerror=alert(1)><script>alert(2)</script>, open homepage", xss, "Text is escaped (&lt;script&gt;) and never executes",
    "RAW HTML injected" if raw else "escaped", not raw, "Critical", "Never use dangerouslySetInnerHTML for CMS text.")
st = stored("settings:reels")["data"]["reels"]
rec("Security", "Admin → Reels", "Reel link", "Link injection", "A javascript: link is rejected", "Save a reel with link javascript:alert(document.cookie)", "javascript:alert(document.cookie)", "Link stored empty and the reel is not shown", f"stored url='{st[1]['url']}', shown on page={'JS link reel' in hp}",
    st[1]["url"] == "" and "JS link reel" not in hp, "Critical", "-", "The admin form accepts the value but the server stores it as empty and the reel silently disappears; the admin gets no warning (see validation bug).")
rec("Validation", "Admin → Reels", "Reel link", "Server-side validation feedback", "Saving an invalid reel link tells the admin what is wrong", "Enter 'javascript:…' or 'tiktok.com/…' (no https) as the link and Save", "tiktok.com/@qa/video/1", "An error next to the field, or the save is refused",
    f"save returned ok={js_ok}; stored url='{st[1]['url']}'" + ("; the reel silently disappears, no warning to the admin" if js_ok and st[1]['url'] == '' else ""), not (js_ok and st[1]['url'] == ''), "Medium",
    "Return field-level errors from sanitize (or validate https links in the editor) instead of silently storing ''.", "Applies to every https/href/date/email field in the CMS, not only reels.")

r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [{**reel("Img reel", "https://www.tiktok.com/@qa/video/5"), "thumbnail": {"src": "https://evil.example/x.png", "alt": "", "position": ""}},
                                                                            {**reel("Trav reel", "https://www.tiktok.com/@qa/video/6", "r5"), "thumbnail": {"src": "/images/../../.env", "alt": "", "position": ""}}]}})
st = stored("settings:reels")["data"]["reels"]
rec("Security", "Admin → Reels", "Cover image", "Path traversal / external images", "External and ../ image paths are rejected", "Save cover src https://evil.example/x.png and /images/../../.env", "2 bad paths", "Both stored as empty", f"stored: '{st[0]['thumbnail']['src']}', '{st[1]['thumbnail']['src']}'",
    st[0]["thumbnail"]["src"] == "" and st[1]["thumbnail"]["src"] == "", "High", "-")

r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel("x", "https://www.tiktok.com/@qa/video/7")], "evilKey": "<script>"}, "extra": 1})
st = stored("settings:reels")
rec("Database", "CMS storage", "Unknown fields", "Data integrity", "Unknown fields sent by a tampered request are dropped before storing", "Save with extra keys 'evilKey' and 'extra'", "evilKey, extra", "Neither key is stored", f"stored keys: data={list(st['data'].keys())}, top={list(st.keys())}",
    "evilKey" not in st["data"] and "extra" not in st, "High", "-")
r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel(f"R{i}", f"https://www.tiktok.com/@qa/video/{i}", f"rr{i}") for i in range(40)]}})
n = len(stored("settings:reels")["data"]["reels"])
rec("Validation", "Admin → Reels", "List limit", "Boundary", "No more than 24 reels can be stored", "Save 40 reels in one request", "40 items", "Only 24 stored", f"{n} stored", n == 24, "Low", "-", "Extra items are silently dropped; the editor should stop at 24 (check the 'Add reel' button disables).")
r, ok = save("settings:reels", {"version": 1, "hidden": [], "data": {"reels": [reel("T" * 500, "https://www.tiktok.com/@qa/video/1")]}})
n = len(stored("settings:reels")["data"]["reels"][0]["title"])
rec("Validation", "Admin → Reels", "Reel title", "Boundary", "Reel title is capped at 100 characters on the server", "Save a 500-character title", "500 x 'T'", "Stored as 100 characters", f"{n} characters stored", n == 100, "Low", "-")

r = act(s_admin, "/admin", A["save"], ["settings:nope", "{}"])
rec("Validation", "Admin Panel", "Save content", "Invalid input", "Saving to a content type that doesn't exist is refused", "Call save with key 'settings:nope'", "settings:nope", "'This content type doesn't exist'", re.search(r'"error":"([^"]+)"', r.text).group(1) if '"error"' in r.text else r.text[:120], "doesn" in r.text, "Medium", "-")
r = act(s_admin, "/admin", A["save"], ["settings:reels", "{not json"])
rec("Validation", "Admin Panel", "Save content", "Invalid input", "Malformed data is refused without a crash", "Call save with broken JSON", "{not json", "Friendly 'could not be read' error, no 500", f"HTTP {r.status_code}: " + (re.search(r'"error":"([^"]+)"', r.text).group(1) if '"error"' in r.text else r.text[:100]), r.status_code < 500 and "could not be read" in r.text, "Medium", "-")
big = json.dumps({"version": 1, "hidden": [], "data": {"reels": [reel("x" * 100, "https://a.b/" + "y" * 400, f"b{i}") for i in range(4000)]}})
r = act(s_admin, "/admin", A["save"], ["settings:reels", big])
msg = re.search(r'"error":"([^"]+)"', r.text).group(1) if '"error"' in r.text else f"HTTP {r.status_code} {r.text[:150]}"
rec("Validation", "Admin Panel", "Save content", "Boundary", "Saving more than 2 MB of content at once is refused with a clear message", "Save a ~2.3 MB payload", f"{len(big)//1024} KB", "'This page has too much content…'", msg, "too much content" in r.text, "Low",
    "Next.js server actions accept 1 MB by default. Either raise experimental.serverActions.bodySizeLimit to '2mb' or lower the app's own limit to match, so admins see the friendly message.")

# Blog: create, slug uniqueness, new page renders after build
post = lambda t, slug="", date="2026-11-20", i="p1": {"_id": i, "enabled": True, "title": t, "slug": slug, "date": date, "author": "QA", "excerpt": "QA summary", "cover": {"src": "", "alt": "", "position": ""},
                                                    "blocks": [{"_id": f"b{i}", "enabled": True, "heading": "QA heading", "text": "First paragraph.\n\nSecond paragraph."}]}
r, ok = save("settings:blog", {"version": 1, "hidden": [], "data": {"posts": [post("QA Guide to MBBS"), post("QA Guide to MBBS", "", "2026-11-21", "p2"), post("Bad date post", "bad-date", "2026-13-45", "p3")]}})
st = stored("settings:blog")["data"]["posts"]
rec("Functional", "Admin → Blog posts", "Create", "CRUD - Create", "Create blog posts and save", "Admin → Blog posts → Add post → fill title, date, summary, body → Save", "3 posts", "Saved", f"ok={ok}, {len(st)} stored", ok and len(st) == 3, "High", "-")
rec("Database", "Admin → Blog posts", "Web address", "Duplicate data", "Two posts with the same title get different web addresses", "Save two posts titled 'QA Guide to MBBS' with empty web address", "same title x2", "qa-guide-to-mbbs and qa-guide-to-mbbs-2", f"{st[0]['slug']}, {st[1]['slug']}",
    st[0]["slug"] == "qa-guide-to-mbbs" and st[1]["slug"] == "qa-guide-to-mbbs-2", "High", "-")
rec("Validation", "Admin → Blog posts", "Published date", "Invalid input", "An impossible date (2026-13-45) is rejected", "Enter 2026-13-45 as the date", "2026-13-45", "Stored empty (or an error shown)", f"stored '{st[2]['date']}'", st[2]["date"] == "", "Low", "Use a date picker / check month and day ranges.",
    "Date.parse accepts some invalid dates in some engines; this checks the real behaviour.")
r = anon.get(B + "/blog/qa-guide-to-mbbs-2"); r._content = r.content.replace(b"<!-- -->", b"")
rec("Functional", "Blog", "Post page", "CRUD - Read", "A post added after the site was built opens at /blog/<web-address>", "Open /blog/qa-guide-to-mbbs-2 for the FIRST time after saving", "-", "HTTP 200 with the title, paragraphs and BlogPosting JSON-LD",
    f"HTTP {r.status_code}, title={'QA Guide to MBBS' in r.text}, paragraphs={'Second paragraph.' in r.text}, json-ld={'BlogPosting' in r.text}", r.status_code == 200 and "Second paragraph." in r.text, "High",
    "Make sure /blog/[slug] can render params that were not prerendered.")
r = anon.get(B + "/blog")
order = r.text.find("qa-guide-to-mbbs-2") < r.text.find('href="/blog/qa-guide-to-mbbs"') if "qa-guide-to-mbbs-2" in r.text else False
rec("Functional", "Blog", "Blog list", "Sorting", "/blog lists posts newest first", "Open /blog", "dates 2026-11-21 and 2026-11-20", "The 2026-11-21 post comes first", f"newest first={order}", order, "Low", "-")
hp = text("/")
rec("Functional", "Homepage", "Blog section", "CRUD - Read", "Homepage shows 'From our blog' with the latest posts", "Open the homepage", "-", "Section visible with post cards", f"heading={'our' in hp and 'blog' in hp}, post shown={'QA Guide to MBBS' in hp}", "QA Guide to MBBS" in hp, "High", "-")
r = anon.get(B + "/sitemap.xml").text
rec("Functional", "SEO", "Sitemap", "SEO", "New blog posts are listed in sitemap.xml", "Open /sitemap.xml", "-", "Contains /blog/qa-guide-to-mbbs", "listed" if "/blog/qa-guide-to-mbbs" in r else "not listed", "/blog/qa-guide-to-mbbs" in r, "Low",
    "sitemap.xml is cached; check it refreshes when posts are saved (tag the sitemap with the blog cache tag).")

# Videos
vid = lambda t, u, i: {"_id": i, "enabled": True, "title": t, "url": u, "description": "QA"}
r, ok = save("settings:videos", {"version": 1, "hidden": [], "data": {"videos": [vid("QA YouTube", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "v1"), vid("QA Vimeo", "https://vimeo.com/76979871", "v2"), vid("QA Other", "https://example.com/video", "v3")]}})
vp = text("/videos")
rec("Functional", "Admin → Videos", "Create", "CRUD - Create/Read", "YouTube and Vimeo links play on /videos; other links show 'Watch video'", "Add 3 videos (YouTube, Vimeo, other site), Save, open /videos", "3 links", "2 embedded players + 1 link",
    f"youtube embed={'youtube-nocookie.com/embed/dQw4w9WgXcQ' in vp}, vimeo embed={'player.vimeo.com/video/76979871' in vp}, other link={'https://example.com/video' in vp}",
    ok and "youtube-nocookie.com/embed/dQw4w9WgXcQ" in vp and "player.vimeo.com/video/76979871" in vp and "https://example.com/video" in vp, "High", "-")
r, ok = save("settings:videos", {"version": 1, "hidden": [], "data": {"videos": [vid("Plain http", "http://www.youtube.com/watch?v=dQw4w9WgXcQ", "v9")]}})
rec("Validation", "Admin → Videos", "Video link", "Invalid input", "An http:// (not https) video link is rejected", "Save a video link starting with http://", "http://www.youtube.com/…", "Rejected / blanked", f"stored url='{stored('settings:videos')['data']['videos'][0]['url']}'", stored("settings:videos")["data"]["videos"][0]["url"] == "", "Low", "-")

# Restore defaults
r = act(s_admin, "/admin", A["reset"], ["settings:videos"])
rec("Functional", "Admin Panel", "Restore original", "CRUD - Delete", "'Restore original' removes saved content and returns to defaults", "Admin → Videos → Restore original → confirm", "-", "Saved file removed; /videos shows no videos", f"ok={'\"ok\":true' in r.text}, file removed={stored('settings:videos') is None}, page empty={'QA YouTube' not in anon.get(B + '/videos').text}",
    '"ok":true' in r.text and stored("settings:videos") is None, "Medium", "-")

# ───────────────────────────── Admin users ─────────────────────────────
def user_msg(r):
    if r is None: return "form not found"
    m = re.search(r'role="(?:alert|status)"[^>]*>([^<]+)<', r.text)
    return m.group(1) if m else f"HTTP {r.status_code}"


cases = [("Short password", {"name": "QA New", "email": "qa.new@example.test", "password": "short1"}, "Use at least 10 characters."),
         ("No digits", {"name": "QA New", "email": "qa.new@example.test", "password": "onlyletterspassword"}, "Use a mix of letters and numbers."),
         ("Bad email", {"name": "QA New", "email": "not-an-email", "password": "GoodPass2026"}, "Enter a valid email address."),
         ("Empty name", {"name": "", "email": "qa.new@example.test", "password": "GoodPass2026"}, "Enter a name."),
         ("Duplicate email", {"name": "Dup", "email": ADMIN[0].upper(), "password": "GoodPass2026"}, "An admin with this email already exists.")]
for label, vals, want in cases:
    r = form_post(s_admin, "/admin/users", "password", vals)
    rec("Validation", "Admin Users", "Add admin", "Server-side validation", f"Add admin: {label} is refused", "Admin users → Add admin → enter the data → Add", json.dumps(vals), f"'{want}'", user_msg(r), want in (r.text if r is not None else ""), "Medium", "-")
r = form_post(s_admin, "/admin/users", "password", {"name": "QA Third", "email": "qa.third@example.test", "password": "GoodPass2026"})
rec("Functional", "Admin Users", "Add admin", "CRUD - Create", "Add a new admin with valid details", "Admin users → Add admin → valid name, email, password → Add", "qa.third@example.test", "'QA Third can now sign in.'", user_msg(r), "can now sign in" in (r.text if r is not None else ""), "High", "-")
_, r = login("qa.third@example.test", "GoodPass2026", xff="10.0.2.1")
rec("Functional", "Admin Users", "Add admin", "CRUD - Read", "The new admin can sign in", "Sign in as the new admin", "qa.third@example.test", "Signed in", f"cookie set={'cen_admin=' in r.headers.get('set-cookie','')}", "cen_admin=" in r.headers.get("set-cookie", ""), "High", "-")
r = act(s_admin, "/admin/users", A["delete"], [admins[0]["id"]])
rec("Validation", "Admin Users", "Remove admin", "Business logic", "An admin cannot remove their own account", "Click Remove on your own row", "own id", "'You can't remove your own account.'", re.search(r'"error":"([^"]+)"', r.text).group(1) if '"error"' in r.text else r.text[:100], "remove your own" in r.text, "High", "-")
third = next(a for a in json.load(open("E:/Work/Cerebellum/.data/admins.json")) if a["email"] == "qa.third@example.test")
r = act(s_admin, "/admin/users", A["delete"], [third["id"]])
gone = all(a["email"] != "qa.third@example.test" for a in json.load(open("E:/Work/Cerebellum/.data/admins.json")))
rec("Functional", "Admin Users", "Remove admin", "CRUD - Delete", "Remove another admin", "Click Remove on QA Third and confirm", "-", "'Admin removed.' and the account is gone", f"success={'Admin removed' in r.text}, gone={gone}", gone, "High", "-")
r = act(s_admin, "/admin/users", A["delete"], ["../../etc/passwd"])
rec("Security", "Admin Users", "Remove admin", "IDOR / input tampering", "Removing a made-up admin id does nothing harmful", "Call remove with id '../../etc/passwd'", "../../etc/passwd", "'This admin no longer exists.'", re.search(r'"error":"([^"]+)"', r.text).group(1) if '"error"' in r.text else r.text[:100], "no longer exists" in r.text, "Medium", "-")

r = form_post(s_admin, "/admin/users", "current", {"current": "WrongCurrent1", "next": "NewQaPass2026"})
rec("Validation", "Admin Users", "Change password", "Server-side validation", "Wrong current password is refused", "Change password → wrong current password", "WrongCurrent1", "'Your current password is incorrect.'", user_msg(r), "current password is incorrect" in (r.text if r is not None else ""), "High", "-")
r = form_post(s_admin, "/admin/users", "current", {"current": ADMIN[1], "next": "short"})
rec("Validation", "Admin Users", "Change password", "Server-side validation", "A weak new password is refused", "Change password → new password 'short'", "short", "'Use at least 10 characters.'", user_msg(r), "at least 10" in (r.text if r is not None else ""), "Medium", "-")
before = s_admin.cookies.get("cen_admin")
r = form_post(s_admin, "/admin/users", "current", {"current": ADMIN[1], "next": "NewQaPass2026"})
rec("Functional", "Admin Users", "Change password", "CRUD - Update", "Change password with valid details", "Change password → correct current + strong new password", "NewQaPass2026", "'Password changed.'", user_msg(r), "Password changed" in (r.text if r is not None else ""), "High", "-")
_, r = login(ADMIN[0], ADMIN[1], xff="10.0.3.1")
old_refused = "cen_admin=" not in r.headers.get("set-cookie", "")
_, r = login(ADMIN[0], "NewQaPass2026", xff="10.0.3.2")
rec("Functional", "Admin Users", "Change password", "Regression", "After a change, only the new password works", "Sign in with the old password, then the new one", "old / new", "Old refused, new accepted", f"old refused={old_refused}, new accepted={'cen_admin=' in r.headers.get('set-cookie','')}", old_refused and "cen_admin=" in r.headers.get("set-cookie", ""), "High", "-")
s_old = requests.Session(); s_old.cookies.set("cen_admin", before)
rec("Auth", "Admin Users", "Change password", "Session revocation", "Sessions opened before a password change stop working", "Reuse a cookie from before the password change", "pre-change cookie", "Refused", "STILL works" if is_admin_page(s_old.get(B + "/admin")) else "refused",
    not is_admin_page(s_old.get(B + "/admin")), "Medium", "Same fix as session revocation on logout (session version).")

# ───────────────────────────── Uploads ─────────────────────────────
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")


def up(name, data, mime, s=None):
    return (s or s_admin).post(B + "/api/admin/media", files={"file": (name, data, mime)}, headers={"Origin": B})


r = up("ok.png", PNG, "image/png")
src = r.json().get("src") if r.headers.get("content-type", "").startswith("application/json") else None
rec("Upload", "Media upload", "Image upload", "Valid file", "Upload a real PNG image", "In any image field click Upload and choose a PNG", "1x1 PNG", "HTTP 200 with a /media/… address", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 200 and bool(src), "High", "-")
if src:
    g = anon.get(B + src)
    rec("Upload", "Media upload", "Serve image", "Valid file", "The uploaded image is served with safe headers", f"Open {src}", src, "HTTP 200, Content-Type image/png, nosniff, restrictive CSP", f"HTTP {g.status_code}, {g.headers.get('content-type')}, nosniff={g.headers.get('x-content-type-options')}, csp={g.headers.get('content-security-policy')}",
        g.status_code == 200 and g.headers.get("content-type") == "image/png" and "default-src 'none'" in g.headers.get("content-security-policy", ""), "High", "-")
jpg = b"\xff\xd8\xff\xe0" + b"0" * 200
for label, (name, data, mime), want, code in [
    ("SVG with a script", ("x.svg", b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', "image/svg+xml"), "415 refused", 415),
    ("HTML file renamed to .png", ("evil.png", b"<html><script>alert(1)</script></html>", "image/png"), "415 refused", 415),
    ("PHP file renamed to .jpg", ("shell.jpg", b"<?php system($_GET['c']); ?>", "image/jpeg"), "415 refused", 415),
    ("PDF document", ("doc.pdf", b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "application/pdf"), "415 refused", 415),
    ("Empty file", ("empty.png", b"", "image/png"), "415 refused", 415),
    ("Real JPEG sent with a wrong browser type", ("photo.txt", jpg, "text/plain"), "Accepted as JPEG (type is detected from the bytes)", 200),
    ("6 MB image (over the 5 MB limit)", ("big.png", PNG + b"0" * (6 * 1024 * 1024), "image/png"), "413 'Images must be 5 MB or smaller.'", 413),
]:
    r = up(name, data, mime)
    rec("Upload", "Media upload", "Image upload", "File type / size validation", f"Upload: {label}", "Upload the file through the image field (or POST /api/admin/media)", f"{name}, {len(data)} bytes, sent as {mime}", want, f"HTTP {r.status_code} {r.text[:80]}", r.status_code == code, "High", "-")
r = s_admin.post(B + "/api/admin/media", files={"other": ("a", b"x")}, headers={"Origin": B})
rec("Upload", "Media upload", "Image upload", "Invalid request", "Upload with no file is refused", "POST the form without a 'file' field", "-", "400 'Choose an image to upload.'", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 400, "Medium", "-")
r = s_admin.post(B + "/api/admin/media", data="not a form", headers={"Content-Type": "text/plain", "Origin": B})
rec("Upload", "Media upload", "Image upload", "Invalid request", "A non-form request body is refused", "POST plain text", "text/plain", "400 'Invalid upload.'", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 400, "Medium", "-")
r = up("poly.png", PNG + b"<html><script>alert(1)</script></html>", "image/png")
psrc = r.json().get("src") if r.status_code == 200 else None
g = anon.get(B + psrc) if psrc else None
rec("Upload", "Media upload", "Image upload", "Polyglot file", "A PNG with HTML hidden after the image data cannot run as a web page", "Upload PNG bytes followed by <script>, open the /media address", "PNG + HTML", "Served as image/png with nosniff and CSP default-src 'none', so the script cannot run",
    f"upload HTTP {r.status_code}; served {g.headers.get('content-type') if g else '-'}, csp={g.headers.get('content-security-policy') if g else '-'}", bool(g and g.headers.get("content-type") == "image/png" and "default-src 'none'" in g.headers.get("content-security-policy", "")), "High", "-")
for p in ["/media/..%2f..%2fadmins.json", "/media/..%2F.env", "/media/aaaaaaaaaaaaaaaaaaaaaaaa.png", "/media/x.svg"]:
    r = anon.get(B + p)
    rec("Upload", "Media serving", "/media/[id]", "Path traversal", f"{p} does not expose files", f"Open {p}", p, "HTTP 404 (or 400), no file contents", f"HTTP {r.status_code}, {len(r.content)} bytes", r.status_code in (400, 404) and b"passwordHash" not in r.content, "Critical", "Keep the strict id regex in readMedia.")
big = PNG + b"0" * (30 * 1024 * 1024)
t = time.perf_counter(); r = up("huge.png", big, "image/png"); dt = time.perf_counter() - t
rec("Upload", "Media upload", "Image upload", "Resource limits", "A 30 MB upload is refused early", "POST a 30 MB file as a signed-in admin", "30 MB", "Rejected quickly with 413",
    f"HTTP {r.status_code} after {dt:.1f}s (whole body is read into memory before the size check)", r.status_code == 413, "Low", "Check Content-Length before calling request.formData(), and/or set a body limit in the reverse proxy (e.g. client_max_body_size 6m).",
    "Only signed-in admins can reach this, so risk is low.")

# ───────────────────────────── Enquiry API ─────────────────────────────
def enquiry(body, ip, ctype="application/json"):
    data = body if isinstance(body, (str, bytes)) else json.dumps(body)
    return anon.post(B + "/api/enquiry", data=data, headers={"Content-Type": ctype, "X-Forwarded-For": ip})


contact = {"type": "contact", "fullName": "QA Tester", "phone": "+977 9800000000", "email": "qa@example.test", "consent": True, "subject": "QA test", "message": "This is an automated QA test message."}
counsel = {"type": "counselling", "fullName": "QA Tester", "phone": "+977 9800000000", "email": "qa@example.test", "consent": True, "location": "Kathmandu", "qualification": "Completed Grade 12 / A-levels (or equivalent)",
           "programme": "MBBS / General Medicine", "country": "China", "intake": "Next available intake", "mode": "Online (video)"}
ipn = [100]


def nip():
    ipn[0] += 1; return f"10.9.0.{ipn[0]}"


r = anon.get(B + "/api/enquiry")
rec("API", "Enquiry API", "/api/enquiry", "HTTP method", "GET is not allowed", "GET /api/enquiry", "-", "HTTP 405", f"HTTP {r.status_code}", r.status_code == 405, "Low", "-")
r = enquiry("fullName=x", nip(), "application/x-www-form-urlencoded")
rec("API", "Enquiry API", "/api/enquiry", "Content type", "Non-JSON body is refused", "POST form-encoded data", "x-www-form-urlencoded", "415 unsupported_media_type", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 415, "Low", "-")
r = enquiry("{bad", nip())
rec("API", "Enquiry API", "/api/enquiry", "Malformed input", "Broken JSON is refused", "POST '{bad'", "{bad", "400 invalid_json", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 400, "Medium", "-")
r = enquiry({}, nip())
rec("API", "Enquiry API", "/api/enquiry", "Required fields", "Empty body is refused with field errors", "POST {}", "{}", "422 validation_failed", f"HTTP {r.status_code} {r.text[:100]}", r.status_code == 422, "Medium", "-")
for label, patch, field in [("Invalid email", {"email": "not-an-email"}, "email"), ("Phone with letters", {"phone": "call me maybe"}, "phone"), ("Consent not given", {"consent": False}, "consent"),
                            ("Name of 1 character", {"fullName": "A"}, "fullName"), ("Message under 10 characters", {"message": "hi"}, "message"), ("Message over 2000 characters", {"message": "x" * 2001}, "message"),
                            ("Subject of 1 character", {"subject": "a"}, "subject"), ("Name over 100 characters", {"fullName": "N" * 101}, "fullName")]:
    r = enquiry({**contact, **patch}, nip())
    rec("Validation", "Contact form", field, "Server-side validation", f"Contact form: {label} is refused", "Submit the contact form via the API with this value", json.dumps(patch)[:80], f"422 with an error on '{field}'", f"HTTP {r.status_code}, fields={[i['path'] for i in r.json().get('issues', [])] if r.status_code == 422 else r.text[:60]}",
        r.status_code == 422 and any(i["path"] == field for i in r.json().get("issues", [])), "Medium", "-")
for label, patch, field in [("Unknown counselling mode", {"mode": "Carrier pigeon"}, "mode"), ("Programme not offered in that country", {"programme": "Nursing", "country": "Russia"}, "country"),
                            ("Made-up programme", {"programme": "Astrology", "country": "Georgia"}, "country"), ("Location of 1 character", {"location": "K"}, "location")]:
    r = enquiry({**counsel, **patch}, nip())
    rec("Validation", "Book counselling form", field, "Server-side validation", f"Counselling form: {label} is refused", "Submit the counselling form via the API with this value", json.dumps(patch)[:80], f"422 with an error on '{field}'",
        f"HTTP {r.status_code}, {r.text[:140]}", r.status_code == 422, "Medium", "-")
r = enquiry({**contact, "website": "http://spam.example"}, nip())
rec("Security", "Contact form", "Honeypot", "Spam protection", "A bot filling the hidden 'website' field is rejected", "POST with website filled", "website=http://spam.example", "Rejected (400 or 422), nothing sent", f"HTTP {r.status_code} {r.text[:80]}", r.status_code in (400, 422), "Medium", "-")
r = enquiry(contact, nip())
rec("API", "Enquiry API", "Delivery", "Configuration", "Valid enquiry with no delivery method configured gives an honest error (not a fake success)", "Submit a valid contact message (no RESEND/WEBHOOK env vars on this test server)", "valid contact", "503 not_configured; the form shows the 'not connected' message",
    f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 503 and "not_configured" in r.text, "High", "-", "Real delivery (email/webhook) could not be tested: no RESEND_API_KEY / ENQUIRY_WEBHOOK_URL is configured locally. See the Blocked test below.")
rec("API", "Enquiry API", "Delivery", "Integration", "A valid enquiry reaches the office inbox / CRM", "On the live site, submit the contact form and the counselling form with test data; check the inbox", "valid data marked TEST", "Email (or webhook) received with every field", "Not executed: no delivery method configured locally and no access to the live site or inbox", "Blocked", remarks="Needs: live site URL and access to the receiving inbox / webhook.")
r = enquiry(counsel, nip())
rec("API", "Enquiry API", "Counselling", "Valid input", "A valid counselling request passes validation", "Submit a valid counselling request", "MBBS + China", "Passes validation (503 here only because delivery is not configured)", f"HTTP {r.status_code} {r.text[:60]}", r.status_code == 503, "High", "-")
for label, val in [("SQL injection", "'; DROP TABLE cms_content; --"), ("XSS", "<script>alert(1)</script>"), ("NoSQL operator", {"$gt": ""})]:
    body = {**contact, "fullName": val} if not isinstance(val, dict) else {**contact, "email": val}
    r = enquiry(body, nip())
    rec("Security", "Enquiry API", "Injection", label, f"{label} payload in the enquiry is handled safely", "Submit the payload in a form field", str(val), "No 500 error; validated or passed through as plain text (no database is used for enquiries)", f"HTTP {r.status_code} {r.text[:80]}", r.status_code < 500 or r.status_code == 503, "High", "-",
        "Enquiries are not stored in a database; email HTML is escaped with escapeHtml().")
ip = nip(); seq = []
for i in range(7):
    seq.append(enquiry(contact, ip).status_code)
rec("API", "Enquiry API", "Rate limit", "Rate limiting", "More than 5 submissions in 10 minutes from one visitor are refused", "Submit 7 valid enquiries from the same IP", "7 requests", "6th and 7th get 429", f"status codes: {seq}", seq[5] == 429 and seq[6] == 429, "Medium", "-")
seq2 = [enquiry(contact, nip()).status_code for _ in range(7)]
rec("Security", "Enquiry API", "Rate limit", "Rate-limit bypass", "Changing X-Forwarded-For does not bypass the form rate limit", "Submit 7 enquiries, each with a different X-Forwarded-For value", "7 different IPs", "Requests after the 5th are refused", f"status codes: {seq2}", 429 in seq2, "Medium",
    "Only trust the X-Forwarded-For value written by your own proxy; turn on Cloudflare Turnstile (TURNSTILE_SECRET_KEY) for real spam protection.", "Limit is also in memory, per server process, and resets on restart.")
seq3 = [anon.post(B + "/api/enquiry", data=json.dumps(contact), headers={"Content-Type": "application/json"}).status_code for _ in range(7)]
rec("API", "Enquiry API", "Rate limit", "Rate limiting", "Requests without X-Forwarded-For are still rate-limited", "Submit 7 enquiries without any X-Forwarded-For header", "no header", "Limited after 5", f"status codes: {seq3}" + ("" if 429 in seq3 else " (code skips the limiter when no IP header: `if (ip && rateLimited(ip))`)"),
    429 in seq3, "Medium", "Fall back to the socket address or a global limit when no proxy header is present.", "Matters if the app is ever reachable without the reverse proxy in front.")
r = anon.post(B + "/api/enquiry", data=json.dumps({**contact, "message": "x" * 1900, "pad": "y" * (8 * 1024 * 1024)}), headers={"Content-Type": "application/json", "X-Forwarded-For": nip()})
rec("API", "Enquiry API", "Body size", "Resource limits", "A very large (8 MB) request body is refused", "POST an 8 MB JSON body", "8 MB", "Refused (413) before parsing", f"HTTP {r.status_code} {r.text[:80]}", r.status_code == 413, "Low",
    "Check Content-Length and refuse bodies over ~32 KB before request.json(); also cap in the reverse proxy.", "The extra 'pad' field is dropped by Zod, but the whole body is first read into memory.")

# ───────────────────────────── Admin settings pages: inventory checks ─────────────────────────────
for slug in ["home", "about", "admission-process", "destinations", "programmes", "scholarships", "faqs", "success-stories", "contact", "book-counselling", "privacy-policy", "terms-and-conditions"]:
    r = s_admin.get(B + f"/admin/pages/{slug}")
    rec("Functional", f"Admin → Pages → {slug}", "Open editor", "Page load", f"The editor for page '{slug}' opens", f"Admin → Pages → {slug}", "-", "HTTP 200 with the section editor", f"HTTP {r.status_code}", r.status_code == 200 and "Save" in r.text, "High", "-")
for slug in ["destinations", "destination-page", "programmes", "programme-page", "site", "team", "steps", "guidance", "reels", "videos", "blog"]:
    r = s_admin.get(B + f"/admin/settings/{slug}")
    rec("Functional", f"Admin → Shared content → {slug}", "Open editor", "Page load", f"The editor for '{slug}' opens", f"Admin → {slug}", "-", "HTTP 200 with the editor", f"HTTP {r.status_code}", r.status_code == 200 and "Save" in r.text, "High", "-")
r = s_admin.get(B + "/admin/settings/nope")
rec("Functional", "Admin Panel", "Unknown editor", "Error handling", "An unknown settings address shows 'not found'", "Open /admin/settings/nope", "-", "HTTP 404", f"HTTP {r.status_code}", r.status_code == 404, "Low", "-")

json.dump(R, open("results.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
print("\nTOTAL", len(R), {k: sum(1 for x in R if x["status"] == k) for k in ["Pass", "Fail", "Blocked", "Not Tested"]})
