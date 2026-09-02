import { describe, it, expect } from 'vitest';
import { fronteraY, clasificar, costeOportunidadArco, crecimiento, type FPP } from './fpp';

const recta: FPP = { maxX: 100, maxY: 200, forma: 'recta' };
const concava: FPP = { maxX: 100, maxY: 200, forma: 'concava' };

describe('fronteraY', () => {
  it('hits both axes on either shape', () => {
    for (const f of [recta, concava]) {
      expect(fronteraY(f, 0)).toBeCloseTo(200, 10);
      expect(fronteraY(f, 100)).toBeCloseTo(0, 10);
    }
  });
  it('is linear on the straight frontier', () => {
    expect(fronteraY(recta, 25)).toBeCloseTo(150, 10);
    expect(fronteraY(recta, 50)).toBeCloseTo(100, 10);
  });
  it('bulges outward on the concave frontier', () => {
    // The quarter ellipse always sits above the chord between the two axes.
    expect(fronteraY(concava, 50)).toBeGreaterThan(fronteraY(recta, 50));
    expect(fronteraY(concava, 60)).toBeCloseTo(200 * Math.sqrt(1 - 0.36), 10);
  });
  it('returns NaN outside the domain', () => {
    expect(fronteraY(recta, -1)).toBeNaN();
    expect(fronteraY(recta, 101)).toBeNaN();
    expect(fronteraY({ ...recta, maxX: 0 }, 0)).toBeNaN();
  });
});

describe('clasificar', () => {
  it('reads a point on the frontier as efficient', () => {
    expect(clasificar(recta, 50, 100)).toBe('eficiente');
  });
  it('reads a point below as inefficient and one above as unattainable', () => {
    expect(clasificar(recta, 50, 40)).toBe('ineficiente');
    expect(clasificar(recta, 50, 160)).toBe('inalcanzable');
  });
  it('tolerates rounding on a point meant to be on the curve', () => {
    // 128,06… rounded to two decimals is still the frontier, not a point below it.
    const y = Number(fronteraY(concava, 76.7).toFixed(2));
    expect(clasificar(concava, 76.7, y)).toBe('eficiente');
  });
  it('treats a negative or out-of-range coordinate as unattainable', () => {
    expect(clasificar(recta, 120, 0)).toBe('inalcanzable');
    expect(clasificar(recta, 10, -5)).toBe('inalcanzable');
  });
});

describe('costeOportunidadArco', () => {
  it('is constant along the straight frontier', () => {
    const a = costeOportunidadArco(recta, 0, 20);
    const b = costeOportunidadArco(recta, 60, 80);
    expect(a.coste).toBeCloseTo(2, 10);
    expect(b.coste).toBeCloseTo(2, 10);
  });
  it('grows as X grows on the concave frontier', () => {
    const primero = costeOportunidadArco(concava, 0, 20).coste;
    const medio = costeOportunidadArco(concava, 40, 60).coste;
    const ultimo = costeOportunidadArco(concava, 80, 100).coste;
    expect(primero).toBeLessThan(medio);
    expect(medio).toBeLessThan(ultimo);
  });
  it('reports the two deltas that make up the ratio', () => {
    const { deltaX, deltaY, coste } = costeOportunidadArco(recta, 10, 40);
    expect(deltaX).toBeCloseTo(30, 10);
    expect(deltaY).toBeCloseTo(60, 10);
    expect(coste).toBeCloseTo(2, 10);
  });
  it('returns NaN when there is no movement', () => {
    expect(costeOportunidadArco(recta, 30, 30).coste).toBeNaN();
  });
});

describe('crecimiento', () => {
  it('pushes the whole frontier out when both goods grow', () => {
    const g = crecimiento(recta, 10, 10);
    expect(g.maxX).toBeCloseTo(110, 10);
    expect(g.maxY).toBeCloseTo(220, 10);
    expect(fronteraY(g, 50)).toBeGreaterThan(fronteraY(recta, 50));
  });
  it('tilts it when only one good grows', () => {
    const g = crecimiento(recta, 50, 0);
    expect(g.maxY).toBeCloseTo(200, 10);
    expect(g.maxX).toBeCloseTo(150, 10);
    // Same Y intercept, so the point on the Y axis has not moved.
    expect(fronteraY(g, 0)).toBeCloseTo(fronteraY(recta, 0), 10);
  });
});
