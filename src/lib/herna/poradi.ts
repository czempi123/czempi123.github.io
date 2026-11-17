// Seřaď na ose (herna-v1, K1): karty z dat, zamíchání, které nikdy nezačne hotové, vyhodnocení dvojic,
// přesuny a stav bloku v deníku. Čisté funkce; ostrov src/components/ostrovy/SeradNaOse.svelte, testy tests/data/herna.test.ts.
import { zamichej } from './michani';
import { verdikt, type Verdikt } from './verdikt';

/** Kolik špatných kontrol, než se nabídne „Ukázat pořadí“. */
export const POKUSU_DO_UKAZANI = 3;

const NBSP = '\u00a0';

/** Rok s „asi“ podle dat: „asi 620 př. n. l.“, „399 př. n. l.“, „121 n. l.“. */
export function rokKarty(r: number, priblizne = false): string {
  const t = r < 0 ? `${-r}${NBSP}př.${NBSP}n.${NBSP}l.` : `${r}${NBSP}n.${NBSP}l.`;
  return priblizne ? `asi${NBSP}${t}` : t;
}

/** Rozpětí události: „431–404 př. n. l.“, „41–49 n. l.“, „334 př. n. l. – 14 n. l.“ */
function rozpetiKarty(od: number, do_: number): string {
  if ((od < 0) === (do_ < 0)) {
    const era = od < 0 ? `${NBSP}př.${NBSP}n.${NBSP}l.` : `${NBSP}n.${NBSP}l.`;
    return `${Math.abs(od)}–${Math.abs(do_)}${era}`;
  }
  return `${rokKarty(od)} – ${rokKarty(do_)}`;
}

/** Zápis karty v YAML bloku: člověk (narození nebo smrt), nebo událost z udalosti.yaml. */
export interface ZaznamKarty {
  osoba?: string;
  kdy?: 'narozeni' | 'umrti';
  udalost?: string;
  /** vlastní text karty („Platón umírá“); jinak jméno nebo název události */
  text?: string;
  /** věta „zkus to jinak“, když karta visí v obrácené dvojici */
  napoveda?: string;
}
interface Datum { rok: number; priblizne?: boolean }
export interface OsobaKarty { jmeno: string; narozen?: Datum; zemrel?: Datum }
export interface UdalostKarty { nazev: string; od: number; do?: number }

export interface KartaOsy {
  text: string;
  /** rok, podle kterého se řadí */
  rok: number;
  /** rok, jak se ukáže po správném pořadí */
  rokText: string;
  napoveda?: string;
}

/** Karta ze zápisu a dat; chyba, když osoba, událost nebo rok v datech chybí. */
export function kartaOsy(z: ZaznamKarty, osoby: Map<string, OsobaKarty>, udalosti: Map<string, UdalostKarty>): KartaOsy {
  if (z.osoba) {
    const o = osoby.get(z.osoba);
    if (!o) throw new Error(`Seřaď na ose: osoba „${z.osoba}“ není v lide.yaml.`);
    const d = z.kdy === 'umrti' ? o.zemrel : o.narozen;
    if (!d) throw new Error(`Seřaď na ose: u „${z.osoba}“ chybí v lide.yaml ${z.kdy === 'umrti' ? 'rok smrti' : 'rok narození'}.`);
    return { text: z.text ?? o.jmeno, rok: d.rok, rokText: rokKarty(d.rok, d.priblizne), napoveda: z.napoveda };
  }
  if (z.udalost) {
    const u = udalosti.get(z.udalost);
    if (!u) throw new Error(`Seřaď na ose: událost „${z.udalost}“ není v udalosti.yaml.`);
    return { text: z.text ?? u.nazev, rok: u.od, rokText: u.do !== undefined ? rozpetiKarty(u.od, u.do) : rokKarty(u.od), napoveda: z.napoveda };
  }
  throw new Error('Seřaď na ose: karta potřebuje osobu, nebo událost.');
}

/** Chyby sady karet: méně než tři, nebo dva stejné roky (pořadí by nešlo poznat). */
export function chybyKaret(karty: Pick<KartaOsy, 'text' | 'rok'>[]): string[] {
  const chyby: string[] = [];
  if (karty.length < 3) chyby.push('Seřaď na ose potřebuje aspoň tři karty.');
  const videno = new Map<number, string>();
  for (const k of karty) {
    const jina = videno.get(k.rok);
    if (jina) chyby.push(`Seřaď na ose: „${jina}“ a „${k.text}“ mají stejný rok ${k.rok}.`);
    videno.set(k.rok, k.text);
  }
  return chyby;
}

/** Ve které dvojici sousedů karty sedí: [i] platí pro místo i a i+1. */
export function dvojice(poradi: readonly number[], roky: readonly number[]): boolean[] {
  const vysledek: boolean[] = [];
  for (let i = 0; i + 1 < poradi.length; i++) vysledek.push(roky[poradi[i]] < roky[poradi[i + 1]]);
  return vysledek;
}

export interface VysledekPoradi {
  dvojice: boolean[];
  sedi: boolean;
}
export function vyhodnotPoradi(poradi: readonly number[], roky: readonly number[]): VysledekPoradi {
  const d = dvojice(poradi, roky);
  return { dvojice: d, sedi: d.every(Boolean) };
}

/** Správné pořadí indexů karet. */
export function spravnePoradi(roky: readonly number[]): number[] {
  return roky.map((_, i) => i).sort((a, b) => roky[a] - roky[b]);
}

/**
 * Zamíchání podle id bloku: nikdy hotové a nejvýš polovina dvojic sedí hned na začátku. Zkouší semínka id, id#1…;
 * kdyby žádné nevyhovělo, vezme obrácené pořadí.
 */
export function zamichaniOsy(roky: readonly number[], klic: string): number[] {
  const indexy = roky.map((_, i) => i);
  const mez = Math.floor((roky.length - 1) / 2);
  for (let pokus = 0; pokus < 50; pokus++) {
    const p = zamichej(indexy, pokus ? `${klic}#${pokus}` : klic);
    if (dvojice(p, roky).filter(Boolean).length <= mez) return p;
  }
  return spravnePoradi(roky).reverse();
}

/** Karta z místa z přesunutá na místo na (ostatní se posunou). */
export function presun(poradi: readonly number[], z: number, na: number): number[] {
  const p = [...poradi];
  if (z < 0 || z >= p.length || na < 0 || na >= p.length) return p;
  const [k] = p.splice(z, 1);
  p.splice(na, 0, k);
  return p;
}

/** Karty na místech i a j si vymění místa. */
export function prohod(poradi: readonly number[], i: number, j: number): number[] {
  const p = [...poradi];
  if (i < 0 || j < 0 || i >= p.length || j >= p.length) return p;
  [p[i], p[j]] = [p[j], p[i]];
  return p;
}

/** Verdikt kontroly: u „zkus to jinak“ věta o první obrácené dvojici (napověda karty, jinak obě jména). */
export function verdiktPoradi(karty: readonly Pick<KartaOsy, 'text' | 'rok' | 'napoveda'>[], poradi: readonly number[]): Verdikt {
  const v = vyhodnotPoradi(poradi, karty.map((k) => k.rok));
  if (v.sedi) return verdikt(true);
  const i = v.dvojice.indexOf(false);
  const a = karty[poradi[i]];
  const b = karty[poradi[i + 1]];
  return verdikt(false, a.napoveda ?? b.napoveda ?? `„${a.text}“ a „${b.text}“ zatím visí obráceně.`);
}

export const stejnePoradi = (a: readonly number[] | null | undefined, b: readonly number[] | null | undefined): boolean =>
  !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);

/** Stav bloku v deníku (stav bloku, src/lib/denik.ts): pořadí, pořadí při poslední kontrole, počet špatných kontrol. */
export interface StavOsy {
  poradi: number[];
  /** pořadí, které student naposledy zkontroloval (značky dvojic a lístek „zkus to jinak“) */
  kontrola: number[] | null;
  pokusy: number;
  hotovo: boolean;
  /** pořadí ukázal atlas („Ukázat pořadí“), ne student */
  ukazano: boolean;
}

const jePoradi = (x: unknown, n: number): x is number[] =>
  Array.isArray(x) && x.length === n && new Set(x).size === n && x.every((i) => Number.isInteger(i) && i >= 0 && i < n);

/** Uložený stav, jen když sedí na počet karet; jinak null (blok začne znovu). */
export function platnyStavOsy(s: unknown, n: number): StavOsy | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavOsy>;
  if (!jePoradi(o.poradi, n)) return null;
  const kontrola = o.kontrola === null || o.kontrola === undefined ? null : jePoradi(o.kontrola, n) ? o.kontrola : null;
  const pokusy = Number.isInteger(o.pokusy) && (o.pokusy as number) >= 0 ? (o.pokusy as number) : 0;
  return { poradi: o.poradi, kontrola, pokusy, hotovo: o.hotovo === true, ukazano: o.ukazano === true };
}
