// Závěr cesty: panel „Na začátku“ × „Teď“ v posledním kroku. S počáteční odpovědí i bez ní,
// nepovinná otázka pod srovnáním, čitelnost dlouhého zápisu z Roztřiď na telefonu, klávesnice
// a snímky všech tří cest na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const C1 = '/cesta/kdy-mam-dobry-duvod-verit/';
const C6 = '/cesta/kolik-je-dost/';
const C5 = '/cesta/co-mam-ve-svych-rukou/';

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
const denik = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
const zapisy = async (page: Page, id: string) => ((await denik(page)).zapisy ?? []).filter((z: { id: string }) => z.id === id);

/** Uloží do deníku zápisy, jako by je student zapsal v dřívějších krocích. */
async function ulozZapisy(page: Page, zaznamy: { id: string; odpoved: string; druh?: string }[]) {
  await page.evaluate((z) => {
    const d = { verze: 1, zapisy: [] as unknown[], vyzvy: [], navstivene: [], bloky: {}, aktivita: [], cesty: {} };
    d.zapisy = z.map((x) => ({ otazka: 'Otázka', odkaz: '/', kdy: '2026-09-28T16:00:00.000Z', ...x }));
    localStorage.setItem('atlas-denik', JSON.stringify(d));
  }, zaznamy);
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

const panel = (page: Page) => page.getByRole('region', { name: 'Na začátku a teď' });

test('závěr cesty 1: tah z kroku 2 vedle pravidla, otázka pod srovnáním a nic se neukládá podruhé', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Student v kroku 2 opravdu táhne a připíše důvod.
  await page.goto(`${C1}2/`);
  await pripravit(page);
  const volba = page.locator('#cesta1-jak-zjistit');
  await volba.getByText('Najdu lidi, kteří mají pověst moudrých').click();
  await volba.getByRole('textbox').fill('jeden protipříklad stačí');
  await volba.getByRole('button', { name: 'Tohle je můj tah' }).click();
  const [puvodni] = await zapisy(page, 'cesta1-jak-zjistit');
  expect(puvodni.odpoved).toBe('B · Najdu lidi, kteří mají pověst moudrých, a vyzkouším je. Proč: jeden protipříklad stačí.');

  await page.goto(`${C1}7/`);
  await pripravit(page);
  await expect(page.locator('.krok__obsah')).toContainText('Ve druhém kroku jsi vymýšlel, jak věštírnu prověřit.');
  const p = panel(page);
  await expect(p.getByRole('heading', { name: 'Na začátku' })).toBeVisible();
  await expect(p.getByRole('heading', { name: 'Teď' })).toBeVisible();
  await expect(p.locator('.zacatek')).toContainText('Krok 2 · Jak bys to zjišťoval ty?');
  // Tah bez písmene možnosti a zvlášť důvod, jak je student zapsal.
  await expect(p.locator('.zacatek .cast').nth(0)).toHaveText('Najdu lidi, kteří mají pověst moudrých, a vyzkouším je.');
  await expect(p.locator('.zacatek .cast').nth(1)).toHaveText(/^Proč\s*jeden protipříklad stačí\.$/);
  // Na notebooku stojí sloupce vedle sebe.
  const vlevo = await p.locator('.zacatek').boundingBox();
  const vpravo = await p.locator('.ted').boundingBox();
  expect(vpravo!.x).toBeGreaterThan(vlevo!.x + vlevo!.width);
  expect(Math.abs(vpravo!.y - vlevo!.y)).toBeLessThan(4);

  // „Teď“ je pole s pravidlem; otázka pod srovnáním přijde, až je co srovnávat.
  const pole = p.getByRole('textbox', { name: 'Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo.' });
  const zmena = p.getByRole('textbox', { name: /Co se změnilo, nebo proč si myslíš totéž\?/ });
  await expect(pole).toBeVisible();
  await expect(zmena).toHaveCount(0);
  await pole.fill('Věřím tomu, co obstojí, když hledám, co by to vyvrátilo.');
  await expect(zmena).toBeVisible();
  await expect(p.locator('.zmena label')).toHaveText(/^Co se změnilo, nebo proč si myslíš totéž\?\s*Nepovinné$/);
  // Průchod bez nepovinné otázky: v deníku je pravidlo, zápis o změně ne.
  expect((await zapisy(page, 'cesta1-moje-pravidlo'))[0].odpoved).toBe('Věřím tomu, co obstojí, když hledám, co by to vyvrátilo.');
  expect(await zapisy(page, 'cesta1-moje-pravidlo-zmena')).toHaveLength(0);
  await zmena.fill('Myslím si totéž, jen už vím proč.');
  await zmena.blur();
  const [z] = await zapisy(page, 'cesta1-moje-pravidlo-zmena');
  expect(z.otazka).toBe('Kdy mám dobrý důvod věřit? Co se změnilo, nebo proč si myslíš totéž?');
  expect(z.odpoved).toBe('Myslím si totéž, jen už vím proč.');
  expect(z.odkaz).toBe(`${C1}7/`);
  // Počáteční odpověď se jen čte: zápis je pořád jeden a beze změny.
  expect(await zapisy(page, 'cesta1-jak-zjistit')).toEqual([puvodni]);

  await page.reload();
  await pripravit(page);
  await expect(p.locator('.zacatek .cast').nth(0)).toHaveText('Najdu lidi, kteří mají pověst moudrých, a vyzkouším je.');
  await expect(pole).toHaveValue('Věřím tomu, co obstojí, když hledám, co by to vyvrátilo.');
  await expect(zmena).toHaveValue('Myslím si totéž, jen už vím proč.');
  // „Teď“ se mění, jak student pravidlo ukládá; smazané pravidlo otázku pod srovnáním neschová.
  await pole.fill('');
  await pole.blur();
  expect(await zapisy(page, 'cesta1-moje-pravidlo')).toHaveLength(0);
  await expect(zmena).toBeVisible();
  await page.goto('/denik/');
  await expect(page.locator('.seznam--zapisy')).toContainText('Kdy mám dobrý důvod věřit? Co se změnilo, nebo proč si myslíš totéž?');
  await expect(page.locator('.seznam--zapisy')).toContainText('Myslím si totéž, jen už vím proč.');
});

test('závěr cesty bez počáteční odpovědi: žádný panel, pravidlo funguje jako dřív', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [adresa, otazka] of [[`${C1}7/`, 'Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo.'], [`${C6}7/`, 'Kolik je dost? Napiš svoje pravidlo.'], [`${C5}8/`, 'Co máš ve svých rukou? Napiš svoje pravidlo.']]) {
    await page.goto(adresa);
    await pripravit(page);
    await expect(panel(page)).toHaveCount(0);
    await expect(page.locator('.krok__obsah')).not.toContainText(/Na začátku|Bez odpovědi|Co se změnilo/);
    await expect(page.locator('.krok__obsah .blok')).toHaveCount(0);
    const pole = page.getByRole('textbox', { name: otazka });
    await expect(pole).toBeVisible();
    // Pole stojí ve čtenářském sloupci pod textem, ne v širokém pásu.
    const sloupec = await page.locator('.krok__obsah > .ctenarsky').first().boundingBox();
    const b = await pole.boundingBox();
    expect(Math.abs(b!.x - sloupec!.x)).toBeLessThan(2);
    expect(Math.abs(b!.width - sloupec!.width)).toBeLessThan(2);
    await pole.fill('Moje pravidlo.');
    await pole.blur();
    await expect(page.getByText('Uloženo v deníku.')).toBeVisible();
    // Ani s uloženým pravidlem se bez začátku nic nesrovnává.
    await expect(page.getByRole('textbox')).toHaveCount(1);
  }
});

test('závěr cesty: smazaná počáteční odpověď panel schová', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${C1}2/`);
  await pripravit(page);
  const volba = page.locator('#cesta1-jak-zjistit');
  await volba.getByText('Zeptám se přátel').click();
  await volba.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await page.goto(`${C1}7/`);
  await pripravit(page);
  await expect(panel(page).locator('.zacatek')).toContainText('Zeptám se přátel, co si o mně myslí.');
  await page.goto(`${C1}2/`);
  await pripravit(page);
  await volba.getByRole('button', { name: 'Začít znovu' }).click();
  await page.goto(`${C1}7/`);
  await pripravit(page);
  await expect(panel(page)).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo.' })).toBeVisible();
});

test('závěr cesty jen klávesnicí na telefonu: pravidlo, nepovinná otázka a Dokončit cestu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${C6}7/`);
  await ulozZapisy(page, [{ id: 'cesta6-tri-kose', druh: 'roztrid', odpoved: 'Potřebuju: Vyspat se po probdělé noci. Těší mě: Páteční pizza s kamarády. Prázdné: Sto lajků pod fotkou.' }]);
  await page.reload();
  await pripravit(page);
  const p = panel(page);
  // Na telefonu stojí „Na začátku“ nad „Teď“.
  const nahore = await p.locator('.zacatek').boundingBox();
  const dole = await p.locator('.ted').boundingBox();
  expect(dole!.y).toBeGreaterThanOrEqual(nahore!.y + nahore!.height);
  const pole = p.getByRole('textbox', { name: 'Kolik je dost? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('Dost je, když mi nic nechybí.');
  const zmena = p.getByRole('textbox', { name: /Co se změnilo/ });
  await expect(zmena).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(zmena).toBeFocused();
  // Pole s fokusem nezůstane pod pevnou spodní lištou.
  const b = await zmena.boundingBox();
  const lista = await page.locator('.cesta-lista').boundingBox();
  expect(b!.y + b!.height).toBeLessThanOrEqual(lista!.y);
  await page.keyboard.type('Lajky jsem dal do prázdných už tehdy.');
  // Mezi polem a lištou kroku stojí ještě odkazy pod blokem a v patičce („Pro učitele: připravit hodinu“).
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  for (let i = 0; i < 6 && !(await dokoncit.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(dokoncit).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${C6}#hotovo`);
  expect((await zapisy(page, 'cesta6-moje-pravidlo'))[0].odpoved).toBe('Dost je, když mi nic nechybí.');
  expect((await zapisy(page, 'cesta6-moje-pravidlo-zmena'))[0].odpoved).toBe('Lajky jsem dal do prázdných už tehdy.');
});

const ZAVERY = [
  {
    nazev: 'cesta1',
    adresa: `${C1}7/`,
    pravidlo: 'cesta1-moje-pravidlo',
    text: 'Věřím tomu, co obstojí, i když hledám, co by to vyvrátilo.',
    zacatek: { id: 'cesta1-jak-zjistit', druh: 'volba', odpoved: 'D · Zeptám se přátel, co si o mně myslí. Proč: znají mě nejdéle a neřeknou mi jen to, co chci slyšet.' },
    nadpisy: ['Proč'],
  },
  {
    nazev: 'cesta6',
    adresa: `${C6}7/`,
    pravidlo: 'cesta6-moje-pravidlo',
    text: 'Dost je, když mi nic nechybí, i když nic nepřibývá.',
    // Nejdelší možný zápis: šest karet a dvě vlastní na šedesát znaků.
    zacatek: { id: 'cesta6-tri-kose', druh: 'roztrid', odpoved: 'Potřebuju: Vyspat se po probdělé noci; Někdo, komu řeknu, co mě trápí. Těší mě: Páteční pizza s kamarády; Lepší sluchátka, než jaká mám; Nový díl seriálu, o kterém všichni mluví; Lístek na koncert, na který jdou všichni z naší třídy i ze sboru. Prázdné: Sto lajků pod fotkou; Boty, které má půlka školy a které stojí víc než celé lyžování.' },
    nadpisy: ['Potřebuju', 'Těší mě', 'Prázdné'],
  },
  {
    nazev: 'cesta5',
    adresa: `${C5}8/`,
    pravidlo: 'cesta5-moje-pravidlo',
    text: 'V rukou mám to, co udělám. Na zbytku mi záleží, ale nestojím na něm.',
    zacatek: { id: 'cesta5-tri-kose', druh: 'roztrid', odpoved: 'Mám v rukou: Kolik času se na ni učím; Co odpovím, když mě někdo urazí. Zčásti: Známka ze čtvrtletky; Co si o mně myslí třída; Jestli budu v sobotu zdravý na zápas; Že se leknu, když mě vyvolají; Hádka s bráchou kvůli nabíječce. Nemám v rukou: Jestli mi odepíše; Jestli mi někdo ukradne kolo.' },
    nadpisy: ['Mám v rukou', 'Zčásti', 'Nemám v rukou'],
  },
];

for (const z of ZAVERY) {
  for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
    for (const rezim of ['light', 'dark'] as const) {
      test(`závěr ${z.nazev} s počáteční odpovědí · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
        await page.setViewportSize({ width: sirka, height: vyska });
        await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
        await page.goto(z.adresa);
        await ulozZapisy(page, [z.zacatek, { id: z.pravidlo, odpoved: z.text }]);
        await page.reload();
        await pripravit(page);
        const p = panel(page);
        await expect(p.locator('.cast__nadpis')).toHaveText(z.nadpisy);
        await expect(p.getByRole('textbox').first()).toHaveValue(z.text);
        await expect(p.getByRole('textbox', { name: /Co se změnilo/ })).toBeVisible();
        // Dlouhý zápis se čte: každý řádek se vejde do panelu, písmo má aspoň 16 px a nic nepřetéká.
        const ctivost = await p.locator('.zacatek').evaluate((el) => {
          const o = el.getBoundingClientRect();
          const radky = [...el.querySelectorAll('.cast p:not(.cast__nadpis), .cast li')];
          return {
            pocet: radky.length,
            pismo: Math.min(...radky.map((r) => parseFloat(getComputedStyle(r).fontSize))),
            uvnitr: radky.every((r) => { const b = r.getBoundingClientRect(); return b.left >= o.left && b.right <= o.right + 0.5; }),
            presah: el.scrollWidth - el.clientWidth,
          };
        });
        expect(ctivost.pocet).toBeGreaterThan(0);
        expect(ctivost.pismo).toBeGreaterThanOrEqual(16);
        expect(ctivost.uvnitr).toBe(true);
        expect(ctivost.presah).toBeLessThanOrEqual(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        await axe(page);
        await page.addStyleTag({ content: '.cesta-lista, .cesta-hlavicka { position: static !important; }' });
        await page.screenshot({ path: `test-results/snimky/zaver-${z.nazev}-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, fullPage: true });
      });
    }
  }
}
