# Product Requirements Document (PRD)
## Zeerocodes Platform

**Version:** 0.1 (draft for review)
**Companion documents:** User Flow Document, SRS, Website Build Prompt, CLAUDE.md

---

## 1. Vision and Problem Statement

**Vision:** Zeerocodes becomes the default place African founders and businesses go to learn AI, automate their operations, and prove what they've built is secure. Three products, one flywheel: Teach → Build → Protect.

**Problem:** AI adoption in Nigeria and across Africa is accelerating faster than security literacy. Founders are shipping vibe-coded apps, automating customer flows, and taking payments, often without anyone checking whether the build is actually safe. There's no trusted, locally-relevant authority filling that gap. Zeerocodes fills it by teaching the skills (Academy), building the systems (Studio), and certifying the result (VibeScan), so the same customer relationship covers the whole journey instead of three separate vendors.

## 2. Goals and Success Metrics

**Primary metric:** Academy-to-VibeScan conversion within 90 days. This is the number that proves the flywheel actually works rather than just sounding good in a pitch deck.

**Secondary metrics:**
- Studio-to-VibeScan conversion rate
- Academy enrollment volume and revenue
- Number of VibeScan certifications issued
- Badge display rate (how many certified customers actually put the badge on their site, this is a proxy for the viral/trust loop working)
- Testimonials and case studies collected per quarter

**Business alignment:** every feature in this PRD gets weighed against Zeerocodes' actual priorities: does it strengthen authority in AI security/adoption, does it become reusable IP rather than a one-off service, does it drive recurring revenue, is it realistic for the Nigerian market right now. Features that don't clear this bar get deferred, not built for their own sake.

## 3. Target Users

Condensed from the User Flow doc, full detail lives there.

- **Academy Student:** wants income-generating AI/automation skills, price-sensitive, mobile-first.
- **Studio Client:** SME owner or founder who wants repetitive work automated, cares about time and cost savings.
- **VibeScan Customer:** shipped something with AI help, wants proof it's secure, motivated by risk and credibility (investors, clients).

## 4. Product Scope

### Phase 1 (Launch)
- Marketing site (website prompt already spec'd)
- Academy: course catalog, enrollment, payment, content delivery
- VibeScan: manual audit submission through certification (no automated scanning yet)
- Studio: services page, booking flow, manual cross-sell trigger
- Payments: Paystack and Flutterwave, webhook-verified
- Admin: VibeScan review queue

### Phase 2 (post-validation, do not build until Phase 1 numbers justify it)
- Automated VibeScan scanning engine
- Studio in-platform project dashboard
- Certification tiers (single scan vs deep audit vs ongoing monitoring subscription)
- Public badge verification page, so a third party (investor, client) can click the badge and confirm it's real. This is a trust and distribution mechanism, worth prioritizing once Phase 1 volume justifies the build.

### Explicitly out of scope for v1
Multi-language support, native mobile apps, multi-tenant/marketplace features, full Studio CRM.

## 5. Feature Prioritization

Tied to the functional requirement IDs from the SRS so nothing gets built twice or missed.

**P0, must ship for launch:**
- FR-AUTH-01 to FR-AUTH-05 (unified account system)
- FR-ACAD-01 to FR-ACAD-03, FR-ACAD-07 (catalog, enrollment, webhook-verified payment, confirmation)
- FR-VS-01 to FR-VS-08 (submission through manual certification)
- FR-PAY-01 to FR-PAY-04 (payment processing and verification)
- FR-ADM-01 to FR-ADM-04 (VibeScan review queue)

**P1, ship shortly after launch:**
- FR-ACAD-04 to FR-ACAD-06 (progress tracking, certificates, cross-sell trigger)
- FR-STU-01 to FR-STU-04 (Studio page, booking, cross-sell)
- FR-VS-09 (resubmission path)
- FR-NOTIF-01, FR-NOTIF-02 (email and WhatsApp notifications)

**P2, phase 2 candidates:**
- FR-VS-10 (automated scanning)
- Public badge verification page
- Studio dashboard

If something in P0 turns out to be harder than expected, cut from P1 first. Don't quietly downgrade VibeScan scope to hit a launch date, it's the strategic priority, not the flexible one.

## 6. Sample User Stories

- As an Academy visitor, I want clear pricing and real testimonials so I can decide to enroll without needing a call.
- As a VibeScan customer, I want to trust that sharing repo access is safe, so the intake flow needs to explain exactly what Zeerocodes can see and for how long.
- As a Studio client, I want a simple way to book a call without creating an account first, discovery calls shouldn't have signup friction.
- As an Admin, I want a single queue view of pending VibeScan submissions so nothing sits unreviewed without anyone noticing.
- As a certified VibeScan customer, I want a badge I can put on my site immediately, so the value of certification is visible right away, not buried in a PDF.

## 7. Phase 1 Success Criteria

Before building Phase 2 automation, Phase 1 needs to prove itself. Suggested thresholds (adjust based on actual capacity):

- A defined number of VibeScan audits completed manually with acceptable turnaround time and no major accuracy disputes.
- Zero payment/webhook failures causing incorrect enrollment or certification states.
- A measurable Academy-to-VibeScan conversion rate within the 90-day window, even if the number is small at first, the point is having real data instead of a guess.

Don't scale infrastructure until these are met. Building the automated scanner before the manual process is proven wastes engineering time on a workflow that might still need to change.

## 8. Risks and Open Questions

- **Manual review doesn't scale.** Define the submission volume per week where manual review becomes the bottleneck, that's the trigger point for Phase 2, not a calendar date.
- **VibeScan pricing undefined.** Blocks revenue modeling and the payment flow spec in the SRS. Needs a decision before Phase 1 fully launches.
- **NDPR legal review not done.** Real launch risk if VibeScan starts collecting repo access and personal data without this settled.
- **Audit checklist/methodology not documented internally.** The workflow around it is fully spec'd, but the actual security checklist Admin reviewers use doesn't exist yet as a written asset. Worth turning into its own internal doc, it's also potentially valuable IP.
- **Studio's platform footprint.** Fully manual for v1 keeps scope tight, but confirm this doesn't undercut the cross-sell tracking needed for the 90-day metric.

## 9. Roadmap (milestone-based, not date-based until timelines are confirmed)

1. Finish VibeScan pricing and audit checklist (blocks P0 build)
2. Build P0 features across all divisions
3. Launch with manual VibeScan review only
4. Run Phase 1 against the success criteria in Section 7
5. Once validated, greenlight Phase 2 (automated scanning, badge verification page, Studio dashboard)

## 10. Appendix

Full flow detail: User Flow Document
Full technical requirements: SRS
Site structure and copy direction: Website Build Prompt
Build conventions for Claude Code: CLAUDE.md
