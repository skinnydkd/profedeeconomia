#!/usr/bin/env node
/**
 * Capture every <Diagram> instance from the Astro preview as a high-res PNG
 * so it can be embedded in Marp slide decks.
 *
 * Pipeline:
 *   1. Start `astro preview` in a child process (assumes `astro build` has run).
 *   2. Wait until http://localhost:4322 is reachable.
 *   3. For each unit page in `src/content/asignaturas/<asignatura>/libro/*.mdx`
 *      where estado==='publicado', visit the rendered page.
 *   4. Locate every `figure.diagram[data-slide-diagram]`, take a screenshot at
 *      2x scale, save to `public/slides-assets/<asignatura>/<unit>/<id>.png`.
 *   5. Cache by hash(MDX-file) — skip units whose MDX is unchanged since last
 *      run (manifest at `tmp/slides-assets-manifest.json`).
 *
 * Usage:
 *   node scripts/capture-diagrams.mjs                  # all asignaturas
 *   node scripts/capture-diagrams.mjs edmn-2bach       # only one
 */

import { createHash } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { platform } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { parse as parseYaml } from 'yaml';

function findChromeExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = platform() === 'win32'
    ? [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      ]
    : platform() === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
  for (const c of candidates) { if (c && existsSync(c)) return c; }
  return null;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ALL = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];
const filter = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = filter.length ? ALL.filter((s) => filter.includes(s)) : ALL;

mkdirSync(resolve(root, 'tmp'), { recursive: true });
const manifestPath = resolve(root, 'tmp/slides-assets-manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

function hashFile(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);
}

function parseFm(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseYaml(m[1]) ?? {} : {};
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css',
  '.js': 'application/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

const distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) {
  console.error(`✖ ${distDir} does not exist. Run \`npm run build\` first.`);
  process.exit(1);
}

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = join(distDir, urlPath);
  if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end('forbidden'); return; }
  try {
    if (statSync(filePath).isDirectory()) {
      // try /<dir>/index.html
      const idx = join(filePath, 'index.html');
      if (existsSync(idx)) {
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        createReadStream(idx).pipe(res); return;
      }
    } else {
      const mime = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      createReadStream(filePath).pipe(res); return;
    }
  } catch {}
  res.writeHead(404); res.end('not found');
});

await new Promise((r) => server.listen(4322, '127.0.0.1', r));
console.log('→ Static server ready on :4322 (serving dist/client).');

let totalCaptured = 0;
let totalSkipped = 0;

try {
  const chromePath = findChromeExecutable();
  if (!chromePath) {
    console.error('✖ Could not find Chrome. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH.');
    process.exit(1);
  }
  console.log(`→ Using Chrome: ${chromePath}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 2 },
    executablePath: chromePath,
  });

  for (const slug of targets) {
    const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
    if (!existsSync(dir)) { console.warn(`  · skip ${slug} (no libro)`); continue; }
    const mdxs = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();

    for (const file of mdxs) {
      const fmPath = resolve(dir, file);
      const src = readFileSync(fmPath, 'utf8');
      const fm = parseFm(src);
      if (fm.estado !== 'publicado') continue;
      const unitSlug = file.replace(/\.mdx$/, '');
      const hash = hashFile(fmPath);
      const cacheKey = `${slug}/${unitSlug}`;
      if (manifest[cacheKey] === hash) {
        console.log(`  · ${cacheKey} cached, skip.`);
        totalSkipped++;
        continue;
      }

      const url = `http://localhost:4322/${slug}/libro/${unitSlug}/`;
      const page = await browser.newPage();
      console.log(`→ ${url}`);
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      } catch (err) {
        console.warn(`  ! could not load ${url}: ${err.message}`);
        await page.close();
        continue;
      }
      const figures = await page.$$('figure.diagram[data-slide-diagram]');
      console.log(`  found ${figures.length} diagrams`);

      const outDir = resolve(root, `public/slides-assets/${slug}/${unitSlug}`);
      mkdirSync(outDir, { recursive: true });

      for (let i = 0; i < figures.length; i++) {
        const fig = figures[i];
        const id = await fig.evaluate((el) => el.getAttribute('data-slide-diagram') || '');
        const filename = id ? `${id}.png` : `diagram-${String(i + 1).padStart(2, '0')}.png`;
        const outPath = join(outDir, filename);
        try {
          await fig.screenshot({ path: outPath, omitBackground: false });
          console.log(`  ✓ ${filename}`);
          totalCaptured++;
        } catch (err) {
          console.warn(`  ! failed to screenshot ${filename}: ${err.message}`);
        }
      }
      manifest[cacheKey] = hash;
      await page.close();
    }
  }

  await browser.close();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Captured ${totalCaptured} diagram PNG(s); skipped ${totalSkipped} cached unit(s).`);
} finally {
  server.close();
}
