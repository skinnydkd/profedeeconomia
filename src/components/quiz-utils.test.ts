import { describe, it, expect } from 'vitest';
import {
  lecturasNumero,
  numeroCorrecto,
  ordenesOpciones,
  ordenValido,
  permutacion,
  rngDesde,
  textoPlano,
  trozosInline,
} from './quiz-utils';

describe('lecturasNumero', () => {
  it('reads a decimal comma and a decimal point alike', () => {
    expect(lecturasNumero('12,5')).toEqual([12.5]);
    expect(lecturasNumero('12.5')).toEqual([12.5]);
    expect(lecturasNumero('0,05')).toEqual([0.05]);
    expect(lecturasNumero(',5')).toEqual([0.5]);
  });

  it('reads negatives, including the typographic minus', () => {
    expect(lecturasNumero('-3')).toEqual([-3]);
    expect(lecturasNumero('−3')).toEqual([-3]);
    expect(lecturasNumero('-0,25')).toEqual([-0.25]);
  });

  it('returns nothing while the number is still being typed', () => {
    expect(lecturasNumero('')).toEqual([]);
    expect(lecturasNumero('-')).toEqual([]);
    expect(lecturasNumero('12,')).toEqual([]);
    expect(lecturasNumero('abc')).toEqual([]);
    expect(lecturasNumero('1e3')).toEqual([]);
  });

  it('keeps both readings when a lone separator is followed by three digits', () => {
    expect(lecturasNumero('1.500')).toEqual([1.5, 1500]);
    expect(lecturasNumero('2,250')).toEqual([2.25, 2250]);
    expect(lecturasNumero('0,125')).toEqual([0.125]);
  });

  it('reads thousands groups and mixed separators', () => {
    expect(lecturasNumero('1.500.000')).toEqual([1500000]);
    expect(lecturasNumero('1.234,56')).toEqual([1234.56]);
    expect(lecturasNumero('1,234.56')).toEqual([1234.56]);
    expect(lecturasNumero('1 500')).toEqual([1500]);
    expect(lecturasNumero('1.5.3')).toEqual([]);
    expect(lecturasNumero('12,34.5')).toEqual([]);
  });

  it('ignores a unit sign typed after the number', () => {
    expect(lecturasNumero('15 %')).toEqual([15]);
    expect(lecturasNumero('1.200 €')).toEqual([1.2, 1200]);
  });
});

describe('numeroCorrecto', () => {
  it('grades the answers the old controlled input used to mangle', () => {
    expect(numeroCorrecto('12,5', 12.5)).toBe(true);
    expect(numeroCorrecto('-3', -3)).toBe(true);
    expect(numeroCorrecto('0,05', 0.05)).toBe(true);
    expect(numeroCorrecto('125', 12.5)).toBe(false);
  });

  it('accepts Spanish thousands without breaking decimals', () => {
    expect(numeroCorrecto('1.500', 1500)).toBe(true);
    expect(numeroCorrecto('1.500', 1.5)).toBe(true);
    expect(numeroCorrecto('1.501', 1500)).toBe(false);
  });

  it('applies the tolerance without binary rounding noise', () => {
    expect(numeroCorrecto('1,26', 1.25, 0.01)).toBe(true);
    expect(numeroCorrecto('1,27', 1.25, 0.01)).toBe(false);
  });
});

describe('option order', () => {
  it('permutacion is a permutation of 0..n-1', () => {
    for (let n = 1; n <= 6; n++) {
      expect([...permutacion(n)].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('rngDesde repeats the same sequence for the same text', () => {
    const a = rngDesde('test-eco-1bach-5');
    const b = rngDesde('test-eco-1bach-5');
    const c = rngDesde('test-eco-1bach-6');
    const sa = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(sa);
    expect([c(), c(), c()]).not.toEqual(sa);
    sa.forEach((x) => expect(x >= 0 && x < 1).toBe(true));
  });

  it('ordenesOpciones only shuffles multiple choice', () => {
    const preguntas = [
      { tipo: 'opcion-multiple', opciones: ['a', 'b', 'c', 'd'] },
      { tipo: 'verdadero-falso' },
      { tipo: 'numerico' },
    ];
    const ordenes = ordenesOpciones(preguntas, rngDesde('x'));
    expect([...ordenes[0]].sort()).toEqual([0, 1, 2, 3]);
    expect(ordenes[1]).toEqual([]);
    expect(ordenes[2]).toEqual([]);
    expect(ordenesOpciones(preguntas, rngDesde('x'))).toEqual(ordenes);
  });

  it('spreads the correct option across positions instead of leaving it at B', () => {
    // 400 four-option questions whose key is always B (index 1), as in the bias
    // the audit measured: after shuffling, no position keeps much more than 1/4.
    const preguntas = Array.from({ length: 400 }, () => ({ tipo: 'opcion-multiple', opciones: ['a', 'b', 'c', 'd'] }));
    const ordenes = ordenesOpciones(preguntas, rngDesde('sesgo'));
    const cuenta = [0, 0, 0, 0];
    ordenes.forEach((o) => cuenta[o.indexOf(1)]++);
    cuenta.forEach((c) => expect(c / 400).toBeLessThan(0.35));
  });

  it('ordenValido falls back to the file order when the stored one does not fit', () => {
    expect(ordenValido([2, 0, 1], 3)).toEqual([2, 0, 1]);
    expect(ordenValido([2, 0, 1], 4)).toEqual([0, 1, 2, 3]);
    expect(ordenValido(undefined, 2)).toEqual([0, 1]);
  });
});

describe('trozosInline', () => {
  it('renders **strong** and *em*', () => {
    expect(trozosInline('El **MVP**, popularizado por *The Lean Startup*, es…')).toEqual([
      { tipo: 'texto', texto: 'El ' },
      { tipo: 'strong', texto: 'MVP' },
      { tipo: 'texto', texto: ', popularizado por ' },
      { tipo: 'em', texto: 'The Lean Startup' },
      { tipo: 'texto', texto: ', es…' },
    ]);
    expect(trozosInline('(*free-rider*)')[1]).toEqual({ tipo: 'em', texto: 'free-rider' });
  });

  it('leaves economics notation alone', () => {
    for (const s of [
      'En el equilibrio, Q_d = Q_o al precio P*. No hay exceso de oferta ni el precio P* cambia.',
      'El área del rectángulo P* · Q*.',
      'P* = 20 €. Sustituyendo, Q* = 100 − 2·20 = 60 unidades.',
      '2 * 3 * 4',
    ]) {
      expect(trozosInline(s)).toEqual([{ tipo: 'texto', texto: s }]);
    }
  });

  it('textoPlano drops the marks', () => {
    expect(textoPlano('Aplicar el principio de **prudencia** y *devengo*')).toBe('Aplicar el principio de prudencia y devengo');
  });
});
