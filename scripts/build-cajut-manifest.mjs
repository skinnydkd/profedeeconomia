// scripts/build-cajut-manifest.mjs
// Genera el manifest públic + el banc privat de preguntes per al joc Cajút.
//
// Llegeix MDX de `src/content/asignaturas/*/tests/*.md`, filtra els publicats,
// agrupa per asignatura+unitat, i emet:
//  - public/games-multi/cajut/manifest.json  (metadata visible)
//  - party/cajut/questions.generated.json    (banc complet, server-only)

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { ASIGNATURAS_META } from './cajut-asignaturas-meta.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SOURCE = path.join(ROOT, 'src', 'content');
const DEFAULT_OUT_MANIFEST = path.join(ROOT, 'public', 'games-multi', 'cajut', 'manifest.json');
const DEFAULT_OUT_QUESTIONS = path.join(ROOT, 'party', 'cajut', 'questions.generated.json');

async function parseTest(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { data } = matter(raw);
  if (data.estado !== 'publicado') return null;
  if (!data.asignatura || !data.unidad_relacionada || !Array.isArray(data.preguntas)) {
    console.warn(`[cajut-manifest] saltant test mal format: ${file}`);
    return null;
  }
  return {
    asignatura: String(data.asignatura),
    unidad: Number(data.unidad_relacionada),
    title: String(data.title ?? ''),
    // Cajút es un concurso multijugador de opción múltiple: solo toma las
    // preguntas de ese tipo (las nuevas —V/F, numérico, relacionar— se ignoran).
    preguntas: data.preguntas
      .filter((p) => (p.tipo ?? 'opcion-multiple') === 'opcion-multiple' && Array.isArray(p.opciones))
      .map((p) => ({
        enunciado: String(p.enunciado),
        opciones: p.opciones.map(String),
        correcta: Number(p.correcta),
        ...(p.explicacion ? { explicacion: String(p.explicacion) } : {}),
      })),
  };
}

/** Llista fitxers .md sota totes les carpetes `tests/` dins de `asignaturas/`. */
async function listTestMdFiles(asignaturasDir) {
  const out = [];
  let asigEntries;
  try {
    asigEntries = await fs.readdir(asignaturasDir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const asig of asigEntries) {
    if (!asig.isDirectory()) continue;
    const testsDir = path.join(asignaturasDir, asig.name, 'tests');
    let testEntries;
    try {
      testEntries = await fs.readdir(testsDir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of testEntries) {
      if (ent.isFile() && ent.name.endsWith('.md')) {
        out.push(path.join(testsDir, ent.name));
      }
    }
  }
  return out;
}

export async function buildManifest({ sourceDir = DEFAULT_SOURCE, meta = ASIGNATURAS_META } = {}) {
  const files = await listTestMdFiles(path.join(sourceDir, 'asignaturas'));
  const parsed = (await Promise.all(files.map(parseTest))).filter(Boolean);

  const byAsig = new Map();
  for (const t of parsed) {
    if (!byAsig.has(t.asignatura)) byAsig.set(t.asignatura, new Map());
    byAsig.get(t.asignatura).set(t.unidad, t);
  }

  const generatedAt = new Date().toISOString();

  const manifest = {
    generatedAt,
    version: 1,
    asignaturas: meta
      .filter((m) => byAsig.has(m.slug))
      .map((m) => {
        const units = [...byAsig.get(m.slug).values()].sort((a, b) => a.unidad - b.unidad);
        return {
          slug: m.slug,
          name: m.name,
          shortName: m.shortName,
          color: m.color,
          unidades: units.map((u) => ({
            numero: u.unidad,
            title: u.title,
            preguntasCount: u.preguntas.length,
          })),
        };
      }),
  };

  const preguntas = {};
  for (const [slug, units] of byAsig) {
    for (const [numero, t] of units) {
      preguntas[`${slug}/${numero}`] = t.preguntas;
    }
  }
  const questions = { generatedAt, version: 1, preguntas };

  return { manifest, questions };
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
  const outQuestions = getArg('--out-questions') ?? DEFAULT_OUT_QUESTIONS;

  const { manifest, questions } = await buildManifest({ sourceDir });
  await writeJson(outManifest, manifest);
  await writeJson(outQuestions, questions);

  const totalQ = Object.values(questions.preguntas).reduce((n, arr) => n + arr.length, 0);
  console.log(
    `[cajut-manifest] ${manifest.asignaturas.length} asignaturas, ` +
      `${Object.keys(questions.preguntas).length} unitats, ${totalQ} preguntes`,
  );
  console.log(`  manifest:  ${path.relative(ROOT, outManifest)}`);
  console.log(`  questions: ${path.relative(ROOT, outQuestions)}`);
}

// pathToFileURL és cross-platform; el guard anterior (`file:///` + ruta)
// afegia una barra de més en Linux i main() no s'executava en Vercel.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
