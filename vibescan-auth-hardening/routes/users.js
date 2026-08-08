// routes/users.js
// Mount in server.js: app.use("/api/users", usersRouter(prisma))
//
// The whole point of this file: it is IMPOSSIBLE to set role, id, or
// passwordHash through this endpoint, not just discouraged by convention.
// If a field isn't in updateProfileSchema, Prisma never sees it.

import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
  })
  .strict();
  // .strict() rejects any key not listed above with a 400, instead of
  // silently ignoring it. If someone's client sends { role: "admin" }
  // alongside a normal name change, this schema fails loudly rather
  // than quietly dropping just the role field, which is what you want
  // when you're debugging, not a silent partial success.

export default function usersRouter(prisma) {
  router.patch("/me", requireAuth, async (req, res) => {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // req.session.userId decides WHICH row gets updated, never anything
    // from the request body. Otherwise a client could pass someone
    // else's id and edit a different user's profile.
    const updated = await prisma.user.update({
      where: { id: req.session.userId },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // passwordHash intentionally not selected, it must never
        // leave this endpoint in a response body.
      },
    });

    res.json(updated);
  });

  return router;
}
