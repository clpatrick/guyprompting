// Builds the guyprompting.com pages in the Field system (SimpleBits-inspired; Google stand-in type).
// Usage: node scripts/build-site.js
// Pages: / (About), /work/, /try/, /journal/, /contact/, and the per-application page under /p/<token>/.
// Prose source of truth: content/home.md and content/pages.md (edited by Patrick); this file mirrors them.
// Headshot: docs/assets/headshot.jpg; resume download: docs/assets/Patrick-Reynolds-Resume.pdf (both optional until present).
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const docs = path.join(root, "docs");
const has = (rel) => fs.existsSync(path.join(docs, rel));
const hasHeadshot = has("assets/headshot.jpg");
const hasResume = has("assets/Patrick-Reynolds-Resume.pdf");

const C = { page: "#F3ECD9", ink: "#3A2A22", ink2: "#5A4A40", ochre: "#8E6420", nav: "#3E2A22", navInk: "#F3ECD9", forest: "#3C5646", forestInk: "#F3ECD9", forestBody: "#D9DFD3", orange: "#E4732C", photo: "#E4DAC2", rule: "#3A2A22", hair: "#CFC3A8", ok: "#3C5646" };

const css = `
:root{--page:${C.page};--ink:${C.ink};--ink2:${C.ink2};--ochre:${C.ochre};--nav:${C.nav};--navink:${C.navInk};--forest:${C.forest};--forestink:${C.forestInk};--forestbody:${C.forestBody};--orange:${C.orange};--photo:${C.photo};--rule:${C.rule};--hair:${C.hair};--ok:${C.ok};
--slab:"Arvo","Rockwell",Georgia,serif;--caps:"Belleza","Trebuchet MS",sans-serif;--sign:"Lilita One","Arial Black",sans-serif;--sans:"Public Sans","Helvetica Neue",Arial,sans-serif;--script:"Kaushan Script","Brush Script MT",cursive;--mono:"IBM Plex Mono",Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--page:#3E2A22;--ink:#F3ECD9;--ink2:#DCCFB8;--ochre:#D8A64B;--nav:#2E1F19;--navink:#F3ECD9;--forest:#3C5646;--forestink:#F3ECD9;--forestbody:#D9DFD3;--orange:#E4732C;--photo:#4E3A31;--rule:#F3ECD9;--hair:#6A5548;--ok:#9FC3AE}}
:root[data-theme="dark"]{--page:#3E2A22;--ink:#F3ECD9;--ink2:#DCCFB8;--ochre:#D8A64B;--nav:#2E1F19;--navink:#F3ECD9;--forest:#3C5646;--forestink:#F3ECD9;--forestbody:#D9DFD3;--orange:#E4732C;--photo:#4E3A31;--rule:#F3ECD9;--hair:#6A5548;--ok:#9FC3AE}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--page);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;position:relative}
body::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.06;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>");z-index:0}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
a{color:var(--ink);text-decoration-thickness:1px;text-underline-offset:3px}a:hover{color:var(--orange)}a:focus-visible,button:focus-visible{outline:2px solid var(--orange);outline-offset:3px}
.caps{font-family:var(--caps);text-transform:uppercase;letter-spacing:.22em}
.slab{font-family:var(--slab);font-weight:700}
.sign{font-family:var(--sign);text-transform:uppercase;letter-spacing:.04em}
.script{font-family:var(--script)}
/* nav */
.bar{background:var(--nav);color:var(--navink);position:relative;z-index:1}
.bar .wrap{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 24px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--navink)}
.brand svg{width:40px;height:40px}.brand span{font-family:var(--slab);font-weight:700;font-size:22px}
.bar ul{list-style:none;display:flex;gap:26px;margin:0;padding:0;flex-wrap:wrap}
.bar li a{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;font-size:12.5px;color:var(--navink);text-decoration:none}
.bar li a:hover,.bar li a[aria-current="page"]{color:var(--orange)}
/* hero */
.hero{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;padding:56px 0 48px;align-items:stretch}
.photo{display:flex;flex-direction:column;gap:10px}
.photo .frame{aspect-ratio:4/5;background:var(--photo);border:2px solid var(--rule);overflow:hidden;display:flex;align-items:center;justify-content:center}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.photo .cap{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:var(--ochre)}
.intro{display:flex;flex-direction:column;justify-content:center;gap:22px}
.eyebrow{font-family:var(--caps);text-transform:uppercase;letter-spacing:.22em;font-size:13px;color:var(--ochre)}
h1{font-family:var(--slab);font-weight:700;font-size:clamp(32px,4.2vw,54px);line-height:1.06;margin:0;text-wrap:balance}
.lede{margin:0;max-width:58ch;font-size:17px;color:var(--ink2)}
.cta{display:flex;gap:14px;flex-wrap:wrap}
.btn{display:inline-block;padding:14px 24px;text-decoration:none}
.btn.primary{font-family:var(--sign);text-transform:uppercase;letter-spacing:.04em;font-size:15px;background:var(--orange);color:#3E2A22}.btn.primary:hover{background:var(--forest);color:var(--forestink)}
.btn.ghost{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;font-size:12px;border:2px solid var(--rule);color:var(--ink)}.btn.ghost:hover{color:var(--orange);border-color:var(--orange)}
/* sections */
section{padding:0 0 48px}
.sechead{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:48px;margin-bottom:18px}
.sechead .big{margin:0;font-family:var(--slab);font-weight:700;font-size:26px;line-height:1.25}
.prose{max-width:66ch;color:var(--ink2);font-size:17px}.prose p{margin:0 0 16px}.prose p:last-child{margin:0}.prose strong{color:var(--ink);font-weight:600}
h2.title{font-family:var(--slab);font-weight:700;font-size:32px;line-height:1.1;margin:0 0 6px}
.sub{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:var(--ochre);margin:0 0 18px}
.block{background:var(--forest);color:var(--forestink);padding:40px 48px;margin:0 0 48px}
.block .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px}
.block .lbl{font-family:var(--caps);text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:var(--orange);margin:0 0 6px}
.block h3{font-family:var(--slab);font-weight:700;font-size:28px;line-height:1.12;margin:0 0 8px;color:var(--forestink)}
.block p{margin:0;color:var(--forestbody)}
.vals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 40px;margin:0;padding:0;list-style:none}
.vals li{border-top:2px solid var(--rule);padding-top:12px}
.vals b{display:block;font-family:var(--slab);font-size:22px;margin-bottom:6px}
.vals p{margin:0;color:var(--ink2)}
.strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--hair);border:1px solid var(--rule)}
.strip a{display:flex;flex-direction:column;gap:8px;padding:20px 22px;background:var(--page);text-decoration:none;color:var(--ink)}
.strip a:hover .n{color:var(--forest)}
.strip .n{font-family:var(--slab);font-size:30px;color:var(--orange);line-height:1}
.strip p{margin:0;color:var(--ink2);font-size:15px}
/* work index */
.index{display:flex;flex-direction:column}
.row{display:grid;grid-template-columns:64px minmax(0,1fr) 150px;gap:20px;padding:22px 0;border-top:1px solid var(--rule);align-items:baseline}
.row:last-child{border-bottom:1px solid var(--rule)}
.row .num{font-family:var(--slab);font-size:26px;color:var(--orange)}
.row h3{font-family:var(--slab);font-size:24px;line-height:1.2;margin:0 0 4px}
.row .m{font-family:var(--caps);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--ochre);margin:0 0 8px}
.row .d{margin:0 0 8px;color:var(--ink);font-style:italic}
.row p{margin:0 0 8px;color:var(--ink2);max-width:72ch}
.row .more{font-size:14px;font-weight:500;color:var(--forest)}
.row .st{font-family:var(--caps);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--ochre);text-align:right}
.tblwrap{overflow-x:auto;border:1px solid var(--rule);background:var(--page)}
table.map{border-collapse:collapse;width:100%;font-size:15px}
table.map th{text-align:left;font-family:var(--caps);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--ochre);font-weight:400;padding:12px 14px;border-bottom:1px solid var(--rule)}
table.map td{padding:12px 14px;border-bottom:1px solid var(--hair);vertical-align:top;color:var(--ink2)}
table.map td:first-child{color:var(--ink);font-family:var(--slab);font-size:16px;width:34%}
table.map tr:last-child td{border-bottom:0}
/* simulator */
.sim{border:2px solid var(--rule);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)}
.sim .ctl{padding:24px;border-right:2px solid var(--rule);display:flex;flex-direction:column;gap:14px}
.sim h3{font-family:var(--slab);font-size:22px;margin:0;line-height:1.2}
.sim fieldset{border:0;padding:0;margin:0}
.sim legend{font-family:var(--caps);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--ochre);margin-bottom:8px}
.sim .opts{display:flex;flex-direction:column;gap:6px}
.sim label.opt{display:flex;gap:10px;align-items:flex-start;font-size:14px;cursor:pointer;padding:8px 10px;border:1px solid var(--hair)}
.sim label.opt:has(input:checked){border-color:var(--forest);box-shadow:inset 3px 0 0 var(--forest)}
.sim label.opt input{margin-top:3px;accent-color:var(--forest)}
.sim label.opt small{display:block;color:var(--ink2);font-size:12.5px}
.sim button{font-family:var(--sign);text-transform:uppercase;letter-spacing:.04em;font-size:15px;padding:12px 18px;background:var(--orange);color:#3E2A22;border:0;cursor:pointer;align-self:flex-start}
.sim button:hover{background:var(--forest);color:var(--forestink)}
.sim .log{padding:20px 24px;min-height:320px;max-height:460px;overflow:auto;font-family:var(--mono);font-size:12.5px;line-height:1.6;color:var(--forestbody);background:var(--forest)}
.sim .log .step{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed rgba(243,236,217,.25);opacity:0;transform:translateY(3px);animation:stepin .35s ease-out forwards}
.sim .log .step:last-child{border-bottom:0}@keyframes stepin{to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.sim .log .step{animation:none;opacity:1;transform:none}}
.sim .log .who{flex:0 0 78px;color:#B9C7BE}
.sim .log .ok{color:#F3ECD9}.sim .log .halt{color:var(--orange);font-weight:600}.sim .log .ask{color:#E9C77A;font-style:italic}
.sim .log .empty{color:#B9C7BE}
.govnote{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--hair);border:2px solid var(--rule);border-top:0}
.govnote div{background:var(--page);padding:14px 16px;font-size:14px;color:var(--ink2)}
.govnote b{display:block;color:var(--ink);font-family:var(--slab);margin-bottom:4px}
.also{columns:2;column-gap:40px;margin:0;padding-left:18px;color:var(--ink2);font-size:15px}
.also li{break-inside:avoid;margin-bottom:10px}
.contact{display:flex;flex-direction:column;gap:12px;font-size:17px}
.contact a{font-weight:500}
/* footer */
footer.bar .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:22px 24px 56px;flex-wrap:wrap}
footer .fine{font-family:var(--caps);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--navink)}
footer .close{font-family:var(--script);font-size:24px;color:var(--orange)}
@media (max-width:820px){.hero{grid-template-columns:1fr;gap:28px}.block .grid,.vals,.strip{grid-template-columns:1fr}.block{padding:32px 24px}.sechead{grid-template-columns:1fr;gap:12px}.row{grid-template-columns:44px minmax(0,1fr)}.row .st{grid-column:2;text-align:left}.sim{grid-template-columns:1fr}.sim .ctl{border-right:0;border-bottom:2px solid var(--rule)}.also{columns:1}.bar ul{gap:16px}}
`;

const mark = `<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M8 30 A14 14 0 0 1 36 30 Z" fill="${C.orange}"/><g stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="8" x2="22" y2="13"/><line x1="12" y1="12" x2="15" y2="16"/><line x1="32" y1="12" x2="29" y2="16"/></g><line x1="4" y1="34" x2="40" y2="34" stroke="currentColor" stroke-width="2.5"/></svg>`;

const work = [
  { n: "01", title: "Story Maker: a governed AI-agent platform", status: "Production", meta: "2026 · 33 client organizations",
    decision: "The decision that mattered: no agent runs unattended until a person has approved the exact list of operations it may perform.",
    body: "Technicians build and run AI agents against real business systems under tiered least-privilege skills. A human in the loop approves every operation before the agent runs alone; a supervising agent halts anything outside the approved plan. Five inference tiers under U.S.-residency rules; every call attributed for cost. 3,277 automated tests.",
    href: "https://github.com/clpatrick/governed-agent-platform", link: "Architecture and security posture" },
  { n: "02", title: "County AI and AI-governance roadmap", status: "In progress", meta: "2026 · Georgia county government",
    decision: "The decision that mattered: write the roadmap with the county's own IT team, not for them.",
    body: "Working alongside a county IT and network team on systems, network, and security operations while helping them write an AI roadmap they can follow: where sensitive data is exposed today, tiered guardrails, in-house inference with controls and visibility, and the staff-augmentation uses worth doing first.",
    href: "/contact/", link: "Ask about this engagement" },
  { n: "03", title: "Melon Code: a Claude-Code-class agent on a local model", status: "Daily use", meta: "2026 · TypeScript · llama.cpp · NVIDIA NIM",
    decision: "The decision that mattered: run the whole coding-agent loop on a model we own, and point Claude Code at it to learn how the loop really works.",
    body: "The full coding-agent loop, with tools, a four-mode permission engine, subagents, compaction, and rewind, driving a 284-billion-parameter model on one workstation. An Anthropic-compatible endpoint lets Claude Code itself run on local or hosted open models. KV-cache prefix work cut a warm turn from 36 seconds to 1.3.",
    href: "https://github.com/clpatrick/melon-code", link: "What was built and measured" },
  { n: "04", title: "Local inference at the edge of one GPU", status: "Research", meta: "2026 · 284B mixture-of-experts · RTX 4090",
    decision: "The decision that mattered: measure before optimizing. Three speculative-decoding routes closed with break-even math; one small change kept.",
    body: "Decode raised from 7.3 to about 20 tokens per second at a stated fidelity floor. A DSpark confidence-scheduled drafter, a multi-token-prediction head, and DFlash each closed with numbers; the DSpark paper's prefix-survival gate implemented in llama.cpp for a measured 7.1% gain. 190+ journal entries, pre-registered decisions.",
    href: "/journal/", link: "The research list" },
  { n: "05", title: "A phone-sized model, built from nothing on one desk", status: "In progress", meta: "Sept 2026 · Qwen 4-class MoE · iPhone Air",
    decision: "The decision that mattered: start from random weights and a 27B teacher, pre-register everything, publish the journal.",
    body: "A mixture-of-experts language model in the Qwen3.8-Flash-Next architecture family, sized to the iPhone Air's 2.5 GB safe memory tier, taught by distillation from Qwen3.8 27B, with DSpark and MTP speculation measured on the phone with reasoning on.",
    href: "/journal/", link: "Follow the journal" },
  { n: "06", title: "MelonStudio: splitting a model across GPU and CPU by hand", status: "Complete · negative result", meta: "2025–26 · C# · ONNX Runtime GenAI",
    decision: "The decision that mattered: stop. A negative result measured honestly, and the reason later work moved to llama.cpp.",
    body: "ONNX Runtime won't offload layers the way llama.cpp does, so this built it: graph partitioning at layer boundaries, two orchestrated sessions, pinned memory, a stateful KV cache. Measured at 4.4 tokens per second hybrid against 93 GPU-only, the result was to stop.",
    href: "https://github.com/clpatrick/onnx-hybrid-inference-study", link: "Design, benchmarks, and the negative result" },
  { n: "07", title: "Engineering with people and agents", status: "In daily use", meta: "2026 · process + ledger",
    decision: "The decision that mattered: write the operating model down so people and agents work the same way.",
    body: "Audit-first work packets, isolated worktrees, worker, verifier, and adversarial-reviewer roles, a test gate on every pull request, and a reservation ledger so concurrent agent sessions share one machine without collisions.",
    href: "https://github.com/clpatrick/agentic-engineering-process", link: "The process, and the ledger's source" }
];

const research = [
  "Local inference of a 284-billion-parameter mixture-of-experts model on one workstation: decode raised from 7.3 to about 20 tokens per second; 190+ numbered journal entries and pre-registered decisions.",
  "Lossless LLM-driven text compression: 0.882 bits per byte on enwik8 against 7-Zip's 1.989, with a measured ratio-versus-speed frontier. Preprint in preparation.",
  "A deterministic context manager for long agent sessions: byte-exact log, lean resident window, 93–100% recall of exact facts at 90–99% token reduction, claim narrowed after an adversarial audit.",
  "On-device model selection for phones: an MMLU-Pro harness projected to memory bandwidth across 298 candidate models.",
  "Shepherd: a self-hosted endpoint control plane and Windows agent with tenant isolation, signed tasking, and a hash-chained audit log, built so an AI agent can operate a fleet safely. Working prototype, ten decision records.",
  "A de-identified calibration corpus built from real platform traffic, with two adversarial privacy audits; the first said \"do not ship.\""
];

const simJS = `(function(){var form=document.getElementById("simForm"),log=document.getElementById("simLog");if(!form)return;
var SC={triage:{name:"Review flagged email across client tenants",ops:[{t:1,text:"list flagged messages across 33 tenants (read)"},{t:1,text:"read message headers and detection reasons (read)"},{t:2,text:"dismiss 4 single-group false positives (reversible write)"},{t:2,text:"open a ticket with the catch story (reversible write)"},{t:3,text:"quarantine 1 message tenant-wide (irreversible)"}]},
reboot:{name:"Fix a slow workstation",ops:[{t:1,text:"read CPU, memory, top processes on WS-114 (read)"},{t:1,text:"read service state for the print spooler (read)"},{t:2,text:"restart the print spooler service (reversible write)"},{t:3,text:"reboot WS-114 while a user is signed in (irreversible)"}]},
offboard:{name:"Off-board a departed employee",ops:[{t:1,text:"read group memberships and mailbox size (read)"},{t:2,text:"disable sign-in and revoke sessions (reversible write)"},{t:2,text:"forward mail to the manager for 30 days (reversible write)"},{t:3,text:"remove from all groups and wipe the mobile device (irreversible)"}]}};
function line(who,cls,text){var d=document.createElement("div");d.className="step";var a=document.createElement("span");a.className="who";a.textContent=who;var b=document.createElement("span");b.className=cls||"";b.textContent=text;d.appendChild(a);d.appendChild(b);log.appendChild(d);log.scrollTop=log.scrollHeight;}
function run(task,tier){log.textContent="";var sc=SC[task];var steps=[];steps.push(["rehearsal","","scene: "+sc.name+" · tier L"+tier]);steps.push(["rehearsal","","walking the plan with zero live calls…"]);
var manifest=sc.ops.filter(function(o){return o.t<=tier});var beyond=sc.ops.filter(function(o){return o.t>tier});manifest.forEach(function(o){steps.push(["manifest","",o.text])});
steps.push(["operator","ask","approve "+manifest.length+" operation"+(manifest.length===1?"":"s")+" for unattended runs? → approved"]);steps.push(["run","","locked to the approved manifest"]);
manifest.forEach(function(o){steps.push(["agent","ok","✓ "+o.text])});beyond.forEach(function(o){steps.push(["agent","","→ attempts: "+o.text]);steps.push(["director","halt",o.t===3?"✕ halted: irreversible action outside the approved manifest. Parked for a person.":"✕ blocked: not in the approved manifest."]);});
if(tier===3){steps.push(["director","ask","L3 run: every call screened on its arguments; anything off-plan halts the scene."]);}
steps.push(["audit","","run recorded: "+manifest.length+" allowed, "+beyond.length+" refused, cost attributed to the agent."]);
var i=0,delay=window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:420;(function next(){if(i>=steps.length)return;var s=steps[i++];line(s[0],s[1],s[2]);setTimeout(next,delay);})();}
form.addEventListener("submit",function(e){e.preventDefault();var fd=new FormData(form);run(fd.get("task"),parseInt(fd.get("tier"),10));});})();`;

function shell({ title, desc, current, body, noindex, foot }) {
  const links = [["/", "About"], ["/work/", "Work"], ["/try/", "Try it"], ["/journal/", "Journal"], ["/contact/", "Contact"]];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g, "&quot;")}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<link rel="icon" href="/assets/seal.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Arvo:wght@700&family=Belleza&family=Lilita+One&family=Public+Sans:wght@400;500;600&family=Kaushan+Script&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style>
</head>
<body>
<nav class="bar" aria-label="Site"><div class="wrap">
  <a class="brand" href="/">${mark}<span>Guy Prompting</span></a>
  <ul>${links.map(([h, l]) => `<li><a href="${h}"${h === current ? ' aria-current="page"' : ""}>${l}</a></li>`).join("")}</ul>
</div></nav>
<main class="wrap">
${body}
</main>
<footer class="bar"><div class="wrap">
  <div class="fine">Patrick Reynolds · North Augusta, South Carolina${foot ? " · " + foot : ""}</div>
  <div class="close">Serving humbly. Leading fruitfully.</div>
  <div class="fine">Case studies are descriptions, not source. Client names appear only with permission.</div>
</div></footer>
${current === "/try/" || current === "gt" ? `<script>${simJS}</script>` : ""}
</body>
</html>
`;
}

const heroHtml = (gt) => `
<header class="hero">
  <div class="photo"><div class="frame">${hasHeadshot ? '<img src="/assets/headshot.jpg" alt="Patrick Reynolds" width="800" height="1000">' : '<span class="caps" style="font-size:12px;color:var(--ink2)">Photo coming</span>'}</div><div class="cap">Patrick Reynolds · North Augusta, S.C.</div></div>
  <div class="intro">
    <div class="eyebrow">${gt ? "Prepared for the Georgia Tech OIT search committee · Executive Director, AI Enablement &amp; Acceleration · Job 302406" : "AI strategy · governance · people-first implementation"}</div>
    <h1>I invest in people, helping them put their technical gifts to work, so together we can humbly serve our neighbors who need us.</h1>
    <p class="lede">Twenty-two years leading a security-first IT firm for local organizations and governments that are like-minded in service to our neighbors. The last several years building AI platforms by hand. Now leading organizations through a people-first implementation of AI.</p>
    <div class="cta"><a class="btn primary" href="${gt ? "#why" : "/work/"}">See the work</a><a class="btn ghost" href="/contact/">Connect over coffee</a></div>
  </div>
</header>`;

const beliefs = `
<section id="believe">
  <div class="sechead"><div><div class="eyebrow">What I believe</div><p class="big">About the people I work with.</p></div>
  <div class="prose">
    <p><strong>You are gifted.</strong> And the Lord did not give you gifts just to serve yourself or secure your future: you are gifted to serve your neighbors who need you.</p>
    <p>I have spent most of my working life teaching and discipling engineers, technicians, and now AI builders toward one conviction: what you are gifted at is not just for you. It is for the county clerk who cannot get into her system on a Monday morning, the nurse whose equipment has to work, the small firm that cannot afford to lose a week to a breach. And when we talk AI, our gifts in this field must be invested to help the good guys put AI to work.</p>
    <p>Serving our neighbors is the calling. For those of us who are gifted technically, helping put the technology to work is how we serve others.</p>
    <p>That is why I hire for values and character, and mentor and teach the technical expertise. Expertise can be taught. The habit of showing up for someone else's problem as if it were your own cannot be, but it can be modeled, and it can be validated. I have watched young technologists become servant-hearted leaders, and that fruitfulness is the most rewarding part. What they accomplish in serving others is fruit multiplied. We call that discipleship, and it is our highest calling.</p>
  </div></div>
</section>

<section id="crosslink">
  <div class="sechead"><div><div class="eyebrow">Cross Link Consulting · founded 2004</div><p class="big">How we put our gifts to work.</p></div>
  <div>
    <div class="prose" style="margin-bottom:22px"><p>A managed IT and cybersecurity firm of about fifteen people serving doctors, lawyers, county and municipal governments, accounting firms, and industrial clients across the Augusta area. I founded it, led it as CEO and senior engineer for twenty-two years, and stepped into an advisory role in 2026 so the firm runs on its own leadership. Four principles are how we put our gifts to work there.</p></div>
    <ul class="vals">
      <li><b>Humility</b><p>Rapid learning and mentoring, and the other values, start with humility. It is recognizing that we are not yet who we are called to be.</p></li>
      <li><b>Gratitude</b><p>The people who trust us with their systems are trusting us with their livelihoods. We are thankful to be able to stand in the gap for them.</p></li>
      <li><b>Empathy</b><p>We don't fix computer systems, we serve people. The problem before us belongs to a person. Let us fix the person's ability to serve, not just close a ticket.</p></li>
      <li><b>Stewardship</b><p>The work we do is inscrutable, and clients can't ask for, or truly appreciate, the faithful execution that only we can discern. This aim must come from within.</p></li>
    </ul>
  </div></div>
</section>

<section id="resoluteaim">
  <div class="sechead"><div><div class="eyebrow">Resolute AIM · founded 2025</div><p class="big">People-first AI in the workplace.</p></div>
  <div class="prose"><p>Most organizations are too fearful or don't think they are ready. Others are asking AI questions and doing what AI tells them. That is backwards. AI is a powerful tool, not a reliable guide. I founded Resolute AIM to lead organizations through a people-first implementation of AI in the workplace: guidance, governance, talks, and, when it is needed, the application itself, for governments, counties, health systems, law firms, and the businesses in between. Let's stop asking AI questions, let's stop worrying about what the bad guys are doing with it, and let's put AI to work.</p></div></div>
  <div class="block"><div class="grid">
    <div><div class="lbl">Principle 01</div><h3>People matter.</h3><p>Technologies must be put to work to reduce the impediments and increase the great outcomes that only great people can offer. The aim is never a smaller team. It is the great team you already have, twice as effective.</p></div>
    <div><div class="lbl">Principle 02</div><h3>Applications must be AI friendly.</h3><p>Application features and marketing do not matter if intelligent tools and AI can't help us maximize the tool. An organization adopts AI well when its systems expose real, governed interfaces that are safe and visible. Most of what goes wrong with AI is not an AI problem. It is an access problem.</p></div>
  </div></div>
</section>

<section id="produced">
  <div class="sechead"><div><div class="eyebrow">What that has produced</div><p class="big">Three outcomes, then the rest.</p></div>
  <div class="strip">
    <a href="/work/#w01"><span class="n">01</span><p><strong>Story Maker.</strong> A broadly capable, well-governed AI platform in production for 33 client organizations, where a human in the loop approves every operation before an agent runs alone.</p></a>
    <a href="/work/#w02"><span class="n">02</span><p><strong>A county's AI roadmap.</strong> AI and AI-governance, with in-house inference, safely implemented with controls and visibility, written with the county's own IT team.</p></a>
    <a href="/journal/"><span class="n">03</span><p><strong>Research in the open.</strong> Pre-registered decisions and negative results kept on the record, from local inference on one GPU to a phone-sized model built from nothing.</p></a>
  </div></div>
</section>

<section id="close">
  <div class="sechead"><div></div><div class="prose"><p>If you lead an agency, a government, a hospital, a firm, or a campus, and you need someone who has built this and led the people who build it, let's grab coffee and see how we can serve our neighbors, together.</p><p style="margin-top:14px"><a class="btn ghost" href="/contact/">Connect over coffee</a></p></div></div>
</section>`;

const workRows = work.map(w => `
    <div class="row" id="w${w.n}">
      <div class="num">${w.n}</div>
      <div><h3>${w.title}</h3><div class="m">${w.meta}</div><p class="d">${w.decision}</p><p>${w.body}</p><a class="more" href="${w.href}">${w.link} →</a></div>
      <div class="st">${w.status}</div>
    </div>`).join("");

const workBody = `
<section style="padding-top:48px"><h2 class="title">Work</h2><p class="sub">Case studies, not source</p>
  <div class="prose" style="margin-bottom:28px"><p>Most of this work is private and belongs to the organizations it serves, so each piece names the problem, what was built or decided, how it was governed, and the honest outcome, including the ones where the right answer was to stop.</p></div>
  <div class="index">${workRows}
  </div>
</section>`;

const simHtml = `
  <div class="sim">
    <div class="ctl">
      <h3>A person approves the plan. A supervising agent keeps the run on it.</h3>
      <form id="simForm">
        <fieldset><legend>Task</legend><div class="opts">
          <label class="opt"><input type="radio" name="task" value="triage" checked><span>Review flagged email across client tenants<small>Read the flags, dismiss obvious false positives, open a ticket with the evidence.</small></span></label>
          <label class="opt"><input type="radio" name="task" value="reboot"><span>Fix a slow workstation<small>Inspect the endpoint, clear a stuck service, restart it.</small></span></label>
          <label class="opt"><input type="radio" name="task" value="offboard"><span>Off-board a departed employee<small>Disable sign-in, forward mail, remove from groups, wipe the phone.</small></span></label>
        </div></fieldset>
        <fieldset><legend>Skill tier granted to the agent</legend><div class="opts">
          <label class="opt"><input type="radio" name="tier" value="1" checked><span>L1 · safe reads<small>Look, never touch.</small></span></label>
          <label class="opt"><input type="radio" name="tier" value="2"><span>L2 · reversible writes<small>Actions that can be undone.</small></span></label>
          <label class="opt"><input type="radio" name="tier" value="3"><span>L3 · full API<small>Everything the vendor allows. Rarely granted; always watched.</small></span></label>
        </div></fieldset>
        <button type="submit">Run the scene</button>
      </form>
    </div>
    <div class="log" id="simLog" aria-live="polite"><div class="empty">The run log appears here.</div></div>
  </div>
  <div class="govnote">
    <div><b>Rehearsal first</b>The agent walks the plan with zero live calls and lists every operation it intends. A person approves that list once.</div>
    <div><b>Closed world</b>Unattended runs may only perform approved operations, reads included. Anything else is blocked or parked.</div>
    <div><b>Director on set</b>A supervising agent screens intent on the actual arguments, not just the tool name, and halts deviations.</div>
    <div><b>Every call has a name</b>Inference is attributed to an agent, so cost and behavior are always traceable.</div>
  </div>`;

const tryBody = `
<section style="padding-top:48px"><h2 class="title">Try it</h2><p class="sub">How a governed run works</p>
  <div class="prose" style="margin-bottom:28px"><p>This is the pattern behind the platform: skills are tiered, a person approves the plan before the agent runs alone, and a supervising agent halts anything off-plan. Pick a task and a tier, then run it.</p></div>
  ${simHtml}
</section>`;

const journalBody = `
<section style="padding-top:48px"><h2 class="title">Journal</h2><p class="sub">Work in the open</p>
  <div class="prose" style="margin-bottom:28px"><p>The phone-sized model is being built with every decision pre-registered and every result journaled, corrections included. Entries appear here as they are reviewed. Below, the research list, and the compression preprint once it is ready.</p></div>
  <div class="eyebrow" style="margin-bottom:12px">Research, with the negative results kept</div>
  <ul class="also">${research.map(r => `<li>${r}</li>`).join("")}</ul>
</section>`;

const contactBody = `
<section style="padding-top:48px"><h2 class="title">Contact</h2><p class="sub">Coffee is the ask. Email is the door.</p>
  <div class="contact">
    <a href="mailto:patrickfromsc@gmail.com">patrickfromsc@gmail.com</a>
    <a href="https://www.linkedin.com/in/patrickreynolds">LinkedIn</a>
    <a href="https://github.com/clpatrick">GitHub</a>
    <a href="https://resoluteaim.com">Resolute AIM</a>
    <a href="https://crosslinkconsulting.net">Cross Link Consulting</a>
    ${hasResume ? '<a href="/assets/Patrick-Reynolds-Resume.pdf">Resume (PDF)</a>' : ""}
  </div>
</section>`;

const gtMap = `
<section id="why" style="padding-top:8px">
  <div class="sechead"><div><div class="eyebrow">The role</div><p class="big">What the posting asks for, and where I have done it.</p></div>
  <div class="tblwrap"><table class="map">
    <tr><th>The posting</th><th>Where I have done it</th></tr>
    <tr><td>Institution-wide digital, data, and AI strategy</td><td>Writing a county government's AI and AI-governance roadmap now, alongside its IT and network team; twenty-two years of multi-year technology roadmaps and budgets for local governments and regulated firms.</td></tr>
    <tr><td>Enterprise data and AI governance: ethical, secure, compliant</td><td>A production agent platform where a person approves every operation before an agent runs alone, a supervising agent halts deviations, and every inference call is attributed. Provider selection on U.S. residency, no-training, and zero retention.</td></tr>
    <tr><td>Hands-on agentic AI: agents, workflows, orchestration, multi-model</td><td>Built it: supervisor and worker agents, rehearsal-then-manifest workflows, five inference tiers, an Anthropic-compatible gateway so standard tooling runs on local or cloud models.</td></tr>
    <tr><td>MCP concepts, AI gateways, secure enterprise integration</td><td>MCP tool servers that let a local model operate a remote-management platform under a scoped service account with a full audit log; an API gateway enforcing identity, roles, and quotas in front of cloud models; delegated-first Microsoft 365 with a fail-closed confused-deputy guard.</td></tr>
    <tr><td>Practical coding literacy; Claude Code and modern AI tooling</td><td>Daily. The engineering process runs teams of people and agents through audit-first work packets, isolated worktrees, and a test gate on every pull request; 3,277 tests on the flagship platform.</td></tr>
    <tr><td>Leading technical staff; budgets; KPIs; risk and continuity</td><td>Founder and CEO of a fifteen-person security-first IT firm from 2004 to 2026, now its advisor; breach monitoring and response since 2019; business continuity planning as a service line; P&amp;L for twenty-two years.</td></tr>
    <tr><td>Research-university setting</td><td>Not on my resume, and I say so. What I bring instead: a measured research practice with pre-registered decisions, numbered journals, and retractions on the record, and the habit of learning an institution's culture from the people who live in it.</td></tr>
  </table></div></div>
</section>`;

fs.mkdirSync(path.join(docs, "assets"), { recursive: true });
const write = (rel, html) => { const p = path.join(docs, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); console.log("wrote", rel); };

write("index.html", shell({ title: "Patrick Reynolds · Guy Prompting", desc: "Patrick Reynolds invests in people, helping them put their technical gifts to work so together they can humbly serve their neighbors. AI strategy, governance, and people-first implementation.", current: "/", body: heroHtml(false) + beliefs }));
write("work/index.html", shell({ title: "Work · Guy Prompting", desc: "Case studies, not source: a governed AI-agent platform, a county AI roadmap, local inference research, and the decisions that mattered.", current: "/work/", body: workBody }));
write("try/index.html", shell({ title: "Try it · Guy Prompting", desc: "How a governed AI-agent run works: pick a task and a skill tier and watch what the agent is allowed to do.", current: "/try/", body: tryBody }));
write("journal/index.html", shell({ title: "Journal · Guy Prompting", desc: "Research in the open: a phone-sized model built from nothing, local inference on one GPU, and negative results kept on the record.", current: "/journal/", body: journalBody }));
write("contact/index.html", shell({ title: "Contact · Guy Prompting", desc: "Connect with Patrick Reynolds over coffee.", current: "/contact/", body: contactBody }));

const gtPath = fs.readFileSync(path.join(root, "..", "research", "georgia-tech", "portfolio-path.txt"), "utf8").trim().split("=")[1];
write(`p/${gtPath}/index.html`, shell({ title: "Patrick Reynolds · for Georgia Tech", desc: "Patrick Reynolds, candidate for Executive Director, AI Enablement & Acceleration at Georgia Tech: how I lead, what I have built, and how I govern it.", current: "gt", noindex: true, foot: "Prepared September 2026 for the Georgia Tech search",
  body: heroHtml(true) + gtMap + beliefs.replace(/href="\/work\/#w0(\d)"/g, 'href="#w0$1"') + workBody.replace('style="padding-top:48px"', 'id="work" style="padding-top:8px"') + tryBody.replace('style="padding-top:48px"', 'id="try" style="padding-top:8px"') + contactBody.replace('style="padding-top:48px"', 'id="contact" style="padding-top:8px"') }));

fs.writeFileSync(path.join(docs, "assets", "seal.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="${C.nav}"/><path d="M8 30 A14 14 0 0 1 36 30 Z" fill="${C.orange}"/><g stroke="${C.navInk}" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="8" x2="22" y2="13"/><line x1="12" y1="12" x2="15" y2="16"/><line x1="32" y1="12" x2="29" y2="16"/></g><line x1="4" y1="34" x2="40" y2="34" stroke="${C.navInk}" stroke-width="2.5"/></svg>`);
console.log("headshot:", hasHeadshot ? "present" : "placeholder", "· resume pdf:", hasResume ? "present" : "absent");
