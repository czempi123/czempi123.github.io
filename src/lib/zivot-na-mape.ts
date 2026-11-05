// Život na mapě (interaktivita-v2, K2): zastávky života z kdeVRoce, Předchozí a Další zastávka,
// časový plán přehrávání a texty zastávek. Čisté funkce bez DOM; běží při sestavení i v prohlížeči.
// Letopočty: záporné = př. n. l.; rok nula neexistuje, plán proto počítá v astronomickém číslování.
import { kdeVRoce, zivotOsoby, vekVRoce, posunRok, naAstro, zAstro, let_, type OsobaMapy, type Poloha } from './cas-mapy';
import { rok as rokText } from './casy';

const NBSP = '\u00a0';

export interface Zastavka {
  /** první rok na tomhle místě */
  rok: number;
  misto: string;
  role: Poloha['role'];
  /** věk v roce zastávky, nebo null, když neznáme narození */
  vek: number | null;
  /** rok přibližný: první zastávka u přibližného narození nebo u doby činnosti */
  asiRok: boolean;
  /** přibližný rok narození: věk s „asi“ */
  asiVek: boolean;
  /**
   * Rok příchodu data neříkají: kdeVRoce přesune člověka z rodiště na působiště bez času v osmnácti
   * (nebo v roce, odkud ho nic jiného nedrží). Zastávka v přehrávání je, ale text rok ani věk netvrdí.
   */
  odvozena: boolean;
}

/**
 * Zastávky života: rok po roku od narození do smrti (u lidí bez nich doba činnosti) a nová zastávka,
 * kdykoli kdeVRoce vrátí jiné místo. Rok zastávky je jistý, když místo pochází z pobytu s časem, nebo když
 * člověk na místo přišel hned po konci pobytu s časem (Sókratés se z Potidaie vrací do Athén roku 431).
 */
export function zastavkyZivota(o: OsobaMapy): Zastavka[] {
  const z = zivotOsoby(o);
  if (!z) return [];
  const out: Zastavka[] = [];
  let predtimUrcite = false;
  for (let r = z.od; naAstro(r) <= naAstro(z.do); r = posunRok(r, 1)) {
    const kde = kdeVRoce(o, r);
    if (!kde) continue;
    const posledni = out[out.length - 1];
    if (posledni && posledni.misto === kde.misto) {
      predtimUrcite = kde.urcite && kde.role !== 'narozeni';
      continue;
    }
    const prvni = !posledni;
    out.push({
      rok: r,
      misto: kde.misto,
      role: kde.role,
      vek: vekVRoce(o, r),
      asiRok: prvni && (z.jenCinnost || !!o.narozen?.priblizne),
      asiVek: !!o.narozen?.priblizne,
      odvozena: !prvni && !kde.urcite && !predtimUrcite,
    });
    predtimUrcite = kde.urcite && kde.role !== 'narozeni';
  }
  return out;
}

/** Oddíl Život na mapě mají jen lidé s aspoň dvěma různými místy za život. */
export function maZastavky(o: OsobaMapy): boolean {
  return new Set(zastavkyZivota(o).map((z) => z.misto)).size >= 2;
}

/** Index zastávky, na které je člověk v roce r (poslední, která začala nejpozději v r), nebo −1. */
export function zastavkaVRoce(zastavky: Zastavka[], r: number): number {
  let i = -1;
  for (const [j, z] of zastavky.entries()) if (naAstro(z.rok) <= naAstro(r)) i = j;
  return i;
}

/** Rok předchozí zastávky: začátek té, která začala před rokem r (uprostřed pobytu tedy jeho začátek). */
export function predchoziZastavka(zastavky: Zastavka[], r: number): number | null {
  const pred = zastavky.filter((z) => naAstro(z.rok) < naAstro(r));
  return pred.length ? pred[pred.length - 1].rok : null;
}

/** Rok další zastávky po roce r. */
export function dalsiZastavka(zastavky: Zastavka[], r: number): number | null {
  return zastavky.find((z) => naAstro(z.rok) > naAstro(r))?.rok ?? null;
}

// ─── Přehrávání ──────────────────────────────────────────────────────────────

export interface NastaveniPrehravani {
  /** jak dlouho trvá celý život bez zastavení (ms) */
  delka: number;
  /** jak dlouho stojí rok na každé zastávce (ms) */
  zastaveni: number;
}
export const PREHRAVANI: NastaveniPrehravani = { delka: 10_000, zastaveni: 1_000 };

interface Usek {
  t0: number;
  t1: number;
  /** astronomické roky na začátku a konci úseku; u zastavení stejné */
  a0: number;
  a1: number;
}
export interface PlanPrehravani {
  useky: Usek[];
  /** celková délka (ms) */
  celkem: number;
  od: number;
  do: number;
}

/**
 * Plán: rok běží rovnoměrně od narození do smrti (celý život za `delka`) a na každé zastávce stojí `zastaveni`.
 * Zastávka v roce narození stojí hned na začátku, zastávka v roce smrti na konci.
 */
export function planPrehravani(o: OsobaMapy, zastavky: Zastavka[], n: NastaveniPrehravani = PREHRAVANI): PlanPrehravani | null {
  const z = zivotOsoby(o);
  if (!z) return null;
  const [A0, A1] = [naAstro(z.od), naAstro(z.do)];
  const naRok = A1 > A0 ? n.delka / (A1 - A0) : 0;
  const useky: Usek[] = [];
  let t = 0;
  let a = A0;
  for (const zs of zastavky) {
    const cil = Math.min(A1, Math.max(A0, naAstro(zs.rok)));
    if (cil > a) {
      useky.push({ t0: t, t1: t + (cil - a) * naRok, a0: a, a1: cil });
      t += (cil - a) * naRok;
      a = cil;
    }
    useky.push({ t0: t, t1: t + n.zastaveni, a0: a, a1: a });
    t += n.zastaveni;
  }
  if (A1 > a) {
    useky.push({ t0: t, t1: t + (A1 - a) * naRok, a0: a, a1: A1 });
    t += (A1 - a) * naRok;
  }
  return { useky, celkem: t, od: z.od, do: z.do };
}

/**
 * Čas v plánu, kdy rok poprvé dojde na r: přehrání po Zastavit pokračuje odtud. Rok na zastávce vrátí začátek
 * jejího zastavení (zastávka postojí znovu); rok mimo život nebo rok smrti začátek plánu (přehraje se celý).
 */
export function casProRok(plan: PlanPrehravani, r: number): number {
  const a = naAstro(r);
  if (a <= naAstro(plan.od) || a >= naAstro(plan.do)) return 0;
  for (const u of plan.useky) {
    if (u.a0 === u.a1 && u.a0 === a) return u.t0;
    if (u.a1 > u.a0 && a >= u.a0 && a < u.a1) return u.t0 + ((a - u.a0) / (u.a1 - u.a0)) * (u.t1 - u.t0);
  }
  return 0;
}

/** Rok v čase t od spuštění (přes rok nula); po konci plánu rok smrti. */
export function rokVCase(plan: PlanPrehravani, t: number): number {
  if (t >= plan.celkem) return plan.do;
  if (t <= 0) return plan.od;
  const u = plan.useky.find((x) => t < x.t1) ?? plan.useky[plan.useky.length - 1];
  const f = u.t1 > u.t0 ? (t - u.t0) / (u.t1 - u.t0) : 0;
  // Drobná rezerva proti zaokrouhlení: čas z casProRok musí vrátit tentýž rok.
  return zAstro(Math.floor(u.a0 + f * (u.a1 - u.a0) + 1e-6));
}

// ─── Texty ───────────────────────────────────────────────────────────────────

const ROLE: Record<Poloha['role'], string> = {
  narozeni: 'rodiště', studium: 'studium', pusobeni: 'působení', pobyt: 'pobyt', exil: 'vyhnanství', tazeni: 'vojenské tažení', smrt: 'místo smrti',
};
export const roleZastavky = (z: Zastavka) => ROLE[z.role];

/** „347 př. n. l.“, „asi 427 př. n. l.“; u odvozené zastávky nic (rok data neříkají). */
export function rokZastavky(z: Zastavka): string {
  if (z.odvozena) return '';
  return `${z.asiRok ? `asi${NBSP}` : ''}${rokText(z.rok)}`;
}

/**
 * „37 let“, „asi 37 let“, v rodišti v roce narození „narodil se“ / „narodila se“.
 * Prázdné bez známého narození, u odvozené zastávky a v roce narození mimo rodiště (Plótínos v Alexandrii).
 */
export function vekZastavky(z: Zastavka, o: Pick<OsobaMapy, 'zena'>): string {
  if (z.vek === null || z.odvozena) return '';
  if (z.vek === 0) return z.role === 'narozeni' ? (o.zena ? 'narodila se' : 'narodil se') : '';
  return `${z.asiVek ? `asi${NBSP}` : ''}${let_(z.vek)}`;
}

/** Řádek pod názvem místa: „pobyt · 347 př. n. l. · 37 let“. */
export function radekZastavky(z: Zastavka, o: Pick<OsobaMapy, 'zena'>): string {
  return [roleZastavky(z), rokZastavky(z), vekZastavky(z, o)].filter(Boolean).join(' · ');
}

/**
 * Oznámení pro čtečku: „Assos, 347 př. n. l., 37 let.“; u místa smrti „…, 62 let, zemřel tu.“;
 * u odvozené zastávky jen místo a role („Athény, působení.“).
 */
export function oznameniZastavky(z: Zastavka, nazev: string, o: Pick<OsobaMapy, 'zena'>): string {
  const casti = [nazev, z.odvozena ? roleZastavky(z) : '', rokZastavky(z), vekZastavky(z, o)].filter(Boolean);
  if (z.role === 'smrt') casti.push(o.zena ? 'zemřela tu' : 'zemřel tu');
  return `${casti.join(', ')}.`;
}

/** Texty oddílu na jednom místě (testy hlídají přesné znění). */
export const ZIVOT_NA_MAPE = {
  nadpis: 'Život na mapě',
  prehrat: 'Přehrát',
  zastavit: 'Zastavit',
  predchozi: 'Předchozí',
  predchoziCelkem: 'Předchozí zastávka',
  dalsi: 'Další',
  dalsiCelkem: 'Další zastávka',
  seznam: 'Zastávky života',
  odkaz: 'Přehrát život na mapě',
} as const;
