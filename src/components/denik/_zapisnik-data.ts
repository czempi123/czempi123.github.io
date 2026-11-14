// Data zápisníku pro Můj deník (design-v2, K6), skládaná při sestavení: razítka lidí (Moje filozofie, sbírka),
// adresy jejich stránek, filozofové cest (koho student potkal) a období cest (barva lístků a pahýlů).
import { getCollection } from 'astro:content';
import { data, osoba, mistaPodleId } from '../../lib/data';
import { zivot } from '../../lib/casy';
import { stredRazitka } from '../../lib/razitko';
import { adresaStranekOsob } from '../../lib/stranky-osob';
import type { UdajeRazitka } from '../ostrovy/bloky-typy';
import type { MapaPotkanych } from '../../lib/zapisnik';

export async function dataZapisniku(dalsi: Iterable<string> = []): Promise<{
  razitka: Record<string, UdajeRazitka>;
  osoby: Record<string, { obdobi: number; adresa?: string }>;
  potkani: MapaPotkanych;
  obdobiCest: Record<string, number>;
}> {
  const adresa = await adresaStranekOsob();
  const cesty = await getCollection('cesty');
  const ids = new Set<string>([...cesty.flatMap((c) => c.data.filozofove), ...data.lide.filter((o) => adresa(o.id)).map((o) => o.id), ...dalsi]);
  const razitka: Record<string, UdajeRazitka> = {};
  const osoby: Record<string, { obdobi: number; adresa?: string }> = {};
  const stranky: Record<string, string> = {};
  for (const id of ids) {
    const o = osoba(id);
    const a = adresa(id);
    razitka[id] = {
      id, jmeno: o.jmeno, roky: zivot(o), ikona: o.atribut?.ikona, atribut: o.atribut?.nazev,
      stred: stredRazitka(o, (m) => mistaPodleId.get(m)?.nazev),
    };
    osoby[id] = { obdobi: o.obdobi, ...(a ? { adresa: a } : {}) };
    if (a) stranky[a] = id;
  }
  return {
    razitka,
    osoby,
    potkani: { stranky, cesty: Object.fromEntries(cesty.map((c) => [c.id, c.data.filozofove])) },
    obdobiCest: Object.fromEntries(cesty.map((c) => [c.id, c.data.obdobi])),
  };
}
