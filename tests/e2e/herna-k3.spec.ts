// Hry herny z K3 v dílně (herna-v1): Páry, Pravý, nebo podvržený?, Najdi slabé místo a Kdo by to řekl? na 390
// a 1440 px ve světlém i tmavém režimu. Jen klávesnicí → axe (WCAG 2 AA) → snímek → obnovení stránky; klepnutí
// a čáry, dotyk přes CDP, cíle 44 px, bez localStorage, plný a omezený pohyb a Klidný režim.
import { test, expect, type Page, type Locator, type CDPSession } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/dilna/bloky/';
const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;
const PARY = 'dilna-pary';
const PRAVY = 'dilna-pravy';
const SLABE = 'dilna-slabe-zapas';
const KDOBY = 'dilna-kdo-by-mene';
const KDOBY2 = 'dilna-kdo-by-uhel';

async function priprav(page: Page, id: string, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator(`astro-island[component-url*="/${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
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
    return { x: Math.max(0, b.x + scrollX - 12), y: b.y + scrollY - 24, width: Math.min(b.width + 24, document.documentElement.clientWidth), height: b.height + 36 };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}

const textFokusu = (page: Page) => page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, ' ').trim() ?? '');

/** Tabulátorem dál, dokud fokus nemá daný text (mezi plochou a patou může stát nabídka pera). */
async function tabNa(page: Page, text: string) {
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    if ((await textFokusu(page)).startsWith(text)) return;
  }
  throw new Error(`Tabulátor nedošel na „${text}“.`);
}

const deniky = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));

/** Páry z klávesnice: fokus na lístek pojmu, Tab do seznamu, napsat začátek situace, Tab na Spojit a Enter. */
async function spojKlavesnici(page: Page, blok: Locator, pojem: string, zacatek: string) {
  await blok.locator(`[data-pojem="${pojem}"] .par-listek`).focus();
  await page.keyboard.press('Tab');
  const seznam = blok.locator(`[data-pojem="${pojem}"] select`);
  await expect(seznam).toBeFocused();
  await expect(seznam).toBeVisible();
  await page.keyboard.type(zacatek);
  await expect(seznam.locator('option:checked')).toContainText(zacatek);
  await page.keyboard.press('Tab');
  await expect(blok.locator(`[data-pojem="${pojem}"] .par-vyber__spojit`)).toBeFocused();
  await page.keyboard.press('Enter');
}

const SPRAVNE: [string, string][] = [['v-nasi-moci', 'Zítra je zápas'], ['soud', 'Spolužák se'], ['stred', 'Na oslavě'], ['klid', 'Před přijímačkami']];

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`Páry jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, PARY, 'Pary');
      await expect(blok.locator('.par-listek--pojem')).toHaveCount(4);
      await expect(blok.locator('.par-listek--situace')).toHaveCount(6);
      // Pod pojmem první věta vysvětlení z kolekce pojmy; výběr ze seznamu je skrytý, dokud v lístku není fokus.
      await expect(blok.locator('[data-pojem="soud"]')).toContainText('Úsudek, který si o věci uděláš');
      await expect(blok.locator('[data-pojem="soud"] select')).not.toBeVisible();
      await axe(page, `[id="${PARY}"]`);
      await snimek(page, blok, `herna-pary-klid-${pr}`);

      // Past se stejným slovem: zkus to jinak s tím, co situace ukazuje; čárkovaná čára.
      await spojKlavesnici(page, blok, 'soud', 'Kamarád dostal');
      const zkus = blok.getByRole('region', { name: 'Zkus to jinak' });
      await expect(zkus).toContainText('Zkus to jinak.');
      await expect(zkus).toContainText('Tady je soud úřad');
      await expect(zkus).toBeFocused();
      await expect(blok.locator('.cara--vedle')).toHaveCount(1);
      await axe(page, `[id="${PARY}"]`);
      await snimek(page, blok, `herna-pary-zkus-${pr}`);

      for (const [p, z] of SPRAVNE) await spojKlavesnici(page, blok, p, z);
      const vazba = blok.getByRole('region', { name: 'Spojené páry' });
      await expect(vazba).toContainText('Sedí.');
      await expect(vazba).toBeFocused();
      await expect(vazba.locator('.vety-paru').first().locator('li')).toHaveCount(4);
      await expect(vazba).toContainText('A situace, které pojem jen připomínají');
      await expect(vazba).toContainText('Ataraxia není volno');
      await expect(blok.locator('.pary__otisk')).toHaveText('sedí');
      await expect(blok.locator('.cara:not(.cara--vedle)')).toHaveCount(4);
      await expect(blok.locator('.par-listek:not(:disabled)')).toHaveCount(0);
      await bezPresahu(page);
      await axe(page, `[id="${PARY}"]`);
      await snimek(page, blok, `herna-pary-sedi-${pr}`);

      // Obnovení drží páry i čáry; v deníku jen stav, žádný zápis.
      await page.reload();
      const znovu = await priprav(page, PARY, 'Pary');
      await expect(znovu.getByRole('region', { name: 'Spojené páry' })).toBeVisible();
      await expect(znovu.locator('.cara:not(.cara--vedle)')).toHaveCount(4);
      const d = await deniky(page);
      expect(d.bloky[PARY]).toMatchObject({ spojeno: ['v-nasi-moci', 'soud', 'stred', 'klid'], vedle: ['soud|past-1'], posledni: null, ukazano: false });
      expect(d.aktivita.find((a: { id: string }) => a.id === PARY)).toMatchObject({ druh: 'pary', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === PARY)).toBe(false);
      await znovu.getByRole('button', { name: 'Začít znovu' }).click();
      await expect(znovu.locator('.cara')).toHaveCount(0);
      expect((await deniky(page)).bloky?.[PARY]).toBeUndefined();
      expect(chyby).toEqual([]);
    });

    test(`Pravý, nebo podvržený? jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, PRAVY, 'PravyNeboPodvrzeny');
      await expect(blok.locator('.ustrizek')).toContainText('Vím, že nic nevím.');
      await expect(blok.locator('.ustrizek__oprava')).toHaveCount(0);
      await expect(blok.locator('.pripisuje')).toContainText('Sókratés Ukázal, že moudrost začíná přiznáním');
      await axe(page, `[id="${PRAVY}"]`);
      await snimek(page, blok, `herna-pravy-klid-${pr}`);

      // Ústřižek 1: „řekl to“ u přepsané věty. Oprava stojí přímo na ústřižku, původ v lístku.
      await blok.locator('.razitko-verdikt--rekl').focus();
      await page.keyboard.press('Enter');
      const lis = blok.getByRole('region', { name: 'Odkud věta je' });
      await expect(lis).toBeFocused();
      await expect(lis).toContainText('Takhle to neřekl.');
      await expect(lis).not.toContainText('Sedí.');
      await expect(lis).toContainText('Já nevím, ale ani si nemyslím, že vím.');
      await expect(lis).toContainText('Jak si citát ověřit:');
      await expect(blok.locator('.ustrizek__oprava')).toHaveText('Neřekl to takhle · Obrana Sókratova 21d');
      await expect(blok.locator('.razitko-verdikt--rekl')).toHaveAttribute('aria-pressed', 'true');
      await expect(blok.locator('.razitko-verdikt')).toHaveCount(2);
      await expect(blok.locator('.razitko-verdikt:not(:disabled)')).toHaveCount(0);
      await axe(page, `[id="${PRAVY}"]`);
      await snimek(page, blok, `herna-pravy-otisk-${pr}`);

      // Ústřižek 2 (pravý citát) „řekl to“: sedí. Dál „neřekl to“ až do konce série.
      await tabNa(page, 'Další ústřižek');
      await page.keyboard.press('Enter');
      await expect(blok.locator('.razitko-verdikt').first()).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(lis).toContainText('Sedí.');
      await expect(lis).toContainText('Řekl to.');
      await expect(blok.locator('.ustrizek__sedi')).toHaveText('sedí');
      for (let i = 0; i < 3; i++) {
        await tabNa(page, 'Další ústřižek');
        await page.keyboard.press('Enter');
        await expect(blok.locator('.razitko-verdikt--nerekl')).toBeEnabled();
        await blok.locator('.razitko-verdikt--nerekl').focus();
        await page.keyboard.press('Enter');
      }
      await expect(blok.getByRole('button', { name: 'Další ústřižek' })).toHaveCount(0);
      const souhrn = lis.locator('.souhrn li');
      await expect(souhrn).toHaveCount(5);
      // Každá věta v souhrnu má u sebe opravu nebo pramen.
      for (let i = 0; i < 5; i++) await expect(souhrn.nth(i).locator('.souhrn__oprava')).toHaveText(/^(Neřekl to|Řekl to)/);
      await expect(lis).toContainText('Neřekl to · Will Durant, 1926');
      await bezPresahu(page);
      await axe(page, `[id="${PRAVY}"]`);
      await snimek(page, blok, `herna-pravy-souhrn-${pr}`);

      await page.reload();
      const znovu = await priprav(page, PRAVY, 'PravyNeboPodvrzeny');
      await expect(znovu.locator('.souhrn li')).toHaveCount(5);
      const d = await deniky(page);
      expect(d.bloky[PRAVY]).toEqual({ karta: 4, tipy: ['rekl', 'rekl', 'nerekl', 'nerekl', 'nerekl'] });
      expect(d.aktivita.find((a: { id: string }) => a.id === PRAVY)).toMatchObject({ druh: 'pravy', hotovo: true });
      expect(d.zapisy.some((z: { id: string }) => z.id === PRAVY)).toBe(false);
      expect(chyby).toEqual([]);
    });

    test(`Najdi slabé místo jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, SLABE, 'NajdiSlabeMisto');
      await expect(blok.locator('button.veta-arg')).toHaveCount(2);
      await expect(blok.locator('.veta-arg--zaver')).toContainText('Jestli mě zítřek znepokojí');
      await expect(blok.getByRole('button', { name: 'Zapsat do deníku' })).toBeDisabled();
      await axe(page, `[id="${SLABE}"]`);
      await snimek(page, blok, `herna-slabe-klid-${pr}`);

      // Škrt přes druhou premisu: čára červenou tužkou po každém řádku věty, pak nepovinné proč.
      await blok.locator('button.veta-arg').nth(1).focus();
      await page.keyboard.press('Enter');
      await expect(blok.locator('button.veta-arg').nth(1)).toHaveAttribute('aria-pressed', 'true');
      await expect(blok.locator('.skrt__tah')).not.toHaveCount(0);
      // Žádné hlasy před zápisem: nic se neodkryje dřív, než se student rozhodne.
      await expect(blok.locator('.hlas-herny')).toHaveCount(0);
      await tabNa(page, 'Žádnou');
      await page.keyboard.press('Tab');
      await expect(blok.locator('textarea')).toBeFocused();
      await page.keyboard.type('První reakci nemám vždycky v rukou.');
      await axe(page, `[id="${SLABE}"]`);
      await snimek(page, blok, `herna-slabe-skrt-${pr}`);
      await tabNa(page, 'Zapsat do deníku');
      await page.keyboard.press('Enter');
      const hlasy = blok.getByRole('region', { name: 'Kdo stál s tebou' });
      await expect(hlasy).toBeFocused();
      await expect(hlasy).toContainText('Kdo by tu větu škrtl s tebou');
      await expect(hlasy).toContainText('Aristotelés');
      await expect(hlasy).toContainText(`Etika Nikomachova VII, 6, 1149a25–29`);
      await expect(hlasy).toContainText('Kdo ji hájil');
      await expect(hlasy).toContainText('Marcus Aurelius');
      await expect(blok.locator('.tvuj-duvod')).toContainText('První reakci nemám vždycky v rukou.');
      await bezPresahu(page);
      await axe(page, `[id="${SLABE}"]`);
      await snimek(page, blok, `herna-slabe-hlasy-${pr}`);

      await page.reload();
      const znovu = await priprav(page, SLABE, 'NajdiSlabeMisto');
      await expect(znovu.locator('.skrt__tah')).not.toHaveCount(0);
      await expect(znovu.getByRole('region', { name: 'Kdo stál s tebou' })).toBeVisible();
      const d = await deniky(page);
      const z = d.zapisy.find((x: { id: string }) => x.id === SLABE);
      expect(z).toMatchObject({ druh: 'slabe', otazka: 'Kterou větu škrtáš?', odpoved: 'Škrtám větu: „Své soudy máme ve své moci“. Proč: První reakci nemám vždycky v rukou.' });
      await znovu.getByRole('button', { name: 'Začít znovu' }).click();
      await expect(znovu.locator('.skrt__tah')).toHaveCount(0);
      expect((await deniky(page)).zapisy.some((x: { id: string }) => x.id === SLABE)).toBe(false);
      expect(chyby).toEqual([]);
    });

    test(`Kdo by to řekl? jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));
      await page.goto(STRANKA);
      const blok = await priprav(page, KDOBY, 'KdoByToRekl');
      await expect(blok.locator('.vystrizek-dnes--plakat')).toContainText('Méně je víc.');
      await expect(blok.locator('.vystrizek-dnes__odkud')).toHaveText('Reklama na malý byt');
      await expect(blok.locator('.razitko-volby')).toHaveCount(3);
      await expect(blok.locator('.razitko-volby', { hasText: 'Diogenés' })).toContainText('Ukazoval na sobě');
      await expect(blok.locator('.hlas-herny')).toHaveCount(0);
      await axe(page, `[id="${KDOBY}"]`);
      await snimek(page, blok, `herna-kdoby-klid-${pr}`);

      const ma = (l: Locator) => l.evaluate((e) => e === document.activeElement);
      const epikuros = blok.locator('.razitko-volby', { hasText: 'Epikúros' });
      await blok.locator('.razitko-volby').first().focus();
      for (let i = 0; i < 4 && !(await ma(epikuros)); i++) await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await expect(epikuros).toHaveAttribute('aria-pressed', 'true');
      for (let i = 0; i < 6 && !(await ma(blok.locator('textarea'))); i++) await page.keyboard.press('Tab');
      await expect(blok.locator('textarea')).toBeFocused();
      await page.keyboard.type('Jde o touhy, ne o byt.');
      await axe(page, `[id="${KDOBY}"]`);
      await snimek(page, blok, `herna-kdoby-vyber-${pr}`);
      await tabNa(page, 'Zapsat do deníku');
      await page.keyboard.press('Enter');
      const lis = blok.getByRole('region', { name: 'Atlas by vybral' });
      await expect(lis).toBeFocused();
      await expect(lis).toContainText('Tvůj výběr: Epikúros');
      await expect(lis).toContainText('Atlas by vybral…');
      await expect(lis.locator('.hlas-herny')).toHaveCount(3);
      await expect(lis).toContainText('Kdo by větu odmítl');
      await expect(lis).toContainText('Zapsal Diogenés Laertios: Životy filozofů VI, 104');
      await expect(lis).toContainText('Etika Nikomachova I, 8, 1099a31–33');
      await expect(lis).not.toContainText(/správn|špatn|Sedí/);
      await bezPresahu(page);
      await axe(page, `[id="${KDOBY}"]`);
      await snimek(page, blok, `herna-kdoby-atlas-${pr}`);

      await page.reload();
      const znovu = await priprav(page, KDOBY, 'KdoByToRekl');
      await expect(znovu.getByRole('region', { name: 'Atlas by vybral' })).toBeVisible();
      const d = await deniky(page);
      expect(d.zapisy.find((x: { id: string }) => x.id === KDOBY)).toMatchObject({
        druh: 'kdo-by', otazka: 'Kdo z nich by tu větu podepsal? „Méně je víc“', odpoved: 'Můj výběr: Epikúros. Proč: Jde o touhy, ne o byt.',
      });
      expect(d.aktivita.find((a: { id: string }) => a.id === KDOBY)).toMatchObject({ druh: 'kdo-by', hotovo: true });
      // Bublina komentáře u druhé věty.
      const bublina = await priprav(page, KDOBY2, 'KdoByToRekl');
      await expect(bublina.locator('.vystrizek-dnes--bublina')).toContainText('Komentář pod videem');
      await axe(page, `[id="${KDOBY2}"]`);
      expect(chyby).toEqual([]);
    });
  }
}

test('Páry: klepnutí v obou pořadích, čára tužkou, po třech párech vedle Ukázat páry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, PARY, 'Pary');
  const pojem = (p: string) => blok.locator(`[data-pojem="${p}"] .par-listek`);
  const situace = (s: string) => blok.locator(`[data-situace="${s}"] .par-listek`);
  // Klepnutí myší na pojem neukáže výběr ze seznamu (ten je jen pro klávesnici).
  await pojem('klid').click();
  await expect(pojem('klid')).toHaveAttribute('aria-pressed', 'true');
  await expect(blok.locator('[data-pojem="klid"] select')).not.toBeVisible();
  await situace('klid').click();
  await expect(blok.locator('.cara:not(.cara--vedle)')).toHaveCount(1);
  await expect(pojem('klid')).toBeDisabled();
  // Situace první, pojem potom; tři páry vedle.
  for (const [s, p] of [['past-2', 'soud'], ['stred', 'soud'], ['soud', 'stred']]) {
    await situace(s).click();
    await pojem(p).click();
    await expect(blok.getByRole('region', { name: 'Zkus to jinak' })).toBeVisible();
  }
  await expect(blok.locator('.cara--vedle')).toHaveCount(1);
  await blok.getByRole('button', { name: 'Ukázat páry' }).click();
  const vazba = blok.getByRole('region', { name: 'Spojené páry' });
  await expect(vazba).toContainText('Takhle to sedí.');
  await expect(blok.locator('.pary__otisk')).toHaveCount(0);
  await expect(blok.locator('.cara:not(.cara--vedle)')).toHaveCount(4);
});

test('Najdi slabé místo: „Žádnou, argument mi drží“ ukáže zastánce i to, kdo by ho napadl', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const blok = await priprav(page, SLABE, 'NajdiSlabeMisto');
  await blok.locator('button.veta-arg').first().click();
  await expect(blok.locator('.skrt__tah')).not.toHaveCount(0);
  await blok.getByRole('button', { name: 'Žádnou, argument mi drží' }).click();
  await expect(blok.locator('.skrt__tah')).toHaveCount(0);
  await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
  const hlasy = blok.getByRole('region', { name: 'Kdo stál s tebou' });
  await expect(hlasy).toContainText('Kdo stál s argumentem');
  await expect(hlasy).toContainText('Epiktétos');
  await expect(hlasy.locator('.napadl li')).toHaveCount(2);
  const d = await deniky(page);
  expect(d.zapisy.find((x: { id: string }) => x.id === SLABE).odpoved).toBe('Neškrtám nic, argument mi drží.');
});

/** Klepnutí prstem přes CDP; vrací scrollY změřené před koncem dotyku. */
async function klepniPrstem(page: Page, cdp: CDPSession, l: Locator): Promise<number> {
  await l.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const b = (await l.boundingBox())!;
  const bod = [{ x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2), id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod });
  const pred = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return pred;
}

test('dotyk přes CDP na telefonu a cíle 44 px ve všech čtyřech', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(STRANKA);
  const cdp = await ctx.newCDPSession(page);

  const pary = await priprav(page, PARY, 'Pary');
  const y = await klepniPrstem(page, cdp, pary.locator('[data-pojem="stred"] .par-listek'));
  // Výběr pojmu stránkou nepohne.
  expect(await page.evaluate(() => scrollY)).toBe(y);
  await expect(pary.locator('[data-pojem="stred"] .par-listek')).toHaveAttribute('aria-pressed', 'true');
  await klepniPrstem(page, cdp, pary.locator('[data-situace="stred"] .par-listek'));
  await expect(pary.locator('.cara:not(.cara--vedle)')).toHaveCount(1);
  // Pár vedle: scrollY před koncem dotyku stojí, po něm jde fokus na lístek.
  await klepniPrstem(page, cdp, pary.locator('[data-pojem="klid"] .par-listek'));
  await klepniPrstem(page, cdp, pary.locator('[data-situace="past-2"] .par-listek'));
  await expect(pary.getByRole('region', { name: 'Zkus to jinak' })).toBeFocused();

  const pravy = await priprav(page, PRAVY, 'PravyNeboPodvrzeny');
  await klepniPrstem(page, cdp, pravy.locator('.razitko-verdikt--nerekl'));
  await expect(pravy.getByRole('region', { name: 'Odkud věta je' })).toContainText('Sedí.');

  const slabe = await priprav(page, SLABE, 'NajdiSlabeMisto');
  await klepniPrstem(page, cdp, slabe.locator('button.veta-arg').first());
  await expect(slabe.locator('.skrt__tah')).not.toHaveCount(0);

  const kdoby = await priprav(page, KDOBY, 'KdoByToRekl');
  await klepniPrstem(page, cdp, kdoby.locator('.razitko-volby').first());
  await expect(kdoby.locator('.razitko-volby').first()).toHaveAttribute('aria-pressed', 'true');

  for (const b of [pary, pravy, slabe, kdoby]) {
    const male = await b.evaluate((e) => [...e.querySelectorAll('button, a, select, textarea')]
      .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 1 && (r.height < 44 || r.width < 44); })
      .map((x) => x.textContent?.trim().slice(0, 30) || x.className));
    expect(male).toEqual([]);
  }
  await ctx.close();
});

test('bez localStorage všechny čtyři fungují do zavření stránky', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } });
  });
  const chyby: string[] = [];
  page.on('pageerror', (e) => chyby.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(STRANKA);
  const pary = await priprav(page, PARY, 'Pary');
  await pary.locator('[data-pojem="soud"] .par-listek').click();
  await pary.locator('[data-situace="soud"] .par-listek').click();
  await expect(pary.locator('.cara')).toHaveCount(1);
  const pravy = await priprav(page, PRAVY, 'PravyNeboPodvrzeny');
  await pravy.locator('.razitko-verdikt--nerekl').click();
  await expect(pravy.getByRole('region', { name: 'Odkud věta je' })).toBeVisible();
  const slabe = await priprav(page, SLABE, 'NajdiSlabeMisto');
  await slabe.locator('button.veta-arg').first().click();
  await slabe.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(slabe.getByRole('region', { name: 'Kdo stál s tebou' })).toBeVisible();
  const kdoby = await priprav(page, KDOBY, 'KdoByToRekl');
  await kdoby.locator('.razitko-volby').first().click();
  await kdoby.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(kdoby.getByRole('region', { name: 'Atlas by vybral' })).toBeVisible();
  expect(chyby).toEqual([]);
});

/** Animace delší než 1 ms v prvku (pouceni: přechody barev mají při omezeném pohybu 0,01 ms). */
const animaceV = (l: Locator) => l.evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => Number(a.effect?.getTiming().duration) > 1).length);

for (const druh of ['pohyb', 'omezeny', 'klidny'] as const) {
  test(`tah tužky a otisky v K3 · ${druh}`, async ({ page }) => {
    if (druh === 'klidny') await page.addInitScript(() => localStorage.setItem('atlas-klidny', '1'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    await page.goto(STRANKA);
    const pary = await priprav(page, PARY, 'Pary');
    await pary.locator('[data-pojem="soud"] .par-listek').click();
    await pary.locator('[data-situace="soud"] .par-listek').click();
    const cara = pary.locator('.cara').first();
    const pravy = await priprav(page, PRAVY, 'PravyNeboPodvrzeny');
    await pravy.locator('.razitko-verdikt--nerekl').click();
    const slabe = await priprav(page, SLABE, 'NajdiSlabeMisto');
    await slabe.locator('button.veta-arg').first().click();
    const skrt = slabe.locator('.skrt__tah').first();
    for (const o of [cara, pravy.locator('.otisk-studenta'), pravy.locator('.ustrizek__sedi'), skrt]) {
      if (druh === 'pohyb') expect(await o.evaluate((e) => e.getAnimations().length)).toBe(1);
      else expect(await animaceV(o)).toBe(0);
    }
    // Klidný režim srovná natočení ústřižku.
    const nat = await pravy.locator('.ustrizek').evaluate((e) => getComputedStyle(e).rotate);
    if (druh === 'klidny') expect(['none', '0deg']).toContain(nat);
  });
}
