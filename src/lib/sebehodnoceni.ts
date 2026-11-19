// Sebehodnocení na konci cesty (herna-v1, K5; kurikulum, otázka 4 kontroly: „na konci sám posoudí, kam došel“).
// Dvě krátké nepovinné otázky pod Závěrem cesty, v každé cestě stejné (obal src/components/bloky/ZaverCesty.astro,
// ostrov src/components/ostrovy/Sebehodnoceni.svelte). Nic se nehodnotí ani nepočítá: zápis do deníku k poslednímu
// kroku cesty je jen to, co student o sobě napíše. Deník ho ukáže u cesty (zápisník) a v Moje filozofie
// pod odpověďmi Na začátku × Teď. Čisté funkce bez DOM. Texty bez rodu studenta.
import type { Zapis } from './denik';

export type CastSebehodnoceni = 'umim' | 'nejsem';

/** Otázky nad poli; v deníku před nimi stojí název cesty. */
export const OTAZKY_SEBEHODNOCENI: Record<CastSebehodnoceni, string> = {
  umim: 'Co už umím',
  // Bez rodu studenta („jistý“, „jistá“): ostatní texty atlasu rod studenta taky nenesou.
  nejsem: 'Co mi ještě není jasné',
};

/** Nadpis a věta nad poli (atlas-psani: řekne, k čemu to je, bez hodnocení). */
export const NADPIS_SEBEHODNOCENI = 'Kam tě cesta dovedla?';
export const UVOD_SEBEHODNOCENI = 'Dvě poznámky jen pro tebe, bez známky a bez správné odpovědi. Za pár týdnů je najdeš v deníku vedle svého pravidla.';

/** Id zápisu v deníku: „kdy-mam-dobry-duvod-verit-umim“ (slug cesty a část). */
export const idSebehodnoceni = (slug: string, cast: CastSebehodnoceni): string => `${slug}-${cast}`;

/** Kotva sebehodnocení na stránce posledního kroku. */
export const kotvaSebehodnoceni = (slug: string): string => `${slug}-sebehodnoceni`;

/** Otázka zápisu v deníku: název cesty a otázka („Kdy mám dobrý důvod věřit? Co už umím“). */
export const otazkaZapisu = (nazevCesty: string, cast: CastSebehodnoceni): string => `${nazevCesty} ${OTAZKY_SEBEHODNOCENI[cast]}`;

export interface SebehodnoceniCesty {
  umim?: string;
  nejsem?: string;
}

/** Co student o sobě k cestě napsal; prázdné zápisy se nepočítají. Nic nenapsal: null. */
export function sebehodnoceniZDeniku(zapisy: Pick<Zapis, 'id' | 'odpoved'>[], slug: string): SebehodnoceniCesty | null {
  const text = (cast: CastSebehodnoceni) => zapisy.find((z) => z.id === idSebehodnoceni(slug, cast))?.odpoved.trim() || undefined;
  const umim = text('umim');
  const nejsem = text('nejsem');
  if (!umim && !nejsem) return null;
  return { ...(umim ? { umim } : {}), ...(nejsem ? { nejsem } : {}) };
}
