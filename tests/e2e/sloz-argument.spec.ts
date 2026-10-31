// Blok Slož argument v dílně (/dilna/bloky/): jen klávesnicí na 390 a 1440 px ve světlém i tmavém režimu (axe, snímek,
// obnovení), klepnutí a výměna karet, tažení myší, prstem (události ukazatele i skutečný dotyk přes CDP), omezený pohyb,
// zápis volby do deníku a jeho smazání přes Začít znovu, tři zastavení po kontrole (zpětná vazba, chybějící věta, volba)
// a jejich obnovení, šířka sloupce profilu a kroku cesty a podoby na plátně.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/dilna/bloky/';
const ID = 'dilna-sokrates-zemre';
const SKRYTY = 'Co se dosud nepodařilo žádnému člověku, nepodaří se ani nikomu dalšímu.';

async function priprav(page: Page): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${ID}"]`);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island[component-url*="SlozArgument"]').filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).include(`[id="${ID}"]`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join(', ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

const presah = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
const radek = (blok: Locator, r: string) => blok.locator(`[data-radek="${r}"]`);
const karta = (blok: Locator, id: string) => blok.locator(`[data-karta="${id}"]`);
const fokus = (loc: Locator) => loc.evaluate((e) => e === document.activeElement || e.contains(document.activeElement));

async function tabNa(page: Page, cil: Locator, nejvic = 12) {
  for (let i = 0; i < nejvic; i++) {
    if (await cil.evaluate((e) => e === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Tabulátor se na prvek nedostal: ${cil}`);
}

/** Složí argument klepnutím: karta, pak řádek (cílem je celý řádek). */
async function sloz(blok: Locator, rozlozeni: Record<string, string>) {
  for (const [r, k] of Object.entries(rozlozeni)) {
    await karta(blok, k).click();
    await radek(blok, r).locator('.radek__sem').click();
  }
}

for (const sirka of [390, 1440] as const) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Slož argument jen klávesnicí · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}; axe, snímek, obnovení`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(STRANKA);
      let blok = await priprav(page);
      await axe(page);
      await expect(blok.getByRole('button', { name: 'Zkontrolovat' })).toBeDisabled();
      await expect(blok.locator('.radek__chybi')).toHaveText('Jedna věta tu chybí.');

      // Enter vybere kartu a fokus jde na první prázdný řádek; Tab na další řádek, Enter kartu položí.
      await karta(blok, 'nikdo').focus();
      await page.keyboard.press('Enter');
      await expect(karta(blok, 'nikdo')).toHaveAttribute('aria-pressed', 'true');
      await expect(radek(blok, '1').locator('.radek__sem')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(radek(blok, '2').locator('.radek__sem')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(radek(blok, '2')).toContainText('Ještě žádný člověk nežil věčně.');
      await expect(blok.locator('[aria-live="polite"]').first()).toHaveText('„Ještě žádný člověk nežil věčně“ je v řádku 2.');
      // Fokus jde na další volnou kartu; Escape výběr zruší a vrátí fokus kartě.
      await expect(karta(blok, 'zemre')).toBeFocused();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');
      await expect(karta(blok, 'zemre')).toHaveAttribute('aria-pressed', 'false');
      await expect(karta(blok, 'zemre')).toBeFocused();
      await expect(blok.locator('.radek__sem')).toHaveCount(0);
      await page.keyboard.press('Enter');
      await tabNa(page, radek(blok, 'zaver').locator('.radek__sem'));
      await page.keyboard.press('Enter');
      await expect(karta(blok, 'clovek')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(radek(blok, '1').locator('.radek__sem')).toBeFocused();
      await page.keyboard.press('Enter');
      // Poslední karta: fokus na Zkontrolovat.
      const zkontrolovat = blok.getByRole('button', { name: 'Zkontrolovat' });
      await expect(zkontrolovat).toBeFocused();
      expect(await presah(page)).toBeLessThanOrEqual(0);
      await axe(page);
      await page.keyboard.press('Enter');

      const zpetna = blok.getByRole('region', { name: 'Zpětná vazba' });
      await expect(zpetna).toBeFocused();
      await expect(zpetna).toContainText('Tvůj závěr: „Sókratés jednou zemře“.');
      await expect(zpetna).toContainText('Co ten skok drží?');
      // První zastavení: jen zpětná vazba. Chybějící věta, volba ani místo k napadení ještě nejsou vidět.
      await expect(blok.locator('.radek__chybi')).toHaveText('Jedna věta tu chybí.');
      await expect(blok).not.toContainText(SKRYTY);
      await expect(blok.getByRole('heading', { name: 'Skrytý předpoklad' })).toHaveCount(0);
      await expect(blok.getByRole('heading', { name: 'Kde se dá argument napadnout' })).toHaveCount(0);
      await expect(blok.getByRole('radio')).toHaveCount(0);
      await expect(blok.locator('.radek--slabe')).toHaveCount(0);
      // Po kontrole se karty nepřesouvají.
      await expect(blok.locator('button[data-karta]')).toHaveCount(0);
      await axe(page);

      // Druhé zastavení: chybějící věta a volba; místo k napadení pořád ne.
      await tabNa(page, blok.getByRole('button', { name: 'Ukázat chybějící větu' }));
      await page.keyboard.press('Enter');
      const skryty = blok.getByRole('region', { name: 'Skrytý předpoklad' });
      await expect(skryty).toBeFocused();
      await expect(skryty.getByRole('heading', { name: 'Skrytý předpoklad' })).toBeVisible();
      await expect(blok.locator('.radek--skryty')).toContainText(SKRYTY);
      await expect(blok.getByRole('button', { name: 'Ukázat chybějící větu' })).toHaveCount(0);
      await expect(blok.getByRole('heading', { name: 'Kde se dá argument napadnout' })).toHaveCount(0);
      await expect(blok.locator('.radek--slabe')).toHaveCount(0);
      await expect(blok.getByRole('heading', { name: 'Kterou premisu bys napadl ty?' })).toBeVisible();

      // Volba: Tab na skupinu, šipky, důvod, potvrzení.
      await tabNa(page, blok.getByRole('radio').first());
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(blok.getByRole('radio', { name: /Skrytý předpoklad/ })).toBeChecked();
      await page.keyboard.press('Tab');
      await expect(blok.getByLabel(/Proč právě tahle/)).toBeFocused();
      await page.keyboard.type('Minulost nezaručí budoucnost.');
      await page.keyboard.press('Tab');
      await expect(blok.getByRole('button', { name: 'Tohle bych napadl' })).toBeFocused();
      await page.keyboard.press('Enter');
      const kVolbe = blok.getByRole('region', { name: 'K tvé volbě' });
      await expect(kVolbe).toBeFocused();
      await expect(kVolbe).toContainText('Míříš tam, kde je argument nejslabší');
      // Třetí zastavení: teprve po volbě místo k napadení a zvýrazněný řádek.
      await expect(kVolbe.getByRole('heading', { name: 'Kde se dá argument napadnout' })).toBeVisible();
      await expect(blok.locator('.radek--skryty')).toHaveClass(/radek--slabe/);
      // Po potvrzení zůstane vidět jen zvolená možnost.
      await expect(blok.locator('label.moznost:visible')).toHaveCount(1);
      await expect(blok.getByRole('radio', { name: /Skrytý předpoklad/ })).toBeDisabled();
      expect(await presah(page)).toBeLessThanOrEqual(0);
      await axe(page);
      await page.addStyleTag({ content: 'header.hlavicka, nav.lista { visibility: hidden !important; }' });
      const r = await blok.evaluate((e) => {
        const b = e.getBoundingClientRect();
        return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
      });
      await page.screenshot({ path: `test-results/snimky/blok-argument-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, fullPage: true, clip: r, animations: 'disabled' });

      await page.reload();
      blok = await priprav(page);
      await expect(blok.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Tvůj závěr: „Sókratés jednou zemře“.');
      await expect(blok.getByRole('radio', { name: /Skrytý předpoklad/ })).toBeChecked();
      await expect(blok.locator('.tvuj-duvod')).toContainText('Minulost nezaručí budoucnost.');
      await expect(radek(blok, '1')).toContainText('Sókratés je člověk.');
      await expect(blok.locator('.radek--skryty')).toHaveClass(/radek--slabe/);
    });
  }
}

test('každé zastavení po kontrole vydrží obnovení: zpětná vazba, chybějící věta s volbou, volba s místem k napadení', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  let blok = await priprav(page);
  await sloz(blok, { '1': 'clovek', '2': 'nikdo', zaver: 'zemre' });
  await blok.getByRole('button', { name: 'Zkontrolovat' }).click();
  await page.reload();
  blok = await priprav(page);
  await expect(blok.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Co ten skok drží?');
  await expect(blok.getByRole('button', { name: 'Ukázat chybějící větu' })).toBeVisible();
  await expect(blok.locator('.radek__chybi')).toHaveText('Jedna věta tu chybí.');
  await expect(blok.getByRole('radio')).toHaveCount(0);

  await blok.getByRole('button', { name: 'Ukázat chybějící větu' }).click();
  await blok.getByText('Ještě žádný člověk nežil věčně.', { exact: true }).last().click();
  await page.reload();
  blok = await priprav(page);
  await expect(blok.locator('.radek--skryty')).toContainText(SKRYTY);
  await expect(blok.getByRole('radio', { name: /Ještě žádný člověk/ })).toBeChecked();
  await expect(blok.getByRole('heading', { name: 'Kde se dá argument napadnout' })).toHaveCount(0);
  await expect(blok.locator('.radek--slabe')).toHaveCount(0);

  await blok.getByRole('button', { name: 'Tohle bych napadl' }).click();
  await page.reload();
  blok = await priprav(page);
  await expect(blok.getByRole('region', { name: 'K tvé volbě' }).getByRole('heading', { name: 'Kde se dá argument napadnout' })).toBeVisible();
  await expect(blok.locator('.radek--skryty')).toHaveClass(/radek--slabe/);
  await expect(blok.locator('label.moznost:visible')).toHaveCount(1);
});

test('klepnutí: výběr karty a řádku, výměna, vrácení mezi karty; premisa v závěru dostane vysvětlení; Začít znovu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  let blok = await priprav(page);
  await sloz(blok, { '1': 'zemre', '2': 'nikdo' });
  // Karta z hromádky na obsazený řádek: původní karta se vrátí mezi karty.
  await karta(blok, 'clovek').click();
  await radek(blok, '1').locator('.radek__sem').click();
  await expect(radek(blok, '1')).toContainText('Sókratés je člověk.');
  await expect(blok.locator('.hromadka')).toContainText('Sókratés jednou zemře.');
  // Karta z řádku na jiný obsazený řádek: prohodí se.
  await karta(blok, 'clovek').click();
  await radek(blok, '2').locator('.radek__sem').click();
  await expect(radek(blok, '2')).toContainText('Sókratés je člověk.');
  await expect(radek(blok, '1')).toContainText('Ještě žádný člověk nežil věčně.');
  // Vybraná karta z řádku jde vrátit mezi karty.
  await karta(blok, 'nikdo').click();
  await blok.getByRole('button', { name: 'Vrátit mezi karty' }).click();
  await expect(radek(blok, '1').locator('[data-karta]')).toHaveCount(0);
  await expect(blok.locator('.hromadka [data-karta]')).toHaveCount(2);
  // Premisa v závěru, skutečný závěr v řádku 1.
  await sloz(blok, { '1': 'zemre', zaver: 'nikdo' });
  await blok.getByRole('button', { name: 'Zkontrolovat' }).click();
  const zpetna = blok.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna).toContainText('Tvůj závěr: „Ještě žádný člověk nežil věčně“.');
  await expect(zpetna).toContainText('Argument tuhle větu nedokazuje, vychází z ní. Větu, kterou ostatní karty podpírají, máš v řádku 1: „Sókratés jednou zemře“.');
  await expect(zpetna).not.toContainText(/správně|špatně/i);
  // Začít znovu vrátí karty mezi karty a smaže stav.
  await blok.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(blok.locator('.hromadka [data-karta]')).toHaveCount(3);
  await expect(blok.getByRole('region', { name: 'Zpětná vazba' })).toHaveCount(0);
  await page.reload();
  blok = await priprav(page);
  await expect(blok.locator('.hromadka [data-karta]')).toHaveCount(3);
  expect(await page.evaluate((id) => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').bloky?.[id], ID)).toBeUndefined();
});

test('tažení myší: karta do řádku, z řádku zpátky mezi karty, puštění mimo nic nepřesune; rozpracované vydrží obnovení', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  let blok = await priprav(page);
  const tahni = async (k: Locator, kam: Locator | null) => {
    await k.evaluate((e) => e.scrollIntoView({ block: 'center' }));
    const b = (await k.boundingBox())!;
    await page.mouse.move(b.x + 40, b.y + b.height / 2);
    await page.mouse.down();
    if (kam) {
      const c = (await kam.boundingBox())!;
      await page.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 8 });
    } else {
      await page.mouse.move(b.x + 40, b.y - 160, { steps: 5 });
    }
    await page.mouse.up();
  };
  await tahni(karta(blok, 'nikdo'), radek(blok, '2'));
  await expect(radek(blok, '2')).toContainText('Ještě žádný člověk nežil věčně.');
  // Tažení výběr nezmění (klepnutí po puštění se nepočítá).
  await expect(blok.locator('[aria-pressed="true"]')).toHaveCount(0);
  await tahni(karta(blok, 'zemre'), null);
  await expect(blok.locator('.hromadka')).toContainText('Sókratés jednou zemře.');
  await tahni(karta(blok, 'nikdo'), blok.locator('.hromadka'));
  await expect(radek(blok, '2').locator('[data-karta]')).toHaveCount(0);
  await tahni(karta(blok, 'zemre'), radek(blok, 'zaver'));
  await page.reload();
  blok = await priprav(page);
  await expect(radek(blok, 'zaver')).toContainText('Sókratés jednou zemře.');
  await expect(blok.locator('.hromadka [data-karta]')).toHaveCount(2);
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Pokračuj, kde jsi skončil' })).toContainText('Jak z nich složíš argument?');
});

test('prstem: události ukazatele i skutečný dotyk (CDP); stránka se při tažení karty neposune', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(STRANKA);
  const blok = await priprav(page);
  const k = karta(blok, 'nikdo');
  await k.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  expect(await k.evaluate((e) => getComputedStyle(e).touchAction)).toBe('none');
  // Události ukazatele s pointerType touch.
  let b = (await k.boundingBox())!;
  let c = (await radek(blok, '2').boundingBox())!;
  const u = { pointerId: 5, pointerType: 'touch', isPrimary: true, button: 0, buttons: 1, bubbles: true };
  await k.dispatchEvent('pointerdown', { ...u, clientX: b.x + 30, clientY: b.y + 20 });
  await k.dispatchEvent('pointermove', { ...u, clientX: b.x + 40, clientY: b.y + 60 });
  await k.dispatchEvent('pointermove', { ...u, clientX: c.x + c.width / 2, clientY: c.y + c.height / 2 });
  await expect(radek(blok, '2')).toHaveClass(/radek--nad/);
  await k.dispatchEvent('pointerup', { ...u, buttons: 0, clientX: c.x + c.width / 2, clientY: c.y + c.height / 2 });
  await expect(radek(blok, '2')).toContainText('Ještě žádný člověk nežil věčně.');

  // Skutečný dotyk: karta „Sókratés je člověk.“ do řádku 1.
  const k2 = karta(blok, 'clovek');
  await k2.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  b = (await k2.boundingBox())!;
  c = (await radek(blok, '1').boundingBox())!;
  const posunPred = await page.evaluate(() => scrollY);
  const cdp = await ctx.newCDPSession(page);
  const bod = (x: number, y: number) => [{ x: Math.round(x), y: Math.round(y), id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(b.x + 30, b.y + b.height / 2) });
  const kroku = 8;
  for (let i = 1; i <= kroku; i++) {
    const x = b.x + 30 + ((c.x + c.width / 2 - b.x - 30) * i) / kroku;
    const y = b.y + b.height / 2 + ((c.y + c.height / 2 - b.y - b.height / 2) * i) / kroku;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: bod(x, y) });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(radek(blok, '1')).toContainText('Sókratés je člověk.');
  expect(await page.evaluate(() => scrollY)).toBe(posunPred);
  // Dotyk po tažení kartu nevybere.
  await expect(blok.locator('[aria-pressed="true"]')).toHaveCount(0);

  // Klepnutí: karta, pak řádek (cílem je celý řádek).
  // Click po dotyku přijde až po tap(); na pomalejším stroji (Linux na GitHubu) by klepnutí na řádek předběhlo výběr karty.
  await karta(blok, 'zemre').tap();
  await expect(karta(blok, 'zemre')).toHaveAttribute('aria-pressed', 'true');
  const zaver = radek(blok, 'zaver');
  await expect(zaver.locator('.radek__sem')).toBeVisible();
  await zaver.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await zaver.locator('.radek__cislo').tap({ force: true });
  await expect(zaver).toContainText('Sókratés jednou zemře.');
  // Cíle aspoň 44 px.
  const male = await blok.evaluate((e) =>
    [...e.querySelectorAll('button, label')]
      .filter((x) => {
        const r = x.getBoundingClientRect();
        return r.width > 1 && r.height > 1 && r.height < 44 && !x.classList.contains('blok__popis');
      })
      .map((x) => x.textContent?.trim().slice(0, 30)),
  );
  expect(male).toEqual([]);
  expect(await presah(page)).toBeLessThanOrEqual(0);
  await ctx.close();
});

test('omezený pohyb: karta skočí bez animace; bez omezení se posune', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  let blok = await priprav(page);
  // Jen pohyb karty: přechody barev okraje trvají při omezeném pohybu 0,01 ms (global.css) a nepočítají se.
  const animace = () =>
    blok.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => a.playState === 'running' && Number(a.effect?.getTiming().duration) > 1).length);
  await karta(blok, 'nikdo').click();
  await radek(blok, '2').locator('.radek__sem').click();
  expect(await animace()).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  blok = await priprav(page);
  await karta(blok, 'zemre').click();
  await radek(blok, 'zaver').locator('.radek__sem').click();
  await expect.poll(animace, { timeout: 200, intervals: [0, 20, 40] }).toBeGreaterThan(0);
  await expect.poll(animace).toBe(0);
  await expect(radek(blok, 'zaver')).toContainText('Sókratés jednou zemře.');
});

test('deník: volba jde do Mého deníku jako názor; Začít znovu zápis smaže', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  let blok = await priprav(page);
  await sloz(blok, { '1': 'clovek', '2': 'nikdo', zaver: 'zemre' });
  await blok.getByRole('button', { name: 'Zkontrolovat' }).click();
  await blok.getByRole('button', { name: 'Ukázat chybějící větu' }).click();
  // Kontrola ani odkrytí do deníku nic nezapíšou: složení není názor.
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').zapisy ?? [])).toEqual([]);
  await blok.getByText('Ještě žádný člověk nežil věčně.', { exact: true }).last().click();
  await blok.getByLabel(/Proč právě tahle/).fill('Stačí jeden protipříklad.');
  await blok.getByRole('button', { name: 'Tohle bych napadl' }).click();
  await expect(blok.getByRole('region', { name: 'K tvé volbě' })).toContainText('jediný protipříklad');
  await page.goto('/denik/');
  await expect(page.getByText('Jak z nich složíš argument? Kterou premisu bys napadl ty?')).toBeVisible();
  await expect(page.getByText('Napadl bych premisu: „Ještě žádný člověk nežil věčně“. Proč: Stačí jeden protipříklad.')).toBeVisible();
  await page.goto(STRANKA);
  blok = await priprav(page);
  await blok.getByRole('button', { name: 'Začít znovu' }).click();
  await page.goto('/denik/');
  await expect(page.locator('.seznam--zapisy li')).toHaveCount(0);
});

for (const [nazev, sirka] of [['sloupec profilu', 680], ['krok cesty', 960]] as const) {
  test(`šířka bloku jako ${nazev} (${sirka} px): nic nepřetéká, cíle drží; snímek`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(STRANKA);
    const blok = await priprav(page);
    await blok.evaluate((e, s) => { e.style.maxWidth = `${s}px`; }, sirka);
    await sloz(blok, { '1': 'clovek' });
    // Karty vedle řádků, když na ně je místo (aspoň 600 px uvnitř bloku).
    const h = (await blok.locator('.hromadka').boundingBox())!;
    const o = (await blok.locator('.radky').boundingBox())!;
    expect(h.x + h.width).toBeLessThanOrEqual(o.x);
    const pretece = await blok.evaluate((e) => [...e.querySelectorAll('*')].filter((x) => !x.classList.contains('vizualne-skryte') && x.scrollWidth > x.clientWidth + 1 && getComputedStyle(x).overflowX !== 'visible').length);
    expect(pretece).toBe(0);
    await blok.screenshot({ path: `test-results/snimky/blok-argument-${sirka}-sloupec.png`, animations: 'disabled' });
  });
}

test('podoby na plátně: jen otázka a možnosti (bez scény, důvodu, Kam dál a místa k napadení), otevřená otázka jen s otázkou', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page);
  const cast = (c: string) => blok.locator(`[data-cast="${c}"]`);
  const promitej = (podoba: string | null) =>
    page.evaluate(([id, p]) => {
      document.documentElement.classList.add('promitani', 'promitani-pripraveno');
      const e = document.getElementById(id!)!;
      if (p) e.setAttribute('data-podoba', p);
      else e.removeAttribute('data-podoba');
    }, [ID, podoba]);

  await promitej('moznosti');
  await expect(cast('otazka')).toBeVisible();
  await expect(cast('scena')).toBeHidden();
  await expect(cast('moznosti').first()).toBeVisible();
  await expect(cast('akce').first()).toBeVisible();
  await sloz(blok, { '1': 'clovek', '2': 'nikdo', zaver: 'zemre' });
  await blok.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(cast('zpetna').first()).toBeVisible();
  await blok.getByRole('button', { name: 'Ukázat chybějící větu' }).click();
  await expect(blok.getByRole('radio').first()).toBeAttached();
  await expect(blok.locator('.moznost').first()).toBeVisible();
  for (const el of await cast('duvod').all()) await expect(el).toBeHidden();
  await blok.locator('.moznost').nth(2).click();
  await blok.getByRole('button', { name: 'Tohle bych napadl' }).click();
  for (const c of ['dal', 'ulozeno', 'duvod']) for (const el of await cast(c).all()) await expect(el).toBeHidden();
  // Kde se dá argument napadnout třída na plátně nevidí: to je výklad pro toho, kdo blok prochází sám.
  await expect(blok.getByRole('region', { name: 'K tvé volbě' })).toBeVisible();
  await expect(cast('napadnout')).toBeHidden();

  await promitej('otevrena');
  await expect(cast('hlava')).toBeVisible();
  await expect(cast('otazka')).toBeVisible();
  for (const c of ['scena', 'moznosti', 'akce', 'zpetna']) for (const el of await cast(c).all()) await expect(el).toBeHidden();

  await promitej(null);
  await expect(cast('napadnout')).toBeVisible();
  await expect(cast('moznosti').first()).toBeVisible();
  await expect(cast('scena')).toBeVisible();
});
