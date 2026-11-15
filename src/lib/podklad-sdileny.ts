// Obrys pobřeží mini mapy jako sdílený soubor (revize R, otázka 4). Stránky osob se stejným výřezem (většina má
// výchozí egejský) odkazují na jeden soubor /podklad/<klíč>.svg, který prohlížeč stáhne jednou; dřív nesla každá
// stránka tentýž obrys znovu (asi 50 kB). Výřez, který mezi sdílenými není (společný profil, stránka období
// a tradice s vlastními místy), zůstává v stránce jako dřív. Soubory dělá src/pages/podklad/[klic].svg.ts.
import type { TOsoba } from './schema';
import { data, mistaPodleId } from './data';
import { vyrezMiniMapy, type MistoMiniMapy, type Vyrez } from './mapa';
import { rok as fmtRok } from './casy';
import { ROLE_UDALOSTI } from './cas-mapy';

/**
 * Místa osob mini mapy sloučená podle id, s rolemi a roky („narození 384 př. n. l.“, „smrt“). Společný profil
 * (víc osob) má u role, čí je („narození Hipparchie“).
 */
export function mistaMiniMapy(osobyMapy: TOsoba[]): Map<string, MistoMiniMapy> {
  const mista = new Map<string, MistoMiniMapy>();
  for (const [o, m] of osobyMapy.flatMap((o) => o.mista.map((m) => [o, m] as const))) {
    const misto = mistaPodleId.get(m.misto)!;
    const rok = m.rok ?? m.od;
    const koho = osobyMapy.length > 1 ? ` ${o.jmeno2 ?? o.jmeno}` : '';
    // Přibližný rok (priblizne v datech) nese „asi“, stejně jako letopočty života.
    const popis = `${ROLE_UDALOSTI[m.role]}${koho}${rok !== undefined ? ` ${m.priblizne ? 'asi ' : ''}${fmtRok(rok)}` : ''}`;
    const b = mista.get(m.misto) ?? { nazev: misto.nazev, souradnice: misto.souradnice as [number, number], radky: [] };
    b.radky.push(popis);
    mista.set(m.misto, b);
  }
  // Dva pobyty na jednom místě, z nichž první nemá rok začátku (Seneca v Římě do roku 41 a znovu od roku 49),
  // by daly „působení“ a pod ním „působení 49 n. l.“: holý řádek vedle téhož s rokem nic neříká, proto vypadne.
  for (const b of mista.values()) {
    b.radky = b.radky.filter((r) => !b.radky.some((jiny) => jiny !== r && jiny.startsWith(`${r} `)));
  }
  return mista;
}

/** Krátký stálý klíč výřezu pro jméno souboru (djb2 v základu 36). */
export function klicVyrezu(v: Vyrez): string {
  const s = JSON.stringify([v.sirka, v.vyska, v.stred, v.meritko, v.rovnobezky].map((x) => (Array.isArray(x) ? x.map((n) => +n.toFixed(4)) : +(+x).toFixed(4))));
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

let sdilene: Map<string, Vyrez> | null = null;
/** Výřezy mini map všech lidí, každý jednou. */
export function sdileneVyrezy(): Map<string, Vyrez> {
  if (sdilene) return sdilene;
  sdilene = new Map();
  for (const o of data.lide) {
    if (!o.mista.length) continue;
    const v = vyrezMiniMapy([...mistaMiniMapy([o]).values()]);
    sdilene.set(klicVyrezu(v), v);
  }
  return sdilene;
}
