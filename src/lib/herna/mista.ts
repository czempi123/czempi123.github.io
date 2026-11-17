// Kde to bylo? (herna-v1, K2): slepá mapa, špendlík a vzdálenost jen slovem. Pointa není trefit bod, ale proč tam
// člověk byl (vyhnanství, škola, tažení): věta z dat o pobytu (role a roky z lide.yaml). Bez kilometrů a bodů.
// Čisté funkce; ostrov src/components/ostrovy/KdeToBylo.svelte, testy tests/data/herna.test.ts.
import { rok as fmtRok } from '../casy';
import type { TOsoba } from '../schema';

type Pobyt = TOsoba['mista'][number];

/** Vzdálenost tipu od místa slovem; „sedí“ do 250 km (ostrov, poloostrov, kus pobřeží). */
export function vzdalenostSlovem(km: number): { slovo: string; sedi: boolean } {
  if (km <= 80) return { slovo: 'přesně tam', sedi: true };
  if (km <= 250) return { slovo: 'blízko', sedi: true };
  if (km <= 600) return { slovo: 'kus dál', sedi: false };
  return { slovo: 'o moře dál', sedi: false };
}

/** Vzdálenost dvou bodů výřezu v km podle měřítka podkladu (px úsečky a její km). */
export function kmMezi(a: readonly [number, number], b: readonly [number, number], meritko: { px: number; km: number }): number {
  return (Math.hypot(a[0] - b[0], a[1] - b[1]) * meritko.km) / meritko.px;
}

const tvar = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);

/** Co tam člověk dělal: sloveso a doplněk podle role pobytu („žil“ + „ve vyhnanství“). */
function cinnost(o: { zena?: boolean }, role: Pobyt['role']): [string, string] {
  switch (role) {
    case 'exil': return [tvar(o, 'žil', 'žila'), ' ve vyhnanství'];
    case 'studium': return [tvar(o, 'studoval', 'studovala'), ''];
    case 'pusobeni': return [tvar(o, 'učil', 'učila'), tvar(o, ' a působil', ' a působila')];
    case 'pobyt': return [tvar(o, 'pobýval', 'pobývala'), ''];
    case 'tazeni': return [tvar(o, 'byl', 'byla'), ' na vojenském tažení'];
    case 'narozeni': return [`se ${tvar(o, 'narodil', 'narodila')}`, ''];
    case 'smrt': return [tvar(o, 'zemřel', 'zemřela'), ''];
  }
}

/** Kdy: „v letech 41–49 n. l.“, „od roku 93 n. l.“, „do roku 41 n. l.“, „roku 399 př. n. l.“, nebo nic. */
function kdy(m: Pick<Pobyt, 'od' | 'do' | 'rok' | 'priblizne'>): string {
  const asi = m.priblizne ? 'asi ' : '';
  if (m.od !== undefined && m.do !== undefined) {
    const obe = (m.od < 0) === (m.do < 0);
    const r = obe ? `${Math.abs(m.od)}–${fmtRok(m.do)}` : `${fmtRok(m.od)} – ${fmtRok(m.do)}`;
    return ` v letech ${asi}${r}`;
  }
  if (m.od !== undefined) return ` od roku ${asi}${fmtRok(m.od)}`;
  if (m.do !== undefined) return ` do roku ${asi}${fmtRok(m.do)}`;
  if (m.rok !== undefined) return ` roku ${asi}${fmtRok(m.rok)}`;
  return '';
}

/** Věta z dat o pobytu: „Na Korsice žil Seneca ve vyhnanství v letech 41–49 n. l.“ (místo v 6. pádu z YAML). */
export function vetaPobytu(o: { jmeno: string; zena?: boolean }, m: Pick<Pobyt, 'role' | 'od' | 'do' | 'rok' | 'priblizne'>, kde: string): string {
  const [sloveso, doplnek] = cinnost(o, m.role);
  const veta = `${kde.charAt(0).toUpperCase()}${kde.slice(1)} ${sloveso} ${o.jmeno}${doplnek}${kdy(m)}`;
  return veta.endsWith('.') ? veta : `${veta}.`;
}

/** Pobyt osoby na místě: s rolí, je-li zadaná; jinak první s časem, jinak první vůbec. */
export function pobytOsoby(o: Pick<TOsoba, 'mista'>, misto: string, role?: Pobyt['role']): Pobyt | null {
  const naMiste = o.mista.filter((m) => m.misto === misto && (!role || m.role === role));
  return naMiste.find((m) => m.od !== undefined || m.do !== undefined || m.rok !== undefined) ?? naMiste[0] ?? null;
}

/**
 * Strany popisků po odhalení: název místa na straně dál od špendlíku, „tvůj tip“ na opačné, ať se nepotkají ani
 * se spojnicí. Když je tip skoro na místě (do 40 jednotek výřezu), tip popisek nemá.
 */
export function stranyKde(tip: readonly [number, number], misto: readonly [number, number], sirka: number): { misto: 'vlevo' | 'vpravo'; tip: 'vlevo' | 'vpravo' | null } {
  const blizko = Math.hypot(tip[0] - misto[0], tip[1] - misto[1]) < 40;
  let strana: 'vlevo' | 'vpravo' = tip[0] > misto[0] ? 'vlevo' : 'vpravo';
  if (strana === 'vpravo' && misto[0] > sirka * 0.75) strana = 'vlevo';
  if (strana === 'vlevo' && misto[0] < sirka * 0.25) strana = 'vpravo';
  if (blizko) return { misto: strana, tip: null };
  let tipStrana: 'vlevo' | 'vpravo' = tip[0] >= misto[0] ? 'vpravo' : 'vlevo';
  if (tipStrana === 'vpravo' && tip[0] > sirka * 0.8) tipStrana = 'vlevo';
  if (tipStrana === 'vlevo' && tip[0] < sirka * 0.2) tipStrana = 'vpravo';
  return { misto: strana, tip: tipStrana };
}

/** Stav bloku: tip v jednotkách výřezu, nebo nic. */
export function platnyStavKde(s: unknown, sirka: number, vyska: number): { tip: [number, number] } | null {
  if (!s || typeof s !== 'object') return null;
  const t = (s as { tip?: unknown }).tip;
  if (!Array.isArray(t) || t.length !== 2 || !t.every((x) => typeof x === 'number' && Number.isFinite(x))) return null;
  if (t[0] < 0 || t[0] > sirka || t[1] < 0 || t[1] > vyska) return null;
  return { tip: [t[0], t[1]] };
}
