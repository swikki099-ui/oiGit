import type { IncomingMessage, ServerResponse } from "http";
import {
  errorSVG,
  validateUsername,
  fetchStats,
  getUserErrorStatus,
  generateSvgForType,
} from "../server/handlers";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseUrl(req: IncomingMessage) {
  const base = `http://${req.headers.host ?? "localhost"}`;
  return new URL(req.url ?? "/", base);
}

function sendJSON(res: ServerResponse, status: number, body: object) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

function sendSVG(res: ServerResponse, status: number, svg: string) {
  res.writeHead(status, {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=1800, stale-while-revalidate=300",
    "Content-Length": Buffer.byteLength(svg),
  });
  res.end(svg);
}

// ── Main handler (Vercel serverless entry point) ───────────────────────────────

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const url = parseUrl(req);
  const pathname = url.pathname;

  // ── Route: GET /api/user/:username ── JSON stats for the dashboard
  const userMatch = pathname.match(/^\/api\/user\/([^/]+)$/);
  if (userMatch) {
    const raw = decodeURIComponent(userMatch[1]);
    const validationError = validateUsername(raw);
    if (validationError) {
      return sendJSON(res, 400, { error: validationError });
    }

    try {
      const stats = await fetchStats(raw);
      return sendJSON(res, 200, stats);
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch GitHub stats";
      const status = getUserErrorStatus(msg);
      const friendly = status === 404
        ? "GitHub user not found"
        : status === 429
          ? msg
          : "Failed to fetch GitHub stats";
      return sendJSON(res, status, { error: friendly });
    }
  }

  // ── Route: GET /api ── SVG embed
  if (pathname === "/api" || pathname === "/api/") {
    const username = url.searchParams.get("username") ?? "";
    const type = url.searchParams.get("type") ?? "stats";
    const theme = url.searchParams.get("theme") ?? undefined;

    const validationError = validateUsername(username);
    if (validationError) {
      return sendSVG(res, 400, errorSVG(validationError));
    }

    try {
      const stats = await fetchStats(username);
      const svg = generateSvgForType(stats, type, { theme });
      return sendSVG(res, 200, svg);
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch stats";
      const status = getUserErrorStatus(msg);
      return sendSVG(res, status, errorSVG(msg));
    }
  }

  // ── Fallback 404 ─────────────────────────────────────────────────────────────
  sendJSON(res, 404, { error: "Not found" });
}
