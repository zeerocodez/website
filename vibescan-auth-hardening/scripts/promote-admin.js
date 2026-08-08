// scripts/promote-admin.js
// Run manually, outside the running app:
//   node scripts/promote-admin.js someone@example.com
//
// This deliberately does NOT exist as an HTTP route anywhere. Promoting
// an admin should require direct server/database access, not just an
// authenticated session, that's the whole point of keeping this a
// standalone script instead of an endpoint with "are you sure" logic.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/promote-admin.js <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`${user.email} is now an admin.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
