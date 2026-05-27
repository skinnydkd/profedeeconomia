import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBank } from './build-jocs-bank.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '__fixtures__', 'jocs-economics');

describe('build-jocs-bank', () => {
  let result;

  beforeAll(async () => {
    result = await buildBank({ sourceDir: FIXTURES });
  });

  it('emits manifest with version + totals + byCategoria + byDificultatBand', () => {
    expect(result.manifest.version).toBe(1);
    expect(result.manifest.totals.preguntas).toBe(2);
    expect(result.manifest.totals.byCategoria).toEqual({
      economia: 1,
      finances: 1,
      empresa: 0,
    });
    expect(result.manifest.totals.byDificultatBand).toEqual({
      basic_1_3: 1,
      mig_4_6: 0,
      alt_7_10: 1,
    });
  });

  it('emits bank with the 2 published preguntas (with correcta + explicacion)', () => {
    expect(result.bank.version).toBe(1);
    expect(result.bank.preguntas).toHaveLength(2);
    const eco = result.bank.preguntas.find((p) => p.id === 'eco-9001-test');
    expect(eco).toBeDefined();
    expect(eco.correcta).toBe(1);
    expect(eco.explicacion).toBe('Explicació econometria de test.');
    expect(eco.dificultat).toBe(2.5);
    expect(eco.categoria).toBe('economia');
  });

  it('excludes borrador entries from both manifest and bank', () => {
    expect(result.bank.preguntas.find((p) => p.id === 'emp-9001-borrador')).toBeUndefined();
    expect(result.manifest.totals.byCategoria.empresa).toBe(0);
  });

  it('manifest never leaks enunciado/opciones/correcta/explicacion', () => {
    const json = JSON.stringify(result.manifest);
    expect(json).not.toContain('Opció A');
    expect(json).not.toContain('correcta');
    expect(json).not.toContain('explicacion');
  });

  it('is idempotent on byte level except generatedAt', async () => {
    const second = await buildBank({ sourceDir: FIXTURES });
    const a = { ...result.manifest, generatedAt: null };
    const b = { ...second.manifest, generatedAt: null };
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
