#!/usr/bin/env node
/**
 * Build the downloadable "Cuaderno de actividades" PDF of each subject from
 * the static build. Sibling of build-book-pdf.mjs: same HTTP-server + Chrome
 * spawning pattern, but targets /<slug>/actividades/imprimir/ and writes
 * <slug>-cuaderno.pdf.
 *
 * Usage:
 *   node scripts/build-workbook-pdf.mjs                # all subjects, copy to public/downloads/
 *   node scripts/build-workbook-pdf.mjs eco-1bach      # only that subject
 *   node scripts/build-workbook-pdf.mjs --in-dist      # only write to dist/downloads/
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const allAsignaturas = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso'];

const args = new Set(process.argv.slice(2));
const inDistOnly = args.has('--in-dist');
const slugFilters = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const asignaturas = slugFilters.length > 0
  ? allAsignaturas.filter((s) => slugFilters.includes(s))
  : allAsignaturas;
if (asignaturas.length === 0) {
  console.error(`✖ Ningún slug válido. Opciones: ${allAsignaturas.join(', ')}`);
  process.exit(1);
}

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
    server.listen(port, '0.0.0.0', () => resolveSrv(server));
    server.on('error', rejectSrv);
  });
}

const distDir = resolve(root, 'dist');
if (!existsSync(distDir)) {
  console.error('✖ No existe dist/. Corre "npm run build" antes.');
  process.exit(1);
}

const PORT = 4330;
console.log(`\nIniciando servidor estático en http://localhost:${PORT}`);
const server = await startStaticServer(distDir, PORT);

{
  const probeUrl = `http://localhost:${PORT}/${asignaturas[0]}/actividades/imprimir/`;
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
  const url = `http://localhost:${PORT}/${slug}/actividades/imprimir/`;
  const outDist = resolve(distDownloads, `${slug}-cuaderno.pdf`);
  const outPublic = resolve(publicDownloads, `${slug}-cuaderno.pdf`);

  console.log(`\n— Generando cuaderno para ${slug}`);
  console.log(`  URL    : ${url}`);
  console.log(`  Output : ${outDist}`);

  const exitCode = await new Promise((resolveExit) => {
    const child = spawn(
      'npx',
      ['--no-install', 'pagedjs-cli', url, '-o', outDist, '-t', '120000', '--browserArgs', '--no-sandbox'],
      { cwd: root, stdio: 'inherit', shell: true, env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' } }
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
  console.log(`✓ ${slug}-cuaderno.pdf listo`);
}

server.close();

if (failures > 0) {
  console.error(`\n${failures} fallo(s). Revisa la salida anterior.`);
  process.exit(1);
}
console.log('\nCuaderno(s) generado(s) con éxito.');
