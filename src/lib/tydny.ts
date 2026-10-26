// Týden cvičení (Stoický týden, docs/plany/stoicky-tyden.md): kontrola dat, který den otevřít a počet hotových dnů.
// Čisté funkce bez DOM a Astra; stránka src/pages/tyden/[tyden].astro, ostrov src/components/ostrovy/Tyden.svelte,
// deník src/lib/denik.ts (pole tydny), testy tests/data/tydny.test.ts.
import type { TTyden } from './tydny-schema';

/** Adresa stránky týdne. */
export const adresaTydne = (id: string): string => `/tyden/${id}/`;

/** Id výzvy, kterou je týden přijatý do deníku (tyden-stoicky); karty Zkus to žít mají id bez předpony. */
export const idVyzvyTydne = (id: string): string => `tyden-${id}`;

/** Kotva dne na stránce týdne (#den-3). */
export const kotvaDne = (cislo: number): string => `den-${cislo}`;

/** Id citátů týdne v pořadí, jak na stránce stojí: námitka nahoře, pak dny. Opakování zůstávají. */
export function citatyTydne(t: Pick<TTyden, 'namitka' | 'dny'>): string[] {
  return [t.namitka.citat, ...t.dny.map((d) => d.citat)].filter((c): c is string => !!c);
}

/**
 * Chyby v datech týdne: dny číslované 1…N bez mezery, citáty a prameny v zdroje.yaml, osoby v lide.yaml,
 * tentýž citát v týdnu nejvýš dvakrát (docs/pouceni.md › Celek), psaní nejvýš v jednom dni.
 * Prázdný seznam znamená v pořádku; sestavení se při chybě zastaví.
 */
export function kontrolaTydne(
  id: string,
  t: TTyden,
  znam: { citaty: Set<string>; prameny: Set<string>; osoby: Set<string> },
): string[] {
  const chyby: string[] = [];
  t.dny.forEach((d, i) => {
    if (d.cislo !== i + 1) chyby.push(`Týden „${id}“: den na místě ${i + 1} má číslo ${d.cislo}.`);
    if (!znam.osoby.has(d.osoba)) chyby.push(`Týden „${id}“, den ${d.cislo}: osoba „${d.osoba}“ není v lide.yaml.`);
    if (d.poCitatu && !d.citat) chyby.push(`Týden „${id}“, den ${d.cislo}: text za citátem bez citátu.`);
  });
  for (const c of citatyTydne(t)) {
    if (!znam.citaty.has(c)) chyby.push(`Týden „${id}“: citát „${c}“ není v zdroje.yaml.`);
  }
  for (const p of t.zdroje) {
    if (!znam.prameny.has(p)) chyby.push(`Týden „${id}“: pramen „${p}“ není v zdroje.yaml.`);
  }
  for (const [c, n] of pocetCitatu(citatyTydne(t))) {
    if (n > 2) chyby.push(`Týden „${id}“: citát „${c}“ zazní ${n}krát, smí nejvýš dvakrát.`);
  }
  if (t.dny.filter((d) => d.psani).length > 1) chyby.push(`Týden „${id}“: psaní smí mít nejvýš jeden den.`);
  return chyby;
}

/** Kolikrát který citát zazní. */
export function pocetCitatu(ids: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of ids) m.set(c, (m.get(c) ?? 0) + 1);
  return m;
}

/** Hotové dny bez opakování, seřazené, jen 1…pocet. */
export function cisteDny(dny: unknown, pocet = Number.POSITIVE_INFINITY): number[] {
  if (!Array.isArray(dny)) return [];
  return [...new Set(dny.filter((x): x is number => Number.isInteger(x) && x >= 1 && x <= pocet))].sort((a, b) => a - b);
}

/** Hotové dny po označení (hotovo = true) nebo zrušení (false) jednoho dne. Vrací nový seznam. */
export function oznacDen(hotove: number[], den: number, hotovo: boolean): number[] {
  const bez = hotove.filter((x) => x !== den);
  return cisteDny(hotovo ? [...bez, den] : bez);
}

/**
 * Který den otevřít, když student přijde: den, na kterém skončil (`den` z deníku), jinak den po posledním hotovém,
 * jinak první nehotový; nový student den 1. Vynechaný den se nikde nepočítá a nic se kvůli němu nemění.
 */
export function denKOtevreni(stav: { hotove?: number[]; den?: number } | undefined, pocet: number): number {
  const den = stav?.den;
  if (Number.isInteger(den) && den! >= 1 && den! <= pocet) return den!;
  const hotove = cisteDny(stav?.hotove, pocet);
  if (!hotove.length) return 1;
  const posledni = hotove[hotove.length - 1];
  if (posledni < pocet) return posledni + 1;
  for (let i = 1; i <= pocet; i++) if (!hotove.includes(i)) return i;
  return pocet;
}

/** Předložka před číslem: „ze“ před 2, 3, 4, 6, 7 (ze dvou, tří, čtyř, šesti, sedmi) a 12–14, 16, 17, jinak „z“. */
export function zZe(n: number): 'z' | 'ze' {
  return [2, 3, 4, 6, 7, 12, 13, 14, 16, 17].includes(n) ? 'ze' : 'z';
}

/** „Hotové dny: 3 ze 7“. Bez procent, bez pořadí; nula je „zatím žádný“. */
export function hotoveDnyText(hotove: number, pocet: number): string {
  return hotove === 0 ? 'Hotové dny: zatím žádný' : `Hotové dny: ${hotove}\u00a0${zZe(pocet)}\u00a0${pocet}`;
}
