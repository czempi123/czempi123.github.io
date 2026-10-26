// Kresba „Třetí čára“ (cesta 7, krok 6): Aschův pokus. Karta se vzorem a karta se třemi čarami, osm židlí,
// odpovědi skupiny přicházejí jedna po druhé a zastaví se u studenta na předposlední židli. Pohled Se spojencem
// změní jednu odpověď. Kresba neukazuje odpověď studenta, výsledek pokusu ani obličeje. Obě šířky v obou režimech
// s axe a snímky, pohyb (běží, jde zastavit, při omezeném pohybu stojí), klávesnice. Logiku hlídá tests/data/treti-cara.test.ts.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CARY, PALEC, PLATNO, POPISY_CARY, TY, VZOR, odpovedi } from '../../src/lib/treti-cara';

const KROK = '/cesta/ci-zivot-vlastne-ziju/6/';
const ID = 'treti-cara';
const LISTY = 'header.hlavicka, nav.lista, .cesta-lista, .cesta-hlavicka, .obsah-lista { visibility: hidden !important; }';

async function priprav(page: Page) {
  await page.goto(KROK);
  await page.evaluate(() => document.fonts.ready);
  const kresba = page.locator(`#${ID}`);
  await kresba.scrollIntoViewIfNeeded();
  await page.waitForFunction((id) => {
    const ostrov = document.getElementById(id)?.closest('astro-island');
    return !!ostrov && !ostrov.hasAttribute('ssr');
  }, ID);
  return kresba;
}

/** Popisky a čísla v kresbě se nepřekrývají a leží celé v plátně. */
async function popiskyVolne(kresba: Locator) {
  const chyby = await kresba.locator('svg.kresba__platno').evaluate((svg) => {
    const platno = svg.getBoundingClientRect();
    const r = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    const ven: string[] = [];
    r.forEach((a, i) => {
      if (a.b.left < platno.left || a.b.right > platno.right || a.b.top < platno.top || a.b.bottom > platno.bottom) ven.push(`mimo plátno: ${a.t}`);
      for (const b of r.slice(i + 1)) if (a.b.left < b.b.right && b.b.left < a.b.right && a.b.top < b.b.bottom && b.b.top < a.b.bottom) ven.push(`${a.t} × ${b.t}`);
    });
    return ven;
  });
  expect(chyby).toEqual([]);
}

const textyBublin = (kresba: Locator) => kresba.locator('.bublina text').allTextContents();

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = rezim === 'light' ? 'svetly' : 'tmavy';
    test(`třetí čára · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page);
      await page.addStyleTag({ content: LISTY });
      const popis = kresba.locator('.kresba__popis');
      const pohledy = kresba.getByRole('radiogroup', { name: 'Třetí čára' });

      // Dva pohledy, výchozí Bez spojence. Při omezeném pohybu svítí všechny bubliny a tlačítko pohybu chybí.
      await expect(pohledy.getByRole('radio')).toHaveCount(2);
      await expect(pohledy.getByRole('radio', { name: 'Bez spojence' })).toBeChecked();
      await expect(kresba.getByRole('button')).toHaveCount(0);
      await expect(kresba).not.toHaveClass(/kresba--pohyb/);
      for (const v of await kresba.locator('.k-prepinac span').evaluateAll((s) => s.map((x) => x.getBoundingClientRect().height))) expect(v).toBeGreaterThanOrEqual(44);
      await expect(popis).toHaveText(POPISY_CARY.sam);
      expect(await textyBublin(kresba)).toEqual(odpovedi('sam').filter((o) => o !== null));
      for (const o of await kresba.locator('.bublina').evaluateAll((g) => g.map((e) => Number(getComputedStyle(e).opacity)))) expect(o).toBe(1);
      // Jednotka kresby vyjde na telefonu asi na pixel; délky čar drží poměr karty.
      const vyskyCar = await kresba.locator('rect.cara').evaluateAll((c) => c.map((e) => e.getBoundingClientRect().height));
      const k = vyskyCar[0] / VZOR.delka;
      expect(vyskyCar.slice(1).map((v) => Math.round(v / k))).toEqual(CARY.map((c) => c.delka));
      expect(vyskyCar[3]).toBeCloseTo(vyskyCar[0], 0);
      if (sirka === 390) expect(k).toBeGreaterThan(0.9);
      expect(PALEC).toBeGreaterThan(0);
      // Student sedí předposlední a má otazník; obličeje ani smích kresba nemá.
      await expect(kresba.locator('.postava')).toHaveCount(8);
      await expect(kresba.locator('.postava').nth(TY)).toHaveClass(/postava--ty/);
      await expect(kresba.locator('.bublina--ty text')).toHaveText('?');
      await expect(kresba).not.toContainText(/smě|ovce|procent|%/i);
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/treti-cara-sam-${sirka}-${r}.png` });

      // Se spojencem: změní se jediná bublina, čtvrtá v řadě řekne trojku.
      await pohledy.getByRole('radio', { name: 'Se spojencem' }).check({ force: true });
      await expect(popis).toHaveText(POPISY_CARY.spojenec);
      expect(await textyBublin(kresba)).toEqual(odpovedi('spojenec').filter((o) => o !== null));
      await expect(kresba.locator('.bublina--ty text')).toHaveText('?');
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/treti-cara-spojenec-${sirka}-${r}.png` });

      const axe = await new AxeBuilder({ page }).include(`#${ID}`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      expect(PLATNO.sirka).toBe(340);
    });
  }
}

test('třetí čára: bubliny přicházejí jedna po druhé a jdou zastavit; přepínač klávesnicí; kresba není blok', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  const popis = kresba.locator('.kresba__popis');

  // Samy se hýbou jen bubliny; každá má svůj čas, takže nesvítí všechny naráz.
  await expect(kresba).toHaveClass(/kresba--pohyb/);
  const animovane = await kresba.locator('svg.kresba__platno *').evaluateAll((p) => p.filter((e) => getComputedStyle(e).animationName !== 'none').map((e) => e.getAttribute('class')));
  expect(animovane).toHaveLength(7);
  for (const c of animovane) expect(c).toContain('bublina');
  expect(await kresba.locator('.bublina').first().evaluate((e) => getComputedStyle(e).animationDuration)).toBe('8s');
  await expect.poll(async () => {
    const o = await kresba.locator('.bublina').evaluateAll((g) => g.map((e) => Number(getComputedStyle(e).opacity)));
    return o.some((x) => x > 0.9) && o.some((x) => x < 0.1);
  }, { timeout: 6000 }).toBe(true);
  const stav = () => kresba.locator('.bublina').first().evaluate((e) => getComputedStyle(e).animationPlayState);
  expect(await stav()).toBe('running');
  const pohyb = kresba.getByRole('button', { name: 'Zastavit pohyb' });
  expect((await pohyb.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await pohyb.click();
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeVisible();
  expect(await stav()).toBe('paused');
  const svit = () => kresba.locator('.bublina').evaluateAll((g) => new Promise<string>((ok) => requestAnimationFrame(() => ok(g.map((e) => getComputedStyle(e).opacity).join(',')))));
  const prvni = await svit();
  await page.waitForTimeout(400);
  expect(await svit()).toBe(prvni);

  // Přepínač pohledů jde šipkami.
  await kresba.getByRole('radio', { name: 'Bez spojence' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Se spojencem' })).toBeChecked();
  await expect(popis).toHaveText(POPISY_CARY.spojenec);

  // Kresba není blok: nic neukládá a nenabízí Kam dál. Stojí nad Volbou, výsledky jsou až pod ní.
  await expect(kresba).not.toHaveClass(/\bblok\b/);
  await expect(kresba.getByRole('navigation')).toHaveCount(0);
  expect(await page.evaluate(() => {
    const k = document.getElementById('treti-cara')!;
    const v = document.getElementById('cesta7-tvoje-rada')!;
    const h = document.getElementById('co-vyslo')!;
    return !!(k.compareDocumentPosition(v) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(v.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING);
  })).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{"zapisy":[]}').zapisy.length)).toBe(0);
});

test('třetí čára zastavená hned po načtení ukáže totéž co při omezeném pohybu: všechny odpovědi a otazník nad tebou', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  await kresba.getByRole('button', { name: 'Zastavit pohyb' }).click();
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeVisible();
  // Nic nesvítí napůl a nic nečeká na pohyb (revize antiky, nález 5).
  expect(await kresba.locator('.bublina').evaluateAll((g) => g.every((e) => getComputedStyle(e).animationName === 'none' && getComputedStyle(e).opacity === '1'))).toBe(true);
  await expect(kresba.locator('.bublina')).toHaveCount(7);
  await expect(kresba.locator('.bublina--ty text')).toHaveText('?');
  // I v druhém pohledu, dokud pohyb nepustí.
  await kresba.getByRole('radio', { name: 'Se spojencem' }).check({ force: true });
  expect(await kresba.locator('.bublina').evaluateAll((g) => g.every((e) => getComputedStyle(e).opacity === '1'))).toBe(true);
  // Pustit pohyb začne kolo znovu.
  await kresba.getByRole('button', { name: 'Pustit pohyb' }).click();
  expect(await kresba.locator('.bublina').first().evaluate((e) => getComputedStyle(e).animationName)).toContain('cara-b');
});
