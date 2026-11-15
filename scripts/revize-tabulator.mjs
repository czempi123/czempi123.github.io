// Revize design-v2 (R): skutečný tabulátor (klávesa Tab, ne focus() ze skriptu) přes celou stránku na dvou výškách okna.
// Hlásí prvek, na který přijde fokus a který zůstane mimo okno, pod pevnou lištou (hlavička, spodní lišta, lišta cesty,
// lišta hodiny) nebo bez viditelného rámečku fokusu (outline i box-shadow nulové).
// node scripts/revize-tabulator.mjs /osobnost/sokrates/ /cesta/kdy-mam-dobry-duvod-verit/5/ …
// Proměnné: ZAKLAD (výchozí http://localhost:4323), OKNA (výchozí „1440x900,1440x640,390x844,390x640“), ULOZISTE.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4323';
const OKNA = (process.env.OKNA ?? '1440x900,1440x640,390x844,390x640').split(',').map((o) => o.split('x').map(Number));
const ULOZISTE = process.env.ULOZISTE ? JSON.parse(readFileSync(process.env.ULOZISTE, 'utf8')) : null;
const prohlizec = await chromium.launch();
let potizi = 0;
for (const cesta of process.argv.slice(2)) {
  for (const [w, h] of OKNA) {
    const page = await prohlizec.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    if (ULOZISTE) await page.addInitScript((z) => { for (const [k, v] of Object.entries(z)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); }, ULOZISTE);
    await page.goto(ZAKLAD + cesta);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const nalezy = [];
    let prvni = null;
    for (let i = 0; i < 400; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(40);
      const v = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const popis = `${el.tagName.toLowerCase()} „${(el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)}“`;
        const klic = el.id || popis + Math.round(r.top + scrollY);
        const lista = [...document.querySelectorAll('header.hlavicka, nav.lista, .cesta-lista, .cesta-hlavicka, [data-hodina-lista], .obsah-lista')]
          .filter((l) => { const s = getComputedStyle(l); return (s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none' && !l.contains(el); })
          .map((l) => ({ l, b: l.getBoundingClientRect() }))
          .find(({ b }) => b.height > 0 && r.top < b.bottom - 2 && r.bottom > b.top + 2 && r.left < b.right && r.right > b.left);
        const s = getComputedStyle(el);
        const ramecek = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 || s.boxShadow !== 'none';
        let chyba = null;
        if (r.width === 0 && r.height === 0) chyba = null;
        else if (r.bottom < 0 || r.top > innerHeight) chyba = 'mimo okno';
        else if (lista && (() => {
          // Zakrytý je jen prvek, jehož střed (nebo střed viditelné části) leží pod lištou: Přeskočit na obsah je nad hlavičkou.
          const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
          const nahore = document.elementFromPoint(x, y);
          return nahore && nahore !== el && !el.contains(nahore) && lista.l.contains(nahore);
        })()) chyba = `pod lištou ${lista.l.className.split(' ')[0] || lista.l.tagName}`;
        else if (!ramecek) chyba = 'bez rámečku fokusu';
        return { klic, popis, chyba };
      });
      if (!v) continue;
      if (prvni === v.klic) break;
      prvni ??= v.klic;
      if (v.chyba) nalezy.push(`${v.chyba}: ${v.popis}`);
    }
    const unik = [...new Set(nalezy)];
    potizi += unik.length;
    console.log(`${w}×${h} ${cesta}: ${unik.length ? unik.slice(0, 8).join(' | ') : 'v pořádku'}`);
    await page.close();
  }
}
await prohlizec.close();
console.log(`Hotovo, potíží: ${potizi}`);
