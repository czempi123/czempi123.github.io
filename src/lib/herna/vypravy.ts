// Výpravy v Mapě a čase (herna-v1, K4): otázka „Kde byl…?“ pro období na pásu, ověření na mapě (vybraný člověk
// v daném roce) a razítko „sedí“. Obsah je v src/data/vypravy.yaml (otázky z podkladů P6, oddíl 6); odpověď skládají
// data (kdeVRoce a věta o pobytu), YAML smí přidat jednu ověřenou větu navíc (`pak`).
// Čisté funkce bez DOM; ostrov src/components/mapa/MapaACas.svelte, testy tests/data/herna-k4.test.ts.
import { z } from 'astro/zod';
import { kdeVRoce, type OsobaMapy } from '../cas-mapy';
import { pobytOsoby, vetaPobytu } from './mista';

const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const Vyprava = z
  .object({
    id: Id,
    /** období na pásu, ve kterém se výprava nabízí */
    obdobi: z.number().int().min(1).max(8),
    osoba: Id,
    /** rok, ve kterém má student člověka na mapě najít (záporný = př. n. l.) */
    rok: z.number().int().refine((r) => r !== 0, 'Rok nula neexistuje.'),
    /** místo, kde ho mapa v tom roce ukáže (kontrola proti kdeVRoce) */
    misto: Id,
    /** otázka na lístku, z podkladů (docs/podklady/herna.md, oddíl 6) */
    otazka: z.string().trim().min(1),
    /** jedna ověřená věta po odpovědi navíc (Alexandr v Pelle, Hovory v Carnuntu) */
    pak: z.string().trim().min(1).optional(),
  })
  .strict();
export const Vypravy = z.array(Vyprava).min(1);
export type TVyprava = z.infer<typeof Vyprava>;

/** Výprava, jak ji dostane ostrov mapy: texty hotové, porovnává se jen člověk a rok. */
export interface VypravaV {
  id: string;
  obdobi: number;
  osoba: string;
  rok: number;
  otazka: string;
  pokyn: string;
  odpoved: string;
}

type OsobaVypravy = OsobaMapy & { zena?: boolean };
type MistoVypravy = { nazev: string; kde?: string };

/** Pokyn pod otázkou (tentýž jako u první výpravy, s rodem). */
export const pokynVypravy = (o: { zena?: boolean }) => `Posuň rok, najdi na mapě ${o.zena ? 'její' : 'jeho'} lísteček a otevři ho.`;

/**
 * Odpověď po razítku z dat: věta o pobytu v tom roce („V Krotónu učil a působil Pýthagorás v letech asi 530–510
 * př. n. l.“), rodiště, když je jinde („Narodil se na Samu.“), a věta `pak` z YAML.
 */
export function odpovedVypravy(v: Pick<TVyprava, 'rok' | 'pak'>, o: OsobaVypravy, mista: ReadonlyMap<string, MistoVypravy>): string {
  const k = kdeVRoce(o, v.rok);
  if (!k) return v.pak ?? '';
  const m = mista.get(k.misto);
  const pobyt = pobytOsoby(o, k.misto, k.role) ?? pobytOsoby(o, k.misto);
  const casti = [pobyt && m?.kde ? vetaPobytu(o, pobyt, m.kde) : `${m?.nazev ?? k.misto}.`];
  const rodiste = o.mista.find((x) => x.role === 'narozeni');
  const kdeRodiste = rodiste && rodiste.misto !== k.misto ? mista.get(rodiste.misto)?.kde : undefined;
  if (kdeRodiste && k.role !== 'narozeni') casti.push(`${o.zena ? 'Narodila' : 'Narodil'} se ${kdeRodiste}.`);
  if (v.pak) casti.push(v.pak);
  return casti.join(' ');
}

/** Chyby výprav proti datům: člověk není, v roce nežije, mapa ho ukáže jinde, nebo rok leží mimo období. */
export function chybyVyprav(
  vypravy: readonly TVyprava[],
  lide: ReadonlyMap<string, OsobaMapy>,
  obdobi: readonly { id: number; okno: { od: number; do: number } }[],
): string[] {
  const chyby: string[] = [];
  const videno = new Set<string>();
  for (const v of vypravy) {
    if (videno.has(v.id)) chyby.push(`Výprava „${v.id}“ je dvakrát.`);
    videno.add(v.id);
    const o = lide.get(v.osoba);
    if (!o) { chyby.push(`Výprava „${v.id}“: osoba „${v.osoba}“ není v lide.yaml.`); continue; }
    const k = kdeVRoce(o, v.rok);
    if (!k) chyby.push(`Výprava „${v.id}“: ${v.osoba} v roce ${v.rok} nežije.`);
    else if (k.misto !== v.misto) chyby.push(`Výprava „${v.id}“: mapa ukáže ${v.osoba} v roce ${v.rok} v místě „${k.misto}“, ne „${v.misto}“.`);
    const ob = obdobi.find((x) => x.id === v.obdobi);
    if (!ob || v.rok < ob.okno.od || v.rok > ob.okno.do) chyby.push(`Výprava „${v.id}“: rok ${v.rok} leží mimo okno období ${v.obdobi}.`);
  }
  return chyby;
}

/** Je výprava splněná: na mapě je vybraný její člověk v jejím roce. */
export const splnenaVyprava = (v: Pick<VypravaV, 'osoba' | 'rok'>, osoba: string | undefined, rok: number) => osoba === v.osoba && rok === v.rok;

/** Výpravy období v pořadí z YAML. */
export const vypravyObdobi = <T extends { obdobi: number }>(vse: readonly T[], obdobi: number) => vse.filter((v) => v.obdobi === obdobi);

/** Další výprava v témže období (po poslední zase první). */
export function dalsiVyprava<T extends { id: string }>(seznam: readonly T[], id: string): T | undefined {
  const i = seznam.findIndex((v) => v.id === id);
  return seznam[(i + 1) % seznam.length];
}

/** Klíč v localStorage: rozpracovaná výprava podle období a splněné výpravy. */
export const KLIC_VYPRAVY = 'atlas-vypravy';
export interface StavVyprav { aktualni: Record<string, string>; splnene: string[] }

/** Uložený stav, jen s výpravami, které atlas zná; jinak prázdný. */
export function platnyStavVyprav(s: unknown, ids: ReadonlySet<string>): StavVyprav {
  const prazdny: StavVyprav = { aktualni: {}, splnene: [] };
  if (!s || typeof s !== 'object') return prazdny;
  const o = s as Partial<StavVyprav>;
  const aktualni: Record<string, string> = {};
  if (o.aktualni && typeof o.aktualni === 'object') {
    for (const [k, v] of Object.entries(o.aktualni)) if (/^[1-8]$/.test(k) && typeof v === 'string' && ids.has(v)) aktualni[k] = v;
  }
  const splnene = Array.isArray(o.splnene) ? [...new Set(o.splnene.filter((x): x is string => typeof x === 'string' && ids.has(x)))] : [];
  return { aktualni, splnene };
}
