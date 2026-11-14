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
