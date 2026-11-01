// Tvoje antika (antika-doplnky, K2): deník na konci období. Po velkých otázkách studentova odpověď (Na začátku × Teď),
// pravidla z cest a myslitelé, kteří to viděli podobně. Jen z toho, co student udělal; nic se nehodnotí.
// Logiku hlídá tests/data/tvoje-obdobi.test.ts; tady skutečná data, obrazovka, klávesnice, čtečka a obnovení stránky.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const T = '2026-10-30T10:00:00.000Z';
const zapis = (id: string, odpoved: string, odkaz = '/') => ({ id, otazka: id, odpoved, odkaz, kdy: T });
const denik = (zapisy: ReturnType<typeof zapis>[] = [], bloky: Record<string, unknown> = {}) =>
  JSON.stringify({ verze: 1, zapisy, vyzvy: [], navstivene: [], bloky, aktivita: [], cesty: {} });

/** Odpovědi z několika cest: otázka 1 (Kolik je dost?, Kam mi mizí čas?), otázka 2 jen první názor, otázka 3 se čtyřmi mysliteli. */
const PLNY = denik(
  [
    zapis('otazka-jak-zit-prvni', 'Hlavně nikomu neublížit.'),
    zapis('cesta6-moje-pravidlo', 'Dost je, když mi nic nechybí a nic mě netáhne.'),
    zapis('cesta34-moje-pravidlo', 'Můj čas je můj, když vím, komu ho dávám.'),
    zapis('otazka-co-je-spravne-prvni', 'Nevracet křivdu.'),
  ],
  {
    'cesta6-kynici-spor': { prvni: 1, konecna: 3, duvod: '' },
    'cesta34-dost-casu': { vyber: 0, proc: '', potvrzeno: true },
    'cesta34-odejit-spor': { prvni: 2, konecna: 2, duvod: '' },
    'cesta8-je-rozumne': { vyber: 2, proc: '', potvrzeno: true },
    'cesta33-pod-padakem': { vyber: 0, proc: '', potvrzeno: true },
  },
);

async function otevri(page: Page, obsah: string | null) {
  await page.goto('/denik/antika/');
  await page.evaluate((t) => (t === null ? localStorage.removeItem('atlas-denik') : localStorage.setItem('atlas-denik', t)), obsah);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="TvojeObdobi"]:not([ssr])', { state: 'attached' });
}

const otazky = (page: Page) => page.locator('section.otazka');

test('prázdný deník: žádná otázka, jen pozvánka do první cesty', async ({ page }) => {
  await otevri(page, null);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tvoje antika');
  await expect(page.getByText(/Zatím tu nic není\./)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Začít cestou Kdy mám dobrý důvod věřit?' })).toHaveAttribute('href', '/cesta/kdy-mam-dobry-duvod-verit/');
  await expect(otazky(page)).toHaveCount(0);
});

test('jediná cesta: jediná otázka, bez Na začátku a bez toho, co student neudělal', async ({ page }) => {
  await otevri(page, denik([zapis('cesta6-moje-pravidlo', 'Dost je, když mi nic nechybí.')]));
  await expect(otazky(page)).toHaveCount(1);
  const o = page.getByRole('region', { name: 'Jak mám žít?' });
  await expect(o.getByRole('heading', { name: 'Tvoje pravidlo z cesty' })).toBeVisible();
  await expect(o).toContainText('Dost je, když mi nic nechybí.');
  await expect(o.getByRole('link', { name: 'Kolik je dost?' })).toHaveAttribute('href', /\/cesta\/kolik-je-dost\/\d+\/#cesta6-moje-pravidlo$/);
  await expect(o.getByText('Na začátku')).toHaveCount(0);
  await expect(o.getByRole('heading', { name: 'Kdo to viděl podobně jako ty' })).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/%|chybí ti|skóre|bod[ůy]\b/);
});

test('plný deník: otázky podle čísla, odpověď, pravidla a myslitelé s důvodem a odkazem na cestu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await otevri(page, PLNY);
  await expect(otazky(page).locator('h2')).toHaveText(['Jak mám žít?', 'Co je správné a co dlužím druhým?', 'Má život smysl?']);

  const o1 = page.getByRole('region', { name: 'Jak mám žít?' });
  await expect(o1.getByRole('heading', { name: 'Na začátku' })).toBeVisible();
  await expect(o1).toContainText('Hlavně nikomu neublížit.');
  await expect(o1.getByLabel('Jak odpovíš teď?')).toHaveValue('');
  await expect(o1.locator('.pravidla > li')).toHaveCount(2);
  const blizci = o1.locator('.blizci > li');
  await expect(blizci.locator('.jmeno')).toHaveText(['Epikúros', 'Marcus Aurelius', 'Seneca']);
  // Důvod z cesty a studentova odpověď, která k mysliteli vedla.
  const marcus = blizci.filter({ hasText: 'Marcus Aurelius' });
  await expect(marcus.locator('.duvod')).toContainText('I on si zapsal, že číst nemůže.');
  await expect(marcus.locator('.stopy')).toContainText('Kam mi mizí čas? · tvoje odpověď Nemám. Mám moc povinností.');
  await expect(marcus.getByRole('link', { name: 'Kam mi mizí čas?' })).toHaveAttribute('href', '/cesta/kam-mi-mizi-cas/1/#cesta34-dost-casu');
  await expect(blizci.filter({ hasText: 'Epikúros' }).locator('.stopy')).toContainText('Vědět, co mi stačí.');
  await expect(blizci.filter({ hasText: 'Seneca' }).locator('.stopy')).toContainText('Uprostřed sporu');

  // Otázka 2: jen první názor, bez cest a myslitelů.
  const o2 = page.getByRole('region', { name: 'Co je správné a co dlužím druhým?' });
  await expect(o2).toContainText('Nevracet křivdu.');
  await expect(o2.locator('.blizci')).toHaveCount(0);

  // Otázka 3: čtyři myslitelé, tři hned, čtvrtý pod „A další filozofové“.
  const o3 = page.getByRole('region', { name: 'Má život smysl?' });
  await expect(o3.locator(':scope > .blizci > li .jmeno')).toHaveText(['Epikúros', 'Lucretius', 'Sókratés']);
  await expect(o3.locator('details.dalsi')).not.toHaveAttribute('open', '');
  await o3.getByText('A další filozofové').click();
  await expect(o3.locator('details.dalsi .jmeno')).toHaveText(['Seneca']);
  // Odkaz na stránku osoby; Lucretius stránku nemá a jeho jméno odkazem není.
  await expect(o3.getByRole('link', { name: 'Epikúros', exact: true })).toHaveAttribute('href', /^\/osobnost\/epikuros\/$/);
  await expect(o3.getByRole('link', { name: 'Lucretius', exact: true })).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/%|chybí ti|skóre/);
});

test('Teď jde přepsat, uloží se do deníku jako stanovisko a vydrží obnovení; formát deníku se nemění', async ({ page }) => {
  await otevri(page, PLNY);
  const klice = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('atlas-denik')!)).sort());
  const pole = page.getByRole('region', { name: 'Jak mám žít?' }).getByLabel('Jak odpovíš teď?');
  await pole.fill('Mít čas na přátele.');
  await pole.blur();
  await expect(page.getByRole('region', { name: 'Jak mám žít?' }).getByText('Uloženo v deníku.')).toBeVisible();
  const d = await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik')!));
  expect(d.verze).toBe(1);
  expect(Object.keys(d).sort()).toEqual(klice);
  expect(d.zapisy.find((z: { id: string }) => z.id === 'otazka-jak-zit-ted')).toMatchObject({
    odpoved: 'Mít čas na přátele.', otazka: 'Jak mám žít? Po setkání s filozofy', odkaz: '/otazka/jak-zit/#zmenil-se', druh: 'stanovisko',
  });
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="TvojeObdobi"]:not([ssr])', { state: 'attached' });
  await expect(page.getByRole('region', { name: 'Jak mám žít?' }).getByLabel('Jak odpovíš teď?')).toHaveValue('Mít čas na přátele.');
  // Totéž vidí Změnil se? na stránce otázky.
  await page.goto('/otazka/jak-zit/');
  await page.locator('#zmenil-se').scrollIntoViewIfNeeded();
  await expect(page.locator('#zmenil-se')).toContainText('Mít čas na přátele.');
});

test('klávesnice: odkazy, pole Teď a A další jdou tabulátorem a Enterem', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await otevri(page, PLNY);
  const o3 = page.getByRole('region', { name: 'Má život smysl?' });
  const shrnuti = o3.locator('summary');
  // Tabulátorem od nadpisu otázky 3 až k „A další“.
  await o3.getByRole('link', { name: 'Má život smysl?' }).focus();
  let dosel = false;
  for (let i = 0; i < 30 && !dosel; i++) {
    await page.keyboard.press('Tab');
    dosel = await shrnuti.evaluate((e) => e === document.activeElement);
  }
  expect(dosel).toBe(true);
  await page.keyboard.press('Enter');
  await expect(o3.locator('details.dalsi')).toHaveAttribute('open', '');
  // Pole Teď u otázky 1 je dosažitelné tabulátorem z nadpisu otázky.
  const o1 = page.getByRole('region', { name: 'Jak mám žít?' });
  await o1.getByRole('link', { name: 'Jak mám žít?' }).focus();
  await page.keyboard.press('Tab');
  await expect(o1.getByLabel('Jak odpovíš teď?')).toBeFocused();
});

for (const sirka of [390, 1440]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`axe a nic nepřetéká: ${sirka} px, ${rezim}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: 900 });
      await page.emulateMedia({ colorScheme: rezim });
      await otevri(page, PLNY);
      await page.getByRole('region', { name: 'Má život smysl?' }).getByText('A další filozofové').click();
      const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(v.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      const sire = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sire).toBeLessThanOrEqual(sirka);
    });
  }
}

test('vstup z deníku a ze stránky období 2', async ({ page }) => {
  await page.goto('/denik/');
  await page.evaluate((t) => localStorage.setItem('atlas-denik', t), PLNY);
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await expect(page.getByRole('link', { name: /Tvoje antika/ })).toHaveAttribute('href', '/denik/antika/');
  // Prázdný deník odkaz nemá: není k čemu vést.
  await page.evaluate(() => localStorage.removeItem('atlas-denik'));
  await page.reload();
  await page.waitForSelector('astro-island[component-url*="Denik"]:not([ssr])', { state: 'attached' });
  await expect(page.getByRole('link', { name: /Tvoje antika/ })).toHaveCount(0);

  await page.goto('/obdobi/helenismus-a-rim/');
  await expect(page.locator('.kamdal').getByRole('link', { name: /Tvoje antika/ })).toHaveAttribute('href', '/denik/antika/');
  await page.goto('/obdobi/pocatky-a-klasicke-recko/');
  await expect(page.locator('.kamdal').getByRole('link', { name: /Tvoje antika/ })).toHaveCount(0);
});
