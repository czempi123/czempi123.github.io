// Osa hlasů na stránce velké otázky (větev interaktivita-v2, krok K1): hlasy na vodorovné ose v poměru let,
// mince v polovině života, pod ní pruh života; za posledním hlasem zlom osy a „dnes“. Student si zvolí, kdo
// z nich je mu nejblíž (nebo nikdo), a pod osou dostane dvě věty z dat. Čisté funkce bez DOM a Astra;
// ostrov src/components/ostrovy/OsaHlasu.svelte, obal src/components/otazka/OsaHlasu.astro.
// Rozvržení se počítá pro tři šířky kresby (SVG s viewBoxem), takže ho dá sestavení i bez JavaScriptu.
import { naAstro, zAstro, zivotOsoby, vzdalenost, prirovnaniKZivotum, type OsobaMapy } from './cas-mapy';
import { rozdilLet, rok as rokText, ROK_DNES } from './casy';
import { nezlomitelne } from './sazba.js';

const NBSP = String.fromCharCode(160);

/** Hlas, jak ho potřebuje osa: osoba z dat, období (barva) a ikona atributu pro minci. */
export type HlasOsy = Pick<OsobaMapy, 'id' | 'jmeno' | 'narozen' | 'zemrel' | 'aktivni'> &
  Partial<Pick<OsobaMapy, 'jmeno2' | 'zena'>> & { obdobi: number; ikona?: string; zivotText: string };

/** Texty osy na jednom místě: čte je ostrov i katalog přípravy hodiny (src/lib/hodiny.ts). */
export const OSA_HLASU = {
  nadtitulek: 'Kdy žili',
  vyzva: 'Kdo z nich je ti nejblíž?',
  nikdo: 'Nikdo z nich',
  stitek: 'Tobě nejblíž',
  znovu: 'Začít znovu',
  ty: 'Ty',
  /** popisek kresby pro čtečky */
  popis: 'Hlasy na ose času',
} as const;

/** Volba „Nikdo z nich“ v deníku. */
export const NIKDO = 'nikdo';

/** Stav bloku otazka-<slug>-osa v deníku (klicOtazky(slug).osa). */
export interface StavOsy {
  /** id osoby, nebo „nikdo“ */
  volba: string;
}

export const stavZVolby = (volba: string): StavOsy => ({ volba });

/** Volba z deníku: id hlasu této otázky, „nikdo“, nebo null (nic, poškozený stav, id, které na stránce není). */
export function volbaZeStavu(stav: unknown, hlasy: readonly string[]): string | null {
  const v = stav && typeof stav === 'object' && !Array.isArray(stav) ? (stav as { volba?: unknown }).volba : undefined;
  if (typeof v !== 'string') return null;
  return v === NIKDO || hlasy.includes(v) ? v : null;
}

// ─── Čísla a čeština ──────────────────────────────────────────────────────────

/** „2 300“ s nezlomitelnou mezerou od tisíců. */
export function cislo(n: number): string {
  const s = String(Math.abs(n));
  const t = Math.abs(n) >= 1000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) : s;
  return n < 0 ? `−${t}` : t;
}

function let_(n: number): string {
  if (n === 1) return `1${NBSP}rok`;
  if (n >= 2 && n <= 4) return `${n}${NBSP}roky`;
  return `${cislo(n)}${NBSP}let`;
}

/** Zaokrouhlení vzdálenosti do dneška: od tisíce let na padesátky, od sta na desítky, menší beze změny. */
export function zaokrouhliLeta(n: number): number {
  if (n >= 1000) return Math.round(n / 50) * 50;
  if (n >= 100) return Math.round(n / 10) * 10;
  return n;
}

/** Polovina života v astronomických letech (mince stojí tam), začátek a konec. */
export function polohaHlasu(o: HlasOsy): { od: number; do: number; stred: number; priblizne: boolean } | null {
  const z = zivotOsoby(o);
  if (!z) return null;
  const od = naAstro(z.od);
  const do_ = naAstro(z.do);
  return { od, do: do_, stred: (od + do_) / 2, priblizne: z.odPriblizne || z.doPriblizne };
}

/** Kolik let uplynulo od konce posledního života do dneška, zaokrouhleně, a jestli patří „asi“. */
export function letDoDneska(hlasy: HlasOsy[]): { let: number; asi: boolean } | null {
  let konec: { rok: number; priblizne: boolean } | null = null;
  for (const h of hlasy) {
    const z = zivotOsoby(h);
    if (z && (!konec || naAstro(z.do) > naAstro(konec.rok))) konec = { rok: z.do, priblizne: z.doPriblizne };
  }
  if (!konec) return null;
  const n = rozdilLet(konec.rok, ROK_DNES);
  const z = zaokrouhliLeta(n);
  return { let: z, asi: z !== n || konec.priblizne };
}

// ─── Rozvržení ────────────────────────────────────────────────────────────────

export type SirkaOsy = 'uzka' | 'stredni' | 'siroka';

export interface RozmeryOsy {
  /** šířka viewBoxu */
  sirka: number;
  /** okraj vlevo, místo vpravo pro zlom a „dnes“ */
  vlevo: number;
  vpravo: number;
  /** poloměr mince */
  r: number;
  /** jména pod mincemi (na úzké kresbě se nevejdou; nese je výzva pod osou) */
  popisky: boolean;
  pismo: number;
  /** nejmenší mezera mezi sousedy v jednom řádku */
  mezera: number;
}

/**
 * Tři kresby: úzká pro telefon (sloupec do 520 px), střední a široká pro oddíl 960 px. Jednotka viewBoxu
 * vyjde zhruba na pixel; přepíná je dotaz na šířku obalu (container query) v ostrovu.
 */
export const ROZMERY: Record<SirkaOsy, RozmeryOsy> = {
  uzka: { sirka: 360, vlevo: 22, vpravo: 112, r: 16, popisky: false, pismo: 12, mezera: 4 },
  stredni: { sirka: 640, vlevo: 26, vpravo: 128, r: 18, popisky: true, pismo: 13, mezera: 10 },
  siroka: { sirka: 960, vlevo: 30, vpravo: 148, r: 20, popisky: true, pismo: 14, mezera: 12 },
};

/** Odhad šířky textu v jednotkách viewBoxu (bezpatkové písmo, průměrný znak 0,56 em); test ho ověří v prohlížeči. */
export const sirkaTextu = (s: string, pismo: number) => s.length * pismo * 0.56;

/** Výška pásu pro značku „Ty“ pod mincemi. */
export const VYSKA_TY = 26;

export interface MinceOsy {
  id: string;
  x: number;
  /** řádek mince (0 nahoře) */
  rada: number;
  cy: number;
  /** pruh života */
  odX: number;
  doX: number;
  pruhY: number;
  /** jméno pod mincí (jen střední a široká kresba) */
  popisek?: { x: number; y: number; sirka: number };
}

export interface RozlozeniOsy {
  rozmery: RozmeryOsy;
  vyska: number;
  /** svislá poloha osy a začátek řádků mincí */
  yOsa: number;
  /** konec měřítka (vpravo od něj zlom) */
  konec: number;
  /** zlom osy a značka dneška */
  zlom: number;
  dnes: number;
  /** pás pro značku „Ty“ */
  yTy: number;
  rad: number;
  mince: MinceOsy[];
  znacky: { x: number; text: string }[];
  /** „asi 1 850 let“ mezi zlomem a dneškem */
  doDneska: string;
}

/** Krok značek osy: nejmenší z kulatých kroků, při kterém jsou značky aspoň `rozestup` od sebe. */
function krokZnacek(roky: number, delka: number, rozestup: number): number {
  for (const k of [50, 100, 200, 250, 500, 1000]) if ((k / roky) * delka >= rozestup) return k;
  return 1000;
}

/**
 * Značky letopočtů nad osou. Bez roku nula; éra jen u posledního roku před n. l. a u prvního n. l.
 * (osa jen př. n. l. ji má jednou vpravo). Značka, jejíž popisek by vyjel z měřítka, odpadne.
 */
function znackyLet(od: number, do_: number, x: (a: number) => number, R: RozmeryOsy, konec: number): { x: number; text: string }[] {
  const krok = krokZnacek(do_ - od, konec - R.vlevo, R.pismo * 6);
  const roky: number[] = [];
  for (let r = Math.ceil(zAstro(od) / krok) * krok; naAstro(r) <= do_; r += krok) {
    if (r !== 0 && naAstro(r) >= od) roky.push(r);
  }
  const popis = (vybrane: number[]) => {
    const posledniPred = [...vybrane].reverse().find((r) => r < 0);
    const prvniPo = vybrane.find((r) => r > 0);
    return vybrane.map((r) => ({
      r,
      x: x(naAstro(r)),
      text: r === posledniPred ? rokText(r) : r === prvniPo ? rokText(r) : String(Math.abs(r)),
    }));
  };
  let vybrane = roky;
  for (let i = 0; i < 4; i++) {
    const s = popis(vybrane);
    const ven = s.filter((z) => z.x - sirkaTextu(z.text, R.pismo) / 2 < 0 || z.x + sirkaTextu(z.text, R.pismo) / 2 > konec + 4);
    if (!ven.length) return s.map(({ x: zx, text }) => ({ x: zx, text }));
    vybrane = vybrane.filter((r) => !ven.some((z) => z.r === r));
  }
  return popis(vybrane).map(({ x: zx, text }) => ({ x: zx, text }));
}

/**
 * Rozvržení osy pro jednu šířku kresby. Měřítko vede od začátku nejstaršího po konec nejmladšího života;
 * mince stojí v polovině života. Když by se mince (a na širších kresbách i jejich jména a pruhy) v řádku
 * potkaly, jde mince o řádek níž: řádky se plní zleva, každá mince do prvního řádku, kde je místo.
 */
export function rozlozeniOsy(hlasy: HlasOsy[], sirka: SirkaOsy): RozlozeniOsy {
  const R = ROZMERY[sirka];
  const polohy = hlasy.map((h) => ({ h, p: polohaHlasu(h) })).filter((x): x is { h: HlasOsy; p: NonNullable<ReturnType<typeof polohaHlasu>> } => !!x.p);
  const od = Math.min(...polohy.map((x) => x.p.od));
  const do_ = Math.max(...polohy.map((x) => x.p.do));
  const konec = R.sirka - R.vpravo;
  const rozsah = Math.max(1, do_ - od);
  const x = (a: number) => R.vlevo + ((a - od) / rozsah) * (konec - R.vlevo);

  const yOsa = 30;
  const yRady = yOsa + 14;
  const vyskaRady = 2 * R.r + 18 + (R.popisky ? R.pismo + 6 : 0);

  // Řádky: zleva podle polohy mince, každá do prvního řádku, kde končí soused dřív, než začíná ona.
  const poradi = [...polohy].sort((a, b) => a.p.stred - b.p.stred);
  const konceRad: number[] = [];
  const mince: MinceOsy[] = [];
  for (const { h, p } of poradi) {
    const mx = x(p.stred);
    const odX = x(p.od);
    const doX = x(p.do);
    let levy = Math.min(mx - R.r, odX);
    let pravy = Math.max(mx + R.r, doX);
    let popisek: MinceOsy['popisek'];
    if (R.popisky) {
      const w = sirkaTextu(h.jmeno, R.pismo);
      const px = Math.min(Math.max(mx, w / 2 + 2), R.sirka - 4 - w / 2);
      popisek = { x: px, y: 0, sirka: w };
      levy = Math.min(levy, px - w / 2);
      pravy = Math.max(pravy, px + w / 2);
    }
    let rada = konceRad.findIndex((k) => k + R.mezera <= levy);
    if (rada === -1) {
      rada = konceRad.length;
      konceRad.push(pravy);
    } else konceRad[rada] = pravy;
    const top = yRady + rada * vyskaRady;
    const cy = top + R.r;
    const pruhY = top + 2 * R.r + 6;
    mince.push({
      id: h.id,
      x: mx,
      rada,
      cy,
      odX,
      doX,
      pruhY,
      ...(popisek ? { popisek: { ...popisek, y: pruhY + 6 + R.pismo } } : {}),
    });
  }
  // Mince v pořadí hlasů na stránce, ne v pořadí rozvržení.
  const podleId = new Map(mince.map((m) => [m.id, m]));
  const vPoradi = polohy.map(({ h }) => podleId.get(h.id)!);
  const rad = Math.max(1, konceRad.length);
  const yTy = yRady + rad * vyskaRady + 2;
  const zlom = konec + 16;
  const dd = letDoDneska(hlasy);
  return {
    rozmery: R,
    vyska: yTy + VYSKA_TY + 6,
    yOsa,
    konec,
    zlom,
    dnes: R.sirka - 6,
    yTy,
    rad,
    mince: vPoradi,
    znacky: znackyLet(od, do_, x, R, konec),
    doDneska: dd ? `${dd.asi ? `asi${NBSP}` : ''}${let_(dd.let)}` : '',
  };
}

/** Popis osy pro čtečky: od kdy do kdy hlasy jsou a kolik let pak zbývá do dneška. */
export function popisOsy(hlasy: HlasOsy[]): string {
  const polohy = hlasy.map(polohaHlasu).filter((p): p is NonNullable<typeof p> => !!p);
  if (!polohy.length) return OSA_HLASU.popis;
  const od = zAstro(Math.min(...polohy.map((p) => p.od)));
  const do_ = zAstro(Math.max(...polohy.map((p) => p.do)));
  const dd = letDoDneska(hlasy);
  const pak = dd ? `, a pak ${dd.asi ? `asi${NBSP}` : ''}${let_(dd.let)} do dneška` : '';
  return `${OSA_HLASU.popis} v poměru let, od roku ${rokText(od)} do roku ${rokText(do_)}${pak}.`;
}

// ─── Věty po volbě ────────────────────────────────────────────────────────────

const tvar = (o: { zena?: boolean }, muz: string, zena: string) => (o.zena ? zena : muz);

/**
 * Kolik let studenta dělí od zvoleného hlasu (od konce jeho života do dneška, zaokrouhleně) a že na otázku
 * odpovídá podobně: „Od Epikúra tě dělí asi 2 300 let. To je víc než 30 lidských životů. Na tuhle otázku
 * přesto odpovídáš podobně jako on.“ Bez 2. pádu v datech jde jméno do 1. pádu.
 */
export function vetaOVzdalenosti(h: HlasOsy): string | null {
  const z = zivotOsoby(h);
  if (!z) return null;
  const n = rozdilLet(z.do, ROK_DNES);
  const r = zaokrouhliLeta(n);
  const asi = r !== n || z.doPriblizne ? `asi${NBSP}` : '';
  const prvni = h.jmeno2 ? `Od ${h.jmeno2} tě dělí ${asi}${let_(r)}.` : `${h.jmeno} ${tvar(h, 'žil', 'žila')} ${asi}před ${cislo(r)}${NBSP}lety.`;
  return nezlomitelne(`${prvni}${prirovnaniKZivotum(r)} Na tuhle otázku přesto odpovídáš podobně jako ${tvar(h, 'on', 'ona')}.`);
}

/**
 * Dva hlasy otázky, které žily nejdál od sebe (konec nejdřív končícího a začátek nejpozději začínajícího
 * života), a věta o nich: „Nejdál od sebe tu žili Aristotelés a Seneca. Dělí je asi 321 let. To je víc
 * než čtyři lidské životy.“ Když se všechny životy potkaly, null.
 */
export function vetaONejdelsiVzdalenosti(hlasy: HlasOsy[]): string | null {
  let prvni: HlasOsy | null = null;
  let posledni: HlasOsy | null = null;
  for (const h of hlasy) {
    const p = polohaHlasu(h);
    if (!p) continue;
    if (!prvni || p.do < polohaHlasu(prvni)!.do) prvni = h;
    if (!posledni || p.od > polohaHlasu(posledni)!.od) posledni = h;
  }
  if (!prvni || !posledni || prvni === posledni) return null;
  const v = vzdalenost({ ...prvni, mista: [] }, { ...posledni, mista: [] });
  if (!v || v.druh !== 'deli') return null;
  const zili = prvni.zena && posledni.zena ? 'žily' : 'žili';
  return nezlomitelne(`Nejdál od sebe tu ${zili} ${prvni.jmeno} a ${posledni.jmeno}. ${v.text}`);
}

/** Věta po „Nikdo z nich“; odkaz vede na Změnil se? dole na stránce. */
export const VETA_NIKDO = {
  text: nezlomitelne('Žádný z nich to nevidí jako ty. Tím spíš stojí za to napsat svou odpověď vlastními slovy, dole v oddílu '),
  odkaz: 'Změnil se?',
  kotva: '#zmenil-se',
} as const;

/** Věty pod osou po volbě: o zvoleném hlasu a o dvou nejvzdálenějších; po „nikdo“ jen odkaz na Změnil se?. */
export function vetyPoVolbe(volba: string | null, hlasy: HlasOsy[]): { vzdalenost?: string; nejdal?: string; nikdo?: true } {
  if (!volba) return {};
  if (volba === NIKDO) return { nikdo: true };
  const h = hlasy.find((x) => x.id === volba);
  if (!h) return {};
  const vz = vetaOVzdalenosti(h);
  const nd = vetaONejdelsiVzdalenosti(hlasy);
  return { ...(vz ? { vzdalenost: vz } : {}), ...(nd ? { nejdal: nd } : {}) };
}
