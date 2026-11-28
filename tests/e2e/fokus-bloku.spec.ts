// Fokus z klávesnice u prvků, které po stisku zmizí (sokrates-opravy, bod 4), a tlačítko Odkryj s prázdným polem (bod 6).
// Moje stanovisko: tlačítko a pole se střídají na stejném místě, fokus nesmí spadnout na <body>.
// Zkus to žít: tlačítko po přijetí nahradí potvrzení, fokus jde na ně.
import { test, expect, type Page, type Locator } from '@playwright/test';

async function hydratovany(page: Page, blok: Locator, ostrov: string) {
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator(`astro-island[component-url*="${ostrov}"]`).filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/osobnost/sokrates/');
});

test('Moje stanovisko: fokus jde do pole a po Uložit i Zrušit zpět na tlačítko', async ({ page }) => {
  const stanovisko = page.locator('.stanovisko').first();
  await hydratovany(page, stanovisko, 'MojeStanovisko');
  const otevrit = stanovisko.getByRole('button', { name: 'Moje stanovisko' });
  await otevrit.focus();
  await page.keyboard.press('Enter');
  const pole = stanovisko.getByRole('textbox');
  await expect(pole).toBeFocused();

  await stanovisko.getByRole('button', { name: 'Zrušit' }).focus();
  await page.keyboard.press('Enter');
  await expect(otevrit).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(pole).toBeFocused();
  await page.keyboard.type('Zlo dělá i ten, kdo ví.');
  await stanovisko.getByRole('button', { name: 'Uložit do deníku' }).focus();
  await page.keyboard.press('Enter');
  const upravit = stanovisko.getByRole('button', { name: 'Upravit stanovisko v deníku' });
  await expect(upravit).toBeFocused();
  await expect(stanovisko).toContainText('Uloženo v deníku.');
});

test('Zkus to žít: po přijetí výzvy je fokus na potvrzení', async ({ page }) => {
  const karta = page.locator('#zkus-to-zit');
  await karta.scrollIntoViewIfNeeded();
  await expect(karta.locator('astro-island[component-url*="ZkusToZit"]')).not.toHaveAttribute('ssr', /.*/);
  await karta.getByRole('button', { name: 'Přijmout výzvu' }).focus();
  await page.keyboard.press('Enter');
  await expect(karta.locator('.prijato')).toBeFocused();
  await expect(karta.getByRole('status')).toContainText('Výzva je v tvém deníku.');
});

test('Odkryj: s prázdným polem jde odklopit jen vedlejším tlačítkem, po prvním znaku je hlavní', async ({ page }) => {
  const blok = page.locator('#sokrates-kdo-je-moudry');
  await hydratovany(page, blok, 'Odkryj');
  await expect(blok.locator('.blok__tl--hlavni')).toHaveCount(0);
  await expect(blok.getByRole('button', { name: 'Odklopit bez odpovědi' })).toHaveClass(/blok__tl--vedlejsi/);
  await blok.getByRole('textbox').fill('M');
  await expect(blok.getByRole('button', { name: 'Odklopit bez odpovědi' })).toHaveCount(0);
  await expect(blok.getByRole('button', { name: 'Porovnat se Sókratem' })).toHaveClass(/blok__tl--hlavni/);
  // Smazaný text vrátí vedlejší tlačítko; odklopit jde i tak a srovnání se ukáže.
  await blok.getByRole('textbox').fill('');
  await blok.getByRole('button', { name: 'Odklopit bez odpovědi' }).click();
  await expect(blok.getByRole('region', { name: 'Srovnání' })).toBeVisible();
  // Mince Sókrata v hlavičce bloku (dřív obal Nejdřív sám bez filozofa).
  await expect(blok.locator('.blok__mince > *')).toHaveCount(1);
});
