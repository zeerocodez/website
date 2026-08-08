# VibeScan — Software Requirements Specification (SRS)
### v1.0, corrected for the actual repo (github.com/zeerocodez/vibescan)

---

## 1. Introduction

### 1.1 Purpose
Specifies requirements for VibeScan as it actually exists and as it needs to be hardened and extended: an OWASP LLM Top 10 security scanner distributed as a GitHub Action and a web dashboard, built on Express, PostgreSQL (Prisma), Redis/BullMQ, and a Vite/React frontend.

### 1.2 Correction note
An earlier version of this document (and the accompanying PRD, user flows, and CLAUDE.md) was written assuming Next.js and Firebase. That was wrong for this repo, it was based on the Academy app's stack, not VibeScan's. This version reflects the actual stack, confirmed from `package.json` and `action.yml`.

### 1.3 Scope
Covers the GitHub Action, the web dashboard, authentication, the scan pipeline, and the requirements needed to add payments, notifications, and legal compliance, which are not yet built.

---

## 2. Overall Description

### 2.1 Confirmed current state
- Scanner: working, OWASP Top 10 LLM vulnerability detection (prompt injection, data poisoning, and the remaining categories in that framework), grades A-F, configurable CI fail threshold
- GitHub Action: working, `action.yml` defines it, runs on Node 20
- Web dashboard: working
- User accounts and authentication: working (password hashing/session mechanism not yet confirmed, see NFR-1)
- `packages/agentguard`: exists as a separate module, scope not fully documented here, confirm before writing marketing copy that describes it

### 2.2 Not yet built (per direct confirmation)
- Payments
- Notifications
- Legal documents (Terms of Service, Privacy Policy, audit liability/scope language)
- Self-audit / own VibeCert badge

### 2.3 User classes

| Class | Access |
|---|---|
| Visitor | Marketing pages, GitHub Action documentation, signup |
| Developer/Student (default role on signup) | Own scans, own dashboard, own account settings |
| Admin | All of the above, plus cross-user scan visibility, tier/payment review, certificate issuance |

### 2.4 Constraints
- Scans are asynchronous (BullMQ/Redis), UI must reflect queued/processing states honestly, not imply instant results
- Paid tier depth (human review, AgentGuard-specific findings) is not yet defined in detail, needs scoping before payments are built

---

## 3. Functional Requirements

### 3.1 Scanner / GitHub Action (existing, documenting for the record)

| ID | Requirement | Status |
|---|---|---|
| FR-1.1 | Action scans a repository for OWASP Top 10 LLM vulnerabilities on push/PR | Built |
| FR-1.2 | Produces a letter grade (A-F) | Built |
| FR-1.3 | `fail-on` input controls the minimum passing grade for CI | Built |
| FR-1.4 | Results link to the web dashboard for full detail | Confirm this link actually exists in the output |

### 3.2 Web dashboard / zip upload

| ID | Requirement | Status |
|---|---|---|
| FR-2.1 | Authenticated user can upload a zip of a codebase for scanning | Built (multer + adm-zip present) |
| FR-2.2 | Upload triggers an async job (BullMQ), not a synchronous scan | Built (BullMQ/Redis present) |
| FR-2.3 | Dashboard reflects queued/processing/completed states accurately in the UI | Verify, don't assume the UI already communicates this honestly |
| FR-2.4 | Completed scan shows grade and findings | Built |

### 3.3 Authentication and accounts

| ID | Requirement | Status |
|---|---|---|
| FR-3.1 | Signup/login working | Built, confirmed |
| FR-3.2 | Password hashing uses a vetted library (bcrypt/argon2), not custom or unhashed storage | **Unconfirmed, verify directly, this is not optional for a security product** |
| FR-3.3 | Session/token handling uses a vetted approach (signed sessions or JWT with proper verification) | **Unconfirmed, verify directly** |
| FR-3.4 | New users default to a non-privileged role | Verify the Prisma schema and signup route actually enforce this |
| FR-3.5 | No endpoint accepts a client-supplied `role` field on user update, this includes the profile-edit endpoint specifically, mass-assignment through Prisma's update methods is the most common way this breaks | Must, verify now |
| FR-3.6 | Admin promotion happens only via direct database access or a protected script, never an app-reachable endpoint | Must, verify now |

### 3.4 Payments (not built, spec for next)

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | Paystack (primary) / Flutterwave checkout for paid tiers | Must |
| FR-4.2 | A `payments` table records every checkout attempt with status | Must |
| FR-4.3 | Tier unlock happens only after a signature-verified webhook confirms payment, never a client-asserted success | Must |

### 3.5 Notifications (not built, spec for next)

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Admin notified (WhatsApp) on a low-grade (D/F) scan result | Should |
| FR-5.2 | Admin notified on paid tier purchase | Must |
| FR-5.3 | User notified (email) on certificate/VibeCert issuance | Must |

### 3.6 Academy referral bridge

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | Signup accepts optional `ref` and `course` query parameters, stored on the user record as `referralSource`/`referralCourse` | Should |
| FR-6.2 | Admin can filter/report users by referral source | Should |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Security | Confirm password hashing and session/token handling use vetted libraries. This is the first thing to verify, not the last |
| NFR-2 | Security | No mass-assignment path from request body to Prisma update calls anywhere a role or privilege field could ride along |
| NFR-3 | Security | Rate limiting (already present via express-rate-limit) covers signup, login, and scan submission endpoints specifically, not just applied globally by accident |
| NFR-4 | Reliability | Payment webhook handling is idempotent, a retried webhook must not double-unlock or double-charge |
| NFR-5 | Compliance | NDPR-aligned handling of any uploaded codebase content, scan results may contain a customer's own secrets or sensitive logic, define retention and deletion policy |
| NFR-6 | Honesty | UI copy never implies the free tier and a paid, human-reviewed audit are the same depth |

---

## 5. Data Requirements (target schema, reconcile with actual Prisma models)

| Table | Key fields |
|---|---|
| `users` | id, email, passwordHash, role (enum: user/admin, default user), referralSource, referralCourse, createdAt |
| `scans` | id, userId, source (github_action/upload), grade, status (queued/processing/completed), createdAt |
| `findings` | id, scanId, category (OWASP LLM Top 10 category), severity, description |
| `payments` | id, userId, tier, amount, currency, status, provider, providerReference |
| `certificates` | id, userId, type (scan_grade/vibecert), refId, issuedAt |

This is a target, not a claim about what's already in `schema.prisma`, reconcile field names against the real file.

---

## 6. External Interfaces

PostgreSQL (via Prisma), Redis (BullMQ), Paystack/Flutterwave (to be added), WhatsApp Cloud API or existing n8n workflow (to be added), GitHub Actions runtime.
