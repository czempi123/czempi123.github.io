// Společné typy ostrovů bloků (předávají je obaly v src/components/bloky).
import type { StredRazitka } from '../../lib/razitko';

/** Co potřebuje razítko člověka ve Svelte (ui/RazitkoCloveka.svelte): totéž, co Astro verze čte z dat. */
export interface UdajeRazitka {
  id: string;
  jmeno: string;
  /** roky života jako na stránce („469–399 př. n. l.“) */
  roky: string;
  ikona?: string;
  /** název atributu (popisek pro čtečku) */
  atribut?: string;
  /** bez atributu: rodné město a rok narození */
  stred?: StredRazitka;
}
export interface ClovekBloku {
  jmeno: string;
  obdobi: number;
  /** id ikony atributu (mince) */
  ikona?: string;
  zena?: boolean;
  /** jak se strana Sporu jmenuje místo osoby („kynici“); razítko zůstává osoby */
  oznaceni?: string;
  /** razítko člověka; bez něj (strana Sporu jen s označením) prázdné razítko s vlnovkami */
  razitko?: UdajeRazitka;
}
export interface Dal {
  href: string;
  text: string;
}

/** Hlas ve hrách herny (Najdi slabé místo, Kdo by to řekl?): člověk, proč a citát s místem z dat. */
export interface HlasHerny {
  osoba: string;
  clovek: ClovekBloku;
  /** proč, jedna až dvě věty; často končí dvojtečkou a uvádí citát */
  proc: string;
  /** id citátu ze zdroje.yaml a údaje (autor, dílo, místo) pro nůžky (denik-v2, K4) */
  citat: { id: string; text: string; kde: string; udaje: string };
}
