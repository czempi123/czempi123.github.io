// Snímky Volby jako kroužkovacího archu (K5, připomínka autora 14. 11.): před volbou, po výběru a po tahu,
// na 390 a 1440 px ve dne i v noci. node scripts/snimky-volba-k5.mjs  (ZAKLAD, výchozí npm run dev na 4321)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const Z = process.env.ZAKLAD ?? 'http://localhost:4321';
const VEN = 'Claude outputs/snimky/design-v2-k5/volba';
mkdirSync(VEN, { recursive: true });
const b = await chromium.launch();
for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    const p = await b.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: 2 });
    await p.goto(`${Z}/cesta/kdy-mam-dobry-duvod-verit/2/`);
    await p.evaluate(() => document.fonts.ready);
    await p.addStyleTag({ content: '.cesta-lista, .cesta-hlavicka, header.hlavicka, .blok__pata { position: static !important; }' });
    const blok = p.locator('#cesta1-jak-zjistit');
    await p.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
    const moz = blok.locator('.moznosti');
    await moz.screenshot({ path: `${VEN}/volba-${sirka}-${rezim}.png` });
    await blok.getByText('Najdu lidi').click();
    await p.waitForTimeout(200);
    await moz.screenshot({ path: `${VEN}/volba-vyber-${sirka}-${rezim}.png` });
    await blok.getByRole('button', { name: 'Tohle je můj tah' }).click();
    await p.waitForTimeout(300);
    await blok.screenshot({ path: `${VEN}/volba-po-tahu-${sirka}-${rezim}.png` });
    await p.close();
  }
}
await b.close();
console.log('hotovo', VEN);
