// Kartičky v deníku (denik-v2, K3): líc a rub ze všech zdrojů, které zápisy dostanou Do kartiček, hromádka na dnes
// (obnovení stránky ji nerozdá znovu, doplní se do pěti, Ještě pět), pojmy, které student potkal, a data kartiček
// z atlasu (antika: žádný líc kvízu neprozradí odpověď, každý podnět je v datech jednou).
import { describe, it, expect } from 'vitest';
import { klicKarticky, sKartickou, sHodnocenim, posunDatum, type Denik, type Zapis } from '../../src/lib/denik';
import {
  zapisSTextem, obsahKarticky, zdrojExistuje, hromadkaDne, aktualniKarticka, zbyvaNaRade, jestePet, dalsiVHromadce,
  potkanePojmy, platnaHromadka, mistoPojmu, otazkaBezPokynu, type DataKarticek,
} from '../../src/lib/karticky';
import { potkaneZDeniku } from '../../src/lib/herna/zustalo';
import { dataKarticek } from '../../src/components/denik/_karticky-data';
import { katalogZustalo } from '../../src/lib/herna/zustalo-data';

const prazdny = (cast: Partial<Denik> = {}): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });
const T = '2026-11-02T08:00:00.000Z';
const DNES = '2026-11-02';
const zapis = (cast: Partial<Zapis>): Zapis => ({ id: 'z', otazka: 'Jaké je tvoje pravidlo?', odpoved: 'Nejdřív se zeptám.', odkaz: '/cesta/kolik-je-dost/7/', kdy: T, ...cast });

const DATA: DataKarticek = {
  pojmy: {
    klid: { id: 'klid', nazev: 'Ataraxie', vysvetleni: 'Klid duše. Druhá věta.', priklad: 'Zpráva pípne.', obdobi: 2, mista: [
      { klic: 'cesta/kolik-je-dost/3', href: '/cesta/kolik-je-dost/3/', text: 'Zpátky do kroku 3 cesty Kolik je dost?' },
      { klic: '/osobnost/epikuros/', href: '/osobnost/epikuros/', text: 'Zpátky na stránku Epikúra' },
    ] },
    logos: { id: 'logos', nazev: 'Logos', vysvetleni: 'Řád. Druhá.', priklad: 'Řeka.', obdobi: 1, mista: [{ klic: '/osobnost/herakleitos/', href: '/osobnost/herakleitos/', text: 'Zpátky' }] },
  },
  zustalo: { 'hlas:jak-zit:epiktetos': { id: 'hlas:jak-zit:epiktetos', podnet: 0, zadani: 'Co by ti na to řekl Epiktétos?', spravna: 'Rozliš, co máš v rukou.', vysvetleni: '„Citát.“', zpet: { href: '/otazka/jak-zit/', text: 'Zpátky k otázce' } } },
  podnety: ['Případ první odstavec.\n\nDruhý odstavec.'],
  obdobiZustalo: 2,
};

describe('zápis s vlastním textem', () => {
  it('pravidlo, odpověď Teď a sebehodnocení ano; Volba bez důvodu a prázdný zápis ne', () => {
    expect(zapisSTextem(zapis({ druh: 'stanovisko' }))).toBe(true);
    expect(zapisSTextem(zapis({ druh: 'sebehodnoceni', odpoved: 'Šlo mi to.' }))).toBe(true);
    expect(zapisSTextem(zapis({}))).toBe(true);
    expect(zapisSTextem(zapis({ odpoved: '  ' }))).toBe(false);
    expect(zapisSTextem(zapis({ druh: 'volba', odpoved: 'A · Zavolám mu.' }))).toBe(false);
    expect(zapisSTextem(zapis({ druh: 'volba', odpoved: 'A · Zavolám mu. Proč: Chybí mi.' }))).toBe(true);
    expect(zapisSTextem(zapis({ druh: 'kdo-by', odpoved: 'Můj výběr: Epikúros.' }))).toBe(false);
    expect(zapisSTextem(zapis({ druh: 'spor', odpoved: 'Na začátku: blíž A. Po argumentech: blíž A.' }))).toBe(false);
    expect(zapisSTextem(zapis({ druh: 'spor', odpoved: 'Na začátku: blíž A. Po argumentech: blíž B. Co mě posunulo: Příklad.' }))).toBe(true);
    expect(zapisSTextem(zapis({ druh: 'roztrid', odpoved: 'Ze zkušenosti: věta.' }))).toBe(false);
  });
});

describe('líc a rub', () => {
  const potkane = new Set(['/osobnost/epikuros/']);
  it('pojem: název a otázka na lícu, vysvětlení, příklad a místo, kde ho student potkal', () => {
    const d = sKartickou(prazdny(), 'pojem', 'klid', T);
    const o = obsahKarticky(d.karticky!['pojem:klid'], d, DATA, potkane)!;
    expect(o.lic).toEqual({ nazev: 'Ataraxie', odstavce: [], otazka: 'Co to znamená? Řekni si to vlastními slovy.' });
    expect(o.rub.odstavce).toEqual(['Klid duše. Druhá věta.', 'Zpráva pípne.']);
    expect(o.rub.zpet).toEqual({ href: '/osobnost/epikuros/', text: 'Zpátky na stránku Epikúra' });
    expect(o.obdobi).toBe(2);
    expect(mistoPojmu(DATA.pojmy.klid, new Set()).href).toBe('/pojem/klid/');
  });
  it('citát: odkud na lícu, znění a poznámka na rubu', () => {
    const d = sKartickou(prazdny({ citaty: [{ id: 'c1', text: 'Věta.', kde: 'Seneca, Dopisy 1', odkaz: '/osobnost/seneca/#cas', kdy: T, poznamka: 'Proto.' }] }), 'citat', 'c1', T);
    const o = obsahKarticky(d.karticky!['citat:c1'], d, DATA, potkane, { '/osobnost/seneca/': { nazev: 'Seneca', obdobi: 2 } })!;
    expect(o.lic.nazev).toBe('Seneca, Dopisy 1');
    expect(o.lic.pod).toBe('Stránka Seneca');
    expect(o.rub.citat).toBe('Věta.');
    expect(o.rub.pero).toBe('Proto.');
    expect(o.rub.zpet?.href).toBe('/osobnost/seneca/#cas');
  });
  it('zápis: otázka zápisu na lícu, odpověď a Platí to pro tebe pořád? s odkazem na rubu', () => {
    const d = sKartickou(prazdny({ zapisy: [zapis({})] }), 'zapis', 'z', T);
    const o = obsahKarticky(d.karticky!['zapis:z'], d, DATA, potkane, { '/cesta/kolik-je-dost/': { nazev: 'Kolik je dost?', obdobi: 2 } })!;
    expect(o.lic).toMatchObject({ nazev: 'Jaké je tvoje pravidlo?', pod: 'Cesta Kolik je dost?', otazka: 'Vybavíš si svou odpověď?' });
    expect(o.rub).toMatchObject({ pero: 'Nejdřív se zeptám.', dotaz: 'Platí to pro tebe pořád?', zpet: { href: '/cesta/kolik-je-dost/7/' } });
    expect(o.obdobi).toBe(2);
  });
  it('zápis: na lícu bez pokynu k psaní; stránka mimo cestu je Stránka', () => {
    const smrt = 'Je rozumné bát se smrti? A co se strachem, který zbude? Napiš svoje pravidlo.';
    const d = sKartickou(prazdny({ zapisy: [zapis({ otazka: smrt, odkaz: '/cesta/proc-se-bat-smrti/7/' }), zapis({ id: 'p', otazka: 'Co ti chybí?', odkaz: '/osobnost/seneca/#cas' })] }), 'zapis', 'z', T);
    const stranky = { '/cesta/proc-se-bat-smrti/': { nazev: 'Proč se bát smrti?', obdobi: 2 }, '/osobnost/seneca/': { nazev: 'Seneca', obdobi: 2 } };
    const o = obsahKarticky(d.karticky!['zapis:z'], d, DATA, potkane, stranky)!;
    expect(o.lic).toMatchObject({ nazev: 'Je rozumné bát se smrti? A co se strachem, který zbude?', pod: 'Cesta Proč se bát smrti?' });
    const p = obsahKarticky({ ...d.karticky!['zapis:z'], ref: 'p' }, d, DATA, potkane, stranky)!;
    expect(p.lic.pod).toBe('Stránka Seneca');
    expect(otazkaBezPokynu('Platí Hérakleitova věta i o lodi z prvního kroku? Napiš, v čem je loď jako řeka a v čem ne.')).toBe('Platí Hérakleitova věta i o lodi z prvního kroku?');
    expect(otazkaBezPokynu('Napiš svoje pravidlo.')).toBe('Napiš svoje pravidlo.');
    expect(otazkaBezPokynu('Co máš ve svých rukou?')).toBe('Co máš ve svých rukou?');
  });
  it('Co ti zůstalo?: podnět a zadání bez možností, na rubu správná odpověď, vysvětlení a zpět', () => {
    const d = sKartickou(prazdny(), 'zustalo', 'hlas:jak-zit:epiktetos', T);
    const o = obsahKarticky(d.karticky!['zustalo:hlas:jak-zit:epiktetos'], d, DATA, potkane)!;
    expect(o.lic).toEqual({ odstavce: ['Případ první odstavec.', 'Druhý odstavec.'], otazka: 'Co by ti na to řekl Epiktétos?' });
    expect(o.rub).toMatchObject({ odpoved: 'Rozliš, co máš v rukou.', odstavce: ['„Citát.“'], zpet: { href: '/otazka/jak-zit/' } });
  });
  it('bez zdroje nic: vyndaný citát, smazaný zápis, neznámý pojem', () => {
    const d = sKartickou(sKartickou(sKartickou(prazdny(), 'citat', 'pryc', T), 'zapis', 'pryc', T), 'pojem', 'neni', T);
    for (const k of Object.values(d.karticky!)) expect(obsahKarticky(k, d, DATA, potkane)).toBeNull();
    expect(zdrojExistuje(DATA)({ zdroj: 'pojem', ref: 'neni' })).toBe(false);
    expect(zdrojExistuje(DATA)({ zdroj: 'zustalo', ref: 'hlas:jak-zit:epiktetos' })).toBe(true);
  });
});

describe('hromádka na dnes', () => {
  const sPojmy = (n: number) => {
    let d = prazdny();
    for (let i = 0; i < n; i++) d = sKartickou(d, 'pojem', `p${i}`, `2026-11-02T08:0${i}:00.000Z`);
    return d;
  };
  it('nejvýš pět, obnovení stránky ji nerozdá znovu, po ohodnocení Na dnes stačí a Ještě pět', () => {
    let d = sPojmy(7);
    const h = hromadkaDne(d, DNES, null);
    expect(h.klice).toEqual(['p0', 'p1', 'p2', 'p3', 'p4'].map((r) => klicKarticky('pojem', r)));
    expect(dalsiVHromadce(d, h, aktualniKarticka(d, h), undefined)).toBe(true);
    for (const k of h.klice) d = sHodnocenim(d, k, 'vim', DNES, T);
    const znovu = hromadkaDne(d, DNES, platnaHromadka(JSON.parse(JSON.stringify(h))));
    expect(znovu.klice).toEqual(h.klice);
    expect(aktualniKarticka(d, znovu)).toBeUndefined();
    expect(zbyvaNaRade(d, znovu)).toBe(true);
    const pet = jestePet(d, znovu);
    expect(pet.klice.slice(5)).toEqual(['pojem:p5', 'pojem:p6']);
    expect(aktualniKarticka(d, pet)).toBe('pojem:p5');
  });
  it('menší hromádka se doplní kartičkou přidanou během dne; nový den dá novou', () => {
    let d = sPojmy(2);
    const h = hromadkaDne(d, DNES, null);
    for (const k of h.klice) d = sHodnocenim(d, k, 'zopakuj', DNES, T);
    d = sKartickou(d, 'pojem', 'nova', '2026-11-02T15:00:00.000Z');
    const h2 = hromadkaDne(d, DNES, h);
    expect(h2.klice).toEqual([...h.klice, 'pojem:nova']);
    expect(aktualniKarticka(d, h2)).toBe('pojem:nova');
    const zitra = hromadkaDne(d, posunDatum(DNES, 1), h2);
    expect(zitra.den).toBe('2026-11-03');
    expect(zitra.klice).toEqual(['pojem:nova', 'pojem:p0', 'pojem:p1']);
  });
  it('vyndaná kartička z hromádky zmizí; poškozený stav se zahodí', () => {
    const d = sPojmy(2);
    const h = hromadkaDne(d, DNES, null);
    const { ['pojem:p0']: _p, ...zbytek } = d.karticky!;
    expect(aktualniKarticka({ ...d, karticky: zbytek }, h)).toBe('pojem:p1');
    expect(platnaHromadka({ den: 'včera', klice: [] })).toBeNull();
    expect(platnaHromadka({ den: DNES, klice: ['a', 1, 'a'] })).toEqual({ den: DNES, klice: ['a'] });
  });
  it('po týdnu bez návštěvy začne tou, která čeká nejdéle', () => {
    let d = sPojmy(3);
    d = sHodnocenim(d, 'pojem:p0', 'vim', DNES, T); // přihrádka 1: zítra
    d = sHodnocenim(d, 'pojem:p1', 'vim', '2026-10-25', T); // přihrádka 1: na řadě od 26. 10.
    const h = hromadkaDne(d, posunDatum(DNES, 7), null);
    expect(h.klice).toEqual(['pojem:p1', 'pojem:p2', 'pojem:p0']);
  });
});

describe('prázdné kartičky', () => {
  it('pojmy z výskytů, kde student byl, bez těch, které už v kartičkách má', () => {
    const d = prazdny({ navstivene: [{ odkaz: '/osobnost/herakleitos/', nazev: 'Hérakleitos', kdy: T }], cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 3, navstivene: [3], kdy: T } } });
    const potkane = potkaneZDeniku(d);
    expect(potkanePojmy(DATA, potkane, d).sort()).toEqual(['klid', 'logos']);
    expect(potkanePojmy(DATA, potkane, sKartickou(d, 'pojem', 'logos', T))).toEqual(['klid']);
    expect(potkanePojmy(DATA, new Set(['/pojem/klid/']), prazdny())).toEqual([]);
  });
});

describe('data kartiček z atlasu (antika)', () => {
  const data = dataKarticek([1, 2], 2);
  const katalog = katalogZustalo([1, 2]);
  it('každá otázka kvízu má kartičku, správnou odpověď z možností a podnět jednou', () => {
    expect(Object.keys(data.zustalo).sort()).toEqual(katalog.otazky.map((o) => o.id).sort());
    expect(new Set(data.podnety).size).toBe(data.podnety.length);
    for (const o of katalog.otazky) {
      const k = data.zustalo[o.id];
      expect(k.spravna, o.id).toBeTruthy();
      expect(data.podnety[k.podnet].replace(/\u00a0/g, ' ')).toBe(o.podnet);
      // Líc neprozradí odpověď: správná možnost nestojí v podnětu ani v zadání.
      expect(`${data.podnety[k.podnet]} ${k.zadani}`.includes(k.spravna), o.id).toBe(false);
    }
  });
  it('každý pojem má vysvětlení, příklad a aspoň jedno místo s odkazem', () => {
    const pojmy = Object.values(data.pojmy);
    expect(pojmy.length).toBeGreaterThan(20);
    for (const p of pojmy) {
      expect(p.vysvetleni && p.priklad, p.id).toBeTruthy();
      expect(p.mista.length, p.id).toBeGreaterThan(0);
      for (const m of p.mista) expect(m.href.startsWith('/'), `${p.id} ${m.klic}`).toBe(true);
    }
  });
  it('kartička kresby má na lícu náhled kresby, ostatní ne', () => {
    for (const [id, o] of Object.entries(data.zustalo)) {
      expect(!!o.obraz, id).toBe(id.startsWith('kresba:'));
      const d = sKartickou(prazdny(), 'zustalo', id, T);
      expect(obsahKarticky(d.karticky![`zustalo:${id}`], d, data, new Set())!.lic.obraz, id).toEqual(o.obraz);
    }
  });
  it('na stránku deníku jde výrazně méně než celý katalog kvízu', () => {
    const vahaKvizu = JSON.stringify(katalog).length;
    const vahaKarticek = JSON.stringify({ zustalo: data.zustalo, podnety: data.podnety }).length;
    expect(vahaKarticek).toBeLessThan(vahaKvizu / 2);
  });
});
