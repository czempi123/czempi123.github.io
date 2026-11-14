// Můj deník jako zápisník (design-v2, K6; plán větve › Mapa a deník: funkce): záznamy podle cest, sbírka
// (potkaní filozofové, odtržené pahýly, vystřižené citáty) a připomenutí zálohy. Čisté funkce nad deníkem;
// komponenta src/components/ostrovy/Denik.svelte. Nic se nepočítá navíc a nic se nehodnotí.
import type { Denik, Zapis } from './denik';
import { odpovedStudenta } from './strany';
import type { KatalogObdobi } from './tvoje-obdobi';
import { krokZAdresy as krokStranky } from './cesty';

/** Cesta a krok z adresy kroku i s kotvou („/cesta/kolik-je-dost/3/#cesta6-tri-kose“), nebo null. */
export function krokZAdresy(odkaz: string): { slug: string; krok: number } | null {
  const k = krokStranky(odkaz.split(/[#?]/)[0]);
  return k ? { slug: k.slug, krok: k.n } : null;
}

export interface ZaznamCesty {
  /** id zápisu nebo bloku */
  id: string;
  krok: number;
  adresa: string;
  otazka: string;
  /** zvolená možnost slovy (Volba, Spor, Změň jednu věc), když ji katalog zná */
  volba?: string;
  /** co student napsal (důvod, stanovisko, pravidlo) */
  odpoved?: string;
  kdy?: string;
}

export interface CestaVZapisniku {
  slug: string;
  nazev: string;
  pocet: number;
  /** student otevřel všechny kroky */
  hotova: boolean;
  zaznamy: ZaznamCesty[];
}

/**
 * Záznamy deníku seřazené podle cest a v cestě podle kroků. Cesty jdou od naposledy otevřené; cesta bez jediného
 * záznamu se neukáže (rozpracovaná je nahoře v deníku zvlášť). Volba slovy jen z katalogu bloků (Tvoje antika).
 */
export function zaznamyPodleCest(d: Pick<Denik, 'zapisy' | 'cesty' | 'bloky'>, k?: Pick<KatalogObdobi, 'bloky'>): CestaVZapisniku[] {
  const podle = new Map<string, ZaznamCesty[]>();
  const pridej = (slug: string, z: ZaznamCesty) => podle.set(slug, [...(podle.get(slug) ?? []), z]);
  const volby = new Map<string, { slug: string; krok: number; adresa: string; text: string }>();
  for (const b of k?.bloky ?? []) {
    const kod = odpovedStudenta(b.popis, d.bloky?.[b.id]);
    const text = kod === null ? undefined : b.odpovedi.find((o) => o.kod === kod)?.text;
    const kde = krokZAdresy(b.adresa);
    if (text && kde) volby.set(b.id, { ...kde, adresa: b.adresa, text });
  }
  const pouzite = new Set<string>();
  for (const z of d.zapisy as Zapis[]) {
    const kde = krokZAdresy(z.odkaz);
    if (!kde) continue;
    const v = volby.get(z.id);
    if (v) pouzite.add(z.id);
    pridej(kde.slug, {
      id: z.id, krok: kde.krok, adresa: z.odkaz, otazka: z.otazka, kdy: z.kdy,
      ...(v ? { volba: v.text } : {}),
      // Zápis Volby nese i zvolenou možnost; když ji ukazujeme zvlášť, zůstane jen důvod (za „ · “ nebo „: “).
      ...(odpovedBezVolby(z, v?.text) ? { odpoved: odpovedBezVolby(z, v?.text) } : {}),
    });
  }
  for (const [id, v] of volby) if (!pouzite.has(id)) pridej(v.slug, { id, krok: v.krok, adresa: v.adresa, otazka: '', volba: v.text });

  return Object.entries(d.cesty ?? {})
    .filter(([slug]) => podle.has(slug))
    .sort((a, b) => String(b[1].kdy).localeCompare(String(a[1].kdy)))
    .map(([slug, c]) => ({
      slug,
      nazev: c.nazev,
      pocet: c.pocet,
      hotova: c.navstivene.length >= c.pocet,
      zaznamy: podle.get(slug)!.sort((a, b) => a.krok - b.krok || String(a.kdy).localeCompare(String(b.kdy))),
    }));
}

/** Studentova slova bez zvolené možnosti, kterou záznam ukazuje zvlášť; prázdné = nic. */
function odpovedBezVolby(z: Zapis, volba?: string): string {
  const mezery = (s: string) => s.replace(/\s+/g, ' ');
  const t = mezery(z.odpoved).trim();
  if (!volba) return t;
  const v = mezery(volba).replace(/[.!?…]+$/, '');
  const i = t.indexOf(v);
  if (i < 0) return t;
  // Zápis Volby: „A · text. Proč: důvod.“ (zapisVolby v src/lib/bloky.ts)
  return t.slice(i + v.length).replace(/^[\s.!?…·:–-]+/, '').replace(/^Proč:\s*/, '').trim();
}

export interface PahylCesty {
  slug: string;
  nazev: string;
  pocet: number;
  kdy: string;
}

/** Odtržené pahýly lístků prošlých cest (K5: cesty[slug].pahyl), od nejstaršího jako ve sbírce. */
export function pahylyCest(d: Pick<Denik, 'cesty'>): PahylCesty[] {
  return Object.entries(d.cesty ?? {})
    .filter(([, c]) => typeof c.pahyl === 'string')
    .map(([slug, c]) => ({ slug, nazev: c.nazev, pocet: c.pocet, kdy: c.pahyl! }))
    .sort((a, b) => a.kdy.localeCompare(b.kdy));
}

export interface MapaPotkanych {
  /** adresa stránky osoby → id osoby */
  stranky: Record<string, string>;
  /** slug cesty → id jejích filozofů */
  cesty: Record<string, string[]>;
}

/**
 * Filozofové, které student potkal: otevřel jejich stránku nebo šel jejich cestou. V pořadí, jak je potkal
 * (nejdřív první); každý jednou.
 */
export function potkaniFilozofove(d: Pick<Denik, 'navstivene' | 'cesty'>, m: MapaPotkanych): string[] {
  const kdy = new Map<string, string>();
  const potkal = (id: string, cas: string) => {
    const pred = kdy.get(id);
    if (!pred || cas < pred) kdy.set(id, cas);
  };
  for (const n of d.navstivene ?? []) {
    const id = m.stranky[n.odkaz.split('#')[0]];
    if (id) potkal(id, n.kdy);
  }
  for (const [slug, c] of Object.entries(d.cesty ?? {})) {
    if (!c.navstivene?.length) continue;
    for (const id of m.cesty[slug] ?? []) potkal(id, c.dokonceno ?? c.kdy);
  }
  return [...kdy.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id]) => id);
}

/**
 * Připomenutí zálohy: nejnověji dokončená cesta, která přibyla po poslední záloze (stažení, odkaz), nebo null.
 * Deník bez dokončené cesty zálohu nepřipomíná.
 */
export function pripomenutiZalohy(d: Pick<Denik, 'cesty' | 'zaloha'>): { slug: string; nazev: string } | null {
  const po = d.zaloha ?? '';
  const [slug, c] = Object.entries(d.cesty ?? {})
    .filter(([, c]) => typeof c.dokonceno === 'string' && c.dokonceno > po)
    .sort((a, b) => b[1].dokonceno!.localeCompare(a[1].dokonceno!))[0] ?? [];
  return slug && c ? { slug, nazev: c.nazev } : null;
}
