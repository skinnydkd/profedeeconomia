import { describe, it, expect } from 'vitest';
import { repartir, HORAS_SEMANA, SUENO_RECOMENDADO, type Bloque } from './semana168';

const semana: Bloque[] = [
  { clave: 'sueno', horas: 56 },
  { clave: 'instituto', horas: 30 },
  { clave: 'deberes', horas: 10 },
  { clave: 'transporte', horas: 5 },
  { clave: 'comidas', horas: 14 },
  { clave: 'deporte', horas: 4 },
  { clave: 'pantallas', horas: 21 },
  { clave: 'familia', horas: 10 },
];

describe('repartir', () => {
  const r = repartir(semana);
  it('adds the blocks up and reports what is left', () => {
    expect(r.total).toBe(150);
    expect(r.libres).toBe(18);
    expect(r.sobrepasada).toBe(false);
  });
  it('reads each block as a share of the week and as hours a day', () => {
    const pantallas = r.bloques.find((b) => b.clave === 'pantallas')!;
    expect(pantallas.porcentaje).toBeCloseTo(21 / HORAS_SEMANA, 10);
    expect(pantallas.porDia).toBeCloseTo(3, 10);
  });
  it('turns the sleep block into hours a night', () => {
    expect(r.suenoPorNoche).toBeCloseTo(8, 10);
    expect(r.lecturaSueno).toBe('ok');
  });
});

describe('lectura del sueño', () => {
  it('flags a short night against the usual guidance', () => {
    const r = repartir(semana.map((b) => (b.clave === 'sueno' ? { ...b, horas: 42 } : b)));
    expect(r.suenoPorNoche).toBeCloseTo(6, 10);
    expect(r.lecturaSueno).toBe('corto');
  });
  it('flags a long one too', () => {
    const r = repartir(semana.map((b) => (b.clave === 'sueno' ? { ...b, horas: 77 } : b)));
    expect(r.suenoPorNoche).toBeCloseTo(11, 10);
    expect(r.lecturaSueno).toBe('largo');
  });
  it('treats the ends of the range as fine', () => {
    for (const h of [SUENO_RECOMENDADO.min * 7, SUENO_RECOMENDADO.max * 7]) {
      const r = repartir(semana.map((b) => (b.clave === 'sueno' ? { ...b, horas: h } : b)));
      expect(r.lecturaSueno).toBe('ok');
    }
  });
  it('reads a missing sleep block as no sleep at all', () => {
    const r = repartir(semana.filter((b) => b.clave !== 'sueno'));
    expect(r.suenoPorNoche).toBe(0);
    expect(r.lecturaSueno).toBe('corto');
  });
});

describe('semana sobrepasada', () => {
  it('goes negative when the blocks add up past 168', () => {
    const r = repartir([...semana, { clave: 'trabajo', horas: 30 }]);
    expect(r.total).toBe(180);
    expect(r.libres).toBe(-12);
    expect(r.sobrepasada).toBe(true);
  });
});

describe('validación', () => {
  it('rejects an empty week or negative hours', () => {
    expect(repartir([]).valido).toBe(false);
    expect(repartir([{ clave: 'sueno', horas: -1 }]).valido).toBe(false);
  });
});
