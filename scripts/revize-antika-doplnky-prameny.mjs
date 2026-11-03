// Revize antika-doplnky (R): překrývá se po otevření Pramenů poslední odkaz s odkazem v patičce?
// node scripts/revize-antika-doplnky-prameny.mjs /smer/stoicismus/ …  (běžící náhled na 4323)
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 900 } });
for (const cesta of process.argv.slice(2)) {
  await p.goto('http://localhost:4323' + cesta); if (process.env.OTEVRIT) await p.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  const r = await p.evaluate(() => {
    const pat = [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Pro učitele'));
    const box = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.top + scrollY), Math.round(x.bottom + scrollY), Math.round(x.left), Math.round(x.right)]; };
    const det = [...document.querySelectorAll('details')].map((d) => ({ open: d.open, text: d.querySelector('summary')?.textContent.trim().slice(0, 30), box: box(d) }));
    const cele = [...document.querySelectorAll('a')].filter((a) => /Cleanthes|Chrysippus|Romulus|Speusippus|Životy filozofů VI, 85/.test(a.textContent)).map((a) => ({ t: a.textContent.trim().slice(0, 30), box: box(a), vidi: a.checkVisibility(), v: getComputedStyle(a).visibility, rodic: a.closest('details,[hidden],dialog')?.tagName }));
    return { pat: box(pat), det, cele };
  });
  console.log(cesta, JSON.stringify(r));
}
await b.close();
