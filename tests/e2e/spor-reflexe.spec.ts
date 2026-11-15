// Spor: nepovinná reflexe po konečné poloze (nejsilnější argument druhé strany a odpověď na něj).
// Průchod bez reflexe, výběr argumentu jen klávesnicí, Jiný argument, Začít znovu, starý uložený stav,
// argument, který autor později změnil, a snímky na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { denikPodleData } from './denik';

// Deník řadí zápisy v kapitolách podle cest; tady se čte výpis podle data (K6 dodatek).
test.beforeEach(({ page }) => denikPodleData(page));

const KROK = '/cesta/kolik-je-dost/4/';
const DILNA = '/dilna/bloky/';
const KYNICI = 'cesta6-kynici-spor';
const PLATON = 'platon-diogenes-skutecnost';

async function pripravSpor(page: Page, id: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island[component-url*="Spor"]').filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

/** Postaví se na první polohu, otevře argumenty a zapíše konečnou polohu (názvy poloh na škále). */
async function projdi(spor: Locator, prvni: string, konecna: string) {
  await spor.getByRole('radio', { name: prvni, exact: true }).check({ force: true });
  await spor.getByRole('button', { name: 'Tady stojím' }).click();
  await spor.locator('.skala').getByRole('radio', { name: new RegExp(`^${konecna}( \\(tady jsi začal\\))?$`) }).check({ force: true });
  await spor.getByRole('button', { name: 'Zapsat konečnou polohu' }).click();
  await expect(spor.getByRole('region', { name: 'Tvůj posun' })).toBeVisible();
}

const reflexe = (spor: Locator) => spor.locator('details.reflexe');
const denik = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
const zapis = async (page: Page, id: string): Promise<string | undefined> =>
  (await denik(page)).zapisy?.find((z: { id: string }) => z.id === id)?.odpoved;

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

async function snimek(page: Page, blok: Locator, nazev: string) {
  await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .cesta-lista, .cesta-hlavicka { visibility: hidden !important; }' });
  const r = await blok.evaluate((e) => {
    const b = e.getBoundingClientRect();
    return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
  });
  await page.screenshot({ path: `test-results/snimky/${nazev}.png`, fullPage: true, clip: r, animations: 'disabled' });
}

test('Spor bez reflexe: zůstává zavřená, Další krok je vidět a zápis ji nemá', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KROK);
  const spor = await pripravSpor(page, KYNICI);
  await projdi(spor, 'spíš kynici', 'spíš kynici');
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  // Zpětná vazba k reflexi jen dovede; otázka zazní jednou, na řádku pod ní.
  await expect(posun).toContainText('Zůstal jsi tam, kde jsi začal. I strana, kterou hájí Epikúros, má argument, který stojí za odpověď.');
  await expect(posun).not.toContainText('?');
  const r = reflexe(spor);
  await expect(r).toHaveJSProperty('open', false);
  await expect(r.locator('summary')).toHaveText(/^Který argument druhé strany byl nejsilnější\?\s*Nepovinné$/);
  await expect(r.getByRole('radio')).toHaveCount(0);
  await expect(r.getByRole('textbox')).toHaveCount(0);
  await expect(page.locator('.cesta-lista [data-dalsi-krok]')).toHaveClass(/blok__tl--hlavni/);
  expect(await zapis(page, KYNICI)).toBe('Na začátku: spíš kynici. Po argumentech: spíš kynici.');
  // Obnovení bez reflexe ji neotevře.
  await page.reload();
  await pripravSpor(page, KYNICI);
  await expect(posun).toBeVisible();
  await expect(r).toHaveJSProperty('open', false);
});

test('Spor: výběr argumentu druhé strany jen klávesnicí (telefon), vydrží obnovení a je v deníku', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KROK);
  const spor = await pripravSpor(page, KYNICI);
  await spor.getByRole('radio').first().focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(spor.getByRole('region', { name: 'Argumenty obou stran' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.type('provázek');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(spor.getByRole('region', { name: 'Tvůj posun' })).toBeFocused();

  // Tab → řádek reflexe, Enter otevře; druhá strana je Epikúros (student stojí u kyniků).
  const r = reflexe(spor);
  await page.keyboard.press('Tab');
  await expect(r.locator('summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(r).toHaveJSProperty('open', true);
  const moznosti = r.getByRole('radio');
  await expect(moznosti).toHaveCount(4);
  await expect(r.locator('.reflexe__strana')).toHaveText(['Epikúros']);
  await expect(moznosti.nth(0)).toHaveAccessibleName(/^Epikúros\s*Slast má strop: když zmizí bolest z\snedostatku, víc už jí nepřibude\. Proto stačí málo\. …$/);
  await expect(moznosti.nth(3)).toHaveAccessibleName('Jiný argument');
  await page.keyboard.press('Tab');
  await expect(moznosti.nth(0)).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await expect(moznosti.nth(1)).toBeChecked();
  await expect(moznosti.nth(1)).toHaveAccessibleName(/Trápení samo nic nedává\./);
  await page.keyboard.press('Tab');
  const odpoved = r.getByRole('textbox', { name: 'Co na něj odpovíš?' });
  await expect(odpoved).toBeFocused();
  // Pole s fokusem nezůstane pod pevnou spodní lištou.
  const pole = await odpoved.boundingBox();
  const lista = await page.locator('.cesta-lista').boundingBox();
  expect(pole!.y + pole!.height).toBeLessThanOrEqual(lista!.y);
  await page.keyboard.type('někdy bolest něco naučí');
  await page.keyboard.press('Tab');
  await expect(r.locator('.reflexe__stav')).toHaveText('Uloženo v deníku.');
  const text = 'Na začátku: spíš kynici. Po argumentech: spíš kynici. Co mě udrželo: provázek. '
    + 'Nejsilnější argument druhé strany (Epikúros): Trápení samo nic nedává. Bolest má cenu snášet, jen když z ní vzejde větší slast. … '
    + 'Moje odpověď: někdy bolest něco naučí.';
  expect(await zapis(page, KYNICI)).toBe(text);
  expect((await denik(page)).zapisy.filter((z: { id: string }) => z.id === KYNICI)).toHaveLength(1);

  await page.reload();
  await pripravSpor(page, KYNICI);
  await expect(r).toHaveJSProperty('open', true);
  await expect(moznosti.nth(1)).toBeChecked();
  await expect(odpoved).toHaveValue('někdy bolest něco naučí');
  await expect(r.locator('.reflexe__stav')).toHaveText('Uloženo v deníku.');
  // Escape reflexi zavře a vrátí fokus na její řádek; Další krok je pořád po ruce.
  await odpoved.focus();
  await page.keyboard.press('Escape');
  await expect(r).toHaveJSProperty('open', false);
  await expect(r.locator('summary')).toBeFocused();
  // Pata rámu aktivity (K4a): Začít znovu vlevo, hlavní čin vpravo.
  await page.keyboard.press('Tab');
  await expect(spor.getByRole('button', { name: 'Začít znovu' })).toBeFocused();
  // Další krok nabízí rozsvícená lišta kroku (K5); blok ho neopakuje.
  await expect(spor.getByRole('link', { name: /Další krok/ })).toHaveCount(0);
  await expect(page.locator('.cesta-lista [data-dalsi-krok]')).toHaveClass(/blok__tl--hlavni/);

  await page.goto('/denik/');
  await expect(page.locator('.kapitoly')).toContainText(text);
});

test('Spor uprostřed: výběr z obou stran, Jiný argument s vlastním textem a Začít znovu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(DILNA);
  const spor = await pripravSpor(page, PLATON);
  await projdi(spor, 'Platón', 'uprostřed');
  const r = reflexe(spor);
  await expect(r.locator('summary')).toHaveText(/^Který argument byl nejsilnější\?\s*Nepovinné$/);
  await r.locator('summary').click();
  await expect(r.locator('.reflexe__strana')).toHaveText(['Platón', 'Diogenés']);
  await expect(r.getByRole('radio')).toHaveCount(5);
  // Uvozovky v úryvku se dočtou do konce.
  await expect(r.getByRole('radio').nth(1)).toHaveAccessibleName(/nemáš\.“$/);
  await expect(r.getByRole('textbox', { name: 'Který?' })).toHaveCount(0);
  await r.getByText('Jiný argument').click();
  await r.getByRole('textbox', { name: 'Který?' }).fill('matematika');
  await r.getByRole('textbox', { name: 'Co na něj odpovíš?' }).fill('čísla nevidím, a platí');
  await r.getByRole('textbox', { name: 'Co na něj odpovíš?' }).blur();
  await expect(r.locator('.reflexe__stav')).toHaveText('Uloženo v deníku.');
  expect(await zapis(page, PLATON)).toBe('Na začátku: Platón. Po argumentech: uprostřed. Nejsilnější argument: matematika. Moje odpověď: čísla nevidím, a platí.');

  await page.reload();
  await pripravSpor(page, PLATON);
  await expect(r).toHaveJSProperty('open', true);
  await expect(r.getByRole('radio', { name: 'Jiný argument' })).toBeChecked();
  await expect(r.getByRole('textbox', { name: 'Který?' })).toHaveValue('matematika');

  // Začít znovu smaže reflexi ze stavu i z deníku; po novém průchodu je zavřená a prázdná.
  await spor.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(spor.getByRole('radio').first()).toBeFocused();
  expect(await zapis(page, PLATON)).toBeUndefined();
  expect((await denik(page)).bloky[PLATON]).toBeUndefined();
  await projdi(spor, 'spíš Diogenés', 'Diogenés');
  await expect(r).toHaveJSProperty('open', false);
  expect(await zapis(page, PLATON)).toBe('Na začátku: spíš Diogenés. Po argumentech: Diogenés.');
  await r.locator('summary').click();
  await expect(r.locator('.reflexe__strana')).toHaveText(['Platón']);
  await expect(r.getByRole('radio')).toHaveCount(3);
  await expect(r.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(r.getByRole('textbox', { name: 'Co na něj odpovíš?' })).toHaveValue('');
});

test('Spor: starý uložený stav bez reflexe funguje dál; změněný argument se nenahradí jiným', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(DILNA);
  const uloz = (stav: unknown, odpoved: string) =>
    page.evaluate(
      ([id, s, o]) =>
        localStorage.setItem(
          'atlas-denik',
          JSON.stringify({
            verze: 1,
            zapisy: [{ id, otazka: 'Co je skutečnější?', odpoved: o, odkaz: '/dilna/bloky/#' + id, kdy: '2026-09-20T10:00:00.000Z', druh: 'spor' }],
            vyzvy: [],
            navstivene: [],
            bloky: { [id as string]: s },
            aktivita: [],
            cesty: {},
          }),
        ),
      [PLATON, stav, odpoved] as const,
    );
  // Stav z doby před reflexí: jen polohy a důvod.
  const stary = 'Na začátku: spíš Platón. Po argumentech: spíš Diogenés. Co mě posunulo: stůl vidím.';
  await uloz({ prvni: 1, konecna: 3, duvod: 'stůl vidím' }, stary);
  await page.reload();
  const spor = await pripravSpor(page, PLATON);
  const posun = spor.getByRole('region', { name: 'Tvůj posun' });
  await expect(posun).toContainText('Začal jsi: spíš Platón. Teď: spíš Diogenés.');
  await expect(posun).toContainText('Přešel jsi na druhou stranu. I strana, kterou hájí Platón, má argument, který stojí za odpověď.');
  await expect(posun).toContainText('Tvůj důvod: stůl vidím');
  const r = reflexe(spor);
  await expect(r).toHaveJSProperty('open', false);
  expect(await zapis(page, PLATON)).toBe(stary);
  await r.locator('summary').click();
  await r.getByText('Stolů je mnoho').click();
  expect(await zapis(page, PLATON)).toMatch(/^Na začátku: spíš Platón\. Po argumentech: spíš Diogenés\. Co mě posunulo: stůl vidím\. Nejsilnější argument druhé strany \(Platón\): Stolů je mnoho, každý je jiný a jednou se rozpadne\. …/);

  // Uložený argument, který blok už nemá (autor ho přepsal): zůstane vidět ten původní a žádný jiný není vybraný.
  await uloz({ prvni: 1, konecna: 3, duvod: '', reflexe: { argument: { strana: 0, text: 'Tohle je argument, který autor později přepsal.' }, odpoved: 'pořád s ním nesouhlasím' } }, stary);
  await page.reload();
  await pripravSpor(page, PLATON);
  await expect(r).toHaveJSProperty('open', true);
  await expect(r.getByRole('radio')).toHaveCount(4);
  await expect(r.getByRole('radio', { checked: true })).toHaveAccessibleName(/^Platón\s*Tohle je argument, který autor později přepsal\.$/);
  await expect(r.getByRole('radio', { checked: true })).toHaveCount(1);
  await expect(r.getByRole('textbox', { name: 'Co na něj odpovíš?' })).toHaveValue('pořád s ním nesouhlasím');
  // Dopsání odpovědi původní argument v deníku zachová.
  await r.getByRole('textbox', { name: 'Co na něj odpovíš?' }).fill('pořád s ním nesouhlasím, a vím proč');
  await r.getByRole('textbox', { name: 'Co na něj odpovíš?' }).blur();
  expect(await zapis(page, PLATON)).toContain('Nejsilnější argument druhé strany (Platón): Tohle je argument, který autor později přepsal. Moje odpověď: pořád s ním nesouhlasím, a vím proč.');
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`Spor s otevřenou reflexí · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      const r = rezim === 'light' ? 'svetly' : 'tmavy';
      // Jedna strana (cesta 6, strana se jmenuje po směru).
      await page.goto(KROK);
      let spor = await pripravSpor(page, KYNICI);
      await projdi(spor, 'spíš Epikúros', 'Epikúros');
      await expect(spor.getByRole('region', { name: 'Tvůj posun' })).toContainText('ke straně, kterou hájí Epikúros. I strana, kterou hájí kynici, má argument');
      await reflexe(spor).locator('summary').click();
      await expect(reflexe(spor).locator('.reflexe__strana')).toHaveText(['Kynici']);
      await reflexe(spor).getByText('Každá potřeba je provázek').click();
      await reflexe(spor).getByRole('textbox', { name: 'Co na něj odpovíš?' }).fill('Přátele taky potřebuju, a nevadí mi to.');
      await reflexe(spor).getByRole('textbox', { name: 'Co na něj odpovíš?' }).blur();
      await expect(reflexe(spor).locator('.reflexe__stav')).toHaveText('Uloženo v deníku.');
      await axe(page, `[id="${KYNICI}"]`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await snimek(page, spor, `spor-reflexe-${sirka}-${r}`);

      // Obě strany (student stojí uprostřed) a Jiný argument.
      await page.goto(DILNA);
      spor = await pripravSpor(page, PLATON);
      await projdi(spor, 'spíš Platón', 'uprostřed');
      await reflexe(spor).locator('summary').click();
      await reflexe(spor).getByText('Jiný argument').click();
      await reflexe(spor).getByRole('textbox', { name: 'Který?' }).fill('Čísla taky nikdo neviděl.');
      await reflexe(spor).getByRole('textbox', { name: 'Který?' }).blur();
      await axe(page, `[id="${PLATON}"]`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await snimek(page, spor, `spor-reflexe-stred-${sirka}-${r}`);
    });
  }
}
