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

function getTheme(themeName?: string) {
  if (themeName === "newsprint") {
    return {
      bg: "#ffffff",
      border: "#111111",
      text: "#111111",
      textDim: "#737373",
      accent1: "#111111", // Headers
      accent2: "#CC0000", // Highlights
      rx: "0",
      strokeWidth: "4",
      fontHeader: "900 24px 'Times New Roman', serif",
      fontLabel: "600 12px monospace",
      fontValue: "900 16px 'Times New Roman', serif",
      fontDesc: "400 10px monospace",
      fontFooter: "400 9px monospace",
      heatmap: ["#111111", "#404040", "#737373", "#A3A3A3", "#ffffff"] // reverse order: max to zero
    };
  }

  // default dark classic
  return {
    bg: "#0d1117",
    border: "#30363d",
    text: "#c9d1d9",
    textDim: "#8b949e",
    accent1: "#2ea043", // Stats default
    accent2: "#fb8500", // Streak
    rx: "4.5",
    strokeWidth: "1",
    fontHeader: "600 18px 'Segoe UI', Ubuntu, sans-serif",
    fontLabel: "400 12px 'Segoe UI', Ubuntu, sans-serif",
    fontValue: "600 16px 'Segoe UI', Ubuntu, sans-serif",
    fontDesc: "400 10px 'Segoe UI', Ubuntu, sans-serif",
    fontFooter: "400 9px 'Segoe UI', sans-serif",
    heatmap: ["#39d353", "#26a641", "#006d32", "#0e4429", "#161b22"] // max to zero
  };
}

export function generateStatsSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = opts?.theme === "newsprint" ? t.accent1 : "#2ea043";

  const statsData = [
    { label: "Total Stars",    value: stats.totalStars.toLocaleString(),    icon: "⭐" },
    { label: "Total Commits",  value: stats.totalCommits.toLocaleString(),  icon: "💻" },
    { label: "Total PRs",      value: stats.totalPRs.toLocaleString(),      icon: "🔀" },
    { label: "Merged PRs",     value: stats.mergedPRs.toLocaleString(),     icon: "✅" },
    { label: "Total Issues",   value: stats.totalIssues.toLocaleString(),   icon: "📋" },
    { label: "PRs Reviewed",   value: stats.prsReviewed.toLocaleString(),   icon: "👀" },
    { label: "Contributed To", value: stats.contributedTo.toLocaleString(), icon: "📚" },
    { label: "Total Forks",    value: stats.totalForks.toLocaleString(),    icon: "🔱" },
    { label: "Organizations",  value: stats.organizations.toLocaleString(), icon: "🏢" },
    { label: "Account Age",    value: `${Math.max(1, Math.round(stats.accountAgeDays / 365))} Yrs`, icon: "⏳" },
  ];

  const statsHTML = statsData
    .map((stat, index) => {
      const x = index % 2 === 0 ? 25 : 260;
      const y = 80 + Math.floor(index / 2) * 40;
      return `
        <g transform="translate(${x}, ${y})">
          <text x="0" y="0" class="stat-label">${escapeHtml(stat.label)}:</text>
          <text x="0" y="18" class="stat-value">${escapeHtml(String(stat.value))}</text>
        </g>`;
    })
    .join("");

  const degradedNote = !stats.isFullData
    ? `<text x="25" y="295" font-family="monospace" font-size="10" fill="${t.accent2}">⚠ Limited data</text>`
    : "";

  const height = stats.isFullData ? 300 : 310;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header     { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .stat-label { font: ${t.fontLabel}; fill: ${t.textDim}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .stat-value { font: ${t.fontValue}; fill: ${t.text} }
    .footer     { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="40" class="header">@${escapeHtml(stats.username)}'s Stats</text>
  ${statsHTML}
  ${degradedNote}
</svg>`.trim();
}

export function generateLanguagesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = opts?.theme === "newsprint" ? t.accent1 : "#a371f7";
  const languages = stats.languages.slice(0, 5);

  const barsHTML = languages
    .map((lang, index) => {
      const y = 80 + index * 40;
      const barBg = opts?.theme === "newsprint" ? "transparent" : "#21262d";
      const barBorder = opts?.theme === "newsprint" ? `stroke="${t.border}" stroke-width="1"` : "";
      const barFill = opts?.theme === "newsprint" ? "#111111" : lang.color;
      return `
        <g transform="translate(25, ${y})">
          <text x="0" y="0" class="lang-label">${escapeHtml(lang.name)}</text>
          <text x="445" y="0" text-anchor="end" class="lang-percent">${lang.percentage}%</text>
          <rect x="0" y="8" width="445" height="8" rx="${opts?.theme === 'newsprint' ? '0' : '4'}" fill="${barBg}" ${barBorder}/>
          <rect x="0" y="8" width="${(445 * lang.percentage) / 100}" height="8" rx="${opts?.theme === 'newsprint' ? '0' : '4'}" fill="${barFill}"/>
        </g>`;
    })
    .join("");

  const height = 70 + languages.length * 40 + 20;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header      { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .lang-label  { font: ${t.fontLabel}; fill: ${t.text}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .lang-percent{ font: ${t.fontLabel}; fill: ${t.textDim} }
    .footer      { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="40" class="header">Most Used Languages</text>
  ${barsHTML}
</svg>`.trim();
}

export function generateStreakSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const accent = opts?.theme === "newsprint" ? t.accent1 : "#fb8500";
  const streakColor = opts?.theme === "newsprint" ? t.accent2 : "#fb8500";
  
  const degradedNote = !stats.isFullData
    ? `<text x="247" y="168" text-anchor="middle" font-family="monospace" font-size="10" fill="${t.accent2}">⚠ Approximate — add token</text>`
    : "";

  const height = stats.isFullData ? 180 : 190;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header       { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .stat-label   { font: ${t.fontLabel}; fill: ${t.textDim}; text-transform: ${opts?.theme === 'newsprint' ? 'uppercase' : 'none'} }
    .stat-value   { font: ${opts?.theme === 'newsprint' ? "900 36px 'Times New Roman', serif" : "700 24px 'Segoe UI', sans-serif"}; fill: ${t.text} }
    .streak-value { font: ${opts?.theme === 'newsprint' ? "900 36px 'Times New Roman', serif" : "700 24px 'Segoe UI', sans-serif"}; fill: ${streakColor} }
    .footer       { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="40" class="header">GitHub Streak</text>
  
  ${opts?.theme === 'newsprint' ? `<line x1="247" y1="60" x2="247" y2="120" stroke="${t.border}" stroke-width="1"/>` : ''}

  <g transform="translate(100, 90)">
    <text x="0" y="0" text-anchor="middle" class="streak-value">${stats.streak.current}</text>
    <text x="0" y="20" text-anchor="middle" class="stat-label">Current Streak</text>
  </g>
  <g transform="translate(300, 90)">
    <text x="0" y="0" text-anchor="middle" class="stat-value">${stats.streak.longest}</text>
    <text x="0" y="20" text-anchor="middle" class="stat-label">Longest Streak</text>
  </g>
  <g transform="translate(247, 140)">
    <text x="0" y="0" text-anchor="middle" class="stat-label">Total Contributions: ${stats.streak.total}</text>
  </g>
  ${degradedNote}
</svg>`.trim();
}

export function generateTrophiesSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNewsprint = opts?.theme === "newsprint";
  const accent = isNewsprint ? t.accent1 : "#ec4899";

  const rankColors: { [key: string]: string } = {
    S: isNewsprint ? "#CC0000" : "#ffd700",
    A: isNewsprint ? "#111111" : "#a371f7",
    B: isNewsprint ? "#404040" : "#58a6ff",
    C: isNewsprint ? "#737373" : "#2ea043",
    "?": isNewsprint ? "#A3A3A3" : "#6e7681",
  };

  const trophiesHTML = stats.trophies
    .slice(0, 6)
    .map((trophy, index) => {
      const x = 25 + (index % 3) * 155;
      const y = 60 + Math.floor(index / 3) * 85;
      const color = rankColors[trophy.rank] || "#6e7681";
      const opacity = trophy.achieved ? 1 : 0.4;
      
      if (isNewsprint) {
         return `
          <g transform="translate(${x}, ${y})" opacity="${opacity}">
            <rect width="145" height="75" fill="transparent" stroke="${t.border}" stroke-width="2"/>
            <rect x="110" y="10" width="25" height="20" fill="${trophy.rank === 'S' ? color : 'transparent'}" stroke="${t.border}"/>
            <text x="122.5" y="25" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12" fill="${trophy.rank === 'S' ? '#fff' : t.text}">${trophy.rank}</text>
            <text x="15" y="30" font-family="'Times New Roman', serif" font-weight="bold" font-size="16" fill="${t.text}">${escapeHtml(trophy.name)}</text>
            <text x="15" y="55" font-family="monospace" font-size="9" text-transform="uppercase" fill="${t.textDim}">${escapeHtml(trophy.description)}</text>
          </g>`;
      }

      return `
        <g transform="translate(${x}, ${y})" opacity="${opacity}">
          <rect width="145" height="75" rx="8" fill="#161b22" stroke="#30363d"/>
          <text x="15" y="25" class="trophy-rank" fill="${color}">${trophy.rank}</text>
          <text x="45" y="25" class="trophy-name">${escapeHtml(trophy.name)}</text>
          <text x="15" y="50" class="trophy-desc">${escapeHtml(trophy.description)}</text>
        </g>`;
    })
    .join("");

  const height = stats.trophies.length > 3 ? 240 : 160;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header      { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${isNewsprint ? 'uppercase' : 'none'} }
    .trophy-rank { font: 700 18px 'Segoe UI', Ubuntu, sans-serif }
    .trophy-name { font: 600 13px 'Segoe UI', Ubuntu, sans-serif; fill: #c9d1d9 }
    .trophy-desc { font: 400 10px 'Segoe UI', Ubuntu, sans-serif; fill: #8b949e }
    .footer      { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="40" class="header">Achievements</text>
  ${trophiesHTML}
</svg>`.trim();
}

export function generateOverviewSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNewsprint = opts?.theme === "newsprint";
  const accent = isNewsprint ? t.accent1 : "#e3b341";

  const raw = Math.min(stats.totalCommits / 50, 40) + Math.min(stats.totalPRs / 5, 20) + Math.min(stats.totalIssues / 5, 10) + Math.min(stats.totalStars / 10, 20) + Math.min(stats.followers / 20, 10);
  const score = Math.round(Math.min(raw, 100));
  let rank = "D";
  if (score >= 90) rank = "S";
  else if (score >= 75) rank = "A+";
  else if (score >= 60) rank = "A";
  else if (score >= 45) rank = "B";
  else if (score >= 30) rank = "C";

  return `<svg width="${CARD_WIDTH}" height="150" viewBox="0 0 ${CARD_WIDTH} 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${isNewsprint ? 'uppercase' : 'none'} }
    .rank { font: ${isNewsprint ? "900 64px 'Times New Roman', serif" : "800 48px 'Segoe UI', sans-serif"}; fill: ${isNewsprint ? t.text : '#e3b341'} }
    .score { font: ${t.fontLabel}; fill: ${t.textDim}; text-transform: uppercase }
    .footer      { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="150" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="140" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="40" class="header">Global Rank</text>
  
  ${isNewsprint ? `<line x1="247" y1="60" x2="247" y2="120" stroke="${t.border}" stroke-width="1"/>` : ''}
  
  <text x="140" y="110" text-anchor="middle" class="rank">${rank}</text>
  <text x="360" y="100" text-anchor="middle" class="header" font-size="36">${score}</text>
  <text x="360" y="120" text-anchor="middle" class="score">Score / 100</text>
</svg>`.trim();
}

export function generateHeatmapSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNewsprint = opts?.theme === "newsprint";
  const accent = isNewsprint ? t.accent1 : "#39d353";

  const max = Math.max(...(stats.weeklyContributions || [0]), 1);
  const bars = (stats.weeklyContributions || Array(52).fill(0)).map((val, i) => {
    const h = Math.max((val / max) * 40, 2);
    const x = 25 + i * 8.5;
    const y = 100 - h;
    let fill = t.heatmap[4];
    if (val > 0) {
      if (val/max < 0.25) fill = t.heatmap[3];
      else if (val/max < 0.5) fill = t.heatmap[2];
      else if (val/max < 0.75) fill = t.heatmap[1];
      else fill = t.heatmap[0];
    }
    const border = isNewsprint ? `stroke="${t.border}" stroke-width="1"` : "";
    return `<rect x="${x}" y="${y}" width="6" height="${h}" rx="${isNewsprint ? '0' : '1'}" fill="${fill}" ${border}/>`;
  }).join("");

  return `<svg width="${CARD_WIDTH}" height="130" viewBox="0 0 ${CARD_WIDTH} 130" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${isNewsprint ? 'uppercase' : 'none'} }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="130" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="120" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="35" class="header">Activity Heatmap</text>
  ${bars}
  ${isNewsprint ? `<line x1="25" y1="100" x2="470" y2="100" stroke="${t.border}" stroke-width="2"/>` : ''}
</svg>`.trim();
}

export function generateTopReposSVG(stats: GitHubStats, opts?: SvgOptions): string {
  const t = getTheme(opts?.theme);
  const isNewsprint = opts?.theme === "newsprint";
  const accent = isNewsprint ? t.accent1 : "#a371f7";

  const repos = stats.topRepos.slice(0, 3);
  const reposHTML = repos.map((repo, i) => {
    const y = 70 + i * 45;
    return `<g transform="translate(25, ${y})">
      <text x="0" y="0" font-family="${isNewsprint ? "'Times New Roman', serif" : "'Segoe UI', sans-serif"}" font-weight="600" font-size="${isNewsprint ? '18' : '14'}" fill="${isNewsprint ? t.text : '#58a6ff'}">${escapeHtml(repo.name)}</text>
      <text x="0" y="18" font-family="monospace" font-size="10" fill="${t.textDim}">${escapeHtml(repo.description || "No description").substring(0, 60)}</text>
      <text x="445" y="0" text-anchor="end" font-family="monospace" font-size="12" font-weight="bold" fill="${isNewsprint ? t.text : '#c9d1d9'}">⭐ ${repo.stars}</text>
    </g>`;
  }).join("");

  const height = 80 + repos.length * 45;

  return `<svg width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: ${t.fontHeader}; fill: ${accent}; text-transform: ${isNewsprint ? 'uppercase' : 'none'} }
    .footer { font: ${t.fontFooter}; fill: ${t.textDim}; text-transform: uppercase }
  </style>
  <rect width="${CARD_WIDTH}" height="${height}" rx="${t.rx}" fill="${t.bg}" stroke="${t.border}" stroke-width="${t.strokeWidth}"/>
  <text x="${CARD_WIDTH - 10}" y="${height - 10}" text-anchor="end" class="footer">Oi Git</text>
  <text x="25" y="35" class="header">Top Repositories</text>
  ${reposHTML}
</svg>`.trim();
}
