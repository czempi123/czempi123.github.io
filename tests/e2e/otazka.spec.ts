// Stránky velkých otázek 7 a 1: první názor → hlasy na časové ose → cesty → Změnil se?
// Klávesnicí, po obnovení, s přeskočením a bez JavaScriptu; snímky na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ADRESA = '/otazka/jak-poznam-pravdu/';
const PO = '#jak-poznam-pravdu-po';

async function hydratovano(page: Page, jmeno: string) {
  await page.waitForSelector(`astro-island[component-url*="${jmeno}"]:not([ssr])`, { state: 'attached' });
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

test('otázka: první názor klávesnicí, hlasy v pořadí, návrat na konci a deník', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ADRESA);
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator('h1')).toHaveText('Jak poznám, co je pravda?');
  // Filozofové jsou skrytí, dokud student neodpoví.
  await expect(page.locator(PO)).toBeHidden();
  const ulozit = page.getByRole('button', { name: 'Uložit a ukázat filozofy' });
  await expect(ulozit).toBeDisabled();

  await page.locator('#jak-poznam-pravdu-prvni-pole').focus();
  await page.keyboard.type('Když si to můžu ověřit sám.');
  await page.keyboard.press('Tab');
  await expect(ulozit).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.locator(PO)).toBeVisible();
  await expect(page.locator('#jak-poznam-pravdu-hlasy-nadpis')).toBeFocused();
  await expect(page.locator('#jak-poznam-pravdu-hlasy-nadpis')).toHaveText('Komu věřit?');
  // Nejdřív odpovědi všech na tentýž případ, pak rozvinutí na časové ose.
  await expect(page.locator('.odpoved__jmeno')).toHaveText(['Parmenidés', 'Prótagorás', 'Sókratés', 'Aristotelés', 'Epikúros']);
  await expect(page.locator('.oddil__nad').first()).toHaveText('Tentýž případ, pět odpovědí');
  await expect(page.locator('.odpoved').first()).toContainText('Ani babičce, ani učitelce.');
  // Epikúros přibyl s profilem: rozhodují smysly, ne rozum ani zvyk.
  await expect(page.locator('.odpoved').last()).toContainText('O pravdě rozhodují smysly');
  await page.keyboard.press('Tab');
  await expect(page.locator('.odpoved__odkaz').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#hlas-parmenides$/);
  await expect(page.locator('#hlas-parmenides')).toBeInViewport();
  await expect(page.locator('.hlas__jmeno')).toHaveText(['Parmenidés', 'Prótagorás', 'Sókratés', 'Aristotelés', 'Epikúros']);
  await expect(page.locator('#hlas-protagoras')).toContainText('jako lékař');
  await expect(page.locator('#hlas-epikuros')).toContainText('Rozum podle něj žádný vjem vyvrátit nemůže, protože sám na vjemech závisí.');
  // Odkaz na profil jen tam, kde profil je.
  await expect(page.locator('.hlas__jmeno a')).toHaveText(['Parmenidés', 'Prótagorás', 'Sókratés', 'Aristotelés', 'Epikúros']);
  // Epikúrova věta je výklad bez citátu.
  await expect(page.locator('.hlas .citat')).toHaveCount(4);
  await expect(page.locator('#hlas-epikuros .citat')).toHaveCount(0);
  await expect(page.locator('.cesta-karta')).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/');

  // Změnil se?
  const zmenil = page.locator('#zmenil-se');
  await zmenil.scrollIntoViewIfNeeded();
  await hydratovano(page, 'ZmenilSe');
  await expect(zmenil).toContainText('Když si to můžu ověřit sám.');
  await zmenil.locator('textarea').fill('Když tvrzení obstojí, i když se na něj ptám dál.');
  await zmenil.getByRole('button', { name: 'Uložit do deníku' }).click();
  const srovnani = zmenil.getByRole('region', { name: 'Na začátku a teď' });
  await expect(srovnani).toBeFocused();
  await expect(srovnani).toContainText('Na začátku');
  await expect(srovnani).toContainText('obstojí');

  // Po obnovení je vše otevřené a uložené.
  await page.reload();
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator(PO)).toBeVisible();
  await expect(page.locator('#jak-poznam-pravdu-prvni-pole')).toHaveValue('Když si to můžu ověřit sám.');
  await expect(page.locator('#jak-poznam-pravdu-prvni-pole')).toBeDisabled();

  await page.goto('/denik/');
  await expect(page.getByText('Když si to můžu ověřit sám.')).toBeVisible();
  await expect(page.getByText('Když tvrzení obstojí, i když se na něj ptám dál.')).toBeVisible();
});

test('otázka: Přeskočit ukáže filozofy bez zápisu a návrat se zeptá bez první odpovědi', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(ADRESA);
  await hydratovano(page, 'PrvniNazor');
  await page.getByRole('button', { name: 'Přeskočit' }).click();
  await expect(page.locator(PO)).toBeVisible();
  await page.locator('#zmenil-se').scrollIntoViewIfNeeded();
  await hydratovano(page, 'ZmenilSe');
  await expect(page.locator('#zmenil-se')).toContainText('Na začátku jsi neodpověděl.');
  // První názor jde dopsat i potom; tlačítko už jen ukládá.
  await page.locator('#jak-poznam-pravdu-prvni-pole').fill('Pozdě, ale přece.');
  await page.getByRole('button', { name: 'Uložit do deníku' }).first().click();
  await expect(page.locator('#zmenil-se')).toContainText('Pozdě, ale přece.');
});

test('otázka: bez JavaScriptu jsou hlasy vidět hned', async ({ browser }) => {
  const kontext = await browser.newContext({ javaScriptEnabled: false });
  const page = await kontext.newPage();
  await page.goto(ADRESA);
  await expect(page.locator(PO)).toBeVisible();
  await expect(page.locator('.hlas')).toHaveCount(5);
  await kontext.close();
});

test('přehled otázek vede na stránky otázek 7 a 1, ostatní zůstávají v přehledu', async ({ page }) => {
  await page.goto('/otazky/');
  await page.getByRole('link', { name: 'Jak poznám, co je pravda?' }).click();
  await expect(page).toHaveURL(ADRESA);
  await page.goto('/otazky/');
  await page.getByRole('link', { name: 'Jak mám žít?' }).click();
  await expect(page).toHaveURL('/otazka/jak-zit/');
  await page.goto('/otazky/');
  await expect(page.locator('#co-je-spravne a')).toHaveCount(0);
});

test('otázka 1: úvodní případ, pět hlasů, které se poznají, a cesty 4, 6, 7 a 34', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/jak-zit/');
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator('h1')).toHaveText('Jak mám žít?');
  // Úvod je vymyšlená situace bez historických osob a končí otázkami.
  const uvod = page.locator('.uvod');
  await expect(uvod).toContainText('Představ si, že máš na léto dvě nabídky.');
  await expect(uvod).not.toContainText(/Epikúr|Diogen|Senec|Aristotel/);
  await expect(uvod.locator('p').last()).toContainText('?');
  // Nejdřív student: hlasy se ukážou až po prvním názoru.
  await expect(page.locator('#jak-zit-po')).toBeHidden();
  await page.locator('#jak-zit-prvni-pole').focus();
  await page.keyboard.type('Vzal bych tábor, peníze počkají.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#jak-zit-hlasy-nadpis')).toBeFocused();
  await expect(page.locator('#jak-zit-hlasy-nadpis')).toHaveText('Sklad, nebo tábor?');
  await expect(page.locator('.oddil__nad').first()).toHaveText('Tentýž případ, pět odpovědí');
  // Pořadí podle narození.
  await expect(page.locator('.odpoved__jmeno')).toHaveText(['Diogenés', 'Aristotelés', 'Epikúros', 'Hipparchia', 'Seneca']);
  const odpovedi = page.locator('.odpoved');
  // Každý hlas se pozná: zpochybněná volba, činnost a nástroje, klid a přátelé, kdo komu slouží.
  await expect(odpovedi.nth(0)).toContainText('Ptáš se špatně');
  await expect(odpovedi.nth(1)).toContainText('štěstí je činnost, ne pocit');
  await expect(odpovedi.nth(1)).toContainText('taky, ale jako nástroj');
  await expect(odpovedi.nth(2)).toContainText('Zbytek léta stráv s přáteli');
  // Hipparchia mluví o tom, kdo o čase rozhoduje, ne že ho má mít student „pro sebe“.
  await expect(odpovedi.nth(3)).toContainText('kdo určil, kam má tvůj čas patřit');
  await expect(odpovedi.nth(3)).not.toContainText(/pro sebe|sobě/);
  await expect(odpovedi.nth(4)).toContainText('kdo komu slouží');
  for (let i = 0; i < 5; i++) {
    const vet = (await odpovedi.nth(i).locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length;
    expect(vet).toBeLessThanOrEqual(2);
  }
  await expect(page.locator('.hlas__jmeno')).toHaveText(['Diogenés', 'Aristotelés', 'Epikúros', 'Hipparchia', 'Seneca']);
  // Odkaz na profil jen tam, kde profil je; od celku 6 má stránku i Seneca, od celku 8 Hipparchia (společný profil).
  await expect(page.locator('.hlas__jmeno a')).toHaveText(['Diogenés', 'Aristotelés', 'Epikúros', 'Hipparchia', 'Seneca']);
  await expect(page.locator('#hlas-hipparchia .hlas__jmeno a')).toHaveAttribute('href', '/osobnost/krates-a-hipparchia/');
  await expect(page.locator('.hlas .citat')).toHaveCount(5);
  await expect(page.locator('#hlas-hipparchia .citat')).toContainText('Jsem to já, Theodóre.');
  await expect(page.locator('#hlas-aristoteles .citat')).toContainText('Jedna vlaštovka jaro nedělá');
  await expect(page.locator('#hlas-diogenes .citat')).toContainText('medové koláčky');
  await expect(page.locator('#hlas-epikuros .citat')).toContainText('rozumně, čestně a spravedlivě');
  await expect(page.locator('#hlas-seneca .citat')).toContainText('U moudrého slouží bohatství jemu');
  // U Seneky jedna věta o jeho bohatství; scéna s Neronem zůstává portrétu.
  await expect(page.locator('#hlas-seneca')).toContainText('Seneca sám byl velmi bohatý');
  await expect(page.locator('#hlas-seneca')).not.toContainText(/Nero|sesterci/);
  // Diogenés bez scén z profilu, citáty z profilů se neopakují.
  await expect(page.locator('#jak-zit-po')).not.toContainText(/pohárek|lucern|lamp|kohout|občan světa|Ječná placka|Tělo volá/i);
  // K otázce vedou čtyři cesty, v pořadí podle čísla: cesta 4 (Aristotelés a Sókratés), cesta 6 (Epikúros), cesta 7 (kynici) a cesta 34 (Seneca a Marcus).
  await expect(page.locator('#jak-zit-cesty-nadpis')).toHaveText('Cesty k otázce');
  await expect(page.locator('.cesta-karta')).toHaveCount(4);
  await expect(page.locator('.cesta-karta').nth(0)).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  await expect(page.locator('.cesta-karta').nth(1)).toHaveAttribute('href', '/cesta/kolik-je-dost/');
  await expect(page.locator('.cesta-karta').nth(2)).toHaveAttribute('href', '/cesta/ci-zivot-vlastne-ziju/');
  await expect(page.locator('.cesta-karta').nth(3)).toHaveAttribute('href', '/cesta/kam-mi-mizi-cas/');
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`otázka · vyplněná · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        const kdy = new Date().toISOString();
        const odkaz = '/otazka/jak-poznam-pravdu/';
        localStorage.setItem('atlas-denik', JSON.stringify({
          verze: 1, vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {},
          zapisy: [
            { id: 'otazka-jak-poznam-pravdu-prvni', otazka: 'Jak poznám, co je pravda? Můj první názor', odpoved: 'Když to vidím na vlastní oči.', odkaz, kdy, druh: 'stanovisko' },
            { id: 'otazka-jak-poznam-pravdu-ted', otazka: 'Jak poznám, co je pravda? Po setkání s filozofy', odpoved: 'Oči se můžou splést. Pravda je, co obstojí, když se ptám dál.', odkaz, kdy, druh: 'stanovisko' },
          ],
        }));
      });
      await page.goto(ADRESA);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#zmenil-se').scrollIntoViewIfNeeded();
      await hydratovano(page, 'ZmenilSe');
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('#zmenil-se')).toContainText('Oči se můžou splést.');
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.addStyleTag({ content: 'nav.lista { position: static !important; } .paticka { padding-bottom: 24px !important; }' });
      await page.screenshot({ path: `test-results/snimky/otazka-7-vyplnena-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, fullPage: true });
    });
  }
}

test('profily Epikúra a Diogena vedou na cestu 6 a na stránku otázky 1; karta cesty stojí za kapitolou Pověst', async ({ page }) => {
  for (const id of ['epikuros', 'diogenes']) {
    await page.goto(`/osobnost/${id}/`);
    const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
    await expect(kamDal.getByRole('link', { name: /Cesta 6\s*Kolik je dost\?/ })).toHaveAttribute('href', '/cesta/kolik-je-dost/');
    await expect(kamDal.getByRole('link', { name: /Velká otázka 1\s*Jak mám žít\?/ })).toHaveAttribute('href', '/otazka/jak-zit/');
    await expect(page.locator('a[href="/otazky/#jak-zit"]')).toHaveCount(0);
  }
  await page.goto('/osobnost/epikuros/');
  const karta = page.locator('#povest .cesta-karta');
  await expect(karta).toHaveAttribute('href', '/cesta/kolik-je-dost/');
  await expect(karta).toContainText('Pokračuj cestou');
  await expect(page.locator('.cesta-karta')).toHaveCount(1);
  // Diogenův profil kartu nemá: jeho cesta 7 teprve vznikne.
  await page.goto('/osobnost/diogenes/');
  await expect(page.locator('.cesta-karta')).toHaveCount(0);
});

test('vstupy: cesta a otázky jsou v hlavičce profilu, cesty u otázek v přehledu a na kartách v Lidech', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Hlavička profilu: cesta jako první a nejvýraznější vstup, nad kapitolami; otázka její cesty před ostatními.
  // Cesty stojí pod jménem, otázky na telefonu až pod deskou (revize celku 7, nález 6).
  await page.goto('/osobnost/epikuros/');
  const vstupy = page.getByRole('navigation', { name: 'Cesty, kde potkáš Epikúra' });
  const otazkyNav = page.getByRole('navigation', { name: 'Velké otázky, kde potkáš Epikúra' });
  await expect(vstupy.getByRole('link')).toHaveText([/Cesta 6 · 7 kroků · asi 20 minut\s*Kolik je dost\?/, /Cesta 8 · 9 kroků · asi \d+ minut\s*Proč se bát smrti\?/]);
  await expect(otazkyNav.getByRole('link')).toHaveText([/Velká otázka 1\s*Jak mám žít\?/, /Velká otázka 3\s*Má život smysl\?/, /Velká otázka 4\s*Jsem svobodný\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/, /Velká otázka 7\s*Jak poznám, co je pravda\?/]);
  await expect(vstupy.getByRole('link').first()).toHaveAttribute('href', '/cesta/kolik-je-dost/');
  const cesta = (await vstupy.getByRole('link').first().boundingBox())!;
  const deska = (await page.locator('.osobnost__deska').boundingBox())!;
  const prvniOtazka = (await otazkyNav.getByRole('link').first().boundingBox())!;
  // Telefon: jméno, cesty, deska, otázky, obsah. Deska začíná na první obrazovce.
  expect(cesta.y + cesta.height).toBeLessThan(deska.y);
  expect(prvniOtazka.y).toBeGreaterThan(deska.y + deska.height);
  expect(deska.y).toBeLessThan(844);
  const kapitoly = (await page.getByRole('navigation', { name: 'Obsah při čtení' }).boundingBox())!;
  expect(cesta.y).toBeLessThan(kapitoly.y);
  // Na telefonu je cesta vidět bez posouvání a je dost velká na prst.
  expect(cesta.y + cesta.height).toBeLessThan(844);
  expect(cesta.height).toBeGreaterThanOrEqual(56);
  for (const o of await otazkyNav.getByRole('link').all()) expect((await o.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  expect(prvniOtazka.y).toBeLessThan(kapitoly.y);
  // Notebook: cesty a pod nimi otázky vlevo, deska vpravo vedle nich.
  await page.setViewportSize({ width: 1440, height: 900 });
  const deskaN = (await page.locator('.osobnost__deska').boundingBox())!;
  const otazkaN = (await otazkyNav.getByRole('link').first().boundingBox())!;
  const cestaN = (await vstupy.getByRole('link').last().boundingBox())!;
  expect(otazkaN.x + otazkaN.width).toBeLessThan(deskaN.x);
  expect(otazkaN.y).toBeGreaterThan(cestaN.y + cestaN.height);
  expect(otazkaN.y).toBeLessThan(deskaN.y + deskaN.height);
  await page.setViewportSize({ width: 390, height: 844 });
  await vstupy.getByRole('link').first().click();
  await expect(page).toHaveURL('/cesta/kolik-je-dost/');

  await page.goto('/osobnost/diogenes/');
  // Diogenés je filozofem cesty 6 i cesty 7 (kynici kolem Kratéta a Hipparchie).
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 6[\s\S]*Kolik je dost\?/, /Cesta 7[\s\S]*Čí život vlastně žiju\?/, /Velká otázka 1\s*Jak mám žít\?/]);
  await page.goto('/osobnost/krates-a-hipparchia/');
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 7[\s\S]*Čí život vlastně žiju\?/, /Velká otázka 1\s*Jak mám žít\?/]);
  await page.goto('/osobnost/sokrates/');
  // Sókratés je filozofem dvou cest: cesty 1 a cesty 4, kde stojí ve Sporu proti Aristotelovi.
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 1[\s\S]*Kdy mám dobrý důvod věřit\?/, /Cesta 4[\s\S]*Stačí vědět, co je správné\?/, /Velká otázka 7\s*Jak poznám, co je pravda\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/]);

  // Přehled otázek: u otázky stojí cesty, které k ní vedou, i když otázka ještě nemá vlastní stránku.
  await page.goto('/otazky/');
  await expect(page.locator('#jak-zit .cesta')).toHaveText([/Cesta 4\s*Stačí vědět, co je správné\?/, /Cesta 6\s*Kolik je dost\?/, /Cesta 7\s*Čí život vlastně žiju\?/, /Cesta 34\s*Kam mi mizí čas\?/]);
  await expect(page.locator('#jak-zit .cesta').first()).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  await expect(page.locator('#jak-zit .cesta').nth(1)).toHaveAttribute('href', '/cesta/kolik-je-dost/');
  await expect(page.locator('#jak-zit .cesta').nth(2)).toHaveAttribute('href', '/cesta/ci-zivot-vlastne-ziju/');
  await expect(page.locator('#jak-zit .cesta').last()).toHaveAttribute('href', '/cesta/kam-mi-mizi-cas/');
  await expect(page.locator('#jak-poznam-pravdu .cesta')).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(page.locator('#co-je-spravne .cesta')).toHaveCount(0);
  for (const c of await page.locator('#jak-zit .cesta').all()) expect((await c.boundingBox())!.height).toBeGreaterThanOrEqual(44);

  // Lidé: karta člověka s profilem říká, která cesta k němu patří.
  await page.goto('/lide/');
  await expect(page.locator('#epikuros .karta__cesta')).toHaveText(['Cesta 6: Kolik je dost?', 'Cesta 8: Proč se bát smrti?']);
  await expect(page.locator('#diogenes .karta__cesta')).toHaveText(['Cesta 6: Kolik je dost?', 'Cesta 7: Čí život vlastně žiju?']);
  await expect(page.locator('#sokrates .karta__cesta')).toHaveText(['Cesta 1: Kdy mám dobrý důvod věřit?', 'Cesta 4: Stačí vědět, co je správné?']);
  await expect(page.locator('#aristoteles .karta__cesta')).toHaveText('Cesta 4: Stačí vědět, co je správné?');
  await expect(page.locator('#seneca .karta__cesta')).toHaveText(['Cesta 8: Proč se bát smrti?', 'Cesta 33: Co když přijde to nejhorší?', 'Cesta 34: Kam mi mizí čas?']);
  // Kdo nemá vlastní stránku, nemá na kartě ani cestu (Lucretius, filozof cesty 8).
  await expect(page.locator('#lucretius .karta__cesta')).toHaveCount(0);
});

test('vstupy v hlavičce profilu: tlačítka otázek jsou na telefonu stejně vysoká', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/epikuros/');
  await page.evaluate(() => document.fonts.ready);
  // Kratší otázka zůstávala na jednom řádku s nadtitulkem, delší se zalomila: dvě tlačítka pod sebou vypadala každé jinak.
  const vysky = await page.locator('.vstup--otazka').evaluateAll((e) => e.map((x) => Math.round(x.getBoundingClientRect().height)));
  // Epikúros je hlasem pěti otázek (1, 3, 4, 5 a 7).
  expect(vysky).toHaveLength(5);
  expect(new Set(vysky).size).toBe(1);
});

test('otázka 4: úvodní případ, čtyři hlasy, které se poznají, a cesta 5', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/jsem-svobodny/');
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator('h1')).toHaveText('Jsem svobodný?');
  // Úvod je vymyšlená situace bez historických osob a končí otázkami.
  const uvod = page.locator('.uvod');
  await expect(uvod).toContainText('Představ si, že ti kamarád v hádce řekne něco hodně ošklivého.');
  await expect(uvod).not.toContainText(/Epikúr|Epiktét|Chrýsipp|Aristotel/);
  await expect(uvod.locator('p').last()).toContainText('?');
  // Nejdřív student: hlasy se ukážou až po prvním názoru.
  await expect(page.locator('#jsem-svobodny-po')).toBeHidden();
  await page.locator('#jsem-svobodny-prvni-pole').focus();
  await page.keyboard.type('Může, ale ne úplně.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#jsem-svobodny-hlasy-nadpis')).toBeFocused();
  await expect(page.locator('#jsem-svobodny-hlasy-nadpis')).toHaveText('Může za to?');
  // Pořadí podle narození.
  await expect(page.locator('.odpoved__jmeno')).toHaveText(['Aristotelés', 'Epikúros', 'Chrýsippos', 'Epiktétos']);
  const odpovedi = page.locator('.odpoved');
  // Každý hlas se pozná: ručí i za povahu, nutnost nemá poslední slovo, osud i odpovědnost zároveň, otázka obrácená dovnitř.
  await expect(odpovedi.nth(0)).toContainText('Výbušným se stal tím, jak léta jednal');
  await expect(odpovedi.nth(1)).toContainText('Kdyby všechno řídila nutnost');
  await expect(odpovedi.nth(2)).toContainText('Všechno má příčinu');
  await expect(odpovedi.nth(2)).toContainText('na osud se vymlouvat nesmí');
  await expect(odpovedi.nth(3)).toContainText('tvoje dílo je teď to, co si o těch slovech pomyslíš');
  for (let i = 0; i < 4; i++) {
    const vet = (await odpovedi.nth(i).locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length;
    expect(vet).toBeLessThanOrEqual(2);
  }
  await expect(page.locator('.hlas__jmeno')).toHaveText(['Aristotelés', 'Epikúros', 'Chrýsippos', 'Epiktétos']);
  // Odkaz na profil jen tam, kde profil je.
  await expect(page.locator('.hlas__jmeno a')).toHaveText(['Aristotelés', 'Epikúros', 'Chrýsippos', 'Epiktétos']);
  await expect(page.locator('.hlas .citat')).toHaveCount(4);
  await expect(page.locator('#hlas-aristoteles .citat')).toContainText('Kdo hodil kámen, už ho zpátky nevezme.');
  await expect(page.locator('#hlas-epikuros .citat')).toContainText('otročit osudu přírodních filozofů');
  await expect(page.locator('#hlas-chrysippos .citat')).toContainText('Kdo strčil do válce');
  await expect(page.locator('#hlas-epiktetos .citat')).toContainText('Svobodný je ten, kdo žije, jak chce');
  // Odchylka atomů jen jako nauka, kterou Epikúrovi připisují pozdější prameny.
  await expect(page.locator('#hlas-epikuros')).toContainText('Pozdější prameny mu připisují');
  // Aristotelés tu říká něco jiného než na otázce 1 a ve Sporu cesty 5; scény z portrétů a z cesty se neopakují.
  await expect(page.locator('#jsem-svobodny-po')).not.toContainText(/vlaštovka|mluví naprázdno|otrocké|lamp|ševc|Helvidi|Musoni|dvě ucha|Zlomíš|Neříkal jsem/i);
  await expect(page.locator('.cesta-karta')).toHaveAttribute('href', '/cesta/co-mam-ve-svych-rukou/');
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('otázka 6: duha, čtyři hlasy, které se poznají, a cesta 3', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/co-je-skutecne/');
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator('h1')).toHaveText('Co je skutečné?');
  // Úvod: duha ze života studenta, pak „boj obrů“ s větou o tom, kdo v dialogu mluví; končí otázkou.
  const uvod = page.locator('.uvod');
  await expect(uvod).toContainText('Představ si, že po dešti vyjde slunce a nad hřištěm stojí duha.');
  await expect(uvod).toContainText('V Platónově dialogu Sofistés o nich říká host z Eleje:');
  await expect(uvod.locator('.citat')).toContainText('boj obrů');
  await expect(uvod.locator(':scope > p').last()).toContainText('Kam bys v tom boji postavil duhu ty?');
  // Nejdřív student: hlasy se ukážou až po prvním názoru.
  await expect(page.locator('#co-je-skutecne-po')).toBeHidden();
  await page.locator('#co-je-skutecne-prvni-pole').focus();
  await page.keyboard.type('Je, vždyť ji vidím.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#co-je-skutecne-hlasy-nadpis')).toBeFocused();
  await expect(page.locator('#co-je-skutecne-hlasy-nadpis')).toHaveText('Je duha skutečná?');
  // Pořadí podle narození.
  await expect(page.locator('.odpoved__jmeno')).toHaveText(['Parmenidés', 'Démokritos', 'Platón', 'Aristotelés']);
  const odpovedi = page.locator('.odpoved');
  // Každý hlas se pozná: není duha ani déšť; kapky ano, barvy ne; mínění, ne vědění; odraz v kapkách.
  await expect(odpovedi.nth(0)).toContainText('Není, a déšť před ní taky ne.');
  await expect(odpovedi.nth(1)).toContainText('Kapky tam jsou, barvy ne.');
  await expect(odpovedi.nth(2)).toContainText('o takové věci můžeš mít mínění, ne vědění');
  await expect(odpovedi.nth(3)).toContainText('je to odraz slunce v kapkách');
  for (let i = 0; i < 4; i++) {
    const vet = (await odpovedi.nth(i).locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length;
    expect(vet).toBeLessThanOrEqual(2);
  }
  await expect(page.locator('.hlas__jmeno')).toHaveText(['Parmenidés', 'Démokritos', 'Platón', 'Aristotelés']);
  // Odkaz na profil jen tam, kde profil je.
  await expect(page.locator('.hlas__jmeno a')).toHaveText(['Parmenidés', 'Démokritos', 'Platón', 'Aristotelés']);
  await expect(page.locator('.hlas .citat')).toHaveCount(4);
  await expect(page.locator('#hlas-parmenides .citat')).toContainText('co by to přimělo vzniknout později, a ne dřív?');
  await expect(page.locator('#hlas-demokritos .citat')).toContainText('Ve skutečnosti jsou atomy a prázdno.');
  await expect(page.locator('#hlas-platon .citat')).toContainText('smysly je nevnímáme, jen je myslíme');
  await expect(page.locator('#hlas-aristoteles .citat')).toContainText('duha je odraz pohledu ke slunci');
  // U dialogu a u básně je řečeno, kdo mluví.
  await expect(page.locator('#hlas-platon')).toContainText('Platón nechává říct muže, po kterém se dialog jmenuje');
  await expect(page.locator('#hlas-parmenides')).toContainText('Bohyně se v básni ptá:');
  // Aristotelés nezní jako dnešní fyzik: duha je odraz v kapkách, o lomu světla nic.
  await expect(page.locator('#hlas-aristoteles')).toContainText('zrcátka tak malá, že v nich není vidět tvar, jen barva');
  await expect(page.locator('#hlas-aristoteles')).not.toContainText(/lom|láme|vln|spektr/i);
  // Jeskyni nese cesta: úvod ani hlasy ji nepoužívají. Scény a citáty z portrétu a ze Sporu cesty 3 se neopakují,
  // a Aristotelés i Parmenidés tu říkají něco jiného než na otázkách 1, 4 a 7.
  for (const cast of [uvod, page.locator('.odpovedi'), page.locator('.hlasy-osa')]) {
    if (await cast.count()) await expect(cast.first()).not.toContainText(/jeskyn|vězn|stín|stolovost|truhlář|naprázdno|Léčí přece|vlaštovka|Kdo hodil kámen|Diogen|Isokrat/i);
  }
  for (const id of ['parmenides', 'demokritos', 'platon', 'aristoteles']) await expect(page.locator(`#hlas-${id}`)).not.toContainText(/jeskyn|vězn|stín|stolovost|truhlář|naprázdno|Léčí přece|vlaštovka|Kdo hodil kámen/i);
  await expect(page.locator('.cesta-karta')).toHaveAttribute('href', '/cesta/je-to-co-vidim-cela-skutecnost/');
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('portréty Epiktéta a Marca Aurelia vedou na cestu 5 a na stránku otázky 4; karta cesty stojí za kapitolou Senátor a císař', async ({ page }) => {
  for (const id of ['epiktetos', 'marcus-aurelius']) {
    await page.goto(`/osobnost/${id}/`);
    const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
    await expect(kamDal.getByRole('link', { name: /Cesta 5\s*Co mám ve svých rukou\?/ })).toHaveAttribute('href', '/cesta/co-mam-ve-svych-rukou/');
    await expect(kamDal.getByRole('link', { name: /Velká otázka 4\s*Jsem svobodný\?/ })).toHaveAttribute('href', '/otazka/jsem-svobodny/');
    await expect(kamDal.getByRole('link')).toHaveCount(5);
    await expect(page.locator('.vstupy-osoby a').first()).toHaveText(/Cesta 5 · 8 kroků · asi 20 minut\s*Co mám ve svých rukou\?/);
  }
  await page.goto('/osobnost/epiktetos/');
  // Věta o noze vede na cestu, karta stojí až za poslední kapitolou: cesta pokračuje tam, kde kapitola končí otázkou.
  await expect(page.locator('#co-mu-nikdo-nevzal a[href="/cesta/co-mam-ve-svych-rukou/"]')).toHaveText('Co mám ve svých rukou?');
  const karta = page.locator('#senator-a-cisar .cesta-karta');
  await expect(karta).toHaveAttribute('href', '/cesta/co-mam-ve-svych-rukou/');
  await expect(karta).toContainText('Pokračuj cestou');
  await expect(page.locator('.cesta-karta')).toHaveCount(1);
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 5[\s\S]*Co mám ve svých rukou\?/, /Cesta 33[\s\S]*Co když přijde to nejhorší\?/, /Velká otázka 3\s*Má život smysl\?/, /Velká otázka 4\s*Jsem svobodný\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/]);
  await page.goto('/osobnost/marcus-aurelius/');
  await expect(page.locator('.cesta-karta')).toHaveCount(0);
  // Přehled otázek a Lidé: otázka 4 má vlastní stránku a cestu, oba lidé cestu na kartě.
  await page.goto('/otazky/');
  await expect(page.locator('#jsem-svobodny .cesta')).toHaveText(/Cesta 5\s*Co mám ve svých rukou\?/);
  await expect(page.locator('#jsem-svobodny a[href="/otazka/jsem-svobodny/"]')).toHaveCount(1);
  await page.goto('/lide/');
  await expect(page.locator('#epiktetos .karta__cesta')).toHaveText(['Cesta 5: Co mám ve svých rukou?', 'Cesta 33: Co když přijde to nejhorší?']);
  await expect(page.locator('#marcus-aurelius .karta__cesta')).toHaveText(['Cesta 5: Co mám ve svých rukou?', 'Cesta 34: Kam mi mizí čas?']);
});

test('otázka 3: fotografie třídy, pět hlasů, které se poznají, a cesta 8', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/ma-zivot-smysl/');
  await hydratovano(page, 'PrvniNazor');
  await expect(page.locator('h1')).toHaveText('Má život smysl?');
  // Úvod je věc, kterou má student v ruce: cizí životy, ne jeho vlastní. Končí otázkami.
  const uvod = page.locator('.uvod');
  await expect(uvod).toContainText('fotografii školní třídy z roku 1926');
  await expect(uvod).not.toContainText(/Platón|Aristotel|Epikúr|Senec|Epiktét/);
  await expect(uvod).not.toContainText(/po tobě|na tebe|tvůj život|tvoje smrt|vzpomene/i);
  await expect(uvod.locator('p').last()).toHaveText('Byl jejich život k něčemu? A podle čeho bys to poznal?');
  // Antičtí autoři se takhle neptali a stránka jim tu otázku do úst nevkládá.
  await expect(uvod).toContainText('Staří Řekové a Římané se takhle neptali.');
  await expect(uvod).toContainText('k čemu člověk je, kdy je život celý a co z něj zůstane');
  // Nejdřív student: hlasy se ukážou až po prvním názoru.
  await expect(page.locator('#ma-zivot-smysl-po')).toBeHidden();
  await page.locator('#ma-zivot-smysl-prvni-pole').focus();
  await page.keyboard.type('Byl, i když o nich nikdo neví.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#ma-zivot-smysl-hlasy-nadpis')).toBeFocused();
  await expect(page.locator('#ma-zivot-smysl-hlasy-nadpis')).toHaveText('Byl jejich život k něčemu?');
  await expect(page.locator('#ma-zivot-smysl-po .t-nadtitulek').first()).toHaveText('Tentýž případ, pět odpovědí');
  // Pořadí podle narození.
  const JMENA = ['Platón', 'Aristotelés', 'Epikúros', 'Seneca', 'Epiktétos'];
  await expect(page.locator('.odpoved__jmeno')).toHaveText(JMENA);
  const odpovedi = page.locator('.odpoved');
  // Každý hlas se pozná: nesmrtelná duše, to nejlepší v člověku, plný život bez přídavku, mysl místo let, divák světa.
  await expect(odpovedi.nth(0)).toContainText('jak pečovaly o duši');
  await expect(odpovedi.nth(0)).toContainText('Jestli je nesmrtelná');
  await expect(odpovedi.nth(1)).toContainText('podle toho nejlepšího, co v nich bylo');
  await expect(odpovedi.nth(2)).toContainText('příjemně a beze strachu');
  await expect(odpovedi.nth(2)).toContainText('Další roky by jim nepřidaly nic');
  await expect(odpovedi.nth(3)).toContainText('Nepočítej jim roky.');
  await expect(odpovedi.nth(4)).toContainText('aby se dívaly na svět a rozuměly tomu, co vidí');
  for (let i = 0; i < 5; i++) {
    const vet = (await odpovedi.nth(i).locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length;
    expect(vet).toBeLessThanOrEqual(2);
  }
  // Žádný hlas neříká, co je „smysl života“; to slovo stojí jen v názvu stránky a v úvodu.
  await expect(page.locator('#ma-zivot-smysl-po .odpovedi')).not.toContainText(/smysl/i);
  for (const hlas of await page.locator('.hlas').all()) await expect(hlas).not.toContainText(/smysl/i);
  await expect(page.locator('.hlas__jmeno')).toHaveText(JMENA);
  // Všech pět má vlastní stránku.
  await expect(page.locator('.hlas__jmeno a')).toHaveText(JMENA);
  await expect(page.locator('.hlas .citat')).toHaveCount(5);
  await expect(page.locator('#hlas-platon .citat')).toContainText('Je-li duše nesmrtelná');
  await expect(page.locator('#hlas-platon')).toContainText('Říká to s výhradou');
  await expect(page.locator('#hlas-aristoteles .citat')).toContainText('podle toho nejlepšího, co v nás je');
  await expect(page.locator('#hlas-epikuros .citat')).toContainText('Nekonečný čas v sobě má stejně slasti jako čas omezený');
  await expect(page.locator('#hlas-seneca .citat')).toContainText('nerozhodují roky ani dny, ale mysl');
  await expect(page.locator('#hlas-epiktetos .citat')).toContainText('jako diváka sebe i svých děl');
  // Hlasy tu říkají něco jiného než na stránkách otázek 1 a 4; co nese cesta 8 a portrét, se neopakuje.
  for (const cast of ['.odpovedi', '.hlas']) for (const e of await page.locator(`#ma-zivot-smysl-po ${cast}`).all()) await expect(e).not.toContainText(/kdo komu slouží|hrnek sýra|netýká|zrcadl|lamp|bez hradeb|Lucreti|Plútarch|Paulin|vynucen/i);
  await expect(page.locator('.cesta-karta')).toHaveCount(2);
  await expect(page.locator('.cesta-karta').first()).toHaveAttribute('href', '/cesta/proc-se-bat-smrti/');
  await expect(page.locator('.cesta-karta').nth(1)).toHaveAttribute('href', '/cesta/co-kdyz-prijde-to-nejhorsi/');
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('cesta 8 a otázka 3 jsou dosažitelné z profilů Seneky a Epikúra, z přehledu otázek a z Lidí', async ({ page }) => {
  await page.goto('/osobnost/seneca/');
  // Hlavička se skládá z dat: cesta, pak otázka, ke které cesta vede, pak ostatní otázky.
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 8 · 9 kroků · asi \d+ minut\s*Proč se bát smrti\?/, /Cesta 33 · 8 kroků · asi \d+ minut\s*Co když přijde to nejhorší\?/, /Cesta 34 · 8 kroků · asi \d+ minut\s*Kam mi mizí čas\?/, /Velká otázka 1\s*Jak mám žít\?/, /Velká otázka 3\s*Má život smysl\?/]);
  await expect(page.locator('.vstupy-osoby a').first()).toHaveAttribute('href', '/cesta/proc-se-bat-smrti/');
  await page.goto('/osobnost/epikuros/');
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 6[\s\S]*Kolik je dost\?/, /Cesta 8[\s\S]*Proč se bát smrti\?/, /Velká otázka 1\s*Jak mám žít\?/, /Velká otázka 3\s*Má život smysl\?/, /Velká otázka 4\s*Jsem svobodný\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/, /Velká otázka 7\s*Jak poznám, co je pravda\?/]);
  await page.goto('/otazky/');
  await expect(page.locator('#ma-zivot-smysl .cesta')).toHaveText([/Cesta 8\s*Proč se bát smrti\?/, /Cesta 33\s*Co když přijde to nejhorší\?/]);
  await expect(page.locator('#ma-zivot-smysl a[href="/otazka/ma-zivot-smysl/"]')).toHaveCount(1);
  await page.goto('/lide/');
  await expect(page.locator('#seneca .karta__cesta')).toHaveText(['Cesta 8: Proč se bát smrti?', 'Cesta 33: Co když přijde to nejhorší?', 'Cesta 34: Kam mi mizí čas?']);
  await expect(page.locator('#epikuros .karta__cesta')).toHaveText(['Cesta 6: Kolik je dost?', 'Cesta 8: Proč se bát smrti?']);
  // Karta cesty: vstup neříká nic o nemoci ani o způsobu.
  await page.goto('/otazka/ma-zivot-smysl/');
  await page.evaluate(() => document.documentElement.removeAttribute('data-otazka-zavreno'));
  await expect(page.locator('.cesta-karta').first()).toContainText('V poslední den života psal příteli o šťastném dni a o dětech, které tu zůstanou.');
});
