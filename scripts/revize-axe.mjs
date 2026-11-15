// Axe (WCAG 2 AA, stejně jako tests/e2e/prohlidka.spec.ts) a přetékání na stránkách z argumentů,
// na 390 a 1440 px ve světlém i tmavém režimu. Náhled: npx astro preview --port 4323.
// node scripts/revize-axe.mjs /osobnost/thales/ /osobnost/gorgias/ …
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const browser = await chromium.launch();
let chyb = 0;
for (const cesta of process.argv.slice(2)) {
  for (const sirka of [390, 1440]) {
    for (const rezim of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
      const page = await context.newPage();
      // ULOZISTE=<soubor.json> { "klíč": hodnota } zapíše hodnoty do localStorage před načtením (plný deník; revize design-v2).
      if (process.env.ULOZISTE) {
        const z = JSON.parse((await import('node:fs')).readFileSync(process.env.ULOZISTE, 'utf8'));
        await page.addInitScript((zz) => { for (const [k, v] of Object.entries(zz)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); }, z);
      }
      // HODINA=<adresa stránky hodiny>: nejdřív ji otevře, aby byla hodina v kartě aktivní a stránka měla lištu hodiny.
      if (process.env.HODINA) { await page.goto(process.env.HODINA.startsWith('http') ? process.env.HODINA : ZAKLAD + process.env.HODINA); await page.waitForTimeout(500); }
      await page.goto(ZAKLAD + cesta);
      await page.evaluate(() => document.fonts.ready);
      const vyska = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < vyska; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(30); }
      const presah = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const v = axe.violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join('; ')}`);
      if (presah > 0 || v.length) { chyb++; console.log(`${cesta} ${sirka} ${rezim}: přesah ${presah}; ${v.join(' | ')}`); }
      await context.close();
    }
  }
}
await browser.close();
console.log(`Hotovo, stránek s nálezem: ${chyb}`);
