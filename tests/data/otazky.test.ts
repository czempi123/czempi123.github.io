// Velké otázky: adresa, pořadí hlasů a kontrola hlasů proti datům; obsah otázek v src/content/otazky.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { adresaOtazky, maStranku, seradHlasy, chybyHlasu, klicOtazky } from '../../src/lib/otazky';
import { osoby, citatyPodleId, pramenyPodleId } from '../../src/lib/data';

describe('adresa otázky', () => {
  it('otázka s hlasy má vlastní stránku, bez hlasů kotvu v přehledu', () => {
    expect(adresaOtazky('jak-zit', { hlasy: [] })).toBe('/otazky/#jak-zit');
    expect(adresaOtazky('jak-zit', {})).toBe('/otazky/#jak-zit');
    expect(adresaOtazky('jak-poznam-pravdu', { hlasy: [{ osoba: 'sokrates', odpoved: 'x' }] })).toBe('/otazka/jak-poznam-pravdu/');
    expect(maStranku({ hlasy: [] })).toBe(false);
  });
  it('klíče deníku jsou odvozené ze slugu', () => {
    expect(klicOtazky('jak-poznam-pravdu')).toEqual({
      prvni: 'otazka-jak-poznam-pravdu-prvni',
      ted: 'otazka-jak-poznam-pravdu-ted',
      stav: 'otazka-jak-poznam-pravdu',
      osa: 'otazka-jak-poznam-pravdu-osa',
    });
  });
});

describe('pořadí hlasů', () => {
  it('řadí podle narození, přes přelom letopočtu, a neznámé dává na konec', () => {
    const m = new Map([
      ['a', { narozen: { rok: -384 }, zemrel: { rok: -322 } }],
      ['b', { narozen: { rok: -469 }, zemrel: { rok: -399 } }],
      ['c', { narozen: { rok: 55 }, zemrel: { rok: 135 } }],
      ['d', { aktivni: { od: -4, do: 30 } }],
    ]) as never;
    const h = ['c', 'x', 'a', 'd', 'b'].map((osoba) => ({ osoba, odpoved: '…' }));
    expect(seradHlasy(h, m).map((x) => x.osoba)).toEqual(['b', 'a', 'd', 'c', 'x']);
  });
  it('prázdný seznam zůstane prázdný', () => {
    expect(seradHlasy([], new Map())).toEqual([]);
  });
});

describe('kontrola hlasů', () => {
  it('najde neznámou osobu, cizí citát, neznámý pramen a dvojí hlas', () => {
    const chyby = chybyHlasu(
      'test',
      [
        { osoba: 'nikdo', odpoved: '…' },
        { osoba: 'sokrates', odpoved: '…', citat: 'theaitetos-152a' },
        { osoba: 'sokrates', odpoved: '…', zdroje: ['neexistuje'] },
        { osoba: 'protagoras', odpoved: '…', citat: 'neni' },
      ],
      osoby,
      citatyPodleId,
      pramenyPodleId,
    );
    expect(chyby).toHaveLength(5);
    expect(chyby.join('\n')).toMatch(/„nikdo“ není v lide.yaml/);
    expect(chyby.join('\n')).toMatch(/patří osobě „protagoras“/);
    expect(chyby.join('\n')).toMatch(/má dva hlasy/);
    expect(chyby.join('\n')).toMatch(/pramen „neexistuje“/);
    expect(chyby.join('\n')).toMatch(/citát „neni“ není/);
  });

  it('hlasy všech otázek v atlasu odpovídají datům', () => {
    const slozka = 'src/content/otazky';
    for (const soubor of readdirSync(slozka).filter((f) => /^[^_].*\.mdx?$/.test(f))) {
      const fm = parse(readFileSync(`${slozka}/${soubor}`, 'utf8').split('---')[1]);
      expect(chybyHlasu(soubor, fm.hlasy ?? [], osoby, citatyPodleId, pramenyPodleId), soubor).toEqual([]);
    }
  });
});
