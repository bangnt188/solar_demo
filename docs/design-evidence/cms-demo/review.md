# Impeccable finish review — CMS demo

Scope: synthetic, in-memory UI demo; user selected Bàn vận hành and deferred backend.

Initial disposition: FIX + RECAPTURE. Three material findings:
1. Upload label/hidden input was not keyboard accessible.
2. Full DOM replacement lost focus on transitions.
3. Some screenshots preceded image decode and included unrelated success toasts.

Fix batch: native upload button; stable focus restoration and deliberate detail
focus; sidebar close/Escape focus; captures await image decoding and clear toast.

Final disposition: SHIP — PASS for the three previously reported findings.
Reviewer inspected updated source, keyboard.json and representative recaptures.
This verdict closes the listed findings; it is not a comprehensive accessibility
or security certification.

Browser run: no page errors; no document overflow at 1440×1000 and 390×844 on
home, catalog, equipment, media, Lead, account and login. Lead/catalog saves,
empty search, Editor menu restrictions and reset feedback passed. Keyboard
checks: detail/menu/Escape focus, file chooser/preview, filtered CSV passed.

Two QA harness errors were corrected: attempting a hidden mobile control after
returning to the list; an ambiguous menu selector after adding a close control.
These were test ordering/selector failures, not application defect evidence.

Evidence: browser.json, keyboard.json and screenshots in this directory.
