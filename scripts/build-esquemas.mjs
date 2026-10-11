#!/usr/bin/env node
/**
 * Captures the first diagram of every book unit as a PNG, so search engines
 * get a real image of the unit (og:image and the Article JSON-LD `image`).
 * The diagrams themselves are inline SVG, which Google Images and result
 * thumbnails never see. See docs/seo-estrategia-2026.md §5.10-5.11.
 *
 *   npm run build           # the captures are taken from dist/
 *   npm run build:esquemas  # writes public/esquemas/<asignatura>/<unidad>[.ca].png
 *   npm run build           # units pick their PNG up by file name
 *
 * Re-run when a diagram changes. Optional slug filters:
 *   node scripts/build-esquemas.mjs taller-eco-3eso
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import puppeteer from 'puppeteer';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = existsSync(resolve(root, 'dist/client')) ? resolve(root, 'dist/client') : resolve(root, 'dist');
const outDir = resolve(root, 'public/esquemas');
const filters = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!existsSync(distDir)) {
  console.error('✖ No existe dist/. Corre "npm run build" antes.');
  process.exit(1);
}

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
  return candidates.find((c) => c && existsSync(c)) ?? null;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

function startStaticServer(port) {
  const server = createServer((req, res) => {
    let filePath = join(distDir, decodeURIComponent(req.url.split('?')[0]));
    if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end(); return; }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
    if (!existsSync(filePath)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });
  return new Promise((ok, ko) => { server.listen(port, '127.0.0.1', () => ok(server)); server.on('error', ko); });
}

/** Every built book unit that renders at least one diagram, in both languages. */
function unitPages() {
  const jobs = [];
  for (const [prefix, suffix] of [['', ''], ['ca/', '.ca']]) {
    for (const asig of readdirSync(join(distDir, prefix || '.'))) {
      if (filters.length && !filters.includes(asig)) continue;
      const libro = join(distDir, prefix, asig, 'libro');
      if (!existsSync(libro) || !statSync(libro).isDirectory()) continue;
      for (const unidad of readdirSync(libro)) {
        const html = join(libro, unidad, 'index.html');
        if (unidad === 'imprimir' || !existsSync(html)) continue;
        if (!readFileSync(html, 'utf8').includes('class="diagram ')) continue;
        jobs.push({ url: `/${prefix}${asig}/libro/${unidad}/`, out: join(outDir, asig, `${unidad}${suffix}.png`) });
      }
    }
  }
  return jobs;
}

const jobs = unitPages();
console.log(`${jobs.length} unidades con esquema.`);
const PORT = 4331;
const server = await startStaticServer(PORT);
const browser = await puppeteer.launch({ executablePath: findChromeExecutable() ?? undefined });
let ok = 0;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  for (const job of jobs) {
    await page.goto(`http://127.0.0.1:${PORT}${job.url}`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.getElementById('consent-banner')?.remove();
    });
    const figure = await page.$('figure.diagram .diagram__inner');
    if (!figure) { console.warn(`  ⚠ sin esquema visible: ${job.url}`); continue; }
    mkdirSync(dirname(job.out), { recursive: true });
    await figure.screenshot({ path: job.out });
    ok++;
    console.log(`  ✓ ${job.url}`);
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`\n${ok}/${jobs.length} esquemas en public/esquemas/.`);
