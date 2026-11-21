// Data zápisníku pro Můj deník (design-v2, K6), skládaná při sestavení: razítka lidí (Moje filozofie, sbírka),
// adresy jejich stránek, filozofové cest (koho student potkal) a období cest (barva lístků a pahýlů).
// K6 dodatek: stránky atlasu s obdobím a seznam období, ze kterých deník skládá kapitoly (src/lib/zapisnik.ts).
import { getCollection } from 'astro:content';
import { data, osoba, mistaPodleId } from '../../lib/data';
import { zivot, rozpeti } from '../../lib/casy';
import { stredRazitka } from '../../lib/razitko';
import { adresaStranekOsob } from '../../lib/stranky-osob';
import { strankyAtlasu } from '../../lib/stranky-typu';
import { adresaObdobi } from '../../lib/stranky';
import { adresaTydne } from '../../lib/tydny';
import type { UdajeRazitka } from '../ostrovy/bloky-typy';
import type { MapaPotkanych, MapaStranek, ObdobiZapisniku } from '../../lib/zapisnik';

/** Kde stojí úvody oddílů (src/pages/co-je-filozofie.astro, src/pages/nabozenstvi/index.astro). */
const ADRESY_UVODU: Record<string, string> = { 'co-je-filozofie': '/co-je-filozofie/', 'co-je-nabozenstvi': '/nabozenstvi/', 'argumentacni-klamy': '/argumentacni-klamy/' };

export async function dataZapisniku(dalsi: Iterable<string> = []): Promise<{
  razitka: Record<string, UdajeRazitka>;
  osoby: Record<string, { obdobi: number; adresa?: string }>;
  potkani: MapaPotkanych;
  obdobiCest: Record<string, number>;
  stranky: MapaStranek;
  obdobi: ObdobiZapisniku[];
}> {
  const adresa = await adresaStranekOsob();
  const cesty = await getCollection('cesty');
  const ids = new Set<string>([...cesty.flatMap((c) => c.data.filozofove), ...data.lide.filter((o) => adresa(o.id)).map((o) => o.id), ...dalsi]);
  const razitka: Record<string, UdajeRazitka> = {};
  const osoby: Record<string, { obdobi: number; adresa?: string }> = {};
  const stranky: Record<string, string> = {};
  const mapa: MapaStranek = {};
  for (const id of ids) {
    const o = osoba(id);
    const a = adresa(id);
    razitka[id] = {
      id, jmeno: o.jmeno, roky: zivot(o), ikona: o.atribut?.ikona, atribut: o.atribut?.nazev,
      stred: stredRazitka(o, (m) => mistaPodleId.get(m)?.nazev),
    };
    osoby[id] = { obdobi: o.obdobi, ...(a ? { adresa: a } : {}) };
    if (a) {
      stranky[a] = id;
      mapa[a] = { nazev: o.jmeno, obdobi: o.obdobi };
    }
  }

  // Stránky, na kterých student píše nebo volí, s obdobím; otázky období nemají (kapitola Napříč obdobími).
  const atlas = await strankyAtlasu();
  for (const c of cesty) mapa[`/cesta/${c.id}/`] = { nazev: c.data.nazev, obdobi: c.data.obdobi };
  for (const o of data.obdobi) if (atlas.obdobi.has(o.id)) mapa[adresaObdobi(o.id, atlas)] = { nazev: o.nazev, obdobi: o.id };
  for (const s of await getCollection('smery')) if (s.data.perex) mapa[`/smer/${s.id}/`] = { nazev: s.data.nazev, obdobi: s.data.obdobi[0] };
  for (const p of await getCollection('pokusy')) mapa[`/pokus/${p.id}/`] = { nazev: p.data.nazev, obdobi: p.data.obdobi };
  for (const n of await getCollection('nabozenstvi')) mapa[`/nabozenstvi/${n.id}/`] = { nazev: n.data.nazev, obdobi: n.data.obdobi[0] };
  for (const u of await getCollection('uvody')) if (ADRESY_UVODU[u.id]) mapa[ADRESY_UVODU[u.id]] = { nazev: u.data.nazev, obdobi: u.data.obdobi };
  for (const t of await getCollection('tydny')) mapa[adresaTydne(t.id)] = { nazev: t.data.nazev, obdobi: t.data.obdobi };
  for (const q of await getCollection('otazky')) mapa[`/otazka/${q.id}/`] = { nazev: q.data.otazka };

  return {
    razitka,
    osoby,
    potkani: { stranky, cesty: Object.fromEntries(cesty.map((c) => [c.id, c.data.filozofove])) },
    obdobiCest: Object.fromEntries(cesty.map((c) => [c.id, c.data.obdobi])),
    stranky: mapa,
    obdobi: data.obdobi.map((o) => ({ id: o.id, nazev: o.nazev, leta: rozpeti(o.okno.od, o.okno.do, o.id === 8), maStranku: atlas.obdobi.has(o.id) })),
  };
}
