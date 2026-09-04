#!/usr/bin/env node
/**
 * Capture the preview thumbnails the index card grids show for each
 * herramienta, generador nativo and proyecto interdisciplinar.
 *
 * Pipeline (assumes `npm run build` has run):
 *   1. Serve dist/client on :4323.
 *   2. Discover each detail page from the dist filesystem (so the inventory
 *      can never drift from what is actually published).
 *   3. Screenshot the most informative region — the interactive island for
 *      herramientas/generadores, the page opening for proyectos — at 2x.
 *   4. Normalize every capture to a 640x400 top-anchored webp under
 *      src/assets/screenshots/<grupo>/…, mirroring the route path.
 *
 * The webp files are committed, like the /og images: the thumbnails are build
 * inputs (imported via import.meta.glob from the index pages), not build
 * outputs, so deploys never depend on a headless Chrome.
 *
 * Usage:
 *   node scripts/build-screenshots.mjs                # all groups
 *   node scripts/build-screenshots.mjs herramientas   # one group
 */
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { platform } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const THUMB_W = 640;
const THUMB_H = 400;

function findChromeExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    const pw = join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium');
    if (existsSync(pw)) return pw;
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

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};
let distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) distDir = resolve(root, 'dist');
if (!existsSync(distDir)) { console.error('✖ dist/ missing. Run `npm run build` first.'); process.exit(1); }

/** Detail pages exactly `depth` directories below dist/<base>/, as route paths. */
function discover(base, depth) {
  const found = [];
  const walk = (rel, level) => {
    const abs = join(distDir, base, rel);
    for (const entry of readdirSync(abs)) {
      const relPath = rel ? `${rel}/${entry}` : entry;
      if (!statSync(join(abs, entry)).isDirectory()) continue;
      if (level + 1 === depth) {
        if (existsSync(join(abs, entry, 'index.html'))) found.push(relPath);
      } else {
        walk(relPath, level + 1);
      }
    }
  };
  walk('', 0);
  return found.sort();
}

/**
 * Per group: how deep the detail routes sit under the section root, which
 * region to capture (first selector that exists wins), and how much page
 * height may enter the crop before the top-anchored 640x400 cut.
 */
const GROUPS = {
  herramientas: { depth: 2, selectors: ['.hi__web', '.player-wrap', 'main'], capHeight: 640 },
  generadores: { depth: 1, selectors: ['.player-wrap .container', 'main'], capHeight: 640 },
  // topOffset skips the breadcrumb strip so the crop opens on the page title.
  proyectos: { depth: 2, selectors: ['main'], capHeight: 780, topOffset: 72 },
};

const only = process.argv[2];
if (only && !GROUPS[only]) {
  console.error(`✖ Unknown group «${only}». Use one of: ${Object.keys(GROUPS).join(', ')}`);
  process.exit(1);
}
const groups = only ? [only] : Object.keys(GROUPS);

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = join(distDir, urlPath);
  if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end('forbidden'); return; }
  try {
    if (statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
      createReadStream(filePath).pipe(res); return;
    }
  } catch {}
  res.writeHead(404); res.end('not found');
});
await new Promise((r) => server.listen(4323, '127.0.0.1', r));
console.log('→ Static server ready on :4323 (serving dist/client).');

const chromePath = findChromeExecutable();
if (!chromePath) { console.error('✖ Could not find Chrome. Set PUPPETEER_EXECUTABLE_PATH.'); process.exit(1); }
const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: chromePath,
  defaultViewport: { width: 1200, height: 900, deviceScaleFactor: 2 },
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
});

let written = 0;
const failures = [];

const page = await browser.newPage();
// Pre-seed a consent decision so the AEPD banner never renders into a capture
// (and the headless run stays tracker-free).
await page.evaluateOnNewDocument(() => {
  try { localStorage.setItem('pde:consent', 'denied'); } catch {}
});

for (const grupo of groups) {
  const { depth, selectors, capHeight, topOffset = 0 } = GROUPS[grupo];
  const pages = discover(grupo, depth);
  console.log(`\n${grupo}: ${pages.length} página(s)`);

  for (const relPath of pages) {
    const url = `http://localhost:4323/${grupo}/${relPath}/`;
    const out = resolve(root, `src/assets/screenshots/${grupo}/${relPath}.webp`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluateHandle('document.fonts.ready');
      // Give client:load islands a beat to paint their hydrated state.
      await new Promise((r) => setTimeout(r, 400));

      const box = await page.evaluate((sels) => {
        for (const sel of sels) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.width > 40 && r.height > 40) {
            return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
          }
        }
        return null;
      }, selectors);
      if (!box) throw new Error(`ninguno de los selectores existe: ${selectors.join(', ')}`);

      const buf = await page.screenshot({
        clip: {
          x: box.x,
          y: box.y + topOffset,
          width: box.width,
          height: Math.min(box.height - topOffset, capHeight),
        },
        captureBeyondViewport: true,
      });
      mkdirSync(dirname(out), { recursive: true });
      await sharp(buf)
        .resize(THUMB_W, THUMB_H, { fit: 'cover', position: 'top' })
        .webp({ quality: 82 })
        .toFile(out);
      console.log(`  ✓ ${grupo}/${relPath}.webp`);
      written++;
    } catch (err) {
      console.error(`  ✖ ${grupo}/${relPath}: ${err.message}`);
      failures.push(`${grupo}/${relPath}: ${err.message}`);
    }
  }
}

await browser.close();
server.close();
console.log(`\nDone. ${written} thumbnail(s) written to src/assets/screenshots/.`);
if (failures.length) {
  console.error(`✖ ${failures.length} capture(s) failed:`);
  for (const f of failures) console.error('   - ' + f);
  process.exit(1);
}
