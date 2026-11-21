// Tipni si (herna-v1, K2): odhad na pravítku v lidských životech, ne v letech. Kolik lidských životů (po 75 letech,
// LIDSKY_ZIVOT z časové logiky mapy) je mezi dvěma lidmi; 0 znamená, že se jejich životy překrývají. Vzdálenost
// počítá vzdalenost() v src/lib/cas-mapy.ts, tatáž jako v Dvou životech a v Kdo žil dřív?.
// Čisté funkce; ostrov src/components/ostrovy/TipniSi.svelte, testy tests/data/herna.test.ts.
import { LIDSKY_ZIVOT, type Vzdalenost } from '../cas-mapy';
import { verdikt, type Verdikt } from './verdikt';

/** Kolik špatných odhadů, než se nabídne „Ukázat, jak to bylo“. */
export const ODHADU_DO_UKAZANI = 2;

/** Lidské životy mezi dvěma lidmi: 0, když žili současně; jinak roky mezi nimi / 75 (desetinné). */
export function zivotuMezi(v: Pick<Vzdalenost, 'druh' | 'let'>): number {
  return v.druh === 'soucasne' ? 0 : v.let / LIDSKY_ZIVOT;
}

/** Délky pravítka (v životech). Konec se volí podle odpovědi, ale s rezervou, aby konec stupnice odpověď neprozradil. */
export const DELKY_PRAVITKA = [6, 10, 15, 20, 30, 40];

export function delkaPravitka(zivotu: number, vlastni?: number): number {
  if (vlastni) return vlastni;
  return DELKY_PRAVITKA.find((d) => d >= zivotu * 1.4 + 2) ?? Math.ceil(zivotu * 1.5);
}

/**
 * Odhad sedí, když je v rozumném rozpětí: u současníků jen 0 („mohli se potkat“), jinak nejvýš o jeden život
 * nebo o čtvrtinu vedle, podle toho, co je víc (pouceni: mez větší než nejistota roků „asi“). Žádné body.
 */
export function sediOdhad(odhad: number, zivotu: number): boolean {
  if (zivotu === 0) return odhad === 0;
  if (odhad === 0) return false;
  return Math.abs(odhad - zivotu) <= Math.max(1, zivotu * 0.25);
}

/** Verdikt odhadu; u „zkus to jinak“ jedna věta, kterým směrem hledat. */
export function verdiktOdhadu(odhad: number, zivotu: number): Verdikt {
  if (sediOdhad(odhad, zivotu)) return verdikt(true);
  if (zivotu === 0) return verdikt(false, 'Podívej se, jestli se jejich životy nepřekrývají.');
  if (odhad === 0) return verdikt(false, 'Jejich životy se nepotkaly: něco mezi nimi je.');
  return verdikt(false, odhad < zivotu ? 'Je jich víc, než myslíš.' : 'Je jich míň, než myslíš.');
}

const SLOVA = ['nula', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset'];

/** Popis polohy jezdce pro čtečku i pod pravítkem: „mohli se potkat“, „jeden lidský život“, „dvanáct lidských životů“. */
export function popisOdhadu(n: number, zeny = false): string {
  if (n === 0) return zeny ? 'mohly se potkat' : 'mohli se potkat';
  const s = SLOVA[n] ?? String(n);
  if (n === 1) return 'jeden lidský život';
  if (n >= 2 && n <= 4) return `${s} lidské životy`;
  return `${s} lidských životů`;
}

/** Stav bloku v deníku: poslední odhad, odhady, které student zkontroloval, a jestli je hotovo (sedí, nebo ukázáno). */
export interface StavOdhadu {
  odhad: number;
  pokusy: number[];
  hotovo: boolean;
  ukazano: boolean;
}

export function platnyStavOdhadu(s: unknown, delka: number): StavOdhadu | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavOdhadu>;
  const vMezich = (x: unknown): x is number => Number.isInteger(x) && (x as number) >= 0 && (x as number) <= delka;
  if (!vMezich(o.odhad)) return null;
  const pokusy = Array.isArray(o.pokusy) ? o.pokusy.filter(vMezich) : [];
  return { odhad: o.odhad, pokusy, hotovo: o.hotovo === true, ukazano: o.ukazano === true };
}
