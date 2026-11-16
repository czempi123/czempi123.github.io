// Logo Agora: třída období pro velké A (src/lib/logo.ts).
import { describe, expect, it } from 'vitest';
import { tridyObdobiLoga } from '../../src/lib/logo';

describe('třída období loga', () => {
  it('období 1 až 8 dostane obdobi-N', () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) expect(tridyObdobiLoga(n)).toBe(`obdobi-${n}`);
  });
  it('stránka bez období (nebo s nesmyslným číslem) má logo v inkoustu', () => {
    for (const n of [undefined, 0, 9, -1]) expect(tridyObdobiLoga(n)).toBe('bez-obdobi');
  });
});
