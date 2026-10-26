// Deník: zápisy a stav bloků se ukládají do localStorage, vydrží „obnovení“ (nové načtení)
// a bez úložiště fungují aspoň v paměti.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { nacti, ulozZapis, najdiZapis, smazZapis, stavBloku, ulozStavBloku, smazStavBloku, zaznamenejKrok, dokonceniCesty, ulozCteni, cteniStranky, _zapomenPamet,
  kapitolaDoctena, sPrectenou, ulozPrectenou, prectene, PRELETENI_SLOV_ZA_MINUTU, NEJKRATSI_CTENI_MS, sHodinou, zaznamenejHodinu, HODINY_NEJVYS,
  spojDeniky, rozeberDenik, nahrajDenik, type Denik } from '../../src/lib/denik';

class Uloziste {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const g = globalThis as unknown as { localStorage?: unknown };

describe('deník s localStorage', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });

  it('zápis s druhem se uloží a přečte znovu z úložiště', () => {
    ulozZapis({ id: 'v1', otazka: 'Co uděláš?', odpoved: 'B · Najdu protipříklad.', odkaz: '/x/#v1', druh: 'volba' });
    _zapomenPamet();
    const z = najdiZapis('v1')!;
    expect(z.druh).toBe('volba');
    expect(z.kdy).toMatch(/^\d{4}-/);
    expect(JSON.parse(u.getItem('atlas-denik')!).zapisy).toHaveLength(1);
  });
  it('nový zápis se stejným id přepíše starý, smazání ho odstraní', () => {
    ulozZapis({ id: 'v1', otazka: '?', odpoved: 'A', odkaz: '/' });
    ulozZapis({ id: 'v1', otazka: '?', odpoved: 'B', odkaz: '/' });
    expect(nacti().zapisy.map((z) => z.odpoved)).toEqual(['B']);
    smazZapis('v1');
    expect(najdiZapis('v1')).toBeUndefined();
  });
  it('stav bloků: uložení, přečtení po obnovení, smazání', () => {
    ulozStavBloku('spor-1', { prvni: 1, konecna: null });
    ulozStavBloku('kdo-1', { odhad: 'a', odkryto: true });
    _zapomenPamet();
    expect(stavBloku('spor-1')).toEqual({ prvni: 1, konecna: null });
    smazStavBloku('spor-1');
    expect(stavBloku('spor-1')).toBeUndefined();
    expect(stavBloku('kdo-1')).toEqual({ odhad: 'a', odkryto: true });
  });
  it('starší deník bez části bloky se načte a doplní', () => {
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [] }));
    expect(nacti().bloky).toEqual({});
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: [1] }));
    expect(nacti().bloky).toEqual({});
  });
  it('čas dokončení cesty se zapíše jednou a pozdější otevření kroku ho neposune', async () => {
    zaznamenejKrok('c', 1, 'Cesta', 3);
    zaznamenejKrok('c', 2, 'Cesta', 3);
    expect(nacti().cesty.c.dokonceno).toBeUndefined();
    zaznamenejKrok('c', 3, 'Cesta', 3);
    const dokonceno = nacti().cesty.c.dokonceno!;
    expect(dokonceno).toBe(nacti().cesty.c.kdy);
    await new Promise((r) => setTimeout(r, 5));
    zaznamenejKrok('c', 1, 'Cesta', 3);
    zaznamenejKrok('c', 3, 'Cesta', 3);
    _zapomenPamet();
    const c = nacti().cesty.c;
    expect(c.dokonceno).toBe(dokonceno);
    expect(c.kdy > dokonceno).toBe(true);
    expect(c.krok).toBe(3);
  });
  it('starý deník: cesta prošlá celá bez času dokončení dostane čas naposledy otevřeného kroku', () => {
    const kdy = '2026-09-20T10:00:00.000Z';
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], cesty: { c: { nazev: 'Cesta', pocet: 3, krok: 3, navstivene: [1, 2, 3], kdy } } }));
    expect(nacti().cesty.c.dokonceno).toBeUndefined();
    zaznamenejKrok('c', 2, 'Cesta', 3);
    expect(nacti().cesty.c.dokonceno).toBe(kdy);
    expect(nacti().cesty.c.kdy).not.toBe(kdy);
    // Rozpracovaná cesta ze starého deníku se dokončí až teď.
    expect(dokonceniCesty({ pocet: 3, navstivene: [1, 2], kdy }, [1, 2, 3], 3, 'TED')).toBe('TED');
    expect(dokonceniCesty({ pocet: 3, navstivene: [1, 2], kdy }, [1, 2], 3, 'TED')).toBeUndefined();
    expect(dokonceniCesty(undefined, [1], 1, 'TED')).toBe('TED');
    expect(dokonceniCesty({ dokonceno: 'DRIV', pocet: 3, navstivene: [1, 2, 3], kdy }, [1, 2, 3], 3, 'TED')).toBe('DRIV');
  });
  it('poškozený záznam nerozbije deník', () => {
    u.setItem('atlas-denik', '{nejde');
    expect(nacti().zapisy).toEqual([]);
  });
});

describe('deník bez localStorage', () => {
  beforeEach(() => { delete g.localStorage; _zapomenPamet(); });
  it('funguje v paměti do zavření stránky', () => {
    ulozStavBloku('b', { x: 1 });
    ulozZapis({ id: 'z', otazka: '?', odpoved: 'ano', odkaz: '/' });
    expect(stavBloku('b')).toEqual({ x: 1 });
    expect(najdiZapis('z')?.odpoved).toBe('ano');
  });
});

describe('deník: aktivita a cesty', () => {
  beforeEach(() => { (globalThis as unknown as { localStorage?: unknown }).localStorage = new Uloziste(); _zapomenPamet(); });
  afterEach(() => { delete (globalThis as unknown as { localStorage?: unknown }).localStorage; });

  it('stav s meta zapíše aktivitu, novější nahoře, smazání ji odstraní', () => {
    ulozStavBloku('a', { x: 1 }, { odkaz: '/x/#a', otazka: 'A?', druh: 'volba', hotovo: false });
    ulozStavBloku('b', { x: 2 }, { odkaz: '/x/#b', otazka: 'B?', druh: 'spor', hotovo: true });
    ulozStavBloku('a', { x: 3 }, { odkaz: '/x/#a', otazka: 'A?', druh: 'volba', hotovo: true });
    expect(nacti().aktivita.map((x) => [x.id, x.hotovo])).toEqual([['a', true], ['b', true]]);
    smazStavBloku('a');
    expect(nacti().aktivita.map((x) => x.id)).toEqual(['b']);
  });
  it('postup cesty: naposledy otevřený krok a navštívené kroky', () => {
    zaznamenejKrok('c', 1, 'Cesta', 6);
    zaznamenejKrok('c', 3, 'Cesta', 6);
    zaznamenejKrok('c', 2, 'Cesta', 6);
    _zapomenPamet();
    expect(nacti().cesty.c).toMatchObject({ krok: 2, navstivene: [1, 2, 3], pocet: 6, nazev: 'Cesta' });
  });
  it('starší deník bez aktivity a cest se doplní', () => {
    (globalThis as unknown as { localStorage: Uloziste }).localStorage.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [] }));
    expect(nacti().aktivita).toEqual([]);
    expect(nacti().cesty).toEqual({});
  });
});

describe('deník: naposledy čtený oddíl profilu', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });
  const ulozeno = () => JSON.parse(u.getItem('atlas-denik')!);

  it('ukládá jen kotvu u adresy stránky, deník zůstává verze 1 a pole je v uložených datech (tedy i v exportu)', () => {
    ulozCteni('/osobnost/sokrates/', 'soud');
    _zapomenPamet();
    expect(cteniStranky('/osobnost/sokrates/')).toBe('soud');
    expect(ulozeno().verze).toBe(1);
    expect(ulozeno().cteni).toEqual({ '/osobnost/sokrates/': 'soud' });
  });
  it('nový oddíl přepíše starý; stejný oddíl se podruhé nezapisuje', () => {
    ulozCteni('/osobnost/sokrates/', 'soud');
    ulozCteni('/osobnost/sokrates/', 'posledni-den');
    expect(cteniStranky('/osobnost/sokrates/')).toBe('posledni-den');
    let zapisu = 0;
    const puvodni = u.setItem.bind(u);
    u.setItem = (k: string, v: string) => { zapisu++; puvodni(k, v); };
    ulozCteni('/osobnost/sokrates/', 'posledni-den');
    expect(zapisu).toBe(0);
    ulozCteni('/osobnost/sokrates/', 'soud');
    expect(zapisu).toBe(1);
  });
  it('starší deník bez pole se načte beze změny a jiné části zůstanou', () => {
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [{ id: 'z', otazka: '?', odpoved: 'ano', odkaz: '/', kdy: '2026-10-01T10:00:00Z' }], vyzvy: [], navstivene: [] }));
    expect(nacti().cteni).toBeUndefined();
    expect(cteniStranky('/osobnost/sokrates/')).toBeUndefined();
    ulozCteni('/osobnost/sokrates/', 'soud');
    expect(nacti().zapisy).toHaveLength(1);
    expect(nacti().cteni).toEqual({ '/osobnost/sokrates/': 'soud' });
  });
  it('rozbité pole deník nerozbije', () => {
    for (const spatne of ['text', [1, 2], 5, null]) {
      u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], cteni: spatne }));
      expect(cteniStranky('/osobnost/sokrates/')).toBeUndefined();
      ulozCteni('/osobnost/sokrates/', 'soud');
      expect(cteniStranky('/osobnost/sokrates/')).toBe('soud');
    }
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], cteni: { '/a/': 7, '/b/': 'kotva' } }));
    expect(cteniStranky('/a/')).toBeUndefined();
    ulozCteni('/c/', 'x');
    expect(nacti().cteni).toEqual({ '/b/': 'kotva', '/c/': 'x' });
  });
  it('pamatuje si nejvýš třicet stránek, naposledy čtená zůstává', () => {
    for (let i = 0; i < 35; i++) ulozCteni(`/osobnost/o${i}/`, 'k');
    ulozCteni('/osobnost/o10/', 'znovu');
    const klice = Object.keys(nacti().cteni!);
    expect(klice).toHaveLength(30);
    expect(klice).not.toContain('/osobnost/o4/');
    expect(klice[0]).toBe('/osobnost/o5/');
    expect(klice.at(-1)).toBe('/osobnost/o10/');
  });
  it('bez localStorage drží do zavření stránky', () => {
    delete g.localStorage;
    _zapomenPamet();
    ulozCteni('/osobnost/sokrates/', 'soud');
    expect(cteniStranky('/osobnost/sokrates/')).toBe('soud');
  });
});

describe('deník: dočtené kapitoly (prectene)', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });
  const ulozeno = () => JSON.parse(u.getItem('atlas-denik')!);

  it('dočtená je kapitola, jejíž konec byl vidět a student v ní strávil aspoň čas přelétnutí', () => {
    // 1000 slov při 500 slovech za minutu = 2 minuty.
    expect(kapitolaDoctena({ slov: 1000, casMs: 120_000, konecVidet: true })).toBe(true);
    expect(kapitolaDoctena({ slov: 1000, casMs: 119_000, konecVidet: true })).toBe(false);
    expect(kapitolaDoctena({ slov: 1000, casMs: 600_000, konecVidet: false })).toBe(false);
    // Krátká kapitola chce aspoň deset vteřin, prázdná taky.
    expect(kapitolaDoctena({ slov: 30, casMs: 9_000, konecVidet: true })).toBe(false);
    expect(kapitolaDoctena({ slov: 30, casMs: NEJKRATSI_CTENI_MS, konecVidet: true })).toBe(true);
    expect(kapitolaDoctena({ slov: 0, casMs: NEJKRATSI_CTENI_MS, konecVidet: true })).toBe(true);
    expect(PRELETENI_SLOV_ZA_MINUTU).toBe(500);
  });
  it('kotvy kapitol u adresy profilu, bez opakování; verze 1 a pole v uložených datech (tedy i v exportu)', () => {
    ulozPrectenou('/osobnost/sokrates/', 'soud');
    ulozPrectenou('/osobnost/sokrates/', 'delfy');
    ulozPrectenou('/osobnost/sokrates/', 'soud');
    ulozPrectenou('/osobnost/seneca/', 'vyhnanstvi');
    _zapomenPamet();
    expect(prectene()).toEqual({ '/osobnost/sokrates/': ['soud', 'delfy'], '/osobnost/seneca/': ['vyhnanstvi'] });
    expect(ulozeno().verze).toBe(1);
    expect(ulozeno().prectene['/osobnost/sokrates/']).toEqual(['soud', 'delfy']);
  });
  it('sPrectenou nemění původní deník a stejnou kapitolu vrátí beze změny', () => {
    const d = nacti();
    const s = sPrectenou(d, '/osobnost/sokrates/', 'soud');
    expect(d.prectene).toBeUndefined();
    expect(sPrectenou(s, '/osobnost/sokrates/', 'soud')).toBe(s);
  });
  it('starší deník bez pole se načte beze změny; rozbité pole deník nerozbije', () => {
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], cteni: { '/osobnost/sokrates/': 'soud' } }));
    expect(nacti().prectene).toBeUndefined();
    expect(prectene()).toEqual({});
    expect(nacti().cteni).toEqual({ '/osobnost/sokrates/': 'soud' });
    for (const spatne of ['text', [1], 5, null]) {
      u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], prectene: spatne }));
      expect(prectene()).toEqual({});
      ulozPrectenou('/a/', 'k');
      expect(prectene()).toEqual({ '/a/': ['k'] });
    }
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], prectene: { '/a/': 'k', '/b/': ['x', 3] } }));
    expect(prectene()).toEqual({ '/b/': ['x'] });
  });
});

describe('deník: otevřené hodiny', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });

  it('nejnovější nahoře; stejná adresa se přesune nahoru s novým časem a názvem', () => {
    let d = nacti();
    d = sHodinou(d, { adresa: '/hodina/?a', nazev: 'A' }, '2026-10-01T10:00:00Z');
    d = sHodinou(d, { adresa: '/hodina/?b', nazev: 'B' }, '2026-10-02T10:00:00Z');
    d = sHodinou(d, { adresa: '/hodina/?a', nazev: 'A2' }, '2026-10-03T10:00:00Z');
    expect(d.hodiny).toEqual([
      { adresa: '/hodina/?a', nazev: 'A2', kdy: '2026-10-03T10:00:00Z' },
      { adresa: '/hodina/?b', nazev: 'B', kdy: '2026-10-02T10:00:00Z' },
    ]);
  });
  it('nejvýš deset; nejdéle neotevřená vypadne', () => {
    let d = nacti();
    for (let i = 0; i < 12; i++) d = sHodinou(d, { adresa: `/hodina/?${i}`, nazev: `H${i}` }, `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00Z`);
    expect(d.hodiny).toHaveLength(HODINY_NEJVYS);
    expect(d.hodiny![0].nazev).toBe('H11');
    expect(d.hodiny!.map((h) => h.nazev)).not.toContain('H1');
    expect(d.hodiny!.at(-1)!.nazev).toBe('H2');
  });
  it('zápis do úložiště: verze 1, pole v exportu; starší deník se načte, rozbité položky vypadnou', () => {
    zaznamenejHodinu('/hodina/?v=1&n=Delfy&z=k:a/1', 'Delfy');
    _zapomenPamet();
    const ulozeno = JSON.parse(u.getItem('atlas-denik')!);
    expect(ulozeno.verze).toBe(1);
    expect(ulozeno.hodiny[0]).toMatchObject({ adresa: '/hodina/?v=1&n=Delfy&z=k:a/1', nazev: 'Delfy' });
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [] }));
    expect(nacti().hodiny).toBeUndefined();
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], hodiny: [{ adresa: '/hodina/?a', nazev: 'A', kdy: 'x' }, { adresa: 5 }, null] }));
    expect(nacti().hodiny).toEqual([{ adresa: '/hodina/?a', nazev: 'A', kdy: 'x' }]);
    u.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], hodiny: 'x' }));
    expect(nacti().hodiny).toBeUndefined();
  });
});

// Nahrání deníku ze souboru (revize antiky, O): soubor se přidá k deníku v prohlížeči a nic nesmaže.
describe('spojení deníku ze souboru s deníkem v prohlížeči', () => {
  const zaklad = (d: Partial<Denik>): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...d });
  const zapis = (id: string, odpoved: string, kdy: string) => ({ id, otazka: 'Otázka', odpoved, odkaz: '/x/', kdy });

  it('co je jen v jednom, zůstane; u stejného zápisu vyhraje novější', () => {
    const tady = zaklad({ zapisy: [zapis('a', 'tady', '2026-10-01T10:00:00Z'), zapis('b', 'jen tady', '2026-10-02T10:00:00Z')] });
    const soubor = zaklad({ zapisy: [zapis('a', 'ze souboru', '2026-10-05T10:00:00Z'), zapis('c', 'jen v souboru', '2026-09-30T10:00:00Z')] });
    const s = spojDeniky(tady, soubor);
    expect(s.zapisy.map((z) => [z.id, z.odpoved])).toEqual([['c', 'jen v souboru'], ['b', 'jen tady'], ['a', 'ze souboru']]);
    expect(spojDeniky(soubor, tady).zapisy.find((z) => z.id === 'a')!.odpoved).toBe('ze souboru');
  });

  it('stav bloku jde s časem poslední aktivity; bez času zůstane ten z prohlížeče', () => {
    const akt = (id: string, kdy: string) => ({ id, odkaz: '/x/', otazka: 'O', druh: 'volba' as const, hotovo: true, kdy });
    const tady = zaklad({ bloky: { a: 'tady', b: 'tady', d: 'tady' }, aktivita: [akt('a', '2026-10-01T10:00:00Z'), akt('b', '2026-10-09T10:00:00Z')] });
    const soubor = zaklad({ bloky: { a: 'soubor', b: 'soubor', c: 'soubor', d: 'soubor' }, aktivita: [akt('a', '2026-10-03T10:00:00Z'), akt('b', '2026-10-02T10:00:00Z')] });
    const s = spojDeniky(tady, soubor);
    expect(s.bloky).toEqual({ a: 'soubor', b: 'tady', c: 'soubor', d: 'tady' });
    expect(s.aktivita.map((x) => [x.id, x.kdy])).toEqual([['b', '2026-10-09T10:00:00Z'], ['a', '2026-10-03T10:00:00Z']]);
  });

  it('postup v cestě sečte otevřené kroky, krok vezme z novějšího a dokončení z dřívějšího', () => {
    const tady = zaklad({ cesty: { c: { nazev: 'C', pocet: 4, krok: 2, navstivene: [1, 2], kdy: '2026-10-05T10:00:00Z' } } });
    const soubor = zaklad({ cesty: { c: { nazev: 'C', pocet: 4, krok: 4, navstivene: [1, 3, 4], kdy: '2026-10-03T10:00:00Z' }, d: { nazev: 'D', pocet: 2, krok: 2, navstivene: [1, 2], kdy: '2026-10-01T10:00:00Z', dokonceno: '2026-10-01T10:00:00Z' } } });
    const s = spojDeniky(tady, soubor);
    expect(s.cesty.c).toEqual({ nazev: 'C', pocet: 4, krok: 2, navstivene: [1, 2, 3, 4], kdy: '2026-10-05T10:00:00Z', dokonceno: '2026-10-05T10:00:00Z' });
    expect(s.cesty.d.dokonceno).toBe('2026-10-01T10:00:00Z');
    const a = zaklad({ cesty: { c: { ...soubor.cesty.c, navstivene: [1, 2, 3, 4], dokonceno: '2026-10-04T10:00:00Z' } } });
    const b = zaklad({ cesty: { c: { ...soubor.cesty.c, navstivene: [1, 2, 3, 4], dokonceno: '2026-10-02T10:00:00Z' } } });
    expect(spojDeniky(a, b).cesty.c.dokonceno).toBe('2026-10-02T10:00:00Z');
  });

  it('výzvy, navštívené stránky, dočtené kapitoly a hodiny bez opakování', () => {
    const tady = zaklad({ vyzvy: [{ id: 'v', nazev: 'V', odkaz: '/v/', prijato: '2026-10-01T10:00:00Z', poznamka: 'tady' }], navstivene: [{ odkaz: '/a/', nazev: 'A', kdy: '2026-10-01T10:00:00Z' }], prectene: { '/p/': ['a'] }, hodiny: [{ adresa: '/h/', nazev: 'H', kdy: '2026-10-01T10:00:00Z' }] });
    const soubor = zaklad({ vyzvy: [{ id: 'v', nazev: 'V', odkaz: '/v/', prijato: '2026-10-03T10:00:00Z' }, { id: 'w', nazev: 'W', odkaz: '/w/', prijato: '2026-10-03T10:00:00Z' }], navstivene: [{ odkaz: '/a/', nazev: 'A', kdy: '2026-10-04T10:00:00Z' }, { odkaz: '/b/', nazev: 'B', kdy: '2026-10-02T10:00:00Z' }], prectene: { '/p/': ['b', 'a'], '/q/': ['c'] }, hodiny: [{ adresa: '/h/', nazev: 'H', kdy: '2026-10-05T10:00:00Z' }] });
    const s = spojDeniky(tady, soubor);
    expect(s.vyzvy.map((v) => v.id)).toEqual(['v', 'w']);
    expect(s.vyzvy[0].poznamka).toBe('tady');
    expect(s.navstivene.map((v) => [v.odkaz, v.kdy])).toEqual([['/a/', '2026-10-04T10:00:00Z'], ['/b/', '2026-10-02T10:00:00Z']]);
    expect(s.prectene).toEqual({ '/p/': ['a', 'b'], '/q/': ['c'] });
    expect(s.hodiny).toEqual([{ adresa: '/h/', nazev: 'H', kdy: '2026-10-05T10:00:00Z' }]);
  });

  it('poškozené záznamy ze souboru se vynechají a jiný soubor deník není', () => {
    const soubor = { ...zaklad({}), zapisy: [{ id: 'x' }, null, zapis('ok', 'ano', '2026-10-01T10:00:00Z')], cesty: { zle: { nazev: 'Z' } } } as unknown as Denik;
    const s = spojDeniky(zaklad({}), soubor);
    expect(s.zapisy.map((z) => z.id)).toEqual(['ok']);
    expect(s.cesty).toEqual({});
    expect(rozeberDenik('{"verze":2}')).toBeNull();
    expect(rozeberDenik('nic')).toBeNull();
    expect(rozeberDenik('null')).toBeNull();
  });
});

describe('nahrání deníku do úložiště', () => {
  let u: Uloziste;
  beforeEach(() => { u = new Uloziste(); g.localStorage = u; _zapomenPamet(); });
  afterEach(() => { delete g.localStorage; });

  it('přidá soubor k deníku v prohlížeči a cizí soubor odmítne beze změny', () => {
    ulozZapis({ id: 'tady', otazka: 'O', odpoved: 'A', odkaz: '/x/' });
    const soubor = JSON.stringify({ verze: 1, zapisy: [{ id: 'jinde', otazka: 'O', odpoved: 'B', odkaz: '/y/', kdy: '2026-10-01T10:00:00Z' }], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} });
    expect(nahrajDenik(soubor)).toBe(true);
    expect(nacti().zapisy.map((z) => z.id).sort()).toEqual(['jinde', 'tady']);
    const pred = u.getItem('atlas-denik');
    expect(nahrajDenik('{"jine":true}')).toBe(false);
    expect(u.getItem('atlas-denik')).toBe(pred);
  });
});
