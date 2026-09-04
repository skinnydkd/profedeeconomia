import { describe, it, expect } from 'vitest';
import { auditar, ACCIONES } from './huella-digital';

describe('ACCIONES', () => {
  it('has unique ids', () => {
    expect(new Set(ACCIONES.map((a) => a.id)).size).toBe(ACCIONES.length);
  });
  it('covers the four areas', () => {
    expect(new Set(ACCIONES.map((a) => a.area))).toEqual(
      new Set(['acceso', 'privacidad', 'reputacion', 'derechos']),
    );
  });
  it('weights every action between 1 and 3', () => {
    expect(ACCIONES.every((a) => a.peso >= 1 && a.peso <= 3)).toBe(true);
  });
});

describe('auditar', () => {
  it('lists everything as pending when nothing is done', () => {
    const r = auditar([]);
    expect(r.valido).toBe(true);
    expect(r.hechas).toBe(0);
    expect(r.pendientes).toHaveLength(ACCIONES.length);
    expect(r.total).toBe(ACCIONES.length);
  });

  it('lists nothing as pending when everything is done', () => {
    const r = auditar(ACCIONES.map((a) => a.id));
    expect(r.pendientes).toHaveLength(0);
    expect(r.hechas).toBe(ACCIONES.length);
    expect(r.minutosPendientes).toBe(0);
    expect(r.siguientes).toHaveLength(0);
  });

  it('puts the heaviest pending actions first', () => {
    const r = auditar([]);
    const pesos = r.pendientes.map((a) => a.peso);
    expect(pesos).toEqual([...pesos].sort((a, b) => b - a));
    expect(r.pendientes[0].peso).toBe(3);
  });

  it('breaks ties by how long the action takes', () => {
    const r = auditar([]);
    const treses = r.pendientes.filter((a) => a.peso === 3).map((a) => a.minutos);
    expect(treses).toEqual([...treses].sort((a, b) => a - b));
  });

  it('proposes at most two next actions', () => {
    expect(auditar([]).siguientes).toHaveLength(2);
    const casiTodo = ACCIONES.slice(1).map((a) => a.id);
    expect(auditar(casiTodo).siguientes).toHaveLength(1);
  });

  it('adds up the minutes still pending', () => {
    const r = auditar([]);
    expect(r.minutosPendientes).toBe(ACCIONES.reduce((s, a) => s + a.minutos, 0));
  });

  it('counts progress per area', () => {
    const acceso = ACCIONES.filter((a) => a.area === 'acceso');
    const r = auditar(acceso.map((a) => a.id));
    expect(r.porArea.acceso.hechas).toBe(acceso.length);
    expect(r.porArea.acceso.total).toBe(acceso.length);
    expect(r.porArea.privacidad.hechas).toBe(0);
  });

  it('accepts a Set as well as an array', () => {
    const ids = ACCIONES.slice(0, 3).map((a) => a.id);
    expect(auditar(new Set(ids)).hechas).toBe(auditar(ids).hechas);
  });

  it('ignores ids that are not part of the audit', () => {
    const r = auditar(['no-existe', 'tampoco']);
    expect(r.hechas).toBe(0);
    expect(r.pendientes).toHaveLength(ACCIONES.length);
  });
});
