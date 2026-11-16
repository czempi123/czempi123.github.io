// Postup v cestě po načtení (design-v2, K5): zápis návštěvy kroku, lístek cesty a Další krok v liště podle deníku.
// Stav před vykreslením nastavily skripty u lístku a lišty (src/lib/postup.ts); tady se jen hlídá, co se změní,
// a přehraje se pohyb, který přišel po činu studenta:
//  · Další krok z předchozího kroku (adresa n−1 → n): dírka předchozího kroku se vyštípne, kroužek perem se dotáhne;
//  · odpověď v posledním bloku s odpovědí: Další krok se rozsvítí (blok zapíše do deníku, událost atlas-denik);
//  · na posledním kroku po odpovědi pahýl lístku odtrhne a „přistane v deníku“ (cesty[slug].pahyl, ukáže ho K6).
// Po obnovení stránky a při omezeném pohybu se nic nehýbe a vše je rovnou na konci.
import { nacti, zaznamenejKrok, odtrhniPahyl } from '../lib/denik';
import { stavKroku, pouzijStavKroku, typPrechoduKroku, adresaOdkud, type StavKroku } from '../lib/postup';

export function spustPostupCesty(): void {
  const listek = document.querySelector<HTMLElement>('[data-listek-cesty]');
  if (!listek) return;
  const slug = listek.dataset.slug ?? '';
  const krok = Number(listek.dataset.krok);
  const pocet = Number(listek.dataset.pocet);
  const ceka = listek.dataset.ceka ?? '';
  const stav = () => stavKroku(nacti(), slug, krok, pocet, ceka);
  const pohyb = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (krok > 0) zaznamenejKrok(slug, krok, listek.dataset.nazev ?? '', pocet);
  let s = stav();
  pouzijStavKroku(s, document);

  const mista = listek.querySelectorAll<HTMLElement>('[data-misto]');
  if (pohyb && krok > 1 && typPrechoduKroku(adresaOdkud(), location.pathname) === 'krok-dal') {
    mista[krok - 2]?.classList.add('misto--stip');
    mista[krok - 1]?.classList.add('misto--tah');
  }

  // Pahýl se odtrhne jednou, na posledním kroku, až je hotový. Při načtení (starší deník) bez pohybu.
  const odtrhni = (zive: boolean): void => {
    if (krok !== pocet || !s.hotovy || s.cely || !odtrhniPahyl(slug)) return;
    s = stav();
    if (zive && pohyb) {
      listek.classList.add('listek-cesty--odtrhava');
      listek.querySelector('.listek-cesty__pahyl')?.addEventListener('animationend', () => listek.classList.remove('listek-cesty--odtrhava'), { once: true });
    }
    pouzijStavKroku(s, document);
    const hlas = listek.querySelector('[data-pahyl-stav]');
    if (hlas && zive) hlas.textContent = 'Cesta je za tebou. Pahýl lístku je v tvém deníku.';
  };
  odtrhni(false);

  addEventListener('atlas-denik', () => {
    const novy: StavKroku = stav();
    const rozsviti = !s.hotovy && novy.hotovy;
    s = novy;
    pouzijStavKroku(s, document);
    if (rozsviti) odtrhni(true);
  });
}
