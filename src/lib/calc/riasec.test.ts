import { describe, it, expect } from 'vitest';
import {
  PREGUNTAS,
  TIPOS,
  RIASEC_ORDEN,
  ESCALA_MIN,
  ESCALA_MAX,
  puntuar,
  dominantes,
  codigoHolland,
  evaluar,
  puntuacionesVacias,
  type RIASEC,
} from './riasec';

/** Build a respuestas map answering every question of `dims` with `valor`. */
function responder(valor: number, dims: RIASEC[] = [...RIASEC_ORDEN]): Record<string, number> {
  const res: Record<string, number> = {};
  for (const p of PREGUNTAS) {
    if (dims.includes(p.dimension)) res[p.id] = valor;
  }
  return res;
}

describe('dataset de preguntas RIASEC', () => {
  it('tiene exactamente 30 preguntas', () => {
    expect(PREGUNTAS.length).toBe(30);
  });

  it('tiene 5 preguntas por cada una de las 6 dimensiones', () => {
    for (const dim of RIASEC_ORDEN) {
      const n = PREGUNTAS.filter((p) => p.dimension === dim).length;
      expect(n).toBe(5);
    }
  });

  it('cada pregunta tiene id único y enunciado no vacío', () => {
    const ids = PREGUNTAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PREGUNTAS) {
      expect(p.texto.length).toBeGreaterThan(0);
      expect(RIASEC_ORDEN).toContain(p.dimension);
    }
  });
});

describe('descripciones y orientaciones por tipo', () => {
  it('cada dimensión tiene nombre, descripción y orientaciones', () => {
    for (const dim of RIASEC_ORDEN) {
      const t = TIPOS[dim];
      expect(t.letra).toBe(dim);
      expect(t.nombre.length).toBeGreaterThan(0);
      expect(t.descripcion.length).toBeGreaterThan(0);
      expect(t.orientaciones.estudios.length).toBeGreaterThan(0);
      expect(t.orientaciones.profesiones.length).toBeGreaterThan(0);
    }
  });
});

describe('puntuar', () => {
  it('una respuesta vacía deja todas las dimensiones a 0', () => {
    expect(puntuar({})).toEqual(puntuacionesVacias());
  });

  it('suma correctamente los valores de cada dimensión', () => {
    // All 5 R-questions at 4 → R = 20; everything else 0.
    const p = puntuar(responder(4, ['R']));
    expect(p.R).toBe(20);
    expect(p.I).toBe(0);
    expect(p.A).toBe(0);
    expect(p.S).toBe(0);
    expect(p.E).toBe(0);
    expect(p.C).toBe(0);
  });

  it('responder todo al máximo da el tope de 25 en cada dimensión', () => {
    const p = puntuar(responder(ESCALA_MAX));
    for (const dim of RIASEC_ORDEN) expect(p[dim]).toBe(25);
  });

  it('ignora valores fuera de la escala 1-5', () => {
    const p = puntuar({ r1: 0, r2: 6, r3: -3, r4: 5, r5: 3 });
    // Only r4 (5) and r5 (3) are valid.
    expect(p.R).toBe(8);
  });
});

describe('dominantes y código Holland', () => {
  it('responder al máximo solo una dimensión la hace dominante', () => {
    const p = puntuar(responder(ESCALA_MAX, ['S']));
    expect(dominantes(p)[0]).toBe('S');
    expect(codigoHolland(p).startsWith('S')).toBe(true);
  });

  it('devuelve un código de exactamente 3 letras válidas', () => {
    const code = codigoHolland(puntuar(responder(3)));
    expect(code).toHaveLength(3);
    for (const letra of code) expect(RIASEC_ORDEN).toContain(letra as RIASEC);
  });

  it('ordena las dominantes de mayor a menor puntuación', () => {
    // Make S highest, then A, then E clearly above the rest.
    const respuestas: Record<string, number> = {
      ...responder(5, ['S']), // S = 25
      ...responder(4, ['A']), // A = 20
      ...responder(3, ['E']), // E = 15
      ...responder(1, ['R', 'I', 'C']), // the rest low
    };
    const p = puntuar(respuestas);
    expect(dominantes(p)).toEqual(['S', 'A', 'E']);
    expect(codigoHolland(p)).toBe('SAE');
  });

  it('el desempate es determinista y sigue el orden canónico R>I>A>S>E>C', () => {
    // Everything tied at the max → first three in canonical order win.
    const p = puntuar(responder(ESCALA_MAX));
    expect(codigoHolland(p)).toBe('RIA');
    // Tie between A and S at the top → A wins (earlier in canonical order).
    const tie = puntuar(responder(5, ['A', 'S']));
    expect(dominantes(tie)[0]).toBe('A');
  });
});

describe('evaluar — resultado completo', () => {
  it('expone puntuaciones, código, dominantes y tipos coherentes', () => {
    const res = evaluar(responder(5, ['S']));
    expect(res.codigo).toHaveLength(3);
    expect(res.dominantes).toHaveLength(3);
    expect(res.tipos).toHaveLength(3);
    expect(res.dominantes[0]).toBe('S');
    expect(res.tipos[0].letra).toBe('S');
    expect(res.codigo).toBe(res.dominantes.join(''));
    // Each returned type carries its description + orientations.
    for (const t of res.tipos) {
      expect(t.descripcion.length).toBeGreaterThan(0);
      expect(t.orientaciones.estudios.length).toBeGreaterThan(0);
      expect(t.orientaciones.profesiones.length).toBeGreaterThan(0);
    }
  });

  it('el código del resultado coincide con codigoHolland sobre las mismas respuestas', () => {
    const respuestas = responder(4, ['I', 'R']);
    expect(evaluar(respuestas).codigo).toBe(codigoHolland(puntuar(respuestas)));
  });
});
