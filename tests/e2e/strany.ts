// Společné pomůcky testů posledního kroku cest s blokem Kdo je na tvé straně (větev interaktivita-v1, K1 a T1):
// deník se zápisy bloků před načtením stránky a pořadí potomků oddílu po přeskládání. Používají cesta2, 7, 8, 33 a 34.
// Od revize interaktivita-v2 i společná příprava stránky (projedStranku, pripravitStranku) pro všechny testy cest.
import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Co se objeví jen po přeskládání: štítek, studentova odpověď a sbalené ostatní odpovědi. */
export const PRESKLADANO = '.strany__jine, .strana--tvoje, .strany__stitek';

/** Deník se stavy bloků (`stavBloku`) ještě před načtením stránky; `{}` je smazaný deník. */
export async function sDenikem(page: Page, bloky: Record<string, unknown>) {
  await page.addInitScript((b) => {
    localStorage.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: b, aktivita: [], cesty: {} }));
  }, bloky);
}

/**
 * Pořadí v oddílu Kdo je na tvé straně: „p“ společný odstavec, „stitek“, „tvoje:X“, „jine:A,B“, „strana:X“ bez přeskládání.
 * `n` je kolikátý oddíl téhož bloku v kroku (cesta 8 má k jedné Volbě tři oddíly).
 */
export const poradiStran = (page: Page, blok: string, n = 0) => page.locator(`[data-strany="${blok}"]`).nth(n).evaluate((o) => {
  const koren = o.querySelector(':scope > astro-slot') ?? o;
  return [...koren.children].map((e) => {
    const el = e as HTMLElement;
    if (el.classList.contains('strany__stitek')) return 'stitek';
    if (el.tagName === 'DETAILS') return `jine:${[...el.querySelectorAll<HTMLElement>(':scope > .strana')].map((x) => x.dataset.odpoved).join(',')}`;
    if (el.classList.contains('strana')) return `${el.classList.contains('strana--tvoje') ? 'tvoje' : 'strana'}:${el.dataset.odpoved}`;
    return 'p';
  });
});

/** Oddíly v pořadí, jak je autor napsal: [blok, kolikátý oddíl bloku, očekávané pořadí]. */
export type Oddily = [string, number, string[]][];

export async function poradiOddilu(page: Page, oddily: Oddily) {
  for (const [blok, n, ocekavane] of oddily) expect(await poradiStran(page, blok, n), `${blok} #${n}`).toEqual(ocekavane);
}

/** Kotvy kroku (nadpisy oddílů, Zkus to žít, závěr) jsou na stránce právě jednou. */
export async function kotvy(page: Page, ids: string[]) {
  for (const k of ids) await expect(page.locator(`[id="${k}"]`), k).toHaveCount(1);
}

/** Písma načtená, stránka jednou projetá (ostrovy client:visible) a všechny ostrovy hydratované. */
/**
 * Projede stránku po `krok` pixelech, aby se hydratovaly líné ostrovy (`client:visible`) a načetly obrázky.
 * Posun je okamžitý: stránka má `scroll-behavior: smooth` a plynulý `scrollTo` se za 40 ms posune jen o pár
 * pixelů, takže by se smyčka ke kresbám dole dostala jen podle toho, jak rychle zrovna běží prohlížeč
 * (revize interaktivita-v2, R: průchod cesty 1 padal asi jednou ze čtyř).
 */
export async function projedStranku(page: Page, krok = 500, pauza = 40) {
  await page.evaluate(async ([k, p]) => {
    for (let y = 0; y < document.body.scrollHeight; y += k) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, p));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [krok, pauza] as const);
}

/**
 * Písma, projetí stránky a hydratace všech ostrovů. Ostrovy, které ještě čekají, se posunou do okna každý
 * zvlášť: `astro-island` má `display: contents` a `scrollIntoView` na něm nic neudělá, posouvá se proto jeho
 * první potomek. Používají cesta, cesta3, 4, 5, 8, průchod a poslední kroky cest se stranami.
 */
export async function pripravitStranku(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await projedStranku(page);
  await page.evaluate(async () => {
    for (const el of Array.from(document.querySelectorAll('astro-island[ssr]'))) {
      (el.firstElementChild ?? el).scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15_000 });
}

/** Příprava kroku cesty (cesta2, 7, 8, 33, 34): stejná jako `pripravitStranku`. */
export const pripravitKrok = pripravitStranku;

export async function bezNalezuAxe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

const denikBloku = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));

/** Nic se neukládá: v deníku jsou po přeskládání a rozbalení jen bloky, které tam test dal, a žádný zápis. */
export async function nicNeulozeno(page: Page, bloky: string[]) {
  const d = await denikBloku(page);
  expect(Object.keys(d.bloky).sort()).toEqual([...bloky].sort());
  expect(d.zapisy).toEqual([]);
}
