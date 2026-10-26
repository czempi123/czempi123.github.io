// Cesty: pořadí kroků, adresy a „Kam dál“.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { krokyCesty, krokZAdresy, dalsiKrok, adresaKroku, zacatekCesty, poradiDalsichCest, cestaHotova } from '../../src/lib/cesty';

const k = [
  { cesta: 'c', krok: 2, nazev: 'Dva' },
  { cesta: 'c', krok: 1, nazev: 'Jedna' },
  { cesta: 'd', krok: 1, nazev: 'Jiná' },
];

describe('cesty', () => {
  it('kroky seřadí a hlídají číslování', () => {
    expect(krokyCesty(k, 'c').map((x) => x.nazev)).toEqual(['Jedna', 'Dva']);
    expect(() => krokyCesty([...k, { cesta: 'c', krok: 4, nazev: 'Čtyři' }], 'c')).toThrow(/bez mezer/);
  });
  it('adresa kroku tam a zpět', () => {
    expect(adresaKroku('kdy-mam-dobry-duvod-verit', 3)).toBe('/cesta/kdy-mam-dobry-duvod-verit/3/');
    expect(krokZAdresy('/cesta/kdy-mam-dobry-duvod-verit/3/')).toEqual({ slug: 'kdy-mam-dobry-duvod-verit', n: 3 });
    expect(krokZAdresy('/cesta/kdy-mam-dobry-duvod-verit/')).toBeNull();
    expect(krokZAdresy('/osobnost/sokrates/')).toBeNull();
  });
  it('Kam dál: další krok, na konci dokončení', () => {
    expect(dalsiKrok(k, 'c', 1)).toEqual({ href: '/cesta/c/2/', text: 'Další krok: Dva' });
    expect(dalsiKrok(k, 'c', 2)).toEqual({ href: '/cesta/c/#hotovo', text: 'Dokončit cestu' });
    expect(dalsiKrok(k, 'x', 1)).toBeNull();
  });
  it('začátek cesty: blok se zápisem v některém dřívějším kroku', () => {
    const kroky = [
      { cesta: 'c', krok: 1, nazev: 'Scéna', body: '<Pribeh id="scena" osoba="sokrates">Text</Pribeh>' },
      { cesta: 'c', krok: 2, nazev: 'Tvůj tah', body: 'Text.\n\n<Volba id="c-tah" />' },
      { cesta: 'c', krok: 3, nazev: 'Pokus', body: '<Odkryj\n  id="c-pokus"\n  otazka="Proč?"\n>\nText\n</Odkryj>' },
      { cesta: 'c', krok: 4, nazev: 'Pravidlo', body: '<Spor id="c-spor" />\n<ZaverCesty id="c-pravidlo" otazka="?" />' },
      { cesta: 'd', krok: 1, nazev: 'Jiná', body: '<Volba id="d-tah" />' },
    ];
    expect(zacatekCesty(kroky, 'c', 'c-tah')).toEqual({ krok: 2, nazev: 'Tvůj tah' });
    // Blok psaný v MDX na víc řádků se najde taky.
    expect(zacatekCesty(kroky, 'c', 'c-pokus')).toEqual({ krok: 3, nazev: 'Pokus' });
    // Blok jiné cesty, blok bez zápisu, neznámý blok a blok až v posledním kroku sestavení zastaví.
    expect(() => zacatekCesty(kroky, 'c', 'd-tah')).toThrow(/nestojí v žádném jejím kroku/);
    expect(() => zacatekCesty(kroky, 'c', 'scena')).toThrow(/do deníku nic nezapisuje/);
    expect(() => zacatekCesty(kroky, 'c', 'c-ta')).toThrow(/nestojí v žádném jejím kroku/);
    expect(() => zacatekCesty(kroky, 'c', 'c-spor')).toThrow(/až v posledním kroku/);
    expect(() => zacatekCesty(kroky, 'c', 'c-pravidlo')).toThrow(/nestojí v žádném jejím kroku/);
  });
});

// Obsah cest v src/content/cesty: každá cesta má kroky 1…n a frontmatter s cestou, krokem a názvem.
const slozka = new URL('../../src/content/cesty/', import.meta.url);
const cesty = readdirSync(slozka).filter((s) => /^[a-z0-9-]+\.mdx$/.test(s)).map((s) => s.replace('.mdx', ''));
const frontmatter = (text: string) => parse(text.split('---')[1]);

describe('obsah cest', () => {
  it('je aspoň jedna cesta', () => expect(cesty.length).toBeGreaterThan(0));
  for (const c of cesty) {
    it(`${c}: kroky 1…n patří k cestě`, () => {
      const soubory = readdirSync(new URL(`${c}/`, slozka)).filter((s) => /^\d+.*\.mdx$/.test(s));
      const kroky = soubory.map((s) => ({ soubor: s, ...frontmatter(readFileSync(new URL(`${c}/${s}`, slozka), 'utf8')) }));
      for (const x of kroky) {
        expect(x.cesta, x.soubor).toBe(c);
        expect(x.soubor.startsWith(`${x.krok}-`), x.soubor).toBe(true);
      }
      expect(krokyCesty(kroky, c).length).toBe(kroky.length);
    });
    it(`${c}: začátek cesty stojí v dřívějším kroku a poslední krok má závěr s pravidlem`, () => {
      const prehled = frontmatter(readFileSync(new URL(`${c}.mdx`, slozka), 'utf8'));
      const soubory = readdirSync(new URL(`${c}/`, slozka)).filter((s) => /^\d+.*\.mdx$/.test(s));
      const kroky = soubory.map((s) => {
        const text = readFileSync(new URL(`${c}/${s}`, slozka), 'utf8');
        return { ...frontmatter(text), body: text.split('---').slice(2).join('---') };
      });
      expect(prehled.zacatek, 'hotová cesta má v přehledu pole zacatek').toMatch(/^[a-z0-9-]+$/);
      const z = zacatekCesty(kroky, c, prehled.zacatek);
      expect(z.krok).toBeLessThan(kroky.length);
      const posledni = krokyCesty(kroky, c)[kroky.length - 1];
      expect(posledni.body).toMatch(/<ZaverCesty id="[a-z0-9-]+" otazka="[^"]+" \/>/);
    });
  }
});

describe('další cesta v Kam dál hotové cesty', () => {
  const c = (slug: string, cislo: number, otazka: number) => ({ slug, cislo, otazka });
  const antika = [c('c1', 1, 7), c('c2', 2, 5), c('c3', 3, 6), c('c4', 4, 1), c('c5', 5, 4), c('c6', 6, 1), c('c7', 7, 1), c('c8', 8, 3), c('c33', 33, 3), c('c34', 34, 1)];
  it('nejdřív cesty téže otázky po této a před ní, pak ostatní podle katalogu od této dál', () => {
    expect(poradiDalsichCest('c6', antika).map((x) => x.slug)).toEqual(['c7', 'c34', 'c4', 'c8', 'c33', 'c1', 'c2', 'c3', 'c5']);
    expect(poradiDalsichCest('c33', antika).map((x) => x.slug)).toEqual(['c8', 'c34', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']);
    expect(poradiDalsichCest('nic', antika)).toEqual([]);
    const bez = antika.map((x) => (x.slug === 'c8' ? { ...x, nenabizet: ['c33'] } : x));
    expect(poradiDalsichCest('c8', bez).map((x) => x.slug)).toEqual(['c34', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']);
  });
  it('hotová cesta podle deníku', () => {
    expect(cestaHotova(undefined)).toBe(false);
    expect(cestaHotova({ navstivene: [1, 2], pocet: 3 })).toBe(false);
    expect(cestaHotova({ navstivene: [1, 2, 3], pocet: 3 })).toBe(true);
    expect(cestaHotova({ navstivene: [1], pocet: 3, dokonceno: '2026-10-01T10:00:00Z' })).toBe(true);
  });
});
