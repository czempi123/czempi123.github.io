// Revize antiky (P11): zastavený pohyb u všech kreseb, které se hýbou samy.
// Pro každou kresbu dva snímky na 390 px: (1) pohyb povolený, „Zastavit pohyb“ hned po načtení,
// (2) omezený pohyb (prefers-reduced-motion). U každého vypíše text pod kresbou, ať jde porovnat,
// že kresba i text ukazují obsah, ne zamrzlý okamžik před ním.
// node scripts/revize-pohyb.mjs   (ZAKLAD: běžící web, výchozí náhled sestaveného webu na portu 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/snimky-revize-antiky/pohyb';
mkdirSync(VEN, { recursive: true });

const KRESBY = [
  ['/cesta/je-to-co-vidim-cela-skutecnost/1/', '#jeskyne-pohledy', 'jeskyne'],
  ['/cesta/je-to-co-vidim-cela-skutecnost/3/', '#jeskyne-ven', 'jeskyne-ven'],
  ['/cesta/staci-vedet-co-je-spravne/6/', '#kde-je-stred', 'kde-je-stred'],
  ['/cesta/jsem-porad-tentyz-kdyz-se-menim/4/', '#lod-po-prknech', 'lod'],
  ['/cesta/co-kdyz-prijde-to-nejhorsi/4/', '#maska', 'maska'],
  ['/cesta/kam-mi-mizi-cas/3/', '#presypaci-hodiny', 'presypaci-hodiny'],
  ['/osobnost/protagoras/', '#vitr-dva-lide', 'stejny-vitr'],
  ['/cesta/ci-zivot-vlastne-ziju/6/', '#treti-cara', 'treti-cara'],
];

const prohlizec = await chromium.launch();
for (const [cesta, sel, nazev] of KRESBY) {
  for (const druh of ['zastaveno', 'omezeny']) {
    const ctx = await prohlizec.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: druh === 'omezeny' ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(ZAKLAD + cesta);
    const el = page.locator(sel);
    if ((await el.count()) === 0) { console.log(`${nazev}: prvek ${sel} nenalezen`); await ctx.close(); continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForFunction((s) => !document.querySelector(s)?.closest('astro-island[ssr]'), sel, { timeout: 15000 }).catch(() => {});
    let tlacitko = '';
    if (druh === 'zastaveno') {
      const t = el.getByRole('button', { name: 'Zastavit pohyb' });
      if (await t.count()) { await t.click(); tlacitko = 'zastaveno hned'; } else tlacitko = 'tlačítko Zastavit pohyb chybí';
    } else {
      tlacitko = (await el.getByRole('button', { name: /pohyb/ }).count()) ? 'tlačítko pohybu je i při omezeném pohybu' : 'bez tlačítka';
    }
    await page.waitForTimeout(400);
    const popis = (await el.locator('.kresba__popis').first().textContent().catch(() => ''))?.replace(/\s+/g, ' ').trim();
    await el.screenshot({ path: `${VEN}/${nazev}-${druh}.png` });
    console.log(`${nazev} · ${druh} · ${tlacitko}\n  ${popis?.slice(0, 300)}`);
    await ctx.close();
  }
}
await prohlizec.close();
