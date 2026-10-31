// Cesta 33 „Co když přijde to nejhorší?“ a kresba „Strhni masku“ (krok 4). Přehled má osm kroků a filozofy Seneku
// a Epiktéta; kroky se otevřou a poslední má Závěr cesty. Kresba: při omezeném pohybu leží maska vedle tváře (výsledek),
// tlačítko pohybu chybí a text pod kresbou říká totéž co ona; přepínač masek jde klávesnicí. S pohybem maska sjíždí
// z tváře, jde zastavit a zastavená ukáže výsledek i hned po načtení. Obě šířky ve světlém i tmavém režimu s axe.
// Logiku hlídá tests/data/maska.test.ts.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { popisMasky } from '../../src/lib/maska';
import { PRESKLADANO, bezNalezuAxe, kotvy, nicNeulozeno, poradiOddilu, pripravitKrok, sDenikem, type Oddily } from './strany';

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

// Kdo je na tvé straně (větev interaktivita-v1, T1): krok 8 přečte z deníku Volby z kroků 1 a 3, konečnou polohu
// ve Sporu z kroku 6 a základní rozhodnutí Změň jednu věc z kroku 7. Roztřiď z kroku 5 a Odkryj z kroku 2 oddíl nemají;
// Jedna věta ke všem radám patří všem.
const KROK8 = `${CESTA}8/`;
const CELY8: Oddily = [
  ['cesta33-pod-padakem', 0, ['p', 'strana:A', 'strana:B', 'strana:C', 'strana:D']],
  ['cesta33-senator', 0, ['p', 'strana:A', 'strana:B', 'strana:C', 'strana:D']],
  ['cesta33-predem-spor', 0, ['p', 'strana:epikuros', 'strana:seneca', 'strana:uprostred']],
  ['cesta33-nominace', 0, ['p', 'strana:promyslim', 'strana:nepredstavuji', 'strana:kazdy-den']],
];
const KOTVY8 = ['pod-padákem', 'senátor', 'mezi-senekou-aepikúrem', 'tři-týdny-před-výběrem', 'jedna-věta-ke-všem-radám', 'zkus-to-zit', 'cesta33-moje-pravidlo'];

test('krok 8 bez zápisu v deníku, se smazaným deníkem a bez JavaScriptu: oddíly celé jako dřív', async ({ page, browser }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(KROK8);
  await pripravitKrok(page);
  await poradiOddilu(page, CELY8);
  await expect(page.locator(PRESKLADANO)).toHaveCount(0);
  await kotvy(page, KOTVY8);
  // Spor jen s první polohou a nepotvrzená Volba nic nepřeskládají; smazaný deník taky ne.
  await sDenikem(page, { 'cesta33-pod-padakem': { vyber: 2, proc: '', potvrzeno: false }, 'cesta33-predem-spor': { prvni: 1, konecna: null, duvod: '' } });
  await page.reload();
  await pripravitKrok(page);
  await poradiOddilu(page, CELY8);
  await sDenikem(page, {});
  await page.reload();
  await pripravitKrok(page);
  await poradiOddilu(page, CELY8);

  const bezJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p2 = await bezJs.newPage();
  await p2.goto(KROK8);
  await expect(p2.locator(PRESKLADANO)).toHaveCount(0);
  await expect(p2.locator('[data-odpoved="uprostred"]')).toBeVisible();
  await kotvy(p2, KOTVY8);
  await bezJs.close();
});

for (const [sirka, rezim] of [[390, 'light'], [1440, 'dark']] as const) {
  test(`krok 8 se zápisem v deníku: odpověď studenta první, ostatní sbalené (${sirka} px, ${rezim})`, async ({ page }) => {
    await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
    await page.emulateMedia({ colorScheme: rezim, reducedMotion: sirka === 390 ? 'reduce' : 'no-preference' });
    await sDenikem(page, {
      'cesta33-pod-padakem': { vyber: 2, proc: 'přistát', potvrzeno: true },
      'cesta33-senator': { vyber: 3, proc: '', potvrzeno: true },
      'cesta33-predem-spor': { prvni: 1, konecna: 2, duvod: '', reflexe: null },
      'cesta33-nominace': { zaklad: 'kazdy-den', podminky: { los: 'nepredstavuji' }, aktivni: 'los' },
    });
    await page.goto(KROK8);
    await pripravitKrok(page);
    await poradiOddilu(page, [
      ['cesta33-pod-padakem', 0, ['p', 'stitek', 'tvoje:C', 'jine:A,B,D']],
      ['cesta33-senator', 0, ['p', 'stitek', 'tvoje:D', 'jine:A,B,C']],
      // Uprostřed ve Sporu má vlastní odstavec (Seneca radí obojí v jednom dopise).
      ['cesta33-predem-spor', 0, ['p', 'stitek', 'tvoje:uprostred', 'jine:epikuros,seneca']],
      // Rozhoduje základní rozhodnutí, ne odpověď ve změněné podmínce.
      ['cesta33-nominace', 0, ['p', 'stitek', 'tvoje:kazdy-den', 'jine:promyslim,nepredstavuji']],
    ]);
    const padak = page.locator('[data-strany="cesta33-pod-padakem"]');
    await expect(padak.locator('.strana--tvoje')).toContainText('Jestli sis řekl, že na to teď nemáš myslet, máš na své straně Epikúra');
    const jine = padak.locator('details.strany__jine');
    await expect(jine).not.toHaveAttribute('open', /.*/);
    await expect(jine.locator('summary')).toHaveText('Kdo hájil jiné odpovědi');
    await expect(jine.locator('[data-odpoved="B"]')).toBeHidden();
    await expect(page.locator('[data-strany="cesta33-predem-spor"] .strana--tvoje')).toContainText('Jestli stojíš uprostřed, máš Seneku. Promyslet to předem a netrápit se předem radí v jednom dopise obojí.');
    // Epikúrova věta na konci kroku patří všem a je vidět.
    await expect(page.locator('.krok__obsah .citat')).toBeVisible();
    await kotvy(page, KOTVY8);
    await bezNalezuAxe(page);
    await jine.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(jine).toHaveAttribute('open', '');
    await expect(jine.locator('[data-odpoved="B"]')).toContainText('A Stockdale, který si to nejhorší řekl rovnou.');
    await bezNalezuAxe(page);

    // Kdo prošel jen Spor (blíž Senekovi): nahoře Senekův odstavec, ostatní oddíly celé.
    await sDenikem(page, { 'cesta33-predem-spor': { prvni: 3, konecna: 0, duvod: '', reflexe: null } });
    await page.reload();
    await pripravitKrok(page);
    await poradiOddilu(page, [
      ['cesta33-pod-padakem', 0, CELY8[0][2]],
      ['cesta33-predem-spor', 0, ['p', 'stitek', 'tvoje:seneca', 'jine:epikuros,uprostred']],
    ]);
    await nicNeulozeno(page, ['cesta33-predem-spor']);
  });
}
