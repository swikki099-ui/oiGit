import type { GitHubStats } from "../shared/types";

const CARD_WIDTH = 495;

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
  accent1: string; accent2: string; rx: string; strokeWidth: string;
  fontHeader: string; fontLabel: string; fontValue: string;
  fontDesc: string; fontFooter: string; heatmap: string[];
}

function getTheme(themeName?: string): Theme {
  const themes: Record<string, Theme> = {
    newsprint: {
      bg: "#ffffff", border: "#111111", text: "#111111", textDim: "#737373",
      accent1: "#111111", accent2: "#CC0000", rx: "0", strokeWidth: "4",
      fontHeader: "900 24px 'Times New Roman', serif",
      fontLabel: "600 12px monospace",
      fontValue: "900 16px 'Times New Roman', serif",
      fontDesc: "400 10px monospace",
      fontFooter: "400 9px monospace",
      heatmap: ["#111111", "#404040", "#737373", "#A3A3A3", "#ffffff"],
    },
    dracula: {
      bg: "#282a36", border: "#6272a4", text: "#f8f8f2", textDim: "#6272a4",
      accent1: "#50fa7b", accent2: "#ff79c6", rx: "4.5", strokeWidth: "1",
      fontHeader: "600 18px 'Segoe UI', Ubuntu, sans-serif",
      fontLabel: "400 12px 'Segoe UI', Ubuntu, sans-serif",
      fontValue: "600 16px 'Segoe UI', Ubuntu, sans-serif",
      fontDesc: "400 10px 'Segoe UI', Ubuntu, sans-serif",
      fontFooter: "400 9px 'Segoe UI', sans-serif",
      heatmap: ["#50fa7b", "#8be9fd", "#bd93f9", "#ff79c6", "#282a36"],
    },
    nord: {
      bg: "#2e3440", border: "#4c566a", text: "#eceff4", textDim: "#81a1c1",
      accent1: "#88c0d0", accent2: "#bf616a", rx: "4.5", strokeWidth: "1",
      fontHeader: "600 18px 'Segoe UI', Ubuntu, sans-serif",
      fontLabel: "400 12px 'Segoe UI', Ubuntu, sans-serif",
      fontValue: "600 16px 'Segoe UI', Ubuntu, sans-serif",
      fontDesc: "400 10px 'Segoe UI', Ubuntu, sans-serif",
      fontFooter: "400 9px 'Segoe UI', sans-serif",
      heatmap: ["#a3be8c", "#81a1c1", "#88c0d0", "#5e81ac", "#2e3440"],
    },
    "github-light": {
      bg: "#ffffff", border: "#d0d7de", text: "#1f2328", textDim: "#656d76",
      accent1: "#0969da", accent2: "#bf3989", rx: "4.5", strokeWidth: "1",
      fontHeader: "600 18px 'Segoe UI', Ubuntu, sans-serif",
      fontLabel: "400 12px 'Segoe UI', Ubuntu, sans-serif",
      fontValue: "600 16px 'Segoe UI', Ubuntu, sans-serif",
      fontDesc: "400 10px 'Segoe UI', Ubuntu, sans-serif",
      fontFooter: "400 9px 'Segoe UI', sans-serif",
      heatmap: ["#216e39", "#30a14e", "#40c463", "#9be9a8", "#ebedf0"],
    },
  };

  const theme = themeName ? themes[themeName] : undefined;
  if (theme) return theme;

  // default dark
  return {
    bg: "#0d1117", border: "#30363d", text: "#c9d1d9", textDim: "#8b949e",
    accent1: "#2ea043", accent2: "#fb8500", rx: "4.5", strokeWidth: "1",
    fontHeader: "600 18px 'Segoe UI', Ubuntu, sans-serif",
    fontLabel: "400 12px 'Segoe UI', Ubuntu, sans-serif",
    fontValue: "600 16px 'Segoe UI', Ubuntu, sans-serif",
    fontDesc: "400 10px 'Segoe UI', Ubuntu, sans-serif",
    fontFooter: "400 9px 'Segoe UI', sans-serif",
    heatmap: ["#39d353", "#26a641", "#006d32", "#0e4429", "#161b22"],
  };
}

function dataNote(t: Theme, stats: GitHubStats): string {
  if (stats.isFullData) return "";
  const msg = stats.graphqlError
    ? "Incomplete data \u2014 token may lack required scopes"
    : "Limited data \u2014 add GITHUB_TOKEN for full stats";
  return `<text x="25" y="-5" font-family="monospace" font-size="10" fill="${t.accent2}">\u26A0 ${msg}</text>`;
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

export function generateStatsSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#2ea043";

  const statsData = [
    { label: "Total Stars",    value: stats.totalStars.toLocaleString(),    icon: "\u2B50" },
    { label: "Total Commits",  value: stats.totalCommits.toLocaleString(),  icon: "\uD83D\uDCBB" },
    { label: "Total PRs",      value: stats.totalPRs.toLocaleString(),      icon: "\uD83D\uDD00" },
    { label: "Merged PRs",     value: stats.mergedPRs.toLocaleString(),     icon: "\u2705" },
    { label: "Total Issues",   value: stats.totalIssues.toLocaleString(),   icon: "\uD83D\uDCCB" },
    { label: "PRs Reviewed",   value: stats.prsReviewed.toLocaleString(),   icon: "\uD83D\uDC40" },
    { label: "Contributed To", value: stats.contributedTo.toLocaleString(), icon: "\uD83D\uDCDA" },
    { label: "Total Forks",    value: stats.totalForks.toLocaleString(),    icon: "\uD83D\uDD31" },
    { label: "Organizations",  value: stats.organizations.toLocaleString(), icon: "\uD83C\uDFE2" },
    { label: "Account Age",    value: `${Math.max(1, Math.round(stats.accountAgeDays / 365))} Yrs`, icon: "\u23F3" },
  ];

  const items = statsData.map((stat, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 25 : 260;
    const y = 80 + row * 40;
    return `
    <g transform="translate(${x}, ${y})">
      <text x="0" y="0" class="stat-label">${escapeHtml(stat.label)}:</text>
      <text x="0" y="18" class="stat-value">${escapeHtml(stat.value)}</text>
    </g>`;
  }).join("");

  const degradedNote = dataNote(t, stats);
  const height = stats.isFullData ? 300 : 315;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header     { font: ${t.fontHeader}; fill: ${accent} }
    .stat-label { font: ${t.fontLabel}; fill: ${t.textDim} }
    .stat-value { font: ${t.fontValue}; fill: ${t.text} }
    .footer     { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">@${escapeHtml(stats.username)}</text>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">oigit.app</text>
  ${items}
  ${!stats.isFullData ? `<g transform="translate(0, 280)">${degradedNote}</g>` : ""}
</svg>`.trim();
}

// ─── Languages Card ───────────────────────────────────────────────────────────

export function generateLanguagesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#a371f7";
  const languages = stats.languages.slice(0, 5);

  const bars = languages.map((lang, i) => {
    const y = 80 + i * 40;
    const barFill = isNews ? "#111111" : lang.color;
    const barBg = isNews ? "transparent" : "#21262d";
    const barBorder = isNews ? `stroke="${t.border}" stroke-width="1"` : "";
    return `
    <g transform="translate(25, ${y})">
      <text x="0" y="0" class="lang-label">${escapeHtml(lang.name)}</text>
      <text x="445" y="0" text-anchor="end" class="lang-percent">${lang.percentage}%</text>
      <rect x="0" y="8" width="445" height="8" rx="${isNews ? '0' : '4'}" fill="${barBg}" ${barBorder}/>
      <rect x="0" y="8" width="${Math.round(445 * lang.percentage / 100)}" height="8" rx="${isNews ? '0' : '4'}" fill="${barFill}"/>
    </g>`;
  }).join("");

  const h = 70 + languages.length * 40 + 20;

  return `<svg width="${CARD_WIDTH}" height="${h}" viewBox="0 0 ${CARD_WIDTH} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header      { font: ${t.fontHeader}; fill: ${accent} }
    .lang-label  { font: ${t.fontLabel}; fill: ${t.text} }
    .lang-percent{ font: ${t.fontLabel}; fill: ${t.textDim} }
    .footer      { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${h}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">Most Used Languages</text>
  <text x="${CARD_WIDTH - 10}" y="${h - 10}" text-anchor="end" class="footer">oigit.app</text>
  ${bars}
</svg>`.trim();
}

// ─── Streak Card ──────────────────────────────────────────────────────────────

export function generateStreakSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#fb8500";
  const streakColor = isNews ? t.accent2 : "#fb8500";

  const note = dataNote(t, stats);
  const h = stats.isFullData ? 180 : 195;

  return `<svg width="${CARD_WIDTH}" height="${h}" viewBox="0 0 ${CARD_WIDTH} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header       { font: ${t.fontHeader}; fill: ${accent} }
    .stat-label   { font: ${t.fontLabel}; fill: ${t.textDim} }
    .stat-value   { font: ${isNews ? "900 36px 'Times New Roman', serif" : "700 24px 'Segoe UI', sans-serif"}; fill: ${t.text} }
    .streak-value { font: ${isNews ? "900 36px 'Times New Roman', serif" : "700 24px 'Segoe UI', sans-serif"}; fill: ${streakColor} }
    .footer       { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${h}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">GitHub Streak</text>
  <text x="${CARD_WIDTH - 10}" y="${h - 10}" text-anchor="end" class="footer">oigit.app</text>

  <g transform="translate(100, 90)">
    <text x="0" y="0" text-anchor="middle" class="streak-value">${stats.streak.current}</text>
    <text x="0" y="20" text-anchor="middle" class="stat-label">Current Streak</text>
  </g>
  <g transform="translate(300, 90)">
    <text x="0" y="0" text-anchor="middle" class="stat-value">${stats.streak.longest}</text>
    <text x="0" y="20" text-anchor="middle" class="stat-label">Longest Streak</text>
  </g>
  <g transform="translate(247, ${h - 40})">
    <text x="0" y="0" text-anchor="middle" class="stat-label">Total Contributions: ${stats.streak.total.toLocaleString()}</text>
  </g>
  ${note}
</svg>`.trim();
}

// ─── Trophies Card ────────────────────────────────────────────────────────────

export function generateTrophiesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#ec4899";

  const rankColors: Record<string, string> = {
    S: isNews ? "#CC0000" : "#ffd700",
    A: isNews ? "#111111" : "#a371f7",
    B: isNews ? "#404040" : "#58a6ff",
    C: isNews ? "#737373" : "#2ea043",
    "?": isNews ? "#A3A3A3" : "#6e7681",
  };

  const trophies = stats.trophies.slice(0, 6);
  const items = trophies.map((trophy, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 25 + col * 155;
    const y = 60 + row * 80;
    const color = rankColors[trophy.rank] || "#6e7681";
    const op = trophy.achieved ? 1 : 0.4;
    if (isNews) return `
    <g transform="translate(${x}, ${y})" opacity="${op}">
      <rect width="145" height="72" fill="transparent" stroke="${t.border}" stroke-width="2"/>
      <rect x="110" y="10" width="25" height="20" fill="${trophy.rank === 'S' ? color : 'transparent'}" stroke="${t.border}"/>
      <text x="122.5" y="25" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12" fill="${trophy.rank === 'S' ? '#fff' : t.text}">${trophy.rank}</text>
      <text x="15" y="28" font-family="'Times New Roman', serif" font-weight="bold" font-size="16" fill="${t.text}">${escapeHtml(trophy.name)}</text>
      <text x="15" y="52" font-family="monospace" font-size="9" text-transform="uppercase" fill="${t.textDim}">${escapeHtml(trophy.description)}</text>
    </g>`;
    return `
    <g transform="translate(${x}, ${y})" opacity="${op}">
      <rect width="145" height="72" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="12" y="24" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="700" font-size="18" fill="${color}">${trophy.rank}</text>
      <text x="38" y="24" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="600" font-size="13" fill="#c9d1d9">${escapeHtml(trophy.name)}</text>
      <text x="12" y="50" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="400" font-size="10" fill="#8b949e">${escapeHtml(trophy.description)}</text>
    </g>`;
  }).join("");

  const h = trophies.length > 3 ? 240 : 160;

  return `<svg width="${CARD_WIDTH}" height="${h}" viewBox="0 0 ${CARD_WIDTH} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent} }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${h}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">Achievements</text>
  <text x="${CARD_WIDTH - 10}" y="${h - 10}" text-anchor="end" class="footer">oigit.app</text>
  ${items}
</svg>`.trim();
}

// ─── Overview Card ────────────────────────────────────────────────────────────

export function generateOverviewSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#e3b341";

  const raw = Math.min(stats.totalCommits / 50, 40)
    + Math.min(stats.totalPRs / 5, 20)
    + Math.min(stats.totalIssues / 5, 10)
    + Math.min(stats.totalStars / 20, 20)
    + Math.min(stats.followers / 20, 10);
  const score = Math.round(Math.min(raw, 100));
  let rank = "D";
  if (score >= 90) rank = "S";
  else if (score >= 75) rank = "A+";
  else if (score >= 60) rank = "A";
  else if (score >= 45) rank = "B";
  else if (score >= 30) rank = "C";

  return `<svg width="${CARD_WIDTH}" height="150" viewBox="0 0 ${CARD_WIDTH} 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent} }
    .rank { font: ${isNews ? "900 56px 'Times New Roman', serif" : "800 48px 'Segoe UI', sans-serif"}; fill: ${isNews ? t.text : '#e3b341'} }
    .score { font: ${t.fontLabel}; fill: ${t.textDim}; text-transform: uppercase }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="150" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">Global Rank</text>
  <text x="${CARD_WIDTH - 10}" y="140" text-anchor="end" class="footer">oigit.app</text>

  <text x="140" y="110" text-anchor="middle" class="rank">${rank}</text>
  <text x="360" y="100" text-anchor="middle" font-family="${isNews ? "'Times New Roman', serif" : "'Segoe UI', sans-serif"}" font-weight="700" font-size="42" fill="${isNews ? t.text : '#e3b341'}">${score}</text>
  <text x="360" y="120" text-anchor="middle" class="score">Score / 100</text>
</svg>`.trim();
}

// ─── Heatmap Card ─────────────────────────────────────────────────────────────

export function generateHeatmapSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#39d353";
  const w = stats.weeklyContributions.length > 0 ? stats.weeklyContributions : Array(52).fill(0);

  const max = Math.max(...w, 1);
  const bars = w.map((val, i) => {
    const barH = Math.max((val / max) * 50, 2);
    const x = 25 + i * 8.5;
    const y = 110 - barH;
    let fill = t.heatmap[4];
    if (val > 0) {
      if (val / max < 0.25) fill = t.heatmap[3];
      else if (val / max < 0.5) fill = t.heatmap[2];
      else if (val / max < 0.75) fill = t.heatmap[1];
      else fill = t.heatmap[0];
    }
    return `<rect x="${x}" y="${y}" width="6" height="${barH}" rx="${isNews ? '0' : '1'}" fill="${fill}"/>`;
  }).join("");

  return `<svg width="${CARD_WIDTH}" height="130" viewBox="0 0 ${CARD_WIDTH} 130" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent} }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="130" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">Activity Heatmap</text>
  <text x="${CARD_WIDTH - 10}" y="120" text-anchor="end" class="footer">oigit.app</text>
  ${bars}
</svg>`.trim();
}

// ─── Top Repos Card ───────────────────────────────────────────────────────────

export function generateTopReposSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNews = opts?.theme === "newsprint";
  const accent = isNews ? t.accent1 : "#a371f7";

  const repos = stats.topRepos.slice(0, 3);
  const items = repos.map((repo, i) => {
    const y = 70 + i * 45;
    return `
    <g transform="translate(25, ${y})">
      <text x="0" y="0" font-family="${isNews ? "'Times New Roman', serif" : "'Segoe UI', sans-serif"}" font-weight="600" font-size="${isNews ? '18' : '14'}" fill="${isNews ? t.text : '#58a6ff'}">${escapeHtml(repo.name)}</text>
      <text x="0" y="18" font-family="monospace" font-size="10" fill="${t.textDim}">${escapeHtml((repo.description || "No description").substring(0, 60))}</text>
      <text x="445" y="0" text-anchor="end" font-family="monospace" font-size="12" font-weight="bold" fill="${isNews ? t.text : '#c9d1d9'}">${repo.stars} stars</text>
    </g>`;
  }).join("");

  const h = 80 + repos.length * 45;

  return `<svg width="${CARD_WIDTH}" height="${h}" viewBox="0 0 ${CARD_WIDTH} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent} }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${h}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="25" y="40" class="header">Top Repositories</text>
  <text x="${CARD_WIDTH - 10}" y="${h - 10}" text-anchor="end" class="footer">oigit.app</text>
  ${items}
</svg>`.trim();
}

// ─── Composite (unchanged contract) ───────────────────────────────────────────

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
    generateStatsSVG, generateLanguagesSVG, generateStreakSVG,
    generateTrophiesSVG, generateOverviewSVG, generateHeatmapSVG,
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

  const inner = cards
    .map((card, i) => `<g transform="translate(0, ${offsets[i]})">\n${stripSvgWrapper(card)}\n</g>`)
    .join("\n\n");

  return `<svg width="${CARD_WIDTH}" height="${totalHeight}" viewBox="0 0 ${CARD_WIDTH} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${inner}
</svg>`.trim();
}
