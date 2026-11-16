// Tři varianty čtenářského sloupce vedle sebe (K4a, otázka po K4a): tečky, ztlumené tečky, čistý list.
// Vyfotí obrazovku tak, jak ji student vidí (prvek nahoře pod hlavičkou), pro každou variantu (data-sloupec na <html>,
// global.css › Tři varianty čtenářského sloupce), a složí je do jednoho JPEG s popisky.
// node scripts/snimky-sloupec.mjs <cesta> <selektor> <nazev> <sirka> <light|dark>
//   node scripts/snimky-sloupec.mjs /osobnost/sokrates/ '#delfy' sokrates-kapitola 1440 light
// Proměnné: ZAKLAD (běžící web; výchozí náhled sestaveného webu na portu 4323), VEN (složka pro výstup), POSUN (px nad prvkem).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [cesta, selektor, nazev, sirkaS = '1440', rezim = 'light'] = process.argv.slice(2);
const sirka = Number(sirkaS);
const vyska = sirka < 700 ? 844 : 900;
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
const POSUN = Number(process.env.POSUN ?? 90);
mkdirSync(VEN, { recursive: true });

const VARIANTY = [['tecky', 'tečky'], ['ztlumene', 'ztlumené tečky'], ['', 'čistý list']];
const browser = await chromium.launch();
const snimky = [];
for (const [v, popis] of VARIANTY) {
  const page = await browser.newPage({ viewport: { width: sirka, height: vyska }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  await page.goto(ZAKLAD + cesta);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((x) => { if (x) document.documentElement.dataset.sloupec = x; }, v);
  // Ostrovy se hydratují, až jsou vidět: projeď stránku a vrať se k prvku.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 40)); }
  });
  await page.evaluate(([sel, posun]) => {
    const e = document.querySelector(sel);
    window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - posun, behavior: 'instant' });
  }, [selektor, POSUN]);
  await page.waitForTimeout(300);
  snimky.push([popis, (await page.screenshot({ type: 'png' })).toString('base64')]);
  await page.close();
}
const page = await browser.newPage({ viewport: { width: 1600, height: 100 } });
const sloupec = (popis, b64) => `<figure style="margin:0"><figcaption style="font:600 28px system-ui;color:#fff;padding:6px 4px">${popis}</figcaption><img src="data:image/png;base64,${b64}" style="display:block;zoom:${sirka < 700 ? 0.5 : 0.35}"></figure>`;
await page.setContent(`<body style="margin:0;background:#555;display:flex;gap:16px;padding:12px;width:max-content">${snimky.map(([p, b]) => sloupec(p, b)).join('')}</body>`);
await page.waitForTimeout(300);
const r = await page.evaluate(() => ({ w: document.body.scrollWidth, h: document.body.scrollHeight }));
await page.setViewportSize({ width: r.w, height: r.h });
const soubor = `${VEN}/${nazev}-${sirka}-${rezim}.jpg`;
await page.screenshot({ path: soubor, type: 'jpeg', quality: 85 });
console.log(soubor);
await browser.close();
