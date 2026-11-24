// Soukromý deník studenta v localStorage (klíč atlas-denik). Nic se neodesílá; export do souboru.
// Když úložiště není dostupné (soukromé okno, zablokovaná data), deník funguje jen do zavření stránky.
import { jePero, type Pero } from './pero';

export interface Zapis {
  /** kde vznikl, např. „sokrates/nikdo-nedela-zlo“ */
  id: string;
  otazka: string;
  odpoved: string;
  odkaz: string;
  kdy: string;
  /** z jakého bloku zápis pochází (pro řazení v deníku); starší zápisy ho nemají */
  druh?: 'stanovisko' | 'odkryj' | 'volba' | 'zmena' | 'spor' | 'roztrid' | 'argument' | 'navrat' | 'slabe' | 'kdo-by' | 'sebehodnoceni';
}
export interface Vyzva {
  id: string;
  nazev: string;
  odkaz: string;
  prijato: string;
  poznamka?: string;
  /** kdy se naposledy změnila poznámka; jen pro spojení deníku ze souboru, nikde se neukazuje */
  upraveno?: string;
}
export interface Denik {
  verze: 1;
  zapisy: Zapis[];
  vyzvy: Vyzva[];
  navstivene: { odkaz: string; nazev: string; kdy: string }[];
  /**
   * Rozpracovaný stav interaktivních bloků podle id (vybraná karta, odkryto, odhad…).
   * Nezobrazuje se v deníku, ale vydrží obnovení stránky a je součástí exportu.
   */
  bloky: Record<string, unknown>;
  /** Poslední práce v blocích (nejnovější první): pro „Pokračuj, kde jsi skončil“ a deník. */
  aktivita: Aktivita[];
  /** Postup v cestách podle slugu cesty. */
  cesty: Record<string, PostupCesty>;
  /**
   * Naposledy čtený oddíl profilu: adresa stránky → kotva oddílu. Nepovinné (starší deníky ho nemají),
   * je součástí exportu. Staví z něj „Pokračovat ve čtení“ nahoře na profilu.
   */
  cteni?: Record<string, string>;
  /**
   * Dočtené kapitoly profilů: adresa stránky → kotvy kapitol, které student dočetl až do konce (kapitolaDoctena).
   * Nepovinné (starší deníky ho nemají), je součástí exportu. Z něj „Doma projdi“ na stránce hodiny odškrtne kapitoly.
   */
  prectene?: Record<string, string[]>;
  /** Hodiny, které student otevřel z odkazu (nejnovější první, nejvýš deset). Nepovinné; součást exportu. */
  hodiny?: HodinaVDeniku[];
  /**
   * Týdny cvičení (Stoický týden) podle id týdne: hotové dny, den, na kterém student skončil, a věta ze dne
   * s psaním. Nepovinné (starší deníky ho nemají), součást exportu. Přijetí týdne a poznámka jsou výzva (`vyzvy`).
   */
  tydny?: Record<string, StavTydne>;
  /**
   * Studentovo pero (src/lib/pero.ts): barva, kterou píše a volí. Nepovinné (bez volby modré), součást exportu.
   * Zapíše se při první odpovědi v bloku (nabídka pera v rámu aktivity) nebo volbou v deníku.
   */
  pero?: Pero;
  /**
   * Vystřižené citáty (design-v2, K6): co si student z citátu na stránce vystřihl do sbírky v deníku.
   * Znění a údaje se ukládají s citátem, aby sbírka stála i bez stránky. Nejnovější první; nepovinné, součást exportu.
   */
  citaty?: CitatVDeniku[];
  /**
   * Kartičky s rozestupem (denik-v2, K1): co si student sám dal do kartiček, podle klíče `${zdroj}:${ref}`
   * (např. „pojem:klid“, „zapis:<id zápisu>“). Nepovinné (starší deníky ho nemají), součást exportu.
   */
  karticky?: Record<string, Karticka>;
  /** Kdy si student deník naposledy zazálohoval (stáhl soubor, poslal odkazem); podle toho deník připomene zálohu. */
  zaloha?: string;
}

/** Vystřižený citát ve sbírce deníku. */
export interface CitatVDeniku {
  /** id citátu ze zdroje.yaml */
  id: string;
  text: string;
  /** autor, dílo a místo, jak stojí pod citátem */
  kde: string;
  /** stránka, odkud ho student vystřihl */
  odkaz: string;
  kdy: string;
  /** studentova poznámka „Proč sis ho vystřihl?“ (denik-v2); nepovinná */
  poznamka?: string;
  /** kdy se naposledy změnila poznámka; jen pro spojení deníku ze souboru (vyhraje novější), nikde se neukazuje */
  upraveno?: string;
}

/** Odkud kartička je: pojem, vystřižený citát, vlastní zápis v deníku, otázka Co ti zůstalo? */
export type ZdrojKarticky = 'pojem' | 'citat' | 'zapis' | 'zustalo';

/**
 * Kartička s rozestupem (denik-v2, Formáty). Pět přihrádek (Leitner): „Vím“ posune o přihrádku dál, „Zopakuj si“
 * vrátí do první. Žádné odpočty ani série: kartička nese jen přihrádku a místní datum posledního opakování.
 */
export interface Karticka {
  zdroj: ZdrojKarticky;
  /** id ve zdroji: pojem, citát ze zdroje.yaml, zápis v deníku, otázka kvízu */
  ref: string;
  /** 0 = nová, 1–5 = přihrádka */
  prihradka: number;
  /** místní datum posledního opakování (RRRR-MM-DD); nová ho nemá */
  naposledy?: string;
  /** kdy ji student přidal (ISO) */
  pridano: string;
  /** poslední změna (ISO); při spojení deníku ze souboru vyhraje novější */
  kdy: string;
}

/** Stav týdne cvičení v deníku. Žádná data dnů a žádné série: jen které dny jsou hotové. */
export interface StavTydne {
  /** hotové dny (1…N), seřazené */
  hotove: number[];
  /** den, na kterém student skončil (po Hotovo nebo Další den); podle něj se týden otevře */
  den?: number;
  /** věta sobě ze dne s psaním */
  veta?: string;
  /** poslední změna; jen pro spojení deníku ze souboru (vyhraje novější), nikde se neukazuje */
  kdy: string;
}

export interface HodinaVDeniku {
  /** adresa stránky hodiny (/hodina/?v=1&n=…&z=…) */
  adresa: string;
  nazev: string;
  /** kdy ji student naposledy otevřel (ISO) */
  kdy: string;
}

/** Druh bloku v aktivitě; hry herny (serad, kdo-rekl, tipni, kde, doplnit) ukládají jen stav, žádný zápis (plán herna-v1, Co platí). */
export type DruhBloku = 'odkryj' | 'volba' | 'zmena' | 'spor' | 'roztrid' | 'argument' | 'kdo-zil-driv' | 'serad' | 'kdo-rekl' | 'tipni' | 'kde' | 'doplnit' | 'pary' | 'pravy' | 'slabe' | 'kdo-by';
export interface Aktivita {
  id: string;
  odkaz: string;
  otazka: string;
  druh: DruhBloku;
  /** blok je dokončený (odkryto, potvrzeno, zapsáno) */
  hotovo: boolean;
  kdy: string;
}
export interface PostupCesty {
  nazev: string;
  /** počet kroků cesty */
  pocet: number;
  /** naposledy otevřený krok (1…pocet) */
  krok: number;
  /** kroky, které student otevřel */
  navstivene: number[];
  /** čas naposledy otevřeného kroku; posouvá se každou návštěvou */
  kdy: string;
  /**
   * Čas, kdy student poprvé otevřel všechny kroky cesty. Zapíše se jednou a pozdější návštěvy ho nemění;
   * počítá se od něj Návrat (src/lib/navrat.ts). Nepovinné: starší deníky ho nemají.
   */
  dokonceno?: string;
  /**
   * Čas, kdy se po posledním kroku odtrhl pahýl lístku cesty (design-v2, K5, bod 4). Pahýl tím „přistane v deníku“:
   * sbírku odtržených pahýlů ukáže Můj deník (K6). Zapíše se jednou; nepovinné.
   */
  pahyl?: string;
}

export const KLIC_DENIKU = 'atlas-denik';
const KLIC = KLIC_DENIKU;
/**
 * Deník promítání (větev hodiny-v1, krok H4) v sessionStorage: dokud v kartě existuje, nacti a uloz pracují
 * s ním místo s deníkem studenta. Promítat hodinu ho vždy založí prázdný (zalozDenikPromitani), konec
 * promítání a každý vstup do hodiny bez promítání ho smaže (zrusDenikPromitani; obojí volá src/lib/pruchod-hodiny.ts).
 * Bloky, Pokračuj, postup cest a dočtené kapitoly tak na plátně začínají od nuly a do deníku nezapíšou nic.
 */
export const KLIC_PROMITANI = 'atlas-denik-promitani';
const prazdny = (): Denik => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} });
let vPameti: Denik | null = null;
/** Deník promítání v paměti stránky (když sessionStorage chybí); zároveň znamená, že promítání běží. */
let promitaniVPameti: Denik | null = null;

/**
 * Výraz pro skripty před vykreslením (Domů, profil, stránka otázky): text deníku, jak ho čte nacti(),
 * při promítání tedy deník promítání. Vkládá se do textu skriptu.
 */
export const TEXT_DENIKU_SKRIPT = `(function () { try { var t = sessionStorage.getItem('${KLIC_PROMITANI}'); if (t !== null) return t; } catch (e) {} return localStorage.getItem('${KLIC}'); })()`;

/**
 * Tichá stránka: po konci promítání se stránka zastavení načte znovu (src/scripts/hodina-lista.ts) a to není
 * návštěva studenta. Automatické záznamy (otevřený krok, navštívená stránka, místo čtení, dočtená kapitola)
 * se pro tuto adresu nezapíší; co učitel udělá v bloku sám, ano. Platí do odchodu ze stránky.
 */
export const KLIC_TICHO = 'atlas-denik-ticho';

export function ztisStranku(cesta: string): void {
  try { sessionStorage.setItem(KLIC_TICHO, cesta); } catch { /* úložiště nedostupné */ }
}

export function zrusTicho(): void {
  try { sessionStorage.removeItem(KLIC_TICHO); } catch { /* úložiště nedostupné */ }
}

function tichaStranka(): boolean {
  try {
    const t = sessionStorage.getItem(KLIC_TICHO);
    if (t === null) return false;
    if (t === location.pathname) return true;
    sessionStorage.removeItem(KLIC_TICHO);
  } catch { /* úložiště nebo location nedostupné */ }
  return false;
}

/** Běží promítání (v kartě je deník promítání)? */
export function vPromitani(): boolean {
  try {
    if (sessionStorage.getItem(KLIC_PROMITANI) !== null) return true;
  } catch { /* úložiště nedostupné */ }
  return promitaniVPameti !== null;
}

/** Založí prázdný deník promítání (Promítat hodinu). Starý se zahodí. */
export function zalozDenikPromitani(): void {
  promitaniVPameti = prazdny();
  try { sessionStorage.setItem(KLIC_PROMITANI, JSON.stringify(promitaniVPameti)); } catch { /* jen v paměti stránky */ }
}

/** Smaže deník promítání (konec promítání, vstup do hodiny bez promítání). Deník studenta se nemění. */
export function zrusDenikPromitani(): void {
  promitaniVPameti = null;
  try { sessionStorage.removeItem(KLIC_PROMITANI); } catch { /* úložiště nedostupné */ }
}

export function nacti(): Denik {
  if (vPromitani()) {
    try {
      const d = rozeber(sessionStorage.getItem(KLIC_PROMITANI));
      if (d) return d;
    } catch { /* úložiště nedostupné */ }
    return promitaniVPameti ?? prazdny();
  }
  try {
    const d = rozeber(localStorage.getItem(KLIC));
    if (d) return d;
  } catch { /* úložiště nedostupné */ }
  return vPameti ?? prazdny();
}

/** Deník z textu úložiště s doplněnými a pročištěnými poli, nebo null. */
function rozeber(t: string | null): Denik | null {
  {
    if (t) {
      // Poškozený text vyhodí výjimku; nacti ji chytí jako nedostupné úložiště.
      const d = JSON.parse(t);
      if (d && d.verze === 1) {
        const plny = { ...prazdny(), ...d };
        const objekt = (x: unknown) => !!x && typeof x === 'object' && !Array.isArray(x);
        if (!objekt(plny.bloky)) plny.bloky = {};
        if (!objekt(plny.cesty)) plny.cesty = {};
        if (!Array.isArray(plny.aktivita)) plny.aktivita = [];
        if (plny.cteni !== undefined && !objekt(plny.cteni)) delete plny.cteni;
        if (plny.prectene !== undefined) {
          if (!objekt(plny.prectene)) delete plny.prectene;
          else plny.prectene = Object.fromEntries(Object.entries(plny.prectene).filter(([, k]) => Array.isArray(k)).map(([s, k]) => [s, (k as unknown[]).filter((x): x is string => typeof x === 'string')]));
        }
        if (plny.tydny !== undefined) {
          if (!objekt(plny.tydny)) delete plny.tydny;
          else plny.tydny = cisteTydny(plny.tydny);
        }
        if (plny.pero !== undefined && !jePero(plny.pero)) delete plny.pero;
        if (plny.hodiny !== undefined) {
          if (!Array.isArray(plny.hodiny)) delete plny.hodiny;
          else plny.hodiny = plny.hodiny.filter((h: Partial<HodinaVDeniku> | null) => !!h && typeof h.adresa === 'string' && typeof h.nazev === 'string' && typeof h.kdy === 'string');
        }
        if (plny.citaty !== undefined) {
          if (!Array.isArray(plny.citaty)) delete plny.citaty;
          else plny.citaty = cisteCitaty(plny.citaty);
        }
        if (plny.karticky !== undefined) {
          if (!objekt(plny.karticky)) delete plny.karticky;
          else plny.karticky = cisteKarticky(plny.karticky);
        }
        if (plny.zaloha !== undefined && typeof plny.zaloha !== 'string') delete plny.zaloha;
        return plny;
      }
    }
  }
  return null;
}

export function uloz(d: Denik): void {
  if (vPromitani()) {
    promitaniVPameti = d;
    try { sessionStorage.setItem(KLIC_PROMITANI, JSON.stringify(d)); } catch { /* zůstane v paměti stránky */ }
  } else {
    vPameti = d;
    try { localStorage.setItem(KLIC, JSON.stringify(d)); } catch { /* zůstane v paměti */ }
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('atlas-denik'));
}

export function ulozZapis(z: Omit<Zapis, 'kdy'>): void {
  const d = nacti();
  d.zapisy = [...d.zapisy.filter((x) => x.id !== z.id), { ...z, kdy: new Date().toISOString() }];
  uloz(d);
}

/** Smaže zápis (blok „Začít znovu“). */
export function smazZapis(id: string): void {
  const d = nacti();
  d.zapisy = d.zapisy.filter((x) => x.id !== id);
  uloz(d);
}

export function najdiZapis(id: string): Zapis | undefined {
  return nacti().zapisy.find((x) => x.id === id);
}

/** Uložený stav bloku, nebo undefined. Typ hlídá volající; neplatný stav blok zahodí sám. */
export function stavBloku<T>(id: string): T | undefined {
  return nacti().bloky[id] as T | undefined;
}

/** Uloží stav bloku; s `meta` ho zapíše i do poslední aktivity (Pokračuj, deník). */
export function ulozStavBloku(id: string, stav: unknown, meta?: Omit<Aktivita, 'id' | 'kdy'>): void {
  const d = nacti();
  d.bloky = { ...d.bloky, [id]: stav };
  if (meta) d.aktivita = [{ ...meta, id, kdy: new Date().toISOString() }, ...d.aktivita.filter((a) => a.id !== id)].slice(0, 30);
  uloz(d);
}

export function smazStavBloku(id: string): void {
  const d = nacti();
  const { [id]: _pryc, ...zbytek } = d.bloky;
  d.bloky = zbytek;
  d.aktivita = d.aktivita.filter((a) => a.id !== id);
  uloz(d);
}

/**
 * Čas dokončení cesty po další návštěvě kroku. Jednou zapsaný se nemění. Když student právě otevřel poslední
 * chybějící krok, je to `ted`. Starší deník, kde už byla cesta prošlá celá a čas dokončení chybí, dostane čas
 * svého naposledy otevřeného kroku: je to nejbližší údaj, který deník má. Nedokončená cesta nemá nic.
 */
export function dokonceniCesty(pred: Partial<PostupCesty> | undefined, navstivene: number[], pocet: number, ted: string): string | undefined {
  if (typeof pred?.dokonceno === 'string') return pred.dokonceno;
  if (navstivene.length < pocet) return undefined;
  const bylaCela = Array.isArray(pred?.navstivene) && typeof pred?.pocet === 'number' && pred.navstivene.length >= pred.pocet;
  return bylaCela && typeof pred?.kdy === 'string' ? pred.kdy : ted;
}

/** Zaznamená otevřený krok cesty; když tím student prošel všechny kroky, zapíše jednou čas dokončení. */
export function zaznamenejKrok(slug: string, krok: number, nazev: string, pocet: number): void {
  if (tichaStranka()) return;
  const d = nacti();
  const p = d.cesty[slug];
  const navstivene = [...new Set([...(p?.navstivene ?? []), krok])].sort((a, b) => a - b);
  const ted = new Date().toISOString();
  const dokonceno = dokonceniCesty(p, navstivene, pocet, ted);
  const pahyl = typeof p?.pahyl === 'string' ? { pahyl: p.pahyl } : {};
  d.cesty = { ...d.cesty, [slug]: { nazev, pocet, krok, navstivene, kdy: ted, ...(dokonceno ? { dokonceno } : {}), ...pahyl } };
  uloz(d);
}

/**
 * Po posledním kroku se pahýl lístku cesty odtrhne a přistane v deníku (K5, bod 4). Zapíše čas jednou;
 * vrací true, když se pahýl odtrhl teď (pohyb se přehraje), false, když už byl v deníku nebo cesta záznam nemá.
 */
export function odtrhniPahyl(slug: string): boolean {
  if (tichaStranka()) return false;
  const d = nacti();
  const p = d.cesty[slug];
  if (!p || typeof p.pahyl === 'string') return false;
  d.cesty = { ...d.cesty, [slug]: { ...p, pahyl: new Date().toISOString() } };
  uloz(d);
  return true;
}

/** Nejvýš tolik profilů si deník pamatuje pro „Pokračovat ve čtení“; nejdéle nečtený vypadne. */
const CTENI_NEJVYS = 30;

/** Zapamatuje naposledy čtený oddíl stránky (jen kotvu). Volá se při změně oddílu, ne při každém posunu. */
/** Zvolené pero, nebo undefined, když student ještě nevolil. */
export function peroDeniku(): Pero | undefined {
  const p = nacti().pero;
  return jePero(p) ? p : undefined;
}

export function ulozPero(p: Pero): void {
  const d = nacti();
  if (d.pero === p) return;
  uloz({ ...d, pero: p });
}

export function ulozCteni(odkaz: string, kotva: string): void {
  if (tichaStranka()) return;
  const d = nacti();
  if (d.cteni?.[odkaz] === kotva) return;
  const { [odkaz]: _stare, ...ostatni } = d.cteni ?? {};
  const zaznamy = [...Object.entries(ostatni), [odkaz, kotva] as const].filter(([, k]) => typeof k === 'string');
  d.cteni = Object.fromEntries(zaznamy.slice(-CTENI_NEJVYS));
  uloz(d);
}

/** Kotva naposledy čteného oddílu stránky, nebo undefined. */
export function cteniStranky(odkaz: string): string | undefined {
  const k = nacti().cteni?.[odkaz];
  return typeof k === 'string' ? k : undefined;
}

// ─── Dočtené kapitoly (Doma projdi, větev hodiny-v1, H3) ──────────────────────

/** Rychlost, nad kterou už student text jen přelétá (slov za minutu); kapitola pod ní je dočtená. */
export const PRELETENI_SLOV_ZA_MINUTU = 500;
/** Nejkratší čas v kapitole, i když je krátká. */
export const NEJKRATSI_CTENI_MS = 10_000;

/**
 * Je kapitola dočtená? Student dojel na její konec (spodní hrana kapitoly byla vidět nad spodním okrajem okna)
 * a strávil v ní aspoň tolik času, kolik by trvalo ji přelétnout rychlostí PRELETENI_SLOV_ZA_MINUTU
 * (nejméně NEJKRATSI_CTENI_MS). Čas se počítá, jen když je kapitola právě čtený oddíl a karta je vidět.
 */
export function kapitolaDoctena(k: { slov: number; casMs: number; konecVidet: boolean }): boolean {
  if (!k.konecVidet) return false;
  const potreba = Math.max(NEJKRATSI_CTENI_MS, (Math.max(0, k.slov) / PRELETENI_SLOV_ZA_MINUTU) * 60_000);
  return k.casMs >= potreba;
}

/** Deník s další dočtenou kapitolou stránky (bez opakování, v pořadí dočtení). Vrací nový objekt. */
export function sPrectenou(d: Denik, stranka: string, kotva: string): Denik {
  const pred = d.prectene?.[stranka] ?? [];
  if (pred.includes(kotva)) return d;
  return { ...d, prectene: { ...(d.prectene ?? {}), [stranka]: [...pred, kotva] } };
}

/** Zapíše dočtenou kapitolu do deníku (jednou). */
export function ulozPrectenou(stranka: string, kotva: string): void {
  if (tichaStranka()) return;
  const d = nacti();
  const novy = sPrectenou(d, stranka, kotva);
  if (novy !== d) uloz(novy);
}

/** Dočtené kapitoly podle adresy profilu (prázdné, když deník pole nemá). */
export function prectene(d: Denik = nacti()): Record<string, string[]> {
  return d.prectene ?? {};
}

// ─── Otevřené hodiny ──────────────────────────────────────────────────────────

/** Nejvýš tolik otevřených hodin si deník pamatuje; nejdéle neotevřená vypadne. */
export const HODINY_NEJVYS = 10;

/** Deník s otevřenou hodinou nahoře: stejná adresa se přesune nahoru s novým časem a názvem. Vrací nový objekt. */
export function sHodinou(d: Denik, h: { adresa: string; nazev: string }, kdy: string): Denik {
  const ostatni = (d.hodiny ?? []).filter((x) => x.adresa !== h.adresa);
  return { ...d, hodiny: [{ adresa: h.adresa, nazev: h.nazev, kdy }, ...ostatni].slice(0, HODINY_NEJVYS) };
}

/** Zapíše otevřenou hodinu do deníku. */
export function zaznamenejHodinu(adresa: string, nazev: string): void {
  uloz(sHodinou(nacti(), { adresa, nazev }, new Date().toISOString()));
}

// ─── Týdny cvičení (Stoický týden) ────────────────────────────────────────────

/** Jen platné záznamy týdnů (ruční úprava souboru nesmí rozbít deník). */
function cisteTydny(x: Record<string, unknown>): Record<string, StavTydne> {
  const ven: Record<string, StavTydne> = {};
  for (const [id, t] of Object.entries(x)) {
    if (!t || typeof t !== 'object' || Array.isArray(t)) continue;
    const r = t as Record<string, unknown>;
    if (typeof r.kdy !== 'string' || !Array.isArray(r.hotove)) continue;
    const hotove = [...new Set(r.hotove.filter((d): d is number => Number.isInteger(d) && (d as number) >= 1))].sort((a, b) => a - b);
    ven[id] = {
      hotove,
      ...(Number.isInteger(r.den) && (r.den as number) >= 1 ? { den: r.den as number } : {}),
      ...(typeof r.veta === 'string' ? { veta: r.veta } : {}),
      kdy: r.kdy,
    };
  }
  return ven;
}

/** Stav týdne v deníku, nebo undefined. */
export function stavTydne(id: string, d: Denik = nacti()): StavTydne | undefined {
  return d.tydny?.[id];
}

/** Deník se změněným stavem týdne (hotové dny, den, věta) a novým časem změny. Vrací nový objekt. */
export function sTydnem(d: Denik, id: string, zmena: Partial<Omit<StavTydne, 'kdy'>>, kdy: string): Denik {
  const pred = d.tydny?.[id] ?? { hotove: [], kdy };
  const novy: StavTydne = { ...pred, ...zmena, kdy };
  if (!novy.veta) delete novy.veta;
  return { ...d, tydny: { ...(d.tydny ?? {}), [id]: novy } };
}

/** Zapíše změnu týdne do deníku. */
export function ulozTyden(id: string, zmena: Partial<Omit<StavTydne, 'kdy'>>): void {
  uloz(sTydnem(nacti(), id, zmena, new Date().toISOString()));
}

/** Uloží poznámku k přijaté výzvě (prázdná poznámku smaže). Výzvu, která v deníku není, nezaloží. */
export function ulozPoznamkuVyzvy(id: string, poznamka: string): void {
  const d = nacti();
  const v = d.vyzvy.find((x) => x.id === id);
  if (!v) return;
  const text = poznamka.trim();
  if ((v.poznamka ?? '') === text) return;
  const { poznamka: _stara, ...bez } = v;
  const nova: Vyzva = { ...bez, ...(text ? { poznamka: text } : {}), upraveno: new Date().toISOString() };
  d.vyzvy = d.vyzvy.map((x) => (x.id === id ? nova : x));
  uloz(d);
}

export function prijmiVyzvu(v: Omit<Vyzva, 'prijato'>): void {
  const d = nacti();
  if (!d.vyzvy.some((x) => x.id === v.id)) d.vyzvy.push({ ...v, prijato: new Date().toISOString() });
  uloz(d);
}

// ─── Sbírka a záloha (design-v2, K6; poznámka a limit denik-v2, K1) ──────────

const jeCitat = (c: unknown): c is CitatVDeniku =>
  !!c && typeof c === 'object' && (['id', 'text', 'kde', 'odkaz', 'kdy'] as const).every((p) => typeof (c as Record<string, unknown>)[p] === 'string');

/** Citát se jen známými poli; poznámka a čas její změny zůstanou, jen když jsou to texty. */
function cistyCitat(c: CitatVDeniku): CitatVDeniku {
  const { id, text, kde, odkaz, kdy, poznamka, upraveno } = c;
  return {
    id, text, kde, odkaz, kdy,
    ...(typeof poznamka === 'string' && poznamka.trim() ? { poznamka: poznamka.trim() } : {}),
    ...(typeof upraveno === 'string' ? { upraveno } : {}),
  };
}

/** Platné citáty z neznámého pole (soubor, úložiště); jiné vypadnou. */
const cisteCitaty = (x: unknown): CitatVDeniku[] => (Array.isArray(x) ? x.filter(jeCitat).map(cistyCitat) : []);

/**
 * Nejvýš tolik vystřižených citátů drží sbírka. Když je plná, další citát se nevystřihne (sCitatem vrátí null);
 * nic tiše nevypadne, protože s citátem by zmizela i jeho poznámka a kartička.
 */
export const CITATY_NEJVYS = 300;

/** Je sbírka plná (nový citát už se nevystřihne)? */
export function sbirkaPlna(d: Denik): boolean {
  return (d.citaty?.length ?? 0) >= CITATY_NEJVYS;
}

/**
 * Deník s vystřiženým citátem navrchu sbírky, nebo null, když je sbírka plná a citát v ní ještě není.
 * Tentýž citát podruhé nepřibude: posune se navrch a poznámku si nechá.
 */
export function sCitatem(d: Denik, c: Omit<CitatVDeniku, 'kdy'>, kdy: string): Denik | null {
  const puvodni = d.citaty ?? [];
  const pred = puvodni.find((x) => x.id === c.id);
  if (!pred && puvodni.length >= CITATY_NEJVYS) return null;
  const novy = cistyCitat({ ...c, kdy, ...(pred?.poznamka ? { poznamka: pred.poznamka } : {}), ...(pred?.upraveno ? { upraveno: pred.upraveno } : {}) });
  return { ...d, citaty: [novy, ...puvodni.filter((x) => x.id !== c.id)] };
}

/** Vystřihne citát do sbírky. Vrací false, když je sbírka plná a citát se nevystřihl. */
export function vystrihniCitat(c: Omit<CitatVDeniku, 'kdy'>): boolean {
  const d = sCitatem(nacti(), c, new Date().toISOString());
  if (!d) return false;
  uloz(d);
  return true;
}

export function zrusCitat(id: string): void {
  const d = nacti();
  if (!d.citaty) return;
  d.citaty = d.citaty.filter((x) => x.id !== id);
  uloz(d);
}

export function maCitat(id: string, d: Denik = nacti()): boolean {
  return !!d.citaty?.some((x) => x.id === id);
}

/**
 * Deník s poznámkou k vystřiženému citátu (prázdná poznámku smaže). Citát, který ve sbírce není, nezaloží;
 * když se poznámka nemění, vrátí týž deník.
 */
export function sPoznamkouCitatu(d: Denik, id: string, poznamka: string, kdy: string): Denik {
  const c = d.citaty?.find((x) => x.id === id);
  if (!c) return d;
  const text = poznamka.trim();
  if ((c.poznamka ?? '') === text) return d;
  const { poznamka: _stara, ...bez } = c;
  const novy: CitatVDeniku = { ...bez, ...(text ? { poznamka: text } : {}), upraveno: kdy };
  return { ...d, citaty: d.citaty!.map((x) => (x.id === id ? novy : x)) };
}

/** Uloží poznámku „Proč sis ho vystřihl?“ k citátu ve sbírce. */
export function ulozPoznamkuCitatu(id: string, poznamka: string): void {
  const d = nacti();
  const novy = sPoznamkouCitatu(d, id, poznamka, new Date().toISOString());
  if (novy !== d) uloz(novy);
}

// ─── Kartičky s rozestupem (denik-v2, K1) ────────────────────────────────────
// Všechno se počítá v místních datech (RRRR-MM-DD), ne v hodinách: kartička z pondělního večera je na řadě
// ve středu ráno, i když od opakování neuplynulo 48 hodin. Žádné odpočty ani série; kdo nepřijde, nic neztratí.

/** Dny od posledního opakování podle přihrádky (index = přihrádka, 0 = nová kartička je na řadě hned). */
export const ROZESTUP = [0, 1, 3, 7, 16, 35] as const;
/** Poslední přihrádka; „Vím“ v ní kartičku nechá. */
export const PRIHRADKA_NEJVYS = ROZESTUP.length - 1;
/** Kolik kartiček má hromádka na dnes. */
export const HROMADKA = 5;
const ZDROJE_KARTICEK: readonly ZdrojKarticky[] = ['pojem', 'citat', 'zapis', 'zustalo'];
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

export const klicKarticky = (zdroj: ZdrojKarticky, ref: string): string => `${zdroj}:${ref}`;

/** Místní datum (RRRR-MM-DD) okamžiku; bez argumentu dnešek. */
export function mistniDatum(t: Date | string = new Date()): string {
  const d = typeof t === 'string' ? new Date(t) : t;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Datum o `dny` později. Počítá v UTC nad samotným datem, takže přechod na letní čas den neposune. */
export function posunDatum(datum: string, dny: number): string {
  const [r, m, d] = datum.split('-').map(Number);
  return new Date(Date.UTC(r, m - 1, d + dny)).toISOString().slice(0, 10);
}

/** Od kterého místního data je kartička na řadě: nová ode dne přidání, jinak poslední opakování + rozestup. */
export function naRadeOd(k: Karticka): string {
  return k.naposledy ? posunDatum(k.naposledy, ROZESTUP[k.prihradka] ?? ROZESTUP[PRIHRADKA_NEJVYS]) : mistniDatum(k.pridano);
}

/** Je kartička dnes na řadě? Nová (bez opakování) je na řadě vždy. */
export const jeNaRade = (k: Karticka, dnes: string): boolean => !k.naposledy || naRadeOd(k) <= dnes;

/** Kartička s neznámým polem z úložiště nebo souboru, nebo null; klíč se z ní skládá znovu. */
function cistaKarticka(x: unknown): Karticka | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;
  const k = x as Record<string, unknown>;
  if (!ZDROJE_KARTICEK.includes(k.zdroj as ZdrojKarticky) || typeof k.ref !== 'string' || !k.ref) return null;
  if (typeof k.pridano !== 'string' || typeof k.kdy !== 'string') return null;
  const prihradka = Number.isInteger(k.prihradka) ? Math.min(PRIHRADKA_NEJVYS, Math.max(0, k.prihradka as number)) : 0;
  const naposledy = typeof k.naposledy === 'string' && DATUM.test(k.naposledy) ? k.naposledy : undefined;
  return { zdroj: k.zdroj as ZdrojKarticky, ref: k.ref, prihradka: naposledy ? prihradka : 0, ...(naposledy ? { naposledy } : {}), pridano: k.pridano, kdy: k.kdy };
}

/** Jen platné kartičky, každá pod svým klíčem (ruční úprava souboru nesmí rozbít deník). */
function cisteKarticky(x: unknown): Record<string, Karticka> {
  const ven: Record<string, Karticka> = {};
  if (!x || typeof x !== 'object' || Array.isArray(x)) return ven;
  for (const v of Object.values(x)) {
    const k = cistaKarticka(v);
    if (k) ven[klicKarticky(k.zdroj, k.ref)] = k;
  }
  return ven;
}

/** Deník s novou kartičkou. Kartička, která už existuje, zůstane, jak je (přihrádka se nevynuluje). */
export function sKartickou(d: Denik, zdroj: ZdrojKarticky, ref: string, kdy: string): Denik {
  const klic = klicKarticky(zdroj, ref);
  if (d.karticky?.[klic]) return d;
  return { ...d, karticky: { ...(d.karticky ?? {}), [klic]: { zdroj, ref, prihradka: 0, pridano: kdy, kdy } } };
}

/** Deník bez kartičky. */
export function bezKarticky(d: Denik, klic: string): Denik {
  if (!d.karticky?.[klic]) return d;
  const { [klic]: _pryc, ...zbytek } = d.karticky;
  return { ...d, karticky: zbytek };
}

/** Hodnocení na rubu kartičky. */
export type HodnoceniKarticky = 'vim' | 'zopakuj';

/** Deník s ohodnocenou kartičkou: „Vím“ o přihrádku dál (nejvýš pátá), „Zopakuj si“ do první; dnes je poslední opakování. */
export function sHodnocenim(d: Denik, klic: string, hodnoceni: HodnoceniKarticky, dnes: string, kdy: string): Denik {
  const k = d.karticky?.[klic];
  if (!k) return d;
  const prihradka = hodnoceni === 'vim' ? Math.min(PRIHRADKA_NEJVYS, k.prihradka + 1) : 1;
  return { ...d, karticky: { ...d.karticky, [klic]: { ...k, prihradka, naposledy: dnes, kdy } } };
}

/**
 * Má kartička ještě svůj zdroj? Citát musí být ve sbírce a zápis v deníku s textem. Pojem a otázku kvízu deník
 * nezná: o nich rozhoduje volající (`zdrojExistuje`, z dat atlasu); bez něj se berou jako existující.
 * Kartička bez zdroje se nemaže, jen se neukazuje: vrátí se, když se zdroj vrátí (nové vystřižení, nová odpověď).
 */
export function maZdroj(d: Denik, k: Karticka, zdrojExistuje?: (k: Karticka) => boolean): boolean {
  if (k.zdroj === 'citat') return !!d.citaty?.some((c) => c.id === k.ref);
  if (k.zdroj === 'zapis') return d.zapisy.some((z) => z.id === k.ref && z.odpoved.trim() !== '');
  return zdrojExistuje ? zdrojExistuje(k) : true;
}

/** Má student kartičku z tohoto zdroje (stisknuté „Do kartiček“)? */
export function maKarticku(zdroj: ZdrojKarticky, ref: string, d: Denik = nacti()): boolean {
  return !!d.karticky?.[klicKarticky(zdroj, ref)];
}

/**
 * Kartičky na řadě, které mají zdroj, od té, která čeká nejdéle (podle dne, kdy na řadu přišla), pak podle přidání.
 * Kdo týden nepřijde, nic neztratí: čekající kartičky tu jsou všechny, jen v pořadí.
 */
export function naRade(d: Denik, dnes: string, zdrojExistuje?: (k: Karticka) => boolean): Karticka[] {
  return Object.values(d.karticky ?? {})
    .filter((k) => jeNaRade(k, dnes) && maZdroj(d, k, zdrojExistuje))
    .sort((a, b) => naRadeOd(a).localeCompare(naRadeOd(b)) || a.pridano.localeCompare(b.pridano) || klicKarticky(a.zdroj, a.ref).localeCompare(klicKarticky(b.zdroj, b.ref)));
}

/** Hromádka na dnes: prvních `kolik` kartiček na řadě (výchozí pět). Počet čekajících se nikde neukazuje. */
export function hromadka(d: Denik, dnes: string, kolik: number = HROMADKA, zdrojExistuje?: (k: Karticka) => boolean): Karticka[] {
  return naRade(d, dnes, zdrojExistuje).slice(0, Math.max(0, kolik));
}

/** Přidá kartičku (tlačítko „Do kartiček“). */
export function pridatKarticku(zdroj: ZdrojKarticky, ref: string): void {
  const d = nacti();
  const novy = sKartickou(d, zdroj, ref, new Date().toISOString());
  if (novy !== d) uloz(novy);
}

/** Vyndá kartičku (druhý stisk „Do kartiček“, „Vyndat z kartiček“). */
export function vyndatKarticku(klic: string): void {
  const d = nacti();
  const novy = bezKarticky(d, klic);
  if (novy !== d) uloz(novy);
}

/** Zapíše „Vím“ nebo „Zopakuj si“ s dnešním místním datem. */
export function ohodnotitKarticku(klic: string, hodnoceni: HodnoceniKarticky): void {
  const ted = new Date();
  const d = nacti();
  const novy = sHodnocenim(d, klic, hodnoceni, mistniDatum(ted), ted.toISOString());
  if (novy !== d) uloz(novy);
}

/** Zapíše čas zálohy (stažený soubor, odkaz nebo kód QR); připomenutí zálohy v deníku pak zmizí. */
export function oznacZalohu(kdy = new Date().toISOString()): void {
  const d = nacti();
  d.zaloha = kdy;
  uloz(d);
}

export function zaznamenejNavstevu(odkaz: string, nazev: string): void {
  if (tichaStranka()) return;
  const d = nacti();
  d.navstivene = [{ odkaz, nazev, kdy: new Date().toISOString() }, ...d.navstivene.filter((x) => x.odkaz !== odkaz)].slice(0, 20);
  uloz(d);
}

export function exportuj(): void {
  const blob = new Blob([JSON.stringify(nacti(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `atlas-denik-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  oznacZalohu();
}

// ─── Nahrání deníku ze souboru (revize antiky, O) ───────────────────────────

/** Deník ze staženého souboru, nebo null, když text deník atlasu není. */
export function rozeberDenik(text: string): Denik | null {
  try {
    return rozeber(text);
  } catch {
    return null;
  }
}

const novejsi = (a?: string, b?: string) => String(a ?? '') >= String(b ?? '');

/** Seznam spojený podle klíče: ze dvou záznamů se stejným klíčem zůstane novější. Výsledek od nejnovějšího. */
function spojPodle<T>(a: T[], b: T[], klic: (x: T) => string, kdy: (x: T) => string): T[] {
  const m = new Map<string, T>();
  for (const x of [...a, ...b]) {
    const k = klic(x);
    const pred = m.get(k);
    if (!pred || !novejsi(kdy(pred), kdy(x))) m.set(k, x);
  }
  return [...m.values()].sort((x, y) => kdy(y).localeCompare(kdy(x)));
}

/**
 * Spojí deník v prohlížeči (`ten`) s deníkem ze souboru (`soubor`). Nic se neztratí: co je jen v jednom, zůstane.
 * Když je totéž v obou (odpověď ve stejném bloku, postup v téže cestě), vyhraje novější podle času; stav bloku jde
 * s časem jeho poslední aktivity, a když ho nezná ani jeden, zůstane ten z prohlížeče. Postup v cestě sečte
 * otevřené kroky a čas dokončení vezme ten dřívější. Kartička jde s časem poslední změny (`kdy`), poznámka citátu
 * s časem své úpravy (`upraveno`); sbírka citátů se při spojení nezkracuje. Vrací nový objekt.
 */
export function spojDeniky(ten: Denik, soubor: Denik): Denik {
  // Ze souboru jen záznamy s poli, podle kterých se spojuje a řadí; ruční úprava souboru nesmí rozbít deník.
  const s = (x: unknown, ...pole: string[]) => !!x && typeof x === 'object' && pole.every((p) => typeof (x as Record<string, unknown>)[p] === 'string');
  const pole = <T>(x: unknown, ...p: string[]) => (Array.isArray(x) ? x.filter((y) => s(y, ...p)) : []) as T[];
  const novy: Denik = {
    ...soubor,
    zapisy: pole<Zapis>(soubor.zapisy, 'id', 'otazka', 'odpoved', 'odkaz', 'kdy'),
    vyzvy: pole<Vyzva>(soubor.vyzvy, 'id', 'nazev', 'odkaz', 'prijato'),
    navstivene: pole<Denik['navstivene'][number]>(soubor.navstivene, 'odkaz', 'nazev', 'kdy'),
    aktivita: pole<Aktivita>(soubor.aktivita, 'id', 'odkaz', 'otazka', 'kdy'),
  };
  const aktivita = spojPodle(ten.aktivita, novy.aktivita, (a) => a.id, (a) => a.kdy).slice(0, 30);
  const casBloku = (d: Denik, id: string) => d.aktivita.find((a) => a.id === id)?.kdy;
  const bloky: Record<string, unknown> = { ...novy.bloky, ...ten.bloky };
  for (const id of Object.keys(novy.bloky)) {
    if (!(id in ten.bloky)) continue;
    const t = casBloku(ten, id);
    const n = casBloku(novy, id);
    if (n && (!t || n > t)) bloky[id] = novy.bloky[id];
  }
  // Postup ze souboru bere jen celé záznamy; poškozený by rozbil Pokračuj i deník.
  const platne = Object.fromEntries(Object.entries(novy.cesty).filter(([, c]) =>
    !!c && typeof c.nazev === 'string' && typeof c.pocet === 'number' && typeof c.krok === 'number' && typeof c.kdy === 'string' && Array.isArray(c.navstivene)));
  const cesty: Record<string, PostupCesty> = { ...platne, ...ten.cesty };
  for (const [slug, n] of Object.entries(platne)) {
    const t = ten.cesty[slug];
    if (!t) continue;
    const posledni = novejsi(t.kdy, n.kdy) ? t : n;
    const navstivene = [...new Set([...t.navstivene, ...n.navstivene])].sort((a, b) => a - b);
    const pocet = Math.max(t.pocet, n.pocet);
    const casy = [t.dokonceno, n.dokonceno].filter((x): x is string => typeof x === 'string').sort();
    const dokonceno = casy[0] ?? (navstivene.length >= pocet ? posledni.kdy : undefined);
    const pahyl = [t.pahyl, n.pahyl].filter((x): x is string => typeof x === 'string').sort()[0];
    cesty[slug] = { nazev: posledni.nazev, pocet, krok: posledni.krok, navstivene, kdy: posledni.kdy, ...(dokonceno ? { dokonceno } : {}), ...(pahyl ? { pahyl } : {}) };
  }
  const prectene: Record<string, string[]> = { ...(novy.prectene ?? {}) };
  for (const [s, k] of Object.entries(ten.prectene ?? {})) prectene[s] = [...new Set([...k, ...(prectene[s] ?? [])])];
  const vysledek: Denik = {
    ...ten,
    verze: 1,
    zapisy: spojPodle(ten.zapisy, novy.zapisy, (z) => z.id, (z) => z.kdy).reverse(),
    vyzvy: spojVyzvy(ten.vyzvy, novy.vyzvy),
    navstivene: spojPodle(ten.navstivene, novy.navstivene, (v) => v.odkaz, (v) => v.kdy).slice(0, 20),
    bloky,
    aktivita,
    cesty,
  };
  if (ten.cteni || novy.cteni) vysledek.cteni = Object.fromEntries(Object.entries({ ...(novy.cteni ?? {}), ...(ten.cteni ?? {}) }).slice(-CTENI_NEJVYS));
  if (ten.prectene || novy.prectene) vysledek.prectene = prectene;
  if (ten.tydny || novy.tydny) {
    const tydny: Record<string, StavTydne> = { ...cisteTydny(novy.tydny ?? {}) };
    for (const [id, t] of Object.entries(ten.tydny ?? {})) if (!tydny[id] || novejsi(t.kdy, tydny[id].kdy)) tydny[id] = t;
    vysledek.tydny = tydny;
  }
  if (!ten.pero && jePero(novy.pero)) vysledek.pero = novy.pero;
  else if (!jePero(vysledek.pero)) delete vysledek.pero;
  if (ten.hodiny || novy.hodiny) vysledek.hodiny = spojPodle(ten.hodiny ?? [], novy.hodiny ?? [], (h) => h.adresa, (h) => h.kdy).slice(0, HODINY_NEJVYS);
  // Citáty bez stropu: spojení nesmí nic vyhodit; plná sbírka jen nepřijme další vystřižení.
  if (ten.citaty || novy.citaty) vysledek.citaty = spojCitaty(cisteCitaty(ten.citaty), cisteCitaty(novy.citaty));
  if (ten.karticky || novy.karticky) {
    const karticky = cisteKarticky(novy.karticky);
    for (const [klic, k] of Object.entries(cisteKarticky(ten.karticky))) if (!karticky[klic] || novejsi(k.kdy, karticky[klic].kdy)) karticky[klic] = k;
    vysledek.karticky = karticky;
  }
  // Záloha: deník v prohlížeči zálohovaný není jen proto, že se do něj nahrál soubor; zůstává jeho vlastní čas.
  if (typeof ten.zaloha === 'string') vysledek.zaloha = ten.zaloha;
  else delete vysledek.zaloha;
  return vysledek;
}

/**
 * Výzvy z obou deníků bez opakování. U téže výzvy zůstane dřívější přijetí a poznámka z té strany, kde se měnila
 * později (`upraveno`); když poznámku má jen jedna strana, zůstane. Nic se nesmaže.
 */
function spojVyzvy(ten: Vyzva[], soubor: Vyzva[]): Vyzva[] {
  const cas = (v: Vyzva) => v.upraveno ?? '';
  const vysledek = ten.map((t) => {
    const s = soubor.find((x) => x.id === t.id);
    if (!s) return t;
    const [novejsiV, starsi] = cas(s) > cas(t) ? [s, t] : [t, s];
    const poznamka = novejsiV.upraveno ? novejsiV.poznamka : (novejsiV.poznamka ?? starsi.poznamka);
    const upraveno = novejsiV.upraveno ?? starsi.upraveno;
    const { poznamka: _p, upraveno: _u, ...zaklad } = t;
    return {
      ...zaklad,
      prijato: novejsi(s.prijato, t.prijato) ? t.prijato : s.prijato,
      ...(poznamka ? { poznamka } : {}),
      ...(upraveno ? { upraveno } : {}),
    };
  });
  return [...vysledek, ...soubor.filter((v) => !ten.some((x) => x.id === v.id))];
}

/**
 * Citáty z obou deníků bez opakování, nejnovější první. U téhož citátu zůstane znění z novějšího vystřižení (`kdy`)
 * a poznámka z té strany, kde se měnila později (`upraveno`); smazaná poznámka s novějším časem zůstane smazaná.
 */
function spojCitaty(ten: CitatVDeniku[], soubor: CitatVDeniku[]): CitatVDeniku[] {
  return spojPodle(ten, soubor, (c) => c.id, (c) => c.kdy).map((c) => {
    const t = ten.find((x) => x.id === c.id);
    const s = soubor.find((x) => x.id === c.id);
    if (!t || !s) return c;
    const [nov, star] = (s.upraveno ?? '') > (t.upraveno ?? '') ? [s, t] : [t, s];
    const poznamka = nov.upraveno ? nov.poznamka : (nov.poznamka ?? star.poznamka);
    const upraveno = nov.upraveno ?? star.upraveno;
    const { poznamka: _p, upraveno: _u, ...zaklad } = c;
    return { ...zaklad, ...(poznamka ? { poznamka } : {}), ...(upraveno ? { upraveno } : {}) };
  });
}

/** Nahraje deník ze souboru a přidá ho k deníku v prohlížeči. Vrací false, když text deník atlasu není. */
export function nahrajDenik(text: string): boolean {
  const novy = rozeberDenik(text);
  if (!novy) return false;
  uloz(spojDeniky(nacti(), novy));
  return true;
}

/** Jen pro testy: zapomene deník držený v paměti (když localStorage chybí). */
export function _zapomenPamet(): void {
  vPameti = null;
  promitaniVPameti = null;
}
