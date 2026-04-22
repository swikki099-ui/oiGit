import { z } from "zod";

// ─── Shared GitHub Types ─────────────────────────────────────────────────────

export interface Trophy {
  name: string;
  description: string;
  rank: "S" | "A" | "B" | "C" | "?";
  icon: string;
  achieved: boolean;
}

export interface TopRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  languageColor: string;
}

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  following: number;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  followers: number;
  publicRepos: number;
  prsReviewed: number;
  mergedPRs: number;
  totalForks: number;
  organizations: number;
  accountAgeDays: number;
  languages: Array<{ name: string; percentage: number; color: string }>;
  topRepos: TopRepo[];
  streak: {
    current: number;
    longest: number;
    total: number;
    start: string;
    end: string;
  };
  /** 52 weekly contribution counts (oldest first) */
  weeklyContributions: number[];
  trophies: Trophy[];
  /** true = full GraphQL data; false = limited REST-only data */
  isFullData: boolean;
}

// Zod validator for the GitHub username format
export const githubUsernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(39, "GitHub usernames cannot exceed 39 characters")
  .regex(
    /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
    "Invalid GitHub username format"
  );
