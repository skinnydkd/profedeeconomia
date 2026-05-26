import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest } from './build-cajut-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '__fixtures__', 'cajut-manifest');

const TEST_META = [
  { slug: 'test-asig-a', name: 'Asig Test A', shortName: 'AsigA', color: '#123456' },
];

describe('build-cajut-manifest', () => {
  let result;

  beforeAll(async () => {
    result = await buildManifest({ sourceDir: FIXTURES, meta: TEST_META });
  });

  it('emits a manifest with the expected asignatura entry', () => {
    expect(result.manifest.version).toBe(1);
    expect(result.manifest.asignaturas).toHaveLength(1);
    const asig = result.manifest.asignaturas[0];
    expect(asig.slug).toBe('test-asig-a');
    expect(asig.name).toBe('Asig Test A');
    expect(asig.shortName).toBe('AsigA');
    expect(asig.color).toBe('#123456');
  });

  it('only includes published units, sorted by numero', () => {
    const asig = result.manifest.asignaturas[0];
    expect(asig.unidades).toHaveLength(2);
    expect(asig.unidades.map((u) => u.numero)).toEqual([1, 2]);
  });

  it('reports preguntasCount per unit without exposing question content', () => {
    const asig = result.manifest.asignaturas[0];
    expect(asig.unidades[0].preguntasCount).toBe(2);
    expect(asig.unidades[1].preguntasCount).toBe(1);
    const json = JSON.stringify(result.manifest);
    expect(json).not.toContain('Capital de España');
    expect(json).not.toContain('correcta');
  });

  it('emits questions keyed by `${asignatura}/${unidad}`', () => {
    const key1 = 'test-asig-a/1';
    const key2 = 'test-asig-a/2';
    expect(result.questions.preguntas[key1]).toHaveLength(2);
    expect(result.questions.preguntas[key2]).toHaveLength(1);
    expect(result.questions.preguntas[key1][0].enunciado).toBe('¿2 + 2?');
    expect(result.questions.preguntas[key1][0].correcta).toBe(1);
  });

  it('excludes draft (estado: borrador) tests from questions too', () => {
    expect(result.questions.preguntas['test-asig-a/3']).toBeUndefined();
  });

  it('is idempotent on byte level except generatedAt', async () => {
    const second = await buildManifest({ sourceDir: FIXTURES, meta: TEST_META });
    const a = { ...result.manifest, generatedAt: null };
    const b = { ...second.manifest, generatedAt: null };
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
