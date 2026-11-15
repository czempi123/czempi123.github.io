// Snímky pro autora po kroku O větve design-v2: obrazovky, kterých se opravy dotkly, jedno okno každá.
// node scripts/snimky-o.mjs   (náhled sestaveného webu na 4323: node scripts/staticky-server.mjs 4323)
// Výstup: „Claude outputs/snimky/design-v2-o/“.
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = 'Claude outputs/snimky/design-v2-o';
mkdirSync(VEN, { recursive: true });
const DENIK = JSON.parse(readFileSync('tests/e2e/data/denik-kapitoly.json', 'utf8'));
const KLID = { 'atlas-klidny': '1' };

const SNIMKY = [
  { n: 'o-01-mapa-390-den', u: '/mapa/?rok=-360', w: 390 },
  { n: 'o-02-mapa-390-noc', u: '/mapa/?rok=-360', w: 390, t: 'dark' },
  { n: 'o-03-mapa-osa-1440-den', u: '/mapa/?rok=-480', w: 1440, kam: '.posuvnik__cas' },
  { n: 'o-04-domu-lístky-390-den', u: '/', w: 390, kam: '.na-zacatek' },
  { n: 'o-05-denik-kapitoly-390-den', u: '/denik/', w: 390, s: DENIK, kam: '.kapitoly' },
  { n: 'o-06-denik-navrat-390-noc', u: '/denik/', w: 390, t: 'dark', s: DENIK, kam: '.navrat' },
  { n: 'o-07-tyden-1440-den', u: '/tyden/stoicky/', w: 1440 },
  { n: 'o-08-tyden-390-noc', u: '/tyden/stoicky/', w: 390, t: 'dark' },
  { n: 'o-09-tyden-den1-390-den', u: '/tyden/stoicky/', w: 390, kam: '#den-1 .den__mez' },
  { n: 'o-10-profil-kapitola1-390-den', u: '/osobnost/sokrates/', w: 390, kam: '#delfy' },
  { n: 'o-11-klidny-profil-1440-den', u: '/osobnost/sokrates/', w: 1440, s: KLID, kam: '#delfy' },
  { n: 'o-12-klidny-profil-1440-noc', u: '/osobnost/sokrates/', w: 1440, t: 'dark', s: KLID },
  { n: 'o-13-klidny-domu-390-den', u: '/', w: 390, s: KLID },
  { n: 'o-14-klidny-zahlavi-1440-den', u: '/lide/', w: 1440, s: KLID },
  { n: 'o-15-pojem-obec-390-den', u: '/pojem/obec/', w: 390 },
  { n: 'o-16-dva-zivoty-1440-den', u: '/osobnost/aristoteles/', w: 1440, kam: '#dva-zivoty' },
];

const b = await chromium.launch();
for (const x of SNIMKY) {
  const p = await b.newPage({ viewport: { width: x.w, height: x.w < 700 ? 844 : 900 }, colorScheme: x.t ?? 'light', reducedMotion: 'reduce' });
  if (x.s) await p.addInitScript((z) => { for (const [k, v] of Object.entries(z)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); }, x.s);
  await p.goto(ZAKLAD + x.u);
  await p.evaluate(() => document.fonts.ready);
  if (x.kam) {
    await p.locator(x.kam).first().scrollIntoViewIfNeeded();
    await p.evaluate((sel) => { const e = document.querySelector(sel); if (e) scrollBy(0, e.getBoundingClientRect().top - 120); }, x.kam);
  }
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${VEN}/${x.n}.jpg`, type: 'jpeg', quality: 82 });
  await p.close();
}
await b.close();
console.log(`snímků: ${SNIMKY.length} → ${VEN}`);
