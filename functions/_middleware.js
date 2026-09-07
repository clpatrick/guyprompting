// Logs one row per HTML page view to D1. Runs on every request; never blocks the page.
// Stores network organization, country/region/city, path, referrer host. Never the IP.
const KNOWN_NETWORKS = { 2637: "Georgia Institute of Technology" };

function uaClass(ua) {
  ua = (ua || "").toLowerCase();
  if (!ua || /bot|crawl|spider|slurp|preview|facebookexternalhit|linkedinbot|headless/.test(ua)) return "bot";
  if (/mobile|iphone|android|ipad/.test(ua)) return "mobile";
  return "desktop";
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const response = await next();
  try {
    const url = new URL(request.url);
    const isPage = request.method === "GET" && !url.pathname.startsWith("/admin") &&
      !url.pathname.startsWith("/api") && !/\.(css|js|png|jpg|jpeg|svg|ico|webp|woff2?|txt|xml|map)$/i.test(url.pathname) &&
      (response.headers.get("content-type") || "").includes("text/html");
    if (isPage && env.HITS) {
      const cf = request.cf || {};
      const seg = url.pathname.split("/").filter(Boolean)[0] || "root";
      let refHost = null;
      try { const r = request.headers.get("referer"); if (r) refHost = new URL(r).hostname; } catch (_) {}
      const asn = cf.asn ? Number(cf.asn) : null;
      const asOrg = KNOWN_NETWORKS[asn] || cf.asOrganization || null;
      context.waitUntil(env.HITS.prepare(
        "INSERT INTO hits (ts, path, campaign, country, region, city, asn, as_org, referer_host, ua_class) VALUES (?,?,?,?,?,?,?,?,?,?)"
      ).bind(new Date().toISOString(), url.pathname, seg, cf.country || null, cf.region || null, cf.city || null,
             asn, asOrg, refHost, uaClass(request.headers.get("user-agent"))).run());
    }
  } catch (_) { /* logging must never break the page */ }
  return response;
}
