// Kresby s pohybem v cestě 3: jeskyně ve dvou pohledech (krok 1) a cesta ven s posuvníkem (krok 3).
// Pohyb, zastavení, klávesnice a omezený pohyb; obě šířky ve světlém i tmavém režimu s axe,
// bez vodorovného posouvání a se snímky každého pohledu.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CESTA = '/cesta/je-to-co-vidim-cela-skutecnost/';

async function priprav(page: Page, krok = 1, id = 'jeskyne-pohledy') {
  await page.goto(`${CESTA}${krok}/`);
  await page.evaluate(() => document.fonts.ready);
  const kresba = page.locator(`#${id}`);
  await kresba.scrollIntoViewIfNeeded();
  // Ostrov kresby se hydratuje, až je vidět; ostatní ostrovy kroku na řadu přijít nemusí.
  await page.waitForFunction((i) => {
    const ostrov = document.getElementById(i)?.closest('astro-island');
    return !!ostrov && !ostrov.hasAttribute('ssr');
  }, id);
  return kresba;
}

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`kresba jeskyně · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page);
      const r = rezim === 'light' ? 'svetly' : 'tmavy';
      // Pevné lišty by na snímku ležely přes kresbu.
      await page.addStyleTag({ content: '.cesta-lista, .cesta-hlavicka, header.hlavicka { visibility: hidden !important; }' });

      // Výchozí je pohled vězňů: student sedí mezi nimi. Text pod kresbou říká totéž slovy.
      await expect(kresba.getByRole('radio', { name: 'Pohled vězňů' })).toBeChecked();
      await expect(kresba.locator('.kresba__popis')).toContainText('Sedíš mezi vězni a vidíš to, co oni');
      await expect(kresba.locator('svg .pohled-vezni')).toHaveCount(1);
      await expect(kresba.getByRole('img', { name: 'Pohled vězňů' })).toBeVisible();
      await kresba.screenshot({ path: `test-results/snimky/jeskyne-vezni-${sirka}-${r}.png` });

      await kresba.getByRole('radio', { name: 'Pohled z boku' }).check({ force: true });
      await expect(kresba.locator('.kresba__popis')).toContainText('Tenhle pohled nemá žádný z nich. Ty jsi ho před chvílí taky neměl.');
      await expect(kresba.locator('svg .pohled-bok')).toHaveCount(1);
      await expect(kresba.locator('svg .pohled-vezni')).toHaveCount(0);
      await expect(kresba.locator('svg text.k-popisek')).toHaveText(['oheň', 'nosiči za zídkou', 'vězni', 'stěna']);
      // Popisky v kresbě se nepřekrývají a nevyčnívají z ní.
      const ram = (await kresba.locator('svg').boundingBox())!;
      const popisky = await kresba.locator('svg text.k-popisek').evaluateAll((t) => t.map((x) => { const b = x.getBoundingClientRect(); return { l: b.left, p: b.right }; }));
      for (let i = 0; i < popisky.length; i++) {
        expect(popisky[i].l).toBeGreaterThanOrEqual(ram.x);
        expect(popisky[i].p).toBeLessThanOrEqual(ram.x + ram.width);
        if (i) expect(popisky[i].l, `popisek ${i}`).toBeGreaterThan(popisky[i - 1].p + 2);
      }
      await kresba.screenshot({ path: `test-results/snimky/jeskyne-bok-${sirka}-${r}.png` });

      // Přepínač má dotykové cíle aspoň 44 px; při omezeném pohybu kresba stojí a tlačítko pohybu chybí.
      for (const b of await kresba.locator('.kresba__prepinac span').evaluateAll((s) => s.map((x) => x.getBoundingClientRect().height))) expect(b).toBeGreaterThanOrEqual(44);
      await expect(kresba).not.toHaveClass(/kresba--pohyb/);
      await expect(kresba.getByRole('button')).toHaveCount(0);

      const axe = await new AxeBuilder({ page }).include('#jeskyne-pohledy').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });
  }
}

test('kresba jeskyně: stíny se hýbou, pohyb jde zastavit a pustit; ovládání jen klávesnicí', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  const stav = (selektor: string) => kresba.locator(selektor).first().evaluate((e) => getComputedStyle(e).animationPlayState);
  const posun = () => kresba.locator('.pruvod').evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);

  // Po načtení se průvod stínů hýbe.
  await expect(kresba).toHaveClass(/kresba--pohyb/);
  const tlacitko = kresba.getByRole('button', { name: 'Zastavit pohyb' });
  await expect(tlacitko).toBeVisible();
  expect(await stav('.pruvod')).toBe('running');
  const a = await posun();
  await page.waitForTimeout(700);
  expect(await posun()).toBeLessThan(a);

  // Zastavit: stíny zůstanou stát tam, kde byly; tlačítko se změní.
  await tlacitko.focus();
  await page.keyboard.press('Enter');
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeFocused();
  expect(await stav('.pruvod')).toBe('paused');
  // Zastavení se projeví s dalším snímkem prohlížeče; polohu čteme až po něm.
  await page.waitForTimeout(150);
  const b = await posun();
  await page.waitForTimeout(400);
  expect(await posun()).toBe(b);
  expect(b).toBeLessThan(0);

  // Druhý pohled šipkou: přepínač je jedna zastávka tabulátoru. Oheň stojí, dokud je pohyb zastavený.
  await kresba.getByRole('radio', { name: 'Pohled vězňů' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Pohled z boku' })).toBeChecked();
  await expect(kresba.getByRole('img', { name: 'Pohled z boku' })).toBeVisible();
  expect(await stav('.plamen')).toBe('paused');
  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeFocused();
  // Prvek s fokusem nezůstane pod pevnou spodní lištou kroku.
  const dole = await kresba.getByRole('button').evaluate((e) => e.getBoundingClientRect().bottom);
  const lista = await page.locator('.cesta-lista').evaluate((e) => e.getBoundingClientRect().top);
  expect(dole).toBeLessThanOrEqual(lista);
  await page.keyboard.press('Space');
  await expect(kresba.getByRole('button', { name: 'Zastavit pohyb' })).toBeVisible();
  expect(await stav('.plamen')).toBe('running');
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`kresba cesty ven · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page, 3, 'jeskyne-ven');
      const r = rezim === 'light' ? 'svetly' : 'tmavy';
      await page.addStyleTag({ content: '.cesta-lista, .cesta-hlavicka, header.hlavicka { visibility: hidden !important; }' });

      // Výchozí je řez jeskyní: vězně někdo vleče, sám se neosvobodí. Posuvník patří až pohledu Venku.
      await expect(kresba.getByRole('radio', { name: 'Cesta ven' })).toBeChecked();
      await expect(kresba.locator('.kresba__popis')).toHaveText(/^Někdo vězně rozváže.*násilím vleče strmou cestou/);
      await expect(kresba.locator('svg text')).toHaveText(['venku', 'strmá cesta', 'oheň', 'vězni']);
      await expect(kresba.getByRole('slider')).toHaveCount(0);
      await kresba.screenshot({ path: `test-results/snimky/jeskyne-ven-cesta-${sirka}-${r}.png` });

      await kresba.getByRole('radio', { name: 'Venku' }).check({ force: true });
      const posuvnik = kresba.getByRole('slider', { name: 'Posuň: oči si zvykají' });
      const vrstva = (n: string) => kresba.locator(`svg .${n}`).evaluate((e) => Number(getComputedStyle(e).opacity));
      // Venku nejdřív nevidí nic; pak stíny, odrazy, věci, noční nebe a až nakonec slunce (Ústava 516a–b).
      const STUPNE = [
        ['záře', 'nevidí vůbec nic'], ['stíny', 'Jako první rozezná stíny.'], ['odrazy ve vodě', 'odrazy lidí a věcí ve vodě'],
        ['věci samé', 'Pak uvidí věci samé.'], ['noční nebe', 'světlo hvězd a měsíce'], ['slunce', 'Slunce samo uvidí až nakonec.'],
      ];
      for (let i = 0; i < STUPNE.length; i++) {
        await posuvnik.fill(String(i));
        await expect(posuvnik).toHaveAttribute('aria-valuetext', STUPNE[i][0]);
        await expect(kresba.locator('output')).toHaveText(`${i + 1} z 6 · ${STUPNE[i][0]}`);
        await expect(kresba.locator('.kresba__popis')).toContainText(STUPNE[i][1]);
        // I při omezeném pohybu trvá přechod okamžik: na hodnotu se čeká.
        await expect.poll(() => vrstva('zare-venku')).toBe(i === 0 ? 1 : 0);
        await expect.poll(() => vrstva('slunce')).toBe(i === 5 ? 1 : 0);
        await expect.poll(() => vrstva('noc')).toBe(i === 4 ? 1 : 0);
        await expect.poll(() => vrstva('veci')).toBe(i >= 3 ? 1 : i >= 1 ? 0.08 : 0);
        await expect.poll(() => vrstva('voda')).toBe(i >= 2 ? 1 : 0);
        await kresba.screenshot({ path: `test-results/snimky/jeskyne-ven-venku${i + 1}-${sirka}-${r}.png` });
      }
      // Dotykové cíle aspoň 44 px; při omezeném pohybu kresba stojí a tlačítko pohybu chybí.
      expect(await posuvnik.evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
      await expect(kresba).not.toHaveClass(/kresba--pohyb/);
      await expect(kresba.getByRole('button')).toHaveCount(0);

      const axe = await new AxeBuilder({ page }).include('#jeskyne-ven').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });
  }
}

test('kresba cesty ven: dvojice jde nahoru, pohyb jde zastavit; přepínač a posuvník jen klávesnicí', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page, 3, 'jeskyne-ven');
  const stav = (selektor: string) => kresba.locator(selektor).first().evaluate((e) => getComputedStyle(e).animationPlayState);
  const kde = () => kresba.locator('.dvojice').evaluate((e) => { const m = new DOMMatrixReadOnly(getComputedStyle(e).transform); return { x: m.m41, y: m.m42 }; });

  // Dvojice vychází od vězňů a jde doleva k cestě nahoru.
  await expect(kresba).toHaveClass(/kresba--pohyb/);
  expect(await stav('.dvojice')).toBe('running');
  await page.waitForTimeout(2200);
  const a = await kde();
  await page.waitForTimeout(600);
  expect((await kde()).x).toBeLessThan(a.x);
  await kresba.getByRole('button', { name: 'Zastavit pohyb' }).focus();
  await page.keyboard.press('Enter');
  expect(await stav('.dvojice')).toBe('paused');

  // Šipkou na druhý pohled, tabulátorem na posuvník, šipkami po stupních, End na slunce.
  await kresba.getByRole('radio', { name: 'Cesta ven' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Venku' })).toBeChecked();
  await page.keyboard.press('Tab');
  const posuvnik = kresba.getByRole('slider');
  await expect(posuvnik).toBeFocused();
  await expect(kresba.locator('output')).toHaveText('1 z 6 · záře');
  await page.keyboard.press('ArrowRight');
  await expect(kresba.locator('output')).toHaveText('2 z 6 · stíny');
  await expect(kresba.locator('.kresba__popis')).toContainText('I venku začíná u nich.');
  await page.keyboard.press('End');
  await expect(kresba.locator('output')).toHaveText('6 z 6 · slunce');
  await page.keyboard.press('ArrowLeft');
  await expect(kresba.locator('output')).toHaveText('5 z 6 · noční nebe');
  // Zastavený pohyb platí i pro druhý pohled: hvězdy stojí, dokud ho student nepustí.
  expect(await stav('.hvezda')).toBe('paused');
  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeFocused();
  const dole = await kresba.getByRole('button').evaluate((e) => e.getBoundingClientRect().bottom);
  const lista = await page.locator('.cesta-lista').evaluate((e) => e.getBoundingClientRect().top);
  expect(dole).toBeLessThanOrEqual(lista);
  await page.keyboard.press('Enter');
  expect(await stav('.hvezda')).toBe('running');
});

test('cesta ven zastavená hned po načtení ukáže totéž co při omezeném pohybu: vězně na strmé cestě', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const kde = async (kresba: ReturnType<Page['locator']>) => kresba.locator('.dvojice').evaluate((e) => { const m = new DOMMatrixReadOnly(getComputedStyle(e).transform); return { x: Math.round(m.m41), y: Math.round(m.m42) }; });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const klid = await kde(await priprav(page, 3, 'jeskyne-ven'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page, 3, 'jeskyne-ven');
  await kresba.getByRole('button', { name: 'Zastavit pohyb' }).click();
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeVisible();
  // Revize antiky, nález 5: zastavená kresba nestojí na začátku smyčky dole mezi vězni.
  expect(await kresba.locator('.dvojice').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
  expect(await kde(kresba)).toEqual(klid);
  expect(klid).toEqual({ x: 104, y: 144 });
  await kresba.getByRole('button', { name: 'Pustit pohyb' }).click();
  expect(await kresba.locator('.dvojice').evaluate((e) => getComputedStyle(e).animationName)).toContain('dvojice');
});
