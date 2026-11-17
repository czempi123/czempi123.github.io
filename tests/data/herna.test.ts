// Sdílená logika herny (src/lib/herna, herna-v1 K1): zamíchání se semínkem, pořadí na ose, možnosti k citátu,
// „sedí“ a „zkus to jinak“, stav bloků v deníku a obsah her v src/content/bloky proti datům.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import {
  semeno, generator, zamichej, verdikt, SEDI, ZKUS_JINAK,
  rokKarty, kartaOsy, chybyKaret, dvojice, vyhodnotPoradi, spravnePoradi, zamichaniOsy, presun, prohod, verdiktPoradi,
  stejnePoradi, platnyStavOsy, POKUSU_DO_UKAZANI,
  moznostiCitatu, puvodCitatu, chybyKdoRekl, vyresena, hotovaSerie, platnyStavKdoRekl,
} from '../../src/lib/herna';
import { Blok, BlokSerad, BlokKdoRekl } from '../../src/lib/bloky-schema';

const N = '\u00a0';

describe('zamíchání se semínkem', () => {
  it('stejné semínko dává stejné pořadí, jiné jiné', () => {
    const pole = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(zamichej(pole, 'blok-1')).toEqual(zamichej(pole, 'blok-1'));
    expect(zamichej(pole, 'blok-1')).not.toEqual(zamichej(pole, 'blok-2'));
    expect([...zamichej(pole, 'x')].sort()).toEqual(pole);
    expect(pole).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
  it('prázdné a jednoprvkové pole', () => {
    expect(zamichej([], 'x')).toEqual([]);
    expect(zamichej([1], 'x')).toEqual([1]);
  });
  it('semínko je 32bitové a generátor v [0, 1)', () => {
    expect(semeno('')).toBe(0x811c9dc5);
    const g = generator(semeno('atlas'));
    for (let i = 0; i < 1000; i++) {
      const x = g();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe('sedí a zkus to jinak', () => {
  it('sedí bez věty, zkus to jinak s větou, kam se podívat', () => {
    expect(verdikt(true, 'nic')).toEqual({ sedi: true, slovo: SEDI });
    expect(verdikt(false, ' Podívej se na Thaléta. ')).toEqual({ sedi: false, slovo: ZKUS_JINAK, veta: 'Podívej se na Thaléta.' });
    expect(verdikt(false)).toEqual({ sedi: false, slovo: ZKUS_JINAK });
    expect(SEDI).toBe('Sedí.');
    expect(ZKUS_JINAK).toBe('Zkus to jinak.');
  });
});

const osoby = new Map([
  ['thales', { jmeno: 'Thalés', narozen: { rok: -620, priblizne: true }, zemrel: { rok: -546, priblizne: true } }],
  ['sokrates', { jmeno: 'Sókratés', narozen: { rok: -469 }, zemrel: { rok: -399 } }],
  ['marcus', { jmeno: 'Marcus Aurelius', narozen: { rok: 121 }, zemrel: { rok: 180 } }],
  ['beze', { jmeno: 'Bez roku' }],
]);
const udalosti = new Map([
  ['marathon', { nazev: 'Bitva u Marathónu', od: -490 }],
  ['peloponneska-valka', { nazev: 'Peloponéská válka', od: -431, do: -404 }],
  ['alexandr', { nazev: 'Tažení', od: -334, do: 14 }],
  ['korsika', { nazev: 'Seneca na Korsice', od: 41, do: 49 }],
]);

describe('Seřaď na ose: karty z dat', () => {
  it('rok s „asi“ a nezlomitelnými mezerami, přes přelom letopočtu', () => {
    expect(rokKarty(-620, true)).toBe(`asi${N}620${N}př.${N}n.${N}l.`);
    expect(rokKarty(-399)).toBe(`399${N}př.${N}n.${N}l.`);
    expect(rokKarty(121)).toBe(`121${N}n.${N}l.`);
    expect(rokKarty(-1)).toBe(`1${N}př.${N}n.${N}l.`);
  });
  it('člověk podle narození i smrti, událost s rozpětím', () => {
    expect(kartaOsy({ osoba: 'thales' }, osoby, udalosti)).toEqual({ text: 'Thalés', rok: -620, rokText: `asi${N}620${N}př.${N}n.${N}l.`, napoveda: undefined });
    expect(kartaOsy({ osoba: 'sokrates', kdy: 'umrti', text: 'Sókratův proces' }, osoby, udalosti)).toMatchObject({ text: 'Sókratův proces', rok: -399 });
    expect(kartaOsy({ udalost: 'marathon' }, osoby, udalosti).rokText).toBe(`490${N}př.${N}n.${N}l.`);
    expect(kartaOsy({ udalost: 'peloponneska-valka' }, osoby, udalosti).rokText).toBe(`431–404${N}př.${N}n.${N}l.`);
    expect(kartaOsy({ udalost: 'korsika' }, osoby, udalosti).rokText).toBe(`41–49${N}n.${N}l.`);
    expect(kartaOsy({ udalost: 'alexandr' }, osoby, udalosti).rokText).toBe(`334${N}př.${N}n.${N}l. – 14${N}n.${N}l.`);
  });
  it('chybějící osoba, událost nebo rok zastaví sestavení', () => {
    expect(() => kartaOsy({ osoba: 'nikdo' }, osoby, udalosti)).toThrow(/není v lide.yaml/);
    expect(() => kartaOsy({ udalost: 'nic' }, osoby, udalosti)).toThrow(/není v udalosti.yaml/);
    expect(() => kartaOsy({ osoba: 'beze' }, osoby, udalosti)).toThrow(/rok narození/);
    expect(() => kartaOsy({}, osoby, udalosti)).toThrow();
  });
  it('sada karet: aspoň tři a žádné dva stejné roky', () => {
    expect(chybyKaret([{ text: 'a', rok: 1 }, { text: 'b', rok: 2 }])).toHaveLength(1);
    expect(chybyKaret([{ text: 'a', rok: 1 }, { text: 'b', rok: 1 }, { text: 'c', rok: 3 }])).toEqual(['Seřaď na ose: „a“ a „b“ mají stejný rok 1.']);
    expect(chybyKaret([{ text: 'a', rok: -1 }, { text: 'b', rok: 1 }, { text: 'c', rok: 3 }])).toEqual([]);
  });
});

describe('Seřaď na ose: vyhodnocení pořadí', () => {
  const roky = [-620, -551, -515, -469, -384];
  it('které dvojice sedí', () => {
    expect(dvojice([0, 1, 2, 3, 4], roky)).toEqual([true, true, true, true]);
    expect(dvojice([1, 0, 2, 4, 3], roky)).toEqual([false, true, true, false]);
    expect(vyhodnotPoradi([0, 1, 2, 3, 4], roky).sedi).toBe(true);
    expect(vyhodnotPoradi([0, 2, 1, 3, 4], roky)).toEqual({ dvojice: [true, false, true, true], sedi: false });
    expect(dvojice([0], roky)).toEqual([]);
  });
  it('přes přelom letopočtu', () => {
    expect(dvojice([0, 1], [-1, 1])).toEqual([true]);
    expect(spravnePoradi([121, -1, -399])).toEqual([2, 1, 0]);
  });
  it('zamíchání nikdy nezačne hotové a nejvýš polovina dvojic sedí', () => {
    for (const klic of ['dilna-serad-narozeni', 'a', 'b', 'c', 'obdobi-1-serad', 'x-y-z']) {
      const p = zamichaniOsy(roky, klic);
      expect(p).toEqual(zamichaniOsy(roky, klic));
      expect([...p].sort()).toEqual([0, 1, 2, 3, 4]);
      expect(dvojice(p, roky).filter(Boolean).length).toBeLessThanOrEqual(2);
    }
    // Tři karty: nejvýš jedna dvojice sedí.
    for (const klic of ['a', 'b', 'c', 'd']) expect(dvojice(zamichaniOsy([1, 2, 3], klic), [1, 2, 3]).filter(Boolean).length).toBeLessThanOrEqual(1);
  });
  it('přesun a prohození', () => {
    expect(presun([0, 1, 2, 3], 0, 2)).toEqual([1, 2, 0, 3]);
    expect(presun([0, 1, 2, 3], 3, 0)).toEqual([3, 0, 1, 2]);
    expect(presun([0, 1, 2], 0, 5)).toEqual([0, 1, 2]);
    expect(prohod([0, 1, 2, 3], 0, 3)).toEqual([3, 1, 2, 0]);
    expect(prohod([0, 1], 0, 9)).toEqual([0, 1]);
    expect(stejnePoradi([1, 2], [1, 2])).toBe(true);
    expect(stejnePoradi([1, 2], [2, 1])).toBe(false);
    expect(stejnePoradi(null, [1])).toBe(false);
  });
  it('zkus to jinak jmenuje první obrácenou dvojici, napověda karty má přednost', () => {
    const karty = [
      { text: 'Thalés', rok: -620 },
      { text: 'Konfucius', rok: -551, napoveda: 'Konfucius byl starší, než se zdá.' },
      { text: 'Parmenidés', rok: -515 },
    ];
    expect(verdiktPoradi(karty, [0, 1, 2])).toEqual({ sedi: true, slovo: SEDI });
    expect(verdiktPoradi(karty, [0, 2, 1])).toEqual({ sedi: false, slovo: ZKUS_JINAK, veta: 'Konfucius byl starší, než se zdá.' });
    expect(verdiktPoradi(karty, [2, 0, 1]).veta).toBe('„Parmenidés“ a „Thalés“ zatím visí obráceně.');
  });
  it('stav v deníku: jen platná permutace, jinak null', () => {
    expect(POKUSU_DO_UKAZANI).toBe(3);
    expect(platnyStavOsy({ poradi: [2, 0, 1], kontrola: [0, 2, 1], pokusy: 2, hotovo: false, ukazano: false }, 3))
      .toEqual({ poradi: [2, 0, 1], kontrola: [0, 2, 1], pokusy: 2, hotovo: false, ukazano: false });
    expect(platnyStavOsy({ poradi: [0, 0, 1] }, 3)).toBeNull();
    expect(platnyStavOsy({ poradi: [0, 1] }, 3)).toBeNull();
    expect(platnyStavOsy(null, 3)).toBeNull();
    expect(platnyStavOsy({ poradi: [1, 0, 2], kontrola: [9], pokusy: -1, hotovo: 'ano' }, 3))
      .toEqual({ poradi: [1, 0, 2], kontrola: null, pokusy: 0, hotovo: false, ukazano: false });
  });
});

describe('Kdo to řekl?', () => {
  it('možnosti: správná osoba a ostatní, stejné pořadí podle semínka', () => {
    const m = moznostiCitatu('epiktetos', ['epikuros', 'aristoteles', 'diogenes'], 'blok:rukojet-5');
    expect([...m].sort()).toEqual(['aristoteles', 'diogenes', 'epiktetos', 'epikuros']);
    expect(m).toEqual(moznostiCitatu('epiktetos', ['epikuros', 'aristoteles', 'diogenes'], 'blok:rukojet-5'));
    expect(moznostiCitatu('a', ['a', 'b', 'c'], 'k')).toHaveLength(3);
  });
  it('odkud věta je', () => {
    expect(puvodCitatu({ autor: 'Epiktétos', dilo: 'Rukojeť', misto: '5' }, 'Epiktétos')).toBe('Rukojeť 5');
    expect(puvodCitatu({ autor: 'Platón', dilo: 'Obrana Sókratova', misto: '38a' }, 'Sókratés')).toBe('Zapsal Platón: Obrana Sókratova 38a');
  });
  it('kontrola karet proti datům', () => {
    const citaty = new Map([['c1', { osoba: 'a', cesky: 'x' }], ['c2', { cesky: 'y' }]]);
    const lide = new Set(['a', 'b', 'c']);
    expect(chybyKdoRekl([{ citat: 'c1', jini: ['b', 'c'] }], citaty, lide)).toEqual([]);
    expect(chybyKdoRekl([{ citat: 'c1', jini: ['a', 'b'] }], citaty, lide)).toHaveLength(1);
    expect(chybyKdoRekl([{ citat: 'c1', jini: ['b', 'x'] }], citaty, lide)).toHaveLength(1);
    expect(chybyKdoRekl([{ citat: 'c2', jini: ['b', 'c'] }], citaty, lide)).toHaveLength(1);
    expect(chybyKdoRekl([{ citat: 'nic', jini: ['b', 'c'] }], citaty, lide)).toHaveLength(1);
    expect(chybyKdoRekl([{ citat: 'c1', jini: ['b', 'c'] }, { citat: 'c1', jini: ['b', 'b'] }], citaty, lide)).toHaveLength(2);
  });
  it('vyřešená karta, hotová série a stav v deníku', () => {
    expect(vyresena(['b', 'a'], 'a')).toBe(true);
    expect(vyresena(['b'], 'a')).toBe(false);
    expect(vyresena(undefined, 'a')).toBe(false);
    expect(hotovaSerie({ karta: 1, tipy: [['a'], ['c', 'd']] }, ['a', 'd'])).toBe(true);
    expect(hotovaSerie({ karta: 1, tipy: [['a'], ['c']] }, ['a', 'd'])).toBe(false);
    const karty = [{ moznosti: ['a', 'b', 'c'] }, { moznosti: ['d', 'e', 'f'] }];
    expect(platnyStavKdoRekl({ karta: 1, tipy: [['a', 'a', 'x'], ['e']] }, karty)).toEqual({ karta: 1, tipy: [['a'], ['e']] });
    expect(platnyStavKdoRekl({ karta: 2, tipy: [[], []] }, karty)).toBeNull();
    expect(platnyStavKdoRekl({ karta: 0, tipy: [[]] }, karty)).toBeNull();
    expect(platnyStavKdoRekl('rozbite', karty)).toBeNull();
  });
});

// ─── Hry v src/content/bloky proti datům ─────────────────────────────────────

const slozka = new URL('../../src/content/bloky/', import.meta.url);
const hry = readdirSync(slozka).filter((s) => s.endsWith('.yaml'))
  .map((s) => ({ s, d: parse(readFileSync(new URL(s, slozka), 'utf8')) }))
  .filter((x) => x.d.druh === 'serad' || x.d.druh === 'kdo-rekl');
const lide = parse(readFileSync(new URL('../../src/data/lide.yaml', import.meta.url), 'utf8')) as { id: string; jmeno: string; narozen?: { rok: number; priblizne?: boolean }; zemrel?: { rok: number; priblizne?: boolean } }[];
const udalostiDat = parse(readFileSync(new URL('../../src/data/udalosti.yaml', import.meta.url), 'utf8')) as { id: string; nazev: string; od: number; do?: number }[];
const zdroje = parse(readFileSync(new URL('../../src/data/zdroje.yaml', import.meta.url), 'utf8')) as { citaty: { id: string; osoba?: string; cesky: string }[] };

describe('hry v src/content/bloky', () => {
  it('dílna má obě hry K1', () => {
    expect(hry.map((h) => h.d.druh).sort()).toEqual(expect.arrayContaining(['kdo-rekl', 'serad']));
  });
  for (const { s, d } of hry) {
    it(`${s}: schéma a data`, () => {
      Blok.parse(d);
      if (d.druh === 'serad') {
        const b = BlokSerad.parse(d);
        const karty = b.karty.map((k) => kartaOsy(k, new Map(lide.map((o) => [o.id, o])), new Map(udalostiDat.map((u) => [u.id, u]))));
        expect(chybyKaret(karty)).toEqual([]);
      } else {
        const b = BlokKdoRekl.parse(d);
        expect(chybyKdoRekl(b.karty, new Map(zdroje.citaty.map((c) => [c.id, c])), new Set(lide.map((o) => o.id)))).toEqual([]);
        for (const k of b.karty) expect(k.napoveda.split(/[.!?]\s/).length).toBe(1);
      }
    });
  }
});
