// Cesta 2 „Jsem pořád tentýž, když se měním?“ a stránka velké otázky 5 „Kdo vlastně jsem?“.
// Průchod s odpověďmi na telefonu (Spor, závěr „Na začátku × Teď“, deník), průchod bez odkrytí bloků
// (text drží souvislost a neopakuje profily), Návrat v deníku, hlasy stránky otázky a vstupy z profilů.
// Přehled a kroky na obou šířkách v obou režimech (axe, přesah, snímky) hlídá cesta.spec.ts, kresbu lod.spec.ts.
// Hlídá i pravidla celku 7: příklady změny jsou věci a cizí lidé, žádné pole na psaní o vlastní změně,
// slovo „pravý“ se nepojí s člověkem, nemoc není příkladem, cesta neříká, že Parmenidés změnu popírá,
// Plútarchovi nepřipisuje výměnu všech prken ani druhou loď a studie „měřily“, ne „dokázaly“.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CESTA2 = '/cesta/jsem-porad-tentyz-kdyz-se-menim/';
const KROKY2 = ['Loď', 'Řeka', 'Proč je změna záhada', 'Loď po prknech', 'A co člověk?', 'Dva čtenáři jedné řeky', 'Jak staré je tvoje tělo', 'Kdo je na tvé straně'];
// Co do cesty nepatří (zadání P8, podkladový list celku 7: Citlivá místa a Překryvy).
const NEPATRI = /prav[éý]m? (já|ty)|pravé „já“|skutečně ty|doopravdy ty|demenc|Alzheimer|závislost|úraz|amputac|nemoc|nádor|rakovin|infarkt|anorex|bulimi|hubn|tlust|váh[ayu]\b|kil[oa]\b|vzhled|postav[ay]\b|tetov|to tě přejde|změníš se|budeš jin|vyroste[sš] z|popír|kostk|Hermodór|Kratyl|prst|tětiv|lyr[ayu]\b|banán|Mínó[a-z]* zabil|všechno plyne|panta|otcovra|Zénón|Achill|želv|dokázal[ayi]? |prokázal|ukázal[ayi]?,? že|hnůj|vodnatel|Dareio|pitv|zemřel[ýí]ch|mrtvol|kolektivní vin|bit[íý]\b|zbil/i;

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
const denik = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));

async function dal(page: Page, blok: ReturnType<Page['locator']>, nazev: string, n: number) {
  await blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: `Další krok: ${nazev}` }).click();
  await expect(page).toHaveURL(`${CESTA2}${n}/`);
  await pripravit(page);
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

test('cesta 2: průchod s odpověďmi na telefonu, Spor, závěr Na začátku × Teď a zápisy v deníku', async ({ page }) => {
  test.setTimeout(150_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA2);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta 2');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('8 kroků');
  // Filozofové cesty jsou Hérakleitos a Parmenidés; řádek s pomocí cesta nemá (žádné krizové téma neotevírá).
  await expect(page.locator('.cesta__hlava .lide a')).toHaveText(['Hérakleitos', 'Parmenidés']);
  await expect(page.locator('.radek-pomoci')).toHaveCount(0);
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=-500&osoba=herakleitos');
  await expect(page.locator('main')).not.toContainText(NEPATRI);
  await page.getByRole('link', { name: 'Začít cestu' }).click();
  await expect(page).toHaveURL(`${CESTA2}1/`);
  await pripravit(page);

  // Krok 1: loď podle Plútarcha, s obrazem číše; poslední prkno je náš krok; první vlastní tah.
  const pribeh = page.locator('#theseova-lod');
  await expect(pribeh).toContainText('Plútarchos vypráví, že Athéňané uchovávali loď o třiceti veslech.');
  // Scéna začíná větou o prameni, ne jménem hrdiny.
  expect(await pribeh.evaluate((p) => { const t = p.textContent!; return t.indexOf('Plútarchos vypráví') < t.indexOf('Théseus') && t.indexOf('Plútarchos vypráví') > -1; })).toBe(true);
  await expect(pribeh.locator('img')).toHaveAttribute('src', /cise-lode-met/);
  await expect(pribeh).toContainText('Loď pod uchem athénské číše');
  await expect(pribeh.getByRole('link', { name: 'Sókratés' })).toHaveAttribute('href', '/osobnost/sokrates/#soud');
  const text1 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text1).toContainText('Kolik prken Athéňané vyměnili, Plútarchos neříká.');
  await expect(text1).toContainText('Představ si, že nakonec vyměnili i to poslední.');
  const tah = page.locator('#cesta2-je-to-ona');
  await expect(tah.getByRole('heading', { name: 'Je to pořád Théseova loď?' })).toBeVisible();
  await expect(tah.getByRole('radio')).toHaveCount(4);
  await tah.getByText('Přestala jí být někde cestou.').click();
  await tah.getByRole('textbox').fill('u posledního prkna');
  await tah.getByRole('button', { name: 'Tohle je můj tah' }).click();
  const zpetna1 = tah.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna1).toContainText('U kterého prkna to bylo, a proč ne o jedno dřív?');
  await expect(zpetna1).not.toContainText(/správn|špatn|výborn|skvěl/i);
  await expect(tah.getByRole('heading', { name: /^Co udělal/ })).toHaveCount(0);
  await dal(page, tah, 'Řeka', 2);

  // Krok 2: zlomek B12 jako odpověď na loď; známé znění jen jednou větou s odkazem na profil.
  const text2 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text2.locator('.citat')).toHaveCount(1);
  await expect(text2.locator('.citat')).toContainText('Na ty, kdo vstupují do týchž řek, tečou jiné a zase jiné vody.');
  await expect(text2).toContainText('je Platónovo podání Hérakleita');
  await expect(text2.getByRole('link', { name: 'Hérakleitův profil' })).toHaveAttribute('href', '/osobnost/herakleitos/#reka');
  await expect(text2).toContainText('Hérakleitova věta je o řekách a vodách. O lodi v ní není nic. Jsou v ní i ti, kdo do řek vstupují');
  const reka = page.locator('#cesta2-reka-a-lod');
  await reka.getByRole('textbox').first().fill('Loď je táž, prkna jiná. Ale loď téct nemusí.');
  await reka.getByRole('button', { name: 'Porovnat s Aristotelem' }).click();
  const srovnani2 = reka.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani2).toContainText('Hérakleitos o lodi nenapsal nic.');
  await expect(srovnani2.locator('.citat')).toContainText('I o řekách a pramenech jsme zvyklí říkat, že jsou tytéž');
  await dal(page, reka, 'Proč je změna záhada', 3);

  // Krok 3: bohyně mluví o prknu, ne o banánu; Platónova přetahovaná spojuje oba; tentýž × stejný.
  const text3 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text3).toContainText('napsal Parmenidés báseň, ve které mluví bohyně');
  await expect(text3).toContainText('Zkus to s jedním prknem z lodi.');
  await expect(text3.locator('.citat')).toHaveCount(3);
  await expect(text3.locator('.citat').nth(0)).toContainText('Jak by mohlo to, co je, být až potom?');
  await expect(text3.locator('.citat').nth(1)).toContainText('dopadneme jako ti, kdo si v palaistrách hrají na čáře');
  await expect(text3.locator('.citat').nth(2)).toContainText('jeden a tentýž, je jednou bledý a jindy opálený');
  await expect(text3).toContainText('Kdo říká, že má tentýž telefon jako loni, mluví o jedné věci.');
  await expect(text3).not.toContainText(/jestli jeden o druhém věděl/i);
  const trideni = page.locator('#cesta2-tentyz-stejny');
  await expect(trideni.getByRole('textbox')).toHaveCount(0);
  const sem = trideni.getByRole('button', { name: /^Dát sem kartu/ });
  for (let i = 0; (await sem.count()) > 0 && i < 20; i++) await sem.nth(i % 3).click({ force: true });
  await trideni.getByRole('button', { name: 'Mám roztříděno' }).click();
  await expect(trideni.getByRole('region', { name: 'Tvoje třídění' })).toBeVisible();
  await expect(trideni).toContainText('Jak počítal Aristotelés');
  await expect(trideni).not.toContainText(/správn|špatn/i);
  await dal(page, trideni, 'Loď po prknech', 4);

  // Krok 4: kresba a pod ní dvě lodě; otázka zní „která je Théseova“.
  await expect(page.locator('#lod-po-prknech')).toBeVisible();
  const lode = page.locator('#cesta2-ktera-je-theseova');
  await expect(lode.getByRole('heading', { name: 'Která z nich je Théseova?' })).toBeVisible();
  await lode.getByText('Obě.', { exact: true }).click();
  await lode.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(lode.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Právě na to mířil Hobbes: jedna věc nemůže být dvěma věcmi.');
  await dal(page, lode, 'A co člověk?', 5);

  // Krok 5: host a dlužník jako stará hádanka, bez rány a bez půjčky z dneška; Diotima až ve srovnání.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5).toContainText('Staří Řekové znali z komedií jednu hádanku.');
  await expect(text5.locator('.citat')).toContainText('A kdo byl včera pozván na večeři, přichází dnes nepozván');
  await expect(text5).not.toContainText(/Diotim/);
  const dluznik = page.locator('#cesta2-host-a-dluznik');
  await dluznik.getByRole('textbox').first().fill('Změnil se, ale pozvali jeho, ne jeho vlasy.');
  await dluznik.getByRole('button', { name: 'Porovnat s Diotimou' }).click();
  const srovnani5 = dluznik.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani5).toContainText('nechává Sókrata vyprávět, co ho kdysi naučila moudrá žena jménem Diotima');
  await expect(srovnani5.locator('.citat')).toHaveCount(2);
  await expect(srovnani5).toContainText('Tentýž u ní neznamená stejný.');
  // Diotimu cesta nechává stát: žádný slib, že něco přejde.
  await expect(srovnani5).not.toContainText(/přejde|i tvoje|i tvé|uvidíš, že/i);
  await dal(page, dluznik, 'Dva čtenáři jedné řeky', 6);

  // Krok 6: Senekův závěr má hned za sebou otázku, větu o tom, o čem nemluví, a odkaz na cestu 8;
  // Plútarchova souvislost má svou otázku. Scéna netvrdí, že jeden četl druhého.
  const text6 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text6.locator('.citat')).toHaveCount(3);
  await expect(text6.locator('.citat').nth(1)).toContainText('Přestaň se bát, že se jednou stane, co se děje každý den.');
  expect(await text6.evaluate((t) => {
    const prvky = [...t.children];
    const i = prvky.findIndex((e) => e.textContent!.includes('Přestaň se bát'));
    return [prvky[i + 1]?.textContent, prvky[i + 2]?.textContent].map((x) => (x ?? '').replace(/\u00a0/g, ' '));
  })).toEqual([
    expect.stringContaining('Plyne z toho, že se měním, že se nemám čeho bát?'),
    expect.stringContaining('O tom, jaké je někoho ztratit, ta věta neříká nic.'),
  ]);
  await expect(text6.getByRole('link', { name: 'Proč se bát smrti?' })).toHaveAttribute('href', '/cesta/proc-se-bat-smrti/');
  await expect(text6.locator('.citat').nth(2)).toContainText('Obec je jedna souvislá věc, jako živý tvor');
  await expect(text6).toContainText('Platí o městě, o rodině a o jednom člověku totéž?');
  await expect(text6).toContainText('Plútarchos tu nemíří na Seneku');
  await expect(page.locator('.krok__obsah')).not.toContainText(/odpověděl mu|četl jeho|přel se s ním|vyvrá|děti .* pykat/i);
  const spor = page.locator('#cesta2-seneca-plutarchos');
  await expect(spor).toContainText('kdo si kdysi půjčil, dnes nic nedluží, protože se stal jiným');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Seneca\s*Plútarchos/);
  await spor.getByRole('radio').nth(1).check({ force: true });
  await spor.getByRole('button', { name: 'Tady stojím' }).click();
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toContainText('O dlužníkovi Seneca nepíše.');
  await expect(argumenty).toContainText('Seneca by mohl namítnout, že jméno nic nedokazuje');
  await expect(argumenty).toContainText('Co mluví proti němu, říká Plútarchos sám');
  // Na telefonu čte student Seneku celého před Plútarchem; odpověď na dlužníka proto stojí u Seneky.
  const poradi = await argumenty.evaluate((a) => {
    const t = a.textContent!.replace(/\u00a0/g, ' ');
    return [t.indexOf('O dlužníkovi Seneca nepíše.'), t.indexOf('Člověk je jako každý živý tvor jedna souvislá věc.'), t.indexOf('Seneca by mohl namítnout')];
  });
  expect(poradi[0]).toBeGreaterThan(-1);
  expect(poradi[0]).toBeLessThan(poradi[1]);
  expect(poradi[1]).toBeLessThan(poradi[2]);
  // Žádná strana neříká o jiném člověku, že „už to není on“, a postoje nejsou krajnější než citáty.
  await expect(spor).not.toContainText(/už to není on|nedlužíš|nezměnil ses|nezměnil se\b/i);
  await spor.locator('.skala').getByRole('radio').nth(3).check({ force: true });
  await spor.getByRole('button', { name: 'Zapsat konečnou polohu' }).click();
  await expect(spor.getByRole('region', { name: 'Tvůj posun' })).not.toContainText(/vyhrál/i);
  await dal(page, spor, 'Jak staré je tvoje tělo', 7);

  // Krok 7: měření o buňkách s čísly z podkladů a pravidlo místo zpovědi; otázka bloku nebere pravidlo o člověku z měření.
  const obsah7 = page.locator('.krok__obsah');
  await expect(obsah7).toContainText('Často se říká, že se lidské tělo celé vymění za sedm let.');
  await expect(obsah7).toContainText('množství uhlíku 14C v ovzduší se při tom přibližně zdvojnásobilo');
  await expect(obsah7).toContainText('u dvou lidí ve věku 37 a 38 let složený z buněk průměrně patnáct let starých');
  await expect(obsah7).toContainText('Neurony v mozkové kůře jsou podle jejich měření stejně staré jako člověk sám');
  await expect(obsah7).toContainText('Většina buněk srdečního svalu ti podle jejich výpočtu vydrží celý život.');
  await expect(obsah7).toContainText('Do té doby se taková stálost znala jen u zubní skloviny.');
  await expect(obsah7).toContainText('Měřilo se vždycky u malého počtu lidí a výsledky jsou průměry.');
  await expect(obsah7).toContainText('Ta měření jsou o buňkách. Kdo jsi, z nich neplyne.');
  const pravidla = page.locator('#cesta2-co-z-toho-plyne');
  await expect(pravidla).toContainText('Které pravidlo si na buňkách vyzkoušíš?');
  await expect(pravidla).not.toContainText('vezmeš');
  // Marcus Aurelius (Hovory X, 7) v kroku není: „přiteklo z jídla“ by četl student, který bojuje s tělem.
  await expect(obsah7.locator('.citat')).toHaveCount(0);
  await pravidla.getByText('Tělo o tom nerozhoduje.').click();
  await pravidla.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(pravidla.getByRole('region', { name: 'Zpětná vazba' })).toContainText('A obešlo by se to bez těla úplně?');
  // Volba je v kroku jediný blok a nabídne další krok sama.
  await dal(page, pravidla, 'Kdo je na tvé straně', 8);

  // Krok 8: zastánci všech čtyř odpovědí z prvního kroku i obou lodí ze čtvrtého, karta Zkus to žít a závěr.
  const obsah8 = page.locator('.krok__obsah');
  await expect(page.locator('.kde')).toContainText('Zpátky u čtyř odpovědí z prvního kroku');
  await expect(page.locator('#kdo-je-na-tve-strane')).toHaveCount(0);
  // Každá odpověď z prvního kroku má zastánce, a žádný z nich není filozof cesty.
  for (const veta of [
    'Jestli jsi řekl, že je to pořád táž loď, máš na své straně jednu stranu sporu, o kterém vypráví Plútarchos, a Plútarcha samého',
    'Jestli jsi řekl, že z Théseovy lodi nezbylo nic, stojí za tebou druhá strana toho sporu a úvaha o oblázcích',
    'Jestli jsi řekl, že jí přestala být někde cestou, máš taky Hobbese.',
    'Jestli jsi řekl, že záleží na tom, na co se ptáš, řekl jsi větu, na které Hobbes postavil celou odpověď.',
  ]) await expect(obsah8).toContainText(veta);
  // Kdo ve čtvrtém kroku zvolil „obě“ nebo „žádná“, najde svou odpověď taky (revize celku 7, nález 5).
  await expect(obsah8).toContainText('I tady se zastánci dělí podobně.');
  await expect(obsah8).toContainText('Jestli jsi řekl obě, každou v jiném smyslu, bereš si od Hobbese větu o jménu, pod kterým se ptáš.');
  await expect(obsah8).toContainText('A jestli jsi řekl žádná, chceš po Théseově lodi obojí naráz');
  await expect(obsah8).toContainText('Podle Seneky tentýž není ani po jediné noci.');
  await expect(obsah8.locator('.citat')).toHaveCount(1);
  await expect(obsah8.locator('.citat')).toContainText('Nikdo nezůstává a nikdo není jeden; stáváme se mnohými.');
  await expect(obsah8).toContainText('Hérakleitovi odporoval Aristotelés a řeč bohyně vzal do zkoušky Platón');
  await expect(obsah8.getByRole('link', { name: 'Kdo vlastně jsem?' })).toHaveAttribute('href', '/otazka/kdo-vlastne-jsem/');
  const vyzva = page.locator('#zkus-to-zit');
  await expect(vyzva).toContainText('Táž, a všechno je v ní jiné');
  await expect(vyzva).toContainText('Kterou z nich bys bránil víc, kdyby ji někdo chtěl nahradit přesnou kopií?');
  await expect(vyzva).not.toContainText(/ty sám|na sobě|změnil ses|strun|stan|síť|nápis|signál/i);
  await expect(obsah8).toContainText('Podívej se na svou odpověď o lodi z kroku 1. Řekl bys teď totéž o sobě?');
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 1 · Loď');
  await expect(panel.locator('.zacatek .cast').nth(0)).toHaveText('Přestala jí být někde cestou.');
  await expect(panel.locator('.zacatek .cast').nth(1)).toHaveText(/^Proč\s*u posledního prkna\.?$/);
  const pole = page.getByRole('textbox', { name: 'Podle čeho poznáš, že je něco pořád totéž? Napiš svoje pravidlo.' });
  await pole.fill('Totéž je to, co nikdy nepřestalo, i když se v tom všechno vyměnilo.');
  await pole.blur();
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA2}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  const zapisy = ((await denik(page)).zapisy as { id: string; odpoved: string }[]).reduce<Record<string, string>>((a, z) => ({ ...a, [z.id]: z.odpoved }), {});
  expect(Object.keys(zapisy).sort()).toEqual(['cesta2-co-z-toho-plyne', 'cesta2-host-a-dluznik', 'cesta2-je-to-ona', 'cesta2-ktera-je-theseova', 'cesta2-moje-pravidlo', 'cesta2-reka-a-lod', 'cesta2-seneca-plutarchos', 'cesta2-tentyz-stejny']);
  expect(zapisy['cesta2-moje-pravidlo']).toBe('Totéž je to, co nikdy nepřestalo, i když se v tom všechno vyměnilo.');
  expect(zapisy['cesta2-je-to-ona']).toContain('Přestala jí být někde cestou.');
});

test('cesta 2 bez odkrytí bloků: lišta vede až na konec, text drží souvislost a neopakuje, co nesou profily', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Jedni říkali, že je to pořád táž loď. Druzí, že už ne.', 'Představ si, že nakonec vyměnili i to poslední.'],
    ['Řeky jsou v ní tytéž. Jiné jsou vody.', 'Jestli platí i jinde než u řeky, zkoušeli lidé až po něm.'],
    ['Mezi těmi tábory teď stojí i loď z prvního kroku.', 'Po posledním prknu z ní nezůstalo ani dřevo', 'Co se změnilo, není stejné jako dřív. Jestli je to totéž, je otázka téhle cesty.'],
    ['Zpátky k lodi z prvního kroku.', 'Teď jsou tedy lodě dvě.'],
    ['U člověka na téže otázce záleží víc.', 'Kde tedy dělá chybu? A dělá ji vůbec?'],
    ['Dva z nich z ní vyvodili opačné závěry a oba psali o člověku.', 'Postav se mezi ně dřív, než si přečteš jejich důvody.'],
    ['něco se v těle mění za dny, něco za roky a něco vůbec', 'Dá se na nich ale vyzkoušet, co by které pravidlo řeklo o těle.'],
    ['Žádnou z nich cesta nevyvrátila a každou někdo hájil.', 'I tady se zastánci dělí podobně.', 'Třetí odpověď má Diotima v Platónově Symposiu: tentýž, a přitom ne stejný.', 'Tu otázku otevřeli až o dva tisíce let později Locke a Hume.', 'Podívej se na svou odpověď o lodi z kroku 1.'],
  ];
  await page.goto(`${CESTA2}1/`);
  for (let n = 1; n <= KROKY2.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY2[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani srovnání. Panel „Na začátku“ bez počáteční odpovědi chybí.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY2.length) {
      await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA2}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA2}#hotovo`);

  const citaty: string[] = [];
  for (let n = 1; n <= KROKY2.length; n++) {
    await page.goto(`${CESTA2}${n}/`);
    const text = await page.locator('.krok__obsah').innerText();
    expect(text, `krok ${n}`).not.toMatch(NEPATRI);
    // Slovo „pravý“ se v cestě nepojí s člověkem ani s lodí; „pravdu“ mít smí kdokoli.
    expect(text, `krok ${n}`).not.toMatch(/\bprav(ý|á|é|ého|ou|ému)\b/i);
    // Žádné pole na psaní o vlastní změně: otázky bloků jsou o lodi, řece, větách, dlužníkovi a pravidle.
    for (const popisek of await page.locator('.krok__obsah label, .krok__obsah h3').allInnerTexts()) expect(popisek, `krok ${n}`).not.toMatch(/ses změnil|jsi se změnil|tvoje změna|kým jsi byl|jaký jsi byl/i);
    citaty.push(...(await page.locator('.krok__obsah .citat blockquote').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()))));
    // Nejvýš tři citáty v kroku.
    expect(await page.locator('.krok__obsah .citat').count(), `krok ${n}`).toBeLessThanOrEqual(3);
  }
  // Žádný citát se v cestě neopakuje.
  expect(new Set(citaty).size).toBe(citaty.length);
  // Bez odkrytí je jich devět; další tři (Aristotelés o řekách a dvakrát Diotima) jsou až ve srovnání bloků Odkryj.
  expect(citaty).toHaveLength(9);

  // Tentýž citát nejvýš dvakrát v celku: cesta, oba profily a stránka otázky 5 dohromady.
  // S profily má cesta společný jen zlomek B12; Aristotelovy věty z profilů cituje jinými místy.
  const jinde: string[] = [];
  const profily: string[] = [];
  for (const adresa of ['/osobnost/herakleitos/', '/osobnost/parmenides/', '/otazka/kdo-vlastne-jsem/']) {
    await page.goto(adresa);
    const c = await page.locator('.citat blockquote').evaluateAll((x) => x.map((y) => y.textContent!.replace(/\s+/g, ' ').trim()));
    jinde.push(...c);
    if (adresa.startsWith('/osobnost/')) profily.push(...c);
  }
  expect(citaty.filter((c) => profily.includes(c))).toEqual([expect.stringContaining('Na ty, kdo vstupují do týchž řek')]);
  const pocty = new Map<string, number>();
  for (const c of [...citaty, ...jinde]) pocty.set(c, (pocty.get(c) ?? 0) + 1);
  expect([...pocty].filter(([, n]) => n > 2)).toEqual([]);
});

test('Návrat cesty 2 v deníku: lístek na koncert, bez čísel a bez slibu, že se student změní', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/denik/');
  await page.evaluate(() => {
    const pred = (dni: number) => new Date(Date.now() - dni * 24 * 60 * 60 * 1000).toISOString();
    const slug = 'jsem-porad-tentyz-kdyz-se-menim';
    const d = {
      verze: 1, vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
      zapisy: [{ id: 'cesta2-moje-pravidlo', otazka: 'Podle čeho poznáš, že je něco pořád totéž? Napiš svoje pravidlo.', odpoved: 'Totéž je to, co nikdy nepřestalo.', odkaz: `/cesta/${slug}/7/`, kdy: pred(3.2) }],
      cesty: { [slug]: { nazev: 'Jsem pořád tentýž, když se měním?', pocet: 7, krok: 7, navstivene: [1, 2, 3, 4, 5, 6, 7], kdy: pred(3.2), dokonceno: pred(3.2) } },
    };
    localStorage.setItem('atlas-denik', JSON.stringify(d));
  });
  await page.reload();
  await pripravit(page);
  const nabidka = page.getByRole('region', { name: 'Návrat', exact: true });
  await expect(nabidka).toContainText('Jsem pořád tentýž, když se měním?');
  await nabidka.getByRole('button', { name: 'Zkusit' }).click();
  const blok = page.locator('#cesta2-navrat');
  await expect(blok.locator('.pravidlo')).toHaveText('Totéž je to, co nikdy nepřestalo.');
  await expect(blok).toContainText('Představ si, že si dnes můžeš koupit lístek na koncert své nejoblíbenější kapely.');
  await expect(blok).toContainText('Koncert bude až za deset let a lístek nejde vrátit ani dát někomu jinému.');
  await expect(blok).toContainText('Kupuješ ho dnes; na koncert se půjde za deset let.');
  // Případ je o odhadu ceny lístku: žádné číslo ze studie, žádné „změníš se“ a nic o tom, kým kdo bude.
  await expect(blok).not.toContainText(/dolar|psycholog|studi|129|\b80\b/i);
  await expect(blok).not.toContainText(/změníš|budeš jin|přejde|vyroste|kým budeš|tetov/i);
  await blok.getByRole('radio', { name: 'Nevím' }).check({ force: true });
  await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
  const odpoved = blok.getByRole('region', { name: 'Tvoje odpověď' });
  await expect(odpoved).toContainText('Na čem to vázne: na tom, kdo na koncert půjde, nebo na tom, co se mu tou dobou bude líbit?');
  await expect(odpoved).not.toContainText(/správn|špatn|výborn|skvěl/i);
  await expect(blok).toContainText('Tvoje pravidlo zůstává beze změny.');
  await axe(page);
});

test('otázka 5: kdo tě zná líp, sedm hlasů, které se poznají, a cesta 2', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/otazka/kdo-vlastne-jsem/');
  await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="PrvniNazor"][ssr]'));
  await expect(page.locator('h1')).toHaveText('Kdo vlastně jsem?');
  // Úvod: tři lidé popisují studenta nevinným slovem; stránka mu neříká, kdo je, a končí otázkami.
  const uvod = page.locator('.uvod');
  await expect(uvod).toContainText('Spolužačka řekne: „Ty jsi přece kliďas.“');
  await expect(uvod).toContainText('Na chrámu v Delfách stál nápis Poznej sám sebe.');
  await expect(uvod.locator('p').last()).toHaveText('Kdo z těch čtyř má pravdu? A je vůbec někdo, kdo to ví?');
  await expect(uvod).not.toContainText(/Hérakleit|Sókrat|Platón|Aristotel|Epikúr|Epiktét|Marcus/);
  // Případ je jiného druhu než případy cesty: ne změna v čase, tělo ani původ.
  await expect(uvod).not.toContainText(/loď|řek[au]|buň|koncert|změn|tělo|postav|váh|odkud jsi|rodin|narodil/i);
  await expect(page.locator('#kdo-vlastne-jsem-po')).toBeHidden();
  await page.locator('#kdo-vlastne-jsem-prvni-pole').fill('Nejlíp se znám sám, ale ne celý.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#kdo-vlastne-jsem-hlasy-nadpis')).toHaveText('Kdo tě zná líp?');
  await expect(page.locator('#kdo-vlastne-jsem-po .t-nadtitulek').first()).toHaveText('Tentýž případ, sedm odpovědí');
  // Pořadí podle narození.
  const JMENA = ['Hérakleitos', 'Sókratés', 'Platón', 'Aristotelés', 'Epikúros', 'Epiktétos', 'Marcus Aurelius'];
  await expect(page.locator('.odpoved__jmeno')).toHaveText(JMENA);
  const odpovedi = page.locator('.odpoved');
  // Každý hlas se pozná: duše bez konce, nejdřív se poznej, ten, kdo mluví, přítel a to, co myslí,
  // tělo a duše dohromady, jména, která neseš, a cizí mínění, které není tvoje.
  await expect(odpovedi.nth(0)).toContainText('na konec duše nedojdeš');
  await expect(odpovedi.nth(1)).toContainText('Nejdřív zjisti, jestli se znáš sám.');
  await expect(odpovedi.nth(2)).toContainText('Ty jsi ten, kdo s nimi mluví a přemýšlí.');
  await expect(odpovedi.nth(3)).toContainText('Dobrý přítel je pro tebe jako druhý ty');
  await expect(odpovedi.nth(3)).toContainText('jsi nejvíc to, co v tobě přemýšlí');
  await expect(odpovedi.nth(4)).toContainText('tělo a duše drží pohromadě; jsi obojí');
  await expect(odpovedi.nth(5)).toContainText('Uvaž, kolik jmen neseš');
  await expect(odpovedi.nth(6)).toContainText('Co o tobě říkají druzí, od sebe odděl');
  for (let i = 0; i < JMENA.length; i++) {
    const vet = (await odpovedi.nth(i).locator('.odpoved__text').innerText()).split(/(?<=[.?!])\s+/).length;
    expect(vet, JMENA[i]).toBeLessThanOrEqual(2);
  }
  // Žádný hlas neříká „identita“, „vědomí“ ani „já“ jako podstatné jméno a nikdo nepohrdá tělem.
  for (const cast of ['.odpovedi', '.hlas']) for (const e of await page.locator(`#kdo-vlastne-jsem-po ${cast}`).all()) {
    await expect(e).not.toContainText(/identit|vědomí|druhé já|pravé já|tvoje já|své já|pohrd|sražená krev|maso ani vlasy|mužem a ženu|poslouch/i);
  }
  // Hlasy, podle kterých nejsi své tělo, mají vedle sebe hlas, pro který tělo k člověku patří.
  await expect(page.locator('#hlas-epikuros')).toContainText('Duše je podle Epikúra jemná látka rozptýlená po celém těle.');
  await expect(page.locator('#hlas-marcus-aurelius .citat')).toContainText('První dvě jsou tvoje jen potud, že se o ně máš starat.');
  await expect(page.locator('.hlas__jmeno')).toHaveText(JMENA);
  await expect(page.locator('.hlas__jmeno a')).toHaveText(JMENA);
  await expect(page.locator('.hlas .citat')).toHaveCount(7);
  await expect(page.locator('#hlas-herakleitos .citat')).toContainText('Hranice duše nenajdeš, i kdybys prošel každou cestu');
  await expect(page.locator('#hlas-sokrates .citat')).toContainText('Ještě nedokážu, jak žádá delfský nápis, poznat sám sebe.');
  await expect(page.locator('#hlas-platon .citat')).toContainText('já jsem tenhle Sókratés, který s vámi teď rozmlouvá');
  // Hlas Platóna stojí na scéně Sókratova posledního dne: jedna věta, bez pohřbu.
  await expect(page.locator('#hlas-platon')).toContainText('v den, kdy má Sókratés zemřít');
  await expect(page.locator('#hlas-platon')).not.toContainText(/pohř|pochov|mrtv|jed\b|bolehlav/i);
  await expect(page.locator('#hlas-aristoteles .citat')).toContainText('Nikdo si nezvolí mít všechno za tu cenu, že se stane někým jiným');
  await expect(page.locator('#hlas-epikuros .citat')).toContainText('Duše by vnímat nemohla, kdyby ji nějak nekrylo ostatní tělo.');
  await expect(page.locator('#hlas-epiktetos .citat')).toContainText('Uvaž, kdo jsi.');
  await expect(page.locator('#hlas-epiktetos')).toContainText('Kdo pomlouvá bratra, zapomněl, kdo je.');
  await expect(page.locator('#hlas-marcus-aurelius')).toContainText('vlastního mínění o sobě si cení méně než cizího');
  // Co nese cesta 2 a profily, se na stránce neopakuje.
  for (const cast of ['.odpovedi', '.hlas']) for (const e of await page.locator(`#kdo-vlastne-jsem-po ${cast}`).all()) await expect(e).not.toContainText(/loď|prkn|dlužn|Thése|Hobbes|Diotim|do týchž řek|Plútarch|Senec|bohyn/i);
  await expect(page.locator('.cesta-karta')).toHaveAttribute('href', CESTA2);
  await axe(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('cesta 2 a otázka 5 jsou dosažitelné z profilů, z přehledu otázek, z Lidí a z Domů', async ({ page }) => {
  await page.goto('/osobnost/herakleitos/');
  // Hlavička se skládá z dat: cesta, pak otázka, ke které cesta vede.
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 2 · 8 kroků · asi \d+ minut\s*Jsem pořád tentýž, když se měním\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/]);
  await expect(page.locator('.vstupy-osoby a').first()).toHaveAttribute('href', CESTA2);
  await page.goto('/osobnost/parmenides/');
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 2[\s\S]*Jsem pořád tentýž, když se měním\?/, /Velká otázka 6\s*Co je skutečné\?/, /Velká otázka 7\s*Jak poznám, co je pravda\?/]);
  await page.goto('/otazky/');
  await expect(page.locator('#kdo-vlastne-jsem .cesta')).toHaveText(/Cesta 2\s*Jsem pořád tentýž, když se měním\?/);
  await expect(page.locator('#kdo-vlastne-jsem a[href="/otazka/kdo-vlastne-jsem/"]')).toHaveCount(1);
  await page.goto('/lide/');
  await expect(page.locator('#herakleitos .karta__cesta')).toHaveText('Cesta 2: Jsem pořád tentýž, když se měním?');
  await expect(page.locator('#parmenides .karta__cesta')).toHaveText('Cesta 2: Jsem pořád tentýž, když se měním?');
  // Seneca a Plútarchos mluví ve Sporu, ale filozofy cesty 2 nejsou: jejich karty a Senekova hlavička se nemění.
  await expect(page.locator('#seneca .karta__cesta')).toHaveText(['Cesta 8: Proč se bát smrti?', 'Cesta 33: Co když přijde to nejhorší?', 'Cesta 34: Kam mi mizí čas?']);
});
