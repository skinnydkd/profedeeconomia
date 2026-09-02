import { describe, it, expect } from 'vitest';
import { compararOpciones, costeAplazamiento, opcionValida, type Opcion } from './compra-inteligente';

describe('compararOpciones', () => {
  const cereales: Opcion[] = [
    { nombre: 'Paquete pequeño', precio: 2.4, cantidad: 375 },
    { nombre: 'Paquete grande', precio: 4.2, cantidad: 750 },
    { nombre: 'Formato familiar', precio: 6.9, cantidad: 1000 },
  ];
  const r = compararOpciones(cereales);

  it('reduces every option to a price per unit', () => {
    expect(r[0].precioUnitario).toBeCloseTo(0.0064, 6);
    expect(r[1].precioUnitario).toBeCloseTo(0.0056, 6);
    expect(r[2].precioUnitario).toBeCloseTo(0.0069, 6);
  });
  it('flags the cheapest, which is not the biggest pack', () => {
    expect(r.filter((o) => o.esMasBarata).map((o) => o.nombre)).toEqual(['Paquete grande']);
  });
  it('measures how much dearer each option is', () => {
    expect(r[1].sobrecoste).toBeCloseTo(0, 10);
    expect(r[2].sobrecoste).toBeCloseTo(0.0069 / 0.0056 - 1, 4);
  });
  it('drops rows that cannot be compared', () => {
    expect(compararOpciones([...cereales, { nombre: 'Sin datos', precio: 0, cantidad: 500 }])).toHaveLength(3);
    expect(compararOpciones([{ nombre: 'Vacía', precio: 3, cantidad: 0 }])).toEqual([]);
    expect(compararOpciones([])).toEqual([]);
  });
});

describe('opcionValida', () => {
  it('accepts a row with a price and a content', () => {
    expect(opcionValida({ nombre: 'A', precio: 2, cantidad: 500 })).toBe(true);
  });
  it('rejects the rows compararOpciones drops', () => {
    expect(opcionValida({ nombre: 'A', precio: 0, cantidad: 500 })).toBe(false);
    expect(opcionValida({ nombre: 'A', precio: 2, cantidad: 0 })).toBe(false);
    expect(opcionValida({ nombre: 'A', precio: NaN, cantidad: 500 })).toBe(false);
  });
  it('agrees with what compararOpciones keeps', () => {
    const filas: Opcion[] = [
      { nombre: 'A', precio: 2, cantidad: 500 },
      { nombre: 'B', precio: 0, cantidad: 500 },
      { nombre: 'C', precio: 3, cantidad: 750 },
    ];
    expect(compararOpciones(filas).length).toBe(filas.filter(opcionValida).length);
  });
});

describe('costeAplazamiento', () => {
  it('charges nothing when the instalments add up to the price', () => {
    const r = costeAplazamiento(300, 0, 3, 100);
    expect(r.valido).toBe(true);
    expect(r.sinIntereses).toBe(true);
    expect(r.coste).toBeCloseTo(0, 8);
    expect(r.tae).toBeCloseTo(0, 8);
  });

  it('prices a credit that costs money', () => {
    // 600 € in 12 instalments of 55 € is 660 € paid.
    const r = costeAplazamiento(600, 0, 12, 55);
    expect(r.totalPagado).toBeCloseTo(660, 8);
    expect(r.coste).toBeCloseTo(60, 8);
    expect(r.costeSobrePrecio).toBeCloseTo(0.1, 8);
    expect(r.sinIntereses).toBe(false);
    // A 10 % surcharge over a year is well above 10 % a year, because the
    // balance is being repaid month by month.
    expect(r.tae).toBeGreaterThan(0.15);
    expect(r.tae).toBeLessThan(0.25);
  });

  it('solves a rate that discounts the instalments back to the amount financed', () => {
    const r = costeAplazamiento(600, 0, 12, 55);
    let vp = 0;
    for (let k = 1; k <= 12; k++) vp += 55 / Math.pow(1 + r.tasaMensual, k);
    expect(vp).toBeCloseTo(600, 4);
  });

  it('compounds the monthly rate into the annual one', () => {
    const r = costeAplazamiento(600, 0, 12, 55);
    expect(r.tae).toBeCloseTo(Math.pow(1 + r.tasaMensual, 12) - 1, 10);
  });

  it('takes the entry payment out of what gets financed', () => {
    const sinEntrada = costeAplazamiento(600, 0, 12, 55);
    const conEntrada = costeAplazamiento(600, 200, 12, 40);
    expect(conEntrada.totalPagado).toBeCloseTo(680, 8);
    expect(conEntrada.coste).toBeCloseTo(80, 8);
    // 400 € financed against 480 € paid is a heavier credit than the first.
    expect(conEntrada.tae).toBeGreaterThan(sinEntrada.tae);
  });

  it('makes a longer term look cheaper monthly and cost more in total', () => {
    const corto = costeAplazamiento(1200, 0, 12, 110);
    const largo = costeAplazamiento(1200, 0, 24, 60);
    expect(largo.coste).toBeGreaterThan(corto.coste);
    expect(largo.totalPagado).toBeGreaterThan(corto.totalPagado);
  });

  it('rejects impossible arrangements', () => {
    expect(costeAplazamiento(0, 0, 12, 55).valido).toBe(false);
    expect(costeAplazamiento(600, 600, 12, 55).valido).toBe(false);
    expect(costeAplazamiento(600, -10, 12, 55).valido).toBe(false);
    expect(costeAplazamiento(600, 0, 0, 55).valido).toBe(false);
    expect(costeAplazamiento(600, 0, 2.5, 55).valido).toBe(false);
    expect(costeAplazamiento(600, 0, 12, 0).valido).toBe(false);
    // Twelve instalments of 20 € never repay 600 €.
    expect(costeAplazamiento(600, 0, 12, 20).valido).toBe(false);
  });
});
