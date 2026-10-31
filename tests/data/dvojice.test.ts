// Pravidla výběru dvojic z dat (interaktivita-v1, K2): výchozí dvojice Dvou životů, druhý člověk bloku
// Kdo žil dřív? na medailonku, současníci na mini ose a nabídka lidí. Výpis dvojic pro všechny osoby se stránkou:
// VYPIS=1 npx vitest run tests/data/dvojice.test.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { nactiData, type SurovaData } from '../../src/lib/kontroly';
import { druhyKdoZilDriv, druziKdoZilDriv, mezeraZivotu, NEJMENSI_MEZERA, NEJVIC_MEDAILONKU, majiVztah, soucasniciNaOse, stredZivota, vychoziDvojice, vyberDruhehoZivota, zijiZaroven } from '../../src/lib/dvojice';
import { vzdalenost } from '../../src/lib/cas-mapy';
import type { TOsoba } from '../../src/lib/schema';

const koren = join(import.meta.dirname, '../..');
const cti = (s: string) => readFileSync(join(koren, 'src/data', s), 'utf8');
const surova: SurovaData = {
  lide: cti('lide.yaml'), mista: cti('mista.yaml'), vztahy: cti('vztahy.yaml'),
  udalosti: cti('udalosti.yaml'), obdobi: cti('obdobi.yaml'), zdroje: cti('zdroje.yaml'), krajiny: cti('krajiny.yaml'),
};
const { data } = nactiData(surova);
const profily = readdirSync(join(koren, 'src/content/osobnosti'))
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => parse(readFileSync(join(koren, 'src/content/osobnosti', f), 'utf8').split('---')[1]) as { osoba: string; dalsi?: string[] });
const sProfilem = new Set(profily.flatMap((p) => [p.osoba, ...(p.dalsi ?? [])]));
const medailonky = data.lide.filter((o) => o.medailonek).map((o) => o.id);
const seStrankou = new Set([...sProfilem, ...medailonky]);
const osoba = (id: string) => data.lide.find((o) => o.id === id)!;

// Malá data pro pravidla: roky jen tolik, kolik pravidlo potřebuje.
const o = (id: string, od: number, do_: number, x: Partial<TOsoba> = {}) =>
  ({ id, jmeno: id, narozen: { rok: od }, zemrel: { rok: do_ }, obdobi: 1, ...x }) as TOsoba;
const lide = [o('a', -500, -430), o('ucitel', -540, -470), o('zak', -460, -380), o('soused', -480, -420), o('daleko', -300, -250), o('bezroku', 0, 0)];
lide[5] = { id: 'bezroku', jmeno: 'bezroku', obdobi: 1 } as TOsoba;

describe('polovina života a současnost', () => {
  it('počítá přes přelom letopočtu bez roku nula', () => {
    // 4 př. n. l. je astronomicky −3: polovina mezi −3 a 65
    expect(stredZivota(o('x', -4, 65))).toBe(31);
    expect(stredZivota({ id: 'y' })).toBeNull();
  });
  it('současníci jsou i ti, kdo se minuli o rok narození a smrti', () => {
    expect(zijiZaroven(o('x', -500, -430), o('y', -430, -400))).toBe(true);
    expect(zijiZaroven(o('x', -500, -430), o('y', -429, -400))).toBe(false);
  });
  it('vztah platí oběma směry', () => {
    expect(majiVztah('a', 'b', [{ od: 'b', k: 'a', typ: 'polemika' }])).toBe(true);
    expect(majiVztah('a', 'c', [{ od: 'b', k: 'a', typ: 'polemika' }])).toBe(false);
  });
});

describe('výchozí dvojice Dvou životů', () => {
  const vsichni = () => true;
  it('bere prvního učitele', () => {
    const v = [{ od: 'a', k: 'zak', typ: 'ucitel' as const }, { od: 'ucitel', k: 'a', typ: 'ucitel' as const }];
    expect(vychoziDvojice(lide[0], lide, v, vsichni)).toEqual({ id: 'ucitel', duvod: 'ucitel' });
  });
  it('bez učitele prvního žáka', () => {
    expect(vychoziDvojice(lide[0], lide, [{ od: 'a', k: 'zak', typ: 'ucitel' }], vsichni)).toEqual({ id: 'zak', duvod: 'zak' });
  });
  it('jiný vztah než učitel a žák nestačí: nejbližší současník se stránkou', () => {
    const v = [{ od: 'a', k: 'daleko', typ: 'znali-se' as const }];
    expect(vychoziDvojice(lide[0], lide, v, (id) => id !== 'ucitel')).toEqual({ id: 'soused', duvod: 'soucasnik' });
  });
  it('učitel bez roků a člověk stránky se přeskočí', () => {
    const v = [{ od: 'bezroku', k: 'a', typ: 'ucitel' as const }, { od: 'druha', k: 'a', typ: 'ucitel' as const }, { od: 'ucitel', k: 'a', typ: 'ucitel' as const }];
    const sDruhou = [...lide, o('druha', -500, -440)];
    expect(vychoziDvojice(lide[0], sDruhou, v, vsichni, new Set(['a', 'druha']))?.id).toBe('ucitel');
  });
  it('bez učitele a žáka koho osoba četla, a z nich nejbližšího v čase se stránkou', () => {
    const v = [
      { od: 'daleko', k: 'a', typ: 'vliv-textem' as const },
      { od: 'soused', k: 'a', typ: 'vliv-textem' as const },
      { od: 'ucitel', k: 'a', typ: 'vliv-textem' as const },
      { od: 'a', k: 'zak', typ: 'vliv-textem' as const },
    ];
    // soused (−450) je blíž než ucitel (−505) i daleko; bez stránky se přeskočí
    expect(vychoziDvojice(lide[0], lide, v, vsichni)).toEqual({ id: 'soused', duvod: 'cetl' });
    expect(vychoziDvojice(lide[0], lide, v, (id) => id !== 'soused')).toEqual({ id: 'ucitel', duvod: 'cetl' });
  });
  it('kdo četl ji, až když osoba nikoho se stránkou nečetla; vliv textem nepřebije učitele', () => {
    const v = [{ od: 'daleko', k: 'a', typ: 'vliv-textem' as const }, { od: 'a', k: 'zak', typ: 'vliv-textem' as const }];
    expect(vychoziDvojice(lide[0], lide, v, (id) => id !== 'daleko')).toEqual({ id: 'zak', duvod: 'ctenar' });
    expect(vychoziDvojice(lide[0], lide, [...v, { od: 'ucitel', k: 'a', typ: 'ucitel' }], vsichni)).toEqual({ id: 'ucitel', duvod: 'ucitel' });
  });
  it('polemika ani vliv textem bez stránky nestačí: současník', () => {
    const v = [{ od: 'daleko', k: 'a', typ: 'polemika' as const }, { od: 'ucitel', k: 'a', typ: 'vliv-textem' as const }];
    expect(vychoziDvojice(lide[0], lide, v, (id) => id !== 'ucitel')).toEqual({ id: 'soused', duvod: 'soucasnik' });
  });
  it('bez současníka nejbližší podle poloviny života', () => {
    expect(vychoziDvojice(lide[0], lide, [], (id) => id === 'daleko')).toEqual({ id: 'daleko', duvod: 'soucasnik' });
  });
  it('osoba bez roků dvojici nemá', () => {
    expect(vychoziDvojice(lide[5], lide, [], vsichni)).toBeNull();
  });
});

describe('druhý člověk Kdo žil dřív? na medailonku', () => {
  it('nejbližší známá osoba bez vztahu, jejíž život se nepřekrývá', () => {
    const v = [{ od: 'soused', k: 'a', typ: 'polemika' as const }];
    // zak (−460 až −380) s osobou (−500 až −430) žil; daleko ne
    expect(druhyKdoZilDriv(lide[0], lide, v, (id) => ['soused', 'zak', 'daleko'].includes(id))).toBe('daleko');
  });
  it('kdo nikoho, s kým se nepřekrývá, nemá, dostane nejbližšího i současníka', () => {
    expect(druhyKdoZilDriv(lide[0], lide, [], (id) => ['soused', 'zak'].includes(id))).toBe('soused');
  });
  it('při stejné vzdálenosti rozhoduje pořadí v datech', () => {
    const dva = [o('a', -500, -400), o('pred', -650, -530), o('po', -370, -250)];
    expect(druhyKdoZilDriv(dva[0], dva, [], () => true)).toBe('pred');
  });
  it('mezera pod dvacet let se nepočítá: „Dělí je asi 1 rok“ by byla past', () => {
    const tri = [o('a', -500, -400), o('tesne', -560, -501), o('dal', -360, -300)];
    expect(mezeraZivotu(tri[0], tri[1])).toBe(1);
    expect(mezeraZivotu(tri[0], o('spolu', -450, -350))).toBe(0);
    expect(druhyKdoZilDriv(tri[0], tri, [], () => true)).toBe('dal');
    expect(NEJMENSI_MEZERA).toBe(20);
  });
  it('plná osoba se přeskočí', () => {
    const dva = [o('a', -500, -400), o('pred', -650, -530), o('po', -370, -250)];
    expect(druhyKdoZilDriv(dva[0], dva, [], () => true, (id) => id === 'pred')).toBe('po');
  });
  it('bez známé osoby nic', () => expect(druhyKdoZilDriv(lide[0], lide, [], () => false)).toBeNull());
  it('přidělení pro všechny medailonky: každá známá osoba nejvýš třikrát, v pořadí dat', () => {
    const m = [o('m1', -300, -250), o('m2', -300, -250), o('m3', -300, -250), o('m4', -300, -250), o('m5', -300, -250)];
    const zname = [o('blizko', -400, -350), o('dal', -500, -420)];
    const d = druziKdoZilDriv(m, [...m, ...zname], [], (id) => id === 'blizko' || id === 'dal');
    expect([...d.values()]).toEqual(['blizko', 'blizko', 'blizko', 'dal', 'dal']);
    expect(NEJVIC_MEDAILONKU).toBe(3);
  });
});

describe('nabídka lidí', () => {
  it('nejdřív Doba a lidé, pak období, v nich podle začátku života; lidé stránky a bez roků ne', () => {
    const s = vyberDruhehoZivota(new Set(['a']), new Set(['zak']), [...lide, o('pozdni', 100, 160, { obdobi: 2 })], [
      { id: 2, nazev: 'Helenismus a Řím' }, { id: 1, nazev: 'Počátky a klasické Řecko' },
    ]);
    expect(s.map((x) => [x.nazev, x.lide.map((l) => l.id)])).toEqual([
      ['Z Doby a lidí', ['zak']],
      ['Období 1: Počátky a klasické Řecko', ['ucitel', 'soused', 'daleko']],
      ['Období 2: Helenismus a Řím', ['pozdni']],
    ]);
  });
});

describe('vzdálenost dvou žen', () => {
  it('žily, ne žili', () => {
    expect(vzdalenost(o('x', -400, -330, { zena: true }), o('y', -370, -300, { zena: true }))!.text).toBe('Žily současně 40\u00a0let.');
    expect(vzdalenost(o('x', -400, -330, { zena: true }), o('y', -370, -300))!.text).toBe('Žili současně 40\u00a0let.');
  });
});

describe('dvojice ve skutečných datech', () => {
  const stranky = data.lide.filter((x) => seStrankou.has(x.id));
  const zname = (id: string) => sProfilem.has(id);

  it.each(stranky.map((x) => [x.id, x] as const))('%s má výchozí dvojici s roky, jinou než lidé stránky', (id, x) => {
    const naStrance = new Set([id, ...(profily.find((p) => p.osoba === id)?.dalsi ?? [])]);
    const d = vychoziDvojice(x, data.lide, data.vztahy, (i) => seStrankou.has(i), naStrance);
    expect(d).not.toBeNull();
    expect(naStrance.has(d!.id)).toBe(false);
    expect(vzdalenost(x, osoba(d!.id))).not.toBeNull();
  });

  const druzi = druziKdoZilDriv(medailonky.map(osoba), data.lide, data.vztahy, zname);
  it.each(medailonky.map((id) => [id] as const))('medailonek %s má druhého člověka pro Kdo žil dřív?', (id) => {
    const b = druzi.get(id);
    expect(b).toBeTruthy();
    expect(sProfilem.has(b!)).toBe(true);
    expect(majiVztah(id, b!, data.vztahy)).toBe(false);
  });

  it('na medailoncích je známá osoba nejvýš třikrát a většinu dvojic dělí aspoň dvacet let', () => {
    const pocty = new Map<string, number>();
    for (const b of druzi.values()) pocty.set(b!, (pocty.get(b!) ?? 0) + 1);
    expect(Math.max(...pocty.values())).toBeLessThanOrEqual(NEJVIC_MEDAILONKU);
    const blizko = medailonky.filter((id) => (mezeraZivotu(osoba(id), osoba(druzi.get(id)!)) ?? 0) < NEJMENSI_MEZERA);
    expect(blizko.length).toBeLessThan(medailonky.length / 4);
  });

  it('současníci na mini ose jsou lidé s celým životem', () => {
    const s = soucasniciNaOse([osoba('sokrates')], data.lide, data.vztahy);
    expect(s.length).toBeGreaterThan(0);
    expect(s.length).toBeLessThanOrEqual(12);
    expect(s.every((x) => x.narozen && x.zemrel && x.id !== 'sokrates')).toBe(true);
  });

  it('výpis dvojic (VYPIS=1)', () => {
    if (!process.env.VYPIS) return;
    const radky: string[] = ['Dva životy (výchozí dvojice):'];
    for (const x of stranky) {
      const naStrance = new Set([x.id, ...(profily.find((p) => p.osoba === x.id)?.dalsi ?? [])]);
      const d = vychoziDvojice(x, data.lide, data.vztahy, (i) => seStrankou.has(i), naStrance)!;
      radky.push(`  ${x.jmeno} → ${osoba(d.id).jmeno} [${d.duvod}] ${vzdalenost(x, osoba(d.id))!.text}`);
    }
    radky.push('Kdo žil dřív? na medailoncích:');
    for (const id of medailonky) {
      const b = druzi.get(id)!;
      radky.push(`  ${osoba(id).jmeno} → ${osoba(b).jmeno}: ${vzdalenost(osoba(id), osoba(b))!.text}`);
    }
    console.log(radky.join('\n'));
  });
});
