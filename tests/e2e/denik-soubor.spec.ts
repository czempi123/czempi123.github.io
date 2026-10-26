// Deník ze souboru (revize antiky, O, nález 8): soubor ze „Stáhnout deník do souboru“ jde v jiném prohlížeči
// nahrát zpět a přidá se k deníku, který tam už je; nic se nesmaže. Cizí soubor deník nezmění. Logiku spojení
// hlídá tests/data/denik.test.ts (spojDeniky).
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const denik = (zapisy: { id: string; otazka: string; odpoved: string }[], cesty: Record<string, unknown> = {}) =>
  JSON.stringify({ verze: 1, zapisy: zapisy.map((z) => ({ ...z, odkaz: '/cesta/kolik-je-dost/7/', kdy: '2026-10-20T10:00:00Z' })), vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty });

async function otevri(page: Page, obsah: string) {
  await page.goto('/denik/');
  await page.evaluate((t) => localStorage.setItem('atlas-denik', t), obsah);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
}

async function nahraj(page: Page, cesta: string) {
  const [vyber] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('button', { name: 'Nahrát deník ze souboru' }).click()]);
  await vyber.setFiles(cesta);
}

test('deník stažený na jednom zařízení jde nahrát na druhém a přidá se k tamnímu', async ({ browser }) => {
  const doma = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const a = await doma.newPage();
  await otevri(a, denik([{ id: 'doma', otazka: 'Kolik je dost?', odpoved: 'Dost je, když nic nechybí.' }], { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 3, navstivene: [1, 2, 3], kdy: '2026-10-20T10:00:00Z' } }));
  const [stazeni] = await Promise.all([a.waitForEvent('download'), a.getByRole('button', { name: 'Stáhnout deník do souboru' }).click()]);
  const soubor = join(tmpdir(), 'atlas-denik-doma.json');
  await stazeni.saveAs(soubor);
  await doma.close();

  const skola = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const b = await skola.newPage();
  await otevri(b, denik([{ id: 've-skole', otazka: 'Co mám ve svých rukou?', odpoved: 'Co si myslím.' }]));
  await expect(b.getByText('Nahraný deník se přidá k tomu, co máš tady. Nic se nesmaže.')).toBeVisible();
  await nahraj(b, soubor);
  await expect(b.getByRole('status')).toHaveText('Deník ze souboru je přidaný k tomuto. Nic se nesmazalo.');
  const zapisy = b.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('Dost je, když nic nechybí.');
  await expect(zapisy).toContainText('Co si myslím.');
  await expect(b.locator('.seznam--rozpracovane')).toContainText('Kolik je dost?');
  // Spojený deník je v úložišti, ne jen na obrazovce.
  await b.reload();
  await expect(b.locator('.seznam--zapisy li')).toHaveCount(2);
  // Tentýž soubor podruhé nic nezdvojí.
  await nahraj(b, soubor);
  await expect(b.locator('.seznam--zapisy li')).toHaveCount(2);
  await skola.close();
});

test('cizí soubor deník nezmění; tlačítka jdou klávesnicí a stránka projde axe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await otevri(page, denik([{ id: 'tady', otazka: 'Kolik je dost?', odpoved: 'Málo.' }]));
  const cizi = join(tmpdir(), 'atlas-cizi-soubor.json');
  writeFileSync(cizi, '{"jine": true}');
  await nahraj(page, cizi);
  await expect(page.getByRole('status')).toHaveText('Tenhle soubor deník z atlasu není. Vyber soubor, který jsi stáhl tady v deníku.');
  await expect(page.locator('.seznam--zapisy li')).toHaveCount(1);
  // Výběr souboru se otevře i z klávesnice; samotné pole pro soubor do pořadí tabulátoru nepatří.
  await page.getByRole('button', { name: 'Stáhnout deník do souboru' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Nahrát deník ze souboru' })).toBeFocused();
  const [vyber] = await Promise.all([page.waitForEvent('filechooser'), page.keyboard.press('Enter')]);
  expect(vyber).toBeTruthy();
  for (const rezim of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: rezim });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations, rezim).toEqual([]);
  }
});
