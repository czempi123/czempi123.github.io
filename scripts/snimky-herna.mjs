// Snímky her herny v dílně (herna-v1): Seřaď na ose, Kdo to řekl?, Tipni si, Kde to bylo?, Doplň citát, Páry,
// Pravý, nebo podvržený?, Najdi slabé místo a Kdo by to řekl? v klidu, hry na stránce osoby, trasy mini mapy,
// výprava a Přehrát období v Mapě a čase (K4)
// po „zkus to jinak“ a hotové,
// na 390 a 1440 px ve světlém i tmavém režimu. Výstup do „Claude outputs/snimky/herna-<hra>-<stav>-<sirka>-<rezim>.png“.
// node scripts/snimky-herna.mjs        (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; KLID=1 Klidný režim)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });

const browser = await chromium.launch();
const JEN_K5 = process.env.SKUPINA === 'k5';
async function snimek(page, id, soubor) {
  await page.waitForTimeout(120);
  const r = await page.locator(`[id="${id}"]`).evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: Math.max(0, b.x + scrollX - 12), y: Math.max(0, b.y + scrollY - 12), width: Math.min(b.width + 24, document.documentElement.clientWidth), height: b.height + 24 };
  });
  await page.screenshot({ path: `${VEN}/${soubor}.png`, fullPage: true, clip: r });
  console.log(soubor);
}
async function priprav(page, id, ostrov) {
  await page.goto(`${ZAKLAD}/dilna/bloky/`);
  if (process.env.KLID) await page.evaluate(() => { localStorage.setItem('atlas-klidny', '1'); });
  if (process.env.KLID) await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await page.locator(`[id="${id}"]`).scrollIntoViewIfNeeded();
  // Ostrov právě tohoto bloku (v dílně je víc ostrovů téhož druhu a vzdálené se hydratují až po posunu).
  await page.waitForFunction(([i, o]) => { const a = document.getElementById(i)?.closest(`astro-island[component-url*="${o}"]`); return !!a && !a.hasAttribute('ssr'); }, [id, ostrov]);
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } .blok__pata { position: static !important; }' });
}
for (const sirka of JEN_K5 ? [] : [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    // Seřaď na ose
    await priprav(page, 'dilna-serad-narozeni', 'SeradNaOse');
    const s = page.locator('#dilna-serad-narozeni');
    await snimek(page, 'dilna-serad-narozeni', `herna-serad-klid-${pr}`);
    await s.locator('.karta-osy').nth(0).click();
    await snimek(page, 'dilna-serad-narozeni', `herna-serad-zvednuta-${pr}`);
    await s.locator('.karta-osy').nth(1).click();
    await s.getByRole('button', { name: 'Zkontrolovat pořadí' }).click();
    await snimek(page, 'dilna-serad-narozeni', `herna-serad-zkus-${pr}`);
    for (let i = 0; i < 12 && (await s.getByRole('button', { name: 'Zkontrolovat pořadí' }).count()); i++) {
      if (await s.getByRole('button', { name: 'Ukázat pořadí' }).count()) break;
      await s.locator('.karta-osy').nth(i % 2).click();
      await s.locator('.karta-osy').nth(2).click();
      if (await s.getByRole('button', { name: 'Zkontrolovat pořadí' }).isEnabled()) await s.getByRole('button', { name: 'Zkontrolovat pořadí' }).click();
    }
    if (await s.getByRole('button', { name: 'Ukázat pořadí' }).count()) {
      await snimek(page, 'dilna-serad-narozeni', `herna-serad-tri-pokusy-${pr}`);
      await s.getByRole('button', { name: 'Ukázat pořadí' }).click();
      await snimek(page, 'dilna-serad-narozeni', `herna-serad-ukazano-${pr}`);
    }
    // Znovu a seřadit klepnutím na dvojice karet (prohození), pak sedí.
    await s.getByRole('button', { name: 'Začít znovu' }).click();
    const SPRAVNE = ['Sókratés', 'Antisthenés', 'Diogenés', 'Kratés', 'Zénón z Kitia'];
    for (let cil = 0; cil < SPRAVNE.length; cil++) {
      const p = (await s.locator('.karta-osy__text').allTextContents()).map((x) => x.replace(/\u00a0/g, ' ')).indexOf(SPRAVNE[cil]);
      if (p === cil) continue;
      await s.locator('.karta-osy').nth(cil).click();
      await s.locator('.karta-osy').nth(p).click();
    }
    await s.getByRole('button', { name: 'Zkontrolovat pořadí' }).click();
    await snimek(page, 'dilna-serad-narozeni', `herna-serad-sedi-${pr}`);
    // Kdo to řekl?
    await priprav(page, 'dilna-kdo-rekl', 'KdoToRekl');
    const k = page.locator('#dilna-kdo-rekl');
    await snimek(page, 'dilna-kdo-rekl', `herna-kdo-klid-${pr}`);
    const spatne = k.locator('.razitko-odpoved').filter({ hasNotText: 'Epiktétos' }).first();
    await spatne.click();
    await snimek(page, 'dilna-kdo-rekl', `herna-kdo-zkus-${pr}`);
    await k.locator('.razitko-odpoved', { hasText: 'Epiktétos' }).click();
    await snimek(page, 'dilna-kdo-rekl', `herna-kdo-otocena-${pr}`);
    // Tipni si: klid, zkus to jinak, sedí; druhý blok po Ukázat, jak to bylo.
    const nastav = async (b, n) => b.locator('.pravitko__vstup').evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(n));
    await priprav(page, 'dilna-tipni-thales-hypatia', 'TipniSi');
    const t = page.locator('#dilna-tipni-thales-hypatia');
    await snimek(page, 'dilna-tipni-thales-hypatia', `herna-tipni-klid-${pr}`);
    await nastav(t, 3);
    await t.getByRole('button', { name: 'Zkontrolovat odhad' }).click();
    await snimek(page, 'dilna-tipni-thales-hypatia', `herna-tipni-zkus-${pr}`);
    await nastav(t, 11);
    await t.getByRole('button', { name: 'Zkontrolovat odhad' }).click();
    await snimek(page, 'dilna-tipni-thales-hypatia', `herna-tipni-sedi-${pr}`);
    await priprav(page, 'dilna-tipni-epiktetos-marcus', 'TipniSi');
    const t2 = page.locator('#dilna-tipni-epiktetos-marcus');
    for (const n of [4, 2]) { await nastav(t2, n); await t2.getByRole('button', { name: 'Zkontrolovat odhad' }).click(); }
    await t2.getByRole('button', { name: 'Ukázat, jak to bylo' }).click();
    await snimek(page, 'dilna-tipni-epiktetos-marcus', `herna-tipni-ukazano-${pr}`);
    // Kde to bylo?: slepá, tip daleko, tip na místě.
    await priprav(page, 'dilna-kde-seneca', 'KdeToBylo');
    const m = page.locator('#dilna-kde-seneca .slepa');
    await snimek(page, 'dilna-kde-seneca', `herna-kde-klid-${pr}`);
    const r = await m.boundingBox();
    await m.click({ position: { x: r.width * 0.25, y: r.height * 0.5 } });
    await snimek(page, 'dilna-kde-seneca', `herna-kde-tip-${pr}`);
    // Doplň citát: klid, záměna, sedí.
    await priprav(page, 'dilna-doplnit-reka', 'DoplnCitat');
    const d = page.locator('#dilna-doplnit-reka');
    await snimek(page, 'dilna-doplnit-reka', `herna-doplnit-klid-${pr}`);
    await d.locator('.vystrizek', { hasText: 'různých' }).click();
    await snimek(page, 'dilna-doplnit-reka', `herna-doplnit-zkus-${pr}`);
    await d.locator('.vystrizek', { hasText: 'týchž' }).click();
    await snimek(page, 'dilna-doplnit-reka', `herna-doplnit-sedi-${pr}`);
    // Páry (K3): klid, vybraný pojem, pár vedle, všechny spojené.
    await priprav(page, 'dilna-pary', 'Pary');
    const pa = page.locator('#dilna-pary');
    await snimek(page, 'dilna-pary', `herna-pary-klid-${pr}`);
    await pa.locator('[data-pojem="soud"] .par-listek').click();
    await snimek(page, 'dilna-pary', `herna-pary-vybrany-${pr}`);
    await pa.locator('[data-situace="past-1"] .par-listek').click();
    await snimek(page, 'dilna-pary', `herna-pary-zkus-${pr}`);
    for (const p of ['soud', 'v-nasi-moci', 'stred', 'klid']) {
      await pa.locator(`[data-pojem="${p}"] .par-listek`).click();
      await pa.locator(`[data-situace="${p}"] .par-listek`).click();
    }
    await snimek(page, 'dilna-pary', `herna-pary-sedi-${pr}`);
    // Pravý, nebo podvržený? (K3): klid, otisk u přepsané věty, pravá věta, souhrn.
    await priprav(page, 'dilna-pravy', 'PravyNeboPodvrzeny');
    const pv = page.locator('#dilna-pravy');
    await snimek(page, 'dilna-pravy', `herna-pravy-klid-${pr}`);
    await pv.locator('.razitko-verdikt--rekl').click();
    await snimek(page, 'dilna-pravy', `herna-pravy-otisk-${pr}`);
    await pv.getByRole('button', { name: 'Další ústřižek' }).click();
    await pv.locator('.razitko-verdikt--rekl').click();
    await snimek(page, 'dilna-pravy', `herna-pravy-sedi-${pr}`);
    for (let i = 0; i < 3; i++) {
      await pv.getByRole('button', { name: 'Další ústřižek' }).click();
      await pv.locator('.razitko-verdikt--nerekl').click();
    }
    await snimek(page, 'dilna-pravy', `herna-pravy-souhrn-${pr}`);
    // Najdi slabé místo (K3): klid, přeškrtnutá premisa s polem, hlasy.
    await priprav(page, 'dilna-slabe-zapas', 'NajdiSlabeMisto');
    const sl = page.locator('#dilna-slabe-zapas');
    await snimek(page, 'dilna-slabe-zapas', `herna-slabe-klid-${pr}`);
    await sl.locator('button.veta-arg').nth(1).click();
    await sl.locator('textarea').fill('První reakci nemám vždycky v rukou.');
    await snimek(page, 'dilna-slabe-zapas', `herna-slabe-skrt-${pr}`);
    await sl.getByRole('button', { name: 'Zapsat do deníku' }).click();
    await snimek(page, 'dilna-slabe-zapas', `herna-slabe-hlasy-${pr}`);
    // Kdo by to řekl? (K3): plakátek v klidu, výběr s důvodem, lístek atlasu; bublina v klidu.
    await priprav(page, 'dilna-kdo-by-mene', 'KdoByToRekl');
    const kb = page.locator('#dilna-kdo-by-mene');
    await snimek(page, 'dilna-kdo-by-mene', `herna-kdoby-klid-${pr}`);
    await kb.locator('.razitko-volby', { hasText: 'Epikúros' }).click();
    await kb.locator('textarea').fill('Jde o touhy, ne o byt.');
    await snimek(page, 'dilna-kdo-by-mene', `herna-kdoby-vyber-${pr}`);
    await kb.getByRole('button', { name: 'Zapsat do deníku' }).click();
    await snimek(page, 'dilna-kdo-by-mene', `herna-kdoby-atlas-${pr}`);
    await priprav(page, 'dilna-kdo-by-uhel', 'KdoByToRekl');
    await snimek(page, 'dilna-kdo-by-uhel', `herna-kdoby-bublina-${pr}`);
    // Hra na stránce osoby (K4): Kdo to řekl? s jednou kartou (rub se vztahem), Tipni si, Kde to bylo?
    await priprav(page, 'dilna-hra-theofrastos-kdo-rekl', 'KdoToRekl');
    const ho = page.locator('#dilna-hra-theofrastos-kdo-rekl');
    await snimek(page, 'dilna-hra-theofrastos-kdo-rekl', `herna-k4-kdorekl-klid-${pr}`);
    await ho.locator('.razitko-odpoved', { hasText: 'Aristotelés' }).click();
    await snimek(page, 'dilna-hra-theofrastos-kdo-rekl', `herna-k4-kdorekl-rub-${pr}`);
    await priprav(page, 'dilna-hra-kleanthes-tipni', 'TipniSi');
    await snimek(page, 'dilna-hra-kleanthes-tipni', `herna-k4-tipni-klid-${pr}`);
    await priprav(page, 'dilna-hra-musonius-rufus-kde', 'KdeToBylo');
    await snimek(page, 'dilna-hra-musonius-rufus-kde', `herna-k4-kde-klid-${pr}`);
    // Trasy na mini mapě (K4): Sókratés v dílně.
    await page.locator('#h-trasy').scrollIntoViewIfNeeded();
    const mm = page.locator('#h-trasy + * .minimapa, section[aria-labelledby="h-trasy"] .minimapa').first();
    await page.waitForTimeout(150);
    await mm.screenshot({ path: `${VEN}/herna-k4-trasy-sokrates-${pr}.png` });
    console.log(`herna-k4-trasy-sokrates-${pr}`);
    // Mapa a čas (K4): výprava splněná nad kartou, pás s Přehrát období po zastavení (skoky a Pokračovat).
    await page.goto(`${ZAKLAD}/mapa/?rok=-424&osoba=sokrates`);
    await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${VEN}/herna-k4-mapa-vyprava-${pr}.png` });
    console.log(`herna-k4-mapa-vyprava-${pr}`);
    await page.close();
  }
}
// Přehrát období během běhu a po zastavení (plný pohyb, jen notebook a telefon ve světlém režimu).
for (const sirka of JEN_K5 ? [] : [390, 1440]) {
  const page = await browser.newPage({ viewport: { width: sirka, height: 900 } });
  await page.addInitScript(() => { window.atlasPrehravaniObdobi = { delka: 20000 }; });
  await page.goto(`${ZAKLAD}/mapa/?rok=-520`);
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await page.waitForTimeout(600);
  await page.locator('#obdobi-prehrat').click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${VEN}/herna-k4-obdobi-bezi-${sirka}.png` });
  await page.locator('#obdobi-prehrat').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${VEN}/herna-k4-obdobi-zastaveno-${sirka}.png` });
  console.log(`herna-k4-obdobi-${sirka}`);
  await page.close();
}
// K5: karta Do hodiny (dílna a promítání), sebehodnocení (dílna, vyplněné), stránka Argumentační klamy a manipulace
// (Najdi slabé místo a Pravý, nebo podvržený? před činem a po něm), Moje filozofie se sebehodnocením.
// SKUPINA=k5 pustí jen tuhle část.
for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
    const pr = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
    await page.goto(`${ZAKLAD}/dilna/bloky/`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; }' });
    await page.locator('#cesta1-do-hodiny').scrollIntoViewIfNeeded();
    await snimek(page, 'cesta1-do-hodiny', `herna-k5-dohodiny-dilna-${pr}`);
    await page.locator('#dilna-sebehodnoceni').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const a = document.getElementById('dilna-sebehodnoceni')?.closest('astro-island'); return !!a && !a.hasAttribute('ssr'); });
    await snimek(page, 'dilna-sebehodnoceni', `herna-k5-sebe-prazdne-${pr}`);
    await page.locator('#dilna-umim-stanovisko').fill('Poznám, kdy mi někdo dává jméno místo důvodu.');
    await page.locator('#dilna-nejsem-stanovisko').fill('Jak poznat, komu věřit, když to sám ověřit nejde.');
    await page.locator('#dilna-nejsem-stanovisko').blur();
    await page.waitForTimeout(700);
    await snimek(page, 'dilna-sebehodnoceni', `herna-k5-sebe-vyplnene-${pr}`);
    // Stránka klamů: bloky před činem a po něm.
    await page.goto(`${ZAKLAD}/argumentacni-klamy/`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; }' });
    for (const [id, ostrov] of [['klamy-slabe-video', 'NajdiSlabeMisto'], ['klamy-pravy', 'PravyNeboPodvrzeny']]) {
      await page.locator(`[id="${id}"]`).scrollIntoViewIfNeeded();
      await page.waitForFunction(([i, o]) => { const a = document.getElementById(i)?.closest(`astro-island[component-url*="${o}"]`); return !!a && !a.hasAttribute('ssr'); }, [id, ostrov]);
    }
    await snimek(page, 'klamy-slabe-video', `herna-k5-klamy-slabe-klid-${pr}`);
    const sl = page.locator('#klamy-slabe-video');
    await sl.locator('button.veta-arg').filter({ hasText: 'tolika lidem' }).click();
    await page.waitForTimeout(400);
    await snimek(page, 'klamy-slabe-video', `herna-k5-klamy-slabe-skrt-${pr}`);
    const zapsat = sl.getByRole('button', { name: 'Zapsat do deníku' });
    if (await zapsat.count()) { await zapsat.click(); await page.waitForTimeout(400); await snimek(page, 'klamy-slabe-video', `herna-k5-klamy-slabe-hlasy-${pr}`); }
    await snimek(page, 'klamy-pravy', `herna-k5-klamy-pravy-klid-${pr}`);
    await page.locator('#klamy-pravy button.razitko-verdikt--nerekl').first().click();
    await page.waitForTimeout(400);
    await snimek(page, 'klamy-pravy', `herna-k5-klamy-pravy-otisk-${pr}`);
    await page.close();
  }
}
// Promítání karty Do hodiny (notebook, plátno) a Moje filozofie se sebehodnocením (telefon i notebook, světlý režim).
for (const sirka of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width: sirka, height: sirka > 900 ? 900 : 844 }, reducedMotion: 'reduce' });
  await page.goto(`${ZAKLAD}/hodina/?v=1&n=${encodeURIComponent('Delfy')}&z=k:kdy-mam-dobry-duvod-verit/7,b:cesta1-do-hodiny`);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await page.keyboard.press('End');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${VEN}/herna-k5-promitani-krok-${sirka}.png` });
  await page.locator('[data-hl-dalsi]').click();
  await page.waitForFunction(() => location.hash === '#cesta1-do-hodiny' && document.documentElement.classList.contains('promitani-pripraveno'));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${VEN}/herna-k5-promitani-karta-${sirka}.png` });
  console.log(`herna-k5-promitani-${sirka}`);
  await page.locator('[data-hl-ukoncit]').click();
  await page.waitForLoadState('load');
  // Deník: pravidlo a sebehodnocení cesty 1 (zápisy jako z bloků).
  await page.evaluate(() => {
    const kdy = '2026-11-19T10:00:00.000Z';
    const odkaz = '/cesta/kdy-mam-dobry-duvod-verit/7/';
    const d = { verze: 1, zapisy: [
      { id: 'cesta1-moje-pravidlo', otazka: 'Kdy mám dobrý důvod něčemu věřit?', odpoved: 'Když to obstojí, i když hledám, co by to vyvrátilo.', odkaz, kdy },
      { id: 'kdy-mam-dobry-duvod-verit-umim', otazka: 'Kdy mám dobrý důvod věřit? Co už umím', odpoved: 'Zeptat se, odkud to kdo ví.', odkaz: `${odkaz}#kdy-mam-dobry-duvod-verit-sebehodnoceni`, kdy, druh: 'sebehodnoceni' },
      { id: 'kdy-mam-dobry-duvod-verit-nejsem', otazka: 'Kdy mám dobrý důvod věřit? Co mi ještě není jasné', odpoved: 'Komu věřit, když to sám ověřit nejde.', odkaz: `${odkaz}#kdy-mam-dobry-duvod-verit-sebehodnoceni`, kdy, druh: 'sebehodnoceni' },
    ], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: { 'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy } } };
    localStorage.setItem('atlas-denik', JSON.stringify(d));
  });
  await page.goto(`${ZAKLAD}/denik/`);
  await page.waitForSelector('#moje-filozofie');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.locator('.mf-otazka').first().screenshot({ path: `${VEN}/herna-k5-denik-filozofie-${sirka}.png` });
  console.log(`herna-k5-denik-${sirka}`);
  await page.close();
}
await browser.close();
