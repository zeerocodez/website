# Security Policy & Responsible Disclosure

Zeerocodes is committed to maintaining the highest standard of software security, privacy, and architectural resilience across our **Academy (Teach)**, **Studio (Build)**, and **VibeScan (Protect)** divisions.

---

## 1. Supported Versions

We release security patches and updates for the following versions:

| Version | Supported | Status |
| :--- | :--- | :--- |
| `2.x` (Current) | :white_check_mark: | Active Security Updates & Patches |
| `1.x` | :x: | End of Life |

---

## 2. Reporting a Vulnerability

If you discover a potential security vulnerability in any Zeerocodes system, client portal, or API endpoint, please report it responsibly:

- **Primary Contact**: `security@zeerocodes.com`
- **Secondary Contact**: `zeerocodes@gmail.com`
- **Lead Systems Architect**: Nuel Effiong (`nuel@zeerocodes.com`)

### What to Include in Your Report:
1. **Description**: A clear summary of the vulnerability (e.g. Broken Access Control, Missing RLS, Prompt Injection, Webhook Timing Side-Channel).
2. **Steps to Reproduce**: Proof-of-concept (PoC) code or step-by-step instructions.
3. **Impact Assessment**: The potential severity, affected components, and risk to data confidentiality or integrity.
4. **Proposed Fix**: Any architectural recommendations or patches (optional).

### Our Response SLA:
- **Acknowledgement**: Within **12 hours**.
- **Triage & Reproduction**: Within **24 hours**.
- **Remediation & Patch Deployment**: Critical vulnerabilities are resolved within **48 hours**.

---

## 3. Security Engineering & Architectural Standards

All codebase contributions and client systems must adhere to our strict guardrails:

- **Zero Hardcoded Secrets**: All keys (Paystack, Flutterwave, Firebase, Supabase, Kyber Vault) must reside in environment variables (`.env`).
- **Database Tenant Isolation**: PostgreSQL tables must have Row Level Security (`ENABLE ROW LEVEL SECURITY`) with strict `auth.uid()` checks.
- **Cryptographic Timing-Safe Verification**: All external webhooks must use `crypto.timingSafeEqual` over HMAC SHA-512 hashes.
- **Input Sanitization**: Treat all external payloads and AI prompts as untrusted to mitigate SQLi, XSS, and LLM Prompt Injection attacks (OWASP LLM Top 10).
- **Post-Quantum Ready Encryption**: Environment tokens and sensitive payloads are secured with Kyber-1024 / AES-256 hybrid encryption.

---

*Thank you for helping keep Zeerocodes and our builder ecosystem secure.*
