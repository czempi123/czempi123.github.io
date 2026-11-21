// Revize herna-v1 (R): přídavky herny na jejich místech v antice prstem, skutečnými dotykovými událostmi přes CDP
// (Input.dispatchTouchEvent, ne click()). Na 390 px: klepne na první herní prvek bloku a zkontroluje, že se blok
// změnil, cíle aspoň 44 × 44 px (jen viditelné ovládací prvky bloku) a že stránka nepřetéká do strany. U Seřaď na ose
// navíc tažení karty prstem: pořadí se změní a stránka se při tažení neposune.
// node scripts/revize-herna-dotyk.mjs        (ZAKLAD: výchozí náhled sestaveného webu na portu 4323)
import { chromium } from '@playwright/test';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const MISTA = [
  ['obdobi1-serad', '/obdobi/pocatky-a-klasicke-recko/', '.karta-osy'],
  ['obdobi2-tipni', '/obdobi/helenismus-a-rim/', 'input[type=range]'],
  ['stoicismus-kdo-rekl', '/smer/stoicismus/', '.razitko-odpoved'],
  ['sokrates-doplnit-sochy', '/osobnost/sokrates/', '.vystrizek'],
  ['epikureismus-pary', '/smer/epikureismus/', '.par-listek--pojem'],
  ['cesta1-pravy', '/cesta/kdy-mam-dobry-duvod-verit/7/', '.razitko-verdikt--nerekl'],
  ['cesta6-slabe', '/cesta/kolik-je-dost/6/', '.veta-arg'],
  ['jak-zit-kdo-by', '/otazka/jak-zit/', '.razitko-volby'],
];

const prohlizec = await chromium.launch();
let nalezu = 0;
for (const [id, cesta, sel] of MISTA) {
  const ctx = await prohlizec.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const chyby = [];
  page.on('pageerror', (e) => chyby.push(String(e)));
  await page.goto(ZAKLAD + cesta, { waitUntil: 'networkidle' });
  if (cesta === '/otazka/jak-zit/') {
    // Hra stojí pod Proč to tak viděli, ukáže se až po prvním názoru (nebo po Přeskočit).
    await page.locator('#prvni-nazor').getByRole('button', { name: 'Přeskočit' }).click();
    await page.waitForTimeout(400);
  }
  const blok = page.locator(`[id="${id}"], [data-blok="${id}"], .blok:has([id^="${id}"])`).first();
  if (!(await blok.count())) { console.log(id, 'BLOK NENALEZEN'); nalezu++; await ctx.close(); continue; }
  await blok.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const cdp = await ctx.newCDPSession(page);
  const prvek = blok.locator(sel).first();
  if (!(await prvek.count())) { console.log(id, 'prvek nenalezen:', sel); nalezu++; await ctx.close(); continue; }
  await prvek.scrollIntoViewIfNeeded();
  const pred = await blok.innerHTML();
  const r = await prvek.boundingBox();
  const bod = (x, y) => [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  const scrollPred = await page.evaluate(() => scrollY);
  if (id === 'obdobi1-serad') {
    const cil = await blok.locator(sel).nth(3).boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(r.x + r.width / 2, r.y + r.height / 2) });
    for (let i = 1; i <= 10; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: bod(r.x + r.width / 2, r.y + r.height / 2 + ((cil.y - r.y) * i) / 10) });
      await page.waitForTimeout(30);
    }
    const scrollBehem = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    if (Math.abs(scrollBehem - scrollPred) > 2) { console.log(id, 'stránka se při tažení posunula o', scrollBehem - scrollPred); nalezu++; }
  } else if (id === 'obdobi2-tipni') {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(r.x + 10, r.y + r.height / 2) });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: bod(r.x + 10 + (r.width * 0.4 * i) / 8, r.y + r.height / 2) });
      await page.waitForTimeout(30);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: bod(r.x + r.width / 2, r.y + r.height / 2) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await page.waitForTimeout(700);
  const po = await blok.innerHTML();
  const zmena = pred !== po;
  const male = await blok.evaluate((b) => [...b.querySelectorAll('button, input, select, textarea, a[href], [role=button], [tabindex="0"]')]
    .filter((e) => e.checkVisibility?.() && !e.closest('.vizualne-skryte') && getComputedStyle(e).display !== 'none')
    .map((e) => { const q = e.getBoundingClientRect(); return { t: (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30), w: Math.round(q.width), h: Math.round(q.height) }; })
    .filter((q) => q.w > 2 && q.h > 2 && (q.w < 44 || q.h < 44)));
  const pretece = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(id, zmena ? 'dotyk změnil blok' : 'DOTYK NIC NEZMĚNIL', '| malé cíle:', male.length ? JSON.stringify(male) : 'žádné', '| přetéká:', pretece, chyby.length ? '| chyby: ' + chyby.join('; ') : '');
  if (!zmena || male.length || pretece > 0 || chyby.length) nalezu++;
  await ctx.close();
}
await prohlizec.close();
console.log('nálezů:', nalezu);
