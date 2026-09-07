// Private stats page. Protect /admin/* with Cloudflare Access (one email allowed). Also checks the Access header as belt-and-braces.
export async function onRequestGet({ request, env }) {
  if (!request.headers.get("cf-access-authenticated-user-email")) {
    return new Response("Sign in through Cloudflare Access to view stats.", { status: 401 });
  }
  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("days") || 30), 365);
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const q = (sql, ...b) => env.HITS.prepare(sql).bind(...b).all().then(r => r.results);
  const [byCampaign, byNetwork, recent] = await Promise.all([
    q("SELECT campaign, COUNT(*) views, SUM(ua_class!='bot') humans, MIN(ts) first_seen, MAX(ts) last_seen FROM hits WHERE ts>=? GROUP BY campaign ORDER BY views DESC", since),
    q("SELECT campaign, as_org, country, region, COUNT(*) views, MAX(ts) last_seen FROM hits WHERE ts>=? AND ua_class!='bot' GROUP BY campaign, as_org, country, region ORDER BY last_seen DESC LIMIT 100", since),
    q("SELECT ts, path, as_org, country, region, city, referer_host, ua_class FROM hits WHERE ts>=? ORDER BY ts DESC LIMIT 200", since)
  ]);
  if (url.searchParams.get("format") === "json") {
    return Response.json({ days, byCampaign, byNetwork, recent });
  }
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rows = (arr, cols) => arr.map(r => "<tr>" + cols.map(c => `<td>${esc(r[c])}</td>`).join("") + "</tr>").join("");
  const table = (title, arr, cols) => `<h2>${title}</h2><div class="w"><table><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>${rows(arr, cols)}</table></div>`;
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>guyprompting.com visits</title>
<style>body{font:14px/1.5 -apple-system,"IBM Plex Sans",Segoe UI,sans-serif;margin:24px;color:#172233;background:#F7F5F0}h1{font-size:20px}h2{font-size:15px;margin:22px 0 8px;text-transform:uppercase;letter-spacing:.06em;color:#6E7886}
.w{overflow-x:auto}table{border-collapse:collapse;width:100%;background:#fff;font-size:13px}th,td{text-align:left;padding:6px 10px;border-bottom:1px solid #E6E1D7;white-space:nowrap}th{background:#EFEBE3;font-weight:600}
.hi td:nth-child(2){font-weight:600;color:#15314E}</style>
<h1>Visits, last ${days} days</h1><p>Rows are page views. "Humans" excludes known crawlers. Network is the visitor's ISP or institution; no IP addresses are stored.</p>
${table("By application page", byCampaign, ["campaign", "views", "humans", "first_seen", "last_seen"])}
${table("By network and place (humans only)", byNetwork, ["campaign", "as_org", "country", "region", "views", "last_seen"])}
${table("Recent", recent, ["ts", "path", "as_org", "country", "region", "city", "referer_host", "ua_class"])}`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
