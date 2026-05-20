import { describe, it, expect } from 'vitest';
import {
  validateCV,
  formatDateRange,
  endYearOf,
  truncate,
  sortExperiencia,
  composeCVLayout,
  sanitizeForPdf,
  type CVData,
  type ExperienciaItem,
} from './cv-pdf';

const emptyData = (): CVData => ({
  personales: { nombre: '', ciudad: '', email: '', movil: '', linkedin: '' },
  resumen: '',
  experiencia: [{ puesto: '', empresa: '', fechas: '', descripcion: '' }],
  formacion: [{ titulo: '', centro: '', anio: '' }],
  idiomas: [{ idioma: '', nivel: 'A2' }],
  habilidades: '',
  voluntariado: '',
});

const exp = (over: Partial<ExperienciaItem>): ExperienciaItem => ({
  puesto: '',
  empresa: '',
  fechas: '',
  descripcion: '',
  ...over,
});

describe('validateCV', () => {
  it('fails when the name is missing', () => {
    const r = validateCV(emptyData());
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
  });
  it('passes with only a name (first-CV minimum)', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía Pérez';
    expect(validateCV(d).ok).toBe(true);
  });
  it('treats whitespace-only name as missing', () => {
    const d = emptyData();
    d.personales.nombre = '   ';
    expect(validateCV(d).ok).toBe(false);
  });
});

describe('formatDateRange', () => {
  it('normalises a hyphen range to en-dash with spaces', () => {
    expect(formatDateRange('06/2025 - 09/2025')).toBe('06/2025 – 09/2025');
  });
  it('normalises a textual "a" range', () => {
    expect(formatDateRange('junio 2025 a septiembre 2025')).toBe(
      'junio 2025 – septiembre 2025'
    );
  });
  it('collapses extra whitespace', () => {
    expect(formatDateRange('  2024    2025 ')).toBe('2024 2025');
  });
  it('returns empty string for empty input', () => {
    expect(formatDateRange('')).toBe('');
    expect(formatDateRange('   ')).toBe('');
  });
});

describe('endYearOf', () => {
  it('picks the last year in a range', () => {
    expect(endYearOf('06/2024 - 09/2025')).toBe(2025);
  });
  it('returns the single year present', () => {
    expect(endYearOf('verano 2023')).toBe(2023);
  });
  it('returns 0 when no year present', () => {
    expect(endYearOf('actualmente')).toBe(0);
    expect(endYearOf('')).toBe(0);
  });
});

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('hola', 10)).toBe('hola');
  });
  it('adds an ellipsis when cut', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
});

describe('sortExperiencia', () => {
  it('orders newest end-year first', () => {
    const items = [
      exp({ puesto: 'A', fechas: '2022' }),
      exp({ puesto: 'B', fechas: '2025' }),
      exp({ puesto: 'C', fechas: '2024' }),
    ];
    expect(sortExperiencia(items).map((x) => x.puesto)).toEqual(['B', 'C', 'A']);
  });
  it('keeps undated items last and stable for equal years', () => {
    const items = [
      exp({ puesto: 'sin fecha' }),
      exp({ puesto: 'X', fechas: '2024' }),
      exp({ puesto: 'Y', fechas: '2024' }),
    ];
    expect(sortExperiencia(items).map((x) => x.puesto)).toEqual([
      'X',
      'Y',
      'sin fecha',
    ]);
  });
});

describe('composeCVLayout', () => {
  it('builds the header with a joined contact line', () => {
    const d = emptyData();
    d.personales = {
      nombre: 'Lucía Pérez',
      ciudad: 'Valencia',
      email: 'lucia@mail.com',
      movil: '600111222',
      linkedin: '',
    };
    const { header } = composeCVLayout(d);
    expect(header.nombre).toBe('Lucía Pérez');
    expect(header.contacto).toBe('Valencia · lucia@mail.com · 600111222');
  });

  it('omits every empty section', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    expect(composeCVLayout(d).blocks).toEqual([]);
  });

  it('emits side blocks before main blocks in the expected order', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    d.resumen = 'Estudiante motivada.';
    d.experiencia = [exp({ puesto: 'Becaria', empresa: 'Tienda', fechas: '2025' })];
    d.formacion = [{ titulo: 'ESO', centro: 'IES', anio: '2026' }];
    d.idiomas = [
      { idioma: 'Inglés', nivel: 'B1' },
      { idioma: '', nivel: 'A2' },
    ];
    d.habilidades = 'Excel, Canva';
    d.voluntariado = 'Banco de alimentos';

    const ids = composeCVLayout(d).blocks.map((b) => b.id);
    expect(ids).toEqual([
      'idiomas',
      'habilidades',
      'voluntariado',
      'resumen',
      'experiencia',
      'formacion',
    ]);
  });

  it('assigns columns correctly', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    d.idiomas = [{ idioma: 'Inglés', nivel: 'B1' }];
    d.resumen = 'Perfil.';
    const byId = Object.fromEntries(
      composeCVLayout(d).blocks.map((b) => [b.id, b.column])
    );
    expect(byId.idiomas).toBe('side');
    expect(byId.resumen).toBe('main');
  });

  it('filters empty idioma rows and formats them', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    d.idiomas = [
      { idioma: 'Inglés', nivel: 'B2' },
      { idioma: '', nivel: 'A2' },
    ];
    const block = composeCVLayout(d).blocks.find((b) => b.id === 'idiomas');
    expect(block?.lines).toEqual([{ text: 'Inglés — B2', style: 'bullet' }]);
  });

  it('sorts experience newest-first and formats date ranges into meta lines', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    d.experiencia = [
      exp({ puesto: 'Antiguo', empresa: 'A', fechas: '2022' }),
      exp({ puesto: 'Reciente', empresa: 'B', fechas: '06/2025 - 09/2025' }),
    ];
    const block = composeCVLayout(d).blocks.find((b) => b.id === 'experiencia');
    expect(block?.lines[0]).toEqual({ text: 'Reciente · B', style: 'subtitle' });
    expect(block?.lines[1]).toEqual({ text: '06/2025 – 09/2025', style: 'meta' });
  });

  it('uses a dash placeholder when puesto is empty but empresa exists', () => {
    const d = emptyData();
    d.personales.nombre = 'Lucía';
    d.experiencia = [exp({ empresa: 'Solo empresa' })];
    const block = composeCVLayout(d).blocks.find((b) => b.id === 'experiencia');
    expect(block?.lines[0]).toEqual({ text: '— · Solo empresa', style: 'subtitle' });
  });
});

describe('sanitizeForPdf', () => {
  it('keeps Latin-1 Spanish accents intact', () => {
    expect(sanitizeForPdf('Atención, gestión y diseño')).toBe(
      'Atención, gestión y diseño'
    );
  });
  it('keeps the euro sign and inverted marks', () => {
    expect(sanitizeForPdf('¿Cuánto? ¡500 €!')).toBe('¿Cuánto? ¡500 €!');
  });
  it('down-converts dashes, smart quotes and ellipsis', () => {
    expect(sanitizeForPdf('A — B – C')).toBe('A - B - C');
    expect(sanitizeForPdf('“hola” ‘adiós’')).toBe('"hola" \'adiós\'');
    expect(sanitizeForPdf('etc…')).toBe('etc...');
  });
  it('replaces non-breaking spaces with regular spaces', () => {
    expect(sanitizeForPdf('500 €')).toBe('500 €');
  });
});
