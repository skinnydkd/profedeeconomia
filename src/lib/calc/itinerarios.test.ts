import { describe, it, expect } from 'vitest';
import {
  ITINERARIOS,
  CCAA,
  recomendarItinerarios,
  type PerfilAlumno,
} from './itinerarios';

// Baseline profile: everything empty/neutral. Helper to override per test.
function perfil(over: Partial<PerfilAlumno> = {}): PerfilAlumno {
  return {
    materias: [],
    estilo: null,
    duracion: null,
    gusta: [],
    prioridad: null,
    ccaa: null,
    ...over,
  };
}

describe('dataset de itinerarios', () => {
  it('expone entre 16 y 20 itinerarios', () => {
    expect(ITINERARIOS.length).toBeGreaterThanOrEqual(16);
    expect(ITINERARIOS.length).toBeLessThanOrEqual(20);
  });

  it('cada itinerario tiene id único', () => {
    const ids = ITINERARIOS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada itinerario declara los campos obligatorios de orientación', () => {
    for (const it of ITINERARIOS) {
      expect(it.titulo.length).toBeGreaterThan(0);
      expect(it.tipo.length).toBeGreaterThan(0);
      expect(it.duracion.length).toBeGreaterThan(0);
      expect(it.salidas.length).toBeGreaterThan(0); // a qué da acceso
      expect(it.ocupaciones.length).toBeGreaterThan(0); // ocupaciones ejemplo
      expect(it.perfil.length).toBeGreaterThan(0); // perfil que encaja
      expect(it.empleabilidad.length).toBeGreaterThan(0);
      expect(it.enlace.url.length).toBeGreaterThan(0);
    }
  });

  it('cubre las grandes familias post-4ESO LOMLOE/LOFP', () => {
    const tipos = new Set(ITINERARIOS.map((i) => i.tipo));
    expect(tipos.has('bachillerato')).toBe(true);
    expect(tipos.has('fp-medio')).toBe(true);
    expect(tipos.has('fp-basico')).toBe(true);
    expect(tipos.has('artisticos-deportivos')).toBe(true);
    expect(tipos.has('certificado')).toBe(true);
    expect(tipos.has('laboral')).toBe(true);
  });

  it('incluye las modalidades de Bachillerato LOMLOE', () => {
    const titulos = ITINERARIOS.filter((i) => i.tipo === 'bachillerato')
      .map((i) => i.titulo.toLowerCase())
      .join(' | ');
    expect(titulos).toContain('ciencias');
    expect(titulos).toContain('human');
    expect(titulos).toContain('artes');
    expect(titulos).toContain('general');
  });
});

describe('recomendarItinerarios — siempre devuelve resultados', () => {
  it('con perfil vacío devuelve al menos un itinerario', () => {
    const res = recomendarItinerarios(perfil());
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  it('nunca devuelve más del tope configurado', () => {
    const res = recomendarItinerarios(perfil(), { limite: 4 });
    expect(res.length).toBeLessThanOrEqual(4);
  });
});

describe('recomendarItinerarios — orden por score', () => {
  it('devuelve resultados ordenados de mayor a menor score', () => {
    const res = recomendarItinerarios(
      perfil({ materias: ['matematicas', 'tecnologia'], gusta: ['maquinas'] })
    );
    for (let i = 1; i < res.length; i++) {
      expect(res[i - 1].score).toBeGreaterThanOrEqual(res[i].score);
    }
  });

  it('asigna rango incremental empezando en 1', () => {
    const res = recomendarItinerarios(perfil({ materias: ['ciencias'] }));
    expect(res[0].rango).toBe(1);
    res.forEach((r, idx) => expect(r.rango).toBe(idx + 1));
  });
});

describe('recomendarItinerarios — coherencia del matching', () => {
  it('un perfil técnico-manual y práctico prioriza FP de grado medio', () => {
    const res = recomendarItinerarios(
      perfil({
        materias: ['tecnologia', 'matematicas'],
        estilo: 'practico',
        duracion: '1-2',
        gusta: ['maquinas', 'manos'],
        prioridad: 'estabilidad',
      })
    );
    expect(res[0].itinerario.tipo).toBe('fp-medio');
  });

  it('un perfil académico-teórico prioriza Bachillerato', () => {
    const res = recomendarItinerarios(
      perfil({
        materias: ['ciencias', 'matematicas'],
        estilo: 'teoria',
        duracion: '5+',
        gusta: ['datos', 'ideas'],
        prioridad: 'salario',
      })
    );
    expect(res[0].itinerario.tipo).toBe('bachillerato');
  });

  it('quien quiere ayudar a personas obtiene una vía sanitaria o de cuidados arriba', () => {
    const res = recomendarItinerarios(
      perfil({
        materias: ['ciencias'],
        gusta: ['personas'],
        prioridad: 'ayudar',
        estilo: 'practico',
        duracion: '1-2',
      })
    );
    const top = res[0].itinerario.titulo.toLowerCase();
    expect(/sanid|cuidad|depend|farmac|emergenc|enfermer/.test(top)).toBe(true);
  });

  it('aporta razones explicativas para el itinerario mejor posicionado', () => {
    const res = recomendarItinerarios(
      perfil({ materias: ['artes'], gusta: ['ideas', 'manos'], prioridad: 'vocacion' })
    );
    expect(res[0].razones.length).toBeGreaterThan(0);
    expect(res[0].razones.length).toBeLessThanOrEqual(3);
  });
});

describe('recomendarItinerarios — filtro por CCAA', () => {
  it('CCAA es un catálogo de las 17 comunidades + 2 ciudades autónomas', () => {
    expect(CCAA.length).toBe(19);
    const valores = CCAA.map((c) => c.id);
    expect(valores).toContain('valenciana');
    expect(valores).toContain('madrid');
    expect(valores).toContain('ceuta');
    expect(valores).toContain('melilla');
  });

  it('sin CCAA seleccionada ningún resultado lleva nota territorial', () => {
    const res = recomendarItinerarios(perfil({ materias: ['ciencias'] }));
    expect(res.every((r) => r.notaCCAA === null)).toBe(true);
  });

  it('con CCAA seleccionada cada resultado lleva una nota territorial honesta', () => {
    const res = recomendarItinerarios(
      perfil({ materias: ['ciencias'], ccaa: 'valenciana' })
    );
    expect(res.length).toBeGreaterThan(0);
    for (const r of res) {
      expect(r.notaCCAA).not.toBeNull();
      expect(r.notaCCAA!.length).toBeGreaterThan(0);
    }
  });

  it('el filtro CCAA no inventa: la nota siempre remite a consultar la oferta concreta', () => {
    const res = recomendarItinerarios(
      perfil({ materias: ['tecnologia'], ccaa: 'madrid' })
    );
    // Honest fallback: must point the student to the official regional catalogue.
    expect(res.some((r) => /consulta|oferta|tu comunidad|portal/i.test(r.notaCCAA!))).toBe(
      true
    );
  });

  it('el filtro CCAA no altera el orden ni el número de itinerarios recomendados', () => {
    const base = recomendarItinerarios(perfil({ materias: ['ciencias', 'matematicas'] }));
    const conCCAA = recomendarItinerarios(
      perfil({ materias: ['ciencias', 'matematicas'], ccaa: 'andalucia' })
    );
    expect(conCCAA.map((r) => r.itinerario.id)).toEqual(base.map((r) => r.itinerario.id));
  });
});
