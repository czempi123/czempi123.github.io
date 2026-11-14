// Snímky lišty cesty a spodní lišty (design-v2, K5): první, prostřední a poslední krok cesty na 390 a 1440 px,
// ve dne i v noci, s postupem v deníku (prošlé kroky = dírky). Poslední krok dvakrát: před odpovědí (Dokončit cestu
// tichý) a po uloženém pravidle (Dokončit cestu hlavní, pahýl v deníku). Snímek je okno, jak ho student vidí.
// node scripts/snimky-lista-cesty.mjs [slug]   (ZAKLAD: běžící web, výchozí náhled npx astro preview --port 4323; VEN)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const slug = process.argv[2] ?? 'kdy-mam-dobry-duvod-verit';
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky/design-v2-k5/lista';
mkdirSync(VEN, { recursive: true });
const prohlizec = await chromium.launch();
for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    const page = await prohlizec.newPage({ viewport: { width: sirka, height: sirka < 700 ? 844 : 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: 2 });
    await page.goto(`${ZAKLAD}/cesta/${slug}/`);
    const pocet = await page.locator('.seznam li').count();
    const kroky = [1, Math.ceil(pocet / 2), pocet];
    for (const n of kroky) {
      // Postup jako student, který prošel kroky 1…n (bez odpovědí): dírky v lístku, Další krok podle bloku.
      for (let k = 1; k <= n; k++) await page.goto(`${ZAKLAD}/cesta/${slug}/${k}/`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${VEN}/krok${n}-${sirka}-${rezim}.png` });
    }
    // Poslední krok po uloženém pravidle: Dokončit cestu hlavní, pahýl odtržený.
    await page.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).fill('Když tvrzení obstojí i proti protipříkladu.');
    await page.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).blur();
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${VEN}/krok${pocet}-hotovo-${sirka}-${rezim}.png` });
    // Přehled cesty: týž lístek se všemi dírkami a bez pahýlu.
    await page.goto(`${ZAKLAD}/cesta/${slug}/`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.cesta .listek-cesty').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${VEN}/prehled-hotovo-${sirka}-${rezim}.png` });
    await page.close();
  }
}
await prohlizec.close();
console.log(`hotovo: ${VEN}`);
