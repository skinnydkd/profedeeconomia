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

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { parse as parseYaml } from 'yaml';

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

async function waitForPreview(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Astro preview never started at ${url}`);
}

console.log('→ Starting astro preview on :4322…');
const preview = spawn('npx', ['astro', 'preview', '--port', '4322'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'], shell: true,
});
preview.stdout.on('data', (d) => process.stdout.write(`[preview] ${d}`));
preview.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));

let totalCaptured = 0;
let totalSkipped = 0;

try {
  await waitForPreview('http://localhost:4322/');
  console.log('→ Astro preview ready.');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 2 },
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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

      // The page slug in the URL drops the numeric prefix (e.g. "06-x" → "x").
      const urlSlug = unitSlug.replace(/^\d+-/, '');
      const url = `http://localhost:4322/${slug}/libro/${urlSlug}/`;
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
  preview.kill('SIGTERM');
}
