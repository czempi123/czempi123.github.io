// Texty sbírky citátů (denik-v2, K4), zvlášť od src/lib/sbirka.ts, aby je nůžky na každé stránce
// (src/scripts/vystrihnout.ts) načetly bez logiky deníku. Znění z kroku T (skill atlas-psani); tvary bez rodu, kde to jde.
import { CITATY_NEJVYS } from './denik';

export const ADRESA_SBIRKY = '/denik/sbirka/';

/** Texty sbírky. */
export const TEXTY_SBIRKY = {
  nuzky: 'Vystřihnout do deníku',
  plna: `Do sbírky se vejde ${CITATY_NEJVYS} citátů a teď je plná. Než vystřihneš další, některý z ní vyndej:`,
  plnaOdkaz: 'Moje sbírka',
  plnaStranka: `Sbírka je plná, vejde se do ní ${CITATY_NEJVYS} citátů. Nůžky další nevystřihnou, dokud některý nevyndáš.`,
  nadpis: 'Moje sbírka.',
  pruh: 'Věty, které tě zastavily.',
  perex: 'Citáty z celého atlasu pohromadě, nejnovější nahoře. Ke každému si můžeš připsat, co pro tebe znamená, a celou sbírku vytisknout nebo stáhnout jako text.',
  prazdna: 'Zatím tu nic není. Až tě v atlasu nějaká věta zastaví, vystřihni ji nůžkami pod citátem.',
  celaSbirka: 'Celá sbírka',
  vytisknout: 'Vytisknout',
  stahnout: 'Stáhnout jako text',
  vyndat: 'Vyndat ze sbírky',
  poznamka: 'Proč zrovna tenhle?',
  ulozit: 'Uložit',
  zrusit: 'Zrušit',
  prepsat: 'Přepsat',
  hlavickaTextu: 'Moje sbírka citátů z Agory',
  procVTextu: 'Proč zrovna tenhle:',
} as const;

