// Stránky osob v atlasu: profily a portréty z kolekce `osobnosti` a medailonky z dat (`medailonek: true` v lide.yaml).
// Jediné místo, kde se obojí skládá dohromady; Lidé a směry, Doba a lidé, cesty, otázky i Mapa a čas berou adresu odsud,
// takže nový medailonek se v odkazech objeví všude sám.
import { getCollection } from 'astro:content';
import { adresaOsoby } from './adresa-osoby';
import { data } from './data';
import { druziKdoZilDriv } from './dvojice';
import { aktivityStranekOsob, obsahAktivity, type Aktivita, type KontextAktivit, type ObsahAktivity } from './herna/aktivity';

/** id osob, které mají stránku medailonku (pořadí jako v lide.yaml). */
export const medailonky: string[] = data.lide.filter((o) => o.medailonek).map((o) => o.id);

/** adresaOsoby nad profily z kolekce i medailonky z dat. */
export async function adresaStranekOsob(): Promise<(osoba: string) => string | undefined> {
  return adresaOsoby(await getCollection('osobnosti'), medailonky);
}

/**
 * Druhý člověk bloku Kdo žil dřív? na medailonku: osoba s profilem nebo portrétem bez vztahu s osobou stránky,
 * jejíž život se s ní nepřekrývá, nejbližší podle poloviny života, každá nejvýš na třech medailoncích
 * (druziKdoZilDriv, přidělení v pořadí lide.yaml). Stránka medailonku i katalog hodin berou dvojici odsud.
 */
export async function kdoZilNaMedailonku(): Promise<(id: string) => string | null> {
  const zname = new Set((await getCollection('osobnosti')).flatMap((p) => [p.data.osoba, ...(p.data.dalsi ?? [])]));
  const osoby = data.lide.filter((o) => o.medailonek);
  const druzi = druziKdoZilDriv(osoby, data.lide, data.vztahy, (x) => zname.has(x));
  return (id) => druzi.get(id) ?? null;
}

// ─── Malá aktivita na stránce osoby (herna-v1, K4) ───────────────────────────

/** Citáty, které atlas už použil samostatně: hlasy velkých otázek (2) a <Citat id> v textech (1). */
const otazkyRaw = import.meta.glob('../content/otazky/*.{md,mdx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const textyRaw = import.meta.glob('../content/**/*.mdx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
function vahyCitatu(): Map<string, number> {
  const vaha = new Map<string, number>();
  for (const t of Object.values(textyRaw)) for (const m of t.matchAll(/<Citat id="([a-z0-9-]+)"/g)) vaha.set(m[1], 1);
  for (const t of Object.values(otazkyRaw)) for (const m of t.matchAll(/citat: ?"?([a-z0-9-]+)/g)) vaha.set(m[1], 2);
  return vaha;
}

let kontext: Promise<KontextAktivit & { profily: Set<string> }> | undefined;
/** Kontext výběru aktivit nad daty atlasu: stránky osob, Kdo žil dřív? na medailoncích, váhy citátů. */
export function kontextAktivit(): Promise<KontextAktivit & { profily: Set<string> }> {
  kontext ??= (async () => {
    const osobnosti = await getCollection('osobnosti');
    const profily = new Set(osobnosti.flatMap((p) => [p.data.osoba, ...(p.data.dalsi ?? [])]));
    const adresa = await adresaStranekOsob();
    const kdoZil = await kdoZilNaMedailonku();
    const vaha = vahyCitatu();
    return {
      lide: data.lide,
      vztahy: data.vztahy,
      citaty: data.zdroje.citaty,
      mista: new Map(data.mista.map((m) => [m.id, m])),
      maStranku: (id: string) => !!adresa(id),
      kdoZil,
      znama: (id: string) => profily.has(id),
      vahaCitatu: (id: string) => vaha.get(id) ?? 0,
      profily,
    };
  })();
  return kontext;
}

let vyber: Promise<Map<string, Aktivita | null>> | undefined;
/** Vybraná malá aktivita každé stránky osoby (aktivityStranekOsob); u profilu null (má svou v MDX). */
export function aktivityOsob(): Promise<Map<string, Aktivita | null>> {
  vyber ??= kontextAktivit().then((k) => aktivityStranekOsob(k, k.profily));
  return vyber;
}

/** Hra medailonku sestavená z dat (obsahAktivity), nebo null. */
export async function hraMedailonku(id: string): Promise<ObsahAktivity | null> {
  const a = (await aktivityOsob()).get(id);
  if (!a) return null;
  return obsahAktivity(data.lide.find((o) => o.id === id)!, a, await kontextAktivit());
}
