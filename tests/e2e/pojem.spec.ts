// Pojem v textu (design-v2, krok P; Pojem.astro, src/scripts/pojmy.ts): na notebooku poznámka rukou na okraji vedle
// odstavce, na telefonu lístek pod odstavcem po klepnutí; klávesnice (Enter otevře a dá fokus na „Celý pojem“,
// Esc zavře a vrátí fokus na slovo), čtečka slyší vysvětlení jako popis tlačítka, ne jako odkaz; omezený pohyb;
// na žádné stránce s pojmy se poznámky na okraji nepřekrývají navzájem ani s citátem na okraji.
// Data a vyznačení hlídá tests/data/pojmy.test.ts, rozmístění tests/data/okraj-pojmu.test.ts.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PROFIL = '/osobnost/sokrates/';

function soubory(slozka: string): string[] {
  return readdirSync(slozka, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? soubory(join(slozka, d.name)) : d.name.endsWith('.mdx') ? [join(slozka, d.name)] : []);
}
/** Adresy všech stránek, na kterých je některý pojem vyznačený (stejně jako adresaVyskytu v src/lib/pojmy.ts). */
const STRANKY_S_POJMY = soubory('src/content')
  .filter((f) => readFileSync(f, 'utf8').includes('<Pojem id='))
  .map((f) => ({ adresa: adresa(f), pocet: (readFileSync(f, 'utf8').match(/<Pojem id=/g) ?? []).length }));
function adresa(f: string): string {
  const [slozka, id, krok] = f.replace(/^src\/content\//, '').replace(/\.mdx$/, '').split('/');
  if (slozka === 'uvody') return id === 'co-je-nabozenstvi' ? '/nabozenstvi/' : `/${id}/`;
  if (slozka === 'cesty') return krok ? `/cesta/${id}/${krok.match(/^\d+/)![0]}/` : `/cesta/${id}/`;
  const druh = { osobnosti: 'osobnost', smery: 'smer', otazky: 'otazka', nabozenstvi: 'nabozenstvi' }[slozka];
  return `/${druh}/${id}/`;
}

async function nacist(page: Page, adresa: string, sirka: number, vyska: number) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: sirka, height: vyska });
  await page.goto(adresa);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

test('notebook: vysvětlení stojí rukou na okraji vedle odstavce, čtečka ho slyší jako popis slova', async ({ page }) => {
  await nacist(page, PROFIL, 1440, 900);
  const slovo = page.getByRole('button', { name: 'věštírny', exact: true });
  await expect(slovo).toHaveAccessibleDescription(/^Věštírna: Svatyně, kde se lidé ptali boha na radu/);
  await expect(page.getByRole('link', { name: 'věštírny' })).toHaveCount(0);
  const pozn = page.locator('#pojem-vestirna');
  await expect(pozn).toHaveClass(/pojem-pozn--okraj/);
  await expect(pozn).toBeVisible();
  await expect(pozn).toHaveAttribute('aria-hidden', 'true');
  await expect(pozn.locator('.pojem-pozn__text')).toHaveCSS('font-family', /Kalam/);
  const list = await page.locator('#delfy .cisty-list').first().boundingBox();
  const p = await page.locator('#delfy p', { has: slovo }).boundingBox();
  const b = await pozn.boundingBox();
  expect(b!.x).toBeGreaterThan(list!.x + list!.width);
  expect(b!.x + b!.width).toBeLessThanOrEqual(1440);
  expect(b!.y).toBeGreaterThanOrEqual(p!.y - 4);
  expect(b!.y).toBeLessThanOrEqual(p!.y + p!.height);
  // Najetí na slovo poznámku podloží lístkem; odkaz v ní míří na stránku pojmu.
  await slovo.hover();
  await expect(pozn).toHaveClass(/pojem-pozn--aktivni/);
  await expect(pozn.getByRole('link', { name: 'Celý pojem', includeHidden: true })).toHaveAttribute('href', '/pojem/vestirna/');
});

test('notebook z klávesnice: Enter dá fokus na Celý pojem, Esc ho vrátí na slovo', async ({ page }) => {
  await nacist(page, PROFIL, 1440, 900);
  const slovo = page.getByRole('button', { name: 'věštírny', exact: true });
  await slovo.focus();
  await page.keyboard.press('Enter');
  await expect(slovo).toHaveAttribute('aria-expanded', 'true');
  const odkaz = page.locator('#pojem-vestirna').getByRole('link', { name: 'Celý pojem' });
  await expect(odkaz).toBeFocused();
  await expect(page.locator('#pojem-vestirna')).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Escape');
  await expect(slovo).toBeFocused();
  await expect(slovo).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#pojem-vestirna')).toHaveAttribute('aria-hidden', 'true');
  // Zavřená poznámka na okraji tabulátor nezastaví: z věštírny vede další Tab na odkaz v dalším odstavci.
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).not.toHaveClass(/pojem-pozn__odkaz/);
});

test('telefon: lístek se rozloží po klepnutí pod odstavcem a Zavřít vrátí fokus na slovo', async ({ page }) => {
  await nacist(page, PROFIL, 390, 844);
  const slovo = page.getByRole('button', { name: 'věštírny', exact: true });
  const pozn = page.locator('#pojem-vestirna');
  await expect(pozn).toBeHidden();
  await slovo.scrollIntoViewIfNeeded();
  await slovo.click();
  await expect(pozn).toBeVisible();
  await expect(pozn).toHaveClass(/pojem-pozn--listek/);
  // Lístek stojí hned za odstavcem se slovem, ne uprostřed věty.
  expect(await pozn.evaluate((el) => el.previousElementSibling?.tagName === 'P' && !!el.previousElementSibling.querySelector('[data-pojem="vestirna"]'))).toBe(true);
  // Při omezeném pohybu je rozložený hned.
  expect(await pozn.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  const tlZavrit = pozn.getByRole('button', { name: 'Zavřít' });
  const box = await tlZavrit.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await tlZavrit.click();
  await expect(pozn).toBeHidden();
  await expect(slovo).toBeFocused();
  // Klávesnice na telefonu: Enter otevře, Esc zavře.
  await page.keyboard.press('Enter');
  await expect(pozn.getByRole('link', { name: 'Celý pojem' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(pozn).toBeHidden();
  await expect(slovo).toBeFocused();
});

test('bez omezeného pohybu se lístek rozkládá (--d-listek, --k-papir)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PROFIL);
  const slovo = page.getByRole('button', { name: 'věštírny', exact: true });
  await slovo.scrollIntoViewIfNeeded();
  await slovo.click();
  const animace = await page.locator('#pojem-vestirna').evaluate((el) => el.getAnimations().map((a) => (a as CSSAnimation).animationName));
  expect(animace).toContain('pojem-rozloz');
});

test('na stránkách s pojmy se poznámky na okraji nepřekrývají a stojí vedle svého odstavce', async ({ page }) => {
  test.setTimeout(240_000);
  expect(STRANKY_S_POJMY.length).toBeGreaterThan(25);
  let naOkraji = 0;
  for (const { adresa, pocet } of STRANKY_S_POJMY) {
    await nacist(page, adresa, 1440, 900);
    const vysledek = await page.evaluate(() => {
      const ram = (el: Element) => el.getBoundingClientRect();
      const pozn = [...document.querySelectorAll('.pojem-pozn--okraj')].map((el) => {
        const odst = el.previousElementSibling!;
        return { r: ram(el), odst: ram(odst), id: el.id };
      });
      const citaty = [...document.querySelectorAll('.citat--okraj')].map(ram).filter((r) => r.left > 0);
      const chyby: string[] = [];
      const kryje = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      pozn.forEach((a, i) => {
        if (a.r.top < a.odst.top - 4 || a.r.top > a.odst.bottom) chyby.push(`${a.id} není vedle svého odstavce`);
        if (a.r.right > innerWidth) chyby.push(`${a.id} přesahuje okno`);
        pozn.slice(i + 1).forEach((b) => { if (kryje(a.r, b.r)) chyby.push(`${a.id} kryje ${b.id}`); });
        citaty.forEach((c) => { if (kryje(a.r, c)) chyby.push(`${a.id} kryje citát na okraji`); });
      });
      return { chyby, pocet: pozn.length, vsech: document.querySelectorAll('button.pojem').length };
    });
    expect(vysledek.chyby, adresa).toEqual([]);
    // Každý pojem z MDX je na stránce jako tlačítko hned po načtení: žádný nezůstal v obsahu ostrovu (<template>).
    expect(vysledek.vsech, adresa).toBe(pocet);
    naOkraji += vysledek.pocet;
  }
  // Většina pojmů se na okraj vejde; co se nevejde, zůstane lístkem.
  expect(naOkraji).toBeGreaterThan(STRANKY_S_POJMY.length);
});

test('stránka pojmu: odkazy „Kde v atlasu stojí“ vedou na existující stránky, seznam pojmů vede na každý pojem', async ({ page }) => {
  await nacist(page, '/pojem/obec/', 1440, 900);
  const odkazy = await page.locator('#kde a').evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).getAttribute('href')!));
  expect(odkazy.length).toBeGreaterThan(10);
  for (const h of odkazy) expect((await page.request.get(h)).status(), h).toBe(200);
  await nacist(page, '/pojmy/', 390, 844);
  const pojmy = page.locator('.pojmy-seznam h2 a');
  expect(await pojmy.count()).toBeGreaterThanOrEqual(25);
  await page.getByRole('link', { name: 'V naší moci' }).click();
  await expect(page.locator('h1')).toHaveText('V naší moci.');
  // Patička vede na seznam pojmů z každé stránky.
  await expect(page.locator('footer').getByRole('link', { name: 'Pojmy' })).toHaveAttribute('href', '/pojmy/');
});

for (const rezim of ['light', 'dark'] as const) {
  test(`axe ${rezim}: poznámky na okraji (1440 px) a otevřený lístek (390 px) na profilu Sókrata a v kroku cesty`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
    for (const adresa of [PROFIL, '/cesta/staci-vedet-co-je-spravne/5/']) {
      for (const [sirka, vyska] of [[1440, 900], [390, 844]] as const) {
        await page.setViewportSize({ width: sirka, height: vyska });
        await page.goto(adresa);
        await page.evaluate(() => document.fonts.ready);
        if (sirka === 390) {
          const slovo = page.locator('button.pojem').first();
          await slovo.scrollIntoViewIfNeeded();
          await slovo.click();
        }
        const v = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        const popis = v.violations.map((x) => `${x.id}: ${x.help} ${x.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
        expect(popis, `${adresa} ${sirka}`).toEqual([]);
      }
    }
  });
}
