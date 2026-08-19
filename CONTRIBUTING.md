# Contributing to Zeerocodes

Thank you for your interest in contributing to the Zeerocodes platform! We welcome contributions from developers, security researchers, and builders across our Teach, Build, and Protect ecosystems.

---

## 1. Development Workflow

1. **Fork or Clone the Repository**:
   ```bash
   git clone https://github.com/zeerocodez/website.git
   cd website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   # Populate required test keys
   ```

4. **Run Local Server**:
   ```bash
   npm start
   # Or using Node directly: node server.js
   ```

5. **Run Security & Automated Test Suite**:
   ```bash
   npm test
   # Or: node test/run-tests.js
   ```

---

## 2. Branching & Commit Conventions

- **Branch Naming**:
  - `feat/feature-name` — New features or UI components
  - `fix/bug-description` — Bug fixes
  - `security/vulnerability-patch` — Security hardening or OWASP patches
  - `docs/documentation-update` — Documentation improvements

- **Commit Message Convention**:
  We follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add enterprise client sprint telemetry pipeline`
  - `fix: resolve timing side-channel on webhook signature check`
  - `docs: update deployment architecture in README`
  - `test: add unit test for payment verification gate`

---

## 3. Pull Request Checklist

Before opening a pull request, ensure:
- [ ] All automated tests pass: `npm test`
- [ ] Zero exposed API keys, credentials, or `.env` files in git diff
- [ ] Vanilla CSS follows our Obsidian & Emerald design system
- [ ] Webhook handlers implement constant-time HMAC verification
- [ ] Database queries enforce Row Level Security (RLS) policies
- [ ] Code is properly commented and formatted

---

## 4. Code of Conduct

Be respectful, collaborative, and constructive in all code reviews, issue discussions, and pull requests.
