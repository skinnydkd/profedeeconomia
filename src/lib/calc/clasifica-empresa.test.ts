import { describe, it, expect } from 'vitest';
import { clasificar, paraBajarDeTramo, UMBRALES, type Entrada } from './clasifica-empresa';

const base: Entrada = { empleados: 5, facturacion: 500_000, balance: 400_000 };

describe('clasificar', () => {
  it('places a small workshop in the micro bracket', () => {
    const r = clasificar(base);
    expect(r.valido).toBe(true);
    expect(r.tamano).toBe('micro');
    expect(r.esPyme).toBe(true);
  });

  it('moves up a bracket when headcount crosses the ceiling', () => {
    expect(clasificar({ ...base, empleados: 10 }).tamano).toBe('pequena');
    expect(clasificar({ ...base, empleados: 50 }).tamano).toBe('mediana');
    expect(clasificar({ ...base, empleados: 250 }).tamano).toBe('grande');
  });

  it('treats the headcount ceiling as strict: exactly 10 is no longer micro', () => {
    expect(clasificar({ ...base, empleados: 9 }).tamano).toBe('micro');
    expect(clasificar({ ...base, empleados: 10 }).tamano).toBe('pequena');
  });

  it('treats turnover and balance as alternatives, not as both required', () => {
    // Turnover blows the micro ceiling but the balance sheet does not: still micro.
    const r = clasificar({ empleados: 6, facturacion: 3_000_000, balance: 1_500_000 });
    expect(r.tamano).toBe('micro');
  });

  it('moves up when both money tests fail', () => {
    const r = clasificar({ empleados: 6, facturacion: 3_000_000, balance: 3_000_000 });
    expect(r.tamano).toBe('pequena');
  });

  it('stops being a PYME above the medium bracket', () => {
    const r = clasificar({ empleados: 400, facturacion: 90_000_000, balance: 80_000_000 });
    expect(r.tamano).toBe('grande');
    expect(r.esPyme).toBe(false);
  });

  it('says which test pushed the firm out of PYME', () => {
    expect(clasificar({ empleados: 300, facturacion: 1_000_000, balance: 1_000_000 }).criterioLimitante).toBe('empleados');
    expect(clasificar({ empleados: 100, facturacion: 90_000_000, balance: 80_000_000 }).criterioLimitante).toBe('financiero');
  });

  it('reports the threshold row it used', () => {
    expect(clasificar(base).umbral).toEqual(UMBRALES[0]);
    expect(clasificar({ empleados: 400, facturacion: 90_000_000, balance: 80_000_000 }).umbral).toBeNull();
  });

  it('rejects negative or non-finite inputs', () => {
    expect(clasificar({ ...base, empleados: -1 }).valido).toBe(false);
    expect(clasificar({ ...base, facturacion: NaN }).valido).toBe(false);
  });

  it('accepts a firm with no employees and no turnover yet', () => {
    const r = clasificar({ empleados: 0, facturacion: 0, balance: 0 });
    expect(r.valido).toBe(true);
    expect(r.tamano).toBe('micro');
  });
});

describe('paraBajarDeTramo', () => {
  it('says what a small firm would need to be micro', () => {
    const r = paraBajarDeTramo({ empleados: 20, facturacion: 4_000_000, balance: 4_000_000 })!;
    expect(r.tamano).toBe('micro');
    expect(r.empleadosMax).toBe(9);
    expect(r.facturacionMax).toBe(2_000_000);
  });
  it('points a large firm at the medium bracket', () => {
    const r = paraBajarDeTramo({ empleados: 400, facturacion: 90_000_000, balance: 80_000_000 })!;
    expect(r.tamano).toBe('mediana');
    expect(r.empleadosMax).toBe(249);
  });
  it('returns null for a firm already in the smallest bracket', () => {
    expect(paraBajarDeTramo(base)).toBeNull();
  });
});
