import { describe, it, expect } from 'vitest';
import { COPY as Autoevaluacion } from './Autoevaluacion';
import { COPY as PlanRefuerzo } from './PlanRefuerzo';
import { COPY as RegistroAula } from './RegistroAula';
import { COPY as MedidasDUA } from './MedidasDUA';

/**
 * The templates that name a student keep what is typed in localStorage, so
 * each one says so, asks for initials or a code instead of a full name, and
 * points at its «Vaciar» button (PR #305). The self-assessment sheet still
 * asked for «Nombre y apellidos» without the notice (R5 A23).
 */
const PLANTILLAS = { Autoevaluacion, PlanRefuerzo, RegistroAula, MedidasDUA };

describe('student data notice in the templates', () => {
  for (const [nombre, copy] of Object.entries(PLANTILLAS)) {
    it(`${nombre} warns that the data stays in this browser, in both languages`, () => {
      expect(copy.es.intro).toContain('Los datos se guardan solo en este navegador');
      expect(copy.es.intro).toContain(`«${copy.es.vaciar}»`);
      expect(copy.ca.intro).toContain('Les dades es guarden només en este navegador');
      expect(copy.ca.intro).toContain(`«${copy.ca.vaciar}»`);
    });
  }

  it('asks for initials or a code, never for a full name', () => {
    const campos = Object.values(PLANTILLAS).flatMap((c) =>
      (['es', 'ca'] as const).flatMap((l) =>
        Object.entries(c[l]).filter(([k, v]) => /(nombre|alumno)Placeholder/.test(k) && typeof v === 'string').map(([, v]) => v as string),
      ),
    );
    expect(campos.length).toBeGreaterThanOrEqual(6);
    for (const v of campos) expect(v).toMatch(/^(Iniciales o código|Inicials o codi)$/);
  });
});
