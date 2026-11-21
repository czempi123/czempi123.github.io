// Revize herna-v1 (R): přídavky z T při promítání hodiny. Hra stránky otázky stojí pod Tvým prvním názorem
// (#<slug>-po skrývá atribut data-otazka-zavreno); učitel ji do hodiny vybral, na plátně se ukáže hned, stejně
// jako hlas. Dřív se odkrývalo jen u zastavení druhu „hlas“ a hra na plátně zůstala prázdná.
import { test, expect } from '@playwright/test';

for (const z of ['b:jak-zit-kdo-by', 'b:jak-zit-osa']) {
  test(`promítání: ${z} se na stránce otázky ukáže bez prvního názoru`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/hodina/?v=1&n=${encodeURIComponent('Revize')}&z=${z}`);
    await page.getByRole('button', { name: 'Promítat hodinu' }).click();
    await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
    const kotva = z.slice(2);
    await expect(page.locator(`[id="${kotva}"]`)).toBeVisible();
    await expect(page.locator('#jak-zit-po')).toBeVisible();
  });
}
