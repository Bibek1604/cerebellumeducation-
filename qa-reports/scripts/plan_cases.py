"""Test-plan content: every case a manual tester runs in the Admin Panel and on the public site.
Each case: (type, scenario, precondition, steps, data, expected, remarks)."""

SAVE = "Click 'Save & publish' (top of the editor)."
VIEW = "Open the public page in a new tab and refresh (Ctrl+F5)."
LIVE_WARN = "Use TEST data only and delete it afterwards."

def crud(item, where, page, create_data, edit_field, edit_value, extra=()):
    """Standard Create / Read / Update / Hide / Reorder / Delete set for a list in the Admin Panel."""
    return [
        ("Create", f"Add a new {item}", "Signed in as admin", f"1. Go to {where}.\n2. Click 'Add {item}' at the bottom of the list.\n3. Fill in the fields with the example data.\n4. {SAVE}\n5. {VIEW}",
         create_data, f"'Saved' message. The new {item} appears on {page} exactly as typed.", LIVE_WARN),
        ("Read", f"Saved {item} is still there after reloading the editor", f"A TEST {item} was added", f"1. Reload the {where} editor (F5).\n2. Find the TEST {item}.", "-", "All fields show the saved values (nothing lost or changed).", ""),
        ("Update", f"Edit an existing {item}", f"A TEST {item} exists", f"1. In {where}, open the TEST {item}.\n2. Change '{edit_field}'.\n3. {SAVE}\n4. {VIEW}", f"{edit_field}: {edit_value}", f"The change shows on {page}; nothing else changed.", ""),
        ("Hide", f"Hide a {item} with its tick box", f"A TEST {item} exists", f"1. Untick the box at the left of the TEST {item} ('Shown on website. Untick to hide.').\n2. {SAVE}\n3. {VIEW}\n4. Tick it again and save.", "-",
         f"While unticked the {item} is not on {page}; it comes back when ticked again. Its content is kept.", ""),
        ("Reorder", f"Change the order of {item}s", f"At least 2 {item}s", f"1. Click the 'Move up' arrow on the second {item}.\n2. {SAVE}\n3. {VIEW}", "-", f"The order on {page} matches the new order.", ""),
        ("Delete", f"Remove a {item}", f"A TEST {item} exists", f"1. Click 'Remove {item}' (bin icon) on the TEST {item}.\n2. {SAVE}\n3. {VIEW}", "-", f"The {item} is gone from the editor and from {page}.", ""),
        *extra,
    ]


ADMIN = {}

ADMIN["Admin - Login & Users"] = [
    ("Login", "Open the login page", "Signed out", "1. Go to <site>/admin/login.", "-", "Login form with Email, Password and 'Sign in' button.", ""),
    ("Login", "Sign in with correct details", "Have a test admin account", "1. Enter email and password.\n2. Click 'Sign in'.", "Email: qa.tester@yourcompany.com\nPassword: (given by owner)", "Dashboard opens: 'Welcome, <name>' with 'Pages' and 'Shared content' cards.", ""),
    ("Validation", "Wrong password", "Signed out", "1. Enter the right email and a wrong password.\n2. Click 'Sign in'.", "Password: WrongPass123", "Red message 'Incorrect email or password.' Not signed in.", ""),
    ("Validation", "Email that has no account", "Signed out", "1. Enter an unknown email and any password.", "nobody@example.com / Test12345", "Same message 'Incorrect email or password.' (must not say the email doesn't exist).", ""),
    ("Validation", "Empty form", "Signed out", "1. Click 'Sign in' with both fields empty.", "(empty)", "Browser asks you to fill in the fields; nothing is sent.", ""),
    ("Validation", "Email in capitals", "Signed out", "1. Type the email in CAPITAL letters with the right password.", "QA.TESTER@YOURCOMPANY.COM", "Signs in normally.", ""),
    ("Security", "Lockout after repeated wrong passwords", "Signed out. Use YOUR OWN test account only.", "1. Enter a wrong password 6 times.\n2. On the 7th try use the correct password.", "6 x WrongPass123, then the right one", "'Too many attempts. Please wait 15 minutes and try again.' Not signed in.", "Wait 15 minutes before testing other login cases."),
    ("Security", "Admin pages need sign-in", "Signed out (or use a private window)", "1. Type these addresses directly: /admin, /admin/pages/home, /admin/settings/reels, /admin/users", "-", "Every one goes to the login page.", ""),
    ("Logout", "Sign out", "Signed in", "1. Click 'Log out' in the sidebar.\n2. Press the browser Back button and refresh.", "-", "Login page shows; admin content is not visible.", "Known issue BUG-002: a copied cookie still works after logout (developer test)."),
    ("Session", "Session ends after 8 hours", "Signed in", "1. Sign in, leave the tab open for 8+ hours.\n2. Click any admin link.", "-", "You are asked to sign in again.", "Optional - long test."),
    ("Create", "Add a new admin", "Signed in", "1. Sidebar > 'Admin users'.\n2. Under 'Add an admin' fill Name, Email, Temporary password.\n3. Click 'Add admin'.", "Name: TEST Helper\nEmail: test.helper@yourcompany.com\nPassword: Welcome2026a", "'TEST Helper can now sign in.' New row in the admin list.", "Delete this admin at the end (Delete case below)."),
    ("Read", "New admin can sign in", "TEST Helper added", "1. In a private window sign in as TEST Helper.", "test.helper@yourcompany.com / Welcome2026a", "Dashboard opens.", ""),
    ("Validation", "Password too short", "Signed in", "1. Add an admin with a short password.", "Password: abc123", "'Use at least 10 characters.' Admin not added.", ""),
    ("Validation", "Password without numbers", "Signed in", "1. Add an admin with only letters.", "Password: onlyletterspass", "'Use a mix of letters and numbers.'", ""),
    ("Validation", "Invalid email", "Signed in", "1. Add an admin with a bad email.", "Email: helper@", "Browser or page says the email is invalid. Admin not added.", ""),
    ("Validation", "Duplicate email", "TEST Helper exists", "1. Add another admin with the same email.", "Email: test.helper@yourcompany.com", "'An admin with this email already exists.'", ""),
    ("Validation", "Empty name", "Signed in", "1. Leave Name empty and click 'Add admin'.", "(empty name)", "Browser asks for the name, or 'Enter a name.'", ""),
    ("Update", "Change your own password", "Signed in as the TEST account", "1. 'Change your password': enter current and new password.\n2. Click 'Change password'.\n3. Log out, sign in with the NEW password.", "Current: (yours)\nNew: NewTest2026x", "'Password changed.' Old password no longer works; new one does.", "Tell the owner the new password."),
    ("Validation", "Wrong current password", "Signed in", "1. Change password with a wrong 'current password'.", "Current: Wrong12345", "'Your current password is incorrect.'", ""),
    ("Validation", "Weak new password", "Signed in", "1. Change password to a weak one.", "New: short", "'Use at least 10 characters.'", ""),
    ("Delete", "Remove another admin", "TEST Helper exists", "1. Click 'Remove' on TEST Helper's row.\n2. Confirm the pop-up.", "-", "'Admin removed.' Row disappears; TEST Helper can no longer sign in.", ""),
    ("Business rule", "Cannot remove yourself", "Signed in", "1. Look at your own row (marked 'You').", "-", "No Remove button for yourself, or 'You can't remove your own account.'", ""),
]

ADMIN["Admin - Page Editor"] = [
    ("Read", "Every page editor opens", "Signed in", "1. Dashboard > open each card under 'Pages': Homepage, About Us, Admission Process, Study Destinations, Programmes, Scholarships, FAQs, Success Stories, Contact, Book Counselling, Privacy Policy, Terms & Conditions.", "-", "Each editor opens with its sections and a 'Save & publish' button. No error.", ""),
    ("Update", "Edit a heading", "Signed in", "1. Pages > About Us.\n2. In 'Introduction' change the Heading (add ' TEST' at the end).\n3. Save & publish.\n4. Open /about.", "Heading: ...existing text... TEST", "/about shows the new heading. Then remove ' TEST' and save again.", ""),
    ("Update", "Highlight words with *asterisks*", "Signed in", "1. In any heading marked as highlightable, wrap one word in *stars*.\n2. Save & publish, view the page.", "Why Students *Trust Us*", "The starred words show in the orange/blue gradient; the stars themselves are not shown.", "Undo afterwards."),
    ("Hide", "Hide a whole section", "Signed in", "1. Pages > Homepage.\n2. Untick the tick box on the 'FAQs' section header (it shows 'Hidden').\n3. Save & publish, view the homepage.\n4. Tick again and save.", "-", "The section disappears from the homepage, then comes back with its content.", ""),
    ("Hide", "Hide one element ('Show on website' tick)", "Signed in", "1. In a section, untick 'Show on website' next to an element such as 'Intro text'.\n2. Save & publish, view.", "-", "Only that element is hidden; the rest of the section stays.", "Undo afterwards."),
    ("Reorder", "Move a section", "Signed in", "1. Pages > Homepage.\n2. Click 'Move section down' on 'Videos'.\n3. Save & publish, view.\n4. Move it back.", "-", "Sections appear in the new order. Background colours still alternate white/grey.", ""),
    ("Business rule", "Page header cannot be moved or removed", "Signed in", "1. Look at the first section (Hero / Page header).", "-", "No move or remove buttons on it.", ""),
    ("Create", "Add a new section", "Signed in", "1. Pages > About Us.\n2. Scroll to 'Add a section:', choose 'Text block'.\n3. Click 'Add to end of page'.\n4. Enter a heading and paragraph. Save & publish, view /about.", "Heading: TEST section\nParagraph: This is a test paragraph.", "New block appears at the bottom of /about.", "Delete it in the next case."),
    ("Delete", "Remove a section", "TEST section exists", "1. Click 'Remove section' (bin) on the TEST section.\n2. Confirm the pop-up.\n3. Save & publish, view.", "-", "Section gone from the page.", ""),
    ("Create", "Add each generic section type", "Signed in", "1. Add 'Icon cards', 'Checklist' and 'Highlighted statement' to a page.\n2. Fill with test text, save, view.\n3. Remove them and save.", "Card: icon Star, title TEST card, text Test.", "Each section type displays correctly, then is removed.", ""),
    ("Validation", "Text length limits", "Signed in", "1. Paste a very long text (500+ characters) into a short field such as a card title.", "Paste: 'Lorem ipsum...' x 10", "The field stops accepting text at its limit; saved text is cut to the limit, not an error.", ""),
    ("Validation", "Button link must be a page or https link", "Signed in", "1. In a button (link) field set the address to an invalid value.\n2. Save & publish, view.", "Address: javascript:alert(1)   or   www.google.com", "Expected: a warning. Known issue BUG-005: it saves but the button disappears silently. Record what happens.", "Valid examples: /book-counselling, https://example.com"),
    ("Unsaved", "Leaving without saving", "Signed in", "1. Change a heading.\n2. Do NOT save; click another page in the sidebar.\n3. Come back.", "-", "Ideally a warning before leaving; the unsaved change must NOT appear on the website.", "Record whether a warning appears."),
    ("Restore", "'Restore original' (TEST/STAGING SITE ONLY)", "A staging copy of the site", "1. On a page with edits, click 'Restore original'.\n2. Confirm the pop-up.\n3. View the page.", "-", "The page goes back to the original built-in content; your saved edits are gone.", "NEVER do this on the live site - it deletes the real saved content."),
    ("Security", "Code typed into text is not run", "Signed in", "1. Put this in a heading, save, view the page.\n2. Remove it afterwards.", "<script>alert(1)</script><b>bold?</b>", "The text appears literally (you can see < and >). No pop-up, nothing turns bold.", "If a pop-up appears: stop and report as Critical."),
]

ADMIN["Admin - Shared Content"] = (
    [("Read", "Every shared-content editor opens", "Signed in", "1. Dashboard > open each card under 'Shared content': Countries, Country page layout, Programme list, Programme page layout, Contact details & company, Team, Admission steps, Nepal & India guidance, Reels, Videos, Blog posts.", "-", "Each opens without error with a 'Save & publish' button.", "")]
    + crud("country", "Shared content > Countries", "/destinations and the new country page", "Country name: TEST Land\nWeb address: test-land\nShort line: Test country\nCountry code: TL\nProgrammes offered: MBBS, duration 6 years, English", "Short line on the country card", "Updated test line",
           extra=[("Read", "New country appears everywhere", "TEST Land added", "1. Check: top menu 'Study Destinations' dropdown, /destinations, footer, homepage destinations, the country select in /book-counselling.", "-", "TEST Land is listed in all of them and /destinations/test-land opens.", "Known issue BUG-003-type: a newly added page may show 'not found' on its very first visit - refresh once and note it."),
                  ("Validation", "Duplicate web address", "TEST Land exists", "1. Add a second country with the same web address.\n2. Save.", "Web address: test-land", "Saved with a different address (e.g. test-land-2); both pages open.", ""),
                  ("Validation", "Web address with spaces/capitals", "Signed in", "1. Enter a messy web address and save.", "Web address: Test Land!!", "Converted to 'test-land' style (lowercase, dashes).", ""),
                  ("Validation", "Verified-on date format", "Signed in", "1. In 'Verified costs' enter an invalid date.", "Verified on: 2026-13-45  /  12-05-2026", "Not accepted (blank or error). Correct format 2026-05-12 is accepted.", ""),
                  ("Validation", "Colour fields", "Signed in", "1. Enter an invalid artwork colour.", "Artwork colour 1: red   (valid: #1f3a5f)", "Only #rrggbb colours are kept.", "")])
    + crud("programme", "Shared content > Programme list", "/programs and the programme page", "Full name: TEST Programme\nShort name: TESTP\nWeb address: test-programme\nShort summary: Test only\nTypical duration: 4 years", "Short summary (cards and menu)", "Edited summary",
           extra=[("Read", "Programme appears in menus and the counselling form", "TEST Programme added and offered by a country", "1. Check the 'Programmes' menu, /programs, and the programme select on /book-counselling.", "-", "TEST Programme is listed and /programs/test-programme opens.", "")])
    + [("Update", "Contact details", "Signed in (staging preferred)", "1. Shared content > Contact details & company.\n2. Change 'Opening hours' line 1.\n3. Save, then check the footer, /contact and the top bar.", "Opening hours: Sunday - Friday: 10:00 - 17:00 TEST", "New hours show in all places. Change back afterwards.", "On the live site, only change and restore immediately."),
       ("Validation", "Phone for dialling", "Signed in", "1. Enter letters in 'Phone (for dialling, digits with +)'. Save.", "Phone (for dialling): call-me   (valid: +97714123456)", "Invalid value is not kept; valid value makes the phone link work (tap on mobile opens the dialler).", ""),
       ("Validation", "WhatsApp number", "Signed in", "1. Enter a WhatsApp number with + and spaces. Save, click the WhatsApp button on the site.", "+977 980-000-0000", "Stored as digits only (9779800000000); the WhatsApp button opens the right chat.", ""),
       ("Validation", "Email", "Signed in", "1. Enter an invalid email. Save.", "info@", "Not kept (blank or error). A valid email shows on /contact.", ""),
       ("Validation", "Google Maps embed link", "Signed in", "1. Paste a non-https or wrong link in 'Google Maps embed link'.", "http://maps.google.com/x", "Not kept. A real https 'Embed a map' src shows the map on /contact.", ""),
       ("Validation", "Social profile link", "Signed in", "1. Add a social profile with link 'facebook.com/abc' (no https).", "facebook.com/abc", "Not kept / warned. With https://facebook.com/abc the footer icon links correctly.", "")]
    + crud("member", "Shared content > Team", "the homepage 'Meet Your Counsellors' and /about", "Full name: TEST Counsellor\nRole: Senior Counsellor\nLanguages: Nepali, English\nPhoto: upload a square JPG", "Role", "Admissions Counsellor")
    + crud("step", "Shared content > Admission steps", "/admission-process and the homepage journey section", "Step title: TEST step\nShort line: Test line\nFull description: Test description\nWhat you'll provide: Passport copy", "Step title", "TEST step edited",
           extra=[("Validation", "Maximum 12 steps", "Signed in", "1. Keep clicking 'Add step'.", "-", "You cannot add more than 12.", "")])
    + [("Update", "Nepal & India guidance", "Signed in", "1. Shared content > Nepal & India guidance.\n2. Add a TEST point to 'Rules for Nepali students'. Save.\n3. View /admission-process and any programme page.", "Point: TEST guidance point", "Point appears in the 'Before you apply' box. Remove afterwards.", ""),
       ("Hide", "Hide the India note", "Signed in", "1. Untick 'Show on website' for 'Note for Indian students'. Save, view.", "-", "India note hidden, Nepal box still shown. Tick again afterwards.", "")]
)

ADMIN["Admin - Reels Videos Blog"] = (
    crud("reel", "Shared content > Reels", "the homepage 'Reels' section and /videos", "Reel title: TEST reel - campus tour\nLink: https://www.tiktok.com/@yourpage/video/1234567890 (use a real public reel)", "Reel title", "TEST reel - edited",
         extra=[("Read", "Platform is detected from the link", "Signed in", "1. Add 3 reels: one TikTok link, one Facebook link (https://www.facebook.com/reel/...), one Instagram link. Save, view the homepage.", "3 links", "Each card shows the right badge: 'TikTok', 'Facebook', 'Instagram', and 'Watch on TikTok/Facebook/Instagram'.", ""),
                ("Read", "Reel opens on the platform", "A reel exists", "1. Click a reel card on the homepage.", "-", "The reel opens in a NEW tab on TikTok/Facebook; the website stays open.", ""),
                ("Validation", "Link without https", "Signed in", "1. Add a reel with link 'tiktok.com/@x/video/1'. Save, view.", "tiktok.com/@x/video/1", "Expected: a warning. Known issue BUG-005: shows 'Saved' but the reel is silently dropped. Record it.", ""),
                ("Validation", "Empty title or empty link", "Signed in", "1. Add a reel with a link but no title; another with a title but no link. Save, view.", "-", "Neither appears on the site (both fields are required).", "Note whether the editor warns you."),
                ("Validation", "Title length", "Signed in", "1. Paste a 200-character title.", "200 characters", "Stops at 100 characters.", ""),
                ("Validation", "Maximum 24 reels", "Signed in", "1. Try adding more than 24 reels.", "-", "Cannot add more than 24.", ""),
                ("Business rule", "Section hidden when there are no reels", "Signed in", "1. Untick all reels, save, view homepage.", "-", "The whole Reels section disappears (no empty box). Re-tick afterwards.", ""),
                ("Update", "Homepage reels heading and count", "Signed in", "1. Pages > Homepage > 'Reels (Facebook / TikTok)' section.\n2. Change the heading and 'How many to show' to 4. Add a Follow button (e.g. your TikTok profile). Save, view.", "Heading: Watch our *latest reels* TEST\nFollow: Follow us on TikTok > https://www.tiktok.com/@yourpage", "Heading changes, only 4 reels show, follow button opens the profile in a new tab.", "Undo afterwards.")])
    + crud("video", "Shared content > Videos", "the homepage 'Videos' section and /videos", "Video title: TEST video\nVideo link: https://www.youtube.com/watch?v=<real id>\nShort description: Test", "Video title", "TEST video edited",
           extra=[("Read", "Different YouTube link formats play", "Signed in", "1. Add the same video as youtu.be/<id>, youtube.com/shorts/<id> and youtube.com/watch?v=<id>. Save, open /videos.", "3 link styles", "All three play inside the page.", ""),
                  ("Read", "Vimeo and Facebook videos", "Signed in", "1. Add a Vimeo link (https://vimeo.com/<number>) and a public Facebook video link. Save, view /videos.", "-", "Both show a player (Facebook only if the video is public).", ""),
                  ("Read", "Other websites show a 'Watch video' link", "Signed in", "1. Add a link to any other site.", "https://example.com/video", "Card shows a play image and 'Watch video' link that opens a new tab.", ""),
                  ("Validation", "http:// link", "Signed in", "1. Add a link starting with http:// (not https).", "http://www.youtube.com/watch?v=abc", "Not kept; video does not appear (known BUG-005: no warning).", "")])
    + crud("post", "Shared content > Blog posts", "/blog, the post page and the homepage 'From our blog'", "Title: TEST - How to choose a medical university\nWeb address: (leave empty)\nPublished date: 2026-11-25\nAuthor: QA Team\nSummary: Short test summary.\nCover image: upload a landscape JPG\nArticle body: 2 paragraphs, first with sub-heading 'Introduction'", "Title", "TEST - edited title",
           extra=[("Read", "Post page shows everything", "TEST post exists", "1. Open /blog, click the TEST post.", "-", "Title, date, author, cover image, sub-heading and both paragraphs show; 'All articles' goes back; browser tab shows the title.", "Known issue BUG-003: the very first visit to a new post can show 'This page has moved on'. Refresh once and record it."),
                  ("Read", "Newest post first", "2 TEST posts with different dates", "1. Give posts dates 2026-11-20 and 2026-11-25. Save, open /blog.", "-", "The 2026-11-25 post is listed first; homepage shows the newest.", ""),
                  ("Validation", "Automatic web address", "Signed in", "1. Leave 'Web address' empty. Save. Reload the editor.", "Title: TEST - How to choose a medical university", "Web address filled as 'test-how-to-choose-a-medical-university'; page opens at /blog/<that>.", ""),
                  ("Validation", "Two posts with the same title", "Signed in", "1. Add two posts with the same title and empty web address. Save.", "Same title twice", "Second gets '-2' at the end; both pages open.", ""),
                  ("Validation", "Invalid date", "Signed in", "1. Enter an impossible or wrong-format date.", "2026-13-45   /   25/11/2026", "Date not kept (post shows without a date). 2026-11-25 works.", ""),
                  ("Validation", "Paragraph breaks", "Signed in", "1. In one paragraph press Enter twice between sentences. Save, view.", "Line one.<Enter><Enter>Line two.", "Shows as two separate paragraphs.", ""),
                  ("Read", "Post in sitemap and Google preview", "TEST post exists", "1. Open /sitemap.xml.\n2. Share the post link in WhatsApp (to yourself).", "-", "Post address is in the sitemap; link preview shows the title.", "Sitemap may update a few minutes later.")])
)

ADMIN["Admin - Image Upload"] = [
    ("Image - valid", "Upload a JPG", "Signed in; any image field (e.g. Reels > Cover picture)", "1. Click 'Upload image'.\n2. Choose a normal photo.\n3. Wait for the preview. Save & publish, view.", "photo.jpg (1-3 MB)", "Preview appears; path changes to /media/....jpg; image shows on the site.", ""),
    ("Image - valid", "Upload PNG, WebP and GIF", "Signed in", "1. Repeat with each file type.", "logo.png, image.webp, small.gif", "All upload and display.", ""),
    ("Image - valid", "Transparent PNG keeps transparency", "Signed in", "1. Upload a PNG with transparent background to the homepage hero student photo (staging).", "student.png (transparent)", "No white box around the person.", "Staging only."),
    ("Image - size", "Image just under 5 MB", "Signed in", "1. Upload a 4.8 MB photo.", "big-photo.jpg (4.8 MB)", "Uploads successfully.", ""),
    ("Image - size", "Image over 5 MB", "Signed in", "1. Upload a 6 MB+ photo.", "huge-photo.jpg (6+ MB)", "Red message 'Images must be 5 MB or smaller.' Nothing uploaded.", ""),
    ("Image - type", "PDF file", "Signed in", "1. Upload a PDF.", "document.pdf", "'Use a JPG, PNG, WebP, AVIF or GIF image.'", ""),
    ("Image - type", "SVG file", "Signed in", "1. Upload an .svg icon.", "icon.svg", "Refused with the same message.", ""),
    ("Image - type", "Renamed file", "Signed in", "1. Rename a .txt or .pdf file to fake.jpg and upload it.", "fake.jpg (really a PDF)", "Refused - the real type is checked, not the name.", ""),
    ("Image - type", "Word / Excel / video file", "Signed in", "1. Upload a .docx, .xlsx and .mp4.", "-", "All refused.", ""),
    ("Image - display", "Alt text (description)", "Image uploaded", "1. Type a description in 'Describe the image'. Save, view.\n2. Right-click the image > Inspect.", "Alt: Students in a university corridor", "The image's alt text is your description.", ""),
    ("Image - display", "Focus point", "Image uploaded in a cropped place (card or header)", "1. Change 'Focus point' (e.g. Top). Save, view.", "Focus point: Top", "The visible part of the photo moves to the top.", ""),
    ("Image - delete", "Remove an image", "Image set", "1. Click 'Remove' next to the image. Save, view.", "-", "Image disappears; layout still looks fine (fallback colour/artwork).", ""),
    ("Image - replace", "Replace an image", "Image set", "1. Click 'Replace image', choose another file. Save, view.", "photo2.jpg", "New image shows (refresh with Ctrl+F5).", ""),
    ("Image - path", "Typing an outside image address", "Signed in", "1. In the image path box type an outside address. Save, view.", "https://somewebsite.com/pic.jpg", "Not kept: only /images/... or uploaded /media/... paths work.", ""),
    ("Image - mobile", "Upload from a phone", "Signed in on a phone", "1. Upload a photo straight from the phone camera/gallery.", "Phone photo (HEIC on iPhone may be converted to JPG)", "Uploads or gives the clear type message; never a blank error.", "Record the phone model."),
    ("Image - security", "Signed out upload", "Signed out", "1. Developer/advanced: POST a file to /api/admin/media without signing in.", "-", "Refused with 401.", "Developer test - skip if not technical."),
]

USER = {}
PAGES = [("/", "Homepage"), ("/about", "About Us"), ("/destinations", "Study Destinations"), ("/destinations/china", "A country page (try each country)"), ("/programs", "Programmes"), ("/programs/mbbs", "A programme page (try each)"),
         ("/admission-process", "Admission Process"), ("/scholarships", "Scholarships"), ("/faqs", "FAQs"), ("/success-stories", "Success Stories"), ("/blog", "Blog"), ("/videos", "Videos & Reels"),
         ("/contact", "Contact"), ("/book-counselling", "Book Counselling"), ("/privacy-policy", "Privacy Policy"), ("/terms-and-conditions", "Terms & Conditions")]
USER["User - Public Pages"] = [("Read", f"{name} loads correctly", "Any browser", f"1. Open <site>{path}.\n2. Scroll to the bottom.", "-", "Page loads in under 3 seconds; no broken images, no overlapping text, footer visible.", "") for path, name in PAGES] + [
    ("Navigation", "Top menu and dropdowns", "Desktop", "1. Hover 'Study Destinations' and 'Programmes'.\n2. Click each item.", "-", "Dropdowns list current countries/programmes; each link opens the right page.", ""),
    ("Navigation", "Mobile menu", "Phone", "1. Tap the menu button (three lines).\n2. Open each link.", "-", "Menu opens/closes; every link works.", ""),
    ("Navigation", "Footer links", "Any", "1. Click every footer link (Explore, Support, Destinations, Privacy, Terms, Blog, Videos).", "-", "All open the right page.", ""),
    ("Navigation", "Unknown address", "Any", "1. Open <site>/this-does-not-exist and <site>/programs/nothing.", "-", "Friendly 'not found' page with a way back home.", "Known BUG-009: first visit may return status 200 (only visible to developers)."),
    ("Read", "Admin changes appear on the site", "Admin edited something", "1. After any admin save, refresh the matching public page.", "-", "Change visible within a few seconds.", ""),
    ("Read", "Reel cards", "Reels added in admin", "1. Homepage > Reels section: check each card's title, platform badge and link.", "-", "Correct title, 'Watch on TikTok/Facebook', opens in a new tab.", ""),
    ("Read", "Videos play", "Videos added", "1. Homepage and /videos: press play on each video.", "-", "Videos play inside the page; full-screen works.", ""),
    ("Read", "Blog cards and post page", "Posts added", "1. Homepage 'From our blog' and /blog: click a post.", "-", "Card shows cover, date, title, summary; post page shows the article.", ""),
    ("Read", "FAQ accordion", "Any", "1. /faqs: click questions open and closed; use the topic links.", "-", "Answers open/close; topic links jump to the right group.", ""),
    ("Read", "Country quiz / tabs on homepage", "Any", "1. Use the homepage quiz and the destination/programme tabs.", "-", "Each option changes the result; no errors.", ""),
    ("Read", "Call, WhatsApp, email buttons", "Contact details set in admin", "1. On a phone tap Call, WhatsApp and the email link.", "-", "Dialler, WhatsApp chat and email app open with the right details.", ""),
    ("Read", "Map on contact page", "Map link set in admin", "1. /contact: check the map and 'Get directions'.", "-", "Map shows the office; directions open Google Maps.", ""),
    ("SEO", "Page titles and sharing preview", "Any", "1. Check the browser tab title on each page.\n2. Share the homepage link in WhatsApp.", "-", "Each page has its own title; preview shows the logo image and description.", ""),
]

FORM_OK = "Full name: TEST Ram Sharma\nPhone: +977 9800000000\nEmail: test+1@yourcompany.com"
USER["User - Forms"] = [
    ("Create", "Send a contact message", "Enquiry delivery configured by the developer", f"1. Open /contact.\n2. Fill all fields, tick the privacy box.\n3. Click send.\n4. Check the office inbox.", FORM_OK + "\nSubject: TEST enquiry\nMessage: This is a test message, please ignore.", "Success message on screen. Email/webhook arrives within 5 minutes with every field.", "Tell the office you are testing."),
    ("Create", "Book a counselling session", "Delivery configured", "1. Open /book-counselling.\n2. Fill every field, choose programme then country, tick privacy.\n3. Submit. Check the inbox.", FORM_OK + "\nLocation: Kathmandu\nQualification: Completed Grade 12\nProgramme: MBBS\nCountry: China\nIntake: Next available\nMode: Online (video)", "Success message; inbox receives all details.", ""),
    ("Read", "Pre-filled counselling link", "Any", "1. Open /book-counselling?country=china&programme=mbbs", "-", "Programme and country are already selected.", ""),
    ("Validation", "Submit empty form (contact)", "Any", "1. /contact: click send without typing.", "(empty)", "Red message under every required field: name, phone, email, subject, message, privacy.", ""),
    ("Validation", "Submit empty form (counselling)", "Any", "1. /book-counselling: submit empty.", "(empty)", "Red message under name, phone, email, location, qualification, programme, country, intake, privacy.", ""),
    ("Validation", "Invalid email", "Any", "1. Type a wrong email and submit.", "Email: ram@  /  ram.gmail.com", "'Please enter a valid email address'.", ""),
    ("Validation", "Invalid phone", "Any", "1. Type letters or a too-short number.", "Phone: hello  /  12345", "'Please enter a valid phone number, including country code'.", "Valid: +977 9800000000, +91 98765 43210"),
    ("Validation", "Name too short", "Any", "1. Enter a 1-letter name.", "Name: R", "'Please enter your full name'.", ""),
    ("Validation", "Message too short / too long", "Any", "1. Contact message 'hi'.\n2. Then paste 2,100 characters.", "hi  /  2,100 characters", "'at least 10 characters' / 'under 2000 characters'.", ""),
    ("Validation", "Privacy box not ticked", "Any", "1. Fill everything except the privacy tick and submit.", "-", "'Please agree to the privacy policy...' Nothing sent.", ""),
    ("Validation", "Programme not offered in the country", "Any", "1. Choose a programme, then look at the country list.", "Programme: Nursing", "Only countries that offer Nursing can be chosen (or a clear error).", ""),
    ("Validation", "Double click on submit", "Delivery configured", "1. Fill the form correctly and double-click submit quickly.", FORM_OK, "Only ONE email arrives; the button shows it is sending.", ""),
    ("Validation", "Many submissions", "Delivery configured", "1. Send 6 valid messages within 10 minutes.", "6 x TEST", "After 5, a message asks you to wait (rate limit).", "Warn the office first."),
    ("Error", "Delivery not configured / offline", "Ask developer, or turn off Wi-Fi just before submitting", "1. Submit a valid form while offline.", FORM_OK, "Honest error with phone/WhatsApp alternatives. Never a fake 'Thank you'.", ""),
    ("Security", "Code in form fields", "Delivery configured", "1. Put code in the message and send.", "Message: <script>alert(1)</script> test message", "Form sends; the email shows the text literally; no pop-up anywhere.", ""),
    ("Validation", "Keyboard only", "Desktop", "1. Fill the form using only Tab, typing and Enter.", "-", "Every field reachable; errors are read out/visible.", ""),
]

USER["User - Responsive & Browsers"] = [
    ("Responsive", f"{name} at {w}", "Chrome DevTools device mode or real device", f"1. Open the page at {w}.\n2. Scroll top to bottom; open menus and accordions.", "-", "No sideways scrolling; text readable; buttons tappable; images not stretched.", "")
    for name in ["Homepage", "A country page", "A programme page", "Book Counselling form", "Blog post", "Videos page"]
    for w in ["phone 390 px", "tablet 768 px", "laptop 1366 px"]
] + [
    ("Browser", f"Main flow in {b}", b, "1. Homepage > a country > Book Counselling > fill the form (do not send unless delivery test).", "-", "Looks and works the same as in Chrome.", "")
    for b in ["Google Chrome", "Microsoft Edge", "Mozilla Firefox", "Safari on iPhone", "Samsung Internet / Android Chrome"]
] + [
    ("Performance", "Mobile speed score", "Live site", "1. Go to pagespeed.web.dev, test the homepage, a country page and /book-counselling (Mobile).", "-", "Performance 70+ and Core Web Vitals 'Passed'. Record the scores.", ""),
    ("Accessibility", "Zoom to 200%", "Desktop", "1. Press Ctrl and + until 200%. Browse the homepage and a form.", "-", "Nothing overlaps or gets cut off.", ""),
]
