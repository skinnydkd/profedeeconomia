import { describe, it, expect } from 'vitest';
import { COPY } from './CocheVsAlternativa';

/**
 * The model keeps the alternative's cost fixed while the car's grows with the
 * mileage, so the car wins below the break-even kilometres and the
 * alternative above them (coche.test.ts). The message used to say the
 * opposite: «A partir de unos X km el coche propio empezaría a salir más
 * barato» (CODE-INT-06).
 */
describe('CocheVsAlternativa break-even message', () => {
  it('says the car is the cheaper option below the break-even kilometres (es)', () => {
    const frase = `${COPY.es.kmEquilibrioPre} 3.387 ${COPY.es.kmEquilibrioKmAnio}${COPY.es.kmEquilibrioPost}`;
    expect(frase).toMatch(/^Por debajo de unos 3\.387 km al año sale más barato el coche propio; por encima, esta alternativa/);
  });

  it('says the same in Valencian', () => {
    const frase = `${COPY.ca.kmEquilibrioPre} 3.387 ${COPY.ca.kmEquilibrioKmAnio}${COPY.ca.kmEquilibrioPost}`;
    expect(frase).toMatch(/^Per davall d'uns 3\.387 km a l'any ix més barat el cotxe propi; per damunt, esta alternativa/);
  });
});
