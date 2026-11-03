import { describe, it, expect } from 'vitest';
import { rondaYaCalculada } from './ronda';

describe('rondaYaCalculada', () => {
  const r = (ronda: number) => ({ ronda });

  it('is false while the round is being decided', () => {
    expect(rondaYaCalculada({ ronda: 2, fase: 'decisiones' }, [r(1)])).toBe(false);
  });

  it('is true when a failed close left this round\'s results saved', () => {
    expect(rondaYaCalculada({ ronda: 2, fase: 'decisiones' }, [r(1), r(2)])).toBe(true);
    expect(rondaYaCalculada({ ronda: 2, fase: 'resultados' }, [r(1), r(2)])).toBe(true);
  });

  it('is false once the league is over, where the last round has its results', () => {
    expect(rondaYaCalculada({ ronda: 8, fase: 'cerrada' }, [r(7), r(8)])).toBe(false);
  });
});
