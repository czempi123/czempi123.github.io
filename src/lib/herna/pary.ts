// Páry (herna-v1, K3): pojem z kolekce pojmy a situace ze života šestnáctiletého. Student spojuje klepnutím na
// pojem a situaci (nebo výběrem v seznamu u pojmu); u pojmu stojí první věta jeho vysvětlení, takže se nehádá,
// uvažuje se. Mezi situacemi jsou pasti: věta, která pojem jen připomíná stejným slovem. Pár, který nesedí, dostane
// „zkus to jinak“ s větou, co ta situace ukazuje místo toho; po spojení všech jedna věta ke každému páru.
// Do deníku jen stav. Čisté funkce; ostrov src/components/ostrovy/Pary.svelte, testy tests/data/herna-k3.test.ts.
import { zamichej } from './michani';
import { verdikt, type Verdikt } from './verdikt';

export interface ParZaznam {
  /** id pojmu v kolekci pojmy */
  pojem: string;
  /** situace, která pojem ukazuje */
  situace: string;
  /** co situace ukazuje, když ji student spojí s jiným pojmem (bez jména pojmu) */
  jinak: string;
  /** jedna věta k páru po spojení všech */
  vazba: string;
}
export interface PastZaznam {
  /** situace, ve které jde jen o stejné slovo v běžném smyslu */
  situace: string;
  /** pojem, který situace jen připomíná */
  pripomina: string;
  /** co situace ukazuje místo pojmu */
  jinak: string;
}
export interface SituacePar { id: string; text: string; jinak: string; past: boolean }

/** Id situace: u správného páru id pojmu, u pasti „past-1“, „past-2“… */
export const idPasti = (i: number) => `past-${i + 1}`;

/** Situace v pořadí podle semínka (id bloku): stejné při sestavení, po hydrataci i po obnovení. */
export function situacePar(pary: readonly ParZaznam[], pasti: readonly PastZaznam[], klic: string): SituacePar[] {
  return zamichej(
    [
      ...pary.map((p) => ({ id: p.pojem, text: p.situace, jinak: p.jinak, past: false })),
      ...pasti.map((p, i) => ({ id: idPasti(i), text: p.situace, jinak: p.jinak, past: true })),
    ],
    klic,
  );
}

/** Pár sedí, když situace patří k pojmu (id situace je id pojmu). */
export const sediPar = (pojem: string, situace: string) => pojem === situace;

/** Pokus jako text „pojem|situace“ (stav v deníku). */
export const pokusPar = (pojem: string, situace: string) => `${pojem}|${situace}`;

/** Sedí, nebo zkus to jinak s větou, co situace ukazuje místo toho. */
export function verdiktPar(pojem: string, situace: SituacePar): Verdikt {
  return sediPar(pojem, situace.id) ? verdikt(true) : verdikt(false, situace.jinak);
}

/** Po kolika párech, které nesedí, se nabídne Ukázat páry. */
export const PARU_DO_UKAZANI = 3;

export interface StavPar {
  /** pojmy, které jsou správně spojené, v pořadí, jak je student spojil */
  spojeno: string[];
  /** páry, které nesedí („pojem|situace“), v pořadí pokusů */
  vedle: string[];
  /** poslední čin byl pár, který nesedí: ukáže se jeho čára a lístek „zkus to jinak“ */
  posledni: string | null;
  ukazano: boolean;
}
export const PRAZDNY_STAV_PAR: StavPar = { spojeno: [], vedle: [], posledni: null, ukazano: false };

/** Spojí pojem se situací: správný pár přibude do spojených, jiný do pokusů vedle. */
export function spojPar(s: StavPar, pojem: string, situace: string): StavPar {
  if (s.ukazano || s.spojeno.includes(pojem) || s.spojeno.includes(situace)) return s;
  if (sediPar(pojem, situace)) return { ...s, spojeno: [...s.spojeno, pojem], posledni: null };
  const p = pokusPar(pojem, situace);
  return { ...s, vedle: s.vedle.includes(p) ? s.vedle : [...s.vedle, p], posledni: p };
}

/** Všechny pojmy jsou spojené (sám, nebo po Ukázat páry). */
export const hotovePary = (s: StavPar, pojmy: readonly string[]) => s.ukazano || pojmy.every((p) => s.spojeno.includes(p));

/** Uložený stav, jen když sedí na pojmy a situace bloku; jinak null. */
export function platnyStavPar(s: unknown, pojmy: readonly string[], situace: readonly string[]): StavPar | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavPar>;
  if (!Array.isArray(o.spojeno) || !Array.isArray(o.vedle)) return null;
  const pokusOk = (x: unknown): x is string => {
    if (typeof x !== 'string') return false;
    const [p, si] = x.split('|');
    return pojmy.includes(p) && situace.includes(si) && !sediPar(p, si);
  };
  const spojeno = [...new Set(o.spojeno.filter((x): x is string => typeof x === 'string' && pojmy.includes(x)))];
  const vedle = [...new Set(o.vedle.filter(pokusOk))];
  const posledni = pokusOk(o.posledni) ? o.posledni : null;
  if (!spojeno.length && !vedle.length && !o.ukazano) return null;
  return { spojeno, vedle, posledni, ukazano: o.ukazano === true };
}

/** Chyby bloku: pojem není v kolekci, opakuje se, past připomíná pojem mimo blok, situace se opakuje. */
export function chybyPar(b: { pary: readonly ParZaznam[]; pasti: readonly PastZaznam[] }, pojmy: Set<string>): string[] {
  const chyby: string[] = [];
  const vBloku = b.pary.map((p) => p.pojem);
  for (const p of vBloku) if (!pojmy.has(p)) chyby.push(`Páry: pojem „${p}“ není v src/content/pojmy.`);
  if (new Set(vBloku).size !== vBloku.length) chyby.push('Páry: pojem se v bloku opakuje.');
  for (const p of b.pasti) if (!vBloku.includes(p.pripomina)) chyby.push(`Páry: past „${p.situace.slice(0, 40)}…“ připomíná pojem „${p.pripomina}“, který v bloku není.`);
  const texty = [...b.pary.map((p) => p.situace), ...b.pasti.map((p) => p.situace)].map((t) => t.trim().toLocaleLowerCase('cs'));
  if (new Set(texty).size !== texty.length) chyby.push('Páry: situace se v bloku opakuje.');
  return chyby;
}
