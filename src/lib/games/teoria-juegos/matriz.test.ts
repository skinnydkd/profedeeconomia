import { describe, it, expect } from 'vitest';
import {
  MATRICES, BOTS, BOT_IDS, payoffFor, crearMatrizState, jugarRonda,
  totales, tasaCooperacion, contrafactual, pagosPoblacion, type Ronda,
} from './matriz.ts';

const ronda = (jugador: 'C' | 'D', bot: 'C' | 'D'): Ronda => ({
  jugador, bot, puntosJugador: payoffFor('dilema', jugador, bot), puntosBot: payoffFor('dilema', bot, jugador),
});

describe('MATRICES', () => {
  it('el dilema cumple T > R > P > S (traicionar domina)', () => {
    const { CC: R, CD: S, DC: T, DD: P } = MATRICES.dilema;
    expect(T).toBeGreaterThan(R);
    expect(R).toBeGreaterThan(P);
    expect(P).toBeGreaterThan(S);
  });
  it('el dilema castiga la traición mutua frente a la cooperación mutua', () => {
    expect(MATRICES.dilema.CC * 2).toBeGreaterThan(MATRICES.dilema.DC + MATRICES.dilema.CD);
  });
  it('la caza del ciervo cumple R > T >= P > S (dos equilibrios)', () => {
    const { CC: R, CD: S, DC: T, DD: P } = MATRICES.cazaciervo;
    expect(R).toBeGreaterThan(T);
    expect(T).toBeGreaterThanOrEqual(P);
    expect(P).toBeGreaterThan(S);
  });
});

describe('payoffFor', () => {
  it('lee la celda desde el punto de vista de quien juega', () => {
    expect(payoffFor('dilema', 'D', 'C')).toBe(5);
    expect(payoffFor('dilema', 'C', 'D')).toBe(0);
    expect(payoffFor('cazaciervo', 'C', 'C')).toBe(4);
  });
});

describe('bots', () => {
  it('tit-for-tat abre cooperando y luego copia la última jugada', () => {
    expect(BOTS['tit-for-tat']([], Math.random)).toBe('C');
    expect(BOTS['tit-for-tat']([ronda('D', 'C')], Math.random)).toBe('D');
    expect(BOTS['tit-for-tat']([ronda('D', 'C'), ronda('C', 'D')], Math.random)).toBe('C');
  });
  it('la rencorosa no perdona nunca una traición', () => {
    const h = [ronda('D', 'C'), ronda('C', 'D'), ronda('C', 'D')];
    expect(BOTS.rencorosa(h, Math.random)).toBe('D');
  });
  it('la perdonavidas solo castiga tras dos traiciones seguidas', () => {
    expect(BOTS.perdonavidas([ronda('D', 'C')], Math.random)).toBe('C');
    expect(BOTS.perdonavidas([ronda('D', 'C'), ronda('D', 'C')], Math.random)).toBe('D');
    expect(BOTS.perdonavidas([ronda('D', 'C'), ronda('C', 'C')], Math.random)).toBe('C');
  });
  it('la sondeadora tantea en la ronda 2 y se corrige si la castigan', () => {
    expect(BOTS.sondeadora([], Math.random)).toBe('C');
    expect(BOTS.sondeadora([ronda('C', 'C')], Math.random)).toBe('D');
    // Castigada: pasa a copiar (tit-for-tat).
    const castigada = [ronda('C', 'C'), ronda('D', 'D'), ronda('C', 'D')];
    expect(BOTS.sondeadora(castigada, Math.random)).toBe('C');
    // Sin castigo: sigue explotando.
    const impune = [ronda('C', 'C'), ronda('C', 'D'), ronda('C', 'D')];
    expect(BOTS.sondeadora(impune, Math.random)).toBe('D');
  });
  it('la aleatoria depende del rng y solo del rng', () => {
    expect(BOTS.aleatoria([], () => 0.1)).toBe('C');
    expect(BOTS.aleatoria([], () => 0.9)).toBe('D');
  });
  it('toda estrategia devuelve una jugada válida sin historia', () => {
    for (const id of BOT_IDS) expect(['C', 'D']).toContain(BOTS[id]([], () => 0.42));
  });
});

describe('jugarRonda', () => {
  it('acumula rondas y marca el final al llegar al límite', () => {
    let s = crearMatrizState('dilema', 'siempre-coopera', 2);
    s = jugarRonda(s, 'D');
    expect(s.terminado).toBe(false);
    s = jugarRonda(s, 'D');
    expect(s.terminado).toBe(true);
    expect(s.historia).toHaveLength(2);
    expect(totales(s.historia)).toEqual({ jugador: 10, bot: 0 });
  });
  it('ignora jugadas después del final (doble clic idempotente)', () => {
    let s = crearMatrizState('dilema', 'siempre-coopera', 1);
    s = jugarRonda(s, 'C');
    const despues = jugarRonda(s, 'D');
    expect(despues).toBe(s);
  });
  it('nunca deja jugar menos de una ronda', () => {
    expect(crearMatrizState('dilema', 'tit-for-tat', 0).rondas).toBe(1);
  });
});

describe('tasaCooperacion', () => {
  it('devuelve 0 sin historia', () => {
    expect(tasaCooperacion([])).toEqual({ jugador: 0, bot: 0 });
  });
  it('mide la proporción de cooperación de cada lado', () => {
    const h = [ronda('C', 'C'), ronda('D', 'C'), ronda('D', 'D'), ronda('C', 'C')];
    expect(tasaCooperacion(h)).toEqual({ jugador: 0.5, bot: 0.75 });
  });
});

describe('contrafactual', () => {
  it('calcula qué habría pasado jugando siempre lo mismo contra las mismas jugadas', () => {
    let s = crearMatrizState('dilema', 'tit-for-tat', 3);
    s = jugarRonda(s, 'C'); // bot C
    s = jugarRonda(s, 'C'); // bot C
    s = jugarRonda(s, 'C'); // bot C
    expect(totales(s.historia).jugador).toBe(9);
    // Traicionar siempre contra esas mismas jugadas del bot habría dado 15…
    expect(contrafactual(s, 'D')).toBe(15);
    // …pero el bot no habría cooperado tres veces: por eso es contrafactual.
    expect(contrafactual(s, 'C')).toBe(9);
  });
});

describe('pagosPoblacion', () => {
  it('premia traicionar cuando la clase coopera en el dilema', () => {
    const p = pagosPoblacion('dilema', 20, 21);
    expect(p.traicionar).toBeGreaterThan(p.cooperar);
  });
  it('premia cooperar cuando la clase caza el ciervo', () => {
    const p = pagosPoblacion('cazaciervo', 20, 21);
    expect(p.cooperar).toBeGreaterThan(p.traicionar);
  });
  it('castiga cooperar en solitario en la caza del ciervo', () => {
    const p = pagosPoblacion('cazaciervo', 1, 21);
    expect(p.cooperar).toBeLessThan(p.traicionar);
  });
  it('la media es la media ponderada de los dos grupos', () => {
    const p = pagosPoblacion('dilema', 10, 20);
    expect(p.media).toBeCloseTo((p.cooperar + p.traicionar) / 2, 10);
  });
  it('no divide por cero con grupos vacíos o clases de una persona', () => {
    expect(pagosPoblacion('dilema', 0, 10).cooperar).toBe(0);
    expect(pagosPoblacion('dilema', 10, 10).traicionar).toBe(0);
    expect(pagosPoblacion('dilema', 1, 1)).toEqual({ cooperar: 0, traicionar: 0, media: 0 });
  });
});
