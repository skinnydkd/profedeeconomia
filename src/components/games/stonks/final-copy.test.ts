import { describe, it, expect } from 'vitest';
import { COPY } from './FinalScreen';

// The verdict is three COPY fields glued together, so a wording change in one
// of them can quietly produce a sentence nobody ever reads aloud. It happened:
// "Has perdido contra Mercado" — no article, and a different name for the
// benchmark than the scoreboard two lines below was using.

const verdict = (c: (typeof COPY)['es'], won: boolean) =>
  `${c.verdictPre} ${won ? c.won : c.lost} ${c.verdictPost}`;

describe('the final verdict', () => {
  it('reads as a sentence either way, in both locales', () => {
    expect(verdict(COPY.es, true)).toBe('Has ganado a «El Mercat»');
    expect(verdict(COPY.es, false)).toBe('Has perdido contra «El Mercat»');
    expect(verdict(COPY.ca, true)).toBe('Has guanyat a «El Mercat»');
    expect(verdict(COPY.ca, false)).toBe('Has perdut contra «El Mercat»');
  });

  it('names the benchmark the same way the scoreboard and the legend do', () => {
    for (const c of [COPY.es, COPY.ca]) {
      expect(c.verdictPost).toBe(c.ai);
      expect(c.legendAi).toBe(c.ai);
    }
  });
});
