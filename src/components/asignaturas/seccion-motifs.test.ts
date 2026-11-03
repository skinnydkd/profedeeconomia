import { describe, expect, it } from 'vitest';
import { SECCION_SLUGS, seccionMarkup } from './seccion-motifs';

describe('seccionMarkup', () => {
  it('draws every section in the subject tones', () => {
    for (const s of SECCION_SLUGS) {
      const svg = seccionMarkup(s, 'eco1');
      expect(svg).toContain('fill="#1F6E6E"');
      expect(svg).not.toContain('undefined');
    }
  });

  it('swaps the mustard highlight for terracotta on the mustard subject', () => {
    expect(seccionMarkup('retos', 'eco1')).toContain('#D4A24C');
    expect(seccionMarkup('retos', 'eco4')).toContain('#C44E2C');
  });
});
