// scripts/build-cajut-manifest.mjs
// Genera el manifest públic + el banc privat de preguntes per al joc Cajút.
//
// Llegeix MDX de `src/content/asignaturas/*/tests/*.md`, filtra els publicats,
// agrupa per idioma+asignatura+unitat, i emet:
//  - public/games-multi/cajut/manifest.json     (metadata visible, es)
//  - public/games-multi/cajut/manifest.ca.json  (metadata visible, ca)
//  - party/cajut/questions.generated.json       (banc complet, server-only)
//
// Each language has its own bank, keyed `${lang}:${asignatura}/${unidad}`; a
// unit without a Valencian test falls back to the Spanish one. `bankVersion`
// is a hash of the whole bank, stamped on the manifests (deployed with Vercel)
// and on the server bank (deployed with PartyKit) so the host can tell when
// the two deployments are out of step.

import { createHash } from 'node:crypto';
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

/** Languages with a bank of their own. The first one is the fallback. */
export const LANGS = ['es', 'ca'];

/** Where the manifest of `lang` goes: `manifest.json` for es, `manifest.ca.json` for ca. */
export function manifestPath(esPath, lang) {
  return lang === LANGS[0] ? esPath : esPath.replace(/\.json$/, `.${lang}.json`);
}

async function parseTest(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { data } = matter(raw);
  if (data.estado !== 'publicado') return null;
  if (!data.asignatura || !data.unidad_relacionada || !Array.isArray(data.preguntas)) {
    console.warn(`[cajut-manifest] saltant test mal format: ${file}`);
    return null;
  }
  // `lang` in the frontmatter (the content schema defaults it to es); the
  // `.ca.md` name is only a fallback for a translation that forgot it.
  const lang = LANGS.includes(data.lang) ? data.lang : file.endsWith('.ca.md') ? 'ca' : 'es';
  return {
    file: path.basename(file),
    lang,
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
  // readdir order depends on the file system; the output must not.
  return out.sort();
}

/** Short hash of the whole bank, independent of key order and of generatedAt. */
function hashBank(preguntas) {
  const canonical = JSON.stringify(Object.keys(preguntas).sort().map((k) => [k, preguntas[k]]));
  return createHash('sha256').update(canonical).digest('hex').slice(0, 12);
}

export async function buildManifest({ sourceDir = DEFAULT_SOURCE, meta = ASIGNATURAS_META } = {}) {
  const files = await listTestMdFiles(path.join(sourceDir, 'asignaturas'));
  const parsed = (await Promise.all(files.map(parseTest))).filter(Boolean);

  // lang → asignatura → unidad → test
  const byLang = new Map(LANGS.map((l) => [l, new Map()]));
  for (const t of parsed) {
    const byAsig = byLang.get(t.lang);
    if (!byAsig.has(t.asignatura)) byAsig.set(t.asignatura, new Map());
    const units = byAsig.get(t.asignatura);
    const prev = units.get(t.unidad);
    if (prev) {
      console.warn(`[cajut-manifest] ${t.lang} ${t.asignatura} U${t.unidad}: ${prev.file} i ${t.file}; es queda ${prev.file}`);
      continue;
    }
    units.set(t.unidad, t);
  }

  // Each language's bank: its own tests over the fallback language's.
  const resolved = new Map(
    LANGS.map((lang) => {
      const out = new Map();
      for (const source of lang === LANGS[0] ? [lang] : [LANGS[0], lang]) {
        for (const [asig, units] of byLang.get(source)) {
          if (!out.has(asig)) out.set(asig, new Map());
          for (const [numero, t] of units) out.get(asig).set(numero, t);
        }
      }
      return [lang, out];
    }),
  );

  const preguntas = {};
  for (const [lang, byAsig] of resolved) {
    for (const [slug, units] of byAsig) {
      for (const [numero, t] of units) {
        preguntas[`${lang}:${slug}/${numero}`] = t.preguntas;
      }
    }
  }

  const generatedAt = new Date().toISOString();
  const bankVersion = hashBank(preguntas);

  const manifests = Object.fromEntries(
    [...resolved].map(([lang, byAsig]) => [
      lang,
      {
        generatedAt,
        version: 2,
        lang,
        bankVersion,
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
      },
    ]),
  );

  const questions = { generatedAt, version: 2, bankVersion, preguntas };

  return { manifests, questions };
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

  const { manifests, questions } = await buildManifest({ sourceDir });
  for (const [lang, manifest] of Object.entries(manifests)) {
    await writeJson(manifestPath(outManifest, lang), manifest);
  }
  await writeJson(outQuestions, questions);

  for (const [lang, manifest] of Object.entries(manifests)) {
    const keys = Object.keys(questions.preguntas).filter((k) => k.startsWith(`${lang}:`));
    const totalQ = keys.reduce((n, k) => n + questions.preguntas[k].length, 0);
    console.log(
      `[cajut-manifest] ${lang}: ${manifest.asignaturas.length} asignaturas, ` +
        `${keys.length} unitats, ${totalQ} preguntes`,
    );
    console.log(`  manifest:  ${path.relative(ROOT, manifestPath(outManifest, lang))}`);
  }
  console.log(`  questions: ${path.relative(ROOT, outQuestions)} (bankVersion ${questions.bankVersion})`);
}

// pathToFileURL és cross-platform; el guard anterior (`file:///` + ruta)
// afegia una barra de més en Linux i main() no s'executava en Vercel.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
