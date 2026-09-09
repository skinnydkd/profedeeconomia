import { describe, it, expect } from 'vitest';
import {
  RESPONDEDORES, PROPONENTES, TIPOS_RESPONDEDOR, TIPOS_PROPONENTE,
  umbralDe, ofertaDe, resolverDictador, resolverUltimatum,
  crearRepartoState, ofertar, responder, totalJugador,
  analizarOfertas, curvaRechazo, mejorOferta, REPARTO_DEFAULT,
} from './reparto.ts';

describe('personalidades', () => {
  it('el calculador acepta cualquier migaja', () => {
    expect(RESPONDEDORES.calculador.minimo).toBeLessThanOrEqual(1);
    expect(umbralDe('calculador', () => 0.9)).toBeLessThanOrEqual(1);
  });
  it('el justiciero exige casi la mitad', () => {
    expect(RESPONDEDORES.justiciero.minimo).toBeGreaterThan(35);
  });
  it('los umbrales y las ofertas se quedan en el rango 0-100', () => {
    for (const t of TIPOS_RESPONDEDOR) {
      for (const r of [0, 0.5, 1]) {
        const u = umbralDe(t, () => r);
        expect(u).toBeGreaterThanOrEqual(0);
        expect(u).toBeLessThanOrEqual(100);
      }
    }
    for (const t of TIPOS_PROPONENTE) {
      for (const r of [0, 0.5, 1]) {
        const o = ofertaDe(t, () => r);
        expect(o).toBeGreaterThanOrEqual(0);
        expect(o).toBeLessThanOrEqual(100);
      }
    }
  });
  it('el igualitario reparte cerca de la mitad', () => {
    expect(PROPONENTES.igualitario.oferta).toBe(50);
    expect(ofertaDe('igualitario', () => 0.5)).toBe(50);
  });
});

describe('resolverDictador', () => {
  it('reparte lo ofrecido sin posibilidad de rechazo', () => {
    expect(resolverDictador(100, 30)).toEqual({ aceptada: true, proponente: 70, respondedor: 30 });
  });
  it('recorta ofertas imposibles', () => {
    expect(resolverDictador(100, 140).respondedor).toBe(100);
    expect(resolverDictador(100, -20).respondedor).toBe(0);
  });
});

describe('resolverUltimatum', () => {
  it('acepta cuando la oferta llega al umbral', () => {
    expect(resolverUltimatum(100, 40, 40)).toEqual({ aceptada: true, proponente: 60, respondedor: 40 });
  });
  it('quema el bote entero cuando se rechaza', () => {
    expect(resolverUltimatum(100, 10, 30)).toEqual({ aceptada: false, proponente: 0, respondedor: 0 });
  });
});

describe('ronda como proponente', () => {
  it('acumula rondas y termina al llegar al límite', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rondas: 2 }, () => 0.5);
    s = ofertar(s, 50, () => 0.5);
    expect(s.terminado).toBe(false);
    s = ofertar(s, 50, () => 0.5);
    expect(s.terminado).toBe(true);
    expect(s.historial).toHaveLength(2);
  });
  it('ignora ofertas tras el final', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rondas: 1 }, () => 0.5);
    s = ofertar(s, 50, () => 0.5);
    expect(ofertar(s, 10, () => 0.5)).toBe(s);
  });
  it('en el dictador nunca hay umbral ni rechazo', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, variante: 'dictador', rondas: 1 }, () => 0.5);
    s = ofertar(s, 0, () => 0.5);
    expect(s.historial[0].umbralPct).toBeNull();
    expect(s.historial[0].aceptada).toBe(true);
    expect(s.historial[0].jugador).toBe(100);
  });
  it('en el ultimátum una oferta ridícula puede acabar en cero', () => {
    // rng alto → responde el justiciero con umbral alto.
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rondas: 1 }, () => 0.99);
    s = ofertar(s, 1, () => 0.99);
    expect(s.historial[0].aceptada).toBe(false);
    expect(totalJugador(s.historial)).toBe(0);
  });
});

describe('ronda como respondedor', () => {
  it('llega con una oferta pendiente sobre la mesa', () => {
    const s = crearRepartoState({ ...REPARTO_DEFAULT, rol: 'respondedor' }, () => 0.5);
    expect(s.pendiente).not.toBeNull();
    expect(s.pendiente!.ofertaPct).toBeGreaterThanOrEqual(0);
  });
  it('rechazar deja a los dos sin nada', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rol: 'respondedor', rondas: 2 }, () => 0.5);
    s = responder(s, false, () => 0.5);
    expect(s.historial[0].aceptada).toBe(false);
    expect(s.historial[0].jugador).toBe(0);
    expect(s.historial[0].rival).toBe(0);
  });
  it('aceptar reparte el bote según la oferta', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rol: 'respondedor', rondas: 2 }, () => 0.5);
    const oferta = s.pendiente!.ofertaPct;
    s = responder(s, true, () => 0.5);
    expect(s.historial[0].jugador).toBeCloseTo(oferta, 10);
    expect(s.historial[0].jugador + s.historial[0].rival).toBe(100);
  });
  it('sirve una oferta nueva mientras queden rondas, y ninguna al acabar', () => {
    let s = crearRepartoState({ ...REPARTO_DEFAULT, rol: 'respondedor', rondas: 2 }, () => 0.5);
    s = responder(s, true, () => 0.2);
    expect(s.pendiente).not.toBeNull();
    s = responder(s, true, () => 0.2);
    expect(s.terminado).toBe(true);
    expect(s.pendiente).toBeNull();
  });
  it('en el dictador rechazar no sirve de nada', () => {
    let s = crearRepartoState(
      { ...REPARTO_DEFAULT, variante: 'dictador', rol: 'respondedor', rondas: 1 }, () => 0.5,
    );
    const oferta = s.pendiente!.ofertaPct;
    s = responder(s, false, () => 0.5);
    expect(s.historial[0].aceptada).toBe(true);
    expect(s.historial[0].jugador).toBeCloseTo(oferta, 10);
  });
  it('no acepta jugadas del rol equivocado', () => {
    const proponente = crearRepartoState(REPARTO_DEFAULT, () => 0.5);
    expect(responder(proponente, true, () => 0.5)).toBe(proponente);
    const respondedor = crearRepartoState({ ...REPARTO_DEFAULT, rol: 'respondedor' }, () => 0.5);
    expect(ofertar(respondedor, 50, () => 0.5)).toBe(respondedor);
  });
});

describe('analizarOfertas', () => {
  it('resume las ofertas de la clase', () => {
    const a = analizarOfertas([50, 40, 10, 0]);
    expect(a.media).toBe(25);
    expect(a.proporcionJusta).toBe(0.5);
    expect(a.proporcionTacana).toBe(0.5);
  });
  it('no divide por cero sin datos', () => {
    const a = analizarOfertas([]);
    expect(a.media).toBe(0);
    expect(a.proporcionJusta).toBe(0);
  });
});

describe('curvaRechazo', () => {
  const umbrales = [0, 20, 30, 40, 50];

  it('el rechazo cae a medida que sube la oferta', () => {
    const c = curvaRechazo(umbrales, 100);
    expect(c[0].rechazo).toBe(0.8);   // oferta 0: rechazan los cuatro con umbral > 0
    expect(c.at(-1)!.rechazo).toBe(0); // oferta 100: no rechaza nadie
  });
  it('recorre de 0 a 100 con el paso indicado', () => {
    expect(curvaRechazo(umbrales, 100, 10)).toHaveLength(11);
  });
  it('la mejor oferta ni es cero ni es el bote entero', () => {
    const mejor = mejorOferta(curvaRechazo(umbrales, 100));
    expect(mejor).not.toBeNull();
    expect(mejor!.ofertaPct).toBeGreaterThan(0);
    expect(mejor!.ofertaPct).toBeLessThan(100);
  });
  it('con una clase de calculadores lo óptimo es no dar nada', () => {
    const mejor = mejorOferta(curvaRechazo([0, 0, 0], 100));
    expect(mejor!.ofertaPct).toBe(0);
  });
  it('sin umbrales no rechaza nadie', () => {
    expect(curvaRechazo([], 100).every((p) => p.rechazo === 0)).toBe(true);
  });
  it('mejorOferta devuelve null con la curva vacía', () => {
    expect(mejorOferta([])).toBeNull();
  });
});
