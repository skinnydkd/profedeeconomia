import { describe, it, expect } from 'vitest';
import { evaluar, PALABRAS_HUECAS, type Tipo } from './mision-vision';

const uno = (tipo: Tipo, texto: string) => evaluar([{ tipo, texto }]).analisis[0];

describe('evaluar — misión', () => {
  it('passes a mission that says what it does and for whom', () => {
    const a = uno('mision', 'Reparamos bicicletas a precio accesible para vecinos del barrio y formamos en mecánica a jóvenes sin empleo');
    expect(a.aprobado).toBe(true);
    expect(a.fallos).toEqual([]);
  });

  it('fails a mission with no addressee', () => {
    const a = uno('mision', 'Reparamos bicicletas usando piezas recicladas y herramientas propias');
    expect(a.fallos).toContain('sin-para-quien');
  });

  it('fails an empty or near-empty statement', () => {
    expect(uno('mision', '').fallos).toContain('vacio');
    expect(uno('mision', 'Vender').fallos).toContain('vacio');
  });

  it('fails a short statement built only out of hollow words', () => {
    const a = uno('mision', 'Ser líderes en excelencia y calidad');
    expect(a.fallos).toContain('palabra-hueca');
    expect(a.huecasEncontradas.length).toBeGreaterThan(0);
  });

  it('does not condemn a long statement that happens to mention quality', () => {
    const a = uno('mision', 'Reparamos bicicletas para vecinos del barrio con piezas de calidad recuperadas de talleres locales');
    expect(a.huecasEncontradas).toContain('calidad');
    expect(a.fallos).not.toContain('palabra-hueca');
  });
});

describe('evaluar — visión', () => {
  it('passes a vision with a horizon', () => {
    const a = uno('vision', 'Que en 2032 ningún joven del distrito salga del sistema educativo sin una salida profesional');
    expect(a.aprobado).toBe(true);
  });

  it('accepts a horizon expressed in years', () => {
    const a = uno('vision', 'Que dentro de 5 años cada barrio tenga un taller de reparación abierto y accesible');
    expect(a.fallos).not.toContain('sin-horizonte');
  });

  it('fails a vision with no horizon at all', () => {
    const a = uno('vision', 'Queremos ser una empresa que transforme la movilidad urbana del futuro');
    expect(a.fallos).toContain('sin-horizonte');
  });

  it('does not ask a mission for a horizon', () => {
    const a = uno('mision', 'Reparamos bicicletas a precio accesible para vecinos del barrio de toda la vida');
    expect(a.fallos).not.toContain('sin-horizonte');
  });
});

describe('evaluar — valores', () => {
  it('passes a value that can be checked', () => {
    const a = uno('valor', 'Publicamos cada año cuántas personas hemos formado y cuántas encontraron empleo');
    expect(a.aprobado).toBe(true);
  });

  it('fails a value with nothing to check', () => {
    const a = uno('valor', 'Creemos firmemente en la transparencia y en la honestidad con las personas');
    expect(a.fallos).toContain('no-comprobable');
  });

  it('does not ask a mission to be checkable in that sense', () => {
    const a = uno('mision', 'Reparamos bicicletas a precio accesible para vecinos del barrio de toda la vida');
    expect(a.fallos).not.toContain('no-comprobable');
  });
});

describe('evaluar — conjunto', () => {
  it('counts how many statements pass', () => {
    const r = evaluar([
      { tipo: 'mision', texto: 'Reparamos bicicletas a precio accesible para vecinos del barrio y formamos a jóvenes' },
      { tipo: 'vision', texto: 'Ser referentes en excelencia' },
    ]);
    expect(r.total).toBe(2);
    expect(r.aprobados).toBe(1);
  });

  it('rejects an empty submission', () => {
    expect(evaluar([]).valido).toBe(false);
  });

  it('keeps the hollow-word list non-empty and lowercase', () => {
    expect(PALABRAS_HUECAS.length).toBeGreaterThan(5);
    expect(PALABRAS_HUECAS.every((p) => p === p.toLowerCase())).toBe(true);
  });
});
