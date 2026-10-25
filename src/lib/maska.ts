// Strhni masku (cesta 33, krok 4): kresba k Senekovu obrazu z Dopisů Luciliovi 24, 13. Děti se leknou lidí, které mají
// rády, když si nasadí masku; i věcem je třeba strhnout masku a vrátit jim jejich tvář. Velká tragická maska zakrývá
// tvář, sjede z ní stranou a zůstane ležet vedle, aby šly porovnat velikosti. Pohled „První maska“: pod ní je tvář
// menší. Pohled „Druhá maska“: pod ní je tvář skoro stejně velká, takže kresba neslibuje, že všechno je menší, než se
// zdá (slabé místo Dopisu 24, 2; Liberalis v Dopise 91). Zastavená kresba i omezený pohyb ukážou výsledek: masku vedle
// tváře. V kresbě není nic mimo model: maska s tkanicemi, tvář a dva popisky.
// Podklad: docs/podklady/celek-10.md › h) Kresba s pohybem „Maska“ (krok 4); b5 (Dopisy 24, 13).
// Čistá data a funkce bez DOM.

export type PohledMasky = 'mensi' | 'stejna';

export const POHLEDY_MASKY: { id: PohledMasky; nazev: string }[] = [
  { id: 'mensi', nazev: 'První maska' },
  { id: 'stejna', nazev: 'Druhá maska' },
];

/** Plátno v jednotkách kresby: na telefonu vyjde jednotka asi na pixel. */
export const PLATNO = { sirka: 340, vyska: 240 };

/** Maska v místních souřadnicích se středem v 0, 0. */
export const MASKA = { sirka: 120, vyska: 150 };

/** Kde stojí tvář a kde maska leží po strhnutí (posun od tváře v jednotkách kresby, natočení ve stupních). */
export const TVAR_STRED = { x: 102, y: 112 };
export const MASKA_VEDLE = { dx: 146, dy: 8, natoceni: 9 };

/** Popisky pod obojím. */
export const POPISKY = {
  y: 228,
  tvar: TVAR_STRED.x,
  maska: TVAR_STRED.x + MASKA_VEDLE.dx,
};

/** Poloosy tváře v obou pohledech; uši přesahují obrys o 12 % šířky. */
export const TVARE: Record<PohledMasky, { rx: number; ry: number }> = {
  mensi: { rx: 31, ry: 40 },
  stejna: { rx: 51, ry: 69 },
};
export const PRESAH_USI = 0.12;

/** Obrys masky a její rysy: tragická maska, otevřená ústa s koutky dolů, prázdné oči s obočím zvednutým uprostřed. */
export const MASKA_CESTY = {
  obrys: 'M 0 -75 C 38 -75 60 -52 60 -16 C 60 24 38 58 0 75 C -38 58 -60 24 -60 -16 C -60 -52 -38 -75 0 -75 Z',
  oci: [
    'M -42 -14 C -34 -26 -20 -30 -12 -22 C -18 -12 -32 -8 -42 -14 Z',
    'M 42 -14 C 34 -26 20 -30 12 -22 C 18 -12 32 -8 42 -14 Z',
  ],
  oboci: ['M -46 -31 Q -30 -36 -14 -45', 'M 46 -31 Q 30 -36 14 -45'],
  nos: 'M -1 -14 Q -7 8 2 13',
  usta: 'M -28 46 C -16 25 16 25 28 46 C 16 55 -16 55 -28 46 Z',
  tkanice: ['M -59 -22 L -71 -8 L -66 8', 'M 59 -22 L 71 -8 L 66 8'],
};

const z = (n: number): number => Math.round(n * 10) / 10;

export interface TvarCesty {
  rx: number;
  ry: number;
  vlasy: string;
  oci: { cx: number; cy: number; r: number }[];
  oboci: string[];
  nos: string;
  usta: string;
  usi: { cx: number; cy: number; rx: number; ry: number }[];
}

/** Obyčejná tvář o daných poloosách (střed 0, 0): vlasy, oči, obočí, nos a klidná ústa. */
export function tvar(rx: number, ry: number): TvarCesty {
  return {
    rx,
    ry,
    vlasy: `M ${z(-rx * 0.99)} ${z(-ry * 0.12)} C ${z(-rx * 0.97)} ${z(-ry * 1.32)} ${z(rx * 0.97)} ${z(-ry * 1.32)} ${z(rx * 0.99)} ${z(-ry * 0.12)} C ${z(rx * 0.72)} ${z(-ry * 0.6)} ${z(-rx * 0.72)} ${z(-ry * 0.6)} ${z(-rx * 0.99)} ${z(-ry * 0.12)} Z`,
    oci: [-1, 1].map((s) => ({ cx: z(s * rx * 0.38), cy: z(-ry * 0.04), r: z(Math.max(2.2, rx * 0.075)) })),
    oboci: [-1, 1].map((s) => `M ${z(s * rx * 0.56)} ${z(-ry * 0.2)} L ${z(s * rx * 0.2)} ${z(-ry * 0.22)}`),
    nos: `M 0 ${z(ry * 0.04)} L ${z(-rx * 0.08)} ${z(ry * 0.3)} L ${z(rx * 0.06)} ${z(ry * 0.32)}`,
    usta: `M ${z(-rx * 0.3)} ${z(ry * 0.56)} Q 0 ${z(ry * 0.6)} ${z(rx * 0.3)} ${z(ry * 0.56)}`,
    usi: [-1, 1].map((s) => ({ cx: z(s * rx), cy: z(ry * 0.05), rx: z(rx * PRESAH_USI), ry: z(ry * 0.2) })),
  };
}

/** Šířka a výška tváře i s ušima a vlasy (vlasy nepřesahují horní okraj obrysu víc než o pětinu výšky). */
export function rozmerTvare(pohled: PohledMasky): { sirka: number; vyska: number } {
  const { rx, ry } = TVARE[pohled];
  return { sirka: 2 * rx * (1 + PRESAH_USI), vyska: 2 * ry };
}

/** Texty pod kresbou: říkají slovy totéž co kresba. Věty do 25 slov, jen to, co je v podkladech. */
export const POPISY_MASKY: Record<PohledMasky, string> = {
  mensi:
    'Velká maska s otevřenými ústy a prázdnýma očima zakrývá tvář. Když sjede stranou, je pod ní tvář menší a obyčejná. Maska leží vedle, aby bylo vidět, o kolik byla větší.',
  stejna:
    'Pod touhle maskou je tvář skoro stejně velká jako maska. Je vážná, ale bez úšklebku a prázdných očí. Strhnout masku tu věc nezmenšilo. Podle Seneky tě ale, až přijde, nezaskočí jako nová.',
};

export function popisMasky(pohled: PohledMasky): string {
  return POPISY_MASKY[pohled];
}
