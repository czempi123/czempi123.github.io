// Rám webu v novém vzhledu (design-v2, K2): logo Agora s papírem období, název v titulku a v popisu pro sdílení,
// vtlačená aktivní položka, stín hlavičky po posunu, stránka 404 a přechod mezi stránkami jen bez omezeného pohybu.
import { test, expect } from '@playwright/test';

test('logo: odkaz „Agora, domů“, písmena čtečka nečte, velké A v papíru období stránky', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  const logo = page.getByRole('link', { name: 'Agora, domů' });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('href', '/');
  await expect(logo.locator('.logo__kolaz')).toHaveAttribute('aria-hidden', 'true');
  await expect(logo).toHaveClass(/obdobi-1/);
  const barvy = await page.evaluate(() => ({
    a: getComputedStyle(document.querySelector('.lz1')!).backgroundColor,
    pp: getComputedStyle(document.documentElement).getPropertyValue('--pp-1').trim(),
  }));
  expect(barvy.pp.toLowerCase()).toBe('#a34329');
  expect(barvy.a).toBe('rgb(163, 67, 41)');
  // Stránka bez období: A v inkoustu.
  await page.goto('/otazky/');
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toHaveClass(/bez-obdobi/);
  expect(await page.locator('.lz1').evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(36, 33, 29)');
});

test('logo na telefonu: bez Zpět je vidět, se Zpět ustoupí', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toBeVisible();
  await page.goto('/osobnost/sokrates/');
  await expect(page.getByRole('link', { name: 'Zpět na Lidé a směry' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toBeHidden();
});

test('Mapa a čas: velké A drží období zvoleného roku', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/mapa/?rok=-200');
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toHaveClass(/obdobi-2/);
  await page.goto('/mapa/?rok=-400');
  await page.waitForSelector('astro-island[component-url*="MapaACas"]:not([ssr])', { state: 'attached' });
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toHaveClass(/obdobi-1/);
});

test('název Agora v titulku a v popisu pro sdílení', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Agora');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Agora');
  await page.goto('/osobnost/sokrates/');
  await expect(page).toHaveTitle('Sókratés · Agora');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Sókratés · Agora');
});

test('aktivní vstup je vtlačený, ostatní ploché; Můj deník a přepínač vystupují', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/otazky/');
  const stin = (sel: string) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).boxShadow);
  expect(await stin('nav.vstupy a[aria-current="page"]')).toContain('inset');
  expect(await stin('nav.vstupy a:not([aria-current])')).toBe('none');
  await expect(page.locator('a.denik')).toHaveClass(/vystouple/);
  await expect(page.locator('[data-prepinac-rezimu]')).toHaveClass(/vystouple/);
  expect(await stin('button.hledat')).toContain('inset');
  // Telefon: aktivní položka spodní lišty je vtlačená.
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await stin('nav.lista a[aria-current="page"]')).toContain('inset');
});

test('stín hlavičky až po posunu stránky', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/osobnost/sokrates/');
  await expect(page.locator('header.hlavicka')).not.toHaveAttribute('data-posunuto');
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await expect(page.locator('header.hlavicka')).toHaveAttribute('data-posunuto');
});

test('stránka 404: titulek na vytrženém listu a pruh bez období', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tahle-stranka-neni/');
  await expect(page.locator('.titulek h1')).toHaveText('Tady nic není.');
  await expect(page.locator('.bez-obdobi .titulek-pruh__papir')).toHaveText('Stránka nenalezena');
  await expect(page.getByRole('link', { name: 'Agora, domů' })).toHaveClass(/bez-obdobi/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

test('přechod mezi stránkami: typ dalsi, při omezeném pohybu žádný', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Zaznamená přechod nové stránky; typ do něj přidá až skript v hlavičce (pagereveal v Zakladni.astro), proto se čte později.
  await page.addInitScript(() => {
    addEventListener('pagereveal', (e: Event & { viewTransition?: object }) => {
      (window as unknown as { prechodVt: object | null }).prechodVt = e.viewTransition ?? null;
    });
  });
  const prechod = () => page.evaluate(() => {
    const vt = (window as unknown as { prechodVt?: { types: Set<string> } | null }).prechodVt;
    return vt === undefined ? undefined : vt === null ? 'zadny' : [...vt.types].join(',');
  });
  await page.goto('/otazky/');
  await page.getByRole('navigation', { name: 'Hlavní navigace' }).first().getByRole('link', { name: 'Lidé a směry' }).click();
  await expect(page).toHaveURL(/\/lide\/$/);
  await expect.poll(prechod).toBe('dalsi');
  // Rub zahnutého listu je vidět jen během přechodu.
  await expect(page.locator('html')).not.toHaveClass(/otaci-se/);
  await expect(page.locator('.otoceni-ohyb')).toBeHidden();
  await page.goBack();
  await expect(page).toHaveURL(/\/otazky\/$/);
  await expect.poll(prechod).toBe('zpet');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('navigation', { name: 'Hlavní navigace' }).first().getByRole('link', { name: 'Domů' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(prechod).toBe('zadny');
});
