// Postup v cestě (design-v2, K5): lístek, který se štípe, tichý Další krok, typ přechodu mezi kroky, pahýl v deníku.
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { blokKroku, stavKroku, typPrechoduKroku } from '../../src/lib/postup';
import { nacti, zaznamenejKrok, odtrhniPahyl, spojDeniky, _zapomenPamet, type Denik } from '../../src/lib/denik';

class Uloziste {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}
const g = globalThis as unknown as { localStorage?: unknown };

describe('blokKroku', () => {
  it('vrací id posledního bloku s odpovědí; kresby, Příběh a zastánci se nepočítají', () => {
    expect(blokKroku('<Pribeh id="p" />\n<Volba id="v1" dal={{ href: "#x" }} />\n<Odkryj id="o2" />')).toBe('o2');
    expect(blokKroku('<Pribeh id="p" />\n<Jeskyne />')).toBeUndefined();
    expect(blokKroku('<Strany id="s"><Strana /></Strany>\n<ZaverCesty id="z" otazka="?" />')).toBe('z');
    expect(blokKroku('')).toBeUndefined();
  });

  it('každý poslední krok každé cesty čeká na závěrečné pravidlo', () => {
    const koren = 'src/content/cesty';
    for (const slug of readdirSync(koren, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
      const soubory = readdirSync(join(koren, slug)).sort((a, b) => parseInt(a) - parseInt(b));
      const posledni = readFileSync(join(koren, slug, soubory[soubory.length - 1]), 'utf8');
      expect(blokKroku(posledni), slug).toMatch(/./);
    }
  });
});

describe('stavKroku', () => {
  const denik = (c: object, akt: object[] = [], zap: object[] = []) => ({ verze: 1, cesty: { c: c }, aktivita: akt, zapisy: zap });

  it('prošlé kroky jsou dírky, běžící krok je v kroužku, ostatní volné', () => {
    const s = stavKroku(denik({ navstivene: [1, 2, 3] }), 'c', 3, 5, '');
    expect(s.mista).toEqual(['dirka', 'dirka', 'ted', 'volne', 'volne']);
    expect(s.hotovy).toBe(true);
    expect(s.cely).toBe(false);
  });

  it('krok s blokem je hotový podle aktivity bloku, závěrečné pravidlo podle neprázdného zápisu', () => {
    expect(stavKroku(denik({}), 'c', 2, 5, 'v').hotovy).toBe(false);
    expect(stavKroku(denik({}, [{ id: 'v', hotovo: false }]), 'c', 2, 5, 'v').hotovy).toBe(false);
    expect(stavKroku(denik({}, [{ id: 'v', hotovo: true }]), 'c', 2, 5, 'v').hotovy).toBe(true);
    expect(stavKroku(denik({}, [], [{ id: 'z', odpoved: '  ' }]), 'c', 5, 5, 'z').hotovy).toBe(false);
    expect(stavKroku(denik({}, [], [{ id: 'z', odpoved: 'Moje pravidlo' }]), 'c', 5, 5, 'z').hotovy).toBe(true);
    // Aktivita má přednost před zápisem (Odkryj zapisuje odpověď dřív, než student odklopí srovnání).
    expect(stavKroku(denik({}, [{ id: 'o', hotovo: false }], [{ id: 'o', odpoved: 'píšu' }]), 'c', 2, 5, 'o').hotovy).toBe(false);
  });

  it('po odtržení pahýlu je na posledním kroku dírka i místo běžícího kroku; na přehledu není běžící krok', () => {
    expect(stavKroku(denik({ navstivene: [1, 2, 3], pahyl: 't' }), 'c', 3, 3, '').mista).toEqual(['dirka', 'dirka', 'dirka']);
    expect(stavKroku(denik({ navstivene: [1, 2, 3], pahyl: 't' }), 'c', 2, 3, '').mista).toEqual(['dirka', 'ted', 'dirka']);
    expect(stavKroku(denik({ navstivene: [2] }), 'c', 0, 3, '').mista).toEqual(['volne', 'dirka', 'volne']);
  });

  it('poškozený nebo prázdný deník nic nerozbije', () => {
    for (const d of [null, undefined, 'x', { cesty: 'x' }, { cesty: { c: { navstivene: 'x' } }, aktivita: 'x' }]) {
      const s = stavKroku(d, 'c', 1, 3, 'v');
      expect(s.mista).toEqual(['ted', 'volne', 'volne']);
      expect(s.hotovy).toBe(false);
    }
  });

  it('funguje i jako text vložený do skriptu (bez závislostí)', () => {
    const f = new Function(`return (${stavKroku.toString()})`)() as typeof stavKroku;
    expect(f(denik({ navstivene: [1] }), 'c', 2, 3, '').mista).toEqual(['dirka', 'ted', 'volne']);
    const t = new Function(`return (${typPrechoduKroku.toString()})`)() as typeof typPrechoduKroku;
    expect(t('/cesta/a/1/', '/cesta/a/2/')).toBe('krok-dal');
  });
});

describe('typPrechoduKroku', () => {
  it('pozná krok n → n+1 a zpět z adresy téže cesty', () => {
    expect(typPrechoduKroku('/cesta/kolik-je-dost/2/', '/cesta/kolik-je-dost/3/')).toBe('krok-dal');
    expect(typPrechoduKroku('/cesta/kolik-je-dost/3/', '/cesta/kolik-je-dost/2/')).toBe('krok-zpet');
    expect(typPrechoduKroku('/cesta/kolik-je-dost/2', '/cesta/kolik-je-dost/3/#blok')).toBe('krok-dal');
  });
  it('jinde přechod mezi kroky není: skok o víc kroků, jiná cesta, přehled, profil', () => {
    expect(typPrechoduKroku('/cesta/kolik-je-dost/2/', '/cesta/kolik-je-dost/4/')).toBeNull();
    expect(typPrechoduKroku('/cesta/kolik-je-dost/2/', '/cesta/proc-se-bat-smrti/3/')).toBeNull();
    expect(typPrechoduKroku('/cesta/kolik-je-dost/', '/cesta/kolik-je-dost/1/')).toBeNull();
    expect(typPrechoduKroku('/osobnost/sokrates/', '/cesta/kolik-je-dost/1/')).toBeNull();
    expect(typPrechoduKroku('', '/cesta/kolik-je-dost/1/')).toBeNull();
  });
});

describe('pahýl v deníku', () => {
  beforeEach(() => { g.localStorage = new Uloziste(); _zapomenPamet(); });

  it('odtrhne se jednou a další návštěva kroku ho nesmaže', () => {
    expect(odtrhniPahyl('c')).toBe(false); // cesta bez záznamu
    zaznamenejKrok('c', 3, 'Cesta', 3);
    expect(odtrhniPahyl('c')).toBe(true);
    const cas = nacti().cesty.c.pahyl;
    expect(cas).toMatch(/^\d{4}-/);
    expect(odtrhniPahyl('c')).toBe(false);
    zaznamenejKrok('c', 1, 'Cesta', 3);
    expect(nacti().cesty.c.pahyl).toBe(cas);
  });

  it('spojení deníků drží dřívější odtržení', () => {
    const zaklad = (pahyl?: string): Denik => ({
      verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
      cesty: { c: { nazev: 'C', pocet: 3, krok: 3, navstivene: [1, 2, 3], kdy: '2026-11-10T10:00:00Z', ...(pahyl ? { pahyl } : {}) } },
    });
    expect(spojDeniky(zaklad(), zaklad('2026-11-12T10:00:00Z')).cesty.c.pahyl).toBe('2026-11-12T10:00:00Z');
    expect(spojDeniky(zaklad('2026-11-13T10:00:00Z'), zaklad('2026-11-12T10:00:00Z')).cesty.c.pahyl).toBe('2026-11-12T10:00:00Z');
    expect(spojDeniky(zaklad(), zaklad()).cesty.c.pahyl).toBeUndefined();
  });
});
