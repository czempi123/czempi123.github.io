// Razítko člověka (poštovní razítko, design-v2 Po D4): natočení podle id a délky textu po obvodu.
// Komponenta src/components/ui/RazitkoCloveka.astro; CSS .razitko-cloveka v global.css.

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

/** Odhad šířky textu v jednotkách razítka (Instrument Sans 700, 11 px jméno, 9 px roky, s prostrkáním). */
export function sirkaTextu(text: string, velikost: 11 | 9): number {
  const znak = velikost === 11 ? 7 : 5.6;
  let s = 0;
  for (const z of text) s += /[iIlíjtf.,:;'’ \u00a0–-]/.test(z) ? znak * 0.55 : /[mwMWŠČŽ]/.test(z) ? znak * 1.35 : znak;
  return s;
}

/** Délka textu na obvodu: jen když by se text nevešel, jinak nic (text má svou přirozenou šířku). */
export function delkaNaObvodu(text: string, velikost: 11 | 9): number | undefined {
  const misto = velikost === 11 ? MISTO_JMENO : MISTO_ROKY;
  return sirkaTextu(text, velikost) > misto ? misto : undefined;
}
