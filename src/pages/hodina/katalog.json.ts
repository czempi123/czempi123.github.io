// Katalog zastavení pro přípravu hodiny: /hodina/katalog.json. Skládá se při sestavení z obsahu a dat
// (katalogZastaveni v src/lib/hodiny.ts); skladatel hodiny i stránka hodiny si ho stáhnou.
// Po sestavení ověří kotvy proti dist/ skript scripts/hodiny-katalog.mjs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { osoby } from '../../lib/data';
import { katalogZastaveni, VERZE_HODINY } from '../../lib/hodiny';
import { kdoZilNaMedailonku, medailonky } from '../../lib/stranky-osob';

export const GET: APIRoute = async () => {
  const [cesty, kroky, osobnosti, otazky, bloky, tydny] = await Promise.all([
    getCollection('cesty'),
    getCollection('kroky'),
    getCollection('osobnosti'),
    getCollection('otazky'),
    getCollection('bloky'),
    getCollection('tydny'),
  ]);
  // Návrat otázku nemá (nabízí ho jen deník, v katalogu není).
  const otazkyBloku = bloky.map((b) => ({
    id: b.id,
    data: { otazka: 'otazka' in b.data ? b.data.otazka : undefined, nadtitulek: 'nadtitulek' in b.data ? b.data.nadtitulek : undefined },
  }));
  // Medailonky: stránka z dat a blok Kdo žil dřív? s druhým člověkem podle stejného pravidla jako na stránce.
  const kdoZil = await kdoZilNaMedailonku();
  const medailonkyKatalogu = medailonky.map((osoba) => ({ osoba, kdoZil: kdoZil(osoba) }));
  const zastaveni = katalogZastaveni({ cesty, kroky, osobnosti, otazky, bloky: otazkyBloku, tydny, medailonky: medailonkyKatalogu, osoby });
  return new Response(JSON.stringify({ verze: VERZE_HODINY, zastaveni }), { headers: { 'Content-Type': 'application/json' } });
};
