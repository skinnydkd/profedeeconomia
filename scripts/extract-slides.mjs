#!/usr/bin/env node
/**
 * Auto-extract per-unit slide decks from each MDX unit. Re-written to use
 * an MDX AST (unified + remark-mdx) so every rich component renders its
 * own slide. Diagrams are looked up from `public/slides-assets/`, pre-
 * captured by scripts/capture-diagrams.mjs.
 *
 * Output: tmp/slides/<asignatura>/<unit-slug>.md
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDeckMarkdown } from './slide-parsers/index.mjs';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ALL = ['edmn-2bach', 'eco-1bach', 'eco-4eso', 'fopp-4eso', 'taller-eco-3eso', 'ipe1-fp', 'ipe2-fp', 'eeae-bach', 'gpe-bach'];
const filter = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = filter.length ? ALL.filter((s) => filter.includes(s)) : ALL;

function readFm(src) {
  const norm = src.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseYaml(m[1]) ?? {} : {};
}

let total = 0;
for (const slug of targets) {
  const dir = resolve(root, `src/content/asignaturas/${slug}/libro`);
  let mdxs;
  try { mdxs = readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort(); }
  catch (err) { console.error(`✖ ${dir} not found`); continue; }

  const outDir = resolve(root, `tmp/slides/${slug}`);
  mkdirSync(outDir, { recursive: true });

  for (const file of mdxs) {
    const src = readFileSync(resolve(dir, file), 'utf8');
    const fm = readFm(src);
    if (fm.estado !== 'publicado') { console.log(`  · ${file}: estado=${fm.estado}, omitido`); continue; }

    const unitSlug = basename(file, '.mdx');
    try {
      const md = buildDeckMarkdown(src, { asignatura: slug, unitSlug });
      writeFileSync(join(outDir, `${unitSlug}.md`), md, 'utf8');
      console.log(`  ✓ ${slug}/${unitSlug}.md (${md.length} bytes)`);
      total++;
    } catch (err) {
      console.error(`  ✖ ${slug}/${unitSlug}: ${err.message}`);
      console.error(err.stack);
    }
  }
}
console.log(`\nGenerados ${total} esqueletos de deck.`);
