#!/usr/bin/env node
/**
 * Build the downloadable «De cero a empresa» workbook PDF from the static
 * build. Sibling of build-proyecto-pdf.mjs: same HTTP-server + Chrome spawning
 * pattern, but a single output (no per-subject loop). Targets the flat route
 * /emprendimiento/proyecto/imprimir/ and writes emprendimiento-proyecto.pdf.
 *
 * Usage:
 *   node scripts/build-proyecto-transversal-pdf.mjs            # copy to public/downloads/
 *   node scripts/build-proyecto-transversal-pdf.mjs --in-dist  # only write to dist/downloads/
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const PRINT_PATH = 'emprendimiento/proyecto/imprimir';
const OUT_NAME = 'emprendimiento-proyecto.pdf';

const args = new Set(process.argv.slice(2));
const inDistOnly = args.has('--in-dist');

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
      if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end('forbidden'); return; }
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
      if (!existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${url}`);
        return;
      }
      const ext = extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(readFileSync(filePath));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500: ${err.message}`);
    }
  });
  return new Promise((resolveSrv, rejectSrv) => {
    server.listen(port, '127.0.0.1', () => resolveSrv(server));
    server.on('error', rejectSrv);
  });
}

let distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) distDir = resolve(root, 'dist');
if (!existsSync(distDir)) {
  console.error('✖ No existe dist/ ni dist/client/. Corre "npm run build" antes.');
  process.exit(1);
}

const PORT = 4334;
console.log(`\nIniciando servidor estático en http://localhost:${PORT}`);
const server = await startStaticServer(distDir, PORT);

const url = `http://localhost:${PORT}/${PRINT_PATH}/`;
{
  try {
    const probe = await fetch(url);
    if (!probe.ok) {
      console.error(`✖ El servidor no sirve ${url} (status ${probe.status}).`);
      server.close();
      process.exit(1);
    }
    console.log(`Servidor verificado: ${url} → ${probe.status}`);
  } catch (e) {
    console.error(`✖ No se puede conectar a ${url}: ${e.message}`);
    server.close();
    process.exit(1);
  }
}

const publicDownloads = resolve(root, 'public/downloads');
const distDownloads = resolve(root, 'dist/downloads');
mkdirSync(publicDownloads, { recursive: true });
mkdirSync(distDownloads, { recursive: true });

const outDist = resolve(distDownloads, OUT_NAME);
const outPublic = resolve(publicDownloads, OUT_NAME);

console.log(`\n— Generando «De cero a empresa»`);
console.log(`  URL    : ${url}`);
console.log(`  Output : ${outDist}`);

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const exitCode = await new Promise((resolveExit) => {
  const child = spawn(
    npxCmd,
    ['--no-install', 'pagedjs-cli', url, '-o', outDist, '-t', '120000', '--browserArgs', '--no-sandbox'],
    { cwd: root, stdio: 'inherit', env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' } }
  );
  child.on('close', (code) => resolveExit(code));
  child.on('error', (err) => {
    console.error(`✖ Error lanzando pagedjs-cli: ${err.message}`);
    resolveExit(1);
  });
});

server.close();

if (exitCode !== 0) {
  console.error(`✖ pagedjs-cli falló (código ${exitCode})`);
  process.exit(1);
}

if (!inDistOnly) {
  copyFileSync(outDist, outPublic);
  console.log(`  Copiado a ${outPublic}`);
}
console.log(`\n✓ ${OUT_NAME} listo.`);
