import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path/posix';

/**
 * The Supabase-backed games (Jocs Econòmics ranking, online Business Game) were
 * retired on 2026-11-24: production never had a Supabase project. Nothing under
 * src/ may call those APIs or read their env vars again.
 */

function sourceFiles(dir = 'src'): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path === 'src/content') return []; // book content is huge and holds no code
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(astro|[cm]?[jt]sx?)$/.test(name) && !/\.test\.[cm]?[jt]s$/.test(name) ? [path] : [];
  });
}

describe('Supabase games retired', () => {
  it('has no API routes for them', () => {
    expect(existsSync('src/pages/api/jocs')).toBe(false);
    expect(existsSync('src/pages/api/business-game')).toBe(false);
  });

  it('has no non-test source that touches them', () => {
    const banned = /\/api\/jocs\/|\/api\/business-game|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|@supabase\//;
    const offenders = sourceFiles().filter((f) => banned.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
