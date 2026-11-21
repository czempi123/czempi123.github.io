// Snímky přídavků herny v antice (herna-v1, T): každý blok na své stránce v klidu a po činu studenta,
// na 390 a 1440 px ve světlém i tmavém režimu, do Claude outputs/snimky/herna-t-<id>-<stav>-<šířka>-<režim>.png.
// node scripts/snimky-herna-t.mjs [id…]      (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = 'Claude outputs/snimky';
mkdirSync(VEN, { recursive: true });
const PRIDAVKY = [
  ['obdobi1-serad', '/obdobi/pocatky-a-klasicke-recko/'],
  ['obdobi2-tipni', '/obdobi/helenismus-a-rim/'],
  ['stoicismus-kdo-rekl', '/smer/stoicismus/'],
  ['sokrates-doplnit-sochy', '/osobnost/sokrates/'],
  ['epikureismus-pary', '/smer/epikureismus/'],
  ['cesta1-pravy', '/cesta/kdy-mam-dobry-duvod-verit/7/'],
  ['cesta6-slabe', '/cesta/kolik-je-dost/6/'],
  ['jak-zit-kdo-by', '/otazka/jak-zit/'],
  ['hra-aristoteles-kdo-rekl', '/osobnost/aristoteles/'],
  ['hra-demokritos-kdo-rekl', '/osobnost/demokritos/'],
  ['hra-epiktetos-kdo-rekl', '/osobnost/epiktetos/'],
];
const vybrane = process.argv.slice(2);

/** Totéž co odpovez() v tests/e2e/pruchod.spec.ts, jen pro hry herny. */
async function zahraj(blok) {
  const tl = (n) => blok.getByRole('button', { name: n });
  if (await tl('Zkontrolovat pořadí').count()) {
    for (let i = 0; i < 12 && (await tl('Zkontrolovat pořadí').count()); i++) {
      if (await tl('Ukázat pořadí').count()) { await tl('Ukázat pořadí').click(); break; }
      const karty = blok.locator('.karta-osy');
      await karty.nth(i % 2).click();
      await karty.nth(2).click();
      if (await tl('Zkontrolovat pořadí').isEnabled()) await tl('Zkontrolovat pořadí').click();
    }
  } else if (await blok.locator('.razitko-odpoved').count()) {
    for (let i = 0; i < 40; i++) {
      if (await tl('Další karta').count()) { await tl('Další karta').click(); continue; }
      const v = blok.locator('.razitko-odpoved:not(:disabled)');
      if (!(await v.count())) break;
      await v.first().click();
    }
  } else if (await tl('Zkontrolovat odhad').count()) {
    const vstup = blok.locator('.pravitko__vstup');
    for (const n of ['0', '1']) {
      if (!(await tl('Zkontrolovat odhad').count())) break;
      await vstup.evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, n);
      if (await tl('Zkontrolovat odhad').isEnabled()) await tl('Zkontrolovat odhad').click();
    }
    if (await tl('Ukázat, jak to bylo').count()) await tl('Ukázat, jak to bylo').click();
  } else if (await blok.locator('.vystrizky .vystrizek').count()) {
    const l = blok.locator('.vystrizky .vystrizek');
    for (let i = 0; i < 3 && (await l.count()); i++) await l.nth(i).click();
  } else if (await blok.locator('.par-listek').count()) {
    for (let i = 0; i < 30; i++) {
      if (await tl('Ukázat páry').count()) { await tl('Ukázat páry').click(); break; }
      const p = blok.locator('.par-listek--pojem:not(:disabled)');
      if (!(await p.count())) break;
      await p.first().click();
      await blok.locator('.par-listek--situace:not(:disabled)').nth(i % 2).click();
    }
  } else if (await blok.locator('.razitko-verdikt').count()) {
    // Jen první ústřižek: otisk a lístek s původem.
    await blok.locator('.razitko-verdikt:not(:disabled)').nth(1).click();
  } else if (await blok.locator('.veta-arg').count()) {
    await blok.locator('button.veta-arg').first().click();
    await tl('Zapsat do deníku').click();
  } else if (await blok.locator('.razitko-volby').count()) {
    await blok.locator('.razitko-volby').first().click();
    await tl('Zapsat do deníku').click();
  }
}

const browser = await chromium.launch();
for (const [id, adresa] of PRIDAVKY) {
  if (vybrane.length && !vybrane.includes(id)) continue;
  for (const sirka of [390, 1440]) {
    for (const rezim of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(ZAKLAD + adresa);
      await page.evaluate(() => document.fonts.ready);
      // Stránka otázky: první názor přeskočit, ať je vidět zbytek.
      const preskocit = page.locator('.prvni').getByRole('button', { name: /Přeskočit/ });
      if (await preskocit.count()) await preskocit.first().click();
      // Pevné a lepivé lišty by na snímku prvku ležely přes blok.
      await page.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') e.style.setProperty('position', 'static', 'important'); } });
      const blok = page.locator(`section.blok:has([id="${id}"]), section.blok[id="${id}"], [id="${id}"]`).first();
      await blok.scrollIntoViewIfNeeded();
      await page.waitForFunction((i) => { const e = document.getElementById(i); const o = e?.closest('astro-island'); return !!e && (!o || !o.hasAttribute('ssr')); }, id, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(300);
      await blok.screenshot({ path: `${VEN}/herna-t-${id}-klid-${sirka}-${rezim}.png` });
      await zahraj(blok);
      await page.waitForTimeout(500);
      await blok.screenshot({ path: `${VEN}/herna-t-${id}-cin-${sirka}-${rezim}.png` });
      const pres = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log(id, sirka, rezim, pres > 0 ? `PŘETÉKÁ o ${pres} px` : 'ok');
      await page.close();
    }
  }
}
await browser.close();
