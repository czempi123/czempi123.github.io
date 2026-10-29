import { describe, it, expect, beforeEach } from 'vitest';
import { popisStran, platneKody, kodyStrany, odpovedStudenta, rozvrhOddilu, UPROSTRED } from '../../src/lib/strany';
import { stavBloku, ulozStavBloku, nacti, uloz, _zapomenPamet } from '../../src/lib/denik';

const VOLBA = popisStran({ druh: 'volba', moznosti: [{}, {}, {}, {}] })!;
const SPOR = popisStran({ druh: 'spor', strany: [{ osoba: 'seneca' }, { osoba: 'plutarchos' }] })!;
const ZMENA = popisStran({ druh: 'zmena', moznosti: [{ id: 'utec' }, { id: 'zustan' }] })!;

describe('popis odpovědí bloku', () => {
  it('Volba má písmena karet, Spor osoby stran a uprostřed, Změň jednu věc id možností', () => {
    expect(VOLBA).toEqual({ druh: 'volba', kody: ['A', 'B', 'C', 'D'] });
    expect(platneKody(SPOR)).toEqual(['seneca', 'plutarchos', UPROSTRED]);
    expect(ZMENA.kody).toEqual(['utec', 'zustan']);
  });
  it('strana Sporu bez osoby má kód podle pořadí', () => {
    expect(popisStran({ druh: 'spor', strany: [{}, { osoba: 'platon' }] })!.kody).toEqual(['strana-1', 'platon']);
  });
  it('Roztřiď, Odkryj (blok bez YAML) a neznámý blok zastánce nemají', () => {
    expect(popisStran({ druh: 'roztrid' })).toBeNull();
    expect(popisStran({ druh: 'navrat' })).toBeNull();
    expect(popisStran(undefined)).toBeNull();
  });
  it('atribut odpoved může nést víc kódů', () => {
    expect(kodyStrany('C D')).toEqual(['C', 'D']);
    expect(kodyStrany(' A, B ')).toEqual(['A', 'B']);
  });
});

describe('odpověď studenta z uloženého stavu', () => {
  it('Volba: zvolená karta, jen když ji student potvrdil', () => {
    expect(odpovedStudenta(VOLBA, { vyber: 2, proc: 'u posledního prkna', potvrzeno: true })).toBe('C');
    expect(odpovedStudenta(VOLBA, { vyber: 2, proc: '', potvrzeno: false })).toBeNull();
    expect(odpovedStudenta(VOLBA, { vyber: 7, potvrzeno: true })).toBeNull();
  });
  it('Spor: konečná poloha, ne první', () => {
    expect(odpovedStudenta(SPOR, { prvni: 1, konecna: 3, duvod: '' })).toBe('plutarchos');
    expect(odpovedStudenta(SPOR, { prvni: 4, konecna: 0, duvod: '' })).toBe('seneca');
    expect(odpovedStudenta(SPOR, { prvni: 1, konecna: 1, duvod: '' })).toBe('seneca');
    expect(odpovedStudenta(SPOR, { prvni: 0, konecna: 2, duvod: '' })).toBe(UPROSTRED);
    // Jen první poloha (argumenty ještě nečetl): odpověď ještě není.
    expect(odpovedStudenta(SPOR, { prvni: 1, konecna: null, duvod: '' })).toBeNull();
    expect(odpovedStudenta(SPOR, { prvni: 9, konecna: 3 })).toBeNull();
  });
  it('Změň jednu věc: základní rozhodnutí, ne odpověď v podmínce', () => {
    expect(odpovedStudenta(ZMENA, { zaklad: 'zustan', podminky: { spravedlivy: 'utec' }, aktivni: 'spravedlivy' })).toBe('zustan');
    expect(odpovedStudenta(ZMENA, { zaklad: 'neco-jineho', podminky: {} })).toBeNull();
  });
  it('Roztřiď, Odkryj, chybějící zápis a neznámý blok dají null', () => {
    expect(odpovedStudenta(popisStran({ druh: 'roztrid' }), { umisteni: { a: 'k1' }, vlastni: [], hotovo: true })).toBeNull();
    expect(odpovedStudenta(VOLBA, undefined)).toBeNull();
    expect(odpovedStudenta(VOLBA, null)).toBeNull();
    expect(odpovedStudenta(VOLBA, 'C')).toBeNull();
  });
});

describe('odpověď přímo z deníku', () => {
  beforeEach(() => {
    _zapomenPamet();
    try { localStorage.clear(); } catch { /* prostředí bez úložiště */ }
  });
  it('neprošlý blok, neznámé id a smazaný deník dají null', () => {
    expect(odpovedStudenta(VOLBA, stavBloku('cesta2-je-to-ona'))).toBeNull();
    ulozStavBloku('cesta2-je-to-ona', { vyber: 0, proc: '', potvrzeno: true });
    expect(odpovedStudenta(VOLBA, stavBloku('cesta2-je-to-ona'))).toBe('A');
    expect(odpovedStudenta(VOLBA, stavBloku('neznamy-blok'))).toBeNull();
    uloz({ ...nacti(), bloky: {} });
    expect(odpovedStudenta(VOLBA, stavBloku('cesta2-je-to-ona'))).toBeNull();
  });
});

describe('rozvrh oddílu', () => {
  // úvod, A, B, C, D, společný závěr
  const ODDIL = [null, ['A'], ['B'], ['C'], ['D'], null];
  it('odpověď studenta stojí na místě první odpovědi, ostatní jdou do sbalené části, společné zůstává', () => {
    expect(rozvrhOddilu(ODDIL, 'C')).toEqual({ pred: [0], tvoje: [3], jine: [1, 2, 4], po: [5] });
  });
  it('odstavec pro víc odpovědí patří ke každé z nich', () => {
    expect(rozvrhOddilu([null, ['A', 'B'], ['C', 'D']], 'D')).toEqual({ pred: [0], tvoje: [2], jine: [1], po: [] });
    expect(rozvrhOddilu([['A'], null, ['A']], 'A')).toEqual({ pred: [], tvoje: [0, 2], jine: [], po: [1] });
  });
  it('bez odpovědi nebo bez odstavce k ní se nic nepřeskládá', () => {
    expect(rozvrhOddilu(ODDIL, null)).toBeNull();
    expect(rozvrhOddilu([null, ['seneca'], ['plutarchos'], null], UPROSTRED)).toBeNull();
    expect(rozvrhOddilu([null, null], 'A')).toBeNull();
  });
});
