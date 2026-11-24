// Co ti zůstalo? (denik-v2, K2): kvíz pod přehledem Tvoje antika. Průchod kolem klávesnicí, rub Víš / Zopakuj si
// s odkazem zpět, konec kola bez počtu, Dát do kartiček, Nové kolo, obnovení stránky, pozvánka, čtečka a pohyb.
// Skládání a výběr hlídá tests/data/zustalo.test.ts; tady skutečná stránka.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const T = '2026-11-20T10:00:00.000Z';
const krokyCest = { 'kolik-je-dost': 7, 'co-mam-ve-svych-rukou': 8 } as const;
/** Student prošel dvě cesty a jejich stránky velkých otázek. */
export const PROSLE_DVE = JSON.stringify({
  verze: 1, zapisy: [], vyzvy: [], bloky: {}, aktivita: [],
  navstivene: [
    { odkaz: '/otazka/jak-zit/', nazev: 'Jak mám žít?', kdy: T },
    { odkaz: '/otazka/jsem-svobodny/', nazev: 'Jsem svobodný?', kdy: T },
  ],
  cesty: Object.fromEntries(Object.entries(krokyCest).map(([slug, pocet]) => [slug, { nazev: slug, pocet, krok: pocet, navstivene: Array.from({ length: pocet }, (_, i) => i + 1), kdy: T, dokonceno: T }])),
});
const KLIC = 'co-ti-zustalo/antika';

async function otevri(page: Page, obsah: string | null) {
  await page.goto('/denik/antika/');
  await page.evaluate((t) => (t === null ? localStorage.removeItem('atlas-denik') : localStorage.setItem('atlas-denik', t)), obsah);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="CoTiZustalo"]:not([ssr])', { state: 'attached' });
}
const kviz = (page: Page) => page.locator('#co-ti-zustalo');
const stav = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').bloky?.[k], KLIC);

/** Odpoví klávesnicí: tabulátorem na první možnost a Enter; vrátí, co rub řekl. */
async function odpovezKlavesnici(page: Page): Promise<string> {
  const prvni = kviz(page).locator('.zustalo__moznost').first();
  await prvni.focus();
  await page.keyboard.press('Enter');
  const rub = kviz(page).locator('.blok__vazba');
  await expect(rub).toBeFocused();
  return (await rub.locator('.zustalo__slovo').textContent()) ?? '';
}

test('prázdný deník: místo kvízu pozvánka do první nedokončené cesty', async ({ page }) => {
  await otevri(page, null);
  await expect(kviz(page).getByRole('heading', { level: 2 })).toHaveText('Co ti zůstalo?');
  await expect(kviz(page).locator('.zustalo__pozvanka')).toBeVisible();
  await expect(kviz(page).getByRole('link', { name: /Projdi cestu Kdy mám dobrý důvod věřit\?/ })).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(kviz(page).locator('.zustalo__moznost')).toHaveCount(0);
});

test('průchod kolem klávesnicí: jedna odpověď, rub s odkazem zpět, konec bez počtu, kartičky a nové kolo', async ({ page }) => {
  await otevri(page, PROSLE_DVE);
  const postup = kviz(page).locator('.zustalo__postup');
  await expect(postup).toHaveText(/^Otázka 1 z\s\d$/);
  const n = Number((await postup.textContent())!.match(/z\s(\d)/)![1]);
  expect(n).toBeGreaterThanOrEqual(4);
  expect(n).toBeLessThanOrEqual(8);

  const druhy: string[] = [];
  const slova: string[] = [];
  for (let i = 0; i < n; i++) {
    await expect(postup).toHaveText(new RegExp(`^Otázka ${i + 1} z\\s${n}$`));
    druhy.push((await kviz(page).locator('.blok__nadtitulek, .t-nadtitulek').first().textContent())!.trim());
    await expect(kviz(page).locator('.zustalo__moznost')).toHaveCount(3);
    const slovo = await odpovezKlavesnici(page);
    slova.push(slovo);
    expect(['Víš.', 'Zopakuj si.']).toContain(slovo);
    // Po odpovědi už se volit nedá; správná má značku, zvolená je vtlačená, odkaz zpět vede na místo z deníku.
    await expect(kviz(page).locator('.zustalo__moznost')).toHaveCount(0);
    await expect(kviz(page).locator('.zustalo__hotova--spravna')).toHaveCount(1);
    await expect(kviz(page).locator('.zustalo__hotova--zvolena')).toHaveCount(1);
    await expect(kviz(page).locator('.zustalo__vysvetleni')).not.toBeEmpty();
    const zpet = kviz(page).locator('.zustalo__zpet a');
    await expect(zpet).toHaveAttribute('href', /^\/(cesta\/(kolik-je-dost|co-mam-ve-svych-rukou)\/\d+|otazka\/(jak-zit|jsem-svobodny))\/$/);
    if (i === 1) {
      // Obnovení stránky: tatáž otázka s rubem.
      await page.reload();
      await page.waitForSelector('astro-island[component-url*="CoTiZustalo"]:not([ssr])', { state: 'attached' });
      await expect(postup).toHaveText(new RegExp(`^Otázka 2 z\\s${n}$`));
      await expect(kviz(page).locator('.zustalo__slovo')).toHaveText(slovo);
    }
    const dalsi = kviz(page).getByRole('button', { name: i === n - 1 ? 'Konec kola' : 'Další otázka' });
    await dalsi.focus();
    await page.keyboard.press('Enter');
  }
  for (let i = 1; i < druhy.length; i++) expect(druhy[i], druhy.join(' · ')).not.toBe(druhy[i - 1]);

  // Konec kola: žádný počet, seznam toho, co zopakovat, a odkazy zpět.
  const konec = kviz(page).locator('.zustalo__konec');
  await expect(konec).toBeFocused();
  await expect(kviz(page)).not.toContainText(/\d+\s*z\s*\d+|%|bod[ůy]?\b|skóre/);
  const zopakovat = slova.filter((s) => s === 'Zopakuj si.').length;
  await expect(kviz(page).locator('.zustalo__zopakuj li')).toHaveCount(zopakovat);
  if (zopakovat) {
    await expect(konec).toHaveText('Tohle si zopakuj');
    await kviz(page).getByRole('button', { name: 'Dát do kartiček' }).click();
    await expect(kviz(page).locator('.zustalo__ulozeno')).toHaveText(/V kartičkách/);
    await expect(kviz(page).getByRole('button', { name: 'Nové kolo' })).toBeFocused();
    const karticky = await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem('atlas-denik')!).karticky ?? {}) as { zdroj: string }[]);
    expect(karticky).toHaveLength(zopakovat);
    expect(karticky.every((k) => k.zdroj === 'zustalo')).toBe(true);
  } else {
    await expect(konec).toHaveText('Z tohohle kola ti zůstalo všechno.');
  }

  const prvniKolo = (await stav(page)).poradi;
  await kviz(page).getByRole('button', { name: 'Nové kolo' }).click();
  await expect(postup).toBeFocused();
  await expect(postup).toHaveText(/^Otázka 1 z\s\d$/);
  const druhe = await stav(page);
  expect(druhe.kolo).toBe(2);
  expect(druhe.poradi).not.toEqual(prvniKolo);
});

test('hlas: po odpovědi stojí u každé možnosti, kdo ji říká; u zvolené cizí odpovědi to slyší i čtečka', async ({ page }) => {
  const poradi = ['hlas:jsem-svobodny:aristoteles', 'hlas:jsem-svobodny:epikuros', 'hlas:jak-zit:epikuros', 'hlas:jak-zit:aristoteles'];
  const d = JSON.parse(PROSLE_DVE);
  d.bloky[KLIC] = { kolo: 1, poradi, pozice: 0, odpovedi: {}, volby: {} };
  await otevri(page, JSON.stringify(d));
  await expect(kviz(page).locator('h3[id$="-zadani"]')).toHaveText('Co by ti na to řekl Aristotelés?');
  // Před odpovědí jména nejsou.
  await expect(kviz(page).locator('.zustalo__kdo')).toHaveCount(0);
  await expect(kviz(page).locator('.zustalo__moznosti')).not.toContainText('Epikúros');
  await kviz(page).locator('.zustalo__moznost').filter({ hasNotText: /^Může\. Výbušným/ }).first().click();
  const kdo = kviz(page).locator('.zustalo__kdo');
  await expect(kdo).toHaveCount(3);
  expect((await kdo.allTextContents()).map((t) => t.trim())).toContain('Aristotelés');
  // Blízký hlas (Epikúros: chvála a trest předpokládají, že je to na nás) mezi možnostmi není.
  expect((await kdo.allTextContents()).map((t) => t.trim())).not.toContain('Epikúros');
  await expect(kviz(page).locator('.zustalo__hotova--spravna .zustalo__kdo')).toHaveText('Aristotelés');
  const zvolena = kviz(page).locator('.zustalo__hotova--zvolena');
  const jmeno = (await zvolena.locator('.zustalo__kdo').textContent())!.trim();
  await expect(zvolena.locator('.zustalo__kdo')).toHaveAttribute('aria-hidden', 'true');
  await expect(zvolena.locator('.vizualne-skryte')).toHaveText(` (tvoje odpověď, takhle by odpověděl ${jmeno})`);
});

test('Začít znovu smaže odpovědi kola', async ({ page }) => {
  await otevri(page, PROSLE_DVE);
  await odpovezKlavesnici(page);
  await kviz(page).getByRole('button', { name: 'Začít znovu' }).click();
  await expect(kviz(page).locator('.zustalo__postup')).toHaveText(/^Otázka 1 z/);
  await expect(kviz(page).locator('.zustalo__moznost')).toHaveCount(3);
  expect(await stav(page)).toBeUndefined();
});

test('čtečka: zadání pojmenuje možnosti, rub je živá oblast, axe bez nálezů ve světlém i tmavém režimu', async ({ page }) => {
  await otevri(page, PROSLE_DVE);
  await expect(kviz(page).getByRole('list', { name: await kviz(page).locator('h3').first().textContent() as string })).toBeVisible();
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    const a = await new AxeBuilder({ page }).include('#co-ti-zustalo').analyze();
    expect(a.violations, scheme).toEqual([]);
  }
  await odpovezKlavesnici(page);
  const rub = kviz(page).locator('.blok__vazba');
  await expect(rub).toHaveAttribute('aria-live', 'polite');
  await expect(kviz(page).locator('.zustalo__hotova--zvolena .vizualne-skryte').first()).toHaveText(/tvoje odpověď/);
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    const a = await new AxeBuilder({ page }).include('#co-ti-zustalo').analyze();
    expect(a.violations, scheme).toEqual([]);
  }
});

test('omezený pohyb: po odpovědi se nic nehýbe; na telefonu nic nepřetéká a cíle mají 44 px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await otevri(page, PROSLE_DVE);
  const moznosti = kviz(page).locator('.zustalo__moznost');
  for (const b of await moznosti.all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await odpovezKlavesnici(page);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const bezi = await page.evaluate(() => document.getAnimations().filter((a) => {
    const t = a.effect?.getComputedTiming();
    return a.playState === 'running' && Number(t?.duration ?? 0) > 1;
  }).length);
  expect(bezi).toBe(0);
  const sirka = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sirka).toBeLessThanOrEqual(390);
});

test('dílna: ukázka s připraveným deníkem i bez deníku studenta', async ({ page }) => {
  await page.goto('/dilna/bloky/');
  await page.evaluate(() => localStorage.removeItem('atlas-denik'));
  await page.reload();
  const u = page.locator('#co-ti-zustalo-dilna');
  await u.scrollIntoViewIfNeeded();
  await page.waitForSelector('astro-island[component-url*="CoTiZustalo"]:not([ssr])', { state: 'attached' });
  await expect(u.locator('.zustalo__postup')).toHaveText(/^Otázka 1 z\s\d$/);
  await u.locator('.zustalo__moznost').first().click();
  await expect(u.locator('.zustalo__slovo')).toHaveText(/^(Víš\.|Zopakuj si\.)$/);
  const ulozeno = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('atlas-denik')!).bloky));
  expect(ulozeno).toEqual(['co-ti-zustalo/dilna']);
});
