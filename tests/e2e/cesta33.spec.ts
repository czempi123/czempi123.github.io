// Cesta 33 „Co když přijde to nejhorší?“ a kresba „Strhni masku“ (krok 4). Přehled má osm kroků a filozofy Seneku
// a Epiktéta; kroky se otevřou a poslední má Závěr cesty. Kresba: při omezeném pohybu leží maska vedle tváře (výsledek),
// tlačítko pohybu chybí a text pod kresbou říká totéž co ona; přepínač masek jde klávesnicí. S pohybem maska sjíždí
// z tváře, jde zastavit a zastavená ukáže výsledek i hned po načtení. Obě šířky ve světlém i tmavém režimu s axe.
// Logiku hlídá tests/data/maska.test.ts.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { popisMasky } from '../../src/lib/maska';

const CESTA = '/cesta/co-kdyz-prijde-to-nejhorsi/';
const KROK = `${CESTA}4/`;
const ID = 'maska';
const NAZVY_KROKU = ['Třicet vteřin', 'Knížka od profesora', 'Senátor jde na oběd', 'Strhni masku', 'Víc, dřív, nebo vůbec?', 'Přišlo, co nikdo nečekal', 'Kdy to pomáhá?', 'Kdo je na tvé straně'];

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

/** Viditelné popisky v kresbě se nepřekrývají a leží celé v plátně. */
async function popiskyVolne(kresba: Locator) {
  const chyby = await kresba.locator('svg.kresba__platno').evaluate((svg) => {
    const platno = svg.getBoundingClientRect();
    const r = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    const ven: string[] = [];
    r.forEach((a, i) => {
      if (a.b.left < platno.left || a.b.right > platno.right || a.b.top < platno.top || a.b.bottom > platno.bottom) ven.push(`mimo plátno: ${a.t}`);
      for (const b of r.slice(i + 1)) {
        if (a.b.left < b.b.right && b.b.left < a.b.right && a.b.top < b.b.bottom && b.b.top < a.b.bottom) ven.push(`${a.t} × ${b.t}`);
      }
    });
    return ven;
  });
  expect(chyby).toEqual([]);
}

/** Maska leží vedle tváře: obdélníky se nepřekrývají a maska je vpravo. */
async function maskaVedle(kresba: Locator) {
  const r = await kresba.evaluate((k) => {
    const m = k.querySelector('.maska')!.getBoundingClientRect();
    const t = k.querySelector('.tvar')!.getBoundingClientRect();
    return { prekryv: m.left < t.right && t.left < m.right && m.top < t.bottom && t.top < m.bottom, vpravo: m.left > t.left };
  });
  expect(r).toEqual({ prekryv: false, vpravo: true });
}

test('přehled cesty 33: osm kroků, Seneca a Epiktétos, kroky se otevřou a poslední má závěr', async ({ page }) => {
  await page.goto(CESTA);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Co když přijde to nejhorší?');
  for (const nazev of NAZVY_KROKU) await expect(page.getByText(nazev, { exact: true }).first()).toBeVisible();
  for (const [i, nazev] of NAZVY_KROKU.entries()) {
    await page.goto(`${CESTA}${i + 1}/`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(nazev);
  }
  await expect(page.locator('#cesta33-moje-pravidlo')).toHaveCount(1);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = rezim === 'light' ? 'svetly' : 'tmavy';
    test(`strhni masku · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page);
      const popis = kresba.locator('.kresba__popis');

      // Bez pohybu: maska leží vedle tváře, popisky svítí a tlačítko pohybu chybí.
      await expect(kresba.getByRole('button', { name: 'Zastavit pohyb' })).toHaveCount(0);
      await expect(popis).toHaveText(popisMasky('mensi'));
      await maskaVedle(kresba);
      expect(await kresba.locator('.stitky').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      await popiskyVolne(kresba);

      // Přepínač masek jde klávesnicí: šipka přepne na druhou masku a text pod kresbou se změní.
      await kresba.getByRole('radio', { name: 'První maska' }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(kresba.getByRole('radio', { name: 'Druhá maska' })).toBeChecked();
      await expect(popis).toHaveText(popisMasky('stejna'));
      await maskaVedle(kresba);
      await popiskyVolne(kresba);

      const axe = await new AxeBuilder({ page }).include(`#${ID}`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}

test('strhni masku: pohyb běží a jde zastavit; zastavená ukáže masku vedle tváře', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  const jmeno = () => kresba.locator('.maska').evaluate((e) => getComputedStyle(e).animationName);
  await expect(kresba.getByRole('button', { name: 'Zastavit pohyb' })).toBeVisible();
  expect(await jmeno()).toContain('maska-strhni');
  expect(await kresba.locator('.maska').evaluate((e) => getComputedStyle(e).animationPlayState)).toBe('running');

  // Zastaveno hned po načtení, kdy maska ještě drží na tváři: kresba ukáže výsledek, ne zamrzlý okamžik.
  await kresba.getByRole('button', { name: 'Zastavit pohyb' }).click();
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeVisible();
  expect(await jmeno()).toBe('none');
  await maskaVedle(kresba);

  // Pustit pohyb začne znovu od nasazené masky.
  await kresba.getByRole('button', { name: 'Pustit pohyb' }).click();
  expect(await jmeno()).toContain('maska-strhni');
});
