// Stránky období, směrů, pokusů, úvodů a náboženství (větev antika-doplnky, K1): adresy, části skládané z dat
// a rodokmen směru. Čisté funkce bez Astra; seznam existujících stránek dodá src/lib/stranky-typu.ts
// (sestavení) nebo test (tests/data/stranky.test.ts, čte soubory v src/content).
import type { TObdobi, TOsoba, TVztah } from './schema';
import { interval } from './casy';

// ─── Adresy ───────────────────────────────────────────────────────────────────

/** Které nové stránky v atlasu jsou: období (id → slug), směry s perexem, pokusy, tradice. */
export interface StrankyAtlasu {
  obdobi: Map<number, string>;
  smery: Set<string>;
  pokusy: Set<string>;
  nabozenstvi: Set<string>;
}

/**
 * Kam vede odkaz na období (pás období na Domů, drobečky, „období N“ v hlavičce osoby, Kam dál medailonku):
 * na stránku období, když ji období má, jinak na jeho oddíl v Lidech a směrech, jako dosud.
 */
export function adresaObdobi(id: number, stranky: Pick<StrankyAtlasu, 'obdobi'>): string {
  const slug = stranky.obdobi.get(id);
  return slug ? `/obdobi/${slug}/` : `/lide/#obdobi-${id}`;
}

/** Stránka směru, nebo undefined: směr bez stránky zůstává štítkem bez odkazu. */
export function adresaSmeru(id: string, stranky: Pick<StrankyAtlasu, 'smery'>): string | undefined {
  return stranky.smery.has(id) ? `/smer/${id}/` : undefined;
}

/**
 * Soubory stránek období se jmenují jako slug období v obdobi.yaml. Vrací id → slug a chyby
 * (soubor, který žádnému období nepatří, nebo nesedí na pole `obdobi` ve frontmatteru).
 */
export function strankyObdobi(
  zaznamy: { id: string; data: { obdobi: number } }[],
  obdobi: Pick<TObdobi, 'id' | 'slug'>[],
): { mapa: Map<number, string>; chyby: string[] } {
  const mapa = new Map<number, string>();
  const chyby: string[] = [];
  for (const z of zaznamy) {
    const o = obdobi.find((x) => x.slug === z.id);
    if (!o) chyby.push(`src/content/obdobi/${z.id}: žádné období v obdobi.yaml nemá slug „${z.id}“.`);
    else if (o.id !== z.data.obdobi) chyby.push(`src/content/obdobi/${z.id}: soubor patří období ${o.id}, ve frontmatteru je ${z.data.obdobi}.`);
    else mapa.set(o.id, z.id);
  }
  return { mapa, chyby };
}

// ─── Stránka období: části a jejich kotvy ─────────────────────────────────────

/**
 * Oddíly stránky období pod úvodní scénou, v pořadí na stránce. Název je nadpis na stránce i název zastavení
 * v přípravě hodiny (katalogZastaveni), kotva je pevná.
 */
export const ODDILY_OBDOBI = [
  { klic: 'osa', kotva: 'co-se-delo', nazev: 'Co se dělo' },
  { klic: 'otazky', kotva: 'otazky-doby', nazev: 'Otázky doby' },
  { klic: 'lide', kotva: 'lide-a-smery', nazev: 'Lidé a směry' },
  { klic: 'cesty', kotva: 'cesty-obdobi', nazev: 'Cesty' },
  { klic: 'mapa', kotva: 'na-mape', nazev: 'Na mapě' },
] as const;
export type KlicOddiluObdobi = (typeof ODDILY_OBDOBI)[number]['klic'];

/** Úvodní scéna stránky období, pokusu, úvodu a tradice (text MDX nad prvním oddílem). */
export const ODDIL_UVOD = { kotva: 'uvod', nazev: 'Úvodní scéna' } as const;
/** Hlasy na stránce pokusu. */
export const ODDIL_HLASY_POKUSU = { kotva: 'co-rekli', nazev: 'Co řekli filozofové' } as const;
/** Rodokmen na stránce směru. */
export const ODDIL_RODOKMEN = { kotva: 'rodokmen', nazev: 'Kdo u koho se učil' } as const;
/** Mapka míst na stránce tradice. */
export const ODDIL_MISTA = { kotva: 'mista', nazev: 'Kde a kdy' } as const;

/** Co je ve kterém oddílu stránky období: prázdný oddíl se neukáže (ani v přípravě hodiny). */
export function oddilyObdobi(pocty: Record<KlicOddiluObdobi, number>): (typeof ODDILY_OBDOBI)[number][] {
  return ODDILY_OBDOBI.filter((o) => pocty[o.klic] > 0);
}

// ─── Rodokmen směru ───────────────────────────────────────────────────────────

export interface ClanekRodokmenu {
  osoba: TOsoba;
  /** patří ke směru (`smery` v lide.yaml); ostatní jsou učitelé a žáci zvenku */
  clen: boolean;
  /** u koho se učil (vztah `ucitel`) */
  ucitele: { id: string; tradovany: boolean }[];
  /** koho četl a navázal na něj (vztah `vliv-textem`) */
  cetl: { id: string; tradovany: boolean }[];
}

/** Vztahy rodokmenu: učitel a žák, když aspoň jeden patří ke směru; vliv přes texty, když oba. */
function hranyRodokmenu(smer: string, lide: TOsoba[], vztahy: TVztah[]): TVztah[] {
  const podleId = new Map(lide.map((o) => [o.id, o]));
  const clen = (id: string) => podleId.get(id)?.smery.includes(smer) ?? false;
  return vztahy.filter((v) => (v.typ === 'ucitel' && (clen(v.od) || clen(v.k))) || (v.typ === 'vliv-textem' && clen(v.od) && clen(v.k)));
}

/**
 * Rodokmen směru z vztahy.yaml: všichni členové směru (`smery` v lide.yaml) a k nim jejich učitelé a žáci zvenku
 * (Sókratés u Akademie, Zénón u kyniků). Vliv přes texty jen uvnitř směru (Epiktétos → Marcus Aurelius): kdo četl
 * kohokoli, by z rodokmenu udělal seznam četby. Polemiky a známosti do rodokmenu nepatří. Řazení podle začátku života
 * (osoba bez roků na konec).
 */
export function rodokmenSmeru(smer: string, lide: TOsoba[], vztahy: TVztah[]): ClanekRodokmenu[] {
  const podleId = new Map(lide.map((o) => [o.id, o]));
  const clen = (id: string) => podleId.get(id)?.smery.includes(smer) ?? false;
  const hrany = hranyRodokmenu(smer, lide, vztahy);
  const ids = new Set([...lide.filter((o) => clen(o.id)).map((o) => o.id), ...hrany.flatMap((v) => [v.od, v.k])]);
  const zacatek = (o: TOsoba) => interval(o)?.[0] ?? Number.POSITIVE_INFINITY;
  return [...ids]
    .map((id) => podleId.get(id))
    .filter((o): o is TOsoba => !!o)
    .sort((a, b) => zacatek(a) - zacatek(b) || a.jmeno.localeCompare(b.jmeno, 'cs'))
    .map((o) => ({
      osoba: o,
      clen: clen(o.id),
      ucitele: hrany.filter((v) => v.k === o.id && v.typ === 'ucitel').map((v) => ({ id: v.od, tradovany: !!v.tradovany })),
      cetl: hrany.filter((v) => v.k === o.id && v.typ === 'vliv-textem').map((v) => ({ id: v.od, tradovany: !!v.tradovany })),
    }));
}

/** Vztahy, ze kterých rodokmen stojí (jejich prameny patří do Pramenů stránky směru). */
export function vztahyRodokmenu(smer: string, lide: TOsoba[], vztahy: TVztah[]): TVztah[] {
  return hranyRodokmenu(smer, lide, vztahy);
}

// ─── Náboženství: role míst ───────────────────────────────────────────────────

export const ROLE_MIST_TRADICE: Record<'vznik' | 'centrum' | 'exil' | 'diaspora', string> = {
  vznik: 'vznik',
  centrum: 'centrum',
  exil: 'vyhnanství',
  diaspora: 'život v rozptýlení',
};
