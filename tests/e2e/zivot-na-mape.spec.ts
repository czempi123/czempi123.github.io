// Život na mapě (interaktivita-v2, K2): zastávky v kartě člověka, Předchozí a Další zastávka, Přehrát a Zastavit,
// co přehrávání zastaví, adresa a historie, oblast aria-live, omezený pohyb, odkaz ze stránky osoby, člověk bez
// zastávek, klávesnice, axe a snímky na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await page.waitForSelector('.mapa svg.podklad path.sit', { state: 'attached' });
  await page.waitForTimeout(250);
}
/** Přehrávání zkrácené pro testy (celý život za `delka` ms, na zastávce `zastaveni` ms). */
const zkratit = (page: Page, delka: number, zastaveni: number) =>
  page.addInitScript(([d, z]) => ((window as unknown as { atlasPrehravani: object }).atlasPrehravani = { delka: d, zastaveni: z }), [delka, zastaveni]);

const zivot = (page: Page) => page.locator('section.zivot');
const zastavky = (page: Page) => zivot(page).getByRole('list', { name: 'Zastávky života' }).getByRole('button');
const rok = (page: Page) => page.getByRole('slider', { name: 'Rok' });
const prehrat = (page: Page) => page.locator('#zivot-prehrat');
/** Text prvku s nezlomitelnými mezerami převedenými na obyčejné. */
const text = async (l: ReturnType<Page['locator']>) => ((await l.textContent()) ?? '').replaceAll('\u00a0', ' ').replace(/\s+/g, ' ').trim();

test('život na mapě: zastávky Aristotela, klepnutí na zastávku, Předchozí a Další', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-360&osoba=aristoteles');
  await pripravit(page);
  await expect(zivot(page).getByRole('heading', { name: 'Život na mapě' })).toBeVisible();
  await expect(zastavky(page)).toHaveCount(8);
  await expect(zastavky(page).nth(0)).toContainText('Stageira');
  await expect.poll(() => text(zastavky(page).nth(0))).toContain('rodiště · 384 př. n. l. · narodil se');
  // Přibližný pobyt nese „asi“ u roku i u věku, návrat do rodiště je „zpátky doma“ (revize interaktivita-v2, R).
  await expect.poll(() => text(zastavky(page).nth(2))).toContain('pobyt · asi 347 př. n. l. · asi 37 let');
  await expect.poll(() => text(zastavky(page).nth(5))).toContain('zpátky doma · asi 340 př. n. l. · asi 44 let');
  // V roce 360 je v Athénách u Platóna.
  await expect(zastavky(page).nth(1)).toHaveAttribute('aria-current', 'step');

  await zastavky(page).nth(2).click();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-347');
  await expect(page).toHaveURL(/rok=-347&osoba=aristoteles/);
  await expect(zastavky(page).nth(2)).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('.box__misto')).toContainText('Assos');
  await expect.poll(() => text(zivot(page).locator('[aria-live]'))).toBe('Assos, asi 347 př. n. l., asi 37 let.');

  await page.getByRole('button', { name: 'Další zastávka' }).click();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-345');
  await page.getByRole('button', { name: 'Předchozí zastávka' }).click();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-347');
  // Každý skok na zastávku je záznam v historii.
  await page.goBack();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-345');

  // Na začátku života Předchozí nic nedělá a fokus z něj nezmizí.
  await zastavky(page).nth(0).click();
  const pred = page.getByRole('button', { name: 'Předchozí zastávka' });
  await expect(pred).toHaveAttribute('aria-disabled', 'true');
  await pred.focus();
  await page.keyboard.press('Enter');
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-384');
  await expect(pred).toBeFocused();
  // Při omezeném pohybu tlačítko Přehrát chybí.
  await expect(prehrat(page)).toHaveCount(0);
});

test('život na mapě: pobyt jen s „do“ (Epiktétos v Římě do 93) je zastávka bez roku a mapa ho tam ukazuje', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=80&osoba=epiktetos');
  await pripravit(page);
  await expect(zastavky(page)).toHaveCount(3);
  await expect.poll(() => text(zastavky(page).nth(1))).toBe('Řím pobyt');
  await expect(zastavky(page).nth(1)).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('.box__misto')).toContainText('Řím');
  await expect.poll(() => text(zastavky(page).nth(2))).toContain('působení · asi 93 n. l. · asi 38 let');
});

test('život na mapě: klávesnice v seznamu zastávek, Další přes přelom letopočtu (Seneca)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-1&osoba=seneca');
  await pripravit(page);
  // Corduba → Řím (pobyt jen s „do“, od osmnácti) → Korsika → Řím.
  await expect(zastavky(page)).toHaveCount(4);
  // Seznam je jedna zastávka tabulátoru: fokus má jen aktuální zastávka, šipky přesouvají fokus.
  await expect(zastavky(page).nth(0)).toHaveAttribute('tabindex', '0');
  await expect(zastavky(page).nth(1)).toHaveAttribute('tabindex', '-1');
  await zastavky(page).nth(0).focus();
  await page.keyboard.press('ArrowDown');
  await expect(zastavky(page).nth(1)).toBeFocused();
  await page.keyboard.press('End');
  await expect(zastavky(page).nth(3)).toBeFocused();
  await page.keyboard.press('Home');
  await expect(zastavky(page).nth(0)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '18');
  // Ovládání stojí nad seznamem: Shift+Tab vede ze seznamu na Další, pak na Předchozí.
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Další zastávka' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Předchozí zastávka' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-1');
  await page.getByRole('button', { name: 'Další zastávka' }).click();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '18');
});

test('život na mapě: Přehrát projede život, na konci stojí rok smrti a přibude jeden záznam historie', async ({ page }) => {
  await zkratit(page, 1500, 150);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/mapa/?rok=-384&osoba=aristoteles');
  await pripravit(page);
  const delkaHistorie = await page.evaluate(() => history.length);
  // Zaznamená roky, kterými přehrávání projde.
  await page.evaluate(() => {
    const w = window as unknown as { roky: string[] };
    w.roky = [];
    const s = document.querySelector('[role="slider"][aria-label="Rok"]')!;
    new MutationObserver(() => w.roky.push(s.getAttribute('aria-valuenow')!)).observe(s, { attributes: true, attributeFilter: ['aria-valuenow'] });
  });
  await prehrat(page).click();
  await expect(prehrat(page)).toHaveText('Zastavit');
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-322', { timeout: 8000 });
  await expect(prehrat(page)).toHaveText('Přehrát');
  await expect(page.locator('#karta-jmeno')).toHaveText('Aristotelés');
  await expect.poll(() => text(zivot(page).locator('[aria-live]'))).toBe('Chalkis, 322 př. n. l., 62 let, zemřel tu.');
  await expect(page).toHaveURL(/rok=-322&osoba=aristoteles$/);
  expect(await page.evaluate(() => history.length)).toBe(delkaHistorie + 1);
  const roky = (await page.evaluate(() => (window as unknown as { roky: string[] }).roky)).map(Number);
  // Rok jen roste a projde všemi zastávkami.
  for (let i = 1; i < roky.length; i++) expect(roky[i]).toBeGreaterThanOrEqual(roky[i - 1]);
  for (const r of [-367, -347, -345, -343, -340, -335]) expect(roky).toContain(r);
  // Zpět vrátí rok před přehráním.
  await page.goBack();
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-384');
  await expect(page.locator('#karta-jmeno')).toHaveText('Aristotelés');
});

test('život na mapě: posuvník, výběr jiného člověka i zavření karty přehrávání zastaví', async ({ page }) => {
  await zkratit(page, 60_000, 500);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/mapa/?rok=-384&osoba=aristoteles');
  await pripravit(page);
  const stoji = async () => {
    const a = await rok(page).getAttribute('aria-valuenow');
    await page.waitForTimeout(1200);
    expect(await rok(page).getAttribute('aria-valuenow')).toBe(a);
  };

  // Zastavit
  await prehrat(page).click();
  await expect.poll(async () => Number(await rok(page).getAttribute('aria-valuenow')), { timeout: 5000 }).toBeGreaterThan(-384);
  await prehrat(page).click();
  await expect(prehrat(page)).toHaveText('Přehrát');
  await stoji();
  const zastaveno = Number(await rok(page).getAttribute('aria-valuenow'));
  await expect(page).toHaveURL(new RegExp(`rok=${zastaveno}&`));
  // Přehrát pokračuje, kde přehrávání stálo.
  await prehrat(page).click();
  await page.waitForTimeout(300);
  expect(Number(await rok(page).getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(zastaveno);

  // Zásah do posuvníku
  await rok(page).focus();
  await page.keyboard.press('ArrowRight');
  await expect(prehrat(page)).toHaveText('Přehrát');
  await stoji();

  // Výběr jiného člověka (ze vztahů v kartě)
  await prehrat(page).click();
  await expect(prehrat(page)).toHaveText('Zastavit');
  await page.locator('.vztahy').getByRole('button', { name: 'Platón', exact: true }).first().click();
  await expect(page.locator('#karta-jmeno')).toHaveText('Platón');
  await stoji();

  // Zavření karty
  await page.goto('/mapa/?rok=-384&osoba=aristoteles');
  await pripravit(page);
  await prehrat(page).click();
  await expect(prehrat(page)).toHaveText('Zastavit');
  await page.getByRole('button', { name: 'Zavřít kartu' }).click();
  await expect(page.locator('#karta-jmeno')).toHaveCount(0);
  await stoji();
});

test('život na mapě: odkaz ze stránky osoby otevře mapu v roce narození s fokusem na Přehrát a nic nespustí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/aristoteles/');
  const odkaz = page.getByRole('link', { name: 'Přehrát život na mapě' });
  await expect(odkaz).toHaveAttribute('href', '/mapa/?rok=-384&osoba=aristoteles&zivot=1');
  await odkaz.click();
  await pripravit(page);
  await expect(page.locator('#zivot-prehrat')).toBeFocused();
  await expect(page.locator('#karta-jmeno')).toHaveText('Aristotelés');
  // Příznak z adresy zmizí, aby obnovení stránky fokus nepřesouvalo znovu.
  await expect(page).toHaveURL(/\/mapa\/\?rok=-384&osoba=aristoteles$/);
  await page.waitForTimeout(800);
  await expect(rok(page)).toHaveAttribute('aria-valuenow', '-384');
  await expect(prehrat(page)).toHaveText('Přehrát');
  // Mezerník na tlačítku s fokusem přehrávání spustí.
  await page.keyboard.press('Space');
  await expect(prehrat(page)).toHaveText('Zastavit');
});

test('život na mapě: odkaz při omezeném pohybu dá fokus na Další zastávka; telefon otevře kartu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-280&osoba=chrysippos&zivot=1');
  await pripravit(page);
  await expect(page.getByRole('tab', { name: /Člověk: Chrýsippos/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#zivot-dalsi')).toBeFocused();
  await expect(page.locator('#zivot-prehrat')).toHaveCount(0);
});

test('život na mapě: člověk s jediným místem oddíl ani odkaz nemá', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/mapa/?rok=-500&osoba=herakleitos');
  await pripravit(page);
  await expect(page.locator('#karta-jmeno')).toHaveText('Hérakleitos');
  await expect(zivot(page)).toHaveCount(0);
  await page.goto('/osobnost/herakleitos/');
  await expect(page.locator('.minimapa')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Přehrát život na mapě' })).toHaveCount(0);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = rezim === 'light' ? 'svetly' : 'tmavy';
    test(`život na mapě · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}: axe, nic nepřetéká, snímek`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim });
      await page.goto('/mapa/?rok=-347&osoba=aristoteles');
      await pripravit(page);
      await expect(zastavky(page)).toHaveCount(8);
      await expect(prehrat(page)).toBeVisible();
      // Tlačítka mají dotykový cíl aspoň 44 px a stojí v jednom řádku.
      const tl = await zivot(page).locator('.zivot__ovladani button').evaluateAll((b) => b.map((e) => e.getBoundingClientRect()).map((x) => ({ h: x.height, top: x.top, right: x.right })));
      expect(tl).toHaveLength(3);
      for (const b of tl) expect(b.h).toBeGreaterThanOrEqual(44);
      expect(new Set(tl.map((b) => Math.round(b.top))).size).toBe(1);
      const karta = (await page.locator('.mac__karta').boundingBox())!;
      for (const b of tl) expect(b.right).toBeLessThanOrEqual(karta.x + karta.width + 1);
      for (const z of await zastavky(page).all()) {
        const b = (await z.boundingBox())!;
        expect(b.height).toBeGreaterThanOrEqual(44);
        expect(b.x + b.width).toBeLessThanOrEqual(karta.x + karta.width + 1);
      }
      // Nástroj se nesmí posouvat do stran ani dolů (skrytá oblast aria-live v kartě stránku protáhla o 486 px).
      const presah = await page.evaluate(() => ({ x: document.documentElement.scrollWidth - innerWidth, y: document.documentElement.scrollHeight - innerHeight }));
      expect(presah).toEqual({ x: 0, y: 0 });
      const axe = await new AxeBuilder({ page }).include('.mac__karta').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const popis = axe.violations.map((v) => `${v.id}: ${v.help}\n  ${v.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
      expect(popis, popis.join('\n')).toEqual([]);
      await zivot(page).scrollIntoViewIfNeeded();
      await zivot(page).screenshot({ path: `test-results/snimky/zivot-na-mape-${sirka}-${r}.png` });
    });
  }
}

test('život na mapě: stránka osoby · odkaz pod mini mapou na 390 a 1440 px', async ({ page }) => {
  for (const sirka of [390, 1440]) {
    await page.setViewportSize({ width: sirka, height: 900 });
    await page.goto('/osobnost/seneca/');
    const odkaz = page.getByRole('link', { name: 'Přehrát život na mapě' });
    await expect(odkaz).toHaveAttribute('href', '/mapa/?rok=-1&osoba=seneca&zivot=1');
    const b = (await odkaz.boundingBox())!;
    expect(b.height).toBeGreaterThanOrEqual(44);
    // Odkaz stojí pod mapou, ne v ní.
    const mapa = (await page.locator('.doba__mapa figure.minimapa').boundingBox())!;
    expect(b.y).toBeGreaterThanOrEqual(mapa.y + mapa.height - 1);
  }
});
