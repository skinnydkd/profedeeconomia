import { describe, it, expect } from 'vitest';
import {
  BIEN_PUBLICO_DEFAULT, mpcr, pagos, optimoSocial, equilibrioEgoista,
  contribucionBot, repartoTipos, crearBienPublicoState, mediaAjena,
  jugarBienPublico, totalJugador, analizarAula,
} from './bien-publico.ts';

const cfg = BIEN_PUBLICO_DEFAULT;

describe('parámetros del dilema', () => {
  it('el MPCR está entre 0 y 1: aportar no compensa individualmente', () => {
    const r = mpcr(cfg.multiplicador, cfg.jugadores);
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(1);
  });
  it('el multiplicador supera 1: aportar sí compensa colectivamente', () => {
    expect(cfg.multiplicador).toBeGreaterThan(1);
  });
  it('el óptimo social paga más que el equilibrio egoísta', () => {
    expect(optimoSocial(cfg)).toBeGreaterThan(equilibrioEgoista(cfg));
  });
  it('no divide por cero sin jugadores', () => {
    expect(mpcr(2, 0)).toBe(0);
  });
});

describe('pagos', () => {
  it('reparte el bote multiplicado a partes iguales', () => {
    // 4 jugadores, dotación 10, multiplicador 2: bote 20 → 10 para cada uno.
    expect(pagos([10, 10, 0, 0], 10, 2)).toEqual([10, 10, 20, 20]);
  });
  it('premia al gorrón dentro de una ronda concreta', () => {
    const p = pagos([10, 10, 10, 0], 10, 2);
    expect(p[3]).toBeGreaterThan(p[0]);
  });
  it('pero deja a todos peor si nadie aporta', () => {
    const todos = pagos([10, 10, 10, 10], 10, 2);
    const nadie = pagos([0, 0, 0, 0], 10, 2);
    expect(todos[0]).toBeGreaterThan(nadie[0]);
  });
  it('trata las aportaciones negativas como cero', () => {
    expect(pagos([-5, 0], 10, 2)).toEqual([10, 10]);
  });
  it('devuelve lista vacía sin jugadores', () => {
    expect(pagos([], 10, 2)).toEqual([]);
  });
});

describe('bots', () => {
  it('el gorrón nunca aporta y el altruista siempre lo da todo', () => {
    expect(contribucionBot('gorron', cfg, 5, 3, () => 0.5)).toBe(0);
    expect(contribucionBot('altruista', cfg, 5, 3, () => 0.5)).toBe(cfg.dotacion);
  });
  it('la condicional se fía la primera ronda y luego copia al grupo', () => {
    expect(contribucionBot('condicional', cfg, null, 1, () => 0.5)).toBe(7);
    expect(contribucionBot('condicional', cfg, 2, 2, () => 0.5)).toBe(2);
  });
  it('la cansada va perdiendo la fe ronda a ronda', () => {
    const r1 = contribucionBot('cansada', cfg, null, 1, () => 0.5);
    const r5 = contribucionBot('cansada', cfg, null, 5, () => 0.5);
    expect(r5).toBeLessThan(r1);
  });
  it('ninguna aportación se sale de [0, dotación]', () => {
    for (const t of ['gorron', 'altruista', 'condicional', 'cansada'] as const) {
      for (const r of [0, 0.5, 1]) {
        const c = contribucionBot(t, cfg, 99, 12, () => r);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThanOrEqual(cfg.dotacion);
      }
    }
  });
  it('reparte un tipo distinto a cada bot y luego repite', () => {
    expect(repartoTipos(4)).toEqual(['gorron', 'altruista', 'condicional', 'cansada']);
    expect(repartoTipos(5)[4]).toBe('gorron');
    expect(repartoTipos(0)).toEqual([]);
  });
});

describe('partida', () => {
  it('juega las rondas pedidas y luego se cierra', () => {
    let s = crearBienPublicoState({ ...cfg, rondas: 3 });
    for (let i = 0; i < 3; i++) s = jugarBienPublico(s, 5, () => 0.5);
    expect(s.terminado).toBe(true);
    expect(s.historial).toHaveLength(3);
    expect(jugarBienPublico(s, 5, () => 0.5)).toBe(s);
  });
  it('recorta la aportación del jugador a su dotación', () => {
    const s = jugarBienPublico(crearBienPublicoState(cfg), 999, () => 0.5);
    expect(s.historial[0].contribuciones[0]).toBe(cfg.dotacion);
  });
  it('exige al menos dos jugadores', () => {
    expect(crearBienPublicoState({ ...cfg, jugadores: 1 }).config.jugadores).toBe(2);
  });
  it('mediaAjena no existe antes de la primera ronda', () => {
    expect(mediaAjena(crearBienPublicoState(cfg), 0)).toBeNull();
  });
  it('gorronear paga más que aportar contra los mismos rivales', () => {
    const rng = () => 0.5;
    let generoso = crearBienPublicoState({ ...cfg, rondas: 1 });
    let gorron = crearBienPublicoState({ ...cfg, rondas: 1 });
    generoso = jugarBienPublico(generoso, cfg.dotacion, rng);
    gorron = jugarBienPublico(gorron, 0, rng);
    expect(totalJugador(gorron)).toBeGreaterThan(totalJugador(generoso));
  });
});

describe('analizarAula', () => {
  it('mide lo que la clase deja sobre la mesa', () => {
    const a = analizarAula([10, 10, 0, 0], 10, 2);
    expect(a.bote).toBe(20);
    expect(a.media).toBe(5);
    expect(a.pagoMedio).toBe(15);
    expect(a.optimo).toBe(20);
    expect(a.perdida).toBe(5);
  });
  it('no pierde nada cuando la clase aporta todo', () => {
    expect(analizarAula([10, 10, 10], 10, 2).perdida).toBe(0);
  });
  it('sobrevive a una clase sin datos', () => {
    const a = analizarAula([], 10, 2);
    expect(a.bote).toBe(0);
    expect(a.perdida).toBe(0);
  });
  it('recorta valores imposibles', () => {
    expect(analizarAula([-4, 40], 10, 2).contribuciones).toEqual([0, 10]);
  });
});
