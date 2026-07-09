import type { GitHubStats } from "../shared/types";

const CARD_WIDTH = 495;
const CARD_PAD = 24;

export interface SvgOptions {
  theme?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Theme {
  bg: string; border: string; text: string; textDim: string;
  accent1: string; accent2: string; cardBg: string; cardBorder: string;
  headerSize: string; bodySize: string; labelSize: string; valueSize: string;
  fontHeading: string; fontBody: string; fontMono: string;
  heatmap: string[];
}

function getTheme(themeName?: string): Theme {
  const themes: Record<string, Theme> = {
    "github-dark": {
      bg: "#0d1117", border: "#30363d", text: "#e6edf3", textDim: "#8b949e",
      accent1: "#2ea043", accent2: "#fb8500",
      cardBg: "#161b22", cardBorder: "#21262d",
      headerSize: "20", bodySize: "14", labelSize: "11", valueSize: "22",
      fontHeading: "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontBody: "400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "400 11px 'SF Mono', 'Fira Code', monospace",
      heatmap: ["#39d353", "#26a641", "#006d32", "#0e4429", "#161b22"],
    },
    "github-light": {
      bg: "#ffffff", border: "#d0d7de", text: "#1f2328", textDim: "#656d76",
      accent1: "#0969da", accent2: "#bf3989",
      cardBg: "#f6f8fa", cardBorder: "#d0d7de",
      headerSize: "20", bodySize: "14", labelSize: "11", valueSize: "22",
      fontHeading: "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontBody: "400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "400 11px 'SF Mono', 'Fira Code', monospace",
      heatmap: ["#216e39", "#30a14e", "#40c463", "#9be9a8", "#ebedf0"],
    },
    dracula: {
      bg: "#282a36", border: "#44475a", text: "#f8f8f2", textDim: "#6272a4",
      accent1: "#50fa7b", accent2: "#ff79c6",
      cardBg: "#21222c", cardBorder: "#44475a",
      headerSize: "20", bodySize: "14", labelSize: "11", valueSize: "22",
      fontHeading: "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontBody: "400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "400 11px 'SF Mono', 'Fira Code', monospace",
      heatmap: ["#50fa7b", "#8be9fd", "#bd93f9", "#ff79c6", "#282a36"],
    },
    nord: {
      bg: "#2e3440", border: "#4c566a", text: "#eceff4", textDim: "#81a1c1",
      accent1: "#88c0d0", accent2: "#bf616a",
      cardBg: "#3b4252", cardBorder: "#4c566a",
      headerSize: "20", bodySize: "14", labelSize: "11", valueSize: "22",
      fontHeading: "600 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontBody: "400 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontMono: "400 11px 'SF Mono', 'Fira Code', monospace",
      heatmap: ["#a3be8c", "#81a1c1", "#88c0d0", "#5e81ac", "#2e3440"],
    },
    newsprint: {
      bg: "#faf6eb", border: "#111111", text: "#111111", textDim: "#737373",
      accent1: "#111111", accent2: "#CC0000",
      cardBg: "#ffffff", cardBorder: "#111111",
      headerSize: "20", bodySize: "14", labelSize: "11", valueSize: "22",
      fontHeading: "700 20px 'Times New Roman', Georgia, serif",
      fontBody: "400 14px Georgia, 'Times New Roman', serif",
      fontMono: "400 11px 'Courier New', monospace",
      heatmap: ["#111111", "#404040", "#737373", "#A3A3A3", "#ffffff"],
    },
  };

  const theme = themeName ? themes[themeName] : undefined;
  if (theme) return theme;
  return themes["github-dark"];
}

// ─── Helper: card wrapper ─────────────────────────────────────────────────────

function cardHeader(t: Theme, accent: string, label: string): string {
  return `
    <rect x="0" y="0" width="${CARD_WIDTH}" height="48" fill="${t.cardBg}" rx="6"/>
    <text x="${CARD_PAD}" y="31" fill="${accent}" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="16">${escapeHtml(label)}</text>`;
}

function cardFooter(t: Theme, height: number): string {
  return `<text x="${CARD_WIDTH - CARD_PAD}" y="${height - 12}" text-anchor="end" fill="${t.textDim}" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="10">oigit.app</text>`;
}

function cardBg(t: Theme, height: number): string {
  return `<rect x="0" y="0" width="${CARD_WIDTH}" height="${height}" rx="8" fill="${t.bg}"/>
  <rect x="0" y="0" width="${CARD_WIDTH}" height="${height}" rx="8" stroke="${t.border}" stroke-width="1" fill="none"/>`;
}

function dataNote(t: Theme, stats: GitHubStats): string {
  if (stats.isFullData) return "";
  const msg = stats.graphqlError
    ? "Incomplete data — token may lack required scopes"
    : "Limited data — add GITHUB_TOKEN for full stats";
  return `<text x="${CARD_PAD}" y="0" fill="${t.accent2}" font-family="system-ui, sans-serif" font-weight="500" font-size="11">&#9888; ${msg}</text>`;
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

export function generateStatsSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent1;

  const rows = [
    ["Total Stars", stats.totalStars.toLocaleString()],
    ["Total Commits", stats.totalCommits.toLocaleString()],
    ["Total PRs", stats.totalPRs.toLocaleString()],
    ["Merged PRs", stats.mergedPRs.toLocaleString()],
    ["Total Issues", stats.totalIssues.toLocaleString()],
    ["PRs Reviewed", stats.prsReviewed.toLocaleString()],
    ["Contributed To", stats.contributedTo.toLocaleString()],
    ["Total Forks", stats.totalForks.toLocaleString()],
    ["Organizations", stats.organizations.toLocaleString()],
    ["Account Age", `${Math.max(1, Math.round(stats.accountAgeDays / 365))} yrs`],
  ];

  const contentY = 65;
  const rowH = 34;
  const colW = 225;
  const colGap = 20;

  const items = rows.map(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = CARD_PAD + col * (colW + colGap);
    const y = contentY + row * rowH;
    return `
    <g transform="translate(${x}, ${y})">
      <rect x="-6" y="-10" width="${colW + 12}" height="30" rx="4" fill="${t.cardBg}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="6" y="-1" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="11">${escapeHtml(label)}</text>
      <text x="6" y="14" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="600" font-size="15">${escapeHtml(value)}</text>
    </g>`;
  }).join("");

  const dataRows = rows.length / 2;
  const noteY = contentY + dataRows * rowH + 6;
  const height = stats.isFullData
    ? contentY + dataRows * rowH + 30
    : contentY + dataRows * rowH + 48;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, height)}
  ${cardHeader(t, accent, `@${escapeHtml(stats.username)}`)}
  <text x="${CARD_PAD}" y="55" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="12">GitHub Stats</text>
  <g transform="translate(0, 0)">${items}</g>
  <g transform="translate(0, ${noteY})">${dataNote(t, stats)}</g>
  ${cardFooter(t, height)}
</svg>`.trim();
}

// ─── Languages Card ───────────────────────────────────────────────────────────

export function generateLanguagesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent1;
  const languages = stats.languages.slice(0, 5);

  const contentY = 65;
  const barH = 20;
  const barGap = 8;

  const bars = languages.map((lang, i) => {
    const y = contentY + i * (barH + barGap);
    const w = Math.max(30, (lang.percentage / 100) * (CARD_WIDTH - CARD_PAD * 2));
    return `
    <g transform="translate(${CARD_PAD}, ${y})">
      <rect x="0" y="0" width="${CARD_WIDTH - CARD_PAD * 2}" height="${barH}" rx="4" fill="${t.cardBg}"/>
      <rect x="0" y="0" width="${w}" height="${barH}" rx="4" fill="${lang.color || accent}"/>
      <text x="10" y="14" fill="${t.bg}" font-family="system-ui, sans-serif" font-weight="600" font-size="11">${escapeHtml(lang.name)}</text>
      <text x="${CARD_WIDTH - CARD_PAD * 2 - 10}" y="14" text-anchor="end" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="500" font-size="11">${lang.percentage}%</text>
    </g>`;
  }).join("");

  const height = languages.length > 0
    ? contentY + languages.length * (barH + barGap) + 38
    : 130;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, height)}
  ${cardHeader(t, accent, "Most Used Languages")}
  <g>${bars}</g>
  ${cardFooter(t, height)}
</svg>`.trim();
}

// ─── Streak Card ──────────────────────────────────────────────────────────────

export function generateStreakSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent2;

  const contentY = 65;
  const colCenter1 = CARD_WIDTH / 4 + 10;
  const colCenter2 = (3 * CARD_WIDTH) / 4 - 10;

  const height = stats.isFullData ? 200 : 220;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, height)}
  ${cardHeader(t, accent, "GitHub Streak")}

  <g transform="translate(${colCenter1}, ${contentY + 20})">
    <rect x="-80" y="-30" width="160" height="90" rx="8" fill="${t.cardBg}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="0" y="0" text-anchor="middle" fill="${accent}" font-family="system-ui, sans-serif" font-weight="800" font-size="32">${stats.streak.current}</text>
    <text x="0" y="22" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="500" font-size="12">Current Streak</text>
    <text x="0" y="42" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="10">days</text>
  </g>

  <g transform="translate(${colCenter2}, ${contentY + 20})">
    <rect x="-80" y="-30" width="160" height="90" rx="8" fill="${t.cardBg}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="0" y="0" text-anchor="middle" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="800" font-size="32">${stats.streak.longest}</text>
    <text x="0" y="22" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="500" font-size="12">Longest Streak</text>
    <text x="0" y="42" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="10">days</text>
  </g>

  <g transform="translate(247, ${height - 50})">
    <text x="0" y="0" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="12">
      Total contributions: <tspan fill="${t.text}" font-weight="600">${stats.streak.total.toLocaleString()}</tspan>
    </text>
  </g>

  <g transform="translate(${CARD_PAD}, ${height - 38})">${dataNote(t, stats)}</g>
  ${cardFooter(t, height)}
</svg>`.trim();
}

// ─── Trophies Card ────────────────────────────────────────────────────────────

export function generateTrophiesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent2;

  const rankColors: Record<string, string> = {
    S: "#ffd700", A: "#a371f7", B: "#58a6ff", C: "#2ea043", "?": "#6e7681",
  };

  const trophies = stats.trophies.slice(0, 6);
  const contentY = 60;
  const tw = 145;
  const tgap = 10;
  const th = 80;
  const cols = 3;
  const startX = CARD_PAD;

  const items = trophies.map((trophy, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (tw + tgap);
    const y = contentY + row * (th + tgap);
    const color = rankColors[trophy.rank] || "#6e7681";
    const opacity = trophy.achieved ? 1 : 0.4;
    return `
    <g transform="translate(${x}, ${y})" opacity="${opacity}">
      <rect width="${tw}" height="${th}" rx="6" fill="${t.cardBg}" stroke="${t.cardBorder}" stroke-width="1"/>
      <rect x="${tw - 34}" y="0" width="34" height="24" rx="0" ry="0" fill="${color}" stroke="none"/>
      <text x="${tw - 17}" y="17" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="13">${trophy.rank}</text>
      <text x="10" y="18" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="600" font-size="13">${escapeHtml(trophy.name)}</text>
      <text x="10" y="40" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="10">${escapeHtml(trophy.description)}</text>
    </g>`;
  }).join("");

  const rowCount = Math.ceil(trophies.length / cols);
  const height = contentY + rowCount * (th + tgap) + 30;
  const areaH = height - 30;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, height)}
  ${cardHeader(t, accent, "Achievements")}
  <g>${items}</g>
  ${cardFooter(t, height)}
</svg>`.trim();
}

// ─── Overview Card ────────────────────────────────────────────────────────────

export function generateOverviewSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = "#e3b341";

  const raw = Math.min(stats.totalCommits / 50, 40)
    + Math.min(stats.totalPRs / 5, 20)
    + Math.min(stats.totalIssues / 5, 10)
    + Math.min(stats.totalStars / 20, 20)
    + Math.min(stats.followers / 20, 10);
  const score = Math.round(Math.min(raw, 100));
  let rank = "D";
  let rankColor = "#6e7681";
  if (score >= 90) { rank = "S"; rankColor = "#ffd700"; }
  else if (score >= 75) { rank = "A+"; rankColor = "#a371f7"; }
  else if (score >= 60) { rank = "A"; rankColor = "#58a6ff"; }
  else if (score >= 45) { rank = "B"; rankColor = "#2ea043"; }
  else if (score >= 30) { rank = "C"; rankColor = "#fb8500"; }

  return `<svg width="${CARD_WIDTH}" height="170" viewBox="0 0 ${CARD_WIDTH} 170" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, 170)}
  ${cardHeader(t, accent, "Global Rank")}

  <g transform="translate(140, 100)">
    <circle cx="0" cy="0" r="48" fill="${t.cardBg}" stroke="${rankColor}" stroke-width="4"/>
    <text x="0" y="12" text-anchor="middle" fill="${rankColor}" font-family="system-ui, sans-serif" font-weight="800" font-size="36">${rank}</text>
  </g>

  <g transform="translate(360, 100)">
    <text x="0" y="0" text-anchor="middle" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="700" font-size="42">${score}</text>
    <text x="0" y="22" text-anchor="middle" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="500" font-size="12">Score / 100</text>
  </g>

  ${cardFooter(t, 170)}
</svg>`.trim();
}

// ─── Heatmap Card ─────────────────────────────────────────────────────────────

export function generateHeatmapSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent1;
  const wData = stats.weeklyContributions.length > 0 ? stats.weeklyContributions : Array(52).fill(0);

  const max = Math.max(...wData, 1);
  const barW = 6;
  const barGap = 2.5;
  const totalBarW = barW + barGap;
  const barsAreaW = CARD_WIDTH - CARD_PAD * 2;
  const barsStartX = CARD_PAD + (barsAreaW - wData.length * totalBarW) / 2;

  const bars = wData.map((val, i) => {
    const h = Math.max((val / max) * 50, 2);
    const x = barsStartX + i * totalBarW;
    const y = 115 - h;
    let fill = t.heatmap[4];
    if (val > 0) {
      if (val/max < 0.25) fill = t.heatmap[3];
      else if (val/max < 0.5) fill = t.heatmap[2];
      else if (val/max < 0.75) fill = t.heatmap[1];
      else fill = t.heatmap[0];
    }
    return `<rect x="${Math.round(x * 10) / 10}" y="${y}" width="${barW}" height="${h}" rx="2" fill="${fill}"/>`;
  }).join("");

  return `<svg width="${CARD_WIDTH}" height="150" viewBox="0 0 ${CARD_WIDTH} 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, 150)}
  ${cardHeader(t, accent, "Activity Heatmap")}

  <g>${bars}</g>

  <text x="${CARD_PAD}" y="128" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="10">52-week activity</text>
  <text x="${CARD_WIDTH - CARD_PAD}" y="128" text-anchor="end" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="10">Max: <tspan fill="${t.text}" font-weight="600">${max}</tspan> contributions</text>

  ${cardFooter(t, 150)}
</svg>`.trim();
}

// ─── Top Repos Card ───────────────────────────────────────────────────────────

export function generateTopReposSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = t.accent1;
  const repos = stats.topRepos.slice(0, 4);

  const contentY = 65;
  const repoH = 52;

  const items = repos.map((repo, i) => {
    const y = contentY + i * repoH;
    const color = repo.languageColor || t.textDim;
    return `
    <g transform="translate(${CARD_PAD}, ${y})">
      <rect x="0" y="0" width="${CARD_WIDTH - CARD_PAD * 2}" height="${repoH - 4}" rx="6" fill="${t.cardBg}" stroke="${t.cardBorder}" stroke-width="1"/>
      <circle cx="12" cy="20" r="4" fill="${color}"/>
      <text x="22" y="19" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="600" font-size="14">${escapeHtml(repo.name)}</text>
      <text x="${CARD_WIDTH - CARD_PAD * 2 - 10}" y="19" text-anchor="end" fill="${t.text}" font-family="system-ui, sans-serif" font-weight="600" font-size="13">&#9733; ${repo.stars}</text>
      <text x="22" y="36" fill="${t.textDim}" font-family="system-ui, sans-serif" font-weight="400" font-size="11">${escapeHtml((repo.description || "No description").substring(0, 55))}</text>
    </g>`;
  }).join("");

  const height = contentY + repos.length * repoH + 30;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${cardBg(t, height)}
  ${cardHeader(t, accent, "Top Repositories")}
  <g>${items}</g>
  ${cardFooter(t, height)}
</svg>`.trim();
}

// ─── Composite ────────────────────────────────────────────────────────────────

function extractSvgHeight(svg: string): number {
  const viewBoxMatch = svg.match(/viewBox="[^"]*\s(\d+)"/);
  if (viewBoxMatch) return parseInt(viewBoxMatch[1], 10);
  const heightMatch = svg.match(/height="(\d+)"/);
  if (heightMatch) return parseInt(heightMatch[1], 10);
  return 150;
}

function stripSvgWrapper(svg: string): string {
  const start = svg.indexOf(">") + 1;
  const end = svg.lastIndexOf("</svg>");
  return svg.slice(start, end).trim();
}

export function generateCompositeSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const generators = [
    generateStatsSVG,
    generateLanguagesSVG,
    generateStreakSVG,
    generateTrophiesSVG,
    generateOverviewSVG,
    generateHeatmapSVG,
    generateTopReposSVG,
  ];

  const cards = generators.map((fn) => fn(stats, opts));
  const gap = 16;

  let totalHeight = 0;
  const offsets: number[] = [];
  for (const card of cards) {
    offsets.push(totalHeight);
    totalHeight += extractSvgHeight(card) + gap;
  }
  totalHeight -= gap;

  const t = getTheme(opts?.theme);

  const inner = cards
    .map((card, i) => {
      const innerSvg = stripSvgWrapper(card);
      return `<g transform="translate(0, ${offsets[i]})">\n${innerSvg}\n</g>`;
    })
    .join("\n\n");

  return `<svg width="${CARD_WIDTH}" height="${totalHeight}" viewBox="0 0 ${CARD_WIDTH} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${inner}
</svg>`.trim();
}
