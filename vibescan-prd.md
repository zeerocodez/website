# VibeScan — Product Requirements Document (PRD)
### v1.0, corrected for the actual product

---

## 1. What VibeScan actually is

An OWASP Top 10 LLM vulnerability scanner (prompt injection, data poisoning, and the rest of that framework), distributed primarily as a GitHub Action that grades a repository A through F and can fail a CI build below a set threshold, backed by a web dashboard for deeper results and a zip-upload scan path for codebases not wired into the Action yet.

This is a stronger, more specific product than "we check your AI app for security issues." Lead marketing and sales copy with the OWASP grounding and the CI-gate mechanic, both are concrete and credible in a way generic security language isn't.

## 2. Current State (confirmed)

Working: the scanner, the GitHub Action, the web dashboard, user accounts and authentication.
Not built yet: payments, notifications, legal documents, self-audit badge.

This PRD's job from here is mostly gap-closing, not greenfield design.

## 3. Positioning (unchanged from the company blueprint)

"I help African builders use AI without it wrecking them." VibeScan is the Protect division, the moat, and, now that the product is more concretely OWASP-LLM-Top-10-grounded, a more defensible one than originally scoped. AI-generated code has a documented, climbing vulnerability rate, and full-scale audits are priced out of reach for the exact founders this company serves. VibeScan's free tier is a real, automated OWASP-grounded scan, not a token gesture, that's the wedge.

## 4. Goals & Metrics

| Goal | Metric | Notes |
|---|---|---|
| Prove the Academy → VibeScan flywheel | Signups with a non-empty `referralSource` | Requires FR-6.1 from the SRS to be built first |
| Free tier drives paid conversion | % of free-tier users who purchase a paid tier within 30 days | No baseline yet, payments aren't built |
| Certification has real value | VibeCert issuance count, renewal rate once renewal exists | Long-term metric, not v1 |
| Scanner is trustworthy | Grade accuracy / false-positive rate on known-vulnerable test repos | Worth building a small internal test suite for this, a security product with a bad grading algorithm is worse than no product |

## 5. Personas

**The Developer (primary user):** shipping AI-integrated code fast, possibly vibe-coded, wants a fast pass/fail signal in CI more than a long PDF report. The GitHub Action is built for this person specifically.

**The Founder (secondary, overlaps with Academy):** less technical, more likely to use the web dashboard zip-upload path than wire up a GitHub Action themselves. Needs plainer-language findings, not raw OWASP category names with no explanation.

**Admin (you):** needs to see low-grade scans and paid tier requests fast, and needs the referral data to know if Academy is actually feeding this product.

## 6. Roadmap (from current state)

**Now (hardening what exists):**
- Verify password hashing and session security (SRS NFR-1, this is first, not a nice-to-have)
- Verify no mass-assignment path lets a user set their own role (SRS FR-3.5)
- Confirm the dashboard's queued/processing/completed states are honestly represented in the UI

**Next:**
- Payments (Paystack primary), gating paid tier access
- Notifications (WhatsApp for admin alerts, email for user-facing events)
- Academy referral capture (`ref`/`course` query params)

**Then:**
- Legal: Terms of Service, Privacy Policy, audit scope/liability language, real text from counsel, this SRS and PRD only specify that they must exist
- Self-audit: run VibeAudit against this repo, fix findings, issue Zeerocodes its own VibeCert, put the badge on the marketing site
- AgentGuard: document its actual scope clearly (it's a separate package, don't let marketing copy conflate it with the general scanner until its feature set is nailed down)

## 7. Out of Scope (for now)

- Deep human-reviewed audits at scale, that's a manual process for early paid customers until volume justifies more tooling
- Real-time/streaming scan results, the queued job model is fine for v1
- Multi-language i18n for the dashboard

## 8. Risks

| Risk | Mitigation |
|---|---|
| Auth security unconfirmed | Verify hashing/session handling before any real customer data is at stake, see SRS NFR-1 |
| Grading algorithm accuracy unproven | Build a small test suite of known-vulnerable sample repos, track false positive/negative rate |
| AgentGuard scope unclear | Document it properly before it appears in customer-facing copy |
| Two-repo flywheel is easy to lose track of | Referral field (FR-6.1) is the only thing keeping this measurable, build it early, not last |

## 9. Dependencies

PostgreSQL, Redis, GitHub Actions runtime, Paystack/Flutterwave (to add), WhatsApp Cloud API or existing n8n automation (to add), legal counsel for compliance documents.
