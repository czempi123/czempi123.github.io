// Stránky období, směrů, pokusů, úvodů a tradic (větev antika-doplnky, K1): každá na 390 a 1440 px ve světlém
// i tmavém režimu (bez vodorovného posouvání, axe, oddíly z dat), klávesnice, odkazy z Domů, Lidí, medailonku,
// drobečků a týdne, a blok Gýgův prsten, který sdílí stav s portrétem Platóna. Logiku hlídá tests/data/stranky.test.ts.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKY = [
  { adresa: '/obdobi/pocatky-a-klasicke-recko/', h1: 'Počátky a klasické Řecko', oddily: ['Co se dělo', 'Otázky doby', 'Lidé a směry', 'Cesty', 'Na mapě'] },
  { adresa: '/obdobi/helenismus-a-rim/', h1: 'Helenismus a Řím', oddily: ['Co se dělo', 'Otázky doby', 'Lidé a směry', 'Cesty', 'Na mapě'] },
  { adresa: '/smer/stoicismus/', h1: 'Stoicismus', oddily: ['Ztroskotání a knihkupectví', 'Tři myšlenky', 'Kdo u koho se učil', 'S kým se přeli'] },
  { adresa: '/smer/epikureismus/', h1: 'Epikureismus', oddily: ['Škola za plotem', 'Tři myšlenky', 'Kdo u koho se učil', 'S kým se přeli'] },
  { adresa: '/smer/kynismus/', h1: 'Kynismus', oddily: ['Hůl a hlava', 'Tři myšlenky', 'Kdo u koho se učil', 'S kým se přeli'] },
  { adresa: '/smer/akademie/', h1: 'Platónova Akademie', oddily: ['Žák, který nesouhlasil', 'Tři myšlenky', 'Kdo u koho se učil', 'S kým se přeli'] },
  { adresa: '/pokus/gyguv-prsten/', h1: 'Gýgův prsten', oddily: ['Co řekli filozofové'] },
  { adresa: '/pokus/zrcadlo-casu/', h1: 'Zrcadlo času', oddily: ['Co řekli filozofové'] },
  { adresa: '/co-je-filozofie/', h1: 'Co je filozofie?', oddily: ['Proč hřmí?', 'Čím je filozofie jiná', 'Deset velkých otázek'] },
  { adresa: '/nabozenstvi/', h1: 'Co je náboženství?', oddily: ['Posvátné, mýtus, rituál, společenství', 'Jak náboženství zkoumá věda', 'Tradice'] },
  { adresa: '/nabozenstvi/judaismus/', h1: 'Judaismus', oddily: ['Tóra a smlouva', 'Exil a rozptýlení', 'Rabínská tradice', 'Kde a kdy'] },
];

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

async function pripravBlok(page: Page, id: string, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator(`astro-island[component-url*="${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

for (const s of STRANKY) {
  for (const [sirka, vyska] of [[390, 844], [1440, 900]] as const) {
    for (const rezim of ['light', 'dark'] as const) {
      test(`${s.adresa} na ${sirka} px, ${rezim}: nadpis, oddíly, bez posouvání do strany, axe`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
        await page.setViewportSize({ width: sirka, height: vyska });
        await page.goto(s.adresa);
        await expect(page.locator('h1')).toHaveText(s.h1);
        for (const n of s.oddily) await expect(page.getByRole('heading', { level: 2, name: n, exact: true })).toBeVisible();
        // Drobečky a Prameny jsou na každé stránce.
        await expect(page.getByRole('navigation', { name: 'Kde jsem' })).toBeVisible();
        await expect(page.locator('#prameny')).toBeAttached();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
        await axe(page);
      });
    }
  }
}

test('klávesnice: na každé nové stránce jde první odkaz v obsahu tabulátorem a fokus nezajede pod lištu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const s of STRANKY) {
    await page.goto(s.adresa);
    let vObsahu = false;
    for (let i = 0; i < 40 && !vObsahu; i++) {
      await page.keyboard.press('Tab');
      vObsahu = await page.evaluate(() => !!document.activeElement?.closest('main') && document.activeElement !== document.querySelector('main'));
    }
    expect(vObsahu, s.adresa).toBe(true);
    await page.waitForTimeout(300);
    const poloha = await page.evaluate(() => {
      const r = document.activeElement!.getBoundingClientRect();
      const lista = document.querySelector('nav.lista');
      const dolni = lista && getComputedStyle(lista).position === 'fixed' ? lista.getBoundingClientRect().top : innerHeight;
      return { ok: r.top >= 0 && r.bottom <= dolni + 1, top: r.top, bottom: r.bottom, dolni, co: document.activeElement!.outerHTML.slice(0, 120) };
    });
    expect(poloha.ok, `${s.adresa} ${JSON.stringify(poloha)}`).toBe(true);
    // Viditelný rámeček fokusu: na prvku, nebo na obalu, který je větší (koš kolem „Dát sem“ v Roztřiď).
    const fokus = await page.evaluate(() => {
      const prvky = [document.activeElement!, document.activeElement!.parentElement!, document.activeElement!.parentElement!.parentElement!];
      return { vidi: prvky.some((p) => getComputedStyle(p).outlineStyle !== 'none'), co: document.activeElement!.outerHTML.slice(0, 100) };
    });
    expect(fokus.vidi, `${s.adresa} ${fokus.co}`).toBe(true);
  }
});

test('stránka období: osa kotev z dat, otázky doby s cestami, mapa s odkazem do Mapy a času', async ({ page }) => {
  await page.goto('/obdobi/pocatky-a-klasicke-recko/');
  await expect(page.locator('.osa-udalosti li')).toHaveCount(12);
  await expect(page.locator('.osa-udalosti li').first()).toContainText('Zatmění Slunce nad bitvou u řeky Halys');
  await expect(page.locator('.osa-udalosti')).toContainText('Sókratův proces');
  await expect(page.locator('.jinde')).toContainText('Mezitím jinde');
  await expect(page.locator('#otazky-doby').getByRole('link', { name: /Cesta\s*Kdy mám dobrý důvod věřit\?/ })).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(page.locator('#lide-a-smery').getByRole('link', { name: 'Stoicismus' })).toHaveCount(0); // stoicismus patří do období 2
  await expect(page.locator('#lide-a-smery').getByRole('link', { name: /Kynismus/ })).toHaveAttribute('href', '/smer/kynismus/');
  await expect(page.locator('#lide-a-smery').getByRole('link', { name: /Sókratés/ })).toHaveAttribute('href', '/osobnost/sokrates/');
  await expect(page.locator('#mapa-obdobi svg')).toBeVisible();
  await expect(page.getByRole('link', { name: /Otevřít Mapu a čas v roce 399/ })).toHaveAttribute('href', '/mapa/?rok=-399&osoba=sokrates');
  // Kam dál: období 2 má stránku.
  await expect(page.getByRole('navigation', { name: 'Kam dál' }).getByRole('link').first()).toHaveAttribute('href', '/obdobi/helenismus-a-rim/');
  // Období 2 nemá Mezitím jinde a Kam dál na období 3 je jen „připravujeme“.
  await page.goto('/obdobi/helenismus-a-rim/');
  await expect(page.locator('.jinde')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Kam dál' })).toContainText('Období 3 · připravujeme');
});

test('stránka směru: rodokmen z dat a Stoický týden jako Zkus to žít', async ({ page }) => {
  await page.goto('/smer/stoicismus/');
  const rodokmen = page.locator('#rodokmen');
  await expect(rodokmen).toContainText('Zénón z Kitia');
  await expect(rodokmen.locator('.clanek').filter({ hasText: 'Zénón z Kitia' })).toContainText('Učil se u Kratéta');
  await expect(rodokmen.locator('.clanek').filter({ hasText: 'Marcus Aurelius' })).toContainText('Navázal na texty Epiktéta');
  await expect(rodokmen.getByRole('link', { name: 'Epiktétos' })).toHaveAttribute('href', '/osobnost/epiktetos/');
  await expect(page.locator('#zkus-to-zit').getByRole('link', { name: 'Otevřít stoický týden' })).toHaveAttribute('href', '/tyden/stoicky/');
  await page.goto('/smer/kynismus/');
  await expect(page.locator('#rodokmen .clanek').filter({ hasText: 'Diogenés' }).first()).toContainText('vypráví se');
});

test('odkazy na nové stránky: Domů, Lidé a směry, otázky, medailonek, drobečky profilu a týdne', async ({ page }) => {
  await page.goto('/');
  const pas = page.getByRole('navigation', { name: 'Osm období' });
  await expect(pas.getByRole('link', { name: /Počátky a klasické Řecko/ })).toHaveAttribute('href', '/obdobi/pocatky-a-klasicke-recko/');
  await expect(pas.getByRole('link', { name: /Helenismus a Řím/ })).toHaveAttribute('href', '/obdobi/helenismus-a-rim/');
  await expect(pas.getByRole('link')).toHaveCount(2);
  await expect(page.locator('.na-zacatek').getByRole('link', { name: 'Co je filozofie?' })).toHaveAttribute('href', '/co-je-filozofie/');
  await expect(page.locator('.na-zacatek').getByRole('link', { name: 'Co je náboženství?' })).toHaveAttribute('href', '/nabozenstvi/');

  await page.goto('/otazky/');
  await expect(page.locator('.uvodni')).toHaveAttribute('href', '/co-je-filozofie/');

  await page.goto('/lide/');
  await expect(page.locator('#obdobi-2').getByRole('link', { name: /^Stoicismus/ })).toHaveAttribute('href', '/smer/stoicismus/');
  await expect(page.locator('#obdobi-1-nazev').getByRole('link')).toHaveAttribute('href', '/obdobi/pocatky-a-klasicke-recko/');
  await expect(page.locator('.vstupy').getByRole('link', { name: 'Náboženství světa' })).toHaveAttribute('href', '/nabozenstvi/');
  // Směr bez stránky zůstává štítkem bez odkazu.
  await expect(page.locator('#obdobi-1 .smery li').filter({ hasText: 'Sofisté' }).getByRole('link')).toHaveCount(0);

  await page.goto('/osobnost/kleanthes/');
  await expect(page.locator('.nadtitulek').getByRole('link', { name: 'Stoicismus' })).toHaveAttribute('href', '/smer/stoicismus/');
  await expect(page.getByRole('navigation', { name: 'Kde jsem' }).getByRole('link', { name: 'Helenismus a Řím' })).toHaveAttribute('href', '/obdobi/helenismus-a-rim/');

  await page.goto('/osobnost/platon/');
  await expect(page.getByRole('navigation', { name: 'Kde jsem' }).getByRole('link', { name: 'Počátky a klasické Řecko' })).toHaveAttribute('href', '/obdobi/pocatky-a-klasicke-recko/');

  await page.goto('/tyden/stoicky/');
  await expect(page.getByRole('navigation', { name: 'Kde jsem' }).getByRole('link')).toHaveText(['Lidé a směry', 'Stoicismus']);

  await page.goto('/cesta/proc-se-bat-smrti/4/');
  await expect(page.getByRole('link', { name: 'myšlenkový pokus Zrcadlo času' })).toHaveAttribute('href', '/pokus/zrcadlo-casu/');
});

test('Gýgův prsten: blok na stránce pokusu sdílí stav s portrétem Platóna a portrét na pokus vede', async ({ page }) => {
  await page.goto('/osobnost/platon/');
  const prsten = await pripravBlok(page, 'platon-gyguv-prsten', 'ZmenJednuVec');
  await prsten.getByRole('radio', { name: 'Nepoužiju ho.' }).check({ force: true });
  await prsten.getByRole('button', { name: 'Rozhodnuto' }).click();
  await prsten.getByRole('radio', { name: 'Nikdo se to nikdy nedozví' }).check({ force: true });
  await prsten.locator('.zmenena').getByRole('radio', { name: 'Nepoužiju ho.' }).check({ force: true });
  await prsten.locator('.zmenena').getByRole('button').click();
  await expect(prsten.getByRole('link', { name: 'Myšlenkový pokus Gýgův prsten' })).toHaveAttribute('href', '/pokus/gyguv-prsten/');

  await page.goto('/pokus/gyguv-prsten/');
  const tamtez = await pripravBlok(page, 'platon-gyguv-prsten', 'ZmenJednuVec');
  // Rozhodnutí z portrétu tu už je: první volba i odpověď v nové podmínce, posun odpovědi.
  await expect(tamtez.getByRole('radio', { name: 'Nepoužiju ho.' }).first()).toBeChecked();
  await expect(tamtez.getByRole('radio', { name: 'Nikdo se to nikdy nedozví' })).toBeChecked();
  await expect(tamtez.getByRole('region', { name: 'Posun odpovědi' })).toContainText('Tvoje odpověď zůstala stejná.');
  // Na stránce pokusu blok nenabízí cestu zpět na sebe.
  await expect(tamtez.getByRole('link', { name: 'Myšlenkový pokus Gýgův prsten' })).toHaveCount(0);
  // Volba předem vede vlastním Kam dál na příběh pod sebou.
  const predem = await pripravBlok(page, 'pokus-gyges-predem', 'Volba');
  await predem.getByText('Záleží na tom, o co by šlo.').click();
  await predem.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(predem.getByRole('link', { name: /Příběh o prstenu/ })).toHaveAttribute('href', '#platon-gyguv-prsten');
});
