// Co stojí na stránce období (/obdobi/<slug>/): části skládané z dat a z frontmatteru. Stránka
// (src/pages/obdobi/[obdobi].astro) i katalog hodin (src/pages/hodina/katalog.json.ts) berou obsah odsud,
// takže zastavení v přípravě hodiny jsou vždy tytéž oddíly, které stránka ukáže.
import { getCollection, type CollectionEntry } from 'astro:content';
import { data, obdobiPodleId, mistaPodleId } from './data';
import { interval } from './casy';
import { adresaOtazky } from './otazky';
import { adresaStranekOsob } from './stranky-osob';
import { oddilyObdobi } from './stranky';
import type { MistoMiniMapy } from './mapa';

export async function castiStrankyObdobi(zaznam: CollectionEntry<'obdobi'>) {
  const fm = zaznam.data;
  const o = obdobiPodleId.get(fm.obdobi)!;
  const adresa = await adresaStranekOsob();

  // Co se dělo: kotvy a události ze životů, které do období patří.
  const udalosti = data.udalosti.filter((u) => u.obdobi.includes(o.id));
  // Otázky doby: znění z kolekce otázek, cesty období k té otázce.
  const otazky = await getCollection('otazky');
  const cesty = (await getCollection('cesty')).filter((c) => c.data.obdobi === o.id).sort((a, b) => a.data.cislo - b.data.cislo);
  const otazkyDoby = fm.otazky.map((q) => {
    const z = otazky.find((x) => x.data.cislo === q.cislo);
    if (!z) throw new Error(`Období ${o.id}: otázka ${q.cislo} není v src/content/otazky.`);
    return { ...q, zneni: z.data.otazka, href: adresaOtazky(z.id, z.data), cesty: cesty.filter((c) => c.data.otazka === q.cislo) };
  });
  // Lidé a směry: směry období, lidé se stránkou (portrét, profil, medailonek) podle narození.
  const smery = (await getCollection('smery')).filter((s) => s.data.obdobi.includes(o.id)).sort((a, b) => a.data.poradi - b.data.poradi);
  const lideObdobi = data.lide.filter((l) => l.obdobi === o.id);
  const zacatek = (l: (typeof lideObdobi)[number]) => interval(l)?.[0] ?? Number.POSITIVE_INFINITY;
  const sProfilem = lideObdobi.filter((l) => l.hloubka !== 'medailonek' && adresa(l.id)).sort((a, b) => zacatek(a) - zacatek(b));
  // Na mapě: u každého člověka s profilem nebo portrétem jedno místo (poslední působení, jinak rodiště), nejvýš dvě
  // jména u místa. Medailonky na mapu nejdou: v egejském výřezu by se popisky přes sebe nevešly.
  const sPortretem = new Set((await getCollection('osobnosti')).flatMap((p) => [p.data.osoba, ...(p.data.dalsi ?? [])]));
  const mista = new Map<string, string[]>();
  for (const l of sProfilem.filter((x) => sPortretem.has(x.id))) {
    const m = l.mista.findLast((x) => x.role === 'pusobeni') ?? l.mista.find((x) => x.role === 'narozeni');
    if (m) mista.set(m.misto, [...new Set([...(mista.get(m.misto) ?? []), l.jmeno])]);
  }
  const mistaMapy: MistoMiniMapy[] = [...mista.entries()].map(([id, jmena]) => {
    const m = mistaPodleId.get(id)!;
    const radky = jmena.length > 2 ? [jmena.slice(0, 2).join(', '), `a další ${jmena.length - 2}`] : [jmena.join(', ')];
    return { nazev: m.nazev, souradnice: m.souradnice as [number, number], radky };
  });
  const oddily = oddilyObdobi({
    osa: udalosti.length,
    otazky: otazkyDoby.length,
    lide: sProfilem.length + smery.length,
    cesty: cesty.length,
    mapa: mistaMapy.length,
  });
  return { o, fm, adresa, udalosti, otazkyDoby, cesty, smery, lideObdobi, sProfilem, mistaMapy, oddily };
}
