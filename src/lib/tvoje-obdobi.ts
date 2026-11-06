// Tvoje antika (deník na konci období): co student v cestách období udělal, seřazené po velkých otázkách,
// a ke každé otázce myslitelé, kterým je nejblíž. Stránka /denik/antika/ (src/components/ostrovy/TvojeObdobi.svelte).
// Čisté funkce bez DOM a Astra. Katalog (otázky, cesty, bloky se zastánci) skládá při sestavení
// src/components/denik/_katalog-obdobi.ts; tady se jen čte deník. Nic se nepočítá na procenta ani body:
// pořadí myslitelů je jen pořadí, ve kterém se ukážou. Co student neudělal, ve výsledku není.
import type { Denik } from './denik';
import { odpovedStudenta, kodyStrany, type PopisStran } from './strany';
import { klicOtazky } from './otazky';
import { volbaZeStavu, NIKDO } from './osa-hlasu';

export interface OsobaKatalogu {
  id: string;
  jmeno: string;
  /** stránka osoby (portrét, profil, medailonek), nebo nic */
  adresa?: string;
  /** ikona atributu pro minci */
  ikona?: string;
  obdobi: number;
  zena?: true;
}

export interface OtazkaKatalogu {
  cislo: number;
  slug: string;
  otazka: string;
  adresa: string;
  /** důvod podle hlasu na stránce otázky: osoba → první odstavec „Proč to tak viděl“ */
  duvody: Record<string, string>;
  /** id osob s hlasem na stránce otázky (volba na ose hlasů); starší katalog je nemá */
  hlasy?: string[];
}

export interface CestaKatalogu {
  slug: string;
  nazev: string;
  cislo: number;
  /** číslo velké otázky */
  otazka: number;
  /** id zápisu závěrečného pravidla (ZaverCesty) a adresa posledního kroku */
  pravidlo?: { id: string; adresa: string };
}

export interface ZastanceKatalogu {
  osoba: string;
  /** důvod z cesty (odstavec Kdo je na tvé straně, nebo strana Sporu); má přednost před hlasem u otázky */
  duvod?: string;
}

export interface OdpovedKatalogu {
  /** kód odpovědi jako v `<Strana odpoved>`: písmeno karty, id osoby strany, „uprostred“, id možnosti */
  kod: string;
  /** studentova odpověď slovy: text karty, postoj strany */
  text: string;
  zastanci: ZastanceKatalogu[];
}

export interface BlokKatalogu {
  id: string;
  /** slug cesty */
  cesta: string;
  /** krok, ve kterém blok stojí (s kotvou bloku) */
  adresa: string;
  popis: PopisStran;
  odpovedi: OdpovedKatalogu[];
}

export interface KatalogObdobi {
  otazky: OtazkaKatalogu[];
  /** cesty období, seřazené podle čísla */
  cesty: CestaKatalogu[];
  /** bloky cest období v pořadí cest a kroků */
  bloky: BlokKatalogu[];
  osoby: Record<string, OsobaKatalogu>;
}

/** Kde se student s myslitelem potkal: cesta a jeho vlastní odpověď v ní. */
export interface Stopa {
  cesta: string;
  adresa: string;
  odpoved: string;
}

export interface Blizky {
  osoba: OsobaKatalogu;
  /** proč to tak viděl: z cesty, jinak z hlasu u otázky; chybí, když by se opakoval důvod myslitele výš */
  duvod?: string;
  stopy: Stopa[];
}

export interface PravidloCesty {
  cesta: string;
  adresa: string;
  text: string;
}

export interface OtazkaPrehledu {
  cislo: number;
  slug: string;
  otazka: string;
  adresa: string;
  /** první názor na stránce otázky */
  zacatek?: string;
  /** odpověď „Po setkání s filozofy“ (Změnil se?, nebo pole Teď na téhle stránce) */
  ted?: string;
  pravidla: PravidloCesty[];
  /** koho si student na ose hlasů stránky otázky zvolil jako sobě nejbližšího; „Nikdo z nich“ tu není */
  nejbliz?: Nejbliz;
  blizci: Blizky[];
}

export interface Nejbliz {
  osoba: OsobaKatalogu;
  /** osa na stránce otázky */
  adresa: string;
  /** proč to tak viděl: hlas na stránce otázky */
  duvod?: string;
}

/** Kolik myslitelů u otázky stojí hned vidět; ostatní jsou pod „A další“. */
export const NEJBLIZ = 3;

/** Texty stránky a odkazů na ni (Můj deník, Kam dál stránky období 2) na jednom místě. */
export const TVOJE_ANTIKA = {
  adresa: '/denik/antika/',
  nazev: 'Tvoje antika',
  uvod: 'Tvoje odpovědi na velké otázky a vedle nich filozofové, kteří to viděli podobně jako ty. Je tu jen to, co jsi v atlasu sám napsal a zvolil, a svou odpověď můžeš kdykoli přepsat.',
  /** popisek odkazu v Můj deník */
  odkaz: 'Co sis myslel o velkých otázkách a kdo z antiky to viděl podobně.',
  /** řádek s volbou na ose hlasů: „Na stránce otázky je ti nejblíž Epikúros.“ (odkaz na osu a na stránku osoby) */
  nejbliz: { pred: 'Na ', odkaz: 'stránce otázky', po: ' je ti nejblíž ' },
} as const;

/** Text zápisu z deníku, nebo undefined (prázdný, chybějící, poškozený). */
function textZapisu(zapisy: unknown, id: string): string | undefined {
  if (!Array.isArray(zapisy)) return undefined;
  const z = zapisy.find((x) => !!x && typeof x === 'object' && (x as { id?: unknown }).id === id) as { odpoved?: unknown } | undefined;
  const t = typeof z?.odpoved === 'string' ? z.odpoved.trim() : '';
  return t || undefined;
}

/**
 * Přehled období z deníku. Otázka se ukáže, jen když u ní student něco má: první názor, odpověď teď, pravidlo
 * z cesty nebo odpověď v bloku, ke které patří myslitel. Myslitelé jdou v pořadí podle toho, kolikrát se s nimi
 * student potkal, a při shodě podle toho, kde se potkali poprvé. Důvod je text cesty k odpovědi, kterou student zvolil
 * (odstavec Kdo je na tvé straně, argument strany Sporu); hlas na stránce otázky ho doplní, kde cesta důvod nemá. Starší deník bez polí `bloky` nebo `zapisy`
 * (nebo s poškozenými záznamy) dá prostě méně.
 */
export function prehledObdobi(d: Partial<Denik> | null | undefined, k: KatalogObdobi): OtazkaPrehledu[] {
  const zapisy = d?.zapisy;
  const bloky = d?.bloky && typeof d.bloky === 'object' && !Array.isArray(d.bloky) ? (d.bloky as Record<string, unknown>) : {};
  const cestaPodleSlugu = new Map(k.cesty.map((c) => [c.slug, c]));

  // Stopy po otázkách: osoba → stopy a důvody z cest, v pořadí, jak přišly.
  const stopy = new Map<number, Map<string, { stopy: Stopa[]; duvody: string[]; poradi: number }>>();
  let poradi = 0;
  for (const b of k.bloky) {
    const cesta = cestaPodleSlugu.get(b.cesta);
    if (!cesta) continue;
    const kod = odpovedStudenta(b.popis, bloky[b.id]);
    if (kod === null) continue;
    const odpoved = b.odpovedi.find((o) => o.kod === kod);
    if (!odpoved) continue;
    for (const z of odpoved.zastanci) {
      if (!k.osoby[z.osoba]) continue;
      const uOtazky = stopy.get(cesta.otazka) ?? new Map();
      stopy.set(cesta.otazka, uOtazky);
      const zaznam = uOtazky.get(z.osoba) ?? { stopy: [], duvody: [], poradi: poradi++ };
      if (z.duvod && !zaznam.duvody.includes(z.duvod)) zaznam.duvody.push(z.duvod);
      if (!zaznam.stopy.some((s: Stopa) => s.adresa === b.adresa && s.odpoved === odpoved.text)) {
        zaznam.stopy.push({ cesta: cesta.nazev, adresa: b.adresa, odpoved: odpoved.text });
      }
      uOtazky.set(z.osoba, zaznam);
    }
  }

  const vysledek: OtazkaPrehledu[] = [];
  for (const o of [...k.otazky].sort((a, b) => a.cislo - b.cislo)) {
    const klic = klicOtazky(o.slug);
    const zacatek = textZapisu(zapisy, klic.prvni);
    const ted = textZapisu(zapisy, klic.ted);
    const pravidla: PravidloCesty[] = k.cesty
      .filter((c) => c.otazka === o.cislo && c.pravidlo)
      .flatMap((c) => {
        const text = textZapisu(zapisy, c.pravidlo!.id);
        return text ? [{ cesta: c.nazev, adresa: c.pravidlo!.adresa, text }] : [];
      });
    const uOtazky = stopy.get(o.cislo) ?? new Map();
    const ukazane = new Set<string>();
    // Volba na ose hlasů: jen hlas, který na stránce otázky opravdu je; „Nikdo z nich“ otázku sám neukáže.
    const volba = volbaZeStavu(bloky[klic.osa], o.hlasy ?? []);
    let nejbliz: Nejbliz | undefined;
    if (volba && volba !== NIKDO && k.osoby[volba]) {
      const duvod = o.duvody[volba];
      if (duvod) ukazane.add(duvod);
      nejbliz = { osoba: k.osoby[volba], adresa: `${o.adresa.split('#')[0]}#${o.slug}-osa`, ...(duvod ? { duvod } : {}) };
    }
    const blizci: Blizky[] = [...uOtazky.entries()]
      .sort((a, b) => b[1].stopy.length - a[1].stopy.length || a[1].poradi - b[1].poradi)
      .map(([id, z]) => {
        // Důvod z cesty mluví o studentově odpovědi; hlas u otázky jen tam, kde cesta důvod nemá nebo ho už řekla výš.
        const novy = [...z.duvody, o.duvody[id]].find((x): x is string => !!x && !ukazane.has(x));
        if (novy) ukazane.add(novy);
        return { osoba: k.osoby[id], ...(novy ? { duvod: novy } : {}), stopy: z.stopy };
      });
    if (!zacatek && !ted && !pravidla.length && !blizci.length && !nejbliz) continue;
    vysledek.push({
      cislo: o.cislo,
      slug: o.slug,
      otazka: o.otazka,
      adresa: o.adresa,
      ...(zacatek ? { zacatek } : {}),
      ...(ted ? { ted } : {}),
      pravidla,
      ...(nejbliz ? { nejbliz } : {}),
      blizci,
    });
  }
  return vysledek;
}

// ─── Pomůcky pro sestavení katalogu (čtou text MDX a YAML, ne deník) ─────────

/** Rozdělí odstavec na věty (za tečkou, otazníkem, vykřičníkem nebo trojtečkou následuje mezera). */
function vety(s: string): string[] {
  return s.split(/(?<=[.!?…])\s+/).filter(Boolean);
}

/** Ukazovací slova, kterými první věta hlasu navazuje na citát nebo případ nad sebou („Seneca to napsal…“). */
const ODKAZ_VEN = /(^|[\s,])(to|tu|tím|tvůj|tvoje|tvého|tenhle|tahle|tohle)(?=[\s,.:;]|$)/i;

/**
 * Důvod z hlasu na stránce otázky: první odstavec „Proč to tak viděl“. Když odstavec končí dvojtečkou
 * (uvádí citát, který tu nestojí), poslední věta odpadne. Když první věta ukazuje na něco nad sebou
 * („Seneca to napsal příteli…“, „Tvůj případ je starší…“), bez stránky otázky by nedávala smysl: undefined.
 */
export function duvodZMyslenky(myslenka: string): string | undefined {
  const prvni = myslenka.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, ' ').trim()).find(Boolean) ?? '';
  const casti = vety(prvni);
  if (casti.length && ODKAZ_VEN.test(casti[0])) return undefined;
  if (casti.length && /:\s*$/.test(casti[casti.length - 1])) casti.pop();
  const t = casti.join(' ').trim();
  return t || undefined;
}

/** Strana Sporu jako důvod: postoj a první argument. */
export function duvodStranySporu(s: { postoj: string; argumenty: string[] }): string {
  return [s.postoj, s.argumenty[0] ?? ''].map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' ');
}

export interface StranaZMdx {
  kody: string[];
  /** id osob z atributu `osoby`; undefined, když atribut chybí */
  osoby?: string[];
  /** text odstavců jako prostý text, citáty v uvozovkách */
  text: string;
}

const atribut = (tag: string, jmeno: string) => tag.match(new RegExp(`\\b${jmeno}="([^"]*)"`))?.[1];

/**
 * MDX odstavců do prostého textu: `<Citat id>` nahradí zněním citátu v uvozovkách (`citat` vrátí znění, nebo nic),
 * ostatní značky zahodí, z odkazů nechá text a z kurzívy a tučného písma jen slova.
 */
export function prostyText(mdx: string, citat: (id: string) => string | undefined = () => undefined): string {
  return mdx
    .replace(/<Citat\b[^>]*\/>/g, (tag) => {
      const c = citat(atribut(tag, 'id') ?? '');
      return c ? ` „${c}“ ` : ' ';
    })
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|\*|__|_)([^*_\n]+)\1/g, '$2')
    .replace(/\s+([.,;:!?…“])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Oddíly Kdo je na tvé straně z textu kroku: blok → strany v pořadí. Tentýž blok může mít v kroku víc oddílů
 * (cesta 8); jejich strany se sečtou.
 */
export function stranyZMdx(body: string, citat?: (id: string) => string | undefined): Map<string, StranaZMdx[]> {
  const ven = new Map<string, StranaZMdx[]>();
  for (const m of body.matchAll(/<Strany\b([^>]*)>([\s\S]*?)<\/Strany>/g)) {
    const blok = atribut(m[1], 'blok');
    if (!blok) continue;
    const strany = ven.get(blok) ?? [];
    for (const s of m[2].matchAll(/<Strana\b([^>]*)>([\s\S]*?)<\/Strana>/g)) {
      const osoby = atribut(s[1], 'osoby');
      strany.push({
        kody: kodyStrany(atribut(s[1], 'odpoved') ?? ''),
        ...(osoby !== undefined ? { osoby: kodyStrany(osoby) } : {}),
        text: prostyText(s[2], citat),
      });
    }
    ven.set(blok, strany);
  }
  return ven;
}

/** Bloky s odpovědí (Volba, Spor, Změň jednu věc) v textu kroku, v pořadí. */
export function blokyZMdx(body: string): string[] {
  return [...body.matchAll(/<(?:Volba|Spor|ZmenJednuVec)\b[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
}

/** Id závěrečného pravidla cesty v textu posledního kroku. */
export function pravidloZMdx(body: string): string | undefined {
  return body.match(/<ZaverCesty\b[^>]*\bid="([^"]+)"/)?.[1];
}

/**
 * Zastánci jedné odpovědi bloku. Oddíl Kdo je na tvé straně má přednost: jeho atribut `osoby`, a když chybí,
 * u Sporu osoba, jejíž kód odpověď nese (důvod je text oddílu, jen u první osoby atributu). Bez oddílu: u Sporu strana, ke které se student
 * přiklonil, uprostřed obě strany (důvod je postoj a první argument); Volba a Změň jednu věc bez oddílu nikoho nemají.
 */
export function zastanciOdpovedi(
  kod: string,
  strany: StranaZMdx[] | undefined,
  spor?: { osoba?: string; postoj: string; argumenty: string[] }[],
): ZastanceKatalogu[] {
  const oddil = strany?.find((s) => s.kody.includes(kod));
  if (oddil) {
    const osoby = oddil.osoby ?? (spor?.some((s) => s.osoba === kod) ? [kod] : []);
    // Odstavec začíná prvním jmenovaným: pod dalšími by četl student větu o někom jiném.
    return osoby.map((osoba, i) => (i === 0 ? { osoba, duvod: oddil.text } : { osoba }));
  }
  if (!spor) return [];
  return spor
    .filter((s) => s.osoba && (kod === 'uprostred' || s.osoba === kod))
    .map((s) => ({ osoba: s.osoba!, duvod: duvodStranySporu(s) }));
}
