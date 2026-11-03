// Katalog zastavení pro přípravu hodiny: /hodina/katalog.json. Skládá se při sestavení z obsahu a dat
// (katalogZastaveni v src/lib/hodiny.ts); skladatel hodiny i stránka hodiny si ho stáhnou.
// Po sestavení ověří kotvy proti dist/ skript scripts/hodiny-katalog.mjs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { osoby } from '../../lib/data';
import { katalogZastaveni, VERZE_HODINY } from '../../lib/hodiny';
import { kdoZilNaMedailonku, medailonky } from '../../lib/stranky-osob';
import { strankyAtlasu } from '../../lib/stranky-typu';
import { castiStrankyObdobi } from '../../lib/obdobi-stranka';
import { ODDIL_HLASY_POKUSU, ODDIL_UVOD } from '../../lib/stranky';
import type { StrankaKatalogu } from '../../lib/hodiny';

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
  // Stránky období, směrů, pokusů, úvodů a tradic (K1 větve antika-doplnky): oddíly šablony a text MDX.
  const s = await strankyAtlasu();
  const [obdobi, smery, pokusy, uvody, nabozenstvi] = await Promise.all([
    getCollection('obdobi'),
    getCollection('smery'),
    getCollection('pokusy'),
    getCollection('uvody'),
    getCollection('nabozenstvi'),
  ]);
  const stranky: StrankaKatalogu[] = [
    ...(await Promise.all(obdobi.map(async (z) => {
      const c = await castiStrankyObdobi(z);
      return { id: `obdobi-${z.id}`, typ: 'obdobi' as const, nazev: c.o.nazev, stranka: `/obdobi/${z.id}/`, obdobi: c.o.id, body: z.body,
        predTextem: [ODDIL_UVOD], zaTextem: c.oddily.map((o) => ({ kotva: o.kotva, nazev: o.nazev })) };
    }))),
    ...smery.filter((z) => s.smery.has(z.id)).map((z) => ({ id: `smer-${z.id}`, typ: 'smer' as const, nazev: z.data.nazev, stranka: `/smer/${z.id}/`, obdobi: z.data.obdobi[0], body: z.body })),
    ...pokusy.map((z) => ({ id: `pokus-${z.id}`, typ: 'pokus' as const, nazev: z.data.nazev, stranka: `/pokus/${z.id}/`, obdobi: z.data.obdobi, body: z.body,
      zaTextem: z.data.hlasy.length ? [ODDIL_HLASY_POKUSU] : [] })),
    // Úvody: Co je filozofie? má vlastní adresu, Co je náboženství? stojí na /nabozenstvi/.
    ...uvody.map((z) => ({ id: z.id, typ: 'uvod' as const, nazev: z.data.nazev, stranka: z.id === 'co-je-nabozenstvi' ? '/nabozenstvi/' : `/${z.id}/`, obdobi: null, body: z.body })),
    ...nabozenstvi.map((z) => ({ id: `nabozenstvi-${z.id}`, typ: 'nabozenstvi' as const, nazev: z.data.nazev, stranka: `/nabozenstvi/${z.id}/`, obdobi: null, body: z.body })),
  ];
  const zastaveni = katalogZastaveni({ cesty, kroky, osobnosti, otazky, bloky: otazkyBloku, tydny, medailonky: medailonkyKatalogu, stranky, osoby });
  return new Response(JSON.stringify({ verze: VERZE_HODINY, zastaveni }), { headers: { 'Content-Type': 'application/json' } });
};
