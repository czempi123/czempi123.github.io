// Co ti zůstalo? (denik-v2, K2; plán › 1 a Formáty): kvíz na konci období, složený jen z hotových dat.
// Tři druhy otázek: myšlenka v situaci (pojem), hlas k případu (stránka velké otázky), obraz a otázka (kresba v cestě).
// Kolo bere jen to, co student potkal (deník), osm otázek, nejvýš čtyři jednoho druhu, dvě stejného druhu nikdy
// po sobě, pořadí ze semínka (číslo kola). Výsledek je jen „Víš.“, nebo „Zopakuj si.“ (verdikt.ts); nic se nepočítá.
// Čisté funkce bez DOM a Astra; data skládá src/lib/herna/zustalo-data.ts, ostrov src/components/ostrovy/CoTiZustalo.svelte,
// testy tests/data/zustalo.test.ts.
import { zamichej } from './michani';
import { prostyText } from '../tvoje-obdobi';
import { cestaHotova } from '../cesty';

export type DruhZustalo = 'pojem' | 'hlas' | 'kresba';
export interface MoznostZustalo {
  id: string;
  text: string;
  /** u hlasu: kdo tu odpověď dává (jméno z dat); ukáže se až po odpovědi (denik-v2, O) */
  kdo?: string;
  zena?: boolean;
}

/** Pro čtečku u zvolené možnosti hlasu, která není správná: čí odpověď student zvolil. */
export const volbaHlasuProCtecku = (m: Pick<MoznostZustalo, 'kdo' | 'zena'>) =>
  ` (tvoje odpověď, takhle by ${m.zena ? 'odpověděla' : 'odpověděl'} ${m.kdo})`;

export interface OdkazZustalo { href: string; text: string }

/** Otázka kvízu (plán › Formáty); skládá se při sestavení, ostrov ji dostane hotovou. */
export interface OtazkaZustalo {
  /** „pojem:klid“, „hlas:<otázka>:<osoba>“, „kresba:<komponenta>“; zároveň ref kartičky druhu zustalo */
  id: string;
  druh: DruhZustalo;
  /** krátký název do seznamu Zopakuj si a do kartičky (pojem, filozof a případ, název kresby) */
  nazev: string;
  /** situace / případ / kresba a co v ní student dělal; odstavce dělí prázdný řádek */
  podnet: string;
  /** věta nad možnostmi */
  zadani: string;
  /** tři možnosti, pořadí ze semínka (id otázky) */
  moznosti: MoznostZustalo[];
  spravna: string;
  /** z dat: první věta vysvětlení pojmu, citát hlasu s údajem, cesta a krok kresby */
  vysvetleni: string;
  /** u kresby: náhled v klidovém stavu nad podnětem */
  obraz?: ObrazZustalo;
  /** výchozí odkaz zpět; ostrov vezme první místo z `potkal`, které student opravdu prošel */
  zpet: OdkazZustalo;
  /** kde to student potkal: adresy stránek („/osobnost/epikuros/“) a „cesta/<slug>/<krok>“ nebo „cesta/<slug>“ */
  potkal: string[];
}

export interface CestaZustalo {
  slug: string;
  nazev: string;
  adresa: string;
  pocet: number;
  /** stránka velké otázky, na kterou cesta odpovídá (ukázka v dílně ji počítá jako prošlou) */
  otazka?: string;
}

/** Klíče míst „prošlé“ cesty: cesta, všechny její kroky a stránka její velké otázky (ukázka v dílně). */
export function prosleCesty(cesty: readonly CestaZustalo[], slugy: readonly string[]): string[] {
  return cesty.filter((c) => slugy.includes(c.slug)).flatMap((c) => [
    `cesta/${c.slug}`,
    ...Array.from({ length: c.pocet }, (_, i) => `cesta/${c.slug}/${i + 1}`),
    ...(c.otazka ? [c.otazka] : []),
  ]);
}

/** Co ostrov dostane: otázky období, odkazy zpět na místa z `potkal` a cesty období (pozvánka). */
export interface KatalogZustalo {
  otazky: OtazkaZustalo[];
  mista: Record<string, OdkazZustalo>;
  cesty: CestaZustalo[];
}

export const NAZVY_DRUHU: Record<DruhZustalo, string> = {
  pojem: 'Pojem v životě',
  hlas: 'Hlas k případu',
  kresba: 'Obraz a otázka',
};

/** Texty kvízu pro studenta na jednom místě (denik-v2, T; skill atlas-psani). Úvod oddílu je v TVOJE_ANTIKA. */
export const TEXTY_ZUSTALO = {
  zadaniPojmu: 'Který pojem v tom poznáš?',
  zadaniKresby: 'Ke které velké otázce ta kresba patří?',
  /** pod čtyři otázky: místo kola věta a odkaz do první nedokončené cesty */
  malo: 'Otázky se tu ptají jen na to, co už z antiky znáš. Zatím by jich bylo málo.',
  pozvanka: 'Projdi cestu',
  dalsi: 'Další otázka',
  konec: 'Konec kola',
  zopakuj: 'Tohle si zopakuj',
  vse: 'Z tohohle kola ti zůstalo všechno.',
  doKarticek: 'Dát do kartiček',
  vKartickach: 'V kartičkách',
  hlaseniKarticky: 'Otázky jsou v kartičkách.',
  noveKolo: 'Nové kolo',
} as const;

/** Kolo má nejvýš osm otázek, nejvýš čtyři jednoho druhu; pod čtyři se kvíz neotevře. */
export const ZUSTALO_KOLO = 8;
export const ZUSTALO_DRUHU_NEJVYS = 4;
export const ZUSTALO_NEJMENE = 4;

// ─── Text ─────────────────────────────────────────────────────────────────────

/** Rozdělí text na věty (za tečkou, otazníkem, vykřičníkem nebo trojtečkou následuje mezera a velké písmeno nebo uvozovka). */
export function vetyTextu(t: string): string[] {
  return t.split(/(?<=[.!?…])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ„*])/u).map((x) => x.trim()).filter(Boolean);
}
const slov = (t: string) => (t.match(/\p{L}+/gu) ?? []).length;
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Jmenuje text slovo nebo některý z jeho tvarů? Celá slova, bez ohledu na velikost písmen. */
export function jmenuje(text: string, tvary: readonly string[]): boolean {
  const t = text.toLocaleLowerCase('cs');
  return tvary.some((f) => {
    const s = f.trim().toLocaleLowerCase('cs');
    return !!s && new RegExp(`(^|[^\\p{L}])${escRe(s)}(?=[^\\p{L}]|$)`, 'u').test(t);
  });
}

/** Úvodní případ stránky otázky: odstavce těla před první komponentou, nadpisem nebo importem. */
export function pripadZTextu(body: string): string {
  const odstavce: string[] = [];
  for (const o of body.split(/\n\s*\n/)) {
    const s = o.trim();
    if (!s) continue;
    if (/^(<|#|import\b|export\b)/.test(s)) {
      if (odstavce.length) break;
      continue;
    }
    odstavce.push(prostyText(s));
  }
  // Odstavec, který končí dvojtečkou, uvádí citát pod sebou; bez něj by visel ve vzduchu.
  while (odstavce.length && /:\s*$/.test(odstavce.at(-1)!)) odstavce.pop();
  return odstavce.join('\n\n');
}

/**
 * Co student v kresbě dělá: věta z odstavce těsně nad značkou kresby v kroku cesty. Odzadu první věta, která má
 * aspoň pět slov („Jestli vůbec přestala.“ za pokynem nestačí). Bez odstavce nad kresbou undefined.
 */
export function vetaPredKresbou(body: string, komponenta: string): string | undefined {
  const i = body.search(new RegExp(`<${komponenta}[\\s/>]`));
  if (i < 0) return undefined;
  const pred = body.slice(0, i).split(/\n\s*\n/).map((x) => x.trim()).filter((x) => x && !/^(<|#|import\b|export\b|---)/.test(x));
  const odstavec = pred.at(-1);
  if (!odstavec) return undefined;
  const vety = vetyTextu(prostyText(odstavec));
  return [...vety].reverse().find((v) => slov(v) >= 5) ?? vety.at(-1);
}

// ─── Vstupy pro skládání (čtou se z dat, ne z deníku) ─────────────────────────

export interface PojemVstup {
  id: string;
  pojem: string;
  vysvetleni: string;
  uKoho: { kdo: string }[];
  priklad: string;
  vyskyty: string[];
  obdobi: number[];
  tvary: string[];
}
export interface ParyVstup { id: string; pary: { pojem: string; situace: string }[] }
export interface HlasVstup {
  osoba: string;
  jmeno: string;
  /** tvary jména, podle kterých se pozná, že ho odpověď jmenuje */
  tvaryJmena: string[];
  zena?: boolean;
  smer?: string;
  odpoved: string;
  /** citát hlasu s údajem, nebo důvod z myšlenky, když hlas citát nemá */
  vysvetleni: string;
  /**
   * osoby téže stránky, jejichž odpověď by poctivě platila i za tenhle hlas (`BLIZKE_HLASY`): v otázce tohoto hlasu
   * ani v jejich otázce mezi možnostmi nejsou
   */
  blizke?: string[];
}
export interface OtazkaVstup { slug: string; cislo: number; otazka: string; adresa: string; pripad?: string; pripadText: string; hlasy: HlasVstup[] }
export interface KresbaVstup {
  komponenta: string;
  nazev: string;
  veta?: string;
  cesta: { slug: string; nazev: string; otazka: number };
  krok: { n: number; nazev: string };
  /** čísla velkých otázek, na které by obraz poctivě odpovídal taky: nejsou mezi možnostmi */
  blizke?: number[];
  /** proč obraz k otázce patří: úsek doslova z kroku nebo závěru cesty (`PROC_KRESEB`) */
  proc?: string;
  /** náhled kresby v klidovém stavu (`nahledKresby`) */
  obraz?: ObrazZustalo;
}
export interface ObrazZustalo { svetly: string; tmavy: string; alt: string }

const pojemKlic = (p: PojemVstup) => [p.pojem, ...p.tvary];
const velke = (s: string) => s.charAt(0).toLocaleUpperCase('cs') + s.slice(1);

/** Dvě možnosti navíc: z kandidátů v pořadí podle semínka, bez těch, které vyřadí `vynech`. */
function dvaDalsi<T>(kandidati: readonly T[], klic: string, vynech: (k: T) => boolean = () => false): T[] {
  return zamichej(kandidati, klic).filter((k) => !vynech(k)).slice(0, 2);
}

/**
 * Jsou dva pojmy tak blízko, že by situace jednoho poctivě patřila i druhému? Pozná se z dat: vysvětlení jednoho
 * jmenuje druhý (slast „je to klid“, v naší moci „naše soudy“). V Párech je student rozliší, protože páruje všechny
 * naráz; v jedné otázce o třech možnostech by správná odpověď byly dvě (denik-v2, T).
 */
export function blizkePojmy(a: PojemVstup, b: PojemVstup): boolean {
  return jmenuje(a.vysvetleni, pojemKlic(b)) || jmenuje(b.vysvetleni, pojemKlic(a));
}

/**
 * Pojem v životě. Situace z Párů (bloky mimo dílnu přednost, ty prošly revizí i s pastmi); jinak příklad pojmu,
 * jen když pojem nejmenuje. Další dvě možnosti jsou pojmy z téhož bloku Párů (prověřené proti sobě), jinak pojmy
 * téhož období; nikdy pojem, který situace jmenuje, ani pojem blízký správnému (`blizkePojmy`). Vysvětlení je celé
 * `vysvetleni` pojmu (dvě věty): první říká, co pojem je, druhá u koho a jak, a teprve obě vysvětlí situaci.
 */
export function otazkyPojmu(pojmy: readonly PojemVstup[], pary: readonly ParyVstup[], obdobi: readonly number[]): OtazkaZustalo[] {
  const vObdobi = pojmy.filter((p) => p.obdobi.some((o) => obdobi.includes(o)));
  const podleId = new Map(vObdobi.map((p) => [p.id, p]));
  const bloky = [...pary].sort((a, b) => Number(a.id.startsWith('dilna-')) - Number(b.id.startsWith('dilna-')) || a.id.localeCompare(b.id));
  const ven: OtazkaZustalo[] = [];
  for (const p of vObdobi) {
    const blok = bloky.find((b) => b.pary.some((x) => x.pojem === p.id));
    const situace = blok?.pary.find((x) => x.pojem === p.id)?.situace ?? (jmenuje(p.priklad, pojemKlic(p)) ? undefined : p.priklad);
    if (!situace) continue;
    const vynech = (k: PojemVstup) => jmenuje(situace, pojemKlic(k)) || blizkePojmy(p, k);
    const klic = `pojem:${p.id}`;
    let jine = blok ? dvaDalsi(blok.pary.map((x) => podleId.get(x.pojem)).filter((x): x is PojemVstup => !!x && x.id !== p.id), klic, vynech) : [];
    if (jine.length < 2) {
      const doplnit = dvaDalsi(vObdobi.filter((k) => k.id !== p.id && !jine.includes(k)), `${klic}:obdobi`, vynech);
      jine = [...jine, ...doplnit].slice(0, 2);
    }
    const potkal = [...p.vyskyty.map(klicVyskytu), `/pojem/${p.id}/`];
    ven.push({
      id: klic,
      druh: 'pojem',
      nazev: velke(p.pojem),
      podnet: situace.trim(),
      zadani: TEXTY_ZUSTALO.zadaniPojmu,
      moznosti: zamichej([p, ...jine].map((k) => ({ id: k.id, text: velke(k.pojem) })), klic),
      spravna: p.id,
      vysvetleni: p.vysvetleni.trim(),
      zpet: { href: `/pojem/${p.id}/`, text: `Zpátky k pojmu ${p.pojem}` },
      potkal,
    });
  }
  return ven;
}

/** Klíč výskytu pojmu jako klíč „potkal“: krok a cesta zůstanou, stránky jako adresa. */
export function klicVyskytu(v: string): string {
  if (v.startsWith('cesta/')) return v;
  const [druh, id] = v.split('/');
  if (druh === 'uvod') return id === 'co-je-nabozenstvi' ? '/nabozenstvi/' : `/${id}/`;
  return `/${druh}/${id}/`;
}

/**
 * Hlas k případu. Úvodní případ stránky otázky a jméno filozofa; možnosti jsou odpovědi tří hlasů téže otázky.
 * Další dvě odpovědi přednostně od lidí jiného směru (dva stoikové radí podobně) a nikdy odpověď, která jméno
 * některého z nich vysloví, ani odpověď blízkého hlasu (`blizke`, oběma směry: Platón a Aristotelés o tom, co v nás
 * myslí). Otázka potřebuje aspoň tři hlasy. Možnost nese jméno toho, kdo ji říká; ostrov ho ukáže až po odpovědi.
 */
export function otazkyHlasu(otazky: readonly OtazkaVstup[]): OtazkaZustalo[] {
  const ven: OtazkaZustalo[] = [];
  for (const o of otazky) {
    if (o.hlasy.length < 3 || !o.pripadText) continue;
    const jmena = o.hlasy.flatMap((h) => h.tvaryJmena);
    for (const h of o.hlasy) {
      if (jmenuje(h.odpoved, jmena)) continue;
      const klic = `hlas:${o.slug}:${h.osoba}`;
      const blizky = (x: HlasVstup) => !!h.blizke?.includes(x.osoba) || !!x.blizke?.includes(h.osoba);
      const kandidati = zamichej(o.hlasy.filter((x) => x.osoba !== h.osoba && !jmenuje(x.odpoved, jmena) && !blizky(x)), klic);
      const jiny = (x: HlasVstup, proti: (string | undefined)[]) => !x.smer || !proti.includes(x.smer);
      const prvni = kandidati.find((x) => jiny(x, [h.smer])) ?? kandidati[0];
      const zbytek = kandidati.filter((x) => x !== prvni);
      const druhy = zbytek.find((x) => jiny(x, [h.smer, prvni?.smer])) ?? zbytek.find((x) => jiny(x, [h.smer])) ?? zbytek[0];
      if (!prvni || !druhy) continue;
      ven.push({
        id: klic,
        druh: 'hlas',
        nazev: `${h.jmeno}: ${o.pripad ?? o.otazka}`,
        podnet: o.pripadText,
        zadani: `Co by ti na to ${h.zena ? 'řekla' : 'řekl'} ${h.jmeno}?`,
        moznosti: zamichej([h, prvni, druhy].map((x) => ({ id: x.osoba, text: x.odpoved.trim(), kdo: x.jmeno, ...(x.zena ? { zena: true } : {}) })), klic),
        spravna: h.osoba,
        vysvetleni: h.vysvetleni,
        zpet: { href: o.adresa, text: `Zpátky k otázce ${o.otazka}` },
        potkal: [o.adresa],
      });
    }
  }
  return ven;
}

/**
 * Obraz a otázka. Název kresby a úsek textu kroku, co v ní student dělal; volí, ke které velké otázce obraz patří.
 * Další dvě možnosti jsou velké otázky, ke kterým v období vede cesta (student je potkal), kromě těch, na které by
 * obraz poctivě odpovídal taky (`blizke`: jeskyně a Jak poznám, co je pravda?, Třetí čára a Jsem svobodný?).
 * Název kresby stojí v podnětu jako samostatný řádek: „Kresba „Kde je střed?“.“ by měla dvě interpunkce za sebou.
 */
export function otazkyKreseb(kresby: readonly KresbaVstup[], velke: readonly { cislo: number; otazka: string }[]): OtazkaZustalo[] {
  const podleCisla = new Map(velke.map((o) => [o.cislo, o]));
  const ven: OtazkaZustalo[] = [];
  for (const k of kresby) {
    const spravna = podleCisla.get(k.cesta.otazka);
    if (!spravna || !k.veta) continue;
    const klic = `kresba:${k.komponenta}`;
    const jine = dvaDalsi(velke.filter((o) => o.cislo !== spravna.cislo), klic, (o) => !!k.blizke?.includes(o.cislo));
    if (jine.length < 2) continue;
    const adresa = `/cesta/${k.cesta.slug}/${k.krok.n}/`;
    ven.push({
      id: klic,
      druh: 'kresba',
      nazev: k.nazev,
      podnet: `Kresba „${k.nazev}“\n\n${k.veta}`,
      zadani: TEXTY_ZUSTALO.zadaniKresby,
      moznosti: zamichej([spravna, ...jine].map((o) => ({ id: String(o.cislo), text: o.otazka })), klic),
      spravna: String(spravna.cislo),
      ...(k.obraz ? { obraz: k.obraz } : {}),
      vysvetleni: `${k.proc ? `${k.proc} ` : ''}Kresba patří k cestě *${k.cesta.nazev}*, která hledá odpověď na otázku *${spravna.otazka}*`,
      zpet: { href: adresa, text: `Zpátky do kroku ${k.krok.n} cesty ${k.cesta.nazev}` },
      potkal: [`cesta/${k.cesta.slug}/${k.krok.n}`],
    });
  }
  return ven;
}

/**
 * Kontrola při sestavení: situace nejmenuje svůj pojem, každá otázka má tři různé možnosti se správnou mezi nimi,
 * vysvětlení z dat a místo, kde ji student potkal; kresba neprozradí otázku v podnětu; id se neopakuje.
 */
export function chybyZustalo(otazky: readonly OtazkaZustalo[], pojmy: readonly PojemVstup[]): string[] {
  const chyby: string[] = [];
  const pojemPodleId = new Map(pojmy.map((p) => [p.id, p]));
  const videno = new Set<string>();
  for (const o of otazky) {
    const kde = `Co ti zůstalo?: ${o.id}`;
    if (videno.has(o.id)) chyby.push(`${kde} je tam dvakrát.`);
    videno.add(o.id);
    if (o.moznosti.length !== 3) chyby.push(`${kde} nemá tři možnosti (${o.moznosti.length}).`);
    if (new Set(o.moznosti.map((m) => m.id)).size !== o.moznosti.length) chyby.push(`${kde}: možnost se opakuje.`);
    if (new Set(o.moznosti.map((m) => m.text.trim().toLocaleLowerCase('cs'))).size !== o.moznosti.length) chyby.push(`${kde}: dvě možnosti mají stejný text.`);
    if (!o.moznosti.some((m) => m.id === o.spravna)) chyby.push(`${kde}: správná odpověď mezi možnostmi není.`);
    if (o.moznosti.some((m) => !m.text.trim())) chyby.push(`${kde}: možnost bez textu.`);
    if (!o.vysvetleni.trim()) chyby.push(`${kde}: chybí vysvětlení z dat.`);
    if (!o.podnet.trim()) chyby.push(`${kde}: chybí podnět.`);
    if (!o.potkal.length) chyby.push(`${kde}: chybí, kde ji student potká.`);
    if (o.druh === 'pojem') {
      const p = pojemPodleId.get(o.spravna);
      if (p && jmenuje(o.podnet, pojemKlic(p))) chyby.push(`${kde}: situace jmenuje svůj pojem („${o.podnet.slice(0, 50)}…“).`);
    }
    if (o.druh === 'kresba') {
      const text = o.moznosti.find((m) => m.id === o.spravna)?.text ?? '';
      if (text && o.podnet.toLocaleLowerCase('cs').includes(text.toLocaleLowerCase('cs'))) chyby.push(`${kde}: podnět prozrazuje otázku.`);
    }
  }
  return chyby;
}

// ─── Deník: co student potkal ─────────────────────────────────────────────────

const cesta = (a: string) => {
  const s = a.split(/[?#]/)[0];
  return s.endsWith('/') ? s : `${s}/`;
};

/**
 * Kde student byl: kroky cest („cesta/<slug>/<krok>“ a „cesta/<slug>“), navštívené stránky, dočtené a čtené profily
 * a stránky, na kterých pracoval v bloku. Poškozené nebo chybějící části deníku dají prostě méně.
 */
export function potkaneZDeniku(d: unknown): Set<string> {
  const ven = new Set<string>();
  if (!d || typeof d !== 'object') return ven;
  const o = d as Record<string, unknown>;
  if (o.cesty && typeof o.cesty === 'object') {
    for (const [slug, p] of Object.entries(o.cesty as Record<string, { navstivene?: unknown }>)) {
      const kroky = Array.isArray(p?.navstivene) ? p.navstivene.filter((n): n is number => Number.isInteger(n)) : [];
      if (!kroky.length) continue;
      ven.add(`cesta/${slug}`);
      for (const n of kroky) {
        ven.add(`cesta/${slug}/${n}`);
        ven.add(`/cesta/${slug}/${n}/`);
      }
    }
  }
  const adresy = (pole: unknown, pole2: string) => (Array.isArray(pole) ? pole : []).forEach((x) => {
    const a = x && typeof x === 'object' ? (x as Record<string, unknown>)[pole2] : undefined;
    if (typeof a === 'string' && a.startsWith('/')) ven.add(cesta(a));
  });
  adresy(o.navstivene, 'odkaz');
  adresy(o.aktivita, 'odkaz');
  for (const k of ['prectene', 'cteni']) {
    const m = o[k];
    if (m && typeof m === 'object' && !Array.isArray(m)) for (const a of Object.keys(m)) if (a.startsWith('/')) ven.add(cesta(a));
  }
  return ven;
}

export const potkal = (o: Pick<OtazkaZustalo, 'potkal'>, potkane: ReadonlySet<string>) => o.potkal.some((k) => potkane.has(k));

/** Odkaz zpět: první místo, kde student otázku opravdu potkal; jinak výchozí. */
export function zpetPro(o: OtazkaZustalo, potkane: ReadonlySet<string>, mista: Record<string, OdkazZustalo>): OdkazZustalo {
  const k = o.potkal.find((x) => potkane.has(x) && mista[x]);
  return k ? mista[k] : o.zpet;
}

// ─── Kolo ─────────────────────────────────────────────────────────────────────

/**
 * Otázky kola (id v pořadí): jen potkané, nejvýš osm, nejvýš čtyři jednoho druhu, dva stejné druhy nikdy po sobě.
 * Počty se berou střídavě ze všech druhů a ořežou tak, aby se daly prostřídat; pořadí uvnitř druhu i to, který druh
 * začíná, dává semínko (číslo kola). Stejné kolo se stejným deníkem dá stejné otázky.
 */
export function vyberKola(otazky: readonly OtazkaZustalo[], potkane: ReadonlySet<string>, kolo: number): string[] {
  const druhy = zamichej(['pojem', 'hlas', 'kresba'] as DruhZustalo[], `zustalo:${kolo}`);
  const fronty = new Map(druhy.map((d) => [d, zamichej(otazky.filter((o) => o.druh === d && potkal(o, potkane)), `zustalo:${kolo}:${d}`)]));
  const pocty = new Map(druhy.map((d) => [d, 0]));
  let celkem = 0;
  for (let pridano = true; pridano && celkem < ZUSTALO_KOLO;) {
    pridano = false;
    for (const d of druhy) {
      if (celkem >= ZUSTALO_KOLO) break;
      const n = pocty.get(d)!;
      if (n < ZUSTALO_DRUHU_NEJVYS && n < fronty.get(d)!.length) {
        pocty.set(d, n + 1);
        celkem++;
        pridano = true;
      }
    }
  }
  // Druh, kterého je víc než ostatních dohromady o víc než jednu, by stál vedle sebe: ořízne se.
  for (const d of druhy) {
    const ostatni = celkem - pocty.get(d)!;
    if (pocty.get(d)! > ostatni + 1) {
      celkem -= pocty.get(d)! - (ostatni + 1);
      pocty.set(d, ostatni + 1);
    }
  }
  const zbyva = new Map(druhy.map((d) => [d, fronty.get(d)!.slice(0, pocty.get(d))]));
  const ven: string[] = [];
  let pred: DruhZustalo | undefined;
  while (ven.length < celkem) {
    const d = [...druhy].filter((x) => x !== pred && zbyva.get(x)!.length).sort((a, b) => zbyva.get(b)!.length - zbyva.get(a)!.length)[0];
    if (!d) break;
    ven.push(zbyva.get(d)!.shift()!.id);
    pred = d;
  }
  return ven;
}

export type VysledekOtazky = 'vim' | 'zopakuj';

/** Stav kola v deníku (`bloky['co-ti-zustalo/<období>']`). */
export interface StavZustalo {
  kolo: number;
  /** otázky kola v pořadí; zmrazí se při začátku, ať se kolo nemění pod rukama, když student mezitím projde další krok */
  poradi: string[];
  /** která otázka je na řadě (poradi.length = konec kola) */
  pozice: number;
  odpovedi: Record<string, VysledekOtazky>;
  /** co student zvolil (na rubu po obnovení stránky) */
  volby: Record<string, string>;
}

export function noveKolo(kolo: number, otazky: readonly OtazkaZustalo[], potkane: ReadonlySet<string>): StavZustalo {
  return { kolo, poradi: vyberKola(otazky, potkane, kolo), pozice: 0, odpovedi: {}, volby: {} };
}

/** Odpověď na otázku, která je na řadě: jedna, druhý pokus není. */
export function odpovez(s: StavZustalo, o: OtazkaZustalo, moznost: string): StavZustalo {
  if (s.poradi[s.pozice] !== o.id || s.odpovedi[o.id] || !o.moznosti.some((m) => m.id === moznost)) return s;
  return { ...s, odpovedi: { ...s.odpovedi, [o.id]: moznost === o.spravna ? 'vim' : 'zopakuj' }, volby: { ...s.volby, [o.id]: moznost } };
}

/** Další otázka (jen po odpovědi). */
export function dalsiOtazka(s: StavZustalo): StavZustalo {
  const id = s.poradi[s.pozice];
  if (!id || !s.odpovedi[id]) return s;
  return { ...s, pozice: s.pozice + 1 };
}

export const konecKola = (s: StavZustalo) => s.pozice >= s.poradi.length;

/** Co si zopakovat, v pořadí kola. */
export const kZopakovani = (s: StavZustalo) => s.poradi.filter((id) => s.odpovedi[id] === 'zopakuj');

/** Uložený stav, jen když sedí na otázky katalogu; jinak null. */
export function platnyStavZustalo(s: unknown, otazky: readonly OtazkaZustalo[]): StavZustalo | null {
  if (!s || typeof s !== 'object') return null;
  const o = s as Partial<StavZustalo>;
  const podleId = new Map(otazky.map((x) => [x.id, x]));
  if (!Number.isInteger(o.kolo) || (o.kolo as number) < 1 || !Array.isArray(o.poradi)) return null;
  const poradi = [...new Set(o.poradi.filter((x): x is string => typeof x === 'string' && podleId.has(x)))];
  if (poradi.length !== o.poradi.length || !poradi.length) return null;
  const odpovedi: Record<string, VysledekOtazky> = {};
  const volby: Record<string, string> = {};
  for (const id of poradi) {
    const v = (o.odpovedi as Record<string, unknown> | undefined)?.[id];
    if (v === 'vim' || v === 'zopakuj') odpovedi[id] = v;
    const m = (o.volby as Record<string, unknown> | undefined)?.[id];
    if (typeof m === 'string' && podleId.get(id)!.moznosti.some((x) => x.id === m)) volby[id] = m;
  }
  const pozice = Number.isInteger(o.pozice) ? Math.min(Math.max(o.pozice as number, 0), poradi.length) : 0;
  // Otázky před pozicí musí být zodpovězené; jinak kolo pokračuje od první nezodpovězené.
  const prvniBez = poradi.findIndex((id) => !odpovedi[id]);
  return { kolo: o.kolo as number, poradi, pozice: prvniBez >= 0 ? Math.min(pozice, prvniBez) : pozice, odpovedi, volby };
}

/** Pozvánka, když je otázek málo: první cesta období, kterou student nedokončil (jinak první cesta). */
export function pozvanka(cesty: readonly CestaZustalo[], d: unknown): CestaZustalo | undefined {
  const postup = d && typeof d === 'object' ? ((d as { cesty?: Record<string, unknown> }).cesty ?? {}) : {};
  return cesty.find((c) => !cestaHotova(postup[c.slug] as Parameters<typeof cestaHotova>[0])) ?? cesty[0];
}
