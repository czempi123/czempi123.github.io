// Cesta 5 „Co mám ve svých rukou?“: celý průchod jen klávesnicí na telefonu a jednou bez odkrytí bloků.
// Přehled a kroky na obou šířkách v obou režimech (axe, přesah, snímky) hlídá cesta.spec.ts.
import { test, expect, type Page } from '@playwright/test';

const CESTA5 = '/cesta/co-mam-ve-svych-rukou/';
const KROKY5 = ['Noha', 'Tři koše', 'Dvě půlky', 'Otrok a císař', 'Záleží na tom, co mě potká?', 'Snímek z chatu', 'Kamenná tvář', 'Tvoje pravidlo'];

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

test('cesta 5: celý průchod jen klávesnicí na telefonu, zápisy v deníku', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA5);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta · asi');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('8 kroků');
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=110&osoba=epiktetos');
  const zacit = page.getByRole('link', { name: 'Začít cestu' });
  await zacit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA5}1/`);
  await pripravit(page);

  // Krok 1: tradovaná scéna bez jména pána a bez roku, za ní doložená věta a jednou vysvětlená vůle.
  const pribeh = page.locator('.pribeh');
  await expect(pribeh).toContainText('Vypráví se, že mu pán jednou kroutil nohou.');
  await expect(pribeh).not.toContainText(/Epafrodit/);
  await expect(page.locator('.citat')).toHaveCount(2);
  await expect(page.locator('.citat').first()).toContainText('Neříkal jsem, že ji zlomíš?');
  await expect(page.locator('.citat').nth(1)).toContainText('Kulhání je překážkou nohy, ne vůle.');
  await expect(pribeh).toContainText('čím si věci vykládáš a čím se rozhoduješ');
  const dalsi = page.getByRole('link', { name: /Další krok/ });
  await dalsi.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA5}2/`);
  await pripravit(page);

  // Krok 2: osm karet do tří košů klávesnicí. Epiktétovo dělení ještě nezaznělo.
  await expect(page.locator('.krok__obsah > .ctenarsky')).not.toContainText(/naše dílo|v naší moci/);
  const kose = page.locator('#cesta5-tri-kose');
  const sem = (kos: string) => kose.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });
  await sem('Zčásti').focus();
  await page.keyboard.press('Enter'); // známka
  await sem('Mám v rukou').focus();
  await page.keyboard.press('Enter'); // učení
  await sem('Nemám v rukou').focus();
  await page.keyboard.press('Enter'); // třída
  await page.keyboard.press('Enter'); // jestli odepíše
  await sem('Mám v rukou').focus();
  await page.keyboard.press('Enter'); // odpověď na urážku
  await sem('Zčásti').focus();
  await page.keyboard.press('Enter'); // zdraví
  await sem('Nemám v rukou').focus();
  await page.keyboard.press('Enter'); // kolo
  await sem('Zčásti').focus();
  await page.keyboard.press('Enter'); // leknutí
  await expect(kose.getByRole('button', { name: 'Mám roztříděno' })).toBeFocused();
  await page.keyboard.press('Enter');
  const trideni = kose.getByRole('region', { name: 'Tvoje třídění' });
  await expect(trideni).toBeFocused();
  // Zpětná vazba vidí koš Zčásti a ptá se na půlky; žádný koš není správně.
  await expect(trideni).toContainText('Zkus tu kartu roztrhnout: která půlka je tvoje a která učitelova?');
  await expect(trideni).toContainText('Epiktétos dával tělo přesto celé mezi věci, které naše nejsou.');
  await expect(trideni).toContainText('Epiktétos měl jen dva koše.');
  // Co do kterého koše patří, řekne až citát v kroku 3 (revize P10: kroky 2 a 3 neříkají totéž dvakrát).
  await expect(trideni).not.toContainText('co je naše dílo');
  await expect(trideni).toContainText('A nechal bys v něm něco i tak?');
  await expect(trideni).not.toContainText(/správn|špatn/i);
  await dalKlavesnici(page, kose, 'Dvě půlky', `${CESTA5}3/`);

  // Krok 3: dělení citátem, vítr v nepřímé řeči, vlastní pokus s jednou kartou.
  const text3 = page.locator('.krok__obsah > .ctenarsky').first();
  await expect(text3.locator('.citat')).toHaveCount(1);
  await expect(text3.locator('.citat')).toContainText('Některé věci jsou v naší moci a jiné ne.');
  await expect(text3).toContainText('správcem větrů bůh neudělal je');
  const pulky = page.locator('#cesta5-dve-pulky');
  await pulky.getByRole('textbox').focus();
  await page.keyboard.type('Známka: moje je příprava, učitelovo je zadání.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const srovnani = pulky.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani).toBeFocused();
  await expect(srovnani).toContainText('Epiktétos by se zeptal, kterou půlku chceš.');
  // Blok vede ke kresbě pod sebou (tři karty k roztržení); další krok nabízí lišta.
  const kKresbe = pulky.getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
  await expect(kKresbe).toHaveText(/Co se stane s druhou půlkou/);
  await expect(kKresbe).toHaveAttribute('href', '#druha-pulka');
  await kKresbe.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dve-pulky-karta')).toBeVisible();
  const dalsi3 = page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ });
  await dalsi3.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA5}4/`);
  await pripravit(page);

  // Krok 4: dvě věty bez jména, kdo je kdo, se dozví až po vlastním odhadu.
  const text4 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text4).toContainText('Nikdy se neviděli.');
  await expect(text4.locator('.citat')).toHaveCount(1);
  await expect(text4.locator('.citat')).toContainText('Od Rustika');
  await expect(text4).toContainText('Lidi neznepokojují věci, ale jejich soudy o věcech.');
  await expect(text4).toContainText('A ten můžeš smazat hned.');
  await expect(text4).not.toContainText(/Rukojet|VIII, 47/);
  const odhad = page.locator('#cesta5-otrok-a-cisar');
  await odhad.getByRole('textbox').focus();
  await page.keyboard.type('Druhou napsal císař, zní jako rozkaz.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const odkryto = odhad.getByRole('region', { name: 'Srovnání' });
  await expect(odkryto).toBeFocused();
  await expect(odkryto).toContainText('První větu řekl Epiktétos, bývalý otrok.');
  await expect(odkryto).toContainText('Hovory k sobě VIII, 47');
  await dalKlavesnici(page, odhad, 'Záleží na tom, co mě potká?', `${CESTA5}5/`);

  // Krok 5: Spor dvou škol bez smyšleného setkání a bez ohlášeného vítěze.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5).toContainText('První věta byla Epiktétova, druhá Marcova.');
  await expect(text5.locator('.citat')).toHaveCount(4);
  // Poslední slovo před hlasováním nemá žádná strana.
  await expect(text5.locator(':scope > p').last()).toContainText('Oba tedy chtějí, aby člověk rány unesl.');
  const spor = page.locator('#cesta5-aristoteles-spor');
  await expect(spor).toContainText('Aristotelés zemřel dřív, než stoická škola vznikla.');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Epiktétos\s*Aristotelés/);
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš Epiktétos' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  // Každá strana odpovídá na nejsilnější námitku druhé; domyšlená odpověď je podaná jako výklad.
  await expect(argumenty).toContainText('Epiktétos by mohl odpovědět');
  await expect(argumenty).toContainText('Hříčkou náhody proto nejsem.');
  await expect(argumenty).toContainText('jako švec z kůže, kterou dostal');
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('švec a kůže');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš Epiktétos. Teď: spíš Aristotelés.');
  await expect(posun).not.toContainText(/správn|špatn|vyhrál/i);
  await dalKlavesnici(page, spor, 'Snímek z chatu', `${CESTA5}6/`);

  // Krok 6: tři citáty na začátku, případ bez historických osob, jedna změněná podmínka.
  const text6 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text6.locator('.citat')).toHaveCount(3);
  // Revize P10: krok mluví o urážce, ne o ublížení, a necituje větu „kdo tě bije“.
  await expect(text6).toContainText('Co dělat, když tě někdo urazí?');
  await expect(text6.locator('.citat').first()).toContainText('Když tě někdo podráždí, věz, že tě podráždil tvůj vlastní soud.');
  await expect(page.locator('.krok__obsah')).not.toContainText(/tě bije|ublíží|trapas/);
  await expect(text6.locator(':scope > p').last()).toContainText('Vyzkoušej je na jednom případu.');
  const chat = page.locator('#cesta5-snimek-z-chatu');
  await chat.getByRole('radio', { name: 'Nechám to být, ať to vyšumí.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(chat.getByRole('radio', { name: 'Ta zpráva je podvrh' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(chat.getByRole('radio', { name: 'Stalo se to kamarádovi' })).toBeChecked();
  await expect(chat.locator('.zmenena')).toContainText('Stalo se to tvému kamarádovi');
  await page.keyboard.press('Tab');
  await expect(chat.locator('.zmenena').getByRole('radio', { name: 'Ozvu se a řeknu nahlas, že to není v pořádku.' })).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zmena = chat.getByRole('region', { name: 'Posun odpovědi' });
  await expect(zmena).toBeFocused();
  await expect(zmena).toContainText('Za kamaráda bys jednal jinak než za sebe.');
  // Tři hlasy jako výklad: Epiktétos, Marcus a Aristotelés, který dává za pravdu tomu, kdo se zlobí.
  await expect(chat.getByRole('heading', { name: 'Co by na to řekli' })).toBeVisible();
  await expect(chat.locator('.co-udelal')).toContainText('Epiktétos by nejspíš neodpověděl hned.');
  await expect(chat.locator('.co-udelal')).toContainText('Marcus Aurelius by stejnou mincí nevracel');
  await expect(chat.locator('.co-udelal')).toContainText('Aristotelés by řekl, že zlobit se tady máš');
  await dalKlavesnici(page, chat, 'Kamenná tvář', `${CESTA5}7/`);

  // Krok 7: pokus vyprávěný přímo, jen tři tvrzení ze souhrnu; výhrady až ve zpětné vazbě.
  const text7 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text7).toContainText('Psycholog pustil sto dvaceti lidem film');
  // Shrnutí drží, co měla první skupina dělat (revize P10).
  await expect(text7).toContainText('aby nic necítili');
  await expect(text7).not.toContainText('ukázal');
  await expect(text7).not.toContainText(/Gross|sympatick|laboratoři|zrada/);
  await expect(text7.locator(':scope > p').last()).toContainText('pracovalo tělo naopak víc');
  const pokus = page.locator('#cesta5-pokus');
  await pokus.getByRole('radio', { name: /Nedá se říct/ }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(pokus.getByRole('region', { name: 'Zpětná vazba' })).toContainText('minuty v laboratoři');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(pokus.locator('details.ostatni')).toContainText('Tohle by řekl Aristotelés');
  await dalKlavesnici(page, pokus, 'Tvoje pravidlo', `${CESTA5}8/`);

  // Krok 8: hlas i pro nesouhlas, návrat ke košům a vlastní pravidlo, které se uloží samo.
  const text8 = page.locator('.krok__obsah');
  await expect(text8).toContainText('Souhlasit s nimi nemusíš.');
  await expect(text8).toContainText('Aristotelés by řekl, že na zdraví, přátelích a pověsti záleží');
  await expect(text8.getByRole('link', { name: 'Jsem svobodný?' })).toHaveAttribute('href', '/otazka/jsem-svobodny/');
  await expect(text8.getByRole('link', { name: 'Jak mám žít?' })).toHaveAttribute('href', '/otazka/jak-zit/');
  await expect(text8).toContainText('Kterou věc z koše „Zčásti“ teď dokážeš roztrhnout na dvě půlky?');
  // Vedle pravidla stojí koše, jak je student v kroku 2 opravdu uložil.
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 2 · Tři koše');
  await expect(panel.locator('.cast__nadpis')).toHaveText(['Mám v rukou', 'Zčásti', 'Nemám v rukou']);
  await expect(panel.locator('.cast').nth(1).locator('li')).toHaveText(['Známka ze čtvrtletky', 'Jestli budu v sobotu zdravý na zápas', 'Že se leknu, když mě vyvolají']);
  const pole = page.getByRole('textbox', { name: 'Co máš ve svých rukou? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('V rukou mám to, co udělám. Na zbytku mi záleží, ale nestojím na něm.');
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  await dokoncit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA5}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  await page.goto('/denik/');
  const zapisy = page.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('V rukou mám to, co udělám. Na zbytku mi záleží, ale nestojím na něm.');
  await expect(zapisy).toContainText('Zčásti: Známka ze čtvrtletky; Jestli budu v sobotu zdravý na zápas; Že se leknu, když mě vyvolají.');
  await expect(zapisy).toContainText('Na začátku: spíš Epiktétos. Po argumentech: spíš Aristotelés. Co mě posunulo: švec a kůže.');
  await expect(zapisy).toContainText('Druhou napsal císař, zní jako rozkaz.');
});

test('cesta 5 bez odkrytí bloků: lišta vede až na konec a text mimo bloky drží souvislost', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Vypráví se, že mu pán jednou kroutil nohou.', 'Co všechno mu pán mohl vzít? A co ne?'],
    ['je tohle v mých rukou, nebo není?'],
    ['Některé věci jsou v naší moci a jiné ne.', 'správcem větrů bůh neudělal je', 'Každou věc z něj by roztrhl na dvě půlky'],
    ['Nikdy se neviděli.', 'Lidi neznepokojují věci, ale jejich soudy o věcech.', 'A ten můžeš smazat hned.'],
    ['První věta byla Epiktétova, druhá Marcova.', 'mluví naprázdno', 'jestli mu velká rána bere kus štěstí', 'Aristotelés zemřel dřív, než stoická škola vznikla.'],
    ['Kdo získá čas, snáz se ovládne.', 'je otrocké', 'vyfotí tvou zprávu ze soukromého chatu'],
    ['Nemám být bez citu jako socha.', 'pracovalo tělo naopak víc'],
    ['Souhlasit s nimi nemusíš.', 'Aristotelés by řekl, že na zdraví, přátelích a pověsti záleží', 'Kterou věc z koše „Zčásti“ teď dokážeš roztrhnout na dvě půlky?'],
  ];
  await page.goto(`${CESTA5}1/`);
  for (let n = 1; n <= KROKY5.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY5[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani výsledek.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY5.length) {
      await page.getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA5}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA5}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');
  // V cestě nejsou citáty ani scény, které nesou portréty, a pán v ní nemá jméno.
  for (let n = 1; n <= KROKY5.length; n++) {
    await page.goto(`${CESTA5}${n}/`);
    await expect(page.locator('.krok__obsah')).not.toContainText(/Nohu mi spoutáš|Zítra najdeš hliněnou|Filozofova škola je ordinace|Ty udělej své|nezcísařštíš|Každá věc má dvě ucha|jsi herec ve hře|Epafrodit|Helvidi|Musoni|Cassi|v noci/);
  }
});
