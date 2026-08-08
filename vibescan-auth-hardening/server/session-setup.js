// server/session-setup.js
// Wire this into server/server.js with: app.use(sessionMiddleware)
// Reuses the Redis connection style you already have for BullMQ,
// no new infrastructure, just a new use of what's already running.

import session from "express-session";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";

if (!process.env.SESSION_SECRET) {
  // Fail loud at startup, not quietly at runtime with a guessable
  // default secret baked into the code.
  throw new Error("SESSION_SECRET environment variable is required.");
}

const redisClient = new Redis(process.env.REDIS_URL);

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});
