// Stránky osob v atlasu: profily a portréty z kolekce `osobnosti` a medailonky z dat (`medailonek: true` v lide.yaml).
// Jediné místo, kde se obojí skládá dohromady; Lidé a směry, Doba a lidé, cesty, otázky i Mapa a čas berou adresu odsud,
// takže nový medailonek se v odkazech objeví všude sám.
import { getCollection } from 'astro:content';
import { adresaOsoby } from './adresa-osoby';
import { data } from './data';
import { druhyKdoZilDriv } from './dvojice';

/** id osob, které mají stránku medailonku (pořadí jako v lide.yaml). */
export const medailonky: string[] = data.lide.filter((o) => o.medailonek).map((o) => o.id);

/** adresaOsoby nad profily z kolekce i medailonky z dat. */
export async function adresaStranekOsob(): Promise<(osoba: string) => string | undefined> {
  return adresaOsoby(await getCollection('osobnosti'), medailonky);
}

/**
 * Druhý člověk bloku Kdo žil dřív? na medailonku: osoba s profilem nebo portrétem, nejbližší podle poloviny života
 * a bez vztahu s osobou stránky (druhyKdoZilDriv). Stránka medailonku i katalog hodin berou dvojici odsud.
 */
export async function kdoZilNaMedailonku(): Promise<(id: string) => string | null> {
  const zname = new Set((await getCollection('osobnosti')).flatMap((p) => [p.data.osoba, ...(p.data.dalsi ?? [])]));
  return (id) => {
    const o = data.lide.find((x) => x.id === id);
    return o ? druhyKdoZilDriv(o, data.lide, data.vztahy, (x) => zname.has(x)) : null;
  };
}
