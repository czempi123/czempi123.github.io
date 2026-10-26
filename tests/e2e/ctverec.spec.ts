// Kresba „Zdvoj čtverec“ (Platónův portrét, kapitola 02) a oddíl Kresby v dílně bloků. Obě šířky ve světlém i tmavém
// režimu s axe, bez vodorovného posouvání, průchod pokusy se snímky, klávesnice, pořadí v kapitole.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/osobnost/platon/';
const ID = 'zdvoj-ctverec';
const SIRKY = [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }];
const REZIMY = ['light', 'dark'] as const;
const LISTY = 'header.hlavicka, nav.lista, .obsah-lista { visibility: hidden !important; }';

async function priprav(page: Page, adresa = STRANKA, id = ID) {
  await page.goto(adresa);
  await page.evaluate(() => document.fonts.ready);
  const kresba = page.locator(`#${id}`);
  await kresba.scrollIntoViewIfNeeded();
  await page.waitForFunction((i) => {
    const ostrov = document.getElementById(i)?.closest('astro-island');
    return !!ostrov && !ostrov.hasAttribute('ssr');
  }, id);
  return kresba;
}

/** Popisky v kresbě se nepřekrývají a leží celé v plátně. */
async function popiskyVolne(kresba: Locator) {
  const chyby = await kresba.locator('svg.kresba__platno').evaluate((svg) => {
    const platno = svg.getBoundingClientRect();
    const r = [...svg.querySelectorAll('text')].filter((t) => getComputedStyle(t).opacity !== '0' && t.textContent).map((t) => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    const ch: string[] = [];
    r.forEach((a, i) => {
      if (a.b.left < platno.left || a.b.right > platno.right || a.b.top < platno.top || a.b.bottom > platno.bottom) ch.push(`mimo plátno: ${a.t}`);
      for (const b of r.slice(i + 1)) {
        if (a.b.left < b.b.right && b.b.left < a.b.right && a.b.top < b.b.bottom && b.b.top < a.b.bottom) ch.push(`${a.t} × ${b.t}`);
      }
    });
    return ch;
  });
  expect(chyby).toEqual([]);
}

/** Texty vpravo (popisky pokusu) neleží na mřížce. */
async function vpravoOdMrizky(kresba: Locator) {
  const chyby = await kresba.locator('svg.kresba__platno').evaluate((svg) => {
    const krajMrizky = Math.max(...[...svg.querySelectorAll('line.mrizka')].map((l) => l.getBoundingClientRect().right));
    return [...svg.querySelectorAll('text')].filter((t) => t.getAttribute('x') === '234' && t.getBoundingClientRect().left < krajMrizky).map((t) => t.textContent);
  });
  expect(chyby).toEqual([]);
}

const jmeno = (rezim: string) => (rezim === 'light' ? 'svetly' : 'tmavy');

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const r = jmeno(rezim);

    test(`zdvoj čtverec · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page);
      await page.addStyleTag({ content: LISTY });
      const popis = kresba.locator('.kresba__popis');
      const pokusy = kresba.getByRole('radiogroup', { name: 'Zdvoj čtverec' });
      const tlacitko = kresba.getByRole('button');

      // Na začátku: tři pokusy, první zvolený, jediné tlačítko; nic neběží samo a výsledek se neříká.
      await expect(pokusy.getByRole('radio')).toHaveCount(3);
      await expect(pokusy.getByRole('radio', { name: 'Strana čtyři' })).toBeChecked();
      await expect(tlacitko).toHaveText(['Spočítat čtverečky']);
      await expect(popis).toHaveText('Chlapec řekl: dvojnásobnou stranu. Čtverec o straně čtyři stopy je na mřížce. Původní čtverec je ve vlastním rohu.');
      await expect(kresba.locator('svg text')).toHaveText(['původní', 'strana', 'čtyři stopy', 'hledáme: 8']);
      await expect(kresba.locator('svg .cele')).toHaveCount(0);
      for (const v of await kresba.locator('.k-prepinac span').evaluateAll((s) => s.map((x) => x.getBoundingClientRect().height))) expect(v).toBeGreaterThanOrEqual(44);
      await popiskyVolne(kresba);
      await vpravoOdMrizky(kresba);
      await kresba.screenshot({ path: `test-results/snimky/ctverec-ctyri-${sirka}-${r}.png` });

      // Spočítání: čtverečky se vybarví, vpravo je obsah, tlačítko nabídne skrytí.
      await tlacitko.click();
      await expect(tlacitko).toHaveText(['Skrýt počet']);
      await expect(kresba.locator('svg .cele')).toHaveCount(16);
      await expect(kresba.locator('svg text')).toHaveText([...Array.from({ length: 16 }, (_, i) => String(i + 1)), 'původní', 'strana', 'čtyři stopy', 'obsah', '16', 'hledáme: 8']);
      await expect(popis).toContainText('Čtverec o straně čtyři stopy má šestnáct čtverečků.');
      await popiskyVolne(kresba);
      await vpravoOdMrizky(kresba);
      await kresba.screenshot({ path: `test-results/snimky/ctverec-ctyri-spocitano-${sirka}-${r}.png` });

      // Druhý pokus začíná nespočítaný; první si spočítání pamatuje.
      await pokusy.getByRole('radio', { name: 'Strana tři' }).check({ force: true });
      await expect(tlacitko).toHaveText(['Spočítat čtverečky']);
      await expect(kresba.locator('svg .cele')).toHaveCount(0);
      await expect(popis).not.toContainText('devět');
      await tlacitko.click();
      await expect(kresba.locator('svg .cele')).toHaveCount(9);
      await expect(popis).toContainText('Hledáme osm, devět je o jeden víc.');
      await kresba.screenshot({ path: `test-results/snimky/ctverec-tri-spocitano-${sirka}-${r}.png` });
      await pokusy.getByRole('radio', { name: 'Strana čtyři' }).check({ force: true });
      await expect(tlacitko).toHaveText(['Skrýt počet']);

      // Úhlopříčka: čtyři celé čtverečky, osm půlek a obsah osm.
      await pokusy.getByRole('radio', { name: 'Na úhlopříčce' }).check({ force: true });
      await expect(popis).not.toContainText('dohromady osm');
      await vpravoOdMrizky(kresba);
      await kresba.screenshot({ path: `test-results/snimky/ctverec-uhlopricka-${sirka}-${r}.png` });
      await tlacitko.click();
      await expect(kresba.locator('svg .cele')).toHaveCount(4);
      await expect(kresba.locator('svg .pulka')).toHaveCount(8);
      await expect(kresba.locator('svg text')).toHaveText(['1', '2', '3', '4', ...Array(8).fill('½'), 'původní', 'strana', 'úhlopříčka', 'obsah', '4 celé', '8 půlek', '= 8', 'hledáme: 8']);
      await expect(popis).toContainText('Nový čtverec tvoří čtyři celé čtverečky a osm půlek, dohromady osm.');
      await popiskyVolne(kresba);
      await vpravoOdMrizky(kresba);
      await kresba.screenshot({ path: `test-results/snimky/ctverec-uhlopricka-spocitano-${sirka}-${r}.png` });

      const axe = await new AxeBuilder({ page }).include(`#${ID}`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}

test('zdvoj čtverec: celé jen klávesnicí a kresba nemá tlačítko pohybu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  // Nic tu neběží samo: tlačítko pohybu chybí i tam, kde se kresby smějí hýbat.
  await expect(kresba.getByRole('button')).toHaveText(['Spočítat čtverečky']);

  await kresba.getByRole('radio', { name: 'Strana čtyři' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Strana tři' })).toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Na úhlopříčce' })).toBeChecked();
  await expect(kresba.locator('svg').getByText('úhlopříčka', { exact: true })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('button', { name: 'Spočítat čtverečky' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(kresba.locator('.kresba__popis')).toContainText('čtyři celé čtverečky a osm půlek');
  await expect(kresba.getByRole('button', { name: 'Skrýt počet' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(kresba.locator('svg .cele')).toHaveCount(0);
});

test('zdvoj čtverec: stojí v kapitole 02 za úhlopříčkami, pod blokem Odkryj, a není blok', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const kresba = await priprav(page);
  const poradi = await page.evaluate(() => {
    const pred = [...document.querySelectorAll('p')].find((p) => p.textContent?.startsWith('Pak nakreslil úhlopříčky'))!;
    const po = [...document.querySelectorAll('p')].find((p) => p.textContent?.startsWith('Všimni si, kdo co udělal'))!;
    const odkryj = document.getElementById('platon-ctverec')!;
    const k = document.getElementById('zdvoj-ctverec')!;
    const za = (a: Node, b: Node) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return { podOdkryj: za(odkryj, k), zaUhlopricky: za(pred, k), predVsimniSi: za(k, po) };
  });
  expect(poradi).toEqual({ podOdkryj: true, zaUhlopricky: true, predVsimniSi: true });
  await expect(kresba).not.toHaveClass(/\bblok\b/);
});

test('dílna bloků: oddíl Kresby ukáže všech třináct kreseb', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/dilna/bloky/');
  const oddil = page.locator('section[aria-labelledby="h-kresby"]');
  await expect(oddil.getByRole('heading', { name: 'Kresby s pohybem' })).toBeVisible();
  const kresby = oddil.locator('figure.kresba');
  await expect(kresby).toHaveCount(13);
  await expect(kresby.locator('.kresba__nazev')).toHaveText(['Dva pohledy do jeskyně', 'Cesta ven', 'Stejné šaty, jiné světlo', 'Stejný vítr', 'Roztrhni kartu', 'Kdy je dost?', 'Zdvoj čtverec', 'Kde je střed?', 'Zrcadlo času', 'Loď po prknech', 'Třetí čára', 'Přesýpací hodiny', 'Strhni masku']);
  await expect(kresby.locator('svg.kresba__platno')).toHaveCount(13);
});
