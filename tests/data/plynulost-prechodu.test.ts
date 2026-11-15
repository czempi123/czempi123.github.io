// Plynulost otočení listu (src/scripts/plynulost-prechodu.ts): po dvou pomalých otočeních ze tří přejde zařízení
// na krátký přechod a už na něm zůstane; skrytý panel a přerušený přechod se nepočítají.
import { describe, expect, it } from 'vitest';
import { zapsatMereni, kratkyPrechod, platneMereni } from '../../src/scripts/plynulost-prechodu';

const zaSebou = (...fps: number[]) => fps.reduce<string | null>((z, f) => zapsatMereni(z, f), null);

describe('plynulost otočení listu', () => {
  it('plynulé otočení nechá list otáčet', () => {
    expect(kratkyPrechod(zaSebou(55, 48, 60))).toBe(false);
    expect(kratkyPrechod(zaSebou(25, 50, 58))).toBe(false);
  });
  it('dvě pomalá otočení ze tří přepnou na krátký přechod a ten už zůstane', () => {
    const z = zaSebou(28, 50, 22);
    expect(kratkyPrechod(z)).toBe(true);
    expect(kratkyPrechod(zapsatMereni(z, 60))).toBe(true);
  });
  it('drží jen tři poslední měření', () => {
    expect(JSON.parse(zaSebou(10, 60, 60, 60)!).mereni).toEqual([60, 60, 60]);
  });
  it('poškozený nebo prázdný záznam znamená otáčet', () => {
    expect(kratkyPrechod(null)).toBe(false);
    expect(kratkyPrechod('{neplatné')).toBe(false);
    expect(JSON.parse(zapsatMereni('{neplatné', 40)).mereni).toEqual([40]);
  });
  it('platí jen měření z viditelného okna a doběhlého přechodu', () => {
    expect(platneMereni(935, 42, true)).toBe(true);
    expect(platneMereni(935, 42, false)).toBe(false);
    expect(platneMereni(4000, 2, true)).toBe(false);
    expect(platneMereni(120, 5, true)).toBe(false);
  });
  it('funkce jdou vložit do hlavičky jako text (sahají jen na své parametry)', () => {
    for (const f of [zapsatMereni, kratkyPrechod, platneMereni]) {
      const kopie = new Function(`return (${f.toString()})`)();
      expect(typeof kopie).toBe('function');
    }
    const z = new Function(`return (${zapsatMereni.toString()})`)()(null, 20);
    expect(new Function(`return (${kratkyPrechod.toString()})`)()(new Function(`return (${zapsatMereni.toString()})`)()(z, 20))).toBe(true);
  });
});
