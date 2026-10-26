// Prohlídka sestaveného webu před zveřejněním (Uzavření revize antiky): Domů, cesta, profil, hledání, deník,
// noindex a ikony; snímky Příběhu s licencí obrazu na 390 a 1440 px ve světlém i tmavém režimu.
// Použití: npx astro preview --port 4323, pak node scripts/kontrola-zverejneni.mjs [adresa]
import { chromium } from '@playwright/test';
const ZAKLAD = process.argv[2] || 'http://localhost:4323';
const VYSTUP = 'Claude outputs/snimky-uzavreni';
const prohlizec = await chromium.launch();
const vysledky = [];
const ctx = await prohlizec.newContext({ viewport: { width: 1440, height: 900 }, locale: 'cs-CZ' });
const page = await ctx.newPage();
const chyby = [];
page.on('pageerror', (e) => chyby.push(String(e)));
page.on('response', (r) => { if (r.status() >= 400) chyby.push(`${r.status()} ${r.url()}`); });
for (const [nazev, cesta] of [['Domů', '/'], ['Cesta 1, krok 1', '/cesta/kdy-mam-dobry-duvod-verit/1/'], ['Profil Seneky', '/osobnost/seneca/'], ['Deník', '/denik/'], ['Cesta 33, krok 1', '/cesta/co-kdyz-prijde-to-nejhorsi/1/']]) {
  const odp = await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  const ikony = await page.locator('svg use').count();
  const h1 = (await page.locator('h1').first().textContent())?.trim().slice(0, 60);
  vysledky.push(`${nazev}: ${odp.status()}, robots=${robots}, ikon ${ikony}, h1 „${h1}“`);
}
// Hledání (Pagefind): dialog na klávesu /
await page.goto(ZAKLAD + '/', { waitUntil: 'networkidle' });
await page.waitForSelector('astro-island[component-url*="Hledani"]:not([ssr])', { state: 'attached' });
await page.keyboard.press('/');
const dialog = page.getByRole('dialog', { name: 'Hledání v atlasu' });
await dialog.locator('input').fill('Epiktétos');
await dialog.locator('.pagefind-ui__result').first().waitFor({ timeout: 15000 });
vysledky.push(`Hledání „Epiktétos“: ${await dialog.locator('.pagefind-ui__result').count()} výsledků, první „${(await dialog.locator('.pagefind-ui__result-link').first().textContent())?.trim()}“ → ${await dialog.locator('.pagefind-ui__result-link').first().getAttribute('href')}`);
await page.screenshot({ path: `${VYSTUP}/hledani-1440.png` });
await ctx.close();
for (const sirka of [390, 1440]) for (const rezim of ['light', 'dark']) {
  const c = await prohlizec.newContext({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, locale: 'cs-CZ' });
  const p = await c.newPage();
  await p.goto(ZAKLAD + '/cesta/co-kdyz-prijde-to-nejhorsi/1/', { waitUntil: 'networkidle' });
  const deska = p.locator('.pribeh__deska').first();
  await deska.scrollIntoViewIfNeeded();
  await deska.screenshot({ path: `${VYSTUP}/pribeh-licence-${sirka}-${rezim}.png` });
  vysledky.push(`Licence pod Příběhem ${sirka} ${rezim}: „${(await p.locator('.pribeh__kredit').first().textContent())?.trim()}“`);
  await c.close();
}
await prohlizec.close();
console.log(vysledky.join('\n'));
console.log(chyby.length ? 'Chyby:\n' + [...new Set(chyby)].join('\n') : 'Chyby: 0');
