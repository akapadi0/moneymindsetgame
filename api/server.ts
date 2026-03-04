/**
 * Vercel Serverless Entry Point
 *
 * Vercel routes all /api/* requests here (see vercel.json).
 * Static files (the Vite-built frontend) are served by Vercel's CDN from dist/public/.
 *
 * Local dev: use `npm run dev` — runs server/index.ts directly via tsx.
 * Production: `npm run build`, then deploy to Vercel.
 */
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req: Request & { rawBody?: unknown }, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// Lazy initialisation — registerRoutes seeds the DB on first call.
// The error handler is registered AFTER routes (Express requires this order).
let initialized = false;
const initPromise = registerRoutes(httpServer, app).then(() => {
  app.use(
    (
      err: { status?: number; statusCode?: number; message?: string },
      _req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    },
  );
  initialized = true;
});

export default async function handler(req: Request, res: Response) {
  if (!initialized) await initPromise;
  app(req, res);
}
