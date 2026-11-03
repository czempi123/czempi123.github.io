// Strojová kontrola pro revizi: na každé stránce a šířce zkusí všechny ovladatelné prvky a hlásí,
// když prvek po fokusu z klávesnice zůstane pod pevnou lištou, když se dva ovládací prvky překrývají,
// když stránka přetéká do šířky nebo když konzole hlásí chybu.
// node scripts/kontrola-fokus.mjs <cesta> [<cesta> …]
//   node scripts/kontrola-fokus.mjs /osobnost/platon/ /cesta/je-to-co-vidim-cela-skutecnost/1/
// Proměnné: HODINA (adresa stránky hodiny; stránky pak mají lištu hodiny), ZAKLAD (běžící web; výchozí náhled sestaveného webu: npx astro preview --port 4323),
// SIRKY (výchozí „390,1440“).
import { chromium } from '@playwright/test';

const cesty = process.argv.slice(2);
const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const SIRKY = (process.env.SIRKY ?? '390,1440').split(',').map(Number);
const OVLADANI = 'a[href], button, input, textarea, select, summary, [tabindex="0"], [role="radio"], [role="button"]';

const browser = await chromium.launch();
let nalezu = 0;
for (const sirka of SIRKY) {
  for (const cesta of cesty) {
    const page = await browser.newPage({ viewport: { width: sirka, height: sirka < 700 ? 844 : 900 }, reducedMotion: 'reduce' });
    const chyby = [];
    page.on('console', (m) => m.type() === 'error' && chyby.push(m.text()));
    page.on('pageerror', (e) => chyby.push(String(e)));
    // HODINA=<adresa stránky hodiny>: nejdřív ji otevře, aby byla hodina v kartě aktivní a stránka měla lištu hodiny.
    if (process.env.HODINA) { await page.goto(process.env.HODINA.startsWith('http') ? process.env.HODINA : ZAKLAD + process.env.HODINA); await page.waitForTimeout(500); }
    await page.goto(ZAKLAD + cesta);
    await page.evaluate(() => document.fonts.ready);
    // Ostrovy se hydratují, až jsou vidět: projdi stránku shora dolů.
    const vyska = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < vyska; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(40);
    }
    const vysledek = await page.evaluate(async (sel) => {
      const viditelny = (e) => {
        const r = e.getBoundingClientRect();
        const s = getComputedStyle(e);
        // Obsah zavřeného <details> (Prameny) má v Chromiu rozměry, i když není vidět: checkVisibility() ho vyřadí
        // (revize větve antika-doplnky, nález 10).
        return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.disabled && !e.closest('[hidden], [inert]') && e.checkVisibility();
      };
      const popis = (e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''} „${(e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)}“`;
      const pevne = [...document.querySelectorAll('body *')].filter((e) => {
        const p = getComputedStyle(e).position;
        return (p === 'fixed' || p === 'sticky') && viditelny(e);
      });
      const prvky = [...document.querySelectorAll(sel)].filter(viditelny);
      const podListou = [];
      // Základní rozvržení dorovnává prvek nad lištu jen po fokusu z klávesnice (příznak nastaví keydown).
      // Samotné focus() by proto hlásilo planý poplach: ohlásíme stránce klávesu a počkáme na její dorovnání.
      dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      for (const e of prvky) {
        e.focus({ preventScroll: false });
        if (document.activeElement !== e) continue;
        await new Promise((r) => requestAnimationFrame(r));
        await new Promise((r) => requestAnimationFrame(r));
        const r = e.getBoundingClientRect();
        // Odkaz „Přeskočit na obsah“ se při fokusu schválně položí přes hlavičku.
        if (e.classList.contains('preskocit')) continue;
        for (const l of pevne) {
          if (l.contains(e) || e.contains(l)) continue;
          const lr = l.getBoundingClientRect();
          if (getComputedStyle(l).position === 'sticky' && !(lr.top <= 1 || lr.bottom >= innerHeight - 1)) continue;
          const prekryv = Math.min(r.bottom, lr.bottom) - Math.max(r.top, lr.top);
          const sirkaPrekryvu = Math.min(r.right, lr.right) - Math.max(r.left, lr.left);
          if (prekryv > Math.min(8, r.height / 2) && sirkaPrekryvu > 8) podListou.push(`${popis(e)} pod ${l.className || l.tagName}`);
        }
      }
      // Překryvy dvou ovládacích prvků (bez předků a potomků).
      window.scrollTo(0, 0);
      const prekryvy = [];
      const boxy = prvky.map((e) => [e, e.getBoundingClientRect()]);
      for (let i = 0; i < boxy.length; i++) {
        for (let j = i + 1; j < boxy.length; j++) {
          const [a, ra] = boxy[i];
          const [b, rb] = boxy[j];
          if (a.contains(b) || b.contains(a)) continue;
          if (pevne.some((l) => l.contains(a)) !== pevne.some((l) => l.contains(b))) continue;
          const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
          const y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
          if (x > 4 && y > 4) prekryvy.push(`${popis(a)} × ${popis(b)}`);
        }
      }
      const pretoka = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return { pocet: prvky.length, podListou, prekryvy, pretoka };
    }, OVLADANI);
    const potize = [
      ...vysledek.podListou.map((t) => `fokus pod lištou: ${t}`),
      ...vysledek.prekryvy.map((t) => `překryv: ${t}`),
      ...(vysledek.pretoka > 1 ? [`stránka přetéká o ${vysledek.pretoka} px`] : []),
      ...chyby.map((t) => `konzole: ${t}`),
    ];
    nalezu += potize.length;
    console.log(`${sirka} px ${cesta}: ${vysledek.pocet} prvků, ${potize.length ? potize.length + ' potíží' : 'v pořádku'}`);
    for (const p of potize) console.log('  ' + p);
    await page.close();
  }
}
await browser.close();
process.exit(nalezu ? 1 : 0);
