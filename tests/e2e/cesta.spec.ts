// Cesty 1, 2, 3, 4, 5, 6 a 8: přehled, kroky, soustředěná hlavička a lišta Předchozí / Další,
// Kam dál z bloků, Pokračuj na Domů a v deníku. Každý krok na 390 a 1440 px ve světlém
// i tmavém režimu s axe, bez vodorovného posouvání a se snímky. Cesta 6 navíc celá jen klávesnicí
// a jednou bez odkrytí bloků.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CESTA = '/cesta/kdy-mam-dobry-duvod-verit/';
const KROKY = ['Odpověď z Delf', 'Jak bys to zjišťoval ty?', 'Politik, básníci, řemeslníci', 'Podle čeho to poznáš?', 'Člověk je měřítkem', 'Bílozlaté, nebo modročerné?', 'Tvoje pravidlo'];
const CESTA6 = '/cesta/kolik-je-dost/';
const KROKY6 = ['Host v Zahradě', 'Nutné, přirozené, prázdné', 'Kde má slast strop?', 'Žít jako kynik?', 'Měsíc na minimum', 'Peníze a štěstí', 'Tvoje pravidlo'];
const CESTA5 = '/cesta/co-mam-ve-svych-rukou/';
const KROKY5 = ['Noha', 'Tři koše', 'Dvě půlky', 'Otrok a císař', 'Záleží na tom, co mě potká?', 'Snímek z chatu', 'Kamenná tvář', 'Tvoje pravidlo'];
const CESTA3 = '/cesta/je-to-co-vidim-cela-skutecnost/';
const KROKY3 = ['Jeskyně', 'Odkud to vím?', 'Ven', 'Čtverec sám', 'Učitel a žák', 'Vyměnit stíny', 'Zpátky dolů', 'Tvoje pravidlo'];
const CESTA4 = '/cesta/staci-vedet-co-je-spravne/';
const KROKY4 = ['Háj a hostina', 'Co ti tehdy chybělo?', 'Kdo ví, udělá to', 'Stavitelem se stáváš stavěním', 'Věděl to doopravdy?', 'Kde je střed?', 'Jak dlouho to trvá?', 'Tvoje pravidlo'];
const CESTA8 = '/cesta/proc-se-bat-smrti/';
const KROKY8 = ['Dopis', 'Čeho se vlastně bojíme', '„Netýká se nás“', 'Zrcadlo', 'Host u stolu', 'Týká se nás?', 'Ti druzí', 'Blízko', 'Tvoje pravidlo'];
const CESTA2 = '/cesta/jsem-porad-tentyz-kdyz-se-menim/';
const KROKY2 = ['Loď', 'Řeka', 'Proč je změna záhada', 'Loď po prknech', 'A co člověk?', 'Dva čtenáři jedné řeky', 'Jak staré je tvoje tělo', 'Kdo je na tvé straně'];
const CESTY = [
  { adresa: CESTA, nazev: 'Kdy mám dobrý důvod věřit?', kroky: KROKY, snimek: 'cesta' },
  { adresa: CESTA6, nazev: 'Kolik je dost?', kroky: KROKY6, snimek: 'cesta6' },
  { adresa: CESTA5, nazev: 'Co mám ve svých rukou?', kroky: KROKY5, snimek: 'cesta5' },
  { adresa: CESTA3, nazev: 'Je to, co vidím, celá skutečnost?', kroky: KROKY3, snimek: 'cesta3' },
  { adresa: CESTA4, nazev: 'Stačí vědět, co je správné?', kroky: KROKY4, snimek: 'cesta4' },
  { adresa: CESTA8, nazev: 'Proč se bát smrti?', kroky: KROKY8, snimek: 'cesta8' },
  { adresa: CESTA2, nazev: 'Jsem pořád tentýž, když se měním?', kroky: KROKY2, snimek: 'cesta2' },
];

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  // Při souběhu s ostatními testy se ostrov kresby (šaty v kroku 6) někdy nestihl hydratovat do pěti vteřin:
  // ostrovy, které ještě čekají, se posunou do okna každý zvlášť a na hydrataci je víc času.
  await page.evaluate(async () => {
    for (const el of Array.from(document.querySelectorAll('astro-island[ssr]'))) {
      el.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15_000 });
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

for (const c of CESTY) {
  for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
    for (const rezim of ['light', 'dark'] as const) {
      test(`${c.snimek} · přehled a kroky · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
        await page.setViewportSize({ width: sirka, height: vyska });
        await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
        const r = rezim === 'light' ? 'svetly' : 'tmavy';
        await page.goto(c.adresa);
        await pripravit(page);
        await expect(page.locator('h1')).toHaveText(c.nazev);
        await axe(page);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        await page.addStyleTag({ content: 'nav.lista { position: static !important; }' });
        await page.screenshot({ path: `test-results/snimky/${c.snimek}-prehled-${sirka}-${r}.png`, fullPage: true });
        for (let n = 1; n <= c.kroky.length; n++) {
          await page.goto(`${c.adresa}${n}/`);
          await pripravit(page);
          await expect(page.locator('h1')).toHaveText(c.kroky[n - 1]);
          await expect(page.getByRole('link', { name: `Krok ${n}: ${c.kroky[n - 1]}` })).toHaveAttribute('aria-current', 'step');
          await axe(page);
          expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
          await page.addStyleTag({ content: '.cesta-lista, .cesta-hlavicka { position: static !important; }' });
          await page.screenshot({ path: `test-results/snimky/${c.snimek}-krok${n}-${sirka}-${r}.png`, fullPage: true });
        }
      });
    }
  }
}

test('cesta: průchod, Kam dál z bloku, lišta Další, Pokračuj na Domů a v deníku', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Přehled cesty nabízí začátek.
  await page.goto(CESTA);
  await pripravit(page);
  await expect(page.getByRole('link', { name: 'Začít cestu' })).toHaveAttribute('href', `${CESTA}1/`);
  // Vstup z Domů: hlavní tlačítko vede rovnou na krok 1.
  await page.goto('/');
  await page.getByRole('link', { name: 'Začít první cestu' }).click();
  await expect(page).toHaveURL(`${CESTA}1/`);
  await expect(page.locator('.postup-text')).toHaveText('Krok 1 z 7');
  // Lišta: Další krok.
  await page.getByRole('link', { name: /Další krok/ }).click();
  await expect(page).toHaveURL(`${CESTA}2/`);
  await pripravit(page);
  const volba = page.locator('#cesta1-jak-zjistit');
  await volba.getByText('Najdu lidi').click();
  await volba.getByRole('button', { name: 'Tohle je můj tah' }).click();
  // Kam dál z bloku vede na další krok.
  const dal = volba.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: 'Další krok: Politik, básníci, řemeslníci' });
  await expect(dal).toHaveAttribute('href', `${CESTA}3/`);
  await dal.click();
  await expect(page).toHaveURL(`${CESTA}3/`);
  await expect(page.locator('.citat, blockquote').first()).toContainText('Já nevím, ale ani si nemyslím, že vím.');

  // Domů nabídne pokračování v cestě hlavním tlačítkem; Pokračuj ho neopakuje.
  await page.goto('/');
  const hlavni = page.locator('[data-zacatek-tlacitko]');
  await expect(hlavni).toHaveText('Pokračovat v cestě');
  await expect(hlavni).toHaveAttribute('href', `${CESTA}3/`);
  await expect(page.locator('[data-zacatek-udaj]')).toHaveText('Cesta 1 · Kdy mám dobrý důvod věřit? · krok 3 z 7');
  await expect(page.locator('astro-island[component-url*="Pokracuj"]:not([ssr])')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Pokračuj, kde jsi skončil' })).toHaveCount(0);

  // Přehled cesty ukáže prošlé kroky a nabídne pokračovat.
  await page.goto(CESTA);
  await pripravit(page);
  await expect(page.getByRole('link', { name: 'Pokračovat: krok 3' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Jak bys to zjišťoval ty\? \(prošel jsi\)/ })).toBeVisible();

  // Deník: rozpracovaná cesta a zápis z Volby.
  await page.goto('/denik/');
  await expect(page.locator('.seznam--rozpracovane')).toContainText('Kdy mám dobrý důvod věřit?');
  await expect(page.locator('.seznam--rozpracovane')).toContainText('krok 3 z 7');
  await expect(page.locator('.seznam--zapisy')).toContainText('B · Najdu lidi, kteří mají pověst moudrých, a vyzkouším je.');

  // Projít zbytek a dokončit.
  for (const n of [4, 5, 6, 7]) {
    await page.goto(`${CESTA}${n}/`);
    await pripravit(page);
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');
  // Po dokončení první cesty vede Domů do přehledu otázek, kde si student vybere další.
  await page.goto('/');
  await expect(hlavni).toHaveText('Vybrat další cestu');
  await expect(hlavni).toHaveAttribute('href', '/otazky/');
});

test('cesta: klávesnice v hlavičce a liště; rozpracovaný krok nabídne hlavní tlačítko na Domů', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Krok 6 má pod blokem kresbu: bez plynulého posouvání k ní příprava dojde a ostrov se hydratuje.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${CESTA}6/`);
  await pripravit(page);
  await page.keyboard.press('Tab'); // Přeskočit na obsah
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Zpět na přehled cesty/ })).toBeFocused();
  // Změň jednu věc: jen první rozhodnutí, bez změny podmínky = rozpracovaná otázka.
  const z = page.locator('#cesta1-saty');
  await z.getByRole('radio', { name: 'Nedá se to rozhodnout.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(z.getByRole('radio', { name: 'Kdo je viděl naživo, říká modročerné' })).toBeFocused();
  // Rozpracovaná otázka leží v kroku, kam vede hlavní tlačítko: Pokračuj ji vedle něj neopakuje.
  await page.goto('/');
  await expect(page.locator('[data-zacatek-tlacitko]')).toHaveText('Pokračovat v cestě');
  await expect(page.locator('[data-zacatek-tlacitko]')).toHaveAttribute('href', `${CESTA}6/`);
  await expect(page.locator('astro-island[component-url*="Pokracuj"]:not([ssr])')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Pokračuj, kde jsi skončil' })).toHaveCount(0);
});

test('cesta: Spor Prótagorás × Sókratés a šaty jen klávesnicí (telefon)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${CESTA}5/`);
  await pripravit(page);
  await expect(page.locator('.citat').first()).toContainText('Člověk je měřítkem všech věcí');
  const spor = page.locator('#cesta1-meritko-spor');
  await expect(spor).toContainText('vystrčil hlavu ze země');
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš Prótagorás' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  await expect(argumenty.getByRole('heading', { name: 'Prótagorás' })).toBeVisible();
  await expect(argumenty.getByRole('heading', { name: 'Sókratés' })).toBeVisible();
  await expect(argumenty).toContainText('jako lékař');
  await expect(argumenty).toContainText('horečku');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('budoucnost');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš Prótagorás. Teď: spíš Sókratés.');
  await expect(posun).not.toContainText(/správn|špatn/i);
  // Kam dál z bloku vede na šaty.
  await expect(spor.getByRole('link', { name: 'Další krok: Bílozlaté, nebo modročerné?' })).toHaveAttribute('href', `${CESTA}6/`);

  await page.goto(`${CESTA}6/`);
  await pripravit(page);
  const saty = page.locator('#cesta1-saty');
  await expect(saty).toContainText('V únoru 2015 obletěla internet fotka šatů.');
  await saty.getByRole('radio', { name: 'Obě strany. Každý vidí, co vidí.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(saty.getByRole('radio', { name: 'Kdo je viděl naživo, říká modročerné' })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(saty.locator('.zmenena')).toContainText('viděla na svatbě');
  await page.keyboard.press('Tab');
  await expect(saty.locator('.zmenena').getByRole('radio', { name: 'Ti, kdo vidí modrou a černou.' })).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zpetna = saty.getByRole('region', { name: 'Posun odpovědi' });
  await expect(zpetna).toBeFocused();
  await expect(zpetna).toContainText('Tvoje odpověď se posunula.');
  await expect(zpetna).toContainText('svědectví');
});

test('cesta: pravidlo v kroku 7 je vidět hned a uloží se samo, i když student jen dokončí cestu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Přehled: Začít cestu stojí nad seznamem kroků.
  await page.goto(CESTA);
  await pripravit(page);
  const zacit = await page.getByRole('link', { name: 'Začít cestu' }).boundingBox();
  const prvni = await page.locator('.seznam a').first().boundingBox();
  expect(zacit!.y).toBeLessThan(prvni!.y);

  await page.goto(`${CESTA}7/`);
  await pripravit(page);
  const pole = page.getByRole('textbox', { name: 'Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo.' });
  await expect(pole).toBeVisible();
  await expect(page.locator('.citat')).toHaveCount(0);
  await pole.fill('Když tvrzení obstojí, i když hledám, co by ho vyvrátilo.');
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA}#hotovo`);
  await page.goto('/denik/');
  await expect(page.locator('.seznam--zapisy')).toContainText('Když tvrzení obstojí, i když hledám, co by ho vyvrátilo.');
  // Návrat do kroku 7: text je v poli a ví se, že je uložený.
  await page.goto(`${CESTA}7/`);
  await pripravit(page);
  await expect(pole).toHaveValue('Když tvrzení obstojí, i když hledám, co by ho vyvrátilo.');
  await expect(page.getByText('Uloženo v deníku.')).toBeVisible();
  // Smazaný text zmizí i z deníku.
  await pole.fill('');
  await pole.blur();
  await page.goto('/denik/');
  await expect(page.getByText('Když tvrzení obstojí')).toHaveCount(0);
});

// ─── Cesta 6 „Kolik je dost?“ ────────────────────────────────────────────────

/** Aktivuje odkaz Kam dál v bloku klávesnicí a počká na další krok. */
async function dalKlavesnici(page: Page, blok: ReturnType<Page['locator']>, nazev: string, adresa: string) {
  const dal = blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: `Další krok: ${nazev}` });
  await dal.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(adresa);
  await pripravit(page);
}

test('cesta 6: celý průchod jen klávesnicí na telefonu, zápisy v deníku', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA6);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta 6');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('7 kroků');
  // Kam dál na přehledu vede do mapy k Epikúrovi, ne k Sókratovi.
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=-306&osoba=epikuros');
  const zacit = page.getByRole('link', { name: 'Začít cestu' });
  await zacit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA6}1/`);
  await pripravit(page);

  // Krok 1: scéna podle Seneky a hrnek sýra; nic k ovládání kromě lišty.
  await expect(page.locator('.pribeh')).toContainText('Seneca, který žil o tři sta let později, popisuje');
  await expect(page.locator('.pribeh')).not.toContainText(/na bráně stálo/i);
  await expect(page.locator('.citat')).toHaveCount(2);
  await expect(page.locator('.citat').nth(1)).toContainText('Pošli mi hrnek sýra');
  const dalsi = page.getByRole('link', { name: /Další krok/ });
  await dalsi.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA6}2/`);
  await pripravit(page);

  // Krok 2: tři koše klávesnicí.
  const kose = page.locator('#cesta6-tri-kose');
  const sem = (kos: string) => kose.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });
  await sem('Potřebuju').focus();
  await page.keyboard.press('Enter');
  await sem('Těší mě').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await sem('Prázdné').focus();
  await page.keyboard.press('Enter');
  await sem('Potřebuju').focus();
  await page.keyboard.press('Enter');
  await sem('Těší mě').focus();
  await page.keyboard.press('Enter');
  await expect(kose.getByRole('button', { name: 'Mám roztříděno' })).toBeFocused();
  await page.keyboard.press('Enter');
  const trideni = kose.getByRole('region', { name: 'Tvoje třídění' });
  await expect(trideni).toBeFocused();
  await expect(trideni).toContainText('bolí, když touhu nesplníš?');
  // Zpětná vazba vidí, kam student kartu dal, a srovnání se ptá i proti Epikúrovi.
  await expect(trideni).toContainText('Dal jsi ho mezi věci, bez kterých to bolí.');
  await expect(trideni).toContainText('A nechal bys to tam i tak?');
  await dalKlavesnici(page, kose, 'Kde má slast strop?', `${CESTA6}3/`);

  // Krok 3: strop slasti v textu, citát o soběstačnosti, volba bez „Co udělal“.
  await expect(page.locator('.krok__obsah')).toContainText('Slast podle něj nemůže růst donekonečna.');
  await expect(page.locator('.citat')).toContainText('Soběstačnost je velké dobro.');
  const bunda = page.locator('#cesta6-bunda');
  await bunda.getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(bunda.getByRole('radio', { name: /Ostatní uvidí/ })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zpetna = bunda.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna).toBeFocused();
  await expect(zpetna).toContainText('Má strop i obdiv ostatních?');
  await expect(zpetna.getByRole('heading')).toHaveCount(0);
  await dalKlavesnici(page, bunda, 'Žít jako kynik?', `${CESTA6}4/`);

  // Krok 4: Spor Epikúros × kynici; strana se jmenuje kynici, ne Diogenés.
  await expect(page.locator('.krok__obsah > .ctenarsky .citat')).toHaveCount(4);
  const spor = page.locator('#cesta6-kynici-spor');
  await expect(spor).toContainText('S Diogenem samotným se Epikúros nejspíš nikdy nepotkal');
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Kynici\s*Epikúros/);
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš kynici' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  await expect(argumenty.getByRole('heading', { name: 'Kynici' })).toBeVisible();
  await expect(argumenty.getByRole('heading', { name: 'Epikúros' })).toBeVisible();
  // Obě strany odpovídají na nejsilnější námitku druhé a domyšlená odpověď je podaná jako výklad.
  await expect(argumenty).toContainText('Epikúrovi by kynik mohl namítnout');
  await expect(argumenty).toContainText('Kynikovi by Epikúros mohl odpovědět');
  // Na Epikúrovo „žebrání je taky provázek“ má kynik odpověď: cvičil se i v odmítnutí.
  await expect(argumenty).toContainText('Jednu sochu prý prosil o almužnu');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('přátelé');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš kynici. Teď: spíš Epikúros.');
  await expect(posun).toContainText('ke straně, kterou hájí Epikúros');
  await expect(posun).not.toContainText(/správn|špatn|vyhrál/i);
  await dalKlavesnici(page, spor, 'Měsíc na minimum', `${CESTA6}5/`);

  // Krok 5: měsíc na minimum, jedna změněná podmínka.
  const mesic = page.locator('#cesta6-mesic-na-minimum');
  await mesic.getByRole('radio', { name: 'Jdu, ale páteční pizzu si nechám.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(mesic.getByRole('radio', { name: 'Nikdo se to nedozví' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(mesic.getByRole('radio', { name: 'Kamarádi jdou do toho s tebou' })).toBeChecked();
  await expect(mesic.locator('.zmenena')).toContainText('přidá celá tvoje parta');
  await page.keyboard.press('Tab');
  await expect(mesic.locator('.zmenena').getByRole('radio', { name: 'Jdu do toho také.' })).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zmena = mesic.getByRole('region', { name: 'Posun odpovědi' });
  await expect(zmena).toBeFocused();
  await expect(zmena).toContainText('o pizzu, nebo o lidi kolem stolu?');
  await expect(mesic.getByRole('heading', { name: 'Co udělal Epikúros' })).toBeVisible();
  // Oba hlasy: Epikúros by si pátek nechal, kynik by šel do všeho.
  await expect(mesic.locator('.co-udelal')).toContainText('A pátek s přáteli by si nechal.');
  await expect(mesic.locator('.co-udelal')).toContainText('Kynik by šel do všeho');
  await dalKlavesnici(page, mesic, 'Peníze a štěstí', `${CESTA6}6/`);

  // Krok 6: studie vyprávěná přímo, graf s textovou alternativou, výhrady až ve zpětné vazbě.
  const text6 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text6).toContainText('V roce 2023 se oba soupeři spojili a data přepočítali spolu.');
  await expect(text6).not.toContainText(/souvislost|85.000|Spojených státech/);
  const graf = page.locator('#graf-penize-stesti');
  await expect(graf.getByRole('img')).toHaveAttribute('aria-describedby', 'graf-penize-stesti-popis');
  await expect(graf.locator('figcaption')).toContainText('Asi u pětiny lidí, těch nejméně šťastných, se zhruba nad 100 000 dolary ročně zastaví.');
  await expect(text6.locator('.citat')).toHaveCount(2);
  // Oba Epikúrovy citáty stojí před studií; poslední slovo před hlasováním nemá Epikúros, ale křivky.
  await expect(text6.locator(':scope > p').last()).toContainText('musel by se příjem pokaždé zdvojnásobit');
  const penize = page.locator('#cesta6-penize');
  await penize.getByRole('radio', { name: /Nedá se říct/ }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(penize.getByRole('region', { name: 'Zpětná vazba' })).toContainText('85 000 dolarů ročně');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(penize.locator('details.ostatni')).toContainText('jen souvislost, ne příčinu');
  await dalKlavesnici(page, penize, 'Tvoje pravidlo', `${CESTA6}7/`);

  // Krok 7: návrat ke košům a vlastní pravidlo, které se uloží samo.
  await expect(page.locator('.krok__obsah')).toContainText('Bez které věci z koše „Těší mě“ bys teď uměl být?');
  // Vedle pravidla stojí koše, jak je student v kroku 2 opravdu uložil.
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel.getByRole('heading', { name: 'Na začátku' })).toBeVisible();
  await expect(panel).toContainText('Krok 2 · Nutné, přirozené, prázdné');
  await expect(panel.locator('.cast').first()).toContainText('Potřebuju');
  await expect(panel.locator('.cast').first().locator('li')).toHaveText(['Vyspat se po probdělé noci', 'Někdo, komu řeknu, co mě trápí']);
  await expect(panel.getByRole('heading', { name: 'Teď' })).toBeVisible();
  const pole = page.getByRole('textbox', { name: 'Kolik je dost? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('Dost je, když mi nic nechybí, i když nic nepřibývá.');
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  await dokoncit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA6}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  await page.goto('/denik/');
  const zapisy = page.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('Dost je, když mi nic nechybí, i když nic nepřibývá.');
  await expect(zapisy).toContainText('Potřebuju: Vyspat se po probdělé noci; Někdo, komu řeknu, co mě trápí.');
  await expect(zapisy).toContainText('Na začátku: spíš kynici. Po argumentech: spíš Epikúros. Co mě posunulo: přátelé.');
  await expect(zapisy).toContainText('D · Ostatní uvidí, co mám na sobě.');
});

test('cesta 6 bez odkrytí bloků: lišta vede až na konec a text mimo bloky drží souvislost', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Hrnek sýra. Tak vypadala hostina muže, který učil, že cílem je slast.'],
    ['Všechno, po čem člověk touží, třídil do tří košů.', 'těm říkal prázdné.'],
    ['bolí, když touhu nesplníš?', 'Slast podle něj nemůže růst donekonečna.', 'Hrnek sýra si tedy podle něj dopřát smíš.'],
    ['Moudrý nebude žít jako kynik ani žebrat.', 'Kynik i Epikúros tedy jedli chléb a pili vodu.', 'S Diogenem samotným se Epikúros nejspíš nikdy nepotkal'],
    ['měsíc na minimum', 'každý pátek scházíš s kamarády na pizzu'],
    ['Epikúros tvrdil, že strop má i bohatství', 'U většiny lidí nálada s příjmem roste dál.', 'Komu je málo to, co stačí, tomu nestačí nic.'],
    ['Oba chtěli totéž: aby je osud nezaskočil.', 'Souhlasit s nimi nemusíš.', 'Bez které věci z koše „Těší mě“ bys teď uměl být?'],
  ];
  await page.goto(`${CESTA6}1/`);
  for (let n = 1; n <= KROKY6.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY6[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani výsledek.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY6.length) {
      await page.getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA6}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA6}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');
  // V cestě nejsou citáty, které nesou profily, a nikdo se v ní neodvolává na cesty 7 a 8.
  for (let n = 1; n <= KROKY6.length; n++) {
    await page.goto(`${CESTA6}${n}/`);
    await expect(page.locator('.krok__obsah')).not.toContainText(/Ječná placka a voda|Dítě mě porazilo|Hledám člověka|Jsem občan světa|Tohle je Platónův člověk|Tělo volá/);
    await expect(page.locator('a[href*="cizi-zivot"], a[href*="proc-se-bat-smrti"]')).toHaveCount(0);
  }
});

test('cesta na notebooku: obsah stojí na středové ose, ne u levého okraje', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Měří se rozvržení ze serveru; na oživení ostrovů tu nezáleží.
  const osa = async (vyber: string) => {
    const r = (await page.locator(vyber).first().boundingBox())!;
    return { vlevo: r.x, vpravo: 1440 - (r.x + r.width), sirka: r.width };
  };
  // Krok s textem i blokem: nadpis, text a blok mají společný střed.
  await page.goto(`${CESTA6}3/`);
  await page.evaluate(() => document.fonts.ready);
  for (const vyber of ['.krok__hlava', '.krok__obsah', '.krok__obsah > .ctenarsky', '.krok__obsah .blok']) {
    const o = await osa(vyber);
    expect(Math.abs(o.vlevo - o.vpravo), vyber).toBeLessThanOrEqual(2);
  }
  expect((await osa('.krok__obsah .blok')).sirka).toBe(960);
  expect((await osa('.krok__obsah > .ctenarsky')).sirka).toBe(680);
  // Nadpis stojí nad textem, ne nad okrajem bloku.
  expect((await osa('.krok__hlava')).vlevo).toBe((await osa('.krok__obsah > .ctenarsky')).vlevo);
  // Tlačítka lišty stojí pod okraji bloku.
  const blok = await osa('.krok__obsah .blok');
  const predchozi = (await page.getByRole('link', { name: 'Předchozí' }).boundingBox())!;
  const dalsi = (await page.getByRole('link', { name: /Další krok/ }).boundingBox())!;
  expect(Math.abs(predchozi.x - blok.vlevo)).toBeLessThanOrEqual(2);
  expect(Math.abs(1440 - (dalsi.x + dalsi.width) - blok.vpravo)).toBeLessThanOrEqual(2);
  // Krok jen s blokem (Příběh, Změň jednu věc) a přehled cesty drží tutéž osu.
  for (const n of [1, 5]) {
    await page.goto(`${CESTA6}${n}/`);
    await page.evaluate(() => document.fonts.ready);
    const o = await osa('.krok__obsah');
    expect(Math.abs(o.vlevo - o.vpravo), `krok ${n}`).toBeLessThanOrEqual(2);
  }
  await page.goto(CESTA6);
  await page.evaluate(() => document.fonts.ready);
  for (const vyber of ['.cesta__hlava', '.cesta .uvod', '#hotovo']) {
    const o = await osa(vyber);
    expect(Math.abs(o.vlevo - o.vpravo), vyber).toBeLessThanOrEqual(2);
  }
  // Na telefonu se nic nemění: obsah jde od okraje k okraji.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${CESTA6}3/`);
  await page.evaluate(() => document.fonts.ready);
  const telefon = (await page.locator('.krok__obsah').boundingBox())!;
  expect(telefon.x).toBe(16);
  expect(telefon.width).toBe(358);
});

test('krok cesty: prvek s fokusem z klávesnice nezůstane pod pevnou spodní lištou', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${CESTA6}2/`);
  await pripravit(page);
  const kose = page.locator('#cesta6-tri-kose');
  await kose.locator('[data-kos="prazdne"] .kos__sem').focus();
  await page.keyboard.press('Tab');
  const pole = kose.locator('.vlastni__pole');
  await expect(pole).toBeFocused();
  const lista = (await page.locator('.cesta-lista').boundingBox())!;
  const p = (await pole.boundingBox())!;
  expect(p.y + p.height).toBeLessThanOrEqual(lista.y);
  // Tlačítko, které zatím nejde stisknout, tak i vypadá.
  const pridat = kose.getByRole('button', { name: 'Přidat kartu' });
  await expect(pridat).toBeDisabled();
  expect(await pridat.evaluate((e) => getComputedStyle(e).cursor)).toBe('not-allowed');
});
