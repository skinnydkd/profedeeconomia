import { describe, it, expect } from 'vitest';
import {
  DEFAULTS,
  presupuestoAnual,
  presupuestoGrado,
  type PresupuestoAnualInput,
} from './presupuesto-uni';

// Baseline yearly input "living away" with round numbers. Helper to override.
function anual(over: Partial<PresupuestoAnualInput> = {}): PresupuestoAnualInput {
  return {
    matricula: 1000,
    alojamiento: 5000,
    manutencion: 3000,
    material: 400,
    transporte: 600,
    viveEnCasa: false,
    ...over,
  };
}

describe('defaults orientativos', () => {
  it('expone una matrícula pública dentro del rango orientativo (700–1.700 €)', () => {
    expect(DEFAULTS.matricula).toBeGreaterThanOrEqual(700);
    expect(DEFAULTS.matricula).toBeLessThanOrEqual(1700);
  });

  it('el grado dura 4 años por defecto', () => {
    expect(DEFAULTS.anos).toBe(4);
  });

  it('vivir fuera tiene alojamiento mayor que vivir en casa', () => {
    expect(DEFAULTS.alojamientoFuera).toBeGreaterThan(DEFAULTS.alojamientoCasa);
  });
});

describe('presupuestoAnual — desglose y total', () => {
  it('suma todas las partidas en el total (viviendo fuera)', () => {
    const r = presupuestoAnual(anual());
    expect(r.total).toBe(1000 + 5000 + 3000 + 400 + 600);
    expect(r.desglose.alojamiento).toBe(5000);
  });

  it('viviendo en casa el alojamiento es 0 por defecto', () => {
    const r = presupuestoAnual(anual({ viveEnCasa: true }));
    expect(r.desglose.alojamiento).toBe(0);
    // total excludes the 5000 residence rent
    expect(r.total).toBe(1000 + 0 + 3000 + 400 + 600);
  });

  it('viviendo en casa admite un alojamiento reducido (parte de gastos del hogar)', () => {
    const r = presupuestoAnual(anual({ viveEnCasa: true, alojamientoEnCasa: 800 }));
    expect(r.desglose.alojamiento).toBe(800);
  });

  it('vivir fuera cuesta más que vivir en casa con el resto igual', () => {
    const fuera = presupuestoAnual(anual({ viveEnCasa: false }));
    const casa = presupuestoAnual(anual({ viveEnCasa: true }));
    expect(fuera.total).toBeGreaterThan(casa.total);
  });

  it('trata importes negativos o no finitos como 0', () => {
    const r = presupuestoAnual(anual({ matricula: -500, material: NaN }));
    expect(r.desglose.matricula).toBe(0);
    expect(r.desglose.material).toBe(0);
  });
});

describe('presupuestoGrado — coste total de los 4 años', () => {
  it('con coste anual constante, el total bruto = anual × años', () => {
    const r = presupuestoGrado(anual());
    expect(r.anos).toBe(4);
    expect(r.totalBruto).toBe(r.anual.total * 4);
  });

  it('usa 4 años por defecto cuando no se indica', () => {
    const r = presupuestoGrado(anual());
    expect(r.anos).toBe(DEFAULTS.anos);
  });

  it('respeta un número de años distinto', () => {
    const r = presupuestoGrado({ ...anual(), anos: 5 });
    expect(r.anos).toBe(5);
    expect(r.totalBruto).toBe(r.anual.total * 5);
  });

  it('limita los años a un mínimo de 1 (no admite 0 ni negativos)', () => {
    expect(presupuestoGrado({ ...anual(), anos: 0 }).anos).toBe(1);
    expect(presupuestoGrado({ ...anual(), anos: -3 }).anos).toBe(1);
  });
});

describe('presupuestoGrado — efecto de la beca', () => {
  it('sin beca, el neto es igual al bruto', () => {
    const r = presupuestoGrado(anual());
    expect(r.becaTotal).toBe(0);
    expect(r.totalNeto).toBe(r.totalBruto);
  });

  it('una beca anual baja el coste neto y se multiplica por los años', () => {
    const r = presupuestoGrado({ ...anual(), beca: 1500, becaModo: 'anual' });
    expect(r.becaTotal).toBe(1500 * 4);
    expect(r.totalNeto).toBe(r.totalBruto - 1500 * 4);
    expect(r.totalNeto).toBeLessThan(r.totalBruto);
  });

  it('una beca total se aplica una sola vez sobre el grado', () => {
    const r = presupuestoGrado({ ...anual(), beca: 4000, becaModo: 'total' });
    expect(r.becaTotal).toBe(4000);
    expect(r.totalNeto).toBe(r.totalBruto - 4000);
  });

  it('la beca cambia mucho el panorama: a más beca, menor coste neto', () => {
    const poca = presupuestoGrado({ ...anual(), beca: 500, becaModo: 'anual' });
    const mucha = presupuestoGrado({ ...anual(), beca: 3000, becaModo: 'anual' });
    expect(mucha.totalNeto).toBeLessThan(poca.totalNeto);
  });

  it('una beca mayor que el coste deja el neto en 0, nunca negativo', () => {
    const r = presupuestoGrado({ ...anual(), beca: 999999, becaModo: 'total' });
    expect(r.totalNeto).toBe(0);
    expect(r.totalNeto).toBeGreaterThanOrEqual(0);
  });

  it('caso pedagógico: la pública en casa con beca puede salir muy barata', () => {
    // Living at home + a decent grant -> a 4-year public degree is affordable.
    const r = presupuestoGrado({
      matricula: 1000,
      alojamiento: 5000,
      manutencion: 1200,
      material: 400,
      transporte: 1000,
      viveEnCasa: true,
      beca: 2000,
      becaModo: 'anual',
    });
    expect(r.totalNeto).toBeLessThan(r.totalBruto);
    expect(r.totalNeto).toBeGreaterThanOrEqual(0);
  });
});
