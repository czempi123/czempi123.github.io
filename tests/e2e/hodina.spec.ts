// Skladatel hodiny (/hodina/nova/) a Moje hodiny v deníku: složit hodinu jen klávesnicí, přeřadit, napsat poznámky,
// uložit, obnovit stránku; odkaz pro studenty bez poznámek; nahrát soubor; neznámé zastavení; filtry výběru;
// Moje hodiny (upravit, smazat s potvrzením); vstup v patičce; axe a snímky na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const NENI = 'Tohle místo už v atlasu není';
const ULOZENA = {
  verze: 1,
  id: 'hodina-test',
  nazev: 'Delfy a svoboda',
  poznamka: 'Začít otázkou na věštírnu.',
  zastaveni: [
    { id: 'k:kdy-mam-dobry-duvod-verit/1', poznamka: 'TAJNA-POZNAMKA-1' },
    { id: 'h:jak-poznam-pravdu/protagoras', poznamka: '' },
    { id: 'k:zrusena-cesta/2', poznamka: '' },
    { id: 'o:epiktetos/otrok-v-rime', poznamka: 'Doma.' },
  ],
  zmeneno: '2026-10-17T14:20:00.000Z',
};

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

async function otevritSkladatele(page: Page, hledani = '') {
  await page.goto(`/hodina/nova/${hledani}`);
  await pripravit(page);
  await expect(page.locator('details.skupina').first()).toBeVisible();
}

/** Uloží hodiny do localStorage (jako by je učitel uložil dřív). */
async function ulozHodiny(page: Page, hodiny: unknown[]) {
  await page.goto('/');
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: h })), hodiny);
}

/** Tabulátorem (nebo Shift+Tab) na prvek; selže, když se tam nedostane. */
async function tabNa(page: Page, cil: Locator, zpet = false, nejvic = 80) {
  for (let i = 0; i < nejvic; i++) {
    if (await cil.evaluate((el) => el === document.activeElement).catch(() => false)) return;
    await page.keyboard.press(zpet ? 'Shift+Tab' : 'Tab');
  }
  throw new Error(`Tabulátor se na prvek nedostal: ${cil}`);
}

const zvolene = (page: Page) => page.locator('.zvolena > li .zvolene__nazev');
/** Názvy zastavení v hodině, jak je čte student (bez pořadí, šipky a textu pro čtečky, s obyčejnými mezerami). */
const nazvy = (page: Page) =>
  zvolene(page).evaluateAll((els) => els.map((e) => {
    const k = e.cloneNode(true) as HTMLElement;
    k.querySelectorAll('.vizualne-skryte, .sipka').forEach((x) => x.remove());
    return (k.textContent ?? '').replace(/\u00a0/g, ' ').trim();
  }));
const vyber = (page: Page) => page.getByRole('region', { name: 'Vyber z atlasu' });
const hodinaR = (page: Page) => page.getByRole('region', { name: 'Hodina', exact: true });
const skupina = (page: Page, nazev: string) =>
  page.locator('details.skupina').filter({ has: page.locator('.skupina__nazev', { hasText: new RegExp(`^${nazev}$`) }) });
const ulozeneHodiny = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-hodiny') ?? 'null'));

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

test('složit hodinu jen klávesnicí, přeřadit, poznámky, uložit a obnovit stránku', async ({ page }) => {
  await otevritSkladatele(page);
  const hledat = page.locator('#vyber-hledat');
  await tabNa(page, hledat);
  await page.keyboard.type('odpoved z delf');
  await expect(page.locator('.vysledek')).toContainText('Nalezeno: 2');

  await tabNa(page, page.getByRole('button', { name: 'Přidat do hodiny: Odpověď z Delf' }));
  await page.keyboard.press('Enter');
  const pribeh = page.getByRole('button', { name: 'Přidat do hodiny: Nikdo není moudřejší.' });
  await tabNa(page, pribeh);
  await page.keyboard.press('Space');
  // Tlačítko se přepne na Odebrat a fokus zůstane na něm.
  await expect(vyber(page).getByRole('button', { name: 'Odebrat z hodiny: Nikdo není moudřejší.' })).toBeFocused();
  await expect(page.locator('.pocitadlo')).toContainText('2\u00a0zastavení');

  await tabNa(page, hledat, true);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('sokrates soud');
  await tabNa(page, page.getByRole('button', { name: 'Přidat do hodiny: Soud' }));
  await page.keyboard.press('Enter');
  await expect.poll(() => nazvy(page)).toEqual(['Odpověď z Delf', 'Nikdo není moudřejší.', 'Soud']);

  // Přeřadit: Soud o dvě místa výš; fokus zůstává na tlačítku téhož zastavení, na kraji přejde na Níž.
  await tabNa(page, page.getByRole('button', { name: 'Posunout výš: Soud' }));
  await page.keyboard.press('Enter');
  await expect.poll(() => nazvy(page)).toEqual(['Odpověď z Delf', 'Soud', 'Nikdo není moudřejší.']);
  await expect(page.getByRole('button', { name: 'Posunout výš: Soud' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => nazvy(page)).toEqual(['Soud', 'Odpověď z Delf', 'Nikdo není moudřejší.']);
  await expect(page.getByRole('button', { name: 'Posunout výš: Soud' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Posunout níž: Soud' })).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Soud je teď 1. z 3.' })).toBeVisible();

  // Poznámky: k hodině a k zastavení.
  await tabNa(page, page.locator('#hodina-nazev'), true);
  await page.keyboard.type('Delfy a soud');
  await page.keyboard.press('Tab');
  await expect(page.locator('#hodina-poznamka')).toBeFocused();
  await page.keyboard.type('Nejdřív hlasování, pak čtení.');
  await tabNa(page, page.getByLabel('Poznámka k zastavení 1: Soud'));
  await page.keyboard.type('TAJNA-POZNAMKA-SOUD');
  await expect(page.locator('.stav')).toContainText('neuložené změny');

  await tabNa(page, page.getByRole('button', { name: 'Uložit', exact: true }));
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Hodina je uložená' })).toBeVisible();
  await expect(page).toHaveURL(/\/hodina\/nova\/\?hodina=hodina-[a-z0-9]+-[a-z0-9]{6}$/);
  await expect(page.locator('.stav')).toContainText('uloženo');

  const odkaz = await page.locator('#hodina-odkaz').inputValue();
  expect(odkaz).toMatch(/\/hodina\/\?v=1&n=Delfy%20a%20soud&z=o:sokrates\/soud,k:kdy-mam-dobry-duvod-verit\/1,p:odpoved-z-delf$/);
  expect(odkaz).not.toContain('TAJNA');
  expect(odkaz).not.toContain('hlasov');

  await page.reload();
  await pripravit(page);
  await expect(page.locator('#hodina-nazev')).toHaveValue('Delfy a soud');
  await expect(page.locator('#hodina-poznamka')).toHaveValue('Nejdřív hlasování, pak čtení.');
  await expect.poll(() => nazvy(page)).toEqual(['Soud', 'Odpověď z Delf', 'Nikdo není moudřejší.']);
  await expect(page.getByLabel('Poznámka k zastavení 1: Soud')).toHaveValue('TAJNA-POZNAMKA-SOUD');
  const ulozene = await ulozeneHodiny(page);
  expect(ulozene.hodiny).toHaveLength(1);
  expect(await page.evaluate(() => localStorage.getItem('atlas-denik'))).toBeNull();
});

test('neznámé zastavení: text místo názvu, jde odebrat; náhled otevírá novou kartu', async ({ page }) => {
  await ulozHodiny(page, [ULOZENA]);
  await otevritSkladatele(page, '?hodina=hodina-test');
  await expect.poll(() => nazvy(page)).toEqual(['Odpověď z Delf', 'Prótagorás', NENI, 'Otrok v Římě']);
  await expect(page.locator('.zvolene--chybi')).toContainText('k:zrusena-cesta/2');
  const nahled = page.locator('.zvolena a.zvolene__nazev').first();
  await expect(nahled).toHaveAttribute('target', '_blank');
  await expect(nahled).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/1/');

  // Odkaz nese i id, které v atlasu není (student uvidí, že místo zmizelo), poznámky ne.
  const odkaz = await page.locator('#hodina-odkaz').inputValue();
  expect(odkaz).toContain('k:zrusena-cesta/2');
  expect(odkaz).not.toContain('TAJNA');
  expect(odkaz).not.toContain('Doma');

  await hodinaR(page).getByRole('button', { name: `Odebrat z hodiny: ${NENI}` }).click();
  await expect.poll(() => nazvy(page)).toEqual(['Odpověď z Delf', 'Prótagorás', 'Otrok v Římě']);
  await expect(hodinaR(page).getByRole('button', { name: 'Odebrat z hodiny: Otrok v Římě' })).toBeFocused();
  await page.getByRole('button', { name: 'Uložit', exact: true }).click();
  const ulozene = await ulozeneHodiny(page);
  expect(ulozene.hodiny[0].zastaveni.map((z: { id: string }) => z.id)).not.toContain('k:zrusena-cesta/2');
  expect(ulozene.hodiny[0].zastaveni[0].poznamka).toBe('TAJNA-POZNAMKA-1');
});

test('nahrát soubor: hodina se otevře, neplatný soubor nic nezmění; stáhnout soubor', async ({ page }) => {
  await otevritSkladatele(page);
  const vstup = page.locator('input[type=file]');
  await vstup.setInputFiles({ name: 'cizi.json', mimeType: 'application/json', buffer: Buffer.from('{"nesmysl": true}') });
  await expect(page.getByRole('status').filter({ hasText: 'Tenhle soubor není hodina z atlasu.' })).toBeVisible();
  await expect(zvolene(page)).toHaveCount(0);

  await vstup.setInputFiles({ name: 'hodina.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(ULOZENA)) });
  await expect(page.getByRole('status').filter({ hasText: 'je otevřená ze souboru' })).toBeVisible();
  await expect(page.locator('#hodina-nazev')).toHaveValue('Delfy a svoboda');
  await expect.poll(() => nazvy(page)).toEqual(['Odpověď z Delf', 'Prótagorás', NENI, 'Otrok v Římě']);
  await expect(page.locator('.stav')).toContainText('neuložené změny');

  const stazeni = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Stáhnout soubor' }).click();
  const soubor = await stazeni;
  expect(soubor.suggestedFilename()).toMatch(/^hodina-delfy-a-svoboda-\d{4}-\d{2}-\d{2}\.json$/);
  const obsah = JSON.parse(readFileSync(await soubor.path(), 'utf8'));
  expect(obsah.id).toBe('hodina-test');
  expect(obsah.zastaveni[0].poznamka).toBe('TAJNA-POZNAMKA-1');

  await page.getByRole('button', { name: 'Uložit', exact: true }).click();
  await expect(page).toHaveURL(/\?hodina=hodina-test$/);
  expect((await ulozeneHodiny(page)).hodiny.map((h: { id: string }) => h.id)).toEqual(['hodina-test']);
});

test('hodina, která v prohlížeči není, a filtry výběru', async ({ page }) => {
  await otevritSkladatele(page, '?hodina=hodina-nikde');
  await expect(page.getByRole('status').filter({ hasText: 'Tahle hodina v tomto prohlížeči uložená není.' })).toBeVisible();
  await expect(page.getByText('Zatím tu nic není.')).toBeVisible();

  await page.locator('#vyber-druh').selectOption({ label: 'Hlasy u otázek' });
  const druhy = await page.locator('details.skupina[open] .polozka:not(.polozka--souvislost) > .polozka__radek .polozka__druh').allTextContents();
  expect(new Set(druhy)).toEqual(new Set(['Hlas']));
  // Jedna skupina na každou otázku s hlasy: od T1 větve antika-doplnky jich je osm (přibyly otázky 2 a 8).
  await expect(page.locator('details.skupina')).toHaveCount(8);

  // Druh hlasů, období 2 a hledání: jen hlasy Epikúra, u otázek, kde mluví.
  await page.locator('#vyber-obdobi').selectOption('2');
  await page.locator('#vyber-hledat').fill('epikuros');
  const shody = page.locator('.polozka:not(.polozka--souvislost) > .polozka__radek .polozka__nazev');
  expect((await shody.allTextContents()).length).toBeGreaterThan(0);
  expect(new Set((await shody.allTextContents()).map((t) => t.replace(/otevře se v nové kartě|↗/g, '').trim()))).toEqual(new Set(['Epikúros']));
  await expect(page.locator('h3.oddil')).toHaveText(['Velké otázky']);

  // Bez druhu najde hledání celý profil i s kapitolami (název profilu nese i jeho části).
  await page.locator('#vyber-druh').selectOption('');
  await expect(page.locator('details.skupina[open] .skupina__nazev')).toContainText(['Epikúros']);
  await expect(skupina(page, 'Epikúros').locator('.polozka__druh').filter({ hasText: /^Kapitola/ }).first()).toBeVisible();

  await page.locator('#vyber-hledat').fill('xyzzy');
  await expect(page.getByText('Nic takového v atlasu není.')).toBeVisible();
  await page.getByRole('button', { name: 'Zrušit filtr' }).click();
  await expect(page.locator('#vyber-hledat')).toBeFocused();
  await expect(page.locator('#vyber-druh')).toHaveValue('');
  await expect(page.locator('details.skupina[open]')).toHaveCount(0);
});

test('Moje hodiny v deníku: bez hodin nic, s hodinami upravit, odkaz a smazat s potvrzením', async ({ page }) => {
  await page.goto('/denik/');
  await pripravit(page);
  await expect(page.getByRole('heading', { name: 'Moje hodiny' })).toHaveCount(0);

  await ulozHodiny(page, [ULOZENA, { ...ULOZENA, id: 'hodina-druha', nazev: '', zastaveni: [{ id: 'o:sokrates', poznamka: '' }], zmeneno: '2026-10-16T09:00:00.000Z' }]);
  await page.goto('/denik/');
  await pripravit(page);
  const oddil = page.getByRole('region', { name: 'Moje hodiny' });
  await expect(oddil.locator('.nazev')).toHaveText(['Delfy a svoboda', 'Hodina bez názvu']);
  await expect(oddil).toContainText('4\u00a0zastavení · změněno 17. října 2026');
  await expect(oddil.getByRole('link', { name: 'Upravit hodinu Delfy a svoboda' })).toHaveAttribute('href', '/hodina/nova/?hodina=hodina-test');
  await expect(oddil.getByRole('button', { name: 'Kopírovat odkaz pro studenty: Delfy a svoboda' })).toBeVisible();

  await axe(page);
  await oddil.getByRole('button', { name: 'Smazat hodinu Delfy a svoboda' }).click();
  await expect(oddil.getByRole('button', { name: 'Nechat' })).toBeFocused();
  await axe(page);
  await page.keyboard.press('Enter');
  await expect(oddil.getByRole('button', { name: 'Smazat hodinu Delfy a svoboda' })).toBeFocused();
  await page.keyboard.press('Enter');
  await oddil.getByRole('button', { name: 'Smazat hodinu', exact: true }).click();
  await expect(oddil.getByRole('status')).toContainText('Hodina Delfy a svoboda je smazaná.');
  await expect(oddil.locator('.nazev')).toHaveText(['Hodina bez názvu']);
  await expect(oddil.getByRole('link', { name: 'Upravit hodinu Hodina bez názvu' })).toBeFocused();
  expect((await ulozeneHodiny(page)).hodiny.map((h: { id: string }) => h.id)).toEqual(['hodina-druha']);

  await oddil.getByRole('button', { name: 'Smazat hodinu Hodina bez názvu' }).click();
  await oddil.getByRole('button', { name: 'Smazat hodinu', exact: true }).click();
  await page.reload();
  await pripravit(page);
  await expect(page.getByRole('heading', { name: 'Moje hodiny' })).toHaveCount(0);
});

test('vstup v patičce, hlavní navigace beze změny, stránka mimo hledání', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const vstup = page.locator('footer').getByRole('link', { name: 'Pro učitele: připravit hodinu' });
  await expect(vstup).toHaveAttribute('href', '/hodina/nova/');
  await expect(page.getByRole('navigation', { name: 'Hlavní navigace' }).first().getByRole('link')).toHaveText(['Domů', 'Mapa a čas', 'Otázky', 'Lidé a směry']);
  await vstup.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Připravit hodinu');
  await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
});

for (const sirka of [390, 1440] as const) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`rozvržení, axe a snímek: ${sirka} px, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await ulozHodiny(page, [ULOZENA]);
      await otevritSkladatele(page, '?hodina=hodina-test');
      await skupina(page, 'Epiktétos').locator('summary').click();
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

      const vyber = await page.locator('section.vyber').boundingBox();
      const hodina = await page.locator('section.hodina').boundingBox();
      if (sirka === 1440) {
        // Vedle sebe; počítadlo není potřeba.
        expect(hodina!.x).toBeGreaterThan(vyber!.x + vyber!.width - 1);
        await expect(page.locator('.pocitadlo')).toBeHidden();
      } else {
        // Pod sebou; počet zvolených zastavení drží nahoře i po posunu do výběru.
        expect(hodina!.y).toBeGreaterThan(vyber!.y + vyber!.height - 1);
        await page.locator('details.skupina').nth(10).scrollIntoViewIfNeeded();
        const pocitadlo = page.locator('.pocitadlo');
        await expect(pocitadlo).toContainText('4\u00a0zastavení');
        const r = await pocitadlo.boundingBox();
        expect(r!.y).toBeGreaterThanOrEqual(0);
        expect(r!.y).toBeLessThan(120);
        // Klávesnice: tlačítko nad oknem, na které přijde fokus pozpátku (Shift+Tab), nezajede pod počítadlo.
        const tl = skupina(page, 'Epiktétos').getByRole('button').nth(1);
        await tl.evaluate((el) => {
          const vse = [...document.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, summary')]
            .filter((e) => e.getClientRects().length);
          window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 200, behavior: 'instant' });
          vse[vse.indexOf(el as HTMLElement) + 1].focus({ preventScroll: true });
        });
        await page.keyboard.press('Shift+Tab');
        await expect(tl).toBeFocused();
        const t = await tl.boundingBox();
        const p = await pocitadlo.boundingBox();
        expect(t!.y).toBeGreaterThanOrEqual(p!.y + p!.height - 1);
      }
      await page.screenshot({ path: `test-results/snimky/hodina-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, fullPage: false });
    });
  }
}
