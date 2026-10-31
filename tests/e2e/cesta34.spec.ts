// Cesta 34 „Kam mi mizí čas?“ a kresba „Přesýpací hodiny“ (krok 3). Přehled má osm kroků a filozofy Seneku
// a Marca Aurelia; kroky se otevřou a poslední má Závěr cesty. Kresba: při omezeném pohybu leží všech 24 zrnek
// dole a horní baňka je prázdná; posuvníky nepustí víc než 24 hodin a text pod kresbou říká totéž co ona.
// S pohybem jde zastavit a zastavená ukáže výsledek kola i hned po načtení. Obě šířky ve světlém i tmavém režimu s axe. Logiku hlídá tests/data/presypaci.test.ts.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HODIN, VYCHOZI_DEN, popisDne } from '../../src/lib/presypaci';
import { PRESKLADANO, bezNalezuAxe, kotvy, nicNeulozeno, poradiOddilu, pripravitKrok, sDenikem, type Oddily } from './strany';

const CESTA = '/cesta/kam-mi-mizi-cas/';
const KROK = `${CESTA}3/`;
const ID = 'presypaci-hodiny';
const NAZVY_KROKU = ['Chléb pro celé město', 'Plot kolem pozemku', 'Spočítej si den', 'Pohřeb za živa', 'Kdo rozhodl?', 'Odejít, nebo ustoupit do sebe?', 'Bez volna', 'Kdo je na tvé straně'];

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

test('přehled cesty 34: osm kroků, Seneca a Marcus, kroky se otevřou a poslední má závěr', async ({ page }) => {
  await page.goto(CESTA);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kam mi mizí čas?');
  for (const nazev of NAZVY_KROKU) await expect(page.getByText(nazev, { exact: true }).first()).toBeVisible();
  for (const [i, nazev] of NAZVY_KROKU.entries()) {
    await page.goto(`${CESTA}${i + 1}/`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(nazev);
  }
  await expect(page.locator('#cesta34-moje-pravidlo')).toHaveCount(1);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = rezim === 'light' ? 'svetly' : 'tmavy';
    test(`přesýpací hodiny · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page);
      const popis = kresba.locator('.kresba__popis');

      // Bez pohybu: zrnka leží dole, horní baňka je prázdná a tlačítko pohybu chybí.
      await expect(kresba.locator('.pad')).toHaveCount(HODIN);
      await expect(kresba.locator('.horni')).toHaveCount(HODIN);
      expect(await kresba.locator('.horni').evaluateAll((z) => z.every((e) => getComputedStyle(e).opacity === '0'))).toBe(true);
      await expect(kresba.getByRole('button', { name: 'Zastavit pohyb' })).toHaveCount(0);
      await expect(popis).toHaveText(popisDne(VYCHOZI_DEN));
      await popiskyVolne(kresba);

      // Posuvníky: víc než 24 hodin nejde; zbytek se přepočítá a text pod kresbou ho řekne.
      const ja = kresba.getByRole('slider', { name: 'Tvoje volba' });
      await expect(ja).toHaveValue('3');
      await expect(ja).toHaveAttribute('aria-valuetext', '3 hodiny');
      await ja.fill('12');
      await expect(ja).toHaveValue('6');
      await expect(kresba.locator('.den__zbytek')).toContainText('0 h');
      await expect(popis).toContainText('Neproteklo nic');
      await expect(kresba.locator('.z--protekla')).toHaveCount(1); // jen v legendě
      for (const v of await kresba.locator('input[type="range"]').evaluateAll((s) => s.map((x) => x.getBoundingClientRect().height))) expect(v).toBeGreaterThanOrEqual(44);

      const axe = await new AxeBuilder({ page }).include(`#${ID}`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}

test('přesýpací hodiny: pohyb běží a jde zastavit; zastavené ukážou výsledek kola', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page);
  const jmeno = () => kresba.locator('.pad').first().evaluate((e) => getComputedStyle(e).animationName);
  await expect(kresba.getByRole('button', { name: 'Zastavit pohyb' })).toBeVisible();
  expect(await jmeno()).toContain('presypani-pad');
  expect(await kresba.locator('.pad').first().evaluate((e) => getComputedStyle(e).animationPlayState)).toBe('running');

  // Zastaveno hned po načtení: písek leží dole po vrstvách a horní baňka je prázdná (docs/design.md › Přesýpací hodiny).
  await kresba.getByRole('button', { name: 'Zastavit pohyb' }).click();
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeVisible();
  expect(await jmeno()).toBe('none');
  expect(await kresba.locator('.pad').evaluateAll((z) => z.every((e) => getComputedStyle(e).opacity === '1' && getComputedStyle(e).transform === 'none'))).toBe(true);
  expect(await kresba.locator('.horni').evaluateAll((z) => z.every((e) => getComputedStyle(e).opacity === '0'))).toBe(true);

  // Posuvník mění vrstvy v zastavené baňce, ne jen čísla v legendě.
  const vrstvy = () => kresba.locator('.pad').evaluateAll((z) => z.map((e) => e.firstElementChild?.getAttribute('class') ?? ''));
  const pred = await vrstvy();
  await kresba.getByRole('slider', { name: 'Tvoje volba' }).fill('6');
  await expect.poll(vrstvy).not.toEqual(pred);
  expect(await kresba.locator('.pad').evaluateAll((z) => z.every((e) => getComputedStyle(e).opacity === '1'))).toBe(true);

  // Pustit pohyb začne nové kolo.
  await kresba.getByRole('button', { name: 'Pustit pohyb' }).click();
  expect(await jmeno()).toContain('presypani-pad');
});

// Kdo je na tvé straně (větev interaktivita-v1, T1): krok 8 přečte z deníku Volbu z kroku 1 a konečnou polohu ve Sporu
// z kroku 6. Oddíl Dvě hodiny s telefonem k Změň jednu věc z kroku 5 patří všem odpovědím („Ať jsi odpověděl jakkoli“),
// proto obal nemá; Je volno výsada? a Než napíšeš pravidlo blok nemají.
const KROK8 = `${CESTA}8/`;
const CELY8: Oddily = [
  ['cesta34-dost-casu', 0, ['p', 'strana:A', 'strana:B', 'strana:C', 'strana:D']],
  ['cesta34-odejit-spor', 0, ['p', 'strana:seneca', 'strana:marcus-aurelius', 'strana:uprostred']],
];
const KOTVY8 = ['máš-dost-času', 'dvě-hodiny-stelefonem', 'odejít-nebo-zůstat', 'je-volno-výsada', 'než-napíšeš-pravidlo', 'zkus-to-zit', 'cesta34-moje-pravidlo'];

test('krok 8 bez zápisu v deníku, se smazaným deníkem a bez JavaScriptu: oddíly celé jako dřív', async ({ page, browser }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(KROK8);
  await pripravitKrok(page);
  await poradiOddilu(page, CELY8);
  await expect(page.locator('[data-strany]')).toHaveCount(2);
  await expect(page.locator(PRESKLADANO)).toHaveCount(0);
  await kotvy(page, KOTVY8);
  await sDenikem(page, { 'cesta34-dost-casu': { vyber: 1, proc: '', potvrzeno: false }, 'cesta34-odejit-spor': { prvni: 2, konecna: null, duvod: '' } });
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
      'cesta34-dost-casu': { vyber: 2, proc: '', potvrzeno: true },
      'cesta34-odejit-spor': { prvni: 1, konecna: 4, duvod: '', reflexe: null },
      'cesta34-cija-hodina': { zaklad: 'napul', podminky: {}, aktivni: null },
    });
    await page.goto(KROK8);
    await pripravitKrok(page);
    await poradiOddilu(page, [
      ['cesta34-dost-casu', 0, ['p', 'stitek', 'tvoje:C', 'jine:A,B,D']],
      ['cesta34-odejit-spor', 0, ['p', 'stitek', 'tvoje:marcus-aurelius', 'jine:seneca,uprostred']],
    ]);
    const cas = page.locator('[data-strany="cesta34-dost-casu"]');
    await expect(cas.locator('.strana--tvoje')).toContainText('Jestli máš dost, máš na své straně Seneku.');
    const jine = cas.locator('details.strany__jine');
    await expect(jine).not.toHaveAttribute('open', /.*/);
    await expect(jine.locator('[data-odpoved="A"]')).toBeHidden();
    await expect(page.locator('[data-strany="cesta34-odejit-spor"] .strana--tvoje')).toContainText('Jestli podle tebe zůstat a hledat volno uvnitř, máš Marca.');
    // Dvě hodiny s telefonem patří všem odpovědím Změň jednu věc: zůstanou celé a vidět.
    await expect(page.getByText('Ať jsi odpověděl jakkoli, Seneca by se tě ptal na totéž')).toBeVisible();
    await expect(page.locator('.krok__obsah .citat')).toBeVisible();
    await kotvy(page, KOTVY8);
    await bezNalezuAxe(page);
    await jine.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(jine).toHaveAttribute('open', '');
    await expect(jine.locator('[data-odpoved="A"]')).toContainText('máš na své straně Marca Aurelia');
    await bezNalezuAxe(page);

    // Spor uprostřed: nahoře Seneca, který radil obojí.
    await sDenikem(page, { 'cesta34-odejit-spor': { prvni: 1, konecna: 2, duvod: '', reflexe: null } });
    await page.reload();
    await pripravitKrok(page);
    await poradiOddilu(page, [
      ['cesta34-dost-casu', 0, CELY8[0][2]],
      ['cesta34-odejit-spor', 0, ['p', 'stitek', 'tvoje:uprostred', 'jine:seneca,marcus-aurelius']],
    ]);
    await expect(page.locator('.strana--tvoje')).toContainText('Jestli jsi stál uprostřed, máš Seneku. Paulinovi radil odejít, jinde ale radil neutíkat hned a mísit volno s prací.');
    await nicNeulozeno(page, ['cesta34-odejit-spor']);
  });
}
