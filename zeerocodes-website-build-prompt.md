# Zeerocodes Website Build Prompt

**Purpose of this document:** hand this to an AI builder (Claude Code, v0, Lovable) or a developer as the single source of truth for the site. Everything needed to build page one to launch is here.

**Assumptions made (correct these if wrong):**
- Domain: zeerocodes.com (placeholder, swap if different)
- Stack: Next.js (App Router), Tailwind CSS, deployed on Vercel
- This is the marketing site only. The LMS/dashboard is a separate Next.js + Firebase app, linked from here (likely app.zeerocodes.com or a "Login" button)
- Site is mostly static content with a few dynamic bits: waitlist/lead forms, maybe a live VibeScan sample report

---

## 1. What This Company Is

Zeerocodes Automation Limited is a Lagos-based AI automation and security firm run by Nuel Effiong (Emmanuel Effiong). The company runs three divisions under one flywheel:

- **Teach** → AI Income Academy (courses, EdTech)
- **Build** → Automation Studio (custom automation consulting, n8n/WhatsApp/Paystack builds)
- **Protect** → VibeScan (AI security audits and certification for vibe-coded apps)

The flywheel logic: people come in through Teach (courses), get value, some of them become Build clients (automation consulting), and a subset of those convert into Protect customers (VibeScan security audits) once they've shipped something worth protecting. VibeScan is the long-term moat. The key growth metric internally is Academy-to-VibeScan conversion within 90 days, so the site should be built to support that funnel, not just look good.

## 2. Who This Site Talks To

Three overlapping audiences, don't write generic copy that tries to hit all three at once on the same page:

- **Academy visitors:** Nigerian creators, freelancers, students, entrepreneurs who want to learn AI/automation skills. Price-sensitive, motivated by income potential.
- **Studio visitors:** SME owners and founders who want repetitive work automated. Motivated by time and cost savings, need proof it works for African business context (Paystack, WhatsApp, local logistics).
- **VibeScan visitors:** Founders and dev teams who've shipped an AI-assisted or "vibe-coded" app and are worried about security holes. Motivated by risk, credibility, and needing a certification badge they can show investors or clients.

## 3. Sitemap

1. **Home** — flywheel overview, routes visitors to the right division
2. **Academy** (Teach) — course catalog, pricing, testimonials, enroll CTA
3. **Automation Studio** (Build) — services, case studies, "book a call" CTA
4. **VibeScan** (Protect) — the product page, this is the priority page, build it first
5. **About** — Nuel's story, Zeerocodes' positioning, credibility markers
6. **Pricing** — can be a standalone page or sections within Academy/Studio/VibeScan, decide based on how different the pricing models are
7. **Blog/Resources** (optional at launch, but plan the URL structure now for SEO)
8. **Contact/Book a Call**

## 4. Page-by-Page Brief

### Home
- Hero: one sentence that states the flywheel without using the word "flywheel." Something like "Learn AI. Automate your business. Secure what you build." Three-part hero nav or three cards below the fold routing to Academy/Studio/VibeScan.
- Social proof strip: logos or numbers if available (students trained, automations built, apps scanned)
- Short explainer of the Teach → Build → Protect logic, framed as a customer journey, not a corporate diagram
- Primary CTA depends on where most traffic comes from. If Academy content drives most traffic, default CTA is "Start Learning." If VibeScan is what you're pushing hardest right now, lead with that instead.

### VibeScan (build this page in the most depth, it's the priority)
- Hero: the fear this solves. Something like "You shipped fast with AI. Did you ship secure?" Speaks to the anxiety of vibe-coding without a security background.
- What VibeScan actually does: plain-English explanation of the scan process. No jargon dump. Explain what gets checked (auth, data exposure, injected dependencies, secrets in code, etc.) without giving away methodology that undermines the audit's value.
- Certification badge: show what customers get at the end. A badge/certificate they can display is a strong conversion lever, make it visually prominent.
- Pricing tiers if defined (self-serve scan vs manual audit vs ongoing monitoring)
- CTA: "Scan your app" or "Book an audit," whichever matches your actual Phase 1 delivery model (manual vs automated)
- Trust section: Nuel's credibility as an AI security consultant, any early customer results

### Academy
- Course catalog with clear pricing
- Testimonials, ideally with specific outcomes (income earned, skills gained)
- Enroll CTA tied to Paystack/Flutterwave checkout

### Automation Studio
- Service breakdown (what gets automated: WhatsApp, Paystack, CRM, etc.)
- Case study format: problem → manual process → automation solution → time/cost saved. Use real numbers if you have them, even rough estimates.
- "Book a call" CTA, this is a consulting sale, not a checkout flow

### About
- Nuel's story in first person, written with the same voice as his LinkedIn content, direct and no fluff
- Zeerocodes' positioning as Africa's trusted AI security and adoption consultant
- Photo, credentials, any press or speaking engagements

## 5. Design System

**Colors:**
- `#016B61` — teal, primary brand color, use for headers, primary buttons, key accents
- `#85C79A` — green, secondary accent, use for success states, highlights, secondary CTAs
- `#E4EEE7` — mint, background tint, use for section backgrounds and cards to avoid flat white everywhere
- `#D9D9D9` — gray, neutral, use for borders, dividers, disabled states, body text on light backgrounds

Don't use these as decoration. Build an actual system: teal for primary actions, green for secondary/success, mint as a section-background alternative to pure white, gray for structure. Avoid gradients that muddy the teal and green together unless it's intentional and tested.

**Typography:** pick one strong sans-serif for headers (something with personality, not a generic system font) and a highly readable body font. Since this skews toward founders and students reading on phones in Nigeria, prioritize load speed and readability over decorative fonts.

**Overall aesthetic direction:** professional but not corporate-sterile. This isn't a bank. It's a founder-led AI company. Should feel confident, direct, slightly technical (nods to security/code without being intimidating to a non-technical Academy visitor).

## 6. Conversion Architecture

The site's job isn't just to look good, it's to move people through Teach → Build → Protect. Concretely:

- Every Academy page should have a soft mention or link toward Studio/VibeScan once someone's shown intent (e.g., after course completion messaging, or in a sidebar)
- VibeScan should be reachable from the main nav on every page, not buried
- Track where VibeScan leads come from (Academy referral vs direct vs Studio referral) so the 90-day conversion metric is measurable. This means UTM parameters or at minimum a "how did you hear about VibeScan" field on the lead form.

## 7. Technical Requirements

- Mobile-first. Most Nigerian traffic will be phone-based, test on slow connections.
- Forms: lead capture on VibeScan, waitlist/enroll on Academy, contact/book-a-call on Studio. Wire these to whatever backend you're using (Firebase, or a simple email/Sheets integration for launch).
- Payment: Paystack and/or Flutterwave integration for Academy checkout. Webhook-verified enrollment, don't just trust the client-side success callback.
- Analytics: Google Analytics or Plausible at minimum, plus event tracking on key CTAs (enroll click, VibeScan lead submit, book-a-call click).
- SEO: proper meta tags, OG images per page, semantic headings. Nuel wants to own "AI security" and "AI adoption" search terms in the Nigerian/African market, so title tags and content should target those phrases naturally, not stuffed.
- Performance: aim for a fast Lighthouse score. This is a credibility issue for a company selling AI security services, a slow or broken site undermines the pitch.

## 8. Voice and Copy Guidelines

Write the way Nuel talks: direct, no filler, no "Great question" energy, no generic startup-speak. Use real Nigerian business examples where it helps (a school, a church, an SME) rather than generic Silicon Valley examples. Challenge the reader's assumptions rather than just flattering them ("you shipped fast, but did you check if it's secure?" rather than "we're excited to help you grow").

Avoid corporate jargon. Avoid vague claims ("industry-leading," "cutting-edge") without something concrete backing them up.

## 9. What Not To Do

- Don't build a generic SaaS-template-looking site. This needs to feel founder-led and specific to the African market, not a copy-paste of a US automation agency site.
- Don't hide VibeScan behind Academy content. It's the strategic priority even if Academy currently drives more traffic.
- Don't launch payment flows without webhook verification, this is a known open item and a real risk if skipped.
- Don't overload Home with all three divisions equally, if VibeScan is the growth priority, Home's hierarchy should reflect that even while still routing Academy/Studio visitors correctly.

---

**Next steps once this is built:** connect it to the User Flow, SRS, and PRD docs so the site's forms and CTAs match the actual product flows defined there, especially for VibeScan's scan submission and the Academy-to-VibeScan handoff.
