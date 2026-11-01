// Data atlasu pro stránky. Při sestavení se ověří schémata i všechny kontroly;
// chyba zastaví build dřív, než se dostane ke studentům.
import lide from '../data/lide.yaml?raw';
import mista from '../data/mista.yaml?raw';
import vztahy from '../data/vztahy.yaml?raw';
import udalosti from '../data/udalosti.yaml?raw';
import obdobi from '../data/obdobi.yaml?raw';
import zdroje from '../data/zdroje.yaml?raw';
import krajiny from '../data/krajiny.yaml?raw';
import { vsechnyKontroly } from './kontroly';
import { cekajiciAtributy } from './cekajici';
import type { TOsoba, TVztah } from './schema';
import { sporNaDalku } from './vztahy';

const smery = Object.keys(import.meta.glob('../content/smery/*.{md,mdx}')).map((p) =>
  p.split('/').pop()!.replace(/\.mdx?$/, ''),
);

const tradice = Object.keys(import.meta.glob('../content/nabozenstvi/[^_]*.{md,mdx}')).map((p) =>
  p.split('/').pop()!.replace(/\.mdx?$/, ''),
);

const vysledek = vsechnyKontroly({ lide, mista, vztahy, udalosti, obdobi, zdroje, krajiny }, { smery, tradice }, cekajiciAtributy);
if (vysledek.chyby.length) {
  throw new Error(`Data atlasu neprošla kontrolou:\n- ${vysledek.chyby.join('\n- ')}`);
}

export const data = vysledek.data;
export const osoby = new Map(data.lide.map((o) => [o.id, o]));
export const mistaPodleId = new Map(data.mista.map((m) => [m.id, m]));
export const obdobiPodleId = new Map(data.obdobi.map((o) => [o.id, o]));
export const pramenyPodleId = new Map(data.zdroje.prameny.map((p) => [p.id, p]));
export const citatyPodleId = new Map(data.zdroje.citaty.map((c) => [c.id, c]));

export function osoba(id: string): TOsoba {
  const o = osoby.get(id);
  if (!o) throw new Error(`Osoba „${id}“ není v lide.yaml`);
  return o;
}

export function vztahyOsoby(id: string): { vztah: TVztah; druhy: TOsoba; smer: 'od' | 'k'; naDalku: boolean }[] {
  const ja = osoba(id);
  return data.vztahy
    .filter((v) => v.od === id || v.k === id)
    .map((v) => {
      const druhy = osoba(v.od === id ? v.k : v.od);
      return { vztah: v, druhy, smer: v.od === id ? 'od' : 'k', naDalku: sporNaDalku(v, ja, druhy) };
    });
}

/**
 * Řetězy učitel → žák od dané osoby dál (Sókratés → Platón → Aristotelés).
 * Ukazují se jen řetězy, které vedou k profilu či portrétu, nebo mají aspoň čtyři články.
 */
export function kdoNavazoval(id: string, hloubka = 4): { lide: TOsoba[]; tradovany: boolean[] }[] {
  const zaci = (x: string) => data.vztahy.filter((v) => v.od === x && v.typ === 'ucitel');
  const retezy: { lide: TOsoba[]; tradovany: boolean[] }[] = [];
  const projdi = (x: string, lide: TOsoba[], trad: boolean[]) => {
    const dalsi = zaci(x).filter((v) => !lide.some((c) => c.id === v.k));
    if (!dalsi.length || lide.length > hloubka) {
      const posledni = lide[lide.length - 1];
      if (lide.length >= 4 || (lide.length === 3 && posledni.hloubka !== 'medailonek')) retezy.push({ lide, tradovany: trad });
      return;
    }
    for (const v of dalsi) projdi(v.k, [...lide, osoba(v.k)], [...trad, !!v.tradovany]);
  };
  projdi(id, [osoba(id)], []);
  return retezy;
}
