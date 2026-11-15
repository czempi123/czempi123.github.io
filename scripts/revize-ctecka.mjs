// Revize design-v2 (R): co dostane čtečka. Strom přístupnosti (ariaSnapshot z Playwrightu, Chromium) pěti míst
// v pořadí, v jakém je čtečka čte: profil s pojmem, krok cesty s blokem, kresba, deník s kapitolami, Mapa a čas.
// Nenahrazuje VoiceOver (ten mění zkratky a slučuje role), ale ukáže jména, role a pořadí.
// node scripts/revize-ctecka.mjs > /tmp/ctecka.txt   (ZAKLAD: výchozí http://localhost:4323)
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const MISTA = [
  ['/osobnost/sokrates/', '#delfy', 'profil s pojmem'],
  ['/cesta/kdy-mam-dobry-duvod-verit/5/', 'main', 'krok cesty se Sporem'],
  ['/cesta/je-to-co-vidim-cela-skutecnost/1/', '#jeskyne-pohledy', 'kresba Jeskyně'],
  ['/denik/', 'main', 'deník s kapitolami'],
  ['/mapa/', 'main', 'Mapa a čas'],
];
const denik = JSON.parse(readFileSync('tests/e2e/data/denik-kapitoly.json', 'utf8'));
const prohlizec = await chromium.launch();
for (const [cesta, sel, nazev] of MISTA) {
  const page = await prohlizec.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.addInitScript((z) => { for (const [k, v] of Object.entries(z)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); }, denik);
  await page.goto(ZAKLAD + cesta);
  await page.waitForTimeout(1200);
  const strom = await page.locator(sel).first().ariaSnapshot();
  console.log(`\n===== ${nazev} (${cesta} ${sel}) =====\n${strom.split('\n').slice(0, 140).join('\n')}`);
  await page.close();
}
await prohlizec.close();
