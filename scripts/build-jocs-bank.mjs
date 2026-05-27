// scripts/build-jocs-bank.mjs
// Genera el manifest públic (counts) + el banc privat (preguntes completes).
//
// Llegeix MDX de `src/content/jocs-economics/preguntas/**/*.md`,
// filtra `estado === 'publicado'`, i emet:
//   - public/jocs-economics/manifest.json  (counts agregats; segur public)
//   - src/server-only/jocs-bank.json       (banc complet; server-only)

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SOURCE = path.join(ROOT, 'src', 'content', 'jocs-economics');
const DEFAULT_OUT_MANIFEST = path.join(ROOT, 'public', 'jocs-economics', 'manifest.json');
const DEFAULT_OUT_BANK = path.join(ROOT, 'src', 'server-only', 'jocs-bank.json');

async function listMdFiles(dir) {
  const out = [];
  async function walk(d) {
    let entries;
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) await walk(full);
      else if (ent.isFile() && full.endsWith('.md')) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function parseQuestion(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { data } = matter(raw);
  if (data.estado !== 'publicado') return null;
  if (!data.id || !data.categoria || typeof data.dificultat !== 'number' || !Array.isArray(data.opciones)) {
    console.warn(`[jocs-bank] saltant pregunta mal formada: ${file}`);
    return null;
  }
  return {
    id: String(data.id),
    categoria: String(data.categoria),
    dificultat: Number(data.dificultat),
    opciones: data.opciones.map(String),
    correcta: Number(data.correcta),
    ...(data.explicacion ? { explicacion: String(data.explicacion) } : {}),
  };
}

function bandOfDifficulty(d) {
  if (d <= 3) return 'basic_1_3';
  if (d <= 6) return 'mig_4_6';
  return 'alt_7_10';
}

export async function buildBank({ sourceDir = DEFAULT_SOURCE } = {}) {
  const files = await listMdFiles(path.join(sourceDir, 'preguntas'));
  const parsed = (await Promise.all(files.map(parseQuestion))).filter(Boolean);

  const generatedAt = new Date().toISOString();

  const byCategoria = { economia: 0, finances: 0, empresa: 0 };
  const byDificultatBand = { basic_1_3: 0, mig_4_6: 0, alt_7_10: 0 };
  for (const q of parsed) {
    if (byCategoria[q.categoria] !== undefined) byCategoria[q.categoria]++;
    byDificultatBand[bandOfDifficulty(q.dificultat)]++;
  }

  const manifest = {
    generatedAt,
    version: 1,
    totals: {
      preguntas: parsed.length,
      byCategoria,
      byDificultatBand,
    },
  };

  // Ordena per id per a idempotència
  const sorted = parsed.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const bank = {
    generatedAt,
    version: 1,
    preguntas: sorted,
  };

  return { manifest, bank };
}

async function writeJson(file, obj) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const sourceDir = getArg('--source') ?? DEFAULT_SOURCE;
  const outManifest = getArg('--out-manifest') ?? DEFAULT_OUT_MANIFEST;
  const outBank = getArg('--out-bank') ?? DEFAULT_OUT_BANK;

  const { manifest, bank } = await buildBank({ sourceDir });
  await writeJson(outManifest, manifest);
  await writeJson(outBank, bank);

  console.log(
    `[jocs-bank] ${manifest.totals.preguntas} preguntes publicades · ` +
      `eco ${manifest.totals.byCategoria.economia} · ` +
      `fin ${manifest.totals.byCategoria.finances} · ` +
      `emp ${manifest.totals.byCategoria.empresa}`,
  );
  console.log(`  manifest: ${path.relative(ROOT, outManifest)}`);
  console.log(`  bank:     ${path.relative(ROOT, outBank)}`);
}

// Executar només si invocat directament (mateix patró que build-cajut-manifest.mjs)
const _argv1Url = process.argv[1] ? `file:///${path.resolve(process.argv[1]).replace(/\\/g, '/')}` : '';
if (import.meta.url === _argv1Url) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
