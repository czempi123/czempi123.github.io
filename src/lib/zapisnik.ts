// Můj deník jako zápisník (design-v2, K6; plán větve › Mapa a deník: funkce): záznamy podle cest, sbírka
// (potkaní filozofové, odtržené pahýly, vystřižené citáty) a připomenutí zálohy. Čisté funkce nad deníkem;
// komponenta src/components/ostrovy/Denik.svelte. Nic se nepočítá navíc a nic se nehodnotí.
import type { Aktivita, CitatVDeniku, Denik, Zapis } from './denik';
import { odpovedStudenta } from './strany';
import type { KatalogObdobi } from './tvoje-obdobi';
import { krokZAdresy as krokStranky } from './cesty';

/** Cesta a krok z adresy kroku i s kotvou („/cesta/kolik-je-dost/3/#cesta6-tri-kose“), nebo null. */
export function krokZAdresy(odkaz: string): { slug: string; krok: number } | null {
  const k = krokStranky(odkaz.split(/[#?]/)[0]);
  return k ? { slug: k.slug, krok: k.n } : null;
}

export interface ZaznamCesty {
  /** id zápisu nebo bloku */
  id: string;
  krok: number;
  adresa: string;
  otazka: string;
  /** zvolená možnost slovy (Volba, Spor, Změň jednu věc), když ji katalog zná */
  volba?: string;
  /** co student napsal (důvod, stanovisko, pravidlo) */
  odpoved?: string;
  kdy?: string;
}

export interface CestaVZapisniku {
  slug: string;
  nazev: string;
  pocet: number;
  /** student otevřel všechny kroky */
  hotova: boolean;
  zaznamy: ZaznamCesty[];
}

/**
 * Záznamy deníku seřazené podle cest a v cestě podle kroků. Cesty jdou od naposledy otevřené; cesta bez jediného
 * záznamu se neukáže (rozpracovaná je nahoře v deníku zvlášť). Volba slovy jen z katalogu bloků (Tvoje antika).
 */
export function zaznamyPodleCest(d: Pick<Denik, 'zapisy' | 'cesty' | 'bloky'>, k?: Pick<KatalogObdobi, 'bloky'>): CestaVZapisniku[] {
  const podle = new Map<string, ZaznamCesty[]>();
  for (const { kde, zaznam } of zaznamyVsech(d, k)) {
    if (!zaznam.krok) continue;
    const slug = kde.slice('/cesta/'.length, -1);
    podle.set(slug, [...(podle.get(slug) ?? []), zaznam]);
  }
  return Object.entries(d.cesty ?? {})
    .filter(([slug]) => podle.has(slug))
    .sort((a, b) => String(b[1].kdy).localeCompare(String(a[1].kdy)))
    .map(([slug, c]) => ({
      slug,
      nazev: c.nazev,
      pocet: c.pocet,
      hotova: c.navstivene.length >= c.pocet,
      zaznamy: podle.get(slug)!.sort((a, b) => a.krok - b.krok || String(a.kdy).localeCompare(String(b.kdy))),
    }));
}

/** Adresa stránky bez kotvy a dotazu, s lomítkem na konci; krok cesty patří k adrese cesty („/cesta/kolik-je-dost/“). */
export function adresaStranky(odkaz: string): string {
  const kde = krokZAdresy(odkaz);
  if (kde) return `/cesta/${kde.slug}/`;
  const a = odkaz.split(/[#?]/)[0] || '/';
  return a.endsWith('/') ? a : `${a}/`;
}

/**
 * Všechny záznamy deníku s adresou stránky, kde vznikly: zápisy a volby z katalogu bloků, které zápis nemají.
 * Krok je 0 mimo cestu. Zápis Volby nese i zvolenou možnost; když ji katalog zná, ukazuje se zvlášť a v odpovědi
 * zůstane jen důvod.
 */
function zaznamyVsech(d: Pick<Denik, 'zapisy' | 'bloky'>, k?: Pick<KatalogObdobi, 'bloky'>): { kde: string; zaznam: ZaznamCesty }[] {
  const volby = new Map<string, { kde: string; krok: number; adresa: string; text: string }>();
  for (const b of k?.bloky ?? []) {
    const kod = odpovedStudenta(b.popis, d.bloky?.[b.id]);
    const text = kod === null ? undefined : b.odpovedi.find((o) => o.kod === kod)?.text;
    if (text) volby.set(b.id, { kde: adresaStranky(b.adresa), krok: krokZAdresy(b.adresa)?.krok ?? 0, adresa: b.adresa, text });
  }
  const vysledek: { kde: string; zaznam: ZaznamCesty }[] = [];
  const pouzite = new Set<string>();
  for (const z of d.zapisy as Zapis[]) {
    const v = volby.get(z.id);
    if (v) pouzite.add(z.id);
    const odpoved = odpovedBezVolby(z, v?.text);
    vysledek.push({
      kde: adresaStranky(z.odkaz),
      zaznam: {
        id: z.id, krok: krokZAdresy(z.odkaz)?.krok ?? 0, adresa: z.odkaz, otazka: z.otazka, kdy: z.kdy,
        ...(v ? { volba: v.text } : {}),
        ...(odpoved ? { odpoved } : {}),
      },
    });
  }
  for (const [id, v] of volby) if (!pouzite.has(id)) vysledek.push({ kde: v.kde, zaznam: { id, krok: v.krok, adresa: v.adresa, otazka: '', volba: v.text } });
  return vysledek;
}

/** Studentova slova bez zvolené možnosti, kterou záznam ukazuje zvlášť; prázdné = nic. */
function odpovedBezVolby(z: Zapis, volba?: string): string {
  const mezery = (s: string) => s.replace(/\s+/g, ' ');
  const t = mezery(z.odpoved).trim();
  if (!volba) return t;
  const v = mezery(volba).replace(/[.!?…]+$/, '');
  const i = t.indexOf(v);
  if (i < 0) return t;
  // Zápis Volby: „A · text. Proč: důvod.“ (zapisVolby v src/lib/bloky.ts)
  return t.slice(i + v.length).replace(/^[\s.!?…·:–-]+/, '').replace(/^Proč:\s*/, '').trim();
}

export interface PahylCesty {
  slug: string;
  nazev: string;
  pocet: number;
  kdy: string;
}

/** Odtržené pahýly lístků prošlých cest (K5: cesty[slug].pahyl), od nejstaršího jako ve sbírce. */
export function pahylyCest(d: Pick<Denik, 'cesty'>): PahylCesty[] {
  return Object.entries(d.cesty ?? {})
    .filter(([, c]) => typeof c.pahyl === 'string')
    .map(([slug, c]) => ({ slug, nazev: c.nazev, pocet: c.pocet, kdy: c.pahyl! }))
    .sort((a, b) => a.kdy.localeCompare(b.kdy));
}

export interface MapaPotkanych {
  /** adresa stránky osoby → id osoby */
  stranky: Record<string, string>;
  /** slug cesty → id jejích filozofů */
  cesty: Record<string, string[]>;
}

/**
 * Filozofové, které student potkal: otevřel jejich stránku nebo šel jejich cestou. V pořadí, jak je potkal
 * (nejdřív první); každý jednou.
 */
export function potkaniFilozofove(d: Pick<Denik, 'navstivene' | 'cesty'>, m: MapaPotkanych): string[] {
  const kdy = new Map<string, string>();
  const potkal = (id: string, cas: string) => {
    const pred = kdy.get(id);
    if (!pred || cas < pred) kdy.set(id, cas);
  };
  for (const n of d.navstivene ?? []) {
    const id = m.stranky[n.odkaz.split('#')[0]];
    if (id) potkal(id, n.kdy);
  }
  for (const [slug, c] of Object.entries(d.cesty ?? {})) {
    if (!c.navstivene?.length) continue;
    for (const id of m.cesty[slug] ?? []) potkal(id, c.dokonceno ?? c.kdy);
  }
  return [...kdy.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([id]) => id);
}

/**
 * Připomenutí zálohy: nejnověji dokončená cesta, která přibyla po poslední záloze (stažení, odkaz), nebo null.
 * Deník bez dokončené cesty zálohu nepřipomíná.
 */
export function pripomenutiZalohy(d: Pick<Denik, 'cesty' | 'zaloha'>): { slug: string; nazev: string } | null {
  const po = d.zaloha ?? '';
  const [slug, c] = Object.entries(d.cesty ?? {})
    .filter(([, c]) => typeof c.dokonceno === 'string' && c.dokonceno > po)
    .sort((a, b) => b[1].dokonceno!.localeCompare(a[1].dokonceno!))[0] ?? [];
  return slug && c ? { slug, nazev: c.nazev } : null;
}

// ——— Kapitoly deníku (design-v2, K6 dodatek; připomínka autora 15. 11. 2026, otázka 5 po K7a) ———
// Jedno další členění pod Moje filozofie: kapitola na období. V kapitole rozpracované cesty a bloky, záznamy po cestách
// (a stránkách), týž výpis podle data a sbírka období. Stránky velkých otázek období nemají: jejich záznamy jdou do
// kapitoly Napříč obdobími, stejně jako záznamy z období, které ještě nemá stránku. Prázdná kapitola není.

/** Stránka atlasu, jak ji zná deník: název a období (stránka velké otázky období nemá). */
export interface StrankaZapisniku {
  nazev: string;
  obdobi?: number;
}
/** adresa stránky bez kotvy („/osobnost/sokrates/“, „/cesta/kolik-je-dost/“) → stránka */
export type MapaStranek = Record<string, StrankaZapisniku>;

export interface ObdobiZapisniku {
  id: number;
  nazev: string;
  /** léta období („650–300 př. n. l.“) */
  leta?: string;
  /** období má stránku; bez ní kapitolu nedostane */
  maStranku: boolean;
}

export const KAPITOLA_NAPRIC = 'napric';
export const NAZEV_NAPRIC = 'Napříč obdobími';
/** Stav kapitol v localStorage (které jsou otevřené a jak se řadí záznamy); není součástí exportu deníku. */
export const KLIC_KAPITOL = 'atlas-denik-kapitoly';

export interface SkupinaZaznamu {
  /** adresa stránky nebo cesty */
  adresa: string;
  nazev: string;
  druh: 'cesta' | 'otazka' | 'stranka';
  zaznamy: ZaznamCesty[];
  /** kdy tu student byl naposledy (řazení skupin) */
  kdy: string;
}

export interface KapitolaDeniku {
  /** „obdobi-2“, nebo KAPITOLA_NAPRIC */
  klic: string;
  obdobi: number | null;
  nazev: string;
  leta?: string;
  /** rozpracované cesty (slug), od naposledy otevřené */
  cesty: string[];
  /** rozpracované bloky, ke kterým se student nevrátil */
  otazky: Aktivita[];
  /** záznamy po cestách a stránkách, od naposledy otevřené */
  skupiny: SkupinaZaznamu[];
  /** zápisy kapitoly podle data (nejnovější první, jako v deníku) */
  podleData: Zapis[];
  potkani: string[];
  pahyly: PahylCesty[];
  citaty: CitatVDeniku[];
  /** kdy tu student byl naposledy (prázdné = nikdy, jen zápis bez času) */
  naposledy: string;
}

export interface PodkladyKapitol {
  obdobi: ObdobiZapisniku[];
  stranky: MapaStranek;
  katalog?: Pick<KatalogObdobi, 'bloky'>;
  /** potkaní filozofové (potkaniFilozofove) a období jejich stránek */
  potkani?: string[];
  osoby?: Record<string, { obdobi: number }>;
}

type DenikKapitol = Pick<Denik, 'zapisy' | 'cesty' | 'bloky' | 'navstivene' | 'aktivita' | 'citaty'>;

const novejsi = (a: string, b?: string) => (b && b > a ? b : a);

/**
 * Kapitoly deníku: období se stránkou v pořadí období, za nimi Napříč obdobími. Kapitola bez rozpracovaných cest
 * a bloků, záznamů i sbírky se nevrátí.
 */
export function kapitolyDeniku(d: DenikKapitol, p: PodkladyKapitol): KapitolaDeniku[] {
  const sStrankou = new Map(p.obdobi.filter((o) => o.maStranku).map((o) => [o.id, o]));
  const klicObdobi = (o?: number) => (o !== undefined && sStrankou.has(o) ? `obdobi-${o}` : KAPITOLA_NAPRIC);
  const klicAdresy = (odkaz: string) => klicObdobi(p.stranky[adresaStranky(odkaz)]?.obdobi);
  const kap = new Map<string, KapitolaDeniku>();
  const vezmi = (klic: string): KapitolaDeniku => {
    let k = kap.get(klic);
    if (!k) {
      const o = klic === KAPITOLA_NAPRIC ? undefined : sStrankou.get(Number(klic.slice('obdobi-'.length)));
      k = {
        klic, obdobi: o?.id ?? null, nazev: o?.nazev ?? NAZEV_NAPRIC, ...(o?.leta ? { leta: o.leta } : {}),
        cesty: [], otazky: [], skupiny: [], podleData: [], potkani: [], pahyly: [], citaty: [], naposledy: '',
      };
      kap.set(klic, k);
    }
    return k;
  };
  const cesty = Object.entries(d.cesty ?? {}).sort((a, b) => String(b[1].kdy).localeCompare(String(a[1].kdy)));

  for (const [slug, c] of cesty) if (c.navstivene.length < c.pocet || !c.pahyl) vezmi(klicAdresy(`/cesta/${slug}/`)).cesty.push(slug);
  for (const a of d.aktivita ?? []) if (!a.hotovo) vezmi(klicAdresy(a.odkaz)).otazky.push(a);

  // Záznamy po skupinách: cesta, nebo stránka (profil, směr, otázka…). Název ze záznamu cesty, z dat, z návštěvy.
  const navsteva = new Map<string, { nazev: string; kdy: string }>();
  for (const n of d.navstivene ?? []) {
    const a = adresaStranky(n.odkaz);
    const pred = navsteva.get(a);
    if (!pred || n.kdy > pred.kdy) navsteva.set(a, { nazev: n.nazev, kdy: n.kdy });
  }
  const skupiny = new Map<string, SkupinaZaznamu>();
  for (const { kde, zaznam } of zaznamyVsech(d, p.katalog)) {
    let s = skupiny.get(kde);
    if (!s) {
      const slug = kde.startsWith('/cesta/') ? kde.slice('/cesta/'.length, -1) : undefined;
      const c = slug ? d.cesty?.[slug] : undefined;
      s = {
        adresa: kde,
        nazev: c?.nazev ?? p.stranky[kde]?.nazev ?? navsteva.get(kde)?.nazev ?? 'Jinde v atlasu',
        druh: slug ? 'cesta' : kde.startsWith('/otazka/') ? 'otazka' : 'stranka',
        zaznamy: [],
        kdy: c?.kdy ?? navsteva.get(kde)?.kdy ?? '',
      };
      skupiny.set(kde, s);
      vezmi(klicObdobi(p.stranky[kde]?.obdobi)).skupiny.push(s);
    }
    s.zaznamy.push(zaznam);
    s.kdy = novejsi(s.kdy, zaznam.kdy);
  }
  for (const s of skupiny.values()) s.zaznamy.sort((a, b) => a.krok - b.krok || String(a.kdy).localeCompare(String(b.kdy)));
  for (const z of d.zapisy ?? []) vezmi(klicAdresy(z.odkaz)).podleData.push(z);

  for (const id of p.potkani ?? []) if (p.osoby?.[id]) vezmi(klicObdobi(p.osoby[id].obdobi)).potkani.push(id);
  for (const ph of pahylyCest(d)) vezmi(klicAdresy(`/cesta/${ph.slug}/`)).pahyly.push(ph);
  for (const c of d.citaty ?? []) vezmi(klicAdresy(c.odkaz)).citaty.push(c);

  // Kdy tu student byl naposledy: jen kapitoly, které něco mají, a jen stránky, které atlas zná (ne deník, Domů, mapa).
  const byl = (klic: string, kdy?: string) => {
    const k = kap.get(klic);
    if (k) k.naposledy = novejsi(k.naposledy, kdy);
  };
  for (const [slug, c] of cesty) byl(klicAdresy(`/cesta/${slug}/`), c.kdy);
  for (const [a, n] of navsteva) if (p.stranky[a]) byl(klicObdobi(p.stranky[a].obdobi), n.kdy);
  for (const z of d.zapisy ?? []) byl(klicAdresy(z.odkaz), z.kdy);
  for (const a of d.aktivita ?? []) byl(klicAdresy(a.odkaz), a.kdy);
  for (const c of d.citaty ?? []) byl(klicAdresy(c.odkaz), c.kdy);

  return [...kap.values()]
    .map((k) => ({ ...k, skupiny: k.skupiny.sort((a, b) => b.kdy.localeCompare(a.kdy)) }))
    .sort((a, b) => (a.obdobi ?? Infinity) - (b.obdobi ?? Infinity));
}

/** Zapamatovaný stav kapitol: které má student otevřené, kdy je naposledy otevřel nebo zavřel a jak řadí záznamy. */
export interface StavKapitol {
  otevrene: string[];
  kdy: string;
  pohled?: 'cesty' | 'data';
}

/** Stav kapitol z localStorage, nebo null, když chybí nebo nedává smysl. */
export function rozeberStavKapitol(x: unknown): StavKapitol | null {
  if (!x || typeof x !== 'object') return null;
  const s = x as Record<string, unknown>;
  if (!Array.isArray(s.otevrene) || typeof s.kdy !== 'string') return null;
  return {
    otevrene: s.otevrene.filter((k): k is string => typeof k === 'string'),
    kdy: s.kdy,
    ...(s.pohled === 'cesty' || s.pohled === 'data' ? { pohled: s.pohled } : {}),
  };
}

/**
 * Které kapitoly jsou při otevření deníku otevřené (v pořadí kapitol). Kapitola, kde student naposledy byl, se otevře,
 * když tam byl až po poslední změně stavu (nebo když stav ještě není); ostatní zůstanou, jak je student nechal.
 * Když žádná ze zapamatovaných kapitol už není, otevře se ta poslední.
 */
export function otevreneKapitoly(kapitoly: Pick<KapitolaDeniku, 'klic' | 'naposledy'>[], stav?: StavKapitol | null): string[] {
  if (!kapitoly.length) return [];
  const posledni = kapitoly.reduce((a, b) => (b.naposledy > a.naposledy ? b : a));
  const klice = new Set(kapitoly.map((k) => k.klic));
  const otevrene = new Set((stav?.otevrene ?? []).filter((k) => klice.has(k)));
  const zmizely = !!stav && stav.otevrene.length > 0 && otevrene.size === 0;
  if (!stav || posledni.naposledy > stav.kdy || zmizely) otevrene.add(posledni.klic);
  return kapitoly.map((k) => k.klic).filter((k) => otevrene.has(k));
}
