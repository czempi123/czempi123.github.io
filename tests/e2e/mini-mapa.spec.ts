// Mini mapa v oddílu Doba a lidé: popisky míst se nesmějí překrývat ani vyjet z mapy,
// na telefonu (větší písmo) ani na notebooku.
import { test, expect } from '@playwright/test';

const PROFILY = ['sokrates', 'platon', 'aristoteles', 'protagoras', 'epikuros', 'diogenes', 'epiktetos', 'marcus-aurelius'];

for (const sirka of [390, 1440]) {
  test(`mini mapa: popisky míst se nepřekrývají · ${sirka} px`, async ({ page }) => {
    await page.setViewportSize({ width: sirka, height: 900 });
    for (const id of PROFILY) {
      await page.goto(`/osobnost/${id}/`);
      await page.evaluate(() => document.fonts.ready);
      const mapa = page.locator('.minimapa svg');
      await mapa.scrollIntoViewIfNeeded();
      const nalezy = await mapa.evaluate((svg) => {
        const ramec = svg.getBoundingClientRect();
        const mista = [...svg.querySelectorAll('g.popisek')].map((g) => ({
          nazev: g.querySelector('.nazev')!.textContent ?? '',
          radky: [...g.querySelectorAll('.nazev, .role tspan')].map((t) => t.getBoundingClientRect()),
        }));
        const out: string[] = [];
        // Řádek písma má nad a pod znaky volné místo; počítá se překryv větší než 2 px.
        const prekryv = (a: DOMRect, b: DOMRect) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 4;
        for (let i = 0; i < mista.length; i++) {
          for (const r of mista[i].radky) if (r.left < ramec.left - 1 || r.right > ramec.right + 1 || r.top < ramec.top - 1 || r.bottom > ramec.bottom + 1) out.push(`${mista[i].nazev}: popisek mimo mapu`);
          for (let j = i + 1; j < mista.length; j++) {
            if (mista[i].radky.some((a) => mista[j].radky.some((b) => prekryv(a, b)))) out.push(`${mista[i].nazev} × ${mista[j].nazev}`);
          }
        }
        return out;
      });
      expect(nalezy, `${id} · ${sirka} px`).toEqual([]);
    }
  });
}

test('mini mapa Epikúra: popisek Kolofónu stojí nad bodem, ostatní vedle něj', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/epikuros/');
  const mapa = page.locator('.minimapa svg');
  await expect(mapa.locator('g.popisek--nahoru')).toHaveCount(1);
  await expect(mapa.locator('g.popisek--nahoru .nazev')).toHaveText('Kolofón');
  // Čtečka dál slyší všechna místa i s rolemi.
  await expect(mapa).toHaveAttribute('aria-label', /Kolofón \(pobyt 321/);
});

test('mini mapa: přibližný rok z dat má „asi“, přesný ne', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/epiktetos/');
  const epiktetos = page.locator('.minimapa svg');
  await expect(epiktetos.locator('g.popisek', { hasText: 'Níkopolis' })).toContainText('působení asi 93');
  await page.goto('/osobnost/marcus-aurelius/');
  const marcus = page.locator('.minimapa svg');
  await expect(marcus.locator('g.popisek', { hasText: 'Carnuntum' })).toContainText('válečné tažení asi 172');
  await expect(marcus.locator('g.popisek', { hasText: 'Řím' })).toContainText('narození 121');
  await expect(marcus.locator('g.popisek', { hasText: 'Řím' })).not.toContainText('asi');
});

// Mini osa přes přelom letopočtu (Seneca u Epiktéta): značky vlevo od přelomu nesou „př. n. l.“,
// jinak by na ose stálo dvakrát „50“. Značky se na telefonu nesmějí překrývat.
test('mini osa: roky před přelomem letopočtu mají „př. n. l.“ a značky se nepřekrývají', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/epiktetos/');
  await page.evaluate(() => document.fonts.ready);
  const znacky = page.locator('.doba__osa .osa__znacka');
  await expect(znacky.first()).toHaveText('50 př. n. l.');
  await expect(znacky.nth(2)).toHaveText('50');
  const okraje = await znacky.evaluateAll((z) => z.filter((e) => e.textContent).map((e) => e.getBoundingClientRect()).map((r) => [r.left, r.right]));
  for (let i = 1; i < okraje.length; i++) expect(okraje[i][0], `značka ${i}`).toBeGreaterThan(okraje[i - 1][1]);
  // Osa jen z roků před naším letopočtem zůstává bez přípony; říká to popisek pod ní.
  await page.goto('/osobnost/epikuros/');
  await expect(page.locator('.doba__osa .osa__znacka').first()).toHaveText('450');
  // Pod mini osou stojí ve stejném sloupci Dva životy s vlastním popiskem: tady jen popisek mini osy.
  await expect(page.locator('.doba__osa figure.osa figcaption')).toContainText('Letopočty před naším letopočtem');
});

// Doba a lidé: vliv přes texty má vlastní skupiny. Pod „Znali se a přeli se“ smějí stát jen lidé,
// kteří se potkali nebo přeli (revize celku 3: Epiktétos a Marcus Aurelius se nikdy neviděli).
test('Doba a lidé: kdo jen četl, nestojí pod „Znali se a přeli se“', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const skupina = (nazev: string) => page.locator('.doba__vztahy > div').filter({ has: page.getByRole('heading', { name: nazev, exact: true }) });
  await page.goto('/osobnost/epiktetos/');
  await expect(skupina('Znali se a přeli se')).toHaveCount(0);
  await expect(skupina('Četli ho a navázali')).toContainText('Marcus Aurelius');
  await expect(skupina('Četli ho a navázali')).toContainText('navázal na jeho texty');
  await expect(skupina('Učitelé')).toContainText('Musonius Rufus');
  await page.goto('/osobnost/marcus-aurelius/');
  await expect(skupina('Znali se a přeli se')).toHaveCount(0);
  await expect(skupina('Koho četl')).toContainText('Epiktétos');
  await expect(skupina('Koho četl')).toContainText('znal ho z textů');
  await page.goto('/osobnost/epikuros/');
  await expect(skupina('Četli ho a navázali')).toContainText('Lucretius');
  await expect(skupina('Znali se a přeli se')).toHaveCount(0);
  // Kdo se opravdu znal, zůstává pod původním nadpisem.
  await page.goto('/osobnost/sokrates/');
  await expect(skupina('Znali se a přeli se')).toContainText('Chairefón');
});

// Spor na dálku: polemika s člověkem, se kterým se kritik osobně přít nemohl, má vlastní skupinu
// (celek 5: Sókratés zemřel patnáct let před Aristotelovým narozením). Mini mapa má všech šest míst.
test('Doba a lidé: spor na dálku nestojí pod „Znali se a přeli se“', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const skupina = (nazev: string) => page.locator('.doba__vztahy > div').filter({ has: page.getByRole('heading', { name: nazev, exact: true }) });
  await page.goto('/osobnost/aristoteles/');
  await expect(skupina('Učitelé')).toContainText('Platón');
  for (const jmeno of ['Platón', 'Xenokratés']) await expect(skupina('Znali se a přeli se')).toContainText(jmeno);
  await expect(skupina('Žáci')).toContainText('Theofrastos');
  await expect(skupina('Znali se a přeli se')).not.toContainText(/Sókratés|Prótagorás/);
  for (const jmeno of ['Sókratés', 'Prótagorás']) await expect(skupina('S kým se přel na dálku')).toContainText(jmeno);
  await expect(skupina('S kým se přel na dálku')).toContainText('přel se s jeho učením');
  await expect(skupina('S kým se přel na dálku')).not.toContainText('polemizoval');
  for (const misto of ['Stageira', 'Athény', 'Assos', 'Lesbos', 'Pella', 'Chalkis']) {
    await expect(page.locator('.minimapa svg g.popisek', { hasText: misto })).toHaveCount(1);
  }
  await page.goto('/osobnost/sokrates/');
  await expect(skupina('Kdo se s ním přel později')).toContainText('Aristotelés');
  await expect(skupina('Znali se a přeli se')).toContainText('Aristofanés');
  await expect(skupina('Znali se a přeli se')).not.toContainText('Aristotelés');
  await page.goto('/osobnost/protagoras/');
  await expect(skupina('Kdo se s ním přel později')).toContainText('Aristotelés');
  // Současníci, kteří se přeli, zůstávají pod původním nadpisem.
  await page.goto('/osobnost/platon/');
  for (const jmeno of ['Aristotelés', 'Diogenés']) await expect(skupina('Znali se a přeli se')).toContainText(jmeno);
  await expect(skupina('Kdo se s ním přel později')).toHaveCount(0);
});
