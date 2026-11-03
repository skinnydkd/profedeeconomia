import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard for slide image credits that contradict the book.
 *
 * The same photo is credited twice: once in the book (`<Figure credit=…>`)
 * and once in the unit deck (`credit:` of a `figure` slide). In September
 * 2026 ten deck credits said «dominio público» for photos the book credits
 * as CC BY or CC BY-SA, which breaks the licence on the piece that circulates
 * most. The wording may differ (the deck is shorter), but the licence family
 * may not.
 */
const ROOT = join('src', 'content', 'asignaturas');

type Familia = 'by-sa' | 'by' | 'pd' | 'otra';

function familia(credito: string): Familia {
  const t = credito.toLowerCase();
  if (/cc[ -]?by[ -]sa/.test(t)) return 'by-sa';
  if (/cc[ -]?by\b/.test(t)) return 'by';
  if (/cc0|dominio público|domini públic|public domain|pd-/.test(t)) return 'pd';
  return 'otra';
}

function unidades(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return unidades(path);
    return path.includes(`${join('libro', '')}`) && name.endsWith('.mdx') ? [path] : [];
  });
}

interface Discrepancia {
  archivo: string;
  imagen: string;
  libro: string;
  deck: string;
}

function discrepancias(path: string): Discrepancia[] {
  const text = readFileSync(path, 'utf8');
  const imports = new Map<string, string>();
  for (const m of text.matchAll(/import\s+(\w+)\s+from\s+'@assets\/libro\/([^']+)'/g)) imports.set(m[1], m[2]);
  const libro = new Map<string, string>();
  for (const m of text.matchAll(/<Figure\b([\s\S]*?)\/>/g)) {
    const src = /src=\{(\w+)\}/.exec(m[1]);
    const credit = /credit="([^"]*)"/.exec(m[1]);
    const imagen = src ? imports.get(src[1]) : undefined;
    if (imagen && credit && !libro.has(imagen)) libro.set(imagen, credit[1]);
  }
  const deck = /```deck\n([\s\S]*?)\n```/.exec(text)?.[1] ?? '';
  const out: Discrepancia[] = [];
  for (const m of deck.matchAll(/- tipo: figure\n((?: {2}[^\n]*\n?)*)/g)) {
    const src = /^ {2}src: (.+)$/m.exec(m[1]);
    const credit = /^ {2}credit: (.+)$/m.exec(m[1]);
    if (!src || !credit) continue;
    const imagen = src[1].trim().replace(/^["']|["']$/g, '');
    const deckCredit = credit[1].trim().replace(/^["']|["']$/g, '');
    const libroCredit = libro.get(imagen);
    if (libroCredit && familia(libroCredit) !== familia(deckCredit)) {
      out.push({ archivo: path, imagen, libro: libroCredit, deck: deckCredit });
    }
  }
  return out;
}

const ARCHIVOS = unidades(ROOT);

describe('deck image credits keep the licence the book gives', () => {
  it('reads the book units', () => {
    expect(ARCHIVOS.length).toBeGreaterThan(100);
  });

  it('classifies licences', () => {
    expect(familia('Foto: X, CC BY-SA 4.0 vía Wikimedia Commons')).toBe('by-sa');
    expect(familia('Foto: X, CC BY 2.0 vía Wikimedia Commons')).toBe('by');
    expect(familia('Foto de dominio público vía Wikimedia Commons')).toBe('pd');
    expect(familia('Foto: X, CC0 1.0 vía Wikimedia Commons')).toBe('pd');
  });

  it('uses the same licence family in the deck as in the book', () => {
    expect(ARCHIVOS.flatMap(discrepancias)).toEqual([]);
  });
});
