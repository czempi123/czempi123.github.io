// Snímky her herny v dílně (herna-v1): Seřaď na ose, Kdo to řekl?, Tipni si, Kde to bylo?, Doplň citát, Páry,
// Pravý, nebo podvržený?, Najdi slabé místo a Kdo by to řekl? v klidu,
// po „zkus to jinak“ a hotové,
// na 390 a 1440 px ve světlém i tmavém režimu. Výstup do „Claude outputs/snimky/herna-<hra>-<stav>-<sirka>-<rezim>.png“.
// node scripts/snimky-herna.mjs        (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; KLID=1 Klidný režim)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });

const browser = await chromium.launch();
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
  await page.waitForFunction((o) => !document.querySelector(`astro-island[component-url*="${o}"][ssr]`), ostrov);
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } .blok__pata { position: static !important; }' });
}
for (const sirka of [390, 1440]) {
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
    await page.close();
  }
}
await browser.close();
