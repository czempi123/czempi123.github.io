// Revize interaktivita-v2 (R): osa hlasů na stránkách otázek bez volby, s volbou, se změnou, s „Nikdo z nich“
// a po obnovení; vypíše věty pod osou a štítek v seznamu a vyfotí osu. Tvoje antika s volbou.
// node scripts/revize-osa-hlasu.mjs   (ZAKLAD: náhled na 4323; VEN: složka)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const VEN = process.env.VEN ?? 'Claude outputs/revize-interaktivita-v2';
mkdirSync(VEN, { recursive: true });
const browser = await chromium.launch();
const OTAZKY = [['kdo-vlastne-jsem', 'epikuros'], ['co-je-spravne', 'marcus-aurelius'], ['jsem-svobodny', 'epiktetos']];

async function osa(page) {
  return page.locator('.osa').first();
}

for (const [slug, druha] of OTAZKY) {
  for (const [sirka, rezim] of [[390, 'light'], [1440, 'dark']]) {
    const ctx = await browser.newContext({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.addInitScript((klic) => {
      if (!localStorage.getItem('atlas-denik')) localStorage.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: { [klic]: { preskoceno: true } }, aktivita: [], cesty: {} }));
    }, `otazka-${slug}`);
    await page.goto(`${ZAKLAD}/otazka/${slug}/`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('.volba__moznosti button');
    const o = await osa(page);
    const sekce = page.locator('section', { has: page.locator('.osa') }).first();
    await o.scrollIntoViewIfNeeded();
    await o.screenshot({ path: `${VEN}/osa-${slug}-${sirka}-${rezim}-1-bez.png` });
    const tlacitka = await page.locator('.volba__moznosti button').allTextContents();
    console.log(`\n## ${slug} ${sirka} ${rezim}: tlačítka ${tlacitka.map((t) => t.trim()).join(' | ')}`);
    // první volba: první hlas
    await page.locator('.volba__moznosti button').first().click();
    await page.waitForTimeout(300);
    console.log('  volba 1:', (await page.locator('.volba__vety').innerText()).replace(/\n+/g, ' ¶ '));
    await o.screenshot({ path: `${VEN}/osa-${slug}-${sirka}-${rezim}-2-volba.png` });
    // změna
    await page.locator(`.volba__moznosti button[data-osoba="${druha}"]`).click();
    await page.waitForTimeout(300);
    console.log('  změna:', (await page.locator('.volba__vety').innerText()).replace(/\n+/g, ' ¶ '));
    const stitky = await sekce.locator('[data-nejbliz]:not([hidden])').evaluateAll((els) => els.map((e) => e.closest('[id^="hlas-"]')?.id + ':' + e.textContent.trim()));
    console.log('  štítky:', stitky.join(', '));
    await o.screenshot({ path: `${VEN}/osa-${slug}-${sirka}-${rezim}-3-zmena.png` });
    // obnovení
    await page.reload();
    await page.waitForSelector('.volba__moznosti button');
    await page.waitForTimeout(300);
    console.log('  po obnovení stisknuto:', await page.locator('.volba__moznosti button[aria-pressed="true"]').allTextContents());
    // nikdo
    await page.locator('.volba__moznosti button[data-osoba="nikdo"]').click();
    await page.waitForTimeout(300);
    console.log('  nikdo:', (await page.locator('.volba__vety').innerText()).replace(/\n+/g, ' ¶ '));
    console.log('  štítky po nikdo:', await sekce.locator('[data-nejbliz]:not([hidden])').count());
    await o.screenshot({ path: `${VEN}/osa-${slug}-${sirka}-${rezim}-4-nikdo.png` });
    // klávesnice: Začít znovu → fokus
    await page.getByRole('button', { name: 'Začít znovu' }).focus();
    await page.keyboard.press('Enter');
    console.log('  po Začít znovu fokus na:', await page.evaluate(() => document.activeElement?.textContent?.trim()));
    // zpátky na druhou volbu pro Tvoje antika
    await page.locator(`.volba__moznosti button[data-osoba="${druha}"]`).click();
    if (slug === 'jsem-svobodny' && sirka === 390) {
      await page.goto(`${ZAKLAD}/denik/antika/`);
      await page.waitForTimeout(800);
      const t = page.locator('main');
      const txt = await t.innerText();
      const i = txt.indexOf('nejblíž');
      console.log('\n## Tvoje antika:', txt.slice(Math.max(0, i - 300), i + 400).replace(/\n+/g, ' ¶ '));
      const radek = page.locator(':text("Na stránce otázky je ti nejblíž")').first();
      if (await radek.count()) {
        await radek.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${VEN}/tvoje-antika-390-light.png` });
      }
    }
    await ctx.close();
  }
}
await browser.close();
