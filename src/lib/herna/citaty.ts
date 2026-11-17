// Kdo to řekl? (herna-v1, K1): možnosti k citátu, odkud věta je, stav série karet v deníku.
// Citáty jen ze src/data/zdroje.yaml; ostrov src/components/ostrovy/KdoToRekl.svelte, testy tests/data/herna.test.ts.
import { zamichej } from './michani';

/** Správná osoba a ostatní v pořadí podle semínka (id bloku a citátu): stejné při sestavení i po obnovení. */
export function moznostiCitatu(spravna: string, jini: readonly string[], klic: string): string[] {
  return zamichej([spravna, ...jini.filter((j) => j !== spravna)], klic);
}

/**
 * Odkud věta je, pod jménem na rubu karty: „Rukojeť 5“, když dílo napsal mluvčí sám, jinak
 * „Zapsal Platón: Obrana Sókratova 38a“ (mluví postava dialogu, zlomek u pozdějšího autora).
 */
export function puvodCitatu(c: { autor: string; dilo: string; misto: string }, jmeno: string): string {
  const kde = `${c.dilo} ${c.misto}`;
  return c.autor === jmeno ? kde : `Zapsal ${c.autor}: ${kde}`;
}

export interface ZaznamCitatu { citat: string; jini: string[] }
interface CitatDat { osoba?: string; cesky: string }

/** Chyby karet: citát není v datech nebo nemá osobu, možnost není v datech, mezi ostatními je správná osoba, opakování. */
export function chybyKdoRekl(karty: readonly ZaznamCitatu[], citaty: Map<string, CitatDat>, osoby: Set<string>): string[] {
  const chyby: string[] = [];
  const videno = new Set<string>();
  for (const k of karty) {
    const c = citaty.get(k.citat);
    if (!c) { chyby.push(`Kdo to řekl?: citát „${k.citat}“ není v zdroje.yaml.`); continue; }
    if (!c.osoba) chyby.push(`Kdo to řekl?: citát „${k.citat}“ nemá osobu, nejde hádat, čí je.`);
    if (videno.has(k.citat)) chyby.push(`Kdo to řekl?: citát „${k.citat}“ je v sérii dvakrát.`);
    videno.add(k.citat);
    for (const j of k.jini) if (!osoby.has(j)) chyby.push(`Kdo to řekl?: osoba „${j}“ není v lide.yaml.`);
    if (c.osoba && k.jini.includes(c.osoba)) chyby.push(`Kdo to řekl?: u „${k.citat}“ je mezi ostatními i ten, kdo větu řekl.`);
    if (new Set(k.jini).size !== k.jini.length) chyby.push(`Kdo to řekl?: u „${k.citat}“ se možnost opakuje.`);
  }
  return chyby;
}

/** Stav série v deníku: běžící karta a tipy u každé karty (id osob v pořadí, jak je student zkusil). */
export interface StavKdoRekl {
  karta: number;
  tipy: string[][];
}

export const vyresena = (tipy: readonly string[] | undefined, spravna: string): boolean => !!tipy && tipy.includes(spravna);

/** Hotová série: každá karta má mezi tipy správnou osobu. */
export function hotovaSerie(s: StavKdoRekl, spravne: readonly string[]): boolean {
  return spravne.every((o, i) => vyresena(s.tipy[i], o));
}

/** Uložený stav, jen když sedí na karty a jejich možnosti; jinak null. */
export function platnyStavKdoRekl(s: unknown, karty: readonly { moznosti: readonly string[] }[]): StavKdoRekl | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavKdoRekl>;
  if (!Number.isInteger(o.karta) || (o.karta as number) < 0 || (o.karta as number) >= karty.length) return null;
  if (!Array.isArray(o.tipy) || o.tipy.length !== karty.length) return null;
  const tipy = o.tipy.map((t, i) => (Array.isArray(t) ? [...new Set(t.filter((x): x is string => typeof x === 'string' && karty[i].moznosti.includes(x)))] : []));
  return { karta: o.karta as number, tipy };
}
