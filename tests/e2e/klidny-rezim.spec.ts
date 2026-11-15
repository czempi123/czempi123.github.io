// Klidný režim (design-v2, O; bod 12 Vizuálních zlepšení): přepínač v záhlaví, stav v localStorage nastavený před
// vykreslením, krátký přechod místo otočení listu, papír bez teček a natočení, poznámky pojmů na okraji tiskem.
// Na 390 a 1440 px ve dne i v noci, z klávesnice a s axe.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PROFIL = '/osobnost/sokrates/';
const prepinac = (page: Page) => page.locator('header.hlavicka [data-prepinac-klidu]');
const klidny = (page: Page) => page.evaluate(() => document.documentElement.hasAttribute('data-klidny'));

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`${sirka} px, ${rezim === 'light' ? 'den' : 'noc'}: z klávesnice zapnout, papír bez teček a natočení, axe`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka < 700 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim });
      await page.goto(PROFIL);
      await expect(prepinac(page)).toBeVisible();
      await expect(prepinac(page)).toHaveAttribute('aria-pressed', 'false');
      await expect(prepinac(page)).toHaveAccessibleName('Klidný režim');
      // Výchozí stav: deska natočená, papír s tečkami.
      const natoceni = () => page.locator('.osobnost__deska .deska__list').evaluate((e) => getComputedStyle(e).rotate);
      expect(await natoceni()).not.toBe('0deg');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tecka').trim())).not.toBe('transparent');

      // Z klávesnice: fokus na přepínač a mezerník.
      await prepinac(page).focus();
      await page.keyboard.press('Space');
      await expect(prepinac(page)).toHaveAttribute('aria-pressed', 'true');
      expect(await klidny(page)).toBe(true);
      expect(await page.evaluate(() => localStorage.getItem('atlas-klidny'))).toBe('1');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--tecka').trim())).toBe('transparent');
      expect(['0deg', 'none']).toContain(await natoceni());
      // Záhlaví se na telefonu vejde i s přepínačem navíc.
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      const r = (await prepinac(page).boundingBox())!;
      expect(r.width).toBeGreaterThanOrEqual(44);
      expect(r.height).toBeGreaterThanOrEqual(44);

      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);

      // Vypnout zase klávesou Enter.
      await page.keyboard.press('Enter');
      await expect(prepinac(page)).toHaveAttribute('aria-pressed', 'false');
      expect(await klidny(page)).toBe(false);
      expect(await page.evaluate(() => localStorage.getItem('atlas-klidny'))).toBeNull();
    });
  }
}

test('stav platí od prvního vykreslení další stránky (bez probliknutí)', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { klidPriNacteni: boolean }).klidPriNacteni = document.documentElement.hasAttribute('data-klidny');
    });
  });
  await page.goto('/');
  await prepinac(page).click();
  await page.goto('/lide/');
  expect(await page.evaluate(() => (window as unknown as { klidPriNacteni: boolean }).klidPriNacteni)).toBe(true);
  await expect(prepinac(page)).toHaveAttribute('aria-pressed', 'true');
});

test('přechod mezi stránkami je krátký, bez rubu listu a bez příchodu na profil', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    addEventListener('pagereveal', (e: Event & { viewTransition?: object }) => {
      (window as unknown as { prechodVt: object | null }).prechodVt = e.viewTransition ?? null;
      requestAnimationFrame(() => { (window as unknown as { otaciSe: boolean }).otaciSe = document.documentElement.classList.contains('otaci-se'); });
    });
  });
  const prechod = () => page.evaluate(() => {
    const vt = (window as unknown as { prechodVt?: { types: Set<string> } | null }).prechodVt;
    return vt === undefined ? undefined : vt === null ? 'zadny' : [...vt.types].join(',');
  });
  await page.goto('/otazky/');
  await prepinac(page).click();
  await page.getByRole('navigation', { name: 'Hlavní navigace' }).first().getByRole('link', { name: 'Lidé a směry' }).click();
  await expect(page).toHaveURL(/\/lide\/$/);
  // Headless Chromium přechod mezi dokumenty občas vynechá (docs/pouceni.md); typ se ověří, jen když přechod nastal.
  await expect.poll(prechod).not.toBeUndefined();
  if ((await prechod()) !== 'zadny') {
    expect(await prechod()).toBe('kratky');
    expect(await page.evaluate(() => (window as unknown as { otaciSe: boolean }).otaciSe)).toBe(false);
  }
  await page.goto(PROFIL);
  expect(await page.evaluate(() => document.documentElement.classList.contains('prichod'))).toBe(false);
});

test('poznámka pojmu na okraji je v Klidném režimu tiskem, jinak rukou', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PROFIL);
  const pozn = page.locator('.pojem-pozn--okraj').first();
  await expect(pozn).toBeVisible();
  expect(await pozn.evaluate((e) => getComputedStyle(e).fontFamily)).toContain('Kalam');
  await prepinac(page).click();
  await expect.poll(() => pozn.evaluate((e) => getComputedStyle(e).fontFamily)).toContain('Newsreader');
  expect(await pozn.evaluate((e) => getComputedStyle(e).fontSize)).toBe('15px');
});
