# GITDM deploy package — full change log

## Six operational roles only
Principal · Admissions · Finance · Academic · Exam Office · Registrar  
(+ Student / Alumni for learners)

## Principal
- Clean Control Centre overview (six departments only)
- Clean left nav (no Library/Marketing/IT/elections clutter)
- Department assign → **one role** per department (no legacy bulk attach)
- **Trader insights** at `/control-centre/insights`: all journals, pair stats, participant stats, CSV export
- `access-staff-roles` redirects to Control Centre

## Academic rights
- Permission checks **normalize** legacy roles (LECTURER → Academic) so pages stop saying “not authorized”
- Only active courses: **TA101, FX3M, FFM-101**
- Classes: 24h window; edit title, join link, materials link/note; **file upload**
- Timetable generation: resilient, redirects with success/error, updates student timetable

## Exam Office
- Exam detail: **Forms-style** question builder (MCQ / multi / T-F / short / essay / numerical)
- Publish path: draft → approval → **PUBLISHED** (students only see published)
- Marking table with file links → confirm → Registrar path

## Install app
- `/install` — Download / Install app (PWA)
- Footer link “Install app”
- Service worker `/sw.js` (offline shell + push notification handler)
- Manifest improved for home-screen install

## Branding
- Print CSS letterhead uses `/gitdm-brand.jpeg`
- Optional `/public/principal-signature.png` for print signature (add your file)

## Deploy
Same database — `prisma db push` only. After deploy, Principal should re-assign staff to one of the five departments (not Principal).
