#!/usr/bin/env node
/**
 * Build one printable PDF sheet per published activity from the static build,
 * using the same HTTP-server + pagedjs pattern as build-debates-pdf. Writes
 * actividad-{asignatura}-{slug}.pdf (and .ca.pdf when the Valencian sibling
 * exists) into public/downloads, where the activity page links it.
 *
 * Which subjects get rendered:
 *   node scripts/build-actividades-pdf.mjs eco-4eso fopp-4eso   # these subjects
 *   node scripts/build-actividades-pdf.mjs --all                 # every subject
 *   node scripts/build-actividades-pdf.mjs                       # the subjects that
 *                                                                #   already have sheets
 *                                                                #   in public/downloads
 * The last form is what `build:all` runs: it refreshes the subjects that opted
 * in without adding hundreds of PDFs for the ones that did not. Opt a subject
 * in by rendering it once explicitly.
 *
 *   --in-dist   only write to dist/downloads/ (do not copy to public/)
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, statSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { createServer } from 'node:http';
import { findActividadPrintJobs, subjectsWithActividadPdfs } from './lib/actividad-pdf-jobs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const PORT = 4339;

const argv = process.argv.slice(2);
const inDistOnly = argv.includes('--in-dist');
const all = argv.includes('--all');
const requested = argv.filter((a) => !a.startsWith('--'));

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

const chromePath = findChromeExecutable();
if (chromePath) { process.env.PUPPETEER_EXECUTABLE_PATH = chromePath; console.log(`Usando Chrome del sistema: ${chromePath}`); }

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

function startStaticServer(distDir, port) {
  const server = createServer((req, res) => {
    try {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let filePath = join(distDir, url);
      if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end('forbidden'); return; }
      if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
      if (!existsSync(filePath)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end(`404 Not Found: ${url}`); return; }
      const ext = extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(readFileSync(filePath));
    } catch (err) { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end(`500: ${err.message}`); }
  });
  return new Promise((resolveSrv, rejectSrv) => { server.listen(port, '127.0.0.1', () => resolveSrv(server)); server.on('error', rejectSrv); });
}

let distDir = resolve(root, 'dist/client');
if (!existsSync(distDir)) distDir = resolve(root, 'dist');
if (!existsSync(distDir)) { console.error('✖ No existe dist/ ni dist/client/. Corre "npm run build" antes.'); process.exit(1); }

const contentRoot = resolve(root, 'src/content/asignaturas');
const knownSubjects = readdirSync(contentRoot).filter((n) => statSync(join(contentRoot, n)).isDirectory());
const publicDownloads = resolve(root, 'public/downloads');
const subjects = all ? [] : requested.length ? requested : subjectsWithActividadPdfs(publicDownloads, knownSubjects);
if (!all && subjects.length === 0) {
  console.log('Ninguna asignatura tiene aún fichas de actividad en public/downloads. Indica una (p. ej. eco-4eso) o usa --all.');
  process.exit(0);
}

const esJobs = findActividadPrintJobs(distDir, subjects);
if (esJobs.length === 0) { console.error('✖ No se encontraron rutas de impresión de actividades en dist/ para: ' + (subjects.join(', ') || 'todas')); process.exit(1); }

// Valencian edition only when the .ca sibling exists; otherwise /ca renders the
// Spanish fallback and a redundant .ca.pdf would be wrong.
const jobs = esJobs.flatMap((job) => {
  const out = [job];
  const dir = resolve(contentRoot, job.asignatura, 'actividades');
  const hasCa = ['md', 'mdx'].some((ext) => existsSync(resolve(dir, `${job.slug}.ca.${ext}`)));
  if (hasCa) out.push({ ...job, route: `ca/${job.route}`, out: job.out.replace(/\.pdf$/, '.ca.pdf') });
  return out;
});
console.log(`\nActividades encontradas: ${esJobs.length} (es) + ${jobs.length - esJobs.length} (ca) = ${jobs.length}`);

console.log(`Iniciando servidor estático en http://localhost:${PORT}`);
const server = await startStaticServer(distDir, PORT);

const distDownloads = resolve(root, 'dist/downloads');
mkdirSync(publicDownloads, { recursive: true });
mkdirSync(distDownloads, { recursive: true });

const pagedjsCli = resolve(root, 'node_modules/pagedjs-cli/src/cli.js');
let done = 0;
for (const job of jobs) {
  const url = `http://localhost:${PORT}/${job.route}/`;
  try {
    const probe = await fetch(url);
    if (!probe.ok) { console.error(`✖ El servidor no sirve ${url} (status ${probe.status}).`); server.close(); process.exit(1); }
  } catch (e) { console.error(`✖ No se puede conectar a ${url}: ${e.message}`); server.close(); process.exit(1); }

  const outDist = resolve(distDownloads, job.out);
  const outPublic = resolve(publicDownloads, job.out);
  console.log(`\n— [${++done}/${jobs.length}] ${job.out}`);
  // node <pagedjs-cli> directly: Node 24 on Windows can't spawn .cmd files (EINVAL).
  const exitCode = await new Promise((resolveExit) => {
    const child = spawn(process.execPath,
      [pagedjsCli, url, '-o', outDist, '-t', '120000', '--browserArgs', '--no-sandbox'],
      { cwd: root, stdio: 'inherit', env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: chromePath ?? '' } });
    child.on('close', (code) => resolveExit(code));
    child.on('error', (err) => { console.error(`✖ Error lanzando pagedjs-cli: ${err.message}`); resolveExit(1); });
  });
  if (exitCode !== 0) { server.close(); console.error(`✖ pagedjs-cli falló (código ${exitCode})`); process.exit(1); }
  if (!inDistOnly) copyFileSync(outDist, outPublic);
}

server.close();
console.log(`\n✓ ${jobs.length} fichas de actividad listas${inDistOnly ? ' en dist/downloads' : ' en public/downloads'}.`);
