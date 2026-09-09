// Builds docs/index.html and the per-application pages from one template (editorial direction, Sept 2026).
// Usage: node scripts/build-site.js
// Headshot: put docs/assets/headshot.jpg in place and rebuild; until then a marked placeholder renders.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const docs = path.join(root, "docs");
const hasHeadshot = fs.existsSync(path.join(docs, "assets", "headshot.jpg"));

const work = [
  { n: "01", title: "Governed AI-agent platform", status: "Production", meta: "2026 · 33 client organizations",
    body: "Technicians build and run AI agents against real business systems under tiered least-privilege skills. A person approves every operation before the agent runs unattended; a supervising agent halts anything outside the approved plan. Five inference tiers under U.S.-residency rules; every call attributed for cost. 3,277 automated tests.",
    href: "https://github.com/clpatrick/governed-agent-platform", link: "Architecture and security posture" },
  { n: "02", title: "Melon Code: a Claude-Code-class agent on a local model", status: "Daily use", meta: "2026 · TypeScript · llama.cpp · NVIDIA NIM",
    body: "The full coding-agent loop, with tools, a four-mode permission engine, subagents, compaction, and rewind, driving a 284-billion-parameter model on one workstation. An Anthropic-compatible endpoint lets Claude Code itself run on local or hosted open models. KV-cache prefix work cut a warm turn from 36 seconds to 1.3.",
    href: "https://github.com/clpatrick/melon-code", link: "What was built and measured" },
  { n: "03", title: "Local inference at the edge of one GPU", status: "Research", meta: "2026 · 284B mixture-of-experts · RTX 4090",
    body: "Decode raised from 7.3 to about 20 tokens per second at a stated fidelity floor. Three speculative-decoding routes (a DSpark confidence-scheduled drafter, a multi-token-prediction head, DFlash) each closed with numbers from derived break-even math; the DSpark paper's prefix-survival gate implemented in llama.cpp for a measured 7.1% gain. 190+ journal entries, pre-registered decisions.",
    href: "#research", link: "The research list" },
  { n: "04", title: "A phone-sized model, built from nothing on one desk", status: "In progress", meta: "Sept 2026 · Qwen 4-class MoE · iPhone Air",
    body: "A mixture-of-experts language model in the Qwen3.8-Flash-Next architecture family, sized to the iPhone Air's 2.5 GB safe memory tier, started from random weights, taught by distillation from Qwen3.8 27B, with DSpark and MTP speculation measured on the phone with reasoning on. Every decision pre-registered; the journal is the deliverable.",
    href: "#journal", link: "Follow the journal" },
  { n: "05", title: "MelonStudio: splitting a model across GPU and CPU by hand", status: "Complete · negative result", meta: "2025–26 · C# · ONNX Runtime GenAI",
    body: "ONNX Runtime won't offload layers the way llama.cpp does, so this built it: graph partitioning at layer boundaries, two orchestrated sessions, pinned memory, a stateful KV cache. Measured honestly (4.4 tokens per second hybrid against 93 GPU-only), the result was to stop and move to llama.cpp.",
    href: "https://github.com/clpatrick/onnx-hybrid-inference-study", link: "Design, benchmarks, and the negative result" },
  { n: "06", title: "County AI and AI-governance roadmap", status: "In progress", meta: "2026 · Georgia county government",
    body: "Working alongside a county IT and network team on systems, network, and security operations while helping them write an AI roadmap they can actually follow: where sensitive data is exposed today, tiered guardrails, and the staff-augmentation uses worth doing first.",
    href: "#contact", link: "Ask about this engagement" },
  { n: "07", title: "Engineering with people and agents", status: "In daily use", meta: "2026 · process + ledger",
    body: "The written operating model behind the platform: audit-first work packets, isolated worktrees, worker, verifier, and adversarial-reviewer roles, a test gate on every pull request, and a reservation ledger so concurrent agent sessions share one machine without collisions.",
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

const seal = (cls) => `<svg class="${cls}" viewBox="0 0 520 330" role="img" aria-label="Guy Prompting seal"><path d="M40 165 L120 40 H400 L480 165 L400 290 H120 Z" fill="none" stroke="currentColor" stroke-width="10"/><path d="M212 118 A48 48 0 0 1 308 118 Z" fill="var(--red)"/><g stroke="currentColor" stroke-width="5" stroke-linecap="round"><line x1="260" y1="62" x2="260" y2="84"/><line x1="228" y1="70" x2="238" y2="90"/><line x1="292" y1="70" x2="282" y2="90"/></g><text x="260" y="205" text-anchor="middle" font-family="'Kaushan Script','Brush Script MT',cursive" font-size="64" fill="currentColor">Guy Prompting</text><text x="260" y="250" text-anchor="middle" font-family="Oswald,'Arial Narrow',sans-serif" font-size="14" letter-spacing="4" fill="currentColor">SERVING SINCE 2004</text></svg>`;

const css = `
:root{--paper:#F3F3F1;--paper-2:#E9E8E3;--ink:#141614;--ink-2:#3E403C;--ink-3:#6B6E68;--line:#141614;--hair:#C9CAC4;--green:#163B2E;--green-ink:#F3F3F1;--green-soft:#CBD5CE;--red:#D2232A;--ok:#1F6B4E;--ph:#D9D7D0;
--serif:"Newsreader",Georgia,"Times New Roman",serif;--sans:"Public Sans","Helvetica Neue",Arial,sans-serif;--caps:"Oswald","Arial Narrow",sans-serif;--mono:"IBM Plex Mono",Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#121513;--paper-2:#1A1E1B;--ink:#ECEBE6;--ink-2:#C5C7C1;--ink-3:#8C908A;--line:#ECEBE6;--hair:#343935;--green:#1F4A3A;--green-ink:#ECEBE6;--green-soft:#B9C7BE;--red:#E0473F;--ok:#6FB58F;--ph:#2A2F2C}}
:root[data-theme="dark"]{--paper:#121513;--paper-2:#1A1E1B;--ink:#ECEBE6;--ink-2:#C5C7C1;--ink-3:#8C908A;--line:#ECEBE6;--hair:#343935;--green:#1F4A3A;--green-ink:#ECEBE6;--green-soft:#B9C7BE;--red:#E0473F;--ok:#6FB58F;--ph:#2A2F2C}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55}
a{color:var(--green);text-decoration-thickness:1px;text-underline-offset:3px}a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px}
.caps{font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em}
.serif{font-family:var(--serif)}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
nav.top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid var(--line)}
nav.top .brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--ink)}
nav.top .brand svg{width:40px;height:40px}
nav.top .brand span{font-family:var(--serif);font-size:20px;font-weight:600}
nav.top ul{list-style:none;display:flex;gap:26px;margin:0;padding:0;flex-wrap:wrap}
nav.top li a{font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:var(--ink);text-decoration:none}
nav.top li a:hover{color:var(--red)}
header.hero{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;padding:56px 0 48px;align-items:stretch}
.photo{display:flex;flex-direction:column;gap:10px}
.photo .frame{aspect-ratio:4/5;background:var(--ph);border:1px solid var(--line);overflow:hidden;display:flex;align-items:center;justify-content:center}
.photo .frame img{width:100%;height:100%;object-fit:cover;display:block}
.photo .cap{font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:var(--ink-3)}
.intro{display:flex;flex-direction:column;justify-content:center;gap:22px}
.eyebrow{font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:var(--red)}
h1{font-family:var(--serif);font-weight:500;font-size:clamp(36px,4.6vw,62px);line-height:1.05;margin:0;text-wrap:balance}
.lede{margin:0;max-width:56ch;font-size:17px;color:var(--ink-2)}
.cta{display:flex;gap:14px;flex-wrap:wrap}
.btn{display:inline-block;padding:14px 24px;font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em;font-size:12px;text-decoration:none}
.btn.primary{background:var(--green);color:var(--green-ink)}.btn.primary:hover{background:var(--red);color:#fff}
.btn.ghost{border:1px solid var(--line);color:var(--ink)}.btn.ghost:hover{color:var(--red);border-color:var(--red)}
.principles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px;padding:40px 48px;background:var(--green);color:var(--green-ink);margin-bottom:48px}
.principles h2{font-family:var(--serif);font-weight:500;font-size:34px;line-height:1.15;margin:0 0 8px}
.principles p{margin:0;color:var(--green-soft)}
section{padding:0 0 48px}
.sechead{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:48px;margin-bottom:8px}
.sechead p{margin:0;font-family:var(--serif);font-size:22px;line-height:1.35}
.index{display:flex;flex-direction:column}
.row{display:grid;grid-template-columns:56px minmax(0,1fr) 150px;gap:20px;padding:20px 0;border-top:1px solid var(--line);align-items:baseline}
.row:last-child{border-bottom:1px solid var(--line)}
.row .num{font-family:var(--serif);font-size:22px;color:var(--red)}
.row .t{font-family:var(--serif);font-size:24px;font-weight:500;line-height:1.2;margin:0 0 4px}
.row .m{font-family:var(--caps);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--ink-3);margin:0 0 8px}
.row p{margin:0 0 8px;color:var(--ink-2);max-width:72ch}
.row .more{font-size:14px;font-weight:500}
.row .st{font-family:var(--caps);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--ink-3);text-align:right}
.tblwrap{overflow-x:auto;border:1px solid var(--line);background:var(--paper)}
table.map{border-collapse:collapse;width:100%;font-size:15px}
table.map th{text-align:left;font-family:var(--caps);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--ink-3);font-weight:500;padding:12px 14px;border-bottom:1px solid var(--line)}
table.map td{padding:12px 14px;border-bottom:1px solid var(--hair);vertical-align:top;color:var(--ink-2)}
table.map td:first-child{color:var(--ink);font-family:var(--serif);font-size:17px;width:34%}
table.map tr:last-child td{border-bottom:0}
.sim{border:1px solid var(--line);background:var(--paper);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:0}
.sim .ctl{padding:24px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:14px}
.sim h3{font-family:var(--serif);font-size:24px;font-weight:500;margin:0;line-height:1.2}
.sim .lede{font-size:15px}
.sim fieldset{border:0;padding:0;margin:0}
.sim legend{font-family:var(--caps);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--ink-3);margin-bottom:8px}
.sim .opts{display:flex;flex-direction:column;gap:6px}
.sim label.opt{display:flex;gap:10px;align-items:flex-start;font-size:14px;cursor:pointer;padding:8px 10px;border:1px solid var(--hair)}
.sim label.opt:has(input:checked){border-color:var(--green);box-shadow:inset 3px 0 0 var(--green)}
.sim label.opt input{margin-top:3px;accent-color:var(--green)}
.sim label.opt small{display:block;color:var(--ink-3);font-size:12.5px}
.sim button{font-family:var(--caps);text-transform:uppercase;letter-spacing:.14em;font-size:12px;padding:12px 18px;background:var(--green);color:var(--green-ink);border:0;cursor:pointer;align-self:flex-start}
.sim button:hover{background:var(--red);color:#fff}
.sim .log{padding:20px 24px;min-height:320px;max-height:460px;overflow:auto;font-family:var(--mono);font-size:12.5px;line-height:1.6;color:var(--ink-2);background:var(--paper-2)}
.sim .log .step{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed var(--hair);opacity:0;transform:translateY(3px);animation:stepin .35s ease-out forwards}
.sim .log .step:last-child{border-bottom:0}@keyframes stepin{to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.sim .log .step{animation:none;opacity:1;transform:none}}
.sim .log .who{flex:0 0 78px;color:var(--ink-3)}
.sim .log .ok{color:var(--ok)}.sim .log .halt{color:var(--red);font-weight:500}.sim .log .ask{color:var(--green);font-style:italic}
.sim .log .empty{color:var(--ink-3)}
.govnote{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--hair);border:1px solid var(--line);border-top:0}
.govnote div{background:var(--paper);padding:14px 16px;font-size:14px;color:var(--ink-2)}
.govnote b{display:block;color:var(--ink);font-weight:600;margin-bottom:4px}
.also{columns:2;column-gap:40px;margin:0;padding-left:18px;color:var(--ink-2);font-size:15px}
.also li{break-inside:avoid;margin-bottom:10px}
.prose{max-width:66ch;color:var(--ink-2)}.prose p{margin:0 0 16px}.prose p:last-child{margin:0}.prose strong{color:var(--ink);font-weight:600}
.contact{display:flex;flex-wrap:wrap;gap:12px 28px;font-size:15px}.contact a{font-weight:500}
footer{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:24px 0 56px;border-top:1px solid var(--line);flex-wrap:wrap}
footer .seal{width:96px;height:auto;color:var(--green)}
footer .close{font-family:var(--serif);font-style:italic;font-size:20px;color:var(--green)}
footer .fine{font-family:var(--caps);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--ink-3)}
@media (max-width:820px){header.hero{grid-template-columns:1fr;gap:28px}.principles{grid-template-columns:1fr;padding:32px 24px}.sechead{grid-template-columns:1fr;gap:12px}.row{grid-template-columns:44px minmax(0,1fr)}.row .st{grid-column:2;text-align:left}.sim{grid-template-columns:1fr}.sim .ctl{border-right:0;border-bottom:1px solid var(--line)}.also{columns:1}nav.top ul{gap:16px}}
`;

const simJS = `
(function(){
  var form=document.getElementById("simForm"),log=document.getElementById("simLog");
  var SC={
    triage:{name:"Review flagged email across client tenants",ops:[
      {t:1,text:"list flagged messages across 33 tenants (read)"},
      {t:1,text:"read message headers and detection reasons (read)"},
      {t:2,text:"dismiss 4 single-group false positives (reversible write)"},
      {t:2,text:"open a ticket with the catch story (reversible write)"},
      {t:3,text:"quarantine 1 message tenant-wide (irreversible)"}]},
    reboot:{name:"Fix a slow workstation",ops:[
      {t:1,text:"read CPU, memory, top processes on WS-114 (read)"},
      {t:1,text:"read service state for the print spooler (read)"},
      {t:2,text:"restart the print spooler service (reversible write)"},
      {t:3,text:"reboot WS-114 while a user is signed in (irreversible)"}]},
    offboard:{name:"Off-board a departed employee",ops:[
      {t:1,text:"read group memberships and mailbox size (read)"},
      {t:2,text:"disable sign-in and revoke sessions (reversible write)"},
      {t:2,text:"forward mail to the manager for 30 days (reversible write)"},
      {t:3,text:"remove from all groups and wipe the mobile device (irreversible)"}]}
  };
  function line(who,cls,text){var d=document.createElement("div");d.className="step";var a=document.createElement("span");a.className="who";a.textContent=who;var b=document.createElement("span");b.className=cls||"";b.textContent=text;d.appendChild(a);d.appendChild(b);log.appendChild(d);log.scrollTop=log.scrollHeight;}
  function run(task,tier){
    log.textContent="";var sc=SC[task];var steps=[];
    steps.push(["rehearsal","","scene: "+sc.name+" · tier L"+tier]);
    steps.push(["rehearsal","","walking the plan with zero live calls…"]);
    var manifest=sc.ops.filter(function(o){return o.t<=tier});var beyond=sc.ops.filter(function(o){return o.t>tier});
    manifest.forEach(function(o){steps.push(["manifest","",o.text])});
    steps.push(["operator","ask","approve "+manifest.length+" operation"+(manifest.length===1?"":"s")+" for unattended runs? → approved"]);
    steps.push(["run","","locked to the approved manifest"]);
    manifest.forEach(function(o){steps.push(["agent","ok","✓ "+o.text])});
    beyond.forEach(function(o){steps.push(["agent","","→ attempts: "+o.text]);steps.push(["director","halt",o.t===3?"✕ halted: irreversible action outside the approved manifest. Parked for a person.":"✕ blocked: not in the approved manifest."]);});
    if(tier===3){steps.push(["director","ask","L3 run: every call screened on its arguments; anything off-plan halts the scene."]);}
    steps.push(["audit","","run recorded: "+manifest.length+" allowed, "+beyond.length+" refused, cost attributed to the agent."]);
    var i=0,delay=window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:420;
    (function next(){if(i>=steps.length)return;var s=steps[i++];line(s[0],s[1],s[2]);setTimeout(next,delay);})();
  }
  form.addEventListener("submit",function(e){e.preventDefault();var fd=new FormData(form);run(fd.get("task"),parseInt(fd.get("tier"),10));});
})();`;

function page(variant) {
  const gt = variant === "gatech";
  const title = gt ? "Patrick Reynolds · for Georgia Tech" : "Patrick Reynolds · Guy Prompting";
  const desc = gt ? "Patrick Reynolds, candidate for Executive Director, AI Enablement & Acceleration at Georgia Tech: what I have built, how I govern it, and how I lead."
                  : "Patrick Reynolds: AI strategy, governance, and secure implementation for governments, health systems, law firms, and the people who serve them. People matter. Applications must be AI friendly.";
  const eyebrow = gt ? "Prepared for the Georgia Tech OIT search committee · Executive Director, AI Enablement &amp; Acceleration · Job 302406" : "AI strategy · governance · secure implementation";
  const h1 = gt ? "Enable a campus to put AI to work, with governance people can actually follow." : "Put AI to work for your people, with limits and someone watching.";
  const headshot = hasHeadshot ? `<img src="/assets/headshot.jpg" alt="Patrick Reynolds" width="800" height="1000">` : `<span class="caps" style="font-size:12px;color:var(--ink-3)">Photo coming</span>`;
  const map = gt ? `
<section id="why">
  <div class="sechead"><div class="eyebrow">The role</div><p class="serif">What the posting asks for, and where I have done it.</p></div>
  <div class="tblwrap"><table class="map">
    <tr><th>The posting</th><th>Where I have done it</th></tr>
    <tr><td>Institution-wide digital, data, and AI strategy</td><td>Writing a county government's AI and AI-governance roadmap now, alongside its IT and network team; twenty-two years of multi-year technology roadmaps and budgets for local governments and regulated firms.</td></tr>
    <tr><td>Enterprise data and AI governance: ethical, secure, compliant</td><td>A production agent platform where a person approves every operation before an agent runs alone, a supervising agent halts deviations, and every inference call is attributed. Provider selection on U.S. residency, no-training, and zero retention.</td></tr>
    <tr><td>Hands-on agentic AI: agents, workflows, orchestration, multi-model</td><td>Built it: supervisor and worker agents, rehearsal-then-manifest workflows, five inference tiers, an Anthropic-compatible gateway so standard tooling runs on local or cloud models.</td></tr>
    <tr><td>MCP concepts, AI gateways, secure enterprise integration</td><td>MCP tool servers that let a local model operate a remote-management platform under a scoped service account with a full audit log; an API gateway enforcing identity, roles, and quotas in front of cloud models; delegated-first Microsoft 365 with a fail-closed confused-deputy guard.</td></tr>
    <tr><td>Practical coding literacy; Claude Code and modern AI tooling</td><td>Daily. The engineering process below runs teams of people and agents through audit-first work packets, isolated worktrees, and a test gate on every pull request; 3,277 tests on the flagship platform.</td></tr>
    <tr><td>Leading technical staff; budgets; KPIs; risk and continuity</td><td>Founder and CEO of a fifteen-person security-first IT firm from 2004 to 2026, now its advisor; breach monitoring and response since 2019; business continuity planning as a service line; P&amp;L for twenty-two years.</td></tr>
    <tr><td>Research-university setting</td><td>Not on my resume, and I say so. What I bring instead: a measured research practice with pre-registered decisions, numbered journals, and retractions on the record, including a preprint on lossless language-model compression, and the habit of learning an institution's culture from the people who live in it.</td></tr>
  </table></div>
</section>` : "";

  const rows = work.map(w => `
    <div class="row">
      <div class="num serif">${w.n}</div>
      <div><h3 class="t serif">${w.title}</h3><div class="m">${w.meta}</div><p>${w.body}</p><a class="more" href="${w.href}">${w.link} →</a></div>
      <div class="st">${w.status}</div>
    </div>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g, "&quot;")}">
${gt ? '<meta name="robots" content="noindex">' : ""}
<link rel="icon" href="/assets/seal.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&family=Oswald:wght@500&family=Kaushan+Script&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${css}</style>
</head>
<body>
<div class="wrap">

<nav class="top" aria-label="Site">
  <a class="brand" href="/">${seal("")}<span>Guy Prompting</span></a>
  <ul>${gt ? '<li><a href="#why">The role</a></li>' : ""}<li><a href="#work">Work</a></li><li><a href="#how">Try it</a></li><li><a href="#research">Research</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>

<header class="hero">
  <div class="photo"><div class="frame">${headshot}</div><div class="cap">Patrick Reynolds · North Augusta, S.C.</div></div>
  <div class="intro">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${h1}</h1>
    <p class="lede">Twenty-two years protecting local-government IT. A year building AI platforms by hand. Both principles, in writing, on every engagement.</p>
    <div class="cta"><a class="btn primary" href="#work">See the work</a><a class="btn ghost" href="#contact">Talk shop over coffee</a></div>
  </div>
</header>

<div class="principles">
  <div><h2>People matter.</h2><p>Technology exists to take the grinding work off people so they can do the work only people can do. The aim is never a smaller team. It is the team you already have, twice as effective.</p></div>
  <div><h2>Applications must be AI friendly.</h2><p>An organization adopts AI well when its systems expose real, governed interfaces, its identities carry least privilege, and its data handling is written down. Most of what goes wrong with AI is an access problem.</p></div>
</div>
${map}
<section id="work">
  <div class="sechead"><div class="eyebrow">Selected work</div><p class="serif">Case studies, not source. Each one names the problem, the architecture, the security posture, and the honest outcome.</p></div>
  <div class="index">${rows}
  </div>
</section>

<section id="how">
  <div class="sechead"><div class="eyebrow">Try it</div><p class="serif">How a governed run works. Give an agent a task, pick the skill tier it holds, and watch what it is allowed to do.</p></div>
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
  </div>
</section>

<section id="research">
  <div class="sechead"><div class="eyebrow">Research, with the negative results kept</div><p class="serif">Numbered journals, pre-registered decisions, and corrections that stay on the record.</p></div>
  <ul class="also">${research.map(r => `<li>${r}</li>`).join("")}</ul>
</section>

<section id="journal">
  <div class="sechead"><div class="eyebrow">Journal · in progress</div><p class="serif">The phone-sized model is being built in the open. Its journal and pre-registered decisions will appear here as they are reviewed.</p></div>
</section>

<section id="about">
  <div class="sechead"><div class="eyebrow">About</div><div class="prose">
    <p>I'm Patrick Reynolds. From 2004 to 2026 I founded and led <strong>Cross Link Consulting</strong>, a security-first IT firm of about fifteen people serving county and municipal governments, doctors, lawyers, accounting firms, and industrial clients across the Augusta area; I remain its founder and advisor. We have provided breach monitoring and response since 2019, finding and evicting intruders before data leaves.</p>
    <p>I founded <strong>Resolute AIM</strong> to help organizations stop asking AI questions and start putting AI to work: guidance, talks, governance, and, when it is needed, the application itself. For the last year I have spent most of my working hours building AI platforms with my own hands, and the lesson is consistent. AI adoption succeeds on identity, access, and data handling long before it succeeds on models.</p>
    <p>Before any of that: undergraduate study at USC Aiken, technology and electronics training in the U.S. Army, eight years in the Reserve, three years keeping a hospital's clinical equipment running, then the Microsoft certifications that opened the door to systems administration. I hire for character and teach expertise.</p>
  </div></div>
</section>

<section id="contact">
  <div class="sechead"><div class="eyebrow">Contact</div><div class="contact">
    <a href="mailto:patrickfromsc@gmail.com">patrickfromsc@gmail.com</a>
    <a href="https://www.linkedin.com/in/patrickreynolds">LinkedIn</a>
    <a href="https://github.com/clpatrick">GitHub</a>
    <a href="https://resoluteaim.com">Resolute AIM</a>
    <a href="https://crosslinkconsulting.net">Cross Link Consulting</a>
  </div></div>
</section>

<footer>
  ${seal("seal")}
  <div class="close">Serving humbly. Caring well.</div>
  <div class="fine">${gt ? "Prepared September 2026 for the Georgia Tech search. " : ""}Case studies are descriptions, not source. Client names appear only with permission.</div>
</footer>

</div>
<script>${simJS}</script>
</body>
</html>
`;
}

fs.mkdirSync(path.join(docs, "assets"), { recursive: true });
fs.writeFileSync(path.join(docs, "assets", "seal.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 330"><rect width="520" height="330" fill="#F3F3F1"/><path d="M40 165 L120 40 H400 L480 165 L400 290 H120 Z" fill="none" stroke="#163B2E" stroke-width="14"/><path d="M212 118 A48 48 0 0 1 308 118 Z" fill="#D2232A"/><g stroke="#163B2E" stroke-width="6" stroke-linecap="round"><line x1="260" y1="62" x2="260" y2="84"/><line x1="228" y1="70" x2="238" y2="90"/><line x1="292" y1="70" x2="282" y2="90"/></g><text x="260" y="215" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="72" fill="#163B2E">GP</text></svg>`);
fs.writeFileSync(path.join(docs, "index.html"), page("root"));
const gtPath = fs.readFileSync(path.join(root, "..", "research", "georgia-tech", "portfolio-path.txt"), "utf8").trim().split("=")[1];
fs.mkdirSync(path.join(docs, "p", gtPath), { recursive: true });
fs.writeFileSync(path.join(docs, "p", gtPath, "index.html"), page("gatech"));
console.log("built docs/index.html and docs/p/" + gtPath + "/index.html; headshot:", hasHeadshot ? "present" : "placeholder");
