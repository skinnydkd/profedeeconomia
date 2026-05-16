#!/usr/bin/env node
/**
 * Build the downloadable PDF of a book from the static build.
 *
 * Workflow:
 *   1. `npm run build` produces dist/<asignatura>/libro/imprimir/index.html
 *   2. This script:
 *      a) spawns a local static HTTP server over `dist/` so absolute
 *         asset paths (`/fonts/...`) resolve. paged.js fails on file://
 *         URLs because of those root-relative paths.
 *      b) launches pagedjs-cli against http://localhost:<port>/<slug>/libro/imprimir/
 *      c) writes the PDF to dist/downloads/ and copies it to public/downloads/
 *         so the next `npm run build` picks it up.
 *
 * Usage:
 *   npm run build:pdf            # generates and copies to public/downloads/
 *   node scripts/build-book-pdf.mjs --in-dist   # only writes to dist/downloads/
 */

import { spawnSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const asignaturas = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso'];   // extend as more books publish

const args = new Set(process.argv.slice(2));
const inDistOnly = args.has('--in-dist');

/**
 * Locate a working Chrome/Chromium executable.
 *
 * Strategy:
 *   1. Honor PUPPETEER_EXECUTABLE_PATH if already set.
 *   2. Look for the system Google Chrome (Windows / macOS / Linux).
 *   3. Fall back to puppeteer's bundled Chrome cache.
 */
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

/**
 * Tiny static file server over `dist/`. We avoid spawning `astro preview`
 * to keep this script self-contained and fast — paged.js only needs to
 * fetch HTML + CSS + woff2 files.
 */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function startStaticServer(distDir, port) {
  const server = createServer((req, res) => {
    try {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let filePath = join(distDir, url);
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
      if (!existsSync(filePath)) {
        console.log(`  [server] 404 ${url}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${url}`);
        return;
      }
      const ext = extname(filePath).toLowerCase();
      console.log(`  [server] 200 ${url}`);
      res.writeHead(200, {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(readFileSync(filePath));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500: ${err.message}`);
    }
  });
  return new Promise((resolveSrv, rejectSrv) => {
    server.listen(port, '0.0.0.0', () => resolveSrv(server));
    server.on('error', rejectSrv);
  });
}

const distDir = resolve(root, 'dist');
if (!existsSync(distDir)) {
  console.error('✖ No existe dist/. Corre "npm run build" antes.');
  process.exit(1);
}

const PORT = 4329;
console.log(`\nIniciando servidor estático en http://localhost:${PORT}`);
const server = await startStaticServer(distDir, PORT);

// Quick sanity check: confirm the server actually serves the URL we'll
// ask Chrome to load. Surfaces routing/path errors before we spin up Chrome.
{
  const probeUrl = `http://localhost:${PORT}/${asignaturas[0]}/libro/imprimir/`;
  try {
    const probe = await fetch(probeUrl);
    if (!probe.ok) {
      console.error(`✖ El servidor no sirve ${probeUrl} (status ${probe.status}).`);
      server.close();
      process.exit(1);
    }
    console.log(`Servidor verificado: ${probeUrl} → ${probe.status}`);
  } catch (e) {
    console.error(`✖ No se puede conectar a ${probeUrl}: ${e.message}`);
    server.close();
    process.exit(1);
  }
}

const publicDownloads = resolve(root, 'public/downloads');
const distDownloads = resolve(root, 'dist/downloads');
mkdirSync(publicDownloads, { recursive: true });
mkdirSync(distDownloads, { recursive: true });

let failures = 0;

for (const slug of asignaturas) {
  const url = `http://localhost:${PORT}/${slug}/libro/imprimir/`;
  const outDist = resolve(distDownloads, `${slug}-libro.pdf`);
  const outPublic = resolve(publicDownloads, `${slug}-libro.pdf`);

  console.log(`\n— Generando PDF para ${slug}`);
  console.log(`  URL    : ${url}`);
  console.log(`  Output : ${outDist}`);

  // IMPORTANT: must use `spawn` (not `spawnSync`) so the local HTTP
  // server's event loop can serve Chrome's requests in parallel.
  // spawnSync blocks the Node main thread until the child exits,
  // which prevents the http server from responding.
  const exitCode = await new Promise((resolveExit) => {
    const child = spawn(
      'npx',
      [
        '--no-install',
        'pagedjs-cli',
        url,
        '-o', outDist,
        '-t', '120000',
        '--browserArgs', '--no-sandbox',
      ],
      {
        cwd: root,
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' },
      }
    );
    child.on('close', (code) => resolveExit(code));
    child.on('error', (err) => {
      console.error(`✖ Error lanzando pagedjs-cli: ${err.message}`);
      resolveExit(1);
    });
  });

  if (exitCode !== 0) {
    console.error(`✖ pagedjs-cli falló para ${slug} (código ${exitCode})`);
    failures++;
    continue;
  }

  if (!inDistOnly) {
    copyFileSync(outDist, outPublic);
    console.log(`  Copiado a ${outPublic}`);
  }

  console.log(`✓ ${slug}-libro.pdf listo`);
}

server.close();

if (failures > 0) {
  console.error(`\n${failures} fallo(s). Revisa la salida anterior.`);
  process.exit(1);
}

console.log('\nPDF(s) generados con éxito.');
