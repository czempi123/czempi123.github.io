// Tři kresby, kterými student sám hýbe: „Stejný vítr“ (profil Prótagora), „Roztrhni kartu“ (cesta 5, krok 3)
// a „Kdy je dost?“ (cesta 6, krok 3). Obě šířky ve světlém i tmavém režimu s axe, bez vodorovného posouvání,
// průchod stavy se snímky, klávesnice, pohyb a jeho zastavení.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VITR = { cesta: '/osobnost/protagoras/', id: 'vitr-dva-lide' };
const PULKY = { cesta: '/cesta/co-mam-ve-svych-rukou/3/', id: 'dve-pulky-karta' };
const POHAR = { cesta: '/cesta/kolik-je-dost/3/', id: 'kolik-je-dost-pohar' };
const SIRKY = [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }];
const REZIMY = ['light', 'dark'] as const;
const LISTY = 'header.hlavicka, nav.lista, .cesta-lista, .cesta-hlavicka, .obsah-lista { visibility: hidden !important; }';

async function priprav(page: Page, kde: { cesta: string; id: string }) {
  await page.goto(kde.cesta);
  await page.evaluate(() => document.fonts.ready);
  const kresba = page.locator(`#${kde.id}`);
  await kresba.scrollIntoViewIfNeeded();
  // Ostrov kresby se hydratuje, až je vidět.
  await page.waitForFunction((id) => {
    const ostrov = document.getElementById(id)?.closest('astro-island');
    return !!ostrov && !ostrov.hasAttribute('ssr');
  }, kde.id);
  return kresba;
}

async function bezNalezu(page: Page, id: string) {
  const axe = await new AxeBuilder({ page }).include(`#${id}`).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

/** Popisky v kresbě se nepřekrývají a leží celé v plátně. */
async function popiskyVolne(kresba: Locator) {
  const mimo = await kresba.locator('svg.kresba__platno').evaluate((svg) => {
    const platno = svg.getBoundingClientRect();
    const r = [...svg.querySelectorAll('text')].filter((t) => getComputedStyle(t).opacity !== '0' && t.textContent).map((t) => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    const chyby: string[] = [];
    r.forEach((a, i) => {
      if (a.b.left < platno.left || a.b.right > platno.right || a.b.top < platno.top || a.b.bottom > platno.bottom) chyby.push(`mimo plátno: ${a.t}`);
      for (const b of r.slice(i + 1)) {
        if (a.b.left < b.b.right && b.b.left < a.b.right && a.b.top < b.b.bottom && b.b.top < a.b.bottom) chyby.push(`${a.t} × ${b.t}`);
      }
    });
    return chyby;
  });
  expect(mimo).toEqual([]);
}

const cile = (kresba: Locator, selektor: string) => kresba.locator(selektor).evaluateAll((s) => s.map((x) => x.getBoundingClientRect().height));
const posunY = (kde: Locator) => kde.evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m42);
const pruhlednost = (kde: Locator) => kde.evaluate((e) => getComputedStyle(e).opacity);
const jmeno = (rezim: string) => (rezim === 'light' ? 'svetly' : 'tmavy');

for (const { sirka, vyska } of SIRKY) {
  for (const rezim of REZIMY) {
    const r = jmeno(rezim);

    test(`stejný vítr · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page, VITR);
      await page.addStyleTag({ content: LISTY });

      // Jeden pohled: rám přepínač nemá. Při omezeném pohybu vítr stojí a tlačítko pohybu chybí.
      await expect(kresba.getByRole('img', { name: 'Stejný vítr' })).toBeVisible();
      await expect(kresba).not.toHaveClass(/kresba--pohyb/);
      await expect(kresba.getByRole('button')).toHaveCount(0);
      await expect(kresba.getByRole('radiogroup')).toHaveCount(2);
      for (const v of await cile(kresba, '.k-prepinac span')) expect(v).toBeGreaterThanOrEqual(44);

      // Platónův případ: jednomu je zima, druhému ne.
      const ty = kresba.getByRole('radiogroup', { name: 'Ty', exact: true });
      const kamarad = kresba.getByRole('radiogroup', { name: 'Kamarád' });
      await expect(ty.getByRole('radio', { name: 'čekání' })).toBeChecked();
      await expect(kamarad.getByRole('radio', { name: 'chůze' })).toBeChecked();
      await expect(kresba.locator('.rec')).toHaveText(['„Je mi zima.“', '„Není mi zima.“']);
      await expect(kresba.locator('.kresba__popis')).toHaveText(/^Tobě je po čekání na místě zima\..*Vítr fouká na oba stejně\.$/);
      const vitr = () => kresba.locator('.proud').evaluateAll((p) => p.map((x) => x.getAttribute('d')));
      const predtim = await vitr();
      expect(predtim).toHaveLength(4);
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/vitr-ruzne-${sirka}-${r}.png` });

      // Kamarád taky čekal: zima je oběma, vítr je tentýž.
      await kamarad.getByRole('radio', { name: 'čekání' }).check({ force: true });
      await expect(kresba.locator('.rec')).toHaveText(['„Je mi zima.“', '„Je mi zima.“']);
      await expect(kresba.locator('.kresba__popis')).toHaveText('Oba jste čekali na místě a oběma je zima. Vítr se přitom nezměnil.');
      await expect(kresba.locator('.poza-zima.je')).toHaveCount(2);
      expect(await vitr()).toEqual(predtim);
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/vitr-oba-zima-${sirka}-${r}.png` });

      // Oba po chůzi: zima není nikomu.
      await ty.getByRole('radio', { name: 'chůze' }).check({ force: true });
      await kamarad.getByRole('radio', { name: 'chůze' }).check({ force: true });
      await expect(kresba.locator('.rec')).toHaveText(['„Není mi zima.“', '„Není mi zima.“']);
      await expect(kresba.locator('.kresba__popis')).toContainText('zima není ani jednomu');
      await expect(kresba.locator('.poza-teplo.je')).toHaveCount(2);
      expect(await vitr()).toEqual(predtim);
      await kresba.screenshot({ path: `test-results/snimky/vitr-oba-teplo-${sirka}-${r}.png` });

      await bezNalezu(page, VITR.id);
    });

    test(`dvě půlky · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page, PULKY);
      await page.addStyleTag({ content: LISTY });
      const popis = kresba.locator('.kresba__popis');
      const leva = kresba.locator('.pulka-leva .veta');
      const prava = kresba.locator('.pulka-prava .veta');
      /** Věty i štítky leží celé na své půlce. */
      const naPulce = () => kresba.locator('.pulka').evaluateAll((pulky) => pulky.flatMap((p) => {
        const list = p.querySelector('.list')!.getBoundingClientRect();
        return [...p.querySelectorAll('text')].filter((t) => { const b = t.getBoundingClientRect(); return b.left < list.left + 2 || b.right > list.right - 2 || b.top < list.top || b.bottom > list.bottom; }).map((t) => t.textContent);
      }));

      // Karta je celá: přepínač karet, jedno tlačítko, štítky půlek zatím nejsou vidět. Nic neběží samo.
      const karty = kresba.getByRole('radiogroup', { name: 'Roztrhni kartu' });
      await expect(karty.getByRole('radio')).toHaveCount(3);
      await expect(karty.getByRole('radio', { name: 'Zpráva' })).toBeChecked();
      await expect(kresba.getByRole('button')).toHaveText(['Roztrhnout kartu']);
      await expect(popis).toHaveText(/^Pohádali jste se.*Je obojí ve tvých rukou\?$/);
      await expect(leva).toHaveText(['Napíšu mu,', 'že mě to mrzí.']);
      expect(await pruhlednost(kresba.locator('.stitek').first())).toBe('0');
      for (const v of await cile(kresba, '.k-prepinac span')) expect(v).toBeGreaterThanOrEqual(44);
      await kresba.screenshot({ path: `test-results/snimky/pulky-cela-${sirka}-${r}.png` });

      // Roztržení: půlky se rozejdou, vpravo se dá volit, co se stane. Levá věta zůstává.
      await kresba.getByRole('button', { name: 'Roztrhnout kartu' }).click();
      const okolnosti = kresba.getByRole('radiogroup', { name: 'Co se stane na druhé půlce' });
      await expect(okolnosti.getByRole('radio', { name: 'Odepíše' })).toBeChecked();
      await expect(kresba.getByRole('button')).toHaveCount(0);
      await expect(kresba.locator('.stitek')).toHaveText(['moje půlka', 'jeho půlka']);
      await expect.poll(() => pruhlednost(kresba.locator('.stitek').first())).toBe('1');
      expect(await kresba.locator('.pulka-leva').evaluate((e) => getComputedStyle(e).transform)).not.toBe('none');
      await expect(popis).toHaveText('Kamarád odepíše, že je to dobré. To je jeho půlka. Tvoje byla ta zpráva.');
      expect(await naPulce()).toEqual([]);
      await kresba.screenshot({ path: `test-results/snimky/pulky-roztrzena-${sirka}-${r}.png` });

      await okolnosti.getByRole('radio', { name: 'Odsekne' }).check({ force: true });
      await expect(prava).toHaveText(['Napíše,', 'ať mu dám pokoj.']);
      await expect(leva).toHaveText(['Napíšu mu,', 'že mě to mrzí.']);
      await expect(popis).toContainText('Jeho půlka se změnila, tvoje ne');
      expect(await naPulce()).toEqual([]);
      await kresba.screenshot({ path: `test-results/snimky/pulky-odsekne-${sirka}-${r}.png` });

      // Další karty: každá začíná celá; co už je roztržené, zůstane. Všechny věty se na půlky vejdou.
      for (const [nazev, moje, volby] of [
        ['Známka', ['Připravím se,', 'jak nejlíp umím.'], ['Sednou', 'Zaskočí', 'Odloží']],
        ['Zápas', ['Budu spát,', 'jíst a trénovat.'], ['Forma', 'Chřipka', 'Soupeř']],
      ] as const) {
        await karty.getByRole('radio', { name: nazev }).check({ force: true });
        await expect(kresba.getByRole('button')).toHaveText(['Roztrhnout kartu']);
        await expect(popis).toContainText('Je obojí ve tvých rukou?');
        await kresba.getByRole('button', { name: 'Roztrhnout kartu' }).click();
        for (const volba of volby) {
          await kresba.getByRole('radio', { name: volba }).check({ force: true });
          await expect(leva).toHaveText([...moje]);
          expect(await naPulce(), `${nazev} · ${volba}`).toEqual([]);
        }
        await expect(popis).toContainText(/[Tt]voje půlka se nezměnila/);
      }
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/pulky-zapas-${sirka}-${r}.png` });
      await karty.getByRole('radio', { name: 'Zpráva' }).check({ force: true });
      await expect(kresba.getByRole('radio', { name: 'Odsekne' })).toBeChecked();
      await expect(prava).toHaveText(['Napíše,', 'ať mu dám pokoj.']);

      await bezNalezu(page, PULKY.id);
    });

    test(`kdy je dost · ${sirka} px · ${r}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const kresba = await priprav(page, POHAR);
      await page.addStyleTag({ content: LISTY });
      const popis = kresba.locator('.kresba__popis');
      const voda = kresba.locator('.voda');
      const dolit = kresba.getByRole('button', { name: 'Dolít vodu' });

      // Prázdný pohár: jedno tlačítko, žádný přepínač. Hladina je na dně a k čáře chybí všechno.
      await expect(kresba.getByRole('img', { name: 'Kdy je dost?' })).toBeVisible();
      await expect(kresba.getByRole('radiogroup')).toHaveCount(0);
      await expect(kresba.getByRole('button')).toHaveText(['Dolít vodu']);
      // Text pod kresbou má za jednopísmennou spojkou nezlomitelnou mezeru (doplňuje rám kresby): ve vzoru proto \s.
      await expect(popis).toHaveText(/^Máš žízeň a\spohár je prázdný\./);
      // Přechody mají při omezeném pohybu 0,01 ms a projeví se až s dalším snímkem prohlížeče: polohu čteme přes poll.
      await expect.poll(() => posunY(voda)).toBe(201);
      expect(await pruhlednost(kresba.locator('.chybi'))).toBe('1');
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/pohar-prazdny-${sirka}-${r}.png` });

      // Dvě dolití: hladina stoupá, ale k čáře pořád něco chybí. Proud se při omezeném pohybu neukáže.
      await dolit.click();
      await expect(popis).toHaveText(/^První doušky\./);
      await dolit.click();
      await expect(popis).toHaveText(/^Žízeň slábne\./);
      await expect.poll(() => posunY(voda)).toBeCloseTo(121.67, 1);
      expect(await kresba.locator('.proud').evaluate((e) => getComputedStyle(e).animationName)).toBe('none');
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/pohar-napul-${sirka}-${r}.png` });

      // Třetí dolití: dost. Hladina je u čáry, nic nechybí a přibudou dvě tlačítka.
      await dolit.click();
      await expect(popis).toHaveText(/^Dost\. Žízeň je pryč/);
      await expect.poll(() => posunY(voda)).toBe(82);
      await expect.poll(() => pruhlednost(kresba.locator('.chybi'))).toBe('0');
      await expect(kresba.getByRole('button')).toHaveText(['Dolít vodu', 'Přidat mátu', 'Od začátku']);
      await kresba.screenshot({ path: `test-results/snimky/pohar-dost-${sirka}-${r}.png` });

      // Další voda hladinu nezvedne.
      await dolit.click();
      await expect(popis).toContainText('hladina se nehne');
      await expect.poll(() => posunY(voda)).toBe(82);

      // Máta změní vodu, ne hladinu. Tlačítka drží stejnou stavbu.
      const radky = () => kresba.getByRole('button').evaluateAll((t) => t.map((x) => Math.round(x.getBoundingClientRect().top)));
      await page.mouse.move(0, 0);
      await page.waitForTimeout(50);
      const stavba = await radky();
      await kresba.getByRole('button', { name: 'Přidat mátu' }).click();
      await expect(popis).toContainText('chutná jinak');
      await expect(kresba.locator('svg text').last()).toHaveText('voda s mátou');
      await expect.poll(() => pruhlednost(kresba.locator('.mata'))).toBe('1');
      await expect.poll(() => posunY(voda)).toBe(82);
      await expect(kresba.getByRole('button')).toHaveText(['Dolít vodu', 'Vyndat mátu', 'Od začátku']);
      // Tlačítko pod ukazatelem se po najetí zvedne o 1 px (vrstvy stínu, K4a): stavbu měříme s ukazatelem jinde.
      await page.mouse.move(0, 0);
      await expect.poll(radky).toEqual(stavba);
      await popiskyVolne(kresba);
      await kresba.screenshot({ path: `test-results/snimky/pohar-mata-${sirka}-${r}.png` });
      await kresba.getByRole('button', { name: 'Vyndat mátu' }).click();
      await expect(popis).toHaveText('Zase čistá voda. Hladina je pořád u čáry.');

      // Od začátku: zase žízeň a jedno tlačítko.
      await kresba.getByRole('button', { name: 'Od začátku' }).click();
      await expect(popis).toHaveText(/^Máš žízeň/);
      await expect(kresba.getByRole('button')).toHaveText(['Dolít vodu']);
      await expect.poll(() => posunY(voda)).toBe(201);

      await bezNalezu(page, POHAR.id);
    });
  }
}

test('stejný vítr: vítr běží a jde zastavit; lidé se mění jen klávesnicí a vítr při tom nepřestane', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page, VITR);
  const stav = (selektor: string) => kresba.locator(selektor).first().evaluate((e) => getComputedStyle(e).animationPlayState);
  const posun = () => kresba.locator('.proud').first().evaluate((e) => parseFloat(getComputedStyle(e).strokeDashoffset));

  await expect(kresba).toHaveClass(/kresba--pohyb/);
  expect(await stav('.proud')).toBe('running');
  const a = await posun();
  await page.waitForTimeout(400);
  expect(await posun()).not.toBe(a);

  // Šipkou změním, co mám za sebou. Póza se změní, vítr běží dál.
  await kresba.getByRole('radiogroup', { name: 'Ty', exact: true }).getByRole('radio', { name: 'čekání' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radiogroup', { name: 'Ty', exact: true }).getByRole('radio', { name: 'chůze' })).toBeChecked();
  await expect(kresba.locator('.kresba__popis')).toContainText('zima není ani jednomu');
  expect(await stav('.proud')).toBe('running');
  // Každý člověk je jedna zastávka tabulátoru; za nimi je tlačítko pohybu.
  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('radiogroup', { name: 'Kamarád' }).getByRole('radio', { name: 'chůze' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(kresba.locator('.kresba__popis')).toHaveText(/^Tebe zahřála chůze a\szima ti není\. Kamarádovi je po čekání na místě zima\./);
  await page.keyboard.press('Tab');
  const tlacitko = kresba.getByRole('button', { name: 'Zastavit pohyb' });
  await expect(tlacitko).toBeFocused();
  // Prvek s fokusem neleží pod žádnou pevnou lištou (stránka k němu dojede plynule, proto poll).
  await expect.poll(() => tlacitko.evaluate((e) => { const b = e.getBoundingClientRect(); return e.contains(document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)); })).toBe(true);
  expect(await tlacitko.evaluate((e) => e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(await page.locator('nav.lista').evaluate((e) => e.getBoundingClientRect().top));

  // Zastavit: vítr i šály zůstanou stát.
  await page.keyboard.press('Enter');
  await expect(kresba.getByRole('button', { name: 'Pustit pohyb' })).toBeFocused();
  expect(await stav('.proud')).toBe('paused');
  expect(await stav('.sala')).toBe('paused');
  await page.waitForTimeout(150);
  const b = await posun();
  await page.waitForTimeout(400);
  expect(await posun()).toBe(b);
  await page.keyboard.press('Space');
  expect(await stav('.proud')).toBe('running');

  // Kresba stojí za blokem s vlastním pokusem a nic neukládá.
  const kapitola = page.locator('#meritko');
  expect(await kapitola.evaluate((k) => !!(k.querySelector('#protagoras-vitr')!.compareDocumentPosition(k.querySelector('#vitr-dva-lide')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(kapitola).toContainText('Když je zima vám oběma, víte už, jaký je vítr sám?');
  await expect(kresba).not.toHaveClass(/\bblok\b/);
});

test('dvě půlky: celé jen klávesnicí; kresba stojí pod blokem a blok k ní vede', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page, PULKY);
  const lista = () => page.locator('.cesta-lista').evaluate((e) => e.getBoundingClientRect().top);
  const dole = () => page.evaluate(() => document.activeElement!.getBoundingClientRect().bottom);

  // Nic tu neběží samo: tlačítko pohybu chybí i tam, kde se kresby smějí hýbat.
  await expect(kresba.getByRole('button')).toHaveText(['Roztrhnout kartu']);

  // Šipkou na druhou kartu, tabulátorem na tlačítko, Enter roztrhne a fokus přejde na první volbu.
  await kresba.getByRole('radio', { name: 'Zpráva' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Známka' })).toBeChecked();
  await expect(kresba.locator('svg text').first()).toHaveText('Známka ze čtvrtletky');
  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('button', { name: 'Roztrhnout kartu' })).toBeFocused();
  await expect.poll(async () => (await dole()) <= (await lista())).toBe(true);
  await page.keyboard.press('Enter');
  await expect(kresba.getByRole('radio', { name: 'Sednou' })).toBeFocused();
  await expect(kresba.locator('.kresba__popis')).toHaveText('Otázky ti sednou. Vybral je ale učitel, to je jeho půlka. Tvoje byla příprava.');
  await page.keyboard.press('ArrowRight');
  await expect(kresba.getByRole('radio', { name: 'Zaskočí' })).toBeChecked();
  await expect(kresba.locator('.pulka-prava .veta')).toHaveText(['Otázky', 'mě zaskočí.']);
  await expect(kresba.locator('.pulka-leva .veta')).toHaveText(['Připravím se,', 'jak nejlíp umím.']);
  await expect.poll(async () => (await dole()) <= (await lista())).toBe(true);
  // Po přechodu jsou půlky od sebe.
  await expect.poll(() => kresba.locator('.pulka-prava').evaluate((e) => new DOMMatrixReadOnly(getComputedStyle(e).transform).m41)).toBeGreaterThan(5);

  // Krok: nejdřív vlastní pokus v bloku, kresba až pod ním; text kolem neradí, co si má student přát.
  const obsah = page.locator('.krok__obsah');
  expect(await obsah.evaluate((o) => !!(o.querySelector('#cesta5-dve-pulky')!.compareDocumentPosition(o.querySelector('#dve-pulky-karta')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(obsah.getByRole('heading', { name: 'Co se stane s druhou půlkou' })).toBeVisible();
  await expect(obsah.locator('.ctenarsky').last()).toContainText('Která půlka se pokaždé změnila? A která ti zůstala v ruce?');
  await expect(kresba).not.toHaveClass(/\bblok\b/);
});

test('kdy je dost: dolévání klávesnicí, proud jen při dolití; kresba stojí před volbou o bundě', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const kresba = await priprav(page, POHAR);
  const voda = kresba.locator('.voda');

  // Nic neběží samo: žádné tlačítko pohybu, proud zatím není.
  await expect(kresba).toHaveClass(/kresba--pohyb/);
  await expect(kresba.getByRole('button')).toHaveText(['Dolít vodu']);
  await expect(kresba.locator('.proud')).toHaveCount(0);

  const dolit = kresba.getByRole('button', { name: 'Dolít vodu' });
  await dolit.focus();
  await page.keyboard.press('Enter');
  // Proud je jednorázový děj; hladina dojede přechodem.
  expect(await kresba.locator('.proud').evaluate((e) => getComputedStyle(e).animationName)).not.toBe('none');
  await expect.poll(() => posunY(voda)).toBeCloseTo(161.33, 1);
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await expect.poll(() => posunY(voda)).toBe(82);
  await expect(kresba.locator('.kresba__popis')).toHaveText(/^Dost\./);
  // Tlačítko s fokusem nezůstane pod pevnou lištou kroku.
  const dole = await dolit.evaluate((e) => e.getBoundingClientRect().bottom);
  expect(dole).toBeLessThanOrEqual(await page.locator('.cesta-lista').evaluate((e) => e.getBoundingClientRect().top));

  await page.keyboard.press('Tab');
  await expect(kresba.getByRole('button', { name: 'Přidat mátu' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(kresba.getByRole('button', { name: 'Vyndat mátu' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  // Od začátku: fokus se vrátí na dolévání.
  await expect(dolit).toBeFocused();
  await expect(kresba.locator('.kresba__popis')).toHaveText(/^Máš žízeň/);
  await expect.poll(() => posunY(voda)).toBe(201);

  // Krok: kresba je obraz k textu o stropu slasti a stojí před volbou; volba o bundě zůstala.
  const obsah = page.locator('.krok__obsah');
  await expect(obsah).toContainText('Zkus to na žízni.');
  expect(await obsah.evaluate((o) => !!(o.querySelector('#kolik-je-dost-pohar')!.compareDocumentPosition(o.querySelector('#cesta6-bunda')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(kresba).not.toHaveClass(/\bblok\b/);
});
