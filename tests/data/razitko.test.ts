// Razítko člověka (design-v2, K3): natočení podle id a délka textu po obvodu (src/lib/razitko.ts).
import { describe, expect, it } from 'vitest';
import { natoceniRazitka, delkaNaObvodu, delkaVeStredu, sirkaTextu, stredRazitka, MISTO_JMENO, MISTO_ROKY, MISTO_STRED } from '../../src/lib/razitko';
import { data, mistaPodleId } from '../../src/lib/data';
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

describe('střed razítka bez atributu (K3 dodatek, bod 8)', () => {
  const nazev = (id: string) => mistaPodleId.get(id)?.nazev;
  const osoba = (zmeny: Record<string, unknown>) => ({ atribut: undefined, mista: [], narozen: undefined, ...zmeny }) as Parameters<typeof stredRazitka>[0];

  it('kdo má atribut, má uprostřed atribut, ne město', () => {
    for (const o of data.lide.filter((x) => x.atribut)) expect(stredRazitka(o, nazev)).toBeUndefined();
  });

  it('kdo nemá atribut ani rodiště, má vlnovky; působiště rodiště nenahradí', () => {
    for (const o of data.lide.filter((x) => !x.atribut && !x.mista.some((m) => m.role === 'narozeni'))) {
      expect(stredRazitka(o, nazev)).toBeUndefined();
    }
    const m = data.mista[0].id;
    expect(stredRazitka(osoba({ mista: [{ misto: m, role: 'pusobeni' }] }), nazev)).toBeUndefined();
  });

  it('kdo nemá atribut a má rodiště, má město z mista.yaml a rok narození z dat', () => {
    const bez = data.lide.filter((x) => !x.atribut && x.mista.some((m) => m.role === 'narozeni'));
    expect(bez.length).toBeGreaterThan(5);
    for (const o of bez) {
      const s = stredRazitka(o, nazev)!;
      const rodiste = o.mista.find((m) => m.role === 'narozeni')!;
      expect(s.mesto).toBe(mistaPodleId.get(rodiste.misto)!.nazev);
      if (o.narozen) {
        expect(s.rok).toContain(String(Math.abs(o.narozen.rok)));
        expect(s.era).toBe(o.narozen.rok < 0 ? 'př.\u00a0n.\u00a0l.' : 'n.\u00a0l.');
        // „Asi“ zůstává „asi“; přesný rok žádné slovo nemá.
        expect(s.rok!.startsWith('asi')).toBe(!!o.narozen.priblizne && !o.narozen.nejpozdeji && !o.narozen.nejdrive);
      } else {
        expect(s.rok).toBeUndefined();
      }
    }
  });

  it('rok narození: přesný, asi, před, po a letopočet', () => {
    const m = data.mista[0].id;
    const r = (narozen: Record<string, unknown>) => stredRazitka(osoba({ mista: [{ misto: m, role: 'narozeni' }], narozen }), nazev)!;
    expect(r({ rok: -469 })).toMatchObject({ rok: '469', era: 'př.\u00a0n.\u00a0l.' });
    expect(r({ rok: -470, priblizne: true }).rok).toBe('asi\u00a0470');
    expect(r({ rok: -520, nejpozdeji: true }).rok).toBe('před\u00a0520');
    expect(r({ rok: 55, nejdrive: true })).toMatchObject({ rok: 'po\u00a055', era: 'n.\u00a0l.' });
  });

  it('každé město se do středu vejde (nejvýš stažené o třetinu)', () => {
    for (const o of data.lide) {
      const s = stredRazitka(o, nazev);
      if (!s) continue;
      expect(delkaVeStredu(s.mesto) ?? sirkaTextu(s.mesto, 10)).toBeLessThanOrEqual(MISTO_STRED);
      expect(sirkaTextu(s.mesto, 10) / MISTO_STRED, s.mesto).toBeLessThan(1.45);
    }
  });
});
