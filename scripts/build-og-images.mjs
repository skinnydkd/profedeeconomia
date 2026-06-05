#!/usr/bin/env node
/**
 * Generates Open Graph share images (1200×630 PNG) into public/og/.
 *
 * Hybrid set: one site-wide `default.png` plus one per asignatura (branded with
 * its accent colour, level and title). Pages pick their image automatically in
 * BaseLayout from the first URL segment; everything else falls back to default.
 *
 * Reuses the project's Chrome/Puppeteer setup (same as the deck/PDF scripts) so
 * it adds no new dependency. Re-run when branding or asignatura titles change:
 *   npm run build:og
 */
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import puppeteer from 'puppeteer';

function findChromeExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = platform() === 'win32'
    ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
       'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
       `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`]
    : platform() === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  for (const c of candidates) { if (c && existsSync(c)) return c; }
  return null;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'public/og');
mkdirSync(outDir, { recursive: true });

// Accent hex per asignatura colour token (mirrors global.css design tokens).
const ACCENT = {
  edmn: '#C44E2C', eco1: '#1F6E6E', eco4: '#D4A24C', fopp: '#5B3A4E',
  taller3: '#6B8E23', ipe1: '#4A6FA5', ipe2: '#2F4F7F', eeae: '#2E5E3A', gpe: '#8C2F39',
};

// Minimal asignatura data (kept in sync with src/lib/asignaturas.ts).
const ASIGNATURAS = [
  { slug: 'edmn-2bach',     level: '2.º Bachillerato',          color: 'edmn',    title: 'Empresa y Diseño de Modelos de Negocio' },
  { slug: 'eco-1bach',      level: '1.º Bachillerato',          color: 'eco1',    title: 'Economía' },
  { slug: 'eco-4eso',       level: '4.º ESO',                   color: 'eco4',    title: 'Economía y Emprendimiento' },
  { slug: 'fopp-4eso',      level: '4.º ESO',                   color: 'fopp',    title: 'Formación y Orientación Personal y Profesional' },
  { slug: 'taller-eco-3eso',level: '3.º ESO',                   color: 'taller3', title: 'Taller de Economía' },
  { slug: 'ipe1-fp',        level: 'Formación Profesional',     color: 'ipe1',    title: 'Itinerario Personal para la Empleabilidad I' },
  { slug: 'ipe2-fp',        level: 'Formación Profesional',     color: 'ipe2',    title: 'Itinerario Personal para la Empleabilidad II' },
  { slug: 'eeae-bach',      level: 'Bachillerato',              color: 'eeae',    title: 'Economía, Emprendimiento y Actividad Empresarial' },
  { slug: 'gpe-bach',       level: 'Bachillerato',              color: 'gpe',     title: 'Gestión de Proyectos de Emprendimiento' },
];

const SECTIONS = 'Libro · Diapositivas · Actividades · Tests · Recursos';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function template({ accent, eyebrow, title, sections }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #FBF6EC; color: #2A1F18;
    font-family: 'Switzer', sans-serif; position: relative; overflow: hidden; }
  .band { position: absolute; top: 0; left: 0; width: 16px; height: 100%; background: ${accent}; }
  .corner { position: absolute; top: 56px; right: 72px; width: 96px; height: 96px;
    border: none; }
  .pad { padding: 80px 96px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  .eyebrow { font-size: 25px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: ${accent}; }
  .rule { width: 132px; height: 7px; background: ${accent}; border-radius: 999px; margin-bottom: 30px; }
  .title { font-family: 'Fraunces', serif; font-weight: 500; font-size: 72px; line-height: 1.05;
    letter-spacing: -0.015em; max-width: 17ch; font-variation-settings: "SOFT" 80, "WONK" 0; }
  .foot { display: flex; align-items: baseline; justify-content: space-between; }
  .sections { font-family: 'Switzer', sans-serif; font-size: 23px; color: #5C4A3D; font-weight: 500; }
  .brand { font-family: 'Fraunces', serif; font-style: italic; font-weight: 500; font-size: 31px;
    color: #2A1F18; font-variation-settings: "SOFT" 100, "WONK" 1; }
</style></head>
<body>
  <div class="band"></div>
  <svg class="corner" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 78 V22 H64" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div class="pad">
    <div class="eyebrow">${esc(eyebrow)}</div>
    <div>
      <div class="rule"></div>
      <div class="title">${esc(title)}</div>
    </div>
    <div class="foot">
      <div class="sections">${esc(sections)}</div>
      <div class="brand">profedeeconomia.es</div>
    </div>
  </div>
</body></html>`;
}

const jobs = [
  {
    name: 'default',
    html: template({
      accent: '#C44E2C',
      eyebrow: 'Material para profesores de instituto',
      title: 'Economía, empresa y finanzas para el aula',
      sections: 'Libros · Diapositivas · Actividades · Tests · Recursos · por asignatura',
    }),
  },
  ...ASIGNATURAS.map((a) => ({
    name: a.slug,
    html: template({
      accent: ACCENT[a.color],
      eyebrow: a.level,
      title: a.title,
      sections: SECTIONS,
    }),
  })),
];

const exe = findChromeExecutable();
if (!exe) { console.error('✖ Chrome not found. Set PUPPETEER_EXECUTABLE_PATH.'); process.exit(1); }

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

let count = 0;
for (const job of jobs) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(job.html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const out = resolve(outDir, `${job.name}.png`);
  await page.screenshot({ path: out, type: 'png' });
  await page.close();
  count++;
  console.log(`  ✓ og/${job.name}.png`);
}

await browser.close();
console.log(`\nDone. ${count} OG image(s) written to public/og/.`);
