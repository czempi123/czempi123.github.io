// Herna K4 (herna-v1): malá hra z dat na medailoncích (sousedé v seznamu Lidé se liší), Výpravy a Přehrát období
// v Mapě a čase a trasy na mini mapě. Na 390 a 1440 px ve světlém i tmavém režimu: jen klávesnicí, axe (WCAG 2 AA),
// snímky, obnovení stránky; dotyk přes CDP (scrollY před koncem dotyku), bez localStorage, plný a omezený pohyb
// a Klidný režim. Logiku výběru a dat hlídá tests/data/herna-k4.test.ts.
import { test, expect, type Page, type Locator, type CDPSession } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;
const N = '\u00a0';

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}
async function bezPresahu(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}
async function snimek(page: Page, l: Locator, nazev: string) {
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } .blok__pata { position: static !important; }' });
  const r = await l.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: Math.max(0, b.x + scrollX - 12), y: Math.max(0, b.y + scrollY - 24), width: Math.min(b.width + 24, document.documentElement.clientWidth), height: b.height + 36 };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}
/** Hra medailonku: obal s data-hra a ostrov hydratovaný. */
async function hra(page: Page, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const obal = page.locator('.hra-osoby');
  await obal.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect(page.locator(`.hra-osoby astro-island[component-url*="/${ostrov}"]`)).not.toHaveAttribute('ssr', /.*/);
  return obal.locator('.blok');
}
async function mapa(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await page.waitForSelector('.mapa svg.podklad .pevnina', { state: 'attached' });
  await page.waitForTimeout(300);
}
const rokAdresy = (page: Page) => Number(new URL(page.url()).searchParams.get('rok'));

// ─── Hra na medailonku ──────────────────────────────────────────────────────

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`hry na medailoncích jen klávesnicí · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const chyby: string[] = [];
      page.on('pageerror', (e) => chyby.push(e.message));

      // Kdo to řekl? u Theofrasta: věta učitele, pod razítky čím se kdo zabýval, rub řekne, kdo na koho navázal.
      await page.goto('/osobnost/theofrastos/');
      await expect(page.locator('.hra-osoby')).toHaveAttribute('data-hra', 'kdo-rekl');
      const kdo = await hra(page, 'KdoToRekl');
      await expect(kdo).toContainText('Tu větu řekl nebo napsal někdo z lidí kolem Theofrasta.');
      await expect(kdo.locator('.serie__postup')).toHaveCount(0);
      await expect(kdo.locator('.razitko-odpoved')).toHaveCount(3);
      await axe(page, '.hra-osoby');
      await snimek(page, kdo, `herna-k4-kdorekl-klid-${pr}`);
      const spatne = kdo.locator('.razitko-odpoved', { hasNotText: 'Aristotelés' }).first();
      await spatne.focus();
      await page.keyboard.press('Enter');
      await expect(kdo.getByRole('region', { name: 'Zkus to jinak' })).toContainText('Porovnej větu s tím');
      await kdo.locator('.razitko-odpoved', { hasText: 'Aristotelés' }).focus();
      await page.keyboard.press('Enter');
      const rub = kdo.getByRole('group', { name: 'Rub karty' });
      await expect(rub).toContainText('Theofrastos se učil u Aristotela.');
      await expect(rub).toContainText('Aristotelés');
      await expect(kdo.getByRole('region', { name: 'Otočené karty' })).toHaveCount(0);
      await bezPresahu(page);
      await axe(page, '.hra-osoby');
      await snimek(page, kdo, `herna-k4-kdorekl-rub-${pr}`);
      await page.reload();
      await expect((await hra(page, 'KdoToRekl')).getByRole('group', { name: 'Rub karty' })).toContainText('Theofrastos se učil u Aristotela.');

      // Tipni si u Kleantha: koho četl a kolik lidských životů je mezi nimi.
      await page.goto('/osobnost/kleanthes/');
      await expect(page.locator('.hra-osoby')).toHaveAttribute('data-hra', 'tipni');
      const tip = await hra(page, 'TipniSi');
      await expect(tip).toContainText('Kleanthés četl texty Hérakleita.');
      await tip.locator('.pravitko__vstup').focus();
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toHaveText('Zkontrolovat odhad');
      await page.keyboard.press('Enter');
      await expect(tip.getByRole('region', { name: 'Jak daleko' })).toContainText('Sedí.');
      await axe(page, '.hra-osoby');
      await snimek(page, tip, `herna-k4-tipni-sedi-${pr}`);

      // Kde to bylo? u Musonia: rodiště ve scéně, kříž šipkami, Enter, věta z dat o vyhnanství.
      await page.goto('/osobnost/musonius-rufus/');
      await expect(page.locator('.hra-osoby')).toHaveAttribute('data-hra', 'kde');
      const kde = await hra(page, 'KdeToBylo');
      await expect(kde).toContainText('Musonius Rufus se narodil ve Volsiniích.');
      await kde.getByRole('application', { name: 'Slepá mapa' }).focus();
      await page.keyboard.press('Shift+ArrowRight');
      await page.keyboard.press('Enter');
      await expect(kde.getByRole('region', { name: 'Kde to bylo' })).toContainText(`Na Gyaru žil Musonius Rufus ve vyhnanství od roku 65${N}n.${N}l.`);
      await bezPresahu(page);
      await axe(page, '.hra-osoby');
      await snimek(page, kde, `herna-k4-kde-tip-${pr}`);
      expect(chyby).toEqual([]);
    });
  }
}

test('sousední stránky v seznamu Lidé mají různé hry a každý medailonek nějakou', async ({ page }) => {
  await page.goto('/lide/');
  // Pořadí karet jako v seznamu (Hipparchia je karta společného profilu mezi Zénónem z Kitia a Chrýsippem).
  const adresy = await page.locator('.karta--odkaz').evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).pathname));
  const druhy: { adresa: string; hra: string | null; profil: boolean }[] = [];
  const stranky = new Map<string, string>();
  for (const adresa of adresy) {
    if (!stranky.has(adresa)) stranky.set(adresa, await (await page.request.get(adresa)).text());
    const html = stranky.get(adresa)!;
    const profil = !html.includes('class="osobnost medailonek');
    druhy.push({ adresa, profil, hra: html.match(/data-hra="([a-z-]+)"/)?.[1] ?? (profil ? 'kdo-zil' : null) });
  }
  const medailonky = [...new Map(druhy.filter((d) => !d.profil).map((d) => [d.adresa, d])).values()];
  expect(medailonky).toHaveLength(34);
  for (const m of medailonky) expect(m.hra, m.adresa).not.toBeNull();
  // Dva medailonky vedle sebe nikdy stejná hra (profil má svou v textu; Thalés vedle Hérakleita jinou možnost nemá).
  for (let i = 1; i < druhy.length; i++) {
    const [a, b] = [druhy[i - 1], druhy[i]];
    if (!a.profil && !b.profil) expect(a.hra, `${a.adresa} a ${b.adresa}`).not.toBe(b.hra);
  }
});

test('hra na medailonku bez localStorage funguje do zavření stránky', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } });
  });
  const chyby: string[] = [];
  page.on('pageerror', (e) => chyby.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/osobnost/theofrastos/');
  const kdo = await hra(page, 'KdoToRekl');
  await kdo.locator('.razitko-odpoved', { hasText: 'Aristotelés' }).click();
  await expect(kdo.getByRole('group', { name: 'Rub karty' })).toContainText('Theofrastos se učil u Aristotela.');
  await page.goto('/mapa/?rok=-424&osoba=sokrates');
  await mapa(page);
  await expect(page.locator('.vyprava__sedi')).toContainText('Sedí');
  expect(chyby).toEqual([]);
});

// ─── Výpravy ────────────────────────────────────────────────────────────────

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`výpravy podle období jen klávesnicí, razítko a obnovení · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto('/mapa/?rok=-520');
      await mapa(page);
      const vyprava = page.locator('.vyprava');
      await expect(vyprava.locator('.vyprava__nad')).toHaveText('Výprava1 z 5');
      await expect(vyprava.getByRole('heading')).toHaveText(`Kde byl Sókratés roku 424${N}př.${N}n.${N}l.?`);
      await vyprava.getByRole('button', { name: 'Další výprava' }).focus();
      await page.keyboard.press('Enter');
      await expect(vyprava.getByRole('heading')).toHaveText(`Kde učil Pýthagorás roku 520${N}př.${N}n.${N}l.?`);
      await expect(vyprava.getByRole('heading')).toBeFocused();
      await expect(vyprava).toContainText('Posuň rok, najdi na mapě jeho lísteček a otevři ho.');
      await axe(page, '.vyprava');
      await snimek(page, vyprava, `herna-k4-vyprava-otazka-${pr}`);

      // Ověření na mapě: lísteček Krotónu, Pýthagorás. Razítko „sedí“ a odpověď z dat.
      // Na telefonu leží Krotón za okrajem výřezu: Pýthagorás má štítek u okraje mapy.
      if (await page.locator('[data-listek="kroton"]').count()) {
        await page.locator('[data-listek="kroton"] .listek__hlava').focus();
        await page.keyboard.press('Enter');
        await page.getByRole('list', { name: 'Lidé v místě Krotón' }).getByRole('button', { name: /^Pýthagorás/ }).focus();
      } else {
        await page.locator('.okraj', { hasText: 'Pýthagorás' }).focus();
      }
      await page.keyboard.press('Enter');
      const sedi = page.locator('.vyprava__sedi');
      await expect(sedi).toContainText('Sedí');
      await expect(sedi).toContainText('V Krotónu');
      await expect(sedi).toContainText('Narodil se na Samu.');
      await bezPresahu(page);
      await axe(page, '.mac__karta');
      await snimek(page, page.locator('.vyprava'), `herna-k4-vyprava-sedi-${pr}`);

      // Obnovení: výprava zůstane splněná (localStorage), bez dopadu razítka.
      await page.goto('/mapa/?rok=-520');
      await mapa(page);
      await expect(page.locator('.vyprava__sedi')).toContainText('Sedí');
      await expect(page.locator('.vyprava')).not.toHaveClass(/vyprava--cerstva/);

      // Období 2 na pásu: jiné výpravy.
      await page.getByRole('navigation', { name: 'Období' }).getByRole('button', { name: /2/ }).first().click();
      await expect(page.locator('.vyprava').getByRole('heading')).toHaveText(`Kde učil Epikúros roku 310${N}př.${N}n.${N}l.?`);
      await expect(page.locator('.vyprava__nad')).toHaveText('Výprava1 z 4');
    });
  }
}

test('výprava: Víc nechá splněnou výpravu nad kartou člověka, jiný člověk ji schová', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-424&osoba=sokrates');
  await mapa(page);
  await expect(page.locator('.vyprava__sedi')).toContainText('U Délia byl Sókratés na vojenském tažení');
  await expect(page.locator('#karta-jmeno')).toHaveText('Sókratés');
  await page.goto('/mapa/?rok=-424&osoba=platon');
  await mapa(page);
  await expect(page.locator('.vyprava')).toHaveCount(0);
});

// ─── Přehrát období ─────────────────────────────────────────────────────────

test('Přehrát období: rok běží sám, Zastavit, pak skoky po desetiletích a Pokračovat (klávesnicí)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => { (window as unknown as { atlasPrehravaniObdobi: object }).atlasPrehravaniObdobi = { delka: 4000 }; });
  await page.goto('/mapa/?rok=-500');
  await mapa(page);
  const tl = page.locator('#obdobi-prehrat');
  await expect(tl).toHaveText('Přehrát období');
  await expect(page.locator('#obdobi-zpet, #obdobi-dal')).toHaveCount(0);
  await tl.focus();
  await page.keyboard.press('Enter');
  await expect(tl).toHaveText('Zastavit');
  await expect(tl).toBeFocused();
  await page.waitForTimeout(800);
  await page.keyboard.press('Enter');
  const zastaveno = rokAdresy(page);
  expect(zastaveno).toBeGreaterThan(-500);
  expect(zastaveno).toBeLessThan(-300);
  // Po zastavení totéž co při omezeném pohybu (skoky po desetiletích) a k tomu Pokračovat.
  await expect(tl).toHaveText('Pokračovat');
  await expect(page.locator('#obdobi-zpet')).toBeVisible();
  await expect(page.locator('#obdobi-dal')).toBeVisible();
  await axe(page, '.mac__pas');
  await snimek(page, page.locator('.mac__pas'), 'herna-k4-obdobi-zastaveno-1440');
  await page.locator('#obdobi-dal').focus();
  await page.keyboard.press('Enter');
  const dal = rokAdresy(page);
  expect(Math.abs(dal) % 10).toBe(0);
  expect(dal).toBeGreaterThan(zastaveno);
  // Pokračovat jede od roku, kde stojí, až na konec okna.
  await tl.focus();
  await page.keyboard.press('Enter');
  const historie = await page.evaluate(() => (window as unknown as { atlasPrehravaniObdobi: { historie: number[] } }).atlasPrehravaniObdobi.historie);
  expect(historie[0]).toBe(dal);
  await expect(tl).toHaveText('Přehrát období', { timeout: 6000 });
  expect(rokAdresy(page)).toBe(-300);
  const vse = await page.evaluate(() => (window as unknown as { atlasPrehravaniObdobi: { historie: number[] } }).atlasPrehravaniObdobi.historie);
  for (let i = 1; i < vse.length; i++) expect(vse[i]).toBeGreaterThanOrEqual(vse[i - 1]);
});

for (const druh of ['omezeny', 'klidny'] as const) {
  test(`Přehrát období · ${druh}: nic se samo nehýbe, skoky po desetiletích bez animace`, async ({ page }) => {
    if (druh === 'klidny') await page.addInitScript(() => localStorage.setItem('atlas-klidny', '1'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    await page.goto('/mapa/?rok=-424');
    await mapa(page);
    await expect(page.locator('#obdobi-prehrat')).toHaveCount(0);
    await page.locator('#obdobi-dal').click();
    expect(rokAdresy(page)).toBe(-420);
    await page.locator('#obdobi-zpet').click();
    await page.locator('#obdobi-zpet').click();
    expect(rokAdresy(page)).toBe(-440);
    // Cíl dotyku 44 px a žádná animace delší než 1 ms v pásu ani v lístku výpravy.
    for (const id of ['#obdobi-zpet', '#obdobi-dal']) {
      const b = (await page.locator(id).boundingBox())!;
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.height).toBeGreaterThanOrEqual(44);
    }
    await page.goto('/mapa/?rok=-424&osoba=sokrates');
    await mapa(page);
    const anim = await page.locator('.mac').evaluate((e) => e.getAnimations({ subtree: true }).filter((a) => Number(a.effect?.getTiming().duration) > 1).length);
    expect(anim).toBe(0);
    await axe(page, '.mac__pas');
    await snimek(page, page.locator('.mac__pas'), `herna-k4-obdobi-${druh}-390`);
  });
}

async function klepniPrstem(page: Page, cdp: CDPSession, l: Locator): Promise<number> {
  const b = (await l.boundingBox())!;
  const bod = [{ x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2), id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod });
  const pred = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return pred;
}

test('dotyk přes CDP: Přehrát období, Další výprava a hra medailonku stránkou nepohnou', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.addInitScript(() => { (window as unknown as { atlasPrehravaniObdobi: object }).atlasPrehravaniObdobi = { delka: 60000 }; });
  await page.goto('/mapa/?rok=-500');
  await mapa(page);
  const cdp = await ctx.newCDPSession(page);
  const y = await klepniPrstem(page, cdp, page.locator('#obdobi-prehrat'));
  await expect(page.locator('#obdobi-prehrat')).toHaveAccessibleName('Zastavit');
  expect(y).toBe(0);
  await klepniPrstem(page, cdp, page.locator('#obdobi-prehrat'));
  await expect(page.locator('#obdobi-prehrat')).toHaveAccessibleName('Pokračovat');
  const dalsi = page.getByRole('button', { name: 'Další výprava' });
  await dalsi.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const y2 = await klepniPrstem(page, cdp, dalsi);
  await expect(page.locator('.vyprava').getByRole('heading')).toContainText('Pýthagorás');
  expect(y2).toBeGreaterThanOrEqual(0);
  await page.goto('/osobnost/theofrastos/');
  const kdo = await hra(page, 'KdoToRekl');
  const razitko = kdo.locator('.razitko-odpoved', { hasText: 'Aristotelés' });
  await razitko.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const y3 = await page.evaluate(() => scrollY);
  expect(await klepniPrstem(page, cdp, razitko)).toBe(y3);
  await expect(kdo.getByRole('group', { name: 'Rub karty' })).toContainText('Theofrastos se učil u Aristotela.');
  // Cíle 44 px v pásu a ve výpravě.
  await page.goto('/mapa/?rok=-500');
  await mapa(page);
  const male = await page.locator('.prehrat-obdobi, .vyprava').evaluateAll((v) => v.flatMap((e) => [...e.querySelectorAll('button')])
    .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 1 && (r.height < 44 || r.width < 44); })
    .map((x) => x.textContent?.trim()));
  expect(male).toEqual([]);
  await ctx.close();
});

// ─── Trasy na mini mapě ─────────────────────────────────────────────────────

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    test(`trasy na mini mapě: roky se nepotkají s názvy, rolemi ani spolu · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      for (const slug of ['sokrates', 'platon', 'aristoteles', 'gorgias', 'epikuros', 'alkibiades', 'karneades']) {
        await page.goto(`/osobnost/${slug}/`);
        await page.evaluate(() => document.fonts.ready);
        const mm = page.locator('.doba .minimapa');
        await mm.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await expect(mm.locator('.trasa').first()).toBeAttached();
        await expect(mm.locator('svg')).toHaveAttribute('aria-label', /Cesty: /);
        const kolize = await mm.evaluate((e) => {
          const roky = [...e.querySelectorAll('.rok-trasy')].map((x) => x.getBoundingClientRect());
          const jine = [...e.querySelectorAll('.nazev, .role tspan, .bod')].map((x) => x.getBoundingClientRect());
          const p = (a: DOMRect, b: DOMRect) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
          const out: string[] = [];
          roky.forEach((r, i) => {
            jine.forEach((j) => { if (p(r, j)) out.push(`rok ${i} × popisek`); });
            roky.forEach((s, k) => { if (k > i && p(r, s)) out.push(`rok ${i} × rok ${k}`); });
          });
          return { out, roky: roky.length };
        });
        expect(kolize.out, slug).toEqual([]);
        expect(kolize.roky, slug).toBeGreaterThan(0);
        if (slug === 'aristoteles' || slug === 'sokrates') await snimek(page, mm, `herna-k4-trasy-${slug}-${pr}`);
      }
      await axe(page, '.doba');
    });
  }
}
