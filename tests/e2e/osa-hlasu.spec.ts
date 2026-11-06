// Osa hlasů na stránkách velkých otázek (interaktivita-v2, K1): hlasy v poměru let, mince jako odkazy na hlas,
// volba „Kdo z nich je ti nejblíž?“ v deníku, značka „Ty“, dvě věty po volbě a štítek „Tobě nejblíž“ v seznamu.
// Stránka s nejvíc hlasy (Kdo vlastně jsem?, sedm) a s nejmíň (Co je skutečné?, čtyři); logika v tests/data/osa-hlasu.test.ts.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const NEJVIC = 'kdo-vlastne-jsem';
const NEJMIN = 'co-je-skutecne';
const denik = (slug: string, bloky: Record<string, unknown> = {}) =>
  JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: { [`otazka-${slug}`]: { preskoceno: true }, ...bloky }, aktivita: [], cesty: {} });

/** Otevře stránku otázky s deníkem (první názor přeskočený, aby byl oddíl s hlasy vidět) a počká na ostrov osy. */
async function otevri(page: Page, slug: string, obsah = denik(slug)) {
  await page.goto(`/otazka/${slug}/`);
  await page.evaluate((t) => localStorage.setItem('atlas-denik', t), obsah);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="OsaHlasu"]:not([ssr])', { state: 'attached' });
}

const osa = (page: Page, slug: string) => page.locator(`#${slug}-osa`);
const kresba = (page: Page, slug: string) => osa(page, slug).locator('svg.osa__kresba:visible');
const moznost = (page: Page, slug: string, jmeno: string) => osa(page, slug).getByRole('button', { name: jmeno, exact: true });
const vety = (page: Page, slug: string) => osa(page, slug).locator('.volba__vety');
const ulozeno = (page: Page, slug: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').bloky?.[k] ?? null, `otazka-${slug}-osa`);

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

/** Obdélníky v právě viditelné kresbě. */
const obdelniky = (page: Page, slug: string, sel: string) =>
  kresba(page, slug).locator(sel).evaluateAll((els) => els.map((e) => {
    const r = e.getBoundingClientRect();
    return { l: r.left, r: r.right, t: r.top, b: r.bottom, text: e.textContent ?? '' };
  }));
const potkaji = (a: { l: number; r: number; t: number; b: number }, b: typeof a) => a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5;

test('bez volby, volba, změna, obnovení, Začít znovu a Nikdo z nich (390 px)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevri(page, NEJVIC);
  const o = osa(page, NEJVIC);
  await expect(o.locator('.t-nadtitulek')).toHaveText('Kdy žili');
  // Na telefonu úzká kresba, mince bez jmen; sedm mincí jako odkazy na hlasy.
  await expect(kresba(page, NEJVIC)).toHaveCount(1);
  await expect(kresba(page, NEJVIC)).toHaveClass(/osa__kresba--uzka/);
  await expect(kresba(page, NEJVIC).locator('a.m')).toHaveCount(7);
  await expect(kresba(page, NEJVIC).locator('a.m').first()).toHaveAttribute('href', '#hlas-herakleitos');
  await expect(kresba(page, NEJVIC).locator('a.m').first()).toHaveAttribute('aria-label', /^Hérakleitos, asi\s540–480/);
  await expect(kresba(page, NEJVIC).locator('.m__jmeno')).toHaveCount(0);
  await expect(kresba(page, NEJVIC)).toContainText('dnes');
  await expect(kresba(page, NEJVIC)).toContainText(/asi\s1\s850\slet/);

  // Bez volby: výzva, osm tlačítek, nic stisknuté, žádná značka ani věty.
  await expect(o.getByText('Kdo z nich je ti nejblíž?')).toBeVisible();
  await expect(o.getByRole('group', { name: 'Kdo z nich je ti nejblíž?' }).getByRole('button')).toHaveCount(8);
  await expect(o.locator('button[aria-pressed="true"]')).toHaveCount(0);
  await expect(o.locator('.ty')).toHaveCount(0);
  await expect(vety(page, NEJVIC)).toHaveText('');
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(0);
  await expect(o.getByRole('button', { name: 'Začít znovu' })).toHaveCount(0);
  await axe(page);

  // Volba.
  await moznost(page, NEJVIC, 'Epikúros').click();
  await expect(moznost(page, NEJVIC, 'Epikúros')).toHaveAttribute('aria-pressed', 'true');
  await expect(vety(page, NEJVIC)).toContainText('Od Epikúra tě dělí asi 2 300 let. To je víc než 30 lidských životů. Na tuhle otázku přesto odpovídáš podobně jako on.');
  await expect(vety(page, NEJVIC)).toContainText('Nejdál od sebe tu žili Hérakleitos a Marcus Aurelius: dělí je asi 600 let.');
  await expect(vety(page, NEJVIC)).toHaveAttribute('aria-live', 'polite');
  await expect(kresba(page, NEJVIC).locator('.ty')).toHaveCount(1);
  await expect(kresba(page, NEJVIC).locator('a.m--zvolena')).toHaveAttribute('href', '#hlas-epikuros');
  await expect(page.locator('#hlas-epikuros .hlas__stitek')).toBeVisible();
  await expect(page.locator('#hlas-epikuros .hlas__stitek')).toHaveText('Tobě nejblíž');
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(1);
  expect(await ulozeno(page, NEJVIC)).toEqual({ volba: 'epikuros' });
  await axe(page);

  // Změna.
  await moznost(page, NEJVIC, 'Marcus Aurelius').click();
  await expect(moznost(page, NEJVIC, 'Epikúros')).toHaveAttribute('aria-pressed', 'false');
  await expect(vety(page, NEJVIC)).toContainText('Od Marca Aurelia tě dělí asi 1 850 let.');
  await expect(page.locator('#hlas-marcus-aurelius .hlas__stitek')).toBeVisible();
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(1);

  // Obnovení stránky drží volbu.
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="OsaHlasu"]:not([ssr])', { state: 'attached' });
  await expect(moznost(page, NEJVIC, 'Marcus Aurelius')).toHaveAttribute('aria-pressed', 'true');
  await expect(vety(page, NEJVIC)).toContainText('Od Marca Aurelia');
  await expect(page.locator('#hlas-marcus-aurelius .hlas__stitek')).toBeVisible();

  // Začít znovu smaže volbu i z deníku a vrátí fokus na první možnost.
  await o.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(o.locator('button[aria-pressed="true"]')).toHaveCount(0);
  await expect(o.locator('.ty')).toHaveCount(0);
  await expect(vety(page, NEJVIC)).toHaveText('');
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(0);
  await expect(moznost(page, NEJVIC, 'Hérakleitos')).toBeFocused();
  expect(await ulozeno(page, NEJVIC)).toBeNull();

  // Nikdo z nich: věta s odkazem na Změnil se?, značka u dneška, žádný štítek.
  await moznost(page, NEJVIC, 'Nikdo z nich').click();
  await expect(moznost(page, NEJVIC, 'Nikdo z nich')).toHaveAttribute('aria-pressed', 'true');
  await expect(vety(page, NEJVIC)).toContainText('Žádný z nich to nevidí jako ty. Tím spíš stojí za to napsat svou odpověď vlastními slovy, dole v oddílu Změnil se?');
  await expect(vety(page, NEJVIC).getByRole('link', { name: 'Změnil se?' })).toHaveAttribute('href', '#zmenil-se');
  await expect(vety(page, NEJVIC)).not.toContainText('Nejdál od sebe');
  await expect(kresba(page, NEJVIC).locator('.ty')).toHaveCount(1);
  await expect(kresba(page, NEJVIC).locator('a.m--zvolena')).toHaveCount(0);
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(0);
  expect(await ulozeno(page, NEJVIC)).toEqual({ volba: 'nikdo' });
  await vety(page, NEJVIC).getByRole('link', { name: 'Změnil se?' }).click();
  await expect(page).toHaveURL(/#zmenil-se$/);
});

test('klávesnice: mince skočí na hlas, tlačítko zvolí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevri(page, NEJMIN);
  const prvni = kresba(page, NEJMIN).locator('a.m').first();
  await prvni.focus();
  await expect(prvni).toBeFocused();
  // Rámeček fokusu je vidět jen z klávesnice: po Tab a Shift+Tab.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(prvni).toBeFocused();
  await expect(prvni.locator('.m__fokus')).toHaveCSS('stroke', /rgb/);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#hlas-parmenides$/);
  await expect(page.locator('#hlas-parmenides')).toBeInViewport();

  // Z poslední mince tabulátorem na první tlačítko volby; mezerník volí.
  await kresba(page, NEJMIN).locator('a.m').last().focus();
  await page.keyboard.press('Tab');
  await expect(moznost(page, NEJMIN, 'Parmenidés')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(moznost(page, NEJMIN, 'Démokritos')).toHaveAttribute('aria-pressed', 'true');
  await expect(moznost(page, NEJMIN, 'Démokritos')).toBeFocused();
  await expect(vety(page, NEJMIN)).toContainText('Od Démokrita tě dělí asi 2 400 let.');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(moznost(page, NEJMIN, 'Parmenidés')).toHaveAttribute('aria-pressed', 'true');
});

for (const { sirka, rezim, slug } of [
  { sirka: 390, rezim: 'light', slug: NEJVIC },
  { sirka: 390, rezim: 'dark', slug: NEJMIN },
  { sirka: 768, rezim: 'light', slug: NEJVIC },
  { sirka: 1440, rezim: 'light', slug: NEJVIC },
  { sirka: 1440, rezim: 'dark', slug: NEJMIN },
] as const) {
  test(`${slug} ${sirka} px ${rezim}: kresba se vejde, nic se nepřekrývá, axe`, async ({ page }) => {
    await page.setViewportSize({ width: sirka, height: 900 });
    await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
    await otevri(page, slug, denik(slug, { [`otazka-${slug}-osa`]: { volba: 'platon' } }));
    await expect(kresba(page, slug)).toHaveClass(sirka === 390 ? /osa__kresba--uzka/ : sirka === 768 ? /osa__kresba--stredni/ : /osa__kresba--siroka/);
    // Osa nevyjede ze stránky; na notebooku má šířku širokého oddílu.
    const box = await osa(page, slug).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(sirka);
    if (sirka === 1440) expect(Math.round(box!.width)).toBe(960);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(sirka);
    // Mince, jména a letopočty se nepotkají.
    const mince = await obdelniky(page, slug, '.m__kruh');
    const jmena = await obdelniky(page, slug, '.m__jmeno');
    const roky = await obdelniky(page, slug, '.osa__rok, .osa__doDneska');
    const vse = [...mince, ...jmena, ...roky];
    for (let i = 0; i < vse.length; i++) for (let j = i + 1; j < vse.length; j++) {
      expect(potkaji(vse[i], vse[j]), `${vse[i].text || 'mince'} × ${vse[j].text || 'mince'}`).toBe(false);
    }
    if (sirka > 390) expect(jmena.length).toBeGreaterThan(0);
    // Mince má cíl aspoň 44 px.
    const plocha = await kresba(page, slug).locator('.m__plocha').first().boundingBox();
    expect(plocha!.width).toBeGreaterThanOrEqual(43.5);
    await expect(page.locator('#hlas-platon .hlas__stitek')).toBeVisible();
    await axe(page);
  });
}

test('omezený pohyb: značka stojí u zvolené mince hned', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevri(page, NEJVIC);
  await moznost(page, NEJVIC, 'Aristotelés').click();
  const ty = kresba(page, NEJVIC).locator('.ty__stitek');
  const mince = kresba(page, NEJVIC).locator('a.m--zvolena .m__kruh');
  // Poloha se změní až po pár snímcích (docs/pouceni.md); pak se nehýbe a sedí na střed mince.
  await page.waitForTimeout(200);
  const a = await ty.boundingBox();
  await page.waitForTimeout(150);
  const b = await ty.boundingBox();
  expect(Math.abs(a!.x - b!.x)).toBeLessThan(0.5);
  const m = await mince.boundingBox();
  expect(Math.abs(b!.x + b!.width / 2 - (m!.x + m!.width / 2))).toBeLessThan(1.5);
  // Čára od mince ke značce je při omezeném pohybu hned.
  await expect(kresba(page, NEJVIC).locator('.ty__cara')).toHaveCount(1);
  const animace = await page.evaluate(() => document.getAnimations().filter((x) => Number(x.effect?.getTiming().duration ?? 0) > 1).length);
  expect(animace).toBe(0);
});

test('s pohybem značka dojede od dneška k minci', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await otevri(page, NEJVIC);
  await moznost(page, NEJVIC, 'Hérakleitos').click();
  const ty = kresba(page, NEJVIC).locator('.ty__stitek');
  const mince = await kresba(page, NEJVIC).locator('a.m--zvolena .m__kruh').boundingBox();
  const stred = async () => { const b = await ty.boundingBox(); return b ? b.x + b.width / 2 : 0; };
  // Hned po volbě stojí značka vpravo u dneška, pak dojede k Hérakleitovi (vlevo).
  expect(await stred()).toBeGreaterThan(mince!.x + 300);
  await expect.poll(async () => Math.abs((await stred()) - (mince!.x + mince!.width / 2)), { timeout: 3000 }).toBeLessThan(1.5);
});

test('deník: neznámé id, cizí hlas a poškozený stav dají osu bez volby', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const stav of [{ volba: 'neexistuje' }, { volba: 'seneca' }, 'epikuros', { volba: 7 }]) {
    await otevri(page, NEJVIC, denik(NEJVIC, { [`otazka-${NEJVIC}-osa`]: stav }));
    await expect(osa(page, NEJVIC).locator('button[aria-pressed="true"]')).toHaveCount(0);
    await expect(osa(page, NEJVIC).locator('.ty')).toHaveCount(0);
    await expect(page.locator('.hlas__stitek:visible')).toHaveCount(0);
  }
  // Smazaný deník: stránka se otevře s první otázkou a po přeskočení je osa bez volby.
  await page.evaluate(() => localStorage.removeItem('atlas-denik'));
  await page.reload();
  await expect(page.locator(`#${NEJVIC}-po`)).toBeHidden();
  await page.waitForSelector('astro-island[component-url*="PrvniNazor"]:not([ssr])', { state: 'attached' });
  await page.getByRole('button', { name: 'Přeskočit' }).click();
  await expect(osa(page, NEJVIC)).toBeVisible();
  await expect(osa(page, NEJVIC).locator('button[aria-pressed="true"]')).toHaveCount(0);
});

test('bez JavaScriptu: statická osa s odkazy, bez výzvy', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`/otazka/${NEJVIC}/`);
  await expect(kresba(page, NEJVIC)).toHaveClass(/osa__kresba--siroka/);
  await expect(kresba(page, NEJVIC).locator('a.m')).toHaveCount(7);
  await expect(kresba(page, NEJVIC).locator('.m__jmeno')).toHaveText(['Hérakleitos', 'Sókratés', 'Platón', 'Aristotelés', 'Epikúros', 'Epiktétos', 'Marcus Aurelius']);
  await expect(osa(page, NEJVIC).getByText('Kdo z nich je ti nejblíž?')).toHaveCount(0);
  await expect(osa(page, NEJVIC).locator('button')).toHaveCount(0);
  await expect(page.locator('.hlas__stitek:visible')).toHaveCount(0);
  await ctx.close();
});

test('Tvoje antika: volba na ose stojí nad mysliteli z cest, „nikdo“ otázku neukáže', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const obsah = JSON.stringify({
    verze: 1, zapisy: [], vyzvy: [], navstivene: [], aktivita: [], cesty: {},
    bloky: { 'otazka-jak-zit-osa': { volba: 'epikuros' }, 'otazka-jsem-svobodny-osa': { volba: 'nikdo' } },
  });
  await page.goto('/denik/antika/');
  await page.evaluate((t) => localStorage.setItem('atlas-denik', t), obsah);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="TvojeObdobi"]:not([ssr])', { state: 'attached' });
  await expect(page.locator('section.otazka')).toHaveCount(1);
  const o = page.getByRole('region', { name: 'Jak mám žít?' });
  await expect(o.locator('.nejbliz__veta')).toHaveText('Na stránce otázky je ti nejblíž Epikúros.');
  await expect(o.getByRole('link', { name: 'stránce otázky' })).toHaveAttribute('href', '/otazka/jak-zit/#jak-zit-osa');
  await expect(o.getByRole('link', { name: 'Epikúros' })).toHaveAttribute('href', '/osobnost/epikuros/');
  await expect(o.locator('.nejbliz .duvod')).not.toBeEmpty();
  await axe(page);
});

test('na plátně (promítání): osa a otázka, bez tlačítek, značky a vět', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevri(page, NEJVIC, denik(NEJVIC, { [`otazka-${NEJVIC}-osa`]: { volba: 'platon' } }));
  await expect(osa(page, NEJVIC).locator('.ty:visible')).toHaveCount(1);
  await page.evaluate(() => document.documentElement.classList.add('promitani', 'promitani-pripraveno'));
  await expect(osa(page, NEJVIC).getByText('Kdo z nich je ti nejblíž?')).toBeVisible();
  await expect(kresba(page, NEJVIC).locator('a.m')).toHaveCount(7);
  await expect(osa(page, NEJVIC).getByRole('button')).toHaveCount(0);
  await expect(osa(page, NEJVIC).locator('.ty:visible')).toHaveCount(0);
  await expect(osa(page, NEJVIC).locator('.volba__vety')).toBeHidden();
});
