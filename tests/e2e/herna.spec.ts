// Hry herny v dílně (herna-v1, K1): Seřaď na ose a Kdo to řekl? na 390 a 1440 px ve světlém i tmavém režimu.
// Jen klávesnicí → axe (WCAG 2 AA) → snímek → obnovení stránky; dotyk přes CDP, tažení myší, bez localStorage,
// omezený pohyb a Klidný režim (rozdání, otočení a otisk bez pohybu).
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/dilna/bloky/';
const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;
const SERAD = 'dilna-serad-narozeni';
const KDO = 'dilna-kdo-rekl';
const N = '\u00a0';
const SPRAVNE = ['Sókratés', 'Antisthenés', 'Diogenés', 'Kratés', `Zénón z${N}Kitia`];

async function priprav(page: Page, id: string, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator(`astro-island[component-url*="${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

async function bezPresahu(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}

async function snimek(page: Page, blok: Locator, nazev: string) {
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } .blok__pata { position: static !important; }' });
  const r = await blok.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}

/** Tabulátorem dál, dokud fokus nemá daný text (mezi kartami a patou může stát nabídka pera). */
async function tabNa(page: Page, text: string) {
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    if ((await page.evaluate(() => document.activeElement?.textContent?.trim())) === text) return;
  }
  throw new Error(`Tabulátor nedošel na „${text}“.`);
}

const poradiNaSnure = (blok: Locator) => blok.locator('.karta-osy .karta-osy__text').allTextContents();
const fokusText = (page: Page) => page.evaluate(() => document.activeElement?.querySelector('.karta-osy__text')?.textContent ?? document.activeElement?.textContent?.trim() ?? '');

/** Seřadí karty jen klávesnicí: na každé místo zvedne správnou kartu, šipkami ji přenese a položí. */
async function seradKlavesnici(page: Page, blok: Locator) {
  for (let cil = 0; cil < SPRAVNE.length; cil++) {
    const p = (await poradiNaSnure(blok)).indexOf(SPRAVNE[cil]);
    if (p === cil) continue;
    await page.keyboard.press('Home');
    for (let i = 0; i < p; i++) await page.keyboard.press('ArrowRight');
    expect(await fokusText(page)).toBe(SPRAVNE[cil]);
    await page.keyboard.press('Enter');
    await expect(blok.locator('.karta-osy[aria-pressed="true"]')).toHaveCount(1);
    for (let i = 0; i < p - cil; i++) await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');
    await expect(blok.locator('.karta-osy[aria-pressed="true"]')).toHaveCount(0);
  }
  expect(await poradiNaSnure(blok)).toEqual(SPRAVNE);
}

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`Seřaď na ose jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, SERAD, 'SeradNaOse');

      // Šňůra: svisle na telefonu, vodorovně v širokém rámu; jedna zastávka tabulátoru.
      const smer = await blok.locator('.snura').evaluate((e) => getComputedStyle(e).flexDirection);
      expect(smer).toBe(sirka < 700 ? 'column' : 'row');
      await expect(blok.locator('.karta-osy[tabindex="0"]')).toHaveCount(1);
      await expect(blok.locator('.karta-osy__rok')).toHaveCount(0);
      // Napovědy jsou na kartách od začátku (revize R): student řadí podle toho, kdo na koho navázal.
      await expect(blok.locator('.karta-osy__napoveda')).toHaveCount(5);
      await expect(blok.locator('.karta-osy__napoveda').filter({ hasText: 'Antisthenés chodil poslouchat Sókrata.' })).toHaveCount(1);
      expect(await poradiNaSnure(blok)).not.toEqual(SPRAVNE);
      await axe(page, `[id="${SERAD}"]`);
      await snimek(page, blok, `herna-serad-klid-${pr}`);

      // Escape vrátí zvednutou kartu.
      await blok.locator('.karta-osy[tabindex="0"]').focus();
      const pred = await poradiNaSnure(blok);
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowRight');
      expect(await poradiNaSnure(blok)).not.toEqual(pred);
      await page.keyboard.press('Escape');
      expect(await poradiNaSnure(blok)).toEqual(pred);

      // Špatná kontrola: zkus to jinak s větou, značky dvojic, tlačítko čeká na změnu.
      await tabNa(page, 'Zkontrolovat pořadí');
      await page.keyboard.press('Enter');
      const zkus = blok.getByRole('region', { name: 'Zkus to jinak' });
      await expect(zkus).toContainText('Zkus to jinak.');
      await expect(zkus).toContainText(/„.+“\sa\s„.+“ zatím visí obráceně\./);
      await expect(blok.locator('.dvojice')).toHaveCount(4);
      await expect(blok.getByRole('button', { name: 'Zkontrolovat pořadí' })).toBeDisabled();
      await expect(blok.locator('.karta-osy__rok')).toHaveCount(0);
      await axe(page, `[id="${SERAD}"]`);
      await snimek(page, blok, `herna-serad-zkus-${pr}`);

      // Seřadit klávesnicí a zkontrolovat: sedí, roky, otisk, vysvětlení.
      await blok.locator('.karta-osy[tabindex="0"]').focus();
      await seradKlavesnici(page, blok);
      await expect(blok.locator('.dvojice')).toHaveCount(0);
      await tabNa(page, 'Zkontrolovat pořadí');
      await page.keyboard.press('Enter');
      const vazba = blok.getByRole('region', { name: 'Pořadí' });
      await expect(vazba).toContainText('Sedí.');
      await expect(vazba).toContainText('Od Sókrata ke stoikům vedou čtyři kroky od učitele k žákovi.');
      await expect(blok.locator('.karta-osy__rok').first()).toHaveText(`469${N}př.${N}n.${N}l.`);
      await expect(blok.locator('.karta-osy__rok').nth(3)).toHaveText(`asi${N}365${N}př.${N}n.${N}l.`);
      // Mezi kartami: kdo na koho navázal (vztahy z dat), tradovaný s „vypráví se“; roky drobně pod jménem.
      const vazby = blok.locator('.vazba-osy');
      await expect(vazby).toHaveCount(4);
      await expect(vazby.first()).toContainText('učitel a žák');
      await expect(vazby.first()).toContainText('Antisthenés se učil u Sókrata.');
      await expect(vazby.nth(1)).toContainText('vypráví se');
      await expect(vazby.nth(1)).toContainText('Vypráví se, že se Diogenés učil u Antisthena.');
      const velikost = await blok.locator('.karta-osy__rok').first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
      const jmeno = await blok.locator('.karta-osy__text').first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
      expect(velikost).toBeLessThan(jmeno * 0.8);
      // Vazby se nepotkají s kartami ani mezi sebou.
      const obdelniky = await blok.evaluate((e) => [...e.querySelectorAll('.karta-osy, .vazba-osy > [aria-hidden]')].map((x) => { const r = x.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }));
      for (let i = 0; i < obdelniky.length; i++) for (let j = i + 1; j < obdelniky.length; j++) {
        const [a, b] = [obdelniky[i], obdelniky[j]];
        expect(a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1, `překryv ${i} a ${j}`).toBe(false);
      }
      await expect(blok.locator('.osa__otisk')).toHaveText('sedí');
      await expect(blok.getByRole('button', { name: 'Zkontrolovat pořadí' })).toHaveCount(0);
      await bezPresahu(page);
      await axe(page, `[id="${SERAD}"]`);
      await snimek(page, blok, `herna-serad-hotovo-${pr}`);

      // Obnovení: pořadí i roky zůstanou; v deníku je jen stav, žádný zápis.
      await page.reload();
      const znovu = await priprav(page, SERAD, 'SeradNaOse');
      expect(await poradiNaSnure(znovu)).toEqual(SPRAVNE);
      await expect(znovu.locator('.karta-osy__rok')).toHaveCount(5);
      const d = await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
      expect(d.bloky[SERAD]).toMatchObject({ hotovo: true, ukazano: false, pokusy: 1 });
      expect(d.aktivita.find((a: { id: string }) => a.id === SERAD)).toMatchObject({ druh: 'serad', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === SERAD)).toBe(false);

      // Začít znovu: zamíchané stejně jako na začátku, deník bez stavu.
      await znovu.getByRole('button', { name: 'Začít znovu' }).click();
      expect(await poradiNaSnure(znovu)).toEqual(pred);
      expect(await page.evaluate((id) => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').bloky?.[id], SERAD)).toBeUndefined();
      expect(chyby).toEqual([]);
    });

    test(`Kdo to řekl? jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, KDO, 'KdoToRekl');

      await expect(blok.locator('.serie__postup')).toHaveText('Karta 1 z 5');
      await expect(blok.locator('.otocna__lic')).toContainText('Lidi neznepokojují věci, ale jejich soudy o věcech.');
      await expect(blok.locator('.razitko-odpoved')).toHaveCount(4);
      // Pod každým jménem věta z dat, čím se člověk zabýval; nad razítky pokyn, že se hledá myšlenka.
      await expect(blok.locator('.odpoved__myslenka')).toHaveCount(4);
      await expect(blok.locator('.razitko-odpoved', { hasText: 'Epiktétos' })).toContainText('Rozlišil, co je v naší moci a co ne.');
      await expect(blok.locator('.odpovedi__pokyn')).toHaveText('Nemusíš to vědět: hledej, čí myšlence věta sedí.');
      // Na telefonu razítka pod sebou, nic nepřetéká; na notebooku dva sloupce.
      const xy = await blok.locator('.razitko-odpoved').evaluateAll((l) => l.map((e) => Math.round(e.getBoundingClientRect().left)));
      expect(new Set(xy).size).toBe(sirka < 700 ? 1 : 2);
      expect(await blok.locator('.razitko-odpoved').evaluateAll((l) => l.filter((e) => e.scrollWidth > e.clientWidth + 1).length)).toBe(0);
      await expect(blok.locator('.otocna__rub')).toHaveAttribute('aria-hidden', 'true');
      await expect(blok.getByRole('link', { name: /Otevřít stránku/ })).toHaveCount(0);
      await axe(page, `[id="${KDO}"]`);
      await snimek(page, blok, `herna-kdo-klid-${pr}`);

      // Špatné razítko: zkus to jinak, kam se podívat; zkusené je zakázané a fokus jde na lístek.
      const jmena = await blok.locator('.razitko-odpoved .odpoved__jmeno').allTextContents();
      const spatne = jmena.findIndex((j) => j !== 'Epiktétos');
      await blok.locator('.razitko-odpoved').first().focus();
      for (let i = 0; i < spatne; i++) await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const zkus = blok.getByRole('region', { name: 'Zkus to jinak' });
      await expect(zkus).toContainText('Zkus to jinak.');
      await expect(zkus).toContainText('co máme ve své moci');
      await expect(zkus).toBeFocused();
      await expect(blok.locator('.razitko-odpoved').nth(spatne)).toBeDisabled();
      await expect(blok.locator('.otocena')).toHaveCount(0);
      await axe(page, `[id="${KDO}"]`);
      await snimek(page, blok, `herna-kdo-zkus-${pr}`);

      // Správné razítko: karta se otočí, rub s dílem a odkazem, fokus na Další karta.
      await blok.locator('.razitko-odpoved:not(:disabled)').first().focus();
      while (((await fokusText(page)) ?? '').indexOf('Epiktétos') < 0) await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(blok.locator('.otocna.otocena')).toHaveCount(1);
      const rub = blok.locator('.otocna__rub');
      await expect(rub).not.toHaveAttribute('aria-hidden', /.*/);
      await expect(rub).toContainText('Epiktétos');
      await expect(rub).toContainText('Rukojeť 5');
      // Nahoře na rubu, o čem věta je; jméno a místo menší pod ní.
      await expect(rub.locator('.kartka__pointa')).toHaveText(/^Neklid nevyvolá věc sama/);
      const [p1, p2] = await rub.evaluate((e) => ['.kartka__pointa', '.kartka__jmeno'].map((s) => e.querySelector(s)!.getBoundingClientRect().top));
      expect(p1).toBeLessThan(p2);
      await expect(rub.getByRole('link', { name: 'Otevřít stránku: Epiktétos' })).toHaveAttribute('href', /^\/osobnost\//);
      await expect(blok.locator('.kartka__otisk')).toHaveText('sedí');
      await expect(blok.getByRole('region', { name: 'Zkus to jinak' })).toHaveCount(0);
      await expect(page.locator(':focus')).toHaveText('Další karta');
      await axe(page, `[id="${KDO}"]`);
      await snimek(page, blok, `herna-kdo-otocena-${pr}`);

      // Další karta: druhá věta, fokus na první razítko; obnovení stránky drží sérii.
      await page.keyboard.press('Enter');
      await expect(blok.locator('.serie__postup')).toHaveText('Karta 2 z 5');
      await expect(blok.locator('.otocna__lic')).toContainText('Život, který nezkoumáme');
      await expect(page.locator(':focus')).toHaveClass(/razitko-odpoved/);
      await page.reload();
      const znovu = await priprav(page, KDO, 'KdoToRekl');
      await expect(znovu.locator('.serie__postup')).toHaveText('Karta 2 z 5');

      // Zbytek série; po poslední kartě souhrn a nic nezakázaného navíc.
      for (let i = 0; i < 30; i++) {
        if (await znovu.getByRole('button', { name: 'Další karta' }).count()) { await znovu.getByRole('button', { name: 'Další karta' }).click(); continue; }
        const volne = znovu.locator('.razitko-odpoved:not(:disabled)');
        if (!(await volne.count())) break;
        await volne.first().click();
      }
      const souhrn = znovu.getByRole('region', { name: 'Otočené karty' });
      await expect(souhrn).toContainText('Všechny karty jsou otočené.');
      await expect(souhrn.locator('li')).toHaveCount(5);
      await expect(znovu.locator('.otocna__rub')).toContainText('Seneca');
      await bezPresahu(page);
      await axe(page, `[id="${KDO}"]`);
      const d = await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
      expect(d.bloky[KDO].karta).toBe(4);
      expect(d.aktivita.find((a: { id: string }) => a.id === KDO)).toMatchObject({ druh: 'kdo-rekl', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === KDO)).toBe(false);
      expect(chyby).toEqual([]);
    });
  }
}

test('Seřaď na ose: tři kontroly, pak Ukázat pořadí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, SERAD, 'SeradNaOse');
  const kontrola = blok.getByRole('button', { name: 'Zkontrolovat pořadí' });
  for (let i = 0; i < 3; i++) {
    await expect(blok.getByRole('button', { name: 'Ukázat pořadí' })).toHaveCount(0);
    if (i > 0) {
      await blok.locator('.karta-osy').nth(0).click();
      await blok.locator('.karta-osy').nth(1).click();
    }
    // Pořadí po prohození by mohlo sedět; pak prohodit jinou dvojici.
    if (await kontrola.isDisabled()) { await blok.locator('.karta-osy').nth(2).click(); await blok.locator('.karta-osy').nth(3).click(); }
    expect(await poradiNaSnure(blok)).not.toEqual(SPRAVNE);
    await kontrola.click();
  }
  await blok.getByRole('button', { name: 'Ukázat pořadí' }).click();
  expect(await poradiNaSnure(blok)).toEqual(SPRAVNE);
  await expect(blok.getByRole('region', { name: 'Pořadí' })).toContainText('Takhle jdou po sobě.');
  await expect(blok.locator('.karta-osy__rok')).toHaveCount(5);
  await expect(blok.locator('.osa__otisk')).toHaveCount(0);
});

test('Seřaď na ose: tažení myší po vodorovné šňůře', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, SERAD, 'SeradNaOse');
  const pred = await poradiNaSnure(blok);
  const a = (await blok.locator('.karta-osy').nth(0).boundingBox())!;
  const b = (await blok.locator('.karta-osy').nth(4).boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 20, a.y + a.height / 2, { steps: 3 });
  await expect(blok.locator('.karta-osy--tazena')).toHaveCount(1);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(await poradiNaSnure(blok)).toEqual([...pred.slice(1), pred[0]]);
  // Klepnutí, které tažení ukončilo, kartu nezvedne.
  await expect(blok.locator('.karta-osy[aria-pressed="true"]')).toHaveCount(0);
});

test('Seřaď na ose a Kdo to řekl?: dotyk přes CDP na telefonu', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(STRANKA);
  const blok = await priprav(page, SERAD, 'SeradNaOse');
  const karta = blok.locator('.karta-osy').first();
  expect(await karta.evaluate((e) => getComputedStyle(e).touchAction)).toBe('none');
  await blok.locator('.snura').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const pred = await poradiNaSnure(blok);
  const a = (await karta.boundingBox())!;
  const c = (await blok.locator('.karta-osy').nth(2).boundingBox())!;
  const posunPred = await page.evaluate(() => scrollY);
  const cdp = await ctx.newCDPSession(page);
  const bod = (x: number, y: number) => [{ x: Math.round(x), y: Math.round(y), id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(a.x + 40, a.y + a.height / 2) });
  for (let i = 1; i <= 8; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: bod(a.x + 40, a.y + a.height / 2 + ((c.y + c.height / 2 - a.y - a.height / 2) * i) / 8) });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(await poradiNaSnure(blok)).toEqual([pred[1], pred[2], pred[0], pred[3], pred[4]]);
  expect(await page.evaluate(() => scrollY)).toBe(posunPred);
  await expect(blok.locator('.karta-osy[aria-pressed="true"]')).toHaveCount(0);

  // Klepnutí na dvě karty je prohodí (po tažení student chvíli počká; viz pouceni, Linux a CDP).
  await page.waitForTimeout(500);
  const ted = await poradiNaSnure(blok);
  await blok.locator('.karta-osy').nth(0).tap();
  await expect(blok.locator('.karta-osy').nth(0)).toHaveAttribute('aria-pressed', 'true');
  await blok.locator('.karta-osy').nth(4).tap();
  expect(await poradiNaSnure(blok)).toEqual([ted[4], ted[1], ted[2], ted[3], ted[0]]);

  // Cíle aspoň 44 px v obou hrách.
  const kdo = await priprav(page, KDO, 'KdoToRekl');
  for (const b of [blok, kdo]) {
    const male = await b.evaluate((e) => [...e.querySelectorAll('button, a')]
      .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 1 && (r.height < 44 || r.width < 44); })
      .map((x) => x.textContent?.trim().slice(0, 30)));
    expect(male).toEqual([]);
  }
  await kdo.locator('.razitko-odpoved').first().tap();
  await expect(kdo.locator('.razitko-odpoved').first()).toBeDisabled();
  await ctx.close();
});

test('bez localStorage obě hry fungují do zavření stránky', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } });
  });
  const chyby: string[] = [];
  page.on('pageerror', (e) => chyby.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const serad = await priprav(page, SERAD, 'SeradNaOse');
  await serad.getByRole('button', { name: 'Zkontrolovat pořadí' }).click();
  await expect(serad.getByRole('region', { name: 'Zkus to jinak' })).toBeVisible();
  const kdo = await priprav(page, KDO, 'KdoToRekl');
  for (let i = 0; i < 4 && !(await kdo.locator('.otocena').count()); i++) await kdo.locator('.razitko-odpoved:not(:disabled)').first().click();
  await expect(kdo.locator('.otocena')).toHaveCount(1);
  await kdo.getByRole('button', { name: 'Další karta' }).click();
  await expect(kdo.locator('.serie__postup')).toHaveText('Karta 2 z 5');
  expect(chyby).toEqual([]);
});

/** Animace delší než 1 ms v prvku (pouceni: přechody barev mají při omezeném pohybu 0,01 ms). */
const animaceV = (l: Locator) => l.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => Number(a.effect?.getTiming().duration) > 1).length);

for (const druh of ['pohyb', 'omezeny', 'klidny'] as const) {
  test(`herní pohyb: rozdání, otočení a otisk · ${druh}`, async ({ page }) => {
    if (druh === 'klidny') await page.addInitScript(() => localStorage.setItem('atlas-klidny', '1'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    await page.goto(STRANKA);
    const ceka = druh === 'pohyb';

    const kdo = await priprav(page, KDO, 'KdoToRekl');
    const jmena = await kdo.locator('.razitko-odpoved .odpoved__jmeno').allTextContents();
    await kdo.locator('.razitko-odpoved').nth(jmena.indexOf('Epiktétos')).click();
    const vnitrek = kdo.locator('.otocna__vnitrek');
    const delka = await vnitrek.evaluate((e) => parseFloat(getComputedStyle(e).transitionDuration));
    if (ceka) expect(delka).toBeGreaterThan(0.2);
    else expect(delka).toBeLessThan(0.001);
    if (ceka) expect(await kdo.locator('.kartka__otisk').evaluate((e) => e.getAnimations().length)).toBe(1);
    else expect(await animaceV(kdo.locator('.kartka__otisk'))).toBe(0);
    // Otočená karta je po chvíli celá otočená v každém režimu.
    await expect.poll(() => vnitrek.evaluate((e) => getComputedStyle(e).transform)).toMatch(/matrix3d\(-1/);
    await kdo.getByRole('button', { name: 'Další karta' }).click();
    const nova = kdo.locator('.otocna');
    if (ceka) expect(await nova.evaluate((e) => e.getAnimations().length)).toBe(1);
    else expect(await animaceV(nova)).toBe(0);

    const serad = await priprav(page, SERAD, 'SeradNaOse');
    await serad.getByRole('button', { name: 'Zkontrolovat pořadí' }).click();
    await serad.getByRole('button', { name: 'Začít znovu' }).click();
    // Rozdání po jedné jen v plném pohybu: karty dostanou třídu rozdat se zpožděním po --z-karta.
    if (ceka) {
      await expect(serad.locator('.misto.rozdat')).toHaveCount(5);
      const zpozdeni = await serad.locator('.misto.rozdat').nth(2).evaluate((e) => getComputedStyle(e).animationDelay);
      expect(parseFloat(zpozdeni)).toBeGreaterThan(0);
    } else {
      expect(await animaceV(serad.locator('.snura'))).toBe(0);
    }
    // Karty jsou na konci pohybu na svém místě a čitelné.
    await expect.poll(() => serad.locator('.misto').first().evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  });
}
