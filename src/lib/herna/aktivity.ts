// Malá aktivita na stránce osoby (herna-v1, K4; pravidlo pestrosti 4): atlas vybere z dat jednu hru podle toho,
// co je u člověka zajímavé, a sousední stránky v seznamu Lidé dostanou různé hry.
//   daleká cesta nebo vyhnanství  → Kde to bylo?
//   věta člověka, se kterým se znal, učil nebo přel → Kdo to řekl? (odkrytí řekne, kdo na koho navázal)
//   velká mezera k tomu, koho četl, nebo dlouhý život → Tipni si
//   překvapivý současník (druhý člověk bez vztahu, src/lib/dvojice.ts) → Kdo žil dřív? (má ho každý, je to záloha)
// Výběr je pevný: síla kandidáta z dat a semínko z id osoby (FNV-1a), žádná náhoda. Profily mají svou aktivitu
// napsanou ručně (Kdo žil dřív? v MDX) a výběr ji bere jako pevnou; medailonek dostane hru sestavenou z dat
// (obsahAktivity), obaly her ji vezmou místo YAML. Zásada Pointa není paměť: hra dává do ruky myšlenku (proc),
// vztah nebo pobyt, roky jsou drobný údaj.
// Čisté funkce bez Astra a DOM; testy tests/data/herna-k4.test.ts, výpis scripts/herna-k4-vypis.ts.
import { vzdalenost, zivotOsoby, let_, LIDSKY_ZIVOT } from '../cas-mapy';
import { zijiZaroven, NEJMENSI_MEZERA } from '../dvojice';
import { interval } from '../casy';
import { BlokKde, BlokKdoRekl, BlokTipni, type TBlokKde, type TBlokKdoRekl, type TBlokTipni } from '../bloky-schema';
import type { TOsoba, TVztah } from '../schema';
import { semeno, zamichej } from './michani';
import { prvniVeta, prozrazuje } from './citaty';
import { vazbaDvou, type VztahVazby } from './vazby';

export type DruhAktivity = 'kdo-zil' | 'kde' | 'kdo-rekl' | 'tipni';

/** Jméno komponenty bloku (katalog hodin, nadtitulky). */
export const KOMPONENTA_AKTIVITY: Record<DruhAktivity, string> = {
  'kdo-zil': 'KdoZilDriv',
  kde: 'KdeToBylo',
  'kdo-rekl': 'KdoToRekl',
  tipni: 'TipniSi',
};

type Role = TOsoba['mista'][number]['role'];
export type OsobaAktivity = Pick<TOsoba, 'id' | 'jmeno' | 'obdobi' | 'narozen' | 'zemrel' | 'aktivni' | 'mista' | 'proc'> &
  Partial<Pick<TOsoba, 'jmeno2' | 'zena' | 'tradice' | 'hloubka'>>;

export type Aktivita =
  | { druh: 'kdo-zil'; sila: number; b: string }
  | { druh: 'kde'; sila: number; misto: string; role: Role; km: number | null }
  | { druh: 'kdo-rekl'; sila: number; citat: string; mluvci: string; jini: string[] }
  | { druh: 'tipni'; sila: number; a: string; b: string; duvod: 'cetl' | 'zivot' };

export interface KontextAktivit {
  lide: readonly OsobaAktivity[];
  vztahy: readonly VztahVazby[];
  citaty: readonly { id: string; osoba?: string; autor?: string; tradice?: string; cesky: string }[];
  mista: ReadonlyMap<string, { souradnice: readonly [number, number]; kde?: string }>;
  /** má osoba stránku (profil, portrét, medailonek) */
  maStranku: (id: string) => boolean;
  /** druhý člověk Kdo žil dřív? na medailonku (druziKdoZilDriv), nebo null */
  kdoZil: (id: string) => string | null;
  /** má osoba profil nebo portrét (student ji zná z cest); jinak se bere každá stránka */
  znama?: (id: string) => boolean;
  /**
   * Jak dobře citát stojí sám (vyšší je lepší): 2 = hlas na stránce velké otázky (odpovídá na otázku sám),
   * 1 = citát na stránce atlasu, 0 = jen v datech. Na kartu jde nejdřív citát, který atlas už jako samostatný použil.
   */
  vahaCitatu?: (id: string) => number;
  /**
   * Stojí citát v textu stránky té osoby (profil, herna-v1, T)? Taková věta na kartičku nejde: student by ji
   * o pár obrazovek výš už četl a hra by zkoušela paměť, ne úvahu.
   */
  naStrance?: (osoba: string, citat: string) => boolean;
  /** Druhy aktivit, které profil vylučuje (`<HraOsoby bez="kde" />`: příběh místa vypráví kapitola výš). */
  bez?: (osoba: string) => ReadonlySet<DruhAktivity> | undefined;
}

// ─── Kandidáti ────────────────────────────────────────────────────────────────

/** Vzdálenost dvou míst po povrchu Země (km). */
export function kmMeziMisty(a: readonly [number, number], b: readonly [number, number]): number {
  const r = Math.PI / 180;
  const c = Math.sin(a[1] * r) * Math.sin(b[1] * r) + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.cos((b[0] - a[0]) * r);
  return Math.round(6371 * Math.acos(Math.min(1, Math.max(-1, c))));
}

/** Od kolika kilometrů od rodiště je pobyt „daleká cesta“ (Athény z Kitia, Řím z Kyréné; ne Athény z Théb). */
export const DALEKA_CESTA = 500;
/** Od kolika let je život „dlouhý“ (Gorgiás, Isokratés, Kleanthés). */
export const DLOUHY_ZIVOT = 90;
const ROLE_CESTY: Role[] = ['pusobeni', 'studium', 'pobyt', 'tazeni'];
const PORADI_VZTAHU: TVztah['typ'][] = ['ucitel', 'znali-se', 'polemika', 'vliv-textem'];
/** Citát na kartičku: aspoň pět a nejvýš pětadvacet slov, bez vypuštěného místa (…), které by chtělo výklad. */
const slov = (t: string) => t.trim().split(/\s+/).length;
const NA_KARTU = (t: string) => slov(t) >= 5 && slov(t) <= 25 && !t.includes('…');

/** Kde to bylo?: vyhnanství (i bez roků), jinak nejvzdálenější pobyt s časem aspoň DALEKA_CESTA od rodiště. */
function kandidatKde(o: OsobaAktivity, k: KontextAktivit): Aktivita | null {
  const maKde = (m: { misto: string }) => !!k.mista.get(m.misto)?.kde;
  const exil = o.mista.filter((m) => m.role === 'exil' && maKde(m));
  if (exil.length) {
    const m = exil.find((x) => x.od !== undefined || x.do !== undefined || x.rok !== undefined) ?? exil[0];
    return { druh: 'kde', sila: 3, misto: m.misto, role: 'exil', km: null };
  }
  const rodiste = o.mista.find((m) => m.role === 'narozeni');
  const xy = rodiste && k.mista.get(rodiste.misto)?.souradnice;
  if (!xy) return null;
  const cesty = o.mista
    .filter((m) => ROLE_CESTY.includes(m.role) && maKde(m) && m.misto !== rodiste!.misto && (m.od ?? m.do ?? m.rok) !== undefined)
    .map((m) => ({ m, km: kmMeziMisty(xy, k.mista.get(m.misto)!.souradnice) }))
    .filter((x) => x.km >= DALEKA_CESTA)
    .sort((a, b) => b.km - a.km);
  const c = cesty[0];
  return c ? { druh: 'kde', sila: c.km >= 900 ? 3 : 2, misto: c.m.misto, role: c.m.role, km: c.km } : null;
}

/** Lidé ve vztahu s osobou, seřazení podle druhu vztahu (učitel a žák, znali se, spor, četba). */
function lideKolem(id: string, k: KontextAktivit): string[] {
  const out: string[] = [];
  const vztahy = k.vztahy.filter((v) => v.od === id || v.k === id).sort((a, b) => PORADI_VZTAHU.indexOf(a.typ) - PORADI_VZTAHU.indexOf(b.typ));
  for (const v of vztahy) {
    const druhy = v.od === id ? v.k : v.od;
    if (!out.includes(druhy)) out.push(druhy);
  }
  return out;
}

/**
 * Kdo to řekl?: věta člověka, se kterým měl ten ze stránky vztah (u medailonku nemá svou větu skoro nikdo a jeho
 * vlastní věta by na jeho stránce byla jen hádání jména). Mluvčí nejbližší podle druhu vztahu, se stránkou; citát
 * na kartičku, který věta `proc` mluvčího neopisuje. Další dvě razítka: lidé kolem osoby, pak kolem mluvčího,
 * pak ze stejného období, všichni se stránkou a s větou proc, která citát taky neopisuje.
 */
function kandidatKdoRekl(o: OsobaAktivity, k: KontextAktivit, pouzite: ReadonlySet<string> = new Set()): Aktivita | null {
  const podleId = new Map(k.lide.map((x) => [x.id, x]));
  const sProc = (id: string) => !!podleId.get(id)?.proc && k.maStranku(id);
  const kolem = lideKolem(o.id, k).filter((id) => id !== o.id && podleId.has(id));
  // Věta, ve které stojí jméno (oslovení „Diogene“, „Kritóna“), by napověděla nebo zmátla: ta na kartu nejde.
  const jmena = k.lide.map((x) => x.jmeno.slice(0, 5));
  const bezJmena = (t: string) => !jmena.some((j) => t.includes(j));
  for (const mluvci of kolem.filter((id) => k.maStranku(id))) {
    const proc = prvniVeta(podleId.get(mluvci)!.proc);
    const citaty = k.citaty.filter((c) => c.osoba === mluvci && !c.tradice && !pouzite.has(c.id) && !k.naStrance?.(o.id, c.id) && NA_KARTU(c.cesky) && bezJmena(c.cesky) && !prozrazuje(proc, c.cesky));
    if (!citaty.length) continue;
    const vaha = (id: string) => k.vahaCitatu?.(id) ?? 0;
    const c = zamichej(citaty, `${o.id}:${mluvci}`).sort((x, y) => vaha(y.id) - vaha(x.id))[0];
    // Autor díla, ve kterém mluví jiný (Platón u Sókratovy věty z Obrany), mezi razítka nejde: větu opravdu napsal.
    // Filtruje se až po zamíchání, aby razítka medailonků zůstala stejná jako před pravidlem.
    const smi = (id: string) => id !== o.id && id !== mluvci && sProc(id) && !prozrazuje(prvniVeta(podleId.get(id)!.proc), c.cesky);
    const ze = (ids: string[], klic: string) => zamichej(ids.filter(smi), klic).filter((id) => podleId.get(id)!.jmeno !== c.autor);
    const obdobi = k.lide.filter((x) => x.obdobi === o.obdobi).map((x) => x.id);
    const jini = [...new Set([...ze(kolem, `${o.id}:kolem`), ...ze(lideKolem(mluvci, k), `${o.id}:mluvci`), ...ze(obdobi, `${o.id}:obdobi`)])].slice(0, 2);
    if (jini.length < 2) continue;
    return { druh: 'kdo-rekl', sila: 2, citat: c.id, mluvci, jini };
  }
  return null;
}

/**
 * Tipni si: koho osoba četla a od koho ji dělí aspoň jeden lidský život (Plótínos a Platón), jinak dlouhý život
 * (Gorgiás) a ten nejpozději narozený člověk se stránkou, se kterým ještě žil zároveň (Aristotelés).
 */
function kandidatTipni(o: OsobaAktivity, k: KontextAktivit): Aktivita | null {
  const podleId = new Map(k.lide.map((x) => [x.id, x]));
  const cetl = k.vztahy
    .filter((v) => v.typ === 'vliv-textem' && v.k === o.id && podleId.has(v.od) && k.maStranku(v.od))
    .map((v) => ({ a: v.od, d: vzdalenost(podleId.get(v.od)!, o) }))
    .filter((x) => x.d?.druh === 'deli' && x.d.let >= LIDSKY_ZIVOT)
    .sort((x, y) => y.d!.let - x.d!.let);
  if (cetl[0]) return { druh: 'tipni', sila: cetl[0].d!.let >= 2 * LIDSKY_ZIVOT ? 3 : 2, a: cetl[0].a, b: o.id, duvod: 'cetl' };
  const delka = delkaZivota(o);
  if (delka === null || delka < DLOUHY_ZIVOT) return null;
  // Druhý člověk: narozený po osobě, a přesto s ní žil aspoň dvacet let zároveň (s roky „asi“ by kratší překryv
  // byl past, pouceni: Kdo žil dřív?); nejpozději narozený, nejdřív ze známých (profil, portrét).
  const narozen = o.narozen!.rok;
  const konec = o.zemrel!.rok;
  const pozdejsi = k.lide
    .filter((x) => x.id !== o.id && k.maStranku(x.id) && x.narozen && x.narozen.rok > narozen && konec - x.narozen.rok >= NEJMENSI_MEZERA && zijiZaroven(o, x))
    .sort((x, y) => Number(!!k.znama?.(y.id)) - Number(!!k.znama?.(x.id)) || y.narozen!.rok - x.narozen!.rok || x.id.localeCompare(y.id));
  const b = pozdejsi[0];
  return b ? { druh: 'tipni', sila: delka >= 100 ? 3 : 2, a: o.id, b: b.id, duvod: 'zivot' } : null;
}

/** Délka života v letech (přes rok nula), jen s narozením i úmrtím. */
export function delkaZivota(o: Pick<TOsoba, 'narozen' | 'zemrel'>): number | null {
  if (!o.narozen || !o.zemrel) return null;
  const z = zivotOsoby(o as TOsoba);
  if (!z) return null;
  return o.zemrel.rok - o.narozen.rok - (o.narozen.rok < 0 && o.zemrel.rok > 0 ? 1 : 0);
}

/** Všechny aktivity, které pro osobu data unesou; Kdo žil dřív? je záloha (síla 1). */
export function kandidatiAktivit(o: OsobaAktivity, k: KontextAktivit, pouziteCitaty?: ReadonlySet<string>): Aktivita[] {
  const out: Aktivita[] = [];
  for (const c of [kandidatKde(o, k), kandidatKdoRekl(o, k, pouziteCitaty), kandidatTipni(o, k)]) if (c) out.push(c);
  const b = k.kdoZil(o.id);
  if (b) out.push({ druh: 'kdo-zil', sila: 1, b });
  return out;
}

// ─── Výběr se sousedy ─────────────────────────────────────────────────────────

/** Pořadí hloubek v seznamu Lidé (src/pages/lide/index.astro): portréty, profily, další lidé. */
export const HLOUBKY_LIDI = ['portret', 'profil', 'medailonek'] as const;
/** Začátek života pro řazení v seznamu Lidé (narození, jinak začátek činnosti; bez roků na konec). */
export const zacatekVSeznamu = (o: Pick<TOsoba, 'narozen' | 'zemrel' | 'aktivni'>) =>
  interval(o)?.[0] ?? o.narozen?.rok ?? o.aktivni?.od ?? 9999;

/** Lidé v pořadí seznamu Lidé: období, hloubka, narození. */
export function poradiLidi<T extends Pick<TOsoba, 'obdobi' | 'narozen' | 'zemrel' | 'aktivni'> & { hloubka?: string }>(lide: readonly T[]): T[] {
  const h = (o: T) => HLOUBKY_LIDI.indexOf((o.hloubka ?? 'medailonek') as (typeof HLOUBKY_LIDI)[number]);
  return [...lide].sort((a, b) => a.obdobi - b.obdobi || h(a) - h(b) || zacatekVSeznamu(a) - zacatekVSeznamu(b));
}

export interface StrankaVyberu {
  id: string;
  /** ručně napsaná aktivita (profil): výběr ji nemění, jen se jí sousedé vyhnou */
  pevna?: DruhAktivity;
  kandidati: Aktivita[];
}

/**
 * Výběr pro všechny stránky najednou (v pořadí seznamu Lidé): každá stránka dostane jednu ze svých aktivit a dvě
 * sousední nikdy stejný druh. Silnější kandidát má přednost; při shodě rozhoduje semínko z id osoby. Počítá se
 * celá řada naráz (nejlevnější cesta přes všechny stránky), takže výběr jedné stránky nerozbije sousední.
 * Stránka bez možnosti (nebo pevná) dostane null, resp. nic se jí nevybírá.
 */
export function vyberAktivity(stranky: readonly StrankaVyberu[]): Map<string, Aktivita | null> {
  type Volba = { druh: DruhAktivity; a: Aktivita | null; cena: number };
  const volby: Volba[][] = stranky.map((s) => {
    if (s.pevna) return [{ druh: s.pevna, a: null, cena: 0 }];
    return s.kandidati.map((a) => ({ druh: a.druh, a, cena: 4 - a.sila + (semeno(`${s.id}:${a.druh}`) % 1000) / 10_000 }));
  });
  // Nejlevnější řada bez dvou stejných sousedů; stránka bez voleb řadu přeruší (sousedé se pak neovlivňují).
  const ceny: number[][] = [];
  const odkud: number[][] = [];
  volby.forEach((v, i) => {
    ceny[i] = [];
    odkud[i] = [];
    v.forEach((x, j) => {
      if (i === 0 || !volby[i - 1].length) {
        ceny[i][j] = x.cena;
        odkud[i][j] = -1;
        return;
      }
      // Dvě ručně napsané aktivity vedle sebe (profily) výběr nezmění: ty se nepočítají. Stejný druh vedle sebe
      // jinak stojí tolik, že ho řada vezme, jen když jiná cesta není (cena navíc, ne nekonečno: řada se nerozpadne).
      let nej = Infinity;
      let kde = -1;
      volby[i - 1].forEach((p, q) => {
        const pevne = p.a === null && x.a === null;
        const c = ceny[i - 1][q] + (p.druh === x.druh && !pevne ? 1000 : 0);
        if (c < nej) [nej, kde] = [c, q];
      });
      ceny[i][j] = nej + x.cena;
      odkud[i][j] = kde;
    });
  });
  const vysledek = new Map<string, Aktivita | null>();
  let j = -1;
  for (let i = stranky.length - 1; i >= 0; i--) {
    if (!volby[i].length) {
      vysledek.set(stranky[i].id, null);
      j = -1;
      continue;
    }
    if (j < 0) {
      const c = ceny[i];
      j = c.indexOf(Math.min(...c));
      if (!Number.isFinite(c[j])) j = 0;
    }
    vysledek.set(stranky[i].id, volby[i][j].a);
    j = odkud[i][j];
  }
  return vysledek;
}

// ─── Obsah hry z dat ──────────────────────────────────────────────────────────

const tvar = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);

/** Id bloku na stránce osoby (stav v deníku, kotva, katalog hodin). Kdo žil dřív? má id jako dřív. */
export function idAktivity(osoba: string, a: Aktivita): string {
  return a.druh === 'kdo-zil' ? `kdo-${osoba}-${a.b}-poradi` : `hra-${osoba}-${a.druh}`;
}

/** Otázka hry, jak ji ukáže blok i katalog hodin. */
export function otazkaAktivity(o: OsobaAktivity, a: Exclude<Aktivita, { druh: 'kdo-zil' }>, k: Pick<KontextAktivit, 'lide'>): string {
  const jmeno = (id: string) => k.lide.find((x) => x.id === id)!.jmeno;
  switch (a.druh) {
    case 'kde':
      switch (a.role) {
        case 'exil': return `Kde ${o.jmeno} ${tvar(o, 'žil', 'žila')} ve vyhnanství?`;
        case 'studium': return `Kam ${o.jmeno} ${tvar(o, 'odešel', 'odešla')} studovat?`;
        case 'tazeni': return `Kde ${o.jmeno} ${tvar(o, 'byl', 'byla')} na vojenském tažení?`;
        case 'pobyt': return `Kam se ${o.jmeno} ${tvar(o, 'vydal', 'vydala')}?`;
        default: return `Kde ${o.jmeno} později ${tvar(o, 'učil', 'učila')}?`;
      }
    case 'kdo-rekl': return 'Čí je ta věta?';
    case 'tipni': return `${jmeno(a.a)} a ${jmeno(a.b)}: kolik lidských životů je mezi nimi?`;
  }
}

export type ObsahAktivity =
  | { druh: 'kde'; id: string; blok: TBlokKde }
  | { druh: 'kdo-rekl'; id: string; blok: TBlokKdoRekl }
  | { druh: 'tipni'; id: string; blok: TBlokTipni }
  | { druh: 'kdo-zil'; id: string; a: string; b: string };

/**
 * Obsah hry pro obal bloku (místo YAML): stejná schémata jako bloky v src/content/bloky, takže hra z dat projde
 * stejnou kontrolou. Texty skládá z dat: rodiště a pobyt (Kde to bylo?), vztah k mluvčímu (Kdo to řekl?),
 * kdo koho četl, nebo jak dlouho žil (Tipni si).
 */
export function obsahAktivity(o: OsobaAktivity, a: Aktivita, k: KontextAktivit): ObsahAktivity {
  const id = idAktivity(o.id, a);
  const podleId = new Map(k.lide.map((x) => [x.id, x]));
  const zaklad = { obdobi: o.obdobi, zdroje: [], kOvereni: [] };
  switch (a.druh) {
    case 'kdo-zil':
      return { druh: 'kdo-zil', id, a: o.id, b: a.b };
    case 'kde': {
      const rodiste = o.mista.find((m) => m.role === 'narozeni');
      const kdeRodiste = rodiste && rodiste.misto !== a.misto ? k.mista.get(rodiste.misto)?.kde : undefined;
      return {
        druh: 'kde', id,
        blok: BlokKde.parse({
          druh: 'kde', ...zaklad,
          scena: kdeRodiste ? `${o.jmeno} se ${tvar(o, 'narodil', 'narodila')} ${kdeRodiste}.` : undefined,
          otazka: otazkaAktivity(o, a, k),
          osoba: o.id, misto: a.misto, role: a.role, kde: k.mista.get(a.misto)!.kde!,
        }),
      };
    }
    case 'kdo-rekl': {
      const mluvci = podleId.get(a.mluvci)!;
      const [prvni, druhy] = zacatekVSeznamu(mluvci) <= zacatekVSeznamu(o) ? [mluvci, o] : [o, mluvci];
      const v = vazbaDvou(prvni, druhy, k.vztahy);
      return {
        druh: 'kdo-rekl', id,
        blok: BlokKdoRekl.parse({
          druh: 'kdo-rekl', ...zaklad,
          scena: `Tu větu řekl nebo napsal někdo z lidí kolem ${o.jmeno2 ?? o.jmeno}.`,
          otazka: otazkaAktivity(o, a, k),
          karty: [{
            citat: a.citat,
            jini: a.jini,
            napoveda: 'Porovnej větu s tím, čím se který z nich zabýval.',
            // Na rubu nahoře: kdo na koho navázal (vztah z dat), ne výklad věty.
            pointa: v!.veta,
          }],
        }),
      };
    }
    case 'tipni': {
      const A = podleId.get(a.a)!;
      const B = podleId.get(a.b)!;
      const scena = a.duvod === 'cetl'
        ? vazbaDvou(A, B, k.vztahy)?.veta
        : `${A.jmeno} se ${tvar(A, 'dožil', 'dožila')} ${A.narozen?.priblizne || A.zemrel?.priblizne ? 'asi\u00a0' : ''}${let_(delkaZivota(A)!)}.`;
      return { druh: 'tipni', id, blok: BlokTipni.parse({ druh: 'tipni', ...zaklad, scena, otazka: otazkaAktivity(o, a, k), a: a.a, b: a.b }) };
    }
  }
}

/** Výběr pro všechny stránky osob: medailonky z dat, profily s pevnou aktivitou (Kdo žil dřív? v MDX) nebo s hrou z dat (<HraOsoby> v MDX). */
export function aktivityStranekOsob(k: KontextAktivit, profily: ReadonlySet<string>): Map<string, Aktivita | null> {
  // Citát kandidáta Kdo to řekl? se na další stránce v řadě nenabídne znovu (Archytás a Eudoxos mají oba Platóna).
  // Profil s hrou z dat (herna-v1, T) bere citáty až po medailoncích: medailonky tak mají tytéž karty jako před T.
  const pouzite = new Set<string>();
  const rada = poradiLidi(k.lide.filter((o) => k.maStranku(o.id)));
  const profilSHrou = (id: string) => !profily.has(id) && !!k.znama?.(id);
  const kandidati = new Map<string, Aktivita[]>();
  for (const pruchod of [false, true]) {
    for (const o of rada) {
      if (profily.has(o.id) || profilSHrou(o.id) !== pruchod) continue;
      const vylouceno = k.bez?.(o.id);
      const kand = kandidatiAktivit(o, k, pouzite).filter((a) => !vylouceno?.has(a.druh));
      for (const a of kand) if (a.druh === 'kdo-rekl') pouzite.add(a.citat);
      kandidati.set(o.id, kand);
    }
  }
  const stranky = rada.map((o) => ({ id: o.id, pevna: profily.has(o.id) ? ('kdo-zil' as const) : undefined, kandidati: kandidati.get(o.id) ?? [] }));
  return vyberAktivity(stranky);
}
