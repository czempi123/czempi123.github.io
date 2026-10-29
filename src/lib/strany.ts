// Kdo je na tvé straně: poslední krok cesty ukáže v každém oddílu nejdřív zastánce odpovědi, kterou student
// v bloku cesty zvolil, a ostatní odpovědi sbalí (src/components/ostrovy/Strany.svelte).
// Čisté funkce bez DOM: z uloženého stavu bloku (denik.ts › stavBloku) přečtou odpověď studenta a spočítají,
// v jakém pořadí se potomci oddílu ukážou. Nic se neukládá; když odpověď chybí, oddíl zůstane jako v sestavené stránce.
import { STRED, platnaPoloha, platnyStavVolby, pismeno } from './bloky';

/** Bloky, jejichž odpověď oddíl umí přečíst. Roztřiď (karty v koších) a Odkryj (vlastní text) ne. */
export type DruhStran = 'volba' | 'spor' | 'zmena';

/** Kód odpovědi Sporu pro studenta, který zůstal uprostřed. */
export const UPROSTRED = 'uprostred';

/** Text nad sbalenými odpověďmi a štítek nad odpovědí studenta. */
export const JINE_ODPOVEDI = 'Kdo hájil jiné odpovědi';
export const NA_TVE_STRANE = 'Na tvé straně';

export interface PopisStran {
  druh: DruhStran;
  /**
   * Kódy odpovědí v pořadí bloku, jak je autor píše do `<Strana odpoved="…">`.
   * Volba: písmena karet (A, B, C, D). Spor: strana první a druhá (id osoby, bez osoby `strana-1` / `strana-2`);
   * k nim patří ještě UPROSTRED. Změň jednu věc: id možností.
   */
  kody: string[];
}

/** Obsah bloku z YAML, jak ho zná obal (jen pole, která tu jsou potřeba). */
export type BlokProStrany =
  | { druh: 'volba'; moznosti: unknown[] }
  | { druh: 'spor'; strany: { osoba?: string }[] }
  | { druh: 'zmena'; moznosti: { id: string }[] }
  | { druh: string };

/** Popis odpovědí bloku, nebo null, když blok odpověď, ke které by patřili zastánci, nemá (Roztřiď, Odkryj…). */
export function popisStran(blok: BlokProStrany | undefined): PopisStran | null {
  if (!blok) return null;
  if (blok.druh === 'volba' && 'moznosti' in blok) return { druh: 'volba', kody: blok.moznosti.map((_, i) => pismeno(i)) };
  if (blok.druh === 'spor' && 'strany' in blok) return { druh: 'spor', kody: blok.strany.slice(0, 2).map((s, i) => s.osoba ?? `strana-${i + 1}`) };
  if (blok.druh === 'zmena' && 'moznosti' in blok) return { druh: 'zmena', kody: (blok.moznosti as { id: string }[]).map((m) => m.id) };
  return null;
}

/** Všechny kódy, které smí stát v `<Strana odpoved>` u tohoto bloku (Spor má navíc UPROSTRED). */
export function platneKody(p: PopisStran): string[] {
  return p.druh === 'spor' ? [...p.kody, UPROSTRED] : p.kody;
}

/** Rozloží atribut `odpoved` („A“, „A C“, „seneca“) na kódy. */
export const kodyStrany = (odpoved: string): string[] => odpoved.split(/[\s,]+/).filter(Boolean);

/**
 * Odpověď studenta z uloženého stavu bloku, nebo null. Volba: zvolená karta, jen když ji student potvrdil.
 * Spor: konečná poloha (blíž první straně, UPROSTRED, nebo blíž druhé); první poloha nestačí.
 * Změň jednu věc: základní rozhodnutí. Chybějící nebo neplatný stav dá null.
 */
export function odpovedStudenta(p: PopisStran | null, stav: unknown): string | null {
  if (!p || !stav || typeof stav !== 'object') return null;
  if (p.druh === 'volba') {
    const s = platnyStavVolby(stav, p.kody.length);
    return s?.potvrzeno ? p.kody[s.vyber] : null;
  }
  if (p.druh === 'spor') {
    const konecna = platnaPoloha((stav as { prvni?: unknown; konecna?: unknown }).konecna);
    if (konecna === null || platnaPoloha((stav as { prvni?: unknown }).prvni) === null) return null;
    if (konecna === STRED) return UPROSTRED;
    return p.kody[konecna < STRED ? 0 : 1] ?? null;
  }
  if (p.druh === 'zmena') {
    const zaklad = (stav as { zaklad?: unknown }).zaklad;
    return typeof zaklad === 'string' && p.kody.includes(zaklad) ? zaklad : null;
  }
  return null;
}

export interface RozvrhOddilu {
  /** potomci před první odpovědí (patří všem), v původním pořadí */
  pred: number[];
  /** odpovědi studenta: stojí na místě první odpovědi */
  tvoje: number[];
  /** ostatní odpovědi: pod sbaleným „Kdo hájil jiné odpovědi“; prázdné, když jiné nejsou */
  jine: number[];
  /** potomci, kteří patří všem a stáli za první odpovědí, v původním pořadí */
  po: number[];
}

/**
 * Pořadí potomků oddílu po přeskládání. `potomci[i]` jsou kódy, ke kterým potomek patří, nebo null (patří všem).
 * Null (nic se nepřeskládá), když odpověď chybí nebo k ní v oddílu nic nepatří: student pak vidí oddíl celý.
 */
export function rozvrhOddilu(potomci: (string[] | null)[], odpoved: string | null): RozvrhOddilu | null {
  if (odpoved === null) return null;
  const prvni = potomci.findIndex((k) => k !== null);
  if (prvni < 0 || !potomci.some((k) => k?.includes(odpoved))) return null;
  const r: RozvrhOddilu = { pred: [], tvoje: [], jine: [], po: [] };
  potomci.forEach((k, i) => {
    if (k === null) (i < prvni ? r.pred : r.po).push(i);
    else (k.includes(odpoved) ? r.tvoje : r.jine).push(i);
  });
  return r;
}
