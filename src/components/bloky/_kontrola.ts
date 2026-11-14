// Společná kontrola bloků z YAML při sestavení: druh, odkazy na data a obsah čekající na ověření.
import { getEntry, getCollection } from 'astro:content';
import { data, osoba, mistaPodleId } from '../../lib/data';
import { zivot } from '../../lib/casy';
import { stredRazitka } from '../../lib/razitko';
import { chybyBloku } from '../../lib/bloky';
import type { TBlok } from '../../lib/bloky-schema';
import { dalsiKrok, krokZAdresy } from '../../lib/cesty';
import type { ClovekBloku, Dal } from '../ostrovy/bloky-typy';

const osoby = new Set(data.lide.map((o) => o.id));
const prameny = new Set(data.zdroje.prameny.map((p) => p.id));

/** Načte blok podle id a zastaví sestavení, když nesedí druh, data, nebo čeká na ověření mimo dílnu. */
export async function nactiBlok<D extends TBlok['druh']>(id: string, druh: D, stranka: string): Promise<Extract<TBlok, { druh: D }>> {
  const zaznam = await getEntry('bloky', id);
  if (!zaznam) throw new Error(`Blok „${id}“ není v src/content/bloky/${id}.yaml`);
  const blok = zaznam.data as TBlok;
  if (blok.druh !== druh) throw new Error(`Blok „${id}“ je druhu „${blok.druh}“, ne „${druh}“.`);
  const chyby = chybyBloku(id, blok, osoby, prameny);
  if (chyby.length) throw new Error(chyby.join('\n'));
  if (blok.kOvereni.length && !stranka.startsWith('/dilna/')) {
    throw new Error(`Blok „${id}“ čeká na ověření (${blok.kOvereni.join('; ')}) a smí být jen v dílně, ne na ${stranka}.`);
  }
  return blok as Extract<TBlok, { druh: D }>;
}

/** Odkaz zpět k bloku pro deník: stránka a kotva. */
export const odkazNaBlok = (stranka: string, id: string) => `${stranka}#${id}`;

/** Blok bez polí, která ostrov nepotřebuje (zdroje, ověření, kam dál). */
export function proOstrov<T extends { zdroje: string[]; kOvereni: string[]; dal?: unknown }>(b: T): Omit<T, 'zdroje' | 'kOvereni' | 'dal'> {
  const { zdroje: _z, kOvereni: _k, dal: _d, ...zbytek } = b;
  return zbytek;
}

/** Člověk pro razítka a „Co udělal …“: jméno, období, atribut a údaje razítka z lide.yaml. */
export function clovek(id: string): ClovekBloku {
  const o = osoba(id);
  return {
    jmeno: o.jmeno, obdobi: o.obdobi, ikona: o.atribut?.ikona, zena: o.zena,
    razitko: {
      id: o.id, jmeno: o.jmeno, roky: zivot(o), ikona: o.atribut?.ikona, atribut: o.atribut?.nazev,
      stred: stredRazitka(o, (m) => mistaPodleId.get(m)?.nazev),
    },
  };
}

/** Kam dál po bloku: vlastní odkaz, jinak v kroku cesty další krok (nebo dokončení cesty). */
export async function kamDal(stranka: string, vlastni?: Dal): Promise<Dal | undefined> {
  if (vlastni) return vlastni;
  const k = krokZAdresy(stranka);
  if (!k) return undefined;
  const kroky = (await getCollection('kroky')).map((x) => x.data);
  return dalsiKrok(kroky, k.slug, k.n) ?? undefined;
}
