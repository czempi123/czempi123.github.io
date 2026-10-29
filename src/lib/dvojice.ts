// Dvojice lidí z dat pro prvky, které se skládají bez psaní textu (větev interaktivita-v1, krok K2):
// výchozí dvojice Dvou životů v Době a lidech, druhý člověk bloku Kdo žil dřív? na medailonku a seznam lidí,
// ze kterého student vybírá. Pravidla jsou pevná, ne náhodná: stránka je pokaždé stejná, takže drží testy
// i zastavení v přípravě hodiny (id bloku Kdo žil dřív? se skládá z obou id).
// Čisté funkce bez Astra a DOM; testy v tests/data/dvojice.test.ts.
import { naAstro, zivotOsoby } from './cas-mapy';
import { interval } from './casy';
import type { TOsoba, TVztah } from './schema';

type Osoba = Pick<TOsoba, 'id' | 'narozen' | 'zemrel' | 'aktivni'>;
type Vztah = Pick<TVztah, 'od' | 'k' | 'typ'>;

/** Polovina života v astronomických letech (bez roku nula), nebo null, když roky chybí. */
export function stredZivota(o: Osoba): number | null {
  const z = zivotOsoby(o);
  return z ? (naAstro(z.od) + naAstro(z.do)) / 2 : null;
}

/** Žili aspoň rok zároveň? (od narození do úmrtí včetně, jako na mapě) */
export function zijiZaroven(a: Osoba, b: Osoba): boolean {
  const za = zivotOsoby(a);
  const zb = zivotOsoby(b);
  return !!za && !!zb && Math.max(za.od, zb.od) <= Math.min(za.do, zb.do);
}

/** Mají spolu ve vztazích jakýkoli záznam (kterýmkoli směrem)? */
export function majiVztah(a: string, b: string, vztahy: Vztah[]): boolean {
  return vztahy.some((v) => (v.od === a && v.k === b) || (v.od === b && v.k === a));
}

/** Kandidáti seřazení podle vzdálenosti poloviny života od osoby; při shodě rozhoduje pořadí v lide.yaml. */
function nejblizsi<T extends Osoba>(osoba: Osoba, kandidati: T[]): T[] {
  const s = stredZivota(osoba);
  if (s === null) return [];
  return kandidati
    .map((o, i) => ({ o, i, d: stredZivota(o) }))
    .filter((x): x is { o: T; i: number; d: number } => x.d !== null)
    .sort((x, y) => Math.abs(x.d - s) - Math.abs(y.d - s) || x.i - y.i)
    .map((x) => x.o);
}

export interface VychoziDvojice {
  id: string;
  /** proč právě on: první učitel, první žák, nebo nejbližší současník se stránkou */
  duvod: 'ucitel' | 'zak' | 'soucasnik';
}

/**
 * Výchozí druhý život v Dvou životech: první učitel osoby z vztahy.yaml, pak první žák, jinak nejbližší
 * současník s vlastní stránkou (podle poloviny života; kdo s osobou nežil zároveň, přijde až za současníky).
 * Lidé stránky (`naStrance`, u společného profilu obě osoby) a lidé bez roků se nevybírají.
 */
export function vychoziDvojice(
  osoba: Osoba,
  lide: Osoba[],
  vztahy: Vztah[],
  maStranku: (id: string) => boolean,
  naStrance: Set<string> = new Set([osoba.id]),
): VychoziDvojice | null {
  if (!zivotOsoby(osoba)) return null;
  const podleId = new Map(lide.map((o) => [o.id, o]));
  const smiVedle = (id: string) => !naStrance.has(id) && !!podleId.get(id) && !!zivotOsoby(podleId.get(id)!);
  const ucitel = vztahy.find((v) => v.typ === 'ucitel' && v.k === osoba.id && smiVedle(v.od));
  if (ucitel) return { id: ucitel.od, duvod: 'ucitel' };
  const zak = vztahy.find((v) => v.typ === 'ucitel' && v.od === osoba.id && smiVedle(v.k));
  if (zak) return { id: zak.k, duvod: 'zak' };
  const seStrankou = lide.filter((o) => smiVedle(o.id) && maStranku(o.id));
  const poradi = nejblizsi(osoba, seStrankou);
  const soucasnik = poradi.find((o) => zijiZaroven(o, osoba)) ?? poradi[0];
  return soucasnik ? { id: soucasnik.id, duvod: 'soucasnik' } : null;
}

/**
 * Druhý člověk bloku Kdo žil dřív? na medailonku: osoba, kterou student zná (`znama`: má profil nebo portrét),
 * nejbližší podle poloviny života a bez vztahu s osobou stránky, aby otázka nebyla zjevná z Doby a lidí.
 */
export function druhyKdoZilDriv(osoba: Osoba, lide: Osoba[], vztahy: Vztah[], znama: (id: string) => boolean): string | null {
  const kandidati = lide.filter((o) => o.id !== osoba.id && znama(o.id) && !majiVztah(osoba.id, o.id, vztahy));
  return nejblizsi(osoba, kandidati)[0]?.id ?? null;
}

/**
 * Současníci na mini ose Doby a lidí: lidé s celým životem v datech, kteří žili zároveň s osobami stránky;
 * nejdřív ti, kdo k nim mají vztah, pak podle délky společného života, nejvýš `max`, seřazení podle narození.
 */
export function soucasniciNaOse<T extends Osoba>(osoby: Osoba[], lide: T[], vztahy: Vztah[], max = 12): T[] {
  const naStrance = new Set(osoby.map((o) => o.id));
  const n = Math.min(...osoby.map((o) => interval(o)![0]));
  const z = Math.max(...osoby.map((o) => interval(o)![1]));
  return lide
    .filter((o) => !naStrance.has(o.id) && o.narozen && o.zemrel)
    .map((o) => ({ o, i: interval(o)! }))
    .filter(({ i }) => i[0] <= z && i[1] >= n)
    .map((x) => ({
      ...x,
      vztah: vztahy.some((v) => (naStrance.has(v.od) && v.k === x.o.id) || (naStrance.has(v.k) && v.od === x.o.id)),
      spolecne: Math.min(z, x.i[1]) - Math.max(n, x.i[0]),
    }))
    .sort((a, b) => Number(b.vztah) - Number(a.vztah) || b.spolecne - a.spolecne)
    .slice(0, max)
    .sort((a, b) => a.i[0] - b.i[0])
    .map((x) => x.o);
}

export interface SkupinaVyberu<T> {
  /** popisek skupiny v nabídce: „Z Doby a lidí“, „Období 2: Helenismus a Řím“ */
  nazev: string;
  lide: T[];
}

/**
 * Lidé, ze kterých student v Dvou životech vybírá: nejdřív ti z Doby a lidí (vztahy a mini osa), pak ostatní
 * po obdobích. V každé skupině podle začátku života; lidé stránky a lidé bez roků v nabídce nejsou.
 */
export function vyberDruhehoZivota<T extends Osoba & { obdobi: number }>(
  naStrance: Set<string>,
  zDoby: Set<string>,
  lide: T[],
  obdobi: { id: number; nazev: string }[],
): SkupinaVyberu<T>[] {
  const zacatek = (o: T) => naAstro(zivotOsoby(o)!.od);
  const podleZacatku = (a: T, b: T) => zacatek(a) - zacatek(b);
  const smi = lide.filter((o) => !naStrance.has(o.id) && zivotOsoby(o));
  const skupiny: SkupinaVyberu<T>[] = [];
  const doba = smi.filter((o) => zDoby.has(o.id)).sort(podleZacatku);
  if (doba.length) skupiny.push({ nazev: 'Z Doby a lidí', lide: doba });
  for (const ob of [...obdobi].sort((a, b) => a.id - b.id)) {
    const v = smi.filter((o) => !zDoby.has(o.id) && o.obdobi === ob.id).sort(podleZacatku);
    if (v.length) skupiny.push({ nazev: `Období ${ob.id}: ${ob.nazev}`, lide: v });
  }
  return skupiny;
}
