// Revize antiky (P11): hlavičky profilů na telefonu (390 × 844 a 390 × 667 px). Vyfotí první obrazovku profilů
// Seneky, Epiktéta, Aristotela, Sókrata, Marka a Epikúra do Claude outputs/snimky-revize-antiky/ a vypíše počet vstupů.
// node scripts/revize-hlavicky.mjs   (náhled sestaveného webu na portu 4323: npx astro preview --port 4323)
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const out='Claude outputs/snimky-revize-antiky';
for (const [u,n] of [['/osobnost/seneca/','seneca'],['/osobnost/epiktetos/','epiktetos'],['/osobnost/aristoteles/','aristoteles'],['/osobnost/sokrates/','sokrates'],['/osobnost/marcus-aurelius/','marcus'],['/osobnost/epikuros/','epikuros']]) {
  for (const h of [844, 667]) {
  const p = await b.newPage({ viewport: { width: 390, height: h } });
  await p.goto('http://localhost:4323'+u);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/hlavicka-${n}-390x${h}.png` });
  const info = await p.evaluate(() => {
    const prvni = document.querySelector('.uvod p, main p');
    const r = prvni?.getBoundingClientRect();
    const lista = document.querySelector('nav.lista');
    const lr = lista?.getBoundingClientRect();
    const tl = document.querySelectorAll('.vstupy-osoby a').length;
    return { prvniTop: Math.round(r?.top ?? -1), prvniBottom: Math.round(r?.bottom ?? -1), listaTop: Math.round(lr?.top ?? -1), vstupu: tl, vyska: innerHeight };
  });
  console.log(n, h, JSON.stringify(info));
  await p.close();
  }
}
await b.close();
