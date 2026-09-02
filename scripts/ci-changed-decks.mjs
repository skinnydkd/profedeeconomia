#!/usr/bin/env node
/**
 * Decide which asignaturas need their decks re-checked for overflow.
 *
 * `scripts/build-deck-pdf.mjs` renders every unit of a subject through headless
 * Chrome, which costs a couple of minutes per subject. Running all nine on every
 * pull request would put ~20 minutes on each one, so CI narrows it down:
 *
 *  - a change under `src/content/asignaturas/<slug>/libro/` only affects that
 *    subject's decks, so only that subject is checked;
 *  - a change to the slide engine, the slide component or the slide stylesheet
 *    can move any slide in any deck, so every subject is checked.
 *
 * Prints one slug per line, so the caller can loop over it. Prints nothing when
 * no deck can have moved.
 *
 * Usage:
 *   node scripts/ci-changed-decks.mjs <changed-file> [...]   # explicit list
 *   git diff --name-only A...B | node scripts/ci-changed-decks.mjs
 *   node scripts/ci-changed-decks.mjs --all                  # every subject
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_ROOT = 'src/content/asignaturas';

/**
 * Paths whose change can move a slide in any deck. Kept deliberately wide: a
 * missed subject ships an overflowing slide, a spare one costs two minutes.
 */
export const ENGINE_PREFIXES = [
  'src/lib/slides/',
  'src/components/slides/',
  'src/styles/slides.css',
  'scripts/build-deck-pdf.mjs',
];

/** Every subject that has a book, and therefore decks, in the content tree. */
export function allSubjects(root = CONTENT_ROOT) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(root, d.name, 'libro')))
    .map((d) => d.name)
    .sort();
}

/** Subject slug of a unit file, or null when the path is not a unit. */
export function subjectOf(path) {
  const m = /^src\/content\/asignaturas\/([^/]+)\/libro\/[^/]+\.mdx?$/.exec(path);
  return m ? m[1] : null;
}

/** The subjects whose decks must be re-checked for `changed`. */
export function decksToCheck(changed, subjects = allSubjects()) {
  const paths = changed.map((p) => p.trim()).filter(Boolean);
  if (paths.some((p) => ENGINE_PREFIXES.some((prefix) => p.startsWith(prefix)))) {
    return subjects;
  }
  const hit = new Set();
  for (const p of paths) {
    const slug = subjectOf(p);
    // A slug the content tree does not know about is a deleted or renamed
    // subject; there is nothing left to render for it.
    if (slug && subjects.includes(slug)) hit.add(slug);
  }
  return [...hit].sort();
}

async function readStdin() {
  if (process.stdin.isTTY) return [];
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').split('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.includes('--all')) {
    console.log(allSubjects().join('\n'));
  } else {
    const changed = args.length ? args : await readStdin();
    const out = decksToCheck(changed);
    if (out.length) console.log(out.join('\n'));
  }
}
