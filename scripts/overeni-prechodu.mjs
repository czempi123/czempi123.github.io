// Jednorázové ověření přechodu listu a letu fotky v opravdovém (ne headless) Chromu nad npm run dev.
import { chromium } from '@playwright/test';

const ZAKLAD = process.env.ZAKLAD || 'http://localhost:4321';
const kanal = process.env.KANAL || 'chrome';
let prohlizec;
try { prohlizec = await chromium.launch({ headless: false, channel: kanal }); }
catch { prohlizec = await chromium.launch({ headless: false }); }
const kontext = await prohlizec.newContext({ viewport: { width: 1280, height: 800 } });
await kontext.addInitScript(() => {
  const zapis = (o) => {
    try {
      const l = JSON.parse(sessionStorage.getItem('__log') || '[]');
      l.push(o); sessionStorage.setItem('__log', JSON.stringify(l));
    } catch {}
  };
  addEventListener('pageswap', (e) => {
    setTimeout(() => {}, 0);
    queueMicrotask(() => {
      const k = document.querySelector('[style*="view-transition-name"]');
      zapis({ ud: 'pageswap', stranka: location.pathname, vt: !!e.viewTransition, karta: k ? k.className || k.tagName : null });
    });
  });
  addEventListener('pagereveal', (e) => {
    const vt = e.viewTransition;
    const zaznam = { ud: 'pagereveal', stranka: location.pathname, vt: !!vt };
    if (!vt) { zapis(zaznam); return; }
    vt.ready.then(() => {
      zaznam.typy = [...vt.types];
      zaznam.trida = document.documentElement.className;
      zaznam.deska = document.getElementById('deska-osoby')?.style.viewTransitionName || '';
      zaznam.skupiny = [...new Set(document.getAnimations().map((a) => a.effect?.pseudoElement).filter(Boolean))];
      zapis(zaznam);
    }).catch((x) => { zaznam.chyba = String(x); zapis(zaznam); });
  });
});
const strana = await kontext.newPage();
if (process.env.PODROBNE) strana.on('console', (m) => console.log('KONZOLE', m.type(), m.text().slice(0, 300)));
const pockej = (ms) => strana.waitForTimeout(ms);
const log = async () => strana.evaluate(() => { const l = sessionStorage.getItem('__log'); sessionStorage.removeItem('__log'); return JSON.parse(l || '[]'); });

async function klikni(selektor) {
  const a = strana.locator(selektor).first();
  await a.evaluate((el) => { document.documentElement.style.scrollBehavior = 'auto'; el.scrollIntoView({ block: 'center' }); });
  await pockej(400);
  await a.click();
}

const vysledky = {};
// K7a: Otázky → Lidé a zpět z hlavní navigace (test ram.spec.ts:85), OPAKOVANI-krát; vrací typy přechodu nové stránky.
const opakovani = Number(process.env.OPAKOVANI || 0);
if (opakovani) {
  vysledky.otazkyLide = [];
  for (let i = 0; i < opakovani; i++) {
    await strana.goto(`${ZAKLAD}/otazky/`); await pockej(2000); await log();
    await klikni('header nav a[href$="/lide/"]'); await pockej(2000);
    const zaznamy = await log();
    if (process.env.PODROBNE) console.log(JSON.stringify(zaznamy));
    const tam = zaznamy.filter((z) => z.ud === 'pagereveal').map((z) => (z.vt ? (z.typy || []).join(',') : 'zadny'));
    await strana.goBack(); await pockej(2000);
    const zpet = (await log()).filter((z) => z.ud === 'pagereveal').map((z) => (z.vt ? (z.typy || []).join(',') : 'zadny'));
    vysledky.otazkyLide.push({ tam: tam.join('|'), zpet: zpet.join('|') });
  }
  if (process.env.JEN_OTAZKY) { console.log(JSON.stringify(vysledky)); await prohlizec.close(); process.exit(0); }
}
await strana.goto(`${ZAKLAD}/osobnost/sokrates/`); await pockej(3000); await log();
await klikni('a.lezi-odkaz[href*="/osobnost/platon/"]');
await pockej(3000);
vysledky.sokratesNaPlatona = { url: new URL(strana.url()).pathname, log: await log() };
await strana.goBack(); await pockej(200);
vysledky.zpetNaSokrata = { url: new URL(strana.url()).pathname, trida200ms: await strana.evaluate(() => document.documentElement.className) };
await pockej(2800);
vysledky.zpetNaSokrata.log = await log();

await strana.goto(`${ZAKLAD}/lide/`); await pockej(3000); await log();
await klikni('a[href$="/osobnost/sokrates/"]:not(.jmeno-odkaz)');
await pockej(3000);
vysledky.lideNaSokrata = { url: new URL(strana.url()).pathname, log: await log() };

await strana.goBack(); await pockej(3000);
vysledky.zpet = { url: new URL(strana.url()).pathname, log: await log() };

// K5: mezi sousedními kroky cesty se list jen posune (typ krok-dal / krok-zpet podle adres), na přehled se otočí.
const CESTA = `${ZAKLAD}/cesta/kdy-mam-dobry-duvod-verit/`;
await strana.goto(`${CESTA}1/`); await pockej(3000); await log();
await klikni('.cesta-lista [data-dalsi-krok]'); await pockej(2500);
vysledky.krok1na2 = { url: new URL(strana.url()).pathname, log: await log(), stip: await strana.evaluate(() => document.querySelector('.cesta-hlavicka .misto')?.className) };
await klikni('.cesta-lista a.predchozi'); await pockej(2500);
vysledky.krok2na1 = { url: new URL(strana.url()).pathname, log: await log() };
await strana.goBack(); await pockej(2500);
vysledky.zpetVHistorii = { url: new URL(strana.url()).pathname, log: await log() };
await klikni('.cesta-hlavicka a.zpet'); await pockej(2500);
vysledky.krokNaPrehled = { url: new URL(strana.url()).pathname, log: await log() };

console.log(JSON.stringify({ kanal: prohlizec.browserType().name() + ' ' + prohlizec.version(), ...vysledky }, null, 1));
await prohlizec.close();
