// Mapa a čas jako výstřižek staré mapy (design-v2, K7a): první návštěva s výpravou a „Víc“, lístečky lidí bez
// překryvů na obou šířkách, razítko u potkaných, co tu bylo dřív, panel bez vybraného člověka, současníci v řece
// a klávesnice na lístečcích. Starší chování (adresa, posuvník, karta, Život na mapě) hlídají mapa.spec.ts
// a zivot-na-mape.spec.ts.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIC = () => { try { localStorage.setItem('atlas-mapa-vic', '1'); } catch {} };

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await page.waitForSelector('.mapa svg.podklad .pevnina', { state: 'attached' });
  // Šířky lístečků se přeměří po načtení písma: počkat, až se rozmístění ustálí.
  await page.waitForTimeout(400);
}

type Box = { x: number; y: number; w: number; h: number; co: string };
/** Obdélníky zavřených lístečků a lístečků lidí mimo výřez (natočení je v nich započítané). */
async function listecky(page: Page): Promise<Box[]> {
  return page.locator('.vrstva').evaluate((v) =>
    [...v.querySelectorAll('.listek:not(.listek--otevren), .okraj')].map((e) => {
      const b = e.getBoundingClientRect();
      return { x: b.left, y: b.top, w: b.width, h: b.height, co: (e.getAttribute('data-listek') ?? e.textContent ?? '').trim() };
    }),
  );
}
const prekryv = (a: Box, b: Box) => a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;

test('první návštěva: jen mapa, rok a jedna výprava; Víc ukáže řeku a zůstane zapamatované', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/');
  await pripravit(page);
  await expect(page.locator('.mac__reka')).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Ukázat i ty, na které někdo navazuje' })).toHaveCount(0);
  const vyprava = page.locator('.vyprava');
  await expect(vyprava.getByRole('heading')).toHaveText('Kde byl Sókratés roku 424 př. n. l.?');
  // Výprava: posunout rok, otevřít lísteček a vybrat Sókrata.
  await page.goto('/mapa/?rok=-424');
  await pripravit(page);
  await page.locator('[data-listek="delion"] .listek__hlava').click();
  await page.getByRole('list', { name: 'Lidé v místě Délion' }).getByRole('button', { name: /^Sókratés/ }).click();
  await expect(vyprava.locator('.vyprava__sedi')).toContainText('Sedí');
  await expect(vyprava.locator('.vyprava__sedi')).toContainText('U Délia byl Sókratés na vojenském tažení');
  await expect(page.locator('#karta-jmeno')).toHaveText('Sókratés');
  const axe = await new AxeBuilder({ page }).include('.mac').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  // Víc: řeka a přepínač navazujících; po obnovení stránky zůstane mapa celá.
  await page.getByRole('button', { name: /^Víc/ }).click();
  await expect(page.locator('.mac__reka')).toBeVisible();
  // Splněná výprava zůstane nad kartou svého člověka i s Víc (herna-v1, K4); tlačítko Víc už v ní není.
  await expect(vyprava.locator('.vyprava__sedi')).toContainText('Sedí');
  await expect(vyprava.getByRole('button', { name: /^Víc/ })).toHaveCount(0);
  await page.goto('/mapa/?rok=-424');
  await pripravit(page);
  await expect(page.locator('.mac__reka')).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-mapa-prvni', '');
});

test('první návštěva se pozná už před vykreslením (bez uskočení) a odkaz s člověkem otevře mapu celou', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Bez skriptů ostrova: příznak nastaví skript na stránce sám a řeka je schovaná už v sestavené stránce.
  await page.route('**/_astro/*.js', (r) => r.abort());
  await page.goto('/mapa/');
  await expect(page.locator('html')).toHaveAttribute('data-mapa-prvni', '');
  await expect(page.locator('.mac__reka')).toBeHidden();
  await page.unroute('**/_astro/*.js');
  await page.goto('/mapa/?rok=-360&osoba=platon');
  await pripravit(page);
  await expect(page.locator('html')).not.toHaveAttribute('data-mapa-prvni', '');
  await expect(page.locator('.mac__reka')).toBeVisible();
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  test(`lístečky lidí se na ${sirka} px nepřekrývají (roky 424, 360, 323 př. n. l. a 121 n. l.)`, async ({ page }) => {
    await page.addInitScript(VIC);
    await page.setViewportSize({ width: sirka, height: vyska });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const rok of [-424, -360, -323, 121]) {
      for (const reka of sirka < 900 ? [false, true] : [false]) {
        await page.goto(`/mapa/?rok=${rok}`);
        await pripravit(page);
        if (reka) {
          await page.getByRole('tab', { name: 'Řeka životů' }).click();
          await page.waitForTimeout(300);
        }
        const boxy = await listecky(page);
        expect(boxy.length, `rok ${rok}`).toBeGreaterThan(0);
        const mapa = (await page.locator('.mapa').boundingBox())!;
        for (let i = 0; i < boxy.length; i++) {
          for (let j = i + 1; j < boxy.length; j++) expect(prekryv(boxy[i], boxy[j]), `rok ${rok}${reka ? ' (řeka)' : ''}: ${boxy[i].co} × ${boxy[j].co}`).toBe(false);
          // Lísteček zůstane uvnitř výstřižku.
          expect(boxy[i].x, boxy[i].co).toBeGreaterThanOrEqual(mapa.x - 1);
          expect(boxy[i].x + boxy[i].w, boxy[i].co).toBeLessThanOrEqual(mapa.x + mapa.width + 1);
        }
        // Dotykové cíle na telefonu: hlava lístečku aspoň 44 px.
        if (sirka < 900) {
          const vysky = await page.locator('.listek__hlava').evaluateAll((h) => h.map((e) => e.getBoundingClientRect().height));
          for (const v of vysky) expect(v).toBeGreaterThanOrEqual(43.5);
        }
      }
    }
  });
}

test('razítko u lidí, které student potkal; co tu bylo dřív; panel bez vybraného člověka', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('atlas-mapa-vic', '1');
    localStorage.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [{ odkaz: '/osobnost/sokrates/', nazev: 'Sókratés', kdy: '2026-11-01T10:00:00Z' }], bloky: {}, aktivita: [], cesty: {} }));
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-424');
  await pripravit(page);
  // Panel bez vybraného člověka: co se ten rok dělo a všichni žijící; počet sedí s větou u posuvníku.
  const panel = page.locator('.karta--prazdna');
  await expect(panel.getByRole('heading', { name: 'Co se ten rok dělo' })).toBeVisible();
  const veta = (await page.locator('.mac__posuvnik .zije').textContent())!;
  const n = Number(veta.match(/\d+/)![0]);
  await expect(panel.locator('.zijici li')).toHaveCount(n);
  await expect(panel.locator('.zijici li', { hasText: 'Sókratés' }).locator('.razitko-cloveka')).toHaveCount(1);
  await expect(panel.locator('.zijici li', { hasText: 'Alkibiadés' }).locator('.razitko-cloveka')).toHaveCount(0);
  // Na lístečku má potkaný razítko a čtečka to slyší.
  await page.locator('[data-listek="delion"] .listek__hlava').click();
  const sokrates = page.getByRole('list', { name: 'Lidé v místě Délion' }).getByRole('button', { name: /^Sókratés/ });
  await expect(sokrates).toHaveAccessibleName(/razítko ve sbírce$/);
  await expect(sokrates.locator('.razitko-cloveka')).toHaveCount(1);

  // Co tu bylo: roku 395 př. n. l. v Athénách už Sókratés není, lísteček ho ukáže pod „Tady dřív“ mezi prvními.
  await page.goto('/mapa/?rok=-395');
  await pripravit(page);
  await page.locator('[data-listek="athenes"] .listek__hlava').click();
  const drive = page.locator('[data-listek="athenes"] .listek__drive');
  await expect(drive).toContainText('Tady dřív');
  await drive.getByRole('button', { name: 'Sókratés' }).click();
  await expect(page.locator('#karta-jmeno')).toHaveText('Sókratés');
  await expect(page.getByRole('slider', { name: 'Rok' })).toHaveAttribute('aria-valuenow', '-399');
});

test('lísteček jde klávesnicí: Enter rozvine, Esc zavře a vrátí fokus; karta člověka je list s páskou', async ({ page }) => {
  await page.addInitScript(VIC);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-424');
  await pripravit(page);
  const hlava = page.locator('[data-listek="athenes"] .listek__hlava');
  await hlava.focus();
  await page.keyboard.press('Enter');
  await expect(hlava).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveClass(/listek__clovek/);
  await page.keyboard.press('Enter');
  await expect(page.locator('#karta-jmeno')).toBeVisible();
  const karta = page.locator('article.karta');
  await expect(karta).toHaveClass(/papirovy-list/);
  await expect(karta.locator('.paska')).toHaveCount(1);
  await expect(karta.locator('.razitko-cloveka')).toHaveCount(1);
  // Na notebooku je lísteček vybraného otevřený; Esc ho zavře a fokus se vrátí na jeho hlavu.
  await page.locator('[data-listek="athenes"] .listek__hlava').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-listek="athenes"] .listek__hlava')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-listek="athenes"] .listek__hlava')).toBeFocused();
});

test('řeka životů: výchozí jen učitel a žák, současníci vybraného zvýrazněné, legenda barev období', async ({ page }) => {
  await page.addInitScript(VIC);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mapa/?rok=-360&osoba=platon');
  await pripravit(page);
  const typy = await page.locator('.reka .oblouk').evaluateAll((c) => [...new Set(c.map((p) => [...p.classList].find((k) => k.startsWith('oblouk--') && !['oblouk--vybrany', 'oblouk--tradovany'].includes(k))))]);
  expect(typy).toEqual(['oblouk--ucitel']);
  await expect(page.locator('.radek--vybrany')).toContainText('Platón');
  await expect(page.locator('.radek--soucasnik', { hasText: 'Sókratés' })).toHaveCount(1);
  await expect(page.locator('.radek--soucasnik', { hasText: 'Aristotelés' })).toHaveCount(1);
  const barvy = page.getByRole('list', { name: 'Barvy období' });
  await expect(barvy.getByRole('listitem').first()).toBeVisible();
  // Řádky jsou větší než dřív (22 px na notebooku).
  expect((await page.locator('.reka .radek').first().boundingBox())!.height).toBeGreaterThanOrEqual(22);
});
