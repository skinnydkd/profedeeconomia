// scripts/extract-webpde-concurs.mjs
// Run-once: descarrega el concurs.html del webpde antic i genera fitxers MD
// per a cada pregunta a src/content/jocs-economics/preguntas/.
//
// Genera amb estado: 'revision' (no 'publicado') perquè Pau revisi i calibri
// dificultat 1-10 manualment.
//
// Ús: node scripts/extract-webpde-concurs.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'jocs-economics', 'preguntas');
const RAW_DIR = path.join(__dirname, '__webpde-raw__');

const SOURCE_URL = 'https://raw.githubusercontent.com/skinnydkd/webpde/main/concurs.html';

// Dificultat string → numeric 1-10
const DIFICULTAT_MAP = { facil: 2.0, mitjana: 5.0, dificil: 8.5 };

function categoryForId(id) {
  // IDs del webpde: ec=economia, ef=finances, em=empresa, ev=veritat/economia, eg=gràfics/economia
  const prefix = id.slice(0, 2);
  if (prefix === 'ef') return 'finances';
  if (prefix === 'em') return 'empresa';
  return 'economia'; // ec, ev, eg, etc.
}

async function fetchSource() {
  console.log(`[bootstrap] fetching ${SOURCE_URL}...`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.text();
}

/**
 * Extrau el mapa de traduccions pageTranslations de l'HTML.
 * Retorna Map<key, { val, es }>.
 */
function extractTranslations(html) {
  const translations = new Map();
  // Patró: 'concursapp.xxx': { val: "...", es: "...", ... }
  const re = /'(concursapp\.[^']+)':\s*\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const key = m[1];
    const body = m[2];
    const valMatch = body.match(/\bval:\s*"((?:[^"\\]|\\.)*)"/);
    const esMatch = body.match(/\bes:\s*"((?:[^"\\]|\\.)*)"/);
    translations.set(key, {
      val: valMatch ? valMatch[1] : '',
      es: esMatch ? esMatch[1] : '',
    });
  }
  return translations;
}

/**
 * Extrau les preguntes del bloc bancPreguntes = useMemo(() => ({...}), [idioma]);
 * Retorna array de { id, tipus, dificultat, preguntaKey, opcionsKeys, correcta }.
 */
function extractQuestions(html) {
  const start = html.indexOf('bancPreguntes = useMemo');
  if (start < 0) return null;

  // Troba el tancament del useMemo
  const block = html.slice(start, start + 200000);
  const endMarker = '}, [idioma]);';
  const endIdx = block.indexOf(endMarker);
  const bancBlock = endIdx > 0 ? block.slice(0, endIdx + endMarker.length) : block;

  // Extrau objectes de pregunta amb regex
  // Format: { id: 'xxx', tipus: 'yyy', dificultat: 'zzz', pregunta: t('key'), opcions: [...], correcta: N/true/false }
  const questionRe = /\{\s*id:\s*'([^']+)',\s*tipus:\s*'([^']+)',\s*dificultat:\s*'([^']+)',\s*pregunta:\s*t\('([^']+)'\)([\s\S]*?)\}/g;
  const questions = [];
  let m;
  while ((m = questionRe.exec(bancBlock)) !== null) {
    const [, id, tipus, dificultatStr, preguntaKey, rest] = m;

    // Extrau opcions si n'hi ha
    const opcionsMatch = rest.match(/opcions:\s*\[([^\]]*)\]/);
    const opcionsKeys = [];
    if (opcionsMatch) {
      // Pot tenir t('key') o strings literals
      const opcionsContent = opcionsMatch[1];
      const tRe = /t\('([^']+)'\)/g;
      const litRe = /"([^"]+)"/g;
      let om;
      while ((om = tRe.exec(opcionsContent)) !== null) opcionsKeys.push({ type: 'key', value: om[1] });
      if (opcionsKeys.length === 0) {
        while ((om = litRe.exec(opcionsContent)) !== null) opcionsKeys.push({ type: 'literal', value: om[1] });
      }
    }

    // Extrau correcta
    const correctaMatch = rest.match(/correcta:\s*(true|false|\d+)/);
    const correcta = correctaMatch
      ? correctaMatch[1] === 'true' ? 0 : correctaMatch[1] === 'false' ? 1 : parseInt(correctaMatch[1], 10)
      : 0;

    questions.push({ id, tipus, dificultatStr, preguntaKey, opcionsKeys, correcta });
  }

  return questions.length > 0 ? questions : null;
}

async function main() {
  const html = await fetchSource();

  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.writeFile(path.join(RAW_DIR, 'concurs.html'), html, 'utf8');
  console.log(`[bootstrap] raw HTML saved to ${path.relative(ROOT, path.join(RAW_DIR, 'concurs.html'))}`);

  const translations = extractTranslations(html);
  console.log(`[bootstrap] ${translations.size} translation keys extracted`);

  const questions = extractQuestions(html);
  if (!questions || questions.length === 0) {
    console.error(`[bootstrap] could not auto-parse questions. Inspect ${RAW_DIR}/concurs.html manually.`);
    console.error(`[bootstrap] Pau ha de fer extracció manual.`);
    process.exit(1);
  }

  console.log(`[bootstrap] ${questions.length} preguntes extretes del bancPreguntes`);

  function resolve(ref) {
    if (ref.type === 'key') {
      const t = translations.get(ref.value);
      // Prefereix castellà (es) per al fitxer — és el contingut publicat al MVP
      return t ? (t.es || t.val) : ref.value;
    }
    return ref.value;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const counters = { economia: 0, finances: 0, empresa: 0 };

  // Filtra preguntes 'multiple' i 'truefalse' — els únics compatibles amb el format del bank
  // (numeric i identify requereixen UI especial, es deixa per a fases posteriors)
  const compatible = questions.filter((q) => q.tipus === 'multiple' || q.tipus === 'truefalse');
  const skipped = questions.length - compatible.length;
  if (skipped > 0) {
    console.log(`[bootstrap] ${skipped} preguntes omeses (tipus 'numeric'/'identify', requereixen UI especial)`);
  }

  for (const q of compatible) {
    const cat = categoryForId(q.id);
    counters[cat]++;
    const num = String(counters[cat]).padStart(4, '0');
    const dificultat = DIFICULTAT_MAP[q.dificultatStr] ?? 5.0;

    // Construïx opcions
    let opciones;
    if (q.tipus === 'truefalse') {
      opciones = ['Verdadero', 'Falso'];
    } else {
      opciones = q.opcionsKeys.map(resolve);
    }

    // Resol text de pregunta
    const preguntaRef = { type: 'key', value: q.preguntaKey };
    const preguntaText = resolve(preguntaRef);

    const filename = `${q.id}.md`;
    const frontmatter = [
      '---',
      `id: ${q.id}`,
      `categoria: ${cat}`,
      `dificultat: ${dificultat}`,
      'opciones:',
      ...opciones.map((opt) => `  - ${JSON.stringify(String(opt))}`),
      `correcta: ${q.correcta}`,
      `estado: revision`,
      `font: "webpde-concurs.html"`,
      `tipus_original: ${q.tipus}`,
      '---',
      '',
      preguntaText,
      '',
    ].join('\n');

    await fs.writeFile(path.join(OUT_DIR, filename), frontmatter, 'utf8');
  }

  const total = counters.economia + counters.finances + counters.empresa;
  console.log(`[bootstrap] wrote ${total} preguntes (eco ${counters.economia} · fin ${counters.finances} · emp ${counters.empresa})`);
  console.log(`[bootstrap] Pau ha de revisar i calibrar dificultat + canviar estado a 'publicado'.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
