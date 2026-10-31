// Snímky kroků cesty pro kontrolu a pro autora: projde kroky 1…n a každý vyfotí celý, rozložený do sloupců (JPEG).
// S „odkryt“ v každém bloku nejdřív odpoví (jako test průchodu), bez něj fotí kroky tak, jak je vidí
// student, který bloky neodkryje. Snímky pak složí vedle sebe scripts/snimky-montaz.mjs.
// node scripts/snimky-cesta.mjs <slug> <sirka> <light|dark> [odkryt|zavreno]
//   node scripts/snimky-cesta.mjs je-to-co-vidim-cela-skutecnost 390 light odkryt
// Proměnné: ZAKLAD (běžící web; výchozí náhled sestaveného webu: npx astro preview --port 4323),
// VEN (složka pro výstup; výchozí „Claude outputs/snimky“, mimo git), VYSKA (výška sloupce, výchozí 1500), MERITKO.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const [slug, sirkaS = '390', rezim = 'light', stav = 'odkryt'] = process.argv.slice(2);
const sirka = Number(sirkaS);
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky';
const VYSKA = Number(process.env.VYSKA ?? 1500);
const MERITKO = Number(process.env.MERITKO ?? 1);
mkdirSync(VEN, { recursive: true });

async function projed(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
}

/** Udělá v bloku jen to, co je k němu potřeba (stejně jako tests/e2e/pruchod.spec.ts). */
async function odpovez(blok) {
  const tl = (nazev) => blok.getByRole('button', { name: nazev });
  if (await tl('Tohle je můj tah').count()) {
    await blok.locator('.karta').nth(1).click();
    await tl('Tohle je můj tah').click();
  } else if (await tl('Mám roztříděno').count()) {
    const sem = blok.getByRole('button', { name: /^Dát sem kartu/ });
    for (let i = 0; (await sem.count()) > 0 && i < 20; i++) await sem.nth(i % 3).click({ force: true });
    await tl('Mám roztříděno').click();
  } else if (await tl('Tady stojím').count()) {
    await blok.getByRole('radio').nth(1).check({ force: true });
    await tl('Tady stojím').click();
    await blok.locator('.skala').getByRole('radio').nth(3).check({ force: true });
    await tl('Zapsat konečnou polohu').click();
  } else if (await tl('Rozhodnuto').count()) {
    await blok.getByRole('radio').first().check({ force: true });
    await tl('Rozhodnuto').click();
    await blok.locator('.cip').first().click();
    await blok.locator('.zmenena').getByRole('radio').nth(1).check({ force: true });
    await blok.locator('.zmenena .blok__tl--hlavni').click();
  } else if (await tl('Zkontrolovat').count()) {
    // Slož argument: karty z hromádky po řadě do řádků 1, 2… a Závěr, pak ukázat chybějící větu a napadnout první možnost.
    const radky = blok.locator('[data-radek]');
    for (let i = 0; i < (await radky.count()); i++) {
      await blok.locator('[data-hromadka] button[data-karta]').first().click();
      await radky.nth(i).locator('.radek__sem').click();
    }
    await tl('Zkontrolovat').click();
    await tl('Ukázat chybějící větu').click();
    await blok.locator('label.moznost').first().click();
    await tl('Tohle bych napadl').click();
  } else {
    await blok.getByRole('textbox').first().fill('Zkouším to po svém.');
    await blok.locator('.blok__tl--hlavni').first().click();
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
const list = await browser.newPage();
for (let n = 1; n < 20; n++) {
  const odp = await page.goto(`${ZAKLAD}/cesta/${slug}/${n}/`);
  if (!odp || odp.status() !== 200) break;
  await projed(page);
  if (stav === 'odkryt') {
    // Poslední krok má místo bloků závěrečné pravidlo.
    const pravidlo = page.getByRole('textbox', { name: /Napiš svoje pravidlo/ });
    const bloky = page.locator('.krok__obsah section.blok');
    if (await pravidlo.count()) await pravidlo.fill('Skutečné je to, co obstojí, i když se na to podívám odjinud.');
    else for (let i = 0; i < (await bloky.count()); i++) await odpovez(bloky.nth(i));
    await page.waitForTimeout(400);
    await projed(page);
  }
  // Pevné lišty by na celostránkovém snímku visely uprostřed.
  await page.addStyleTag({ content: '.cesta-lista, header.hlavicka, .krok__hlavicka { position: static !important; }' });
  // Krok rozložený do sloupců (jako snimky-listy.mjs), aby šel přečíst v jednom obrázku.
  const celkem = await page.evaluate(() => document.documentElement.scrollHeight);
  const sl = [];
  for (let y = 0; y < celkem; y += VYSKA) {
    const h = Math.min(VYSKA, celkem - y);
    const png = await page.screenshot({ fullPage: true, clip: { x: 0, y, width: sirka, height: h } });
    sl.push(`<div style="width:${sirka * MERITKO}px;height:${VYSKA * MERITKO}px;overflow:hidden;flex:none"><img src="data:image/png;base64,${png.toString('base64')}" style="display:block;width:${sirka * MERITKO}px"></div>`);
  }
  await list.setViewportSize({ width: Math.round(sl.length * sirka * MERITKO) + (sl.length - 1) * 8, height: Math.round(VYSKA * MERITKO) });
  await list.setContent(`<body style="margin:0;background:#888;display:flex;gap:8px">${sl.join('')}</body>`);
  await list.waitForTimeout(150);
  const soubor = `${VEN}/${slug}-${sirka}-${rezim}-${stav}-${n}.jpg`;
  writeFileSync(soubor, await list.screenshot({ type: 'jpeg', quality: 62 }));
  console.log(soubor, celkem);
}
await browser.close();
