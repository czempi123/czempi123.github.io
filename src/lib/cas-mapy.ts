// Časová logika Mapy a času. Čisté funkce bez závislosti na Astru, běží při sestavení i v prohlížeči.
// Letopočty: záporné = př. n. l., kladné = n. l.; rok nula neexistuje (po −1 následuje 1).
import { rozdilLet, rok as rokText } from './casy';
import type { TDatum, TOsoba, TVztah, TObdobi } from './schema';

const NBSP = '\u00A0';

/** Osoba, jak ji potřebuje mapa (podmnožina TOsoba). */
export type OsobaMapy = Pick<TOsoba, 'id' | 'jmeno' | 'narozen' | 'zemrel' | 'aktivni' | 'mista'> &
  Partial<Pick<TOsoba, 'jmeno2' | 'zena' | 'obdobi' | 'tradice'>>;

// ─── Letopočty bez roku nula ──────────────────────────────────────────────────

/** Astronomické číslování (1 př. n. l. = 0, 2 př. n. l. = −1), ve kterém se dá normálně sčítat. */
export function naAstro(r: number): number {
  return r < 0 ? r + 1 : r;
}
export function zAstro(a: number): number {
  return a <= 0 ? a - 1 : a;
}

/** Posun o n let přes přelom letopočtu: posunRok(−1, 1) = 1, posunRok(1, −1) = −1. */
export function posunRok(r: number, n: number): number {
  return zAstro(naAstro(r) + n);
}

/** Omezí rok na rozsah [od, do]. */
export function omezRok(r: number, od: number, do_: number): number {
  return Math.min(do_, Math.max(od, r));
}

// ─── Život ────────────────────────────────────────────────────────────────────

export interface Zivot {
  od: number;
  do: number;
  /** známe jen dobu činnosti, ne narození a úmrtí */
  jenCinnost: boolean;
  odPriblizne: boolean;
  doPriblizne: boolean;
  /** jak rozumět konci: přesné/přibližné úmrtí, „před“, „po“, konec zpráv o činnosti */
  konec: 'umrti' | 'pred' | 'po' | 'cinnost';
}

/** Interval, ve kterém je osoba na mapě: od narození do úmrtí včetně; bez nich doba činnosti. */
export function zivotOsoby(o: Pick<TOsoba, 'narozen' | 'zemrel' | 'aktivni'>): Zivot | null {
  const n = o.narozen?.rok ?? o.aktivni?.od;
  const z = o.zemrel?.rok ?? o.aktivni?.do;
  if (n === undefined || z === undefined) return null;
  const konec: Zivot['konec'] = o.zemrel
    ? o.zemrel.nejpozdeji ? 'pred' : o.zemrel.nejdrive ? 'po' : 'umrti'
    : 'cinnost';
  return {
    od: n,
    do: z,
    jenCinnost: !o.narozen && !o.zemrel,
    odPriblizne: o.narozen ? !!o.narozen.priblizne : true,
    doPriblizne: !o.zemrel || !!o.zemrel.priblizne,
    konec,
  };
}

/** Žije osoba v roce r? Od roku narození do roku úmrtí včetně. */
export function zijeVRoce(o: Pick<TOsoba, 'narozen' | 'zemrel' | 'aktivni'>, r: number): boolean {
  const z = zivotOsoby(o);
  return !!z && r >= z.od && r <= z.do;
}

/** Věk v roce r (celé roky, přes chybějící rok nula), nebo null, když neznáme narození. */
export function vekVRoce(o: Pick<TOsoba, 'narozen'>, r: number): number | null {
  if (!o.narozen) return null;
  return rozdilLet(o.narozen.rok, r);
}

// ─── Čeština ──────────────────────────────────────────────────────────────────

/** 1 rok, 2–4 roky, 5 a víc let. */
export function let_(n: number): string {
  const a = Math.abs(n);
  if (a === 1) return `${n}${NBSP}rok`;
  if (a >= 2 && a <= 4) return `${n}${NBSP}roky`;
  return `${n}${NBSP}let`;
}
/** „před 39 lety“, „před rokem“, „před 2 lety“ (7. pád). */
function lety7(n: number): string {
  return n === 1 ? 'rokem' : `${n}${NBSP}lety`;
}
const SLOVA = ['nula', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset', 'jedenáct', 'dvanáct', 'třináct', 'čtrnáct', 'patnáct', 'šestnáct', 'sedmnáct', 'osmnáct', 'devatenáct', 'dvacet'];
function slovem(n: number): string {
  return SLOVA[n] ?? String(n);
}
function zivotu(n: number): string {
  if (n === 1) return 'jeden lidský život';
  if (n >= 2 && n <= 4) return `${slovem(n)} lidské životy`;
  return `${slovem(n)} lidských životů`;
}
/** Ukončí větu tečkou, pokud už nekončí zkratkou s tečkou („př. n. l.“). */
const tecka = (s: string) => (s.endsWith('.') ? s : `${s}.`);
const tvar = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);

/** „rok 399 př. n. l.“ pro věty. */
export function rokVeVete(r: number): string {
  return rokText(r);
}

/** Věta do karty: „V roce 360 př. n. l. je mu asi 67 let.“ */
export function vetaOVeku(o: OsobaMapy, r: number): string | null {
  const v = vekVRoce(o, r);
  if (v === null) return null;
  const asi = o.narozen?.priblizne ? `asi${NBSP}` : '';
  if (v === 0) return tecka(`${tvar(o, 'Narodil', 'Narodila')} se roku ${rokText(r)}`);
  return `V roce ${rokText(r)} ${tvar(o, 'je mu', 'je jí')} ${asi}${let_(v)}.`;
}

/** Krátká zpráva, když vybraný člověk z mapy zmizí: „Platón zemřel roku 347 př. n. l.“ */
export function zpravaOSmrti(o: OsobaMapy): string {
  const z = zivotOsoby(o);
  if (!z) return '';
  const zemrel = tvar(o, 'zemřel', 'zemřela');
  switch (z.konec) {
    case 'umrti':
      return tecka(`${o.jmeno} ${zemrel} ${o.zemrel?.priblizne ? `asi${NBSP}` : ''}roku ${rokText(z.do)}`);
    case 'pred':
      return tecka(`${o.jmeno} ${zemrel} před rokem ${rokText(z.do)}`);
    case 'po':
      return tecka(`${o.jmeno} ${zemrel} po roce ${rokText(z.do)}`);
    default:
      return tecka(`Poslední zpráva o ${jmenoSestyPad(o)} je z roku ${rokText(z.do)}`);
  }
}
/** 6. pád jen pro zprávu o konci činnosti; 2. pád je v datech, 6. pád odvodíme z nejčastějších koncovek. */
function jmenoSestyPad(o: OsobaMapy): string {
  const j = o.jmeno;
  // Aspasie → Aspasii, Hipparchia → Hipparchii
  if (o.zena) return j.replace(/i[ae]$/, 'ii');
  // Aristippa → Aristippovi, Kratéta → Kratétovi
  const g = o.jmeno2 ?? j;
  return g.endsWith('a') ? `${g.slice(0, -1)}ovi` : j;
}

/**
 * Poznámka ke vztahu vzhledem ke zvolenému roku: „je mu 45 let“, „zemřel před 39 lety“,
 * „narodí se za 19 let“.
 */
export function poznamkaVRoce(o: OsobaMapy, r: number): string {
  const z = zivotOsoby(o);
  if (!z) return '';
  if (r < z.od) {
    const za = rozdilLet(r, z.od);
    if (z.jenCinnost) return `objeví se za ${let_(za)}`;
    return `${tvar(o, 'narodí se', 'narodí se')} za ${let_(za)}`;
  }
  if (r > z.do) {
    const pred = rozdilLet(z.do, r);
    if (z.konec === 'cinnost') return `poslední zpráva před ${lety7(pred)}`;
    const asi = z.doPriblizne || z.konec !== 'umrti' ? `asi${NBSP}` : '';
    return `${tvar(o, 'zemřel', 'zemřela')} před ${asi}${lety7(pred)}`;
  }
  const v = vekVRoce(o, r);
  if (v === null) return 'právě působí';
  return `${tvar(o, 'je mu', 'je jí')} ${o.narozen?.priblizne ? `asi${NBSP}` : ''}${let_(v)}`;
}

// ─── Vzdálenost mezi dvěma lidmi ──────────────────────────────────────────────

export interface Vzdalenost {
  druh: 'soucasne' | 'deli';
  let: number;
  asi: boolean;
  zivotu: number;
  text: string;
}

/** Délka jednoho „lidského života“ pro přirovnání. */
export const LIDSKY_ZIVOT = 75;

/** Žili současně, nebo kolik let je dělí (od úmrtí staršího po narození mladšího), přes chybějící rok nula. */
export function vzdalenost(a: OsobaMapy, b: OsobaMapy): Vzdalenost | null {
  const za = zivotOsoby(a);
  const zb = zivotOsoby(b);
  if (!za || !zb) return null;
  const asi = za.odPriblizne || za.doPriblizne || zb.odPriblizne || zb.doPriblizne;
  const A = asi ? `asi${NBSP}` : '';
  const od = Math.max(za.od, zb.od);
  const do_ = Math.min(za.do, zb.do);
  if (od <= do_) {
    const n = rozdilLet(od, do_);
    // Dvě ženy žily, jinak žili (Dva životy dovolí srovnat kohokoli s kýmkoli).
    const zili = a.zena && b.zena ? 'Žily' : 'Žili';
    const text = n === 0 ? `${zili} současně necelý rok.` : `${zili} současně ${A}${let_(n)}.`;
    return { druh: 'soucasne', let: n, asi, zivotu: 0, text };
  }
  const [driv, pozdeji] = za.do < zb.od ? [za, zb] : [zb, za];
  const n = rozdilLet(driv.do, pozdeji.od);
  const zivotuN = Math.max(1, Math.round(n / LIDSKY_ZIVOT));
  // „To jsou asi tři lidské životy“, ale „To je asi jeden lidský život“ a „To je asi pět lidských životů“.
  const je = zivotuN >= 2 && zivotuN <= 4 ? 'jsou' : 'je';
  const prirovnani = n >= 50 ? ` To ${je} asi ${zivotu(zivotuN)}.` : '';
  return { druh: 'deli', let: n, asi, zivotu: zivotuN, text: `Dělí je ${A}${let_(n)}.${prirovnani}` };
}

// ─── Kde je člověk v daném roce ───────────────────────────────────────────────

export type PobytOsoby = TOsoba['mista'][number];

export interface Poloha {
  misto: string;
  role: PobytOsoby['role'];
  /** místo z pobytu s časem (true), nebo odvozené z působiště či rodiště (false) */
  urcite: boolean;
}

/**
 * Kde osoba v roce r byla. Pořadí:
 * 1. pobyt s časem, který rok pokrývá (nejpozději začínající vyhrává; chybí-li „od“, platí od narození
 *    jen u lidí bez známého rodiště, jinak jen v roce „do“; chybí-li „do“, platí až do smrti),
 * 2. od 18 let působiště, studium nebo pobyt bez času (v pořadí dat),
 * 3. rodiště,
 * 4. jakékoli jiné místo kromě místa smrti.
 * Místo smrti platí jen v roce úmrtí.
 */
export function kdeVRoce(o: OsobaMapy, r: number): Poloha | null {
  const zivot = zivotOsoby(o);
  if (!zivot || r < zivot.od || r > zivot.do) return null;
  const mista = o.mista ?? [];
  const rodiste = mista.find((m) => m.role === 'narozeni');
  const n = o.narozen?.rok;

  // Místo smrti v roce úmrtí.
  if (o.zemrel && r === o.zemrel.rok) {
    const smrt = mista.find((m) => m.role === 'smrt');
    if (smrt) return { misto: smrt.misto, role: 'smrt', urcite: true };
  }
  let nejlepsi: { m: PobytOsoby; start: number } | null = null;
  for (const m of mista) {
    if (m.role === 'smrt') continue;
    let od: number;
    let do_: number;
    if (m.rok !== undefined) {
      od = m.rok;
      do_ = m.rok;
    } else if (m.od !== undefined || m.do !== undefined) {
      od = m.od ?? (rodiste ? m.do! : zivot.od);
      do_ = m.do ?? zivot.do;
    } else continue;
    if (r >= od && r <= do_ && (!nejlepsi || od >= nejlepsi.start)) nejlepsi = { m, start: od };
  }
  if (nejlepsi) return { misto: nejlepsi.m.misto, role: nejlepsi.m.role, urcite: true };

  const vek = n !== undefined ? rozdilLet(n, r) : null;
  const bezCasu = mista.filter((m) => m.rok === undefined && m.od === undefined && m.do === undefined);
  if (vek === null || vek >= 18 || !rodiste) {
    for (const role of ['pusobeni', 'studium', 'pobyt', 'exil'] as const) {
      const m = bezCasu.find((x) => x.role === role);
      if (m) return { misto: m.misto, role: m.role, urcite: false };
    }
  }
  if (rodiste) return { misto: rodiste.misto, role: 'narozeni', urcite: rodiste.rok === r };
  const jine = mista.find((m) => m.role !== 'smrt');
  return jine ? { misto: jine.misto, role: jine.role, urcite: false } : null;
}

/** Když se osoba mezi předchozím rokem a rokem r přestěhovala, vrátí místo, odkud přišla. */
export function odkudPrisla(o: OsobaMapy, r: number): string | null {
  const ted = kdeVRoce(o, r);
  const predtim = kdeVRoce(o, posunRok(r, -1));
  if (!ted || !predtim || ted.misto === predtim.misto) return null;
  // Tečkovaná cesta jen u doložených přesunů, ne při přechodu z rodiště na působiště.
  if (!ted.urcite && !predtim.urcite) return null;
  return predtim.misto;
}

// ─── Kdo je na mapě, stín odkazu, okno řeky ───────────────────────────────────

export function zijiciVRoce<T extends OsobaMapy>(lide: T[], r: number): T[] {
  return lide.filter((o) => zijeVRoce(o, r));
}

/**
 * Stín odkazu: zesnulí, na které v roce r přímo navazuje někdo žijící (je jejich žákem, četl je,
 * polemizoval s nimi nebo se s nimi znal).
 * Směr ve vztahu: u učitele a žáka a u vlivu přes texty navazuje `k` na `od`; u polemiky je to obráceně
 * (`od` polemizuje s `k`, navazuje tedy `od` na `k`); kdo se znali, navazují na sebe navzájem.
 */
export function stinOdkazu<T extends OsobaMapy>(lide: T[], vztahy: Pick<TVztah, 'od' | 'k' | 'typ'>[], r: number): T[] {
  const podleId = new Map(lide.map((o) => [o.id, o]));
  const vysledek = new Set<string>();
  for (const v of vztahy) {
    const pary: [string, string][] = v.typ === 'znali-se' ? [[v.od, v.k], [v.k, v.od]] : v.typ === 'polemika' ? [[v.k, v.od]] : [[v.od, v.k]];
    for (const [mrtvy, zivy] of pary) {
      const m = podleId.get(mrtvy);
      const z = podleId.get(zivy);
      if (!m || !z) continue;
      const zm = zivotOsoby(m);
      if (zm && r > zm.do && zijeVRoce(z, r)) vysledek.add(mrtvy);
    }
  }
  return lide.filter((o) => vysledek.has(o.id));
}

/** Okno řeky kolem roku r: ± polovina šířky, posunuté tak, aby nevyjelo z rozsahu atlasu. */
export function oknoReky(r: number, sirka: number, rozsah: [number, number]): [number, number] {
  const a = naAstro(r);
  let od = a - Math.floor(sirka / 2);
  let do_ = od + sirka;
  const [min, max] = [naAstro(rozsah[0]), naAstro(rozsah[1])];
  if (od < min) {
    do_ += min - od;
    od = min;
  }
  if (do_ > max) {
    od -= do_ - max;
    do_ = max;
  }
  return [zAstro(Math.max(od, min)), zAstro(do_)];
}

/** Lidé, jejichž život zasahuje do okna [od, do]. */
export function lideVOkne<T extends OsobaMapy>(lide: T[], okno: [number, number]): T[] {
  return lide.filter((o) => {
    const z = zivotOsoby(o);
    return !!z && z.do >= okno[0] && z.od <= okno[1];
  });
}

// ─── Období ───────────────────────────────────────────────────────────────────

/** Období pro rok: zůstane aktuální, pokud rok leží v jeho okně; jinak první období, které rok obsahuje. */
export function obdobiProRok(obdobi: Pick<TObdobi, 'id' | 'okno'>[], r: number, aktualni?: number): number {
  const akt = obdobi.find((o) => o.id === aktualni);
  if (akt && r >= akt.okno.od && r <= akt.okno.do) return akt.id;
  const v = obdobi.find((o) => r >= o.okno.od && r <= o.okno.do);
  if (v) return v.id;
  // Mimo všechna okna: nejbližší.
  let nej = obdobi[0];
  for (const o of obdobi) {
    const d = Math.min(Math.abs(r - o.okno.od), Math.abs(r - o.okno.do));
    const dn = Math.min(Math.abs(r - nej.okno.od), Math.abs(r - nej.okno.do));
    if (d < dn) nej = o;
  }
  return nej.id;
}

/** Zkrácený popis letopočtu na osu: „350“ s „př. n. l.“ jen u prvního a přes přelom. */
export function popisOsy(r: number): string {
  return String(Math.abs(r));
}

export function datumText(d: TDatum | undefined): string {
  if (!d) return '';
  return `${d.priblizne ? `asi${NBSP}` : ''}${rokText(d.rok)}`;
}
