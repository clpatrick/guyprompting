// Renders a project journal (Markdown, J-nnn entries) into a themed page under docs/research/<slug>/.
// Usage: node scripts/build-journal.js <slug> "<title>" "<one-line purpose>" <path-to-JOURNAL.md> [path-to-DECISIONS.md]
// Run only after Patrick has reviewed the journal content; the site publishes what this writes.
const fs = require("fs"), path = require("path");
const { marked } = require("C:/Repos/_Applications/resume/node_modules/marked");
const [slug, title, purpose, journalPath, decisionsPath] = process.argv.slice(2);
if (!slug || !title || !journalPath) { console.error("usage: node scripts/build-journal.js <slug> <title> <purpose> <JOURNAL.md> [DECISIONS.md]"); process.exit(1); }
const journal = marked.parse(fs.readFileSync(journalPath, "utf8"), { gfm: true });
const decisions = decisionsPath && fs.existsSync(decisionsPath) ? marked.parse(fs.readFileSync(decisionsPath, "utf8"), { gfm: true }) : "";
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Patrick Reynolds</title>
<meta name="description" content="${esc(purpose)}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--paper:#F7F5F0;--paper-2:#EFEBE3;--line:#D9D3C7;--ink:#172233;--ink-2:#3F4B5C;--ink-3:#6E7886;--navy:#15314E;--brass:#8A6A22}
@media (prefers-color-scheme:dark){:root{--paper:#121821;--paper-2:#182130;--line:#2A3546;--ink:#E9E6DF;--ink-2:#BFC5CE;--ink-3:#8791A0;--navy:#DCE6F2;--brass:#D8B45C}}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"IBM Plex Sans",sans-serif;font-size:16px;line-height:1.55}
.wrap{max-width:880px;margin:0 auto;padding:0 24px 80px}
nav{padding:22px 0;border-bottom:1px solid var(--line);font-family:"IBM Plex Mono",monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
nav a{color:var(--ink-2);text-decoration:none}
header{padding:48px 0 28px;border-bottom:1px solid var(--line)}
header .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin-bottom:12px}
h1{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:clamp(30px,4.5vw,44px);line-height:1.1;margin:0;text-wrap:balance}
header p{color:var(--ink-2);max-width:66ch;margin:14px 0 0}
section{padding:36px 0;border-bottom:1px solid var(--line)}
section h2.sec{font-family:"IBM Plex Mono",monospace;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);margin:0 0 18px;font-weight:500}
.md h1{display:none}.md h2{font-family:"Fraunces",Georgia,serif;font-size:22px;margin:28px 0 8px;line-height:1.25}.md h3{font-size:16px;margin:18px 0 6px}
.md p,.md li{color:var(--ink-2);max-width:72ch}.md code{font-family:"IBM Plex Mono",monospace;font-size:.9em;background:var(--paper-2);padding:1px 4px}
.md pre{overflow-x:auto;background:var(--paper-2);padding:12px;border:1px solid var(--line)}.md table{border-collapse:collapse;width:100%;font-size:14px}.md th,.md td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.md blockquote{border-left:3px solid var(--brass);margin:0;padding-left:14px;color:var(--ink-2)}
.note{font-family:"IBM Plex Mono",monospace;font-size:12.5px;color:var(--ink-3);border:1px solid var(--line);padding:10px 12px;margin-top:20px}
</style></head><body><div class="wrap">
<nav><a href="/">Guy Prompting · Patrick Reynolds</a></nav>
<header><div class="eyebrow">Research journal · in progress</div><h1>${esc(title)}</h1><p>${esc(purpose)}</p>
<div class="note">This page is the project's journal, rendered as-is. Entries are append-only; corrections are new entries that cite the one they correct. Numbers are tagged [M] measured, [D] derived, [U] unverified.</div></header>
${decisions ? `<section><h2 class="sec">Pre-registered decisions</h2><div class="md">${decisions}</div></section>` : ""}
<section><h2 class="sec">Journal</h2><div class="md">${journal}</div></section>
</div></body></html>`;
const out = path.join("docs", "research", slug);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), html);
console.log("wrote", path.join(out, "index.html"), html.length, "bytes");
