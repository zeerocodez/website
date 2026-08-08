// lib/auth.js
// Drop-in path in the real repo: lib/auth.js

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword, storedHash) {
  return bcrypt.compare(plainPassword, storedHash);
}

// Does a string look like a real bcrypt hash? Used by the diagnostic
// script below to catch plaintext or non-bcrypt values in the database,
// not used in the actual login path, bcrypt.compare handles that safely.
export function looksLikeBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}
