// Kontrast tokenů (docs/design.md, Přístupnost; docs/plany/design-v2.md › Po K1): WCAG AA 4,5 : 1 pro text
// a 3 : 1 pro hranice tužkou, ve dne i v nočním zápisníku. Stránky navíc kontroluje axe v Playwrightu
// (tests/e2e/prohlidka.spec.ts).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(import.meta.dirname, '../../src/styles/tokens.css'), 'utf8');
function tokeny(blok: string): Record<string, string> {
  return Object.fromEntries([...blok.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
}
const od = (vzor: string) => css.indexOf(vzor);
const den = tokeny(css.slice(od(':root {'), od('@media (max-width')));
// Noc mění jen část tokenů; papír období a text na něm zůstávají z denního bloku.
const noc = { ...den, ...tokeny(css.slice(od(":root[data-theme='dark']"), od('@media print'))) };

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const kontrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// Razítko místa a razítko člověka (K3) mají průhlednost 0,96 (global.css): počítá se barva smíchaná s papírem pod ním.
const smichat = (a: string, b: string, podil: number) =>
  '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * podil + parseInt(b.slice(i, i + 2), 16) * (1 - podil)).toString(16).padStart(2, '0')).join('');

const PLOCHY = ['papir', 'list', 'plocha', 'listek'];
const TEXT: [string, string][] = [
  ...['ink', 'ink-2', 'ruka', 'ink-3'].flatMap((t) => PLOCHY.map((p): [string, string] => [t, p])),
  ['na-inkoustu', 'ink'],
  // Rám (K2): Můj deník a klávesa / na malé vystouplé ploše, „Ukázat možnosti“ v liště hodiny po najetí.
  ['ink', 'plocha-m'],
  ['ink-2', 'plocha-m'],
  ['na-inkoustu', 'ink-2'],
  // Popisky na mapě (K7a: mapa jako výstřižek): kraje (--ink-3) na pevnině z lístkového papíru, moře a měřítko
  // (--ink-2) na listu; pevnina a moře jsou plochy listek a list, takže je kryjí dvojice PLOCHY výš.
  ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((n): [string, string][] => [
    [`p-${n}`, 'papir'],
    [`p-${n}`, 'list'],
    [`p-${n}`, 'listek'],
    // Stránky osob (K3): počet kroků v pahýlu lístku cesty na vystouplé ploše.
    [`p-${n}`, 'plocha'],
    ['na-papiru', `pp-${n}`],
    // Desky a tinty období zůstávají do K3 až K7 (přezdívky v tokens.css).
    [`period-${n}-on-plate`, `period-${n}-plate`],
    ['ink', `period-${n}-tint`],
    ['ink-2', `period-${n}-tint`],
    ['muted', `period-${n}-tint`],
  ]),
  ...['muted'].flatMap((t) => PLOCHY.map((p): [string, string] => [t, p])),
  // Studentova ruka (K4a, bod 3): text v poli, zvolené písmeno a kroužek, pera v deníku, na všech plochách.
  ...['pero-modra', 'pero-fialova', 'pero-sepiova'].flatMap((t) => PLOCHY.map((p): [string, string] => [t, p])),
  // Červená tužka (D5, Najdi slabé místo): tah a věta na listu argumentu.
  ['cervena-tuzka', 'list'],
];
const HRANICE: [string, string][] = PLOCHY.map((p) => ['tuzka', p]);

describe.each([['den', den], ['noc', noc]])('kontrast tokenů · %s', (_, t) => {
  it.each(TEXT)('%s na %s splňuje AA pro text', (popredi, pozadi) => {
    expect(t[popredi], popredi).toBeDefined();
    expect(t[pozadi], pozadi).toBeDefined();
    expect(kontrast(t[popredi], t[pozadi])).toBeGreaterThanOrEqual(4.5);
  });
  it.each(HRANICE)('%s na %s má 3 : 1 jako hranice', (popredi, pozadi) => {
    expect(kontrast(t[popredi], t[pozadi])).toBeGreaterThanOrEqual(3);
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => ['papir', 'list', 'listek'].map((p): [number, string] => [n, p])))(
    'razítko místa období %i na %s (průhlednost 0,96) splňuje AA',
    (n, p) => {
      expect(kontrast(smichat(t[`p-${n}`], t[p], 0.96), t[p])).toBeGreaterThanOrEqual(4.5);
    },
  );
  // Citát se zastrčeným rohem (K3 dodatek, Citat.astro › citat--roh): kapsička 78 % inkoustu období na listu
  // je ozdoba, ale má být vidět ve dne i v noci jako hranice (3 : 1).
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('kapsička rohu citátu období %i na listu má 3 : 1', (n) => {
    expect(kontrast(smichat(t[`p-${n}`], t.list, 0.78), t.list)).toBeGreaterThanOrEqual(3);
  });
  // Vnořený citát jako lepicí lístek v barvě období (K3, Citat.astro): lístek tónovaný 16 % papíru období,
  // lepicí proužek o 14 % víc; text a podpis v --ink a --ink-2.
  it.each([1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => ['ink', 'ink-2'].map((x): [number, string] => [n, x])))(
    'lepicí lístek období %i: %s splňuje AA i na lepicím proužku',
    (n, x) => {
      const listek = smichat(t[`pp-${n}`], t.listek, 0.16);
      const prouzek = smichat(t[`pp-${n}`], listek, 0.14);
      expect(kontrast(t[x], listek)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(t[x], prouzek)).toBeGreaterThanOrEqual(4.5);
    },
  );
  // Zpětná vazba bloku uvnitř čistého listu (K4b, global.css › Rám aktivity): lepicí lístek 12 % papíru období, na něm
  // i studentovo pero (důvod, Předtím → Teď, vlastní karta) a tisk; i na lepicím proužku.
  it.each([1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => ['pero-modra', 'pero-fialova', 'pero-sepiova', 'ink-2'].map((x): [number, string] => [n, x])))(
    'lepicí lístek zpětné vazby období %i: %s splňuje AA i na lepicím proužku',
    (n, x) => {
      const listek = smichat(t[`pp-${n}`], t.listek, 0.12);
      const prouzek = smichat(t[`pp-${n}`], listek, 0.14);
      expect(kontrast(t[x], listek)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(t[x], prouzek)).toBeGreaterThanOrEqual(4.5);
    },
  );
  // Rám aktivity K4b: tečka zodpovězené podmínky (Změň jednu věc) na malém vystouplém čipu, štítek „jedna věc jinak“.
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('inkoust období %i na malé vystouplé ploše splňuje AA', (n) => {
    expect(kontrast(t[`p-${n}`], t['plocha-m'])).toBeGreaterThanOrEqual(4.5);
  });
  // K6: záložky oddílů na okraji stránky období a záložka otázky v deníku mají nahoře odlesk 4 % bílé.
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('text na záložce v papíru období %i splňuje AA i v odlesku', (n) => {
    expect(kontrast(t['na-papiru'], smichat('#ffffff', t[`pp-${n}`], 0.04))).toBeGreaterThanOrEqual(4.5);
  });
  // K7a, Mapa a čas: název moře (--ink-2) i na čáře šrafování (tužka 38 % na listu); štítek malého pásu období
  // (text pro papír období na plném papíru) aspoň 5 : 1, jak hlídá i test v prohlížeči.
  it('název moře na šrafě tužkou splňuje AA', () => {
    expect(kontrast(t['ink-2'], smichat(t.tuzka, t.list, 0.38))).toBeGreaterThanOrEqual(4.5);
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('štítek malého pásu období %i má aspoň 5 : 1', (n) => {
    expect(kontrast(t['na-papiru'], t[`pp-${n}`])).toBeGreaterThanOrEqual(5);
  });
  // K7b, kresby jako koláž (global.css › Kresba s pohybem): tóny k-stin a k-tma jsou z tužky a černé, světlý popisek
  // (text pro papír období) na nich splňuje AA; šedý papír od černého a hrana skla tužkou mají 3 : 1;
  // nositel barvy období (k-pp = inkoust období) je na tečkovaném papíře vidět ve dne i v noci.
  it('kresby: světlý popisek na tmavém a šedém papíře, šedý od černého, hrana tužkou', () => {
    const tma = smichat(t.tuzka, '#000000', 0.25);
    const stin = smichat(t.tuzka, tma, 0.78);
    expect(kontrast(t['na-papiru'], tma)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(t['na-papiru'], stin)).toBeGreaterThanOrEqual(4.5);
    expect(kontrast(stin, tma)).toBeGreaterThanOrEqual(3);
    expect(kontrast(t.tuzka, tma)).toBeGreaterThanOrEqual(3);
    expect(kontrast(stin, t.papir)).toBeGreaterThanOrEqual(3);
  });
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('kresby: nositel barvy období %i na tečkovaném papíře má 3 : 1', (n) => {
    expect(kontrast(t[`p-${n}`], t.papir)).toBeGreaterThanOrEqual(3);
  });
  // Krok P, pojem (Pojem.astro): poznámka rukou na okraji leží na tečkovaném papíře (text přes tečku --tecka),
  // po najetí na lístku; nadpis pojmu a „Celý pojem“ inkoustem, text lístku --ink-2; vlnovka tužkou je hranice
  // na listu i na lístku (3 : 1), po najetí inkoustem.
  it('pojem: poznámka na okraji, lístek a vlnovka', () => {
    for (const [popredi, pozadi] of [['ruka', 'papir'], ['ruka', 'tecka'], ['ink', 'papir'], ['ink', 'listek'], ['ink-2', 'listek'], ['ink', 'list']]) {
      expect(kontrast(t[popredi], t[pozadi]), `${popredi} na ${pozadi}`).toBeGreaterThanOrEqual(4.5);
    }
    for (const pozadi of ['list', 'listek', 'papir']) expect(kontrast(t.tuzka, t[pozadi]), `tužka na ${pozadi}`).toBeGreaterThanOrEqual(3);
  });
});
