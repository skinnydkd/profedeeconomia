import { describe, it, expect } from 'vitest';
import { evaluar, ZONAS, ZONAS_CLAVE, type Entrada } from './mapa-empatia';

const e = (zona: Entrada['zona'], texto = 'algo'): Entrada => ({ zona, texto });

describe('evaluar', () => {
  it('starts with every zone empty', () => {
    const r = evaluar('', []);
    expect(r.valido).toBe(true);
    expect(r.total).toBe(0);
    expect(r.zonasVacias).toEqual(ZONAS);
    expect(r.listoParaPropuesta).toBe(false);
  });

  it('needs a name of at least two characters', () => {
    expect(evaluar('', []).tieneNombre).toBe(false);
    expect(evaluar(' a ', []).tieneNombre).toBe(false);
    expect(evaluar('Marta, 34 años', []).tieneNombre).toBe(true);
  });

  it('ignores blank entries and unknown zones', () => {
    const r = evaluar('X', [e('ve', '   '), { zona: 'inventada' as never, texto: 'x' }, e('ve')]);
    expect(r.total).toBe(1);
  });

  it('counts entries per zone', () => {
    const r = evaluar('X', [e('ve'), e('ve'), e('oye')]);
    expect(r.porZona.ve).toBe(2);
    expect(r.porZona.oye).toBe(1);
    expect(r.porZona.dolores).toBe(0);
  });

  it('lists the empty zones', () => {
    const r = evaluar('X', [e('ve')]);
    expect(r.zonasVacias).toEqual(ZONAS.filter((z) => z !== 've'));
  });

  it('is ready for a value proposition only with pains and gains', () => {
    expect(evaluar('X', [e('dolores')]).listoParaPropuesta).toBe(false);
    expect(evaluar('X', [e('ganancias')]).listoParaPropuesta).toBe(false);
    expect(evaluar('X', [e('dolores'), e('ganancias')]).listoParaPropuesta).toBe(true);
  });

  it('flags a map that only describes what can be observed', () => {
    const r = evaluar('X', [e('ve'), e('oye'), e('dice-hace')]);
    expect(r.soloObservable).toBe(true);
    expect(r.listoParaPropuesta).toBe(false);
  });

  it('stops flagging it once pains and gains are filled', () => {
    const r = evaluar('X', [e('ve'), e('oye'), e('dice-hace'), e('dolores'), e('ganancias')]);
    expect(r.soloObservable).toBe(false);
    expect(r.listoParaPropuesta).toBe(true);
  });

  it('does not flag a map that has pains but no observables', () => {
    const r = evaluar('X', [e('dolores'), e('ganancias')]);
    expect(r.soloObservable).toBe(false);
  });

  it('treats the two key zones as exactly pains and gains', () => {
    expect(ZONAS_CLAVE).toEqual(['dolores', 'ganancias']);
  });

  it('rejects a non-array of entries', () => {
    expect(evaluar('X', undefined as unknown as Entrada[]).valido).toBe(false);
  });
});
