// Stoický týden (/tyden/stoicky/, větev stoicky-tyden, krok K): sedm dnů, jeden otevřený, Hotovo a zrušení,
// přeskočení dne, psaní ve dni 7, deník po obnovení, vstupy z cest, portrétů a deníku, zastavení v katalogu hodin
// a promítání, které do deníku studenta nic nezapíše. Logiku hlídá tests/data/tydny.test.ts.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ADRESA = '/tyden/stoicky/';
const den = (page: Page, n: number) => page.locator(`#den-${n}`);
const hlava = (page: Page, n: number) => den(page, n).locator('.den__tl');
const ulozeny = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? 'null'));

async function otevri(page: Page, adresa = ADRESA) {
  await page.goto(adresa);
  await page.waitForSelector('astro-island[component-url*="Tyden"]:not([ssr])', { state: 'attached' });
}

test('stránka: námitka, pravidla, sedm dnů, první otevřený; žádné série, procenta ani pořadí', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await otevri(page);
  await expect(page.locator('h1')).toHaveText('Stoický týden');
  await expect(page.locator('.namitka')).toContainText('Česky se „stoicky“ říká tomu, co člověk snese bez hnutí');
  await expect(page.locator('.tyden__hlava .citat')).toContainText('Nemám být bez citu jako socha.');
  await expect(page.locator('.pravidla')).toContainText('Kterýkoli den můžeš přeskočit a kdykoli přestat, nic se nepočítá.');
  await expect(page.locator('.den')).toHaveCount(7);
  await expect(hlava(page, 1)).toHaveAttribute('aria-expanded', 'true');
  for (const n of [2, 3, 4, 5, 6, 7]) {
    await expect(hlava(page, n)).toHaveAttribute('aria-expanded', 'false');
    await expect(den(page, n).locator('.den__obsah')).toBeHidden();
  }
  // U každého dne mez, v otevřeném Hotovo a Další den.
  await expect(den(page, 1).locator('.den__mez')).toContainText('Kdy přestat');
  await expect(den(page, 1).getByRole('button', { name: 'Hotovo', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(den(page, 1).getByRole('button', { name: 'Další den' })).toBeVisible();
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/%|série|přerušil|bod[ůy]\b|žebříč/i);
  // Telefon: bez vodorovného posouvání, cíle aspoň 44 px.
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const b of await page.locator('.tyden button').all()) {
    if (!(await b.isVisible())) continue;
    const r = (await b.boundingBox())!;
    expect(r.height).toBeGreaterThanOrEqual(44);
    expect(r.width).toBeGreaterThanOrEqual(44);
  }
});

test('Hotovo a zrušení: značka v hlavičce, deník po obnovení, příště se otevře další den', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await otevri(page);
  const hotovo = den(page, 1).getByRole('button', { name: 'Hotovo', exact: true });
  await hotovo.click();
  await expect(hotovo).toHaveAttribute('aria-pressed', 'true');
  await expect(hlava(page, 1)).toContainText('hotovo');
  await expect(page.getByRole('status').filter({ hasText: 'Den 1 je hotový.' })).toBeAttached();
  // Hotový den týden přijme do deníku: výzva a hotové dny bez dat.
  let d = await ulozeny(page);
  expect(d.verze).toBe(1);
  expect(d.vyzvy.map((v: { id: string }) => v.id)).toEqual(['tyden-stoicky']);
  expect(d.tydny.stoicky).toMatchObject({ hotove: [1], den: 2 });
  await expect(page.getByText('Týden je v tvém deníku. Začni, kdy chceš.')).toBeVisible();

  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Tyden"]:not([ssr])', { state: 'attached' });
  await expect(hlava(page, 2)).toHaveAttribute('aria-expanded', 'true');
  await expect(hlava(page, 1)).toHaveAttribute('aria-expanded', 'false');
  await expect(hlava(page, 1)).toContainText('hotovo');

  await hlava(page, 1).click();
  await expect(hlava(page, 1)).toHaveAttribute('aria-expanded', 'true');
  await expect(hlava(page, 2)).toHaveAttribute('aria-expanded', 'false');
  await den(page, 1).getByRole('button', { name: 'Hotovo', exact: true }).click();
  await expect(den(page, 1).getByRole('button', { name: 'Hotovo', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(hlava(page, 1)).not.toContainText('hotovo');
  d = await ulozeny(page);
  expect(d.tydny.stoicky).toMatchObject({ hotove: [], den: 1 });
});

test('přeskočení dne: Další den otevře další bez značky a fokus jde na jeho hlavičku', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevri(page);
  await den(page, 1).getByRole('button', { name: 'Další den' }).click();
  await expect(hlava(page, 2)).toHaveAttribute('aria-expanded', 'true');
  await expect(hlava(page, 2)).toBeFocused();
  await expect(hlava(page, 1)).not.toContainText('hotovo');
  // Nepřijatý týden se přeskočením do deníku nezapíše.
  expect(await ulozeny(page)).toBeNull();

  await page.getByRole('button', { name: 'Přijmout týden' }).click();
  await den(page, 2).getByRole('button', { name: 'Další den' }).click();
  await den(page, 3).getByRole('button', { name: 'Hotovo', exact: true }).click();
  const d = await ulozeny(page);
  expect(d.tydny.stoicky).toMatchObject({ hotove: [3], den: 4 });
  // Přeskočené dny 1 a 2 se nikde nepočítají; poslední den Další den nemá.
  await hlava(page, 7).click();
  await expect(den(page, 7).getByRole('button', { name: 'Další den' })).toHaveCount(0);
});

test('den 7: věta a poznámka se uloží samy, vydrží obnovení a deník je ukáže s počtem hotových dnů', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await otevri(page, `${ADRESA}#den-7`);
  await expect(hlava(page, 7)).toHaveAttribute('aria-expanded', 'true');
  await page.getByLabel('Věta, kterou si necháš').fill('Vstáváš k práci člověka.');
  await page.getByLabel('Který den ti pomohl a který ne').fill('Pomohl mi čtvrtý den.');
  await expect(page.getByText('Uloženo v deníku.')).toBeVisible();
  await den(page, 7).getByRole('button', { name: 'Hotovo', exact: true }).click();

  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Tyden"]:not([ssr])', { state: 'attached' });
  await hlava(page, 7).click();
  await expect(page.getByLabel('Věta, kterou si necháš')).toHaveValue('Vstáváš k práci člověka.');
  await expect(page.getByLabel('Který den ti pomohl a který ne')).toHaveValue('Pomohl mi čtvrtý den.');

  await page.goto('/denik/');
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  const radek = page.locator('li', { has: page.getByRole('link', { name: 'Stoický týden' }) });
  await expect(radek).toContainText('Hotové dny: 1 ze 7');
  await expect(radek).toContainText('Vstáváš k práci člověka.');
  await expect(radek).toContainText('Pomohl mi čtvrtý den.');
  await expect(page.locator('#denik-tydny')).toHaveCount(0);
  expect(await radek.innerText()).not.toMatch(/%/);
});

test('deník bez přijatého týdne ho nabídne tiše jako odkaz; prázdný deník taky', async ({ page }) => {
  await page.goto('/denik/');
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  const nabidka = page.locator('.seznam--tydny');
  await expect(nabidka.getByRole('link', { name: 'Stoický týden' })).toHaveAttribute('href', ADRESA);
  await expect(nabidka).toContainText('Na každý den jedno krátké stoické cvičení. Začni, až budeš chtít.');
});

test('klávesnice: Tab na hlavičku dne, Enter ho otevře, mezerník označí Hotovo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevri(page);
  await hlava(page, 2).focus();
  await page.keyboard.press('Enter');
  await expect(hlava(page, 2)).toHaveAttribute('aria-expanded', 'true');
  const hotovo = den(page, 2).getByRole('button', { name: 'Hotovo', exact: true });
  await hotovo.focus();
  await page.keyboard.press('Space');
  await expect(hotovo).toHaveAttribute('aria-pressed', 'true');
  // Rámeček fokusu jen při klávesnici.
  expect(await hotovo.evaluate((e) => e.matches(':focus-visible'))).toBe(true);
});

for (const rezim of ['light', 'dark'] as const) {
  for (const sirka of [375, 1440]) {
    test(`axe a rozvržení · ${sirka} px · ${rezim}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await otevri(page, `${ADRESA}#den-7`);
      await den(page, 7).getByRole('button', { name: 'Hotovo', exact: true }).click();
      const axe = await new AxeBuilder({ page }).include('.tyden').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}

test('promítání: Hotovo ani přijetí nezapíšou nic do deníku studenta', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('atlas-denik-promitani', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} }));
  });
  await otevri(page);
  await page.getByRole('button', { name: 'Přijmout týden' }).click();
  await den(page, 1).getByRole('button', { name: 'Hotovo', exact: true }).click();
  expect(await ulozeny(page)).toBeNull();
});

test('vstupy: karta týdne na posledním kroku a v Kam dál cest 5, 33 a 34, Kam dál portrétů Seneky, Epiktéta a Marca; zastavení v katalogu hodin', async ({ page }) => {
  for (const [c, posledni] of [['co-mam-ve-svych-rukou', 8], ['co-kdyz-prijde-to-nejhorsi', 8], ['kam-mi-mizi-cas', 8]] as const) {
    // Poslední krok: karta stojí pod závěrečným pravidlem, se sedmi dny a odkazem na týden.
    await page.goto(`/cesta/${c}/${posledni}/`);
    const karta = page.locator('.tyden-karta');
    await expect(karta).toHaveCount(1);
    await expect(karta.getByRole('heading', { name: 'Stoický týden' })).toBeVisible();
    await expect(karta.locator('.tyden-karta__dny a')).toHaveCount(7);
    await expect(karta.locator('.tyden-karta__dny a').nth(2)).toHaveAttribute('href', `${ADRESA}#den-3`);
    await expect(karta.getByRole('link', { name: 'Otevřít stoický týden' })).toHaveAttribute('href', ADRESA);
    const [obsah, kartaY] = await Promise.all([page.locator('.krok__obsah').boundingBox(), karta.boundingBox()]);
    expect(kartaY!.y).toBeGreaterThanOrEqual(obsah!.y + obsah!.height - 1);
    // Předchozí krok kartu nemá; přehled ji má v Kam dál, kam vede Dokončit cestu.
    await page.goto(`/cesta/${c}/${posledni - 1}/`);
    await expect(page.locator('.tyden-karta')).toHaveCount(0);
    await page.goto(`/cesta/${c}/`);
    await expect(page.locator('#hotovo .tyden-karta').getByRole('heading', { level: 3, name: 'Stoický týden' })).toBeVisible();
  }
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/7/');
  await expect(page.locator('.tyden-karta')).toHaveCount(0);
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(page.locator(`#hotovo a[href^="${ADRESA}"]`)).toHaveCount(0);
  for (const o of ['seneca', 'epiktetos', 'marcus-aurelius']) {
    await page.goto(`/osobnost/${o}/`);
    await expect(page.locator(`.kamdal a[href="${ADRESA}"]`)).toContainText('Stoický týden');
  }
  const katalog = await (await page.request.get('/hodina/katalog.json')).json();
  expect(katalog.zastaveni.find((z: { id: string }) => z.id === 't:stoicky')).toMatchObject({ druh: 'tyden', adresa: ADRESA, kotva: null });
});

for (const rezim of ['light', 'dark'] as const) {
  for (const sirka of [375, 1440]) {
    test(`karta týdne na posledním kroku · ${sirka} px · ${rezim}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto('/cesta/kam-mi-mizi-cas/8/');
      const axe = await new AxeBuilder({ page }).include('.tyden-karta').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      for (const a of await page.locator('.tyden-karta a').all()) expect((await a.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    });
  }
}
