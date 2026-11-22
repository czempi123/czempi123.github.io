// Kartičky v deníku (denik-v2, K3; plán › 2): co je na lícu a na rubu kartičky z každého zdroje, hromádka na dnes
// (nejvýš pět, pamatuje si ji deník, ať ji obnovení stránky nerozdá znovu), Ještě pět a pojmy, které student potkal
// (prázdné kartičky). Čisté funkce nad deníkem a nad daty složenými při sestavení (src/components/denik/_karticky-data.ts).
// Rozestup a přihrádky jsou v src/lib/denik.ts (K1). Nikde se neukazuje počet čekajících, datum ani zameškané dny.
import {
  HROMADKA, hromadka, klicKarticky, maZdroj, naRade,
  type Denik, type Karticka, type Zapis, type ZdrojKarticky,
} from './denik';

export interface OdkazKarticky { href: string; text: string }
/** Místo, kde pojem v atlasu stojí: klíč jako v potkaneZDeniku („cesta/kolik-je-dost/3“, „/osobnost/epikuros/“). */
export interface MistoKarticky extends OdkazKarticky { klic: string }

export interface PojemKarticky {
  id: string;
  nazev: string;
  vysvetleni: string;
  priklad: string;
  obdobi?: number;
  /** výskyty pojmu v atlasu v pořadí z dat */
  mista: MistoKarticky[];
}

/** Otázka Co ti zůstalo? jen s tím, co kartička potřebuje (celý katalog kvízu má 77 kB). */
export interface OtazkaKarticky {
  id: string;
  /** index do `podnety` (hlasy téže otázky mají jeden případ) */
  podnet: number;
  zadani: string;
  /** text správné možnosti */
  spravna: string;
  vysvetleni: string;
  zpet: OdkazKarticky;
}

export interface DataKarticek {
  pojmy: Record<string, PojemKarticky>;
  zustalo: Record<string, OtazkaKarticky>;
  podnety: string[];
  /** barva kartiček Co ti zůstalo? (období stránky Tvoje antika) */
  obdobiZustalo?: number;
}

/** Nadtitulek kartičky podle zdroje. */
export const NADTITULKY: Record<ZdrojKarticky, string> = {
  pojem: 'pojem',
  citat: 'vystřižený citát',
  zapis: 'tvůj zápis',
  zustalo: 'co ti zůstalo',
};

/** Pracovní texty kartiček (učeše T). */
export const TEXTY_KARTICEK = {
  nadpis: 'Kartičky',
  uvod: 'Nejdřív si odpověz sám, pak kartičku otoč.',
  prazdne: 'Do kartiček si dáš pojem, citát nebo vlastní odpověď. Po čase se ti vrátí a zjistíš, co ti zůstalo.',
  pridatPojmy: 'Přidat pojmy, které jsi potkal',
  zadna: 'Dnes žádná. Kartičky se ozvou samy, až přijde jejich čas.',
  stacilo: 'Na dnes stačí.',
  jestePet: 'Ještě pět',
  otocit: 'Otočit',
  vim: 'Vím',
  zopakuj: 'Zopakuj si',
  vyndat: 'Vyndat z kartiček',
  doKarticek: 'Do kartiček',
  licPojem: 'Co to znamená? Řekni si to vlastními slovy.',
  licCitat: 'Co v té větě říká? Stačí myšlenka.',
  licZapis: 'Vybavíš si, co jsi napsal?',
  rubZapis: 'Platí to pro tebe pořád?',
  prepsat: 'Přepsat odpověď',
  zpetCitat: 'Zpátky tam, kde sis ho vystřihl',
} as const;

export interface ObsahKarticky {
  klic: string;
  zdroj: ZdrojKarticky;
  nadtitulek: string;
  obdobi?: number;
  lic: {
    /** pojem, otázka zápisu, odkud je citát */
    nazev?: string;
    /** pod názvem drobně (stránka, odkud je citát) */
    pod?: string;
    /** podnět kvízu po odstavcích */
    odstavce: string[];
    otazka: string;
  };
  rub: {
    /** správná odpověď kvízu (tučně) */
    odpoved?: string;
    /** znění citátu */
    citat?: string;
    /** co student napsal (jeho perem): poznámka k citátu, odpověď zápisu */
    pero?: string;
    odstavce: string[];
    /** otázka pod studentovou odpovědí */
    dotaz?: string;
    zpet?: OdkazKarticky;
  };
}

// ─── Zdroje ───────────────────────────────────────────────────────────────────

/** Bloky, ve kterých student volí a vlastní slova připíše jen jako důvod („Proč: …“). */
const DRUHY_S_DUVODEM = new Set<Zapis['druh']>(['volba', 'navrat', 'argument', 'slabe', 'kdo-by']);
/** Bloky, ve kterých student jen volí nebo třídí karty: vlastní slova v zápisu nejsou. */
const DRUHY_BEZ_TEXTU = new Set<Zapis['druh']>(['zmena', 'roztrid']);

/**
 * Má zápis studentova vlastní slova (pravidlo z cesty, odpověď Teď, sebehodnocení, důvod volby)? Jen takový dostane
 * Do kartiček. Volba bez důvodu (`bezDuvodu`, otázka na bolestnou chvíli) uloží jen zvolenou možnost, a tak ho nedostane.
 */
export function zapisSTextem(z: Pick<Zapis, 'odpoved' | 'druh'>): boolean {
  const t = (z.odpoved ?? '').trim();
  if (!t) return false;
  if (DRUHY_BEZ_TEXTU.has(z.druh)) return false;
  if (DRUHY_S_DUVODEM.has(z.druh)) return /(^|\s)Proč:\s*\S/.test(t);
  if (z.druh === 'spor') return /Co mě (udrželo|posunulo):\s*\S/.test(t);
  return true;
}

/** Zná atlas pojem a otázku kvízu, ze kterých kartička je? Citát a zápis hlídá deník (maZdroj). */
export const zdrojExistuje = (data: Pick<DataKarticek, 'pojmy' | 'zustalo'>) => (k: Pick<Karticka, 'zdroj' | 'ref'>): boolean =>
  k.zdroj === 'pojem' ? !!data.pojmy[k.ref] : k.zdroj === 'zustalo' ? !!data.zustalo[k.ref] : true;

/** Adresa bez kotvy a dotazu s lomítkem na konci (klíč stránky jako v potkaneZDeniku). */
function adresa(odkaz: string): string {
  const a = odkaz.split(/[#?]/)[0] || '/';
  return a.endsWith('/') ? a : `${a}/`;
}
/** Stránka zápisu nebo citátu: krok cesty patří k cestě (kapitoly deníku mají stránky podle cest). */
function strankaOdkazu(odkaz: string): string {
  const a = adresa(odkaz);
  const krok = a.match(/^\/cesta\/([a-z0-9-]+)\/\d+\/$/);
  return krok ? `/cesta/${krok[1]}/` : a;
}

/** Místo, kde student pojem potkal: první výskyt, kde byl; jinak stránka pojmu. */
export function mistoPojmu(p: PojemKarticky, potkane: ReadonlySet<string>): OdkazKarticky {
  const m = p.mista.find((x) => potkane.has(x.klic));
  return m ? { href: m.href, text: m.text } : { href: `/pojem/${p.id}/`, text: `Zpátky k pojmu ${p.nazev.toLocaleLowerCase('cs')}` };
}

export interface StrankaKarticky { nazev: string; obdobi?: number }

/**
 * Líc a rub kartičky podle tabulky zdrojů (plán › 2), nebo null, když zdroj chybí (smazaný zápis, vyndaný citát,
 * pojem nebo otázka, které atlas už nezná). `stranky`: název a období stránky podle adresy (MapaStranek deníku).
 */
export function obsahKarticky(
  k: Karticka,
  d: Pick<Denik, 'zapisy' | 'citaty'>,
  data: DataKarticek,
  potkane: ReadonlySet<string>,
  stranky: Record<string, StrankaKarticky> = {},
): ObsahKarticky | null {
  const zaklad = { klic: klicKarticky(k.zdroj, k.ref), zdroj: k.zdroj, nadtitulek: NADTITULKY[k.zdroj] };
  if (k.zdroj === 'pojem') {
    const p = data.pojmy[k.ref];
    if (!p) return null;
    return {
      ...zaklad, obdobi: p.obdobi,
      lic: { nazev: p.nazev, odstavce: [], otazka: TEXTY_KARTICEK.licPojem },
      rub: { odstavce: [p.vysvetleni, p.priklad], zpet: mistoPojmu(p, potkane) },
    };
  }
  if (k.zdroj === 'citat') {
    const c = d.citaty?.find((x) => x.id === k.ref);
    if (!c) return null;
    const s = stranky[strankaOdkazu(c.odkaz)];
    return {
      ...zaklad, obdobi: s?.obdobi,
      lic: { nazev: c.kde, ...(s ? { pod: `stránka: ${s.nazev}` } : {}), odstavce: [], otazka: TEXTY_KARTICEK.licCitat },
      rub: { citat: c.text, ...(c.poznamka ? { pero: c.poznamka } : {}), odstavce: [], zpet: { href: c.odkaz, text: TEXTY_KARTICEK.zpetCitat } },
    };
  }
  if (k.zdroj === 'zapis') {
    const z = d.zapisy.find((x) => x.id === k.ref);
    if (!z || !z.odpoved.trim()) return null;
    const s = stranky[strankaOdkazu(z.odkaz)];
    return {
      ...zaklad, obdobi: s?.obdobi,
      lic: { nazev: z.otazka, odstavce: [], otazka: TEXTY_KARTICEK.licZapis },
      rub: { pero: z.odpoved.trim(), odstavce: [], dotaz: TEXTY_KARTICEK.rubZapis, zpet: { href: z.odkaz, text: TEXTY_KARTICEK.prepsat } },
    };
  }
  const o = data.zustalo[k.ref];
  if (!o) return null;
  return {
    ...zaklad, obdobi: data.obdobiZustalo,
    lic: { odstavce: (data.podnety[o.podnet] ?? '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean), otazka: o.zadani },
    rub: { odpoved: o.spravna, odstavce: [o.vysvetleni], zpet: o.zpet },
  };
}

// ─── Hromádka na dnes ─────────────────────────────────────────────────────────

/** Klíč stavu hromádky v `bloky` deníku. */
export const KLIC_HROMADKY = 'karticky/dnes';

/** Hromádka dne: které kartičky student dnes dostal (v pořadí). Hotové jsou ty, které má dnes ohodnocené. */
export interface StavHromadky {
  den: string;
  klice: string[];
}

export function platnaHromadka(s: unknown): StavHromadky | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Record<string, unknown>;
  if (typeof o.den !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.den) || !Array.isArray(o.klice)) return null;
  return { den: o.den, klice: [...new Set(o.klice.filter((k): k is string => typeof k === 'string'))] };
}

type ZdrojExistuje = (k: Karticka) => boolean;
const klicK = (k: Karticka) => klicKarticky(k.zdroj, k.ref);

/** Je kartička v hromádce ještě ke hře: existuje, má zdroj a dnes ji student ještě nehodnotil. */
function ceka(d: Pick<Denik, 'karticky' | 'citaty' | 'zapisy'>, klic: string, den: string, zdroj?: ZdrojExistuje): boolean {
  const k = d.karticky?.[klic];
  return !!k && k.naposledy !== den && maZdroj(d as Denik, k, zdroj);
}

/**
 * Hromádka na dnes. Z dneška zůstane, jak ji student dostal (obnovení stránky nerozdá novou pětku); nový den
 * dá nejvýš pět kartiček na řadě od té, která čeká nejdéle.
 */
export function hromadkaDne(d: Denik, dnes: string, ulozena: StavHromadky | null, zdroj?: ZdrojExistuje): StavHromadky {
  if (ulozena?.den !== dnes) return { den: dnes, klice: hromadka(d, dnes, HROMADKA, zdroj).map(klicK) };
  // Vyndané kartičky v hromádce zůstanou (počítají se do pětky), jen se už neukážou (aktualniKarticka).
  const klice = ulozena.klice;
  // Dnešní hromádka byla menší než pět (víc toho na řadě nebylo) a student mezitím přidal kartičku: doplní se do pěti.
  if (klice.length >= HROMADKA) return { den: dnes, klice };
  const v = new Set(klice);
  const dalsi = naRade(d, dnes, zdroj).filter((k) => !v.has(klicK(k))).slice(0, HROMADKA - klice.length).map(klicK);
  return { den: dnes, klice: [...klice, ...dalsi] };
}

/** Kartička, která je v hromádce na řadě (první dnes neohodnocená), nebo undefined: na dnes stačí. */
export function aktualniKarticka(d: Denik, s: StavHromadky, zdroj?: ZdrojExistuje): string | undefined {
  return s.klice.find((k) => ceka(d, k, s.den, zdroj));
}

/** Zbývá na dnes ještě něco mimo hromádku (nabídnout Ještě pět)? Kolik, se neříká. */
export function zbyvaNaRade(d: Denik, s: StavHromadky, zdroj?: ZdrojExistuje): boolean {
  const v = new Set(s.klice);
  return naRade(d, s.den, zdroj).some((k) => !v.has(klicK(k)));
}

/** Ještě pět: dalších nejvýš pět kartiček na řadě, které v dnešní hromádce nebyly. */
export function jestePet(d: Denik, s: StavHromadky, zdroj?: ZdrojExistuje): StavHromadky {
  const v = new Set(s.klice);
  const dalsi = naRade(d, s.den, zdroj).filter((k) => !v.has(klicK(k))).slice(0, HROMADKA).map(klicK);
  return { den: s.den, klice: [...s.klice, ...dalsi] };
}

/** Stojí za hromádkou ještě další kartička (vrstva papíru pod ní)? Jen ano/ne, žádný počet. */
export function dalsiVHromadce(d: Denik, s: StavHromadky, aktualni: string | undefined, zdroj?: ZdrojExistuje): boolean {
  return s.klice.some((k) => k !== aktualni && ceka(d, k, s.den, zdroj));
}

// ─── Prázdné kartičky ─────────────────────────────────────────────────────────

/** Pojmy, které student potkal na jejich výskytech (stránka pojmu se nepočítá) a které v kartičkách ještě nemá. */
export function potkanePojmy(data: Pick<DataKarticek, 'pojmy'>, potkane: ReadonlySet<string>, d: Pick<Denik, 'karticky'>): string[] {
  return Object.values(data.pojmy)
    .filter((p) => !d.karticky?.[klicKarticky('pojem', p.id)] && p.mista.some((m) => potkane.has(m.klic)))
    .map((p) => p.id);
}
