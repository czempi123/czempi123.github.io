// Skladatel hodiny (/hodina/nova/, větev hodiny-v1, krok H2): strom katalogu po stránkách, hledání a filtry,
// popisky zastavení a přeřazení. Čisté funkce bez DOM; ostrov src/components/hodina/Skladatel.svelte,
// testy tests/data/skladatel.test.ts.
import type { DruhZastaveni, Zastaveni } from './hodiny';
import { NAZVY_KRESEB } from './kresby';

export interface Uzel {
  z: Zastaveni;
  deti: Uzel[];
}

/** Skupina výběru: stránka (cesta, profil, otázka) se vším, co na ní stojí, v pořadí na stránce. */
export interface Skupina {
  koren: Zastaveni;
  deti: Uzel[];
}

/**
 * Katalog jako strom: kořeny jsou stránky bez rodiče (přehled cesty, profil, stránka otázky) v pořadí katalogu,
 * pod nimi děti podle pole `rodic` seřazené podle `poradi` (krok cesty pod přehledem a v něm bloky a příběhy,
 * kapitola profilu a v ní bloky). Zastavení, jehož rodič v katalogu není, se pověsí ke kořeni své stránky.
 */
export function stromKatalogu(katalog: Zastaveni[]): Skupina[] {
  const podleId = new Map(katalog.map((z) => [z.id, z]));
  const deti = new Map<string, Zastaveni[]>();
  const koreny: Zastaveni[] = [];
  for (const z of katalog) {
    const r = z.rodic && podleId.has(z.rodic) ? z.rodic : null;
    if (!r) {
      if (z.rodic === null) koreny.push(z);
      else {
        const koren = katalog.find((k) => k.rodic === null && k.stranka === z.stranka);
        if (koren) deti.set(koren.id, [...(deti.get(koren.id) ?? []), z]);
      }
      continue;
    }
    deti.set(r, [...(deti.get(r) ?? []), z]);
  }
  const uzly = (id: string): Uzel[] =>
    (deti.get(id) ?? [])
      .map((z, i) => ({ z, i }))
      // Kroky cesty mají na svých stránkách pořadí 0; řadí je číslo kroku, ostatní pořadí na stránce.
      .sort((a, b) => (a.z.krok ?? 0) - (b.z.krok ?? 0) || a.z.poradi - b.z.poradi || a.i - b.i)
      .map(({ z }) => ({ z, deti: uzly(z.id) }));
  return koreny.map((k) => ({ koren: k, deti: uzly(k.id) }));
}

/** Text pro hledání: malá písmena bez diakritiky a bez nadbytečných mezer. */
export const proHledani = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Druhy ve filtru výběru; „stranky“ jsou celé stránky (přehled cesty, profil, stránka otázky, týden). */
export const DRUHY_VYBERU = [
  { id: 'stranky', nazev: 'Celé stránky', druhy: ['cesta', 'profil', 'otazka', 'tyden'] },
  { id: 'krok', nazev: 'Kroky cest', druhy: ['krok'] },
  { id: 'blok', nazev: 'Bloky a kresby', druhy: ['blok'] },
  { id: 'pribeh', nazev: 'Příběhy', druhy: ['pribeh'] },
  { id: 'kapitola', nazev: 'Kapitoly profilů', druhy: ['kapitola'] },
  { id: 'oddil', nazev: 'Oddíly profilů', druhy: ['oddil'] },
  { id: 'hlas', nazev: 'Hlasy u otázek', druhy: ['hlas'] },
] as const satisfies readonly { id: string; nazev: string; druhy: readonly DruhZastaveni[] }[];

export type DruhVyberu = (typeof DRUHY_VYBERU)[number]['id'];

export interface Filtr {
  hledat: string;
  /** číslo období, nebo null pro všechna */
  obdobi: number | null;
  druh: DruhVyberu | null;
}

export interface VysledekFiltru {
  /** zastavení, která filtru odpovídají */
  shoda: Set<string>;
  /** co se ve výběru ukáže: shody a jejich předci (kvůli souvislosti) */
  viditelne: Set<string>;
}

/** Filtr bez hledání, období i druhu: ukazuje se všechno a skupiny zůstanou sbalené. */
export const prazdnyFiltr = (f: Filtr): boolean => !proHledani(f.hledat) && f.obdobi === null && f.druh === null;

/**
 * Shody filtru: zastavení je z vybraného období a vybraného druhu a každé hledané slovo (bez ohledu na
 * diakritiku a velikost písmen) stojí v jeho štítku druhu, v jeho názvu nebo v názvu stránky, kroku či kapitoly,
 * do které patří. „Epiktétos“ tak najde profil i s kapitolami, „Sókratés soud“ kapitolu Soud, „spor smrt“
 * Spor v cestě o smrti a „hlas seneca“ Senekovy hlasy u otázek. Stránka otázky období nemá:
 * s filtrem období se ukáže jen přes své hlasy. Předci shod jsou vidět jako souvislost.
 */
export function filtrujKatalog(katalog: Zastaveni[], f: Filtr): VysledekFiltru {
  const slova = proHledani(f.hledat).split(' ').filter(Boolean);
  const druhy = f.druh ? (DRUHY_VYBERU.find((d) => d.id === f.druh)?.druhy as readonly DruhZastaveni[] | undefined) : undefined;
  const podleId = new Map(katalog.map((z) => [z.id, z]));
  const predci = (z: Zastaveni) => {
    const vse: Zastaveni[] = [];
    for (let r: Zastaveni | undefined = z; r; r = r.rodic ? podleId.get(r.rodic) : undefined) vse.push(r);
    return vse;
  };
  const shoda = new Set<string>();
  const viditelne = new Set<string>();
  for (const z of katalog) {
    if (f.obdobi !== null && z.obdobi !== f.obdobi) continue;
    if (druhy && !druhy.includes(z.druh)) continue;
    const cesta = predci(z);
    if (slova.length) {
      const text = proHledani([stitekDruhu(z), ...cesta.map((r) => r.nazev)].join(' '));
      if (!slova.every((s) => text.includes(s))) continue;
    }
    shoda.add(z.id);
    for (const r of cesta) viditelne.add(r.id);
  }
  return { shoda, viditelne };
}

const TYPY_BLOKU: Record<string, string> = {
  Volba: 'Volba s důvodem',
  Odkryj: 'Odkryj',
  NejdrivSam: 'Odkryj',
  Roztrid: 'Roztřiď',
  ZmenJednuVec: 'Změň jednu věc',
  Spor: 'Spor',
  KdoZilDriv: 'Kdo žil dřív?',
  ZaverCesty: 'Závěr cesty',
};

/** Krátký štítek druhu zastavení: „Krok 3“, „Volba s důvodem“, „Kresba“, „Kapitola 02“, „Hlas“… */
export function stitekDruhu(z: Zastaveni): string {
  switch (z.druh) {
    case 'cesta': return 'Přehled cesty';
    case 'krok': return `Krok ${z.krok}`;
    case 'profil': return 'Celý profil';
    case 'kapitola': return z.cislo ? `Kapitola ${z.cislo}` : 'Kapitola';
    case 'oddil': return 'Oddíl profilu';
    case 'otazka': return 'Stránka otázky';
    case 'hlas': return 'Hlas';
    case 'pribeh': return 'Příběh';
    case 'tyden': return 'Celý týden';
    case 'blok': return z.typ && z.typ in NAZVY_KRESEB ? 'Kresba' : (TYPY_BLOKU[z.typ ?? ''] ?? 'Blok');
  }
}

/**
 * Štítek zastavení pro studenta na stránce hodiny: u bloku a kresby nadtitulek, jak stojí na stránce nad ním
 * („Tvůj tah“, „Zkus si to“); jinak štítek druhu. Učitel ve skladateli a v tisku vidí druh bloku, podle něj vybírá.
 */
export function stitekStudenta(z: Zastaveni): string {
  return z.druh === 'blok' && z.nadtitulek ? z.nadtitulek : stitekDruhu(z);
}

/** Kde zastavení stojí, jak se ukáže v hodině: „Kdy mám dobrý důvod věřit? · krok 3“, „Sókratés“, otázka u hlasu. */
export function kdeStoji(z: Zastaveni): string {
  if (z.druh === 'cesta' || z.druh === 'profil' || z.druh === 'otazka' || z.druh === 'tyden') return z.kde;
  if (z.krok !== undefined && z.druh !== 'krok') return `${z.kde} · krok ${z.krok}`;
  return z.kde;
}

/** Nadpis skupiny ve výběru: „Cesta 1“ se nečísluje (číslo katalog nenese), proto druh stránky a název. */
export function druhStranky(z: Zastaveni): string {
  return z.druh === 'cesta' ? 'Cesta' : z.druh === 'profil' ? 'Profil' : z.druh === 'tyden' ? 'Zkus to žít' : 'Velká otázka';
}

/** Přesune položku o jedno místo nahoru (−1) nebo dolů (+1); na kraji vrátí seznam beze změny. */
export function posun<T>(seznam: T[], i: number, smer: -1 | 1): T[] {
  const j = i + smer;
  if (i < 0 || i >= seznam.length || j < 0 || j >= seznam.length) return seznam;
  const novy = [...seznam];
  [novy[i], novy[j]] = [novy[j], novy[i]];
  return novy;
}

/** Počet zastavení česky: „1 zastavení“, „2 zastavení“… (slovo se neskloňuje), „žádné zastavení“. */
export const pocetZastaveni = (n: number): string => (n === 0 ? 'žádné zastavení' : `${n}\u00a0zastavení`);
