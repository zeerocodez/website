# CLAUDE.md
### For the actual VibeScan repo, save this as CLAUDE.md at the repo root

This file is project memory for Claude Code or any AI coding agent working in this repo. Read this before making changes.

## What this project is

VibeScan: an OWASP Top 10 LLM vulnerability scanner. Ships as a GitHub Action (`action.yml`, grades a repo A-F, can fail CI below a threshold) and a web dashboard where users can also upload a zip of a codebase to scan. Part of Zeerocodes, but this repo is fully separate from the Academy/LMS app, they connect only through a referral link, not shared infrastructure.

Full docs: `docs/PRD.md`, `docs/SRS.md`, `docs/user-flows.md`.

## Actual stack (confirmed from package.json, don't assume Firebase or Next.js, that's a different repo)

- Frontend: Vite + React 19, client-side routed with react-router-dom, Tailwind, GSAP for motion
- Backend: Express 5, helmet, cors, express-rate-limit, multer + adm-zip for uploads, pino for logging, zod for validation
- Database: PostgreSQL via Prisma (`@prisma/adapter-pg`)
- Jobs: BullMQ + ioredis, scans run as background jobs, not synchronously
- Deploy: Vercel

## Non-negotiable rules

1. **Password hashing and session handling must use vetted libraries** (bcrypt/argon2 for hashing, signed sessions or verified JWTs). If you're touching auth code and don't see this, flag it, don't assume it's handled elsewhere.
2. **No endpoint may accept a client-supplied `role` field**, especially not the user profile-update endpoint. Check any Prisma `update()` call that takes request body data directly, allowlist fields explicitly, never spread the whole body into the update.
3. **Admin promotion happens outside the app**, direct database access or a protected one-off script, never a reachable endpoint.
4. **Payment success is verified server-side only**, once payments exist, via signature-verified webhook, never a client-asserted "success" flag.
5. **Scans are async.** The UI must show queued/processing/completed states honestly, never imply an instant result for a BullMQ-backed job.
6. **Free tier and paid tier depth must be described honestly.** The free scan is real (OWASP LLM Top 10, automated), don't let copy imply paid tiers "unlock" the actual scanner, they add human review and deeper findings.

## Data model (target, reconcile with the real schema.prisma)

| Table | Key fields |
|---|---|
| `users` | id, email, passwordHash, role (default: user), referralSource, referralCourse |
| `scans` | id, userId, source, grade, status |
| `findings` | id, scanId, category, severity, description |
| `payments` | id, userId, tier, amount, status, provider, providerReference (not built yet) |
| `certificates` | id, userId, type, refId, issuedAt (not built yet) |

## What's built vs. not (confirmed status, keep this updated)

**Built:** scanner, GitHub Action, web dashboard, user accounts, auth.
**Not built:** payments, notifications, legal pages, self-audit badge, Academy referral capture.

## Build order

1. Verify rules 1-3 above against the actual current code, this comes before any new feature work
2. Payments (Paystack primary)
3. Notifications (WhatsApp for admin, email for users)
4. Academy referral capture
5. Legal pages (real text from counsel, this repo only needs to link to and gate on them)
6. Self-audit and public badge

## Commands

```
npm run dev        # runs client (vite) and server concurrently
npm run build       # vite build
npm run lint         # oxlint
```

## Definition of done

- [ ] Any endpoint touching user data uses an explicit field allowlist, not a raw body spread into a Prisma update
- [ ] Any state-changing confirmation (payment, certification, role) is verified server-side
- [ ] Copy matches what the feature actually does, don't let the free/paid tier distinction blur
- [ ] `docs/SRS.md` updated if a requirement changed
