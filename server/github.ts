import { log } from "./log";
import type { GitHubStats, Trophy, TopRepo } from "@shared/schema";

export type { GitHubStats, Trophy, TopRepo };

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

// ─── In-Memory Cache ──────────────────────────────────────────────────────────
// Keyed by lowercase username. TTL: 30 minutes.
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry {
  data: GitHubStats;
  expiresAt: number;
}

const statsCache = new Map<string, CacheEntry>();

function getCached(username: string): GitHubStats | null {
  const entry = statsCache.get(username.toLowerCase());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    statsCache.delete(username.toLowerCase());
    return null;
  }
  return entry.data;
}

function setCache(username: string, data: GitHubStats): void {
  statsCache.set(username.toLowerCase(), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Clears stale entries — call periodically to avoid unbounded memory growth. */
function evictExpired(): void {
  const now = Date.now();
  for (const [key, entry] of statsCache) {
    if (now > entry.expiresAt) statsCache.delete(key);
  }
}

// Evict expired entries every 10 minutes
setInterval(evictExpired, 10 * 60 * 1000);

// ─── Trophy Logic ─────────────────────────────────────────────────────────────

function calculateTrophies(stats: {
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  followers: number;
  contributedTo: number;
  publicRepos: number;
  languageCount: number;
  longestStreak: number;
  totalContributions: number;
}): Trophy[] {
  const trophies: Trophy[] = [];

  // Stars Trophy
  if (stats.totalStars >= 1000) {
    trophies.push({ name: "Super Star", description: `${stats.totalStars.toLocaleString()} total stars`, rank: "S", icon: "star", achieved: true });
  } else if (stats.totalStars >= 500) {
    trophies.push({ name: "Rising Star", description: `${stats.totalStars.toLocaleString()} total stars`, rank: "A", icon: "star", achieved: true });
  } else if (stats.totalStars >= 100) {
    trophies.push({ name: "Star Collector", description: `${stats.totalStars.toLocaleString()} total stars`, rank: "B", icon: "star", achieved: true });
  } else if (stats.totalStars >= 10) {
    trophies.push({ name: "First Stars", description: `${stats.totalStars.toLocaleString()} total stars`, rank: "C", icon: "star", achieved: true });
  } else {
    trophies.push({ name: "Star Seeker", description: "Get your first stars", rank: "?", icon: "star", achieved: false });
  }

  // Commits Trophy
  if (stats.totalCommits >= 5000) {
    trophies.push({ name: "Commit Machine", description: `${stats.totalCommits.toLocaleString()} commits`, rank: "S", icon: "commit", achieved: true });
  } else if (stats.totalCommits >= 1000) {
    trophies.push({ name: "Serial Committer", description: `${stats.totalCommits.toLocaleString()} commits`, rank: "A", icon: "commit", achieved: true });
  } else if (stats.totalCommits >= 500) {
    trophies.push({ name: "Active Coder", description: `${stats.totalCommits.toLocaleString()} commits`, rank: "B", icon: "commit", achieved: true });
  } else if (stats.totalCommits >= 100) {
    trophies.push({ name: "Code Writer", description: `${stats.totalCommits.toLocaleString()} commits`, rank: "C", icon: "commit", achieved: true });
  } else {
    trophies.push({ name: "Contribution Seeker", description: "Start your coding journey", rank: "?", icon: "commit", achieved: false });
  }

  // Pull Requests Trophy
  if (stats.totalPRs >= 500) {
    trophies.push({ name: "Pull Shark", description: `${stats.totalPRs.toLocaleString()} PRs`, rank: "S", icon: "pr", achieved: true });
  } else if (stats.totalPRs >= 100) {
    trophies.push({ name: "PR Master", description: `${stats.totalPRs.toLocaleString()} PRs`, rank: "A", icon: "pr", achieved: true });
  } else if (stats.totalPRs >= 50) {
    trophies.push({ name: "Collaborator", description: `${stats.totalPRs.toLocaleString()} PRs`, rank: "B", icon: "pr", achieved: true });
  } else if (stats.totalPRs >= 10) {
    trophies.push({ name: "Team Player", description: `${stats.totalPRs.toLocaleString()} PRs`, rank: "C", icon: "pr", achieved: true });
  } else {
    trophies.push({ name: "PR Rookie", description: "Open more PRs", rank: "?", icon: "pr", achieved: false });
  }

  // Followers Trophy
  if (stats.followers >= 1000) {
    trophies.push({ name: "Famous Dev", description: `${stats.followers.toLocaleString()} followers`, rank: "S", icon: "followers", achieved: true });
  } else if (stats.followers >= 500) {
    trophies.push({ name: "Influencer", description: `${stats.followers.toLocaleString()} followers`, rank: "A", icon: "followers", achieved: true });
  } else if (stats.followers >= 100) {
    trophies.push({ name: "Popular", description: `${stats.followers.toLocaleString()} followers`, rank: "B", icon: "followers", achieved: true });
  } else if (stats.followers >= 10) {
    trophies.push({ name: "Growing", description: `${stats.followers.toLocaleString()} followers`, rank: "C", icon: "followers", achieved: true });
  } else {
    trophies.push({ name: "New Face", description: "Gain followers", rank: "?", icon: "followers", achieved: false });
  }

  // Repositories Trophy
  if (stats.publicRepos >= 100) {
    trophies.push({ name: "Repo Master", description: `${stats.publicRepos} repositories`, rank: "S", icon: "repo", achieved: true });
  } else if (stats.publicRepos >= 50) {
    trophies.push({ name: "Prolific", description: `${stats.publicRepos} repositories`, rank: "A", icon: "repo", achieved: true });
  } else if (stats.publicRepos >= 20) {
    trophies.push({ name: "Builder", description: `${stats.publicRepos} repositories`, rank: "B", icon: "repo", achieved: true });
  } else if (stats.publicRepos >= 5) {
    trophies.push({ name: "Creator", description: `${stats.publicRepos} repositories`, rank: "C", icon: "repo", achieved: true });
  } else {
    trophies.push({ name: "Beginner", description: "Create more repos", rank: "?", icon: "repo", achieved: false });
  }

  // Languages Trophy
  if (stats.languageCount >= 10) {
    trophies.push({ name: "Polyglot", description: `${stats.languageCount} languages used`, rank: "S", icon: "language", achieved: true });
  } else if (stats.languageCount >= 7) {
    trophies.push({ name: "Multi-Lingual", description: `${stats.languageCount} languages used`, rank: "A", icon: "language", achieved: true });
  } else if (stats.languageCount >= 4) {
    trophies.push({ name: "Versatile", description: `${stats.languageCount} languages used`, rank: "B", icon: "language", achieved: true });
  } else if (stats.languageCount >= 2) {
    trophies.push({ name: "Bilingual", description: `${stats.languageCount} languages used`, rank: "C", icon: "language", achieved: true });
  } else {
    trophies.push({ name: "Specialist", description: "Try more languages", rank: "?", icon: "language", achieved: false });
  }

  return trophies;
}

// ─── Language Colours ─────────────────────────────────────────────────────────

const languageColors: { [key: string]: string } = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Lua: "#000080",
  R: "#198CE7",
  Scala: "#c22d40",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Clojure: "#db5855",
  OCaml: "#3be133",
  Zig: "#ec915c",
};

// ─── GitHub API Helpers ───────────────────────────────────────────────────────

async function fetchGitHubREST(endpoint: string): Promise<any> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "OiGit-App",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (response.status === 403) {
      const rateLimitReset = response.headers.get("X-RateLimit-Reset");
      const resetTime = rateLimitReset
        ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
        : "soon";
      throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime}.`);
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

async function fetchGitHubGraphQL(query: string, variables: any): Promise<any> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "OiGit-App",
  };

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    log(`GraphQL error: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  if (data.errors) {
    log(`GraphQL query errors: ${JSON.stringify(data.errors)}`);
    return null;
  }
  return data.data;
}

// ─── GraphQL Queries ──────────────────────────────────────────────────────────

async function getContributionStats(username: string): Promise<{
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedTo: number;
  totalContributions: number;
  prsReviewed: number;
  mergedPRs: number;
  organizations: number;
}> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        organizations(first: 1) { totalCount }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
          contributionCalendar {
            totalContributions
          }
        }
        pullRequests(first: 1) {
          totalCount
        }
        mergedPRs: pullRequests(states: MERGED, first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        repositoriesContributedTo(first: 1) {
          totalCount
        }
      }
    }
  `;

  const data = await fetchGitHubGraphQL(query, { username });

  if (data?.user) {
    const collection = data.user.contributionsCollection;
    return {
      totalCommits: collection.totalCommitContributions,
      totalPRs: data.user.pullRequests.totalCount,
      totalIssues: data.user.issues.totalCount,
      contributedTo: data.user.repositoriesContributedTo.totalCount,
      totalContributions: collection.contributionCalendar.totalContributions,
      prsReviewed: collection.totalPullRequestReviewContributions,
      mergedPRs: data.user.mergedPRs.totalCount,
      organizations: data.user.organizations.totalCount,
    };
  }

  return {
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    contributedTo: 0,
    totalContributions: 0,
    prsReviewed: 0,
    mergedPRs: 0,
    organizations: 0,
  };
}

async function getStreakStats(username: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  weeklyContributions: number[];
}> {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGitHubGraphQL(query, { username });

  if (data?.user) {
    const calendar = data.user.contributionsCollection.contributionCalendar;
    const weeks: any[] = calendar.weeks;
    const allDays = weeks.flatMap((week: any) => week.contributionDays);

    // Weekly totals (52 weeks, oldest first)
    const weeklyContributions = weeks
      .slice(-52)
      .map((week: any) =>
        week.contributionDays.reduce(
          (sum: number, day: any) => sum + day.contributionCount,
          0
        )
      );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];
    const sortedDays = [...allDays].sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let foundToday = false;
    for (const day of sortedDays) {
      if (day.date === today || !foundToday) {
        foundToday = true;
        if (day.contributionCount > 0) {
          currentStreak++;
        } else if (day.date !== today) {
          break;
        }
      }
    }

    for (const day of allDays) {
      if (day.contributionCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalContributions: calendar.totalContributions,
      weeklyContributions,
    };
  }

  return { currentStreak: 0, longestStreak: 0, totalContributions: 0, weeklyContributions: [] };
}

// ─── Language stats via per-repo API ─────────────────────────────────────────
// Fetches actual byte counts for up to 10 most-recently-updated repos so that
// the language breakdown reflects real code volume, not just repo count.
async function getLanguageBytes(
  repos: any[]
): Promise<{ [lang: string]: number }> {
  const topRepos = repos
    .filter((r: any) => !r.fork && r.language)
    .slice(0, 10);

  const results = await Promise.allSettled(
    topRepos.map((r: any) =>
      fetchGitHubREST(`/repos/${r.full_name}/languages`)
    )
  );

  const totals: { [lang: string]: number } = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      const langMap = result.value as { [lang: string]: number };
      for (const [lang, bytes] of Object.entries(langMap)) {
        totals[lang] = (totals[lang] || 0) + bytes;
      }
    }
  }
  return totals;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function getGitHubStats(username: string): Promise<GitHubStats> {
  // Return cached result if available
  const cached = getCached(username);
  if (cached) {
    log(`Cache hit for ${username}`);
    return cached;
  }

  try {
    log(`Fetching stats for ${username}`);

    const [user, repos, events] = await Promise.all([
      fetchGitHubREST(`/users/${username}`),
      fetchGitHubREST(`/users/${username}/repos?per_page=100&sort=updated`),
      fetchGitHubREST(`/users/${username}/events/public?per_page=100`),
    ]);

    const totalStars = repos.reduce(
      (acc: number, repo: any) => acc + repo.stargazers_count,
      0
    );

    // Top repos by stars (exclude forks, take top 6)
    const topRepos: TopRepo[] = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r: any) => ({
        name: r.name,
        description: r.description || "",
        language: r.language || "",
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        languageColor: languageColors[r.language] || "#858585",
      }));

    // ── Languages: byte-accurate via per-repo API ──────────────────────────
    let languageBytes: { [lang: string]: number } = {};
    try {
      languageBytes = await getLanguageBytes(repos);
    } catch {
      // Fallback to repo-count method if per-repo calls fail
      repos.forEach((repo: any) => {
        if (repo.language) {
          languageBytes[repo.language] = (languageBytes[repo.language] || 0) + 1;
        }
      });
    }

    const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: languageColors[name] || "#858585",
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // ── Contribution & Streak stats ────────────────────────────────────────
    const hasToken = Boolean(process.env.GITHUB_TOKEN);
    let isFullData = false;

    let contributionStats = {
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      contributedTo: 0,
      totalContributions: 0,
      prsReviewed: 0,
      mergedPRs: 0,
      organizations: 0,
    };

    let streakStats = {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
    };

    if (hasToken) {
      const [cs, ss] = await Promise.all([
        getContributionStats(username),
        getStreakStats(username),
      ]);
      // Only mark as full data if GraphQL returned non-zero results
      if (cs.totalContributions > 0 || cs.totalCommits > 0) {
        contributionStats = cs;
        streakStats = ss;
        isFullData = true;
      } else {
        // GraphQL returned zeros — fall through to REST fallback
        log(`GraphQL returned zero contributions for ${username}, falling back to REST`);
      }
    }

    if (!isFullData) {
          // REST-based approximation from public events (last ~100)
      const pushEvents = events.filter((e: any) => e.type === "PushEvent");
      const prEvents = events.filter((e: any) => e.type === "PullRequestEvent");
      const issueEvents = events.filter((e: any) => e.type === "IssuesEvent");

      contributionStats.totalCommits = pushEvents.reduce(
        (acc: number, e: any) => acc + (e.payload?.commits?.length || 0),
        0
      );
      contributionStats.totalPRs = prEvents.length;
      contributionStats.totalIssues = issueEvents.length;
      contributionStats.contributedTo = new Set(
        repos.filter((r: any) => r.fork).map((r: any) => r.name)
      ).size;

      // Streak from event dates — approximate but honest
      const eventDates = events.map((e: any) => e.created_at.split("T")[0]);
      const uniqueDates = Array.from(new Set<string>(eventDates)).sort().reverse();

      let streak = 0;
      const today = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const date = new Date(uniqueDates[i]);
        const diffDays = Math.floor(
          (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === i || diffDays === i + 1) {
          streak++;
        } else {
          break;
        }
      }
      // Longest streak cannot be derived from REST; store the current streak only
      streakStats.currentStreak = streak;
      streakStats.longestStreak = streak; // honest: we only know what the event log shows
      streakStats.totalContributions = events.length;
      streakStats.weeklyContributions = [];
    }

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const trophies = calculateTrophies({
      totalStars,
      totalCommits: contributionStats.totalCommits,
      totalPRs: contributionStats.totalPRs,
      totalIssues: contributionStats.totalIssues,
      followers: user.followers,
      contributedTo: contributionStats.contributedTo,
      publicRepos: user.public_repos,
      languageCount: Object.keys(languageBytes).length,
      longestStreak: streakStats.longestStreak,
      totalContributions:
        streakStats.totalContributions || contributionStats.totalContributions,
    });

    const result: GitHubStats = {
      username: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio || "",
      location: user.location || "",
      company: user.company || "",
      blog: user.blog || "",
      following: user.following,
      totalStars,
      totalCommits: contributionStats.totalCommits,
      totalPRs: contributionStats.totalPRs,
      totalIssues: contributionStats.totalIssues,
      contributedTo: contributionStats.contributedTo,
      followers: user.followers,
      publicRepos: user.public_repos,
      prsReviewed: contributionStats.prsReviewed,
      mergedPRs: contributionStats.mergedPRs,
      totalForks: repos.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0),
      organizations: contributionStats.organizations,
      accountAgeDays: Math.floor((new Date().getTime() - new Date(user.created_at || new Date()).getTime()) / (1000 * 60 * 60 * 24)),
      languages,
      topRepos,
      streak: {
        current: streakStats.currentStreak,
        longest: streakStats.longestStreak,
        total:
          streakStats.totalContributions || contributionStats.totalContributions,
        start: formatDate(oneYearAgo),
        end: formatDate(new Date()),
      },
      weeklyContributions: streakStats.weeklyContributions ?? [],
      trophies,
      isFullData,
    };

    setCache(username, result);
    return result;
  } catch (error) {
    log(`Error fetching GitHub stats: ${error}`);
    throw error;
  }
}
