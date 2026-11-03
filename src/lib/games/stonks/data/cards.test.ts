// src/lib/games/stonks/data/cards.test.ts
import { describe, it, expect } from 'vitest';
import { CARDS, cardFor, CLASS_CARD_ID } from './cards';
import { ASSETS, STOCK_IDS, assetMeta } from './assets';

describe('deep cards', () => {
  it('has one per base asset, one shared company card, and a profile plus a reveal per company', () => {
    for (const a of ASSETS.filter((x) => x.group !== 'empresa')) {
      expect(cardFor(a.id), `card ${a.id}`).toBeDefined();
    }
    expect(cardFor(CLASS_CARD_ID)).toBeDefined();
    for (const id of STOCK_IDS) {
      expect(cardFor(id), `profile card ${id}`).toBeDefined();
      expect(cardFor(`${id}_reveal`), `reveal card ${id}`).toBeDefined();
    }
    expect(CARDS).toHaveLength(9 + 1 + STOCK_IDS.length * 2);
  });

  it('has no duplicate ids', () => {
    const ids = CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('carries real prose, not stubs', () => {
    for (const c of CARDS) {
      expect(c.title, c.id).toBeTruthy();
      expect(c.body.length, `${c.id} paragraph count`).toBeGreaterThanOrEqual(4);
      for (const p of c.body) {
        expect(p.length, `${c.id} paragraph too short: ${p}`).toBeGreaterThan(80);
        expect(p, c.id).not.toMatch(/\b(TODO|TBD|FIXME)\b|Lorem ipsum/);
      }
    }
  });

  /** The blind cards are the whole point of playing blind. */
  it('keeps company names out of everything shown during play', () => {
    // Title and body only: the id is internal and never reaches the screen,
    // and e_apple would obviously "contain" its own company name.
    const visible = (id: string) => {
      const c = cardFor(id)!;
      return `${c.title} ${c.body.join(' ')}`.toLowerCase();
    };
    for (const id of STOCK_IDS) {
      const name = assetMeta[id].realName!.toLowerCase();
      expect(visible(id), `blind card ${id} leaks "${name}"`).not.toContain(name);
    }
    for (const id of STOCK_IDS) {
      expect(visible(CLASS_CARD_ID)).not.toContain(assetMeta[id].realName!.toLowerCase());
    }
  });

  it('names the company in its reveal card', () => {
    for (const id of STOCK_IDS) {
      const reveal = JSON.stringify(cardFor(`${id}_reveal`)).toLowerCase();
      expect(reveal, `reveal ${id}`).toContain(assetMeta[id].realName!.toLowerCase());
    }
  });

  it('never promises a return or gives advice', () => {
    // Phrases, not bare words: "no estaba garantizado" is the opposite of a
    // promise, and a substring match would flag it.
    const promises = [
      /rentabilidad garantizada/i,
      /beneficio (?:seguro|garantizado)/i,
      /siempre sube/i,
      /no puede bajar/i,
      /deberías (?:comprar|vender|invertir)/i,
      /te aseguro/i,
      // No pattern for "inversión segura": the Banco Popular card uses the
      // phrase to demolish it ("el desmentido a la idea de que… son una
      // inversión segura"), and no regex tells a claim from its refutation.
    ];
    for (const c of CARDS) {
      const text = c.body.join(' ');
      for (const p of promises) expect(text, `${c.id} matches ${p}`).not.toMatch(p);
    }
  });

  /** Section five is the one no commercial leaflet writes. */
  it('tells every base asset what it is NOT for', () => {
    for (const a of ASSETS.filter((x) => x.group !== 'empresa')) {
      const last = cardFor(a.id)!.body.at(-1)!;
      expect(last, `${a.id} closing paragraph`).toMatch(/no sirve/i);
    }
  });
});
