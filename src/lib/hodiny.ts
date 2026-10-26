// Příprava hodiny (větev hodiny-v1, docs/plany/hodiny-v1.md): katalog zastavení, formát hodiny a „Doma projdi“.
// Zastavení je místo, které v atlasu už existuje: stránka a kotva na ní. Katalog se skládá při sestavení
// z obsahu a dat (endpoint /hodina/katalog.json); názvy bere ze stejných polí, ze kterých je skládá stránka.
// Čisté funkce bez DOM a Astra: běží při sestavení, v prohlížeči i v testech (tests/data/hodiny.test.ts).
import type { TOsoba } from './schema';
import { interval } from './casy';
import { seradHlasy } from './otazky';
import { otazkaKdoZil } from './bloky';
import { NAZVY_KRESEB, NADTITULKY_KRESEB } from './kresby';
import { VYCHOZI_NADTITULKY } from './nadtitulky';
import { ODDILY } from './oddily';

// ─── Zastavení ────────────────────────────────────────────────────────────────

/**
 * Druh zastavení. Id má tvar `<předpona>:<stránka>[/<část>]`:
 * k:<cesta> přehled cesty, k:<cesta>/<n> krok · o:<profil> celý profil, o:<profil>/<kotva> kapitola nebo oddíl ·
 * h:<otázka> celá stránka otázky, h:<otázka>/<osoba> hlas · b:<id bloku> blok · p:<id příběhu> příběh ·
 * t:<týden> celý týden cvičení (Stoický týden; třída ho projde doma, dny zastavením nejsou).
 */
export type DruhZastaveni = 'cesta' | 'krok' | 'profil' | 'kapitola' | 'oddil' | 'otazka' | 'hlas' | 'blok' | 'pribeh' | 'tyden';

export interface Zastaveni {
  id: string;
  druh: DruhZastaveni;
  /** název, jak ho nese stránka (nadpis kroku, kapitoly, otázka bloku, jméno u hlasu) */
  nazev: string;
  /** název stránky, na které zastavení stojí */
  kde: string;
  /** adresa stránky */
  stranka: string;
  /** kotva na stránce (bez #); celá stránka kotvu nemá */
  kotva: string | null;
  /** stránka a kotva */
  adresa: string;
  /** období 1–8; stránka otázky žádné nemá */
  obdobi: number | null;
  /** slug cesty (přehled, krok a vše v kroku) */
  cesta?: string;
  /** číslo kroku */
  krok?: number;
  /** id osoby v lide.yaml: hlavní osoba profilu, osoba hlasu */
  osoba?: string;
  /** slug otázky (stránka otázky a hlasy) */
  otazka?: string;
  /** komponenta bloku, jak se píše v MDX (Volba, Odkryj, Lod…) */
  typ?: string;
  /** nadtitulek bloku, jak stojí na stránce nad ním („Tvůj tah“, „Zkus si to“); závěr cesty a jiné části ho nemají */
  nadtitulek?: string;
  /** číslo kapitoly („01“) */
  cislo?: string;
  /** zastavení, do kterého tohle patří (krok, kapitola, stránka); stránka sama žádné */
  rodic: string | null;
  /** pořadí na stránce: stránka 0, pak části tak, jak za sebou stojí */
  poradi: number;
}

/** Tvar id zastavení; jiný řetězec v odkazu se zahodí. */
export const ID_ZASTAVENI = /^[kohbpt]:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

// ─── Vstup katalogu: tvar kolekcí Astra, jen pole, která katalog potřebuje ───

type OsobaKatalogu = Pick<TOsoba, 'id' | 'jmeno' | 'obdobi' | 'narozen' | 'zemrel' | 'aktivni'>;

export interface VstupKatalogu {
  cesty: { id: string; data: { cislo: number; nazev: string; obdobi: number } }[];
  kroky: { data: { cesta: string; krok: number; nazev: string }; body?: string }[];
  osobnosti: {
    id: string;
    data: {
      osoba: string;
      dalsi?: string[];
      titulek: string;
      kapitoly: { cislo: string; kotva: string; nazev: string; stav: 'hotovo' | 'osnova' }[];
    };
    body?: string;
  }[];
  otazky: { id: string; data: { cislo: number; otazka: string; hlasy?: { osoba: string }[] } }[];
  /** bloky z YAML (src/content/bloky): Volba, Roztřiď, Změň jednu věc, Spor */
  bloky: { id: string; data: { otazka?: string; nadtitulek?: string } }[];
  /** týdny cvičení (src/content/tydny); starší vstup je nemá */
  tydny?: { id: string; data: { nazev: string; obdobi: number } }[];
  osoby: Map<string, OsobaKatalogu>;
}

// ─── Značky v MDX ─────────────────────────────────────────────────────────────

/** Bloky, jejichž otázka je v YAML (src/content/bloky/<id>.yaml). */
const BLOKY_Z_YAML = new Set(['Volba', 'Roztrid', 'ZmenJednuVec', 'Spor']);
/** Bloky, jejichž otázka je atributem v MDX. */
const BLOKY_S_OTAZKOU = new Set(['Odkryj', 'NejdrivSam', 'ZaverCesty']);

interface Znacka {
  jmeno: string;
  atributy: Record<string, string>;
}

/**
 * Otevírací značky komponent v textu MDX v pořadí, jak stojí. Atributy jen řetězcové („…“) a výrazy ve složených
 * závorkách (jako text). Komentáře {/* … *\/} se přeskočí.
 */
export function znackyMdx(body: string): Znacka[] {
  const text = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const vyraz = String.raw`\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}`;
  const znacka = new RegExp(String.raw`<([A-Z][A-Za-z]*)((?:\s+[A-Za-z][\w:-]*(?:=(?:"[^"]*"|'[^']*'|${vyraz}))?)*)\s*\/?>`, 'g');
  const atribut = new RegExp(String.raw`([A-Za-z][\w:-]*)(?:=(?:"([^"]*)"|'([^']*)'|(${vyraz})))?`, 'g');
  const vysledek: Znacka[] = [];
  for (const m of text.matchAll(znacka)) {
    const atributy: Record<string, string> = {};
    for (const a of m[2].matchAll(atribut)) atributy[a[1]] = a[2] ?? a[3] ?? a[4] ?? '';
    vysledek.push({ jmeno: m[1], atributy });
  }
  return vysledek;
}

/** Název bez značek kurzívy (*…*) a zalomení řádků. */
const cisty = (s: string) => s.replace(/\*/g, '').replace(/\s+/g, ' ').trim();

/** Pole nadtitulku jen tam, kde nějaký je (katalog v JSON nenese prázdná pole). */
const sNadtitulkem = (n: string | undefined): { nadtitulek?: string } => (n ? { nadtitulek: cisty(n) } : {});

// ─── Katalog ──────────────────────────────────────────────────────────────────

const adresa = (stranka: string, kotva: string | null) => (kotva ? `${stranka}#${kotva}` : stranka);

/**
 * Seznam všech zastavení: cesty (přehled, kroky, bloky a příběhy v krocích), profily (celá stránka, kapitoly,
 * oddíly Doba a lidé, Myšlenky, Zkus to žít, bloky a příběhy), stránky otázek s hlasy a týdny cvičení. Medailonky v katalogu nejsou.
 * Zastaví sestavení, když blok chybí v datech, kapitola v textu nesedí na kapitoly ve frontmatteru, nebo když
 * dvě zastavení dostanou stejné id.
 */
export function katalogZastaveni(v: VstupKatalogu): Zastaveni[] {
  const vse: Zastaveni[] = [];
  const otazkaBloku = new Map(v.bloky.map((b) => [b.id, b.data.otazka]));
  const nadtitulekBloku = new Map(v.bloky.map((b) => [b.id, b.data.nadtitulek]));
  const vychozi = (jmeno: string): string | undefined => VYCHOZI_NADTITULKY[jmeno as keyof typeof VYCHOZI_NADTITULKY];
  const jmeno = (id: string) => {
    const o = v.osoby.get(id);
    if (!o) throw new Error(`Katalog hodin: osoba „${id}“ není v lide.yaml.`);
    return o;
  };

  /** Blok nebo příběh ze značky; null pro značku, která zastavením není. */
  const castZeZnacky = (z: Znacka, stranka: string): Pick<Zastaveni, 'id' | 'druh' | 'nazev' | 'kotva' | 'typ' | 'nadtitulek'> | null => {
    const a = z.atributy;
    if (z.jmeno === 'Pribeh') {
      if (!a.id) return null;
      const nazev = a.titulek ?? a.nadtitulek ?? a.popisek;
      if (!nazev) throw new Error(`Katalog hodin: příběh „${a.id}“ na ${stranka} nemá titulek, nadtitulek ani popisek.`);
      return { id: `p:${a.id}`, druh: 'pribeh', nazev: cisty(nazev), kotva: a.id, typ: 'Pribeh' };
    }
    if (BLOKY_Z_YAML.has(z.jmeno)) {
      const otazka = otazkaBloku.get(a.id);
      if (!otazka) throw new Error(`Katalog hodin: blok „${a.id}“ (${z.jmeno}) na ${stranka} nemá v src/content/bloky otázku.`);
      return { id: `b:${a.id}`, druh: 'blok', nazev: cisty(otazka), kotva: a.id, typ: z.jmeno, ...sNadtitulkem(nadtitulekBloku.get(a.id) ?? vychozi(z.jmeno)) };
    }
    if (BLOKY_S_OTAZKOU.has(z.jmeno)) {
      if (!a.id || !a.otazka) throw new Error(`Katalog hodin: blok ${z.jmeno} na ${stranka} potřebuje id a otázku.`);
      return { id: `b:${a.id}`, druh: 'blok', nazev: cisty(a.otazka), kotva: a.id, typ: z.jmeno, ...sNadtitulkem(a.nadtitulek ?? vychozi(z.jmeno)) };
    }
    if (z.jmeno === 'KdoZilDriv') {
      // Výchozí id a otázku skládá blok stejně (src/components/bloky/KdoZilDriv.astro).
      const druh = a.druh === 'vzdalenost' ? 'vzdalenost' : 'poradi';
      const id = a.id ?? `kdo-${a.a}-${a.b}-${druh}`;
      const nazev = a.otazka ?? otazkaKdoZil(jmeno(a.a).jmeno, jmeno(a.b).jmeno, druh);
      return { id: `b:${id}`, druh: 'blok', nazev: cisty(nazev), kotva: id, typ: z.jmeno, nadtitulek: VYCHOZI_NADTITULKY.KdoZilDriv };
    }
    if (z.jmeno in NAZVY_KRESEB) {
      if (!a.id) throw new Error(`Katalog hodin: kresba ${z.jmeno} na ${stranka} nemá id.`);
      const k = z.jmeno as keyof typeof NAZVY_KRESEB;
      return { id: `b:${a.id}`, druh: 'blok', nazev: NAZVY_KRESEB[k], kotva: a.id, typ: z.jmeno, nadtitulek: NADTITULKY_KRESEB[k] };
    }
    return null;
  };

  // Cesty: přehled, pak kroky a v každém kroku bloky a příběhy.
  for (const c of [...v.cesty].sort((a, b) => a.data.cislo - b.data.cislo)) {
    const slug = c.id;
    const stranka = `/cesta/${slug}/`;
    const spolecne = { kde: c.data.nazev, obdobi: c.data.obdobi, cesta: slug };
    vse.push({ id: `k:${slug}`, druh: 'cesta', nazev: c.data.nazev, stranka, kotva: null, adresa: stranka, rodic: null, poradi: 0, ...spolecne });
    const kroky = v.kroky.filter((k) => k.data.cesta === slug).sort((a, b) => a.data.krok - b.data.krok);
    kroky.forEach((k, i) => {
      if (k.data.krok !== i + 1) throw new Error(`Katalog hodin: cesta „${slug}“ má kroky číslované s mezerou (chybí ${i + 1}).`);
    });
    for (const k of kroky) {
      const n = k.data.krok;
      const strankaKroku = `/cesta/${slug}/${n}/`;
      const idKroku = `k:${slug}/${n}`;
      vse.push({ id: idKroku, druh: 'krok', nazev: k.data.nazev, stranka: strankaKroku, kotva: null, adresa: strankaKroku, krok: n, rodic: `k:${slug}`, poradi: 0, ...spolecne });
      let poradi = 0;
      for (const z of znackyMdx(k.body ?? '')) {
        const cast = castZeZnacky(z, strankaKroku);
        if (cast) vse.push({ ...cast, stranka: strankaKroku, adresa: adresa(strankaKroku, cast.kotva), krok: n, rodic: idKroku, poradi: ++poradi, ...spolecne });
      }
    }
  }

  // Profily: podle období, v něm podle narození hlavní osoby.
  const zacatek = (id: string) => interval(jmeno(id))?.[0] ?? Number.POSITIVE_INFINITY;
  const profily = [...v.osobnosti].sort(
    (a, b) => jmeno(a.data.osoba).obdobi - jmeno(b.data.osoba).obdobi || zacatek(a.data.osoba) - zacatek(b.data.osoba),
  );
  for (const p of profily) {
    const osoba = jmeno(p.data.osoba);
    const dvojice = (p.data.dalsi?.length ?? 0) > 0;
    const nazevStranky = dvojice ? p.data.titulek : osoba.jmeno;
    const stranka = `/osobnost/${p.id}/`;
    const idStranky = `o:${p.id}`;
    const spolecne = { kde: nazevStranky, stranka, obdobi: osoba.obdobi, osoba: osoba.id };
    vse.push({ id: idStranky, druh: 'profil', nazev: nazevStranky, kotva: null, adresa: stranka, rodic: null, poradi: 0, ...spolecne });

    const kapitoly = p.data.kapitoly.filter((k) => k.stav === 'hotovo');
    const vTextu: string[] = [];
    let rodic = idStranky;
    let poradi = 0;
    const oddil = (kotva: string, druh: 'kapitola' | 'oddil', nazev: string, cislo?: string) => {
      const id = `o:${p.id}/${kotva}`;
      vse.push({ id, druh, nazev, kotva, adresa: adresa(stranka, kotva), rodic: idStranky, poradi: ++poradi, ...(cislo ? { cislo } : {}), ...spolecne });
      rodic = id;
    };
    for (const z of znackyMdx(p.body ?? '')) {
      const a = z.atributy;
      if (z.jmeno === 'Kapitola') {
        const k = kapitoly.find((x) => x.kotva === a.kotva);
        if (!k) throw new Error(`Katalog hodin: kapitola „${a.kotva}“ v textu ${p.id}.mdx není mezi hotovými kapitolami ve frontmatteru.`);
        vTextu.push(k.kotva);
        oddil(k.kotva, 'kapitola', k.nazev, k.cislo);
      } else if (z.jmeno === 'DobaALide') oddil(ODDILY.doba.kotva, 'oddil', ODDILY.doba.nazev);
      else if (z.jmeno === 'Myslenky') oddil(ODDILY.myslenky.kotva, 'oddil', a.titulek ?? ODDILY.myslenky.nazev);
      else if (z.jmeno === 'ZkusToZitKarta') oddil(ODDILY.zkus.kotva, 'oddil', a.nazev ? `${ODDILY.zkus.nazev}: ${a.nazev}` : ODDILY.zkus.nazev);
      else if (z.jmeno === 'KamDal') rodic = idStranky;
      else {
        const cast = castZeZnacky(z, stranka);
        if (cast) vse.push({ ...cast, adresa: adresa(stranka, cast.kotva), rodic, poradi: ++poradi, ...spolecne });
      }
    }
    const ocekavane = kapitoly.map((k) => k.kotva);
    if (vTextu.join() !== ocekavane.join()) {
      throw new Error(`Katalog hodin: kapitoly v textu ${p.id}.mdx (${vTextu.join(', ')}) nesedí na frontmatter (${ocekavane.join(', ')}).`);
    }
  }

  // Stránky otázek s hlasy; hlasy v pořadí časové osy.
  for (const q of [...v.otazky].sort((a, b) => a.data.cislo - b.data.cislo)) {
    const hlasy = q.data.hlasy ?? [];
    if (!hlasy.length) continue;
    const stranka = `/otazka/${q.id}/`;
    const idStranky = `h:${q.id}`;
    const spolecne = { kde: q.data.otazka, stranka, otazka: q.id };
    vse.push({ id: idStranky, druh: 'otazka', nazev: q.data.otazka, kotva: null, adresa: stranka, obdobi: null, rodic: null, poradi: 0, ...spolecne });
    seradHlasy(hlasy, v.osoby).forEach((h, i) => {
      const o = jmeno(h.osoba);
      const kotva = `hlas-${o.id}`;
      vse.push({ id: `h:${q.id}/${o.id}`, druh: 'hlas', nazev: o.jmeno, kotva, adresa: adresa(stranka, kotva), obdobi: o.obdobi, osoba: o.id, rodic: idStranky, poradi: i + 1, ...spolecne });
    });
  }

  // Týdny cvičení: jen celá stránka, jeden odkaz; třída ho projde doma.
  for (const t of [...(v.tydny ?? [])].sort((a, b) => a.data.obdobi - b.data.obdobi || a.id.localeCompare(b.id))) {
    const stranka = `/tyden/${t.id}/`;
    vse.push({ id: `t:${t.id}`, druh: 'tyden', nazev: t.data.nazev, kde: t.data.nazev, stranka, kotva: null, adresa: stranka, obdobi: t.data.obdobi, rodic: null, poradi: 0 });
  }

  const videne = new Map<string, Zastaveni>();
  for (const z of vse) {
    if (!ID_ZASTAVENI.test(z.id)) throw new Error(`Katalog hodin: id „${z.id}“ nemá platný tvar.`);
    const drive = videne.get(z.id);
    if (drive) throw new Error(`Katalog hodin: id „${z.id}“ je dvakrát (${drive.adresa} a ${z.adresa}).`);
    videne.set(z.id, z);
  }
  return vse;
}

// ─── Podoba na plátně (krok H4) ───────────────────────────────────────────────

/**
 * Jak se blok nebo kresba ukáže při promítání: celý blok (výchozí), jen otázka a možnosti (bez scény, Kam dál
 * a vlastního psaní), otevřená otázka (jen nadtitulek a otázka; karty ukáže až Ukázat možnosti), jen kresba
 * (plátno a ovládání, text pod kresbou jen pro čtečky). Doma a s lištou student vidí stránku vždy celou.
 * Které části bloku podoba skrývá, říkají značky data-cast v komponentách a src/styles/promitani.css.
 */
export type Podoba = 'cely' | 'moznosti' | 'otevrena' | 'kresba';

/** Krátká značka podoby v odkazu za id zastavení (b:cesta1-jak-zjistit~o). Celý blok značku nemá. */
export const ZNACKY_PODOB = { moznosti: 'm', otevrena: 'o', kresba: 'k' } as const satisfies Record<Exclude<Podoba, 'cely'>, string>;
const PODOBA_ZE_ZNACKY: Record<string, Podoba> = Object.fromEntries(Object.entries(ZNACKY_PODOB).map(([p, z]) => [z, p as Podoba]));

const VSECHNY_PODOBY: readonly Podoba[] = ['cely', 'moznosti', 'otevrena', 'kresba'];
const S_OTAZKOU: Podoba[] = ['cely', 'moznosti', 'otevrena'];
/** Podoby podle komponenty bloku (docs/design.md › Podoba na plátně). Kresby mají celou a jen kresbu. */
const PODOBY_BLOKU: Record<string, Podoba[]> = {
  Volba: S_OTAZKOU,
  Odkryj: S_OTAZKOU,
  NejdrivSam: S_OTAZKOU,
  Spor: S_OTAZKOU,
  ZmenJednuVec: S_OTAZKOU,
  KdoZilDriv: S_OTAZKOU,
  // Roztřiď bez karet nemá co ukázat; Závěr cesty je jen otázka a pole na vlastní pravidlo.
  Roztrid: ['cely', 'moznosti'],
  ZaverCesty: ['cely'],
};

/** Podoby, které má zastavení: blok podle komponenty, kresba celá nebo jen kresba, ostatní zastavení jen celé. */
export function podobyZastaveni(z: { druh: DruhZastaveni; typ?: string }): Podoba[] {
  if (z.druh !== 'blok' || !z.typ) return ['cely'];
  if (z.typ in NAZVY_KRESEB) return ['cely', 'kresba'];
  return PODOBY_BLOKU[z.typ] ?? ['cely'];
}

/** Název podoby ve skladateli a v tisku. U Odkryj jsou „možnosti“ skrytá část, proto „odkrytí“. */
export function nazevPodoby(p: Podoba, typ?: string): string {
  if (p === 'moznosti' && (typ === 'Odkryj' || typ === 'NejdrivSam')) return 'Jen otázka a odkrytí';
  return { cely: 'Celý blok', moznosti: 'Jen otázka a možnosti', otevrena: 'Otevřená otázka', kresba: 'Jen kresba' }[p];
}

/** Podoba, jak se na plátně opravdu ukáže: podoba, kterou zastavení nemá (nebo žádná), je celý blok. */
export function ucinnaPodoba(z: { druh: DruhZastaveni; typ?: string }, p: Podoba | undefined): Podoba {
  return p && podobyZastaveni(z).includes(p) ? p : 'cely';
}

/** Podoba z neznámého vstupu (soubor, úložiště); celý blok a cokoli neplatného je undefined. */
export function platnaPodoba(x: unknown): Exclude<Podoba, 'cely'> | undefined {
  return typeof x === 'string' && x !== 'cely' && (VSECHNY_PODOBY as readonly string[]).includes(x) ? (x as Exclude<Podoba, 'cely'>) : undefined;
}

/** Id s podobou z odkazu: „b:x~o“ → id a podoba; bez značky nebo s neznámou značkou celý blok (podoba undefined). */
export function rozeberZastaveniOdkazu(s: string): { id: string; podoba?: Exclude<Podoba, 'cely'> } {
  const [id, znacka] = s.trim().split('~');
  const p = znacka !== undefined ? platnaPodoba(PODOBA_ZE_ZNACKY[znacka]) : undefined;
  return p ? { id, podoba: p } : { id };
}

/** Zastavení do odkazu: id a za vlnovkou značka podoby, celý blok jen id. */
export const zastaveniDoOdkazu = (id: string, p?: Podoba): string => (p && p !== 'cely' ? `${id}~${ZNACKY_PODOB[p]}` : id);

// ─── Hodina ───────────────────────────────────────────────────────────────────

export const VERZE_HODINY = 1;
/** Klíč v localStorage; hodiny žijí odděleně od deníku. */
export const KLIC_HODIN = 'atlas-hodiny';
/** Co uvidí student místo zastavení, které atlas mezitím přejmenoval nebo zrušil. */
export const NENI_V_ATLASU = 'Tohle místo už v atlasu není';
const NEJVIC_ZASTAVENI = 60;
const NEJDELSI_NAZEV = 120;

/** Hodina, jak ji má učitel uloženou u sebe (a v souboru .json). Poznámky zůstávají jen u něj. */
export interface UlozenaHodina {
  verze: 1;
  /** id hodiny v úložišti */
  id: string;
  nazev: string;
  /** poznámka k celé hodině */
  poznamka: string;
  /** `podoba` jen u bloku a kresby, které se na plátně neukážou celé (chybí = celý blok; starší hodiny ji nemají) */
  zastaveni: ZastaveniHodiny[];
  /** datum poslední změny (ISO) */
  zmeneno: string;
}

export interface ZastaveniHodiny {
  id: string;
  poznamka: string;
  podoba?: Exclude<Podoba, 'cely'>;
}

/** Co nese odkaz pro studenty: název, pořadí zastavení a podoba na plátně (promítá se i ze stránky hodiny), nic víc. */
export interface HodinaProStudenty {
  nazev: string;
  /** id zastavení bez značky podoby */
  zastaveni: string[];
  /** podoba podle id, jen u zastavení, která nejsou celá */
  podoby?: Record<string, Exclude<Podoba, 'cely'>>;
}

const nazevHodiny = (s: unknown) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, NEJDELSI_NAZEV) : '');
const bezOpakovani = (ids: string[]) => [...new Set(ids)].slice(0, NEJVIC_ZASTAVENI);

/**
 * Adresa hodiny pro studenty: /hodina/?v=1&n=<název>&z=<id>,<id>~o… Podoba na plátně jde za id jako značka
 * (ZNACKY_PODOB); poznámky učitele do adresy nikdy nejdou.
 */
export function adresaHodiny(
  h: { nazev: string; zastaveni: (string | { id: string; podoba?: Podoba })[]; podoby?: Record<string, Podoba> },
  zaklad = '/hodina/',
): string {
  const podoby = new Map<string, Podoba | undefined>();
  for (const z of h.zastaveni) {
    const id = typeof z === 'string' ? z : z.id;
    if (ID_ZASTAVENI.test(id) && !podoby.has(id)) podoby.set(id, typeof z === 'string' ? h.podoby?.[id] : z.podoba);
  }
  const ids = [...podoby.keys()].slice(0, NEJVIC_ZASTAVENI);
  const casti = [`v=${VERZE_HODINY}`];
  const nazev = nazevHodiny(h.nazev);
  if (nazev) casti.push(`n=${encodeURIComponent(nazev)}`);
  casti.push(`z=${ids.map((id) => zastaveniDoOdkazu(id, podoby.get(id))).join(',')}`);
  return `${zaklad}?${casti.join('&')}`;
}

/**
 * Hodina z adresy (celé adresy, nebo jen části za ?). Neznámá verze vrátí null. Řetězec, který nemá tvar id,
 * se zahodí; id, které v atlasu není, zůstane a ukáže se jako „Tohle místo už v atlasu není“. Značka podoby
 * za id (~o) se přečte do `podoby`; bez značky, nebo s neznámou, je zastavení celé.
 */
export function hodinaZAdresy(odkaz: string): HodinaProStudenty | null {
  const hledani = odkaz.includes('?') ? odkaz.slice(odkaz.indexOf('?') + 1).split('#')[0] : odkaz;
  const p = new URLSearchParams(hledani);
  if (p.get('v') !== String(VERZE_HODINY)) return null;
  const casti = (p.get('z') ?? '').split(',').map(rozeberZastaveniOdkazu).filter((z) => ID_ZASTAVENI.test(z.id));
  const zastaveni = bezOpakovani(casti.map((z) => z.id));
  const podoby: Record<string, Exclude<Podoba, 'cely'>> = {};
  const videne = new Set<string>();
  for (const z of casti) {
    if (videne.has(z.id)) continue; // opakované zastavení: platí první výskyt i se svou podobou
    videne.add(z.id);
    if (z.podoba && zastaveni.includes(z.id)) podoby[z.id] = z.podoba;
  }
  const nazev = nazevHodiny(p.get('n'));
  return Object.keys(podoby).length ? { nazev, zastaveni, podoby } : { nazev, zastaveni };
}

/** Uložená hodina bez poznámek: to, co se smí sdílet (název, pořadí, podoby na plátně). */
export function hodinaProStudenty(h: UlozenaHodina): HodinaProStudenty {
  const podoby = Object.fromEntries(h.zastaveni.filter((z) => z.podoba).map((z) => [z.id, z.podoba!]));
  const zastaveni = h.zastaveni.map((z) => z.id);
  return Object.keys(podoby).length ? { nazev: h.nazev, zastaveni, podoby } : { nazev: h.nazev, zastaveni };
}

/** Hodina ze souboru .json (import), nebo null, když soubor hodinou není. Poznámky a zastavení se pročistí. */
export function hodinaZeSouboru(text: string): UlozenaHodina | null {
  let x: unknown;
  try {
    x = JSON.parse(text);
  } catch {
    return null;
  }
  if (!x || typeof x !== 'object') return null;
  const h = x as Partial<UlozenaHodina>;
  if (h.verze !== VERZE_HODINY || typeof h.id !== 'string' || !Array.isArray(h.zastaveni)) return null;
  const videne = new Set<string>();
  const zastaveni = h.zastaveni
    .filter((z): z is ZastaveniHodiny => !!z && typeof z.id === 'string' && ID_ZASTAVENI.test(z.id))
    .filter((z) => !videne.has(z.id) && !!videne.add(z.id))
    .slice(0, NEJVIC_ZASTAVENI)
    .map((z): ZastaveniHodiny => {
      const podoba = platnaPodoba(z.podoba);
      return { id: z.id, poznamka: typeof z.poznamka === 'string' ? z.poznamka : '', ...(podoba ? { podoba } : {}) };
    });
  return {
    verze: VERZE_HODINY,
    id: h.id,
    nazev: nazevHodiny(h.nazev),
    poznamka: typeof h.poznamka === 'string' ? h.poznamka : '',
    zastaveni,
    zmeneno: typeof h.zmeneno === 'string' ? h.zmeneno : new Date(0).toISOString(),
  };
}

export type NalezeneZastaveni = { id: string; nalezeno: true; zastaveni: Zastaveni } | { id: string; nalezeno: false; text: string };

/** Zastavení hodiny v pořadí; id, které v katalogu není, nespadne, ale vrátí „Tohle místo už v atlasu není“. */
export function najdiZastaveni(katalog: Zastaveni[], ids: string[]): NalezeneZastaveni[] {
  const podleId = new Map(katalog.map((z) => [z.id, z]));
  return ids.map((id) => {
    const z = podleId.get(id);
    return z ? { id, nalezeno: true, zastaveni: z } : { id, nalezeno: false, text: NENI_V_ATLASU };
  });
}

// ─── Doma projdi ──────────────────────────────────────────────────────────────

/** Co student prošel: otevřené kroky podle slugu cesty (deník › cesty) a čtené kapitoly podle adresy profilu. */
export interface Proslo {
  kroky: Record<string, number[]>;
  kapitoly: Record<string, string[]>;
}

export interface SkupinaDoma {
  /** cesta (přehled), nebo profil, kterého se hodina dotkla */
  zastaveni: Zastaveni;
  /** kroky nebo kapitoly, které v hodině nebyly; `proslo`: student je už otevřel nebo četl */
  polozky: { zastaveni: Zastaveni; proslo: boolean }[];
}

/**
 * „Doma projdi“: ke každé cestě a profilu, kterých se hodina dotkla, kroky a kapitoly, které v ní nebyly.
 * Krok nebo kapitola je v hodině, když v ní je sama, nebo cokoli, co na ní stojí (blok v kroku, příběh v kapitole).
 * Celý profil v hodině znamená všechny jeho kapitoly; přehled cesty kroky nepokrývá. Stránky otázek se nepočítají.
 * Skupiny jsou v pořadí, v jakém se jich hodina poprvé dotkla; skupina bez zbytku vypadne.
 */
export function domaProjdi(ids: string[], katalog: Zastaveni[], proslo: Proslo): SkupinaDoma[] {
  const podleId = new Map(katalog.map((z) => [z.id, z]));
  const predci = (z: Zastaveni) => {
    const cesta: Zastaveni[] = [];
    for (let r = z.rodic ? podleId.get(z.rodic) : undefined; r; r = r.rodic ? podleId.get(r.rodic) : undefined) cesta.push(r);
    return cesta;
  };
  const vHodine = new Set<string>();
  const celeProfily = new Set<string>();
  const dotcene: Zastaveni[] = [];
  for (const id of ids) {
    const z = podleId.get(id);
    if (!z) continue;
    const nahoru = predci(z);
    vHodine.add(z.id);
    for (const r of nahoru) vHodine.add(r.id);
    if (z.druh === 'profil') celeProfily.add(z.id);
    const koren = nahoru.at(-1) ?? z;
    if ((koren.druh === 'cesta' || koren.druh === 'profil') && !dotcene.includes(koren)) dotcene.push(koren);
  }
  const skupiny: SkupinaDoma[] = [];
  for (const k of dotcene) {
    const polozky =
      k.druh === 'cesta'
        ? katalog
            .filter((z) => z.druh === 'krok' && z.cesta === k.cesta && !vHodine.has(z.id))
            .map((z) => ({ zastaveni: z, proslo: (proslo.kroky[k.cesta!] ?? []).includes(z.krok!) }))
        : celeProfily.has(k.id)
          ? []
          : katalog
              .filter((z) => z.druh === 'kapitola' && z.rodic === k.id && !vHodine.has(z.id))
              .map((z) => ({ zastaveni: z, proslo: (proslo.kapitoly[k.stranka] ?? []).includes(z.kotva!) }));
    if (polozky.length) skupiny.push({ zastaveni: k, polozky });
  }
  return skupiny;
}
