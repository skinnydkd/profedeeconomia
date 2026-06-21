import { describe, it, expect } from 'vitest';
import { buildLlmsFull, type LlmsSubject } from './llms-full';

const subject: LlmsSubject = {
  slug: 'edmn-2bach',
  title: 'Empresa y Diseño de Modelos de Negocio',
  level: '2.º Bachillerato',
  marcoNormativo: 'Real Decreto 243/2022',
  modalidad: 'Modalidad Humanidades y CC. Sociales',
  units: [
    {
      unidad: 1,
      title: 'La persona emprendedora',
      lema: 'Empezamos por la base.',
      objetivos: ['Definir empresa', 'Reconocer el espíritu emprendedor'],
      conceptos_clave: ['empresa', 'emprendimiento'],
      sabers: ['A.1'],
      slug: '01-persona-emprendedora',
    },
  ],
};

describe('buildLlmsFull', () => {
  it('renders the header, subject and per-unit breakdown with absolute URLs', () => {
    const out = buildLlmsFull([subject]);
    expect(out).toMatch(/^# profedeeconomia\.es — contenido completo/);
    expect(out).toContain('## Empresa y Diseño de Modelos de Negocio — 2.º Bachillerato');
    expect(out).toContain('(Real Decreto 243/2022)');
    expect(out).toContain('### Unidad 1. La persona emprendedora');
    expect(out).toContain('https://www.profedeeconomia.es/edmn-2bach/libro/01-persona-emprendedora/');
    expect(out).toContain('- Definir empresa');
    expect(out).toContain('Conceptos clave: empresa, emprendimiento.');
    expect(out).toContain('Saberes básicos (LOMLOE): A.1.');
  });

  it('omits optional blocks when data is empty', () => {
    const bare: LlmsSubject = {
      ...subject,
      modalidad: undefined,
      units: [{ unidad: 2, title: 'U2', objetivos: [], conceptos_clave: [], sabers: [], slug: '02-x' }],
    };
    const out = buildLlmsFull([bare]);
    expect(out).not.toContain('Conceptos clave:');
    expect(out).not.toContain('Saberes básicos');
    expect(out).not.toContain('Objetivos de aprendizaje:');
    // no modalidad → no " · " modality separator on the subject heading line
    expect(out).toContain('## Empresa y Diseño de Modelos de Negocio — 2.º Bachillerato (');
  });

  it('appends the transversal sections when provided', () => {
    const out = buildLlmsFull([subject], [
      { label: 'Debates', slug: 'debates', description: 'Controversias económicas.' },
    ]);
    expect(out).toContain('## Secciones transversales');
    expect(out).toContain('[Debates](https://www.profedeeconomia.es/debates/): Controversias económicas.');
  });
});
