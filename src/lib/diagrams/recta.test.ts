import { describe, expect, it } from 'vitest';
import { cifra, tramoVisible } from './recta';

describe('tramoVisible', () => {
  it('clips the cinema demand Q = 60 000 − 4 000·P to the plot box', () => {
    // Box: P up to 14, Q up to 40 000. Q hits 40 000 at P = 5 and 4 000 at P = 14.
    expect(tramoVisible(60000, -4000, 14, 40000)).toEqual({ p1: 5, q1: 40000, p2: 14, q2: 4000 });
  });

  it('starts a supply with a negative intercept where it leaves Q = 0', () => {
    expect(tramoVisible(-20, 10, 10, 100)).toEqual({ p1: 2, q1: 0, p2: 10, q2: 80 });
  });

  it('draws a vertical curve for a fixed quantity and nothing outside the box', () => {
    expect(tramoVisible(50, 0, 10, 100)).toEqual({ p1: 0, q1: 50, p2: 10, q2: 50 });
    expect(tramoVisible(500, -1, 10, 100)).toBeNull();
  });
});

describe('cifra', () => {
  it('groups thousands and uses a decimal comma', () => {
    expect(cifra(18000)).toBe('18 000');
    expect(cifra(8000)).toBe('8 000');
    expect(cifra(7.5)).toBe('7,5');
  });
});
