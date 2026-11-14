// Hodina pro studenta (/hodina/?v=1&n=…&z=…) a průchod hodinou: stránka hodiny z odkazu, neznámé zastavení, neplatná
// adresa, lišta hodiny tam a zpět jen klávesnicí, zavřená lišta, lišty se netlučou, Doma projdi s odškrtnutým krokem
// a kapitolou (i dočtení kapitoly, ne proletění), hodina v deníku, tisk přehledu ve skladateli, poznámky učitele
// se studentovi nikdy neukážou; promítání: celá hodina tam a zpět šipkami, PageDown/PageUp a mezerníkem přes krok,
// blok, kapitolu a hlas, jen úsek zastavení, šipky v poli bloku, Esc. Axe a snímky do Claude outputs/hodiny/.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const SNIMKY = 'Claude outputs/hodiny';
mkdirSync(SNIMKY, { recursive: true });
const NENI = 'Tohle místo už v atlasu není';
const KROK2 = '/cesta/kdy-mam-dobry-duvod-verit/2/';
const odkaz = (nazev: string, ids: string[]) => `/hodina/?v=1&n=${encodeURIComponent(nazev)}&z=${ids.join(',')}`;
/** Hodina pro lištu: krok a blok na téže stránce, zastavení, které v atlasu není, kapitola a hlas. */
const STUDENT = odkaz('Delfy', ['k:kdy-mam-dobry-duvod-verit/2', 'b:cesta1-jak-zjistit', 'k:zrusena-cesta/2', 'o:sokrates/soud', 'h:jak-zit/epikuros']);
/** Hodina pro promítání: krok, blok, kapitola a hlas. */
const PLATNO = odkaz('Delfy', ['k:kdy-mam-dobry-duvod-verit/1', 'b:cesta1-jak-zjistit', 'o:sokrates/soud', 'h:jak-zit/epikuros']);
const TAJNE = 'TAJNA-POZNAMKA';
const ULOZENA = {
  verze: 1,
  id: 'hodina-test',
  nazev: 'Delfy',
  poznamka: `${TAJNE} k hodině: začít otázkou na věštírnu.`,
  zastaveni: [
    { id: 'k:kdy-mam-dobry-duvod-verit/1', poznamka: `${TAJNE}-1` },
    { id: 'b:cesta1-jak-zjistit', poznamka: '' },
    { id: 'k:zrusena-cesta/2', poznamka: '' },
    { id: 'o:sokrates/soud', poznamka: `${TAJNE}-4 Euthyfrón.` },
    { id: 'h:jak-zit/epikuros', poznamka: '' },
  ],
  zmeneno: '2026-10-17T14:20:00.000Z',
};

const rezimy = ['light', 'dark'] as const;
const nazevRezimu = (r: (typeof rezimy)[number]) => (r === 'light' ? 'svetly' : 'tmavy');

/** Písma a lišta hodiny: buď na stránce není, nebo ji skript už vyplnil (a při promítání ukázal obsah). */
async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const h = document.documentElement.classList;
    if (!h.contains('s-hodinou')) return true;
    return !!document.querySelector('[data-hodina-lista]')?.hasAttribute('data-pripraveno') && (!h.contains('promitani') || h.contains('promitani-pripraveno'));
  });
}

async function otevritHodinu(page: Page, adresa = STUDENT) {
  await page.goto(adresa);
  await pripravit(page);
  await expect(page.locator('ol.zastaveni > li').first()).toBeVisible();
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(v.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

/** Tabulátorem (nebo Shift+Tab) na prvek; selže, když se tam nedostane. */
async function tabNa(page: Page, cil: Locator, zpet = false, nejvic = 60) {
  for (let i = 0; i < nejvic; i++) {
    if (await cil.evaluate((el) => el === document.activeElement).catch(() => false)) return;
    await page.keyboard.press(zpet ? 'Shift+Tab' : 'Tab');
  }
  throw new Error(`Tabulátor se na prvek nedostal: ${cil}`);
}

const lista = (page: Page) => page.locator('[data-hodina-lista]');
const titulek = (page: Page) => page.locator('.hodina-lista__titulek');
const poradi = (i: number, n: number) => new RegExp(`${i}\\s(z|ze)\\s${n}$`);
const bezMezer = (s: string | null) => (s ?? '').replace(/\u00a0/g, ' ');

/** Lištou na zastavení: Enter na Předchozí/Další (fokus tam přijde tabulátorem, když tam už není). */
async function listou(page: Page, kam: 'predchozi' | 'dalsi') {
  const tl = lista(page).locator(`[data-hl-${kam}]`);
  const href = (await tl.getAttribute('href'))!;
  await tabNa(page, tl);
  await page.keyboard.press('Enter');
  // Na téže stránce se adresa jen přepíše, jinak se načte nová stránka.
  await page.waitForURL((u) => u.pathname + u.hash === href);
  await pripravit(page);
}

test('otevřít hodinu z odkazu: název, zastavení v pořadí, neznámé bez odkazu, hlavní tlačítko; poznámky učitele nikde', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Učitel má v tomtéž prohlížeči uloženou hodinu s poznámkami; student je nesmí vidět.
  await page.goto('/');
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), ULOZENA);
  await otevritHodinu(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delfy');
  const polozky = page.locator('ol.zastaveni > li');
  await expect(polozky).toHaveCount(5);
  await expect(polozky.nth(0).locator('.kde')).toHaveText(/^Krok 2 · Kdy mám dobrý důvod věřit\?$/);
  await expect(polozky.nth(0).getByRole('link')).toHaveAttribute('href', KROK2);
  // U bloku stojí nadtitulek jako na stránce („Tvůj tah“), ne druh bloku z dílny.
  await expect(polozky.nth(1).locator('.kde')).toHaveText(/^Tvůj tah · Kdy mám dobrý důvod věřit\? · krok\s2$/);
  await expect(polozky.nth(1).getByRole('link')).toHaveAttribute('href', `${KROK2}#cesta1-jak-zjistit`);
  await expect(polozky.nth(2)).toContainText(NENI);
  await expect(polozky.nth(2).locator('a')).toHaveCount(0);
  await expect(polozky.nth(3).getByRole('link')).toHaveAttribute('href', '/osobnost/sokrates/#soud');
  await expect(polozky.nth(4).getByRole('link')).toHaveAttribute('href', '/otazka/jak-zit/#hlas-epikuros');
  const zacit = page.getByRole('link', { name: 'Začít hodinu' });
  await expect(zacit).toHaveAttribute('href', KROK2);
  await expect(page.getByRole('button', { name: 'Promítat hodinu' })).toBeVisible();
  // Stránka nepatří do hledání a poznámky na ní nejsou.
  await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
  expect(await page.content()).not.toContain(TAJNE);
  await zacit.click();
  await page.waitForURL(`**${KROK2}`);
  await expect(lista(page)).toBeVisible();
  expect(await page.content()).not.toContain(TAJNE);
});

test('adresa bez hodiny nebo s neznámou verzí: krátká věta a odkaz Domů', async ({ page }) => {
  for (const adresa of ['/hodina/', '/hodina/?v=2&n=Delfy&z=k:kdy-mam-dobry-duvod-verit/1', '/hodina/?v=1&n=Delfy&z=']) {
    await page.goto(adresa);
    await pripravit(page);
    await expect(page.getByText('Tenhle odkaz žádnou hodinu nenese.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Domů', exact: true }).last()).toHaveAttribute('href', '/');
    await expect(page.locator('ol.zastaveni')).toHaveCount(0);
  }
});

test('lišta hodiny: průchod tam a zpět jen klávesnicí, neznámé zastavení se přeskočí', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await otevritHodinu(page);
  await tabNa(page, page.getByRole('link', { name: 'Začít hodinu' }));
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${KROK2}`);
  await pripravit(page);
  await expect(titulek(page)).toHaveText(/^Hodina: Delfy · 1\sz\s5$/);
  await expect(lista(page).locator('[data-hl-predchozi]')).toHaveAttribute('aria-disabled', 'true');
  await expect(lista(page).locator('[data-hl-prehled]')).toHaveAttribute('href', STUDENT);

  // Krok a blok na téže stránce: Další přejde na blok bez nového načtení, fokus zůstane na Další.
  await listou(page, 'dalsi');
  await expect(page).toHaveURL(new RegExp(`${KROK2}#cesta1-jak-zjistit$`));
  await expect(titulek(page)).toHaveText(poradi(2, 5));
  await expect(lista(page).locator('[data-hl-dalsi]')).toBeFocused();
  const blok = await page.locator('#cesta1-jak-zjistit').boundingBox();
  const spodekListy = (await lista(page).boundingBox())!;
  expect(blok!.y).toBeGreaterThanOrEqual(spodekListy.y + spodekListy.height - 1);
  expect(blok!.y).toBeLessThan(400);

  // Zastavení 3 v atlasu není: Další vede rovnou na 4.
  await listou(page, 'dalsi');
  await expect(page).toHaveURL(/\/osobnost\/sokrates\/#soud$/);
  await expect(titulek(page)).toHaveText(poradi(4, 5));
  await listou(page, 'dalsi');
  await expect(page).toHaveURL(/\/otazka\/jak-zit\/#hlas-epikuros$/);
  await expect(titulek(page)).toHaveText(poradi(5, 5));
  await expect(lista(page).locator('[data-hl-dalsi]')).toHaveAttribute('aria-disabled', 'true');

  // A zpátky.
  await listou(page, 'predchozi');
  await expect(page).toHaveURL(/\/osobnost\/sokrates\/#soud$/);
  await expect(titulek(page)).toHaveText(poradi(4, 5));
  await listou(page, 'predchozi');
  await expect(page).toHaveURL(new RegExp(`${KROK2}#cesta1-jak-zjistit$`));
  await expect(titulek(page)).toHaveText(poradi(2, 5));
  await listou(page, 'predchozi');
  await expect(page).toHaveURL(new RegExp(`${KROK2}$`));
  await expect(titulek(page)).toHaveText(poradi(1, 5));

  // Přehled hodiny vede zpět na stránku hodiny.
  await tabNa(page, lista(page).locator('[data-hl-prehled]'));
  await page.keyboard.press('Enter');
  await page.waitForURL('**/hodina/?**');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delfy');
});

test('na stránce otevřené mimo lištu platí zastavení podle kotvy; stránka bez zastavení má lištu mimo hodinu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevritHodinu(page);
  // Dokud student na žádném zastavení nebyl, stránka mimo hodinu lištu nemá.
  await page.goto('/osobnost/platon/');
  await pripravit(page);
  await expect(lista(page)).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.classList.contains('s-hodinou'))).toBe(false);
  await page.goto(`${KROK2}#cesta1-jak-zjistit`);
  await pripravit(page);
  await expect(titulek(page)).toHaveText(poradi(2, 5));
  // Stránka bez zastavení: Předchozí vede zpátky na poslední zastavení, Další na zastavení za ním (3 v atlasu není).
  await page.goto('/osobnost/platon/');
  await pripravit(page);
  await expect(lista(page)).toBeVisible();
  await expect(titulek(page)).toHaveText('Hodina: Delfy · mimo hodinu');
  const zpet = lista(page).locator('[data-hl-predchozi]');
  await expect(zpet).toHaveAccessibleName(/^Zpět na 2\sz\s5$/);
  await expect(zpet).toHaveAttribute('href', `${KROK2}#cesta1-jak-zjistit`);
  await expect(lista(page).locator('[data-hl-dalsi]')).toHaveAttribute('href', '/osobnost/sokrates/#soud');
  await expect(lista(page).locator('[data-hl-prehled]')).toHaveAttribute('href', STUDENT);
  await axe(page);
  // Přehled hodiny: tam lišta není a poslední zastavení zůstane, takže lišta mimo hodinu vede dál zpátky.
  await lista(page).locator('[data-hl-prehled]').click();
  await page.waitForURL('**/hodina/?**');
  await pripravit(page);
  await expect(lista(page)).toBeHidden();
  await page.goto('/osobnost/platon/');
  await pripravit(page);
  await expect(lista(page).locator('[data-hl-predchozi]')).toHaveAttribute('href', `${KROK2}#cesta1-jak-zjistit`);
  // Skladatel hodiny lištu nemá.
  await page.goto('/hodina/nova/');
  await pripravit(page);
  await expect(lista(page)).toBeHidden();
});

for (const [sirka, vyska] of [[390, 844], [1440, 900]] as const) {
  test(`odbočka mimo hodinu na ${sirka} px: Další krok v liště kroku i Kam dál z bloku, lišta mimo hodinu vede zpátky`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: sirka, height: vyska });
    await otevritHodinu(page);
    await page.getByRole('link', { name: 'Začít hodinu' }).click();
    await page.waitForURL(`**${KROK2}`);
    await pripravit(page);
    await expect(titulek(page)).toHaveText(poradi(1, 5));

    // Velké Další krok v liště kroku cesty: krok 3 v hodině není.
    await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
    await page.waitForURL('**/cesta/kdy-mam-dobry-duvod-verit/3/');
    await pripravit(page);
    await expect(lista(page)).toBeVisible();
    await expect(page.locator('[data-hl-nazev]')).toHaveText('Delfy');
    await expect(page.locator('[data-hl-pocet]')).toHaveText('mimo hodinu');
    const zpet = lista(page).locator('[data-hl-predchozi]');
    await expect(zpet).toHaveAccessibleName(/^Zpět na 1\sz\s5$/);
    await expect(zpet).toHaveAttribute('href', KROK2);
    await expect(lista(page).locator('[data-hl-dalsi]')).toHaveAttribute('href', `${KROK2}#cesta1-jak-zjistit`);
    // Lišta hodiny se netluče s hlavičkou kroku a s lištou kroku dole.
    const h = (await page.locator('.cesta-hlavicka').boundingBox())!;
    const l = (await lista(page).boundingBox())!;
    const c = (await page.locator('.cesta-lista').boundingBox())!;
    expect(l.y).toBeGreaterThanOrEqual(h.y + h.height - 1);
    expect(l.y + l.height).toBeLessThanOrEqual(c.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `${SNIMKY}/mimo-hodinu-${sirka}.png` });
    await axe(page);

    // Zpátky na zastavení 1, Další na zastavení 2 (blok), a z bloku Kam dál zase mimo hodinu.
    await zpet.click();
    await page.waitForURL(`**${KROK2}`);
    await pripravit(page);
    await expect(titulek(page)).toHaveText(poradi(1, 5));
    await lista(page).locator('[data-hl-dalsi]').click();
    await page.waitForURL(`**${KROK2}#cesta1-jak-zjistit`);
    await pripravit(page);
    await expect(titulek(page)).toHaveText(poradi(2, 5));
    const volba = page.locator('#cesta1-jak-zjistit');
    await volba.getByText('Najdu lidi').click();
    await volba.getByRole('button', { name: 'Tohle je můj tah' }).click();
    await page.locator('.cesta-lista [data-dalsi-krok]').click();
    await page.waitForURL('**/cesta/kdy-mam-dobry-duvod-verit/3/');
    await pripravit(page);
    await expect(page.locator('[data-hl-pocet]')).toHaveText('mimo hodinu');
    await expect(zpet).toHaveAccessibleName(/^Zpět na 2\sz\s5$/);
    await expect(zpet).toHaveAttribute('href', `${KROK2}#cesta1-jak-zjistit`);
    await expect(lista(page).locator('[data-hl-dalsi]')).toHaveAttribute('href', '/osobnost/sokrates/#soud');
    // Další mimo hodinu jde na zastavení za posledním (4 z 5, kapitola Soud).
    await lista(page).locator('[data-hl-dalsi]').click();
    await page.waitForURL('**/osobnost/sokrates/#soud');
    await pripravit(page);
    await expect(titulek(page)).toHaveText(poradi(4, 5));
    // Zavřít mimo hodinu: lišta zmizí i tady.
    await page.goto('/osobnost/platon/');
    await pripravit(page);
    await lista(page).getByRole('button', { name: 'Zavřít' }).click();
    await expect(lista(page)).toBeHidden();
    await page.reload();
    await pripravit(page);
    await expect(lista(page)).toBeHidden();
  });
}

test('příchod z lišty na zastavení daleko v profilu: na kotvu rovnou, bez jízdy přes stránku', async ({ page }) => {
  // Plynulý posun atlasu zapnutý (bez omezeného pohybu): právě ten by stránku vezl od začátku dolů.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [sirka, vyska] of [[390, 844], [1440, 900]] as const) {
    await page.setViewportSize({ width: sirka, height: vyska });
    await otevritHodinu(page, odkaz('Seneca', ['k:kdy-mam-dobry-duvod-verit/2', 'o:seneca/doba-a-lide']));
    await page.getByRole('link', { name: 'Začít hodinu' }).click();
    await page.waitForURL(`**${KROK2}`);
    await pripravit(page);
    await lista(page).locator('[data-hl-dalsi]').click();
    await page.waitForURL('**/osobnost/seneca/#doba-a-lide');
    // Hned po načtení stojí stránka u oddílu a dál se nehýbe.
    const polohy = await page.evaluate(async () => {
      const vysledek: number[] = [];
      for (let i = 0; i < 12; i++) {
        vysledek.push(Math.round(scrollY));
        await new Promise((r) => requestAnimationFrame(r));
      }
      return vysledek;
    });
    expect(new Set(polohy).size, polohy.join(', ')).toBe(1);
    expect(polohy[0]).toBeGreaterThan(5000);
    const oddil = await page.locator('#doba-a-lide').boundingBox();
    expect(oddil!.y).toBeLessThan(vyska / 2);
    // Po načtení zase platí plynulý posun atlasu.
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('skok-na-zastaveni'))).toBe(false);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');
  }
});

test('zavřená lišta se v kartě neukáže, dokud student hodinu znovu neotevře', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await otevritHodinu(page);
  await page.getByRole('link', { name: 'Začít hodinu' }).click();
  await page.waitForURL(`**${KROK2}`);
  await pripravit(page);
  await lista(page).getByRole('button', { name: 'Zavřít' }).click();
  await expect(lista(page)).toBeHidden();
  await expect(page.locator('main')).toBeFocused();
  await page.reload();
  await pripravit(page);
  await expect(lista(page)).toBeHidden();
  await page.goto('/osobnost/sokrates/#soud');
  await pripravit(page);
  await expect(lista(page)).toBeHidden();
  await otevritHodinu(page);
  await page.getByRole('link', { name: 'Začít hodinu' }).click();
  await page.waitForURL(`**${KROK2}`);
  await expect(lista(page)).toBeVisible();
  // V jiné kartě (nová stránka v témže kontextu) hodina aktivní není.
  const druha = await page.context().newPage();
  await druha.goto(KROK2);
  await expect(druha.locator('[data-hodina-lista]')).toBeHidden();
});

test('lišta hodiny se netluče s hlavičkou, lištou kroku, spodní lištou telefonu ani s lištou Obsah', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await otevritHodinu(page);
  await page.goto(KROK2);
  await pripravit(page);
  const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
  for (const y of [0, 600]) {
    await page.evaluate((y) => scrollTo(0, y), y);
    const h = await box('.cesta-hlavicka');
    const l = await box('[data-hodina-lista]');
    const c = await box('.cesta-lista');
    expect(l.y).toBeGreaterThanOrEqual(h.y + h.height - 1);
    expect(l.y + l.height).toBeLessThanOrEqual(c.y);
  }
  // Profil: lišta Obsah drží pod lištou hodiny, kapitola z kotvy pod oběma.
  await page.goto('/osobnost/sokrates/#soud');
  await pripravit(page);
  await page.waitForTimeout(200);
  const l = await box('[data-hodina-lista]');
  const o = await box('.obsah-lista');
  const s = await box('nav.lista');
  expect(o.y).toBeGreaterThanOrEqual(l.y + l.height - 1);
  expect(l.y + l.height).toBeLessThanOrEqual(s.y);
  const kapitola = await box('#soud-titulek');
  expect(kapitola.y).toBeGreaterThanOrEqual(o.y + o.height - 1);
});

test('Doma projdi: kroky a kapitoly mimo hodinu, odškrtnutý krok a kapitola (text, ne jen barva)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem('atlas-denik', JSON.stringify({
      verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
      cesty: { 'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, krok: 3, navstivene: [2, 3], kdy: '2026-10-16T10:00:00Z' } },
      prectene: { '/osobnost/sokrates/': ['delfy'] },
    })),
  );
  await otevritHodinu(page);
  const doma = page.getByRole('region', { name: 'Doma projdi' });
  await expect(doma).toBeVisible();
  const skupiny = doma.locator('.skupina');
  await expect(skupiny).toHaveCount(2);
  await expect(skupiny.nth(0).locator('h3')).toContainText('Kdy mám dobrý důvod věřit?');
  // Krok 2 v hodině je, mezi zbytkem není.
  const kroky = skupiny.nth(0).locator('li');
  await expect(kroky).toHaveCount(6);
  await expect(kroky.nth(0)).toContainText('Krok 1');
  await expect(kroky.nth(0)).not.toContainText('prošel jsi');
  await expect(kroky.nth(1)).toContainText('Krok 3');
  await expect(kroky.nth(1)).toContainText('prošel jsi');
  await expect(kroky.nth(1).getByRole('link')).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/3/');
  const kapitoly = skupiny.nth(1).locator('li');
  await expect(skupiny.nth(1).locator('h3')).toContainText('Sókratés');
  await expect(kapitoly).toHaveCount(4);
  await expect(kapitoly.nth(0)).toContainText('Kapitola 01');
  await expect(kapitoly.nth(0)).toContainText('dočteno');
  await expect(kapitoly.nth(1)).not.toContainText('dočteno');
  await expect(kapitoly.nth(0).getByRole('link')).toHaveAttribute('href', '/osobnost/sokrates/#delfy');
  await expect(skupiny.locator('li', { hasText: 'Soud' })).toHaveCount(0);

  // Hodina, která pokrývá celý profil a nic víc: Doma projdi nic neukazuje.
  await otevritHodinu(page, odkaz('Sókratés celý', ['o:sokrates']));
  await expect(page.getByRole('region', { name: 'Doma projdi' })).toHaveCount(0);
});

test('kapitola je dočtená po čtení do konce, ne po proletění', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/osobnost/sokrates/');
  await page.evaluate(() => document.fonts.ready);
  const prectene = () => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') || '{}').prectene?.['/osobnost/sokrates/'] ?? []);
  const naKotvu = (y: string) => page.evaluate((y) => {
    const k = document.getElementById('delfy')!.getBoundingClientRect();
    scrollTo(0, scrollY + (y === 'zacatek' ? k.top - 200 : k.bottom - innerHeight + 40));
  }, y);
  // Proletění: začátek, konec a pryč během dvou vteřin.
  await naKotvu('zacatek');
  await page.clock.runFor(1000);
  await naKotvu('konec');
  await page.clock.runFor(1000);
  await page.evaluate(() => scrollTo(0, document.getElementById('soud')!.getBoundingClientRect().top + scrollY));
  await page.clock.runFor(1000);
  expect(await prectene()).toEqual([]);
  // Čtení: kapitola je čtený oddíl několik minut a student dojede na její konec.
  await naKotvu('zacatek');
  await page.clock.runFor(1000);
  await page.clock.runFor(120_000);
  await naKotvu('konec');
  await page.clock.runFor(2000);
  expect(await prectene()).toEqual(['delfy']);
});

test('hodina v deníku: oddíl Hodiny s odkazem zpět, Moje hodiny učitele zvlášť', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), { ...ULOZENA, nazev: 'Učitelova hodina' });
  await otevritHodinu(page);
  await page.goto('/denik/');
  await pripravit(page);
  const nadpisy = page.getByRole('heading', { level: 2 });
  await expect(nadpisy.filter({ hasText: /^Hodiny$/ })).toBeVisible();
  await expect(nadpisy.filter({ hasText: /^Moje hodiny$/ })).toBeVisible();
  const hodiny = page.getByRole('list', { name: 'Hodiny' });
  await expect(hodiny.getByRole('link')).toHaveText(['Delfy']);
  await expect(hodiny.getByRole('link')).toHaveAttribute('href', STUDENT);
  await expect(hodiny).not.toContainText('Učitelova hodina');
  expect(await page.content()).not.toContain(TAJNE);
  await hodiny.getByRole('link').click();
  await page.waitForURL('**/hodina/?**');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Delfy');
});

test('skladatel: Promítat hodinu u uložené hodiny a Vytisknout přehled', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), ULOZENA);
  await page.goto('/hodina/nova/?hodina=hodina-test');
  await pripravit(page);
  await expect(page.locator('.zvolena > li')).toHaveCount(5);
  await page.evaluate(() => { (window as unknown as { tisk: number }).tisk = 0; window.print = () => { (window as unknown as { tisk: number }).tisk++; }; });
  await page.getByRole('button', { name: 'Vytisknout přehled' }).click();
  expect(await page.evaluate(() => (window as unknown as { tisk: number }).tisk)).toBe(1);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForURL('**/cesta/kdy-mam-dobry-duvod-verit/1/');
  await expect(page.locator('html')).toHaveClass(/promitani-pripraveno/);
  await expect(titulek(page)).toHaveText(poradi(1, 5));
  // Nová hodina bez uložení Promítat nenabízí.
  await page.goto('/hodina/nova/');
  await pripravit(page);
  await expect(page.getByRole('button', { name: 'Promítat hodinu' })).toHaveCount(0);
});

for (const sirka of [390, 1440] as const) {
  for (const rezim of rezimy) {
    test(`tisková podoba přehledu: ${sirka} px, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: 900 });
      await page.emulateMedia({ colorScheme: rezim });
      await page.goto('/');
      await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), ULOZENA);
      await page.goto('/hodina/nova/?hodina=hodina-test');
      await pripravit(page);
      await expect(page.locator('.zvolena > li')).toHaveCount(5);
      await page.emulateMedia({ media: 'print', colorScheme: rezim });
      const tisk = page.locator('.tisk');
      await expect(tisk).toBeVisible();
      for (const sel of ['header.hlavicka', 'footer', '.skladatel', 'section.vyber', 'nav.lista', 'h1']) await expect(page.locator(sel).first()).toBeHidden();
      expect(await page.locator('button, input, select, textarea').evaluateAll((v) => v.filter((x) => x.getClientRects().length > 0).length)).toBe(0);
      await expect(tisk.locator('.tisk__nazev')).toHaveText('Delfy');
      // Pod názvem celý odkaz pro studenty (s doménou), bez poznámek učitele.
      const odkazTisk = tisk.locator('.tisk__odkaz');
      await expect(odkazTisk).toHaveText(/^Odkaz pro studenty: http:\/\/localhost:\d+\/hodina\/\?v=1&n=Delfy&z=k:kdy-mam-dobry-duvod-verit\/1,b:cesta1-jak-zjistit,k:zrusena-cesta\/2,o:sokrates\/soud,h:jak-zit\/epikuros$/);
      await expect(odkazTisk).not.toContainText(TAJNE);
      await expect(tisk).toContainText(`${TAJNE} k hodině`);
      const zastaveni = tisk.locator('.tisk__zastaveni');
      await expect(zastaveni).toHaveCount(5);
      await expect(zastaveni.nth(0)).toContainText('1.');
      await expect(zastaveni.nth(0)).toContainText('Krok 1 · Kdy mám dobrý důvod věřit?');
      await expect(zastaveni.nth(0).locator('.tisk__adresa')).toHaveText(/^http:\/\/localhost:\d+\/cesta\/kdy-mam-dobry-duvod-verit\/1\/$/);
      await expect(zastaveni.nth(0)).toContainText(`Poznámka: ${TAJNE}-1`);
      await expect(zastaveni.nth(2)).toContainText(NENI);
      await expect(zastaveni.nth(3).locator('.tisk__adresa')).toHaveText(/\/osobnost\/sokrates\/#soud$/);
      // Na papíře vždy tmavý text na bílém, i z tmavého režimu.
      const barva = await tisk.evaluate((el) => getComputedStyle(el).color);
      expect(barva).toBe('rgb(20, 17, 13)');
      await page.screenshot({ path: `${SNIMKY}/tisk-${sirka}-${nazevRezimu(rezim)}.png`, fullPage: true });
    });
  }
}

for (const sirka of [390, 1440] as const) {
  for (const rezim of rezimy) {
    test(`stránka hodiny a stránky s lištou: axe a snímky ${sirka} px, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() =>
        localStorage.setItem('atlas-denik', JSON.stringify({
          verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: {}, aktivita: [],
          cesty: { 'kdy-mam-dobry-duvod-verit': { nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, krok: 3, navstivene: [3], kdy: '2026-10-16T10:00:00Z' } },
          prectene: { '/osobnost/sokrates/': ['delfy'] },
        })),
      );
      await otevritHodinu(page);
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `${SNIMKY}/hodina-${sirka}-${nazevRezimu(rezim)}.png`, fullPage: true });

      await page.getByRole('link', { name: 'Začít hodinu' }).click();
      await page.waitForURL(`**${KROK2}`);
      await pripravit(page);
      await expect(lista(page)).toBeVisible();
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `${SNIMKY}/krok-s-listou-${sirka}-${nazevRezimu(rezim)}.png` });

      await page.goto('/osobnost/sokrates/#soud');
      await pripravit(page);
      await page.evaluate(() => scrollBy(0, 1));
      await page.waitForTimeout(200);
      await expect(lista(page)).toBeVisible();
      await expect(page.locator('.obsah-lista__tlacitko')).toBeVisible();
      await axe(page);
      await page.screenshot({ path: `${SNIMKY}/profil-s-listou-${sirka}-${nazevRezimu(rezim)}.png` });
    });
  }
}

// ─── Promítání ──────────────────────────────────────────────────────────────

/** Stav promítání: adresa, pořadí v liště a poloha stránky. */
const stav = (page: Page) =>
  page.evaluate(() => `${location.pathname}${location.hash}|${scrollY}|${document.querySelector('[data-hl-pocet]')?.textContent}`);

/** Stiskne klávesu a počká, až se promítání pohne (posun, nebo nové zastavení). Vrátí false, když se nic nestalo. */
async function stisk(page: Page, klavesa: string): Promise<boolean> {
  const pred = await stav(page);
  await page.keyboard.press(klavesa);
  try {
    await expect.poll(() => stav(page).catch(() => pred), { timeout: 1500 }).not.toBe(pred);
  } catch {
    return false;
  }
  await page.waitForLoadState('load');
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await page.evaluate(() => document.fonts.ready);
  return true;
}

async function zacitPromitani(page: Page) {
  await otevritHodinu(page, PLATNO);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForURL('**/cesta/kdy-mam-dobry-duvod-verit/1/');
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await pripravit(page);
}

const vPoradi = async (page: Page) => bezMezer(await page.locator('[data-hl-pocet]').textContent());
const bezPretoku = async (page: Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);

test('promítání: celá hodina tam a zpět šipkami, PageDown/PageUp a mezerníkem; jen úsek zastavení; pole bloku; Esc', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await zacitPromitani(page);
  // Plátno: bez hlavičky, drobečků, patičky a spodních lišt; jen lišta hodiny.
  for (const sel of ['.cesta-hlavicka', 'footer', '.cesta-lista', 'nav.lista']) await expect(page.locator(sel).first()).toBeHidden();
  // Na plátně bez slova „Hodina“ (v textu zůstává pro čtečky jen skryté).
  await expect(titulek(page)).toHaveText(/Delfy · 1\sze\s4$/);
  await expect(page.locator('.hodina-lista__slovo')).toBeHidden();
  await expect(lista(page).getByRole('button', { name: 'Ukončit promítání' })).toBeVisible();
  await expect(lista(page).getByRole('button', { name: 'Zavřít' })).toBeHidden();
  // Písmo o polovinu větší přes tokeny.
  const pismo = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--meritko')));
  expect(pismo).toBe(1.5);

  const videno: string[] = ['1 ze 4'];
  const klavesy = ['ArrowRight', 'PageDown', 'Space'];
  for (let i = 0; i < 60; i++) {
    // Na konci posledního zastavení se už nic nestane.
    if (!(await stisk(page, klavesy[i % 3]))) break;
    const n = await vPoradi(page);
    if (videno.at(-1) !== n) {
      videno.push(n);
      await bezPretoku(page);
      if (n === '2 ze 4') {
        // Blok: vidět je jen jeho úsek, nadpis kroku ne.
        await expect(page).toHaveURL(/#cesta1-jak-zjistit$/);
        await expect(page.locator('#cesta1-jak-zjistit')).toBeVisible();
        await expect(page.locator('.krok__hlava')).toBeHidden();
        // Šipky a mezerník v poli bloku patří poli: zastavení se nepřeskočí.
        const volba = page.locator('#cesta1-jak-zjistit input[type="radio"]').first();
        await volba.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('#cesta1-jak-zjistit input[type="radio"]').nth(2)).toBeChecked();
        const pole = page.locator('#cesta1-jak-zjistit textarea');
        await pole.focus();
        await page.keyboard.type('Zeptám se jinak');
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('PageDown');
        await expect(pole).toHaveValue('Zeptám se jinak');
        expect(await vPoradi(page)).toBe('2 ze 4');
        await expect(page).toHaveURL(/#cesta1-jak-zjistit$/);
        await page.evaluate(() => (document.activeElement as HTMLElement).blur());
      }
      if (n === '3 ze 4') {
        await expect(page).toHaveURL(/\/osobnost\/sokrates\/#soud$/);
        await expect(page.locator('#soud')).toBeVisible();
        await expect(page.locator('#delfy')).toBeHidden();
        await expect(page.locator('.osobnost__hlavicka')).toBeHidden();
      }
      if (n === '4 ze 4') {
        await expect(page).toHaveURL(/\/otazka\/jak-zit\/#hlas-epikuros$/);
        await expect(page.locator('#hlas-epikuros')).toBeVisible();
        await expect(page.locator('#hlas-diogenes')).toBeHidden();
        await expect(page.locator('.prvni')).toBeHidden();
      }
    }
  }
  expect(videno).toEqual(['1 ze 4', '2 ze 4', '3 ze 4', '4 ze 4']);

  // Zpátky: na předchozí zastavení se přijde na jeho konec.
  const zpet: string[] = ['4 ze 4'];
  const klavesyZpet = ['ArrowLeft', 'PageUp', 'Shift+Space'];
  for (let i = 0; i < 60; i++) {
    if (!(await stisk(page, klavesyZpet[i % 3]))) break;
    const n = await vPoradi(page);
    if (zpet.at(-1) !== n) {
      zpet.push(n);
      if (n === '3 ze 4') {
        const konec = await page.locator('#soud').evaluate((el) => el.getBoundingClientRect().bottom);
        expect(konec).toBeLessThanOrEqual(720);
      }
    }
  }
  expect(zpet).toEqual(['4 ze 4', '3 ze 4', '2 ze 4', '1 ze 4']);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page).toHaveURL(/\/cesta\/kdy-mam-dobry-duvod-verit\/1\/$/);

  // Esc vrátí normální stránku s lištou hodiny.
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
  await expect(page.locator('.cesta-hlavicka')).toBeVisible();
  await expect(lista(page).getByRole('button', { name: 'Zavřít' })).toBeVisible();
  await expect(titulek(page)).toHaveText(/^Hodina: Delfy · 1\sze\s4$/);
  // Po přechodu na další stránku se promítání nevrátí.
  await page.goto('/osobnost/sokrates/#soud');
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
});

test('promítání: tlačítko Ukončit promítání; po obnovení stránky promítání trvá', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await zacitPromitani(page);
  await page.reload();
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await expect(page.locator('.cesta-hlavicka')).toBeHidden();
  await lista(page).getByRole('button', { name: 'Ukončit promítání' }).click();
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
  await expect(page.locator('.cesta-hlavicka')).toBeVisible();
  await expect(lista(page).locator('[data-hl-prehled]')).toBeFocused();
});

for (const [w, h] of [[1280, 720], [1920, 1080]] as const) {
  for (const rezim of rezimy) {
    test(`promítání ${w} × ${h}, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim: čitelné a nic nepřetéká; snímky`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ colorScheme: rezim });
      await zacitPromitani(page);
      const jmena = ['krok', 'blok', 'kapitola', 'hlas'];
      for (let i = 0; i < 4; i++) {
        if (i > 0) {
          for (let j = 0; j < 30 && (await vPoradi(page)) !== `${i + 1} ze 4`; j++) await stisk(page, 'ArrowRight');
        }
        expect(await vPoradi(page)).toBe(`${i + 1} ze 4`);
        await bezPretoku(page);
        // Text zastavení z dálky: aspoň 28 px.
        const velikost = await page.evaluate(() => {
          const p = [...document.querySelectorAll('main p')].find((x) => x.getClientRects().length && (x.textContent ?? '').length > 40);
          return p ? parseFloat(getComputedStyle(p).fontSize) : 0;
        });
        expect(velikost).toBeGreaterThanOrEqual(28);
        await page.screenshot({ path: `${SNIMKY}/promitani-${w}x${h}-${jmena[i]}-${nazevRezimu(rezim)}.png` });
      }
    });
  }
}
