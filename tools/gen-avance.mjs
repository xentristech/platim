#!/usr/bin/env node
// Regenera /avance.html (panel de avance interno, noindex) desde el repo.
// Uso: node tools/gen-avance.mjs   (se ejecuta en local y en el agente programado)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'avance-data.json'), 'utf8'));

// ---- Conteos derivados del repo ----
const rootHtml = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'avance.html');
const blogDir = path.join(ROOT, 'blog');
const blogHtml = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter(f => f.endsWith('.html'))
  : [];
const articulos = blogHtml.filter(f => f !== 'index.html').length;
const paginasSitio = rootHtml.length + (blogHtml.includes('index.html') ? 1 : 0);
const totalPaginas = rootHtml.length + blogHtml.length;

// ---- Fecha/hora en Colombia (UTC-5, sin horario de verano) ----
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fmtFecha(iso) {            // "2026-08-12" -> "12 ago 2026"
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}
function sello() {
  const now = new Date(Date.now() - 5 * 3600 * 1000); // a hora Colombia
  const d = now.getUTCDate(), m = MESES[now.getUTCMonth()], y = now.getUTCFullYear();
  let h = now.getUTCHours(); const min = String(now.getUTCMinutes()).padStart(2, '0');
  const ampm = h < 12 ? 'a.m.' : 'p.m.';
  h = h % 12; if (h === 0) h = 12;
  return `${d} ${m} ${y} · ${h}:${min} ${ampm}`;
}

// ---- Últimos commits (delimitador 0x1F vía placeholder git %x1f) ----
const SEP = String.fromCharCode(31);
let commits = [];
try {
  const out = execSync('git log -6 --date=short --pretty=format:%ad%x1f%s', { cwd: ROOT }).toString();
  commits = out.split('\n').filter(Boolean).map(l => {
    const i = l.indexOf(SEP);
    return { fecha: fmtFecha(l.slice(0, i)), texto: l.slice(i + 1) };
  });
} catch (e) { console.error('git log no disponible:', e.message); }

// ---- Helpers de render ----
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const li = (items, mk, cls) => items.map(t =>
  `        <li><span class="mk ${cls}">${mk}</span>${esc(t)}</li>`).join('\n');
const tl = commits.map(c =>
  `      <li><div class="d">${esc(c.fecha)}</div><div class="t">${esc(c.texto)}</div></li>`).join('\n')
  || '      <li><div class="t">Sin historial de commits disponible.</div></li>';

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>PLATIM · Avance del proyecto</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<style>
  :root{
    --navy:#0D1B2A;--navy-2:#152740;--green:#6BAA1F;--green-soft:#8FCB3A;
    --bg:#f4f6f4;--panel:#fff;--ink:#12202e;--muted:#5c6b73;--line:#e2e7e1;--line-strong:#cfd7cd;
    --good:#3f9142;--warn:#c98a1a;--wait:#8a6fb0;
    --shadow:0 1px 2px rgba(13,27,42,.06),0 8px 24px rgba(13,27,42,.06);
  }
  @media (prefers-color-scheme:dark){:root{
    --bg:#0b1621;--panel:#111f2e;--ink:#e7eef2;--muted:#93a4ad;--line:#1e3040;--line-strong:#294156;
    --good:#5cb85f;--warn:#e0a53a;--wait:#a98ad6;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px rgba(0,0,0,.35);}}
  :root[data-theme="light"]{--bg:#f4f6f4;--panel:#fff;--ink:#12202e;--muted:#5c6b73;--line:#e2e7e1;--line-strong:#cfd7cd;--good:#3f9142;--warn:#c98a1a;--wait:#8a6fb0;--shadow:0 1px 2px rgba(13,27,42,.06),0 8px 24px rgba(13,27,42,.06);}
  :root[data-theme="dark"]{--bg:#0b1621;--panel:#111f2e;--ink:#e7eef2;--muted:#93a4ad;--line:#1e3040;--line-strong:#294156;--good:#5cb85f;--warn:#e0a53a;--wait:#a98ad6;--shadow:0 1px 2px rgba(0,0,0,.4),0 10px 30px rgba(0,0,0,.35);}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1120px;margin:0 auto;padding:28px 20px 56px}
  .tnum{font-variant-numeric:tabular-nums}
  header.top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;padding:22px 24px;border-radius:16px;color:#eaf1e6;background:linear-gradient(135deg,var(--navy),var(--navy-2));box-shadow:var(--shadow);position:relative;overflow:hidden}
  header.top::after{content:"";position:absolute;right:-40px;top:-40px;width:220px;height:220px;background:radial-gradient(circle,rgba(107,170,31,.35),transparent 68%);pointer-events:none}
  .brand{display:flex;align-items:center;gap:12px}
  .logo{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:var(--green);color:#0c1a05;font-weight:800;font-size:20px;box-shadow:0 4px 14px rgba(107,170,31,.4)}
  .brand h1{margin:0;font-size:20px;font-weight:700}
  .brand p{margin:2px 0 0;font-size:13px;color:#9fb6c4}
  .stamp{text-align:right;font-size:12.5px;color:#b9cdd8;z-index:1}
  .stamp b{color:#eaf1e6;font-weight:600}
  .pill-live{display:inline-flex;align-items:center;gap:6px;margin-top:6px;background:rgba(107,170,31,.16);border:1px solid rgba(107,170,31,.45);color:#c7e39a;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--green-soft);animation:pulse 2.4s infinite}
  @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(143,203,58,.6)}70%{box-shadow:0 0 0 8px rgba(143,203,58,0)}100%{box-shadow:0 0 0 0 rgba(143,203,58,0)}}
  @media (prefers-reduced-motion:reduce){.dot{animation:none}}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px}
  .kpi{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 16px 14px;box-shadow:var(--shadow)}
  .kpi .n{font-size:30px;font-weight:800;letter-spacing:-.5px;line-height:1}
  .kpi .l{margin-top:7px;font-size:12.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px}
  .kpi .s{margin-top:3px;font-size:12px;color:var(--good)}
  .progress{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 20px;box-shadow:var(--shadow);margin-top:16px}
  .progress .row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
  .progress h2{margin:0;font-size:14px;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);font-weight:700}
  .progress .val{font-size:26px;font-weight:800;color:var(--green)}
  .bar{height:14px;border-radius:999px;background:var(--line);overflow:hidden}
  .bar>span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green),var(--green-soft))}
  .cols{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:16px}
  .col{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:6px 4px 10px;box-shadow:var(--shadow)}
  .col>h3{display:flex;align-items:center;gap:8px;margin:12px 16px 8px;font-size:13px;text-transform:uppercase;letter-spacing:.7px}
  .col>h3 .c{width:9px;height:9px;border-radius:50%}
  .col>h3 .cnt{margin-left:auto;font-size:12px;color:var(--muted);font-weight:600;background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:1px 8px}
  .c-good{background:var(--good)}.c-warn{background:var(--warn)}.c-wait{background:var(--wait)}
  ul.items{list-style:none;margin:0;padding:0}
  ul.items li{display:flex;gap:9px;padding:8px 16px;font-size:13.5px;border-top:1px solid var(--line)}
  ul.items li:first-child{border-top:none}
  ul.items li .mk{flex:0 0 auto;margin-top:2px;font-size:12px}
  .mk.good{color:var(--good)}.mk.warn{color:var(--warn)}.mk.wait{color:var(--wait)}
  .timeline{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px 20px 8px;box-shadow:var(--shadow);margin-top:16px}
  .timeline h2{margin:0 0 14px;font-size:14px;text-transform:uppercase;letter-spacing:.7px;color:var(--muted);font-weight:700}
  .tl{list-style:none;margin:0;padding:0 0 0 22px;position:relative}
  .tl::before{content:"";position:absolute;left:5px;top:4px;bottom:14px;width:2px;background:var(--line-strong)}
  .tl li{position:relative;padding:0 0 16px}
  .tl li::before{content:"";position:absolute;left:-21px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--green);border:2px solid var(--panel);box-shadow:0 0 0 2px var(--line-strong)}
  .tl .d{font-size:12px;color:var(--green);font-weight:700}
  .tl .t{font-size:13.5px;color:var(--ink);margin-top:1px}
  footer.foot{margin-top:22px;text-align:center;font-size:12px;color:var(--muted)}
  @media (max-width:820px){.kpis{grid-template-columns:repeat(2,1fr)}.cols{grid-template-columns:1fr}}
  @media (max-width:520px){.kpis{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="brand">
      <div class="logo">P</div>
      <div>
        <h1>PLATIM · Avance del proyecto</h1>
        <p>${esc(data.proyecto)} — ${esc(data.subtitulo)}</p>
      </div>
    </div>
    <div class="stamp">
      Actualizado: <b>${sello()}</b><br>
      <span class="pill-live"><span class="dot"></span>Refresco auto · 8:00 a.m. y 3:00 p.m.</span>
    </div>
  </header>

  <section class="kpis">
    <div class="kpi"><div class="n tnum">${totalPaginas}</div><div class="l">Páginas publicadas</div><div class="s">${paginasSitio} del sitio + ${articulos} blog</div></div>
    <div class="kpi"><div class="n tnum">${articulos}</div><div class="l">Artículos de blog</div><div class="s">SEO + FAQ schema</div></div>
    <div class="kpi"><div class="n tnum">${esc(data.faq)}</div><div class="l">Preguntas FAQ</div><div class="s">datos y citas reales</div></div>
    <div class="kpi"><div class="n tnum">100%</div><div class="l">HTTPS + auto-deploy</div><div class="s">GitHub → Hostinger</div></div>
  </section>

  <section class="progress">
    <div class="row"><h2>Progreso general</h2><div class="val tnum">${data.progreso}%</div></div>
    <div class="bar"><span style="width:${data.progreso}%"></span></div>
  </section>

  <section class="cols">
    <div class="col">
      <h3><span class="c c-good"></span>Hecho <span class="cnt tnum">${data.hecho.length}</span></h3>
      <ul class="items">
${li(data.hecho, '✔', 'good')}
      </ul>
    </div>
    <div class="col">
      <h3><span class="c c-warn"></span>En curso <span class="cnt tnum">${data.enCurso.length}</span></h3>
      <ul class="items">
${li(data.enCurso, '◐', 'warn')}
      </ul>
    </div>
    <div class="col">
      <h3><span class="c c-wait"></span>Pendiente <span class="cnt tnum">${data.pendiente.length}</span></h3>
      <ul class="items">
${li(data.pendiente, '○', 'wait')}
      </ul>
    </div>
  </section>

  <section class="timeline">
    <h2>Últimos cambios (git)</h2>
    <ul class="tl">
${tl}
    </ul>
  </section>

  <footer class="foot">Panel interno de <b>${esc(data.proyecto)}</b> · noindex · se regenera solo a las 8:00 a.m. y 3:00 p.m. (Colombia).</footer>
</div>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'avance.html'), html, 'utf8');
console.log(`avance.html generado · ${totalPaginas} páginas · ${articulos} artículos · ${commits.length} commits · ${sello()}`);
