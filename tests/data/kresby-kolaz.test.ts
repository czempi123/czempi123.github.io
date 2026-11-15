// Koláž kreseb (design-v2 K7b): natržený pruh papíru a natržený lísteček.
import { describe, expect, it } from 'vitest';
import { natrzenyList, natrzenyPruh } from '../../src/lib/kresby';

const body = (d: string) => [...d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe('natržený pruh', () => {
  it('začíná dole vlevo, končí dole vpravo a je uzavřený', () => {
    const d = natrzenyPruh(0, 340, 205, 240);
    expect(d.startsWith('M0,240 L0,205')).toBe(true);
    expect(d.endsWith('L340,205 L340,240 Z')).toBe(true);
  });
  it('hrana se drží v mezích zubu a jde zleva doprava', () => {
    const b = body(natrzenyPruh(0, 340, 205, 240, { zub: 2.6, krok: 7 })).slice(2, -2);
    expect(b.length).toBeGreaterThan(40);
    for (const [, y] of b) expect(Math.abs(y - 205)).toBeLessThanOrEqual(2.6);
    for (let i = 1; i < b.length; i++) expect(b[i][0]).toBeGreaterThan(b[i - 1][0]);
  });
  it('se stejným semenem vyjde vždy stejně, s jiným jinak', () => {
    expect(natrzenyPruh(0, 340, 205, 240, { semeno: 3 })).toBe(natrzenyPruh(0, 340, 205, 240, { semeno: 3 }));
    expect(natrzenyPruh(0, 340, 205, 240, { semeno: 3 })).not.toBe(natrzenyPruh(0, 340, 205, 240, { semeno: 4 }));
  });
});

describe('natržený lísteček', () => {
  it('drží obdélník s nerovnými hranami a je uzavřený', () => {
    const d = natrzenyList(-48, -12.5, 96, 25, { zub: 0.9 });
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith(' Z')).toBe(true);
    for (const [x, y] of body(d)) {
      expect(x).toBeGreaterThanOrEqual(-48.9);
      expect(x).toBeLessThanOrEqual(48.9);
      expect(y).toBeGreaterThanOrEqual(-13.4);
      expect(y).toBeLessThanOrEqual(13.4);
    }
  });
});
