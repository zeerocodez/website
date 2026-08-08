// scripts/check-auth-security.js
// Run: node scripts/check-auth-security.js
//
// Checks your ACTUAL users table, not code, for password values that
// don't look like real bcrypt hashes. This is the "verify against"
// part, it tells you what's really in the database right now.

import { PrismaClient } from "@prisma/client";
import { looksLikeBcryptHash } from "../lib/auth.js";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, passwordHash: true },
  });

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  let suspect = 0;
  for (const user of users) {
    if (!user.passwordHash) {
      console.log(`[MISSING HASH]  ${user.email}`);
      suspect++;
    } else if (!looksLikeBcryptHash(user.passwordHash)) {
      console.log(
        `[NOT BCRYPT]    ${user.email}  (starts with: ${user.passwordHash.slice(0, 8)}...)`
      );
      suspect++;
    }
  }

  console.log(`\n${users.length} users checked, ${suspect} need attention.`);
  if (suspect > 0) {
    console.log(
      "If any of these turn out to be plaintext, treat those passwords as " +
      "already compromised, anyone with database or backup access could " +
      "have read them. Force a password reset for those accounts. Don't " +
      "just hash the existing value in place and consider it fixed, the " +
      "exposure already happened regardless of what you do to the stored value now."
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
