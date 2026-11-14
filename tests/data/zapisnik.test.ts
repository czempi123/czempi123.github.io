// Můj deník jako zápisník (design-v2, K6): odpůrce v Moje filozofie, záznamy podle cest, sbírka, připomenutí zálohy,
// vystřižené citáty ve spojení deníků, přenos odkazem a stůl na Domů.
import { describe, it, expect } from 'vitest';
import { prehledObdobi, type KatalogObdobi } from '../../src/lib/tvoje-obdobi';
import { popisStran } from '../../src/lib/strany';
import { zaznamyPodleCest, pahylyCest, potkaniFilozofove, pripomenutiZalohy, krokZAdresy } from '../../src/lib/zapisnik';
import { spojDeniky, sCitatem, rozeberDenik, CITATY_NEJVYS, type Denik } from '../../src/lib/denik';
import { zakodujDenik, dekodujDenik, kodZKotvy, odkazPrenosu } from '../../src/lib/prenos';
import { vety, prvniVeta, uryvek, otazkaPokusu, pohledniceZObdobi, vyberDne, DELKA_URYVKU } from '../../src/lib/stul';

const T = '2026-11-01T10:00:00.000Z';
const prazdny = (cast: Partial<Denik> = {}): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });

const KATALOG: KatalogObdobi = {
  otazky: [{ cislo: 1, slug: 'jak-zit', otazka: 'Jak mám žít?', adresa: '/otazka/jak-zit/', duvody: { aristoteles: 'Štěstí je činnost.' } }],
  cesty: [{ slug: 'kolik-je-dost', nazev: 'Kolik je dost?', cislo: 6, otazka: 1 }],
  bloky: [
    {
      id: 'cesta6-kynici-spor', cesta: 'kolik-je-dost', adresa: '/cesta/kolik-je-dost/4/#cesta6-kynici-spor',
      popis: popisStran({ druh: 'spor', strany: [{ osoba: 'diogenes' }, { osoba: 'epikuros' }] })!,
      odpovedi: [
        { kod: 'diogenes', text: 'Potřebovat co nejméně.', zastanci: [{ osoba: 'diogenes', duvod: 'Každá potřeba je provázek.' }] },
        { kod: 'epikuros', text: 'Vědět, co mi stačí.', zastanci: [{ osoba: 'epikuros', duvod: 'Slast má strop.' }] },
        { kod: 'uprostred', text: 'Uprostřed sporu', zastanci: [] },
      ],
    },
    {
      id: 'cesta6-volba', cesta: 'kolik-je-dost', adresa: '/cesta/kolik-je-dost/2/#cesta6-volba',
      popis: popisStran({ druh: 'volba', moznosti: [{}, {}] })!,
      odpovedi: [
        { kod: 'A', text: 'Nový telefon', zastanci: [{ osoba: 'aristoteles' }] },
        { kod: 'B', text: 'Nic nového', zastanci: [{ osoba: 'diogenes' }] },
      ],
    },
  ],
  osoby: {
    diogenes: { id: 'diogenes', jmeno: 'Diogenés', obdobi: 1 },
    epikuros: { id: 'epikuros', jmeno: 'Epikúros', obdobi: 2 },
    aristoteles: { id: 'aristoteles', jmeno: 'Aristotelés', obdobi: 1 },
  },
};

describe('Moje filozofie: kdo by mi nejvíc odporoval', () => {
  it('je zastánce jiné odpovědi, který studentovi nikde nebyl blízko, s důvodem z cesty', () => {
    // Spor: student skončil u Epikúra (poloha 3 a víc je druhá strana); Volba: zvolil B (Diogenés).
    const d = prazdny({ bloky: { 'cesta6-kynici-spor': { prvni: 1, konecna: 3, duvod: '' }, 'cesta6-volba': { vyber: 1, proc: '', potvrzeno: true } } });
    const [o] = prehledObdobi(d, KATALOG);
    expect(o.blizci.map((b) => b.osoba.id)).toEqual(['epikuros', 'diogenes']);
    // Diogenés byl ve Volbě blízko, takže odpůrcem je Aristotelés z druhé možnosti Volby.
    expect(o.odpurce?.osoba.id).toBe('aristoteles');
    expect(o.odpurce?.odpoved).toBe('Nový telefon');
    expect(o.odpurce?.duvod).toBe('Štěstí je činnost.');
  });
  it('bez odpovědi v blocích odpůrce není', () => {
    const d = prazdny({ zapisy: [{ id: 'otazka-jak-zit-prvni', otazka: 'x', odpoved: 'Nevím.', odkaz: '/', kdy: T }] });
    expect(prehledObdobi(d, KATALOG)[0].odpurce).toBeUndefined();
  });
});

describe('záznamy podle cest', () => {
  it('rozpozná krok i s kotvou a seřadí záznamy po krocích; volbu bere z katalogu a z odpovědi ji vypustí', () => {
    expect(krokZAdresy('/cesta/kolik-je-dost/3/#blok')).toEqual({ slug: 'kolik-je-dost', krok: 3 });
    expect(krokZAdresy('/osobnost/sokrates/')).toBeNull();
    const d = prazdny({
      cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 4, navstivene: [1, 2, 3, 4], kdy: T } },
      bloky: { 'cesta6-volba': { vyber: 0, proc: 'Ten starý se rozbil.', potvrzeno: true } },
      zapisy: [
        { id: 'cesta6-pravidlo', otazka: 'Pravidlo', odpoved: 'Stačí málo.', odkaz: '/cesta/kolik-je-dost/7/#cesta6-pravidlo', kdy: T },
        { id: 'cesta6-volba', otazka: 'Co chceš?', odpoved: 'A · Nový telefon. Proč: Ten starý se rozbil.', odkaz: '/cesta/kolik-je-dost/2/#cesta6-volba', kdy: T },
        { id: 'jinde', otazka: 'x', odpoved: 'y', odkaz: '/osobnost/sokrates/', kdy: T },
      ],
    });
    const [c] = zaznamyPodleCest(d, KATALOG);
    expect(c.slug).toBe('kolik-je-dost');
    expect(c.hotova).toBe(false);
    expect(c.zaznamy.map((z) => z.krok)).toEqual([2, 7]);
    expect(c.zaznamy[0]).toMatchObject({ volba: 'Nový telefon', odpoved: 'Ten starý se rozbil.' });
  });
  it('cesta bez záznamu se neukáže', () => {
    expect(zaznamyPodleCest(prazdny({ cesty: { a: { nazev: 'A', pocet: 2, krok: 1, navstivene: [1], kdy: T } } }), KATALOG)).toEqual([]);
  });
});

describe('sbírka', () => {
  it('pahýly jen u cest s odtrženým pahýlem, od nejstaršího', () => {
    const d = prazdny({ cesty: {
      b: { nazev: 'B', pocet: 8, krok: 8, navstivene: [1], kdy: T, pahyl: '2026-11-05T00:00:00Z' },
      a: { nazev: 'A', pocet: 7, krok: 7, navstivene: [1], kdy: T, pahyl: '2026-11-02T00:00:00Z' },
      c: { nazev: 'C', pocet: 7, krok: 3, navstivene: [1], kdy: T },
    } });
    expect(pahylyCest(d).map((p) => p.slug)).toEqual(['a', 'b']);
  });
  it('potkaní filozofové ze stránek i z cest, každý jednou v pořadí setkání', () => {
    const d = prazdny({
      navstivene: [{ odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: '2026-11-03T00:00:00Z' }],
      cesty: { c1: { nazev: 'C1', pocet: 7, krok: 1, navstivene: [1], kdy: '2026-11-01T00:00:00Z' } },
    });
    const m = { stranky: { '/osobnost/sokrates/': 'sokrates' }, cesty: { c1: ['sokrates', 'protagoras'] } };
    expect(potkaniFilozofove(d, m)).toEqual(['sokrates', 'protagoras']);
  });
  it('vystřižený citát se nezdvojí, nejnovější je první a sbírka má strop', () => {
    let d = prazdny();
    d = sCitatem(d, { id: 'a', text: 'A', kde: 'X', odkaz: '/' }, '2026-11-01T00:00:00Z');
    d = sCitatem(d, { id: 'b', text: 'B', kde: 'X', odkaz: '/' }, '2026-11-02T00:00:00Z');
    d = sCitatem(d, { id: 'a', text: 'A', kde: 'X', odkaz: '/' }, '2026-11-03T00:00:00Z');
    expect(d.citaty!.map((c) => c.id)).toEqual(['a', 'b']);
    for (let i = 0; i < CITATY_NEJVYS + 5; i++) d = sCitatem(d, { id: `c${i}`, text: '', kde: '', odkaz: '/' }, T);
    expect(d.citaty!.length).toBe(CITATY_NEJVYS);
  });
  it('spojení deníků drží citáty z obou a čas zálohy jen z prohlížeče; poškozený citát vypadne', () => {
    const ten = prazdny({ citaty: [{ id: 'a', text: 'A', kde: 'X', odkaz: '/', kdy: T }], zaloha: T });
    const soubor = prazdny({ citaty: [{ id: 'b', text: 'B', kde: 'X', odkaz: '/', kdy: T }, { id: 'zly' } as never], zaloha: '2030-01-01T00:00:00Z' });
    const s = spojDeniky(ten, soubor);
    expect(s.citaty!.map((c) => c.id).sort()).toEqual(['a', 'b']);
    expect(s.zaloha).toBe(T);
    expect(spojDeniky(prazdny(), soubor).zaloha).toBeUndefined();
    expect(rozeberDenik(JSON.stringify({ ...prazdny(), citaty: 'nesmysl', zaloha: 5 }))).toMatchObject({ verze: 1 });
    expect(rozeberDenik(JSON.stringify({ ...prazdny(), citaty: 'nesmysl' }))!.citaty).toBeUndefined();
  });
});

describe('připomenutí zálohy', () => {
  const hotova = (dokonceno: string) => ({ nazev: 'C', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: dokonceno, dokonceno });
  it('připomene nejnověji dokončenou cestu po poslední záloze', () => {
    expect(pripomenutiZalohy(prazdny({ cesty: { a: hotova('2026-11-02T00:00:00Z'), b: hotova('2026-11-04T00:00:00Z') } }))).toEqual({ slug: 'b', nazev: 'C' });
    expect(pripomenutiZalohy(prazdny({ zaloha: '2026-11-05T00:00:00Z', cesty: { a: hotova('2026-11-04T00:00:00Z') } }))).toBeNull();
    expect(pripomenutiZalohy(prazdny())).toBeNull();
  });
});

describe('přenos odkazem', () => {
  it('deník projde kódem tam a zpátky; cizí kód dá null', async () => {
    const d = prazdny({ zapisy: [{ id: 'a', otazka: 'Kdy mám dobrý důvod věřit?', odpoved: 'Když hledám, co by to vyvrátilo.', odkaz: '/', kdy: T }] });
    const kod = await zakodujDenik(d);
    expect(kod).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await dekodujDenik(kod)).toMatchObject({ zapisy: d.zapisy });
    expect(await dekodujDenik('nesmysl!!')).toBeNull();
    expect(kodZKotvy(`#prenos=${kod}`)).toBe(kod);
    expect(kodZKotvy('#jinde')).toBeNull();
    expect(odkazPrenosu('https://czempi123.github.io/', 'abc')).toBe('https://czempi123.github.io/denik/#prenos=abc');
  });
});

describe('stůl na Domů', () => {
  it('zkratky letopočtu větu nekončí', () => {
    const t = 'V Athénách se roku 423 př. n. l. hrála komedie. Filozof visí v koši. A jmenuje se Sókratés.';
    expect(vety(t)).toEqual(['V Athénách se roku 423 př. n. l. hrála komedie.', 'Filozof visí v koši.', 'A jmenuje se Sókratés.']);
    expect(prvniVeta(t)).toBe('V Athénách se roku 423 př. n. l. hrála komedie.');
  });
  it('úryvek má celé věty, aspoň dvě, a nepřeteče délku', () => {
    const dlouha = 'Slovo '.repeat(60).trim() + '.';
    const u = uryvek(`První věta. Druhá věta. ${dlouha} Čtvrtá.`);
    expect(u).toBe('První věta. Druhá věta.');
    expect(u.length).toBeLessThanOrEqual(DELKA_URYVKU);
  });
  it('kartička pokusu: otázka jako nadpis, druhá věta pod ním', () => {
    expect(otazkaPokusu('Co bys dělal, kdybys byl neviditelný? Jeden z nejstarších pokusů. Třetí.')).toEqual({ titulek: 'Co bys dělal, kdybys byl neviditelný?', zbytek: 'Jeden z nejstarších pokusů.' });
  });
  it('pohlednice z úvodní scény období', () => {
    const mdx = '<Pribeh id="x" obdobi={1} nadtitulek="Athény, 423 př. n. l." titulek="Filozof *v koši*">\n\nV Athénách se roku 423 př. n. l. hrála *komedie*. Filozof visí v koši.\n\n</Pribeh>';
    expect(pohledniceZObdobi(mdx, { id: 1 }, '/obdobi/x/#uvod')).toEqual([{ obdobi: 1, kde: 'Athény, 423 př. n. l.', titulek: 'Filozof v koši', text: 'V Athénách se roku 423 př. n. l. hrála komedie. Filozof visí v koši.', adresa: '/obdobi/x/#uvod' }]);
    expect(pohledniceZObdobi('bez příběhu', { id: 1 }, '/')).toEqual([]);
  });
  it('výběr dne se střídá dokola a je v mezích', () => {
    const den = 86_400_000;
    const a = vyberDne(Date.UTC(2026, 10, 14, 12), 3);
    expect(vyberDne(Date.UTC(2026, 10, 15, 12), 3)).toBe((a + 1) % 3);
    expect(vyberDne(Date.UTC(2026, 10, 14, 12) + 3 * den, 3)).toBe(a);
    expect(vyberDne(Date.now(), 0)).toBe(0);
  });
});
