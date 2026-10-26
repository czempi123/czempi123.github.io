// Portrét Seneky (celek 6, P7): čtyři bloky v čtenářském sloupci, pravidla textu (Senekova smrt bez způsobu,
// slovo „sebevražda“ jen s rozkazem, co říká Tacitus, říká Tacitus, co portrét nechává cestám), deska s hermou,
// Prameny s licencí, tichý řádek pomoci a Doba a lidé.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SENECA = '/osobnost/seneca/';

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

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Seneca: bloky kapitol · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const r = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
      await page.goto(SENECA);
      const sem = (blok: Locator, kos: string) => blok.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });

      // 01: Roztřiď se třemi koši; srovnání říká Senekovo měřítko, jeho větu o škole až citát za blokem.
      const skola = await pripravBlok(page, 'seneca-skola-zivot', 'Roztrid');
      const presahy = await skola.locator('.kos').evaluateAll((kose) => kose.map((k) => {
        const b = k.getBoundingClientRect();
        return Math.max(...[...k.querySelectorAll('.kos__nazev, .kos__sem')].map((e) => e.getBoundingClientRect().right - b.right));
      }));
      for (const p of presahy) expect(p).toBeLessThanOrEqual(0);
      for (const kos of ['Pro školu', 'Pro školu', 'Pro školu', 'Pro život', 'Pro obojí', 'Pro život', 'Pro obojí', 'Pro život']) await sem(skola, kos).click();
      await skola.getByRole('button', { name: 'Mám roztříděno' }).click();
      const trideni = skola.getByRole('region', { name: 'Tvoje třídění' });
      await expect(trideni).toContainText('Dal jsi omluvu ke škole.');
      await expect(trideni).toContainText('Učí tě to škola, nebo to, že v ní občas prohraješ?');
      await expect(skola.getByRole('heading', { name: 'Senekovo měřítko' })).toBeVisible();
      await expect(skola).toContainText('jestli je po tom lepší, nebo jen učenější');
      await expect(skola).not.toContainText(/Neučíme se/);
      await axe(page, '[id="seneca-skola-zivot"]');
      await snimek(page, skola, `seneca-roztrid-skola-${r}`);

      // 03: Volba bez oddílu Co udělal; zpětná vazba rozlišuje odklad od mlčení.
      const zprava = await pripravBlok(page, 'seneca-zprava', 'Volba');
      await zprava.getByText('Za hodinu, až vychladnu.').click();
      await zprava.getByRole('button', { name: 'Tohle je můj tah' }).click();
      await expect(zprava.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Zpráva bude za hodinu stejná, jiný budeš ty.');
      await expect(zprava.getByRole('heading', { name: /Co udělal/ })).toHaveCount(0);
      await axe(page, '[id="seneca-zprava"]');

      // 04: zůstat, nebo odejít. Žádná možnost není Senekova a žádná nedostane pokárání.
      const dvur = await pripravBlok(page, 'seneca-zustat-odejit', 'Volba');
      await dvur.getByText('Odejdu. Nechci, aby pod tím stálo moje jméno.').click();
      await dvur.getByRole('button', { name: 'Tohle je můj tah' }).click();
      const zpetna = dvur.getByRole('region', { name: 'Zpětná vazba' });
      await expect(zpetna).toContainText('od císaře se neodchází jako z brigády: pustí tě?');
      await expect(zpetna).not.toContainText(/zbaběl|správně|špatně|Cassi/i);
      await expect(dvur.getByRole('heading', { name: /Co udělal/ })).toHaveCount(0);
      await axe(page, '[id="seneca-zustat-odejit"]');
      await snimek(page, dvur, `seneca-volba-dvur-${r}`);

      // 05: Změň jednu věc; pravidlo z Dopisu 47 blok neprozradí.
      const niz = await pripravBlok(page, 'seneca-nekdo-niz', 'ZmenJednuVec');
      await niz.getByRole('radio', { name: 'Počkám a nic neřeknu.' }).check({ force: true });
      await niz.getByRole('button', { name: 'Rozhodnuto' }).click();
      await niz.getByRole('radio', { name: 'Za pokladnou je majitel' }).check({ force: true });
      await niz.locator('.zmenena').getByRole('radio', { name: 'Řeknu mu, ať si pospíší.' }).check({ force: true });
      await niz.locator('.zmenena').getByRole('button').click();
      const posun = niz.getByRole('region', { name: 'Posun odpovědi' });
      await expect(posun).toContainText('Tvoje odpověď se posunula.');
      await expect(posun).toContainText('Chyba i autobus zůstaly stejné.');
      await expect(niz.getByRole('heading', { name: 'Co by na to řekl Seneca' })).toBeVisible();
      await expect(niz).toContainText('postavení, které má na sobě jako šaty');
      await expect(niz).not.toContainText('Žij s tím, kdo je níž');
      await axe(page, '[id="seneca-nekdo-niz"]');
      await snimek(page, niz, `seneca-zmena-niz-${r}`);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      // Obnovení stránky drží rozhodnutí.
      await page.reload();
      const znovu = await pripravBlok(page, 'seneca-zustat-odejit', 'Volba');
      await expect(znovu.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Tvůj tah: odejít.');
    });
  }
}

test('Seneca: text drží pravidla celku (smrt na rozkaz, kdo co vypráví, co patří cestám)', async ({ page }) => {
  await page.goto(SENECA);
  const cisty = (s: string | null) => (s ?? '').replace(/\s+/g, ' ');
  const text = cisty(await page.locator('.obsah').evaluate((e) => [...e.querySelectorAll('.uvod, .kapitola')].map((k) => k.textContent).join(' ')));
  const konec = cisty(await page.locator('#co-zustalo').textContent());

  // Vstup je žádost roku 62, vyprávěná nepřímo a s vypravěčem; smrtí stránka nezačíná.
  expect(cisty(await page.locator('.uvod').textContent())).toContain('Dějepisec Tacitus tu schůzku vypráví takhle.');
  expect(cisty(await page.locator('.uvod').textContent())).not.toMatch(/zemřel|rozkaz|spiknutí/);

  // Senekova smrt: slovo jednou a s rozkazem v téže větě, způsob nikde, žádné přikrášlení.
  expect(text.match(/sebevražd/g)).toHaveLength(1);
  expect(text).toContain('Takové smrti na rozkaz se říká vynucená sebevražda.');
  expect(text).toContain('Na výběr při ní nebylo, jestli člověk zemře, jen čí rukou.');
  expect(text).toContain('Tak Seneca zemřel. Tacitus tomu říká vražda.');
  expect(konec).not.toMatch(/žíl|\bjed(u|em)?\b|lázn|lázeň|krev|krvác|bolehlav|písař|diktov|úlitb/i);
  expect(text).not.toMatch(/spáchal|klidně|statečně|důstojně|po vzoru|zvolil|odešel|filozofick\S+ smrt|aby ušetřil/i);
  // Hned po scéně to, co po něm zůstalo, a otázka; Paulina ho přežila.
  expect(konec).toContain('Do závěti Seneca nepřipsal nic. Zůstaly dopisy.');
  expect(konec).toContain('Podle čeho z toho bys ho posuzoval ty?');
  expect(konec).toContain('Paulina ho přežila o několik let.');

  // Mládí: věta z Dopisu 78 stojí uprostřed kapitoly a hned za ní to, co pomohlo.
  expect(text).toContain('zhubl na kost a často už nechtěl žít');
  expect(text).toContain('co mu pomohlo: filozofie a přátelé, kteří u něj seděli a mluvili s ním');
  expect(cisty(await page.locator('#rok-bez-masa').textContent()).indexOf('nechtěl žít')).toBeGreaterThan(400);

  // Typ tvrzení: „asi“ zůstává „asi“, co říká Tacitus, říká Tacitus, číslo je jen výčitka.
  for (const veta of ['Chlapci bylo asi jedenáct.', 'Tacitus píše, že bránili vraždám', 'Roku 55 dal Nero podle Tacita otrávit', 'Tacitus píše, že lidé potom mluvili hůř o Senekovi než o Neronovi.', 'prý získal za čtyři roky u dvora tři sta milionů', 'Obvinili ho z cizoložství se ženou z císařské rodiny.', 'kolem začátku našeho letopočtu']) expect(text).toContain(veta);
  expect(text).not.toMatch(/pět (dobrých )?let|pětilet|Brit|Egypt|Pavl|Cassi|Burr|Livill|Polybi|sesterci/i);
  // Odklad je rada pro spor mezi rovnými.
  expect(text).toContain('Když ti někdo ubližuje znovu a znovu, do zítřka se nečeká: řekne se to někomu, kdo může zasáhnout.');

  // Co portrét nechává jinde: argumenty o smrti a útěchy (cesta 8), čas (cesta 34), jeho odpověď o bohatství (otázka 1).
  expect(text).not.toMatch(/dušnost|dusí|lamp|Bass|Seren|umíráme každý den|krátkost|kdo komu slouží/i);
  await expect(page.locator('#u-dvora').getByRole('link', { name: 'Jak mám žít?' })).toHaveAttribute('href', '/otazka/jak-zit/');
  // Kapitola o dopisech vede na cestu 8 odkazem (P8).
  expect(text).toContain('Těm patří cesta Proč se bát smrti?');
  await expect(page.locator('#dopisy').getByRole('link', { name: 'Proč se bát smrti?' })).toHaveAttribute('href', '/cesta/proc-se-bat-smrti/');

  // Otroci: co řekl, co odmítl, co dělal a kdo mu odporuje.
  for (const veta of ['Nežádá, aby otroka propustil.', 'Otroky měl až do smrti.']) expect(text).toContain(veta);
  await expect(page.locator('#dopisy a[href="/osobnost/epiktetos/"]')).toHaveText('Epiktétos');
  expect(text).not.toMatch(/dítě své doby|tehdy to tak|omluv/i);

  // Třináct citátů, každý jednou; otázky v kartě Zkus to žít uvádí věta o Sextiovi.
  const citaty = await page.locator('.obsah .citat').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  expect(citaty).toHaveLength(13);
  expect(new Set(citaty).size).toBe(13);
  await expect(page.locator('#zkus-to-zit')).toContainText('podle filozofa Sextia, který se před spaním ptal sám sebe');
  await expect(page.locator('#zkus-to-zit')).toContainText('řekni o tom někomu, komu věříš');

  // Tichý řádek pomoci: jednou, pod poslední kapitolou, bez výzvy.
  await expect(page.locator('.radek-pomoci')).toHaveCount(1);
  await expect(page.locator('#co-zustalo .radek-pomoci')).toHaveText(/^\s*Pro případ, že by se to hodilo: Linka bezpečí 116\s111, zdarma a nonstop, i jako chat na linkabezpeci\.cz\.\s*$/);

  const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
  await expect(kamDal.getByRole('link')).toHaveText([/Cesta\s*Proč se bát smrti\?/, /Cesta\s*Co když přijde to nejhorší\?/, /Cesta\s*Kam mi mizí čas\?/, /Zkus to žít · sedm dní\s*Stoický týden/, /Epiktétos/, /Marcus Aurelius/, /Velká otázka 1\s*Jak mám žít\?/]);
  await expect(page.locator('[id="kdo-sokrates-seneca-vzdalenost"]')).toContainText('Sókratés a Seneca');
});

test('Seneca: deska s hermou, licence v Pramenech a Doba a lidé', async ({ page }) => {
  const stred = () => page.locator('.osobnost__deska img').evaluate((img) => getComputedStyle(img).objectPosition);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(SENECA);
  expect(await stred()).toBe('45% 34%');
  await expect(page.locator('.osobnost__deska img')).toHaveAttribute('src', /seneca-smb\.jpg$/);
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toContainText('jediná antická podobizna s jeho jménem');
  // Celá herma stojí v poslední kapitole; popisek říká, co to je, odkud a z kdy.
  const herma = page.locator('#co-zustalo .pribeh');
  await expect(herma.locator('img')).toHaveAttribute('src', /seneca-herma-smb\.jpg$/);
  await expect(herma).toContainText('Dvojitá herma, kus mramoru se dvěma hlavami: vlevo Seneca, vpravo Sókratés. Vznikla v letech 225–250 n. l., našla se roku 1813 v Římě');
  await expect(herma).not.toContainText(/Herculane|Hésiod|1598/);
  // Autor a licence obou obrázků jsou v Pramenech na téže stránce.
  const licence = page.locator('a[href="https://smb.museum-digital.de/object/13081"]');
  await expect(licence).toHaveText(['CC BY-NC-SA 4.0', 'CC BY-NC-SA 4.0']);
  await expect(page.locator('li').filter({ has: licence })).toContainText(['Staatliche Museen zu Berlin, Antikensammlung (fotograf neuveden); výřez z fotografie', 'Staatliche Museen zu Berlin, Antikensammlung (fotograf neuveden)']);
  // Doba a lidé: koho četl, a na mapě Řím bez holého řádku „působení“ vedle téhož s rokem.
  await expect(page.getByText('Koho četl', { exact: true })).toBeVisible();
  const mapa = await page.locator('.minimapa svg').getAttribute('aria-label');
  expect(mapa!.replace(/\s/g, ' ')).toContain('Řím (působení 49 n. l., smrt 65 n. l.)');
  expect(mapa!.replace(/\s/g, ' ')).toContain('Korsika (vyhnanství 41 n. l.)');
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await stred()).toBe('45% 30%');
});
