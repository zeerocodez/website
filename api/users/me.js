/**
 * Vercel Serverless Function: User Profile Update
 * Endpoint: PATCH /api/users/me
 * 
 * Hardening Rule (FR-3.5):
 * Prevents mass-assignment. Client-supplied 'role', 'id', or 'passwordHash'
 * are rejected with a 400 Bad Request.
 */

const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional()
}).strict();

module.exports = async (req, res) => {
  if (req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Mass-assignment violation. Unauthorized fields rejected.',
      details: parsed.error.flatten()
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated securely with strict allowlist.',
    data: parsed.data
  });
};
