import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
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

  it('emits a manifest per language with the expected asignatura entry', () => {
    for (const lang of ['es', 'ca']) {
      const manifest = result.manifests[lang];
      expect(manifest.version).toBe(2);
      expect(manifest.lang).toBe(lang);
      expect(manifest.asignaturas).toHaveLength(1);
      const asig = manifest.asignaturas[0];
      expect(asig.slug).toBe('test-asig-a');
      expect(asig.name).toBe('Asig Test A');
      expect(asig.shortName).toBe('AsigA');
      expect(asig.color).toBe('#123456');
    }
  });

  it('only includes published units, sorted by numero', () => {
    const asig = result.manifests.es.asignaturas[0];
    expect(asig.unidades).toHaveLength(2);
    expect(asig.unidades.map((u) => u.numero)).toEqual([1, 2]);
  });

  it('reports preguntasCount per unit without exposing question content', () => {
    const asig = result.manifests.es.asignaturas[0];
    expect(asig.unidades[0].preguntasCount).toBe(2);
    expect(asig.unidades[1].preguntasCount).toBe(1);
    for (const manifest of Object.values(result.manifests)) {
      const json = JSON.stringify(manifest);
      expect(json).not.toContain('Capital de España');
      expect(json).not.toContain("Capital d'Espanya");
      expect(json).not.toContain('correcta');
    }
  });

  it('emits questions keyed by `${lang}:${asignatura}/${unidad}`', () => {
    expect(result.questions.preguntas['es:test-asig-a/1']).toHaveLength(2);
    expect(result.questions.preguntas['es:test-asig-a/2']).toHaveLength(1);
    expect(result.questions.preguntas['es:test-asig-a/1'][0].enunciado).toBe('¿2 + 2?');
    expect(result.questions.preguntas['es:test-asig-a/1'][0].correcta).toBe(1);
  });

  it('keeps the Valencian translation in its own bank instead of dropping it', () => {
    // Before, u1.ca.md and u1.md collided on `test-asig-a/1` and one was lost.
    expect(result.questions.preguntas['ca:test-asig-a/1'].map((q) => q.enunciado)).toEqual([
      'Quant fa 2 + 2?',
      "Capital d'Espanya?",
    ]);
    expect(result.questions.preguntas['es:test-asig-a/1'].map((q) => q.enunciado)).toEqual([
      '¿2 + 2?',
      '¿Capital de España?',
    ]);
    expect(result.manifests.ca.asignaturas[0].unidades[0].title).toBe('Unitat 1 — Conceptes bàsics');
    expect(result.manifests.es.asignaturas[0].unidades[0].title).toBe('Unidad 1 — Conceptos básicos');
  });

  it('falls back to Spanish in the Valencian bank for units without a translation', () => {
    expect(result.questions.preguntas['ca:test-asig-a/2']).toEqual(result.questions.preguntas['es:test-asig-a/2']);
    expect(result.manifests.ca.asignaturas[0].unidades.map((u) => u.numero)).toEqual([1, 2]);
    expect(result.manifests.ca.asignaturas[0].unidades[1].title).toBe('Unidad 2 — Mercados');
  });

  it('excludes draft (estado: borrador) tests from questions too', () => {
    expect(result.questions.preguntas['es:test-asig-a/3']).toBeUndefined();
    expect(result.questions.preguntas['ca:test-asig-a/3']).toBeUndefined();
  });

  it('stamps the same bank version on the manifests and the server bank', () => {
    expect(result.questions.bankVersion).toMatch(/^[0-9a-f]{12}$/);
    expect(result.manifests.es.bankVersion).toBe(result.questions.bankVersion);
    expect(result.manifests.ca.bankVersion).toBe(result.questions.bankVersion);
  });

  it('is idempotent on byte level except generatedAt', async () => {
    const second = await buildManifest({ sourceDir: FIXTURES, meta: TEST_META });
    for (const lang of ['es', 'ca']) {
      const a = { ...result.manifests[lang], generatedAt: null };
      const b = { ...second.manifests[lang], generatedAt: null };
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
    expect(second.questions.bankVersion).toBe(result.questions.bankVersion);
  });

  it('changes the bank version when a question changes', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cajut-manifest-'));
    try {
      await fs.cp(FIXTURES, dir, { recursive: true });
      const u2 = path.join(dir, 'asignaturas', 'test-asig-a', 'tests', 'u2.md');
      await fs.writeFile(u2, (await fs.readFile(u2, 'utf8')).replace('¿Ley de oferta?', '¿Ley de la oferta?'));
      const changed = await buildManifest({ sourceDir: dir, meta: TEST_META });
      expect(changed.questions.bankVersion).not.toBe(result.questions.bankVersion);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
