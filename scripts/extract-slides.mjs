#!/usr/bin/env node
/**
 * Auto-extract slide skeleton from each MDX unit of a libro.
 *
 * Per the project's single-source-of-truth principle (see CLAUDE.md),
 * slide content is derived from the same MDX that produces the book.
 * This script generates a Marp-compatible markdown deck per unit, with:
 *
 *   1. Title slide        — title + lema
 *   2. Objetivos slide    — frontmatter `objetivos`
 *   3. Conceptos clave    — frontmatter `conceptos_clave`
 *   4. Section slides     — one per `## H2` of the body (heading + a
 *                            short excerpt of the first prose paragraph)
 *   5. Closing slide      — pointer to the book and the CTA for project
 *
 * The output is "skeleton quality" by design: it is meant as a starting
 * point that the teacher refines for class, not a finished deck. Run
 * `npm run build:slides` to also export PDF + HTML via marp-cli.
 *
 * Output: tmp/slides/<asignatura>/<unit-slug>.md
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Configurable — extend the array as new books are published.
const ASIGNATURAS = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];

/**
 * Parse the YAML frontmatter at the top of an MDX file.
 * Returns { data, body }. Handles both LF and CRLF line endings.
 */
function splitFrontmatter(src) {
  // Normalize line endings to LF for parsing — keeps the regex simple
  // and avoids subtle bugs on Windows where files come as CRLF.
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { data: {}, body: norm };
  return { data: parseYaml(m[1]) ?? {}, body: m[2] };
}

/**
 * Strip lines that won't render in Marp:
 *   - `import ... from '...'` lines
 *   - JSX components (Callout, Curiosity, RealExample, SolvedExercise,
 *     Bibliography). Their content is intentionally dropped here — the
 *     auto-extracted deck is a skeleton; teachers add bonus slides
 *     manually if they want curiosities or solved exercises rendered.
 */
function stripMdxNoise(body) {
  let out = body;
  // remove import statements
  out = out.replace(/^import\s+.+$\n?/gm, '');
  // remove JSX blocks of the form <Tag ...>...</Tag>, even multiline
  // We only target the components we know are in our MDX.
  const tags = ['Callout', 'Curiosity', 'RealExample', 'SolvedExercise', 'Bibliography'];
  for (const tag of tags) {
    const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'g');
    out = out.replace(re, '');
  }
  // collapse 3+ blank lines into 2
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

/**
 * Pick the first sentence(s) of a paragraph, capped at ~ N chars,
 * preserving inline markdown (em, strong, code).
 */
function trimToExcerpt(paragraph, maxChars = 320) {
  const text = paragraph.trim();
  if (text.length <= maxChars) return text;
  // Cut at a sentence boundary if possible
  const slice = text.slice(0, maxChars);
  const lastDot = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('! '),
  );
  return lastDot > 80 ? slice.slice(0, lastDot + 1) : slice + '…';
}

/**
 * Split the cleaned body into H2 sections.
 * Returns [{heading, contentMarkdown}, ...].
 */
function splitH2Sections(body) {
  const lines = body.split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) sections.push(current);
      current = { heading: m[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections.map((s) => ({
    heading: s.heading,
    content: s.lines.join('\n').trim(),
  }));
}

/**
 * Take the first prose paragraph (non-empty, not a code block, not a list).
 */
function firstParagraph(content) {
  const blocks = content.split(/\n\s*\n/);
  for (const block of blocks) {
    const t = block.trim();
    if (!t) continue;
    if (t.startsWith('```')) continue;
    if (t.startsWith('- ') || t.startsWith('* ') || /^\d+\.\s/.test(t)) continue;
    if (t.startsWith('|')) continue; // table
    if (t.startsWith('>')) continue; // blockquote
    return t.replace(/\n/g, ' ');
  }
  return '';
}

/**
 * Build the full Marp markdown deck for one unit.
 */
function buildMarp(unit, sections) {
  const head = [
    '---',
    'marp: true',
    'theme: profedeeconomia',
    'size: 16:9',
    'paginate: true',
    `title: "Unidad ${unit.unidad} · ${unit.title}"`,
    '---',
    '',
  ].join('\n');

  const slides = [];

  // 1. Title slide
  slides.push(
    [
      '<!-- _class: title -->',
      '<!-- _paginate: false -->',
      '',
      `<div class="kicker">Unidad ${unit.unidad}${unit.bloque ? ' · ' + unit.bloque : ''}</div>`,
      '',
      `# ${unit.title}`,
      '',
      unit.lema ? unit.lema.replace(/\n/g, ' ').trim() : '',
    ].join('\n')
  );

  // 2. Objetivos
  if (Array.isArray(unit.objetivos) && unit.objetivos.length) {
    slides.push(
      [
        '## Objetivos de la unidad',
        '',
        ...unit.objetivos.map((o) => `- ${o}`),
      ].join('\n')
    );
  }

  // 3. Conceptos clave
  if (Array.isArray(unit.conceptos_clave) && unit.conceptos_clave.length) {
    slides.push(
      [
        '## Conceptos clave',
        '',
        ...unit.conceptos_clave.map((c) => `- **${c}**`),
      ].join('\n')
    );
  }

  // 4. Section slides
  for (const s of sections) {
    const excerpt = trimToExcerpt(firstParagraph(s.content));
    slides.push(
      [
        `## ${s.heading}`,
        '',
        excerpt || '*(añadir aquí el contenido de la diapositiva)*',
      ].join('\n')
    );
  }

  // 5. Closing slide
  slides.push(
    [
      '<!-- _class: close -->',
      '<!-- _paginate: false -->',
      '',
      '# *Hasta aquí la teoría.*',
      '',
      '_Continúa en el libro_  ·  profedeeconomia.es',
    ].join('\n')
  );

  return head + slides.join('\n\n---\n\n') + '\n';
}

let totalDecks = 0;

for (const slug of ASIGNATURAS) {
  const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
  let mdxFiles;
  try {
    mdxFiles = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();
  } catch (err) {
    console.error(`No existe ${dir}`);
    continue;
  }

  const outDir = resolve(root, `tmp/slides/${slug}`);
  mkdirSync(outDir, { recursive: true });

  for (const file of mdxFiles) {
    const src = readFileSync(resolve(dir, file), 'utf8');
    const { data, body } = splitFrontmatter(src);

    if (data.estado !== 'publicado') {
      console.log(`  · ${file}: estado=${data.estado}, omitido`);
      continue;
    }

    const cleaned = stripMdxNoise(body);
    const sections = splitH2Sections(cleaned);

    if (sections.length === 0) {
      console.warn(`  · ${file}: ningún H2 detectado, generando solo title+objetivos+conceptos`);
    }

    const md = buildMarp(data, sections);
    const slug2 = basename(file, '.mdx');
    const outPath = join(outDir, `${slug2}.md`);
    writeFileSync(outPath, md, 'utf8');
    totalDecks++;
    console.log(`  ✓ ${slug2}.md (${sections.length} secciones, ${md.length} bytes)`);
  }
}

console.log(`\nGenerados ${totalDecks} esqueletos de deck.`);
