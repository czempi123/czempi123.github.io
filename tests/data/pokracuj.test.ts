// Pokračuj, kde jsi skončil: výběr z rozpracovaných cest, bloků a navštívených stránek.
import { describe, it, expect } from 'vitest';
import { coPokracovat, zacatekDomu } from '../../src/lib/pokracuj';

const N = ' ';
const prazdny = { cesty: {}, aktivita: [], navstivene: [] };

describe('coPokracovat', () => {
  it('prázdný deník nic nenabídne', () => {
    expect(coPokracovat(prazdny)).toEqual([]);
  });
  it('rozpracovaná cesta má přednost, když je nejnovější; hotová se nenabízí', () => {
    const d = {
      ...prazdny,
      cesty: {
        'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 6, krok: 3, navstivene: [1, 2, 3], kdy: '2026-10-01T10:00:00Z' },
        hotova: { nazev: 'Hotová', pocet: 2, krok: 2, navstivene: [1, 2], kdy: '2026-10-01T11:00:00Z' },
      },
      navstivene: [{ odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: '2026-10-01T09:00:00Z' }],
    };
    const p = coPokracovat(d);
    expect(p.map((x) => x.odkaz)).toEqual(['/cesta/kdy-mam-dobry-duvod-verit/3/', '/osobnost/sokrates/']);
    expect(p[0].popis).toBe(`Krok 3${N}z${N}6`);
  });
  it('rozpracovaný blok, hotový blok se přeskočí; blok v téže cestě se neopakuje', () => {
    const d = {
      ...prazdny,
      cesty: { c: { nazev: 'Cesta', pocet: 6, krok: 2, navstivene: [1, 2], kdy: '2026-10-01T10:00:00Z' } },
      aktivita: [
        { id: 'v', odkaz: '/cesta/c/2/#v', otazka: 'Co uděláš?', druh: 'volba' as const, hotovo: false, kdy: '2026-10-01T10:05:00Z' },
        { id: 's', odkaz: '/osobnost/sokrates/#s', otazka: 'Spor', druh: 'spor' as const, hotovo: true, kdy: '2026-10-01T10:06:00Z' },
      ],
    };
    const p = coPokracovat(d);
    expect(p).toHaveLength(1);
    expect(p[0].nadtitulek).toBe('Rozpracovaná otázka');
    expect(p[0].odkaz).toBe('/cesta/c/2/#v');
  });
  it('omezí počet', () => {
    const d = {
      ...prazdny,
      aktivita: [{ id: 'v', odkaz: '/a/#v', otazka: 'Q', druh: 'volba' as const, hotovo: false, kdy: '2026-10-01T10:05:00Z' }],
      navstivene: [{ odkaz: '/b/', nazev: 'B', kdy: '2026-10-01T09:00:00Z' }],
    };
    expect(coPokracovat(d, 1).map((x) => x.odkaz)).toEqual(['/a/#v']);
  });
});

describe('coPokracovat: co už nabízí hlavní tlačítko, se neopakuje', () => {
  const d = {
    ...prazdny,
    cesty: { c: { nazev: 'Cesta', pocet: 6, krok: 2, navstivene: [1, 2], kdy: '2026-10-01T10:00:00Z' } },
    aktivita: [{ id: 'v', odkaz: '/cesta/c/2/#v', otazka: 'Co uděláš?', druh: 'volba' as const, hotovo: false, kdy: '2026-10-01T10:05:00Z' }],
    navstivene: [{ odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: '2026-10-01T09:00:00Z' }],
  };
  it('cesta z hlavního tlačítka ani blok v ní se nenabídnou, zbytek ano', () => {
    expect(coPokracovat(d, 2, '/cesta/c/2/').map((x) => x.odkaz)).toEqual(['/osobnost/sokrates/']);
  });
  it('bez vynechání zůstává chování stejné', () => {
    expect(coPokracovat(d).map((x) => x.odkaz)).toEqual(['/cesta/c/2/#v', '/osobnost/sokrates/']);
  });
});

describe('zacatekDomu: hlavní tlačítko na Domů', () => {
  const NB = ' ';
  const bez = (s: string) => s.replaceAll(NB, ' ');
  const cesty = {
    prvni: { cislo: 1, nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, minut: 20 },
    pata: { cislo: 5, nazev: 'Co mám ve svých rukou?', pocet: 8, minut: 20 },
    sesta: { cislo: 6, nazev: 'Kolik je dost?', pocet: 7 },
  };
  const hotova = (pocet: number, kdy = '2026-10-01T10:00:00Z') => ({ krok: pocet, navstivene: Array.from({ length: pocet }, (_, i) => i + 1), kdy });

  it('nový student (i bez deníku nebo s rozbitým) začíná první cestu krokem 1', () => {
    const deniky: Parameters<typeof zacatekDomu>[0][] = [null, undefined, {}, { cesty: {} }, { cesty: [] as never }, { cesty: { prvni: {} } }];
    for (const d of deniky) {
      const z = zacatekDomu(d, cesty, 'prvni');
      expect(z.stav).toBe('zacit');
      expect(z.text).toBe('Začít první cestu');
      expect(z.href).toBe('/cesta/prvni/1/');
      expect(bez(z.udaj)).toBe('První cesta · asi 20 minut · 7 kroků');
    }
  });
  it('údaj drží nezlomitelné mezery a tvary podle čísla; bez minut je vynechá', () => {
    expect(zacatekDomu(null, cesty, 'prvni').udaj).toBe(`První${NB}cesta · asi${NB}20${NB}minut · 7${NB}kroků`);
    expect(bez(zacatekDomu(null, cesty, 'sesta').udaj)).toBe('První cesta · 7 kroků');
    expect(bez(zacatekDomu(null, { a: { cislo: 2, nazev: 'A', pocet: 3, minut: 2 } }, 'a').udaj)).toBe('První cesta · asi 2 minuty · 3 kroky');
    expect(bez(zacatekDomu(null, { a: { cislo: 2, nazev: 'A', pocet: 1, minut: 1 } }, 'a').udaj)).toBe('První cesta · asi 1 minuta · 1 krok');
  });
  it('rozpracovaná první cesta: pokračuje se naposledy otevřeným krokem', () => {
    const z = zacatekDomu({ cesty: { prvni: { krok: 4, navstivene: [1, 2, 3, 4], kdy: '2026-10-01T10:00:00Z' } } }, cesty, 'prvni');
    expect(z).toEqual({ stav: 'pokracovat', text: 'Pokračovat v cestě', href: '/cesta/prvni/4/', udaj: `Kdy mám dobrý důvod věřit? · krok${NB}4${NB}z${NB}7` });
  });
  it('z více rozpracovaných cest vede tlačítko do té naposledy otevřené; první cesta nemusí být začatá', () => {
    const d = {
      cesty: {
        sesta: { krok: 2, navstivene: [1, 2], kdy: '2026-10-02T10:00:00Z' },
        pata: { krok: 3, navstivene: [1, 2, 3], kdy: '2026-10-03T08:00:00Z' },
      },
    };
    const z = zacatekDomu(d, cesty, 'prvni');
    expect(z.href).toBe('/cesta/pata/3/');
    expect(bez(z.udaj)).toBe('Co mám ve svých rukou? · krok 3 z 8');
  });
  it('krok za koncem cesty a cesta, která v datech není, tlačítko nerozbijí', () => {
    const z = zacatekDomu({ cesty: { zrusena: { krok: 2, navstivene: [1, 2], kdy: '2026-10-03T08:00:00Z' }, prvni: { krok: 9, navstivene: [1, 9], kdy: '2026-10-01T08:00:00Z' } } }, cesty, 'prvni');
    expect(z.href).toBe('/cesta/prvni/7/');
  });
  it('první cesta hotová a nic rozpracovaného: výběr další v přehledu otázek', () => {
    const z = zacatekDomu({ cesty: { prvni: hotova(7) } }, cesty, 'prvni');
    expect(z.stav).toBe('dalsi');
    expect(z.text).toBe('Vybrat další cestu');
    expect(z.href).toBe('/otazky/');
    expect(bez(z.udaj)).toBe('První cesta je hotová · zbývají 2 cesty');
    expect(bez(zacatekDomu({ cesty: { prvni: hotova(7), pata: hotova(8) } }, cesty, 'prvni').udaj)).toBe('První cesta je hotová · zbývá 1 cesta');
  });
  it('první cesta hotová, jiná rozpracovaná: pokračuje se v rozpracované', () => {
    const z = zacatekDomu({ cesty: { prvni: hotova(7, '2026-10-03T09:00:00Z'), sesta: { krok: 2, navstivene: [1, 2], kdy: '2026-10-02T10:00:00Z' } } }, cesty, 'prvni');
    expect(z.href).toBe('/cesta/sesta/2/');
  });
  it('všechny cesty hotové: zbývá přehled otázek', () => {
    const z = zacatekDomu({ cesty: { prvni: hotova(7), pata: hotova(8), sesta: hotova(7) } }, cesty, 'prvni');
    expect(z).toEqual({ stav: 'dalsi', text: 'Vybrat otázku', href: '/otazky/', udaj: 'Všechny cesty máš za sebou.' });
  });
  it('je soběstačná: její text jde spustit bez okolního modulu (skript před vykreslením na Domů)', () => {
    const samostatna = new Function(`return (${zacatekDomu.toString()})`)() as typeof zacatekDomu;
    const d = { cesty: { prvni: { krok: 4, navstivene: [1, 2, 3, 4], kdy: '2026-10-01T10:00:00Z' } } };
    for (const denik of [null, d, { cesty: { prvni: hotova(7) } }]) expect(samostatna(denik, cesty, 'prvni')).toEqual(zacatekDomu(denik, cesty, 'prvni'));
  });
});
