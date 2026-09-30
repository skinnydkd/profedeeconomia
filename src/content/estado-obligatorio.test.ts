import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CODE-WEB-09: `estado` had a default, so a file that forgot it became a
 * silent `borrador`. Two finished GPE activities disappeared from the site in
 * both languages that way, while their translations were marked `publicado`.
 * Every file now says what it is, and the schema no longer guesses.
 */
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.mdx?$/.test(name) ? [path] : [];
  });
}

const frontmatter = (path: string) => /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, 'utf8'))?.[1] ?? '';

describe('estado', () => {
  it('has no default in any collection', () => {
    const config = readFileSync('src/content.config.ts', 'utf8');
    expect(config).toMatch(/estado: z\.enum\(ESTADOS\)/);
    expect(config).not.toMatch(/estado: z\.enum\([^)]*\)\.default\(/);
  });

  it('is declared by every content file', () => {
    const files = walk('src/content');
    expect(files.length).toBeGreaterThan(1000);
    expect(files.filter((f) => !/^estado:/m.test(frontmatter(f)))).toEqual([]);
  });
});
