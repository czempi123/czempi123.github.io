// Razítko člověka (design-v2, K3): natočení podle id a délka textu po obvodu (src/lib/razitko.ts).
import { describe, expect, it } from 'vitest';
import { natoceniRazitka, delkaNaObvodu, sirkaTextu, MISTO_JMENO, MISTO_ROKY } from '../../src/lib/razitko';
import { data } from '../../src/lib/data';
import { zivot } from '../../src/lib/casy';

describe('razítko člověka', () => {
  it('natočení je pro každé id stejné a leží mezi −14° a +12°', () => {
    for (const o of data.lide) {
      const r = natoceniRazitka(o.id);
      expect(r).toBe(natoceniRazitka(o.id));
      expect(r).toBeGreaterThanOrEqual(-14);
      expect(r).toBeLessThanOrEqual(12);
      expect(Number.isInteger(r)).toBe(true);
    }
  });

  it('razítka sousedů nejsou natočená všechna stejně', () => {
    const uhly = new Set(data.lide.map((o) => natoceniRazitka(o.id)));
    expect(uhly.size).toBeGreaterThan(15);
  });

  it('krátké jméno má přirozenou šířku, dlouhé se stáhne do místa mezi tečkami', () => {
    expect(delkaNaObvodu('Platón', 11)).toBeUndefined();
    expect(delkaNaObvodu('Marcus Aurelius Antoninus', 11)).toBe(MISTO_JMENO);
    expect(sirkaTextu('Platón', 11)).toBeLessThan(MISTO_JMENO);
  });

  it('jméno a roky každého člověka v datech se na obvod vejdou (nejvýš stažené na místo mezi tečkami)', () => {
    for (const o of data.lide) {
      const jmeno = delkaNaObvodu(o.jmeno, 11) ?? sirkaTextu(o.jmeno, 11);
      const roky = delkaNaObvodu(zivot(o), 9) ?? sirkaTextu(zivot(o), 9);
      expect(jmeno).toBeLessThanOrEqual(MISTO_JMENO);
      expect(roky).toBeLessThanOrEqual(MISTO_ROKY);
      // Stažení o víc než třetinu by text na razítku nešlo přečíst: takové jméno by potřebovalo zkratku.
      expect(sirkaTextu(o.jmeno, 11) / MISTO_JMENO).toBeLessThan(1.45);
    }
  });
});
