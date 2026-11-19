// Karta Do hodiny (herna-v1, K5; kurikulum, odpověď 3): jedna otázka do dvojice a jedna pro celou třídu k cestě.
// Obsah je v src/content/do-hodiny/<slug cesty>.yaml, do posledního kroku cesty ji vloží jeden řádek <DoHodiny />.
// Je to lístek pro učitele: student ho vidí jen při promítání hodiny a v přípravě hodiny (Skladatel), jinak je
// na stránce skrytý. Katalog hodin ji zná jako zastavení (src/lib/hodiny.ts). Čisté funkce bez Astra.
import { z } from 'astro/zod';

const Text = z.string().trim().min(1);

/** Schéma souboru src/content/do-hodiny/<slug cesty>.yaml. */
export const DoHodiny = z
  .object({
    /** otázka do dvojice: co spolu dva studenti udělají nebo proberou (nejvýš dvě věty) */
    dvojice: Text.max(240),
    /** otázka pro celou třídu (nejvýš tři věty) */
    trida: Text.max(260),
  })
  .strict();

export type TDoHodiny = z.infer<typeof DoHodiny>;

export const NADTITULEK_DO_HODINY = 'Do hodiny';
export const POPISKY_DO_HODINY = { dvojice: 'Ve dvojici', trida: 'Celá třída' } as const;

/** Id karty a kotva na stránce: „cesta1-do-hodiny“ (stejný tvar jako „cesta1-moje-pravidlo“). */
export const idDoHodiny = (cisloCesty: number): string => `cesta${cisloCesty}-do-hodiny`;

/** Věty delší než 25 slov (CLAUDE.md › České konvence) v otázkách karty. */
export function dlouheVety(k: TDoHodiny): string[] {
  return [k.dvojice, k.trida]
    .flatMap((t) => t.split(/(?<=[.!?])\s+/))
    .filter((v) => v.split(/\s+/).filter(Boolean).length > 25);
}

/**
 * Chyby obsahu karet: soubor, který nepatří žádné cestě, a věta delší než 25 slov. Kontrola při sestavení
 * (katalog hodin a obal DoHodiny.astro) i v testu (tests/data/herna-k5.test.ts).
 */
export function chybyDoHodiny(karty: { id: string; data: TDoHodiny }[], cesty: { id: string }[]): string[] {
  const slugy = new Set(cesty.map((c) => c.id));
  const chyby: string[] = [];
  for (const k of karty) {
    if (!slugy.has(k.id)) chyby.push(`src/content/do-hodiny/${k.id}.yaml: žádná cesta nemá slug „${k.id}“.`);
    for (const v of dlouheVety(k.data)) chyby.push(`src/content/do-hodiny/${k.id}.yaml: věta má víc než 25 slov („${v.slice(0, 40)}…“).`);
  }
  return chyby;
}
