# Zeerocodes — Google AI Studio Build Prompts

**How to use this:** paste Section A into AI Studio's Build mode chat first, let it scaffold, then paste B through F as separate follow-up messages in order, letting each one finish before sending the next. Trying to send everything at once tends to produce a worse, less coherent app than building in phases.

**Stack note:** AI Studio Build defaults to React + Node.js with Firebase (Auth + Firestore). This replaces the earlier Next.js assumption in the SRS/CLAUDE.md, those docs need updating once this becomes the real build, not just a prototype.

**VibeScan note:** Phase 1 review is manual, so this build only needs the intake form, payment gate, admin queue, and certification output, not an actual scanning engine. Section D has a marked slot for pasting real detail from your existing VibeScan repo (checklist categories, report format, hardening script logic) once you're ready to share it. Until then it ships with reasonable placeholders.

---

## SECTION A — Master Scaffold (paste first)

```
Role: Expert full-stack developer and UI/UX designer, specializing in EdTech and SaaS platforms for African markets.

Goal: Build a web application called "Zeerocodes." It has two halves: a public marketing site, and an authenticated dashboard. One app, one codebase, shared navigation and auth.

Business context: Zeerocodes has three divisions under one customer journey (Teach → Build → Protect):
- Academy: sells and delivers online courses
- Automation Studio: consulting service, mostly a booking and case-study page
- VibeScan: AI security audit and certification service for apps built with AI coding tools

Design: mobile-first, clean, professional but founder-led, not corporate-sterile. Use this exact color palette throughout, no substitutions:
- #016B61 (teal) — primary, used for headers, primary buttons, key accents
- #85C79A (green) — secondary, used for success states and secondary CTAs
- #E4EEE7 (mint) — backgrounds, used for section tints and cards instead of flat white
- #D9D9D9 (gray) — neutral, used for borders, dividers, disabled states

Public pages (no login required):
1. Home — hero explaining the Teach/Build/Protect journey, routes visitors to Academy, Studio, or VibeScan
2. Academy — course catalog (title, price, short description, placeholder curriculum outline), testimonials section
3. Automation Studio — service description, 2-3 placeholder case studies (problem, manual process, automation solution, time saved), "Book a Call" button (placeholder link for now)
4. VibeScan — hero explaining the security audit, "Submit for Audit" button, certification badge example graphic, pricing placeholder section
5. About — founder bio placeholder, company positioning
6. Contact — simple contact form

Authenticated dashboard (login required):
- One unified account system serves all three divisions, a user is not "an Academy user" or "a VibeScan user" separately, they're one Zeerocodes account that can have enrollments, submissions, and projects simultaneously
- Regular user dashboard shows: their course enrollments and progress, their VibeScan submission history and status, any Studio projects linked to their account
- Admin dashboard (role-gated, only visible to users with an "admin" role) shows: a queue of pending VibeScan submissions awaiting review, basic user list

Auth: use Firebase Authentication. Support email/password sign-up and Google Sign-In. Require email verification before granting full dashboard access. Store a "role" field on each user (default: "user", admin accounts set manually).

Data storage: use Cloud Firestore. Set up these core collections: users, courses, enrollments, studioProjects, vibescanSubmissions, auditReports, certifications, paymentEvents. Set up Firestore security rules so regular users can only read/write their own records, and only admin-role users can access the vibescanSubmissions review queue and write auditReports.

For this first pass, build the page structure, navigation, auth flow, and empty-state dashboard. Leave payments, course content delivery, VibeScan submission logic, and notifications for follow-up prompts, I'll build those next. Just get the skeleton right first: every page reachable, auth working, role-based routing working, Firestore collections created with the security rules described above.
```

---

## SECTION B — Payments (paste after Section A works)

```
Now add payment processing. Zeerocodes needs both Paystack and Flutterwave supported, Nigerian users expect a choice between them.

Requirements, these are non-negotiable:
- Payment initiation happens client-side (redirect to Paystack/Flutterwave checkout)
- Payment CONFIRMATION must happen server-side only, via webhook. Do not grant access to anything (course enrollment, VibeScan submission entering the review queue) based on the client-side success redirect alone. The client-side callback can show a "processing" state, but the actual state change (enrollment.status = "active", submission entering the admin queue) only happens after the webhook is received AND its signature is verified against the Paystack/Flutterwave webhook secret.
- Store webhook secrets and API secret keys as server-side environment variables, never expose them in client code.
- Log every payment event (initiated, webhook received, verified, failed) to the paymentEvents collection for reconciliation.
- If a webhook fails or is delayed, the user should see a clear "we're confirming your payment" state, not a false failure message and not false access.

Wire this into two places for now: Academy course enrollment, and VibeScan submission (payment required before a submission enters the admin review queue).
```

---

## SECTION C — Academy / LMS (paste after Section B works)

```
Now build out the Academy course experience.

- Course catalog page: pull courses from Firestore (title, price, description, curriculum outline as a list of module titles).
- Enrollment: gated behind the payment flow from the previous step. Once enrollment.status is "active," the user gets access to that course's content area.
- Course content area: simple lesson list per course (title, text/video placeholder content, mark-complete checkbox per lesson).
- Progress tracking: calculate and display percent complete on the user's dashboard based on lessons marked complete.
- Completion: when 100% of a course's lessons are marked complete, set enrollment.completed = true and display a completion message with a placeholder certificate download.
- Cross-sell: when a course is marked completed, show a dashboard prompt: "Ready to make sure what you build is secure? Get a VibeScan audit." linking to the VibeScan submission flow. Tag this referral source on the resulting VibeScan submission if the user proceeds (referralSource: "academy").
```

---

## SECTION D — VibeScan (paste after Section C works)

```
Now build the VibeScan submission and review flow. This is a MANUAL review process in this phase, there is no automated scanning yet, don't build a scanner.

Submission intake form (public-facing, requires login and payment as set up in Section B):
- App or repo link (text field)
- Short description of what the app does
- Tech stack used (text field)
- How it was built (dropdown or text: e.g. "AI-assisted / vibe-coded," "traditional development," "mixed")
- Contact info (pull from user profile, editable)
- Referral source (auto-filled if coming from Academy/Studio cross-sell, otherwise "direct")

On payment confirmation (per Section B's webhook rule), the submission enters the vibescanSubmissions collection with status "pending_review" and appears in the admin queue.

Admin review interface (admin-role only):
- List view of all pending submissions, sorted oldest first
- Detail view per submission showing all intake fields
- A structured report form for the admin to fill out, NOT a freeform text box. Use these fields at minimum: authHandling (pass/fail/notes), dataExposure (pass/fail/notes), dependencyRisk (pass/fail/notes), apiSecurity (pass/fail/notes), overallOutcome (certified/not certified), summaryNotes (text)

[PASTE ACTUAL VIBESCAN REPO DETAIL HERE if available: real checklist categories from the hardening script, actual report format, any specific security checks you want reflected in the form fields above. If left blank, the four categories above are a reasonable placeholder starting point.]

On admin submitting the report:
- If overallOutcome is "certified": generate a certification record (link it to the submission), display a certification badge on the user's dashboard with an embed code snippet they can copy for their own site, and update submission status to "certified"
- If "not certified": update submission status to "not_certified," deliver the report and findings to the user's dashboard, and show a "resubmit" button (resubmission returns to payment step from Section B)

Notify the user (placeholder for now, real notification logic comes in Section F) when their report is ready either way.
```

---

## SECTION E — Automation Studio (paste after Section D works)

```
Now build out the Automation Studio page's functional pieces, keep this lightweight, it's a consulting sale, not a self-serve product.

- "Book a Call" button links out to a placeholder calendar booking URL (I'll replace with a real Calendly-style link later)
- Add a simple internal record: when I manually mark a Studio inquiry as "project delivered" in the admin dashboard, trigger the same cross-sell prompt pattern used in Section C, pointing the client toward VibeScan, tagged with referralSource: "studio"
- No client-facing project dashboard needed yet, keep this minimal for now
```

---

## SECTION F — Notifications (paste after Section E works)

```
Now add notification delivery for key events: enrollment confirmation, VibeScan submission received, VibeScan report ready (certified or not).

For now, implement email notifications only (use a standard transactional email service, whatever you'd recommend integrating with Firebase). Add clearly marked placeholder functions for WhatsApp Cloud API notifications, same trigger points, so I can wire in the real WhatsApp integration later without restructuring the notification logic.
```

---

## Notes for production hardening (review before real launch, not part of the AI Studio prompts above)

- Confirm Firestore security rules actually block non-admin access to the review queue and other users' records, don't just trust the UI to hide the admin route, verify the rules directly.
- Add a real privacy policy and terms of service before collecting payment or repo access, required for NDPR compliance.
- VibeScan pricing is still a placeholder in Section A/D, needs a real decision before this goes live, it directly affects the payment flow.
- Once you're ready to share the real VibeScan repo, the Section D placeholder is the spot to drop in the actual audit methodology, right now it ships with a generic four-category checklist.
