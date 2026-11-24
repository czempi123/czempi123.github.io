// Revize větve denik-v2 (krok R): deník po třech týdnech se zápisem z cesty o smrti, kartičky po týdnu a po měsíci
// (hledá číslice a slova odpočtu v oddílu), Co ti zůstalo? s chybnou odpovědí, Moje sbírka na obrazovce i v tisku
// a stažený text. Snímky na 390 a 1440 px ve světlém i tmavém režimu do Claude outputs/denik-v2-R/.
// Krok O přidal hlas se jmény po chybné odpovědi, Obraz a otázka s náhledem kresby a kartičku kresby
// (VEN='Claude outputs/denik-v2-O').
// node scripts/revize-denik-v2.mjs   (ZAKLAD: běžící web, výchozí npm run dev na portu 4321)
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const ZAKLAD = process.env.ZAKLAD ?? 'http://localhost:4321';
const VEN = process.env.VEN ?? 'Claude outputs/denik-v2-R';
mkdirSync(VEN, { recursive: true });
const T = '2026-11-02T18:00:00.000Z';
const karta = (zdroj, ref, cast = {}) => ({ [`${zdroj}:${ref}`]: { zdroj, ref, prihradka: 0, pridano: T, kdy: T, ...cast } });
const cesta = (slug, nazev, pocet) => ({ [slug]: { nazev, pocet, krok: pocet, navstivene: Array.from({ length: pocet }, (_, i) => i + 1), kdy: T } });
const zaklad = {
  verze: 1, vyzvy: [], bloky: {}, aktivita: [],
  navstivene: ['/otazka/jak-zit/', '/otazka/jsem-svobodny/', '/otazka/co-je-spravne/', '/otazka/kdo-vlastne-jsem/', '/otazka/ma-zivot-smysl/', '/osobnost/epikuros/'].map((odkaz) => ({ odkaz, nazev: odkaz, kdy: T })),
  cesty: {
    ...cesta('proc-se-bat-smrti', 'Proč se bát smrti?', 9), ...cesta('kolik-je-dost', 'Kolik je dost?', 7),
    ...cesta('co-mam-ve-svych-rukou', 'Co mám ve svých rukou?', 7), ...cesta('co-kdyz-prijde-to-nejhorsi', 'Co když přijde to nejhorší?', 8),
  },
  zapisy: [
    { id: 'cesta8-moje-pravidlo', otazka: 'Je rozumné bát se smrti? A co se strachem, který zbude? Napiš svoje pravidlo.', odpoved: 'Bojím se hlavně o babičku. Když na to myslím, zavolám jí.', odkaz: '/cesta/proc-se-bat-smrti/9/', kdy: T, druh: 'stanovisko' },
    { id: 'cesta33-moje-pravidlo', otazka: 'Kdy ti pomáhá myslet dopředu na to nejhorší, a kdy ne? Napiš svoje pravidlo.', odpoved: 'Před zkouškou ano, v noci ne.', odkaz: '/cesta/co-kdyz-prijde-to-nejhorsi/8/', kdy: T, druh: 'stanovisko' },
  ],
  citaty: [
    { id: 'dl-x-22-den', text: 'Píšu vám v ten šťastný den, který je zároveň posledním dnem mého života.', kde: 'Epikúros, Dopis z posledního dne Diogenés Laertios X, 22', odkaz: '/cesta/proc-se-bat-smrti/1/', kdy: '2026-11-02T18:01:00.000Z', poznamka: 'Jak to mohl napsat?' },
    { id: 'epikuros-dost', text: 'Komu je málo dost, tomu není dost nic.', kde: 'Epikúros, Vatikánské výroky 68', odkaz: '/osobnost/epikuros/', kdy: '2026-11-02T18:02:00.000Z' },
  ],
};
// Tři týdny: obě kartičky ze zápisů ohodnocené jednou (přihrádka 1) 2. 11., dnes 23. 11.
const triTydny = { ...zaklad, karticky: { ...karta('zapis', 'cesta8-moje-pravidlo', { prihradka: 1, naposledy: '2026-11-02' }), ...karta('zapis', 'cesta33-moje-pravidlo', { prihradka: 1, naposledy: '2026-11-02' }) } };
// Dvanáct kartiček v různých přihrádkách, ohodnocené 2. 11.
const POJMY = ['klid', 'slast', 'atom', 'soud', 'stred', 'stesti', 'tyran', 'vedeni', 'pricina', 'protipriklad'];
const mnoho = { ...zaklad, karticky: Object.assign({}, ...POJMY.map((p, i) => karta('pojem', p, { prihradka: (i % 5) + 1, naposledy: '2026-11-02', pridano: `2026-11-01T10:0${i % 10}:00.000Z` })), karta('citat', 'epikuros-dost'), karta('zustalo', 'pojem:klid')) };

const browser = await chromium.launch();
const zprava = [];
async function stranka(sirka, rezim, obsah, cas) {
  const page = await browser.newPage({ viewport: { width: sirka, height: 900 }, colorScheme: rezim, reducedMotion: 'reduce', deviceScaleFactor: sirka > 1000 ? 1 : 2 });
  await page.clock.setFixedTime(new Date(cas));
  await page.addInitScript((t) => { if (!sessionStorage.getItem('pripraveno')) { sessionStorage.setItem('pripraveno', '1'); localStorage.setItem('atlas-denik', t); } }, JSON.stringify(obsah));
  page.on("pageerror", (e) => { console.log("CHYBA", e.message); zprava.push(`CHYBA ${sirka} ${rezim}: ${e.message}`); });
  return page;
}
const skryjLisy = (page) => page.addStyleTag({ content: 'header.hlavicka, nav.lista, .preskocit, a[href="#obsah"] { visibility: hidden !important; } nav.lista { display: none !important; }' });

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark']) {
    // 1. Tři týdny bez varování: zápis z cesty o smrti.
    let page = await stranka(sirka, rezim, triTydny, '2026-11-23T16:00:00');
    await page.goto(`${ZAKLAD}/denik/`);
    try { await page.waitForSelector('section.karticky .karta__lic', { timeout: 60000 }); } catch (e) { await page.screenshot({ path: `${VEN}/chyba.png` }); console.log((await page.locator('main').innerText()).slice(0, 800)); throw e; }
    await page.evaluate(() => document.fonts.ready);
    await skryjLisy(page);
    const k = page.locator('section.karticky');
    await k.screenshot({ path: `${VEN}/tri-tydny-lic-${sirka}-${rezim}.png` });
    if (sirka === 390 && rezim === 'light') zprava.push(`Tři týdny, líc: ${(await k.innerText()).replace(/\s+/g, ' ')}`);
    await k.getByRole('button', { name: 'Otočit' }).click();
    await page.waitForTimeout(200);
    await k.screenshot({ path: `${VEN}/tri-tydny-rub-${sirka}-${rezim}.png` });
    if (sirka === 390 && rezim === 'light') zprava.push(`Tři týdny, rub: ${(await k.innerText()).replace(/\s+/g, ' ')}`);
    await page.close();

    // 2. Po týdnu a po měsíci: v oddílu nesmí být číslice ani slova odpočtu.
    if (rezim === 'light') {
      for (const [nazev, cas] of [['tyden', '2026-11-09T16:00:00'], ['mesic', '2026-12-02T16:00:00']]) {
        page = await stranka(sirka, rezim, mnoho, cas);
        await page.goto(`${ZAKLAD}/denik/`);
        await page.waitForSelector('section.karticky .karta__lic', { timeout: 60000 });
        const s = page.locator('section.karticky');
        const texty = [];
        for (let i = 0; i < 12; i++) {
          const t = (await s.innerText()).replace(/\s+/g, ' ');
          texty.push(t);
          const otoc = s.getByRole('button', { name: 'Otočit' });
          if (await otoc.count()) { await otoc.click(); texty.push((await s.innerText()).replace(/\s+/g, ' ')); await s.getByRole('button', { name: i % 2 ? 'Vím' : 'Zopakuj si', exact: true }).click(); continue; }
          const pet = s.getByRole('button', { name: 'Ještě pět' });
          if (await pet.count()) { await s.screenshot({ path: `${VEN}/${nazev}-stacilo-${sirka}.png` }); await pet.click(); continue; }
          break;
        }
        await s.screenshot({ path: `${VEN}/${nazev}-konec-${sirka}.png` });
        const vse = texty.join(' | ');
        const cisla = [...new Set(vse.match(/.{0,40}\d+.{0,10}/g) ?? [])];
        const odpocet = [...new Set(vse.match(/\b(zbývá|zbyl\w*|čeká\w*|zameškan\w*|série|dní|dnů|dny|týd\w+|naposledy|další za|zítra)\b/giu) ?? [])];
        if (sirka === 390) zprava.push(`${nazev}: číslice ${JSON.stringify(cisla)}, slova ${JSON.stringify(odpocet)}; poslední stav: ${texty.at(-1)}`);
        await page.close();
      }
    }

    // 3. Co ti zůstalo?: první otázka, chybná odpověď, rub.
    page = await stranka(sirka, rezim, zaklad, '2026-11-23T16:00:00');
    await page.goto(`${ZAKLAD}/denik/antika/`);
    await page.waitForSelector('.zustalo__moznost', { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await skryjLisy(page);
    const z = page.locator('.zustalo').first();
    await z.screenshot({ path: `${VEN}/zustalo-otazka-${sirka}-${rezim}.png` });
    // Zvol možnost, která není správná: správnou pozná až rub, a tak zkus první a případně ji vrať přes Začít znovu.
    await page.locator('.zustalo__moznost').first().click();
    await page.waitForTimeout(200);
    await z.screenshot({ path: `${VEN}/zustalo-rub-${sirka}-${rezim}.png` });
    if (sirka === 390 && rezim === 'light') zprava.push(`Co ti zůstalo?, rub: ${(await z.innerText()).replace(/\s+/g, ' ')}`);
    await page.close();

    // 3b (O): hlas s chybnou odpovědí (jména u možností) a obraz s náhledem kresby, před odpovědí i po ní.
    const kolo = { kolo: 1, poradi: ['hlas:jsem-svobodny:aristoteles', 'kresba:DvePulky', 'hlas:ma-zivot-smysl:seneca', 'kresba:Zrcadlo'], pozice: 0, odpovedi: {}, volby: {} };
    page = await stranka(sirka, rezim, { ...zaklad, bloky: { 'co-ti-zustalo/antika': kolo } }, '2026-11-23T16:00:00');
    await page.goto(`${ZAKLAD}/denik/antika/`);
    await page.waitForSelector('.zustalo__moznost', { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await skryjLisy(page);
    const zh = page.locator('.zustalo').first();
    await page.locator('.zustalo__moznost').filter({ hasNotText: /^Může\. Výbušným/ }).first().click();
    await page.waitForTimeout(200);
    await zh.screenshot({ path: `${VEN}/hlas-jmena-${sirka}-${rezim}.png` });
    if (sirka === 390 && rezim === 'light') zprava.push(`Hlas po chybné odpovědi: ${(await zh.innerText()).replace(/\s+/g, ' ')}`);
    await page.getByRole('button', { name: 'Další otázka' }).click();
    await page.waitForSelector('.zustalo__obraz img', { timeout: 20000 });
    await page.waitForFunction(() => [...document.querySelectorAll('.zustalo__obraz img')].every((i) => i.complete && i.naturalWidth > 0));
    await zh.screenshot({ path: `${VEN}/obraz-otazka-${sirka}-${rezim}.png` });
    await page.locator('.zustalo__moznost').first().click();
    await page.waitForTimeout(200);
    await zh.screenshot({ path: `${VEN}/obraz-rub-${sirka}-${rezim}.png` });
    if (sirka === 390 && rezim === 'light') zprava.push(`Obraz a otázka, rub: ${(await zh.innerText()).replace(/\s+/g, ' ')}`);
    await page.close();

    // 3c (O): kartička z kvízu s kresbou, líc.
    page = await stranka(sirka, rezim, { ...zaklad, karticky: karta('zustalo', 'kresba:DvePulky') }, '2026-11-23T16:00:00');
    await page.goto(`${ZAKLAD}/denik/`);
    await page.waitForSelector('section.karticky .karta__obraz img', { timeout: 60000 });
    await page.waitForFunction(() => [...document.querySelectorAll('.karta__obraz img')].every((i) => i.complete && i.naturalWidth > 0));
    await skryjLisy(page);
    await page.locator('section.karticky').screenshot({ path: `${VEN}/karticka-kresba-lic-${sirka}-${rezim}.png` });
    await page.close();

    // 4. Moje sbírka: obrazovka a tisk.
    page = await stranka(sirka, rezim, zaklad, '2026-11-23T16:00:00');
    await page.goto(`${ZAKLAD}/denik/sbirka/`);
    await page.waitForSelector('.vystrizky li', { timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${VEN}/sbirka-${sirka}-${rezim}.png`, fullPage: true });
    if (sirka === 390 && rezim === 'light') {
      const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Stáhnout jako text' }).click()]);
      const cesta = `${VEN}/${dl.suggestedFilename()}`;
      await dl.saveAs(cesta);
      zprava.push(`Stažený text (${dl.suggestedFilename()}):\n${readFileSync(cesta, 'utf8')}`);
      await page.evaluate(() => document.documentElement.setAttribute('data-tisk', 'sbirka'));
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: `${VEN}/sbirka-tisk.pdf`, format: 'A4' }).catch(() => {});
      await page.screenshot({ path: `${VEN}/sbirka-tisk-${sirka}.png`, fullPage: true });
    }
    await page.close();
  }
}
await browser.close();
writeFileSync(`${VEN}/zprava.txt`, `${zprava.join('\n\n')}\n`);
console.log(zprava.join('\n\n'));
