# CLAUDE.md

This file is read automatically by Claude Code when working in this repo. It sets context so you don't have to re-explain the project every session.

**Assumption flagged:** this is written for a single platform repo containing the marketing site and the dashboard/LMS app. VibeScan already has its own GitHub repo. If VibeScan stays separate, this file should be trimmed to drop anything dashboard/LMS-specific and a matching CLAUDE.md should live in the VibeScan repo referencing the shared conventions below. Don't assume one repo structure without confirming.

---

## Project Overview

Zeerocodes is a Lagos-based AI automation and security company with three divisions under one flywheel: Teach (AI Income Academy), Build (Automation Studio), Protect (VibeScan). This repo is the customer-facing platform: marketing site, Academy/LMS, and the minimal Studio and VibeScan customer-facing flows. VibeScan's actual scanning/audit logic lives in its own repo, this repo talks to it, doesn't contain it.

Full context: see PRD.md, SRS.md, and USER_FLOW.md in the `/docs` folder (or wherever these get placed once finalized).

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend/Auth/Data:** Firebase (Firestore, Auth)
- **Payments:** Paystack and Flutterwave, both required, webhook-verified
- **Automation glue:** n8n for cross-system workflows (payment confirmation → enrollment → notification)
- **Notifications:** WhatsApp Cloud API, plus standard transactional email
- **Hosting:** Vercel (frontend)

## Repo Structure (adjust once actual scaffolding exists)

```
/app                 → Next.js routes
/components           → shared UI components
/lib                  → Firebase config, payment provider clients, utilities
/docs                 → PRD, SRS, User Flow, this file's source of truth
```

Update this section the first time you actually scaffold the project. Don't let it drift from reality.

## Commands

Fill these in once the project is initialized, placeholders below assume a standard Next.js setup:

```
npm run dev       → local dev server
npm run build     → production build
npm run lint      → lint check
npm run test      → test suite (once tests exist)
```

## Non-Negotiable Business Rules

These aren't style preferences, they're rules that protect revenue and trust. Don't deviate from these even under time pressure:

1. **Never activate Academy enrollment on the client-side payment success callback alone.** Enrollment activates only after server-side webhook signature verification from Paystack or Flutterwave. This is FR-ACAD-03 and FR-PAY-02 in the SRS.
2. **Never issue a VibeScan certification without a completed admin review record.** Phase 1 is manual, there's no automated pass path yet.
3. **Never expose payment provider secrets or webhook signing secrets client-side.** Server-side only, environment variables, never committed.
4. **One account, one identity across all three divisions.** Don't build separate auth systems for Academy vs VibeScan vs Studio.
5. **Track referral source on every VibeScan submission** (Academy, Studio, or direct). This feeds the 90-day conversion metric that the whole flywheel strategy depends on. If this field gets dropped in a refactor, it's a real business metric loss, not just a missing form field.

## Design Tokens

Brand palette, use these consistently, don't introduce new colors without checking:

- `#016B61` — teal, primary (buttons, headers, key accents)
- `#85C79A` — green, secondary (success states, secondary CTAs)
- `#E4EEE7` — mint, backgrounds (section tints, cards)
- `#D9D9D9` — gray, neutral (borders, dividers, structure)

## Coding Conventions

- Mobile-first responsive design always, test on throttled connections, not just fast wifi.
- Prefer server-side verification for anything involving money or access control. If you're not sure whether something needs server-side verification, assume yes.
- Structured data over freeform text wherever a human (admin reviewing VibeScan submissions) needs to read it later. Don't store audit findings as a single text blob.
- Keep the data model flexible enough that VibeScan's Phase 2 automated scanning path can be added without a schema rewrite. Don't hardcode assumptions that only manual review will ever exist.

## Environment Variables

Names only, never commit actual values:

```
PAYSTACK_SECRET_KEY
PAYSTACK_WEBHOOK_SECRET
FLUTTERWAVE_SECRET_KEY
FLUTTERWAVE_WEBHOOK_SECRET
FIREBASE_API_KEY
FIREBASE_PROJECT_ID
WHATSAPP_CLOUD_API_TOKEN
```

Update this list as real integrations get added, don't let it go stale.

## What Not To Do

- Don't build Phase 2 features (automated VibeScan scanning, Studio dashboard, badge verification page) before Phase 1 success criteria in the PRD are met.
- Don't add a new payment provider without updating both the SRS and this file.
- Don't skip webhook signature verification "just for testing," it's the exact gap that caused rework before, treat it as load-bearing from day one.
- Don't build generic template-looking UI. Reference the frontend-design conventions and the brand palette above, this needs to feel founder-led and specific to the African market.

## When You're Unsure

Check `/docs/PRD.md` for product priorities and `/docs/SRS.md` for functional requirement IDs before making a scope decision on your own. If a requirement conflicts with what's in these docs, flag it instead of picking one silently.
