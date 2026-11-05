// Velké otázky: adresa stránky, pořadí hlasů na časové ose a kontrola hlasů proti datům.
// Čisté funkce; data dodává Astro z kolekce otazky a z src/data (lide.yaml, zdroje.yaml).
import type { TOsoba } from './schema';
import { interval } from './casy';

export interface Hlas {
  /** id osoby v lide.yaml */
  osoba: string;
  /** jak by naložil s úvodním případem (jedna až dvě věty) */
  odpoved?: string;
  /** proč to tak viděl (2–4 věty, odstavce dělí prázdný řádek) */
  myslenka?: string;
  /** id citátu v zdroje.yaml (volitelně) */
  citat?: string;
  /** prameny věty (id v zdroje.yaml › prameny); pramen citátu se doplní sám */
  zdroje?: string[];
}

/** Otázka má vlastní stránku, jakmile má aspoň jeden hlas. */
export const maStranku = (o: { hlasy?: Hlas[] }) => (o.hlasy?.length ?? 0) > 0;

/** Stránka otázky, nebo (dokud ji otázka nemá) kotva v přehledu /otazky/. */
export const adresaOtazky = (id: string, o: { hlasy?: Hlas[] }) => (maStranku(o) ? `/otazka/${id}/` : `/otazky/#${id}`);

/** Klíče v deníku: první názor, odpověď na konci, stav „přeskočeno“ a volba na ose hlasů (stav bloku). */
export const klicOtazky = (id: string) => ({
  prvni: `otazka-${id}-prvni`,
  ted: `otazka-${id}-ted`,
  stav: `otazka-${id}`,
  osa: `otazka-${id}-osa`,
});

/** Hlasy seřazené podle začátku života (kdo žil dřív, je výš). Stejný rok drží pořadí zápisu. */
export function seradHlasy<H extends Hlas>(hlasy: H[], osoby: Map<string, Pick<TOsoba, 'narozen' | 'zemrel' | 'aktivni'>>): H[] {
  const zacatek = (h: H) => {
    const o = osoby.get(h.osoba);
    const i = o ? interval(o) : null;
    return i ? i[0] : Number.POSITIVE_INFINITY;
  };
  return hlasy.map((h, i) => ({ h, i })).sort((a, b) => zacatek(a.h) - zacatek(b.h) || a.i - b.i).map((x) => x.h);
}

/**
 * Chyby hlasů: neznámá osoba, neznámý citát nebo pramen, citát jiné osoby, osoba dvakrát.
 * Prázdný seznam = v pořádku. Sestavení stránky otázky se při chybě zastaví.
 */
export function chybyHlasu(
  otazka: string,
  hlasy: Hlas[],
  osoby: Map<string, unknown>,
  citaty: Map<string, { osoba?: string }>,
  prameny: Map<string, unknown> = new Map(),
): string[] {
  const chyby: string[] = [];
  const videno = new Set<string>();
  for (const h of hlasy) {
    if (!osoby.has(h.osoba)) chyby.push(`Otázka „${otazka}“: osoba „${h.osoba}“ není v lide.yaml.`);
    if (videno.has(h.osoba)) chyby.push(`Otázka „${otazka}“: osoba „${h.osoba}“ má dva hlasy.`);
    videno.add(h.osoba);
    for (const z of h.zdroje ?? []) {
      if (!prameny.has(z)) chyby.push(`Otázka „${otazka}“: pramen „${z}“ u osoby „${h.osoba}“ není v zdroje.yaml.`);
    }
    if (h.citat) {
      const c = citaty.get(h.citat);
      if (!c) chyby.push(`Otázka „${otazka}“: citát „${h.citat}“ není v zdroje.yaml.`);
      else if (c.osoba && c.osoba !== h.osoba) chyby.push(`Otázka „${otazka}“: citát „${h.citat}“ patří osobě „${c.osoba}“, ne „${h.osoba}“.`);
    }
  }
  return chyby;
}
