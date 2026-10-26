// Katalog zastavení pro přípravu hodiny: /hodina/katalog.json. Skládá se při sestavení z obsahu a dat
// (katalogZastaveni v src/lib/hodiny.ts); skladatel hodiny i stránka hodiny si ho stáhnou.
// Po sestavení ověří kotvy proti dist/ skript scripts/hodiny-katalog.mjs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { osoby } from '../../lib/data';
import { katalogZastaveni, VERZE_HODINY } from '../../lib/hodiny';

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
  const zastaveni = katalogZastaveni({ cesty, kroky, osobnosti, otazky, bloky: otazkyBloku, tydny, osoby });
  return new Response(JSON.stringify({ verze: VERZE_HODINY, zastaveni }), { headers: { 'Content-Type': 'application/json' } });
};
