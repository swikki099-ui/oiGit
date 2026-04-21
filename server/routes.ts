import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getGitHubStats } from "./github";
import {
  generateStatsSVG,
  generateLanguagesSVG,
  generateStreakSVG,
  generateTrophiesSVG,
  generateOverviewSVG,
  generateHeatmapSVG,
  generateTopReposSVG,
} from "./svg-generator";
import { log } from "./log";
import { githubUsernameSchema } from "../shared/schema";

/** Renders a small error SVG so embeds still return a valid image. */
function errorSVG(message: string): string {
  return `<svg width="495" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="495" height="120" rx="4.5" fill="#0d1117" stroke="#f85149"/>
  <text x="247" y="55" text-anchor="middle" font-family="monospace" font-size="13" fill="#f85149">⚠ ${message}</text>
  <text x="247" y="80" text-anchor="middle" font-family="monospace" font-size="11" fill="#8b949e">Oi Git — oigit.app</text>
</svg>`.trim();
}

export function registerRoutes(
  app: Express,
  httpServer?: Server
): Server | undefined {

  // ── JSON endpoint for the frontend dashboard ──────────────────────────────
  app.get("/api/user/:username", async (req, res) => {
    const parsed = githubUsernameSchema.safeParse(req.params.username);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.errors[0]?.message ?? "Invalid username" });
    }

    try {
      const stats = await getGitHubStats(parsed.data);
      res.json(stats);
    } catch (error: any) {
      log(`Error in /api/user/:username: ${error.message}`);

      if (error.message === "User not found") {
        return res.status(404).json({ error: "GitHub user not found" });
      }
      if (error.message.startsWith("GitHub API rate limit")) {
        return res.status(429).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to fetch GitHub stats" });
    }
  });

  // ── SVG embed endpoint ────────────────────────────────────────────────────
  app.get("/api", async (req, res) => {
    const { type = "stats", theme } = req.query;

    const parsed = githubUsernameSchema.safeParse(req.query.username);
    if (!parsed.success) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res
        .status(400)
        .send(errorSVG(parsed.error.errors[0]?.message ?? "Invalid username"));
    }

    try {
      const stats = await getGitHubStats(parsed.data);
      const opts = { theme: typeof theme === "string" ? theme : undefined };

      let svg: string;
      switch (type) {
        case "languages":
          svg = generateLanguagesSVG(stats, opts);
          break;
        case "streak":
          svg = generateStreakSVG(stats, opts);
          break;
        case "trophies":
          svg = generateTrophiesSVG(stats, opts);
          break;
        case "overview":
          svg = generateOverviewSVG(stats, opts);
          break;
        case "heatmap":
          svg = generateHeatmapSVG(stats, opts);
          break;
        case "repos":
          svg = generateTopReposSVG(stats, opts);
          break;
        case "stats":
        default:
          svg = generateStatsSVG(stats, opts);
          break;
      }

      res.setHeader("Content-Type", "image/svg+xml");
      // 30-minute public cache; 5-minute stale-while-revalidate
      res.setHeader("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
      res.send(svg);
    } catch (error: any) {
      log(`Error in /api SVG endpoint: ${error.message}`);

      const isNotFound = error.message === "User not found";
      const isRateLimit = error.message.startsWith("GitHub API rate limit");
      const friendlyMsg = isNotFound
        ? "User not found"
        : isRateLimit
        ? "Rate limit hit — try later"
        : "Failed to fetch stats";

      res.setHeader("Content-Type", "image/svg+xml");
      res
        .status(isNotFound ? 404 : isRateLimit ? 429 : 500)
        .send(errorSVG(friendlyMsg));
    }
  });

  // ── Error handling middleware ─────────────────────────────────────────────
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Unhandled error: ${message}`);
    res.status(status).json({ error: message });
  });

  return httpServer;
}
