// Společný profil Kratéta a Hipparchie (celek 8, P7): hlavička dvojice (dvě jména, dva řádky dat, jeden obraz,
// dva atributy), na telefonu deska, oba atributy a začátek prvního odstavce na první obrazovce; jedna Doba a lidé
// pro obě osoby; bloky kapitol; a odkazy na stránku z Lidí a směrů, z Mapy a času a z přehledu cesty
// (adresaOsoby: Hipparchia vede na společný profil, ne na /osobnost/hipparchia/).
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PROFIL = '/osobnost/krates-a-hipparchia/';

async function pripravBlok(page: Page, id: string, ostrov: string): Promise<Locator> {
  await page.evaluate(() => document.fonts.ready);
  const blok = page.locator(`[id="${id}"]`);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator(`astro-island[component-url*="${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

async function axe(page: Page, vyber: string) {
  const v = await new AxeBuilder({ page }).include(vyber).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

const cisty = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const skupina = (page: Page, nazev: string) => page.locator('.doba__vztahy > div').filter({ has: page.getByRole('heading', { name: nazev, exact: true }) });

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`hlavička dvojice · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(PROFIL);
      await page.evaluate(() => document.fonts.ready);
      const hlavicka = page.locator('.osobnost__hlavicka');
      await expect(page.locator('h1')).toHaveText(/^Kratés a Hipparchia\.\s*Dva lidé, jedna mošna\.$/);
      await expect(page).toHaveTitle(/Kratés a Hipparchia/);

      const radky = hlavicka.locator('.data--dvojice li');
      await expect(radky).toHaveCount(2);
      expect(cisty(await radky.nth(0).textContent())).toBe('Kratés · asi 365–285 př. n. l. · Théby · období 2');
      expect(cisty(await radky.nth(1).textContent())).toMatch(/^Hipparchia · činnost asi 330–300 př\. n\. l\. · Maróneia$/);
      await expect(hlavicka.locator('a', { hasText: 'období 2' })).toHaveCount(1);

      // Jeden obraz s oběma a pod ním atribut každé osoby s mincí, pak popisek: čí představa a z kdy.
      await expect(hlavicka.locator('.deska__plocha img')).toHaveCount(1);
      const atributy = hlavicka.locator('.proc');
      await expect(atributy).toHaveCount(2);
      await expect(atributy.nth(0)).toContainText('Proč mošna?');
      await expect(atributy.nth(1)).toContainText('Proč člunek?');
      await expect(atributy.nth(1)).toContainText('Hipparchia si vybrala filozofii.');
      await expect(atributy.nth(1)).not.toContainText('dala vzdělání');
      // Atribut každé osoby ve vtlačeném kolečku (design-v2, K3; dřív mince).
      await expect(atributy.locator('.vlys')).toHaveCount(2);
      await expect(hlavicka.locator('.obraz-popisek')).toContainText('nizozemský rytec');

      // Telefon: deska, oba atributy a začátek prvního odstavce nad spodní lištou.
      const okraj = await page.evaluate(() => {
        const lista = document.querySelector('nav.lista');
        const dole = lista && getComputedStyle(lista).display !== 'none' ? lista.getBoundingClientRect().top : innerHeight;
        const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        return { dole, deska: r('.osobnost__deska .deska__plocha').bottom, atribut: [...document.querySelectorAll('.osobnost__hlavicka .proc')].at(-1)!.getBoundingClientRect().bottom, odstavec: r('.uvod p').top };
      });
      expect(okraj.deska).toBeLessThanOrEqual(okraj.dole);
      expect(okraj.atribut).toBeLessThanOrEqual(okraj.dole);
      expect(okraj.odstavec + 30).toBeLessThanOrEqual(okraj.dole);

      const presah = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(presah).toBeLessThanOrEqual(0);
      await axe(page, '.osobnost__hlavicka');
      await page.screenshot({ path: `test-results/snimky/krates-hipparchia-hlavicka-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png` });
    });
  }
}

test('Doba a lidé: jedna pro obě osoby, vztah mezi nimi se nevypíše', async ({ page }) => {
  await page.goto(PROFIL);
  const doba = page.locator('.doba');
  await expect(doba.getByRole('heading', { level: 2 })).toHaveText('S kým Kratés a Hipparchia žili');
  await expect(doba.getByRole('heading', { name: 'Kde žili', exact: true })).toBeVisible();
  await expect(skupina(page, 'Učitelé')).toContainText('Diogenés');
  await expect(skupina(page, 'Učitelé')).toContainText('učitel Kratéta');
  await expect(skupina(page, 'Žáci')).toContainText('Zénón z Kitia');
  await expect(skupina(page, 'Žáci')).toContainText('žák Kratéta');
  await expect(doba.locator('.doba__vztahy .lide__jmeno', { hasText: 'Hipparchia' })).toHaveCount(0);
  await expect(doba.locator('.doba__vztahy .lide__jmeno', { hasText: 'Kratés' })).toHaveCount(0);
  // Mini osa: zvýrazněné pásy obou; mini mapa: rodiště obou s tím, čí jsou.
  await expect(doba.locator('.osa__radek--ja')).toHaveCount(2);
  await expect(doba.locator('.osa figcaption')).toContainText('Zvýrazněné pásy: Kratés');
  const mapa = doba.locator('.minimapa svg');
  await expect(mapa).toHaveAttribute('aria-label', /Théby \(narození Kratéta\)/);
  await expect(mapa).toHaveAttribute('aria-label', /Maróneia \(narození Hipparchie\)/);
  // Kdo navazoval: Diogenův žák učil Zénóna, ten Kleantha.
  await expect(doba.locator('.navazovali')).toContainText('Kratés→Zénón z Kitia');
  // Obsah stránky zná tři myšlenky a šest kapitol.
  await expect(page.locator('[data-oddil="Tři velké myšlenky"]')).toHaveCount(1);
  await expect(page.locator('.kapitola')).toHaveCount(6);
});

test('Doba a lidé u Diogena: Kratés s novými roky mezi žáky', async ({ page }) => {
  await page.goto('/osobnost/diogenes/');
  const zaci = skupina(page, 'Žáci');
  await expect(zaci).toContainText('Kratés');
  await expect(zaci).toContainText('asi 365–285 př. n. l.');
  await expect(page.locator('.doba').getByRole('heading', { level: 2 })).toHaveText('S kým Diogenés žil');
});

test('bloky kapitol: Otvírač dveří a Kde je chyba?', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PROFIL);
  const dvere = await pripravBlok(page, 'krates-otvirac-dveri', 'Volba');
  await dvere.getByText('Odejdu. Do cizí hádky se nepletu.').click();
  await dvere.getByRole('button', { name: 'Tohle je můj tah' }).click();
  const zpetna = dvere.getByRole('region', { name: 'Zpětná vazba' });
  await expect(zpetna).toContainText('Je mlčení v takové chvíli ohleduplnost, nebo pohodlí?');
  await expect(dvere.getByRole('heading', { name: /Co udělal/ })).toHaveCount(0);
  await axe(page, '[id="krates-otvirac-dveri"]');

  const chyba = await pripravBlok(page, 'hipparchia-kde-je-chyba', 'Odkryj');
  await chyba.locator('textarea').fill('Theodóros bije sebe, Hipparchia by bila jeho.');
  await chyba.getByRole('button', { name: 'Ukázat, kde je chyba' }).click();
  await expect(chyba.getByRole('region', { name: 'Srovnání' })).toContainText('platí jen pro tentýž čin');
  await axe(page, '[id="hipparchia-kde-je-chyba"]');
});

test('odkazy na společný profil: Lidé a směry, Mapa a čas, přehled cesty', async ({ page }) => {
  await page.goto('/lide/');
  for (const id of ['krates', 'hipparchia']) {
    await expect(page.locator(`li[id="${id}"] > a`)).toHaveAttribute('href', PROFIL);
  }
  // Profily období 2 jsou karty s odkazem; Hipparchia nevede na vlastní id.
  await expect(page.locator('a[href="/osobnost/hipparchia/"]')).toHaveCount(0);

  await page.goto('/mapa/?rok=-320&osoba=hipparchia');
  await expect(page.getByRole('link', { name: 'Otevřít stránku' })).toHaveAttribute('href', PROFIL);
  // Z Diogenovy a Zénónovy karty: vztah ke Kratétovi otevře jeho kartu a ta vede na společný profil.
  for (const [odkud, rok] of [['diogenes', -330], ['zenon-z-kitia', -300]] as const) {
    await page.goto(`/mapa/?rok=${rok}&osoba=${odkud}`);
    await page.locator('.vztahy').getByRole('button', { name: 'Kratés', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Otevřít stránku' })).toHaveAttribute('href', PROFIL);
  }

  // Přehled cesty skládá adresy stejnou funkcí (cesta 7 s Kratétem a Hipparchií přibude v P8).
  await page.goto('/cesta/kolik-je-dost/');
  await expect(page.locator('.kam-dal').getByRole('link', { name: 'Diogenés: celý příběh' })).toHaveAttribute('href', '/osobnost/diogenes/');
  await expect(page.locator('a[href^="/osobnost/"]:not([href$="/"])')).toHaveCount(0);
});
