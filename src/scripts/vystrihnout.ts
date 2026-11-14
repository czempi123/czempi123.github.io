// Vystřihnout citát do sbírky v deníku (design-v2, K6): nůžky u citátu na listu (Citat.astro). Stisknuté nůžky
// (aria-pressed) znamenají, že citát ve sbírce už je; druhý stisk ho ze sbírky vyndá. Ukládá src/lib/denik.ts.
import { maCitat, nacti, vystrihniCitat, zrusCitat } from '../lib/denik';

function obnov(): void {
  const d = nacti();
  document.querySelectorAll<HTMLButtonElement>('[data-vystrihnout]').forEach((b) => {
    b.setAttribute('aria-pressed', String(maCitat(b.dataset.vystrihnout!, d)));
  });
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-vystrihnout]');
  if (!b) return;
  const id = b.dataset.vystrihnout!;
  if (b.getAttribute('aria-pressed') === 'true') zrusCitat(id);
  else vystrihniCitat({ id, text: b.dataset.text ?? '', kde: b.dataset.kde ?? '', odkaz: location.pathname });
  obnov();
});
window.addEventListener('atlas-denik', obnov);
obnov();
