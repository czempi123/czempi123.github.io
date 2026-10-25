// Portrét Platóna (celek 4, P7): Spor Platón × Diogenés na novém místě, bloky pěti kapitol,
// pravidla textu (kdo v dialogu mluví, Sedmý list, tradované příběhy), deska, mini mapa a Doba a lidé.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PLATON = '/osobnost/platon/';
const SPOR = 'platon-diogenes-skutecnost';

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
  // Pevná hlavička, lišta obsahu a spodní lišta by na snímku celé stránky ležely přes blok.
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .obsah-lista { visibility: hidden !important; }' });
  const r = await blok.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}

const zapis = (page: Page, id: string) =>
  page.evaluate((i) => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').zapisy?.find((z: { id: string }) => z.id === i), id);

test('Spor Platón × Diogenés stojí v Platónově portrétu; Sókratův portrét a profil Diogena na něj vedou', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const odkaz = `a[href="${PLATON}#${SPOR}"]`;
  // Sókratův portrét blok už nemá; spojovací odstavec a Kam dál vedou k Platónovi.
  await page.goto('/osobnost/sokrates/');
  await expect(page.locator(`[id="${SPOR}"]`)).toHaveCount(0);
  await expect(page.locator(odkaz)).toHaveText('Platónově portrétu');
  await expect(page.getByRole('navigation', { name: 'Kam dál' }).locator(`a[href="${PLATON}"]`)).toContainText('Platón');
  // Profil Diogena: kapitola 02 i Kam dál.
  await page.goto('/osobnost/diogenes/');
  await expect(page.locator('#lucerna').locator(odkaz)).toHaveText('Platónově portrétu');
  await expect(page.getByRole('navigation', { name: 'Kam dál' }).locator(odkaz)).toContainText('Platón × Diogenés');
  await expect(page.locator('a[href*="/osobnost/sokrates/#platon"]')).toHaveCount(0);

  await page.goto(`${PLATON}#${SPOR}`);
  const spor = await pripravBlok(page, SPOR, 'Spor');
  await expect(page.locator('#stul-a-stolovost').locator(`[id="${SPOR}"]`)).toHaveCount(1);
  // Scéna říká Diogenovu námitku předem: Platónův druhý argument na ni na telefonu odpovídá.
  await expect(spor).toContainText('Diogenés ho poslouchal a pak namítl');
  await spor.getByRole('radio', { name: 'spíš Diogenés', exact: true }).check({ force: true });
  await spor.getByRole('button', { name: 'Tady stojím' }).click();
  const argumenty = spor.getByRole('region', { name: 'Argumenty obou stran' });
  // První Platónův argument je stůl a truhlář, bez jeskyně; Diogenés má repliku a poslední slovo.
  await expect(argumenty).toContainText('Truhlář, který stůl dělá, se přitom dívá na jedno');
  await expect(argumenty).not.toContainText(/jeskyn|stín/i);
  await expect(argumenty).toContainText('Vypráví se, že Platónovým přednáškám říkal ztráta času.');
  await expect(argumenty).toContainText('Na Platónovu odpověď by mohl říct');
  const posledni = await argumenty.evaluate((e) => e.textContent!.replace(/\s+/g, ' ').trim());
  expect(posledni.indexOf('K čemu je ten tvůj?')).toBeGreaterThan(posledni.indexOf('nemáš.“'));
  await spor.locator('.skala').getByRole('radio', { name: /^Diogenés/ }).check({ force: true });
  await spor.getByRole('button', { name: 'Zapsat konečnou polohu' }).click();
  await expect(spor.getByRole('region', { name: 'Tvůj posun' })).toContainText('I strana, kterou hájí Platón, má argument, který stojí za odpověď.');
  // Reflexe nabízí začátky argumentů jako celé věty.
  const r = spor.locator('details.reflexe');
  await r.locator('summary').click();
  await expect(r.getByRole('radio').nth(0)).toHaveAccessibleName(/^Platón\s*Stolů je mnoho, každý je jiný a\sjednou se rozpadne\. …$/);
  await expect(r.getByRole('radio').nth(1)).toHaveAccessibleName(/nemáš\.“$/);
  expect((await zapis(page, SPOR)).odkaz).toBe(`${PLATON}#${SPOR}`);
  await axe(page, `[id="${SPOR}"]`);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Platón: bloky kapitol · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const r = `${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}`;
      await page.goto(PLATON);

      // 01: Volba bez oddílu Co udělal (co udělal, říká jen dopis pod Platónovým jménem).
      const pribuzni = await pripravBlok(page, 'platon-pribuzni-u-moci', 'Volba');
      await pribuzni.getByRole('radio').first().focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(pribuzni.getByRole('radio', { name: /Počkám a budu se dívat/ })).toBeChecked();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const zpetna = pribuzni.getByRole('region', { name: 'Zpětná vazba' });
      await expect(zpetna).toBeFocused();
      await expect(zpetna).toContainText('Tvůj tah: počkat.');
      await expect(pribuzni.getByRole('heading', { name: /Co udělal/ })).toHaveCount(0);
      await axe(page, '[id="platon-pribuzni-u-moci"]');
      await snimek(page, pribuzni, `platon-volba-pribuzni-${r}`);

      // 02: Odkryj se čtvercem; srovnání řešení neprozradí, úhlopříčka stojí až v textu za blokem.
      const ctverec = await pripravBlok(page, 'platon-ctverec', 'Odkryj');
      await ctverec.locator('textarea').fill('Čtyři stopy.');
      await ctverec.getByRole('button', { name: 'Vyzkoušet odpověď' }).click();
      const srovnani = ctverec.getByRole('region', { name: 'Srovnání' });
      await expect(srovnani).toContainText('Vyšlo ti osm?');
      await expect(srovnani).not.toContainText(/úhlopříč/i);
      await axe(page, '[id="platon-ctverec"]');
      await snimek(page, ctverec, `platon-odkryj-ctverec-${r}`);

      // 03: Spor s otevřenými argumenty se vejde do čtenářského sloupce.
      const spor = await pripravBlok(page, SPOR, 'Spor');
      await spor.getByRole('radio', { name: 'uprostřed', exact: true }).check({ force: true });
      await spor.getByRole('button', { name: 'Tady stojím' }).click();
      await expect(spor.getByRole('region', { name: 'Argumenty obou stran' })).toBeVisible();
      await axe(page, `[id="${SPOR}"]`);
      await snimek(page, spor, `platon-spor-${r}`);

      // 04: Gýgův prsten; žádná možnost nedostane pokárání a otázku „kdyby ho měli všichni“ dostane každá.
      const prsten = await pripravBlok(page, 'platon-gyguv-prsten', 'ZmenJednuVec');
      await expect(prsten).toContainText('Platónův bratr Glaukón vypráví v Ústavě příběh o pastýři.');
      await prsten.getByRole('radio', { name: 'Použiju ho, jak se mi to hodí.' }).check({ force: true });
      await prsten.getByRole('button', { name: 'Rozhodnuto' }).click();
      await prsten.getByRole('radio', { name: 'Nikdo se to nikdy nedozví' }).check({ force: true });
      await prsten.locator('.zmenena').getByRole('radio', { name: 'Použiju ho, jak se mi to hodí.' }).check({ force: true });
      await prsten.locator('.zmenena').getByRole('button').click();
      const posun = prsten.getByRole('region', { name: 'Posun odpovědi' });
      await expect(posun).toContainText('Tvoje odpověď zůstala stejná.');
      await expect(posun).toContainText('A co kdyby takový prsten měli všichni?');
      await expect(prsten.getByRole('heading', { name: 'Co by na to řekli' })).toBeVisible();
      await expect(prsten).toContainText('ať má Gýgův prsten, nebo ne');
      await prsten.getByRole('radio', { name: 'Budeš to vědět jen ty. Navždy.' }).check({ force: true });
      await prsten.locator('.zmenena').getByRole('radio', { name: 'Nepoužiju ho.' }).check({ force: true });
      await prsten.locator('.zmenena').getByRole('button').click();
      await expect(posun).toContainText('Tvoje odpověď se posunula.');
      await expect(posun).toContainText('co tvůj čin udělá s tebou');
      await axe(page, '[id="platon-gyguv-prsten"]');
      await snimek(page, prsten, `platon-prsten-${r}`);

      // 05: Volba s oddílem Co udělal Platón (druhá cesta je doložená; proč jel, říká citát z dopisu pod blokem).
      const dion = await pripravBlok(page, 'platon-dion-vola', 'Volba');
      await dion.getByText('Nepojedu, ale pozvu ho do Akademie.').click();
      await dion.getByRole('button', { name: 'Tohle je můj tah' }).click();
      await expect(dion.getByRole('heading', { name: 'Co udělal Platón' })).toBeVisible();
      await expect(dion.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Rozhodl se jinak. Nasedl na loď a jel do Syrákús podruhé.');
      await axe(page, '[id="platon-dion-vola"]');
      await snimek(page, dion, `platon-volba-dion-${r}`);

      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      // Obnovení stránky drží rozhodnutí.
      await page.reload();
      const znovu = await pripravBlok(page, 'platon-pribuzni-u-moci', 'Volba');
      await expect(znovu.getByRole('region', { name: 'Zpětná vazba' })).toContainText('Tvůj tah: počkat.');
    });
  }
}

test('Platón: text drží pravidla celku (kdo mluví, dopis, tradované příběhy, co do portrétu nepatří)', async ({ page }) => {
  await page.goto(PLATON);
  const text = (await page.locator('.obsah').evaluate((e) => [...e.querySelectorAll('.uvod, .kapitola')].map((k) => k.textContent).join(' '))).replace(/\s+/g, ' ');
  // Sedmý list: pohnutky jen s větou o dopise; údaj pod citátem neříká „Platón“.
  expect(text.match(/V dopise, který se dochoval pod Platónovým jménem, stojí/g)).toHaveLength(2);
  expect(text).not.toMatch(/Platón (vzpomínal|přiznal)/);
  await expect(page.locator('#syrakusy .citat').filter({ hasText: 'pouhé slovo' })).toContainText('dochováno pod Platónovým jménem');
  // U dialogu je řečeno, kdo mluví.
  for (const veta of ['Přítel, který ve vězení byl', 'nechává Platón Sókrata', 'Glaukón', 'říká v tom rozhovoru Parmenidés sám', 'Platón nechává Sókrata vyprávět příběh, který prý kdysi slyšel']) expect(text).toContain(veta);
  // Tradované příběhy jako „Vypráví se“.
  expect(text.match(/Vypráví se, že/g)!.length).toBeGreaterThanOrEqual(4);
  // Co do studentského textu nepatří.
  expect(text).not.toMatch(/Aristokl|Megar|Aigín|Annikeri|Kritiá|Charmid|Adeimant|labu|flétn|Egypt|Isokrat|geometrie nevstup|Thrasymach|Kandaul|společné ženy|popraven/i);
  // Jeskyně nejvýš jednou větou; citáty, které nese cesta 3 a otázka 6, tu nejsou.
  expect(text.match(/jeskyn/gi)).toHaveLength(1);
  expect(text).not.toMatch(/Podobní nám|čtverec sám|Bůh ví, jestli|boj obrů/);
  // Části duše a prsten podle rozhodnutí autora.
  expect(text).toContain('rozum, hněv a žádostivost');
  expect(text).toContain('mrtvá těla');
  await expect(page.locator('[id="platon-gyguv-prsten"]')).toContainText('Tomu prstenu se říká Gýgův.');
  // Patnáct citátů, každý jednou; hlavní citát jen pod úvodem.
  const citaty = await page.locator('.obsah .citat').evaluateAll((c) => c.map((x) => x.textContent!.replace(/\s+/g, ' ').trim()));
  expect(citaty).toHaveLength(15);
  expect(new Set(citaty).size).toBe(15);
  // Kam dál: cesta 3 a otázka 6 (P8); položky nejvýš čtyři, Diogenés má odkaz v kapitole 03.
  const kamDal = page.getByRole('navigation', { name: 'Kam dál' });
  await expect(kamDal.getByRole('link')).toHaveText([/Cesta 3\s*Je to, co vidím, celá skutečnost\?/, /Sókratés/, /Marcus Aurelius/, /Velká otázka 6\s*Co je skutečné\?/]);
  await expect(kamDal.getByRole('link').first()).toHaveAttribute('href', '/cesta/je-to-co-vidim-cela-skutecnost/');
  await expect(kamDal.getByRole('link').last()).toHaveAttribute('href', '/otazka/co-je-skutecne/');
});

test('Platón: vstupy do cesty 3 a otázky 6 v hlavičce, u věty o jeskyni, v přehledu otázek a v Lidech', async ({ page }) => {
  await page.goto(PLATON);
  // Hlavička profilu nabízí cestu a otázku sama z dat.
  await expect(page.locator('.vstupy-osoby a')).toHaveText([/Cesta 3 · 8 kroků · asi 27 minut\s*Je to, co vidím, celá skutečnost\?/, /Velká otázka 6\s*Co je skutečné\?/, /Velká otázka 3\s*Má život smysl\?/, /Velká otázka 5\s*Kdo vlastně jsem\?/]);
  await expect(page.locator('.vstupy-osoby a').first()).toHaveAttribute('href', '/cesta/je-to-co-vidim-cela-skutecnost/');
  // Věta o jeskyni v kapitole 03 vede na cestu; karta cesty v portrétu není (větu „Podobní nám“ nese až cesta).
  await expect(page.locator('#stul-a-stolovost a[href="/cesta/je-to-co-vidim-cela-skutecnost/"]')).toHaveText('Je to, co vidím, celá skutečnost?');
  await expect(page.locator('.cesta-karta')).toHaveCount(0);
  // Přehled otázek: otázka 6 má vlastní stránku a cestu; Lidé: cesta na kartě Platóna.
  await page.goto('/otazky/');
  await expect(page.locator('#co-je-skutecne .cesta')).toHaveText(/Cesta 3\s*Je to, co vidím, celá skutečnost\?/);
  await expect(page.locator('#co-je-skutecne a[href="/otazka/co-je-skutecne/"]')).toHaveCount(1);
  await page.goto('/lide/');
  await expect(page.locator('#platon .karta__cesta')).toHaveText('Cesta 3: Je to, co vidím, celá skutečnost?');
});

test('Platón: deska, mini mapa a Doba a lidé sedí na text', async ({ page }) => {
  const stred = () => page.locator('.osobnost__deska img').evaluate((img) => getComputedStyle(img).objectPosition);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PLATON);
  // Deska na telefonu je na šířku: odlitek má vlastní střed výřezu, aby zůstalo čelo i oči.
  expect(await stred()).toBe('50% 16%');
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toContainText('Sádrový odlitek římské mramorové hlavy');
  // Mini mapa: tři pobyty v Syrákúsách vedle Athén; přibližné roky nesou „asi“.
  const syrakusy = page.locator('.minimapa svg g.popisek', { hasText: 'Syrákúsy' });
  await expect(syrakusy).toContainText('pobyt asi 387');
  await expect(syrakusy).toContainText('pobyt asi 366');
  await expect(syrakusy).toContainText('pobyt 361');
  await expect(page.locator('.minimapa svg g.popisek', { hasText: 'Athény' })).toContainText('smrt 347');
  // Doba a lidé: polemika pod „Znali se a přeli se“, vliv přes texty zvlášť.
  const skupina = (nazev: string) => page.locator('.doba__vztahy > div').filter({ has: page.getByRole('heading', { name: nazev, exact: true }) });
  await expect(skupina('Učitelé')).toContainText('Sókratés');
  await expect(skupina('Žáci')).toContainText('Aristotelés');
  for (const jmeno of ['Archytás', 'Aristotelés', 'Diogenés']) await expect(skupina('Znali se a přeli se')).toContainText(jmeno);
  await expect(skupina('Znali se a přeli se')).not.toContainText(/Parmenidés|Hérakleitos/);
  await expect(skupina('Koho četl')).toContainText('Parmenidés');
  await expect(skupina('Koho četl')).toContainText('Hérakleitos');
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await stred()).toBe('50% 36%');
});
