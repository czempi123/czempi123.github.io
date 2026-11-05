// Život na mapě (interaktivita-v2, K2): zastávky života z kdeVRoce, kdo oddíl má, Předchozí a Další zastávka,
// plán přehrávání přes rok nula a texty zastávek. Počítá se na skutečných datech atlasu.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { nactiData } from '../../src/lib/kontroly';
import type { OsobaMapy } from '../../src/lib/cas-mapy';
import {
  zastavkyZivota, maZastavky, zastavkaVRoce, predchoziZastavka, dalsiZastavka, planPrehravani, rokVCase,
  radekZastavky, oznameniZastavky, rokZastavky, vekZastavky, casProRok, PREHRAVANI,
} from '../../src/lib/zivot-na-mape';
import { prectiAdresu, zapisAdresu } from '../../src/lib/adresa-mapy';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const { data } = nactiData({
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'), udalosti: cti('udalosti.yaml'),
  obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
});
const os = (id: string) => data.lide.find((o) => o.id === id)!;
const nazev = (id: string) => data.mista.find((m) => m.id === id)!.nazev;
const bez = (s: string) => s.replaceAll('\u00a0', ' ');
const trasa = (id: string) => zastavkyZivota(os(id)).map((z) => [z.misto, z.rok]);

describe('zastávky života', () => {
  it('Aristotelés: osm zastávek na šesti místech, všechny s časem, Stageira a Athény dvakrát', () => {
    expect(trasa('aristoteles')).toEqual([
      ['stageira', -384], ['athenes', -367], ['assos', -347], ['lesbos', -345], ['pella', -343],
      ['stageira', -340], ['athenes', -335], ['chalkis', -322],
    ]);
    const z = zastavkyZivota(os('aristoteles'));
    expect(new Set(z.map((x) => x.misto)).size).toBe(6);
    expect(z.every((x) => !x.odvozena && !x.asiRok)).toBe(true);
    expect(z.map((x) => x.vek)).toEqual([0, 17, 37, 39, 41, 44, 49, 62]);
    expect(z.at(-1)!.role).toBe('smrt');
  });

  it('Epikúros a Platón: návraty do Athén jsou nové zastávky', () => {
    expect(trasa('epikuros').map(([m]) => m)).toEqual(['samos', 'athenes', 'kolofon', 'mytilena', 'athenes']);
    expect(trasa('platon')).toEqual([['athenes', -427], ['syrakusy', -366], ['athenes', -365], ['syrakusy', -361], ['athenes', -360]]);
  });

  it('Sókratés: návrat z tažení má jistý rok, i když Athény nemají čas', () => {
    const z = zastavkyZivota(os('sokrates'));
    expect(z.map((x) => x.misto)).toEqual(['athenes', 'potidaia', 'athenes', 'delion', 'athenes', 'amfipolis', 'athenes']);
    expect(z[2]).toMatchObject({ rok: -431, odvozena: false, vek: 38 });
    expect(bez(radekZastavky(z[2], os('sokrates')))).toBe('rodiště · 431 př. n. l. · 38 let');
  });

  it('Seneca přes přelom letopočtu: narození asi 1 př. n. l., věk bez roku nula', () => {
    const z = zastavkyZivota(os('seneca'));
    expect(z.map((x) => [x.misto, x.rok])).toEqual([['corduba', -1], ['korsika', 41], ['rim', 49]]);
    expect(z[1].vek).toBe(41);
    expect(bez(rokZastavky(z[0]))).toBe('asi 1 př. n. l.');
    expect(bez(vekZastavky(z[1], os('seneca')))).toBe('asi 41 let');
  });

  it('nejistý pobyt: příchod podle pravidla „od osmnácti“ netvrdí rok ani věk', () => {
    const z = zastavkyZivota(os('protagoras'));
    expect(z[1]).toMatchObject({ misto: 'athenes', odvozena: true });
    expect(bez(radekZastavky(z[1], os('protagoras')))).toBe('působení');
    expect(oznameniZastavky(z[1], nazev('athenes'), os('protagoras'))).toBe('Athény, působení.');
    // Po pobytu s časem (Thurioi) už je rok návratu jistý.
    expect(z[3]).toMatchObject({ misto: 'athenes', rok: -443, odvozena: false });
  });

  it('člověk jen s dobou činnosti: zastávky od začátku činnosti, bez věku', () => {
    const o: OsobaMapy = {
      id: 'zkouska', jmeno: 'Zkouška', aktivni: { od: -330, do: -300, priblizne: true },
      mista: [
        { misto: 'athenes', role: 'pusobeni', od: -330, do: -320 },
        { misto: 'korinth', role: 'pobyt', od: -319 },
      ],
    } as OsobaMapy;
    const z = zastavkyZivota(o);
    expect(z.map((x) => [x.misto, x.rok, x.vek])).toEqual([['athenes', -330, null], ['korinth', -319, null]]);
    expect(z[0].asiRok).toBe(true);
    expect(bez(radekZastavky(z[0], o))).toBe('působení · asi 330 př. n. l.');
    expect(maZastavky(o)).toBe(true);
  });

  it('člověk s jediným místem oddíl nemá; Hérakleitos a Hipparchia ne, Aristotelés ano', () => {
    expect(maZastavky(os('herakleitos'))).toBe(false);
    expect(maZastavky(os('hipparchia'))).toBe(false);
    expect(maZastavky(os('aristoteles'))).toBe(true);
    expect(zastavkyZivota({ id: 'x', jmeno: 'X', mista: [] } as unknown as OsobaMapy)).toEqual([]);
  });

  it('v roce narození mimo rodiště není „narodil se“ (Plótínos v Alexandrii)', () => {
    const z = zastavkyZivota(os('plotinos'));
    expect(z[0].misto).toBe('alexandrie');
    expect(vekZastavky(z[0], os('plotinos'))).toBe('');
    expect(bez(radekZastavky(z[0], os('plotinos')))).toBe('studium · asi 204 n. l.');
  });
});

describe('Předchozí a Další zastávka', () => {
  const z = zastavkyZivota(os('aristoteles'));
  it('z roku na zastávce i uprostřed pobytu', () => {
    expect(zastavkaVRoce(z, -347)).toBe(2);
    expect(zastavkaVRoce(z, -346)).toBe(2);
    expect(dalsiZastavka(z, -347)).toBe(-345);
    expect(predchoziZastavka(z, -347)).toBe(-367);
    // Uprostřed pobytu vede Předchozí na jeho začátek.
    expect(predchoziZastavka(z, -346)).toBe(-347);
  });
  it('na krajích života nic', () => {
    expect(predchoziZastavka(z, -384)).toBeNull();
    expect(dalsiZastavka(z, -322)).toBeNull();
    expect(zastavkaVRoce(z, -400)).toBe(-1);
  });
  it('přes přelom letopočtu', () => {
    const s = zastavkyZivota(os('seneca'));
    expect(dalsiZastavka(s, -1)).toBe(41);
    expect(predchoziZastavka(s, 1)).toBe(-1);
    expect(zastavkaVRoce(s, 1)).toBe(0);
  });
});

describe('plán přehrávání', () => {
  it('Aristotelés: život za deset vteřin a vteřina na každé z osmi zastávek', () => {
    const o = os('aristoteles');
    const plan = planPrehravani(o, zastavkyZivota(o))!;
    expect(plan.celkem).toBeCloseTo(PREHRAVANI.delka + 8 * PREHRAVANI.zastaveni);
    expect(rokVCase(plan, 0)).toBe(-384);
    // Na začátku stojí vteřinu v Stageiře.
    expect(rokVCase(plan, 999)).toBe(-384);
    expect(rokVCase(plan, plan.celkem)).toBe(-322);
    expect(rokVCase(plan, plan.celkem + 5000)).toBe(-322);
    // Rok jen roste.
    let predtim = -10_000;
    for (let t = 0; t <= plan.celkem; t += 50) {
      const r = rokVCase(plan, t);
      expect(r).toBeGreaterThanOrEqual(predtim);
      predtim = r;
    }
  });
  it('na každé zastávce rok vteřinu stojí', () => {
    const o = os('aristoteles');
    const plan = planPrehravani(o, zastavkyZivota(o))!;
    const zastaveni = plan.useky.filter((u) => u.a0 === u.a1);
    expect(zastaveni).toHaveLength(8);
    for (const u of zastaveni) expect(u.t1 - u.t0).toBe(PREHRAVANI.zastaveni);
  });
  it('Seneca: rok nula se přeskočí', () => {
    const o = os('seneca');
    const plan = planPrehravani(o, zastavkyZivota(o), { delka: 6600, zastaveni: 0 })!;
    const roky = new Set<number>();
    for (let t = 0; t <= plan.celkem; t += 10) roky.add(rokVCase(plan, t));
    expect(roky.has(0)).toBe(false);
    expect(roky.has(-1) && roky.has(1)).toBe(true);
    expect(rokVCase(plan, plan.celkem)).toBe(65);
  });
  it('Přehrát po Zastavit pokračuje z daného roku; na zastávce postojí znovu, z roku smrti jede od začátku', () => {
    const o = os('aristoteles');
    const plan = planPrehravani(o, zastavkyZivota(o))!;
    for (const r of [-380, -360, -346, -330, -323]) expect(rokVCase(plan, casProRok(plan, r))).toBe(r);
    const t = casProRok(plan, -347);
    expect(rokVCase(plan, t + PREHRAVANI.zastaveni - 1)).toBe(-347);
    expect(casProRok(plan, -322)).toBe(0);
    expect(casProRok(plan, -384)).toBe(0);
    const s = os('seneca');
    const ps = planPrehravani(s, zastavkyZivota(s))!;
    expect(rokVCase(ps, casProRok(ps, 1))).toBe(1);
  });
  it('zkrácený čas pro testy', () => {
    const o = os('platon');
    expect(planPrehravani(o, zastavkyZivota(o), { delka: 1000, zastaveni: 100 })!.celkem).toBeCloseTo(1500);
  });
});

describe('texty zastávek', () => {
  const a = os('aristoteles');
  const z = zastavkyZivota(a);
  it('řádek a oznámení', () => {
    expect(bez(radekZastavky(z[2], a))).toBe('pobyt · 347 př. n. l. · 37 let');
    expect(bez(oznameniZastavky(z[2], nazev('assos'), a))).toBe('Assos, 347 př. n. l., 37 let.');
    expect(bez(radekZastavky(z[0], a))).toBe('rodiště · 384 př. n. l. · narodil se');
    expect(bez(oznameniZastavky(z[7], nazev('chalkis'), a))).toBe('Chalkis, 322 př. n. l., 62 let, zemřel tu.');
  });
  it('přibližné narození dá „asi“ věku', () => {
    const p = os('platon');
    const zp = zastavkyZivota(p);
    expect(bez(radekZastavky(zp[1], p))).toBe('pobyt · 366 př. n. l. · asi 61 let');
    expect(bez(rokZastavky(zp[0]))).toBe('asi 427 př. n. l.');
  });
  it('nezlomitelné mezery v letopočtu a ve věku', () => {
    expect(radekZastavky(z[2], a)).toContain('347\u00a0př.\u00a0n.\u00a0l.');
    expect(radekZastavky(z[2], a)).toContain('37\u00a0let');
  });
});

describe('adresa s příznakem Přehrát život', () => {
  const vychozi = { rok: -360, rozsah: [-650, 2026] as [number, number], osoby: new Set(['aristoteles']), obdobi: new Set([1, 2]) };
  it('zapíše a přečte zivot=1 jen s osobou', () => {
    expect(zapisAdresu({ rok: -384, osoba: 'aristoteles', stin: false, zivot: true }, 1)).toBe('?rok=-384&osoba=aristoteles&zivot=1');
    expect(zapisAdresu({ rok: -384, stin: false, zivot: true }, 1)).toBe('?rok=-384');
    expect(prectiAdresu('?rok=-384&osoba=aristoteles&zivot=1', vychozi).zivot).toBe(true);
    expect(prectiAdresu('?rok=-384&zivot=1', vychozi).zivot).toBe(false);
    expect(prectiAdresu('?rok=-384&osoba=nikdo&zivot=1', vychozi).zivot).toBe(false);
  });
});
