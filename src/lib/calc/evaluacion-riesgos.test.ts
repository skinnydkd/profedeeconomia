import { describe, it, expect } from 'vitest';
import { evaluar, valorarRiesgo, type Riesgo } from './evaluacion-riesgos';

describe('valorarRiesgo', () => {
  it('puts the mildest combination at trivial', () => {
    expect(valorarRiesgo('baja', 'ligeramente-daninio')).toBe('trivial');
  });
  it('puts the worst combination at intolerable', () => {
    expect(valorarRiesgo('alta', 'extremadamente-daninio')).toBe('intolerable');
  });
  it('is symmetric on the diagonal', () => {
    expect(valorarRiesgo('baja', 'extremadamente-daninio')).toBe('moderado');
    expect(valorarRiesgo('alta', 'ligeramente-daninio')).toBe('moderado');
  });
  it('rises with probability at a fixed consequence', () => {
    expect(valorarRiesgo('baja', 'daninio')).toBe('tolerable');
    expect(valorarRiesgo('media', 'daninio')).toBe('moderado');
    expect(valorarRiesgo('alta', 'daninio')).toBe('importante');
  });
  it('rejects an unknown value', () => {
    expect(valorarRiesgo('altisima' as never, 'daninio')).toBeNull();
    expect(valorarRiesgo('alta', 'catastrofico' as never)).toBeNull();
  });
});

describe('evaluar', () => {
  const riesgos: Riesgo[] = [
    { id: 'suelo-mojado', probabilidad: 'media', consecuencia: 'daninio' },
    { id: 'sin-proteccion-sierra', probabilidad: 'alta', consecuencia: 'extremadamente-daninio' },
    { id: 'polvo-leve', probabilidad: 'baja', consecuencia: 'ligeramente-daninio' },
    { id: 'ruido', probabilidad: 'alta', consecuencia: 'daninio' },
  ];
  const r = evaluar(riesgos);

  it('assigns a level to every risk', () => {
    expect(r.valido).toBe(true);
    expect(r.riesgos).toHaveLength(4);
  });

  it('sorts the most severe first', () => {
    expect(r.riesgos[0].id).toBe('sin-proteccion-sierra');
    expect(r.riesgos[0].nivel).toBe('intolerable');
    expect(r.riesgos[r.riesgos.length - 1].nivel).toBe('trivial');
  });

  it('stops work only for importante and intolerable', () => {
    const nivelDe = (id: string) => r.riesgos.find((x) => x.id === id)!;
    expect(nivelDe('sin-proteccion-sierra').puedeSeguirTrabajando).toBe(false);
    expect(nivelDe('ruido').nivel).toBe('importante');
    expect(nivelDe('ruido').puedeSeguirTrabajando).toBe(false);
    expect(nivelDe('suelo-mojado').puedeSeguirTrabajando).toBe(true);
    expect(nivelDe('polvo-leve').puedeSeguirTrabajando).toBe(true);
  });

  it('requires action for everything above trivial', () => {
    expect(r.riesgos.find((x) => x.id === 'polvo-leve')!.requiereAccion).toBe(false);
    expect(r.riesgos.find((x) => x.id === 'suelo-mojado')!.requiereAccion).toBe(true);
  });

  it('lists the blocking risks', () => {
    expect(r.bloqueantes.map((x) => x.id)).toEqual(['sin-proteccion-sierra', 'ruido']);
  });

  it('counts risks per level', () => {
    expect(r.porNivel.intolerable).toBe(1);
    expect(r.porNivel.importante).toBe(1);
    expect(r.porNivel.moderado).toBe(1);
    expect(r.porNivel.trivial).toBe(1);
    expect(r.porNivel.tolerable).toBe(0);
  });

  it('rejects an empty list', () => {
    expect(evaluar([]).valido).toBe(false);
  });

  it('rejects a risk with an unknown value rather than guessing', () => {
    expect(evaluar([{ id: 'x', probabilidad: 'altisima' as never, consecuencia: 'daninio' }]).valido).toBe(false);
  });
});
