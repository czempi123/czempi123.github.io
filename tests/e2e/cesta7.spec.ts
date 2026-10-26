// Cesta 7 „Čí život vlastně žiju?“ a hlas Hipparchie na stránce velké otázky 1 „Jak mám žít?“.
// Průchod s odpověďmi na telefonu (deník, závěr „Na začátku × Teď“), průchod bez odkrytí bloků (text drží souvislost),
// Návrat v deníku, pátý hlas otázky 1 a vstupy z profilů. Přehled a kroky na obou šířkách v obou režimech
// (axe, přesah, snímky) hlídá cesta.spec.ts, kresbu treti-cara.spec.ts, hlavičku společného profilu krates-hipparchia.spec.ts.
// Hlídá i pravidla celku 8 (podklady › Citlivá místa): cesta se ptá, čí je rozhodnutí, ne jestli odejít nebo vzdorovat;
// výhrůžka z DL VI, 96 nikde; rodiče nejsou záporné postavy; žádné pole na psaní o rodině, víře, vztahu nebo profilu;
// rebelie není ctnost; přizpůsobiví lidé nejsou ovce; smích skupiny jednomu (obrácený pokus) jen v listu pro učitele.
import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CESTA7 = '/cesta/ci-zivot-vlastne-ziju/';
const KROKY7 = ['Ženich a jeho majetek', 'Podle přírody, ne podle zvyku', 'Tři oboly', 'Svazují mě zvyky?', 'Jinou nadutostí', 'Třetí čára', 'Kdo je na tvé straně', 'Nejdřív ty'];
const NEPATRI = /zabi(je|t)|sebevra|vyhrož|oprátk|ovce|ovc[ei]|stádo|vzepř|vzdoruj|\buteč|odejdi z domu|poslechni|rodiče nemají pravdu|vydrž|smáli|smích|posměch|nevěstin|nah[ýá]|svlékl|strh|honil.*hol|bohoslu|víra|věří(š|cí)|modl|tvůj profil|tvých sledujících|kapesn|dokázal[ayi]? |prokázal|buď sám sebou!/i;

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
const denik = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));

async function dal(page: Page, blok: Locator, nazev: string, n: number) {
  await blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: `Další krok: ${nazev}` }).click();
  await expect(page).toHaveURL(`${CESTA7}${n}/`);
  await pripravit(page);
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(v.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
}

/** Zpětná vazba nehodnotí a nikoho nenálepkuje. */
async function bezHodnoceni(region: Locator) {
  await expect(region).not.toContainText(/správn|špatn|výborn|skvěl|ovce|slab(ý|ost)|pozér/i);
}

test('cesta 7: průchod s odpověďmi na telefonu, zastánci všech Voleb, závěr Na začátku × Teď a zápisy v deníku', async ({ page }) => {
  test.setTimeout(150_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA7);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta 7');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('8 kroků');
  // Filozofové cesty jsou Diogenés, Kratés a Hipparchia; Kratés a Hipparchia vedou na společný profil.
  const lide = page.locator('.cesta__hlava .lide a');
  await expect(lide).toHaveText(['Diogenés', 'Kratés', 'Hipparchia']);
  expect(await lide.evaluateAll((a) => a.map((x) => x.getAttribute('href')))).toEqual(['/osobnost/diogenes/', '/osobnost/krates-a-hipparchia/', '/osobnost/krates-a-hipparchia/']);
  await expect(page.locator('.radek-pomoci')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(NEPATRI);
  await page.getByRole('link', { name: 'Začít cestu' }).click();
  await expect(page).toHaveURL(`${CESTA7}1/`);
  await pripravit(page);

  // Krok 1: příběh s rytinou Cats 1637, rodiče mají strach a prosí Kratéta; Kratétova podmínka jako citát.
  const pribeh = page.locator('#zenich-a-majetek');
  await expect(pribeh.locator('img')).toHaveAttribute('src', /krates-hipparchia-cats/);
  await expect(pribeh).toContainText('Vypráví se, že Hipparchia vyrostla v Maróneii v bohaté rodině.');
  await expect(pribeh).toContainText('Rodiče se o ni báli.');
  await expect(pribeh.locator('.citat')).toContainText('Tady je ženich a tohle je jeho majetek. Podle toho se rozhodni.');
  const tah = page.locator('#cesta7-komu-patri');
  await expect(tah.getByRole('heading', { name: 'Komu patřilo to rozhodnutí?' })).toBeVisible();
  await expect(tah.getByRole('radio')).toHaveCount(4);
  await tah.getByText('Rodičům. Mají o ni strach a znají svět.').click();
  await tah.getByRole('textbox').fill('bojí se o ni');
  await tah.getByRole('button', { name: 'Tohle je můj tah' }).click();
  const zpetna1 = tah.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna1).toContainText('Bereš vážně jejich strach, a ten byl skutečný');
  await bezHodnoceni(zpetna1);
  await dal(page, tah, 'Podle přírody, ne podle zvyku', 2);

  // Krok 2: kynická příroda není „buď sám sebou“; Roztřiď bez vlastní karty.
  const text2 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text2).toContainText('Kynici neříkali „buď sám sebou“.');
  await expect(text2).toContainText('pravý kynik má místo zdí a dveří stud');
  const trideni = page.locator('#cesta7-kdo-to-chce');
  await expect(trideni.getByRole('textbox')).toHaveCount(0);
  const sem = trideni.getByRole('button', { name: /^Dát sem kartu/ });
  for (let i = 0; (await sem.count()) > 0 && i < 20; i++) await sem.nth(i % 3).click({ force: true });
  await trideni.getByRole('button', { name: 'Mám roztříděno' }).click();
  await expect(trideni).toContainText('Jak by třídil kynik');
  await bezHodnoceni(trideni.getByRole('region', { name: 'Tvoje třídění' }));
  await dal(page, trideni, 'Tři oboly', 3);

  // Krok 3: ceník a dým; Odkryj s modelovými ceníky.
  const text3 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text3.locator('.citat').first()).toContainText('filozofovi tři oboly');
  await expect(text3).toContainText('Kuchař tedy dostane tisíckrát víc než lékař a lichotník třicetkrát víc než kuchař.');
  const cenik = page.locator('#cesta7-cenik-dnes');
  await cenik.getByRole('textbox').first().fill('Influencerovi hodně, učiteli málo.');
  await cenik.getByRole('button', { name: 'Porovnat s Kratétem' }).click();
  await expect(cenik.getByRole('region', { name: 'Srovnání' })).toContainText('dostane tři oboly');
  await dal(page, cenik, 'Svazují mě zvyky?', 4);

  // Krok 4: Spor bez smyšleného setkání; oba se odvolávají na přírodu a nikdo nevyhraje.
  const spor = page.locator('#cesta7-zvyky-spor');
  await expect(spor).toContainText('Jestli spolu mluvili, nevíme.');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await spor.getByRole('radio').nth(1).check({ force: true });
  await spor.getByRole('button', { name: 'Tady stojím' }).click();
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toContainText('Jsem spoluobčan Diogena.');
  await expect(argumenty).toContainText('Pravá ruka je od přírody silnější');
  await expect(argumenty).toContainText('I kynik se cvičí celý život, jako atlet nebo flétnista.');
  await expect(spor).toContainText('dobrým se člověk stává zvykem');
  await expect(argumenty).not.toContainText(/rodin|narodil ses tam|patříš tam/i);
  await spor.locator('.skala').getByRole('radio').nth(3).check({ force: true });
  await spor.getByRole('button', { name: 'Zapsat konečnou polohu' }).click();
  await expect(spor.getByRole('region', { name: 'Tvůj posun' })).not.toContainText(/vyhrál/i);
  await dal(page, spor, 'Jinou nadutostí', 5);

  // Krok 5: tři výtky (Sókratés, Platón, Epiktétos); vzdor není svoboda; Změň jednu věc „Nikdo se nedívá“.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5.locator('.citat')).toHaveCount(3);
  await expect(text5).toContainText('Vzdor ještě není svoboda.');
  await expect(text5).toContainText('Kdo dělá opak jen proto, aby se vymezil');
  await expect(text5).toContainText('Epiktétův kynik se má stydět za to, co je špatné.');
  await expect(page.locator('#cesta7-nikdo-se-nediva')).toContainText('potřebuje dokázat, že je nad věcí');
  const zmena = page.locator('#cesta7-nikdo-se-nediva');
  await zmena.getByRole('radio').first().check({ force: true });
  await zmena.getByRole('button', { name: 'Rozhodnuto' }).click();
  await zmena.locator('.cip').first().click();
  await zmena.locator('.zmenena').getByRole('radio').nth(1).check({ force: true });
  await zmena.locator('.zmenena .blok__tl--hlavni').click();
  await expect(zmena.getByRole('heading', { name: 'Co by na to řekli' })).toBeVisible();
  await expect(zmena.getByRole('heading', { name: /^Co udělal/ })).toHaveCount(0);
  await dal(page, zmena, 'Třetí čára', 6);

  // Krok 6: kresba nad Volbou, Volba vede vlastním Kam dál na výsledky pod sebou.
  await expect(page.locator('#treti-cara')).toBeVisible();
  const rada = page.locator('#cesta7-tvoje-rada');
  await expect(rada.getByRole('heading', { name: 'Co řekneš, až na tebe přijde řada?' })).toBeVisible();
  await rada.getByText('Řeknu totéž co ostatní.').click();
  await rada.getByRole('button', { name: 'Tohle je můj tah' }).click();
  const zpetna6 = rada.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna6).toContainText('hloupé to není');
  await expect(zpetna6).not.toContainText(/procent|třetin|čtvrtin/i);
  await bezHodnoceni(zpetna6);
  await rada.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: 'Co z pokusu vyšlo' }).click();
  await expect(page).toHaveURL(`${CESTA7}6/#co-vyslo`);
  const text6 = page.locator('.krok__obsah');
  await expect(text6).toContainText('Čtvrtina lidí neustoupila ani jednou.');
  await expect(text6).toContainText('S většinou pak šlo jen asi pět odpovědí ze sta.');
  await expect(text6).toContainText('Stačil k tomu kdokoli, kdo nahlas řekl, co vidí.');
  await expect(text6).toContainText('Pokus neříká, kdo je slabý. Říká, jak těžké je být jediný.');
  await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
  await expect(page).toHaveURL(`${CESTA7}7/`);
  await pripravit(page);

  // Krok 7: zastánci všech odpovědí z kroků 1, 5 a 6; spojenci jsou i jiní myslitelé než kynici.
  const obsah7 = page.locator('.krok__obsah');
  for (const veta of [
    'Jestli jsi řekl, že jí, máš na své straně Hipparchii samotnou',
    'Jestli jsi řekl, že rodičům, stojí za tebou Aristotelés.',
    'Jestli jsi řekl, že Kratétovi, máš Sókrata.',
    'Ne podle toho, co si myslí všichni ostatní.',
    'Kratés ale za Hipparchii nerozhodl.',
    'Jestli jsi řekl, že nikomu z nich samotnému, máš Aristotela podruhé.',
    'Jestli je to podle tebe kynický čin, máš Epiktéta',
    'Jestli jiná nadutost, máš Platóna i Sókrata.',
    'A jestli záleží na tom, proč to dělá, máš zase Epiktéta.',
    'Jestli řekneš, co vidíš, máš na své straně čtvrtinu Aschových studentů',
    'Jestli řekneš totéž co ostatní, nejsi sám, a hloupé to není.',
    'Jestli zaváháš, nevědět je začátek, ne chyba.',
    'A jestli počkáš na spojence, máš za sebou Asche samotného.',
  ]) await expect(obsah7).toContainText(veta);
  await expect(obsah7.locator('.citat')).toHaveCount(2);
  await expect(obsah7.getByRole('link', { name: 'Jak mám žít?' })).toHaveAttribute('href', '/otazka/jak-zit/');
  await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
  await expect(page).toHaveURL(`${CESTA7}8/`);
  await pripravit(page);

  // Krok 8: Zkus to žít soukromě a bezpečně, závěr s panelem Na začátku × Teď.
  const vyzva = page.locator('#zkus-to-zit');
  await expect(vyzva).toContainText('Nejdřív ty');
  await expect(vyzva).toContainText('Nikomu to říkat nemusíš.');
  await expect(vyzva).not.toContainText(/stydíš|nahlas před|ukaž|zveřejni/i);
  await expect(page.locator('.krok__obsah')).toContainText('Komu podle tebe patřilo Hipparchiino rozhodnutí?');
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 1 · Ženich a jeho majetek');
  await expect(panel.locator('.zacatek .cast').nth(0)).toHaveText('Rodičům. Mají o ni strach a znají svět.');
  const pole = page.getByRole('textbox', { name: 'Podle čeho poznáš, že je rozhodnutí opravdu tvoje? Napiš svoje pravidlo.' });
  await pole.fill('Moje je, když bych ho udělal, i kdyby se nikdo nedíval.');
  await pole.blur();
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA7}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  const zapisy = ((await denik(page)).zapisy as { id: string; odpoved: string }[]).reduce<Record<string, string>>((a, z) => ({ ...a, [z.id]: z.odpoved }), {});
  expect(Object.keys(zapisy).sort()).toEqual(['cesta7-cenik-dnes', 'cesta7-kdo-to-chce', 'cesta7-komu-patri', 'cesta7-moje-pravidlo', 'cesta7-nikdo-se-nediva', 'cesta7-tvoje-rada', 'cesta7-zvyky-spor']);
  expect(zapisy['cesta7-komu-patri']).toContain('Rodičům.');
});

test('cesta 7 bez odkrytí bloků: lišta vede až na konec, text drží souvislost a citlivá místa', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const NAVAZUJE: string[][] = [
    ['Rodiče se o ni báli.', 'A k tomu podmínku, kterou musela přijmout ona sama.'],
    ['Hipparchia si vybrala.', 'Kynik nechtěl být jiný než ostatní. Chtěl být člověkem.'],
    ['Je to satira na to, za co lidé platí.', 'Lidé za něj platí nejvíc, protože žijí podle toho, jak vypadají před druhými.'],
    ['I on se odvolával na přírodu. Vyvozoval z ní ale skoro opak.'],
    ['Kdo okázale pohrdá míněním druhých, pořád hraje pro ně, jen jinou roli.', 'Vzdor ještě není svoboda.'],
    ['Nezasvěcený seděl předposlední', 'Neustoupit neznamenalo vzdorovat.', 'Říká, jak těžké je být jediný.'],
    ['Žádnou z nich cesta nevyvrátila a každá má zastánce. Nejen mezi kyniky.'],
    ['Komu podle tebe patřilo Hipparchiino rozhodnutí?'],
  ];
  await page.goto(`${CESTA7}1/`);
  for (let n = 1; n <= KROKY7.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY7[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY7.length) {
      await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA7}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA7}#hotovo`);

  const citaty: string[] = [];
  for (let n = 1; n <= KROKY7.length; n++) {
    await page.goto(`${CESTA7}${n}/`);
    const text = await page.locator('.krok__obsah').innerText();
    expect(text, `krok ${n}`).not.toMatch(NEPATRI);
    // Žádné pole na psaní o rodině, víře, vztahu, identitě, penězích ani profilu na sítích.
    for (const popisek of await page.locator('.krok__obsah label, .krok__obsah h3').allInnerTexts()) expect(popisek, `krok ${n}`).not.toMatch(/tvoji rodiče|tvoje rodina|u vás doma|tvůj vztah|tvoje víra|kým jsi|tvůj profil|kolik máš peněz|kapesné/i);
    citaty.push(...(await page.locator('.krok__obsah .citat blockquote').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()))));
    expect(await page.locator('.krok__obsah .citat').count(), `krok ${n}`).toBeLessThanOrEqual(3);
  }
  expect(new Set(citaty).size).toBe(citaty.length);

  // Tentýž citát nejvýš dvakrát v celku: cesta, společný profil a stránka otázky 1 dohromady.
  const jinde: string[] = [];
  for (const adresa of ['/osobnost/krates-a-hipparchia/', '/otazka/jak-zit/']) {
    await page.goto(adresa);
    jinde.push(...(await page.locator('.citat blockquote').evaluateAll((x) => x.map((y) => y.textContent!.replace(/\s+/g, ' ').trim()))));
  }
  const pocty = new Map<string, number>();
  for (const c of [...citaty, ...jinde]) pocty.set(c, (pocty.get(c) ?? 0) + 1);
  expect([...pocty].filter(([, n]) => n > 2)).toEqual([]);
  // Hipparchiina odpověď Theodórovi stojí v profilu a na otázce 1, v cestě ne.
  expect(citaty.some((c) => c.includes('Jsem to já, Theodóre'))).toBe(false);
});

test('Návrat cesty 7 v deníku: Císařovy nové šaty i s koncem, bez pramenů a bez „buď jako to dítě“', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/denik/');
  await page.evaluate(() => {
    const pred = (dni: number) => new Date(Date.now() - dni * 24 * 60 * 60 * 1000).toISOString();
    const slug = 'ci-zivot-vlastne-ziju';
    const d = {
      verze: 1, vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
      zapisy: [{ id: 'cesta7-moje-pravidlo', otazka: 'Podle čeho poznáš, že je rozhodnutí opravdu tvoje? Napiš svoje pravidlo.', odpoved: 'Moje je, co bych udělal i bez diváků.', odkaz: `/cesta/${slug}/8/`, kdy: pred(3.2) }],
      cesty: { [slug]: { nazev: 'Čí život vlastně žiju?', pocet: 8, krok: 8, navstivene: [1, 2, 3, 4, 5, 6, 7, 8], kdy: pred(3.2), dokonceno: pred(3.2) } },
    };
    localStorage.setItem('atlas-denik', JSON.stringify(d));
  });
  await page.reload();
  await pripravit(page);
  const nabidka = page.getByRole('region', { name: 'Návrat', exact: true });
  await expect(nabidka).toContainText('Čí život vlastně žiju?');
  await nabidka.getByRole('button', { name: 'Zkusit' }).click();
  const blok = page.locator('#cesta7-navrat');
  await expect(blok.locator('.pravidlo')).toHaveText('Moje je, co bych udělal i bez diváků.');
  await expect(blok).toContainText('Řekne si ale, že teď musí průvod vydržet');
  await expect(blok).toContainText('Jdeš kousek za nimi.');
  await expect(blok).not.toContainText(/Andersen|1837|Asch|procent|buď jako|odvážn/i);
  await blok.getByRole('radio', { name: 'Nevím' }).check({ force: true });
  await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
  const odpoved = blok.getByRole('region', { name: 'Tvoje odpověď' });
  await expect(odpoved).toContainText('Čí život podle tebe žije císař v poslední větě: svůj, nebo průvodu?');
  await bezHodnoceni(odpoved);
  await axe(page);
});

test('otázka 1: pátý hlas Hipparchie mluví o tom, kdo o čase rozhoduje, a cesty 4, 6, 7 a 34', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/jak-zit/');
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="PrvniNazor"][ssr]'));
  await page.locator('#jak-zit-prvni-pole').fill('Podle lidí.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  // Pořadí podle narození: Hipparchia za Diogenem a Epikúrem, před Senekou.
  const JMENA = ['Aristotelés', 'Diogenés', 'Hipparchia', 'Epikúros', 'Seneca'];
  const jmena = await page.locator('.odpoved__jmeno').allInnerTexts();
  expect(jmena).toHaveLength(5);
  expect(new Set(jmena)).toEqual(new Set(JMENA));
  expect(jmena.indexOf('Hipparchia')).toBeLessThan(jmena.indexOf('Seneca'));
  expect(jmena.indexOf('Diogenés')).toBeLessThan(jmena.indexOf('Hipparchia'));
  const odpoved = page.locator('.odpoved').filter({ hasText: 'Hipparchia' });
  await expect(odpoved).toContainText('kdo určil, kam má tvůj čas patřit');
  await expect(odpoved).not.toContainText(/pro sebe|sobě|sám pro/i);
  expect((await odpoved.locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length).toBeLessThanOrEqual(2);
  const hlas = page.locator('#hlas-hipparchia');
  await expect(hlas.locator('.citat')).toContainText('Jsem to já, Theodóre.');
  await expect(hlas.locator('.hlas__jmeno a')).toHaveAttribute('href', '/osobnost/krates-a-hipparchia/');
  await expect(page.locator('.cesta-karta')).toHaveCount(4);
  await expect(page.locator(`.cesta-karta[href="${CESTA7}"]`)).toHaveCount(1);
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('cesta 7 je dosažitelná z profilů, z Lidí, z přehledu otázek a z Domů', async ({ page }) => {
  await page.goto('/osobnost/krates-a-hipparchia/');
  await expect(page.locator('#volba').getByRole('link', { name: 'Čí život vlastně žiju?' })).toHaveAttribute('href', CESTA7);
  await expect(page.locator('.kamdal').getByRole('link', { name: /Čí život vlastně žiju\?/ })).toHaveAttribute('href', CESTA7);
  await page.goto('/lide/');
  await expect(page.locator('#krates .karta__cesta')).toHaveText('Cesta 7: Čí život vlastně žiju?');
  await expect(page.locator('#hipparchia .karta__cesta')).toHaveText('Cesta 7: Čí život vlastně žiju?');
  await page.goto('/otazky/');
  await expect(page.locator('#jak-zit .cesta')).toHaveCount(4);
});
