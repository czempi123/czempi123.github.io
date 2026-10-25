// Snímky hodiny na plátně (příprava hodiny, podoby zastavení) pro revizi celku: otevře hodinu z odkazu, stiskne
// Promítat hodinu a vyfotí každé zastavení tak, jak ho vidí třída. U otevřené otázky vyfotí i stav po Ukázat možnosti
// (klávesa M). Hlásí chyby konzole a zastavení, na kterém plátno nic neukáže.
// node scripts/snimky-platno.mjs <nazev> <sirka> <light|dark> <zastaveni,zastaveni~o,…>
//   node scripts/snimky-platno.mjs otevrena 1280 light b:cesta33-pod-padakem~o,b:maska~k
// Proměnné: ZAKLAD (běžící web; výchozí náhled sestaveného webu na portu 4323), VEN (složka pro výstup), VYSKA (720).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [nazev, sirkaArg, rezim = 'light', seznam = ''] = process.argv.slice(2);
if (!nazev || !seznam) {
  console.error('Použití: node scripts/snimky-platno.mjs <nazev> <sirka> <light|dark> <zastaveni,…>');
  process.exit(1);
}
const sirka = Number(sirkaArg) || 1280;
const vyska = Number(process.env.VYSKA) || 720;
const zaklad = process.env.ZAKLAD ?? 'http://localhost:4323';
const ven = process.env.VEN ?? 'Claude outputs/snimky-platno';
mkdirSync(ven, { recursive: true });
const ids = seznam.split(',').map((s) => s.trim()).filter(Boolean);
const celkem = ids.length;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: sirka, height: vyska }, colorScheme: rezim, reducedMotion: 'reduce' });
const chyby = [];
page.on('console', (m) => { if (m.type() === 'error') chyby.push(m.text()); });
page.on('pageerror', (e) => chyby.push(String(e)));

const pocet = async () => ((await page.locator('[data-hl-pocet]').textContent()) ?? '').replace(/\u00a0/g, ' ').trim();
const ted = async () => Number((await pocet()).split(' ')[0]);
const pripraveno = () =>
  page.waitForFunction(() => {
    const h = document.documentElement.classList;
    return !!document.querySelector('[data-hodina-lista]')?.hasAttribute('data-pripraveno') && h.contains('promitani-pripraveno');
  });
const hydratovano = () =>
  page.waitForFunction(() => [...document.querySelectorAll('astro-island')].every((x) => !x.hasAttribute('ssr') || !x.getClientRects().length));

await page.goto(`${zaklad}/hodina/?v=1&n=${encodeURIComponent(nazev)}&z=${ids.join(',')}`);
await page.evaluate(() => document.fonts.ready);
await page.getByRole('button', { name: 'Promítat hodinu' }).click();
await pripraveno();
await hydratovano();

for (let n = 1; n <= celkem; n++) {
  await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : null));
  for (let i = 0; i < 40 && (await ted()) !== n; i++) {
    await page.keyboard.press((await ted()) < n ? 'ArrowRight' : 'ArrowLeft');
    await page.waitForTimeout(250);
    await page.waitForLoadState('load');
    await pripraveno();
  }
  await hydratovano();
  await page.waitForTimeout(300);
  const id = ids[n - 1].replace(/[:/~]/g, '_');
  const soubor = `${ven}/${nazev}-${sirka}-${rezim}-${String(n).padStart(2, '0')}-${id}.png`;
  await page.screenshot({ path: soubor });
  const viditelne = await page.evaluate(() => {
    const main = document.querySelector('main') ?? document.body;
    return (main.innerText ?? '').replace(/\s+/g, ' ').trim().length;
  });
  console.log(`${await pocet()} ${ids[n - 1]}: ${soubor} (viditelný text ${viditelne} znaků)`);
  if (ids[n - 1].endsWith('~o')) {
    const tl = page.locator('[data-hodina-lista] [data-hl-moznosti]');
    if (await tl.isVisible()) {
      await tl.click();
      await page.waitForTimeout(300);
      const s2 = soubor.replace('.png', '-moznosti.png');
      await page.screenshot({ path: s2 });
      console.log(`   po Ukázat možnosti: ${s2}`);
      await tl.click();
    } else console.log('   Ukázat možnosti není vidět');
  }
}
console.log(chyby.length ? `Chyby konzole:\n${chyby.join('\n')}` : 'Konzole bez chyb');
await browser.close();
