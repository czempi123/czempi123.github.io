// Kapitoly v Můj deník (design-v2, K6 dodatek): pod Moje filozofie kapitola na období jako rozbalovací lístek.
// Otevřená je kapitola, kde student naposledy byl; stav kapitol a řazení záznamů si deník pamatuje. Logiku hlídá
// tests/data/zapisnik-kapitoly.test.ts; tady skutečná data, obrazovka, klávesnice, čtečka a obnovení stránky.
// Plný deník (dvě období a otázka napříč) je v tests/e2e/data/denik-kapitoly.json; z něj jsou i snímky pro autora.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const PLNY = JSON.stringify(JSON.parse(readFileSync(new URL('./data/denik-kapitoly.json', import.meta.url), 'utf8'))['atlas-denik']);
const KLIC_KAPITOL = 'atlas-denik-kapitoly';

async function otevri(page: Page, obsah: string | null, stav?: unknown) {
  await page.goto('/denik/');
  await page.evaluate(([t, s, k]) => {
    if (t === null) localStorage.removeItem('atlas-denik');
    else localStorage.setItem('atlas-denik', t as string);
    if (s === undefined) localStorage.removeItem(k as string);
    else localStorage.setItem(k as string, JSON.stringify(s));
  }, [obsah, stav, KLIC_KAPITOL] as const);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
}

const kapitoly = (page: Page) => page.locator('details.kapitola');
const kapitola = (page: Page, nazev: string) => kapitoly(page).filter({ has: page.locator('h3.kapitola__nazev', { hasText: nazev }) });

test('prázdný deník: žádné kapitoly', async ({ page }) => {
  await otevri(page, null);
  await expect(page.getByText(/Zatím je prázdný\./)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kapitoly' })).toHaveCount(0);
  await expect(kapitoly(page)).toHaveCount(0);
});

test('jedno období: jedna kapitola, otevřená, s rozpracovanou cestou a zápisem', async ({ page }) => {
  const d = JSON.parse(PLNY);
  d.zapisy = d.zapisy.filter((z: { odkaz: string }) => z.odkaz.startsWith('/cesta/kolik-je-dost/'));
  d.cesty = { 'kolik-je-dost': d.cesty['kolik-je-dost'] };
  d.citaty = [];
  d.navstivene = [];
  d.aktivita = [];
  await otevri(page, JSON.stringify(d));
  await expect(kapitoly(page)).toHaveCount(1);
  const k = kapitola(page, 'Helenismus a Řím');
  await expect(k).toHaveAttribute('open', '');
  await expect(k.locator('.seznam--rozpracovane')).toContainText('Kolik je dost?');
  await expect(k.locator('.skupina__radek')).toHaveText(['cesta Kolik je dost?']);
});

test('plný deník: kapitoly po obdobích, otevřená ta poslední, obsah patří svému období', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevri(page, PLNY);
  // Moje filozofie nahoře, kapitoly pod ní, záloha dole jednou pro celý deník.
  const filozofie = await page.getByRole('heading', { level: 2, name: 'Moje filozofie' }).boundingBox();
  const nadpis = await page.getByRole('heading', { level: 2, name: 'Kapitoly' }).boundingBox();
  const zaloha = await page.getByRole('heading', { level: 2, name: 'Záloha a přenos' }).boundingBox();
  expect(filozofie!.y).toBeLessThan(nadpis!.y);
  expect(nadpis!.y).toBeLessThan(zaloha!.y);
  await expect(page.getByRole('heading', { level: 2, name: 'Záloha a přenos' })).toHaveCount(1);

  await expect(kapitoly(page).locator('h3')).toHaveText(['Počátky a klasické Řecko', 'Helenismus a Řím', 'Napříč obdobími']);
  const recko = kapitola(page, 'Počátky a klasické Řecko');
  const helenismus = kapitola(page, 'Helenismus a Řím');
  const napric = kapitola(page, 'Napříč obdobími');
  await expect(helenismus).toHaveAttribute('open', '');
  await expect(recko).not.toHaveAttribute('open', '');
  await expect(napric).not.toHaveAttribute('open', '');
  await expect(helenismus.locator('summary')).toContainText('naposledy 14. listopadu 2026');

  // Helenismus: rozpracované cesty a otázka, skupiny od naposledy otevřené, nadpis cesty je řádek s odkazem.
  await expect(helenismus.locator('.rozpr__nazev')).toHaveText(['Kolik je dost?', 'Proč se bát smrti?']);
  await expect(helenismus.locator('.rozpr__zal-t')).toHaveText(['Komu dáš za pravdu: Diogenovi, nebo Epikúrovi?']);
  await expect(helenismus.locator('.skupina__radek a')).toHaveText(['Epikúros', 'Kolik je dost?', 'Proč se bát smrti?']);
  await expect(helenismus.getByRole('link', { name: 'Kolik je dost?' }).last()).toHaveAttribute('href', '/cesta/kolik-je-dost/');
  await expect(helenismus.locator('.sbirka')).toContainText('Všechno ostatní je cizí, jen čas je náš.');
  await expect(helenismus.locator('.sb-pahyl__nazev')).toHaveText(['Co mám ve svých rukou?']);
  await expect(helenismus.getByRole('link', { name: /Tvoje antika/ })).toBeVisible();
  // Řecko: zavřená kapitola má svoje záznamy a sbírku, ne helénistické.
  await expect(recko.locator('.skupina__radek a')).toHaveText(['Sókratés', 'Kdy mám dobrý důvod věřit?']);
  await expect(recko.locator('.sbirka')).toContainText('Život bez zkoumání');
  await expect(recko.locator('.sbirka')).not.toContainText('jen čas je náš');
  await expect(recko.locator('.rozpr__nazev')).toHaveText(['Je to, co vidím, celá skutečnost?']);
  // Napříč obdobími: první názor ze stránky otázky.
  await expect(napric.locator('.skupina__radek')).toHaveText(['otázka Jak poznám, co je pravda?']);
  await expect(page.locator('body')).not.toContainText(/%|chybí ti|skóre|bod[ůy]\b/);
});

test('výpis podle data je přepínač v kapitole a deník si ho pamatuje', async ({ page }) => {
  await otevri(page, PLNY);
  const helenismus = kapitola(page, 'Helenismus a Řím');
  await expect(helenismus.locator('.seznam--zapisy')).toHaveCount(0);
  await helenismus.getByRole('button', { name: 'Podle data' }).click();
  await expect(helenismus.getByRole('button', { name: 'Podle data' })).toHaveAttribute('aria-pressed', 'true');
  await expect(helenismus.locator('.seznam--zapisy li .otazka')).toHaveText(['Co ti opravdu stačí ke klidu?', 'Kolik je dost?', 'Co z toho opravdu potřebuješ?', 'Čeho se na smrti bojíš nejvíc?']);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await expect(kapitola(page, 'Helenismus a Řím').locator('.seznam--zapisy li')).toHaveCount(4);
  // I v zavřené kapitole je výpis podle data (přepínač platí pro všechny kapitoly).
  await expect(kapitola(page, 'Počátky a klasické Řecko').locator('button.pohled__tl', { hasText: 'Podle data' })).toHaveAttribute('aria-pressed', 'true');
});

test('klávesnice: kapitola se rozbalí Enterem i mezerníkem, Esc nic nerozbije, stav vydrží obnovení', async ({ page }) => {
  await otevri(page, PLNY);
  const recko = kapitola(page, 'Počátky a klasické Řecko');
  const souhrn = recko.locator('summary');
  await souhrn.focus();
  await page.keyboard.press('Enter');
  await expect(recko).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(recko).toHaveAttribute('open', '');
  await expect(souhrn).toBeFocused();
  // Tabulátor jde z lístku kapitoly dovnitř: první odkaz je rozpracovaná cesta.
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '/cesta/je-to-co-vidim-cela-skutecnost/3/');
  // Helenismus zavřít mezerníkem.
  const helenismus = kapitola(page, 'Helenismus a Řím');
  await helenismus.locator('summary').focus();
  await page.keyboard.press(' ');
  await expect(helenismus).not.toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(helenismus).not.toHaveAttribute('open', '');
  // Událost toggle u <details> přijde jako samostatná úloha: obnovit až po uložení stavu (jinak závod s reload).
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k) ?? '', KLIC_KAPITOL)).not.toContain('obdobi-2');

  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await expect(kapitola(page, 'Počátky a klasické Řecko')).toHaveAttribute('open', '');
  await expect(kapitola(page, 'Helenismus a Řím')).not.toHaveAttribute('open', '');
  const stav = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KLIC_KAPITOL);
  expect(stav.otevrene).toEqual(['obdobi-1']);
});

test('kapitola, kde student byl po poslední změně, se otevře k zapamatovaným', async ({ page }) => {
  // Stav ze 6. 11.: otevřené jen Řecko. Helenismus má pozdější záznamy (14. 11.), takže se otevře taky.
  await otevri(page, PLNY, { otevrene: ['obdobi-1'], kdy: '2026-11-06T00:00:00.000Z' });
  await expect(kapitola(page, 'Počátky a klasické Řecko')).toHaveAttribute('open', '');
  await expect(kapitola(page, 'Helenismus a Řím')).toHaveAttribute('open', '');
  // Stav po všech záznamech: zavřené všechno zůstane zavřené.
  await otevri(page, PLNY, { otevrene: [], kdy: '2026-11-15T00:00:00.000Z' });
  await expect(kapitoly(page).and(page.locator('[open]'))).toHaveCount(0);
});

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`axe a přetečení: plný deník se všemi kapitolami otevřenými, ${sirka} px, ${rezim}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: 900 });
      await page.emulateMedia({ colorScheme: rezim });
      await otevri(page, PLNY, { otevrene: ['obdobi-1', 'obdobi-2', 'napric'], kdy: '2026-11-15T00:00:00.000Z' });
      await expect(kapitoly(page).and(page.locator('[open]'))).toHaveCount(3);
      const vysledek = await new AxeBuilder({ page }).include('main').analyze();
      expect(vysledek.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      const preteka = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(preteka).toBe(false);
    });
  }
}
