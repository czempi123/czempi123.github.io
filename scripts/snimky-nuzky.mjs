// Snímky nůžek na nových místech (denik-v2, K4): kompaktní citát hlasu na stránce otázky, námitka a den týdne,
// rub Kdo to řekl?, hotový Doplň citát, původ v Pravý, nebo podvržený? a hlasy Kdo by to řekl? (390 px, den i noc).
// node scripts/snimky-nuzky.mjs   (ZAKLAD: běžící web, výchozí náhled na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky-sbirka';
mkdirSync(VEN, { recursive: true });
const SKRYT = 'header.hlavicka, nav.lista, .preskocit { visibility: hidden !important; } .blok__pata { position: static !important; }';
const browser = await chromium.launch();

for (const rezim of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  const foto = async (l, nazev) => { await l.scrollIntoViewIfNeeded(); await l.screenshot({ path: `${VEN}/nuzky-${nazev}-${rezim}.png` }); };

  await page.goto(`${ZAKLAD}/otazka/jak-zit/`);
  await page.addStyleTag({ content: SKRYT });
  // Hlasy stojí v oddílu, který se odkryje až po prvním názoru: pro snímek ho odkryj (předky se skrytím).
  await page.evaluate(() => {
    for (let e = document.querySelector('.hlas .citat--kompaktni'); e; e = e.parentElement) {
      e.hidden = false;
      if (getComputedStyle(e).display === 'none') e.style.setProperty('display', 'block', 'important');
    }
  });
  await foto(page.locator('.hlas').filter({ has: page.locator('.citat--kompaktni') }).first(), 'hlas');

  await page.goto(`${ZAKLAD}/tyden/stoicky/`);
  await page.waitForSelector('astro-island[component-url*="/Tyden."]:not([ssr])', { state: 'attached' });
  await page.addStyleTag({ content: SKRYT });
  await foto(page.locator('.tyden__namitka'), 'namitka');
  const den = page.locator('.den__obsah').filter({ has: page.locator('.den__citat') }).first();
  await den.evaluate((e) => { e.hidden = false; });
  await foto(den.locator('.den__citat'), 'den');

  await page.goto(`${ZAKLAD}/dilna/bloky/`);
  await page.addStyleTag({ content: SKRYT });
  const priprav = async (id, ostrov) => {
    const b = page.locator(`[id="${id}"]`);
    await b.evaluate((e) => e.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.waitForSelector(`astro-island[component-url*="/${ostrov}."]:not([ssr])`, { state: 'attached' });
    return b;
  };
  const kdo = await priprav('dilna-kdo-rekl', 'KdoToRekl');
  for (let i = 0; i < 4 && !(await kdo.locator('.otocena').count()); i++) await kdo.locator('.razitko-odpoved:not(:disabled)').first().click();
  await page.waitForTimeout(300);
  await foto(kdo.locator('.otocna'), 'kdo-rub');
  const dopl = await priprav('dilna-doplnit-reka', 'DoplnCitat');
  await dopl.locator('.vystrizek', { hasText: 'týchž' }).click();
  await foto(dopl.locator('.cely'), 'doplnit');
  const pravy = await priprav('dilna-pravy', 'PravyNeboPodvrzeny');
  await pravy.locator('.razitko-verdikt--nerekl').click();
  if (await pravy.locator('.puvod__citat').count()) await foto(pravy.locator('.puvod__citat'), 'pravy');
  const kdoby = await priprav('dilna-kdo-by-mene', 'KdoByToRekl');
  await kdoby.locator('.razitko-volby').first().click();
  await kdoby.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await foto(kdoby.locator('.hlas-herny').first(), 'hlas-herny');
  await page.close();
}
await browser.close();
console.log('hotovo', VEN);
