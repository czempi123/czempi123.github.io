// Pomůcky pro testy, které čtou zápisy v Můj deník (design-v2, K6 dodatek). Deník řadí záznamy v kapitolách po
// obdobích a v kapitole podle cest; výpis podle data je přepínač a deník si ho pamatuje (src/lib/zapisnik.ts,
// KLIC_KAPITOL). Testy, které hledají větu zápisu tak, jak ji student napsal, přepnou předem na výpis podle data.
import type { Page } from '@playwright/test';

/** Před každým načtením stránky nastaví výpis podle data (jen když stav kapitol ještě není); otevře se poslední kapitola. */
export async function denikPodleData(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const klic = 'atlas-denik-kapitoly';
    try {
      if (!localStorage.getItem(klic)) localStorage.setItem(klic, JSON.stringify({ otevrene: [], kdy: '2000-01-01T00:00:00.000Z', pohled: 'data' }));
    } catch {
      /* stránka bez úložiště */
    }
  });
}

/** Kapitoly deníku: zápisy ze všech kapitol (i zavřených) pro toContainText; počet zápisů je `.seznam--zapisy li`. */
export const zapisyDeniku = (page: Page) => page.locator('.kapitoly');
