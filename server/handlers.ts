import type { GitHubStats } from "../shared/types";
import { githubUsernameSchema } from "../shared/types";
import { getGitHubStats } from "./github";
import {
  generateStatsSVG,
  generateLanguagesSVG,
  generateStreakSVG,
  generateTrophiesSVG,
  generateOverviewSVG,
  generateHeatmapSVG,
  generateTopReposSVG,
  generateCompositeSVG,
} from "./svg-generator";

export interface SvgQuery {
  username: string;
  type?: string;
  theme?: string;
}

/** Renders a small error SVG so embeds still return a valid image. */
export function errorSVG(message?: string): string {
  const safe = message || "Internal error";
  return `<svg width="495" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="495" height="120" rx="4.5" fill="#0d1117" stroke="#f85149"/>
  <text x="247" y="55" text-anchor="middle" font-family="monospace" font-size="13" fill="#f85149">⚠ ${safe}</text>
  <text x="247" y="80" text-anchor="middle" font-family="monospace" font-size="11" fill="#8b949e">Oi Git — oigit.app</text>
</svg>`.trim();
}

export function validateUsername(raw: unknown): string | null {
  const parsed = githubUsernameSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.errors[0]?.message ?? "Invalid username";
  }
  return null;
}

export function getUserErrorStatus(message?: string): number {
  if (!message) return 500;
  if (message === "User not found") return 404;
  if (message.startsWith("GitHub API rate limit")) return 429;
  return 500;
}

export function getFriendlyErrorMessage(message?: string): string {
  if (!message) return "Failed to fetch stats";
  if (message === "User not found") return "User not found";
  if (message.startsWith("GitHub API rate limit")) return "Rate limit hit — try later";
  return "Failed to fetch stats";
}

export async function fetchStats(username: string): Promise<GitHubStats> {
  return getGitHubStats(username);
}

export function generateSvgForType(stats: GitHubStats, type: string, opts: { theme?: string }): string {
  switch (type) {
    case "languages":
      return generateLanguagesSVG(stats, opts);
    case "streak":
      return generateStreakSVG(stats, opts);
    case "trophies":
      return generateTrophiesSVG(stats, opts);
    case "overview":
      return generateOverviewSVG(stats, opts);
    case "heatmap":
      return generateHeatmapSVG(stats, opts);
    case "repos":
      return generateTopReposSVG(stats, opts);
    case "composite":
      return generateCompositeSVG(stats, opts);
    case "stats":
    default:
      return generateStatsSVG(stats, opts);
  }
}
