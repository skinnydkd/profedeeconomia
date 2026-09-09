import { describe, it, expect } from 'vitest';
import {
  FORMATOS, SUBASTA_DEFAULT, pagaSegundoPrecio, formatoDeRonda, pujaBot,
  resolverSubasta, crearSubastaState, pujar, excedenteTotal,
  ingresoPorFormato, compararFormatos,
} from './subastas.ts';

describe('formatos', () => {
  it('la inglesa y el sobre cerrado a segundo precio pagan la segunda puja', () => {
    expect(pagaSegundoPrecio('inglesa')).toBe(true);
    expect(pagaSegundoPrecio('sobre-2')).toBe(true);
  });
  it('la holandesa y el sobre a primer precio pagan la propia', () => {
    expect(pagaSegundoPrecio('holandesa')).toBe(false);
    expect(pagaSegundoPrecio('sobre-1')).toBe(false);
  });
  it('rotar recorre los cuatro formatos y vuelve a empezar', () => {
    const cfg = { ...SUBASTA_DEFAULT, formato: 'rotar' as const };
    expect(FORMATOS.map((_, i) => formatoDeRonda(cfg, i + 1))).toEqual(FORMATOS);
    expect(formatoDeRonda(cfg, 5)).toBe(FORMATOS[0]);
  });
  it('un formato fijo no rota', () => {
    const cfg = { ...SUBASTA_DEFAULT, formato: 'sobre-2' as const };
    expect(formatoDeRonda(cfg, 3)).toBe('sobre-2');
  });
});

describe('pujaBot', () => {
  it('puja su valor cuando paga el segundo precio', () => {
    expect(pujaBot('sobre-2', 80, 5, () => 0.5)).toBe(80);
    expect(pujaBot('inglesa', 80, 5, () => 0.5)).toBe(80);
  });
  it('rebaja la puja cuando paga la suya propia', () => {
    expect(pujaBot('sobre-1', 100, 5, () => 0.5)).toBe(80);
    expect(pujaBot('holandesa', 100, 5, () => 0.5)).toBe(80);
  });
  it('rebaja menos cuanta más competencia hay', () => {
    const pocos = pujaBot('sobre-1', 100, 2, () => 0.5);
    const muchos = pujaBot('sobre-1', 100, 10, () => 0.5);
    expect(muchos).toBeGreaterThan(pocos);
  });
  it('nunca puja negativo', () => {
    expect(pujaBot('sobre-1', 0, 5, () => 0)).toBeGreaterThanOrEqual(0);
  });
});

describe('resolverSubasta', () => {
  const postores = [
    { valor: 90, puja: 70 },
    { valor: 80, puja: 60 },
    { valor: 50, puja: 40 },
  ];
  it('gana siempre la puja más alta, sea cual sea el formato', () => {
    for (const f of FORMATOS) expect(resolverSubasta(postores, f).ganador).toBe(0);
  });
  it('a primer precio paga su propia puja', () => {
    expect(resolverSubasta(postores, 'sobre-1').precio).toBe(70);
  });
  it('a segundo precio paga la puja del segundo', () => {
    expect(resolverSubasta(postores, 'sobre-2').precio).toBe(60);
  });
  it('el excedente es el valor menos lo pagado', () => {
    expect(resolverSubasta(postores, 'sobre-2').excedente).toBe(30);
  });
  it('detecta la maldición del ganador cuando se puja por encima del valor', () => {
    const pasados = [{ valor: 40, puja: 90 }, { valor: 80, puja: 60 }];
    expect(resolverSubasta(pasados, 'sobre-1').excedente).toBeLessThan(0);
  });
  it('queda desierta si nadie puja', () => {
    expect(resolverSubasta([{ valor: 10, puja: 0 }], 'sobre-1').ganador).toBe(-1);
    expect(resolverSubasta([], 'sobre-1').ganador).toBe(-1);
  });
  it('con un solo postor a segundo precio el precio es cero', () => {
    expect(resolverSubasta([{ valor: 50, puja: 30 }], 'sobre-2').precio).toBe(0);
  });
});

describe('partida', () => {
  it('juega las rondas pedidas y se cierra', () => {
    let s = crearSubastaState({ ...SUBASTA_DEFAULT, rondas: 4 }, () => 0.5);
    for (let i = 0; i < 4; i++) s = pujar(s, 10, () => 0.5);
    expect(s.terminado).toBe(true);
    expect(s.historial).toHaveLength(4);
    expect(pujar(s, 10, () => 0.5)).toBe(s);
  });
  it('el valor privado del jugador cae dentro del rango', () => {
    const s = crearSubastaState(SUBASTA_DEFAULT, () => 0.5);
    expect(s.valorActual).toBeGreaterThanOrEqual(0);
    expect(s.valorActual).toBeLessThanOrEqual(SUBASTA_DEFAULT.valorMax);
  });
  it('solo suma excedente en las rondas que gana', () => {
    let s = crearSubastaState({ ...SUBASTA_DEFAULT, rondas: 2 }, () => 0.5);
    s = pujar(s, 0, () => 0.5); // no puja: no gana
    expect(s.historial[0].ganaJugador).toBe(false);
    expect(s.historial[0].excedenteJugador).toBe(0);
    expect(excedenteTotal(s)).toBe(0);
  });
  it('agrupa el ingreso medio por formato solo de lo jugado', () => {
    let s = crearSubastaState({ ...SUBASTA_DEFAULT, rondas: 2 }, () => 0.5);
    s = pujar(s, 50, () => 0.5);
    s = pujar(s, 50, () => 0.5);
    const ingresos = ingresoPorFormato(s);
    expect(ingresos).toHaveLength(2);
    expect(ingresos.every((i) => i.subastas === 1)).toBe(true);
  });
});

describe('compararFormatos', () => {
  it('el ganador es el mismo en los cuatro formatos; cambia el precio', () => {
    const c = compararFormatos([30, 55, 20]);
    expect(new Set(c.map((x) => x.ganador)).size).toBe(1);
    expect(c.find((x) => x.formato === 'sobre-1')!.precio).toBe(55);
    expect(c.find((x) => x.formato === 'sobre-2')!.precio).toBe(30);
  });
  it('descarta entradas no numéricas', () => {
    expect(compararFormatos([NaN, 10]).every((c) => c.ganador === 0)).toBe(true);
  });
  it('sin pujas se queda desierta', () => {
    expect(compararFormatos([]).every((c) => c.ganador === -1)).toBe(true);
  });
});
