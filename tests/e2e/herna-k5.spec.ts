// Herna K5 (herna-v1): karta Do hodiny (skrytá na stránce, vidět při promítání a v přípravě hodiny), sebehodnocení
// na konci cesty (cesta 1 a Kolik je dost?, zápis do deníku a Moje filozofie) a stránka Argumentační klamy
// a manipulace (Najdi slabé místo, Pravý, nebo podvržený?, odkazy z Otázek a z Kam dál cesty 1).
// 390 a 1440 px ve světlém i tmavém režimu, axe (WCAG 2 AA), jen klávesnicí, dotyk přes CDP (scrollY před koncem
// dotyku), obnovení stránky, bez localStorage, omezený pohyb a Klidný režim. Logiku hlídá tests/data/herna-k5.test.ts.
import { test, expect, type Page, type Locator, type CDPSession } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;
const KROK7 = '/cesta/kdy-mam-dobry-duvod-verit/7/';
const KOLIK7 = '/cesta/kolik-je-dost/7/';
const HODINA = `/hodina/?v=1&n=${encodeURIComponent('Delfy')}&z=k:kdy-mam-dobry-duvod-verit/7,b:cesta1-do-hodiny`;
const KLAMY = '/argumentacni-klamy/';
const SNIMKY = 'Claude outputs/snimky';
mkdirSync(SNIMKY, { recursive: true });

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}
async function bezPresahu(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
}
/** Ostrov, ve kterém je prvek s id, je hydratovaný. */
async function ostrov(page: Page, id: string, jmeno: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const l = page.locator(`[id="${id}"]`);
  await l.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForFunction(([i, o]) => { const a = document.getElementById(i)?.closest(`astro-island[component-url*="${o}"]`); return !!a && !a.hasAttribute('ssr'); }, [id, jmeno]);
  return l;
}
async function snimek(page: Page, l: Locator, nazev: string) {
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit, .cesta-lista { visibility: hidden !important; }' });
  const r = await l.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: Math.max(0, b.x + scrollX - 12), y: Math.max(0, b.y + scrollY - 16), width: Math.min(b.width + 24, document.documentElement.clientWidth), height: b.height + 32 };
  });
  await page.screenshot({ path: `${SNIMKY}/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}
const denikStudenta = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{"zapisy":[]}'));
/** Tabulátorem na prvek (nejvýš n stisků). */
async function tabNa(page: Page, cil: Locator, n = 40) {
  for (let i = 0; i < n; i++) {
    if (await cil.evaluate((el) => el === document.activeElement).catch(() => false)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Tabulátor se na prvek nedostal: ${cil}`);
}
async function promitat(page: Page) {
  await page.goto(HODINA);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await page.evaluate(() => document.fonts.ready);
}

// ─── Karta Do hodiny ──────────────────────────────────────────────────────────

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    test(`Do hodiny: na stránce kroku skrytá, při promítání vidět · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(KROK7);
      const karta = page.locator('#cesta1-do-hodiny');
      await expect(karta).toBeAttached();
      await expect(karta).toBeHidden();
      await expect(karta).toHaveAttribute('data-pagefind-ignore', /.*/);
      await expect(page.getByRole('complementary', { name: 'Do hodiny' })).toHaveCount(0);
      // Promítání: celý krok má kartu na konci, zastavení karty je jen ona.
      await promitat(page);
      await expect(karta).toBeVisible();
      await page.locator('[data-hl-dalsi]').click();
      await page.waitForFunction(() => location.hash === '#cesta1-do-hodiny' && document.documentElement.classList.contains('promitani-pripraveno'));
      await expect(page.getByRole('complementary', { name: 'Do hodiny' })).toBeVisible();
      await expect(karta.locator('dt')).toHaveText(['Ve dvojici', 'Celá třída']);
      await expect(karta.locator('dd').first()).toContainText('Vyměňte si pravidla');
      await expect(karta.locator('dd').last()).toContainText('Prótagorás by řekl');
      // Nadtitulek lístku je malý, ne nadpis kroku.
      expect(await karta.locator('h2').evaluate((e) => parseFloat(getComputedStyle(e).fontSize))).toBeLessThan(24);
      await bezPresahu(page);
      await axe(page, '#cesta1-do-hodiny');
      await page.screenshot({ path: `${SNIMKY}/herna-k5-promitani-karta-${pr}.png` });
      // Konec promítání: karta zase zmizí.
      await page.locator('[data-hl-ukoncit]').click();
      await page.waitForLoadState('load');
      await page.goto(KROK7);
      await expect(karta).toBeHidden();
    });
  }
}

test('Do hodiny v přípravě hodiny: zastavení s oběma otázkami, přidané jen klávesnicí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const k = await (await page.request.get('/hodina/katalog.json')).json();
  const z = k.zastaveni.find((x: { id: string }) => x.id === 'b:cesta1-do-hodiny');
  expect(z).toMatchObject({ druh: 'blok', typ: 'DoHodiny', nadtitulek: 'Do hodiny', kotva: 'cesta1-do-hodiny', rodic: 'k:kdy-mam-dobry-duvod-verit/7' });
  expect(z.doHodiny.dvojice).toContain('Vyměňte si pravidla');
  await page.goto('/hodina/nova/');
  await page.waitForSelector('astro-island[component-url*="Skladatel"]:not([ssr])', { state: 'attached' });
  await expect(page.locator('.skupina').first()).toBeVisible();
  const hledat = page.locator('#vyber-hledat');
  await tabNa(page, hledat, 80);
  await page.keyboard.type('Prótagorás by řekl');
  // Řádek karty (položka kroku 7 obsahuje vnořené položky, proto řádek, ne položka).
  const polozka = page.locator('.polozka__radek', { has: page.locator('.polozka__dvojice') });
  await expect(polozka).toHaveCount(1);
  await expect(polozka.locator('.polozka__druh')).toHaveText('Do hodiny');
  await expect(polozka.locator('.polozka__dvojice')).toContainText('Ve dvojici: Vyměňte si pravidla');
  await tabNa(page, polozka.getByRole('button', { name: /^Přidat do hodiny: Prótagorás/ }), 30);
  await page.keyboard.press('Enter');
  const zvolene = page.locator('.zvolena > li');
  await expect(zvolene).toHaveCount(1);
  await expect(zvolene.locator('.zvolene__dvojice')).toContainText('Vyměňte si pravidla');
  await expect(zvolene.locator('select')).toHaveCount(0);
  await axe(page, '.skladatel');
});

// ─── Sebehodnocení ────────────────────────────────────────────────────────────

const UMIM = (slug: string) => `#${slug}-umim-stanovisko`;
const NEJSEM = (slug: string) => `#${slug}-nejsem-stanovisko`;

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    test(`sebehodnocení pod závěrem cesty 1 · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(KROK7);
      const s = await ostrov(page, 'kdy-mam-dobry-duvod-verit-sebehodnoceni', 'Sebehodnoceni');
      await expect(page.getByRole('region', { name: 'Kam tě cesta dovedla?' })).toBeVisible();
      await expect(s.getByRole('textbox')).toHaveCount(2);
      await expect(s.locator('label')).toHaveText([/^Co už umím\s*Nepovinné$/, /^Co mi ještě není jasné\s*Nepovinné$/]);
      // Nic se nehodnotí: žádné body, správně ani počítadlo.
      await expect(s).not.toContainText(/\bbod|\d+ z \d+|sedí/);
      // Stojí za Závěrem cesty.
      expect(await page.evaluate(() => {
        const z = document.getElementById('cesta1-moje-pravidlo')!;
        const sb = document.getElementById('kdy-mam-dobry-duvod-verit-sebehodnoceni')!;
        return !!(z.compareDocumentPosition(sb) & Node.DOCUMENT_POSITION_FOLLOWING);
      })).toBe(true);
      await bezPresahu(page);
      await axe(page, '#kdy-mam-dobry-duvod-verit-sebehodnoceni');
      await snimek(page, s, `herna-k5-sebe-cesta1-${pr}`);
    });
  }
}

test('sebehodnocení jen klávesnicí: zápis do deníku, obnovení stránky, Moje filozofie', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KROK7);
  await ostrov(page, 'kdy-mam-dobry-duvod-verit-sebehodnoceni', 'Sebehodnoceni');
  const pravidlo = page.locator('#cesta1-moje-pravidlo-stanovisko');
  await pravidlo.focus();
  await page.keyboard.type('Věřím tomu, co obstojí v otázkách.');
  await tabNa(page, page.locator(UMIM('kdy-mam-dobry-duvod-verit')), 10);
  await page.keyboard.type('Zeptat se, odkud to kdo ví.');
  await tabNa(page, page.locator(NEJSEM('kdy-mam-dobry-duvod-verit')), 10);
  await page.keyboard.type('Komu věřit, když to ověřit nejde.');
  await page.keyboard.press('Tab');
  await expect(page.locator('#kdy-mam-dobry-duvod-verit-nejsem-stav')).toHaveText('Uloženo v deníku.');
  const d = await denikStudenta(page);
  const z = (id: string) => d.zapisy.find((x: { id: string }) => x.id === id);
  expect(z('kdy-mam-dobry-duvod-verit-umim')).toMatchObject({ odpoved: 'Zeptat se, odkud to kdo ví.', druh: 'sebehodnoceni', otazka: 'Kdy mám dobrý důvod věřit? Co už umím' });
  expect(z('kdy-mam-dobry-duvod-verit-nejsem').odkaz).toBe(`${KROK7}#kdy-mam-dobry-duvod-verit-sebehodnoceni`);
  await page.reload();
  await ostrov(page, 'kdy-mam-dobry-duvod-verit-sebehodnoceni', 'Sebehodnoceni');
  await expect(page.locator(UMIM('kdy-mam-dobry-duvod-verit'))).toHaveValue('Zeptat se, odkud to kdo ví.');
  // Smazaný text zápis smaže.
  await page.locator(NEJSEM('kdy-mam-dobry-duvod-verit')).fill('');
  await page.locator(NEJSEM('kdy-mam-dobry-duvod-verit')).blur();
  await expect.poll(async () => (await denikStudenta(page)).zapisy.some((x: { id: string }) => x.id === 'kdy-mam-dobry-duvod-verit-nejsem')).toBe(false);
  // Deník: vedle Na začátku × Teď u otázky 7, a v zápisníku u cesty.
  await page.goto('/denik/');
  const mf = page.getByRole('region', { name: 'Moje filozofie' });
  const sebe = mf.locator('.mf-sebe');
  await expect(sebe).toContainText('Co už umím');
  await expect(sebe).toContainText('Zeptat se, odkud to kdo ví.');
  await expect(sebe.locator('.mf-nic')).toHaveText('Nenapsáno.');
  await expect(sebe.getByRole('link', { name: 'Kdy mám dobrý důvod věřit?' })).toHaveAttribute('href', `${KROK7}#kdy-mam-dobry-duvod-verit-sebehodnoceni`);
  await expect(page.locator('.kapitoly')).toContainText('Zeptat se, odkud to kdo ví.');
  await axe(page, '.moje-filozofie');
});

test('sebehodnocení i v další cestě (Kolik je dost?) bez úpravy jejího textu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KOLIK7);
  const s = await ostrov(page, 'kolik-je-dost-sebehodnoceni', 'Sebehodnoceni');
  await s.locator(UMIM('kolik-je-dost')).fill('Rozlišit, co potřebuju a co chci.');
  await s.locator(UMIM('kolik-je-dost')).blur();
  await expect(s.locator('#kolik-je-dost-umim-stav')).toHaveText('Uloženo v deníku.');
  await page.goto('/denik/');
  await expect(page.locator('.mf-otazka', { hasText: 'Jak mám žít?' }).locator('.mf-sebe')).toContainText('Rozlišit, co potřebuju a co chci.');
  // Od kroku T má kartu Do hodiny každá cesta; na stránce kroku je skrytá.
  await page.goto(KOLIK7);
  await expect(page.locator('#cesta6-do-hodiny')).toBeAttached();
  await expect(page.locator('#cesta6-do-hodiny')).toBeHidden();
});

test('sebehodnocení bez localStorage funguje do zavření stránky', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Úložiště je vypnuté.'); } });
  });
  const chyby: string[] = [];
  page.on('pageerror', (e) => chyby.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KROK7);
  const s = await ostrov(page, 'kdy-mam-dobry-duvod-verit-sebehodnoceni', 'Sebehodnoceni');
  await s.locator(UMIM('kdy-mam-dobry-duvod-verit')).fill('Ptát se po důvodu.');
  await s.locator(UMIM('kdy-mam-dobry-duvod-verit')).blur();
  await expect(s.locator('#kdy-mam-dobry-duvod-verit-umim-stav')).toHaveText('Uloženo v deníku.');
  await page.goto(KLAMY);
  const sl = await ostrov(page, 'klamy-slabe-video', 'NajdiSlabeMisto');
  await sl.locator('button.veta-arg', { hasText: 'tolika lidem' }).click();
  await sl.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(sl).toContainText('Kdo by tu větu škrtl s tebou');
  expect(chyby).toEqual([]);
});

// ─── Argumentační klamy a manipulace ─────────────────────────────────────────

test('klamy: deset klamů, každý s antickým a dnešním případem, bloky uprostřed, odkaz do deníku', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(KLAMY);
  await expect(page.locator('h1')).toHaveText('Argumentační klamy a manipulace.');
  const klamy = page.locator('.oddil-stranky h3');
  await expect(klamy).toHaveText(['Útok na osobu', 'Důraz na autoritu', 'Důraz na většinu', 'Apel na soucit', 'Slaměný panák', 'Falešné dilema', 'Šikmá plocha', 'Logický kruh', 'Vytržení z kontextu', 'Podvržený citát']);
  // Bloky stojí mezi oddíly, ne na konci.
  const poradi = await page.evaluate(() => [...document.querySelectorAll('#triky-na-lidi, #klamy-slabe-video, #triky-s-myslenkou, #cizi-jmeno, #klamy-pravy, #prameny')].map((e) => e.id));
  expect(poradi).toEqual(['triky-na-lidi', 'klamy-slabe-video', 'triky-s-myslenkou', 'cizi-jmeno', 'klamy-pravy', 'prameny']);
  await expect(page.getByRole('navigation', { name: 'Kam dál' }).getByRole('link').first()).toHaveAttribute('href', '/denik/');
  // Prameny nesou i výklad v próze (Aristotelés, dopisy Seneky a Pavla).
  await expect(page.locator('#prameny')).toContainText('O sofistických důkazech');
  // Odkazy na stránku: Otázky a Kam dál cesty 1 (text cesty se nemění).
  await page.goto('/otazky/');
  await expect(page.locator('a.uvodni[href="/argumentacni-klamy/"]')).toContainText('Argumentační klamy a manipulace');
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(page.locator('#hotovo a[href="/argumentacni-klamy/"]')).toHaveCount(1);
  await page.goto('/cesta/kolik-je-dost/');
  await expect(page.locator('#hotovo a[href="/argumentacni-klamy/"]')).toHaveCount(0);
});

test('hledání najde stránku klamů („manipulace“, „klamy“); kartu Do hodiny ani hry neindexuje', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/otazky/');
  await page.waitForSelector('astro-island[component-url*="Hledani"]:not([ssr])', { state: 'attached' });
  const dialog = page.getByRole('dialog', { name: 'Hledání v atlasu' });
  for (const dotaz of ['manipulace', 'klamy', 'slaměný panák']) {
    await page.keyboard.press('/');
    await expect(dialog).toBeVisible();
    await dialog.locator('input').fill(dotaz);
    await expect(dialog.locator('.pagefind-ui__result-link[href^="/argumentacni-klamy/"]').first(), dotaz).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
  await page.keyboard.press('/');
  await dialog.locator('input').fill('Vyměňte si pravidla');
  await expect(dialog.locator('.pagefind-ui__message')).toBeVisible({ timeout: 15_000 });
  await expect(dialog.locator('.pagefind-ui__result-link[href*="/cesta/kdy-mam-dobry-duvod-verit/7/"]')).toHaveCount(0);
});

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    test(`klamy: Najdi slabé místo a Pravý, nebo podvržený? · ${pr}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(KLAMY);
      const sl = await ostrov(page, 'klamy-slabe-video', 'NajdiSlabeMisto');
      // Před škrtem nikdo nemluví.
      await expect(sl).not.toContainText('Pólovi');
      await axe(page, '#klamy-slabe-video');
      await sl.locator('button.veta-arg', { hasText: 'milion sledujících' }).click();
      await sl.getByRole('button', { name: 'Zapsat do deníku' }).click();
      await expect(sl).toContainText('Cicero');
      await axe(page, '#klamy-slabe-video');
      const pv = await ostrov(page, 'klamy-pravy', 'PravyNeboPodvrzeny');
      await expect(pv).toContainText('Vzdělání není plnění nádoby');
      await pv.locator('button.razitko-verdikt--nerekl').click();
      await expect(pv).toContainText('Plútarchos');
      await axe(page, '#klamy-pravy');
      await bezPresahu(page);
      await snimek(page, pv, `herna-k5-klamy-pravy-${pr}`);
    });
  }
}

test('klamy jen klávesnicí, s obnovením stránky a zápisem do deníku', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KLAMY);
  const sl = await ostrov(page, 'klamy-slabe-video', 'NajdiSlabeMisto');
  const veta = sl.locator('button.veta-arg', { hasText: 'tolika lidem' });
  // Začátek od nadpisu oddílu před blokem (nadpis má tabindex="-1"), dál jen klávesy.
  await page.locator('#triky-na-lidi-nadpis').focus();
  await tabNa(page, veta, 40);
  await page.keyboard.press('Enter');
  await expect(veta).toContainText('(přeškrtnutá)');
  await tabNa(page, sl.getByRole('button', { name: 'Zapsat do deníku' }), 10);
  await page.keyboard.press('Enter');
  await expect(sl).toContainText('Pólovi');
  const d = await denikStudenta(page);
  expect(d.zapisy.find((x: { id: string }) => x.id === 'klamy-slabe-video')).toMatchObject({ druh: 'slabe' });
  await page.reload();
  const sl2 = await ostrov(page, 'klamy-slabe-video', 'NajdiSlabeMisto');
  await expect(sl2.locator('button.veta-arg', { hasText: 'tolika lidem' })).toContainText('(přeškrtnutá)');
  await expect(sl2).toContainText('Pólovi');
  const pv = await ostrov(page, 'klamy-pravy', 'PravyNeboPodvrzeny');
  await page.locator('#cizi-jmeno-nadpis').focus();
  await tabNa(page, pv.locator('button.razitko-verdikt--nerekl'), 30);
  await page.keyboard.press('Enter');
  await expect(pv).toContainText('Plútarchos');
  await page.reload();
  const pv2 = await ostrov(page, 'klamy-pravy', 'PravyNeboPodvrzeny');
  await expect(pv2).toContainText('Plútarchos');
});

async function klepniPrstem(page: Page, cdp: CDPSession, l: Locator): Promise<number> {
  const b = (await l.boundingBox())!;
  const bod = [{ x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2), id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod });
  const pred = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return pred;
}

test('klamy a sebehodnocení dotykem přes CDP: klepnutí stránkou nepohne', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(KLAMY);
  const cdp = await ctx.newCDPSession(page);
  const sl = await ostrov(page, 'klamy-slabe-video', 'NajdiSlabeMisto');
  const veta = sl.locator('button.veta-arg', { hasText: 'milion sledujících' });
  await veta.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const y = await page.evaluate(() => scrollY);
  expect(await klepniPrstem(page, cdp, veta)).toBe(y);
  await expect(veta).toContainText('(přeškrtnutá)');
  const pv = await ostrov(page, 'klamy-pravy', 'PravyNeboPodvrzeny');
  const razitko = pv.locator('button.razitko-verdikt--rekl');
  await razitko.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const y2 = await page.evaluate(() => scrollY);
  expect(await klepniPrstem(page, cdp, razitko)).toBe(y2);
  await expect(pv).toContainText('Plútarchos');
  // Cíle aspoň 44 px.
  const male = await page.locator('#klamy-slabe-video, #klamy-pravy').evaluateAll((v) => v.flatMap((e) => [...e.querySelectorAll('button')])
    .filter((x) => { const r = x.getBoundingClientRect(); return r.width > 1 && (r.height < 44 || r.width < 44); })
    .map((x) => x.textContent?.trim()));
  expect(male).toEqual([]);
  await ctx.close();
});

for (const druh of ['omezeny', 'klidny'] as const) {
  test(`K5 · ${druh}: otisk razítka stojí na konci, sebehodnocení a karta bez pohybu`, async ({ page }) => {
    if (druh === 'klidny') await page.addInitScript(() => localStorage.setItem('atlas-klidny', '1'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    // Klidný režim nechává pohyb bloku po činu (lístek), herní pohyb (otisk razítka) ne; omezený pohyb nic.
    const dlouhe = (l: Locator) => l.evaluate((e, jenOtisk) => e.getAnimations({ subtree: true })
      .filter((a) => Number(a.effect?.getTiming().duration) > 1)
      .filter((a) => { const t = (a.effect as KeyframeEffect | null)?.target as Element | null; return !jenOtisk || !!t?.matches('.otisk, .otisk *'); }).length, druh === 'klidny');
    await page.goto(KLAMY);
    const pv = await ostrov(page, 'klamy-pravy', 'PravyNeboPodvrzeny');
    await pv.locator('button.razitko-verdikt--nerekl').click();
    await page.waitForTimeout(80);
    expect(await dlouhe(pv)).toBe(0);
    await page.goto(KROK7);
    const s = await ostrov(page, 'kdy-mam-dobry-duvod-verit-sebehodnoceni', 'Sebehodnoceni');
    await s.locator(UMIM('kdy-mam-dobry-duvod-verit')).fill('Něco.');
    expect(await dlouhe(s)).toBe(0);
    await promitat(page);
    expect(await dlouhe(page.locator('#cesta1-do-hodiny'))).toBe(0);
  });
}
