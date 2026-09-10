// Quick tag-balance check for built pages. Usage: node scripts/check-html.js
const fs = require("fs"), path = require("path");
const docs = path.join(__dirname, "..", "docs");
const files = ["index.html", "work/index.html", "try/index.html", "journal/index.html", "contact/index.html"];
for (const d of fs.readdirSync(path.join(docs, "p"))) files.push(`p/${d}/index.html`);
const tags = "section|div|ul|li|header|nav|footer|main|h1|h2|h3|p|a|form|fieldset|label|span|table|tr|td|th|b|strong|button|legend|small";
let bad = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(docs, f), "utf8");
  const open = (h.match(new RegExp("<(" + tags + ")(\\s[^>]*)?>", "g")) || []).length;
  const close = (h.match(new RegExp("</(" + tags + ")>", "g")) || []).length;
  const ok = open === close; if (!ok) bad++;
  console.log(f.padEnd(24), "open", String(open).padStart(4), "close", String(close).padStart(4), ok ? "ok" : "MISMATCH");
}
process.exit(bad ? 1 : 0);
