import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Guard for the components an MDX body uses.
 *
 * A unit that writes `<RecursoDestacado …>` without importing it renders the
 * tag as literal markup rather than the component, and nothing in the content
 * schema notices: the file is valid MDX and the collection loads fine. This
 * caught 26 units at once when the calculator cards were added, so it is worth
 * keeping.
 *
 * Only the body is scanned. Frontmatter is YAML and any angle brackets in it
 * are prose, not JSX.
 */
const ROOT = 'src/content';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.mdx') ? [p] : [];
  });
}

/** Everything after the frontmatter block, or the whole file if there is none. */
function body(text: string): string {
  const m = /^---\n[\s\S]*?\n---\n/.exec(text);
  return m ? text.slice(m[0].length) : text;
}

/** Names bound by `import X from …`, `import { A, B } from …` or both. */
function imported(text: string): Set<string> {
  const names = new Set<string>();
  for (const m of text.matchAll(/^import\s+([\s\S]+?)\s+from\s+['"][^'"]+['"];?$/gm)) {
    for (const part of m[1].split(/,(?![^{]*})/)) {
      const named = /\{([\s\S]*)\}/.exec(part);
      if (named) {
        for (const n of named[1].split(',')) {
          const alias = n.trim().split(/\s+as\s+/).pop();
          if (alias) names.add(alias.trim());
        }
      } else {
        const def = part.trim().replace(/^\*\s+as\s+/, '');
        if (def) names.add(def);
      }
    }
  }
  return names;
}

/** Names the MDX runtime provides, so a body may use them without importing. */
const BUILTIN = new Set(['Fragment']);

/** Capitalised JSX tags used in the body — i.e. components, not HTML elements. */
function used(text: string): Set<string> {
  const names = new Set<string>();
  for (const m of text.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) {
    if (!BUILTIN.has(m[1])) names.add(m[1]);
  }
  return names;
}

interface Offender {
  rel: string;
  missing: string[];
}

const offenders: Offender[] = walk(ROOT).flatMap((path) => {
  const text = readFileSync(path, 'utf8');
  const b = body(text);
  const have = imported(b);
  const missing = [...used(b)].filter((n) => !have.has(n)).sort();
  return missing.length ? [{ rel: relative(ROOT, path).split(sep).join('/'), missing }] : [];
});

describe('MDX component imports', () => {
  it('finds MDX bodies to check', () => {
    expect(walk(ROOT).length).toBeGreaterThan(0);
  });

  it('imports every component it renders', () => {
    expect(
      offenders.map((o) => `${o.rel}: ${o.missing.join(', ')}`),
      'an unimported component renders as literal markup, and the build stays green',
    ).toEqual([]);
  });
});
