// Texty sbírky citátů (denik-v2, K4), zvlášť od src/lib/sbirka.ts, aby je nůžky na každé stránce
// (src/scripts/vystrihnout.ts) načetly bez logiky deníku. Pracovní znění; učeše krok T (skill atlas-psani).
import { CITATY_NEJVYS } from './denik';

export const ADRESA_SBIRKY = '/denik/sbirka/';

/** Texty sbírky (pracovně; učeše krok T). */
export const TEXTY_SBIRKY = {
  nuzky: 'Vystřihnout do deníku',
  plna: `Sbírka je plná: drží ${CITATY_NEJVYS} citátů. Než vystřihneš další, vyndej některý ze sbírky.`,
  plnaOdkaz: 'Moje sbírka',
  plnaStranka: `Sbírka je plná (${CITATY_NEJVYS} citátů). Nůžky další citát nevystřihnou, dokud některý nevyndáš.`,
  nadpis: 'Moje sbírka.',
  pruh: 'Věty, které sis vystřihl.',
  perex: 'Citáty, u kterých ses na stránkách atlasu zastavil. Jen v tomhle prohlížeči.',
  prazdna: 'Zatím tu nic není. Citát vystřihneš nůžkami vpravo dole pod ním.',
  celaSbirka: 'Celá sbírka',
  vytisknout: 'Vytisknout',
  stahnout: 'Stáhnout jako text',
  vyndat: 'Vyndat ze sbírky',
  poznamka: 'Proč sis ho vystřihl?',
  ulozit: 'Uložit',
  zrusit: 'Zrušit',
  prepsat: 'Přepsat',
  hlavickaTextu: 'Moje sbírka citátů z Atlasu myšlení',
  procVTextu: 'Proč jsem si ho vystřihl:',
} as const;

