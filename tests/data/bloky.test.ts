// Logika interaktivních bloků: vyhodnocení, posun odpovědi, texty do deníku, stav po obnovení
// a obsah bloků v src/content/bloky/*.yaml proti datům.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import {
  radek, odstavce, veta, pismeno, velke,
  kartyRoztrid, hromadkaRoztrid, kartyVKosi, idVlastniKarty, textVlastniKarty, zpetnaKarty, zapisRoztrid, platnyStavRoztrid, DELKA_KARTY,
  zpetnaVolby, zapisVolby, platnyStavVolby,
  platnyStavOdkryj,
  posunZmeny, zapisZmeny, platnyStavZmeny,
  popisPolohy, zpetnaSporu, zapisSporu, platnyStavSporu,
  druhaStrana, uryvekArgumentu, argumentyReflexe, mistoArgumentu, otazkaReflexe, reflexeVyplnena, platnaReflexe, DELKA_URYVKU,
  faktaDvojice, hodnotPoradi, hodnotVzdalenost, platnyStavKdoZil, osaDvou,
  osaOdhadu, odhadZPolohy, popisOdhadu, naProcenta, znackyOsy,
  chybyBloku,
} from '../../src/lib/bloky';
import { Blok, BlokVolba, BlokZmena, BlokSpor, BlokRoztrid } from '../../src/lib/bloky-schema';
import { zAstro, type OsobaMapy } from '../../src/lib/cas-mapy';

const N = ' ';
const osoba = (id: string, jmeno: string, n: number, z: number, o: Partial<OsobaMapy> = {}): OsobaMapy => ({
  id, jmeno, narozen: { rok: n }, zemrel: { rok: z }, mista: [], ...o,
});
const sokrates = osoba('sokrates', 'Sókratés', -469, -399, { jmeno2: 'Sókrata' });
const platon = osoba('platon', 'Platón', -427, -347, { narozen: { rok: -427, priblizne: true } });
const diogenes = osoba('diogenes', 'Diogenés', -412, -323, { narozen: { rok: -412, priblizne: true } });
const marcus = osoba('marcus', 'Marcus Aurelius', 121, 180);
const hypatia = osoba('hypatia', 'Hypatia', 370, 415, { zena: true, narozen: { rok: 370, priblizne: true } });

describe('text', () => {
  it('kurzíva a escapování', () => {
    expect(radek('Jak bys to zjišťoval *ty?*')).toBe('Jak bys to zjišťoval <em>ty?</em>');
    expect(radek('<b>a</b> & "b"')).toBe('&lt;b&gt;a&lt;/b&gt; &amp; &quot;b&quot;');
  });
  it('odstavce dělí prázdný řádek, zalomení uvnitř odstavce je mezera', () => {
    expect(odstavce('První\nřádek.\n\n  Druhý.  \n')).toEqual(['První řádek.', 'Druhý.']);
    expect(odstavce('')).toEqual([]);
  });
  it('věta končí tečkou jen jednou', () => {
    expect(veta('zeptat se znovu')).toBe('zeptat se znovu.');
    expect(veta('Utečeš?')).toBe('Utečeš?');
    expect(veta('399 př. n. l.')).toBe('399 př. n. l.');
  });
  it('písmena možností', () => {
    expect([0, 1, 2, 3].map(pismeno)).toEqual(['A', 'B', 'C', 'D']);
  });
  it('označení strany dostane na začátku popisku velké písmeno', () => {
    expect(velke('kynici')).toBe('Kynici');
    expect(velke('čeští bratři')).toBe('Čeští bratři');
    expect(velke('Epikúros')).toBe('Epikúros');
    expect(velke('')).toBe('');
  });
});

const volba = BlokVolba.parse({
  druh: 'volba',
  obdobi: 1,
  otazka: 'Co uděláš?',
  moznosti: [
    { text: 'Zeptám se znovu.', tah: 'zeptat se znovu', zpetna: 'Dostaneš jen další odpověď ze stejného zdroje.' },
    { text: 'Najdu protipříklad.', tah: 'hledat protipříklad', zpetna: 'Vyvrátit to může jediný člověk.', jeho: true },
  ],
  coUdelal: { osoba: 'sokrates', stejne: 'Šel stejnou cestou jako ty.', jinak: 'Šel jinou cestou.' },
});

describe('Volba s důvodem', () => {
  it('zpětná vazba patří k volbě a oddíl Co udělal se řídí shodou', () => {
    const a = zpetnaVolby(volba, 0, sokrates);
    expect(a.titulek).toBe('Tvůj tah: zeptat se znovu.');
    expect(a.text).toContain('stejného zdroje');
    expect(a.coUdelal).toEqual({ nadpis: 'Co udělal Sókratés', text: 'Šel jinou cestou.', stejne: false });
    expect(zpetnaVolby(volba, 1, sokrates).coUdelal?.stejne).toBe(true);
    expect(zpetnaVolby(volba, 1, { jmeno: 'Hipparchia', zena: true }).coUdelal?.nadpis).toBe('Co udělala Hipparchia');
    expect(zpetnaVolby({ moznosti: volba.moznosti }, 0).coUdelal).toBeUndefined();
    expect(() => zpetnaVolby(volba, 5)).toThrow();
  });
  it('zápis do deníku nese písmeno, text a nepovinný důvod', () => {
    expect(zapisVolby(volba, 1)).toBe('B · Najdu protipříklad.');
    expect(zapisVolby(volba, 1, '  jeden člověk stačí ')).toBe('B · Najdu protipříklad. Proč: jeden člověk stačí.');
  });
  it('uložený stav: platný projde, cizí nebo mimo rozsah se zahodí', () => {
    expect(platnyStavVolby({ vyber: 1, proc: 'x', potvrzeno: true }, 2)).toEqual({ vyber: 1, proc: 'x', potvrzeno: true });
    expect(platnyStavVolby({ vyber: 3, potvrzeno: true }, 2)).toBeNull();
    expect(platnyStavVolby({ vyber: 0 }, 2)).toEqual({ vyber: 0, proc: '', potvrzeno: false });
    expect(platnyStavVolby(null, 2)).toBeNull();
    expect(platnyStavVolby('b', 2)).toBeNull();
  });
  it('schéma: coUdelal potřebuje právě jednu možnost jeho a naopak', () => {
    const bez = { ...volba, moznosti: volba.moznosti.map((m) => ({ ...m, jeho: false })) };
    expect(BlokVolba.safeParse(bez).success).toBe(false);
    const { coUdelal: _c, ...bezOddilu } = volba;
    expect(BlokVolba.safeParse(bezOddilu).success).toBe(false);
    expect(BlokVolba.safeParse({ ...bezOddilu, moznosti: bez.moznosti }).success).toBe(true);
    expect(BlokVolba.safeParse({ ...volba, moznosti: volba.moznosti.slice(0, 1) }).success).toBe(false);
  });
  it('schéma: pole „Proč právě tohle?“ má blok vždy, pokud si ho výslovně neodřekne', () => {
    expect(volba.bezDuvodu).toBe(false);
    expect(BlokVolba.parse({ ...volba, bezDuvodu: true }).bezDuvodu).toBe(true);
    // Zápis do deníku bez důvodu nese jen zvolenou možnost.
    expect(zapisVolby(volba, 0, '')).not.toMatch(/Proč/);
  });
});

describe('Odkryj', () => {
  it('stav po obnovení doplní chybějící sebekontrolu', () => {
    expect(platnyStavOdkryj({ odpoved: 'x', odkryto: true, kontrola: [true] }, 3)).toEqual({ odpoved: 'x', odkryto: true, kontrola: [true, false, false] });
    expect(platnyStavOdkryj({ odkryto: 'ano' }, 0)).toEqual({ odpoved: '', odkryto: false, kontrola: [] });
    expect(platnyStavOdkryj(undefined, 2)).toBeNull();
  });
});

const zmena = BlokZmena.parse({
  druh: 'zmena',
  obdobi: 1,
  otazka: 'Utečeš?',
  moznosti: [{ id: 'uteku', text: 'Uteču.' }, { id: 'zustanu', text: 'Zůstanu.' }],
  podminky: [
    { id: 'spravedlivy', prepinac: 'Rozsudek je spravedlivý', zmena: 'Teď si představ…', posun: 'P', stejne: 'S' },
    { id: 'nikdo', prepinac: 'Nikdo se to nedozví', zmena: 'Teď si představ…', posun: 'P2', stejne: 'S2' },
  ],
});

describe('Změň jednu věc', () => {
  it('posun proti základní odpovědi', () => {
    expect(posunZmeny('uteku', 'zustanu')).toBe('posun');
    expect(posunZmeny('uteku', 'uteku')).toBe('stejne');
  });
  it('zápis do deníku ukáže začátek a každou zodpovězenou podmínku s posunem', () => {
    expect(zapisZmeny(zmena, { zaklad: 'uteku', podminky: { spravedlivy: 'zustanu' } })).toBe(
      'Na začátku: Uteču. Rozsudek je spravedlivý: Zůstanu. (posun)',
    );
    expect(zapisZmeny(zmena, { zaklad: 'uteku', podminky: { nikdo: 'uteku', spravedlivy: 'uteku' } })).toBe(
      'Na začátku: Uteču. Rozsudek je spravedlivý: Uteču. Nikdo se to nedozví: Uteču.',
    );
  });
  it('uložený stav zahodí neznámé podmínky a možnosti', () => {
    expect(platnyStavZmeny({ zaklad: 'uteku', podminky: { spravedlivy: 'zustanu', cizi: 'uteku', nikdo: 'nevim' }, aktivni: 'nikdo' }, zmena)).toEqual({
      zaklad: 'uteku', podminky: { spravedlivy: 'zustanu' }, aktivni: 'nikdo',
    });
    expect(platnyStavZmeny({ zaklad: 'nevim', podminky: {} }, zmena)).toBeNull();
    expect(platnyStavZmeny({ zaklad: 'uteku', aktivni: 'x' }, zmena)).toEqual({ zaklad: 'uteku', podminky: {}, aktivni: null });
  });
  it('schéma odmítne opakované id', () => {
    expect(BlokZmena.safeParse({ ...zmena, moznosti: [zmena.moznosti[0], zmena.moznosti[0]] }).success).toBe(false);
  });
});

describe('Spor', () => {
  it('popisy pěti poloh', () => {
    expect([0, 1, 2, 3, 4].map((i) => popisPolohy(i, 'Platón', 'Diogenés'))).toEqual([
      'Platón', 'spíš Platón', 'uprostřed', 'spíš Diogenés', 'Diogenés',
    ]);
  });
  it('zpětná vazba: zůstal, posunul se, přešel, došel doprostřed', () => {
    const druha = (kdo: string) => `I strana, kterou hájí ${kdo}, má argument, který stojí za odpověď.`;
    const obe = 'Neznamená to, že všechny argumenty vážily stejně.';
    expect(zpetnaSporu(1, 1, 'Platón', 'Diogenés')).toBe(`Zůstal jsi tam, kde jsi začal. ${druha('Diogenés')}`);
    expect(zpetnaSporu(4, 4, 'Platón', 'Diogenés')).toBe(`Zůstal jsi tam, kde jsi začal. ${druha('Platón')}`);
    expect(zpetnaSporu(2, 2, 'Platón', 'Diogenés')).toBe(`Zůstal jsi uprostřed: obě strany pro tebe mají váhu. ${obe}`);
    // K druhé straně, ale ne na ni; od druhé strany; ze středu na stranu.
    expect(zpetnaSporu(0, 1, 'Platón', 'Diogenés')).toBe(`Posunul ses o 1${N}krok ke straně, kterou hájí Diogenés, ale nepřešel jsi na ni. Některý její argument přitom stojí za odpověď.`);
    expect(zpetnaSporu(1, 0, 'Platón', 'Diogenés')).toBe(`Posunul ses o 1${N}krok ke straně, kterou hájí Platón. ${druha('Diogenés')}`);
    expect(zpetnaSporu(2, 3, 'Platón', 'Diogenés')).toBe(`Posunul ses o 1${N}krok ke straně, kterou hájí Diogenés. ${druha('Platón')}`);
    expect(zpetnaSporu(4, 2, 'Platón', 'Diogenés')).toBe(`Posunul ses o 2${N}kroky ke straně, kterou hájí Platón. Teď stojíš uprostřed: obě strany pro tebe mají váhu. ${obe}`);
    expect(zpetnaSporu(0, 4, 'Platón', 'Diogenés')).toBe(`Posunul ses o 4${N}kroky ke straně, kterou hájí Diogenés. Přešel jsi na druhou stranu. ${druha('Platón')}`);
    for (let a = 0; a < 5; a++) {
      for (let b = 0; b < 5; b++) {
        const z = zpetnaSporu(a, b, 'A', 'B');
        // Nikdy nehodnotí, kdo má pravdu, a neklade otázku: tu klade až reflexe pod ní.
        expect(z).not.toMatch(/správn|špatn|pravdu|\?/i);
        // Strana, na jejíž argument vazba ukazuje, je ta, na které student nestojí.
        if (b !== 2) expect(z).toMatch(b < 2 ? /kterou hájí B|její argument/ : /kterou hájí A|její argument/);
      }
    }
  });
  it('zápis do deníku: první a konečná poloha a nepovinný důvod', () => {
    expect(zapisSporu(1, 2, 'Platón', 'Diogenés')).toBe('Na začátku: spíš Platón. Po argumentech: uprostřed.');
    expect(zapisSporu(1, 2, 'Platón', 'Diogenés', 'stůl vidím')).toBe('Na začátku: spíš Platón. Po argumentech: uprostřed. Co mě posunulo: stůl vidím.');
    expect(zapisSporu(3, 3, 'Platón', 'Diogenés', 'jeskyně')).toContain('Co mě udrželo: jeskyně.');
  });
  it('uložený stav', () => {
    expect(platnyStavSporu({ prvni: 1, konecna: 3, duvod: 'x' })).toEqual({ prvni: 1, konecna: 3, duvod: 'x', reflexe: null });
    expect(platnyStavSporu({ prvni: 1 })).toEqual({ prvni: 1, konecna: null, duvod: '', reflexe: null });
    expect(platnyStavSporu({ prvni: 7 })).toBeNull();
    expect(platnyStavSporu({ prvni: 1, konecna: 1.5 })).toEqual({ prvni: 1, konecna: null, duvod: '', reflexe: null });
  });
  it('schéma: dvě různé osoby', () => {
    const strana = { osoba: 'platon', postoj: 'x', argumenty: ['a'] };
    expect(BlokSpor.safeParse({ druh: 'spor', obdobi: 1, otazka: '?', strany: [strana, strana] }).success).toBe(false);
    expect(BlokSpor.safeParse({ druh: 'spor', obdobi: 1, otazka: '?', strany: [strana, { ...strana, osoba: 'diogenes' }] }).success).toBe(true);
  });
});

describe('Kdo žil dřív?: odhad tažením', () => {
  it('osa je souměrná kolem A a vejde se na ni skutečná poloha B', () => {
    for (const [a, b] of [[platon, diogenes], [platon, marcus], [marcus, platon], [sokrates, diogenes]] as const) {
      const o = osaOdhadu(a, b)!;
      const stredA = (o.a.od + o.a.do) / 2;
      expect(Math.abs(o.od + o.do - 2 * stredA)).toBeLessThanOrEqual(100);
      expect(o.startB).toBeGreaterThanOrEqual(o.minStart);
      expect(o.startB).toBeLessThanOrEqual(o.maxStart);
      expect(o.vychozi).toBeGreaterThanOrEqual(o.minStart);
      expect(o.vychozi).toBeLessThanOrEqual(o.maxStart);
      expect(Math.abs(o.vychozi % o.krok)).toBe(0);
    }
  });
  it('skutečná poloha B dá stejný výsledek jako vzdálenost z dat (i přes rok nula)', () => {
    for (const [a, b] of [[platon, diogenes], [sokrates, diogenes], [platon, marcus]] as const) {
      const o = osaOdhadu(a, b)!;
      const odhad = odhadZPolohy(o, o.startB);
      const v = faktaDvojice(a, b)!.vzdalenost;
      expect(odhad).toEqual({ potkali: v.druh === 'soucasne', let: v.let });
    }
  });
  it('překryv, dotyk a mezera', () => {
    const o = { a: { od: -400, do: -330 }, delkaB: 60 };
    expect(odhadZPolohy(o, -360)).toEqual({ potkali: true, let: 30 });
    expect(odhadZPolohy(o, -330)).toEqual({ potkali: true, let: 0 });
    expect(odhadZPolohy(o, -300)).toEqual({ potkali: false, let: 30 });
    expect(odhadZPolohy(o, -500)).toEqual({ potkali: false, let: 40 });
  });
  it('popis odhadu v češtině', () => {
    expect(popisOdhadu({ potkali: true, let: 30 })).toBe(`žili by současně 30${N}let`);
    expect(popisOdhadu({ potkali: false, let: 1 })).toBe(`dělil by je 1${N}rok`);
    expect(popisOdhadu({ potkali: false, let: 3 })).toBe(`dělily by je 3${N}roky`);
    expect(popisOdhadu({ potkali: false, let: 120 })).toBe(`dělilo by je 120${N}let`);
  });
  it('procenta a značky osy', () => {
    expect(naProcenta({ od: -500, do: -100 }, -300)).toBe(50);
    // Kulaté letopočty př. n. l. (600 př. n. l. = astronomicky −599), přes přelom bez roku nula.
    expect(znackyOsy({ od: -700, do: -100 })).toEqual([-699, -599, -499, -399, -299, -199]);
    expect(znackyOsy({ od: -500, do: -100 })).toEqual([-499, -449, -399, -349, -299, -249, -199, -149]);
    expect(znackyOsy({ od: -300, do: 300 }).map(zAstro)).toEqual([-300, -200, -100, 100, 200]);
  });
});

describe('Kdo žil dřív?', () => {
  it('Sókratés a Diogenés žili současně asi 13 let; mapa na rok Sókratovy smrti', () => {
    const f = faktaDvojice(sokrates, diogenes)!;
    expect(f.vzdalenost.text).toBe(`Žili současně asi${N}13${N}let.`);
    expect(f.starsi).toBe('a');
    expect(f.rokMapy).toBe(-399);
    expect(f.odkazMapy).toBe('/mapa/?rok=-399&osoba=sokrates&srovnat=diogenes');
    expect(f.vetaOVeku).toBe(`Když Sókratés zemřel (399${N}př.${N}n.${N}l.), žil Diogenés na světě asi${N}13${N}let.`);
  });
  it('Platón a Diogenés: asi 65 let současně', () => {
    const f = faktaDvojice(diogenes, platon)!;
    expect(f.vzdalenost.text).toBe(`Žili současně asi${N}65${N}let.`);
    expect(f.starsi).toBe('b');
    expect(f.vetaOVeku).toBe(`Když Platón zemřel (347${N}př.${N}n.${N}l.), žil Diogenés na světě asi${N}65${N}let.`);
  });
  it('přes přelom letopočtu: Platón a Marcus Aurelius dělí 467 let; mapa na rok Platónovy smrti', () => {
    const f = faktaDvojice(marcus, platon)!;
    expect(f.vzdalenost.druh).toBe('deli');
    expect(f.vzdalenost.let).toBe(467);
    expect(f.vetaOVeku).toBeNull();
    expect(f.odkazMapy).toBe('/mapa/?rok=-347&osoba=platon&srovnat=marcus');
  });
  it('žena v souvětí', () => {
    const cyril = osoba('x', 'Synesios', 370, 413);
    expect(faktaDvojice(cyril, hypatia)!.vetaOVeku).toBe(`Když Synesios zemřel (413${N}n.${N}l.), žila Hypatia na světě asi${N}43${N}let.`);
  });
  it('přibližný rok úmrtí nese „asi“ i v závorce (Hérakleitos a Parmenidés)', () => {
    const herakleitos = osoba('herakleitos', 'Hérakleitos', -540, -480, { narozen: { rok: -540, priblizne: true }, zemrel: { rok: -480, priblizne: true } });
    const parmenides = osoba('parmenides', 'Parmenidés', -515, -450, { narozen: { rok: -515, priblizne: true }, zemrel: { rok: -450, priblizne: true } });
    expect(faktaDvojice(herakleitos, parmenides)!.vetaOVeku).toBe(`Když Hérakleitos zemřel (asi${N}480${N}př.${N}n.${N}l.), žil Parmenidés na světě asi${N}35${N}let.`);
  });
  it('bez let není co porovnat', () => {
    expect(faktaDvojice(sokrates, { id: 'x', jmeno: 'X', mista: [] })).toBeNull();
    expect(osaDvou(sokrates, { id: 'x', jmeno: 'X', mista: [] })).toBeNull();
  });
  it('pořadí: potvrdí, opraví, nebo doplní překryv', () => {
    const f = faktaDvojice(sokrates, diogenes)!;
    expect(hodnotPoradi('soucasne', f, sokrates, diogenes)).toMatch(/^Sedí to: jejich životy se překrývají\./);
    expect(hodnotPoradi('a', f, sokrates, diogenes)).toMatch(/^Sókratés se opravdu narodil dřív\. Jejich životy se ale překrývají\./);
    expect(hodnotPoradi('b', f, sokrates, diogenes)).toMatch(/^Je to naopak: dřív se narodil Sókratés\./);
    const g = faktaDvojice(platon, marcus)!;
    expect(hodnotPoradi('a', g, platon, marcus)).toMatch(/^Sedí to: Platón žil dřív\. Dělí je/);
    expect(hodnotPoradi('b', g, platon, marcus)).toMatch(/^Je to naopak: dřív žil Platón\./);
    expect(hodnotPoradi('soucasne', g, platon, marcus)).toMatch(/^Nepotkali se: Platón žil dřív\./);
  });
  it('vzdálenost: blízko, víc, méně, jiný druh', () => {
    const f = faktaDvojice(platon, diogenes)!; // 65 let současně
    expect(hodnotVzdalenost({ potkali: true, let: 60 }, f)).toMatch(/To je velmi blízko\.$/);
    expect(hodnotVzdalenost({ potkali: true, let: 20 }, f)).toMatch(`Ve skutečnosti je to o 45${N}let víc.`);
    expect(hodnotVzdalenost({ potkali: true, let: 100 }, f)).toMatch(`Ve skutečnosti je to o 35${N}let méně.`);
    expect(hodnotVzdalenost({ potkali: false, let: 100 }, f)).toMatch(/^Tipoval jsi, že je dělí 100.let\. Žili současně .* Jejich životy se ve skutečnosti překrývají\.$/);
    const g = faktaDvojice(platon, marcus)!;
    expect(hodnotVzdalenost({ potkali: true, let: 10 }, g)).toMatch(/Ve skutečnosti se nepotkali\.$/);
    expect(hodnotVzdalenost({ potkali: false, let: 1 }, g)).toMatch(`o 466${N}let víc.`);
  });
  it('uložený stav pro oba druhy', () => {
    expect(platnyStavKdoZil({ odhad: 'a', odkryto: true }, 'poradi')).toEqual({ odhad: 'a', odkryto: true });
    expect(platnyStavKdoZil({ odhad: 'c' }, 'poradi')).toBeNull();
    expect(platnyStavKdoZil({ odhad: { start: -410.4 } }, 'vzdalenost')).toEqual({ odhad: { start: -410 }, odkryto: false });
    expect(platnyStavKdoZil({ odhad: { start: -9999 }, odkryto: true }, 'vzdalenost', osaOdhadu(platon, diogenes)!)).toEqual({
      odhad: { start: osaOdhadu(platon, diogenes)!.minStart }, odkryto: true,
    });
    expect(platnyStavKdoZil({ odhad: { let: 3 } }, 'vzdalenost')).toBeNull();
    expect(platnyStavKdoZil({ odhad: 'a' }, 'vzdalenost')).toBeNull();
  });
  it('osa: pruhy leží uvnitř a respektují chybějící rok nula', () => {
    const o = osaDvou(platon, marcus)!;
    for (const p of [o.a, o.b]) {
      expect(p.zacatek).toBeGreaterThan(0);
      expect(p.zacatek + p.sirka).toBeLessThan(100);
    }
    expect(o.a.zacatek).toBeLessThan(o.b.zacatek);
  });
});

describe('Spor: označení strany', () => {
  const strana = (osoba: string, oznaceni?: string) => ({ osoba, postoj: 'Postoj.', argumenty: ['Argument.'], ...(oznaceni ? { oznaceni } : {}) });
  it('strana smí mít označení místo jména osoby', () => {
    const b = BlokSpor.parse({ druh: 'spor', obdobi: 2, otazka: 'Kolik je dost?', strany: [strana('diogenes', 'kynici'), strana('epikuros')] });
    expect(b.strany[0].oznaceni).toBe('kynici');
    expect(b.strany[1].oznaceni).toBeUndefined();
  });
  it('strana bez osoby (autor, kterého atlas v datech nemá) potřebuje označení a druhá strana osobu', () => {
    const bezOsoby = (oznaceni?: string) => ({ postoj: 'Postoj.', argumenty: ['Argument.'], ...(oznaceni ? { oznaceni } : {}) });
    const spor = (strany: unknown[]) => BlokSpor.safeParse({ druh: 'spor', obdobi: 2, otazka: 'Je důvod se bát?', strany }).success;
    expect(spor([strana('epikuros'), bezOsoby('Plútarchos')])).toBe(true);
    expect(spor([strana('epikuros'), bezOsoby()])).toBe(false);
    expect(spor([bezOsoby('Plútarchos'), bezOsoby('Cicero')])).toBe(false);
    expect(spor([strana('epikuros', 'Plútarchos'), bezOsoby('Plútarchos')])).toBe(false);
  });
  it('popisy poloh, zpětná vazba a zápis drží označení malým písmenem uprostřed věty', () => {
    expect(popisPolohy(1, 'kynici', 'Epikúros')).toBe('spíš kynici');
    expect(zpetnaSporu(3, 1, 'kynici', 'Epikúros')).toMatch(/ke straně, kterou hájí kynici\./);
    expect(zapisSporu(0, 3, 'kynici', 'Epikúros')).toBe('Na začátku: kynici. Po argumentech: spíš Epikúros.');
  });
});

const roztrid = BlokRoztrid.parse({
  druh: 'roztrid',
  obdobi: 2,
  otazka: 'Kam to patří?',
  kose: [
    { id: 'nutne', nazev: 'Potřebuju', popis: 'Bez toho to bolí.' },
    { id: 'prijemne', nazev: 'Těší mě' },
    { id: 'prazdne', nazev: 'Prázdné' },
  ],
  karty: [
    { id: 'spanek', text: 'Vyspat se', zpetna: 'Tělo si řekne samo.' },
    { id: 'lajky', text: 'Sto lajků', zpetna: 'Stačilo by sto?', kdyz: { nutne: 'Co přesně bolí?' } },
    { id: 'pizza', text: 'Pizza, páteční' },
  ],
  vlastni: { pocet: 2, vyzva: 'Přidej vlastní věc', zpetna: 'Tuhle kartu jsi přidal sám.' },
  srovnani: { osoba: 'epikuros', nadpis: 'Jak třídil Epikúros', text: 'Bolí, když touhu nesplníš?' },
});

describe('Roztřiď', () => {
  const moje = [{ id: 'vlastni-1', text: 'Nové kolo' }];
  it('karty: nejdřív autorské, pak studentovy; hromádka je to, co ještě není v koši', () => {
    const karty = kartyRoztrid(roztrid, moje);
    expect(karty.map((k) => k.id)).toEqual(['spanek', 'lajky', 'pizza', 'vlastni-1']);
    expect(karty[3].vlastni).toBe(true);
    expect(hromadkaRoztrid(karty, {}).length).toBe(4);
    expect(hromadkaRoztrid(karty, { lajky: 'prazdne', 'vlastni-1': 'nutne' }).map((k) => k.id)).toEqual(['spanek', 'pizza']);
    expect(hromadkaRoztrid([], {})).toEqual([]);
  });
  it('koš drží pořadí karet z bloku, ne pořadí, v jakém je student pokládal', () => {
    const karty = kartyRoztrid(roztrid, moje);
    expect(kartyVKosi(karty, { pizza: 'nutne', spanek: 'nutne', lajky: 'prazdne' }, 'nutne').map((k) => k.id)).toEqual(['spanek', 'pizza']);
    expect(kartyVKosi(karty, {}, 'nutne')).toEqual([]);
  });
  it('vlastní karta: první volné id, text na jednom řádku a nejvýš 60 znaků', () => {
    expect(idVlastniKarty([])).toBe('vlastni-1');
    expect(idVlastniKarty([{ id: 'vlastni-1' }, { id: 'vlastni-3' }])).toBe('vlastni-2');
    expect(textVlastniKarty('  Nové \n kolo  ')).toBe('Nové kolo');
    expect(textVlastniKarty('   ')).toBeNull();
    expect(textVlastniKarty('a'.repeat(100))!.length).toBe(DELKA_KARTY);
  });
  it('zpětná vazba: pro koš zvlášť má přednost, jinak společná; vlastní karta má svou; nic se neboduje', () => {
    const [spanek, lajky, pizza, kolo] = kartyRoztrid(roztrid, moje);
    expect(zpetnaKarty(roztrid, lajky, 'nutne')).toBe('Co přesně bolí?');
    expect(zpetnaKarty(roztrid, lajky, 'prazdne')).toBe('Stačilo by sto?');
    expect(zpetnaKarty(roztrid, spanek, 'prazdne')).toBe('Tělo si řekne samo.');
    expect(zpetnaKarty(roztrid, pizza, 'nutne')).toBeNull();
    expect(zpetnaKarty(roztrid, kolo, 'prijemne')).toBe('Tuhle kartu jsi přidal sám.');
  });
  it('zápis do deníku: koše v pořadí bloku, karty oddělené středníkem, prázdný koš se vynechá', () => {
    expect(zapisRoztrid(roztrid, { umisteni: { pizza: 'nutne', spanek: 'nutne', 'vlastni-1': 'prazdne' }, vlastni: moje })).toBe(
      'Potřebuju: Vyspat se; Pizza, páteční. Prázdné: Nové kolo.',
    );
    expect(zapisRoztrid(roztrid, { umisteni: {}, vlastni: [] })).toBe('');
  });
  it('uložený stav: zahodí neznámé karty a koše; hotovo jen s celým roztříděním', () => {
    expect(platnyStavRoztrid(null, roztrid)).toBeNull();
    expect(platnyStavRoztrid({ umisteni: {}, vlastni: [] }, roztrid)).toBeNull();
    expect(platnyStavRoztrid({ umisteni: { spanek: 'nutne', smazana: 'nutne', lajky: 'neni' }, hotovo: true }, roztrid)).toEqual({
      umisteni: { spanek: 'nutne' }, vlastni: [], hotovo: false,
    });
    const cele = { umisteni: { spanek: 'nutne', lajky: 'prazdne', pizza: 'prijemne', 'vlastni-1': 'prijemne' }, vlastni: moje, hotovo: true };
    expect(platnyStavRoztrid(cele, roztrid)).toEqual(cele);
    // Vlastní karta bez koše: student se vrátí k třídění.
    expect(platnyStavRoztrid({ ...cele, umisteni: { spanek: 'nutne', lajky: 'prazdne', pizza: 'prijemne' } }, roztrid)!.hotovo).toBe(false);
  });
  it('uložený stav: vlastních karet nejvýš tolik, kolik blok dovolí, a jen s platným id a textem', () => {
    const s = platnyStavRoztrid({
      umisteni: { 'vlastni-9': 'nutne' },
      vlastni: [{ id: 'vlastni-1', text: ' A ' }, { id: 'spanek', text: 'podvrh' }, { id: 'vlastni-1', text: 'dvakrát' }, { id: 'vlastni-2', text: '' }, { id: 'vlastni-3', text: 'B' }, { id: 'vlastni-4', text: 'C' }],
    }, roztrid)!;
    expect(s.vlastni).toEqual([{ id: 'vlastni-1', text: 'A' }, { id: 'vlastni-3', text: 'B' }]);
    expect(s.umisteni).toEqual({});
    const bez = BlokRoztrid.parse({ ...roztrid, vlastni: undefined });
    expect(platnyStavRoztrid({ umisteni: { spanek: 'nutne' }, vlastni: [{ id: 'vlastni-1', text: 'A' }] }, bez)!.vlastni).toEqual([]);
  });
  it('schéma: různá id, vyhrazené id vlastních karet a `kdyz` jen pro koše bloku', () => {
    const zaklad = { druh: 'roztrid', obdobi: 2, otazka: 'Kam?', kose: [{ id: 'a', nazev: 'A' }, { id: 'b', nazev: 'B' }] };
    const karty = [{ id: 'x', text: 'X' }, { id: 'y', text: 'Y' }, { id: 'z', text: 'Z' }];
    expect(BlokRoztrid.safeParse({ ...zaklad, karty }).success).toBe(true);
    expect(BlokRoztrid.safeParse({ ...zaklad, karty: karty.slice(0, 2) }).success).toBe(false);
    expect(BlokRoztrid.safeParse({ ...zaklad, karty: [...karty.slice(0, 2), { id: 'x', text: 'Znovu' }] }).success).toBe(false);
    expect(BlokRoztrid.safeParse({ ...zaklad, karty: [...karty.slice(0, 2), { id: 'vlastni-1', text: 'Z' }] }).success).toBe(false);
    expect(BlokRoztrid.safeParse({ ...zaklad, karty: [...karty.slice(0, 2), { id: 'z', text: 'Z', kdyz: { c: 'Koš c není.' } }] }).success).toBe(false);
    expect(BlokRoztrid.safeParse({ ...zaklad, kose: [{ id: 'a', nazev: 'A' }, { id: 'a', nazev: 'B' }], karty }).success).toBe(false);
    expect(BlokRoztrid.safeParse({ ...zaklad, karty: [...karty.slice(0, 2), { id: 'z', text: 'z'.repeat(61) }] }).success).toBe(false);
  });
});

// ─── Obsah bloků v YAML ──────────────────────────────────────────────────────

const slozka = new URL('../../src/content/bloky/', import.meta.url);
const soubory = readdirSync(slozka).filter((s) => s.endsWith('.yaml'));
const lide = parse(readFileSync(new URL('../../src/data/lide.yaml', import.meta.url), 'utf8')) as { id: string }[];
const zdroje = parse(readFileSync(new URL('../../src/data/zdroje.yaml', import.meta.url), 'utf8')) as { prameny: { id: string }[] };
const osoby = new Set(lide.map((o) => o.id));
const prameny = new Set(zdroje.prameny.map((p) => p.id));

describe('obsah bloků (src/content/bloky)', () => {
  it('složka má ukázky všech šesti druhů', () => {
    const druhy = new Set(soubory.map((s) => parse(readFileSync(new URL(s, slozka), 'utf8')).druh));
    expect([...druhy].sort()).toEqual(['argument', 'navrat', 'roztrid', 'spor', 'volba', 'zmena']);
  });
  for (const s of soubory) {
    it(`${s}: schéma a odkazy na data`, () => {
      const blok = Blok.parse(parse(readFileSync(new URL(s, slozka), 'utf8')));
      expect(chybyBloku(s, blok, osoby, prameny)).toEqual([]);
    });
  }
  it('kontrola odhalí neznámou osobu i pramen', () => {
    const chyby = chybyBloku('x', { druh: 'spor', zdroje: ['neni'], strany: [{ osoba: 'platon' }, { osoba: 'nikdo' }] }, osoby, prameny);
    expect(chyby).toHaveLength(2);
    expect(chybyBloku('y', { druh: 'roztrid', zdroje: [], srovnani: { osoba: 'nikdo' } }, osoby, prameny)).toHaveLength(1);
    expect(chybyBloku('y', { druh: 'roztrid', zdroje: [], srovnani: {} }, osoby, prameny)).toEqual([]);
  });
});

describe('Spor: reflexe nejsilnějšího argumentu', () => {
  const strany = [
    { argumenty: ['Stůl se jednou rozpadne. Za proměnlivým světem stojí neměnné ideje.', 'Druhý argument Platóna.'] },
    { argumenty: ['Stůl a pohár vidím.', 'Co nejde ukázat ani vyzkoušet, o to nemá cenu se přít.'] },
  ];
  it('druhá strana je ta, na které student nestojí; uprostřed žádná', () => {
    expect([0, 1, 2, 3, 4].map(druhaStrana)).toEqual([1, 1, null, 0, 0]);
    expect(otazkaReflexe(1)).toBe('Který argument druhé strany byl nejsilnější?');
    expect(otazkaReflexe(2)).toBe('Který argument byl nejsilnější?');
  });
  it('nabídka: argumenty druhé strany, uprostřed obou stran v pořadí bloku', () => {
    expect(argumentyReflexe(strany, 0).map((m) => [m.strana, m.text])).toEqual([[1, 'Stůl a pohár vidím.'], [1, strany[1].argumenty[1]]]);
    expect(argumentyReflexe(strany, 4).map((m) => m.strana)).toEqual([0, 0]);
    expect(argumentyReflexe(strany, 2).map((m) => m.strana)).toEqual([0, 0, 1, 1]);
  });
  it('úryvek: celé věty do limitu, aspoň první, zkrácený končí výpustkou', () => {
    expect(uryvekArgumentu('Krátký argument.')).toBe('Krátký argument.');
    const dlouha = `${'Slovo '.repeat(30).trim()}.`;
    expect(uryvekArgumentu(`${dlouha} Druhá věta.`)).toBe(`${dlouha} …`);
    const u = uryvekArgumentu('První věta má třicet znaků takhle. Druhá věta je o něco delší než ta první věta. Třetí věta už se do úryvku určitě nevejde, je moc dlouhá.');
    expect(u).toBe('První věta má třicet znaků takhle. Druhá věta je o něco delší než ta první věta. …');
    expect(u.length).toBeLessThanOrEqual(DELKA_URYVKU + 2);
    // Odstavce a kurzíva z YAML se v úryvku neprojeví; zkratka s tečkou větu nekončí.
    expect(uryvekArgumentu('První *odstavec*.\n\nDruhý odstavec.')).toBe('První odstavec. Druhý odstavec.');
    expect(uryvekArgumentu(`Zemřel roku 399 př. n. l. v Athénách a ${'dlouho '.repeat(20)}se o tom mluvilo. Konec.`)).toMatch(/mluvilo\. …$/);
    // Otevřené uvozovky se dočtou do konce, i když úryvek přeroste limit.
    const citat = 'Na Diogenovu námitku prý Platón odpověděl: „Oči, kterými se vidí stůl a pohár, máš. Rozum, kterým se vidí stolovost a pohárovost, nemáš.“ A šel dál.';
    expect(uryvekArgumentu(citat)).toBe(`${citat.slice(0, citat.indexOf('“') + 1)} …`);
  });
  it('uložený argument se hledá podle textu, ne podle pořadí', () => {
    const nabidka = argumentyReflexe(strany, 0);
    expect(mistoArgumentu(nabidka, { strana: 1, text: 'Co nejde ukázat ani  vyzkoušet,\no to nemá cenu se přít.' })).toBe(1);
    // Autor argumenty přehodil: uložený se najde na novém místě.
    const prehozene = argumentyReflexe([strany[0], { argumenty: [...strany[1].argumenty].reverse() }], 0);
    expect(mistoArgumentu(prehozene, { strana: 1, text: 'Stůl a pohár vidím.' })).toBe(1);
    // Autor text změnil nebo argument ubral: nenajde se žádný, a tedy se neukáže jiný.
    expect(mistoArgumentu(nabidka, { strana: 1, text: 'Stůl a pohár vidím, Platóne.' })).toBe(-1);
    expect(mistoArgumentu(nabidka, { strana: 0, text: 'Stůl a pohár vidím.' })).toBe(-1);
  });
  it('zápis do deníku: reflexe je další věta za důvodem', () => {
    const arg = { strana: 1 as const, text: 'Stůl a pohár vidím.' };
    expect(zapisSporu(1, 0, 'Platón', 'Diogenés', 'jeskyně', { argument: arg, odpoved: 'vidět není všechno' })).toBe(
      'Na začátku: spíš Platón. Po argumentech: Platón. Co mě posunulo: jeskyně. Nejsilnější argument druhé strany (Diogenés): Stůl a pohár vidím. Moje odpověď: vidět není všechno.',
    );
    expect(zapisSporu(1, 1, 'Platón', 'Diogenés', '', { argument: arg, odpoved: '' })).toBe(
      'Na začátku: spíš Platón. Po argumentech: spíš Platón. Nejsilnější argument druhé strany (Diogenés): Stůl a pohár vidím.',
    );
    // Uprostřed není „druhá strana“; vlastní argument je bez jména strany.
    expect(zapisSporu(2, 2, 'kynici', 'Epikúros', '', { argument: { strana: 0, text: 'Každá potřeba je provázek.' }, odpoved: 'ne každá' })).toBe(
      'Na začátku: uprostřed. Po argumentech: uprostřed. Nejsilnější argument (kynici): Každá potřeba je provázek. Moje odpověď: ne každá.',
    );
    expect(zapisSporu(3, 4, 'Platón', 'Diogenés', '', { argument: { vlastni: 'matematika' }, odpoved: '' })).toMatch(/Nejsilnější argument druhé strany: matematika\.$/);
    expect(zapisSporu(3, 4, 'Platón', 'Diogenés', '', { argument: null, odpoved: 'nevím' })).toMatch(/Diogenés\. Moje odpověď druhé straně: nevím\.$/);
    expect(zapisSporu(2, 2, 'Platón', 'Diogenés', '', { argument: { vlastni: ' ' }, odpoved: 'nevím' })).toMatch(/uprostřed\. Moje odpověď: nevím\.$/);
    // Dlouhý argument jde do deníku jako úryvek.
    const dlouhy = `První věta. ${'Další slova '.repeat(20).trim()}.`;
    expect(zapisSporu(0, 0, 'Platón', 'Diogenés', '', { argument: { strana: 1, text: dlouhy }, odpoved: 'ano' })).toContain('(Diogenés): První věta. … Moje odpověď: ano.');
    // Prázdná reflexe zápis nemění.
    for (const r of [null, { argument: null, odpoved: ' ' }, { argument: { vlastni: '' }, odpoved: '' }]) {
      expect(zapisSporu(1, 2, 'Platón', 'Diogenés', '', r)).toBe('Na začátku: spíš Platón. Po argumentech: uprostřed.');
      expect(reflexeVyplnena(r)).toBe(false);
    }
  });
  it('uložený stav: starý bez reflexe platí dál, nesmysl se zahodí', () => {
    expect(platnyStavSporu({ prvni: 1, konecna: 3, duvod: 'x' })?.reflexe).toBeNull();
    const r = { argument: { strana: 0, text: 'Stůl se rozpadne.' }, odpoved: 'a co čísla' };
    expect(platnyStavSporu({ prvni: 1, konecna: 3, duvod: '', reflexe: r })?.reflexe).toEqual(r);
    expect(platnyStavSporu({ prvni: 1, konecna: 3, duvod: '', reflexe: { argument: { vlastni: '' }, odpoved: '' } })?.reflexe).toEqual({ argument: { vlastni: '' }, odpoved: '' });
    // Bez konečné polohy reflexe být nemůže.
    expect(platnyStavSporu({ prvni: 1, reflexe: r })?.reflexe).toBeNull();
    expect(platnaReflexe({ argument: { strana: 2, text: 'x' }, odpoved: 5 })).toBeNull();
    expect(platnaReflexe({ argument: { strana: 1, text: ' ' }, odpoved: 'jen odpověď' })).toEqual({ argument: null, odpoved: 'jen odpověď' });
    expect(platnaReflexe('x')).toBeNull();
    expect(platnaReflexe({})).toBeNull();
  });
  it('věty složené se jménem strany sedí na všechny strany, které v atlasu jsou', () => {
    const jmena = new Map((lide as unknown as { id: string; jmeno: string }[]).map((o) => [o.id, o.jmeno]));
    const spory = soubory.map((s) => parse(readFileSync(new URL(s, slozka), 'utf8'))).filter((b) => b.druh === 'spor');
    expect(spory.length).toBeGreaterThanOrEqual(4);
    for (const s of spory) {
      const [a, b] = s.strany.map((x: { osoba: string; oznaceni?: string }) => x.oznaceni ?? jmena.get(x.osoba));
      expect(a && b).toBeTruthy();
      for (let p = 0; p < 5; p++) {
        for (let k = 0; k < 5; k++) {
          const z = zpetnaSporu(p, k, a, b);
          expect(z).not.toMatch(/undefined|null/);
          // Jméno strany stojí jen v 1. pádě za „kterou hájí“: nic se neskloňuje.
          for (const j of [a, b]) for (const m of z.matchAll(new RegExp(j, 'g'))) expect(z.slice(0, m.index)).toMatch(/kterou hájí $/);
        }
      }
      // V nabídce je každý argument poznat: úryvek není prázdný a argumenty téže strany se neliší až za ním.
      for (const k of [0, 2, 4]) {
        const nabidka = argumentyReflexe(s.strany, k);
        expect(nabidka.every((m) => m.uryvek.length > 10)).toBe(true);
        expect(new Set(nabidka.map((m) => `${m.strana}:${m.uryvek}`)).size).toBe(nabidka.length);
      }
      const z = zapisSporu(0, 0, a, b, '', { argument: { strana: 1, text: s.strany[1].argumenty[0] }, odpoved: 'x' });
      expect(z).toContain(`Nejsilnější argument druhé strany (${b}): `);
    }
  });
});
