// Pojmy (design-v2, krok P): schéma kolekce src/content/pojmy/<id>.md, adresy míst, kde pojem v atlasu stojí,
// a české tvary pro hledání (Pagefind neskloňuje). Sdílí je content.config.ts, stránky /pojem/<id>/ a /pojmy/,
// komponenta Pojem.astro i testy (tests/data/pojmy.test.ts). Podklady: docs/podklady/pojmy-antika.md.
import { z } from 'astro/zod';

const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id: malá písmena bez diakritiky, číslice a pomlčky');
const Text = z.string().trim().min(1);

/** Kde pojem stojí: druh stránky a její id, u kroku cesty i číslo kroku („cesta/kolik-je-dost/3“). */
export const KLIC_VYSKYTU = /^(osobnost|smer|otazka|pokus|obdobi|nabozenstvi|uvod)\/[a-z0-9-]+$|^cesta\/[a-z0-9-]+(\/\d+)?$/;

/** Věta, která končí tečkou, otazníkem nebo vykřičníkem (bez zkratky letopočtu na konci). */
function vety(t: string): number {
  return (t.match(/[.?!…](?=\s|$)/g) ?? []).length;
}

export const Pojem = z
  .object({
    /** slovo, jak stojí v textu a v nadpisu stránky (malým písmenem) */
    pojem: Text,
    /** odkud slovo je; u řeckých pojmů řecké slovo a co znamenalo */
    puvod: Text.optional(),
    /** dvě věty, které se dají pochopit bez dalšího čtení: lístek, poznámka na okraji i stránka pojmu */
    vysvetleni: Text.refine((t) => vety(t) === 2, 'vysvětlení má mít právě dvě věty'),
    /** kde pojem znamená u různých filozofů různé věci: u koho co (jen stránka pojmu) */
    uKoho: z.array(z.object({ kdo: Text, co: Text }).strict()).default([]),
    /** příklad ze života studenta */
    priklad: Text,
    /** stránky, kde pojem stojí (první výskyt na stránce), klíč jako „osobnost/sokrates“ */
    vyskyty: z.array(z.string().regex(KLIC_VYSKYTU, 'výskyt: druh/id, u kroku cesta/slug/číslo')).min(1),
    /** id ze src/data/zdroje.yaml */
    prameny: z.array(Id).min(1),
    /** období, do kterých pojem patří (barva stránky podle prvního) */
    obdobi: z.array(z.number().int().min(1).max(8)).min(1),
    /** tvary slova pro hledání: skloňování, řecké slovo, jeho české tvary */
    tvary: z.array(Text).default([]),
  })
  .strict();
export type TPojem = z.infer<typeof Pojem>;

/** Adresa stránky, na které pojem stojí. Úvody mají vlastní adresy (Co je filozofie?, Co je náboženství?). */
export function adresaVyskytu(klic: string): string {
  const [druh, id, krok] = klic.split('/');
  if (druh === 'uvod') return id === 'co-je-nabozenstvi' ? '/nabozenstvi/' : `/${id}/`;
  if (druh === 'cesta') return krok ? `/cesta/${id}/${krok}/` : `/cesta/${id}/`;
  return `/${druh}/${id}/`;
}

const SLOZKY: Record<string, string> = {
  osobnosti: 'osobnost', smery: 'smer', otazky: 'otazka', pokusy: 'pokus', obdobi: 'obdobi',
  nabozenstvi: 'nabozenstvi', uvody: 'uvod', cesty: 'cesta',
};

/** Klíč výskytu ze cesty souboru v src/content („cesty/kolik-je-dost/3-kde-ma-slast-strop.mdx“ → „cesta/kolik-je-dost/3“). */
export function klicSouboru(cesta: string): string | undefined {
  const casti = cesta.replace(/^.*src\/content\//, '').replace(/\.mdx?$/, '').split('/');
  const druh = SLOZKY[casti[0]];
  if (!druh) return undefined;
  if (druh === 'cesta' && casti.length === 3) return `cesta/${casti[1]}/${casti[2].match(/^(\d+)/)?.[1]}`;
  return `${druh}/${casti[1]}`;
}

/** Adresa stránky pojmu. */
export const adresaPojmu = (id: string) => `/pojem/${id}/`;

/** Pojem jako nadpis: první písmeno velké („v naší moci“ → „V naší moci“). */
export const nazevPojmu = (pojem: string) => pojem.charAt(0).toLocaleUpperCase('cs') + pojem.slice(1);

/** Oddíly stránky pojmu v pořadí na stránce; stejné kotvy a názvy bere katalog hodin. */
export const ODDILY_POJMU = {
  puvod: { kotva: 'puvod', nazev: 'Odkud je slovo' },
  uKoho: { kotva: 'u-koho', nazev: 'U koho co' },
  priklad: { kotva: 'priklad', nazev: 'Ze života' },
  kde: { kotva: 'kde', nazev: 'Kde v atlasu stojí' },
} as const;

export function oddilyPojmu(p: Pick<TPojem, 'puvod' | 'uKoho'>): { kotva: string; nazev: string }[] {
  return [
    ...(p.puvod ? [ODDILY_POJMU.puvod] : []),
    ...(p.uKoho.length ? [ODDILY_POJMU.uKoho] : []),
    ODDILY_POJMU.priklad,
    ODDILY_POJMU.kde,
  ];
}

/**
 * Tvary jména pro hledání: Pagefind neskloňuje, „Sókrata“ by profil Sókrata nenašel.
 * Z 1. a 2. pádu (jmeno, jmeno2 v lide.yaml) odvodí 3., 6. a 7. pád každého slova jména
 * (Sókrata → Sókratovi, Sókratem; Seneky → Senekovi, Senekou; Hipparchie → Hipparchii, Hipparchií).
 * Tvary slouží jen indexu hledání: chybný tvar navíc nic nerozbije, chybějící ano.
 */
export function tvaryJmena(jmeno: string, jmeno2?: string): string[] {
  if (!jmeno2 || jmeno2 === jmeno) return [];
  // Koncovka 2. pádu → 3. a 7. pád: -a (Sókrata, Marca Aurelia), -y (Seneky), -e (Hipparchie).
  const pady = (slovo: string): [string, string] => {
    const z = slovo.slice(0, -1);
    if (slovo.endsWith('a')) return [`${z}ovi`, `${z}em`];
    if (slovo.endsWith('y')) return [`${z}ovi`, `${z}ou`];
    if (slovo.endsWith('e')) return [`${z}i`, `${z}í`];
    return [slovo, slovo];
  };
  const slova = jmeno2.split(' ').map(pady);
  const tvary = new Set([jmeno2, slova.map((p) => p[0]).join(' '), slova.map((p) => p[1]).join(' ')]);
  tvary.delete(jmeno);
  return [...tvary];
}
