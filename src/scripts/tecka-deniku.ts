// Tichá tečka u Deníku (design-v2, K6; odpověď autora 12. 11. 2026): když v deníku čeká Návrat, záhlaví i spodní
// lišta mají u Deníku malou tečku. Rozhoduje táž funkce jako nabídka v deníku (nabidkaNavratu); na stránce deníku
// tečka není, Návrat je tam vidět sám. Seznam návratů (id, cesta, pravidlo) nese záhlaví v data-navraty.
import { nacti } from '../lib/denik';
import { nabidkaNavratu, type NavratCesty } from '../lib/navrat';

function obnov(): void {
  const tecky = document.querySelectorAll<HTMLElement>('[data-tecka-navratu]');
  if (!tecky.length) return;
  let ceka = false;
  try {
    const navraty = JSON.parse(document.querySelector<HTMLElement>('[data-navraty]')?.dataset.navraty ?? '[]') as NavratCesty[];
    ceka = !location.pathname.startsWith('/denik/') && !!nabidkaNavratu(nacti(), navraty, Date.now());
  } catch { /* poškozený seznam: tečka zůstane schovaná */ }
  tecky.forEach((t) => { t.hidden = !ceka; });
}
window.addEventListener('atlas-denik', obnov);
obnov();
