import { describe, it, expect } from 'vitest';
import { ASIGNATURAS_PUBLICADAS } from './asignaturas';
import { SITE } from './seo';
import { buildLlmsIndex } from './llms-index';

describe('buildLlmsIndex', () => {
  const out = buildLlmsIndex();

  it('lists every published subject and states the real count', () => {
    for (const a of ASIGNATURAS_PUBLICADAS) expect(out).toContain(`${SITE.url}/${a.slug}/)`);
    expect(out).toContain(`- ${ASIGNATURAS_PUBLICADAS.length} asignaturas publicadas`);
    expect(out).toContain('cjd-bach');
  });

  it('carries the contact email from SITE', () => {
    expect(out).toContain(`- Email: ${SITE.email}`);
  });
});
