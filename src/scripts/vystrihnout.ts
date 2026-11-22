// Vystřihnout citát do sbírky v deníku (design-v2, K6; denik-v2, K4): nůžky u citátu (ui/Nuzky.svelte v Citat.astro
// i v ostrovech). Stisknuté nůžky (aria-pressed) znamenají, že citát ve sbírce už je; druhý stisk ho ze sbírky vyndá.
// Nůžky, které ostrov vykreslí až po odkrytí, najde pozorovatel změn. Plná sbírka (CITATY_NEJVYS) citát nevystřihne:
// pod citátem se ukáže věta s odkazem na Moje sbírka (role status). Ukládá src/lib/denik.ts.
import { maCitat, nacti, sbirkaPlna, vystrihniCitat, zrusCitat } from '../lib/denik';
import { ADRESA_SBIRKY, TEXTY_SBIRKY } from '../lib/sbirka-texty';

const VYBER = '[data-vystrihnout]';

function obnov(): void {
  const d = nacti();
  document.querySelectorAll<HTMLButtonElement>(VYBER).forEach((b) => {
    const v = String(maCitat(b.dataset.vystrihnout!, d));
    if (b.getAttribute('aria-pressed') !== v) b.setAttribute('aria-pressed', v);
  });
  if (!sbirkaPlna(d)) document.querySelectorAll('.nuzky__plna').forEach((p) => p.remove());
}

/** Věta pod citátem, že sbírka je plná (jen u nůžek, které student stiskl). */
function ukazPlnou(b: HTMLButtonElement): void {
  const misto = b.parentElement;
  if (!misto) return;
  misto.querySelector(':scope > .nuzky__plna')?.remove();
  const p = document.createElement('p');
  p.className = 'nuzky__plna t-popisek';
  p.setAttribute('role', 'status');
  const a = document.createElement('a');
  a.href = ADRESA_SBIRKY;
  a.textContent = TEXTY_SBIRKY.plnaOdkaz;
  p.append(`${TEXTY_SBIRKY.plna} `, a);
  misto.append(p);
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element | null)?.closest<HTMLButtonElement>(VYBER);
  if (!b) return;
  const id = b.dataset.vystrihnout!;
  if (b.getAttribute('aria-pressed') === 'true') zrusCitat(id);
  else if (!vystrihniCitat({ id, text: b.dataset.text ?? '', kde: b.dataset.kde ?? '', odkaz: location.pathname })) ukazPlnou(b);
  obnov();
});
window.addEventListener('atlas-denik', obnov);

// Ostrovy (rub Kdo to řekl?, hotový Doplň citát, hlasy her, den týdne) přidají nůžky později.
let ceka = false;
new MutationObserver((zmeny) => {
  if (ceka) return;
  const nove = zmeny.some((z) => [...z.addedNodes].some((n) => n instanceof Element && (n.matches(VYBER) || n.querySelector(VYBER))));
  if (!nove) return;
  ceka = true;
  queueMicrotask(() => { ceka = false; obnov(); });
}).observe(document.documentElement, { childList: true, subtree: true });
obnov();
