// Plynulost otočení listu (revize design-v2, R): kde otočení listu mezi stránkami trhá, přepne se samo na krátký přechod.
// Skript v hlavičce Zakladni.astro změří při každém otočení snímky za sekundu (requestAnimationFrame od pagereveal
// do konce přechodu) a výsledek předá funkci zapsatMereni. Když aspoň dvě ze tří posledních otočení měla pod 30 snímků
// za sekundu, další příchody dostanou typ přechodu „kratky“ (global.css › Krátký přechod) a list se neotáčí.
// Funkce se do hlavičky vkládají jako text (toString), proto smějí sahat jen na své parametry. Test:
// tests/data/plynulost-prechodu.test.ts; v prohlížeči tests/e2e/ram.spec.ts (krátký přechod po pomalých měřeních).

export const KLIC_PLYNULOSTI = 'atlas-plynulost';

/** Ze záznamu v localStorage (JSON nebo null) a nového měření vrátí nový záznam: tři poslední měření a krátký přechod. */
export function zapsatMereni(ulozeno: string | null, fps: number): string {
  let mereni: number[] = [];
  try {
    const o = JSON.parse(ulozeno || '{}');
    if (o && Array.isArray(o.mereni)) mereni = o.mereni.filter((x: unknown) => typeof x === 'number' && isFinite(x));
    if (o && o.kratky === true) return JSON.stringify({ mereni, kratky: true });
  } catch (e) { /* poškozený záznam: začne se znovu */ }
  mereni = mereni.concat([Math.round(fps)]).slice(-3);
  const pomalych = mereni.filter((x) => x < 30).length;
  return JSON.stringify({ mereni, kratky: pomalych >= 2 });
}

/** Má tohle zařízení dostat krátký přechod místo otočení listu? */
export function kratkyPrechod(ulozeno: string | null): boolean {
  try { return JSON.parse(ulozeno || '{}').kratky === true; } catch (e) { return false; }
}

/** Platí měření? Jen když přechod doběhl ve viditelném okně a ne déle než dvojnásobek otočení (900 ms):
 *  ve skrytém panelu requestAnimationFrame stojí a prohlížeč přechod po čase ukončí, takže by vyšla nula. */
export function platneMereni(ms: number, snimku: number, viditelne: boolean): boolean {
  return viditelne && snimku >= 3 && ms >= 300 && ms <= 1800;
}
