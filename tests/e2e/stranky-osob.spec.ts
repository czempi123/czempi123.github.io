// Stránky osob v novém vzhledu (design-v2, K3): titulek s pruhem, razítko místa, deska na listu s páskami,
// lístky cest a záložky otázek, razítka lidí v Době a lidech, Kam dál z ležících karet, příchod na profil
// jen při nové návštěvě, let fotky z karty na desku a ikona Agory v záložce prohlížeče.
import { test, expect } from '@playwright/test';

test('hlavička profilu: jméno na listu, pointa na pruhu, razítko místa, deska se dvěma páskami a filtrem fotky', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveText(/^Sókratés\.\s*Muž, který se ptal\.$/);
  await expect(h1.locator('.titulek__list')).toHaveText('Sókratés.');
  await expect(h1.locator('.titulek-pruh__papir')).toHaveText('Muž, který se ptal.');
  // Pruh nese papír období a písmo ruky.
  const pruh = await h1.locator('.titulek-pruh__papir').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, font: getComputedStyle(e).fontFamily }));
  expect(pruh.bg).toBe('rgb(163, 67, 41)');
  expect(pruh.font).toContain('Kalam');
  await expect(page.locator('.osobnost__hlavicka .razitko-mista')).toContainText('Athény');
  await expect(page.locator('.osobnost__hlavicka .razitko-mista').getByRole('link')).toHaveText(/období 1/);
  const deska = page.locator('#deska-osoby');
  await expect(deska.locator('.paska')).toHaveCount(2);
  const filtr = await deska.locator('img').evaluate((e) => getComputedStyle(e).filter);
  expect(filtr).toContain('grayscale');
  expect(await deska.locator('img').evaluate((e) => getComputedStyle(e).mixBlendMode)).toBe('normal');
  // Proč kalich: ikona atributu ve vtlačeném kolečku, pro čtečku skrytá.
  await expect(deska.locator('.proc .vlys')).toHaveAttribute('aria-hidden', 'true');
  await expect(deska.locator('.proc')).toContainText('Proč kalich?');
  // Kalam 700 je přednačtený (pruh je na první obrazovce).
  await expect(page.locator('link[rel="preload"][href*="kalam-latin-700"]')).toHaveCount(1);
});

test('lístky cest s pahýlem a záložky otázek; na telefonu záložky pod sebou pod deskou', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const cesta = page.locator('.vstup--cesta').first();
  await expect(cesta.locator('.vstup__pahyl')).toHaveText(/7\s*kroků\s*asi 14 min/);
  await expect(cesta.locator('.vstup__pahyl')).toHaveAttribute('aria-hidden', 'true');
  // Po najetí se lístek u perforace natrhne: pahýl se odklopí (natočení), hlavní díl zůstane rovně.
  // Najetí se opakuje v čekání: stránka se po načtení ještě může posunout (příchod, lišta Obsah) a ukazatel z lístku sjet.
  await expect.poll(async () => {
    await cesta.hover();
    // Minifikace slije posun a natočení do jedné matice: 7° je sin 0,1219.
    return cesta.locator('.vstup__pahyl').evaluate((e) => getComputedStyle(e).transform);
  }).toMatch(/^matrix\(0\.99\d*, 0\.12\d*/);
  // Nadtitulek z obsahu („Sókratův portrét“) v hlavičce není (autor 9. 11. 2026).
  await expect(page.locator('.osobnost__hlavicka')).not.toContainText('Sókratův portrét');
  const zalozky = page.locator('.vstup--otazka');
  await expect(zalozky).toHaveCount(3);
  // Záložka v papíru období, popisek čte čtečka celý.
  expect(await zalozky.first().evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(163, 67, 41)');
  await expect(zalozky.first()).toHaveAccessibleName(/^Velká otázka 7\s*Jak poznám, co je pravda\?$/);
  // Notebook: záložky vedle sebe.
  const [a, b] = [(await zalozky.nth(0).boundingBox())!, (await zalozky.nth(1).boundingBox())!];
  expect(b.x).toBeGreaterThan(a.x + a.width - 1);

  // Tři cesty (Seneca) stojí v jedné řadě i v užším okně a záložky pod nimi zůstanou na první obrazovce.
  for (const sirka of [1440, 1180]) {
    await page.setViewportSize({ width: sirka, height: 900 });
    await page.goto('/osobnost/seneca/');
    const y = await page.locator('.vstup--cesta').evaluateAll((e) => e.map((x) => Math.round(x.getBoundingClientRect().top)));
    expect(y).toHaveLength(3);
    expect(new Set(y).size).toBe(1);
    expect((await page.locator('.vstup--otazka').first().boundingBox())!.y).toBeLessThan(900);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/epikuros/');
  const z = page.locator('.vstup--otazka');
  const boxy = await z.evaluateAll((e) => e.map((x) => x.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
  expect(boxy.length).toBe(7);
  // Pod sebou, každá trochu jinak odsazená zleva, všechny končí u okraje listu vpravo.
  for (let i = 1; i < boxy.length; i++) expect(boxy[i].y).toBeGreaterThan(boxy[i - 1].y + boxy[i - 1].h - 1);
  expect(new Set(boxy.map((r) => Math.round(r.x))).size).toBe(3);
  expect(new Set(boxy.map((r) => Math.round(r.x + r.w))).size).toBe(1);
  // Deska je i se sedmi otázkami na první obrazovce; stránka nepřetéká do strany.
  const deska = (await page.locator('#deska-osoby').boundingBox())!;
  expect(deska.y).toBeLessThan(844 - 120);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('razítka lidí: Doba a lidé, medailonek a deska bez obrazu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const lide = page.locator('.doba__vztahy .lide li');
  const razitka = page.locator('.doba__vztahy .razitko-cloveka');
  await expect(razitka).toHaveCount(await lide.count());
  await expect(page.locator('.doba__vztahy .mince')).toHaveCount(0);
  const platon = page.locator('.doba__vztahy [data-razitko="platon"]');
  await expect(platon).toHaveAttribute('aria-hidden', 'true');
  await expect(platon.locator('textPath').first()).toHaveText('Platón');
  await expect(platon.locator('textPath').nth(1)).toHaveText(/427.347/);
  await expect(platon.locator('use')).toHaveAttribute('href', '/ikony/atributy.svg#cave');
  // Kdo atribut nemá, má razítkové vlnovky, nikdy iniciálu.
  await expect(page.locator('.doba__vztahy [data-razitko="chairefon"] path.rz-ik')).toHaveCount(1);
  // Id oblouků se na stránce neopakují; nedotištěný inkoust je maska v CSS, ne SVG filtr u každého razítka.
  const idcka = await page.locator('.razitko-cloveka [id]').evaluateAll((e) => e.map((x) => x.id));
  expect(new Set(idcka).size).toBe(idcka.length);
  await expect(page.locator('.razitko-cloveka [filter]')).toHaveCount(0);
  expect(await platon.locator('svg').evaluate((e) => getComputedStyle(e).maskImage)).toContain('svg');
  // Natočení podle id: aspoň dvě různá.
  const uhly = await razitka.evaluateAll((e) => e.map((x) => getComputedStyle(x).rotate));
  expect(new Set(uhly).size).toBeGreaterThan(1);

  // Deska bez obrazu (Parmenidés): razítko s atributem na papíře, s popiskem pro čtečku.
  await page.goto('/osobnost/parmenides/');
  await expect(page.locator('#deska-osoby .razitko-cloveka')).toHaveAttribute('role', 'img');
  await expect(page.locator('#deska-osoby .deska__plocha.papir')).toHaveCount(1);
});

test('Kam dál: ležící karty, připravovaná karta čárkovaná bez šipky', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const karty = page.locator('.kamdal a.polozka');
  expect(await karty.count()).toBeGreaterThan(1);
  for (const k of await karty.all()) await expect(k).toHaveClass(/lezi-odkaz/);
  await expect(page.locator('.kamdal .polozka--ceka .sipka')).toHaveCount(0);
});

test('příchod na profil: jen při nové návštěvě, ne po Zpět a ne při omezeném pohybu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  await expect(page.locator('html')).toHaveClass(/(^|\s)prichod(\s|$)/);
  expect(await page.locator('.prichod-titulek').evaluate((e) => getComputedStyle(e).animationName)).toBe('prichod-titulek');
  // Klidový stav je konec pohybu: titulek po příchodu stojí na místě a je celý vidět.
  await page.waitForTimeout(800);
  expect(await page.locator('.prichod-titulek').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  await page.goto('/lide/');
  await page.goBack();
  await expect(page).toHaveURL(/\/osobnost\/sokrates\/$/);
  await expect(page.locator('html')).not.toHaveClass(/(^|\s)prichod(\s|$)/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/osobnost/platon/');
  await expect(page.locator('html')).not.toHaveClass(/(^|\s)prichod(\s|$)/);
  expect(await page.locator('.prichod-titulek').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
});

test('let fotky: karta pošle desce jméno přechodu, deska ho po přechodu vrátí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Na cílové stránce zaznamená klíč od karty a jméno přechodu desky hned po pagereveal (než přechod skončí).
  // Přechod mezi dokumenty headless Chromium na stránkách s několika styly občas vynechá (i před K3):
  // jméno desky se proto ověřuje, jen když přechod nastal.
  await page.addInitScript(() => {
    addEventListener('pagereveal', (e) => {
      const w = window as unknown as { __klic: string | null; __vt: boolean; __let?: string };
      w.__klic = sessionStorage.getItem('atlas-let-desky');
      w.__vt = !!(e as Event & { viewTransition?: object }).viewTransition;
      setTimeout(() => {
        const d = document.getElementById('deska-osoby');
        w.__let = d ? d.style.viewTransitionName : 'bez desky';
      }, 0);
    });
  });
  const stav = () => page.evaluate(() => {
    const w = window as unknown as { __klic: string | null; __vt: boolean; __let?: string };
    return { klic: w.__klic, vt: w.__vt, jmeno: w.__let };
  });
  await page.goto('/osobnost/sokrates/');
  const karta = page.locator('.kamdal a.polozka[href="/osobnost/platon/"]');
  await karta.scrollIntoViewIfNeeded();
  await karta.click();
  await expect(page).toHaveURL(/\/osobnost\/platon\/$/);
  await expect.poll(async () => (await stav()).jmeno).not.toBeUndefined();
  const s = await stav();
  // Karta na staré stránce dostala jméno přechodu a ohlásila cíl.
  expect(s.klic).toBe('/osobnost/platon/');
  if (s.vt) expect(s.jmeno).toBe('deska-osoby');
  // Po přechodu jméno zmizí a nic nezůstane v úložišti.
  await expect.poll(() => page.locator('#deska-osoby').evaluate((e) => (e as HTMLElement).style.viewTransitionName)).toBe('');
  expect(await page.evaluate(() => sessionStorage.getItem('atlas-let-desky'))).toBeNull();
  // Jméno v řádku textu (Doba a lidé) let nespustí.
  await page.goto('/osobnost/sokrates/');
  await page.locator('.doba__vztahy a', { hasText: 'Platón' }).first().click();
  await expect(page).toHaveURL(/\/osobnost\/platon\/$/);
  await expect.poll(async () => (await stav()).jmeno).not.toBeUndefined();
  expect((await stav()).klic).toBeNull();
  expect((await stav()).jmeno).toBe('');
});

test('ikona v záložce prohlížeče: velké A na útržku papíru v inkoustu', async ({ page, request }) => {
  await page.goto('/osobnost/sokrates/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  const svg = await (await request.get('/favicon.svg')).text();
  expect(svg).toContain('#24211D');
  expect(svg).not.toContain('circle');
});
