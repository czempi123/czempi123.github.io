// Snímek jednoho prvku stránky (blok, kresba) pro kontrolu a pro autora, volitelně po klepnutí na jiný prvek.
// node scripts/snimky-prvek.mjs <cesta> <selektor> <nazev> <sirka> <light|dark> [text přepínače nebo tlačítka, na které klepnout]
//   node scripts/snimky-prvek.mjs /cesta/je-to-co-vidim-cela-skutecnost/1/ '#jeskyne-pohledy' jeskyne-bok 390 light 'Pohled z boku'
//   node scripts/snimky-prvek.mjs /cesta/staci-vedet-co-je-spravne/6/ '#kde-je-stred' stred-plavcik-voda 390 light 'plavčík|rozvodněná'
// Proměnné: ZAKLAD (běžící web; výchozí náhled sestaveného webu na portu 4323), VEN (složka pro výstup),
// POHYB=1 nechá animace běžet (jinak je omezený pohyb zapnutý a kresba stojí), CEKEJ (ms před snímkem),
// POSUVNIK (hodnota prvního posuvníku v prvku), DENIK (soubor JSON s deníkem atlas-denik, který stránka
// najde v localStorage: blok ve stavu po kontrole nebo po volbě bez klepání).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const [cesta, selektor, nazev, sirkaS = '390', rezim = 'light', klik] = process.argv.slice(2);
const sirka = Number(sirkaS);
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: process.env.POHYB ? 'no-preference' : 'reduce', deviceScaleFactor: 2 });
if (process.env.DENIK) {
  const denik = readFileSync(process.env.DENIK, 'utf8');
  await page.addInitScript((t) => localStorage.setItem('atlas-denik', t), denik);
}
await page.goto(ZAKLAD + cesta);
await page.evaluate(() => document.fonts.ready);
const prvek = page.locator(selektor).first();
await prvek.scrollIntoViewIfNeeded();
// Ostrov prvku se hydratuje, až je vidět; ostatní ostrovy na stránce na řadu přijít nemusí.
await page.waitForFunction((sel) => {
  const e = document.querySelector(sel);
  const ostrov = e?.closest('astro-island');
  return !!e && (!ostrov || !ostrov.hasAttribute('ssr'));
}, selektor);
// Víc klepnutí za sebou se oddělí svislítkem: 'plavčík|rozvodněná'.
for (const k of klik ? klik.split('|') : []) await prvek.getByText(k, { exact: true }).click({ force: true });
// POSUVNIK=3 nastaví první posuvník v prvku (kresba s posuvníkem).
if (process.env.POSUVNIK) await prvek.locator('input[type="range"]').first().fill(process.env.POSUVNIK);
await page.waitForTimeout(Number(process.env.CEKEJ ?? 300));
// Pevné lišty by ležely přes prvek.
// Spodní lišta telefonu má odkazy viditelné i ve skryté liště; pevná je, takže display: none nic neposune.
await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .cesta-lista, .cesta-hlavicka, .obsah-lista { visibility: hidden !important; } nav.lista { display: none !important; }' });
const soubor = `${VEN}/${nazev}-${sirka}-${rezim}.png`;
await prvek.screenshot({ path: soubor });
console.log(soubor);
await browser.close();
