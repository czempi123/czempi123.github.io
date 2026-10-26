// Průchod klíčovými stránkami na šířce 390 a 1440 px ve světlém i tmavém režimu:
// kontrast a přístupnost (axe, WCAG 2 AA), žádné vodorovné posouvání, navigace a snímky obrazovky.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// `preskocit`: stránka otázky skrývá hlasy do prvního názoru; v prohlídce je chceme vidět celé.
const STRANKY: { cesta: string; nazev: string; nadpis: RegExp; preskocit?: string }[] = [
  { cesta: '/', nazev: 'domu', nadpis: /Velké otázky mají/ },
  { cesta: '/lide/', nazev: 'lide', nadpis: /Lidé a směry/ },
  { cesta: '/osobnost/sokrates/', nazev: 'sokrates', nadpis: /Sókratés/ },
  { cesta: '/osobnost/platon/', nazev: 'platon', nadpis: /Platón/ },
  { cesta: '/osobnost/aristoteles/', nazev: 'aristoteles', nadpis: /Aristotelés/ },
  { cesta: '/osobnost/protagoras/', nazev: 'protagoras', nadpis: /Prótagorás/ },
  { cesta: '/osobnost/epikuros/', nazev: 'epikuros', nadpis: /Epikúros/ },
  { cesta: '/osobnost/diogenes/', nazev: 'diogenes', nadpis: /Diogenés/ },
  { cesta: '/osobnost/epiktetos/', nazev: 'epiktetos', nadpis: /Epiktétos/ },
  { cesta: '/osobnost/marcus-aurelius/', nazev: 'marcus-aurelius', nadpis: /Marcus Aurelius/ },
  { cesta: '/osobnost/seneca/', nazev: 'seneca', nadpis: /Seneca/ },
  { cesta: '/osobnost/herakleitos/', nazev: 'herakleitos', nadpis: /Hérakleitos/ },
  { cesta: '/osobnost/parmenides/', nazev: 'parmenides', nadpis: /Parmenidés/ },
  { cesta: '/osobnost/krates-a-hipparchia/', nazev: 'krates-a-hipparchia', nadpis: /Kratés a Hipparchia/ },
  { cesta: '/mapa/', nazev: 'mapa', nadpis: /Mapa a čas/ },
  { cesta: '/otazky/', nazev: 'otazky', nadpis: /Deset velkých otázek/ },
  { cesta: '/otazka/jak-poznam-pravdu/', nazev: 'otazka-7', nadpis: /Jak poznám, co je pravda\?/, preskocit: 'otazka-jak-poznam-pravdu' },
  { cesta: '/otazka/jak-zit/', nazev: 'otazka-1', nadpis: /Jak mám žít\?/, preskocit: 'otazka-jak-zit' },
  { cesta: '/otazka/ma-zivot-smysl/', nazev: 'otazka-3', nadpis: /Má život smysl\?/, preskocit: 'otazka-ma-zivot-smysl' },
  { cesta: '/otazka/jsem-svobodny/', nazev: 'otazka-4', nadpis: /Jsem svobodný\?/, preskocit: 'otazka-jsem-svobodny' },
  { cesta: '/otazka/co-je-skutecne/', nazev: 'otazka-6', nadpis: /Co je skutečné\?/, preskocit: 'otazka-co-je-skutecne' },
  { cesta: '/otazka/kdo-vlastne-jsem/', nazev: 'otazka-5', nadpis: /Kdo vlastně jsem\?/, preskocit: 'otazka-kdo-vlastne-jsem' },
  { cesta: '/cesta/je-to-co-vidim-cela-skutecnost/', nazev: 'cesta-3', nadpis: /Je to, co vidím, celá skutečnost\?/ },
  { cesta: '/cesta/staci-vedet-co-je-spravne/', nazev: 'cesta-4', nadpis: /Stačí vědět, co je správné\?/ },
  { cesta: '/cesta/proc-se-bat-smrti/', nazev: 'cesta-8', nadpis: /Proč se bát smrti\?/ },
  { cesta: '/cesta/jsem-porad-tentyz-kdyz-se-menim/', nazev: 'cesta-2', nadpis: /Jsem pořád tentýž, když se měním\?/ },
  { cesta: '/tyden/stoicky/', nazev: 'tyden-stoicky', nadpis: /Stoický týden/ },
];
const SIRKY = [
  { sirka: 390, vyska: 844 },
  { sirka: 1440, vyska: 900 },
];
const REZIMY = ['light', 'dark'] as const;

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('astro-island[component-url*="Hledani"]:not([ssr])', { state: 'attached' });
  // Líně hydratované ostrovy a obrázky: projeď stránku, ať je vše vykreslené.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
}

for (const s of STRANKY) {
  for (const { sirka, vyska } of SIRKY) {
    for (const rezim of REZIMY) {
      test(`${s.nazev} · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
        await page.setViewportSize({ width: sirka, height: vyska });
        await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
        if (s.preskocit) {
          await page.addInitScript((klic) => {
            localStorage.setItem('atlas-denik', JSON.stringify({ verze: 1, zapisy: [], vyzvy: [], navstivene: [], bloky: { [klic]: { preskoceno: true } }, aktivita: [], cesty: {} }));
          }, s.preskocit);
        }
        await page.goto(s.cesta);
        await pripravit(page);

        await expect(page.locator('h1')).toContainText(s.nadpis);
        // Režim odpovídá nastavení systému.
        const pozadi = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(pozadi).toBe(rezim === 'light' ? 'rgb(244, 239, 230)' : 'rgb(23, 20, 15)');
        // Žádné vodorovné posouvání stránky.
        const presah = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(presah).toBeLessThanOrEqual(0);
        // Navigace: na telefonu spodní lišta, na notebooku vstupy v hlavičce.
        if (sirka < 900) {
          await expect(page.locator('nav.lista')).toBeVisible();
          await expect(page.locator('nav.vstupy')).toBeHidden();
        } else {
          await expect(page.locator('nav.vstupy')).toBeVisible();
          await expect(page.locator('nav.lista')).toBeHidden();
        }
        // Kontrast a přístupnost podle WCAG 2 AA.
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        const popis = axe.violations.map((v) => `${v.id}: ${v.help}\n  ${v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
        expect(popis, popis.join('\n')).toEqual([]);

        // Na celostránkovém snímku by pevná spodní lišta visela uprostřed; ukážeme ji na konci stránky.
        await page.addStyleTag({ content: 'nav.lista { position: static !important; } .paticka { padding-bottom: 24px !important; }' });
        await page.screenshot({ path: `test-results/snimky/${s.nazev}-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, fullPage: true });
      });
    }
  }
}

test('ruční přepínač režimu přebije systém a zapamatuje si volbu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.locator('[data-prepinac-rezimu]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('atlas-rezim'))).toBe('dark');
  await page.goto('/lide/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(23, 20, 15)');
  await page.locator('[data-prepinac-rezimu]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('klávesnice: odkaz Přeskočit na obsah a hledání klávesou /', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  await page.waitForSelector('astro-island[component-url*="Hledani"]:not([ssr])', { state: 'attached' });
  await page.keyboard.press('Tab');
  await expect(page.locator('.preskocit')).toBeFocused();
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Hledání v atlasu' });
  await expect(dialog).toBeVisible();
  await dialog.locator('input').fill('Chairefón');
  await expect(dialog.locator('.pagefind-ui__result').first()).toBeVisible({ timeout: 15_000 });
  await expect(dialog.locator('.pagefind-ui__result-link').first()).toContainText('Chairefón');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('Nejdřív sám: odpověď se odkryje až po pokusu a uloží do deníku', async ({ page }) => {
  await page.goto('/osobnost/sokrates/');
  const blok = page.locator('#sokrates-kdo-je-moudry');
  // Ostrov se hydratuje, až je vidět; bez čekání by klik mohl přijít dřív než skript.
  await blok.scrollIntoViewIfNeeded();
  await page.waitForSelector('astro-island[component-url*="NejdrivSam"]:not([ssr])', { state: 'attached' });
  await expect(blok.getByRole('region', { name: 'Srovnání' })).toHaveCount(0);
  await blok.locator('textarea').fill('Moudrý je ten, kdo umí přiznat chybu.');
  await blok.getByRole('button', { name: 'Porovnat se Sókratem' }).click();
  await expect(blok.getByRole('region', { name: 'Srovnání' })).toContainText('kde jeho vědění končí');
  await page.goto('/denik/');
  await expect(page.getByText('Moudrý je ten, kdo umí přiznat chybu.')).toBeVisible();
});

// Rytina na výšku: deska v hlavičce je na telefonu na šířku (16 : 10) a potřebuje jiný střed výřezu než na notebooku,
// jinak přijde o hlavu (zdroje.yaml, vyrez a vyrezNaSirku).
test('deska osobnosti: rytina má na telefonu vlastní střed výřezu', async ({ page }) => {
  const stred = () => page.locator('.osobnost__deska img').evaluate((img) => getComputedStyle(img).objectPosition);
  for (const [id, uzky, siroky] of [['epiktetos', '50% 34%', '50% 60%'], ['marcus-aurelius', '50% 8%', '50% 28%']]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/osobnost/${id}/`);
    expect(await stred(), `${id} · 390 px`).toBe(uzky);
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await stred(), `${id} · 1440 px`).toBe(siroky);
  }
  // Pod deskou stojí vedle atributu i popisek obrázku: u rytiny říká, čí je to představa (revize P10).
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toContainText('Marcus Aurelius na koni.');
  await page.goto('/osobnost/epiktetos/');
  await expect(page.locator('.osobnost__deska .obraz-popisek')).toContainText('jak si ho představil rytec roku 1715');
  // Obrázek bez vlastního výřezu na šířku drží svůj běžný střed i na telefonu.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/osobnost/diogenes/');
  expect(await stred()).toBe('50% 12%');
});
