// Snímky oddílu Život na mapě pro autora (interaktivita-v2, K2): celá obrazovka Mapy a času s kartou posunutou
// na oddíl, s pohybem (Přehrát) i při omezeném pohybu, a odkaz pod mini mapou na stránce osoby.
// node scripts/snimky-zivot-na-mape.mjs   (ZAKLAD: běžící web, výchozí náhled na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });
const browser = await chromium.launch();
const vystup = [];

async function mapa(nazev, sirka, rezim, pohyb, adresa, akce) {
  const page = await browser.newPage({ viewport: { width: sirka, height: sirka < 900 ? 844 : 900 }, colorScheme: rezim, reducedMotion: pohyb ? 'no-preference' : 'reduce', deviceScaleFactor: 2 });
  await page.addInitScript(() => (window.atlasPrehravani = { delka: 60000, zastaveni: 1000 }));
  await page.goto(ZAKLAD + adresa);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await page.waitForSelector('.mapa svg.podklad path.sit', { state: 'attached' });
  await page.waitForTimeout(400);
  if (akce) await akce(page);
  // Karta se posune tak, aby oddíl začínal nahoře v panelu.
  await page.evaluate(() => {
    const s = document.querySelector('section.zivot');
    const k = document.querySelector('.mac__karta');
    if (s && k) k.scrollTop = s.offsetTop - k.offsetTop - 8;
  });
  await page.waitForTimeout(300);
  const soubor = `${VEN}/${nazev}-${sirka}-${rezim}.png`;
  await page.screenshot({ path: soubor });
  vystup.push(soubor);
  await page.close();
}

const aristoteles = '/mapa/?rok=-347&osoba=aristoteles';
await mapa('zivot-mapa', 1440, 'light', true, aristoteles);
// Během přehrávání: Přehrát → Zastavit, rok běží (zachyceno za vteřinu a půl).
await mapa('zivot-mapa-hraje', 1440, 'dark', true, '/mapa/?rok=-350&osoba=aristoteles', async (p) => {
  await p.locator('#zivot-prehrat').click();
  await p.waitForTimeout(1500);
});
await mapa('zivot-mapa', 390, 'light', true, aristoteles);
await mapa('zivot-mapa-omezeny', 390, 'dark', false, aristoteles);

for (const [sirka, rezim] of [[390, 'light'], [1440, 'dark']]) {
  const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  await page.goto(`${ZAKLAD}/osobnost/aristoteles/`);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .obsah-lista { visibility: hidden !important; } nav.lista { display: none !important; }' });
  const prvek = page.locator('.doba__mapa');
  await prvek.scrollIntoViewIfNeeded();
  const soubor = `${VEN}/zivot-osoba-${sirka}-${rezim}.png`;
  await prvek.screenshot({ path: soubor });
  vystup.push(soubor);
  await page.close();
}
console.log(vystup.join(' '));
await browser.close();
