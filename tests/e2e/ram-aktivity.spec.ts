// Společný rám aktivity (design-v2, K4a): pole se čtyřmi rohovými značkami na tečkách, lístek zpětné vazby s páskou,
// pata Začít znovu vlevo a hlavní čin vpravo, na telefonu pata u spodní hrany; studentovo pero; Odkryj s přeloženým
// papírem; text kroku cesty na čistém listu a blok mezi listy.
import { test, expect, type Page } from '@playwright/test';
import { pripravitStranku } from './strany';

const KROK2 = '/cesta/kdy-mam-dobry-duvod-verit/2/';
const VOLBA = '#cesta1-jak-zjistit';

async function hydratovany(page: Page, id: string) {
  const blok = page.locator(id);
  await blok.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island').filter({ has: blok })).not.toHaveAttribute('ssr', /.*/);
  return blok;
}

test('Volba v rámu: značky, lístky, kroužek perem, lístek s páskou, pata a pero jednou', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(KROK2);
  await pripravitStranku(page);
  const blok = await hydratovany(page, VOLBA);
  // Rám není list: bez okraje a plochy, jen čtyři rohové značky tužkou.
  const styl = await blok.evaluate((e) => { const s = getComputedStyle(e); return { okraj: s.borderTopStyle, obrazek: s.backgroundImage, barva: s.backgroundColor }; });
  expect(styl.okraj).toBe('none');
  expect(styl.obrazek.match(/linear-gradient/g)).toHaveLength(8);
  expect(styl.barva).toBe('rgba(0, 0, 0, 0)');
  // Hlava: rodina aktivit s tečkou v inkoustu období.
  await expect(blok.locator('.blok__nadtitulek')).toHaveText('Tvůj tah');
  // Hlavní čin je zakázaný čárkovaně, dokud student nezvolí; Začít znovu před tahem není.
  const tah = blok.getByRole('button', { name: 'Tohle je můj tah' });
  await expect(tah).toBeDisabled();
  expect(await tah.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe('dashed');
  await expect(blok.getByRole('button', { name: 'Začít znovu' })).toHaveCount(0);
  // Lístek: zvolený je vtlačený, v pahýlu dírka a kolem písmene kroužek perem.
  const b = blok.locator('label.karta').nth(1);
  await b.click();
  await expect(b).toHaveClass(/vystouple--zvoleno/);
  await expect.poll(() => b.locator('.kruh').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
  // Kroužek sedí na středu písmene (připomínka autora po K4a).
  const posun = await b.locator('.pismeno').evaluate((pis) => {
    const r = document.createRange(); r.selectNodeContents(pis.firstChild!);
    const t = r.getBoundingClientRect();
    const c = pis.querySelector('path')!.getBoundingClientRect();
    return [Math.abs(t.x + t.width / 2 - (c.x + c.width / 2)), Math.abs(t.y + t.height / 2 - (c.y + c.height / 2))];
  });
  expect(Math.max(...posun)).toBeLessThan(1.5);
  const pero = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--pero-modra').trim());
  expect(await b.locator('.kruh').evaluate((e) => getComputedStyle(e).stroke)).toBe('rgb(31, 74, 168)');
  expect(pero.toLowerCase()).toBe('#1f4aa8');
  // Pole na psaní: Kalam v barvě pera.
  const pole = blok.locator('textarea');
  expect(await pole.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Kalam/);
  await tah.click();
  // Zpětná vazba je lístek s páskou; pata má Začít znovu vlevo. Další krok nabízí lišta (K5), blok ho neopakuje.
  const vazba = blok.getByRole('region', { name: 'Zpětná vazba' });
  await expect(vazba).toHaveClass(/listek-paska/);
  await expect(vazba.locator('> .paska')).toHaveCount(1);
  const znovu = blok.locator('.blok__pata').getByRole('button', { name: 'Začít znovu' });
  await expect(znovu).toBeVisible();
  await expect(blok.locator('.blok__pata').getByRole('link', { name: /Další krok/ })).toHaveCount(0);
  await expect(page.locator('.cesta-lista [data-dalsi-krok]')).toHaveClass(/blok__tl--hlavni/);
  // Pero se nabídne při první odpovědi a uloží se do deníku; jiné pero se projeví hned na celé stránce.
  const nabidka = blok.getByRole('group', { name: 'Tohle je tvoje pero. Chceš jiné?' });
  await expect(nabidka).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik')!).pero)).toBe('modra');
  await nabidka.getByRole('button', { name: /sépiové/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-pero', 'sepiova');
  await expect.poll(() => b.locator('.kruh').evaluate((e) => getComputedStyle(e).stroke)).toBe('rgb(123, 68, 32)');
  // Po obnovení stránky platí pero hned (skript v hlavičce) a nabídka už není.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-pero', 'sepiova');
  await hydratovany(page, VOLBA);
  await expect(page.locator(VOLBA).getByRole('group', { name: /tvoje pero/ })).toHaveCount(0);
  await expect(page.locator(VOLBA).locator('.blok__vazba')).not.toHaveClass(/rozlozit/);
});

test('telefon: rám od okraje k okraji a pata s vlastním činem drží nad lištou cesty', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cesta/kolik-je-dost/3/');
  await pripravitStranku(page);
  const blok = await hydratovany(page, '#cesta6-bunda');
  const r = (await blok.boundingBox())!;
  expect(Math.round(r.x)).toBe(0);
  expect(Math.round(r.width)).toBe(390);
  const pata = blok.locator('.blok__pata');
  expect(await pata.evaluate((e) => getComputedStyle(e).position)).toBe('sticky');
  // Začátek bloku nahoře v okně: pata stojí nad lištou cesty, ne pod ní.
  await blok.evaluate((e) => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }));
  const lista = (await page.locator('.cesta-lista').boundingBox())!;
  const p = (await pata.boundingBox())!;
  expect(p.y + p.height).toBeLessThanOrEqual(lista.y + 1);
  expect(p.y + p.height).toBeGreaterThan(lista.y - 4);
  // Po tahu vede dál lišta: pata s Kam dál už nedrží.
  await blok.locator('label.karta').first().click();
  await blok.getByRole('button', { name: 'Tohle je můj tah' }).click();
  expect(await pata.evaluate((e) => getComputedStyle(e).position)).toBe('static');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('Odkryj: přeložený papír, srovnání vznikne až odkrytím a papír se odklopí; Začít znovu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/osobnost/sokrates/');
  await pripravitStranku(page);
  const blok = await hydratovany(page, '#sokrates-kdo-je-moudry');
  const kryt = blok.locator('.odkryj__kryt');
  await expect(kryt).toBeVisible();
  await expect(blok.getByRole('region', { name: 'Srovnání' })).toHaveCount(0);
  expect(await blok.innerHTML()).not.toContain('kde jeho vědění končí');
  await blok.locator('textarea').fill('Kdo ví, co neví.');
  await blok.getByRole('button', { name: 'Porovnat se Sókratem' }).click();
  const srovnani = blok.getByRole('region', { name: 'Srovnání' });
  await expect(srovnani).toBeVisible();
  await expect(srovnani).toHaveClass(/listek-paska/);
  // Papír se odklopí a po přechodu zmizí.
  await expect(kryt).toHaveCount(0, { timeout: 3000 });
  await expect(blok.locator('textarea')).toBeDisabled();
  await blok.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(blok.getByRole('region', { name: 'Srovnání' })).toHaveCount(0);
  await expect(blok.locator('textarea')).toHaveValue('');
  await expect(blok.locator('textarea')).toBeFocused();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik')!).zapisy.some((z: { id: string }) => z.id === 'sokrates-kdo-je-moudry'))).toBe(false);
});

test('krok cesty: text na čistém listu s jednou páskou, bloky mezi listy na tečkách', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/cesta/kolik-je-dost/3/');
  await pripravitStranku(page);
  const obsah = page.locator('.krok__obsah');
  await expect(obsah.locator('.cisty-list')).toHaveCount(2);
  await expect(obsah.locator('.cisty-list > .paska')).toHaveCount(1);
  expect(await obsah.locator('.cisty-list :is(.blok, astro-island, .kresba)').count()).toBe(0);
  expect(await obsah.evaluate((e) => [...e.querySelectorAll('.ctenarsky > p')].length)).toBe(0);
  // Citát na listu nemá vlastní pásku (páska patří listu).
  await expect(obsah.locator('.cisty-list > .citat .paska:visible')).toHaveCount(0);
});
