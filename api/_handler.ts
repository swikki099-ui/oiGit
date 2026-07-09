import type { IncomingMessage, ServerResponse } from "http";

// ── Lazy imports (wrapped so module resolution errors surface inside try-catch) ─

let handlers: Awaited<typeof import("../server/handlers")>;

async function getHandlers() {
  if (!handlers) {
    handlers = await import("../server/handlers");
  }
  return handlers;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseUrl(req: IncomingMessage) {
  const host = typeof req.headers?.host === "string" ? req.headers.host : "localhost";
  const url = typeof req.url === "string" ? req.url : "/";
  return new URL(url, `http://${host}`);
}

function sendJSON(res: ServerResponse, status: number, body: object) {
  try {
    const json = JSON.stringify(body);
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json),
    });
    res.end(json);
  } catch {
    // Response may already be sent — ignore
  }
}

function sendSVG(res: ServerResponse, status: number, svg: string) {
  try {
    res.writeHead(status, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=300",
      "Content-Length": Buffer.byteLength(svg),
    });
    res.end(svg);
  } catch {
    // Response may already be sent — ignore
  }
}

// ── Main handler (Vercel serverless entry point) ───────────────────────────────

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const url = parseUrl(req);
    const pathname = url.pathname;

    // ── Route: GET /api/user/:username ── JSON stats
    const userMatch = pathname.match(/^\/api\/user\/([^/]+)$/);
    if (userMatch) {
      const raw = decodeURIComponent(userMatch[1]);
      const h = await getHandlers();
      const validationError = h.validateUsername(raw);
      if (validationError) {
        return sendJSON(res, 400, { error: validationError });
      }

      try {
        const stats = await h.fetchStats(raw);
        return sendJSON(res, 200, stats);
      } catch (err: any) {
        const msg = typeof err?.message === "string" ? err.message : "Failed to fetch GitHub stats";
        const status = h.getUserErrorStatus(msg);
        return sendJSON(res, status, {
          error: status === 404 ? "GitHub user not found" : status === 429 ? msg : "Failed to fetch GitHub stats",
        });
      }
    }

    // ── Route: GET /api ── SVG embed
    if (pathname === "/api" || pathname === "/api/") {
      const username = url.searchParams.get("username") ?? "";
      const type = url.searchParams.get("type") ?? "stats";
      const theme = url.searchParams.get("theme") ?? undefined;

      const h = await getHandlers();
      const validationError = h.validateUsername(username);
      if (validationError) {
        return sendSVG(res, 400, h.errorSVG(validationError));
      }

      try {
        const stats = await h.fetchStats(username);
        const svg = h.generateSvgForType(stats, type, { theme });
        return sendSVG(res, 200, svg);
      } catch (err: any) {
        const msg = typeof err?.message === "string" ? err.message : "Failed to fetch stats";
        const status = h.getUserErrorStatus(msg);
        return sendSVG(res, status, h.errorSVG(msg));
      }
    }

    // ── Fallback 404
    sendJSON(res, 404, { error: "Not found" });
  } catch (err: any) {
    // Last-resort: ensure we always return SOMETHING instead of crashing silently
    const msg = typeof err?.message === "string" ? err.message : "Unknown error";
    try {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: msg }));
    } catch {
      // Nothing more we can do
    }
  }
}
