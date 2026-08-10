# SYSTEM SECURITY GUARDRAILS FOR VIBE CODING

This workspace enforces strict security engineering and architectural guardrails for all code development and deployment:

## 1. Secrets & Environment Management
- NEVER hardcode an API key, password, token, or connection string in any file.
- All credentials must be placed strictly in a `.env` file (or equivalent system secrets manager).
- Ensure `.gitignore` explicitly blocks `.env` files before committing code.

## 2. Database Protection & Authentication
- If using Supabase, Firebase, or an external DB, you must implement Row Level Security (RLS). 
- Every database read/write query must implicitly or explicitly validate user authentication state.
- Never rely on client-side state for authorization logic.

## 3. Input Validation & Prompt Injection Defense
- Treat all text inputs from users, forms, or external APIs as potentially malicious.
- Sanitize inputs to prevent SQL injections and Cross-Site Scripting (XSS).
- If sending user text to another LLM API, wrap it securely to mitigate prompt injection risk.

## 4. Review & Diff Protocol
- When presenting code changes, explicitly call out any architectural changes or package dependencies you are adding.
- Highlight any security trade-offs made to speed up prototyping.
