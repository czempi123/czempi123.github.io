// Kapitoly v Můj deník (design-v2, K6 dodatek): rozdělení záznamů do kapitol po obdobích, pořadí kapitol a skupin,
// která kapitola je otevřená a zapamatovaný stav. Deník prázdný, s jedním a se dvěma obdobími (testovací záznamy).
import { describe, it, expect } from 'vitest';
import { popisStran } from '../../src/lib/strany';
import type { Denik } from '../../src/lib/denik';
import {
  kapitolyDeniku, otevreneKapitoly, rozeberStavKapitol, adresaStranky, KAPITOLA_NAPRIC, NAZEV_NAPRIC,
  type PodkladyKapitol, type MapaStranek,
} from '../../src/lib/zapisnik';

const prazdny = (cast: Partial<Denik> = {}): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });
const cas = (den: number, hod = 10) => `2026-11-${String(den).padStart(2, '0')}T${String(hod).padStart(2, '0')}:00:00.000Z`;

const STRANKY: MapaStranek = {
  '/cesta/kdy-verit/': { nazev: 'Kdy mám dobrý důvod věřit?', obdobi: 1 },
  '/cesta/kolik-je-dost/': { nazev: 'Kolik je dost?', obdobi: 2 },
  '/osobnost/sokrates/': { nazev: 'Sókratés', obdobi: 1 },
  '/osobnost/epikuros/': { nazev: 'Epikúros', obdobi: 2 },
  '/osobnost/augustin/': { nazev: 'Augustin', obdobi: 3 },
  '/otazka/jak-zit/': { nazev: 'Jak mám žít?' },
};
const PODKLADY: PodkladyKapitol = {
  obdobi: [
    { id: 1, nazev: 'Počátky a klasické Řecko', leta: '650–300 př. n. l.', maStranku: true },
    { id: 2, nazev: 'Helenismus a Řím', maStranku: true },
    { id: 3, nazev: 'Středověk', maStranku: false },
  ],
  stranky: STRANKY,
  katalog: {
    bloky: [{
      id: 'cesta6-volba', cesta: 'kolik-je-dost', adresa: '/cesta/kolik-je-dost/2/#cesta6-volba',
      popis: popisStran({ druh: 'volba', moznosti: [{}, {}] })!,
      odpovedi: [{ kod: 'A', text: 'Nový telefon', zastanci: [] }, { kod: 'B', text: 'Nic nového', zastanci: [] }],
    }],
  },
  osoby: { sokrates: { obdobi: 1 }, epikuros: { obdobi: 2 }, augustin: { obdobi: 3 } },
};

const cesta = (nazev: string, pocet: number, navstivene: number[], kdy: string, pahyl?: string) =>
  ({ nazev, pocet, krok: navstivene.at(-1) ?? 1, navstivene, kdy, ...(pahyl ? { pahyl, dokonceno: pahyl } : {}) });

/** Deník se dvěma obdobími: v Řecku byl student naposledy (profil Sókrata 5. 11.), Helenismus je starší. */
const dveObdobi = (): Denik => prazdny({
  zapisy: [
    { id: 'sokrates/nikdo', otazka: 'Dělá někdo zlo dobrovolně?', odpoved: 'Ne, jen z nevědomosti.', odkaz: '/osobnost/sokrates/#nikdo', kdy: cas(5) },
    { id: 'cesta1-pravidlo', otazka: 'Kdy věřit?', odpoved: 'Když to obstojí.', odkaz: '/cesta/kdy-verit/7/', kdy: cas(4) },
    { id: 'cesta1-krok2', otazka: 'Jak to zjistíš?', odpoved: 'Zeptám se.', odkaz: '/cesta/kdy-verit/2/#blok', kdy: cas(3) },
    { id: 'cesta6-pravidlo', otazka: 'Kolik je dost?', odpoved: 'Když nic nechybí.', odkaz: '/cesta/kolik-je-dost/7/', kdy: cas(2) },
  ],
  bloky: { 'cesta6-volba': { vyber: 1, proc: '', potvrzeno: true } },
  cesty: {
    'kdy-verit': cesta('Kdy mám dobrý důvod věřit?', 7, [1, 2, 3, 4, 5, 6, 7], cas(4), cas(4, 11)),
    'kolik-je-dost': cesta('Kolik je dost?', 7, [1, 2, 3], cas(2)),
  },
  navstivene: [{ odkaz: '/denik/', nazev: 'Můj deník', kdy: cas(9) }, { odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: cas(5) }],
  aktivita: [{ id: 'epikuros-roztrid', odkaz: '/osobnost/epikuros/#roztrid', otazka: 'Co potřebuješ?', druh: 'roztrid', hotovo: false, kdy: cas(1) }],
  citaty: [{ id: 'ep-1', text: 'Kdo nemá dost na málu…', kde: 'Epikúros, Zlomky', odkaz: '/osobnost/epikuros/', kdy: cas(1, 12) }],
});

describe('adresa stránky', () => {
  it('krok cesty patří k cestě, kotva a dotaz zmizí, lomítko přibude', () => {
    expect(adresaStranky('/cesta/kolik-je-dost/3/#cesta6-tri-kose')).toBe('/cesta/kolik-je-dost/');
    expect(adresaStranky('/osobnost/sokrates/#nikdo')).toBe('/osobnost/sokrates/');
    expect(adresaStranky('/otazka/jak-zit?x=1')).toBe('/otazka/jak-zit/');
  });
});

describe('kapitoly deníku', () => {
  it('prázdný deník nemá žádnou kapitolu a žádná není otevřená', () => {
    const k = kapitolyDeniku(prazdny(), { ...PODKLADY, potkani: [] });
    expect(k).toEqual([]);
    expect(otevreneKapitoly(k, null)).toEqual([]);
  });

  it('deník s jedním obdobím: jedna kapitola s rozpracovanou cestou, zápisem a volbou z katalogu; je otevřená', () => {
    const d = prazdny({
      zapisy: [{ id: 'cesta6-pravidlo', otazka: 'Kolik je dost?', odpoved: 'Když nic nechybí.', odkaz: '/cesta/kolik-je-dost/7/', kdy: cas(2) }],
      bloky: { 'cesta6-volba': { vyber: 0, proc: '', potvrzeno: true } },
      cesty: { 'kolik-je-dost': cesta('Kolik je dost?', 7, [1, 2], cas(2)) },
    });
    const k = kapitolyDeniku(d, PODKLADY);
    expect(k.map((x) => x.klic)).toEqual(['obdobi-2']);
    expect(k[0].nazev).toBe('Helenismus a Řím');
    expect(k[0].cesty).toEqual(['kolik-je-dost']);
    expect(k[0].skupiny).toHaveLength(1);
    expect(k[0].skupiny[0]).toMatchObject({ adresa: '/cesta/kolik-je-dost/', nazev: 'Kolik je dost?', druh: 'cesta' });
    // Volba z kroku 2 před pravidlem ze 7. kroku; volba nemá zápis, a tak není ve výpisu podle data.
    expect(k[0].skupiny[0].zaznamy.map((z) => [z.krok, z.volba ?? z.odpoved])).toEqual([[2, 'Nový telefon'], [7, 'Když nic nechybí.']]);
    expect(k[0].podleData.map((z) => z.id)).toEqual(['cesta6-pravidlo']);
    expect(otevreneKapitoly(k, null)).toEqual(['obdobi-2']);
  });

  it('deník se dvěma obdobími: kapitoly v pořadí období, každá se svými záznamy a sbírkou', () => {
    const k = kapitolyDeniku(dveObdobi(), { ...PODKLADY, potkani: ['sokrates', 'epikuros'] });
    expect(k.map((x) => x.klic)).toEqual(['obdobi-1', 'obdobi-2']);
    const [recko, helenismus] = k;
    expect(recko.leta).toBe('650–300 př. n. l.');
    // Prošlá cesta s pahýlem není rozpracovaná; skupiny od naposledy otevřené (profil 5. 11., cesta 4. 11.).
    expect(recko.cesty).toEqual([]);
    expect(recko.skupiny.map((s) => [s.druh, s.nazev])).toEqual([['stranka', 'Sókratés'], ['cesta', 'Kdy mám dobrý důvod věřit?']]);
    expect(recko.skupiny[1].zaznamy.map((z) => z.krok)).toEqual([2, 7]);
    expect(recko.podleData.map((z) => z.id)).toEqual(['sokrates/nikdo', 'cesta1-pravidlo', 'cesta1-krok2']);
    expect(recko.potkani).toEqual(['sokrates']);
    expect(recko.pahyly.map((p) => p.slug)).toEqual(['kdy-verit']);
    expect(recko.citaty).toEqual([]);

    expect(helenismus.cesty).toEqual(['kolik-je-dost']);
    expect(helenismus.otazky.map((a) => a.id)).toEqual(['epikuros-roztrid']);
    expect(helenismus.potkani).toEqual(['epikuros']);
    expect(helenismus.citaty.map((c) => c.id)).toEqual(['ep-1']);
    expect(helenismus.pahyly).toEqual([]);
  });

  it('otevřená je kapitola, kde student naposledy byl; návštěva deníku se nepočítá', () => {
    const k = kapitolyDeniku(dveObdobi(), PODKLADY);
    expect(k.find((x) => x.klic === 'obdobi-1')!.naposledy).toBe(cas(5));
    expect(otevreneKapitoly(k, null)).toEqual(['obdobi-1']);
    // Pozdější zápis v Helenismu otevře Helenismus.
    const d = dveObdobi();
    d.cesty['kolik-je-dost'].kdy = cas(8);
    expect(otevreneKapitoly(kapitolyDeniku(d, PODKLADY), null)).toEqual(['obdobi-2']);
  });

  it('otázky a období bez stránky jdou do kapitoly Napříč obdobími, která stojí poslední', () => {
    const d = dveObdobi();
    d.zapisy.push(
      { id: 'otazka-jak-zit-prvni', otazka: 'Jak mám žít?', odpoved: 'Poctivě.', odkaz: '/otazka/jak-zit/#prvni', kdy: cas(6) },
      { id: 'augustin/cas', otazka: 'Co je čas?', odpoved: 'Nevím.', odkaz: '/osobnost/augustin/', kdy: cas(1) },
      { id: 'dilna', otazka: 'Zkouška', odpoved: 'x', odkaz: '/dilna/bloky/#volba', kdy: cas(1, 8) },
    );
    const k = kapitolyDeniku(d, { ...PODKLADY, potkani: ['augustin'] });
    expect(k.map((x) => x.klic)).toEqual(['obdobi-1', 'obdobi-2', KAPITOLA_NAPRIC]);
    const napric = k[2];
    expect(napric.nazev).toBe(NAZEV_NAPRIC);
    expect(napric.obdobi).toBeNull();
    expect(napric.skupiny.map((s) => [s.druh, s.nazev])).toEqual([['otazka', 'Jak mám žít?'], ['stranka', 'Augustin'], ['stranka', 'Jinde v atlasu']]);
    expect(napric.potkani).toEqual(['augustin']);
    expect(otevreneKapitoly(k, null)).toEqual([KAPITOLA_NAPRIC]);
  });

  it('kapitola bez záznamů se neukáže, i když student stránky období navštívil', () => {
    const d = prazdny({ navstivene: [{ odkaz: '/osobnost/epikuros/', nazev: 'Epikúros', kdy: cas(3) }] });
    expect(kapitolyDeniku(d, PODKLADY)).toEqual([]);
  });
});

describe('zapamatovaný stav kapitol', () => {
  const k = kapitolyDeniku(dveObdobi(), PODKLADY);

  it('kapitoly zůstanou, jak je student nechal, dokud nebyl jinde', () => {
    expect(otevreneKapitoly(k, { otevrene: ['obdobi-2'], kdy: cas(7) })).toEqual(['obdobi-2']);
    expect(otevreneKapitoly(k, { otevrene: [], kdy: cas(7) })).toEqual([]);
  });

  it('kapitola, kde student byl po poslední změně, se otevře k těm zapamatovaným', () => {
    expect(otevreneKapitoly(k, { otevrene: ['obdobi-2'], kdy: cas(4) })).toEqual(['obdobi-1', 'obdobi-2']);
  });

  it('když zapamatované kapitoly zmizely, otevře se poslední', () => {
    expect(otevreneKapitoly(k, { otevrene: [KAPITOLA_NAPRIC], kdy: cas(7) })).toEqual(['obdobi-1']);
  });

  it('stav z úložiště: nesmysl je null, cizí položky zmizí', () => {
    expect(rozeberStavKapitol(null)).toBeNull();
    expect(rozeberStavKapitol('x')).toBeNull();
    expect(rozeberStavKapitol({ otevrene: 'obdobi-1', kdy: cas(1) })).toBeNull();
    expect(rozeberStavKapitol({ otevrene: ['obdobi-1', 3], kdy: cas(1), pohled: 'abeceda' })).toEqual({ otevrene: ['obdobi-1'], kdy: cas(1) });
    expect(rozeberStavKapitol({ otevrene: [], kdy: cas(1), pohled: 'data' })).toEqual({ otevrene: [], kdy: cas(1), pohled: 'data' });
  });
});
