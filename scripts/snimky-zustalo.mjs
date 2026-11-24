// Snímky stránky Tvoje antika s oddílem Co ti zůstalo? (denik-v2, K2): prázdný deník, prošlé dvě cesty (první otázka
// s rubem) a konec kola, na 390 a 1440 px ve světlém i tmavém režimu.
// node scripts/snimky-zustalo.mjs   (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky-zustalo';
mkdirSync(VEN, { recursive: true });
const T = '2026-11-20T10:00:00.000Z';
const kroky = { 'kolik-je-dost': 7, 'co-mam-ve-svych-rukou': 8 };
const DVE = JSON.stringify({
  verze: 1, zapisy: [], vyzvy: [], bloky: {}, aktivita: [],
  navstivene: [{ odkaz: '/otazka/jak-zit/', nazev: 'Jak mám žít?', kdy: T }, { odkaz: '/otazka/jsem-svobodny/', nazev: 'Jsem svobodný?', kdy: T }],
  cesty: Object.fromEntries(Object.entries(kroky).map(([s, p]) => [s, { nazev: s, pocet: p, krok: p, navstivene: Array.from({ length: p }, (_, i) => i + 1), kdy: T, dokonceno: T }])),
});

const browser = await chromium.launch();
for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    for (const stav of ['prazdny', 'dve-cesty', 'konec']) {
      const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: sirka > 1000 ? 1 : 2 });
      await page.addInitScript((t) => { if (!sessionStorage.getItem('pripraveno')) { sessionStorage.setItem('pripraveno', '1'); t ? localStorage.setItem('atlas-denik', t) : localStorage.removeItem('atlas-denik'); } }, stav === 'prazdny' ? '' : DVE);
      await page.goto(`${ZAKLAD}/denik/antika/`);
      await page.waitForSelector('astro-island[component-url*="CoTiZustalo"]:not([ssr])', { state: 'attached' });
      await page.evaluate(() => document.fonts.ready);
      const k = page.locator('#co-ti-zustalo');
      if (stav !== 'prazdny') {
        await k.locator('.zustalo__moznost').first().click();
        if (stav === 'konec') {
          for (let i = 0; i < 8; i++) {
            const dalsi = k.getByRole('button', { name: /Další otázka|Konec kola/ });
            if (!(await dalsi.count())) break;
            await dalsi.click();
            if (await k.locator('.zustalo__konec').count()) break;
            // Střídavě první a poslední možnost, ať je na konci co zopakovat i co zůstalo.
            await k.locator('.zustalo__moznost').nth(i % 2 ? 0 : 2).click();
          }
        }
      }
      await page.waitForTimeout(250);
      const soubor = `${VEN}/tvoje-antika-${stav}-${sirka}-${rezim}.png`;
      // Celá stránka jednou za stav a šířku (světlý režim): oddíl v souvislosti s přehledem nad ním.
      if (rezim === 'light') await page.screenshot({ path: soubor.replace('.png', '-cela.png'), fullPage: true });
      // Pevné lišty by ve snímku oddílu ležely přes obsah (vzor scripts/snimky-prvek.mjs).
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit, a[href="#obsah"] { visibility: hidden !important; } nav.lista { display: none !important; } .blok__pata { position: static !important; }' });
      await k.screenshot({ path: soubor });
      console.log(soubor);
      await page.close();
    }
  }
}
await browser.close();
