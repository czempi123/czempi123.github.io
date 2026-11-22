// Sbírka vystřižených citátů (denik-v2, K4; plán › 3 a Formáty): údaje pod citátem, pořadí výstřižků, období
// stránky, odkud citát je, a sbírka jako text ke stažení. Čisté funkce bez DOM; ukládání v src/lib/denik.ts,
// nůžky v src/scripts/vystrihnout.ts, výstřižek src/components/denik/Vystrizek.svelte, stránka /denik/sbirka/.
import type { CitatVDeniku } from './denik';
import { TEXTY_SBIRKY } from './sbirka-texty';
import { adresaStranky } from './zapisnik';

export { TEXTY_SBIRKY, ADRESA_SBIRKY } from './sbirka-texty';

/** Adresa webu pro odkazy ve staženém textu. */
export const WEB_SBIRKY = 'https://czempi123.github.io';

/** Autor, dílo a místo, jak stojí pod citátem (Citat.astro) a jak se ukládají do sbírky. */
export function udajeCitatu(c: { autor: string; dilo: string; misto: string }): string {
  return `${c.autor}, ${c.dilo} ${c.misto}`.trim();
}

/** Výstřižky od nejnovějšího (podle chvíle vystřižení); stejná chvíle zachová pořadí v deníku. */
export function seradSbirku(citaty: readonly CitatVDeniku[]): CitatVDeniku[] {
  return citaty.map((c, i) => ({ c, i })).sort((a, b) => b.c.kdy.localeCompare(a.c.kdy) || a.i - b.i).map((x) => x.c);
}

/** Období stránky, odkud student citát vystřihl (barva papíru výstřižku); stránka bez období vrátí undefined. */
export function obdobiVystrizku(odkaz: string, obdobiStranek: Record<string, number | undefined>): number | undefined {
  return obdobiStranek[adresaStranky(odkaz)];
}

const dvojmistne = (n: number) => String(n).padStart(2, '0');
/** Místní datum RRRR-MM-DD. */
export const mistniDen = (d: Date) => `${d.getFullYear()}-${dvojmistne(d.getMonth() + 1)}-${dvojmistne(d.getDate())}`;
/** Datum, jak se píše česky: „22. 11. 2026“. */
export const ceskeDatum = (d: Date) => `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;

/** Jméno staženého souboru: atlas-citaty-RRRR-MM-DD.txt (místní datum). */
export function souborSbirky(kdy: Date): string {
  return `atlas-citaty-${mistniDen(kdy)}.txt`;
}

/** Sbírka jako text (plán › Formáty): hlavička s datem, pak výstřižky od nejnovějšího, mezi nimi prázdný řádek. */
export function sbirkaJakoText(citaty: readonly CitatVDeniku[], kdy: Date): string {
  const radky = [`${TEXTY_SBIRKY.hlavickaTextu} (${ceskeDatum(kdy)})`];
  for (const c of seradSbirku(citaty)) {
    const text = c.text.replace(/\u00a0/g, ' ').trim();
    const blok = [`„${text}“`, c.kde.replace(/\u00a0/g, ' ')];
    if (c.poznamka?.trim()) blok.push(`${TEXTY_SBIRKY.procVTextu} ${c.poznamka.trim()}`);
    blok.push(`${WEB_SBIRKY}${c.odkaz.startsWith('/') ? c.odkaz : `/${c.odkaz}`}`);
    radky.push('', ...blok);
  }
  return `${radky.join('\n')}\n`;
}
