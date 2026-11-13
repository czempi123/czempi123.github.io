// Razítko člověka (poštovní razítko, design-v2 Po D4): natočení podle id, délky textu po obvodu
// a střed razítka bez atributu (rodné město a rok narození, K3 dodatek).
// Komponenta src/components/ui/RazitkoCloveka.astro; CSS .razitko-cloveka v global.css.
import type { TOsoba } from './schema';

const NBSP = String.fromCharCode(160);

/** Natočení razítka ve stupních, −14° až +12°, pro každé id pořád stejné (nezávisí na pořadí na stránce). */
export function natoceniRazitka(id: string): number {
  let h = 0;
  for (const z of id) h = (h * 31 + z.codePointAt(0)!) % 100_003;
  return -14 + (h % 27);
}

/** Pod touto velikostí (px) razítko nemá obvod s textem: zůstanou kruhy a atribut. */
export const BEZ_OBVODU_POD = 48;

/** Kolik jednotek (z 100) smí zabrat jméno nahoře a roky dole, aby nevjely do teček na bocích. */
export const MISTO_JMENO = 100;
export const MISTO_ROKY = 118;
/** Šířka města uprostřed (vnitřní kruh má průměr 62 jednotek; ve výšce města zbývá kousek rezervy k okraji). */
export const MISTO_STRED = 50;

/** Odhad šířky textu v jednotkách razítka (Instrument Sans 700; 11 a 10 px jméno a město, 9 px roky a rok). */
export function sirkaTextu(text: string, velikost: 11 | 10 | 9): number {
  const znak = velikost === 11 ? 7 : velikost === 10 ? 6.4 : 5.6;
  let s = 0;
  for (const z of text) s += /[iIlíjtf.,:;'’ \u00a0–-]/.test(z) ? znak * 0.55 : /[mwMWŠČŽ]/.test(z) ? znak * 1.35 : znak;
  return s;
}

/** Délka textu na obvodu: jen když by se text nevešel, jinak nic (text má svou přirozenou šířku). */
export function delkaNaObvodu(text: string, velikost: 11 | 9): number | undefined {
  const misto = velikost === 11 ? MISTO_JMENO : MISTO_ROKY;
  return sirkaTextu(text, velikost) > misto ? misto : undefined;
}

/** Délka města uprostřed: jen když by přesáhlo střed, jinak nic. */
export function delkaVeStredu(text: string): number | undefined {
  return sirkaTextu(text, 10) > MISTO_STRED ? MISTO_STRED : undefined;
}

export interface StredRazitka {
  /** rodné město (název z mista.yaml) */
  mesto: string;
  /** rok narození bez letopočtu: „469“, „asi 470“, „před 520“ */
  rok?: string;
  /** „př. n. l.“, nebo „n. l.“ */
  era?: string;
}

/**
 * Střed razítka člověka bez atributu: rodné město a rok narození z dat (bod 8 Vizuálních zlepšení, K3 dodatek).
 * Jen rodiště (role narozeni), ne působiště; kdo ho nemá, má dál vlnovky. „Asi“ zůstává „asi“.
 */
export function stredRazitka(
  o: Pick<TOsoba, 'atribut' | 'mista' | 'narozen'>,
  nazevMista: (id: string) => string | undefined,
): StredRazitka | undefined {
  if (o.atribut) return undefined;
  const rodiste = o.mista.find((m) => m.role === 'narozeni');
  const mesto = rodiste ? nazevMista(rodiste.misto) : undefined;
  if (!mesto) return undefined;
  const n = o.narozen;
  if (!n) return { mesto };
  const pred = n.nejpozdeji ? 'před' : n.nejdrive ? 'po' : n.priblizne ? 'asi' : '';
  const rok = pred ? `${pred}${NBSP}${Math.abs(n.rok)}` : String(Math.abs(n.rok));
  return { mesto, rok, era: n.rok < 0 ? `př.${NBSP}n.${NBSP}l.` : `n.${NBSP}l.` };
}
