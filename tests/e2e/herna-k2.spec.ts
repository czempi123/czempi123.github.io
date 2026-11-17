// Hry herny z K2 v dílně (herna-v1): Tipni si, Kde to bylo? a Doplň citát na 390 a 1440 px ve světlém i tmavém
// režimu. Jen klávesnicí → axe (WCAG 2 AA) → snímek → obnovení stránky; tažení myší, dotyk přes CDP, bez
// localStorage, omezený pohyb a Klidný režim (otisk „sedí“ bez pohybu).
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/dilna/bloky/';
const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;
const TIPNI = 'dilna-tipni-thales-hypatia';
const TIPNI2 = 'dilna-tipni-epiktetos-marcus';
const KDE = 'dilna-kde-seneca';
const DOPLNIT = 'dilna-doplnit-reka';
const N = '\u00a0';

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

/** Tabulátorem dál, dokud fokus nemá daný text (mezi plochou a patou může stát nabídka pera). */
async function tabNa(page: Page, text: string) {
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    if ((await page.evaluate(() => document.activeElement?.textContent?.trim())) === text) return;
  }
  throw new Error(`Tabulátor nedošel na „${text}“.`);
}

/** Posuvník na hodnotu jen klávesnicí (Home a šipky). */
async function nastav(page: Page, blok: Locator, n: number) {
  await blok.locator('.pravitko__vstup').focus();
  await page.keyboard.press('Home');
  for (let i = 0; i < n; i++) await page.keyboard.press('ArrowRight');
  await expect(blok.locator('.pravitko__vstup')).toHaveValue(String(n));
}

const deniky = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
const prekryv = (a: DOMRect, b: DOMRect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`Tipni si jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, TIPNI, 'TipniSi');
      const vstup = blok.getByRole('slider', { name: 'Kolik lidských životů je mezi Thalétem a Hypatií?' });
      await expect(vstup).toHaveAttribute('max', '20');
      await expect(blok.getByRole('button', { name: 'Zkontrolovat odhad' })).toBeDisabled();
      await expect(blok.locator('.pravitko__pravda')).toHaveCount(0);
      await axe(page, `[id="${TIPNI}"]`);
      await snimek(page, blok, `herna-tipni-klid-${pr}`);

      // 0 = mohli se potkat: zkus to jinak se směrem.
      await nastav(page, blok, 0);
      await expect(vstup).toHaveAttribute('aria-valuetext', 'mohli se potkat');
      await tabNa(page, 'Zkontrolovat odhad');
      await page.keyboard.press('Enter');
      const zkus = blok.getByRole('region', { name: 'Zkus to jinak' });
      await expect(zkus).toContainText('Zkus to jinak.');
      await expect(zkus).toContainText('něco mezi nimi je');
      await expect(zkus).toBeFocused();
      await expect(blok.getByRole('button', { name: 'Zkontrolovat odhad' })).toBeDisabled();

      await nastav(page, blok, 3);
      await expect(vstup).toHaveAttribute('aria-valuetext', 'tři lidské životy');
      await tabNa(page, 'Zkontrolovat odhad');
      await page.keyboard.press('Enter');
      await expect(zkus).toContainText('Je jich víc, než myslíš.');
      await expect(blok.getByRole('button', { name: 'Ukázat, jak to bylo' })).toBeVisible();
      await axe(page, `[id="${TIPNI}"]`);
      await snimek(page, blok, `herna-tipni-zkus-${pr}`);

      // Sedí: ryska, svorka, otisk a věty z dat.
      await nastav(page, blok, 11);
      await tabNa(page, 'Zkontrolovat odhad');
      await page.keyboard.press('Enter');
      const vazba = blok.getByRole('region', { name: 'Jak daleko' });
      await expect(vazba).toContainText('Sedí.');
      await expect(vazba).toContainText(`Dělí je asi${N}915${N}let. To je asi dvanáct lidských životů.`);
      await expect(vazba).toContainText('skoro tisíc let');
      await expect(blok.locator('.pravitko__pravda')).toBeVisible();
      await expect(blok.locator('.pravitko__svorka')).toBeVisible();
      await expect(blok.locator('.pravitko__otisk')).toHaveText('sedí');
      await expect(vstup).toBeDisabled();
      await bezPresahu(page);
      await axe(page, `[id="${TIPNI}"]`);
      await snimek(page, blok, `herna-tipni-sedi-${pr}`);

      // Obnovení drží stav; v deníku jen stav, žádný zápis.
      await page.reload();
      const znovu = await priprav(page, TIPNI, 'TipniSi');
      await expect(znovu.locator('.pravitko__pravda')).toBeVisible();
      await expect(znovu.locator('.pravitko__vstup')).toHaveValue('11');
      const d = await deniky(page);
      expect(d.bloky[TIPNI]).toMatchObject({ odhad: 11, pokusy: [0, 3, 11], hotovo: true, ukazano: false });
      expect(d.aktivita.find((a: { id: string }) => a.id === TIPNI)).toMatchObject({ druh: 'tipni', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === TIPNI)).toBe(false);
      await znovu.getByRole('button', { name: 'Začít znovu' }).click();
      await expect(znovu.locator('.pravitko__pravda')).toHaveCount(0);
      expect((await deniky(page)).bloky?.[TIPNI]).toBeUndefined();
      expect(chyby).toEqual([]);
    });

    test(`Kde to bylo? jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, KDE, 'KdeToBylo');
      const mapa = blok.getByRole('application', { name: 'Slepá mapa' });
      await expect(blok.locator('.bod, .nazev')).toHaveCount(0);
      await axe(page, `[id="${KDE}"]`);
      await snimek(page, blok, `herna-kde-klid-${pr}`);

      // Kříž šipkami (vidět jen s fokusem), Enter položí špendlík.
      await mapa.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(blok.locator('.kriz')).toBeVisible();
      await page.keyboard.press('Shift+ArrowLeft');
      await page.keyboard.press('Enter');
      const vazba = blok.getByRole('region', { name: 'Kde to bylo' });
      await expect(vazba).toContainText(`Na Korsice žil Seneca ve vyhnanství v letech 41–49${N}n.${N}l.`);
      await expect(vazba).toContainText(/Tvůj špendlík je (přesně tam|blízko|kus dál|o moře dál)\./);
      await expect(vazba).not.toContainText(/km|bod/);
      await expect(vazba).toBeFocused();
      await expect(blok.locator('.nazev')).toHaveText('Korsika');
      await expect(blok.locator('.spojnice')).toHaveCount(1);
      // Popisky místa a tipu se nepotkají.
      const r = await blok.evaluate((e) => [...e.querySelectorAll('.nazev, .spendlik__popisek')].map((x) => x.getBoundingClientRect().toJSON()));
      if (r.length === 2) expect(prekryv(r[0], r[1])).toBe(false);
      await bezPresahu(page);
      await axe(page, `[id="${KDE}"]`);
      await snimek(page, blok, `herna-kde-tip-${pr}`);

      // Obnovení drží špendlík; pak klepnutí přímo na místo: „přesně tam“ a otisk.
      await page.reload();
      const znovu = await priprav(page, KDE, 'KdeToBylo');
      await expect(znovu.locator('.spendlik')).toHaveCount(1);
      // Poloha místa jako podíl šířky a výšky mapy (po Začít znovu se mapa na stránce posune).
      const podil = await znovu.locator('.slepa').evaluate((e) => {
        const r = e.getBoundingClientRect();
        const s = e.querySelector('.bod__stred')!.getBoundingClientRect();
        return { x: (s.left + s.width / 2 - r.left) / r.width, y: (s.top + s.height / 2 - r.top) / r.height };
      });
      await znovu.getByRole('button', { name: 'Začít znovu' }).click();
      await expect(znovu.locator('.spendlik')).toHaveCount(0);
      await znovu.locator('.slepa').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const rozmer = (await znovu.locator('.slepa').boundingBox())!;
      await znovu.locator('.slepa').click({ position: { x: podil.x * rozmer.width, y: podil.y * rozmer.height } });
      await expect(znovu.getByRole('region', { name: 'Kde to bylo' })).toContainText('Tvůj špendlík je přesně tam.');
      await expect(znovu.locator('.slepa__otisk')).toHaveText('sedí');
      await expect(znovu.locator('.spendlik__popisek')).toHaveCount(0);
      await snimek(page, znovu, `herna-kde-sedi-${pr}`);
      const d = await deniky(page);
      expect(d.aktivita.find((a: { id: string }) => a.id === KDE)).toMatchObject({ druh: 'kde', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === KDE)).toBe(false);
      expect(chyby).toEqual([]);
    });

    test(`Doplň citát jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, DOPLNIT, 'DoplnCitat');
      await expect(blok.locator('.vystrizek')).toHaveCount(3);
      await expect(blok.locator('.vzkaz')).toContainText('Na ty, kdo vstupují do');
      await expect(blok.locator('.vzkaz')).not.toContainText('týchž');
      await axe(page, `[id="${DOPLNIT}"]`);
      await snimek(page, blok, `herna-doplnit-klid-${pr}`);

      // Záměna: co by věta tvrdila; slovo stojí v mezeře a jde vyměnit.
      await blok.locator('.vystrizek').first().focus();
      while ((await page.evaluate(() => document.activeElement?.textContent?.trim())) !== 'různých') await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const zkus = blok.getByRole('region', { name: 'Zkus to jinak' });
      await expect(zkus).toContainText('Zkus to jinak.');
      await expect(zkus).toContainText('samozřejmost');
      await expect(zkus).toBeFocused();
      await expect(blok.locator('.vzkaz__mezera')).toContainText('různých');
      await axe(page, `[id="${DOPLNIT}"]`);
      await snimek(page, blok, `herna-doplnit-zkus-${pr}`);

      // Správné slovo: celý citát s místem, o čem je, a co by tvrdily záměny.
      await blok.locator('.vystrizek:not(:disabled)').first().focus();
      while ((await page.evaluate(() => document.activeElement?.textContent?.trim())) !== 'týchž') await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const cely = blok.getByRole('region', { name: 'Celý citát' });
      await expect(cely).toContainText('Sedí.');
      await expect(cely).toContainText('Řeka zůstává táž');
      await expect(cely).toContainText('Hérakleitos, zlomek B12');
      await expect(cely.locator('.kdyby li')).toHaveCount(2);
      await expect(blok.locator('.vzkaz__otisk')).toHaveText('sedí');
      await expect(blok.locator('.vystrizek:not(.vystrizek--vlozeny)')).toHaveCount(0);
      await bezPresahu(page);
      await axe(page, `[id="${DOPLNIT}"]`);
      await snimek(page, blok, `herna-doplnit-sedi-${pr}`);

      await page.reload();
      const znovu = await priprav(page, DOPLNIT, 'DoplnCitat');
      await expect(znovu.getByRole('region', { name: 'Celý citát' })).toBeVisible();
      const d = await deniky(page);
      expect(d.bloky[DOPLNIT]).toEqual({ vlozeno: ['různých', 'týchž'] });
      expect(d.zapisy.some((z: { id: string }) => z.id === DOPLNIT)).toBe(false);
      expect(chyby).toEqual([]);
    });
  }
}

test('Tipni si: dvakrát vedle, pak Ukázat, jak to bylo; vztah z dat', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, TIPNI2, 'TipniSi');
  for (const n of [4, 2]) {
    await nastav(page, blok, n);
    await blok.getByRole('button', { name: 'Zkontrolovat odhad' }).click();
    await expect(blok.getByRole('region', { name: 'Zkus to jinak' })).toContainText('nepřekrývají');
  }
  await blok.getByRole('button', { name: 'Ukázat, jak to bylo' }).click();
  const vazba = blok.getByRole('region', { name: 'Jak daleko' });
  await expect(vazba).toContainText('Takhle daleko od sebe jsou.');
  await expect(vazba).toContainText(`Žili současně asi${N}14${N}let.`);
  await expect(vazba).toContainText('Marcus Aurelius četl texty Epiktéta: Epiktétovy zápisky mu půjčil učitel Rusticus.');
  await expect(blok.locator('.pravitko__otisk')).toHaveCount(0);
});

test('Doplň citát: tažení myší do mezery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, DOPLNIT, 'DoplnCitat');
  const a = (await blok.locator('.vystrizek', { hasText: 'hlubokých' }).boundingBox())!;
  const m = (await blok.locator('.vzkaz__mezera').boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2, { steps: 3 });
  await expect(blok.locator('.vystrizek--tazeny')).toHaveCount(1);
  await page.mouse.move(m.x + m.width / 2, m.y + m.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(blok.locator('.vzkaz__mezera')).toContainText('hlubokých');
  await expect(blok.getByRole('region', { name: 'Zkus to jinak' })).toContainText('jak je řeka hluboká');
});

test('Kde to bylo? a Doplň citát: dotyk přes CDP na telefonu, cíle 44 px', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(STRANKA);
  const cdp = await ctx.newCDPSession(page);
  const bod = (x: number, y: number) => [{ x: Math.round(x), y: Math.round(y), id: 1 }];

  // Doplň citát: lístek prstem do mezery, stránka se při tom neposune.
  const doplnit = await priprav(page, DOPLNIT, 'DoplnCitat');
  await doplnit.locator('.vzkaz').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const l = doplnit.locator('.vystrizek', { hasText: 'týchž' });
  expect(await l.evaluate((e) => getComputedStyle(e).touchAction)).toBe('none');
  const a = (await l.boundingBox())!;
  const m = (await doplnit.locator('.vzkaz__mezera').boundingBox())!;
  const posun = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(a.x + a.width / 2, a.y + a.height / 2) });
  for (let i = 1; i <= 8; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: bod(a.x + a.width / 2 + ((m.x + m.width / 2 - a.x - a.width / 2) * i) / 8, a.y + a.height / 2 + ((m.y + m.height / 2 - a.y - a.height / 2) * i) / 8) });
  }
  // Během tažení se stránka neposune (potom ano: fokus jde na lístek zpětné vazby).
  expect(await page.evaluate(() => scrollY)).toBe(posun);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(doplnit.getByRole('region', { name: 'Celý citát' })).toBeVisible();

  // Kde to bylo?: klepnutí prstem položí špendlík.
  await page.waitForTimeout(500);
  const kde = await priprav(page, KDE, 'KdeToBylo');
  await kde.locator('.slepa').tap({ position: { x: 60, y: 60 } });
  await expect(kde.locator('.spendlik')).toHaveCount(1);

  // Cíle aspoň 44 px ve všech třech hrách.
  const tipni = await priprav(page, TIPNI, 'TipniSi');
  for (const b of [tipni, kde, await priprav(page, DOPLNIT, 'DoplnCitat')]) {
    const male = await b.evaluate((e) => [...e.querySelectorAll('button, a, input')]
      .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 1 && (r.height < 44 || r.width < 44); })
      .map((x) => x.textContent?.trim().slice(0, 30) || x.className));
    expect(male).toEqual([]);
  }
  await ctx.close();
});

test('bez localStorage všechny tři hry fungují do zavření stránky', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } });
  });
  const chyby: string[] = [];
  page.on('pageerror', (e) => chyby.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const tipni = await priprav(page, TIPNI, 'TipniSi');
  await nastav(page, tipni, 12);
  await tipni.getByRole('button', { name: 'Zkontrolovat odhad' }).click();
  await expect(tipni.getByRole('region', { name: 'Jak daleko' })).toBeVisible();
  const kde = await priprav(page, KDE, 'KdeToBylo');
  await kde.locator('.slepa').click({ position: { x: 40, y: 40 } });
  await expect(kde.getByRole('region', { name: 'Kde to bylo' })).toBeVisible();
  const doplnit = await priprav(page, DOPLNIT, 'DoplnCitat');
  await doplnit.locator('.vystrizek', { hasText: 'týchž' }).click();
  await expect(doplnit.getByRole('region', { name: 'Celý citát' })).toBeVisible();
  expect(chyby).toEqual([]);
});

/** Animace delší než 1 ms v prvku (pouceni: přechody barev mají při omezeném pohybu 0,01 ms). */
const animaceV = (l: Locator) => l.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => Number(a.effect?.getTiming().duration) > 1).length);

for (const druh of ['pohyb', 'omezeny', 'klidny'] as const) {
  test(`otisk „sedí“ v nových hrách · ${druh}`, async ({ page }) => {
    if (druh === 'klidny') await page.addInitScript(() => localStorage.setItem('atlas-klidny', '1'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    await page.goto(STRANKA);
    const tipni = await priprav(page, TIPNI, 'TipniSi');
    await nastav(page, tipni, 12);
    await tipni.getByRole('button', { name: 'Zkontrolovat odhad' }).click();
    const doplnit = await priprav(page, DOPLNIT, 'DoplnCitat');
    await doplnit.locator('.vystrizek', { hasText: 'týchž' }).click();
    for (const o of [tipni.locator('.pravitko__otisk'), doplnit.locator('.vzkaz__otisk')]) {
      if (druh === 'pohyb') expect(await o.evaluate((e) => e.getAnimations().length)).toBe(1);
      else expect(await animaceV(o)).toBe(0);
    }
    // Natočení papíru v Klidném režimu nula.
    const nat = await doplnit.locator('.vzkaz').evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--natoceni').trim());
    if (druh === 'klidny') expect(nat).toBe('0');
  });
}
