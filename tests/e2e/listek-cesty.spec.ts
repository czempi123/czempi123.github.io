// Cesta po K5 (design-v2): lístek cesty, který se štípe, tichý Další krok, lišta pod záhlavím a na telefonu nahoře,
// pahýl, který se po posledním kroku odtrhne do deníku, a kroužek perem na středu čísla.
import { test, expect, type Page } from '@playwright/test';
import { pripravitStranku } from './strany';

const CESTA = '/cesta/kdy-mam-dobry-duvod-verit/';
const misto = (page: Page, n: number) => page.locator('.cesta-hlavicka .misto').nth(n - 1);
const dalsi = (page: Page) => page.locator('.cesta-lista [data-dalsi-krok]');

for (const [sirka, vyska] of [[390, 844], [1440, 900]]) {
  test(`lístek v liště cesty na ${sirka} px: dírky prošlých kroků, kroužek perem na středu čísla, záhlaví webu jen na notebooku`, async ({ page }) => {
    await page.setViewportSize({ width: sirka, height: vyska });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const n of [1, 2, 3]) await page.goto(`${CESTA}${n}/`);
    await pripravitStranku(page);
    await expect(misto(page, 1)).toHaveAttribute('data-misto', 'dirka');
    await expect(misto(page, 2)).toHaveAttribute('data-misto', 'dirka');
    await expect(misto(page, 3)).toHaveAttribute('data-misto', 'ted');
    await expect(misto(page, 3)).toHaveAttribute('aria-current', 'step');
    await expect(misto(page, 4)).toHaveAttribute('data-misto', 'volne');
    await expect(misto(page, 1)).toContainText('Krok 1: Odpověď z Delf (prošel jsi)');
    // Kroužek perem stojí na středu čísla (připomínka autora 14. 11.: mřížka ho posunula o 7 px doleva).
    const [kruh, cislo] = await misto(page, 3).evaluate((e) => {
      const s = (r: DOMRect) => [r.x + r.width / 2, r.y + r.height / 2];
      const rng = document.createRange();
      rng.selectNodeContents(e.querySelector('.misto__cislo')!);
      return [s(e.querySelector('.misto__kruh path')!.getBoundingClientRect()), s(rng.getBoundingClientRect())];
    });
    expect(Math.abs(kruh[0] - cislo[0])).toBeLessThanOrEqual(1);
    expect(Math.abs(kruh[1] - cislo[1])).toBeLessThanOrEqual(1.5);
    // Kroužek je perem studenta.
    expect(await misto(page, 3).locator('.misto__kruh').evaluate((e) => getComputedStyle(e).stroke)).toBe('rgb(31, 74, 168)');
    // Telefon: lišta cesty nahoře místo záhlaví webu; notebook: záhlaví webu a pod ním lišta cesty.
    const hlavicka = page.locator('header.hlavicka');
    if (sirka < 900) {
      await expect(hlavicka).toBeHidden();
      expect(await page.locator('.cesta-hlavicka').evaluate((e) => getComputedStyle(e).position)).toBe('sticky');
      expect((await page.locator('.cesta-hlavicka').boundingBox())!.height).toBeLessThanOrEqual(56);
    } else {
      await expect(hlavicka).toBeVisible();
      const h = (await hlavicka.boundingBox())!;
      const l = (await page.locator('.cesta-hlavicka').boundingBox())!;
      expect(l.y).toBeGreaterThanOrEqual(h.y + h.height - 1);
      await expect(page.locator('.listek-cesty__nazev')).toHaveText('Kdy mám dobrý důvod věřit?');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('Další krok je tichý, dokud student neodpoví; krok bez bloku ho má hlavní hned; obnovení si odpověď pamatuje', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${CESTA}1/`);
  await pripravitStranku(page);
  await expect(dalsi(page)).toHaveClass(/blok__tl--hlavni/);
  await page.goto(`${CESTA}2/`);
  await pripravitStranku(page);
  await expect(dalsi(page)).toHaveClass(/blok__tl--tiche/);
  await expect(dalsi(page)).not.toHaveClass(/blok__tl--hlavni/);
  const volba = page.locator('#cesta1-jak-zjistit');
  await volba.getByText('Najdu lidi').click();
  await expect(dalsi(page)).toHaveClass(/blok__tl--tiche/);
  await volba.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(dalsi(page)).toHaveClass(/blok__tl--hlavni/);
  // Pata bloku Další krok neopakuje.
  await expect(volba.getByRole('link', { name: /Další krok/ })).toHaveCount(0);
  // Obnovení: hlavní hned, ještě před hydratací ostrovů (skript před vykreslením).
  await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
    (window as unknown as { __dalsi: string }).__dalsi = document.querySelector('[data-dalsi-krok]')!.className;
  }));
  await page.reload();
  expect(await page.evaluate(() => (window as unknown as { __dalsi: string }).__dalsi)).toMatch(/blok__tl--hlavni/);
  // Začít znovu: blok zase čeká na tah a Další krok ztichne.
  await pripravitStranku(page);
  await volba.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(dalsi(page)).toHaveClass(/blok__tl--tiche/);
  // Tichý Další krok jde stisknout: krok tím student výslovně přeskočí.
  await dalsi(page).click();
  await expect(page).toHaveURL(`${CESTA}3/`);
});

test('po posledním kroku se pahýl odtrhne a přistane v deníku; po obnovení je odtržený hned', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const n of [1, 2, 3, 4, 5, 6, 7]) await page.goto(`${CESTA}${n}/`);
  await pripravitStranku(page);
  const listek = page.locator('.cesta-hlavicka .listek-cesty');
  await expect(listek).not.toHaveAttribute('data-cely');
  await expect(dalsi(page)).toHaveClass(/blok__tl--tiche/);
  // Nad závěrem stojí od kroku T větve herna-v1 Pravý, nebo podvržený?: krok je hotový, až je odehraný i on.
  const pravy = page.locator('#cesta1-pravy');
  for (let i = 0; i < 20; i++) {
    if (await pravy.getByRole('button', { name: 'Další ústřižek' }).count()) { await pravy.getByRole('button', { name: 'Další ústřižek' }).click(); continue; }
    const r = pravy.locator('.razitko-verdikt:not(:disabled)');
    if (!(await r.count())) break;
    await r.first().click();
  }
  await expect(pravy.locator('.souhrn')).toBeVisible();
  await expect(dalsi(page)).toHaveClass(/blok__tl--tiche/);
  await page.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).fill('Když obstojí i proti protipříkladu.');
  await expect(dalsi(page)).toHaveClass(/blok__tl--hlavni/);
  await expect(listek).toHaveAttribute('data-cely', '');
  await expect(misto(page, 7)).toHaveAttribute('data-misto', 'dirka');
  await expect(listek.locator('[data-pahyl-stav]')).toHaveText('Cesta je za tebou. Pahýl lístku je v tvém deníku.');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik')!).cesty['kdy-mam-dobry-duvod-verit'].pahyl)).toMatch(/^\d{4}-/);
  // Obnovení: pahýl je pryč hned a nic se nehýbe.
  await page.reload();
  await expect(listek).toHaveAttribute('data-cely', '');
  expect(await listek.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => Number(a.effect?.getTiming().duration) > 1).length)).toBe(0);
  // Přehled cesty: týž lístek, všechny dírky, pahýl v deníku.
  await page.goto(CESTA);
  await pripravitStranku(page);
  const prehled = page.locator('.cesta .listek-cesty');
  await expect(prehled).toHaveAttribute('data-cely', '');
  await expect(prehled.locator('[data-misto="dirka"]')).toHaveCount(7);
});

test('Další krok z kroku n na n+1: dírka se vyštípne až po činu studenta, při omezeném pohybu nic', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${CESTA}1/`);
  await pripravitStranku(page);
  await dalsi(page).click();
  await expect(page).toHaveURL(`${CESTA}2/`);
  await expect(misto(page, 1)).toHaveClass(/misto--stip/);
  await expect(misto(page, 2)).toHaveClass(/misto--tah/);
  // Obnovení není čin studenta: bez pohybu.
  await page.reload();
  await expect(misto(page, 1)).toHaveAttribute('data-misto', 'dirka');
  await expect(misto(page, 1)).not.toHaveClass(/misto--stip/);
  // Omezený pohyb: dírka rovnou.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.cesta-lista').getByRole('link', { name: 'Předchozí' }).click();
  await dalsi(page).click();
  await expect(page).toHaveURL(`${CESTA}2/`);
  await expect(misto(page, 1)).toHaveAttribute('data-misto', 'dirka');
  await expect(misto(page, 1)).not.toHaveClass(/misto--stip/);
});
