// Snímky oddílu Kartičky v Můj deník (denik-v2, K3): prázdné kartičky, hromádka (líc), rub každého zdroje
// (pojem, citát, zápis, Co ti zůstalo?) a Na dnes stačí, na 390 a 1440 px ve světlém i tmavém režimu.
// node scripts/snimky-karticky.mjs   (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky-karticky';
mkdirSync(VEN, { recursive: true });
const T = '2026-11-20T10:00:00.000Z';
const d = new Date();
const DNES = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const karta = (zdroj, ref, cast = {}) => ({ [`${zdroj}:${ref}`]: { zdroj, ref, prihradka: 0, pridano: T, kdy: T, ...cast } });
const zaklad = {
  verze: 1, vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
  cesty: { 'kolik-je-dost': { nazev: 'Kolik je dost?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: T } },
  zapisy: [{ id: 'cesta6/pravidlo', otazka: 'Jaké pravidlo si z cesty bereš?', odpoved: 'Než si něco koupím, počkám tři dny. Když to pořád chci, koupím si to.', odkaz: '/cesta/kolik-je-dost/7/', kdy: T, druh: 'stanovisko' }],
  citaty: [{ id: 'epikuros-dost', text: 'Komu je málo dost, tomu není dost nic.', kde: 'Epikúros, Výrok 68', odkaz: '/osobnost/epikuros/', kdy: T, poznamka: 'Platí i na nákupy.' }],
};
const STAVY = {
  prazdne: { ...zaklad, zapisy: [], citaty: [] },
  hromadka: { ...zaklad, karticky: { ...karta('pojem', 'klid'), ...karta('citat', 'epikuros-dost'), ...karta('zapis', 'cesta6/pravidlo'), ...karta('zustalo', 'pojem:klid'), ...karta('pojem', 'slast') } },
  'rub-pojem': { ...zaklad, karticky: karta('pojem', 'klid') },
  'rub-citat': { ...zaklad, karticky: karta('citat', 'epikuros-dost') },
  'rub-zapis': { ...zaklad, karticky: karta('zapis', 'cesta6/pravidlo') },
  'rub-zustalo': { ...zaklad, karticky: karta('zustalo', 'pojem:klid') },
  stacilo: {
    ...zaklad,
    karticky: { ...karta('pojem', 'klid', { prihradka: 1, naposledy: DNES }), ...karta('pojem', 'slast') },
    bloky: { 'karticky/dnes': { den: DNES, klice: ['pojem:klid', 'pojem:a', 'pojem:b', 'pojem:c', 'pojem:d'] } },
  },
};

const browser = await chromium.launch();
for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    for (const [stav, obsah] of Object.entries(STAVY)) {
      const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: sirka > 1000 ? 1 : 2 });
      await page.addInitScript((t) => { if (!sessionStorage.getItem('pripraveno')) { sessionStorage.setItem('pripraveno', '1'); localStorage.setItem('atlas-denik', t); } }, JSON.stringify(obsah));
      await page.goto(`${ZAKLAD}/denik/`);
      await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
      await page.evaluate(() => document.fonts.ready);
      const k = page.locator('section.karticky');
      if (stav.startsWith('rub')) await k.getByRole('button', { name: 'Otočit' }).click();
      await page.waitForTimeout(250);
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit, a[href="#obsah"] { visibility: hidden !important; } nav.lista { display: none !important; }' });
      const soubor = `${VEN}/karticky-${stav}-${sirka}-${rezim}.png`;
      await k.screenshot({ path: soubor });
      // Oddíl v souvislosti s deníkem kolem (jednou za šířku, světlý režim, hromádka).
      if (stav === 'hromadka' && rezim === 'light') await page.screenshot({ path: soubor.replace('.png', '-okno.png') });
      console.log(soubor);
      await page.close();
    }
    // Tlačítka Do kartiček: lístek zápisu a výstřižek v kapitole deníku (jedno stisknuté), hlavička stránky pojmu.
    const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: sirka > 1000 ? 1 : 2 });
    await page.addInitScript((t) => {
      if (sessionStorage.getItem('pripraveno')) return;
      sessionStorage.setItem('pripraveno', '1');
      localStorage.setItem('atlas-denik', t);
      localStorage.setItem('atlas-denik-kapitoly', JSON.stringify({ otevrene: [], kdy: '2000-01-01T00:00:00.000Z', pohled: 'data' }));
    }, JSON.stringify({ ...zaklad, karticky: karta('citat', 'epikuros-dost', { prihradka: 1, naposledy: DNES }) }));
    await page.goto(`${ZAKLAD}/denik/`);
    await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
    await page.locator('details.kapitola').evaluateAll((d) => d.forEach((x) => (x.open = true)));
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit, a[href="#obsah"] { visibility: hidden !important; } nav.lista { display: none !important; }' });
    await page.waitForTimeout(250);
    await page.locator('details.kapitola .kapitola__obsah').first().screenshot({ path: `${VEN}/zdroje-kapitola-${sirka}-${rezim}.png` });
    await page.goto(`${ZAKLAD}/pojem/klid/`);
    await page.waitForSelector('astro-island[component-url*="DoKarticek"]:not([ssr])', { state: 'attached' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${VEN}/zdroje-pojem-${sirka}-${rezim}.png` });
    console.log(`${VEN}/zdroje-*-${sirka}-${rezim}.png`);
    await page.close();
  }
}
await browser.close();
