#!/usr/bin/env node
/**
 * Print the native Astro slide decks to PDF and assert no slide overflows.
 *
 * Pipeline (assumes `npm run build` has run):
 *   1. Serve dist/client on :4322.
 *   2. For each published unit of the target asignatura(s), open the web deck
 *      route /<asig>/diapositivas/<unit>/, emulate print media (slides become
 *      the canonical 1280x720), and check every .slide: if its content is taller
 *      or wider than the box, record an OVERFLOW failure.
 *   3. Save the PDF to public/slides/<asig>/<unit>.pdf.
 *   4. Exit non-zero if any overflow was found (the deck is not shippable).
 *
 * Usage:
 *   node scripts/build-deck-pdf.mjs                       # all asignaturas
 *   node scripts/build-deck-pdf.mjs edmn-2bach            # one asignatura
 *   node scripts/build-deck-pdf.mjs edmn-2bach 07-funcion-productiva   # one unit
 */
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { platform } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { parse as parseYaml } from 'yaml';

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
const ALL = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const asigFilter = args[0] && ALL.includes(args[0]) ? [args[0]] : ALL;
const unitFilter = args[1] || null;

function parseFm(src) {
  const m = src.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  return m ? parseYaml(m[1]) ?? {} : {};
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};
const distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) { console.error(`✖ ${distDir} missing. Run \`npm run build\` first.`); process.exit(1); }

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
await new Promise((r) => server.listen(4322, '127.0.0.1', r));
console.log('→ Static server ready on :4322 (serving dist/client).');

const chromePath = findChromeExecutable();
if (!chromePath) { console.error('✖ Could not find Chrome. Set PUPPETEER_EXECUTABLE_PATH.'); process.exit(1); }
const browser = await puppeteer.launch({ headless: 'new', executablePath: chromePath, defaultViewport: { width: 1440, height: 900 } });

let totalPdf = 0;
const overflows = [];

for (const slug of asigFilter) {
  const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
  if (!existsSync(dir)) continue;
  let units = readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    .filter((f) => parseFm(readFileSync(resolve(dir, f), 'utf8')).estado === 'publicado')
    .map((f) => basename(f, '.mdx'));
  if (unitFilter) units = units.filter((u) => u === unitFilter);

  const outDir = resolve(root, `public/slides/${slug}`);
  mkdirSync(outDir, { recursive: true });

  for (const unit of units) {
    const url = `http://localhost:4322/${slug}/diapositivas/${unit}/`;
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.emulateMediaType('print');
      await page.evaluateHandle('document.fonts.ready');

      const bad = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('.slide').forEach((el, i) => {
          if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
            out.push({ i: i + 1, sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth });
          }
        });
        return out;
      });
      if (bad.length) {
        for (const b of bad) overflows.push(`${slug}/${unit} slide ${b.i}: ${b.sw}x${b.sh} > ${b.cw}x${b.ch}`);
        console.log(`  ! ${slug}/${unit}: ${bad.length} slide(s) overflow`);
      }

      await page.pdf({ path: join(outDir, `${unit}.pdf`), width: '1280px', height: '720px', printBackground: true });
      console.log(`  ✓ ${slug}/${unit}.pdf`);
      totalPdf++;
    } catch (err) {
      console.error(`  ✖ ${slug}/${unit}: ${err.message}`);
      overflows.push(`${slug}/${unit}: ERROR ${err.message}`);
    }
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`\nDone. ${totalPdf} PDF(s) written.`);
if (overflows.length) {
  console.error(`\n✖ ${overflows.length} overflow/error issue(s):`);
  for (const o of overflows) console.error('   - ' + o);
  process.exit(1);
}
console.log('✓ No overflow. All decks shippable.');
