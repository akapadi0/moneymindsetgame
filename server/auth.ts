import type { RequestHandler } from "express";

/**
 * Simple API-key-based guard for admin routes.
 * Set the ADMIN_API_KEY environment variable, then pass
 * the header  x-admin-key: <your-key>  with any protected request.
 */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const adminKey = process.env.ADMIN_API_KEY;

  // If no key is configured, block all access to protect by default
  if (!adminKey) {
    return res.status(401).json({ message: "Admin access not configured" });
  }

  const provided = req.headers["x-admin-key"];
  if (provided !== adminKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};
