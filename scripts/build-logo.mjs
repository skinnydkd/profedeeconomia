#!/usr/bin/env node
/**
 * Generates public/logo-512.png — a raster version of the "p." monogram
 * favicon, at 512×512. Google's logo/Organization rich-result guidance wants a
 * raster logo (PNG/JPG), not an SVG favicon, so the JSON-LD `logo` can point
 * here (see src/lib/seo.ts). Reuses the project's Chrome/Puppeteer setup (same
 * as build:og), no new dependency. Re-run if the brand mark changes:
 *   npm run build:logo
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import puppeteer from 'puppeteer';

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
const out = resolve(__dirname, '..', 'public', 'logo-512.png');

// Same brand mark as public/favicon.svg, scaled to 512×512.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  svg{display:block}
</style></head><body>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="512" height="512">
    <rect width="32" height="32" rx="7" fill="#FBF6EC"/>
    <text x="6.5" y="24" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="700" font-size="23" fill="#C44E2C">p</text>
    <circle cx="22.5" cy="22" r="2.6" fill="#D4A24C"/>
  </svg>
</body></html>`;

const exe = findChromeExecutable();
if (!exe) {
  console.error('No Chrome executable found. Set PUPPETEER_EXECUTABLE_PATH.');
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
const el = await page.$('svg');
await el.screenshot({ path: out, type: 'png', omitBackground: true });
await browser.close();
console.log(`Wrote ${out}`);
