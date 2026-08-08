# Zeerocodes Platform (Teach • Build • Protect)

Zeerocodes is a Lagos-based AI automation and security company run by **Nuel Effiong (Emmanuel Effiong)**. The platform unites three divisions under one customer journey:

1. **Teach (AI Income Academy)**: Online masterclasses in n8n automation, WhatsApp bot engineering, and secure AI coding for emerging African markets.
2. **Build (Automation Studio)**: Custom workflow automation consulting, WhatsApp CRM bots, and Paystack/Flutterwave transaction reconciliation.
3. **Protect (VibeScan)**: Independent security audits and **VibeCert™** certification for apps built with AI assistants (Cursor, Lovable, v0, Claude), verified against the **OWASP Top 10 for LLM Applications**. Official GitHub repository: [github.com/zeerocodez/vibescan](https://github.com/zeerocodez/vibescan).

---

## ⚡ 1-Click Deployment to Vercel

The platform is configured with zero-config **Vercel Serverless & Static Edge deployment**:

### Option 1: Via Vercel CLI
```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy to preview
vercel

# 3. Deploy to production
vercel --prod
```

### Option 2: Via GitHub Integration
1. Push this repository to GitHub (`main` branch).
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repository.
3. Keep default settings (Framework Preset: **Other**, Root Directory: `./`).
4. (Optional) Set your production Environment Variables in the Vercel Dashboard:
   - `PAYSTACK_SECRET_KEY` = your Paystack live/test secret key
   - `FLUTTERWAVE_SECRET_KEY` = your Flutterwave secret key
   - `FLUTTERWAVE_WEBHOOK_SECRET` = your Flutterwave webhook secret hash
   - `SESSION_SECRET` = secure random session signing secret
5. Click **Deploy**. Vercel will build and assign your live production URL (e.g., `https://zeerocodes.vercel.app`).

---

## 🎨 Brand Palette System

The platform strictly adheres to the requested brand palette with zero substitutions:
- **`#016B61` (Teal)** — Primary brand color, headers, primary action buttons, active navigation accents.
- **`#85C79A` (Green)** — Secondary accent, success badges, progress indicators, secondary CTAs.
- **`#E4EEE7` (Mint)** — Backgrounds, section tints, card containers to avoid flat white.
- **`#D9D9D9` (Gray)** — Neutral borders, dividers, disabled states, structural lines.
- **`#0C221F` & `#1E3531`** — High-contrast dark charcoal for readable body and heading typography.

---

## 🛡️ VibeScan Repository Integration (`zeerocodez/vibescan`)

- **GitHub Action Workflow**: `uses: zeerocodez/vibescan@v1` with configurable `fail-on` grade thresholds (A-F).
- **Interactive Async Scanner**: Evaluates codebases across all 10 OWASP LLM categories with BullMQ worker simulation.
- **Public Verification Portal**: Universal verification at `https://zeerocodes.com/verify/:certId` with copy-pasteable HTML and Markdown embed badges.
- **Security Hardening**:
  - Bcrypt password hashing (12 salt rounds)
  - Zod `.strict()` mass-assignment blocker on `/api/users/me`
  - Out-of-band CLI admin promotion (`scripts/promote-admin.js`)
  - Server-side cryptographic HMAC SHA-512 webhook signature verification
