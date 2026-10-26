// „Pokračuj, kde jsi skončil“ a hlavní tlačítko na Domů: co nabídnout podle deníku. Čisté funkce nad deníkem.
import type { Denik } from './denik';

export interface Pokracovani {
  nadtitulek: string;
  nazev: string;
  popis?: string;
  odkaz: string;
  kdy: string;
}

const NBSP = ' ';
const bezKotvy = (odkaz: string) => odkaz.split('#')[0];
/** Stránka bez kotvy; kroky jedné cesty mají společný klíč. */
const klicOdkazu = (odkaz: string) => bezKotvy(odkaz).replace(/\/\d+\/$/, '/');

/**
 * Nejvýš `pocet` nabídek podle toho, co student dělal naposledy: rozpracovaná cesta,
 * rozpracovaný blok, nebo naposledy navštívená stránka. Hotové cesty a bloky se nenabízejí.
 * `vynech` je odkaz, který už nabízí hlavní tlačítko na Domů: táž cesta ani blok v ní se neopakují.
 */
export function coPokracovat(d: Pick<Denik, 'cesty' | 'aktivita' | 'navstivene'>, pocet = 2, vynech?: string): Pokracovani[] {
  const kandidati: Pokracovani[] = [];
  for (const [slug, c] of Object.entries(d.cesty)) {
    if (c.navstivene.length >= c.pocet && c.krok >= c.pocet) continue;
    kandidati.push({
      nadtitulek: 'Pokračuj v cestě',
      nazev: c.nazev,
      popis: `Krok ${c.krok}${NBSP}z${NBSP}${c.pocet}`,
      odkaz: `/cesta/${slug}/${c.krok}/`,
      kdy: c.kdy,
    });
  }
  const blok = d.aktivita.find((a) => !a.hotovo);
  if (blok) kandidati.push({ nadtitulek: 'Rozpracovaná otázka', nazev: blok.otazka, odkaz: blok.odkaz, kdy: blok.kdy });
  const stranka = d.navstivene[0];
  if (stranka) kandidati.push({ nadtitulek: 'Naposledy jsi četl', nazev: stranka.nazev, odkaz: stranka.odkaz, kdy: stranka.kdy });
  kandidati.sort((a, b) => b.kdy.localeCompare(a.kdy));
  const videne = new Set<string>(vynech ? [klicOdkazu(vynech)] : []);
  return kandidati
    .filter((k) => {
      // Rozpracovaný blok v cestě nebo na stránce, kterou už nabízíme, se neopakuje.
      const klic = klicOdkazu(k.odkaz);
      if (videne.has(klic)) return false;
      videne.add(klic);
      return true;
    })
    .slice(0, pocet);
}

/** Cesta z dat, jak ji potřebuje hlavní tlačítko na Domů. */
export interface CestaDomu {
  cislo: number;
  nazev: string;
  /** počet kroků */
  pocet: number;
  minut?: number;
}
export interface Zacatek {
  /** zacit = nový student; pokracovat = rozpracovaná cesta; dalsi = první cesta je hotová */
  stav: 'zacit' | 'pokracovat' | 'dalsi';
  text: string;
  href: string;
  /** řádek pod tlačítkem („První cesta · asi 20 minut · 7 kroků“); čísla cest student nevidí */
  udaj: string;
}

/**
 * Hlavní tlačítko na Domů: jedna výzva podle toho, kde student je.
 * Nový student začíná první cestu krokem 1. Kdo má cestu rozpracovanou (kteroukoli, bere se naposledy otevřená),
 * pokračuje v ní. Kdo má první cestu hotovou a nic rozpracovaného, vybírá si další v přehledu otázek:
 * cesty na sebe nenavazují, pořadí si volí student.
 *
 * Funkce je záměrně soběstačná (nesahá na nic z tohoto modulu): Domů vkládá její text do skriptu,
 * který běží před vykreslením, aby tlačítko při načtení neprobliklo. Hlídá to test.
 */
export function zacatekDomu(
  d: { cesty?: Record<string, { krok?: number; navstivene?: number[]; kdy?: string }> } | null | undefined,
  cesty: Record<string, CestaDomu>,
  prvni: string,
): Zacatek {
  const N = ' ';
  const tvar = (n: number, jeden: string, dva: string, pet: string) => (n === 1 ? jeden : n > 1 && n < 5 ? dva : pet);
  const postup = d && d.cesty && typeof d.cesty === 'object' && !Array.isArray(d.cesty) ? d.cesty : {};
  const krokCesty = (slug: string) => {
    const p = postup[slug];
    return p && typeof p.krok === 'number' && p.krok >= 1 ? Math.floor(p.krok) : 0;
  };
  const hotova = (slug: string) => {
    const p = postup[slug];
    const c = cesty[slug];
    return !!p && !!c && Array.isArray(p.navstivene) && p.navstivene.length >= c.pocet && krokCesty(slug) >= c.pocet;
  };
  let nej = '';
  for (const slug in postup) {
    if (!cesty[slug] || !krokCesty(slug) || hotova(slug)) continue;
    if (!nej || String(postup[slug].kdy) > String(postup[nej].kdy)) nej = slug;
  }
  if (nej) {
    const c = cesty[nej];
    const krok = Math.min(krokCesty(nej), c.pocet);
    return {
      stav: 'pokracovat',
      text: 'Pokračovat v cestě',
      href: '/cesta/' + nej + '/' + krok + '/',
      udaj: c.nazev + ' · krok' + N + krok + N + 'z' + N + c.pocet,
    };
  }
  const c1 = cesty[prvni];
  if (hotova(prvni)) {
    let zbyva = 0;
    for (const slug in cesty) if (!hotova(slug)) zbyva++;
    return {
      stav: 'dalsi',
      text: zbyva ? 'Vybrat další cestu' : 'Vybrat otázku',
      href: '/otazky/',
      udaj: zbyva
        ? 'První cesta je hotová · ' + tvar(zbyva, 'zbývá', 'zbývají', 'zbývá') + N + zbyva + N + tvar(zbyva, 'cesta', 'cesty', 'cest')
        : 'Všechny cesty máš za sebou.',
    };
  }
  return {
    stav: 'zacit',
    text: 'Začít první cestu',
    href: '/cesta/' + prvni + '/1/',
    udaj:
      'První' + N + 'cesta' +
      (c1.minut ? ' · asi' + N + c1.minut + N + tvar(c1.minut, 'minuta', 'minuty', 'minut') : '') +
      ' · ' + c1.pocet + N + tvar(c1.pocet, 'krok', 'kroky', 'kroků'),
  };
}
