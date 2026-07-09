import type { Express, Request, Response, NextFunction } from "express";
import { log } from "./log";
import {
  errorSVG,
  validateUsername,
  fetchStats,
  getUserErrorStatus,
  generateSvgForType,
} from "./handlers";
import { apiLimiter, svgLimiter } from "./rate-limit";

export function registerRoutes(app: Express): void {

  // Apply rate limiters to all /api routes
  app.use("/api/user", apiLimiter);
  app.use("/api", svgLimiter);

  // ── JSON endpoint for the frontend dashboard ──────────────────────────────
  app.get("/api/user/:username", async (req, res) => {
    const validationError = validateUsername(req.params.username);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const stats = await fetchStats(req.params.username);
      res.json(stats);
    } catch (error: any) {
      const msg = error?.message || "Failed to fetch GitHub stats";
      log(`Error in /api/user/:username: ${msg}`);
      const status = getUserErrorStatus(msg);
      const friendly = status === 404
        ? "GitHub user not found"
        : status === 429
          ? msg
          : "Failed to fetch GitHub stats";
      res.status(status).json({ error: friendly });
    }
  });

  // ── SVG embed endpoint ────────────────────────────────────────────────────
  app.get("/api", async (req, res) => {
    const { type = "stats", theme } = req.query;

    const validationError = validateUsername(req.query.username);
    if (validationError) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.status(400).send(errorSVG(validationError));
    }

    try {
      const stats = await fetchStats(req.query.username as string);
      const opts = { theme: typeof theme === "string" ? theme : undefined };

      const svg = generateSvgForType(stats, type as string, opts);

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
      res.send(svg);
    } catch (error: any) {
      const msg = error?.message || "Failed to fetch stats";
      log(`Error in /api SVG endpoint: ${msg}`);
      const status = getUserErrorStatus(msg);
      res.setHeader("Content-Type", "image/svg+xml");
      res.status(status).send(errorSVG(msg));
    }
  });

  // ── Error handling middleware ─────────────────────────────────────────────
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Unhandled error: ${message}`);
    res.status(status).json({ error: message });
  });
}
