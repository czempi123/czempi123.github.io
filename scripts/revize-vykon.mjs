// Revize design-v2 (R): plynulost pohybu jako na levném telefonu s Androidem. Viditelné okno Chromu (headless přechody
// mezi dokumenty vynechává), 390 × 844, procesor zpomalený CPU× (výchozí 6) a pomalá síť (Fast 3G). Měří snímky za sekundu
// během přechodu mezi stránkami (od pagereveal do konce přechodu), při posunu roku v Mapě a čase a v kresbě s pohybem.
// node scripts/revize-vykon.mjs   (ZAKLAD: výchozí http://localhost:4323; CPU: zpomalení; SIT=0 bez zpomalené sítě)
import { chromium } from '@playwright/test';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const CPU = Number(process.env.CPU ?? 6);
let prohlizec;
try { prohlizec = await chromium.launch({ headless: false, channel: 'chrome' }); } catch { prohlizec = await chromium.launch({ headless: false }); }
const kontext = await prohlizec.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: false, hasTouch: true });
await kontext.addInitScript(() => {
  addEventListener('pagereveal', (e) => {
    const vt = e.viewTransition;
    const z = { stranka: location.pathname, vt: !!vt };
    if (!vt) { sessionStorage.setItem('__prechod', JSON.stringify(z)); return; }
    let snimku = 0; let posledni = performance.now(); let nejdelsi = 0; const start = posledni; let bezi = true;
    const tik = (t) => { snimku++; nejdelsi = Math.max(nejdelsi, t - posledni); posledni = t; if (bezi) requestAnimationFrame(tik); };
    requestAnimationFrame(tik);
    vt.finished.finally(() => {
      bezi = false;
      const ms = performance.now() - start;
      Object.assign(z, { typy: [...vt.types], ms: Math.round(ms), snimku, fps: Math.round((snimku / ms) * 1000), nejdelsiSnimek: Math.round(nejdelsi) });
      sessionStorage.setItem('__prechod', JSON.stringify(z));
    });
  });
});
const strana = await kontext.newPage();
const cdp = await kontext.newCDPSession(strana);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
if (process.env.SIT !== '0') await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
const pockej = (ms) => strana.waitForTimeout(ms);
const prechod = async () => { await pockej(2500); return strana.evaluate(() => { const z = sessionStorage.getItem('__prechod'); sessionStorage.removeItem('__prechod'); return JSON.parse(z || 'null'); }); };
async function klikni(sel) {
  const a = strana.locator(sel).first();
  await a.evaluate((el) => { document.documentElement.style.scrollBehavior = 'auto'; el.scrollIntoView({ block: 'center' }); });
  await pockej(300); await strana.evaluate(() => sessionStorage.removeItem('__prechod'));
  const t = Date.now(); await a.click(); await strana.waitForLoadState('load');
  return Date.now() - t;
}
// Snímky za sekundu po dobu ms (requestAnimationFrame) při běžící akci.
const fpsBehem = (ms) => strana.evaluate((ms) => new Promise((ok) => { let n = 0, max = 0, p = performance.now(); const s = p; const t = (x) => { n++; max = Math.max(max, x - p); p = x; if (x - s < ms) requestAnimationFrame(t); else ok({ fps: Math.round((n / (x - s)) * 1000), nejdelsiSnimek: Math.round(max) }); }; requestAnimationFrame(t); }), ms);

const vysledky = [];
const zapis = (co, x) => { vysledky.push({ co, ...x }); console.log(co, JSON.stringify(x)); };
for (let i = 0; i < 3; i++) {
  await strana.goto(`${ZAKLAD}/otazky/`); await pockej(1500);
  const nacteni = await klikni('nav.lista a[href$="/lide/"]');
  zapis(`otočení listu Otázky → Lidé (${i + 1})`, { klikNaLoadMs: nacteni, ...(await prechod()) });
}
for (let i = 0; i < 2; i++) {
  await strana.goto(`${ZAKLAD}/lide/`); await pockej(1500);
  const nacteni = await klikni('a[href="/osobnost/sokrates/"]');
  zapis(`let fotky Lidé → Sókratés (${i + 1})`, { klikNaLoadMs: nacteni, ...(await prechod()) });
}
for (let i = 0; i < 2; i++) {
  await strana.goto(`${ZAKLAD}/cesta/kdy-mam-dobry-duvod-verit/3/`); await pockej(1500);
  const nacteni = await klikni('a[href$="/kdy-mam-dobry-duvod-verit/4/"]');
  zapis(`posun listu krok 3 → 4 (${i + 1})`, { klikNaLoadMs: nacteni, ...(await prechod()) });
}
await strana.goto(`${ZAKLAD}/mapa/`); await pockej(3000);
const posuvnik = strana.getByRole('slider').first();
await posuvnik.focus();
const mereni = fpsBehem(2500);
for (let i = 0; i < 25; i++) { await strana.keyboard.press('ArrowRight'); await pockej(80); }
zapis('Mapa a čas: posun roku šipkou 25×', await mereni);
const prehrat = strana.getByRole('button', { name: /Přehrát/ }).first();
if (await prehrat.count()) { await prehrat.click().catch(() => {}); zapis('Mapa a čas: Přehrát', await fpsBehem(3000)); }
await strana.goto(`${ZAKLAD}/cesta/je-to-co-vidim-cela-skutecnost/1/`); await pockej(2000);
await strana.locator('#jeskyne-pohledy').scrollIntoViewIfNeeded();
zapis('kresba jeskyně s pohybem', await fpsBehem(3000));
await strana.goto(`${ZAKLAD}/osobnost/protagoras/`); await pockej(2000);
await strana.locator('#vitr-dva-lide').scrollIntoViewIfNeeded().catch(() => {});
zapis('kresba Stejný vítr', await fpsBehem(3000));
await prohlizec.close();
