// Profily Hérakleita a Parmenida (celek 7, P7): bloky v čtenářském sloupci, pravidla textu (co je zlomek a co svědectví,
// v básni mluví bohyně, nikdo netvrdí, že jeden reagoval na druhého), deska s obrazem a bez obrazu, Kam dál s cestou,
// která teprve vznikne, a oddíl Doba a lidé na stránkách, kterým přibyl vztah.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const HERAKLEITOS = '/osobnost/herakleitos/';
const PARMENIDES = '/osobnost/parmenides/';

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

const cisty = (s: string | null) => (s ?? '').replace(/\s+/g, ' ');
const sem = (blok: Locator, kos: string) => blok.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });
const skupina = (page: Page, nazev: string) => page.locator('.doba__vztahy > div').filter({ has: page.getByRole('heading', { name: nazev, exact: true }) });

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;

    test(`Hérakleitos: bloky kapitol · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(HERAKLEITOS);

      // 01: Roztřiď se třemi koši. Karty jsou věci; zlomek B12 blok neopakuje, jen na něj ukáže.
      const trva = await pripravBlok(page, 'herakleitos-co-trva', 'Roztrid');
      const presahy = await trva.locator('.kos').evaluateAll((kose) => kose.map((k) => {
        const b = k.getBoundingClientRect();
        return Math.max(...[...k.querySelectorAll('.kos__nazev, .kos__sem')].map((e) => e.getBoundingClientRect().right - b.right));
      }));
      for (const p of presahy) expect(p).toBeLessThanOrEqual(0);
      for (const kos of ['Tím, že se nemění', 'Tím, že se mění', 'Tím, že se mění', 'Tím, že se mění', 'Jak se to vezme', 'Tím, že se nemění', 'Tím, že se mění', 'Jak se to vezme']) await sem(trva, kos).click();
      await trva.getByRole('button', { name: 'Mám roztříděno' }).click();
      const trideni = trva.getByRole('region', { name: 'Tvoje třídění' });
      await expect(trideni).toContainText('Dal jsi řeku mezi věci, které trvají tím, že se nemění.');
      await expect(trideni).toContainText('Dal jsi sochu mezi věci, které trvají tím, že se mění.');
      await expect(trideni).toContainText('O čem jsi rozhodoval: o ledu, nebo o rybníku?');
      await expect(trva.getByRole('heading', { name: 'Hérakleitův příklad' })).toBeVisible();
      await expect(trva).toContainText('jsou řeky tytéž a vody jiné');
      await expect(trva).not.toContainText(/tečou jiné a zase jiné vody|správně|špatně/i);
      await axe(page, '[id="herakleitos-co-trva"]');
      await snimek(page, trva, `herakleitos-roztrid-${r}`);

      // 01: Odkryj se dvěma zněními. Platónovo „dvakrát“ je svědectví, ne podvrh; o hesle jen dvě věty.
      const vety = await pripravBlok(page, 'herakleitos-dve-vety', 'Odkryj');
      await expect(vety).toContainText('„Dvakrát do téže řeky nevstoupíš.“ Kterou z nich napsal Hérakleitos?');
      await vety.locator('textarea').fill('Tu první, ve druhé už řeka není táž.');
      await vety.getByRole('button', { name: 'Porovnat s prameny' }).click();
      const srovnani = vety.getByRole('region', { name: 'Srovnání' });
      await expect(srovnani).toContainText('Věta z úvodu je zlomek jeho knihy.');
      await expect(srovnani).toContainText('Hérakleitos tuším říká, že všechno je v pohybu a nic nezůstává.');
      await expect(srovnani).toContainText('Vymyšlená tedy není: tak Hérakleita podávají Platón a Aristotelés.');
      await expect(srovnani).toContainText('A heslo „všechno plyne“? Mezi větami, které se z Hérakleitovy knihy dochovaly, není. Připsali mu ho pozdější čtenáři.');
      await expect(srovnani).not.toContainText(/nikdy|neřekl|Simplik|tisíc let|podvrh/i);
      await axe(page, '[id="herakleitos-dve-vety"]');
      await snimek(page, vety, `herakleitos-odkryj-${r}`);

      // 02: Změň jednu věc; zlomek o luku a lyře stojí až za blokem.
      const luk = await pripravBlok(page, 'herakleitos-luk', 'ZmenJednuVec');
      await luk.getByRole('radio', { name: 'Pošle ho daleko.' }).check({ force: true });
      await luk.getByRole('button', { name: 'Rozhodnuto' }).click();
      await luk.getByRole('radio', { name: 'Povol tětivu' }).check({ force: true });
      await luk.locator('.zmenena').getByRole('radio', { name: 'Nepošle ho nikam.' }).check({ force: true });
      await luk.locator('.zmenena').getByRole('button').click();
      const posun = luk.getByRole('region', { name: 'Posun odpovědi' });
      await expect(posun).toContainText('Tvoje odpověď se posunula.');
      await expect(posun).toContainText('Dřevo se přitom nezměnilo.');
      await expect(luk.getByRole('heading', { name: /Co udělal|Co by na to/ })).toHaveCount(0);
      await expect(luk).not.toContainText(/lyr|napjaté proti sobě/);
      await axe(page, '[id="herakleitos-luk"]');
      await snimek(page, luk, `herakleitos-zmena-luk-${r}`);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });

    test(`Parmenidés: bloky kapitol · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(PARMENIDES);

      // 01: Roztřiď; karty jsou věci a blok nemá vlastní kartu.
      const neni = await pripravBlok(page, 'parmenides-co-neni', 'Roztrid');
      await expect(neni.getByText(/Přidej/)).toHaveCount(0);
      for (const kos of ['Je', 'Je, ale jinak', 'Není', 'Je, ale jinak', 'Není', 'Je, ale jinak']) await sem(neni, kos).click();
      await neni.getByRole('button', { name: 'Mám roztříděno' }).click();
      const trideni = neni.getByRole('region', { name: 'Tvoje třídění' });
      await expect(trideni).toContainText('Dal jsi jednorožce mezi věci, které jsou.');
      await expect(trideni).toContainText('Mluvíš o díře, nebo o ponožce kolem ní?');
      await expect(neni.getByRole('heading', { name: 'Co říká bohyně v Parmenidově básni' })).toBeVisible();
      await expect(neni).toContainText('Bohyně v básni říká, že to, co není, se nedá poznat ani vyslovit.');
      await axe(page, '[id="parmenides-co-neni"]');
      await snimek(page, neni, `parmenides-roztrid-${r}`);

      // 02: Změň jednu věc; verš o jménech a Aristotelova odpověď stojí až za blokem.
      const banan = await pripravBlok(page, 'parmenides-banan', 'ZmenJednuVec');
      await banan.getByRole('radio', { name: 'Změnil se. Je to pořád on.' }).check({ force: true });
      await banan.getByRole('button', { name: 'Rozhodnuto' }).click();
      await banan.getByRole('radio', { name: 'Shnije' }).check({ force: true });
      await banan.locator('.zmenena').getByRole('radio', { name: 'Zanikl. Tohle už je něco jiného.' }).check({ force: true });
      await banan.locator('.zmenena').getByRole('button').click();
      const posun = banan.getByRole('region', { name: 'Posun odpovědi' });
      await expect(posun).toContainText('Tvoje odpověď se posunula.');
      await expect(posun).toContainText('Kde přesně mezi žlutou a hnědou leží hranice?');
      await expect(banan.getByRole('heading', { name: /Co udělal|Co by na to/ })).toHaveCount(0);
      await expect(banan).not.toContainText(/jméno|vzdělan/);
      await axe(page, '[id="parmenides-banan"]');
      await snimek(page, banan, `parmenides-zmena-banan-${r}`);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });
  }
}

test('Hérakleitos: text drží pravidla celku (zlomek × svědectví, válka uvnitř výkladu, žádné legendy)', async ({ page }) => {
  await page.goto(HERAKLEITOS);
  const uvod = cisty((await page.locator('.uvod').allTextContents()).join(' '));
  const text = cisty(await page.locator('.obsah').evaluate((e) => [...e.querySelectorAll('.uvod, .kapitola')].map((k) => k.textContent).join(' ')));
  const protiklady = cisty(await page.locator('#luk-a-lyra').textContent());

  // Úvod: scéna jako tradovaná, pointa jeho vlastní větou (celý zlomek i s kletbou) a jedna věta o tom, co víme.
  expect(uvod).toMatch(/^\s*Vypráví se, že Efesané chtěli po Hérakleitovi, aby jim napsal zákony\./);
  expect(uvod).toContain('hrál tam s dětmi kostky');
  expect(uvod).toContain('Z jeho knihy zbyly jen věty, které si z ní opsali jiní. Všechno ostatní se o něm vypráví.');
  const citaty = await page.locator('.obsah .citat').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  expect(citaty[0]).toContain('Efesané by zasloužili, aby všichni dospělí do jednoho zemřeli a město nechali nedospělým. Vyhnali přece Hermodóra');
  // Zlomek B12 je velký citát a jako citát na stránce stojí jen jednou (podruhé ho ponese cesta 2).
  expect(citaty[1]).toContain('Na ty, kdo vstupují do týchž řek, tečou jiné a zase jiné vody.');
  expect(citaty.filter((c) => c.includes('tečou jiné a zase jiné vody'))).toHaveLength(1);
  expect(new Set(citaty).size).toBe(citaty.length);

  // „Napsal“ u zlomku, „podle Platóna“ u svědectví; žádná nauka, žádné heslo mimo Odkryj, žádné legendy.
  expect(text).not.toMatch(/učil, že|učení, že|nikdy (to )?neřekl|Simplik|panta|Darei|hnůj|hnoj|vodnatel|nenávid|pyšn|melanchol|plač|uplakan/i);
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toContainText('Hérakleitos jako plačící filozof, jak si ho kolem roku 1630 představil španělský malíř. Uplakaného z něj udělali až Římané');
  for (const veta of ['Aristotelés vypráví o jednom z nich, Kratylovi.', 'Platón nechává Sókrata říct, kam taková nauka vede.', 'Míří ta odpověď na Hérakleita, nebo na Kratyla?']) expect(text).toContain(veta);

  // Zlomek o válce: doslova, celý, uvnitř výkladu o protikladech (za lukem a lyrou), s výkladem jako výkladem a s otázkou.
  expect(protiklady.indexOf('Válka je všemu otcem a všemu králem.')).toBeGreaterThan(protiklady.indexOf('spojení napjaté proti sobě jako u luku a lyry'));
  expect(protiklady).toContain('z jedněch udělala otroky, z druhých svobodné');
  expect(protiklady).toContain('Kdo tu větu čte vedle luku a lyry, rozumí jí jinak. Hérakleitos podle takového čtení neříká, že válka je dobrá.');
  expect(protiklady).toContain('Dá se o střetu říct, že drží svět, a neříct tím, že je dobrý?');
  expect(cisty(await page.locator('#luk-a-lyra').textContent()).indexOf('Válka je všemu otcem')).toBeGreaterThan(900);
  // Aristotelova námitka je otázka, ne rozsudek; profil nerozhoduje, co si Hérakleitos myslel.
  expect(protiklady).toContain('Tvrdí Hérakleitos, že totéž je i není?');
  expect(protiklady).not.toMatch(/mýlil|vyvrátil|ve skutečnosti myslel/i);
  // Konec: kniha v chrámu, Temný, potápěč jen nepřímo a poslední slovo má on.
  for (const veta of ['Vypráví se, že ji Hérakleitos uložil v Artemidině chrámu.', 'Už ve starověku mu říkali Temný.', 'Jen by to prý chtělo potápěče z Délu.']) expect(protiklady).toContain(veta);
  expect(citaty.at(-1)).toContain('Hledal jsem sám sebe.');

  // Dvojice: nikdo na nikoho nereagoval. Co atlas vypráví jinde (pec, loď, dlužník), profil nevypráví.
  const doba = cisty(await page.locator('.doba__uvod').textContent());
  expect(doba).toContain('Jestli jeden o druhém věděl, nevíme. O sto let později je Platón postavil proti sobě jako dva tábory.');
  const cela = cisty(await page.locator('.obsah').textContent());
  expect(cela).not.toMatch(/Parmenid\S* (mu )?(odpověděl|reagoval|namítl)|přel se s Parmenid|proti Parmenid|Thése|dlužník|i tady jsou bohové/i);
  await expect(page.locator('.doba__uvod a[href="/osobnost/aristoteles/#delfin"]')).toHaveText('u pece');
  await expect(page.locator('.doba__vztahy')).not.toContainText('Parmenidés');
  await expect(skupina(page, 'Kdo se s ním přel později')).toContainText('Aristotelés');
  await expect(skupina(page, 'Kdo se s ním přel později')).toContainText('může totéž zároveň být i nebýt?');
  for (const jmeno of ['Platón', 'Plútarchos', 'Seneca', 'Marcus Aurelius']) await expect(skupina(page, 'Četli ho a navázali')).toContainText(jmeno);
  await expect(skupina(page, 'Znali se a přeli se')).toHaveCount(0);

  // Dvě myšlenky z různých disciplín, karta u věcí, Kam dál vede na cestu 2.
  await expect(page.locator('.myslenka__nad')).toHaveText([/1 · Metafyzika/, /2 · Argumentace/]);
  await expect(page.locator('#zkus-to-zit')).toContainText('Třeba strunu na kytaře, stan se šňůrami nebo napnutou síť na hřišti.');
  await expect(page.locator('#zkus-to-zit')).not.toContainText(/hádk|přátel|rodin|spolužá/i);
  const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
  await expect(kamDal.locator('.polozka--ceka')).toHaveCount(0);
  await expect(kamDal.getByRole('link')).toHaveText([/Cesta\s*Jsem pořád tentýž, když se měním\?/, /Profil\s*Parmenidés/, /Portrét\s*Platón/, /Velká otázka 6\s*Co je skutečné\?/]);
  await expect(kamDal.getByRole('link').first()).toHaveAttribute('href', '/cesta/jsem-porad-tentyz-kdyz-se-menim/');
  await expect(page.locator('[id="kdo-herakleitos-parmenides-poradi"]')).toContainText('Hérakleitos, nebo Parmenidés?');
});

test('Parmenidés: text drží pravidla celku (mluví bohyně, dvojí čtení, žádný rozsudek o změně)', async ({ page }) => {
  await page.goto(PARMENIDES);
  const uvod = cisty((await page.locator('.uvod').allTextContents()).join(' '));
  const text = cisty(await page.locator('.obsah').evaluate((e) => [...e.querySelectorAll('.uvod, .kapitola')].map((k) => k.textContent).join(' ')));
  const zmena = cisty(await page.locator('#zmena-pod-lupou').textContent());

  // Úvod je začátek básně; od brány mluví bohyně. Život krátce a s typem tvrzení.
  expect(uvod).toMatch(/^\s*Báseň začíná jízdou\. Vypráví ji mladý muž/);
  for (const veta of ['Před nimi stojí brána, kterou chodí Noc a Den.', 'Narodil se tam kolem roku 515 př. n. l.', 'Vypráví se, že svému městu napsal zákony', 'Od brány dál v básni mluví bohyně.']) expect(uvod.replace(/ /g, ' ')).toContain(veta);
  const citaty = await page.locator('.obsah .citat').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  expect(citaty).toHaveLength(8);
  expect(new Set(citaty).size).toBe(8);
  expect(citaty[1]).toContain('Nebylo a nebude, protože je teď, celé najednou, jedno, souvislé.');
  // Citát stránky otázky 6 tu není.
  expect(citaty.join(' ')).not.toContain('co by to přimělo vzniknout později');

  // V básni mluví bohyně: nic „nedokázal“. O změně stránka neříká „popírá“ ani „nepopírá“.
  expect(text).not.toMatch(/dokázal|vyvrátil|změnu (ne)?popír|popír\S* změnu|změna neexistuje|změna je (jen )?(klam|iluze)|milen|miláč|Achill|želv/i);
  for (const veta of ['Bohyně jde ještě dál.', 'Bohyně ten rozdíl nedělá.', 'Proto bohyně říká větu z úvodu']) expect(text).toContain(veta);
  // Námitky nesou jiní: Platónův host z Eleje a Aristotelés; spojovací věta netvrdí, že Aristotelés odpovídal Parmenidovi.
  expect(text).toContain('V jednom svém rozhovoru nechává mluvit hosta z Parmenidova města.');
  expect(text).toContain('Aristotelés se na změnu díval jinak.');
  expect(text).not.toMatch(/Aristotelés (mu|Parmenidovi) odpověděl|proti Parmenidovi/);
  // Druhé čtení je spor čtenářů od starověku, bez redakční výhrady, a kapitola končí otázkou.
  for (const veta of ['Čtenáři se o to přou od starověku.', 'Epikurejec Kólótés Parmenidovi vyčítal, že podle něj se nedá žít.', 'Jedni tedy v básni čtou, že svět, který vidíme, není. Druzí, že je, jen se o něm nedá vědět tolik jako o tom, co nemůže nebýt.', 'Co by v těch ztracených verších muselo stát, abys jednomu čtení uvěřil víc než druhému?']) expect(zmena).toContain(veta);
  expect(text).not.toMatch(/badatel|odborní|sporné|není jisté|nevíme jistě|pramen/i);
  // Argument o věci se nepřenáší na člověka větou atlasu.
  expect(text).not.toMatch(/tvoje změna|ty se měníš|ty sám|tvé tělo|tvoje tělo/i);

  // Sókratés jednou větou jako Platónova scéna, Zénón jednou větou, dvojice bez reakce.
  const doba = cisty(await page.locator('.doba__uvod').textContent());
  expect(doba).toContain('Platón líčí, jak jako starý muž přijel do Athén a mluvil tam s velmi mladým Sókratem.');
  expect(doba).toContain('Jeho mladším druhem byl Zénón z Eleje.');
  expect(doba).toContain('Říkalo se také, že byl žákem Xenofana.');
  expect(doba).toContain('Jestli jeden o druhém věděl, nevíme. Proti sobě je postavil až Platón, asi o sto let později.');
  const cela = cisty(await page.locator('.obsah').textContent());
  expect(text).not.toContain('Sókrat');
  expect(cela).not.toMatch(/Hérakleit\S* (mu )?(odpověděl|reagoval|namítl)|odpověděl Hérakleit|proti Hérakleit|Thése|dlužník/i);
  await expect(page.locator('.doba__vztahy')).not.toContainText('Hérakleitos');
  await expect(skupina(page, 'Učitelé')).toContainText('Xenofanés');
  await expect(skupina(page, 'Znali se a přeli se')).toContainText('Platón líčí jejich setkání v Athénách');
  await expect(skupina(page, 'Četli ho a navázali')).toContainText('Platón');

  await expect(page.locator('.myslenka__nad')).toHaveText([/1 · Poznání/, /2 · Metafyzika/]);
  await expect(page.locator('#zkus-to-zit')).toContainText('Nikdo tu není. Žádné nové zprávy. Žádný signál.');
  await expect(page.locator('#zkus-to-zit')).not.toContainText(/nic mi není|Nic se nestalo|spolužá|kamarád/i);
  const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
  await expect(kamDal.locator('.polozka--ceka')).toHaveCount(0);
  await expect(kamDal.getByRole('link')).toHaveText([/Cesta\s*Jsem pořád tentýž, když se měním\?/, /Profil\s*Hérakleitos/, /Velká otázka 6\s*Co je skutečné\?/, /Velká otázka 7\s*Jak poznám, co je pravda\?/]);
  await expect(kamDal.getByRole('link').first()).toHaveAttribute('href', '/cesta/jsem-porad-tentyz-kdyz-se-menim/');
  await expect(page.locator('#zmena-pod-lupou').getByRole('link', { name: 'Co je skutečné?' })).toHaveAttribute('href', '/otazka/co-je-skutecne/');
});

test('Hérakleitos a Parmenidés: deska, licence obrazu a karty v Mapě a čase', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(HERAKLEITOS);
  // Věta atributu je zlomek B12 (znění A), ne Platónovo „dvakrát“.
  await expect(page.locator('.osobnost__deska')).toContainText('Do týchž řek vstupujeme, a pořád na nás tečou jiné vody.');
  await expect(page.locator('.osobnost__deska')).not.toContainText('dvakrát');
  await expect(page.locator('.osobnost__deska img')).toHaveAttribute('src', /herakleitos-aic\.jpg$/);
  const licence = page.locator('a[href="https://www.artic.edu/artworks/111428/heraclitus-the-weeping-philosopher"]');
  await expect(licence).toHaveText('CC0 (Public Domain Designation)');
  await expect(page.locator('li').filter({ has: licence })).toContainText('neznámý španělský malíř, kolem 1630 (soubor: The Art Institute of Chicago); zesvětleno');

  // Parmenidés je bez obrazu: deska nese minci atributu.
  await page.goto(PARMENIDES);
  await expect(page.locator('.osobnost__deska img')).toHaveCount(0);
  await expect(page.locator('.osobnost__deska')).toContainText('Proč brána?');
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toHaveCount(0);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-490&osoba=herakleitos');
  await expect(page.locator('#karta-jmeno')).toHaveText('Hérakleitos');
  await expect(page.locator('.mac__karta')).toContainText('Do týchž řek vstupujeme, a pořád na nás tečou jiné vody.');
  await expect(page.locator('.mac__karta')).not.toContainText('nelze vstoupit dvakrát');
  await expect(page.locator('.mac__karta a[href="/osobnost/herakleitos/"]').first()).toBeVisible();
  await page.goto('/mapa/?rok=-470&osoba=parmenides');
  await expect(page.locator('#karta-jmeno')).toHaveText('Parmenidés');
  await expect(page.locator('.mac__karta a[href="/osobnost/parmenides/"]').first()).toBeVisible();
  // Mezi vztahy na kartě není ani jeden z dvojice u druhého.
  await expect(page.locator('.mac__karta .vztahy')).toContainText('Xenofanés');
  await expect(page.locator('.mac__karta .vztahy')).not.toContainText('Hérakleitos');
});

test('Doba a lidé na stránkách, kterým přibyl vztah (Sókratés, Aristotelés, Seneca, Marcus Aurelius)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/sokrates/');
  await expect(skupina(page, 'Znali se a přeli se')).toContainText('Parmenidés');
  await expect(skupina(page, 'Znali se a přeli se')).toContainText('Platón líčí jejich setkání v Athénách');
  await page.goto('/osobnost/aristoteles/');
  await expect(skupina(page, 'S kým se přel na dálku')).toContainText('Hérakleitos');
  await expect(skupina(page, 'S kým se přel na dálku')).toContainText('může totéž zároveň být i nebýt?');
  await expect(skupina(page, 'Znali se a přeli se')).not.toContainText('Hérakleitos');
  for (const adresa of ['/osobnost/seneca/', '/osobnost/marcus-aurelius/']) {
    await page.goto(adresa);
    await expect(skupina(page, 'Koho četl')).toContainText('Hérakleitos');
    await expect(skupina(page, 'Koho četl')).toContainText('znal ho z textů');
    // Jen četl: Hérakleitos nestojí v žádné jiné skupině.
    await expect(page.locator('.doba__vztahy > div').filter({ hasText: 'Hérakleitos' })).toHaveCount(1);
  }
});
