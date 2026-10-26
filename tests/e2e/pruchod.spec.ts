// Hlavní průchod všemi hotovými cestami, od prvního kroku po Dokončit cestu, bez jediného nepovinného pole:
// žádné „Proč“, žádná reflexe ve Sporu, žádné „Co se změnilo“. Hlídá, že nové dobrovolné části průchod
// nezdržují: další krok je po každém bloku hned po ruce, reflexe zůstává zavřená a deník po cestě nic nenabízí.
import { test, expect, type Page, type Locator } from '@playwright/test';

const CESTY = [
  { slug: 'kdy-mam-dobry-duvod-verit', kroku: 7, pravidlo: 'cesta1-moje-pravidlo', spor: 'cesta1-meritko-spor', zacatek: 'Krok 2 · Jak bys to zjišťoval ty?' },
  { slug: 'kolik-je-dost', kroku: 7, pravidlo: 'cesta6-moje-pravidlo', spor: 'cesta6-kynici-spor', zacatek: 'Krok 2 · Nutné, přirozené, prázdné' },
  { slug: 'co-mam-ve-svych-rukou', kroku: 8, pravidlo: 'cesta5-moje-pravidlo', spor: 'cesta5-aristoteles-spor', zacatek: 'Krok 2 · Tři koše' },
  { slug: 'je-to-co-vidim-cela-skutecnost', kroku: 8, pravidlo: 'cesta3-moje-pravidlo', spor: 'cesta3-aristoteles-spor', zacatek: 'Krok 2 · Odkud to vím?' },
  { slug: 'staci-vedet-co-je-spravne', kroku: 8, pravidlo: 'cesta4-moje-pravidlo', spor: 'cesta4-vedel-to', zacatek: 'Krok 2 · Co ti tehdy chybělo?' },
  { slug: 'proc-se-bat-smrti', kroku: 9, pravidlo: 'cesta8-moje-pravidlo', spor: 'cesta8-epikuros-plutarchos', zacatek: 'Krok 1 · Dopis' },
  { slug: 'jsem-porad-tentyz-kdyz-se-menim', kroku: 8, pravidlo: 'cesta2-moje-pravidlo', spor: 'cesta2-seneca-plutarchos', zacatek: 'Krok 1 · Loď' },
];

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}

/** Udělá v bloku jen to, co je k němu potřeba; nepovinná pole nechá být. Vrací druh bloku. */
async function odpovez(blok: Locator): Promise<string> {
  const tlacitko = (nazev: string | RegExp) => blok.getByRole('button', { name: nazev });
  if (await tlacitko('Tohle je můj tah').count()) {
    await blok.locator('.karta').nth(1).click();
    await tlacitko('Tohle je můj tah').click();
    return 'volba';
  }
  if (await tlacitko('Mám roztříděno').count()) {
    const sem = blok.getByRole('button', { name: /^Dát sem kartu/ });
    for (let i = 0; (await sem.count()) > 0 && i < 20; i++) await sem.nth(i % 3).click({ force: true });
    await tlacitko('Mám roztříděno').click();
    return 'roztrid';
  }
  if (await tlacitko('Tady stojím').count()) {
    await blok.getByRole('radio').nth(1).check({ force: true });
    await tlacitko('Tady stojím').click();
    await blok.locator('.skala').getByRole('radio').nth(3).check({ force: true });
    await tlacitko('Zapsat konečnou polohu').click();
    // Reflexe je po ruce, ale zavřená, a další krok je vidět bez ní.
    await expect(blok.locator('details.reflexe')).toHaveJSProperty('open', false);
    return 'spor';
  }
  if (await tlacitko('Rozhodnuto').count()) {
    await blok.getByRole('radio').first().check({ force: true });
    await tlacitko('Rozhodnuto').click();
    await blok.locator('.cip').first().click();
    await blok.locator('.zmenena').getByRole('radio').nth(1).check({ force: true });
    await blok.locator('.zmenena .blok__tl--hlavni').click();
    return 'zmena';
  }
  // Odkryj: vlastní pokus a porovnání.
  await blok.getByRole('textbox').first().fill('Zkouším to po svém.');
  await blok.locator('.blok__tl--hlavni').first().click();
  return 'odkryj';
}

for (const c of CESTY) {
  test(`celý průchod bez nepovinných polí · ${c.slug}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const chyby: string[] = [];
    page.on('pageerror', (e) => chyby.push(e.message));
    const druhy: string[] = [];

    await page.goto(`/cesta/${c.slug}/`);
    await page.getByRole('link', { name: 'Začít cestu' }).click();
    for (let n = 1; n < c.kroku; n++) {
      await expect(page).toHaveURL(`/cesta/${c.slug}/${n}/`);
      await pripravit(page);
      const bloky = page.locator('.krok__obsah section.blok');
      const pocet = await bloky.count();
      if (pocet) {
        // Krok se dvěma bloky (odhad a čtení pokusu v cestě 3): první blok vede k textu pod sebou, další krok nabízí až poslední.
        for (let i = 0; i < pocet - 1; i++) {
          druhy.push(await odpovez(bloky.nth(i)));
          const niz = bloky.nth(i).getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
          await expect(niz).toHaveAttribute('href', /^#/);
          await expect(niz).not.toHaveText(/Další krok/);
        }
        const blok = bloky.nth(pocet - 1);
        druhy.push(await odpovez(blok));
        const odkaz = blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link');
        if ((await odkaz.getAttribute('href'))?.startsWith('#')) {
          // Pod blokem je ještě text s kresbou (šaty v cestě 1): blok vede k němu, dál vede lišta.
          await expect(odkaz).not.toHaveText(/Další krok/);
          await odkaz.click();
          await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
        } else {
          // Po posledním bloku je další krok hned vidět a jedním klepnutím dosažitelný.
          const dal = blok.getByRole('navigation', { name: 'Kam dál' }).getByRole('link', { name: /^Další krok/ });
          await expect(dal).toBeVisible();
          await dal.click();
        }
      } else {
        druhy.push('pribeh');
        await page.locator('.cesta-lista').getByRole('link', { name: /Další krok/ }).click();
      }
    }

    // Poslední krok: počáteční odpověď vedle pravidla; nepovinná otázka zůstane prázdná.
    await expect(page).toHaveURL(`/cesta/${c.slug}/${c.kroku}/`);
    await pripravit(page);
    const panel = page.getByRole('region', { name: 'Na začátku a teď' });
    await expect(panel.locator('.zacatek')).toContainText(c.zacatek);
    await expect(panel.locator('.zacatek .cast').first()).not.toBeEmpty();
    await panel.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).fill('Moje pravidlo po cestě.');
    await expect(panel.getByRole('textbox', { name: /Co se změnilo/ })).toBeVisible();
    await page.getByRole('link', { name: 'Dokončit cestu' }).click();
    await expect(page).toHaveURL(`/cesta/${c.slug}/#hotovo`);
    await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');

    // Každá cesta má vlastní pokus, Spor i nový případ; průchod žádný blok nevynechal.
    expect(druhy).toContain('spor');
    expect(druhy.filter((d) => d !== 'pribeh').length).toBeGreaterThanOrEqual(c.kroku - 3);
    expect(chyby).toEqual([]);

    const d = await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
    const zapis = (id: string) => d.zapisy.find((z: { id: string }) => z.id === id);
    expect(zapis(c.pravidlo).odpoved).toBe('Moje pravidlo po cestě.');
    // Nic nepovinného se nezapsalo: Spor má jen polohy, otázka o změně a návrat v deníku nejsou.
    expect(zapis(c.spor).odpoved).toMatch(/^Na začátku: [^.]+\. Po argumentech: [^.]+\.$/);
    expect(d.bloky[c.spor].reflexe).toBeNull();
    expect(d.zapisy.some((z: { id: string }) => /-zmena$|-navrat$/.test(z.id))).toBe(false);
    expect(d.zapisy.every((z: { odpoved: string }) => !/Proč:|Co mě (posunulo|udrželo)/.test(z.odpoved))).toBe(true);
    expect(Date.now() - Date.parse(d.cesty[c.slug].dokonceno)).toBeLessThan(120_000);

    // Deník hned po cestě nic nenabízí; zápisy z cesty v něm jsou.
    await page.goto('/denik/');
    await expect(page.locator('.seznam--zapisy')).toContainText('Moje pravidlo po cestě.');
    await expect(page.getByRole('region', { name: 'Návrat', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Zkusit' })).toHaveCount(0);
  });
}
