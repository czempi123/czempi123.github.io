// Cesty: pořadí kroků a navazující odkazy. Čisté funkce; data dodává Astro z kolekcí cesty a kroky.

export interface KrokInfo {
  cesta: string;
  krok: number;
  nazev: string;
}

/** Kroky jedné cesty seřazené; zastaví sestavení, když číslování není 1…n bez mezer. */
export function krokyCesty<T extends KrokInfo>(vse: T[], slug: string): T[] {
  const k = vse.filter((x) => x.cesta === slug).sort((a, b) => a.krok - b.krok);
  k.forEach((x, i) => {
    if (x.krok !== i + 1) throw new Error(`Cesta „${slug}“: kroky musí být číslované 1…${k.length} bez mezer (chybí ${i + 1}).`);
  });
  return k;
}

export const adresaKroku = (slug: string, n: number) => `/cesta/${slug}/${n}/`;
export const adresaCesty = (slug: string) => `/cesta/${slug}/`;

/** Rozpozná stránku kroku z adresy: /cesta/<slug>/<n>/ → { slug, n }. */
export function krokZAdresy(cesta: string): { slug: string; n: number } | null {
  const m = cesta.match(/^\/cesta\/([a-z0-9-]+)\/(\d+)\/?$/);
  return m ? { slug: m[1], n: Number(m[2]) } : null;
}

/** Bloky, které po odpovědi zapisují do deníku; jen takový může být začátkem cesty. */
const BLOKY_SE_ZAPISEM = 'Volba|Odkryj|Roztrid|ZmenJednuVec|Spor';

export interface ZacatekCesty {
  /** krok, ve kterém blok stojí */
  krok: number;
  nazev: string;
}

/**
 * Začátek cesty (pole `zacatek` v přehledu cesty): blok, ve kterém student poprvé sám odpověděl.
 * Hledá ho v textu kroků (`<Volba id="…" />`) a vrátí krok, ve kterém stojí. Zastaví sestavení, když blok
 * v cestě není, do deníku nezapisuje, nebo stojí až v posledním kroku (tam je závěrečné pravidlo).
 */
export function zacatekCesty<T extends KrokInfo & { body?: string }>(kroky: T[], slug: string, zacatek: string): ZacatekCesty {
  const serazene = krokyCesty(kroky, slug);
  const vzor = new RegExp(`<(?:${BLOKY_SE_ZAPISEM})\\b[^>]*\\bid=["']${zacatek}["']`);
  const k = serazene.find((x) => vzor.test(x.body ?? ''));
  if (!k) {
    throw new Error(
      `Cesta „${slug}“: blok „${zacatek}“ z pole zacatek nestojí v žádném jejím kroku, nebo do deníku nic nezapisuje (smí to být Volba, Odkryj, Roztřiď, Změň jednu věc nebo Spor).`,
    );
  }
  if (k.krok === serazene.length) throw new Error(`Cesta „${slug}“: blok „${zacatek}“ stojí až v posledním kroku; začátek cesty musí být dřív.`);
  return { krok: k.krok, nazev: k.nazev };
}

/** „Kam dál“ z kroku: další krok, nebo na konci dokončení cesty. */
export function dalsiKrok(kroky: KrokInfo[], slug: string, n: number): { href: string; text: string } | null {
  const k = kroky.filter((x) => x.cesta === slug);
  if (!k.length) return null;
  const dalsi = k.find((x) => x.krok === n + 1);
  if (dalsi) return { href: adresaKroku(slug, dalsi.krok), text: `Další krok: ${dalsi.nazev}` };
  return { href: `${adresaCesty(slug)}#hotovo`, text: 'Dokončit cestu' };
}

/**
 * Pořadí, ve kterém Kam dál hotové cesty nabízí „Další cestu“ (revize antiky, O, nález 9): nejdřív další cesty
 * téže velké otázky (po této, pak před ní), potom ostatní podle katalogu od téhle dál a znovu od začátku.
 * Kterou z nich student opravdu uvidí, vybere stránka podle deníku: první, kterou ještě nemá hotovou.
 */
export function poradiDalsichCest<C extends { slug: string; cislo: number; otazka: number; nenabizet?: string[] }>(slug: string, cesty: C[]): C[] {
  const tato = cesty.find((c) => c.slug === slug);
  if (!tato) return [];
  const ostatni = cesty.filter((c) => c.slug !== slug && !tato.nenabizet?.includes(c.slug)).sort((a, b) => a.cislo - b.cislo);
  const po = (c: C) => c.cislo > tato.cislo;
  const stejna = (c: C) => c.otazka === tato.otazka;
  return [
    ...ostatni.filter((c) => stejna(c) && po(c)),
    ...ostatni.filter((c) => stejna(c) && !po(c)),
    ...ostatni.filter((c) => !stejna(c) && po(c)),
    ...ostatni.filter((c) => !stejna(c) && !po(c)),
  ];
}

/** Je cesta podle deníku hotová? Má čas dokončení, nebo prošel všechny kroky. */
export function cestaHotova(p: { navstivene?: unknown; pocet?: unknown; dokonceno?: unknown } | undefined): boolean {
  if (!p) return false;
  if (typeof p.dokonceno === 'string') return true;
  return Array.isArray(p.navstivene) && typeof p.pocet === 'number' && p.navstivene.length >= p.pocet;
}
