// Vystřižené citáty (denik-v2, K4): nůžky na nových místech (hry po odkrytí, kompaktní citát, den týdne), plná
// sbírka, stránka Moje sbírka (pořadí, páska jen jednou, papír období, poznámka klávesnicí, Do kartiček, Vyndat ze
// sbírky, stažený text, tisková podoba), odkaz z kapitoly deníku, axe a přetečení na 390 a 1440 px ve dne i v noci.
// Text sbírky hlídá i tests/data/sbirka.test.ts; snímky scripts/snimky-sbirka.mjs.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Deník = Record<string, unknown>;
const DENIK = JSON.parse(readFileSync(join(import.meta.dirname, 'data/sbirka.json'), 'utf8'))['atlas-denik'] as Deník;
const PRAZDNY: Deník = { verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} };
const ZAPSAL = 'atlas-denik';

async function otevri(page: Page, adresa: string, obsah: Deník | null) {
  await page.goto(adresa);
  await page.evaluate(([k, t]) => (t === null ? localStorage.removeItem(k!) : localStorage.setItem(k!, t)), [ZAPSAL, obsah === null ? null : JSON.stringify(obsah)]);
  await page.reload();
}
const ulozeny = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? '{}'), ZAPSAL);
const nuzky = (l: Locator) => l.locator('[data-vystrihnout]');

async function priprav(page: Page, id: string, ostrov: string): Promise<Locator> {
  const blok = page.locator(`[id="${id}"]`);
  await blok.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator(`astro-island[component-url*="/${ostrov}."]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

test('hry: nůžky až po odkrytí, stejné vystřižení jako u citátu na listu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevri(page, '/dilna/bloky/', null);

  const kdo = await priprav(page, 'dilna-kdo-rekl', 'KdoToRekl');
  await expect(nuzky(kdo)).toHaveCount(0);
  for (let i = 0; i < 4 && !(await kdo.locator('.otocena').count()); i++) await kdo.locator('.razitko-odpoved:not(:disabled)').first().click();
  const n = nuzky(kdo.locator('.otocna__rub'));
  await expect(n).toHaveCount(1);
  await expect(n).toHaveAttribute('aria-pressed', 'false');
  await n.click();
  await expect(n).toHaveAttribute('aria-pressed', 'true');
  const c = (await ulozeny(page)).citaty[0];
  expect(c.id).toBe(await n.getAttribute('data-vystrihnout'));
  expect(c.kde).toMatch(/^[^,]+, .+/);
  expect(c.odkaz).toBe('/dilna/bloky/');

  const doplnit = await priprav(page, 'dilna-doplnit-reka', 'DoplnCitat');
  await expect(nuzky(doplnit)).toHaveCount(0);
  await doplnit.locator('.vystrizek', { hasText: 'týchž' }).click();
  await expect(nuzky(doplnit.getByRole('region', { name: 'Celý citát' }))).toHaveCount(1);

  const pravy = await priprav(page, 'dilna-pravy', 'PravyNeboPodvrzeny');
  await expect(nuzky(pravy)).toHaveCount(0);
  await pravy.locator('.razitko-verdikt--nerekl').click();
  const puvod = pravy.getByRole('region', { name: 'Odkud věta je' });
  await expect(puvod).toBeVisible();
  await expect(nuzky(puvod)).toHaveCount(await puvod.locator('.puvod__citat').count());

  const kdoby = await priprav(page, 'dilna-kdo-by-mene', 'KdoByToRekl');
  await expect(nuzky(kdoby)).toHaveCount(0);
  await kdoby.locator('.razitko-volby').first().click();
  await expect(nuzky(kdoby)).toHaveCount(0);
  await kdoby.getByRole('button', { name: 'Zapsat do deníku' }).click();
  const atlas = kdoby.getByRole('region', { name: 'Atlas by vybral' });
  await expect(nuzky(atlas)).not.toHaveCount(0);
  await expect(nuzky(atlas)).toHaveCount(await atlas.locator('.hlas-herny').count());

  const slabe = await priprav(page, 'dilna-slabe-zapas', 'NajdiSlabeMisto');
  await expect(nuzky(slabe)).toHaveCount(0);
  await slabe.locator('button.veta-arg').first().click();
  await slabe.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(nuzky(slabe.getByRole('region', { name: 'Kdo stál s tebou' }))).not.toHaveCount(0);

  // Nůžky z ostrova po obnovení stránky ví, že citát už ve sbírce je.
  await page.reload();
  const znovu = await priprav(page, 'dilna-kdo-rekl', 'KdoToRekl');
  await expect(nuzky(znovu.locator('.otocna__rub'))).toHaveAttribute('aria-pressed', 'true');
});

test('kompaktní citát a den týdne mají nůžky', async ({ page }) => {
  await otevri(page, '/otazka/jak-zit/', PRAZDNY);
  expect(await page.locator('.hlas .citat--kompaktni [data-vystrihnout]').count()).toBeGreaterThan(0);
  await expect(page.locator('.hlas .citat--kompaktni')).toHaveCount(await page.locator('.hlas .citat--kompaktni [data-vystrihnout]').count());

  await otevri(page, '/tyden/stoicky/', PRAZDNY);
  const namitka = nuzky(page.locator('.tyden__namitka'));
  await expect(namitka).toHaveCount(1);
  await namitka.click();
  await expect(namitka).toHaveAttribute('aria-pressed', 'true');
  expect((await ulozeny(page)).citaty[0].odkaz).toBe('/tyden/stoicky/');
  await page.waitForSelector('astro-island[component-url*="/Tyden."]:not([ssr])', { state: 'attached' });
  await expect(page.locator('.den__citat')).not.toHaveCount(0);
  await expect(page.locator('.den__citat [data-vystrihnout]')).toHaveCount(await page.locator('.den__citat').count());
});

test('plná sbírka: nůžky citát nevystřihnou a řeknou proč', async ({ page }) => {
  const citaty = Array.from({ length: 300 }, (_, i) => ({ id: `x${i}`, text: `Věta ${i}.`, kde: 'Někdo, Dílo 1', odkaz: '/osobnost/sokrates/', kdy: '2026-11-01T10:00:00.000Z' }));
  await otevri(page, '/osobnost/seneca/', { ...PRAZDNY, citaty });
  const n = page.locator('.cisty-list [data-vystrihnout]').first();
  await n.scrollIntoViewIfNeeded();
  await n.focus();
  await page.keyboard.press('Enter');
  await expect(n).toHaveAttribute('aria-pressed', 'false');
  const zprava = page.getByRole('status').filter({ hasText: 'je plná' });
  await expect(zprava).toBeVisible();
  await expect(zprava.getByRole('link', { name: 'Moje sbírka' })).toHaveAttribute('href', '/denik/sbirka/');
  const d = await ulozeny(page);
  expect(d.citaty).toHaveLength(300);
  const id = await n.getAttribute('data-vystrihnout');
  expect(d.citaty.some((c: { id: string }) => c.id === id)).toBe(false);
  // Když se místo uvolní (vyndání jinde), věta zmizí a nůžky zase stříhají.
  await page.evaluate((k) => {
    const x = JSON.parse(localStorage.getItem(k)!);
    x.citaty.pop();
    localStorage.setItem(k, JSON.stringify(x));
    window.dispatchEvent(new CustomEvent('atlas-denik'));
  }, ZAPSAL);
  await page.reload();
  await n.scrollIntoViewIfNeeded();
  await n.click();
  await expect(n).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.nuzky__plna')).toHaveCount(0);
});

test('Moje sbírka: pořadí, páska jednou, poznámka klávesnicí, Do kartiček, Vyndat, text a tisk', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await otevri(page, '/denik/sbirka/', DENIK);
  await page.waitForSelector('astro-island[component-url*="MojeSbirka"]:not([ssr])', { state: 'attached' });
  const listky = page.locator('.vyst-citat');
  await expect(listky).toHaveCount(4);
  expect(await listky.evaluateAll((l) => l.map((e) => (e as HTMLElement).dataset.citat))).toEqual(['obrana-38a', 'seneca-ira-iii-36-otazky', 'rozpravy-i-16-20', 'etika-1156a']);
  await expect(page.locator('.moje-sbirka .paska')).toHaveCount(1);
  await expect(listky.first().locator('.paska')).toHaveCount(1);
  await expect(listky.nth(0)).toHaveClass(/obdobi-\d/);
  await expect(listky.nth(2)).toHaveClass(/bez-obdobi/);
  await expect(listky.nth(0).getByRole('link', { name: 'Platón, Obrana Sókratova 38a' })).toHaveAttribute('href', '/osobnost/sokrates/#myslenky');

  // Poznámka jen klávesnicí: otevřít, napsat, Enter uloží a fokus se vrátí na Přepsat; Escape nic nezmění.
  const prvni = listky.first();
  await prvni.getByRole('button', { name: 'Proč zrovna tenhle?' }).focus();
  await page.keyboard.press('Enter');
  const pole = prvni.getByLabel('Proč zrovna tenhle?', { exact: true });
  await expect(pole).toBeFocused();
  await page.keyboard.type('Zkoumám, co dělám.');
  await page.keyboard.press('Enter');
  await expect(prvni.locator('.vyst-citat__pero')).toHaveText('Zkoumám, co dělám.');
  await expect(prvni.getByRole('button', { name: 'Přepsat: Proč zrovna tenhle?' })).toBeFocused();
  expect((await ulozeny(page)).citaty.find((c: { id: string }) => c.id === 'obrana-38a').poznamka).toBe('Zkoumám, co dělám.');
  await page.keyboard.press('Enter');
  await page.keyboard.type(' Navíc.');
  await page.keyboard.press('Escape');
  await expect(prvni.locator('.vyst-citat__pero')).toHaveText('Zkoumám, co dělám.');
  await page.reload();
  await expect(page.locator('.vyst-citat').first().locator('.vyst-citat__pero')).toHaveText('Zkoumám, co dělám.');

  // Stáhnout jako text.
  const [stazeni] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Stáhnout jako text' }).click()]);
  expect(stazeni.suggestedFilename()).toMatch(/^atlas-citaty-\d{4}-\d{2}-\d{2}\.txt$/);
  const text = readFileSync(await stazeni.path(), 'utf8');
  const radky = text.split('\n');
  expect(radky[0]).toMatch(/^Moje sbírka citátů z Atlasu myšlení \(\d{1,2}\. \d{1,2}\. \d{4}\)$/);
  expect(radky.slice(1, 6)).toEqual(['', '„Život, který nezkoumáme, nestojí za to, aby ho člověk žil.“', 'Platón, Obrana Sókratova 38a', 'Proč zrovna tenhle: Zkoumám, co dělám.', 'https://czempi123.github.io/osobnost/sokrates/#myslenky']);
  expect(text).toContain('Proč zrovna tenhle: Na večer, než usnu.');
  expect(text.match(/Proč zrovna tenhle/g)).toHaveLength(3);

  // Do kartiček a Vyndat ze sbírky: kartička zůstane v deníku, jen schovaná.
  const seneca = page.locator('.vyst-citat[data-citat="seneca-ira-iii-36-otazky"]');
  await seneca.getByRole('button', { name: /^Do kartiček/ }).click();
  await expect(seneca.getByRole('button', { name: /^Do kartiček/ })).toHaveAttribute('aria-pressed', 'true');
  await seneca.getByRole('button', { name: /^Vyndat ze sbírky/ }).click();
  await expect(page.locator('.vyst-citat')).toHaveCount(3);
  const d = await ulozeny(page);
  expect(d.citaty.map((c: { id: string }) => c.id)).not.toContain('seneca-ira-iii-36-otazky');
  expect(Object.keys(d.karticky)).toContain('citat:seneca-ira-iii-36-otazky');

  // Tisková podoba: bez lišt, tlačítek a pásky.
  await page.emulateMedia({ media: 'print' });
  for (const l of [page.locator('header.hlavicka'), page.locator('nav.lista'), page.getByRole('button', { name: 'Vytisknout' }), page.locator('.vyst-citat__akce').first(), page.locator('.moje-sbirka .paska'), page.locator('.citat__nuzky')]) {
    if (await l.count()) await expect(l.first()).toBeHidden();
  }
  await expect(page.locator('.vyst-citat').first()).toBeVisible();
  expect(await page.locator('.vystrizky').evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(2);
});

test('Moje sbírka bez výstřižků a bez localStorage; odkaz z kapitoly deníku', async ({ page }) => {
  await otevri(page, '/denik/sbirka/', PRAZDNY);
  await expect(page.locator('.moje-sbirka')).toContainText('Zatím tu nic není.');
  await expect(page.getByRole('button', { name: 'Stáhnout jako text' })).toHaveCount(0);

  await otevri(page, '/denik/', DENIK);
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await page.locator('details.kapitola').evaluateAll((d) => d.forEach((x) => ((x as HTMLDetailsElement).open = true)));
  const odkazy = page.getByRole('link', { name: 'Celá sbírka' });
  await expect(odkazy.first()).toHaveAttribute('href', '/denik/sbirka/');
  await expect(page.locator('.kapitoly .paska')).toHaveCount(0);

  const druha = await page.context().newPage();
  await druha.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } }); });
  const chyby: string[] = [];
  druha.on('pageerror', (e) => chyby.push(e.message));
  await druha.goto('/denik/sbirka/');
  await expect(druha.locator('.moje-sbirka')).toContainText('Zatím tu nic není.');
  expect(chyby).toEqual([]);
  await druha.close();
});

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Moje sbírka: axe, 44 px a přetečení · ${sirka} · ${rezim}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka > 1000 ? 900 : 844 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await otevri(page, '/denik/sbirka/', DENIK);
      await page.waitForSelector('astro-island[component-url*="MojeSbirka"]:not([ssr])', { state: 'attached' });
      await axe(page, '.moje-sbirka');
      await page.locator('.vyst-citat').nth(2).getByRole('button', { name: 'Proč zrovna tenhle?' }).click();
      await axe(page, '.moje-sbirka');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      const male = await page.locator('.moje-sbirka button').evaluateAll((b) => b.filter((x) => x.getBoundingClientRect().height < 44).map((x) => x.textContent?.trim()));
      expect(male).toEqual([]);
    });
  }
}
