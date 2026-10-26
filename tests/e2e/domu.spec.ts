// Domů: jeden jasný začátek. Ohyb na notebooku i telefonu, jediné hlavní tlačítko s údajem z dat cesty,
// stav tlačítka u vracejícího se studenta bez probliknutí a Pokračuj jako tichý řádek.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CESTA = '/cesta/kdy-mam-dobry-duvod-verit/';
const denik = (cast: Record<string, unknown>) => JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });
const SOKRATES = [{ odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: '2026-10-02T09:00:00Z' }];
const ROZPRACOVANA = { 'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, krok: 4, navstivene: [1, 2, 3, 4], kdy: '2026-10-03T08:00:00Z' } };
const HOTOVA = { 'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: '2026-10-03T08:00:00Z' } };

/** Svislé hrany prvků a viditelné části okna (pod hlavičkou, nad spodní lištou telefonu). */
async function hrany(page: Page) {
  return page.evaluate(() => {
    const r = (s: string) => {
      const b = document.querySelector(s)!.getBoundingClientRect();
      return { nahore: Math.round(b.top), dole: Math.round(b.bottom) };
    };
    const lista = document.querySelector('nav.lista')!;
    return {
      okno: { nahore: r('.hlavicka').dole, dole: getComputedStyle(lista).display === 'none' ? innerHeight : Math.round(lista.getBoundingClientRect().top) },
      nadpis: r('main h1'),
      perex: r('.uvod .perex'),
      tlacitko: r('[data-zacatek-tlacitko]'),
      udaj: r('[data-zacatek-udaj]'),
      panel: r('.prvni-cesta'),
      obdobi: r('#osm-obdobi'),
      posun: scrollY,
    };
  });
}

for (const { sirka, vyska } of [{ sirka: 1280, vyska: 720 }, { sirka: 390, vyska: 844 }]) {
  test(`Domů · ohyb ${sirka} × ${vyska}: nadpis, perex a hlavní tlačítko jsou celé vidět bez posouvání`, async ({ page }) => {
    await page.setViewportSize({ width: sirka, height: vyska });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // Nadpis drží existující token (h1), žádná vlastní velikost.
    await expect(page.locator('main h1')).toHaveClass(/(^|\s)t-h1(\s|$)/);
    const m = await hrany(page);
    expect(m.posun).toBe(0);
    expect(m.nadpis.nahore).toBeGreaterThanOrEqual(m.okno.nahore);
    for (const [co, prvek] of Object.entries({ nadpis: m.nadpis, perex: m.perex, tlacitko: m.tlacitko, udaj: m.udaj })) {
      expect(prvek.dole, `${co} končí nad ohybem`).toBeLessThanOrEqual(m.okno.dole);
    }
    // Pod začátkem je vidět kus dalšího obsahu: na telefonu panel první cesty, na notebooku nadpis Osm období.
    if (sirka < 900) expect(m.okno.dole - m.panel.nahore).toBeGreaterThanOrEqual(96);
    else expect(m.obdobi.dole).toBeLessThanOrEqual(m.okno.dole);
    await page.screenshot({ path: `test-results/snimky/domu-ohyb-${sirka}x${vyska}.png` });
  });
}

test('Domů: jedna výzva k začátku, údaj z dat cesty a vedlejší odkaz na Sókrata', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hlavni = page.locator('main .tlacitko--hlavni');
  await expect(hlavni).toHaveCount(1);
  await expect(hlavni).toHaveText('Začít první cestu');
  await expect(hlavni).toHaveAttribute('href', `${CESTA}1/`);
  await expect(page.locator('[data-zacatek-udaj]')).toHaveText('První cesta · asi 14 minut · 7 kroků');
  await expect(page.locator('.uvod').getByRole('link', { name: 'Poznat Sókrata' })).toHaveAttribute('href', '/osobnost/sokrates/');
  // Mapa zůstává v hlavičce a ve třech vstupech, ne v úvodu; karta cesty ani druhé tlačítko tu nejsou.
  await expect(page.locator('.uvod a[href="/mapa/"]')).toHaveCount(0);
  await expect(page.locator('.rozcestnik a[href="/mapa/"]')).toHaveCount(1);
  await expect(page.locator('.cesta-karta')).toHaveCount(0);
  await expect(page.getByText('Vydat se na cestu')).toHaveCount(0);
  // Panel první cesty říká, o čem cesta je, a vede na tentýž krok.
  const panel = page.locator('.prvni-cesta');
  await expect(panel).toHaveAttribute('href', `${CESTA}1/`);
  await expect(panel).toContainText('První cesta · Kdy mám dobrý důvod věřit?');
  await expect(panel).toContainText('Nikdo není moudřejší.');
  // Nový student žádné Pokračuj nevidí.
  await expect(page.locator('astro-island[component-url*="Pokracuj"]:not([ssr])')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Pokračuj, kde jsi skončil' })).toHaveCount(0);
  await hlavni.click();
  await expect(page).toHaveURL(`${CESTA}1/`);
  await expect(page.locator('h1')).toHaveText('Odpověď z Delf');
});

test('Domů: vracející se student má tlačítko podle deníku hned, bez čekání na skripty stránky', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Moduly stránky (ostrovy) se nenačtou: stav tlačítka musí stát jen na skriptu, který běží před vykreslením.
  await page.route(/\/_astro\/.*\.js(\?.*)?$/, (r) => r.abort());
  const otevri = async (cast: Record<string, unknown>) => {
    await page.goto('/denik/');
    await page.evaluate((d) => localStorage.setItem('atlas-denik', d), denik(cast));
    await page.goto('/');
  };
  const hlavni = page.locator('[data-zacatek-tlacitko]');
  const udaj = page.locator('[data-zacatek-udaj]');

  await otevri({ cesty: ROZPRACOVANA });
  await expect(hlavni).toHaveText('Pokračovat v cestě');
  await expect(hlavni).toHaveAttribute('href', `${CESTA}4/`);
  await expect(udaj).toHaveText('Kdy mám dobrý důvod věřit? · krok 4 z 7');
  // Ohyb drží i s delším údajem.
  const m = await hrany(page);
  expect(m.udaj.dole).toBeLessThanOrEqual(m.okno.dole);

  await otevri({ cesty: HOTOVA });
  await expect(hlavni).toHaveText('Vybrat další cestu');
  await expect(hlavni).toHaveAttribute('href', '/otazky/');
  await expect(udaj).toHaveText('První cesta je hotová · zbývá 9 cest');

  // Cizí nebo rozbitý záznam začátek nerozbije.
  await page.evaluate(() => localStorage.setItem('atlas-denik', '{"verze":1,"cesty":"nesmysl"'));
  await page.goto('/');
  await expect(hlavni).toHaveText('Začít první cestu');
  await expect(hlavni).toHaveAttribute('href', `${CESTA}1/`);
});

test('Domů: Pokračuj je tichý řádek, neopakuje hlavní tlačítko a po načtení neposune obsah', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/denik/');
  await page.evaluate((d) => localStorage.setItem('atlas-denik', d), denik({ cesty: ROZPRACOVANA, navstivene: SOKRATES }));
  // Poloha obsahu pod úvodem, dokud ostrov Pokračuj není načtený…
  await page.route(/\/_astro\/.*\.js(\?.*)?$/, (r) => r.abort());
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const pred = (await hrany(page)).obdobi.nahore;
  await page.unroute(/\/_astro\/.*\.js(\?.*)?$/);
  // …a po jeho načtení.
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const pokracuj = page.getByRole('navigation', { name: 'Pokračuj, kde jsi skončil' });
  await expect(pokracuj).toBeVisible();
  expect((await hrany(page)).obdobi.nahore).toBe(pred);
  // Cestu nabízí hlavní tlačítko; v řádku zůstane jen naposledy čtená stránka.
  await expect(page.locator('[data-zacatek-tlacitko]')).toHaveAttribute('href', `${CESTA}4/`);
  await expect(pokracuj.getByRole('link')).toHaveCount(1);
  await expect(pokracuj.getByRole('link', { name: 'Sókratés' })).toHaveAttribute('href', '/osobnost/sokrates/');
  // Nevypadá jako druhé tlačítko: bez výplně a bez rámečku, hlavní tlačítko je na stránce jediné.
  const vzhled = await pokracuj.getByRole('link').evaluate((a) => {
    const s = getComputedStyle(a);
    return { pozadi: s.backgroundColor, okraj: s.borderTopWidth };
  });
  expect(vzhled).toEqual({ pozadi: 'rgba(0, 0, 0, 0)', okraj: '0px' });
  await expect(page.locator('main .tlacitko--hlavni')).toHaveCount(1);
  // Dotykový cíl odkazu aspoň 44 px.
  expect((await pokracuj.getByRole('link').boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});

test('Domů: celý úvod jde projít klávesnicí ve smysluplném pořadí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('[data-zacatek-tlacitko]').focus();
  await expect(page.locator('[data-zacatek-tlacitko]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.uvod').getByRole('link', { name: 'Poznat Sókrata' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.prvni-cesta')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA}1/`);
});
