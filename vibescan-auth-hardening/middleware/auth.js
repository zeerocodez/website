// middleware/auth.js
// requireAuth: any logged-in user. requireAdmin: logged-in AND role === "admin".
// Role is always looked up fresh from the database by session userId,
// never trusted from anything the client sent on this request.

export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export function requireAdmin(prisma) {
  return async function (req, res, next) {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { role: true },
    });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };
}
