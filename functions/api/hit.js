// Beacon endpoint used only when the page is served from somewhere other than Cloudflare
// (e.g. the GitHub Pages fallback). The visitor's browser calls it, so request.cf describes the visitor.
const ALLOWED = ["https://guyprompting.com", "https://www.guyprompting.com", "https://clpatrick.github.io"];
const KNOWN_NETWORKS = { 2637: "Georgia Institute of Technology" };
function cors(origin) {
  const ok = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return { "access-control-allow-origin": ok, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "cache-control": "no-store" };
}
export async function onRequestOptions({ request }) { return new Response(null, { status: 204, headers: cors(request.headers.get("origin")) }); }
export async function onRequestPost({ request, env }) {
  const headers = cors(request.headers.get("origin"));
  try {
    const body = await request.json().catch(() => ({}));
    const path = String(body.path || "/").slice(0, 200);
    if (!path.startsWith("/")) return new Response(null, { status: 400, headers });
    const cf = request.cf || {};
    const asn = cf.asn ? Number(cf.asn) : null;
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const uaClass = /bot|crawl|spider|headless/.test(ua) ? "bot" : (/mobile|iphone|android|ipad/.test(ua) ? "mobile" : "desktop");
    let refHost = null; try { if (body.referrer) refHost = new URL(body.referrer).hostname; } catch (_) {}
    if (env.HITS) await env.HITS.prepare(
      "INSERT INTO hits (ts, path, campaign, country, region, city, asn, as_org, referer_host, ua_class) VALUES (?,?,?,?,?,?,?,?,?,?)"
    ).bind(new Date().toISOString(), path, path.split("/").filter(Boolean)[0] || "root", cf.country || null, cf.region || null, cf.city || null,
           asn, KNOWN_NETWORKS[asn] || cf.asOrganization || null, refHost, uaClass).run();
  } catch (_) {}
  return new Response(null, { status: 204, headers });
}
