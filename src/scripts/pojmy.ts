// Pojmy v textu (Pojem.astro, design-v2, krok P). Jednou na stránce:
// 1. vysvětlení každého pojmu přesune za jeho odstavec (lístek se rozkládá pod odstavcem, ne uprostřed věty);
// 2. na notebooku změří odstavce, listy a překážky v okraji a podle rozmistitPoznamky() položí poznámky na okraj;
//    co se nevejde, zůstane lístkem po klepnutí; při změně šířky okna, po načtení písem a obrázků rozloží znovu;
// 3. ovládání: klepnutí otevře a zavře lístek (na okraji poznámku zvýrazní), Enter z klávesnice přesune fokus
//    do vysvětlení na „Celý pojem“, Esc nebo Zavřít vysvětlení zavře a vrátí fokus na slovo.
import { rozmistitPoznamky, type PrekazkaNaOkraji } from '../lib/okraj-pojmu';

const SIRKA = 232; // šířka poznámky na okraji, jako citát rukou na okraji (Citat.astro)
const MEZERA = 40; // od listu k poznámce; v mezeře stojí šipka tužkou
const NEJMENE = 190; // užší okraj poznámku nepojme
const OKRAJ_OKNA = 24;

interface Pojem { slovo: HTMLButtonElement; pozn: HTMLElement; odstavec: HTMLElement; okraj: boolean; otevreny: boolean }
const pojmy: Pojem[] = [];

function list(odstavec: HTMLElement): HTMLElement {
  return odstavec.closest<HTMLElement>('.cisty-list, .ctenarsky, .stranka-pojmu__text') ?? odstavec.parentElement!;
}

function nastavOkraj(p: Pojem, okraj: boolean) {
  p.okraj = okraj;
  p.pozn.classList.toggle('pojem-pozn--okraj', okraj);
  p.pozn.classList.toggle('pojem-pozn--listek', !okraj);
  if (okraj) {
    p.pozn.hidden = false;
    p.pozn.setAttribute('aria-hidden', p.otevreny ? 'false' : 'true');
  } else {
    p.pozn.removeAttribute('aria-hidden');
    p.pozn.hidden = !p.otevreny;
    p.pozn.style.cssText = '';
  }
  ovladani(p);
}

function ovladani(p: Pojem) {
  const v = p.otevreny ? '0' : '-1';
  p.pozn.querySelectorAll<HTMLElement>('a, button').forEach((el) => el.setAttribute('tabindex', v));
  p.slovo.setAttribute('aria-expanded', String(p.otevreny));
  p.pozn.classList.toggle('pojem-pozn--aktivni', p.otevreny || p.pozn.classList.contains('pojem-pozn--najeti'));
}

let rozlozeno = false;
function rozloz() {
  rozlozeno = true;
  const naOkraj = !document.documentElement.classList.contains('promitani') && matchMedia('(min-width: 1100px)').matches;
  const kandidati: { p: Pojem; levo: number; sirka: number; listRect: DOMRect }[] = [];
  for (const p of pojmy) {
    if (!naOkraj) { nastavOkraj(p, false); continue; }
    const listRect = list(p.odstavec).getBoundingClientRect();
    const levo = listRect.right + MEZERA;
    const sirka = Math.min(SIRKA, document.documentElement.clientWidth - OKRAJ_OKNA - levo);
    if (sirka < NEJMENE || p.odstavec.offsetParent === null) { nastavOkraj(p, false); continue; }
    kandidati.push({ p, levo, sirka, listRect });
  }
  if (!kandidati.length) return;
  // Změřit výšky: poznámka na okraji v cílové šířce, zatím neviditelná.
  for (const k of kandidati) {
    nastavOkraj(k.p, true);
    Object.assign(k.p.pozn.style, { width: `${k.sirka}px`, left: '0px', top: '0px', visibility: 'hidden' });
  }
  const y = scrollY;
  const main = document.querySelector('main') ?? document.body;
  const konec = main.getBoundingClientRect().bottom + y;
  // Překážky: co do okraje vedle listu zasahuje. Děti listu a sourozenci všech jeho předků až po <main>
  // (citát rukou na okraji, blok širší než sloupec, další kapitola). Pevné a lepivé lišty se nepočítají.
  const prekazky: PrekazkaNaOkraji[] = [];
  const videne = new Set<Element>();
  const pridej = (el: Element, prave: number) => {
    if (videne.has(el) || el.matches('.pojem-pozn, script, style')) return;
    videne.add(el);
    const r = el.getBoundingClientRect();
    if (!r.height || r.right <= prave + 2) return;
    if (/fixed|sticky/.test(getComputedStyle(el).position)) return;
    prekazky.push({ od: r.top + y, do: r.bottom + y });
  };
  for (const k of kandidati) {
    const l = list(k.p.odstavec);
    for (const dite of Array.from(l.children)) pridej(dite, k.listRect.right);
    for (let el: Element = l; el.parentElement && el !== main; el = el.parentElement) {
      for (const sourozenec of Array.from(el.parentElement.children)) if (sourozenec !== el) pridej(sourozenec, k.listRect.right);
    }
  }
  const mista = rozmistitPoznamky(
    kandidati.map((k) => {
      const r = k.p.odstavec.getBoundingClientRect();
      return { od: r.top + y + 2, vyska: k.p.pozn.offsetHeight, nejpozdeji: r.bottom + y - 12, mez: konec };
    }),
    prekazky,
  );
  kandidati.forEach((k, i) => {
    const horni = mista[i];
    if (horni === null) { nastavOkraj(k.p, false); return; }
    const rodic = (k.p.pozn.offsetParent as HTMLElement | null) ?? document.body;
    const rr = rodic.getBoundingClientRect();
    Object.assign(k.p.pozn.style, {
      left: `${k.levo - rr.left - rodic.clientLeft}px`,
      top: `${horni - (rr.top + y) - rodic.clientTop}px`,
      visibility: '',
    });
  });
}

function otevri(p: Pojem, zKlavesnice: boolean) {
  if (!rozlozeno) rozloz(); // Enter hned po načtení, dřív než první snímek poznámky rozložil
  p.otevreny = true;
  if (!p.okraj) p.pozn.hidden = false;
  else p.pozn.setAttribute('aria-hidden', 'false');
  ovladani(p);
  if (zKlavesnice) p.pozn.querySelector<HTMLElement>('.pojem-pozn__odkaz')?.focus();
}

function zavri(p: Pojem, vratitFokus: boolean) {
  p.otevreny = false;
  if (!p.okraj) p.pozn.hidden = true;
  else p.pozn.setAttribute('aria-hidden', 'true');
  ovladani(p);
  if (vratitFokus) p.slovo.focus();
}

function pripoj() {
  for (const slovo of Array.from(document.querySelectorAll<HTMLButtonElement>('button.pojem[data-pojem]'))) {
    if (slovo.dataset.pojemPripojen) continue;
    const pozn = document.getElementById(slovo.getAttribute('aria-controls')!);
    const odstavec = slovo.closest<HTMLElement>('p, li, blockquote');
    if (!pozn || !odstavec) continue;
    slovo.dataset.pojemPripojen = '1';
    odstavec.after(pozn);
    const p: Pojem = { slovo, pozn, odstavec, okraj: false, otevreny: false };
    pojmy.push(p);
    // Klik myší nebo prstem má detail ≥ 1; Enter a mezerník z klávesnice 0.
    slovo.addEventListener('click', (e) => (p.otevreny ? zavri(p, false) : otevri(p, e.detail === 0)));
    const najeti = (ano: boolean) => { pozn.classList.toggle('pojem-pozn--najeti', ano); ovladani(p); };
    slovo.addEventListener('pointerenter', () => najeti(true));
    slovo.addEventListener('pointerleave', () => najeti(false));
    slovo.addEventListener('focus', () => { if (slovo.matches(':focus-visible')) najeti(true); });
    slovo.addEventListener('blur', () => najeti(false));
    pozn.querySelector('.pojem-pozn__zavrit')?.addEventListener('click', () => zavri(p, true));
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape' && p.otevreny) { e.preventDefault(); zavri(p, true); } };
    slovo.addEventListener('keydown', esc);
    pozn.addEventListener('keydown', esc);
    pozn.addEventListener('focusout', (e) => {
      const kam = e.relatedTarget as Node | null;
      if (p.okraj && p.otevreny && kam && kam !== slovo && !pozn.contains(kam)) zavri(p, false);
    });
  }
}

let cekani = 0;
function znovu() { cancelAnimationFrame(cekani); cekani = requestAnimationFrame(rozloz); }

pripoj();
if (pojmy.length) {
  znovu();
  document.fonts?.ready.then(znovu);
  addEventListener('load', znovu);
  addEventListener('resize', znovu);
  new ResizeObserver(znovu).observe(document.querySelector('main') ?? document.body);
}
