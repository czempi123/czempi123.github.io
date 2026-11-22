// Kartičky s rozestupem a vystřižené citáty s poznámkou (denik-v2, K1): přihrádky, hromádka na dnes, místní datum,
// deník po týdnu a po měsíci bez návštěvy, spojení dvou deníků, starý deník bez nových polí a plná sbírka.
import { describe, it, expect, beforeEach } from 'vitest';
import {
  ROZESTUP, HROMADKA, PRIHRADKA_NEJVYS, CITATY_NEJVYS,
  klicKarticky, mistniDatum, posunDatum, naRadeOd, sKartickou, bezKarticky, sHodnocenim, naRade, hromadka, maZdroj,
  sCitatem, sbirkaPlna, sPoznamkouCitatu, spojDeniky, rozeberDenik,
  nacti, pridatKarticku, vyndatKarticku, ohodnotitKarticku, maKarticku, vystrihniCitat, ulozPoznamkuCitatu, zrusCitat, _zapomenPamet,
  type Denik, type Karticka,
} from '../../src/lib/denik';

const prazdny = (cast: Partial<Denik> = {}): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });
const T = '2026-11-02T08:00:00.000Z';
const K = (ref: string) => klicKarticky('pojem', ref);

/** Deník s kartičkami pojmů přidanými postupně (každá o minutu později). */
function sPojmy(n: number, d = prazdny()): Denik {
  for (let i = 0; i < n; i++) d = sKartickou(d, 'pojem', `p${String(i).padStart(2, '0')}`, `2026-11-02T08:${String(i).padStart(2, '0')}:00.000Z`);
  return d;
}

/** Jeden den u kartiček: ohodnotí hromádku (všechny „Vím“, nebo podle funkce) a vrátí deník. */
function den(d: Denik, dnes: string, hodnot: (k: Karticka) => 'vim' | 'zopakuj' = () => 'vim'): Denik {
  for (const k of hromadka(d, dnes)) d = sHodnocenim(d, klicKarticky(k.zdroj, k.ref), hodnot(k), dnes, `${dnes}T12:00:00.000Z`);
  return d;
}

describe('místní datum', () => {
  it('bere místní kalendářní den, ne hodiny ani UTC', () => {
    expect(mistniDatum(new Date(2026, 10, 22, 0, 0, 30))).toBe('2026-11-22');
    expect(mistniDatum(new Date(2026, 10, 22, 23, 59, 59))).toBe('2026-11-22');
    expect(mistniDatum(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
  it('posun přes konec měsíce, roku a přes změnu času', () => {
    expect(posunDatum('2026-11-28', 3)).toBe('2026-12-01');
    expect(posunDatum('2026-12-20', 16)).toBe('2027-01-05');
    expect(posunDatum('2026-10-20', 7)).toBe('2026-10-27'); // přes konec letního času (25. 10.)
    expect(posunDatum('2027-03-01', 35)).toBe('2027-04-05'); // přes začátek letního času (28. 3.)
    expect(posunDatum('2028-02-27', 3)).toBe('2028-03-01'); // přestupný rok
  });
});

describe('rozestup přes přihrádky', () => {
  it('nová kartička je na řadě hned, „Vím“ ji posouvá: 1, 3, 7, 16 a 35 dní, v páté zůstane', () => {
    let d = sKartickou(prazdny(), 'pojem', 'klid', T);
    expect(d.karticky![K('klid')]).toMatchObject({ zdroj: 'pojem', ref: 'klid', prihradka: 0, pridano: T, kdy: T });
    expect(hromadka(d, '2026-11-02').map((k) => k.ref)).toEqual(['klid']);
    let dnes = '2026-11-02';
    for (const [prihradka, dny] of [[1, 1], [2, 3], [3, 7], [4, 16], [5, 35], [5, 35]] as const) {
      d = sHodnocenim(d, K('klid'), 'vim', dnes, `${dnes}T09:00:00.000Z`);
      expect(d.karticky![K('klid')].prihradka).toBe(prihradka);
      expect(ROZESTUP[prihradka]).toBe(dny);
      expect(hromadka(d, dnes)).toEqual([]); // týž den už ne
      expect(hromadka(d, posunDatum(dnes, dny - 1))).toEqual([]); // den předem ne
      dnes = posunDatum(dnes, dny);
      expect(naRadeOd(d.karticky![K('klid')])).toBe(dnes);
      expect(hromadka(d, dnes).map((k) => k.ref)).toEqual(['klid']);
    }
    expect(d.karticky![K('klid')].prihradka).toBe(PRIHRADKA_NEJVYS);
  });
  it('„Zopakuj si“ vrací do první přihrádky z jakékoli přihrádky, i novou kartičku', () => {
    let d = sKartickou(prazdny(), 'pojem', 'klid', T);
    d = sHodnocenim(d, K('klid'), 'zopakuj', '2026-11-02', T);
    expect(d.karticky![K('klid')]).toMatchObject({ prihradka: 1, naposledy: '2026-11-02' });
    for (const dnes of ['2026-11-03', '2026-11-06', '2026-11-13']) d = sHodnocenim(d, K('klid'), 'vim', dnes, T);
    expect(d.karticky![K('klid')].prihradka).toBe(4);
    d = sHodnocenim(d, K('klid'), 'zopakuj', '2026-11-29', '2026-11-29T10:00:00.000Z');
    expect(d.karticky![K('klid')]).toMatchObject({ prihradka: 1, naposledy: '2026-11-29', kdy: '2026-11-29T10:00:00.000Z' });
    expect(hromadka(d, '2026-11-29')).toEqual([]);
    expect(hromadka(d, '2026-11-30')).toHaveLength(1);
  });
  it('přidat podruhé nic nevynuluje, vyndat kartičku smaže, cizí klíč nic nezmění', () => {
    let d = sHodnocenim(sKartickou(prazdny(), 'pojem', 'klid', T), K('klid'), 'vim', '2026-11-02', T);
    expect(sKartickou(d, 'pojem', 'klid', '2026-11-05T00:00:00.000Z')).toBe(d);
    expect(sHodnocenim(d, K('nic'), 'vim', '2026-11-02', T)).toBe(d);
    expect(bezKarticky(d, K('nic'))).toBe(d);
    d = bezKarticky(d, K('klid'));
    expect(d.karticky).toEqual({});
  });
});

describe('hromádka na dnes', () => {
  it('nejvýš pět, od nejdéle čekající, pak podle přidání; počet čekajících se z ní nedá vyčíst', () => {
    let d = sPojmy(8);
    expect(HROMADKA).toBe(5);
    expect(hromadka(d, '2026-11-02').map((k) => k.ref)).toEqual(['p00', 'p01', 'p02', 'p03', 'p04']);
    // p05 opakovaná dávno (čeká déle než nové), p06 až zítra
    d = sHodnocenim(d, K('p05'), 'zopakuj', '2026-10-20', T);
    d = sHodnocenim(d, K('p06'), 'zopakuj', '2026-11-02', T);
    expect(hromadka(d, '2026-11-02').map((k) => k.ref)).toEqual(['p05', 'p00', 'p01', 'p02', 'p03']);
    expect(naRade(d, '2026-11-02')).toHaveLength(7);
    expect(hromadka(d, '2026-11-02', 10).map((k) => k.ref)).not.toContain('p06');
  });
  it('„Ještě pět“: po ohodnocení hromádky přijdou další na řadě, ohodnocené týž den už ne', () => {
    let d = sPojmy(8);
    d = den(d, '2026-11-02');
    expect(hromadka(d, '2026-11-02').map((k) => k.ref)).toEqual(['p05', 'p06', 'p07']);
    d = den(d, '2026-11-02');
    expect(hromadka(d, '2026-11-02')).toEqual([]);
  });
  it('kartička bez zdroje se neukáže a nesmaže: citát mimo sbírku, smazaný nebo prázdný zápis, pojem mimo data', () => {
    let d = prazdny({
      citaty: [{ id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T }],
      zapisy: [
        { id: 'z1', otazka: 'O', odpoved: 'Moje pravidlo', odkaz: '/', kdy: T },
        { id: 'z2', otazka: 'O', odpoved: '  ', odkaz: '/', kdy: T },
      ],
    });
    for (const [z, r] of [['citat', 'c1'], ['citat', 'c2'], ['zapis', 'z1'], ['zapis', 'z2'], ['zapis', 'z3'], ['pojem', 'klid'], ['pojem', 'zmizel'], ['zustalo', 'pojem:klid']] as const) d = sKartickou(d, z, r, T);
    const vData = (k: Karticka) => k.zdroj !== 'pojem' || k.ref === 'klid';
    expect(hromadka(d, '2026-11-02', 10, vData).map((k) => klicKarticky(k.zdroj, k.ref)).sort()).toEqual(['citat:c1', 'pojem:klid', 'zapis:z1', 'zustalo:pojem:klid']);
    // Bez seznamu z dat deník pojem a otázku kvízu nezná, a tak je ukáže.
    expect(hromadka(d, '2026-11-02', 10)).toHaveLength(5);
    expect(Object.keys(d.karticky!)).toHaveLength(8);
    // Zdroj se vrátí (citát znovu vystřižený), kartička taky.
    d = sCitatem(d, { id: 'c2', text: 'B', kde: 'X', odkaz: '/' }, T)!;
    expect(maZdroj(d, d.karticky!['citat:c2'])).toBe(true);
  });
});

describe('týden a měsíc bez návštěvy', () => {
  /** Dvanáct kartiček v různých přihrádkách, student chodí denně do 10. 11. a pak nepřijde. */
  function rozjetyDenik(): Denik {
    let d = sPojmy(12);
    let dnes = '2026-11-02';
    for (let i = 0; i < 9; i++) {
      d = den(d, dnes, (k) => (Number(k.ref.slice(1)) % 3 === 0 ? 'zopakuj' : 'vim'));
      dnes = posunDatum(dnes, 1);
    }
    return d;
  }
  for (const [nazev, dny] of [['týden', 7], ['měsíc', 31]] as const) {
    it(`po ${nazev === 'týden' ? 'týdnu' : 'měsíci'}: hromádka je pořád nejvýš pět, začne nejdéle čekající a nic se neztratí`, () => {
      const d0 = rozjetyDenik();
      const navrat = posunDatum('2026-11-10', dny);
      const cekajici = naRade(d0, navrat);
      expect(cekajici.length).toBeGreaterThan(HROMADKA);
      const prvni = hromadka(d0, navrat);
      expect(prvni).toHaveLength(HROMADKA);
      expect(prvni).toEqual(cekajici.slice(0, HROMADKA));
      const od = prvni.map(naRadeOd);
      expect([...od].sort()).toEqual(od);
      expect(od[0] <= naRadeOd(cekajici[cekajici.length - 1])).toBe(true);
      // Přihrádky se nepohnuly: kdo nepřijde, nic neztratí ani nespadne zpátky.
      expect(Object.values(d0.karticky!).map((k) => k.prihradka)).toEqual(Object.values(rozjetyDenik().karticky!).map((k) => k.prihradka));
      // „Vím“ po dlouhé pauze posune jako kdykoli jindy.
      const k = prvni[0];
      const d1 = sHodnocenim(d0, klicKarticky(k.zdroj, k.ref), 'vim', navrat, T);
      expect(d1.karticky![klicKarticky(k.zdroj, k.ref)].prihradka).toBe(Math.min(PRIHRADKA_NEJVYS, k.prihradka + 1));
      // Po pár dnech po pěti se dostane na všechny a žádná nezmizí.
      let d = d0;
      let den_ = navrat;
      const videne = new Set<string>();
      for (let i = 0; i < 4; i++) {
        hromadka(d, den_).forEach((x) => videne.add(x.ref));
        d = den(d, den_);
        den_ = posunDatum(den_, 1);
      }
      for (const x of cekajici) expect(videne).toContain(x.ref);
      expect(Object.keys(d.karticky!)).toHaveLength(12);
    });
  }
});

describe('půlnoc', () => {
  it('kartička ohodnocená ve 23:59 je na řadě další den ráno, ne o 24 hodin později a ne týž den', () => {
    const vecer = new Date(2026, 10, 22, 23, 59);
    let d = sKartickou(prazdny(), 'pojem', 'klid', new Date(2026, 10, 22, 20).toISOString());
    d = sHodnocenim(d, K('klid'), 'vim', mistniDatum(vecer), vecer.toISOString());
    expect(hromadka(d, mistniDatum(new Date(2026, 10, 22, 23, 59, 59)))).toEqual([]);
    expect(hromadka(d, mistniDatum(new Date(2026, 10, 23, 0, 1)))).toHaveLength(1);
  });
  it('kartička ohodnocená po půlnoci patří k novému dni', () => {
    const noc = new Date(2026, 10, 23, 0, 10);
    let d = sKartickou(prazdny(), 'pojem', 'klid', T);
    d = sHodnocenim(d, K('klid'), 'zopakuj', mistniDatum(noc), noc.toISOString());
    expect(d.karticky![K('klid')].naposledy).toBe('2026-11-23');
    expect(hromadka(d, '2026-11-23')).toEqual([]);
    expect(hromadka(d, '2026-11-24')).toHaveLength(1);
  });
});

describe('spojení dvou deníků', () => {
  it('kartičky z obou zůstanou; u téže kartičky vyhraje novější změna', () => {
    const a: Karticka = { zdroj: 'pojem', ref: 'klid', prihradka: 3, naposledy: '2026-11-10', pridano: T, kdy: '2026-11-10T08:00:00.000Z' };
    const b: Karticka = { ...a, prihradka: 1, naposledy: '2026-11-12', kdy: '2026-11-12T08:00:00.000Z' };
    const ten = prazdny({ karticky: { [K('klid')]: a, [K('logos')]: { zdroj: 'pojem', ref: 'logos', prihradka: 0, pridano: T, kdy: T } } });
    const soubor = prazdny({ karticky: { [K('klid')]: b, 'zapis:z1': { zdroj: 'zapis', ref: 'z1', prihradka: 2, naposledy: '2026-11-01', pridano: T, kdy: T } } });
    const s = spojDeniky(ten, soubor);
    expect(Object.keys(s.karticky!).sort()).toEqual(['pojem:klid', 'pojem:logos', 'zapis:z1']);
    expect(s.karticky![K('klid')]).toEqual(b);
    expect(spojDeniky(soubor, ten).karticky![K('klid')]).toEqual(b);
    expect(spojDeniky(prazdny(), prazdny()).karticky).toBeUndefined();
  });
  it('poškozené kartičky ze souboru vypadnou a klíč se složí ze zdroje', () => {
    const soubor = { ...prazdny(), karticky: {
      spatny: { zdroj: 'pojem', ref: 'klid', prihradka: 9, naposledy: '2026-11-01', pridano: T, kdy: T },
      zly: { zdroj: 'hlas', ref: 'x', prihradka: 1, pridano: T, kdy: T },
      bez: { zdroj: 'pojem', ref: 'y', prihradka: 2, pridano: T, kdy: T },
      nic: null,
    } } as unknown as Denik;
    const s = spojDeniky(prazdny(), soubor);
    expect(s.karticky).toEqual({
      'pojem:klid': { zdroj: 'pojem', ref: 'klid', prihradka: PRIHRADKA_NEJVYS, naposledy: '2026-11-01', pridano: T, kdy: T },
      'pojem:y': { zdroj: 'pojem', ref: 'y', prihradka: 0, pridano: T, kdy: T },
    });
  });
  it('poznámka citátu: vyhraje novější úprava, i smazaná; poznámka jen na jedné straně zůstane', () => {
    const c = { id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T };
    const ten = prazdny({ citaty: [{ ...c, poznamka: 'stará', upraveno: '2026-11-03T00:00:00Z' }, { ...c, id: 'c2' }, { ...c, id: 'c3', poznamka: 'jen tady', upraveno: T }] });
    const soubor = prazdny({ citaty: [{ ...c, poznamka: 'nová', upraveno: '2026-11-05T00:00:00Z' }, { ...c, id: 'c2', poznamka: 'ze souboru', upraveno: T }, { ...c, id: 'c3' }] });
    const s = spojDeniky(ten, soubor);
    const p = (id: string) => s.citaty!.find((x) => x.id === id)?.poznamka;
    expect([p('c1'), p('c2'), p('c3')]).toEqual(['nová', 'ze souboru', 'jen tady']);
    const smazana = prazdny({ citaty: [{ ...c, upraveno: '2026-11-09T00:00:00Z' }] });
    expect(spojDeniky(ten, smazana).citaty!.find((x) => x.id === 'c1')!.poznamka).toBeUndefined();
    expect(spojDeniky(smazana, ten).citaty!.find((x) => x.id === 'c1')!.poznamka).toBeUndefined();
  });
  it('spojení nic nevyhodí, ani když dvě sbírky dohromady přesáhnou strop', () => {
    const sbirka = (pre: string) => Array.from({ length: CITATY_NEJVYS - 10 }, (_, i) => ({ id: `${pre}${i}`, text: '', kde: '', odkaz: '/', kdy: T }));
    const s = spojDeniky(prazdny({ citaty: sbirka('a') }), prazdny({ citaty: sbirka('b') }));
    expect(s.citaty).toHaveLength(2 * (CITATY_NEJVYS - 10));
    expect(sbirkaPlna(s)).toBe(true);
  });
});

describe('starý deník bez nových polí', () => {
  const stary = JSON.stringify({ verze: 1, zapisy: [{ id: 'z1', otazka: 'O', odpoved: 'A', odkaz: '/', kdy: T }], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, citaty: [{ id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T }] });
  it('načte se beze změny a kartičky i poznámky jdou přidat', () => {
    const d = rozeberDenik(stary)!;
    expect(d.karticky).toBeUndefined();
    expect(d.citaty![0]).toEqual({ id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T });
    expect(hromadka(d, '2026-11-02')).toEqual([]);
    expect(naRade(d, '2026-11-02')).toEqual([]);
    const s = sPoznamkouCitatu(sKartickou(d, 'zapis', 'z1', T), 'c1', '  Protože  ', T);
    expect(s.citaty![0]).toMatchObject({ poznamka: 'Protože', upraveno: T });
    expect(hromadka(s, '2026-11-02').map((k) => k.ref)).toEqual(['z1']);
  });
  it('nesmysl v nových polích deník nerozbije', () => {
    const d = rozeberDenik(JSON.stringify({ ...JSON.parse(stary), karticky: [1, 2], citaty: [{ id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T, poznamka: 5, upraveno: {} }] }))!;
    expect(d.karticky).toBeUndefined();
    expect(d.citaty![0]).toEqual({ id: 'c1', text: 'A', kde: 'X', odkaz: '/', kdy: T });
  });
});

describe('plná sbírka', () => {
  const plna = () => prazdny({ citaty: Array.from({ length: CITATY_NEJVYS }, (_, i) => ({ id: `c${i}`, text: '', kde: '', odkaz: '/', kdy: T })) });
  it('drží 300 citátů; další se nevystřihne a nic nevypadne', () => {
    expect(CITATY_NEJVYS).toBe(300);
    const d = plna();
    expect(sbirkaPlna(d)).toBe(true);
    expect(sCitatem(d, { id: 'novy', text: 'N', kde: 'X', odkaz: '/' }, T)).toBeNull();
    expect(sbirkaPlna(prazdny({ citaty: d.citaty!.slice(1) }))).toBe(false);
  });
  it('citát, který ve sbírce už je, jde vystřihnout znovu i v plné sbírce a poznámku si nechá', () => {
    let d = sPoznamkouCitatu(plna(), 'c5', 'Tohle', '2026-11-03T00:00:00Z');
    d = sCitatem(d, { id: 'c5', text: '', kde: '', odkaz: '/' }, '2026-11-04T00:00:00Z')!;
    expect(d.citaty).toHaveLength(CITATY_NEJVYS);
    expect(d.citaty![0]).toMatchObject({ id: 'c5', poznamka: 'Tohle', upraveno: '2026-11-03T00:00:00Z', kdy: '2026-11-04T00:00:00Z' });
  });
  it('poznámka: prázdná ji smaže, beze změny vrátí týž deník, citát mimo sbírku nezaloží', () => {
    let d = sPoznamkouCitatu(plna(), 'c1', 'Proč', T);
    expect(sPoznamkouCitatu(d, 'c1', 'Proč ', T)).toBe(d);
    expect(sPoznamkouCitatu(d, 'nic', 'x', T)).toBe(d);
    d = sPoznamkouCitatu(d, 'c1', '', '2026-11-05T00:00:00Z');
    expect(d.citaty!.find((c) => c.id === 'c1')).toEqual({ id: 'c1', text: '', kde: '', odkaz: '/', kdy: T, upraveno: '2026-11-05T00:00:00Z' });
  });
});

describe('ukládání v prohlížeči a export', () => {
  beforeEach(() => _zapomenPamet());
  it('přidat, ohodnotit, vyndat, poznámka a vystřižení přes deník; export obsahuje kartičky i poznámku', () => {
    pridatKarticku('pojem', 'klid');
    expect(maKarticku('pojem', 'klid')).toBe(true);
    ohodnotitKarticku(K('klid'), 'vim');
    expect(nacti().karticky![K('klid')]).toMatchObject({ prihradka: 1, naposledy: mistniDatum() });
    expect(vystrihniCitat({ id: 'c1', text: 'A', kde: 'X', odkaz: '/' })).toBe(true);
    ulozPoznamkuCitatu('c1', 'Zasáhla mě');
    pridatKarticku('citat', 'c1');
    // Export je JSON celého deníku (exportuj); po nahrání ze souboru zůstane všechno.
    const zpet = rozeberDenik(JSON.stringify(nacti(), null, 2))!;
    expect(zpet.karticky).toEqual(nacti().karticky);
    expect(zpet.citaty![0].poznamka).toBe('Zasáhla mě');
    zrusCitat('c1');
    expect(maKarticku('citat', 'c1')).toBe(true); // kartička zůstane, jen se bez citátu neukáže
    expect(hromadka(nacti(), mistniDatum())).toEqual([]);
    vyndatKarticku(K('klid'));
    expect(maKarticku('pojem', 'klid')).toBe(false);
  });
});
