// Medailonek: stránka osoby generovaná jen z dat (src/components/osobnost/StrankaMedailonku.astro).
// Tady jsou čisté funkce, které stránka potřebuje: kritéria hotového medailonku, rok a místo pro odkaz do Mapy a času
// a položky Kam dál. Nic se nepíše ručně: co v datech chybí, na stránce není (a test medailonek nepustí).
import type { TOsoba, TVztah } from './schema';
import { rok as rokText } from './casy';
import { sporNaDalku, type Smer } from './vztahy';

// ─── Věty „kdo“ a „proč“ ──────────────────────────────────────────────────────

/** Zkratky s tečkou, které větu nekončí („399 př. n. l.“, „sv. Pavel“). */
const ZKRATKY = /(?:př\.\s*n\.\s*l\.|n\.\s*l\.|sv\.|tzv\.|např\.|tj\.|resp\.|asi\s+\d+\.)/g;

/** Počet vět: tečka, otazník nebo vykřičník na konci nebo před mezerou (zkratky letopočtů se nepočítají). */
export function pocetVet(text: string): number {
  return (text.replace(ZKRATKY, 'ZKR').trim().match(/[.!?…](?=\s|$)/g) ?? []).length;
}
export const pocetSlov = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
/** Tykání a oslovení studenta patří do textů stránek, ne do dat (z dat se věta skládá do Mapy, karet i popisu stránky). */
export const TYKANI = /(?<![\p{L}])(ty|tě|tebe|tobě|tvůj|tvoje|tvá|tvé|tvého|tvým|představ si|zkus|víš|znáš)(?![\p{L}])/iu;
export const MAX_SLOV = 25;

/** Co brání tomu, aby osoba dostala medailonek. Prázdný seznam = data jsou úplná. */
export function chybiMedailonku(o: TOsoba, vztahy: Pick<TVztah, 'od' | 'k'>[]): string[] {
  const ch: string[] = [];
  if (!(o.narozen && o.zemrel) && !o.aktivni) ch.push('roky: chybí narození i úmrtí, nebo doba činnosti (aktivni)');
  if (!o.mista.length) ch.push('místa: žádné');
  else if (!o.mista.some((m) => m.role === 'narozeni' || m.role === 'pusobeni')) ch.push('místa: chybí rodiště i místo působení');
  for (const [pole, text] of [['kdo', o.kdo], ['proc', o.proc]] as const) {
    if (pocetVet(text) !== 1) ch.push(`${pole}: má být jedna věta (je ${pocetVet(text)})`);
    if (pocetSlov(text) > MAX_SLOV) ch.push(`${pole}: ${pocetSlov(text)} slov (nejvýš ${MAX_SLOV})`);
    if (TYKANI.test(text)) ch.push(`${pole}: oslovuje studenta`);
    if (!/[.!?]$/.test(text.trim())) ch.push(`${pole}: nekončí tečkou`);
  }
  if (!vztahy.some((v) => v.od === o.id || v.k === o.id)) ch.push('vztahy: žádný (medailonek stojí na Době a lidech)');
  return ch;
}

// ─── Mapa a čas ───────────────────────────────────────────────────────────────

/** Posun o n let přes přelom letopočtu bez roku nula. */
export function posun(r: number, n: number): number {
  const x = r + n;
  if (r < 0 && x >= 0) return x + 1;
  if (r > 0 && x <= 0) return x - 1;
  return x;
}

const SLOVESO: Partial<Record<TOsoba['mista'][number]['role'], [string, string]>> = {
  pusobeni: ['působil', 'působila'],
  studium: ['studoval', 'studovala'],
  pobyt: ['pobýval', 'pobývala'],
  exil: ['žil ve vyhnanství', 'žila ve vyhnanství'],
};

/**
 * Rok a místo pro odkaz do Mapy a času: první pobyt s rokem (působení, studium, pobyt, vyhnanství), jinak rok,
 * kdy bylo člověku asi čtyřicet (nejvýš rok úmrtí), jinak začátek činnosti.
 */
export function rokNaMape(o: TOsoba): { rok: number; priblizne: boolean; misto?: string; sloveso?: string } | undefined {
  const pobyty = o.mista.filter((m) => SLOVESO[m.role] && (m.rok ?? m.od) !== undefined);
  const p = pobyty.find((m) => m.role === 'pusobeni') ?? pobyty[0];
  if (p) return { rok: (p.rok ?? p.od)!, priblizne: !!p.priblizne, misto: p.misto, sloveso: SLOVESO[p.role]![o.zena ? 1 : 0] };
  if (o.narozen) {
    const r = posun(o.narozen.rok, 40);
    const z = o.zemrel?.rok;
    return { rok: z !== undefined && r > z ? z : r, priblizne: true };
  }
  if (o.aktivni) return { rok: o.aktivni.od, priblizne: !!o.aktivni.priblizne };
  if (o.zemrel) return { rok: o.zemrel.rok, priblizne: !!o.zemrel.priblizne };
  return undefined;
}

// ─── Kam dál ──────────────────────────────────────────────────────────────────

export interface PolozkaKamDal { href?: string; nadtitulek: string; text: string }
/** Stránka člověka, na kterého medailonek odkazuje: druh (Portrét, Profil, Medailonek) a text karty. */
export interface CilStranky { href: string; druh: string; text: string }

const PORADI_VZTAHU: TVztah['typ'][] = ['ucitel', 'znali-se', 'polemika', 'vliv-textem'];

/**
 * Nadtitulek karty Kam dál. Karta stojí bez nadpisu skupiny a jméno pod nadtitulkem čte student jako podmět,
 * takže nadtitulek říká, kdo je ve vztahu činný (na stránce Cicerona „Koho četl · Platón“, ne „Znal ho z textů“).
 * `ja` je osoba stránky, `druhy` osoba karty; rod jako v kartě člověka v Mapě a čase.
 */
export function roleNaKarte(v: Pick<TVztah, 'typ'>, smer: Smer, naDalku: boolean, ja: { zena?: boolean }, druhy: { zena?: boolean }): string {
  const t = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);
  switch (v.typ) {
    case 'ucitel': return smer === 'od' ? t(druhy, 'Žák', 'Žákyně') : t(druhy, 'Učitel', 'Učitelka');
    case 'znali-se': return 'Znali se';
    case 'vliv-textem':
      return smer === 'od'
        ? `${t(druhy, 'Četl', 'Četla')} ${t(ja, 'ho', 'ji')} a ${t(druhy, 'navázal', 'navázala')}`
        : `Koho ${t(ja, 'četl', 'četla')}`;
    case 'polemika':
      if (naDalku) return smer === 'od' ? `S kým se ${t(ja, 'přel', 'přela')} na dálku` : `${t(druhy, 'Přel', 'Přela')} se s ${t(ja, 'jeho', 'jejím')} učením`;
      return smer === 'od' ? `S kým se ${t(ja, 'přel', 'přela')}` : `${t(druhy, 'Polemizoval', 'Polemizovala')} s ${t(ja, 'ním', 'ní')}`;
  }
}

/**
 * Kam dál z medailonku, nejvýš tři položky: až dva lidé se stránkou (učitelé a žáci první, pak známí, spory, četba;
 * profily a portréty před medailonky), Mapa a čas a do tří Lidé a směry. Každá adresa jen jednou.
 * Osoba z tradice, která má stránku náboženství (Filón a judaismus), dostane kartu tradice místo druhého člověka.
 */
export function kamDalMedailonku(args: {
  osoba: TOsoba;
  vztahy: TVztah[];
  osobaPodleId: (id: string) => TOsoba;
  cil: (id: string) => CilStranky | undefined;
  nazevMista: (id: string) => string | undefined;
  obdobi: { id: number; nazev: string };
  /** stránka náboženské tradice osoby, když ji atlas má */
  tradice?: { href: string; nazev: string };
}): PolozkaKamDal[] {
  const { osoba: ja, vztahy, osobaPodleId, cil, nazevMista, obdobi, tradice } = args;
  const lide = vztahy
    .filter((v) => v.od === ja.id || v.k === ja.id)
    .map((v) => {
      const smer = v.od === ja.id ? ('od' as const) : ('k' as const);
      const druhy = osobaPodleId(smer === 'od' ? v.k : v.od);
      return { v, smer, druhy, stranka: cil(druhy.id) };
    })
    .filter((x) => x.stranka && x.stranka.href !== `/osobnost/${ja.id}/`)
    .sort((a, b) =>
      PORADI_VZTAHU.indexOf(a.v.typ) - PORADI_VZTAHU.indexOf(b.v.typ) ||
      Number(a.stranka!.druh === 'Medailonek') - Number(b.stranka!.druh === 'Medailonek'));
  const polozky: PolozkaKamDal[] = [];
  const videno = new Set<string>();
  for (const x of lide) {
    if (polozky.length >= (tradice ? 1 : 2) || videno.has(x.stranka!.href)) continue;
    videno.add(x.stranka!.href);
    const role = roleNaKarte(x.v, x.smer, sporNaDalku(x.v, ja, x.druhy), ja, x.druhy);
    polozky.push({ href: x.stranka!.href, nadtitulek: `${x.stranka!.druh} · ${role}`, text: x.stranka!.text });
  }
  if (tradice) polozky.push({ href: tradice.href, nadtitulek: 'Náboženství', text: tradice.nazev });
  const m = rokNaMape(ja);
  if (m) {
    const kolem = m.priblizne ? 'kolem roku' : 'roku';
    const misto = m.misto && nazevMista(m.misto);
    polozky.push({
      href: `/mapa/?rok=${m.rok}&osoba=${ja.id}`,
      nadtitulek: 'Mapa a čas',
      text: misto
        ? `${misto} ${kolem} ${rokText(m.rok)}, kdy tam ${ja.jmeno} ${m.sloveso}`
        : `Svět ${kolem} ${rokText(m.rok)}, kdy ${ja.zena ? 'žila' : 'žil'} ${ja.jmeno}`,
    });
  }
  // Lidé a směry jen doplní řadu do tří (Kam dál má na notebooku tři sloupce); jinak na ně vede drobečková navigace.
  if (polozky.length < 3) polozky.push({ href: `/lide/#obdobi-${obdobi.id}`, nadtitulek: 'Lidé a směry', text: obdobi.nazev });
  return polozky;
}
