// Graf křivek (dílna): čitelnost na 390 a 1440 px ve světlém i tmavém režimu, textová alternativa,
// popisky uvnitř kresby a bez překryvu, axe a snímky.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STRANKA = '/dilna/bloky/';
const GRAF = '#dilna-graf-penize-stesti';

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    test(`graf křivek · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto(STRANKA);
      await page.evaluate(() => document.fonts.ready);
      const graf = page.locator(GRAF);
      await graf.scrollIntoViewIfNeeded();

      // Textová alternativa: kresba je obrázek s názvem a popis pod ní říká totéž slovy.
      const kresba = graf.getByRole('img');
      await expect(kresba).toHaveAttribute('aria-label', /^Graf: jak se lidé právě cítí/);
      await expect(kresba).toHaveAttribute('aria-describedby', 'dilna-graf-penize-stesti-popis');
      await expect(graf.locator('figcaption')).toContainText('U většiny lidí nálada s příjmem roste dál.');
      await expect(graf.locator('figcaption')).toContainText('100 000 dolary');

      // Popisky česky a čitelné: nejmenší písmo má na obrazovce aspoň 11,5 px.
      await expect(graf.locator('text')).toHaveText([
        'Jak se lidé právě cítí', 'lépe', 'Roční příjem domácnosti', 'Každý dílek je dvojnásobek předchozího.',
        '100 000 dolarů', 'Většina lidí', 'Nejméně šťastná pětina',
      ]);
      const mereni = await graf.evaluate((f) => {
        const svg = f.querySelector('svg')!;
        const ram = svg.getBoundingClientRect();
        const meritko = ram.width / svg.viewBox.baseVal.width;
        const texty = [...svg.querySelectorAll('text')].map((t) => {
          const r = t.getBoundingClientRect();
          return { text: t.textContent, pismo: parseFloat(getComputedStyle(t).fontSize) * meritko, l: r.left - ram.left, p: ram.right - r.right, n: r.top, d: r.bottom };
        });
        return { texty, krivek: svg.querySelectorAll('.graf__krivka').length, carkovanych: svg.querySelectorAll('.graf__krivka--carkovana').length };
      });
      expect(mereni.krivek).toBe(2);
      // Druhá křivka se neliší jen barvou.
      expect(mereni.carkovanych).toBe(1);
      for (const t of mereni.texty) {
        expect(t.pismo, t.text!).toBeGreaterThanOrEqual(11.5);
        expect(t.l, t.text!).toBeGreaterThanOrEqual(-1);
        expect(t.p, t.text!).toBeGreaterThanOrEqual(-1);
      }
      const [vetsina, petina] = ['Většina lidí', 'Nejméně šťastná pětina'].map((n) => mereni.texty.find((t) => t.text === n)!);
      expect(petina.n).toBeGreaterThan(vetsina.d);

      // Barvy z tokenů: první křivka v barvě období, druhá inkoustem.
      const barvy = await graf.evaluate((f) => [...f.querySelectorAll<SVGPathElement>('.graf__krivka')].map((k) => getComputedStyle(k).stroke));
      expect(barvy).toEqual(rezim === 'light' ? ['rgb(123, 53, 101)', 'rgb(36, 33, 29)'] : ['rgb(212, 141, 191)', 'rgb(238, 232, 221)']);

      const v = await new AxeBuilder({ page }).include(GRAF).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(v.violations.map((x) => `${x.id}: ${x.help}`)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.addStyleTag({ content: 'header.hlavicka, nav.lista { visibility: hidden !important; }' });
      await graf.screenshot({ path: `test-results/snimky/graf-krivek-${sirka}-${rezim === 'light' ? 'svetly' : 'tmavy'}.png`, animations: 'disabled' });
    });
  }
}
