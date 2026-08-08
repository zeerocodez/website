# VibeScan — User Flow Document
### v1.0, scoped to the actual repo: Express + PostgreSQL/Prisma + Redis/BullMQ + Vite/React

Actors: **Visitor**, **Developer/Student** (signed in, default role), **Admin**. Academy/LMS is a fully separate app, the only connection between them is a lightweight referral link, see Flow 6.

---

## Flow 1: Install the GitHub Action (primary distribution channel)

```
Developer finds VibeAudit (via marketing site, GitHub Marketplace, or referral)
        |
        v
Adds action.yml step to their CI workflow, sets `fail-on` threshold (A-F)
        |
        v
On every push/PR, the action scans the repo for OWASP Top 10 LLM
vulnerabilities (prompt injection, data poisoning, and the rest of
the category set)
        |
        v
Produces a letter grade. If grade is below `fail-on`, the CI check fails
        |
        v
Result links back to the web dashboard for full findings detail
```

This is the credible, developer-native distribution path, it sits in CI where the target user already is, and it fails builds instead of relying on someone remembering to check a dashboard.

---

## Flow 2: Web dashboard scan (zip upload path)

```
Developer signs up / logs in
        |
        v
Uploads a zip of their codebase (multer handles the upload,
adm-zip extracts it server-side)
        |
        v
Scan job is queued (BullMQ/Redis), NOT processed synchronously
        |
        v
Dashboard shows a "queued" / "processing" state, not an instant result,
be honest about this in the UI, the job queue exists for a reason
        |
        v
Worker processes the scan, writes grade + findings to Postgres
        |
        v
Dashboard updates (poll or websocket) to show the completed grade
and findings list
```

**Do not let the web UI imply an instant result.** The architecture is async on purpose, the UX should say so plainly ("scanning, this usually takes about a minute" beats a spinner with no explanation).

---

## Flow 3: Free vs. paid tier

- **Free**: GitHub Action + basic dashboard scan, OWASP LLM Top 10 grade and summary findings. This is real and automated, not a token gesture, it's the actual scanner.
- **Paid tiers** (once payments are built, see Flow 4): deeper findings detail, AgentGuard-specific agent permission review, human-reviewed remediation guidance, VibeCert issuance eligibility.

Keep this distinction honest in copy: the free tier already does something substantive (a real OWASP-grounded scan), the paid tiers add depth and human review, not "unlock the real scanner."

---

## Flow 4: Payment (not yet built, spec for next)

```
Developer selects a paid tier from their dashboard
        |
        v
Redirected to Paystack/Flutterwave checkout
        |
        v
Provider sends a webhook to an Express route, signature verified server-side
        |
        v
Only on verified success: create the payment record and unlock the
tier for that user's account
        |
        v
Client is never trusted to assert "payment succeeded," same principle
as the role field below
```

---

## Flow 5: Admin flows

- Review flagged/high-severity scan results across all users
- View the paid tier queue (once built) for anything needing human review before certification
- Issue VibeCert manually when a paid, human-reviewed audit passes
- Becoming admin: happens only through a direct database update or a protected migration script run outside the app, never through any endpoint reachable by a signed-in user, including their own profile-update endpoint. **Check this now**: if the current user update route does something like passing the whole request body into a Prisma update call, a user could set their own role by including it in a normal profile-edit request. This is a common and serious mistake in Express/Prisma apps specifically, verify the update endpoint only accepts an explicit allowlist of fields (name, email, etc.), never `role`.

---

## Flow 6: The Academy bridge (two separate repos, one flywheel)

Since Academy and VibeScan are staying as fully separate apps, the flywheel connection has to be lightweight, not a shared database:

1. Academy's dashboard links to VibeScan's signup with a referral parameter: `vibescan.yourdomain.com/signup?ref=academy&course=digital-products-ai`
2. VibeScan captures `referralSource` and `referralCourse` on the user record at signup
3. Admin can filter VibeScan's user list by referral source to see the actual flywheel conversion number, the one flagged repeatedly as the metric that tells you whether the business model works
4. No API integration needed between the two apps for v1, just a link and a captured field

---

## Flow 7: Notifications (not yet built, spec for next)

| Event | Who's notified | Channel |
|---|---|---|
| New scan completed with a D or F grade | Admin | WhatsApp (reuse existing setup) |
| Paid tier purchased | Admin | WhatsApp + email |
| Certificate/VibeCert issued | User | Email |

---

## Flow 8: Self-audit

Once payments/notifications are in and the app is close to public launch, run VibeAudit against this repo itself. Fix what it finds, issue Zeerocodes its own VibeCert, put the badge on the marketing site. This is still on the list from the earlier gap review, it hasn't happened yet.
