// Výtah člověka pro ostrov Dva životy (src/components/ostrovy/DvaZivoty.svelte). Stránka osoby nese jen osobu
// stránky, výchozí dvojici a id lidí v nabídce; jména a roky všech ostatních jsou ve sdíleném souboru
// /dva-zivoty.json (src/pages/dva-zivoty.json.ts), který prohlížeč stáhne jednou pro všechny stránky (revize R, otázka 4).
import type { TOsoba } from './schema';
import { zivot } from './casy';

export const ADRESA_DVA_ZIVOTY = '/dva-zivoty.json';

export function vytahZivota(o: TOsoba) {
  return {
    id: o.id, jmeno: o.jmeno, jmeno2: o.jmeno2, zena: o.zena, obdobi: o.obdobi,
    narozen: o.narozen, zemrel: o.zemrel, aktivni: o.aktivni, mista: [] as never[], zivotText: zivot(o),
  };
}
