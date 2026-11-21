// Revize herna-v1 (R): příprava hodiny s novými zastaveními z T jen klávesnicí (hledání, Tab na Přidat do hodiny, Enter),
// pak promítání: každé zastavení se ukáže na stránce a jeho blok je v okně (Tab na Další, Enter).
// node scripts/revize-hodina-klavesnice.mjs        (ZAKLAD: výchozí náhled sestaveného webu na portu 4323)
import { chromium } from '@playwright/test';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const HLEDAT = [
  ['Kdo s kým mluvil', 'b:obdobi1-serad'],
  ['Kolik lidských životů', 'b:obdobi2-tipni'],
  ['Komu z nich by ta věta', 'b:jak-zit-kdo-by'],
  ['Seneca radil představit', 'b:cesta33-do-hodiny'],
  ['Čí je ta věta, a je stoická', 'b:stoicismus-kdo-rekl'],
];
const prohlizec = await chromium.launch();
const page = await prohlizec.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(ZAKLAD + '/hodina/nova/');
await page.waitForSelector('astro-island[component-url*="Skladatel"]:not([ssr])', { state: 'attached' });
const jeAktivni = (l) => l.evaluate((el) => el === document.activeElement).catch(() => false);
async function tabNa(cil, n = 80) {
  for (let i = 0; i < n; i++) { if (await jeAktivni(cil)) return i; await page.keyboard.press('Tab'); }
  throw new Error('Tabulátor se nedostal na ' + cil);
}
let nalezu = 0;
const hledat = page.locator('#vyber-hledat');
for (const [dotaz, id] of HLEDAT) {
  await tabNa(hledat, 120);
  await page.keyboard.press('Meta+A'); await page.keyboard.press('Backspace');
  await page.keyboard.type(dotaz);
  await page.waitForTimeout(300);
  const tl = page.getByRole('button', { name: new RegExp('^Přidat do hodiny: ' + dotaz.replace(/[?,]/g, '.')) }).first();
  if (!(await tl.count())) { console.log(dotaz, 'NENALEZENO v nabídce'); nalezu++; continue; }
  const tabu = await tabNa(tl, 300).catch(() => -1); if (tabu < 0) { console.log(dotaz, "TABULÁTOREM NEDOSAŽENO (300)", await tl.isVisible()); nalezu++; continue; }
  await page.keyboard.press('Enter');
  console.log(dotaz, '→ přidáno po', tabu, 'tabulátorech');
}
const zvolene = page.locator('.zvolena > li');
console.log('ve zvolených:', await zvolene.count(), 'z', HLEDAT.length);
if ((await zvolene.count()) !== HLEDAT.length) nalezu++;
const nazvy = await zvolene.allInnerTexts();
console.log(nazvy.map((t) => t.split('\n').slice(0, 2).join(' | ').slice(0, 110)).join('\n'));

// Promítání: zastavení po zastavení klávesnicí, blok musí být v okně.
const adresa = `/hodina/?v=1&n=${encodeURIComponent('Revize herny')}&z=${HLEDAT.map((h) => h[1]).join(',')}`;
await page.goto(ZAKLAD + adresa);
const promitat = page.getByRole('button', { name: 'Promítat hodinu' });
await tabNa(promitat, 60);
await page.keyboard.press('Enter');
for (let i = 0; i < HLEDAT.length; i++) {
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  const kotva = HLEDAT[i][1].slice(2);
  const v = await page.evaluate((k) => {
    const e = document.getElementById(k);
    if (!e) return 'chybí';
    const r = e.getBoundingClientRect();
    const skryty = getComputedStyle(e).display === 'none';
    return skryty ? 'skrytý' : r.top < innerHeight && r.bottom > 0 ? `v okně (${Math.round(r.top)} px)` : `mimo okno (${Math.round(r.top)} px)`;
  }, kotva);
  console.log(`zastavení ${i + 1} ${kotva}: ${v} · ${page.url().replace(ZAKLAD, '')}`);
  if (!v.startsWith('v okně')) nalezu++;
  if (i < HLEDAT.length - 1) {
    const dalsi = page.locator('[data-hl-dalsi]');
    await tabNa(dalsi, 200).catch(() => { nalezu++; console.log('  Další tabulátorem nedosažitelné'); });
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
  }
}
await prohlizec.close();
console.log('nálezů:', nalezu);
