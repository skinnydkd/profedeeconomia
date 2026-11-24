import { describe, expect, it } from 'vitest';
import { partykitDisponible, supabaseDisponible } from './servicios';

describe('partykitDisponible', () => {
  it('is off in production without a host or with the localhost fallback', () => {
    expect(partykitDisponible(undefined, true)).toBe(false);
    expect(partykitDisponible('', true)).toBe(false);
    expect(partykitDisponible('127.0.0.1:1999', true)).toBe(false);
    expect(partykitDisponible('localhost:1999', true)).toBe(false);
  });

  it('is on in production with a real host', () => {
    expect(partykitDisponible('pde-games.example.partykit.dev', true)).toBe(true);
  });

  it('is always on in development (local partykit dev)', () => {
    expect(partykitDisponible(undefined, false)).toBe(true);
  });
});

describe('supabaseDisponible', () => {
  it('is off in production without SUPABASE_URL', () => {
    expect(supabaseDisponible(undefined, true)).toBe(false);
    expect(supabaseDisponible('  ', true)).toBe(false);
  });

  it('is on in production with a URL', () => {
    expect(supabaseDisponible('https://abc.supabase.co', true)).toBe(true);
  });

  it('is always on in development', () => {
    expect(supabaseDisponible(undefined, false)).toBe(true);
  });
});
