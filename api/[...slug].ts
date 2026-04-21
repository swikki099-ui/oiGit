import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGitHubStats } from "../server/github";
import { generateStatsSVG, generateLanguagesSVG, generateStreakSVG, generateTrophiesSVG, generateOverviewSVG, generateHeatmapSVG, generateTopReposSVG } from "../server/svg-generator";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { slug = [] } = req.query;
    const path = `/${slug.join("/")}`;

    // JSON API endpoints
    if (path.startsWith("/user/")) {
      const username = path.split("/user/")[1];
      if (!username || username.length < 1) {
        return res.status(400).json({ error: "Username is required" });
      }

      try {
        const stats = await getGitHubStats(username);
        res.setHeader("Cache-Control", "public, max-age=1800");
        return res.json(stats);
      } catch (error: any) {
        if (error.message === "User not found") {
          return res.status(404).json({ error: "GitHub user not found" });
        }
        return res.status(500).json({ error: "Failed to fetch GitHub stats" });
      }
    }

    // SVG image endpoint
    if (path === "" || path === "/") {
      const { username, type = "stats", theme } = req.query;

      if (!username || typeof username !== "string") {
        return res.status(400).send("Username is required");
      }

      try {
        const stats = await getGitHubStats(username);
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
        res.setHeader("Cache-Control", "public, max-age=1800");
        return res.send(svg);
      } catch (error: any) {
        const errorSvg = `
          <svg width="495" height="120" xmlns="http://www.w3.org/2000/svg">
            <rect width="495" height="120" rx="4.5" fill="#0d1117" stroke="#f85149"/>
            <text x="247" y="60" text-anchor="middle" font-family="monospace" font-size="14" fill="#f85149">
              Error: ${error.message === "User not found" ? "GitHub user not found" : "Failed to fetch stats"}
            </text>
          </svg>
        `.trim();
        
        res.setHeader("Content-Type", "image/svg+xml");
        res.status(error.message === "User not found" ? 404 : 500);
        return res.send(errorSvg);
      }
    }

    res.status(404).json({ error: "Not found" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
