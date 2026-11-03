import { describe, it, expect } from 'vitest';
import {
  BELLEZA_DEFAULT, NIVEL_MAX, nivelK, nivelDe, repartoNiveles, tiradaBot,
  objetivo, ganadores, crearBellezaState, anclaDe, jugarBelleza, analizarAula,
} from './belleza.ts';

const cfg = BELLEZA_DEFAULT;

describe('nivelK', () => {
  it('descuenta el ancla una vez por escalón de razonamiento', () => {
    expect(nivelK(50, 0, 2 / 3)).toBe(50);
    expect(nivelK(50, 1, 2 / 3)).toBeCloseTo(33.33, 2);
    expect(nivelK(50, 2, 2 / 3)).toBeCloseTo(22.22, 2);
  });
  it('trata los niveles negativos como nivel 0', () => {
    expect(nivelK(50, -3, 2 / 3)).toBe(50);
  });
});

describe('nivelDe', () => {
  it('clasifica un número en su escalón de razonamiento', () => {
    expect(nivelDe(50, 50, 2 / 3)).toBe(0);
    expect(nivelDe(33, 50, 2 / 3)).toBe(1);
    expect(nivelDe(22, 50, 2 / 3)).toBe(2);
  });
  it('manda el 0 (y los negativos) al nivel más profundo', () => {
    expect(nivelDe(0, 50, 2 / 3)).toBe(NIVEL_MAX);
    expect(nivelDe(-4, 50, 2 / 3)).toBe(NIVEL_MAX);
  });
  it('nunca sale del rango de niveles', () => {
    expect(nivelDe(100, 50, 2 / 3)).toBe(0);
    expect(nivelDe(0.001, 50, 2 / 3)).toBe(NIVEL_MAX);
  });
});

describe('repartoNiveles', () => {
  it('da un nivel a cada bot dentro del rango declarado', () => {
    const niveles = repartoNiveles(20, () => 0.5);
    expect(niveles).toHaveLength(20);
    for (const n of niveles) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(NIVEL_MAX);
    }
  });
  it('coloca a los más ingenuos con rng bajo y a los más profundos con rng alto', () => {
    expect(repartoNiveles(1, () => 0.01)[0]).toBe(0);
    expect(repartoNiveles(1, () => 0.999)[0]).toBeGreaterThanOrEqual(4);
  });
});

describe('tiradaBot', () => {
  it('se queda dentro del rango permitido', () => {
    for (const r of [0, 0.5, 0.999]) {
      const n = tiradaBot(0, cfg.max, cfg, () => r);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(cfg.max);
    }
  });
  it('sin ruido cae sobre el número de su nivel', () => {
    expect(tiradaBot(1, 50, cfg, () => 0.5)).toBe(33);
  });
});

describe('objetivo y ganadores', () => {
  it('el objetivo son 2/3 de la media', () => {
    expect(objetivo([30, 60, 90], 2 / 3)).toBeCloseTo(40, 10);
  });
  it('gana quien más se acerca', () => {
    expect(ganadores([30, 60, 90], 2 / 3)).toEqual([0]); // objetivo 40 → 30 es el más cerca
  });
  it('los empates ganan todos', () => {
    // Media 30 → objetivo 20: los dos distan lo mismo.
    expect(ganadores([30, 30], 2 / 3)).toEqual([0, 1]);
  });
  it('no revienta con una lista vacía', () => {
    expect(objetivo([], 2 / 3)).toBe(0);
    expect(ganadores([], 2 / 3)).toEqual([]);
  });
});

describe('jugarBelleza', () => {
  it('arranca anclando en la mitad del rango y luego en el objetivo anterior', () => {
    const s0 = crearBellezaState(cfg, () => 0.5);
    expect(anclaDe(s0)).toBe(cfg.max / 2);
    const s1 = jugarBelleza(s0, 50, () => 0.5);
    expect(anclaDe(s1)).toBeCloseTo(s1.historial[0].objetivo, 10);
  });
  it('recorta el número del jugador al rango permitido', () => {
    const s = jugarBelleza(crearBellezaState(cfg, () => 0.5), 999, () => 0.5);
    expect(s.historial[0].jugador).toBe(cfg.max);
    const s2 = jugarBelleza(crearBellezaState(cfg, () => 0.5), -20, () => 0.5);
    expect(s2.historial[0].jugador).toBe(0);
  });
  it('termina al agotar las rondas e ignora jugadas posteriores', () => {
    let s = crearBellezaState({ ...cfg, rondas: 2 }, () => 0.5);
    s = jugarBelleza(s, 33, () => 0.5);
    s = jugarBelleza(s, 22, () => 0.5);
    expect(s.terminado).toBe(true);
    expect(jugarBelleza(s, 10, () => 0.5)).toBe(s);
  });
  it('converge a la baja cuando los bots aprenden', () => {
    let s = crearBellezaState({ ...cfg, rondas: 6 }, () => 0.3);
    const objetivos: number[] = [];
    for (let i = 0; i < 6; i++) {
      s = jugarBelleza(s, 20, () => 0.9); // rng alto: todos suben de nivel
      objetivos.push(s.historial[s.historial.length - 1].objetivo);
    }
    expect(objetivos[objetivos.length - 1]).toBeLessThan(objetivos[0]);
  });
  it('marca si ha ganado el jugador (índice 0)', () => {
    const s = jugarBelleza(crearBellezaState({ ...cfg, bots: 2 }, () => 0.5), 0, () => 0.5);
    const r = s.historial[0];
    expect(r.gana).toBe(r.ganadores.includes(0));
  });
});

describe('analizarAula', () => {
  it('resume la votación de la clase', () => {
    const a = analizarAula([50, 33, 22, 0], cfg);
    expect(a.media).toBeCloseTo(26.25, 2);
    expect(a.objetivo).toBeCloseTo(17.5, 2);
    expect(a.ganadores).toEqual([2]); // 22 es el más cercano a 17.5
  });
  it('reparte las respuestas por nivel de razonamiento', () => {
    const a = analizarAula([50, 33, 22, 15], cfg);
    expect(a.porNivel[0]).toBe(1);
    expect(a.porNivel[1]).toBe(1);
    expect(a.porNivel[2]).toBe(1);
    expect(a.porNivel[3]).toBe(1);
  });
  it('descarta valores no numéricos y recorta fuera de rango', () => {
    const a = analizarAula([NaN, 120, -5, 50], cfg);
    expect(a.numeros).toEqual([100, 0, 50]);
  });
  it('sobrevive a una clase sin respuestas', () => {
    const a = analizarAula([], cfg);
    expect(a.media).toBe(0);
    expect(a.ganadores).toEqual([]);
  });
});
