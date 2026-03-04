// Replit Auth removed — app now runs outside of Replit.
// Authentication is handled via a simple API key. See server/auth.ts.
import type { Express, RequestHandler } from "express";

export async function setupAuth(_app: Express): Promise<void> {
  // no-op: Replit OIDC auth removed
}

export function getSession() {
  return null;
}

export const isAuthenticated: RequestHandler = (_req, res) => {
  res.status(401).json({ message: "Unauthorized" });
};
