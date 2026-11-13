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
  // Popisky na mapě: názvy krajin a „dnes“ (--ink-3 na pevnině), názvy moří a měřítko (--ink-2 na moři).
  ['ink-3', 'map-land'],
  ['ink-2', 'map-land'],
  ['ink-2', 'map-sea'],
  ['ink', 'map-sea'],
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
});
