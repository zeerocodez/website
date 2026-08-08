# Auth hardening drop-in

Reference implementation to compare against the real vibescan repo's
current auth code, not a blind patch. Files map to these paths in the
actual repo:

- lib/auth.js
- middleware/auth.js
- server/session-setup.js
- routes/users.js
- scripts/promote-admin.js
- scripts/check-auth-security.js

## Install (new dependencies, not currently in package.json)

    npm install bcrypt express-session connect-redis

## First thing to actually run

    node scripts/check-auth-security.js

This tells you what's really in the users table right now, run it
before changing anything else. If the real repo's auth already uses a
different pattern (JWT instead of sessions, for example), say so and
the middleware/session files get rewritten to match instead of forcing
a swap to this pattern.

## Then

1. Wire session-setup.js into server/server.js
2. Replace whatever currently handles login to use hashPassword /
   verifyPassword from lib/auth.js
3. Mount routes/users.js and delete/replace whatever profile-update
   route exists now if it doesn't already use an explicit field allowlist
4. Confirm scripts/promote-admin.js is the ONLY way role gets changed,
   grep the codebase for any other place "role" is written to a user record
