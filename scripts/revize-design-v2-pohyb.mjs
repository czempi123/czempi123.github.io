// Revize design-v2 (R): co se na stránce hýbe bez činu studenta a co zbude při omezeném pohybu.
// Pro každou stránku: (1) pohyb povolený: animace při příchodu, pak animace, které začnou jen posouváním stránky
// (to pravidla pohybu zakazují; kresby s pohybem v sobě jsou výjimka); (2) omezený pohyb: animace delší než 1 ms.
// node scripts/revize-design-v2-pohyb.mjs /osobnost/sokrates/ /mapa/ …   (ZAKLAD: výchozí http://localhost:4323)
import { chromium } from '@playwright/test';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const popis = () => document.getAnimations().map((a) => {
  const t = a.effect?.target;
  const el = t ? `${t.tagName.toLowerCase()}${t.id ? '#' + t.id : ''}${t.classList?.length ? '.' + [...t.classList].slice(0, 2).join('.') : ''}` : '?';
  const tim = a.effect?.getTiming?.() ?? {};
  return { el, jmeno: a.animationName ?? a.transitionProperty ?? a.constructor.name, trvani: Number(tim.duration) || 0, opakovani: tim.iterations, stav: a.playState };
}).filter((a) => a.trvani > 1);
const prohlizec = await chromium.launch();
for (const cesta of process.argv.slice(2)) {
  for (const omezeny of [false, true]) {
    const ctx = await prohlizec.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: omezeny ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(ZAKLAD + cesta);
    await page.waitForTimeout(150);
    const prichod = await page.evaluate(popis);
    await page.waitForTimeout(1500);
    const vyska = await page.evaluate(() => document.documentElement.scrollHeight);
    const pri = new Set();
    for (let y = 0; y < vyska; y += 600) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
      await page.waitForTimeout(120);
      for (const a of await page.evaluate(popis)) if (a.stav === 'running') pri.add(`${a.el} ${a.jmeno} ${a.trvani}ms ×${a.opakovani}`);
    }
    const p = prichod.map((a) => `${a.el} ${a.jmeno} ${a.trvani}ms ×${a.opakovani}`);
    console.log(`${cesta} ${omezeny ? 'OMEZENÝ' : 'pohyb'}: příchod ${p.length}${p.length ? ' [' + [...new Set(p)].slice(0, 6).join(' | ') + ']' : ''}; při posouvání ${pri.size}${pri.size ? ' [' + [...pri].slice(0, 6).join(' | ') + ']' : ''}`);
    await ctx.close();
  }
}
await prohlizec.close();
