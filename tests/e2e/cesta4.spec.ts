// Cesta 4 „Stačí vědět, co je správné?“: celý průchod jen klávesnicí na telefonu a jednou bez odkrytí bloků.
// Přehled a kroky na obou šířkách v obou režimech (axe, přesah, snímky) hlídá cesta.spec.ts, kresbu stred.spec.ts.
// Hlídá i tón celku: první obrazovka je Mieza, opilost má jednu větu, text netvrdí, čemu Aristotelés Alexandra učil,
// Sókratés mluví Platónovými ústy, zvyk není dril, střed není půlka a student, který nesouhlasí, má spojence.
import { test, expect, type Page } from '@playwright/test';

const CESTA4 = '/cesta/staci-vedet-co-je-spravne/';
const KROKY4 = ['Háj a hostina', 'Co ti tehdy chybělo?', 'Kdo ví, udělá to', 'Stavitelem se stáváš stavěním', 'Věděl to doopravdy?', 'Kde je střed?', 'Jak dlouho to trvá?', 'Tvoje pravidlo'];
// Co nese portrét, jiná cesta nebo stránka otázky a co do studentského textu nepatří (zadání P8, podklady celku 5).
const NEPATRI = /lagun|delfín|zub[yů]|ježov|Hermei|závě[ťt]|Lesb|vlaštov|slab(á|ou|é) vůl|\bvůl[eií]\b|otroctví|jídl|váh[auy]|diet|závisl|odklád|telefon|mobil|Fyllid|Kallisthen|Lanik|Anaxarch|Maltz|Lally|dokázal[ay]? |ukázal[ay]? |nejslavnějš|takovým ses udělal|Jsme to, co opakovaně|sebevra|opakovaně děláme/i;

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
async function volbaKlavesnici(page: Page, blok: ReturnType<Page['locator']>, moznost: RegExp, bezDuvodu = false) {
  await blok.getByRole('radio', { name: moznost }).focus();
  await page.keyboard.press('Space');
  // Za kartami je nepovinné „Proč právě tohle?“ (pokud ho blok má), pak tlačítko.
  await page.keyboard.press('Tab');
  if (!bezDuvodu) await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zpetna = blok.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna).toBeVisible();
  return zpetna;
}

test('cesta 4: celý průchod jen klávesnicí na telefonu, zápisy v deníku', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CESTA4);
  await pripravit(page);
  await expect(page.locator('.t-nadtitulek').first()).toContainText('Cesta · asi');
  await expect(page.locator('.t-nadtitulek').first()).toContainText('8 kroků');
  // Karta ani přehled neříkají, co se na hostině stalo: jen že to Alexandr hned věděl.
  await expect(page.locator('main')).not.toContainText(/zabil|opil/i);
  await expect(page.locator('#hotovo a[href^="/mapa/"]')).toHaveAttribute('href', '/mapa/?rok=-343&osoba=aristoteles');
  await page.getByRole('link', { name: 'Začít cestu' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA4}1/`);
  await pripravit(page);

  // Krok 1: první obrazovka je Mieza. Co ho učil, říká text s Plútarchovým „zdá se“; hostina je až pod scénou.
  const pribeh = page.locator('.pribeh');
  await expect(pribeh).toContainText('pozval makedonský král Filip');
  await expect(pribeh).toContainText('Co přesně Aristotelés chlapce učil, nevíme.');
  await expect(pribeh).toContainText('Plútarchos říká opatrně „zdá se“');
  await expect(pribeh).toContainText('Vypráví se taky');
  await expect(pribeh).not.toContainText(/hostin|kopí|opil|Kleit/i);
  // Bez obrázku: deska nese ornament a minci, popisek patří k místu.
  await expect(pribeh.locator('img')).toHaveCount(0);
  await expect(pribeh.locator('.pribeh__deska figcaption')).toHaveText('Makedonie. Sem přišel Aristotelés učit králova syna.');
  const text1 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text1).toContainText('O patnáct let později');
  // Opilost jednou větou; co následovalo po činu, se nevypráví; soud je Arriánův, ne náš.
  expect((await text1.innerText()).match(/opil/gi)).toHaveLength(1);
  await expect(text1).toContainText('Plútarchos píše, že sotva přítel padl, hněv Alexandra opustil.');
  await expect(text1).toContainText('K dobru mu Arriános přičetl, že hned poznal, co udělal, a nehájil to.');
  await expect(text1).not.toContainText(/proti sobě|chtěl se|vrah/i);
  // Hned po scéně otázka pro studenta.
  await expect(text1.locator(':scope > p').last()).toHaveText('Co bys řekl ty: věděl to i ve chvíli, kdy sahal po kopí?');
  // Jména střídmě: Filip jménem jen jednou. Kleitos dvakrát: podruhé tam, kde by zájmeno „ho“ šlo číst
  // jako Alexandra (revize celku 5: vyvedli Kleita, ne krále).
  expect((await page.locator('.krok__obsah').innerText()).match(/Filip/g)).toHaveLength(1);
  expect((await page.locator('.krok__obsah').innerText()).match(/Kleit/g)).toHaveLength(2);
  await expect(text1).toContainText('Přátelé Kleita vyvedou ven, ale on se vrátí.');
  await page.getByRole('link', { name: /Další krok/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA4}2/`);
  await pripravit(page);

  // Krok 2: začátek cesty. Nic se nepíše: blok nemá pole „Proč právě tohle?“ a ukládá jen zvolenou možnost.
  await expect(page.locator('.krok__obsah > .ctenarsky')).toContainText('Nikam ji nepiš');
  const chybelo = page.locator('#cesta4-co-chybelo');
  await expect(chybelo.getByRole('textbox')).toHaveCount(0);
  await expect(chybelo.getByRole('radio')).toHaveCount(4);
  const zpetna2 = await volbaKlavesnici(page, chybelo, /nebylo to v mé moci/, true);
  // Čtvrtá možnost je plnoprávná: nikdo nepochybuje o tom, co student zažil.
  await expect(zpetna2).toContainText('za to, co není v jeho moci, člověk podle Aristotela nemůže');
  await expect(zpetna2).toContainText('Vybavíš si i jinou chvíli');
  await expect(zpetna2).not.toContainText(/opravdu|určitě|jsi si jist/i);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const jinak = chybelo.locator('details.ostatni');
  // Každá možnost má spojence a žádná pokárání.
  await expect(jinak).toContainText('Takhle odpovídá Sókratés v Platónově dialogu Prótagorás');
  await expect(jinak).toContainText('Tak to popisuje většina lidí');
  await expect(jinak).toContainText('Tohle je odpověď Aristotelova');
  await expect(chybelo).not.toContainText(/měl bys|musíš|slab/i);
  await expect(chybelo.locator('.co-udelal')).toHaveCount(0);
  await dalKlavesnici(page, chybelo, 'Kdo ví, udělá to', `${CESTA4}3/`);

  // Krok 3: Sókratés Platónovými ústy; měří se větší a menší, ne slast.
  const text3 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text3).toContainText('Vložil ji do úst Sókratovi');
  await expect(text3).toContainText('Platón ho nechává říct:');
  await expect(text3).toContainText('Platón ho nechává uzavřít:');
  await expect(text3.locator('.citat')).toHaveCount(3);
  await expect(text3.locator('.citat').first()).toContainText('totéž co o otrokovi');
  await expect(text3.locator('.citat').nth(1)).toContainText('zblízka větší a zdálky menší');
  await expect(text3.locator('.citat').nth(2)).toContainText('Nikdo nejde dobrovolně za zlem');
  await expect(page.locator('.krok__obsah')).not.toContainText(/slast|rozkoš|bolest/i);
  await expect(text3.locator(':scope > p').last()).toContainText('omyl se nenapravuje větším přemáháním, ale lepším poznáním');
  const alexandr = page.locator('#cesta4-sokrates-alexandr');
  await alexandr.getByRole('textbox').focus();
  await page.keyboard.type('Nevěděl, co dělá.');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const srovnani = alexandr.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani).toBeFocused();
  // Domyšlená odpověď je podaná jako výklad a opilost se v ní nevrací.
  await expect(srovnani).toContainText('se ale dá odhadnout, co by odpověděl');
  await expect(srovnani).toContainText('Nejspíš tohle');
  await expect(srovnani).toContainText('jako výmluva, nebo jako vysvětlení?');
  await expect(alexandr).not.toContainText(/opil/i);
  await dalKlavesnici(page, alexandr, 'Stavitelem se stáváš stavěním', `${CESTA4}4/`);

  // Krok 4: ctnost vyloží Aristotelés na oku (bez citátu z portrétu), stavitel, nemocní a lékař; zvyk není dril.
  const text4 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text4).toContainText('se člověk naučí hlavně výkladem');
  await expect(text4).toContainText('Poslušnost tím nemyslí.');
  await expect(text4.locator('.citat')).toHaveCount(2);
  await expect(text4.locator('.citat').first()).toContainText('stavěním se lidé stávají staviteli');
  await expect(text4.locator('.citat').nth(1)).toContainText('lékaře pozorně poslouchají');
  await expect(text4.locator('.citat').filter({ hasText: 'Ctnost oka dělá' })).toHaveCount(0);
  await expect(text4).toContainText('Nerodíme se podle něj dobří ani špatní.');
  await expect(text4).toContainText('kdo staví špatně, stane se stavěním špatným stavitelem');
  // Poslední slovo před blokem nikomu nestraní.
  await expect(text4.locator(':scope > p').last()).toHaveText('Než si přečteš, jak si odpověděl, zkus jeden případ.');
  const jeho = page.locator('#cesta4-kdy-je-to-jeho');
  await jeho.getByRole('radio', { name: 'Ano.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(jeho.getByRole('radio', { name: 'Díval se učitel' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(jeho.getByRole('radio', { name: 'Někdo ho šťouchl' })).toBeChecked();
  await expect(jeho.locator('.zmenena')).toContainText('Sám od sebe by neřekl nic.');
  await jeho.locator('.zmenena').getByRole('radio', { name: 'Napůl.' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const zmena = jeho.getByRole('region', { name: 'Posun odpovědi' });
  await expect(zmena).toBeFocused();
  await expect(zmena).toContainText('Rozhodl ses jinak, když to nebyl jeho nápad.');
  await expect(jeho.getByRole('heading', { name: 'Co by na to řekl Aristotelés' })).toBeVisible();
  await expect(jeho.locator('.co-udelal')).toContainText('Na svou námitku Aristotelés odpověděl, že čin a člověk jsou dvě věci.');
  await expect(jeho.locator('.co-udelal')).toContainText('Podle jeho měřítka ten, kdo se někoho zastane kvůli učiteli');
  await expect(jeho.locator('.co-udelal')).toContainText('Stát se jím může, a právě takovými činy.');
  await dalKlavesnici(page, jeho, 'Věděl to doopravdy?', `${CESTA4}5/`);

  // Krok 5: text drží Aristotelovu odpověď i pro toho, kdo blok neodkryl. Neovládnutí není špatnost a nemoc není selhání.
  const text5 = page.locator('.krok__obsah > .ctenarsky');
  await expect(text5.locator(':scope > p').first()).toContainText('správný čin ještě nedělá správného člověka');
  await expect(text5).toContainText('vědění z těch tří věcí váží podle něj nejmíň');
  await expect(text5.locator('.citat')).toHaveCount(2);
  await expect(text5.locator('.citat').first()).toContainText('ve zjevném rozporu s tím, co vidíme');
  await expect(text5.locator('.citat').nth(1)).toContainText('jestli to není přítel');
  await expect(text5).toContainText('člověk se neudrží a nedodrží, co sám uznal za správné');
  await expect(text5).toContainText('Nemoc není selhání povahy.');
  // Hněv: v pořádku to není, ale Aristotelés ho má za míň ošklivý než jiné neovládnutí (1149a24–b6).
  await expect(text5).toContainText('V pořádku to podle něj není: i takové neovládnutí je ošklivé.');
  await expect(text5).toContainText('Je ale míň ošklivé než jiné, protože hněv rozum aspoň zčásti poslouchá.');
  await expect(text5).toContainText('O Alexandrovi tu Aristotelés nepíše.');
  const spor = page.locator('#cesta4-vedel-to');
  await expect(spor).toContainText('Sókratés zemřel dřív, než se Aristotelés narodil.');
  await expect(spor).toContainText('Kdo z nich má pravdu, rozhodni sám.');
  await expect(spor).not.toContainText(/tváří v tvář|řekl mu|odpověděl mu|vyvrá/);
  await expect(spor.locator('.skala__konce').first()).toHaveText(/Sókratés\s*Aristotelés/);
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(spor.getByRole('radio', { name: 'spíš Sókratés' })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  await expect(argumenty).toBeFocused();
  // Sókratés stojí na telefonu první: námitky, na které odpovídá, řekne sám. Aristotelés mu z půlky přitaká.
  await expect(argumenty).toContainText('Lidé namítají: já to přece věděl, a stejně jsem to udělal.');
  await expect(argumenty).toContainText('Aristotelés namítá, že dobrým se člověk stává jednáním, ne poznáním.');
  await expect(argumenty).toContainText('Sókratés by se mohl zeptat');
  await expect(argumenty).toContainText('Sókratés má pravdu v tom, že to plné vědění nebylo');
  // Aristotelés na Sókratovu otázku odpoví; obraz otroka se v argumentu potřetí neopakuje.
  await expect(argumenty).toContainText('A podle čeho pozná, co dělat? Podle toho, kdo to už umí');
  await expect(argumenty).not.toContainText(/vláč/i);
  await expect(argumenty).not.toContainText(/slast|opil|\bvůl[eií]/i);
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.type('srůst chce čas');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toBeFocused();
  await expect(posun).toContainText('Začal jsi: spíš Sókratés. Teď: spíš Aristotelés.');
  await expect(posun).not.toContainText(/vyhrál/i);
  await dalKlavesnici(page, spor, 'Kde je střed?', `${CESTA4}6/`);

  // Krok 6: střed není půlka ani průměr, „zlatý střed“ zazní jednou a hned se opraví; Milón na běhu a zápase.
  const obsah6 = page.locator('.krok__obsah');
  expect((await obsah6.innerText()).match(/zlat/gi)).toHaveLength(1);
  await expect(obsah6).toContainText('Aristotelés to sousloví nepoužil a napůl to nemyslel.');
  await expect(obsah6).toContainText('Střed vzhledem k nám jeden není.');
  expect((await obsah6.innerText()).match(/Milón/g)).toHaveLength(1);
  await expect(obsah6).toContainText('Kolik běhu nebo zápasu je pro něj málo');
  await expect(obsah6).toContainText('trochu krást není ctnost');
  await expect(obsah6.locator('.citat')).toHaveCount(2);
  await expect(obsah6.locator('.citat').first()).toContainText('vůči komu se má');
  await expect(obsah6.locator('.citat').nth(1)).toContainText('není snadné vymezit slovy');
  // Kdo se ptá, kdo střed určí: Aristotelés přiznal, že předem to nejde; spojence v Sókratovi mu jmenuje krok 8.
  await expect(obsah6).toContainText('A kdo ho určí, když na břehu stojíš ty?');
  await expect(obsah6).toContainText('Jak těžko se střed vymezuje předem, sám nezakrývá:');
  await expect(obsah6).toContainText('že střed tedy předem neurčí nikdo, říkáš nahlas to, co Aristotelés přiznal');
  await expect(obsah6).toContainText('Za rozumné se navíc v jeho obci počítali jen svobodní muži.');
  await expect(page.locator('#kde-je-stred')).toBeVisible();
  await expect(obsah6.locator('section.blok')).toHaveCount(0);
  await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA4}7/`);
  await pripravit(page);

  // Krok 7: studie „zkoušela“; shrnutí říká, co měli účastníci dělat a co se měřilo. Nejdřív odhad, pak výsledek.
  const obsah7 = page.locator('.krok__obsah');
  await expect(obsah7).toContainText('vyšla studie, která to zkoušela změřit');
  await expect(obsah7).toContainText('požádali 96 dobrovolníků, většinou studentů');
  await expect(obsah7).toContainText('dvanáct týdnů každý den ve stejné situaci');
  await expect(obsah7).toContainText('jestli to dělají automaticky a bez přemýšlení');
  await expect(obsah7).toContainText('z knihy plastického chirurga z roku 1960');
  await expect(obsah7).toContainText('Jak dlouho se tvoří návyk, neměřil.');
  await expect(obsah7).not.toContainText('O návycích nepsal nic');
  // Graf ukazuje tvar, ne data dvou lidí.
  await expect(obsah7).toContainText('Dva průběhy, jaké studie popisuje.');
  await expect(obsah7).not.toContainText(/účastník\b/);
  const odhad = page.locator('#cesta4-navyk-odhad');
  const zpetna7 = await volbaKlavesnici(page, odhad, /Nikdy úplně/);
  // Zpětná vazba k odhadu výsledek neprozradí a toho, komu se návyky nedaří, nekárá.
  await expect(zpetna7).not.toContainText(/66|254|18 dní/);
  await expect(zpetna7).toContainText('Mluvíš ze zkušenosti, kterou má hodně lidí');
  const niz = odhad.getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
  await expect(niz).toHaveText('Co z měření vyšlo');
  await niz.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA4}7/#co-vyslo`);
  await expect(page.locator('#co-vyslo')).toBeInViewport();
  await expect(obsah7).toContainText('Dost údajů dalo 82 lidí.');
  await expect(obsah7).toContainText('šlo spolehlivě spočítat u 39 lidí');
  await expect(obsah7).toContainText('Nejrychlejšímu z nich to trvalo 18 dní. Nejpomalejšímu vycházelo 254 dní');
  await expect(obsah7).toContainText('Prostřední hodnota byla 66 dní.');
  await expect(obsah7).toContainText('kdo jeden den vynechal, nezačínal od nuly');
  await expect(page.locator('#graf-navyk')).toBeVisible();
  // Výhrady až ve zpětné vazbě druhé otázky; rozdíl mezi druhy úkonů se neuvádí.
  for (const cast of await page.locator('.krok__obsah > .ctenarsky').all()) await expect(cast).not.toContainText(/podle jejich vlastních odpovědí|kouzeln|rychleji než cvičení/);
  const cteni = page.locator('#cesta4-navyk-cteni');
  const zpetnaCteni = await volbaKlavesnici(page, cteni, /Nikomu/);
  await expect(zpetnaCteni).toContainText('podle jejich vlastních odpovědí');
  await expect(zpetnaCteni).toContainText('jen u 39 dobrovolníků, kteří změnu sami chtěli');
  await dalKlavesnici(page, cteni, 'Tvoje pravidlo', `${CESTA4}8/`);

  // Krok 8: kdo dá za pravdu komu, odkaz na otázku 1, výzva s možností nic a vlastní pravidlo.
  const text8 = page.locator('.krok__obsah');
  await expect(text8).toContainText('Souhlasit s ním nemusíš.');
  await expect(text8).toContainText('máš na své straně i kus Aristotela');
  await expect(text8).toContainText('popisuješ to, z čeho Aristotelés vyšel');
  await expect(text8).toContainText('chceš to, co v Platónově dialogu žádá Sókratés: umění měřit');
  await expect(text8).toContainText('Aristotelés s tím nesouhlasil. Ke konci přednášek o etice říká:');
  await expect(text8.getByRole('link', { name: 'Jak mám žít?' })).toHaveAttribute('href', '/otazka/jak-zit/');
  await expect(text8.getByRole('link', { name: 'Co mám ve svých rukou?' })).toHaveAttribute('href', '/cesta/co-mam-ve-svych-rukou/');
  await expect(text8.locator('.citat')).toHaveCount(2);
  const vyzva = page.locator('#zkus-to-zit');
  await expect(vyzva).toContainText('Kam tě to táhne?');
  await expect(vyzva).toContainText('nezkoušej nic: i všímat si je začátek');
  await expect(text8).toContainText('Vzpomeň si znovu na svou chvíli z kroku 2.');
  const panel = page.getByRole('region', { name: 'Na začátku a teď' });
  await expect(panel).toContainText('Krok 2 · Co ti tehdy chybělo?');
  await expect(panel.locator('.zacatek')).toContainText('Věděl jsem to, ale nebylo to v mé moci.');
  await expect(panel.locator('.zacatek')).not.toContainText('Proč');
  const pole = page.getByRole('textbox', { name: 'Stačí vědět, co je správné? A když ne, co je potřeba navíc? Napiš svoje pravidlo.' });
  await pole.focus();
  await page.keyboard.type('Vědět nestačí. Potřebuju to párkrát udělat, než to budu umět.');
  const dokoncit = page.getByRole('link', { name: 'Dokončit cestu' });
  await dokoncit.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${CESTA4}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  await page.goto('/denik/');
  const zapisy = page.locator('.seznam--zapisy');
  await expect(zapisy).toContainText('Vědět nestačí. Potřebuju to párkrát udělat, než to budu umět.');
  await expect(zapisy).toContainText('Na začátku: spíš Sókratés. Po argumentech: spíš Aristotelés. Co mě posunulo: srůst chce čas.');
  await expect(zapisy).toContainText('Nevěděl, co dělá.');
  await expect(zapisy).toContainText('Věděl jsem to, ale nebylo to v mé moci.');
});

test('cesta 4 bez odkrytí bloků: lišta vede až na konec a text mimo bloky drží souvislost', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Co musí stát v hlavním textu kroku (mimo interaktivní část bloků), aby další krok navazoval.
  const NAVAZUJE: (string | RegExp)[][] = [
    ['Co přesně Aristotelés chlapce učil, nevíme.', 'Co se s tím věděním stalo mezitím?'],
    ['ví, co je správné, a neudělá to', 'Která odpověď sedí na tu tvou?'],
    ['Co máš na dosah teď, zdá se větší', 'Špatně změřil', 'omyl se nenapravuje větším přemáháním'],
    ['nestačila mu', 'Nerodíme se podle něj dobří ani špatní.', 'Kdo jedná spravedlivě, ten přece už spravedlivý je. Nebo ne?'],
    ['správný čin ještě nedělá správného člověka', 'Kdo se neudržel, ví, že to bylo špatně.', 'Druhý říká, že se to děje denně.', 'Kdo z nich má pravdu, rozhodni sám.'],
    ['Co ale znamená dobře?', 'Střed vzhledem k nám jeden není.', 'Kresba má jednu čáru.', 'říkáš nahlas to, co Aristotelés přiznal'],
    ['Kolik času?', 'každý den odpovídali, jak samozřejmě jim to už jde', 'Prostřední hodnota byla 66 dní.', 'nejpomalejšímu vycházelo čtrnáctkrát víc dní než nejrychlejšímu', 'Komu ten pokus dává za pravdu?'],
    ['Souhlasit s ním nemusíš.', 'Špatný člověk podle něj o své špatnosti neví.', 'Vzpomeň si znovu na svou chvíli z kroku 2.'],
  ];
  await page.goto(`${CESTA4}1/`);
  for (let n = 1; n <= KROKY4.length; n++) {
    await pripravit(page);
    await expect(page.locator('h1')).toHaveText(KROKY4[n - 1]);
    for (const veta of NAVAZUJE[n - 1]) await expect(page.locator('.krok__obsah')).toContainText(veta);
    // Nic odkrytého: žádná zpětná vazba, argumenty ani srovnání. Panel „Na začátku“ bez počáteční odpovědi chybí.
    await expect(page.locator('.krok__obsah [role="region"]')).toHaveCount(0);
    if (n < KROKY4.length) {
      await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
      await expect(page).toHaveURL(`${CESTA4}${n + 1}/`);
    }
  }
  await page.getByRole('link', { name: 'Dokončit cestu' }).click();
  await expect(page).toHaveURL(`${CESTA4}#hotovo`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

  // V cestě nejsou scény a citáty, které nese portrét nebo jiná stránka, ani slova, která do ní nepatří.
  // Citát o oku (etika-1106a) a vlaštovka v cestě nejsou; Epiktétos jen jednou větou v závěru.
  const citaty: string[] = [];
  for (let n = 1; n <= KROKY4.length; n++) {
    await page.goto(`${CESTA4}${n}/`);
    const text = await page.locator('.krok__obsah').innerText();
    expect(text, `krok ${n}`).not.toMatch(NEPATRI);
    citaty.push(...(await page.locator('.krok__obsah .citat').allInnerTexts()));
    // Nejvýš tři citáty v kroku.
    expect(await page.locator('.krok__obsah .citat').count(), `krok ${n}`).toBeLessThanOrEqual(3);
  }
  // Žádný citát se v cestě neopakuje.
  expect(new Set(citaty).size).toBe(citaty.length);
});
