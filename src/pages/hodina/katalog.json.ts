// Katalog zastavení pro přípravu hodiny: /hodina/katalog.json. Skládá se při sestavení z obsahu a dat
// (katalogZastaveni v src/lib/hodiny.ts); skladatel hodiny i stránka hodiny si ho stáhnou.
// Po sestavení ověří kotvy proti dist/ skript scripts/hodiny-katalog.mjs.
import { adresaPojmu, nazevPojmu, oddilyPojmu } from '../../lib/pojmy';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { osoby } from '../../lib/data';
import { katalogZastaveni, VERZE_HODINY } from '../../lib/hodiny';
import { kdoZilNaMedailonku, medailonky, hraMedailonku } from '../../lib/stranky-osob';
import { KOMPONENTA_AKTIVITY } from '../../lib/herna/aktivity';
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
  // Medailonky: stránka z dat a malá hra z dat (herna-v1, K4) se stejným id a otázkou jako na stránce
  // (HraOsoby.astro); Kdo žil dřív? jako dřív s druhým člověkem podle pevného pravidla.
  const kdoZil = await kdoZilNaMedailonku();
  const medailonkyKatalogu = await Promise.all(medailonky.map(async (osoba) => {
    const hra = await hraMedailonku(osoba);
    if (!hra || hra.druh === 'kdo-zil') return { osoba, kdoZil: hra ? hra.b : kdoZil(osoba) };
    return { osoba, kdoZil: null, hra: { id: hra.id, typ: KOMPONENTA_AKTIVITY[hra.druh], otazka: hra.blok.otazka } };
  }));
  // Stránky období, směrů, pokusů, úvodů a tradic (K1 větve antika-doplnky): oddíly šablony a text MDX.
  const s = await strankyAtlasu();
  const [obdobi, smery, pokusy, uvody, nabozenstvi, pojmy] = await Promise.all([
    getCollection('obdobi'),
    getCollection('smery'),
    getCollection('pokusy'),
    getCollection('uvody'),
    getCollection('nabozenstvi'),
    getCollection('pojmy'),
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
    // Pojmy (design-v2, krok P): celá stránka a její oddíly; text není v MDX, oddíly skládá šablona.
    ...pojmy.map((z) => ({ id: `pojem-${z.id}`, typ: 'pojem' as const, nazev: nazevPojmu(z.data.pojem), stranka: adresaPojmu(z.id), obdobi: z.data.obdobi[0],
      zaTextem: oddilyPojmu(z.data) })),
  ];
  const zastaveni = katalogZastaveni({ cesty, kroky, osobnosti, otazky, bloky: otazkyBloku, tydny, medailonky: medailonkyKatalogu, stranky, osoby });
  return new Response(JSON.stringify({ verze: VERZE_HODINY, zastaveni }), { headers: { 'Content-Type': 'application/json' } });
};
