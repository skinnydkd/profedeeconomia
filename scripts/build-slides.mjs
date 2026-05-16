#!/usr/bin/env node
/**
 * Build PDF + HTML decks for every unit, using Marp CLI on the
 * skeleton markdown produced by `scripts/extract-slides.mjs`.
 *
 * Workflow:
 *   1. Re-run extract-slides.mjs so tmp/slides/<slug>/*.md is fresh.
 *   2. For each .md, invoke marp-cli twice:
 *        a) --pdf → public/slides/<slug>/<unit>.pdf  (downloadable)
 *        b) --html → public/slides/<slug>/<unit>.html (web preview)
 *   3. The custom theme lives at marp-themes/profedeeconomia.css.
 *
 * Like build-book-pdf.mjs, we honor system Chrome via PUPPETEER_EXECUTABLE_PATH
 * because Marp uses puppeteer under the hood for PDF rendering.
 *
 * Usage:
 *   npm run build:slides
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ASIGNATURAS = ['edmn-2bach', 'eco-1bach', 'eco-4eso'];

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
  for (const c of candidates) {
    if (c && existsSync(c)) return c;
  }
  return null;
}

const chromePath = findChromeExecutable();
if (chromePath) {
  process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;
  console.log(`Usando Chrome del sistema: ${chromePath}`);
}

// Step 1: regenerate skeletons.
console.log('\n→ Generando esqueletos de deck desde los MDX…');
await runScript(resolve(__dirname, 'extract-slides.mjs'));

// Step 2: marp-cli per .md
const theme = resolve(root, 'marp-themes/profedeeconomia.css');

let failures = 0;
let totalDecks = 0;

for (const slug of ASIGNATURAS) {
  const inputDir = resolve(root, `tmp/slides/${slug}`);
  if (!existsSync(inputDir)) {
    console.error(`✖ No existe ${inputDir}`);
    continue;
  }
  const outDir = resolve(root, `public/slides/${slug}`);
  mkdirSync(outDir, { recursive: true });

  const mdFiles = readdirSync(inputDir).filter((f) => f.endsWith('.md')).sort();

  for (const file of mdFiles) {
    const inputPath = join(inputDir, file);
    const unitSlug = basename(file, '.md');
    console.log(`\n— ${slug}/${unitSlug}`);

    for (const ext of ['pdf', 'html']) {
      const outPath = join(outDir, `${unitSlug}.${ext}`);
      const args = [
        '--no-install',
        '@marp-team/marp-cli',
        inputPath,
        `--${ext}`,
        '-o', outPath,
        '--theme', theme,
        '--allow-local-files',
      ];
      const code = await runNpx(args);
      if (code !== 0) {
        console.error(`  ✖ marp-cli falló para ${unitSlug}.${ext}`);
        failures++;
      } else {
        console.log(`  ✓ ${unitSlug}.${ext}`);
      }
    }
    totalDecks++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} fallo(s).`);
  process.exit(1);
}

console.log(`\n✓ Generados ${totalDecks * 2} archivos (${totalDecks} PDFs + ${totalDecks} HTMLs).`);

// ────────────────────────────────────────────────────────────

function runScript(scriptPath) {
  return new Promise((resolveDone) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`✖ ${scriptPath} salió con código ${code}`);
        process.exit(code);
      }
      resolveDone();
    });
  });
}

function runNpx(args) {
  return new Promise((resolveCode) => {
    const child = spawn('npx', args, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' },
    });
    child.on('close', (code) => resolveCode(code));
    child.on('error', (err) => {
      console.error(`✖ Error lanzando npx: ${err.message}`);
      resolveCode(1);
    });
  });
}
