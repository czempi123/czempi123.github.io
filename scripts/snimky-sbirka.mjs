// Snímky sbírky citátů (denik-v2, K4): stránka Moje sbírka (celá a první obrazovka), sbírka v kapitole deníku,
// poznámka při psaní, plná sbírka u nůžek a náhled tisku (PDF A4), na 390 a 1440 px ve světlém i tmavém režimu.
// node scripts/snimky-sbirka.mjs   (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky-sbirka';
mkdirSync(VEN, { recursive: true });
const DENIK = JSON.parse(readFileSync('tests/e2e/data/sbirka.json', 'utf8'))['atlas-denik'];
const SKRYT = 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } nav.lista { display: none !important; }';

const browser = await chromium.launch();
async function stranka(sirka, rezim, denik) {
  const page = await browser.newPage({ viewport: { width: sirka, height: sirka > 1000 ? 900 : 844 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: sirka > 1000 ? 1 : 2 });
  await page.addInitScript((t) => { if (!sessionStorage.getItem('pripraveno')) { sessionStorage.setItem('pripraveno', '1'); localStorage.setItem('atlas-denik', t); } }, JSON.stringify(denik));
  return page;
}

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    // Moje sbírka: první obrazovka (páska nejvýš jednou) a celá stránka.
    let page = await stranka(sirka, rezim, DENIK);
    await page.goto(`${ZAKLAD}/denik/sbirka/`);
    await page.waitForSelector('astro-island[component-url*="MojeSbirka"]:not([ssr])', { state: 'attached' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${VEN}/sbirka-${sirka}-${rezim}-okno.png` });
    await page.addStyleTag({ content: SKRYT });
    await page.screenshot({ path: `${VEN}/sbirka-${sirka}-${rezim}.png`, fullPage: true });
    // Poznámka při psaní (u druhého výstřižku, který ji nemá).
    if (rezim === 'light') {
      const druhy = page.locator('.vyst-citat').nth(1);
      await druhy.getByRole('button', { name: 'Proč zrovna tenhle?' }).click();
      await page.keyboard.type('Ptám se tak sám sebe');
      await druhy.screenshot({ path: `${VEN}/sbirka-poznamka-psani-${sirka}.png` });
    }
    await page.close();

    // Sbírka v kapitole deníku.
    page = await stranka(sirka, rezim, DENIK);
    await page.goto(`${ZAKLAD}/denik/`);
    await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
    await page.locator('details.kapitola').evaluateAll((d) => d.forEach((x) => (x.open = true)));
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: SKRYT });
    const casti = page.locator('.sbirka');
    for (let i = 0; i < await casti.count(); i++) await casti.nth(i).screenshot({ path: `${VEN}/denik-sbirka-${i + 1}-${sirka}-${rezim}.png` });
    await page.close();
  }
}

// Plná sbírka u nůžek (profil Seneky; citát, který ve sbírce není).
const plna = JSON.parse(readFileSync(process.env.PLNA ?? '/tmp/sbirka-plna.json', 'utf8'))['atlas-denik'];
for (const sirka of [390, 1440]) {
  const page = await stranka(sirka, 'light', plna);
  await page.goto(`${ZAKLAD}/osobnost/seneca/`);
  const nuzky = page.locator('.cisty-list [data-vystrihnout][aria-pressed="false"]').first();
  const cil = (await nuzky.count()) ? nuzky : page.locator('[data-vystrihnout][aria-pressed="false"]').first();
  await cil.scrollIntoViewIfNeeded();
  await cil.click();
  await page.addStyleTag({ content: SKRYT });
  await cil.locator('xpath=..').screenshot({ path: `${VEN}/plna-${sirka}.png` });
  await page.close();
}

// Náhled tisku: PDF A4.
const page = await stranka(1440, 'light', DENIK);
await page.goto(`${ZAKLAD}/denik/sbirka/`);
await page.waitForSelector('astro-island[component-url*="MojeSbirka"]:not([ssr])', { state: 'attached' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: `${VEN}/sbirka-tisk.pdf`, format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' }, printBackground: true });
await page.close();
await browser.close();
console.log('hotovo', VEN);
