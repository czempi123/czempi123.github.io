// Kdo je na tvé straně: poslední krok cesty ukáže v každém oddílu nejdřív zastánce odpovědi, kterou student
// v bloku cesty zvolil, a ostatní odpovědi sbalí (src/components/ostrovy/Strany.svelte).
// Čisté funkce bez DOM: z uloženého stavu bloku (denik.ts › stavBloku) přečtou odpověď studenta a spočítají,
// v jakém pořadí se potomci oddílu ukážou. Nic se neukládá; když odpověď chybí, oddíl zůstane jako v sestavené stránce.
import { POLOHY, STRED, platnaPoloha, platnyStavVolby, pismeno } from './bloky';

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
 * Co odpovedStudenta potřebuje z bloky.ts. Funkce bere pomůcky jako parametr, aby šla vložit jako text
 * do skriptu před vykreslením (skriptStranPredem): pravidlo odpovědi je jedno, ne opis.
 */
export interface PomuckyStran {
  platnyStavVolby: typeof platnyStavVolby;
  platnaPoloha: typeof platnaPoloha;
  STRED: number;
}
const POMUCKY_STRAN: PomuckyStran = { platnyStavVolby, platnaPoloha, STRED };

/**
 * Odpověď studenta z uloženého stavu bloku, nebo null. Volba: zvolená karta, jen když ji student potvrdil.
 * Spor: konečná poloha (blíž první straně, UPROSTRED, nebo blíž druhé); první poloha nestačí.
 * Změň jednu věc: základní rozhodnutí. Chybějící nebo neplatný stav dá null.
 * Tělo smí sahat jen na parametry (a na řetězec „uprostred“): vkládá se jako text do skriptu před vykreslením.
 */
export function odpovedStudenta(p: PopisStran | null, stav: unknown, h: PomuckyStran = POMUCKY_STRAN): string | null {
  if (!p || !stav || typeof stav !== 'object') return null;
  if (p.druh === 'volba') {
    const s = h.platnyStavVolby(stav, p.kody.length);
    return s?.potvrzeno ? p.kody[s.vyber] : null;
  }
  if (p.druh === 'spor') {
    const konecna = h.platnaPoloha((stav as { prvni?: unknown; konecna?: unknown }).konecna);
    if (konecna === null || h.platnaPoloha((stav as { prvni?: unknown }).prvni) === null) return null;
    if (konecna === h.STRED) return 'uprostred';
    return p.kody[konecna < h.STRED ? 0 : 1] ?? null;
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

/** Za kolik milisekund po načtení stránky se skryté odpovědi ukážou samy, když se ostrov nehydratoval. */
export const POJISTKA_STRAN = 4000;

/**
 * Skript před vykreslením, který stojí hned za ostrovem oddílu (Strany.astro): přečte deník a odpovědi, které
 * nejsou studentovy, skryje (`hidden`) dřív, než se stránka poprvé vykreslí. Ostrov je po hydrataci přesune pod
 * „Kdo hájil jiné odpovědi“, ukáže je a atribut `data-predem` sundá (revize R, nález 3: oddíl jinak problikl celý
 * a text pak uskočil o stovky pixelů). Odpověď i rozvrh počítají tytéž funkce jako ostrov; vkládají se jako text.
 * Bez zápisu, bez JavaScriptu nebo s neplatným stavem skript nic nezmění. `textDeniku` je výraz TEXT_DENIKU_SKRIPT.
 */
export function skriptStranPredem(blok: string, popis: PopisStran, textDeniku: string): string {
  const json = (x: unknown) => JSON.stringify(x).replace(/</g, '\\u003c');
  return `(function () {
  var s = document.currentScript;
  try {
    var o = s && s.previousElementSibling;
    var obal = o && (o.matches('[data-strany]') ? o : o.querySelector('[data-strany]'));
    if (!obal) return;
    var d = JSON.parse(${textDeniku} || 'null');
    if (!d || d.verze !== 1 || !d.bloky) return;
    var POLOHY = ${POLOHY};
    var h = { platnyStavVolby: ${platnyStavVolby.toString()}, platnaPoloha: ${platnaPoloha.toString()}, STRED: ${STRED} };
    var odpoved = (${odpovedStudenta.toString()})(${json(popis)}, d.bloky[${json(blok)}], h);
    var kody = ${kodyStrany.toString()};
    var koren = obal.querySelector(':scope > astro-slot') || obal;
    var potomci = Array.prototype.slice.call(koren.children);
    var r = (${rozvrhOddilu.toString()})(potomci.map(function (e) { return e.hasAttribute('data-odpoved') ? kody(e.getAttribute('data-odpoved')) : null; }), odpoved);
    if (!r) return;
    r.jine.forEach(function (i) { potomci[i].hidden = true; });
    obal.setAttribute('data-predem', '');
    addEventListener('load', function () {
      setTimeout(function () {
        if (!obal.hasAttribute('data-predem')) return;
        r.jine.forEach(function (i) { potomci[i].hidden = false; });
        obal.removeAttribute('data-predem');
      }, ${POJISTKA_STRAN});
    });
  } catch (e) { /* úložiště nedostupné: oddíl zůstane celý */ }
})();`;
}
