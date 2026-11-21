// Trasy na mini mapě v Době a lidech (herna-v1, K4; plátno D4): oblouk se šipkou a rokem mezi dvěma místy, kudy
// člověk přešel. Jen kde je rok příchodu v datech (zastávka života z pobytu s časem, src/lib/zivot-na-mape.ts);
// přechod, jehož rok data neříkají (z rodiště do Athén), se nekreslí. Tam a zpět jsou dva oblouky na dvou stranách,
// opakovaná cesta (Platón do Syrákús) jeden oblouk se dvěma roky. Popisek roku se nepotká s názvy a rolemi míst,
// s body ani s jiným rokem; když se nikam nevejde, oblouk zůstane bez roku (rok stojí i v řádku role u místa).
// Čisté funkce v jednotkách výřezu; odhad šířky písma jako u popisků míst (radkyPopisku, písmo na telefonu).
// Testy tests/data/herna-k4.test.ts, rozložení na stránkách tests/e2e/herna-k4.spec.ts.
import { rok as fmtRok } from './casy';
import { prekryv, radkyPopisku, sirkaTextu, type Obdelnik, type UmisteniPopisku } from './mapa';
import type { Zastavka } from './zivot-na-mape';

const NBSP = '\u00a0';

export interface TrasaMapy {
  /** id míst odkud a kam */
  od: string;
  kam: string;
  /** oblouk (kvadratická křivka) a šipka na konci, v jednotkách výřezu */
  d: string;
  sipka: string;
  /** rok příchodu („432 př. n. l.“, „asi 366 a 361 př. n. l.“) */
  rok: string;
  /** kde rok stojí; null, když se nikam nevešel */
  popisek: { x: number; y: number } | null;
}

/** „432 př. n. l.“, „asi 366 a 361 př. n. l.“: roky jedné cesty, letopočet jednou, „asi“, když je některý přibližný. */
export function rokyTrasy(z: readonly Pick<Zastavka, 'rok' | 'asiRok'>[]): string {
  const asi = z.some((x) => x.asiRok) ? `asi${NBSP}` : '';
  const roky = z.map((x) => x.rok);
  const stejnyLetopocet = roky.every((r) => r < 0) || roky.every((r) => r > 0);
  if (!stejnyLetopocet) return asi + roky.map((r) => fmtRok(r)).join(' a ');
  const cisla = roky.map((r) => String(Math.abs(r)));
  const posledni = fmtRok(roky[roky.length - 1]).replace(/^\d+/, '');
  return `${asi}${cisla.length > 1 ? `${cisla.slice(0, -1).join(', ')} a ${cisla[cisla.length - 1]}` : cisla[0]}${posledni}`;
}

/**
 * Obdélník popisku roku se středem (x, základnou y), odhad pro písmo role na telefonu (18 jednotek). Výška je celý
 * řádek písma (horní dotah až spodní), jak ho měří prohlížeč: na 390 px se dřív rok dotkl řádku role nad sebou.
 */
export function obdelnikRoku(text: string, x: number, y: number): Obdelnik {
  const s = sirkaTextu(text, 10.2, 4.6);
  return [x - s / 2, y - 17, x + s / 2, y + 6];
}
/** Řádek popisku místa s rezervou na celou výšku písma (radkyPopisku počítá jen tělo písmen). */
const sRezervou = (o: Obdelnik): Obdelnik => [o[0] - 2, o[1] - 4, o[2] + 2, o[3] + 4];

const delka = (v: [number, number]) => Math.hypot(v[0], v[1]);
const jednotka = (v: [number, number]): [number, number] => {
  const l = delka(v) || 1;
  return [v[0] / l, v[1] / l];
};
const bodKrivky = (a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];
const r1 = (n: number) => Math.round(n * 10) / 10;

export interface VstupTras {
  zastavky: readonly Zastavka[];
  /** poloha míst ve výřezu (jen viditelná místa) */
  xy: ReadonlyMap<string, [number, number]>;
  /** popisky míst, jak je kreslí mini mapa (pro kolize) */
  popisky: readonly { xy: [number, number]; nazev: string; radky: string[]; umisteni: UmisteniPopisku }[];
  sirka: number;
  vyska: number;
  /** obdélník měřítka vlevo dole (jednotky výřezu) */
  meritko?: Obdelnik;
}

/**
 * Trasy z jednoho místa do dalšího v pořadí zastávek života. Oblouk se vyklene doprava ve směru cesty (tam a zpět
 * tak leží na dvou stranách), začíná a končí kousek od bodu, aby šipka nezakryla razítko místa.
 */
export function trasyMiniMapy(v: VstupTras): TrasaMapy[] {
  const skupiny = new Map<string, { od: string; kam: string; z: Zastavka[] }>();
  v.zastavky.forEach((z, i) => {
    if (i === 0 || z.odvozena) return;
    const pred = v.zastavky[i - 1];
    if (pred.misto === z.misto || !v.xy.has(pred.misto) || !v.xy.has(z.misto)) return;
    const klic = `${pred.misto}>${z.misto}`;
    const s = skupiny.get(klic) ?? { od: pred.misto, kam: z.misto, z: [] };
    s.z.push(z);
    skupiny.set(klic, s);
  });
  // Co popisek roku nesmí zakrýt: názvy a role míst, body, měřítko a okraj výřezu.
  const zabrane: Obdelnik[] = [
    ...v.popisky.flatMap((p) => radkyPopisku(p, p.umisteni).map(sRezervou)),
    ...v.popisky.map((p): Obdelnik => [p.xy[0] - 9, p.xy[1] - 9, p.xy[0] + 9, p.xy[1] + 9]),
    ...(v.meritko ? [v.meritko] : []),
  ];
  const okraj = 14;
  const uvnitr = (o: Obdelnik) => o[0] >= okraj && o[1] >= okraj && o[2] <= v.sirka - okraj && o[3] <= v.vyska - okraj;
  const out: TrasaMapy[] = [];
  for (const s of skupiny.values()) {
    const A = v.xy.get(s.od)!;
    const B = v.xy.get(s.kam)!;
    const ab: [number, number] = [B[0] - A[0], B[1] - A[1]];
    const d = delka(ab);
    if (d < 24) continue;
    // Normála doprava ve směru cesty (osa y dolů): tam a zpět se vyklenou na opačné strany.
    const n = jednotka([-ab[1], ab[0]]);
    const h = Math.min(60, Math.max(12, d * 0.22));
    const C: [number, number] = [(A[0] + B[0]) / 2 + n[0] * h, (A[1] + B[1]) / 2 + n[1] * h];
    const uA = jednotka([C[0] - A[0], C[1] - A[1]]);
    const uB = jednotka([C[0] - B[0], C[1] - B[1]]);
    const A2: [number, number] = [A[0] + uA[0] * 10, A[1] + uA[1] * 10];
    const B2: [number, number] = [B[0] + uB[0] * 12, B[1] + uB[1] * 12];
    // Šipka: hrot na konci oblouku, směr tečny v koncovém bodě (B2 − C).
    const t = jednotka([B2[0] - C[0], B2[1] - C[1]]);
    const p: [number, number] = [-t[1], t[0]];
    const zakl: [number, number] = [B2[0] - t[0] * 8, B2[1] - t[1] * 8];
    const sipka = `M${r1(B2[0])} ${r1(B2[1])}L${r1(zakl[0] + p[0] * 4)} ${r1(zakl[1] + p[1] * 4)}L${r1(zakl[0] - p[0] * 4)} ${r1(zakl[1] - p[1] * 4)}Z`;
    const rok = rokyTrasy(s.z);
    // Popisek: u vrcholu oblouku na vnější straně, jinak posunutý po oblouku, jinak uvnitř oblouku, pak o kus dál.
    let popisek: TrasaMapy['popisek'] = null;
    // Pořadí míst: blíž vrcholu oblouku dřív, blíž oblouku dřív, vnější strana dřív; pak posun do strany.
    const tecky = [0.5, 0.45, 0.55, 0.4, 0.6, 0.35, 0.65, 0.3, 0.7, 0.25, 0.75, 0.2, 0.8, 0.15, 0.85];
    hledani: for (const posunX of [0, -30, 30, -60, 60]) for (const odstup of [12, 24, 38]) for (const strana of [1, -1]) {
      for (const tt of tecky) {
        const P = bodKrivky(A2, C, B2, tt);
        const x = P[0] + n[0] * strana * odstup + posunX;
        // Základna textu: nad obloukem posunutá nahoru, pod ním dolů, podle toho, kam míří normála.
        const y = P[1] + n[1] * strana * odstup + (n[1] * strana >= 0 ? 12 : -2);
        const o = obdelnikRoku(rok, x, y);
        if (uvnitr(o) && !zabrane.some((z) => prekryv(o, z, 4))) {
          popisek = { x: r1(x), y: r1(y) };
          zabrane.push(o);
          break hledani;
        }
      }
    }
    out.push({ od: s.od, kam: s.kam, d: `M${r1(A2[0])} ${r1(A2[1])}Q${r1(C[0])} ${r1(C[1])} ${r1(B2[0])} ${r1(B2[1])}`, sipka, rok, popisek });
  }
  return out;
}
