import { describe, it, expect } from 'vitest';
import { refuerzoPdfName } from './refuerzo';

describe('refuerzoPdfName', () => {
  it('builds the canonical downloads filename', () => {
    expect(refuerzoPdfName('edmn-2bach', 1, 'refuerzo'))
      .toBe('edmn-2bach-refuerzo-eval1.pdf');
  });

  it('handles ampliacion and other evaluaciones', () => {
    expect(refuerzoPdfName('edmn-2bach', 3, 'ampliacion'))
      .toBe('edmn-2bach-ampliacion-eval3.pdf');
  });
});
