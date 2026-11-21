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

test('lístky cest s pahýlem a záložky otázek; na telefonu záložky pod sebou až za úvodem', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const cesta = page.locator('.vstup--cesta').first();
  await expect(cesta.locator('.vstup__pahyl')).toHaveText(/7\s*kroků\s*asi 17 min/);
  await expect(cesta.locator('.vstup__pahyl')).toHaveAttribute('aria-hidden', 'true');
  // Po najetí se lístek u perforace odtrhne: pahýl odjede doprava (mezera) a ukážou se zubaté okraje.
  // Najetí se opakuje v čekání: stránka se po načtení ještě může posunout (příchod, lišta Obsah) a ukazatel z lístku sjet.
  await expect.poll(async () => {
    await cesta.hover();
    // Minifikace může slít posun a natočení do jedné matice: čte se posun doprava (m41).
    return cesta.locator('.vstup__pahyl').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  }).toBeGreaterThanOrEqual(10);
  // Pod zátěží celého běhu může přechod ještě dobíhat (0,98): čeká se na konec.
  await expect.poll(() => cesta.locator('.vstup__trh').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
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
  // K3 dodatek: záložky stojí až za úvodem (a citátem pod ním), před první kapitolou; mezi deskou a prvním
  // odstavcem nic není. Přesun dělá skript při čtení stránky, už při DOMContentLoaded je hotový.
  const poradi = await page.evaluate(() => {
    const y = (s: string) => document.querySelector(s)!.getBoundingClientRect().top;
    return { deska: y('#deska-osoby'), uvod: y('.obsah .uvod'), otazky: y('.vstupy-osoby--otazky'), kapitola: y('.kapitola'), vHlavicce: !!document.querySelector('.osobnost__hlavicka .vstupy-osoby--otazky') };
  });
  expect(poradi.vHlavicce).toBe(false);
  expect(poradi.deska).toBeLessThan(poradi.uvod);
  expect(poradi.uvod).toBeLessThan(poradi.otazky);
  expect(poradi.otazky).toBeLessThan(poradi.kapitola);
  await expect(page.locator('.vstupy-osoby--otazky')).toHaveClass(/vstupy-osoby--za-uvodem/);
  // Odstavec úvodu začíná hned pod deskou (jen lišta Obsah mezi nimi), ne až za záložkami.
  const uvod = (await page.locator('.obsah .uvod p').first().boundingBox())!;
  expect(uvod.y - (deska.y + deska.height)).toBeLessThan(160);
  // „Proč …?“ a popisek obrazu stojí na telefonu až za prvním odstavcem úvodu (odpověď 4 po K3 dodatku).
  await expect(page.locator('.osobnost__deska figcaption')).toBeHidden();
  const zaUvodem = page.locator('.obsah .uvod > p:first-child + .deska-za-uvodem');
  await expect(zaUvodem).toBeVisible();
  await expect(zaUvodem).toContainText('Proč');
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      (window as unknown as { __zaUvodem: boolean }).__zaUvodem = !document.querySelector('.osobnost__hlavicka .vstupy-osoby--otazky');
    });
  });
  await page.reload();
  expect(await page.evaluate(() => (window as unknown as { __zaUvodem: boolean }).__zaUvodem)).toBe(true);
  // Na notebooku se vrátí do hlavičky (i po změně šířky okna).
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.osobnost__hlavicka .vstupy-osoby--otazky')).toHaveCount(1);
  await expect(page.locator('.vstupy-osoby--za-uvodem')).toHaveCount(0);
  await expect(page.locator('.osobnost__deska figcaption')).toContainText('Proč');
  await expect(page.locator('.deska-za-uvodem')).toBeHidden();
  // Společný profil má záložku vedle cesty v hlavičce i na telefonu.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/krates-a-hipparchia/');
  await expect(page.locator('.osobnost__hlavicka .vstupy-osoby--otazky')).toHaveCount(1);
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
  // Kdo atribut ani rodiště nemá, má razítkové vlnovky, nikdy iniciálu.
  await expect(page.locator('.doba__vztahy [data-razitko="chairefon"] path.rz-ik')).toHaveCount(1);
  // Kdo atribut nemá a rodiště ano, má uprostřed město a rok narození (K3 dodatek, bod 8); „asi“ zůstává.
  const alk = page.locator('.doba__vztahy [data-razitko="alkibiades"]');
  await expect(alk.locator('.rz-m')).toHaveText('Athény');
  await expect(alk.locator('.rz-rok')).toHaveText(/^asi\s450$/);
  await expect(alk.locator('.rz-era')).toHaveText(/př.\sn.\sl./);
  await expect(alk.locator('path.rz-ik')).toHaveCount(0);
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

test('čistý list: souvislý text kapitoly na listu s jednou páskou, aktivity na tečkách (K3 dodatek, bod 1)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const kapitoly = page.locator('.kapitola');
  const n = await kapitoly.count();
  expect(n).toBe(5);
  for (let i = 0; i < n; i++) {
    const k = kapitoly.nth(i);
    // Nadpis a první text leží na prvním listu; páska jen na něm, pokračovací list za aktivitou ji nemá.
    await expect(k.locator('.cisty-list').first().locator('h2')).toHaveCount(1);
    await expect(k.locator('.cisty-list > .paska')).toHaveCount(1);
    // Odstavce kapitoly jsou všechny na listu; bloky a ostrovy ne.
    expect(await k.evaluate((e) => [...e.querySelectorAll('.ctenarsky > p')].length)).toBe(0);
    expect(await k.locator('.cisty-list :is(.blok, astro-island, .kresba)').count()).toBe(0);
  }
  // List se nenatáčí, má papír listu a stín; text se vejde do 80 znaků na řádek.
  const list = page.locator('#delfy .cisty-list').first();
  expect(await list.evaluate((e) => getComputedStyle(e).rotate)).toBe('none');
  expect(await list.evaluate((e) => getComputedStyle(e).boxShadow)).not.toBe('none');
  const znaku = async () => page.locator('#delfy .cisty-list p').first().evaluate((p) => {
    const r = document.createRange(); r.selectNodeContents(p);
    const radku = [...r.getClientRects()].reduce((s, x, i, a) => (i && Math.abs(x.top - a[i - 1].top) < 4 ? s : s + 1), 0);
    return p.textContent!.length / Math.max(1, radku);
  });
  expect(await znaku()).toBeLessThanOrEqual(80);
  // Telefon: list skoro po okraj obrazovky, kolem 8 px teček, a řádek do 45 znaků.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/sokrates/');
  const r = (await page.locator('#delfy .cisty-list').first().boundingBox())!;
  expect(Math.round(r.x)).toBe(8);
  expect(Math.round(390 - r.x - r.width)).toBe(8);
  expect(await znaku()).toBeLessThanOrEqual(45);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  // Medailonek: kdo a proč na listu bez pásky (vedle desky se dvěma páskami; odpověď 5 po K3 dodatku).
  await page.goto('/osobnost/thales/');
  await expect(page.locator('.cisty-list .jadro')).toHaveCount(1);
  await expect(page.locator('.jadro-list > .paska')).toHaveCount(0);
});

test('vlepené věci se nelepí stejně: uchycení citátů podle pořadí, páska jen na listu (K3 dodatek, bod 7)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const tridy = await page.locator('.obsah figure.citat:not(.citat--kompaktni)').evaluateAll((e) => e.map((x) => x.className.match(/citat--(sponka|spendlik|roh|okraj)/)?.[1]));
  expect(tridy).toEqual(['sponka', 'spendlik', 'roh', 'okraj', 'sponka', 'spendlik']);
  // Po načtení znovu stejně (pořadí, ne náhoda).
  await page.reload();
  expect(await page.locator('.obsah figure.citat:not(.citat--kompaktni)').evaluateAll((e) => e.map((x) => x.className.match(/citat--(sponka|spendlik|roh|okraj)/)?.[1]))).toEqual(tridy);
  // Citát na stránce osoby nemá vlastní pásku; uchycení kreslí ::before.
  for (const f of await page.locator('.obsah > .ctenarsky > .citat, .cisty-list > .citat').all()) {
    expect(await f.locator('.paska').evaluate((e) => getComputedStyle(e).display)).toBe('none');
  }
  expect(await page.locator('.citat--sponka').first().evaluate((e) => getComputedStyle(e, '::before').maskImage)).toContain('svg');
  // Rukou na okraji: Kalam, bez papíru; na notebooku vedle listu, na telefonu v textu.
  const okraj = page.locator('.cisty-list > .citat--okraj').first();
  expect(await okraj.locator('blockquote p').evaluate((e) => getComputedStyle(e).fontFamily)).toContain('Kalam');
  const list = (await page.locator('.cisty-list:has(> .citat--okraj)').first().boundingBox())!;
  expect((await okraj.boundingBox())!.x).toBeGreaterThan(list.x + list.width);
  await page.setViewportSize({ width: 390, height: 844 });
  const l2 = (await page.locator('.cisty-list:has(> .citat--okraj)').first().boundingBox())!;
  const o2 = (await okraj.boundingBox())!;
  expect(o2.x).toBeGreaterThanOrEqual(l2.x);
  expect(o2.x + o2.width).toBeLessThanOrEqual(l2.x + l2.width + 1);
  // Na stránce osoby je viditelná páska jen u listů a desky, ne u citátu.
  const pasky = await page.locator('.obsah .paska').evaluateAll((e) => e.filter((x) => getComputedStyle(x).display !== 'none').map((x) => x.parentElement!.className));
  for (const rodic of pasky) expect(rodic).toMatch(/cisty-list|papirovy-list|zkus|listek/);
});

test('obraz ke kapitole: vybledlé razítko předmětu jen tam, kde ho kapitola má (K3 dodatek a K7b, bod 9)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [stranka, kotva, predmet] of [['sokrates', 'delfy', 'tripod'], ['diogenes', 'lucerna', 'lantern'], ['epikuros', 'zahrada', 'sprout'], ['platon', 'chlapec-a-ctverec', 'square'], ['protagoras', 'meritko', 'ruler']]) {
    await page.goto(`/osobnost/${stranka}/`);
    await expect(page.locator('.kapitola__predmet')).toHaveCount(1);
    const p = page.locator(`#${kotva} .kapitola__predmet`);
    await expect(p).toHaveAttribute('aria-hidden', 'true');
    await expect(p.locator('use')).toHaveAttribute('href', `/ikony/atributy.svg#${predmet}`);
    const o = Number(await p.evaluate((e) => getComputedStyle(e).opacity));
    expect(o).toBeGreaterThan(0.1);
    expect(o).toBeLessThan(0.3);
  }
  // Kapitola bez předmětu razítko nemá (Aristotelés: kapitoly zatím předmět nemají).
  await page.goto('/osobnost/aristoteles/');
  await expect(page.locator('.kapitola__predmet')).toHaveCount(0);
});
