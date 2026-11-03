import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * None of the calculator islands had a live region, so a screen reader heard
 * nothing when the result changed (CODE-INT-17). These islands announce their
 * main result through LiveSummary (role="status", debounced). Add an island
 * here when it gets one.
 */
const CON_RESUMEN = [
  'src/components/calculadoras/CalculadoraNominaESO.tsx',
  'src/components/calculadoras/IRPFDeclaracion.tsx',
  'src/components/calculadoras/VANTIRCalc.tsx',
  'src/components/calculadoras/PuntoMuertoCalc.tsx',
  'src/components/calculadoras/EquilibrioCalc.tsx',
  'src/components/calculadoras/RatiosCalc.tsx',
  'src/components/calculadoras/InteresCompuestoCalc.tsx',
  'src/components/calculadoras/ADASSimulator.tsx',
  'src/components/calculadoras/CocheVsAlternativa.tsx',
  'src/components/generadores/CalificacionesCalc.tsx',
];

describe('announced calculator results', () => {
  it.each(CON_RESUMEN)('%s renders a LiveSummary', (path) => {
    const src = readFileSync(path, 'utf8');
    expect(src).toContain("import LiveSummary from '../LiveSummary';");
    expect(src).toMatch(/<LiveSummary\s/);
  });

  it('the live region is polite, hidden only visually, and debounced', () => {
    const src = readFileSync('src/components/LiveSummary.tsx', 'utf8');
    expect(src).toContain('role="status"');
    expect(src).toContain('aria-live="polite"');
    expect(src).toContain('class="sr-only"');
    expect(src).toMatch(/setTimeout\(/);
  });
});
