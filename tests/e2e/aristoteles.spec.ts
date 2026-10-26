// Portrét Aristotela (celek 5, P7): bloky pěti kapitol v čtenářském sloupci, pravidla textu (co nese cesta 4,
// tradované jako „Vypráví se“, citlivá místa bez omluvy), deska s odlitkem a druhý obraz, Kam dál.
// Doba a lidé a mini mapa: tests/e2e/mini-mapa.spec.ts.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ARISTOTELES = '/osobnost/aristoteles/';

async function pripravBlok(page: Page, id: string, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator(`astro-island[component-url*="${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

async function snimek(page: Page, blok: Locator, nazev: string) {
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .obsah-lista { visibility: hidden !important; }' });
  const r = await blok.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}

/** Tlačítko Dát sem a název koše se vejdou do koše (v čtenářském sloupci je blok užší než v kroku cesty). */
async function koseDrzi(blok: Locator) {
  const presahy = await blok.locator('.kos').evaluateAll((kose) => kose.map((k) => {
    const r = k.getBoundingClientRect();
    return Math.max(...[...k.querySelectorAll('.kos__nazev, .kos__sem')].map((e) => e.getBoundingClientRect().right - r.right));
  }));
  for (const p of presahy) expect(p).toBeLessThanOrEqual(0);
}

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Aristotelés: bloky kapitol · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const r = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
      await page.goto(ARISTOTELES);
      const sem = (blok: Locator, kos: string) => blok.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });

      // 01: Odkryj; srovnání se ptá na oko a koně, Aristotelovu odpověď říká až citát za blokem.
      const ctnost = await pripravBlok(page, 'aristoteles-ctnost', 'Odkryj');
      await ctnost.locator('textarea').fill('Slušný člověk.');
      await ctnost.getByRole('button', { name: 'Porovnat s Aristotelem' }).click();
      const srovnani = ctnost.getByRole('region', { name: 'Srovnání' });
      await expect(srovnani).toContainText('Začíná u oka a u koně');
      await expect(srovnani).not.toContainText(/dobře vidíme|unese jezdce/);
      await axe(page, '[id="aristoteles-ctnost"]');
      await snimek(page, ctnost, `aristoteles-odkryj-ctnost-${r}`);

      // 02: Roztřiď se třemi koši; delfín dostane zpětnou vazbu podle koše, srovnání říká jen, co je v textu.
      const kam = await pripravBlok(page, 'aristoteles-kam-s-nim', 'Roztrid');
      await koseDrzi(kam);
      const navrchu = kam.locator('.karta__text');
      for (const [karta, kos] of [['Kapr', 'Vodní'], ['Pes', 'Suchozemský'], ['Delfín', 'Vodní'], ['Tuleň', 'Ani jedno'], ['Mořská želva', 'Vodní'], ['Žába', 'Ani jedno']]) {
        await expect(navrchu).toHaveText(karta);
        await sem(kam, kos).click();
      }
      await kam.getByRole('button', { name: 'Mám roztříděno' }).click();
      const trideni = kam.getByRole('region', { name: 'Tvoje třídění' });
      await expect(trideni).toContainText('Dal jsi ho mezi vodní: celý život je v moři.');
      await expect(trideni).toContainText('Čím se liší od delfína: jen tím, že na břeh vyleze?');
      await expect(kam.getByRole('heading', { name: 'Jak to třídil Aristotelés' })).toBeVisible();
      await expect(trideni).toContainText('je třeba upřesnit, co slovo vodní znamená');
      await axe(page, '[id="aristoteles-kam-s-nim"]');
      await snimek(page, kam, `aristoteles-roztrid-kam-${r}`);

      // 03: Roztřiď se čtyřmi koši: v čtenářském sloupci po dvou, na telefonu pod sebou.
      const proc = await pripravBlok(page, 'aristoteles-ctyri-proc', 'Roztrid');
      await koseDrzi(proc);
      const sirkyKosu = await proc.locator('.kos').evaluateAll((k) => k.map((e) => Math.round(e.getBoundingClientRect().width)));
      for (const s of sirkyKosu) expect(s).toBeGreaterThan(200);
      const sloupcu = new Set(await proc.locator('.kos').evaluateAll((k) => k.map((e) => Math.round(e.getBoundingClientRect().left)))).size;
      expect(sloupcu).toBe(sirka === 390 ? 1 : 2);
      for (const kos of ['Z čeho je', 'Co to je', 'Odkud se vzal', 'K čemu je', 'Odkud se vzal', 'Z čeho je']) await sem(proc, kos).click();
      await proc.getByRole('button', { name: 'Mám roztříděno' }).click();
      const odpovedi = proc.getByRole('region', { name: 'Tvoje třídění' });
      await expect(odpovedi).toContainText('Dal jsi peníze k tomu, z čeho most je.');
      await expect(odpovedi).toContainText('Dá se tak odpovědět i na otázku, proč prší?');
      await expect(odpovedi).toContainText('Šest odpovědí o mostu si proto nepřekáží.');
      await axe(page, '[id="aristoteles-ctyri-proc"]');
      await snimek(page, proc, `aristoteles-roztrid-proc-${r}`);

      // 04: Změň jednu věc; zpětná vazba ví jen, jestli se odhad změnil, a nikoho nekárá.
      const zbude = await pripravBlok(page, 'aristoteles-co-zbude', 'ZmenJednuVec');
      await expect(zbude).toContainText('Představ si spolužáka');
      await zbude.getByRole('radio', { name: 'Vydrží.' }).check({ force: true });
      await zbude.getByRole('button', { name: 'Rozhodnuto' }).click();
      await zbude.getByRole('radio', { name: 'Přestoupí na jinou školu' }).check({ force: true });
      await zbude.locator('.zmenena').getByRole('radio', { name: 'Vydrží.' }).check({ force: true });
      await zbude.locator('.zmenena').getByRole('button').click();
      const posun = zbude.getByRole('region', { name: 'Posun odpovědi' });
      await expect(posun).toContainText('Tvoje odpověď zůstala stejná.');
      await expect(posun).toContainText('Na společné práci tvůj odhad nestojí.');
      await expect(zbude.getByRole('heading', { name: 'Co by na to řekl Aristotelés' })).toBeVisible();
      await expect(zbude).toContainText('Neříká, že nebylo opravdové.');
      await zbude.getByRole('radio', { name: 'Legrace s ním teď není' }).check({ force: true });
      await zbude.locator('.zmenena').getByRole('radio', { name: 'Ochladne.' }).check({ force: true });
      await zbude.locator('.zmenena').getByRole('button').click();
      await expect(posun).toContainText('Tvoje odpověď se posunula.');
      await expect(posun).toContainText('Kolik z toho, co vás drželo pohromadě, byla ta legrace?');
      await axe(page, '[id="aristoteles-co-zbude"]');
      await snimek(page, zbude, `aristoteles-zmena-zbude-${r}`);

      // 05: Volba s oddílem Co udělal: jen doložený odchod do Chalkidy; větu o Athéňanech říká až text.
      const odchod = await pripravBlok(page, 'aristoteles-odchod', 'Volba');
      await odchod.getByText('Zůstanu a budu se hájit.').click();
      await odchod.getByRole('button', { name: 'Tohle je můj tah' }).click();
      await expect(odchod.getByRole('heading', { name: 'Co udělal Aristotelés' })).toBeVisible();
      const zpetna = odchod.getByRole('region', { name: 'Zpětná vazba' });
      await expect(zpetna).toContainText('Odešel. Usadil se v Chalkidě');
      await expect(zpetna).not.toContainText(/podruhé|filozofii/);
      await axe(page, '[id="aristoteles-odchod"]');
      await snimek(page, odchod, `aristoteles-volba-odchod-${r}`);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      // Obnovení stránky drží třídění i rozhodnutí.
      await page.reload();
      const znovu = await pripravBlok(page, 'aristoteles-odchod', 'Volba');
      await expect(znovu.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Tvůj tah: zůstat a hájit se.');
    });
  }
}

test('Aristotelés: text drží pravidla celku (co nese cesta 4, tradované příběhy, citlivá místa)', async ({ page }) => {
  await page.goto(ARISTOTELES);
  const text = (await page.locator('.obsah').evaluate((e) => [...e.querySelectorAll('.uvod, .kapitola')].map((k) => k.textContent).join(' '))).replace(/\s+/g, ' ');
  // Laguna: text netvrdí, že u ní stál ani že tam rozbíjel vejce.
  expect(text).toContain('Ve spisech, které Aristotelés věnoval živočichům, se to místo vrací znovu a znovu.');
  expect(text).not.toMatch(/rozbíjel|stál u laguny|na břehu laguny/);
  // Tradované jako „Vypráví se“; „asi“ zůstává „asi“.
  expect(text.match(/Vypráví se, že/g)!.length).toBeGreaterThanOrEqual(4);
  for (const veta of ['Asi dva roky žil Aristotelés na Lesbu', 'Asi v sedmnácti', 'Bylo mu asi dvaašedesát', 'o kterém se vyprávělo, že začínal jako otrok', 'dvanáct nebo třináct let', 'dva nebo tři roky']) expect(text).toContain(veta);
  // Co do portrétu nepatří: co už atlas říká a co nese cesta 4; výroky a příběhy, které podklady vylučují.
  expect(text).not.toMatch(/zlatý střed|Hříbě|akonit|otráv|kořeny vzdělání|opakovaně děláme|\bKleit|Milón|kithar|stavitel|vlaštovk|věnc|Mieza|Íliad|Kallisthen|šišlal|prsten/i);
  expect(text).not.toMatch(/dopis/i);
  // Etika středu a zvyku jednou větou s odkazem na cestu; úsudek a tvor obce po jedné větě.
  expect(text.match(/správnou míru/g)).toHaveLength(1);
  expect(text.match(/tvor obce/g)).toHaveLength(1);
  expect(text.match(/závěr z předpokladů/g)).toHaveLength(1);
  // Jména: Filip jednou; Herpyllis, Níkomachos a Cicero popsaní, ne jmenovaní.
  expect(text.match(/Filip/g)).toHaveLength(1);
  expect(text).not.toMatch(/Herpyll|Níkomachos\b|Cicer|Amynt|Eurymed|Apellik|Sull|Sképs/);
  // Citlivá místa: odpůrci mluví jeho citátem, kde si nebyl jistý, odkaz na Epiktéta, žádná omluva.
  await expect(page.locator('#delfin .citat').filter({ hasText: 'proti přírodě' })).toHaveCount(1);
  for (const veta of ['A odmítl ho.', 'Jeho vlastní výklad s tím přitom na třech místech neladí.', 'k němu jako k člověku ano', 'Otroky měl až do smrti.']) expect(text).toContain(veta);
  await expect(page.locator('#delfin a[href="/osobnost/epiktetos/"]')).toHaveText('Epiktétos');
  expect(text).not.toMatch(/dítě své doby|své době|tehdy to tak|omluv/i);
  // Námitku ve Fyzice napsal sám; věta o biologii je střídmá.
  expect(text).toContain('Zapsal ji sám, v plné síle, a teprve potom odpověděl.');
  expect(text).not.toMatch(/Darwin|evoluc|dokázal/i);
  // Čtrnáct citátů, každý jednou; hlavní citát jen pod úvodem.
  const citaty = await page.locator('.obsah .citat').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  expect(citaty).toHaveLength(14);
  expect(new Set(citaty).size).toBe(14);
  await expect(page.locator('.kapitola .citat').filter({ hasText: 'dětinsky štítit' })).toHaveCount(0);
  // Kam dál: cesta 4 jako první, portréty Platóna a Epiktéta a otázka 1 jako poslední.
  const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
  await expect(kamDal.getByRole('link')).toHaveText([/Cesta\s*Stačí vědět, co je správné\?/, /Platón/, /Epiktétos/, /Velká otázka 1\s*Jak mám žít\?/]);
  await expect(kamDal.getByRole('link').first()).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  await expect(kamDal.getByRole('link').last()).toHaveAttribute('href', '/otazka/jak-zit/');
  // Kapitoly 01 a 04 na cestu odkazují názvem; hlavička profilu ji nabízí jako první vstup.
  await expect(page.locator('#syn-lekare').getByRole('link', { name: 'Stačí vědět, co je správné?' })).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  await expect(page.locator('#skola-a-pratele').getByRole('link', { name: 'Stačí vědět, co je správné?' })).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  await expect(page.locator('.vstupy-osoby a').first()).toHaveText(/Cesta · 8 kroků · asi \d+ minut\s*Stačí vědět, co je správné\?/);
  await expect(page.locator('.vstupy-osoby a').first()).toHaveAttribute('href', '/cesta/staci-vedet-co-je-spravne/');
  // Kdo žil dřív? má dvojici, která na jiných stránkách není.
  await expect(page.locator('[id="kdo-sokrates-aristoteles-vzdalenost"]')).toContainText('Sókratés a Aristotelés');
});

test('Aristotelés: deska s odlitkem, druhý obraz a Zkus to žít', async ({ page }) => {
  const stred = () => page.locator('.osobnost__deska img').evaluate((img) => getComputedStyle(img).objectPosition);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(ARISTOTELES);
  expect(await stred()).toBe('50% 20%');
  const popisek = page.locator('.osobnost__deska .obraz-popisek');
  await expect(popisek).toContainText('Sádrový odlitek mramorové hlavy z Vídně');
  await expect(popisek).not.toContainText(/římsk|Lýsipp/i);
  // Atribut u desky neříká „ctnost“ dřív, než ji kapitola 01 vyloží.
  await expect(page.locator('.osobnost__deska')).toContainText('Správná míra leží mezi dvěma krajnostmi a není pro každého stejná.');
  // Rembrandt stojí v kapitole 05 a popisek říká, čí je to představa a z kdy.
  const rembrandt = page.locator('#podruhe-ne .pribeh');
  await expect(rembrandt.locator('img')).toHaveAttribute('src', /aristoteles-rembrandt-met\.jpg$/);
  await expect(rembrandt).toContainText('jak si ho roku 1653 představil Rembrandt');
  // Zkus to žít nemíří na člověka.
  await expect(page.locator('#zkus-to-zit')).toContainText('Nevybírej si člověka.');
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await stred()).toBe('50% 30%');
});
