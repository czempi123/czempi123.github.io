// Cesta 3 „Je to, co vidím, celá skutečnost?“: celý průchod jen klávesnicí na telefonu a jednou bez odkrytí bloků.
// Přehled a kroky na obou šířkách v obou režimech (axe, přesah, snímky) hlídá cesta.spec.ts.
// Hlídá i tón celku: student sedí mezi vězni, nikdo se neosvobodí sám, vypravěč si není jistý a zpátky se jde z povinnosti.
import { test, expect, type Page } from '@playwright/test';

const CESTA3 = '/cesta/je-to-co-vidim-cela-skutecnost/';
const KROKY3 = ['Jeskyně', 'Odkud to vím?', 'Ven', 'Čtverec sám', 'Učitel a žák', 'Vyměnit stíny', 'Zpátky dolů', 'Tvoje pravidlo'];
// Co nese portrét Platóna nebo co do studentského textu nepatří (zadání P8, podklady celku 4).
const NEPATRI = /Isokrat|Diogen|loutkář|manipul|probud|Nyhan|Nature|\bMeta\b|ukázal|truhlář|stolovost|Syrák|Gýg|Leonti|Héfaist|Menón|osm[áé] knih|společné ženy|svatou povinností|rčení/;

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

async function dalKlavesnici(page: Page, blok: ReturnType<Page['locator']>, nazev: string, adresa: string) {
  const dal = blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: `Další krok: ${nazev}` });
  await dal.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(adresa);
  await pripravit(page);
}

/** Volba jen klávesnicí: vybere možnost, potvrdí tah a vrátí oblast se zpětnou vazbou. */
async function volbaKlavesnici(page: Page, blok: ReturnType<Page['locator']>, moznost: RegExp) {
  await blok.getByRole('radio', { name: moznost }).focus();
  await page.keyboard.press('Space');
  // Za kartami je nepovinné „Proč právě tohle?“, pak tlačítko.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zpetna = blok.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna).toBeVisible();
  await expect(zpetna).not.toContainText(/správn|špatn/i);
  return zpetna;
}

test('cesta 3: celý průchod jen klávesnicí na telefonu, zápisy v deníku', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA3);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta · asi');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('8 kroků');
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=-370&osoba=platon');
  await page.getByRole('link', { name: 'Začít cestu' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA3}1/`);
  await pripravit(page);

  // Krok 1: jeskyně podle pramene. Kdo mluví, je řečeno; scéna končí větou „Podobní nám“.
  const pribeh = page.locator('.pribeh');
  await expect(pribeh).toContainText('nechává Platón Sókrata vyprávět obraz');
  await expect(pribeh).toContainText('Jsou tam od dětství.');
  await expect(pribeh).toContainText('Kdo vězně spoutal, Sókratés neříká.');
  await expect(pribeh.locator('.citat')).toHaveCount(1);
  await expect(pribeh.locator('.pribeh__scena > :last-child')).toContainText('Podobní nám.');
  await expect(pribeh.locator('img')).toHaveAttribute('src', /jeskyne-saenredam/);
  // Popisek: představa z roku 1604 a jedno pozorování o tom, kde na rytině stojí divák.
  await expect(pribeh.locator('.pribeh__deska figcaption')).toContainText('roku 1604');
  await expect(pribeh.locator('.pribeh__deska figcaption')).toContainText('Na rytině stojíš mezi těmi, kdo vidí. V Platónově textu sedíš mezi vězni.');
  await page.getByRole('link', { name: /Další krok/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA3}2/`);
  await pripravit(page);

  // Krok 2: osm karet do čtyř košů klávesnicí. Koš z obrazovky není koš lží; dvakrát dvě má místo a vrátí se.
  const kose = page.locator('#cesta3-odkud-to-vim');
  const sem = (kos: string) => kose.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });
  const SAM = 'Ze zkušenosti', LIDE = 'Od lidí', OBRAZOVKA = 'Z obrazovky', HLAVA = 'Z vlastní hlavy';
  // Názvy košů odpovídají stejným tvarem na otázku „Odkud to vím?“ (připomínka autora 4. 10. 2026).
  await expect(kose.locator('.kos__nazev')).toHaveText([SAM, LIDE, OBRAZOVKA, HLAVA]);
  for (const kos of [SAM, LIDE, OBRAZOVKA, OBRAZOVKA, SAM, SAM, HLAVA, HLAVA]) {
    await sem(kos).focus();
    await page.keyboard.press('Enter');
  }
  await expect(kose.getByRole('button', { name: 'Mám roztříděno' })).toBeFocused();
  await page.keyboard.press('Enter');
  const trideni = kose.getByRole('region', { name: 'Tvoje třídění' });
  await expect(trideni).toBeFocused();
  await expect(trideni).toContainText('Komu přesně věříš: učitelce, rodičům?');
  await expect(trideni).toContainText('Kde jsi to viděl: v zrcadle, nebo na fotce?');
  // Dohad i dvakrát dvě leží v koši Z vlastní hlavy; zpětná vazba se ptá, čím se liší.
  await expect(trideni).toContainText('A čím se liší od karty, že dvakrát dvě jsou čtyři?');
  await expect(trideni).toContainText('Z hlavy je i dohad o spolužákovi. Jsi si oběma stejně jistý?');
  await expect(trideni).toContainText('Tuhle kartu si pamatuj, ještě se vrátí.');
  await expect(trideni).toContainText('Vězni v Sókratově obrazu by nejspíš dali všechno do prvního koše.');
  await expect(trideni).toContainText('Není to hanba ani hloupost');
  await expect(trideni).toContainText('není koš lží');
  await expect(trideni).not.toContainText(/správn|špatn/i);
  await dalKlavesnici(page, kose, 'Ven', `${CESTA3}3/`);

  // Krok 3: nikdo se neosvobodí sám, venku jsou nejdřív zase stíny a vězni nejsou hloupí.
  const text3 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text3).toContainText('někdo rozváže a donutí ho vstát');
  await expect(text3).toContainText('Stíny mu připadají pravdivější');
  await expect(text3).toContainText('někdo násilím vleče');
  await expect(text3).toContainText('Nejdřív rozezná stíny, potom odrazy ve vodě');
  await expect(text3).toContainText('V tom, co měli před očima, byli dobří.');
  await expect(text3).toContainText('Spoluvězňů je mu líto.');
  await expect(text3).not.toContainText(/osvobodí se|prohlédl/);
  await expect(text3.locator('.citat')).toHaveCount(1);
  // Poslední slovo před tahem nikomu nestraní.
  await expect(text3.locator(':scope > p').last()).toContainText('Na zmateném člověku tedy nepoznáš, odkud jde.');
  const venku = page.locator('#cesta3-kdo-byl-venku');
  const zpetna3 = await volbaKlavesnici(page, venku, /Podle toho, jak jistě mluví/);
  await expect(zpetna3).toContainText('nejdřív oslepený a bezradný');
  await expect(zpetna3).toContainText('jen bůh ví, jestli je pravdivý');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(venku.locator('details.ostatni')).toContainText('V jeskyni se ale pocty rozdávají taky');
  await expect(venku.locator('.co-udelal')).toHaveCount(0);
  await dalKlavesnici(page, venku, 'Čtverec sám', `${CESTA3}4/`);

  // Krok 4: slunce jednou větou, úsečka vůbec; karta z kroku 2 se vrací u čtverce.
  const text4 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text4).toContainText('Slunce je v tom obraze to, díky čemu je vůbec co vidět. Platón tím myslí dobro.');
  await expect(text4).toContainText('dvakrát dvě jsou čtyři. Vidět se to nedá, a přesto si tím jsi jistý.');
  await expect(page.locator('.krok__obsah')).not.toContainText(/úsečk/);
  const ctverec = page.locator('#cesta3-ctverec-sam');
  await ctverec.getByRole('textbox').focus();
  await page.keyboard.type('O čtverci, který si jen myslíme.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const srovnani = ctverec.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani).toBeFocused();
  await expect(srovnani).toContainText('O geometrech mluví Sókratés v Ústavě');
  await expect(srovnani.locator('.citat')).toContainText('Jde jim o čtverec sám a o úhlopříčku samu, ne o tu, kterou kreslí.');
  await dalKlavesnici(page, ctverec, 'Učitel a žák', `${CESTA3}5/`);

  // Krok 5: Spor učitele a žáka bez setkání tváří v tvář a bez ohlášeného vítěze.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5).toContainText('Takovým věcem Platón říkal ideje.');
  await expect(text5).toContainText('asi sedmnáctiletý Aristotelés a zůstal dvacet let');
  await expect(text5.locator('.citat')).toHaveCount(2);
  await expect(text5.locator('.citat').first()).toContainText('mluvit naprázdno a v básnických metaforách');
  await expect(text5.locator('.citat').nth(1)).toContainText('Léčí přece jednotlivce.');
  await expect(text5.locator(':scope > p').last()).toContainText('Rozcházejí se v tom, kde to obecné je.');
  const spor = page.locator('#cesta3-aristoteles-spor');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await expect(spor).not.toContainText(/tváří v tvář|řekl mu|odpověděl mu|později napsal/);
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Platón\s*Aristotelés/);
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš Platón' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  // Každá strana odpovídá na nejsilnější námitku druhé; domyšlená odpověď je podaná jako výklad.
  await expect(argumenty).toContainText('v žádném nakresleném není: každý je trochu křivý');
  await expect(argumenty).toContainText('Aristotelés namítá, že lékař neléčí zdraví, ale tohoto člověka.');
  await expect(argumenty).toContainText('Platón by mohl odpovědět');
  await expect(argumenty).toContainText('Platón má pravdu, že bez obecného není vědění.');
  await expect(argumenty).toContainText('Čtverec není vedle nakreslených čtverců, ale v nich.');
  // Aristotelés na Platónovu otázku odpoví (Metafyzika 981a) i s tím, co Platónovi přiznává.
  await expect(argumenty).toContainText('udělá si o tom soud z mnoha nemocných');
  await expect(argumenty).toContainText('kdo k tomu zná příčinu, ví podle Aristotela víc');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('lékař a pacient');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš Platón. Teď: spíš Aristotelés.');
  await expect(posun).not.toContainText(/správn|špatn|vyhrál/i);
  await dalKlavesnici(page, spor, 'Vyměnit stíny', `${CESTA3}6/`);

  // Krok 6: pokus „zkoušel“; shrnutí drží, co vědci změnili. Nejdřív odhad, pak výsledek, pak čtení.
  const obsah6 = page.locator('.krok__obsah');
  await expect(obsah6).toContainText('to zkoušel pokus na Facebooku');
  await expect(obsah6).toContainText('na tři měsíce ubrali asi třetinu příspěvků');
  await expect(obsah6).toContainText('přes třiadvacet tisíc lidí');
  const odhad = page.locator('#cesta3-pokus-odhad');
  const zpetna6 = await volbaKlavesnici(page, odhad, /Zmírnily se/);
  // Zpětná vazba k odhadu výsledek neprozradí; blok vede k textu pod sebou, ne na další krok.
  await expect(zpetna6).not.toContainText(/nezměnil|osmi měřít/);
  const niz = odhad.getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
  await expect(niz).toHaveText('Co z pokusu vyšlo');
  await niz.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA3}6/#co-vyslo`);
  await expect(page.locator('#co-vyslo')).toBeInViewport();
  await expect(obsah6).toContainText('Na jejich názorech se to neprojevilo.');
  await expect(obsah6).toContainText('Bublina přitom existuje.');
  // Výhrady až ve zpětné vazbě druhé otázky.
  for (const cast of await page.locator('.krok__obsah > .ctenarsky').all()) await expect(cast).not.toContainText(/jen v USA|s firmou/);
  const cteni = page.locator('#cesta3-pokus-cteni');
  const zpetnaCteni = await volbaKlavesnici(page, cteni, /Ani jedno/);
  await expect(zpetnaCteni).toContainText('jednu síť, jednu zemi, tři měsíce, třetinu příspěvků');
  await expect(zpetnaCteni).toContainText('s firmou, které Facebook patří');
  await dalKlavesnici(page, cteni, 'Zpátky dolů', `${CESTA3}7/`);

  // Krok 7: vrací se z povinnosti, vypravěč si není jistý, ušlechtilá lež jednou.
  const text7 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text7.locator('.citat')).toHaveCount(2);
  await expect(text7.locator('.citat').first()).toContainText('kdyby ho mohli dostat do rukou');
  await expect(text7.locator('.citat').nth(1)).toContainText('Bůh ví, jestli je to pravda.');
  await expect(text7).toContainText('Vládnout má z povinnosti, ne z chuti.');
  await expect(text7).toContainText('Uvěřit jí mají pokud možno i sami vládci.');
  expect((await text7.innerText()).match(/ušlechtil/g)).toHaveLength(1);
  const rozhoduje = page.locator('#cesta3-kdo-rozhoduje');
  const zpetna7 = await volbaKlavesnici(page, rozhoduje, /Ti, kdo vidí dál/);
  await expect(zpetna7).toContainText('A smí ti kvůli tomu něco zamlčet?');
  await dalKlavesnici(page, rozhoduje, 'Tvoje pravidlo', `${CESTA3}8/`);

  // Krok 8: hlas i pro nesouhlas (spojencem je Aristotelés), odkaz na otázku 6 a vlastní pravidlo.
  const text8 = page.locator('.krok__obsah');
  await expect(text8).toContainText('Souhlasit s ním nemusíš.');
  await expect(text8).toContainText('Jestli ti stíny připadají skutečné dost, máš v něm spojence.');
  await expect(text8.getByRole('link', { name: 'Co je skutečné?' })).toHaveAttribute('href', '/otazka/co-je-skutecne/');
  await expect(text8).toContainText('Projdi své koše z kroku 2.');
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 2 · Odkud to vím?');
  await expect(panel.locator('.cast__nadpis')).toHaveText([SAM, LIDE, OBRAZOVKA, HLAVA]);
  await expect(panel.locator('.cast').nth(3).locator('li')).toHaveText(['Co si o mně myslí spolužák, se kterým skoro nemluvím', 'Že dvakrát dvě jsou čtyři']);
  const pole = page.getByRole('textbox', { name: 'Jak poznáš, co je skutečné, a co se jen tak jeví? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('Skutečné je to, co obstojí, i když se podívám odjinud.');
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  await dokoncit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA3}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  await page.goto('/denik/');
  const zapisy = page.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('Skutečné je to, co obstojí, i když se podívám odjinud.');
  await expect(zapisy).toContainText('Na začátku: spíš Platón. Po argumentech: spíš Aristotelés. Co mě posunulo: lékař a pacient.');
  await expect(zapisy).toContainText('O čtverci, který si jen myslíme.');
});

test('cesta 3 bez odkrytí bloků: lišta vede až na konec a text mimo bloky drží souvislost', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Jsou tam od dětství.', 'Podobní nám.'],
    ['stíny vyrobených věcí', 'Odkud víš to, co víš?'],
    ['někdo rozváže a donutí ho vstát', 'Slunce uvidí až nakonec.', 'Vězni si tam udíleli pocty'],
    ['Jeskyně je svět, který vidíme.', 'Věta platí přesně, jen ne o čtverci na tabuli.'],
    ['Platí o čtverci samém', 'Ideje nepřijal.', 'Rozcházejí se v tom, kde to obecné je.', 'Kdo z nich má pravdu, rozhodni sám.'],
    ['Jde o to, kam je člověk otočený.', 'na tři měsíce ubrali asi třetinu příspěvků', 'Na jejich názorech se to neprojevilo.', 'Mluví ten pokus pro jeskyni, nebo proti ní?'],
    ['Oči má plné tmy', 'nesmí nahoře zůstat', 'Říká se tomu ušlechtilá lež.', 'věřil bys mu?'],
    ['Souhlasit s ním nemusíš.', 'máš v něm spojence', 'Projdi své koše z kroku 2.'],
  ];
  await page.goto(`${CESTA3}1/`);
  for (let n = 1; n <= KROKY3.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY3[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani srovnání.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY3.length) {
      await page.getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA3}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA3}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');
  // V cestě nejsou scény a citáty, které nese portrét, ani jména, která do ní nepatří. Glaukón jen jednou, při vstupu.
  let glaukon = 0;
  for (let n = 1; n <= KROKY3.length; n++) {
    await page.goto(`${CESTA3}${n}/`);
    const text = await page.locator('.krok__obsah').innerText();
    expect(text, `krok ${n}`).not.toMatch(NEPATRI);
    glaukon += (text.match(/Glaukón/g) ?? []).length;
  }
  expect(glaukon).toBe(1);
});
