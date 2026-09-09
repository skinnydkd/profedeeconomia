import { describe, it, expect } from 'vitest';
import { leerNumeros, media, mediana, tramos } from './aula.ts';

describe('leerNumeros', () => {
  it('acepta comas, espacios, saltos de línea y puntos y coma', () => {
    expect(leerNumeros('10, 20 30\n40;50')).toEqual([10, 20, 30, 40, 50]);
  });
  it('ignora texto suelto y espacios de más', () => {
    expect(leerNumeros('  12  ,  hola , 8 ')).toEqual([12, 8]);
  });
  it('lee la coma decimal cuando no hay lista separada por comas', () => {
    expect(leerNumeros('33,5 22,5')).toEqual([33.5, 22.5]);
  });
  it('trata la coma como separador cuando separa una lista', () => {
    expect(leerNumeros('1,2,3')).toEqual([1, 2, 3]);
  });
  it('devuelve lista vacía sin números', () => {
    expect(leerNumeros('   ')).toEqual([]);
    expect(leerNumeros('nada de nada')).toEqual([]);
  });
  it('acepta negativos y decimales con punto', () => {
    expect(leerNumeros('-5 2.5')).toEqual([-5, 2.5]);
  });
});

describe('media y mediana', () => {
  it('calcula la media', () => {
    expect(media([10, 20, 30])).toBe(20);
    expect(media([])).toBe(0);
  });
  it('calcula la mediana con impares y con pares', () => {
    expect(mediana([30, 10, 20])).toBe(20);
    expect(mediana([10, 20, 30, 40])).toBe(25);
    expect(mediana([])).toBe(0);
  });
  it('no altera el array recibido', () => {
    const xs = [3, 1, 2];
    mediana(xs);
    expect(xs).toEqual([3, 1, 2]);
  });
});

describe('tramos', () => {
  it('reparte los valores en intervalos de la anchura pedida', () => {
    const t = tramos([0, 5, 12, 19, 20], 20, 10);
    expect(t.map((x) => x.cuenta)).toEqual([2, 3]);
    expect(t[0].etiqueta).toBe('0–10');
  });
  it('mete el valor máximo en el último tramo, no en uno extra', () => {
    const t = tramos([100], 100, 25);
    expect(t).toHaveLength(4);
    expect(t[3].cuenta).toBe(1);
  });
  it('recorta los valores fuera de rango en vez de perderlos', () => {
    const t = tramos([-10, 500], 100, 50);
    expect(t[0].cuenta).toBe(1);
    expect(t[1].cuenta).toBe(1);
  });
});
