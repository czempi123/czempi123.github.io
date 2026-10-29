// Dva životy v Době a lidech (na medailonku, profilu i portrétu) a Kdo žil dřív? na medailonku (interaktivita-v1, K2).
// Výchozí dvojice a druhý člověk jsou z pevných pravidel v src/lib/dvojice.ts (výpis: VYPIS=1 npx vitest run tests/data/dvojice.test.ts);
// když se změní data, změní se i dvojice tady.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const lide = parse(readFileSync(join(import.meta.dirname, '../../src/data/lide.yaml'), 'utf8')) as { id: string; medailonek?: true }[];
const MEDAILONKY = lide.filter((o) => o.medailonek).map((o) => o.id);
const bezNbsp = (s: string) => s.replace(/\u00a0/g, ' ');

// Stránka, výchozí druhý život, věta pod pruhy, a koho student vybere klávesnicí (začátek jména) a co pak věta řekne.
const STRANKY = [
  { druh: 'medailonek', adresa: '/osobnost/anaximandros/', a: 'Anaximandros', b: 'Thalés', veta: 'Žili současně asi 64 let.', psat: 'Hypa', vybrany: 'Hypatia', nova: /^Dělí je asi \d+ let\. To je asi .+ lidských životů\.$/ },
  { druh: 'profil', adresa: '/osobnost/diogenes/', a: 'Diogenés', b: 'Antisthenés', veta: 'Žili současně asi 46 let.', psat: 'Epikt', vybrany: 'Epiktétos', nova: /^Dělí je asi \d+ let\. To je asi .+ lidsk/ },
  { druh: 'portrét', adresa: '/osobnost/sokrates/', a: 'Sókratés', b: 'Platón', veta: 'Žili současně asi 28 let.', psat: 'Aristot', vybrany: 'Aristotelés', nova: /^Dělí je (asi )?15 let\.$/ },
] as const;

const ostrov = 'astro-island[component-url*="DvaZivoty"]';
async function pripravit(page: Page, adresa: string) {
  await page.goto(adresa);
  await page.locator('#dva-zivoty').scrollIntoViewIfNeeded();
  await expect(page.locator(`${ostrov}:not([ssr])`)).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
}
const popisB = (page: Page) => page.locator('#dva-zivoty .dva__popis--b strong');
const veta = (page: Page) => page.locator('#dva-zivoty .dva__veta');

for (const s of STRANKY) {
  test(`Dva životy (${s.druh}): výchozí dvojice a věta, výběr jen klávesnicí, nic se neukládá`, async ({ page }) => {
    await pripravit(page, s.adresa);
    const dva = page.locator('.doba #dva-zivoty');
    await expect(dva.locator('.dva__popis--a strong')).toHaveText(s.a);
    await expect(popisB(page)).toHaveText(s.b);
    expect(bezNbsp(await veta(page).innerText())).toBe(s.veta);
    await expect(veta(page)).toHaveAttribute('aria-live', 'polite');
    // Nabídka: nejdřív lidé z Doby a lidí, výchozí je vybraný.
    const vyber = page.getByLabel('Druhý život', { exact: true });
    await expect(vyber.locator('optgroup').first()).toHaveAttribute('label', 'Z Doby a lidí');
    expect(await vyber.evaluate((e: HTMLSelectElement) => e.selectedOptions[0].textContent)).toContain(s.b);
    // Jen klávesnicí: fokus na nabídku tabulátorem od nadpisu oddílu a napsání začátku jména.
    await vyber.focus();
    await page.keyboard.type(s.psat);
    await expect(popisB(page)).toHaveText(s.vybrany);
    await expect.poll(async () => bezNbsp(await veta(page).innerText())).toMatch(s.nova);
    const denik = await page.evaluate(() => localStorage.getItem('atlas-denik'));
    expect(denik === null || !denik.includes('dva-zivoty')).toBe(true);
  });
}

test('Dva životy: Tab dojde na nabídku a fokus je vidět', async ({ page }) => {
  await pripravit(page, '/osobnost/diogenes/');
  // Z předchozího prvku se dá na nabídku dojít tabulátorem (a zpátky).
  const vyber = page.getByLabel('Druhý život', { exact: true });
  await vyber.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(vyber).not.toBeFocused();
  await page.keyboard.press('Tab');
  await expect(vyber).toBeFocused();
  const obrys = await page.getByLabel('Druhý život', { exact: true }).evaluate((e) => getComputedStyle(e).outlineStyle);
  expect(obrys).toBe('solid');
});

test('Dva životy: společná léta leží mezi pruhy, mezera je čára; při omezeném pohybu pruh skočí', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await pripravit(page, '/osobnost/anaximandros/');
  await expect(page.locator('#dva-zivoty .dva__usek--spolecne')).toHaveCount(1);
  const trvani = await page.locator('#dva-zivoty [data-kdo="b"] .dva__pruh').evaluate((e) => parseFloat(getComputedStyle(e).transitionDuration));
  expect(trvani).toBeLessThanOrEqual(0.001);
  await page.getByLabel('Druhý život', { exact: true }).selectOption('hypatia');
  await expect(page.locator('#dva-zivoty .dva__usek--mezera')).toHaveCount(1);
  // Pruh skočí: po pár snímcích stojí na místě (při běžném pohybu jede 600 ms).
  const pruh = page.locator('#dva-zivoty [data-kdo="b"] .dva__pruh');
  await page.waitForTimeout(50);
  const x1 = await pruh.evaluate((e) => e.getBoundingClientRect().left);
  await page.waitForTimeout(200);
  expect(await pruh.evaluate((e) => e.getBoundingClientRect().left)).toBe(x1);
});

test('Dva životy na společném profilu: první je hlavní osoba, lidé stránky v nabídce nejsou', async ({ page }) => {
  await pripravit(page, '/osobnost/krates-a-hipparchia/');
  await expect(page.locator('#dva-zivoty .dva__popis--a strong')).toHaveText('Kratés');
  // Lidé společné stránky v nabídce nejsou.
  await expect(page.locator('#dva-zivoty option[value="hipparchia"], #dva-zivoty option[value="krates"]')).toHaveCount(0);
});

test('Dva životy bez JavaScriptu: výchozí dvojice s větou, bez nabídky', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const s of STRANKY) {
    await page.goto(s.adresa);
    await expect(page.locator('#dva-zivoty .dva__popis--b strong')).toHaveText(s.b);
    expect(bezNbsp(await page.locator('#dva-zivoty .dva__veta').innerText())).toBe(s.veta);
    await expect(page.locator('#dva-zivoty select')).toHaveCount(0);
  }
  await ctx.close();
});

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Dva životy a Kdo žil dřív? na ${sirka} px (${rezim}): axe, nepřetéká`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      for (const s of STRANKY) {
        await pripravit(page, s.adresa);
        const axe = new AxeBuilder({ page }).include('.doba');
        if (s.druh === 'medailonek') axe.include('.kdo-zil-medailonek');
        const v = await axe.withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        const popis = v.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target.join(' ')).join(', ')}`);
        expect(popis, `${s.adresa}\n${popis.join('\n')}`).toEqual([]);
        const pretek = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(pretek, s.adresa).toBeLessThanOrEqual(0);
        // Nabídka má dotykový cíl aspoň 44 px a popisky se nepřekrývají s pruhy.
        expect((await page.getByLabel('Druhý život', { exact: true }).boundingBox())!.height).toBeGreaterThanOrEqual(44);
        const [a, pasy, b] = await Promise.all(['.dva__popis--a', '.dva__pasy', '.dva__popis--b'].map((c) => page.locator(`#dva-zivoty ${c}`).boundingBox()));
        expect(a!.y + a!.height).toBeLessThanOrEqual(pasy!.y + 0.5);
        expect(pasy!.y + pasy!.height).toBeLessThanOrEqual(b!.y + 0.5);
      }
      await page.screenshot({ path: `test-results/snimky/dva-zivoty-${sirka}-${rezim}.png`, fullPage: false });
    });
  }
}

test('Kdo žil dřív? je na každém medailonku nad Dobou a lidmi, profil ho nemá', async ({ page }) => {
  for (const id of MEDAILONKY) {
    await page.goto(`/osobnost/${id}/`);
    const blok = page.locator('.kdo-zil-medailonek section.blok');
    await expect(blok, id).toHaveCount(1);
    await expect(blok).toHaveAttribute('id', new RegExp(`^kdo-${id}-[a-z-]+-poradi$`));
    const nad = await page.evaluate(() => {
      const b = document.querySelector('.kdo-zil-medailonek')!;
      const d = document.querySelector('.doba')!;
      return !!(b.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(nad, id).toBe(true);
  }
  await page.goto('/osobnost/diogenes/');
  await expect(page.locator('.kdo-zil-medailonek')).toHaveCount(0);
});

test('Kdo žil dřív? na medailonku: odhad, odhalení a odkaz do mapy', async ({ page }) => {
  await page.goto('/osobnost/anaximandros/');
  const blok = page.locator('#kdo-anaximandros-herakleitos-poradi');
  await expect(blok.getByRole('heading')).toHaveText('Kdo žil dřív: Anaximandros, nebo Hérakleitos?');
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island[component-url*="KdoZilDriv"]:not([ssr])')).toHaveCount(1);
  await blok.getByText('Anaximandros', { exact: true }).click();
  await blok.getByRole('button', { name: 'Odhalit' }).click();
  expect(bezNbsp(await blok.locator('.blok__zpetna-titulek').innerText())).toBe('Dělí je asi 6 let.');
  await expect(blok.getByRole('link', { name: /Ukázat na mapě v roce/ })).toHaveAttribute('href', /osoba=anaximandros&srovnat=herakleitos/);
});
