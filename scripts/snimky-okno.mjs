// Snímek celého okna u jednoho místa stránky (design-v2, krok P): poznámky pojmů na okraji leží mimo sloupec,
// snímek prvku je neukáže. Posune stránku tak, aby prvek byl nahoře pod lištou, a vyfotí okno.
// node scripts/snimky-okno.mjs <cesta> <selektor> <nazev> <sirka> <light|dark> [vyska] [klepnout na text]
//   node scripts/snimky-okno.mjs /osobnost/sokrates/ '#delfy' sokrates-delfy 1440 light 900
//   node scripts/snimky-okno.mjs /osobnost/sokrates/ '#delfy' sokrates-listek 390 dark 844 'věštírny'
// Proměnné: ZAKLAD (výchozí náhled sestaveného webu na portu 4323), VEN (složka), POHYB=1 (animace běží).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [cesta, selektor, nazev, sirkaS, rezim, vyskaS = '900', klepnout] = process.argv.slice(2);
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(sirkaS), height: Number(vyskaS) }, colorScheme: rezim,
  reducedMotion: process.env.POHYB ? 'no-preference' : 'reduce',
});
await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const prvek = page.locator(selektor).first();
// NAD: kolik pixelů nad prvkem nechat (výchozí 90, pod lištou)
await page.waitForTimeout(300);
await page.evaluate(([s, nad]) => {
  const el = document.querySelector(s);
  document.documentElement.style.scrollBehavior = 'auto';
  if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - nad);
}, [selektor, Number(process.env.NAD ?? 90)]);
if (klepnout) {
  await prvek.getByRole('button', { name: new RegExp(klepnout, 'i') }).first().click();
  await page.waitForTimeout(400);
}
await page.waitForTimeout(300);
const soubor = `${VEN}/${nazev}-${sirkaS}-${rezim}.png`;
await page.screenshot({ path: soubor });
console.log(soubor);
await browser.close();
