// Kartičky v Můj deník (denik-v2, K3): přidání ze všech čtyř zdrojů (stránka pojmu, výstřižek ve sbírce, lístek
// zápisu, konec kola Co ti zůstalo?), hromádka na dnes s otočením, Vím, Zopakuj si a Vyndat z kartiček, Na dnes
// stačí a Ještě pět, deník po týdnu (posunuté datum), prázdné kartičky, čtečka, pohyb a tečka Deníku.
// Líc, rub a hromádku hlídá i tests/data/karticky-obsah.test.ts; tady skutečné stránky.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { denikPodleData } from './denik';

const T = '2026-11-20T10:00:00.000Z';
const DNES = new Date('2026-11-20T09:00:00');
const POJMY = ['klid', 'slast', 'atom', 'ctnost', 'dialog', 'duse', 'etika'];
type Deník = Record<string, unknown>;
const denik = (cast: Deník = {}): Deník => ({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {}, ...cast });
const karta = (zdroj: string, ref: string, cast: Deník = {}) => ({ [`${zdroj}:${ref}`]: { zdroj, ref, prihradka: 0, pridano: T, kdy: T, ...cast } });
const sPojmy = (ids: string[], cast: Deník = {}) => denik({ karticky: Object.assign({}, ...ids.map((id, i) => karta('pojem', id, { pridano: `2026-11-20T08:0${i}:00.000Z` }))), ...cast });

async function otevri(page: Page, adresa: string, obsah: Deník | null, cas: Date = DNES) {
  await page.clock.setFixedTime(cas);
  await page.goto(adresa);
  await page.evaluate((t) => (t === null ? localStorage.removeItem('atlas-denik') : localStorage.setItem('atlas-denik', t)), obsah === null ? null : JSON.stringify(obsah));
  await page.reload();
  if (adresa === '/denik/') await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
}
const ulozeny = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
const sekce = (page: Page) => page.locator('section.karticky');
const lic = (page: Page) => sekce(page).locator('.karta__lic');
const rub = (page: Page) => sekce(page).locator('.karta__rub');
/** Stiskne tlačítko klávesnicí (fokus a Enter). */
async function stiskni(page: Page, nazev: string | RegExp) {
  await sekce(page).getByRole('button', { name: nazev }).focus();
  await page.keyboard.press('Enter');
}

test('pojem: Do kartiček na stránce pojmu, druhý stisk ji vyndá; v deníku líc a rub pojmu', async ({ page }) => {
  await otevri(page, '/pojem/klid/', denik({ cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 7, navstivene: [7], kdy: T } } }));
  await page.waitForSelector('astro-island[component-url*="DoKarticek"]:not([ssr])', { state: 'attached' });
  const tl = page.getByRole('button', { name: /^Do kartiček/ });
  await expect(tl).toHaveAttribute('aria-pressed', 'false');
  await tl.click();
  await expect(tl).toHaveAttribute('aria-pressed', 'true');
  expect((await ulozeny(page)).karticky['pojem:klid']).toMatchObject({ zdroj: 'pojem', ref: 'klid', prihradka: 0 });
  await tl.click();
  await expect(tl).toHaveAttribute('aria-pressed', 'false');
  expect((await ulozeny(page)).karticky['pojem:klid']).toBeUndefined();
  await tl.click();

  await page.goto('/denik/');
  await expect(lic(page).locator('.karta__nazev')).toHaveText('Klid');
  await expect(lic(page)).toContainText('Co to znamená? Řekni si to vlastními slovy.');
  await expect(lic(page)).not.toContainText('ataraxia');
  await lic(page).click(); // klepnutí na líc kartu taky otočí
  await expect(rub(page)).toContainText('ataraxia');
  // Odkaz zpět vede tam, kde student pojem potkal (krok 7 cesty Kolik je dost?), ne na stránku pojmu.
  await expect(rub(page).locator('.karta__zpet a')).toHaveAttribute('href', '/cesta/kolik-je-dost/7/');
});

test('citát a zápis: Do kartiček u výstřižku a u lístku s textem; Volba bez důvodu ho nemá', async ({ page }) => {
  await denikPodleData(page);
  await otevri(page, '/denik/', denik({
    cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: T } },
    zapisy: [
      { id: 'cesta6/pravidlo', otazka: 'Jaké je tvoje pravidlo?', odpoved: 'Koupím si to, až to budu potřebovat.', odkaz: '/cesta/kolik-je-dost/7/', kdy: T, druh: 'stanovisko' },
      { id: 'cesta6/volba', otazka: 'Kdy ses cítil nejhůř?', odpoved: 'B · Když jsem byl sám.', odkaz: '/cesta/kolik-je-dost/2/', kdy: T, druh: 'volba' },
    ],
    citaty: [{ id: 'epikuros-dost', text: 'Komu je málo dost, tomu není dost nic.', kde: 'Epikúros, Výrok 68', odkaz: '/osobnost/epikuros/', kdy: T, poznamka: 'Platí na nákupy.' }],
  }));
  await page.locator('details.kapitola').evaluateAll((d) => d.forEach((x) => ((x as HTMLDetailsElement).open = true)));
  const listky = page.locator('.listek-zaznamu');
  await expect(listky).toHaveCount(2);
  await expect(listky.filter({ hasText: 'Koupím si to' }).getByRole('button', { name: /^Do kartiček/ })).toHaveCount(1);
  await expect(listky.filter({ hasText: 'Když jsem byl sám' }).getByRole('button', { name: /Do kartiček/ })).toHaveCount(0);
  await listky.filter({ hasText: 'Koupím si to' }).getByRole('button', { name: /^Do kartiček/ }).click();
  await page.locator('.vyst-citat').getByRole('button', { name: /^Do kartiček/ }).click();
  await expect(page.locator('.vyst-citat').getByRole('button', { name: /^Do kartiček/ })).toHaveAttribute('aria-pressed', 'true');
  const k = (await ulozeny(page)).karticky;
  expect(Object.keys(k).sort()).toEqual(['citat:epikuros-dost', 'zapis:cesta6/pravidlo']);

  // Hromádka: nejdřív zápis (přidaný dřív), pak citát.
  await expect(lic(page).locator('.karta__nad')).toHaveText('tvůj zápis');
  await expect(lic(page)).toContainText('Jaké je tvoje pravidlo?');
  await expect(lic(page)).not.toContainText('Koupím si to');
  await stiskni(page, 'Otočit');
  await expect(rub(page).locator('.karta__pero')).toHaveText('Koupím si to, až to budu potřebovat.');
  await expect(rub(page)).toContainText('Platí to pro tebe pořád?');
  await expect(rub(page).getByRole('link', { name: 'Přepsat odpověď' })).toHaveAttribute('href', '/cesta/kolik-je-dost/7/');
  await stiskni(page, 'Vím');
  await expect(lic(page).locator('.karta__nad')).toHaveText('vystřižený citát');
  await expect(lic(page).locator('.karta__nazev')).toHaveText('Epikúros, Výrok 68');
  await expect(lic(page)).not.toContainText('Komu je málo dost');
  await stiskni(page, 'Otočit');
  await expect(rub(page).locator('.karta__citat')).toContainText('Komu je málo dost');
  await expect(rub(page).locator('.karta__pero')).toHaveText('Platí na nákupy.');

  // Vyndaný citát: kartička se neukáže, i když v deníku zůstala.
  await page.locator('.vyst-citat').getByRole('button', { name: /Vyndat ze sbírky/ }).click();
  await expect(sekce(page).locator('.karta')).toHaveCount(0);
  await expect(sekce(page)).toContainText('Na dnes stačí.');
});

test('Co ti zůstalo?: konec kola dá kartičky; líc bez možností, rub se správnou odpovědí', async ({ page }) => {
  const kroky = { 'kolik-je-dost': 7, 'co-mam-ve-svych-rukou': 8 };
  await otevri(page, '/denik/antika/', denik({
    navstivene: [{ odkaz: '/otazka/jak-zit/', nazev: 'Jak mám žít?', kdy: T }, { odkaz: '/otazka/jsem-svobodny/', nazev: 'Jsem svobodný?', kdy: T }],
    cesty: Object.fromEntries(Object.entries(kroky).map(([s, p]) => [s, { nazev: s, pocet: p, krok: p, navstivene: Array.from({ length: p }, (_, i) => i + 1), kdy: T, dokonceno: T }])),
  }));
  await page.waitForSelector('astro-island[component-url*="CoTiZustalo"]:not([ssr])', { state: 'attached' });
  const k = page.locator('#co-ti-zustalo');
  await k.locator('.zustalo__moznost').first().click();
  for (let i = 0; i < 8; i++) {
    await k.getByRole('button', { name: /Další otázka|Konec kola/ }).click();
    if (await k.locator('.zustalo__konec').count()) break;
    await k.locator('.zustalo__moznost').nth(i % 2 ? 0 : 2).click();
  }
  await k.getByRole('button', { name: 'Dát do kartiček' }).click();
  const ids = Object.values((await ulozeny(page)).karticky as Record<string, { zdroj: string; ref: string }>).map((x) => x.ref);
  expect(ids.length).toBeGreaterThan(0);

  await page.goto('/denik/');
  await expect(lic(page).locator('.karta__nad')).toHaveText('co ti zůstalo');
  const klic = await sekce(page).locator('.karta').getAttribute('data-klic');
  expect(ids.map((r) => `zustalo:${r}`)).toContain(klic);
  await expect(lic(page).locator('.karta__podnet').first()).not.toBeEmpty();
  await expect(lic(page).getByRole('button')).toHaveText(['Otočit']);
  await stiskni(page, 'Otočit');
  await expect(rub(page).locator('.karta__odpoved')).not.toBeEmpty();
  await expect(rub(page).locator('.karta__text')).not.toBeEmpty();
  await expect(rub(page).locator('.karta__zpet a')).toHaveAttribute('href', /^\/(cesta|otazka|osobnost|pojem)\//);
  const odpoved = (await rub(page).locator('.karta__odpoved').textContent())!;
  await stiskni(page, 'Zopakuj si');
  // Odpověď nestála na lícu té kartičky (ověřeno i nad všemi otázkami ve Vitestu).
  expect(odpoved.length).toBeGreaterThan(0);
});

test('hodnocení klávesnicí: otočit, Vím, Zopakuj si, Vyndat, Na dnes stačí, obnovení a Ještě pět', async ({ page }) => {
  await otevri(page, '/denik/', sPojmy(POJMY));
  await expect(sekce(page).getByRole('heading', { level: 2 })).toHaveText('Kartičky');
  // Nikde počet čekajících ani datum.
  await expect(sekce(page)).not.toContainText(/\d/);
  const nazvy: string[] = [];
  for (let i = 0; i < 5; i++) {
    nazvy.push((await lic(page).locator('.karta__nazev').textContent())!);
    await stiskni(page, 'Otočit');
    await expect(rub(page)).toBeFocused();
    const tl = i === 1 ? 'Zopakuj si' : i === 2 ? 'Vyndat z kartiček' : 'Vím';
    await stiskni(page, tl);
    if (i < 4) await expect(lic(page)).toBeFocused();
  }
  expect(nazvy).toEqual(['Klid', 'Slast', 'Atom', 'Ctnost', 'Dialog']);
  const stacilo = sekce(page).locator('.karticky__stacilo');
  await expect(stacilo).toHaveText('Na dnes stačí.');
  await expect(stacilo).toBeFocused();
  const d = await ulozeny(page);
  expect(d.karticky['pojem:klid']).toMatchObject({ prihradka: 1, naposledy: '2026-11-20' });
  expect(d.karticky['pojem:slast']).toMatchObject({ prihradka: 1, naposledy: '2026-11-20' });
  expect(d.karticky['pojem:atom']).toBeUndefined();
  expect(d.bloky['karticky/dnes'].den).toBe('2026-11-20');

  // Obnovení stránky nerozdá novou pětku.
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await expect(stacilo).toHaveText('Na dnes stačí.');
  await expect(sekce(page).locator('.karta')).toHaveCount(0);
  await stiskni(page, 'Ještě pět');
  await expect(lic(page).locator('.karta__nazev')).toHaveText('Duše');
  await expect(lic(page)).toBeFocused();
  for (let i = 0; i < 2; i++) {
    await stiskni(page, 'Otočit');
    await stiskni(page, 'Vím');
  }
  await expect(stacilo).toBeVisible();
  await expect(sekce(page).getByRole('button', { name: 'Ještě pět' })).toHaveCount(0);
});

test('deník po týdnu: hromádka začne tou, která čeká nejdéle; týž den nic', async ({ page }) => {
  // Klid a slast opakované 19. 11. (přihrádka 2: na řadě od 22. 11.), atom 13. 11. (přihrádka 1: od 14. 11.).
  const d = denik({ karticky: {
    ...karta('pojem', 'klid', { prihradka: 2, naposledy: '2026-11-19' }),
    ...karta('pojem', 'slast', { prihradka: 2, naposledy: '2026-11-19' }),
    ...karta('pojem', 'atom', { prihradka: 1, naposledy: '2026-11-13' }),
  } });
  await otevri(page, '/denik/', d, new Date('2026-11-20T18:00:00'));
  await expect(lic(page).locator('.karta__nazev')).toHaveText('Atom');
  await stiskni(page, 'Otočit');
  await stiskni(page, 'Vím');
  await expect(sekce(page)).toContainText('Na dnes stačí.');
  await expect(sekce(page).getByRole('button', { name: 'Ještě pět' })).toHaveCount(0);

  // O týden později: všechny tři, od té, která čeká nejdéle; žádný počet, datum ani zameškané dny.
  await page.clock.setFixedTime(new Date('2026-11-27T08:00:00'));
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  const poradi: string[] = [];
  for (let i = 0; i < 3; i++) {
    poradi.push((await lic(page).locator('.karta__nazev').textContent())!);
    await expect(sekce(page)).not.toContainText(/\d|zmeškal|vynechal|čeká/);
    await stiskni(page, 'Otočit');
    await stiskni(page, 'Vím');
  }
  expect(poradi).toEqual(['Klid', 'Slast', 'Atom']);
  expect((await ulozeny(page)).karticky['pojem:atom']).toMatchObject({ prihradka: 3, naposledy: '2026-11-27' });

  // Den, kdy nic na řadě není.
  await otevri(page, '/denik/', denik({ karticky: karta('pojem', 'klid', { prihradka: 3, naposledy: '2026-11-20' }) }));
  await expect(sekce(page)).toContainText('Dnes žádná. Kartičky se ozvou samy, až přijde jejich čas.');
});

test('prázdné kartičky: Přidat pojmy, které už znáš; bez potkaných pojmů oddíl není', async ({ page }) => {
  await otevri(page, '/denik/', denik({ cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: T } } }));
  await expect(sekce(page)).toContainText('Do kartiček si můžeš dát pojem, vystřižený citát nebo vlastní odpověď z cesty.');
  await stiskni(page, 'Přidat pojmy, které už znáš');
  const pridane = Object.keys((await ulozeny(page)).karticky).sort();
  expect(pridane).toContain('pojem:klid');
  expect(pridane).toContain('pojem:slast');
  expect(pridane.every((k) => k.startsWith('pojem:'))).toBe(true);
  await expect(lic(page)).toBeFocused();

  await otevri(page, '/denik/', denik({ zapisy: [{ id: 'x/y', otazka: 'Otázka?', odpoved: 'Odpověď.', odkaz: '/osobnost/sokrates/', kdy: T }] }));
  await expect(page.locator('.listek-zaznamu, .kapitola').first()).toBeAttached();
  await expect(sekce(page)).toHaveCount(0);
});

for (const rezim of ['light', 'dark'] as const) {
  test(`čtečka a kontrast (${rezim}): líc i rub bez nálezů axe`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
    await otevri(page, '/denik/', sPojmy(['klid', 'slast']));
    await expect(lic(page)).toHaveAttribute('role', 'group');
    await expect(lic(page)).toHaveAttribute('aria-label', /líc/);
    const axe = () => new AxeBuilder({ page }).include('section.karticky').analyze();
    expect((await axe()).violations).toEqual([]);
    await stiskni(page, 'Otočit');
    expect((await axe()).violations).toEqual([]);
  });
}

test('omezený pohyb a telefon: rub bez animace, tlačítka aspoň 44 px, nic nepřetéká', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevri(page, '/denik/', sPojmy(['klid', 'slast']));
  await stiskni(page, 'Otočit');
  const animace = await rub(page).evaluate((e) => e.getAnimations().filter((a) => Number((a.effect?.getTiming().duration as number) ?? 0) > 1).length);
  expect(animace).toBe(0);
  for (const tl of await sekce(page).getByRole('button').all()) {
    const b = (await tl.boundingBox())!;
    expect(b.height, await tl.textContent() ?? '').toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('bez omezeného pohybu se rub přetočí', async ({ page }) => {
  await otevri(page, '/denik/', sPojmy(['klid']));
  await stiskni(page, 'Otočit');
  const jmena = await rub(page).evaluate((e) => getComputedStyle(e).animationName);
  expect(jmena).toMatch(/karta-otoceni/);
});

test('tečka na ikoně Deníku: kartičky na řadě ji nerozsvítí', async ({ page }) => {
  await otevri(page, '/', sPojmy(['klid', 'slast']));
  const tecky = page.locator('[data-tecka-navratu]');
  expect(await tecky.count()).toBeGreaterThan(0);
  for (const t of await tecky.all()) await expect(t).toBeHidden();
});
