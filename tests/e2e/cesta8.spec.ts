// Cesta 8 „Proč se bát smrti?“: celý průchod jen klávesnicí na telefonu a jednou bez odkrytí bloků.
// Přehled a kroky na obou šířkách v obou režimech (axe, přesah, snímky) hlídá cesta.spec.ts, kresbu zrcadlo.spec.ts.
// Hlídá i tón celku 6: první obrazovka je dopis, ne nemoc; každý argument říká, na který strach míří; Epikúros říká
// „netýká se nás“, ne „nic není“; o smrti blízkých argument nemluví a cesta to říká sama; studie „zkoušela“;
// student, který nesouhlasí, má spojence; nikde není způsob smrti, obhajoba dobrovolné smrti ani klid a spánek
// jako to, co čeká.
import { test, expect, type Page } from '@playwright/test';

const CESTA8 = '/cesta/proc-se-bat-smrti/';
const KROKY8 = ['Dopis', 'Čeho se vlastně bojíme', '„Netýká se nás“', 'Zrcadlo', 'Host u stolu', 'Týká se nás?', 'Ti druzí', 'Blízko', 'Tvoje pravidlo'];
// Co do cesty nepatří (zadání P8, podkladový list celku 6: Citlivá místa, Tón, Překryvy).
const NEPATRI = /nácvik|každý den na smrt|vysvobo|úlev|\bklid|spán|usnou|o nic nejde|bolest je krátká|krátká bolest|pět věcí|litují|dobrovoln|sebevra|vzít si život|vzal si život|dveře|Hégési|Marcellin|statečné i žít|Poručil jsem si|Paulin|večerní|krátkost|vodní hodiny|umíráme každý den|nejhorší|Ídomene|Hermarch|Theón|Aufidi|Bassus|močen|měchýř|střev|úplavic|dusi[lt]|dušnost|rakovin|\bALS\b|poprav|Texas|lebk|hřbitov|rakev|rakv|hrob|mrtvol|až umřeš|až tu nebudeš|zisk|dokázal[ay]? |ukázal[ay]? |prokázal/i;

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

async function listouKlavesnici(page: Page, adresa: string) {
  await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).focus();
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
  return zpetna;
}

test('cesta 8: celý průchod jen klávesnicí na telefonu, zápisy v deníku', async ({ page }) => {
  test.setTimeout(150_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA8);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta · asi');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('9 kroků');
  // Přehled: tichý řádek pomoci stojí pod úvodem, jedním zněním a bez výzvy; nemoc ani způsob na přehledu nejsou.
  const uvod = page.locator('.uvod');
  await expect(uvod.locator('.radek-pomoci')).toHaveText('Pro případ, že by se to hodilo: Linka bezpečí 116 111, zdarma a nonstop, i jako chat na linkabezpeci.cz.');
  await expect(uvod.locator('.radek-pomoci a')).toHaveAttribute('href', 'https://www.linkabezpeci.cz/');
  await expect(page.locator('main')).not.toContainText(NEPATRI);
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=-270&osoba=epikuros');
  // Lucretius nemá vlastní stránku (v pramenech není jeho místo, medailonek nevznikl): v hlavičce je jménem bez odkazu a v Kam dál chybí. Plútarchos má medailonek (M1).
  await expect(page.locator('.cesta__hlava .lide')).toHaveText(/Epikúros\s*Lucretius\s*Seneca/);
  await expect(page.locator('.cesta__hlava .lide a')).toHaveText(['Epikúros', 'Seneca', 'Plútarchos']);
  await expect(page.locator('#hotovo a[href^="/osobnost/"]')).toHaveText(['Epikúros: celý příběh', 'Seneca: celý příběh', 'Plútarchos: medailonek']);
  await page.getByRole('link', { name: 'Začít cestu' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA8}1/`);
  await pripravit(page);

  // Krok 1: první obrazovka je dopis. Adresát je „přítel“, nemoc má jednu větu bez těla a scéna končí dětmi.
  const pribeh = page.locator('.pribeh');
  await expect(pribeh).toContainText('Starý muž píše příteli. Dopis je krátký a zachoval se. Začíná takhle:');
  const scena = await pribeh.innerText();
  expect(scena.indexOf('Starý muž píše')).toBeLessThan(scena.indexOf('nemocný'));
  expect(scena.match(/nemoc/g)).toHaveLength(1);
  await expect(pribeh.locator('.citat')).toHaveCount(3);
  await expect(pribeh.locator('.citat').first()).toContainText('ve šťastný a zároveň poslední den svého života');
  await expect(pribeh.locator('.citat figcaption').first()).toHaveText(/Epikúros,\s+Dopis z\s+posledního dne\s+Diogenés Laertios X,\s+22/);
  await expect(pribeh).toContainText('Dva týdny byl těžce nemocný a bolest už podle něj nemohla být větší.');
  await expect(pribeh.locator('.citat').nth(2)).toContainText('postarej o Métrodórovy děti');
  await expect(pribeh).toContainText('Tím dopis končí.');
  await expect(pribeh.locator('img')).toHaveCount(0);
  const text1 = page.locator('.krok__obsah > .ctenarsky');
  // „Šťastný den“ není měřítko: škola netvrdila, že moudrého nic nebolí.
  await expect(text1).toContainText('Epikúros nepíše, že ho nic nebolí.');
  await expect(text1).toContainText('učila, že i moudrý bude v bolestech sténat a naříkat');
  await expect(text1.locator(':scope > p').last()).toHaveText('Přes třicet let přitom učil, že smrt se nás netýká. Jak to myslel, přijde ve třetím kroku. Nejdřív odpověz ty.');
  // Začátek cesty: čtyři možnosti, každá se spojencem; žádná zpětná vazba nehodnotí víru ani nevíru.
  const rozumne = page.locator('#cesta8-je-rozumne');
  await expect(rozumne.getByRole('radio')).toHaveCount(4);
  const zpetna1 = await volbaKlavesnici(page, rozumne, /Záleží na tom, co je po ní/);
  await expect(zpetna1).toContainText('platí jen tehdy, když smrtí všechno končí');
  await expect(zpetna1).toContainText('Sókratés v Platónově Obraně říká, že neví, co po smrti je');
  await expect(zpetna1).toContainText('V jiném Platónově dialogu hájí, že duše smrtí nekončí.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const jinak = rozumne.locator('details.ostatni');
  await expect(jinak).toContainText('Aristotelés to viděl stejně.');
  await expect(jinak).toContainText('Epikúrova věta mluví jen o té první a o umírání mlčí.');
  await expect(jinak).toContainText('Ta věta míří na strach z toho, že člověk nebude.');
  await expect(rozumne).not.toContainText(/útěk|utík|odvah|odvážn|zbaběl|slab|naivn|iluz|berlič|střízliv|dospěl|zbytečn|neboj se/i);
  await expect(rozumne.locator('.co-udelal')).toHaveCount(0);
  await dalKlavesnici(page, rozumne, 'Čeho se vlastně bojíme', `${CESTA8}2/`);

  // Krok 2: osm cizích vět do čtyř košů; nic vlastního se nepíše.
  await expect(page.locator('.krok__obsah > .ctenarsky')).toContainText('Žádná z nich nemusí být tvoje.');
  const kose = page.locator('#cesta8-ctyri-kose');
  await expect(kose.getByRole('textbox')).toHaveCount(0);
  const sem = (kos: string) => kose.getByRole('button', { name: new RegExp(`^Dát sem kartu .* do koše ${kos}$`) });
  for (const kos of ['Na to, že nebude', 'Na to, že nebude', 'Na umírání', 'Na to, že nebude', 'Na to, o co přijde', 'Na to, o co přijde', 'Na ty druhé', 'Na ty druhé']) {
    await sem(kos).focus();
    await page.keyboard.press('Enter');
  }
  await expect(kose.getByRole('button', { name: 'Mám roztříděno' })).toBeFocused();
  await page.keyboard.press('Enter');
  const trideni = kose.getByRole('region', { name: 'Tvoje třídění' });
  await expect(trideni).toBeFocused();
  // Zpětná vazba vidí, kam karta přišla; karta o smrti blízkého se neptá na studentovu ztrátu.
  await expect(trideni).toContainText('Dal jsi ji k tomu, že člověk nebude.');
  await expect(trideni).toContainText('nemluví o vlastní smrti');
  await expect(trideni).toContainText('cesta se k ní vrátí v sedmém kroku');
  // Na který strach argument míří, řekne cesta dřív, než to student namítne.
  await expect(trideni).toContainText('ta míří jen na první koš: na strach z toho, že člověk nebude');
  await expect(trideni).toContainText('A o lidech, na kterých nám záleží, ta věta nemluví vůbec.');
  await dalKlavesnici(page, kose, '„Netýká se nás“', `${CESTA8}3/`);

  // Krok 3: „netýká se nás“, ne „nic není“; „zvykej si“; město bez hradeb; argument stojí na předpokladu.
  const text3 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text3.locator(':scope > p').first()).toContainText('Na ten míří Epikúrova věta, a jen na ten.');
  await expect(text3.locator('.citat')).toHaveCount(3);
  await expect(text3.locator('.citat').first()).toContainText('Zvykej si na myšlenku, že smrt se nás netýká.');
  await expect(text3.locator('.citat').nth(1)).toContainText('dokud jsme tu my, smrt tu není');
  await expect(text3.locator('.citat').nth(2)).toContainText('ve městě bez hradeb');
  await expect(text3).toContainText('Epikúros neříká, že smrt nic není.');
  await expect(text3).toContainText('Neříká ani, že to stačí jednou pochopit.');
  await expect(text3).toContainText('Podle Epikúra se duše skládá z atomů');
  await expect(text3).toContainText('Celý argument stojí na jednom předpokladu: že smrtí všechno končí.');
  await expect(text3.locator(':scope > p').last()).toHaveText('Než půjdeš dál, zkus Epikúrovi odpovědět.');
  const namitka = page.locator('#cesta8-namitka');
  await namitka.getByRole('textbox').focus();
  await page.keyboard.type('Ale mně to vadí už teď.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const srovnani = namitka.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani).toBeFocused();
  await expect(srovnani).toContainText('Na který z nich míří?');
  await expect(srovnani).toContainText('tam věta nedosáhne vůbec');
  await expect(srovnani).toContainText('míříš na předpoklad, ne na úsudek');
  await dalKlavesnici(page, namitka, 'Zrcadlo', `${CESTA8}4/`);

  // Krok 4: Lucretius, Senekova lampa bez „klidu“, kresba a námitka; krok nemá blok s odpovědí.
  const obsah4 = page.locator('.krok__obsah');
  await expect(obsah4).toContainText('Asi dvě stě let po Epikúrovi');
  await expect(obsah4.locator('.citat')).toHaveCount(3);
  await expect(obsah4.locator('.citat').first()).toHaveText(/Zdá se tam něco smutné\?“\s*Lucretius/);
  await expect(obsah4.locator('.citat').nth(2)).toHaveText(/zhášejí a\s+rozsvěcují\.“\s*Seneca/);
  await expect(obsah4).toContainText('Měl nemoc, při které nemohl dýchat.');
  await expect(obsah4).toContainText('ať si přítel nemyslí, že píše vesele, protože vyvázl');
  await expect(page.locator('#zrcadlo-casu')).toBeVisible();
  await expect(obsah4).toContainText('Žít o deset let déle by mohl tentýž člověk. Narodit se o sto let dřív by musel někdo jiný.');
  expect((await obsah4.innerText()).match(/Nagel/g)).toHaveLength(1);
  await expect(obsah4.locator('section.blok')).toHaveCount(0);
  await listouKlavesnici(page, `${CESTA8}5/`);

  // Krok 5: truchlící mluví sami; básník odpovídá o mrtvém, ne o nich; nasycený host hned s námitkou; Aristotelés.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5.locator('.citat')).toHaveCount(3);
  await expect(text5.locator('.citat').first()).toHaveText(/„‚Už tě nepřivítá veselý dům[\s\S]*‚vzal všechny dary života\.‘“/);
  await expect(text5).toContainText('Mluví o mrtvém, ne o nich.');
  await expect(text5.locator('.citat').nth(1)).toContainText('Proč neodejdeš jako host, který se života nasytil?');
  await expect(text5).toContainText('Šestnáctiletý není nasycený host: sotva si sedl.');
  await expect(text5).toContainText('Zemřel dřív, než Epikúros začal v Athénách učit, takže mu neodpovídal.');
  await expect(text5).toContainText('Když psal o statečnosti');
  await expect(text5.locator('.citat').nth(2)).toContainText('tím víc ho smrt bude bolet');
  const hostina = page.locator('#cesta8-hostina');
  await hostina.getByRole('radio', { name: 'Bez lítosti.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(hostina.getByRole('radio', { name: 'Jsi tam od odpoledne' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(hostina.getByRole('radio', { name: 'Přišel jsi před chvílí' })).toBeChecked();
  await expect(hostina.locator('.zmenena')).toContainText('Sotva sis sedl');
  await hostina.locator('.zmenena').getByRole('radio', { name: 'Nechci odejít.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zmena = hostina.getByRole('region', { name: 'Posun odpovědi' });
  await expect(zmena).toBeFocused();
  await expect(zmena).toContainText('host, který sotva přišel, nasycený není');
  await expect(hostina.getByRole('heading', { name: 'Co by na to řekli' })).toBeVisible();
  await expect(hostina.locator('.co-udelal')).toContainText('Aristotelés by řekl opak');
  await dalKlavesnici(page, hostina, 'Týká se nás?', `${CESTA8}6/`);

  // Krok 6: Spor na dálku; Plútarchos je v datech jako medailonek a jeho mince nese trojnožku. Obě strany odpoví na námitku druhé.
  await expect(page.locator('.krok__obsah > .ctenarsky')).toContainText('takže se přel s jeho učením, ne s ním');
  const spor = page.locator('#cesta8-epikuros-plutarchos');
  await expect(spor).toContainText('Ti dva se nepotkali');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await expect(spor).not.toContainText(/tváří v tvář|řekl mu|odpověděl mu|vyvrá/);
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Epikúros\s*Plútarchos/);
  await expect(spor.locator('.skala__konce use[href$="#tripod"]').first()).toBeAttached();
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš Epikúros' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  await expect(argumenty).toContainText('Na námitku, že smrt bere všechno dobré, by Epikúros odpověděl otázkou');
  await expect(argumenty).toContainText('Plútarchos odpovídá: tomu, kdo žije, a už dnes.');
  await expect(argumenty).toContainText('měří dvojím metrem');
  // Postoje nejsou krajnější než prameny a nikdo nesrovnává šťastné s nešťastnými.
  await expect(spor).not.toContainText(/smrt je dobr|nešťastn|dokázán/i);
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('ztráta je moje už dnes');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš Epikúros. Teď: spíš Plútarchos.');
  await expect(posun).not.toContainText(/vyhrál/i);
  await dalKlavesnici(page, spor, 'Ti druzí', `${CESTA8}7/`);

  // Krok 7: argument o smrti lidí, které máme rádi, nemluví. Seneca přizná, Epikúros podle Plútarcha hájí slzy.
  const text7 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text7.locator(':scope > p').first()).toContainText('Jeden koš zůstal stranou: ti druzí.');
  await expect(text7).toContainText('Kdo někoho ztratil nebo ztrácí, nemusí v té větě hledat útěchu ani výčitku: není o něm.');
  await expect(text7.locator('.citat')).toHaveCount(2);
  await expect(text7.locator('.citat').first()).toContainText('oplakával tak bez míry');
  await expect(text7.locator('.citat').nth(1)).toContainText('To není ctnost, to je nelidskost');
  await expect(text7).toContainText('je lepší cítit a plakat než necítit nic');
  await expect(text7).toContainText('Kdo tvrdil, že smrt se netýká mrtvého, netvrdil tedy, že se netýká živých.');
  // Nejtišší krok: žádný blok, žádné pole, pod ním tichý řádek pomoci.
  await expect(page.locator('.krok__obsah section.blok')).toHaveCount(0);
  await expect(page.locator('.krok__obsah').getByRole('textbox')).toHaveCount(0);
  await expect(text7.locator('.radek-pomoci')).toContainText('Linka bezpečí 116 111');
  await listouKlavesnici(page, `${CESTA8}8/`);

  // Krok 8: Senekovo přiznání a studie, která „zkoušela“; dvě skupiny; věta autorů o těch, kdo stojí vedle.
  const obsah8 = page.locator('.krok__obsah');
  await expect(obsah8).toContainText('Epikúrova věta o něm mlčí a Lucretiovo zrcadlo taky.');
  await expect(obsah8.locator('.citat').first()).toContainText('Nepomáhalo mi to ale tolik');
  await expect(obsah8).toContainText('Ten totiž mluvil o smrti, která byla blízko.');
  await expect(obsah8).toContainText('vyšla studie, která zkoušela, jestli je představa opravdu temnější než věc sama');
  await expect(obsah8).toContainText('Našli jich 25 a vzali z nich příspěvky z posledních dvanácti týdnů.');
  await expect(obsah8).toContainText('Pak požádali 45 jiných lidí');
  await expect(obsah8).toContainText('lidem, kteří nevěděli, kdo co psal');
  const odhad = page.locator('#cesta8-blogy-odhad');
  const zpetna8 = await volbaKlavesnici(page, odhad, /opravdu prožívali/);
  await expect(zpetna8).not.toContainText(/2,25|1,70/);
  const niz = odhad.getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
  await expect(niz).toHaveText('Co ze srovnání vyšlo');
  await niz.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA8}8/#co-vyslo`);
  await expect(page.locator('#co-vyslo')).toBeInViewport();
  await expect(obsah8).toContainText('použili víc záporných slov: 2,25 % všech slov proti 1,70 % u těch, kdo psali doopravdy');
  await expect(obsah8).toContainText('V kladných slovech program rozdíl nenašel.');
  await expect(obsah8).toContainText('Pro toho, kdo stojí vedle a dívá se, jak mu umírá někdo blízký, to podle nich může být jinak.');
  // Výhrady až ve zpětné vazbě druhé otázky.
  for (const cast of await page.locator('.krok__obsah > .ctenarsky').all()) await expect(cast).not.toContainText(/vybrali sami|nejsem šťastný/);
  const cteni = page.locator('#cesta8-blogy-cteni');
  const zpetnaCteni = await volbaKlavesnici(page, cteni, /Nic\. Psali jen ti/);
  await expect(zpetnaCteni).toContainText('blogů bylo 25 a jejich pisatelé se vybrali sami');
  await dalKlavesnici(page, cteni, 'Tvoje pravidlo', `${CESTA8}9/`);

  // Krok 9: kdo dá za pravdu komu, karta bez slova smrt a vlastní pravidlo vedle začátku.
  const text9 = page.locator('.krok__obsah');
  await expect(text9).toContainText('Souhlasit s nimi nemusíš.');
  await expect(text9).toContainText('Jestli se bojíš a argument ti nepomáhá, máš na své straně Aristotela a Plútarcha.');
  await expect(text9).toContainText('Jestli se nebojíš, stojí za tebou Epikúros s Lucretiem.');
  await expect(text9).toContainText('Jestli nevíš, co po smrti je, jsi na tom jako Sókratés v Platónově Obraně.');
  await expect(text9).toContainText('Jestli věříš, že smrtí nic nekončí, mluví za tebe Platón.');
  await expect(text9.locator('.citat')).toHaveCount(2);
  await expect(text9.locator('.citat').first()).toContainText('Být mrtvý je jedno z dvojího');
  await expect(text9.locator('.citat').nth(1)).toContainText('Je to krásné riziko.');
  await expect(text9.getByRole('link', { name: 'Má život smysl?' })).toHaveAttribute('href', '/otazka/ma-zivot-smysl/');
  const vyzva = page.locator('#zkus-to-zit');
  await expect(vyzva).toContainText('Řekni to teď');
  await expect(vyzva).toContainText('Vyber si někoho, s kým je ti dobře.');
  await expect(vyzva).not.toContainText(/smrt|umř|zemř|umír/i);
  await expect(text9).toContainText('Vrať se ke svému tahu z kroku 1.');
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 1 · Dopis');
  await expect(panel.locator('.zacatek')).toContainText('Záleží na tom, co je po ní.');
  const pole = page.getByRole('textbox', { name: 'Je rozumné bát se smrti? A co se strachem, který zbude? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('Bát se smím. Rozhoduje, co s tím strachem udělám dnes.');
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  await dokoncit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA8}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  await page.goto('/denik/');
  const zapisy = page.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('Bát se smím. Rozhoduje, co s tím strachem udělám dnes.');
  await expect(zapisy).toContainText('Na začátku: spíš Epikúros. Po argumentech: spíš Plútarchos. Co mě posunulo: ztráta je moje už dnes.');
  await expect(zapisy).toContainText('Ale mně to vadí už teď.');
  await expect(zapisy).toContainText('Záleží na tom, co je po ní.');
});

test('cesta 8 bez odkrytí bloků: lišta vede až na konec, text drží souvislost a do cesty nepatří, co nese portrét', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Tím dopis končí.', 'Přes třicet let přitom učil, že smrt se nás netýká.'],
    ['Strach ze smrti totiž není jeden.', 'Roztřiď je podle toho, na co ten, kdo to říká, myslí.'],
    ['Na ten míří Epikúrova věta, a jen na ten.', 'Epikúros neříká, že smrt nic není.', 'že smrtí všechno končí'],
    ['Z věty, že se nás smrt netýká, udělal obraz.', 'Obě strany podle ní stejné nejsou.', 'Člověku podle něj proto může vadit, o co přijde potom'],
    ['Třetí koš: to, o co člověk přijde.', 'Šestnáctiletý není nasycený host', 'Aristotelés to za zbabělost nemá.'],
    ['Podle druhé má ten, kdo žije dobře, oč přijít.', 'Kdo z nich má pravdu, rozhodni sám.'],
    ['„Smrt se nás netýká“ mluví o tom, kdo zemřel.', 'netvrdil tedy, že se netýká živých'],
    ['Zbývá druhý koš: umírání.', 'použili víc záporných slov', 'to podle nich může být jinak', 'Co z toho plyne pro strach z umírání?'],
    ['Souhlasit s nimi nemusíš.', 'Mezi těmi dvěma možnostmi nerozhodl a netvrdil, že to ví.', 'Vrať se ke svému tahu z kroku 1.'],
  ];
  await page.goto(`${CESTA8}1/`);
  for (let n = 1; n <= KROKY8.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY8[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani srovnání. Panel „Na začátku“ bez počáteční odpovědi chybí.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY8.length) {
      await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA8}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA8}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  const citaty: string[] = [];
  for (let n = 1; n <= KROKY8.length; n++) {
    await page.goto(`${CESTA8}${n}/`);
    const text = await page.locator('.krok__obsah').innerText();
    expect(text, `krok ${n}`).not.toMatch(NEPATRI);
    // „Nic není“ smí zaznít jen jako věta, kterou Epikúros neříká, a v cizí větě na kartě.
    if (n !== 2 && n !== 3) expect(text, `krok ${n}`).not.toMatch(/nic není|není nic/i);
    citaty.push(...(await page.locator('.krok__obsah .citat blockquote').allInnerTexts()));
    // Nejvýš tři citáty v kroku.
    expect(await page.locator('.krok__obsah .citat').count(), `krok ${n}`).toBeLessThanOrEqual(3);
  }
  // Žádný citát se v cestě neopakuje.
  expect(new Set(citaty).size).toBe(citaty.length);
  expect(citaty).toHaveLength(18);

  // Tentýž citát nejvýš dvakrát v celku: cesta, portrét Seneky a stránka otázky 3 dohromady.
  // Cesta a portrét nemají společný žádný; co nese portrét (věta z Dopisu 78, syn, Paulina, večerní soud), v cestě není.
  await page.goto('/osobnost/seneca/');
  const portret = await page.locator('.citat blockquote').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  await page.goto('/otazka/ma-zivot-smysl/');
  const otazka = await page.locator('.citat blockquote').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  const cesta = citaty.map((c) => c.replace(/\s+/g, ' ').trim());
  expect(cesta.filter((c) => portret.includes(c))).toEqual([]);
  const pocty = new Map<string, number>();
  for (const c of [...cesta, ...portret, ...otazka]) pocty.set(c, (pocty.get(c) ?? 0) + 1);
  expect([...pocty].filter(([, n]) => n > 2)).toEqual([]);
});
