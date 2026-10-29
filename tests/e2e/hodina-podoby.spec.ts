// Podoba zastavení na plátně (větev hodiny-v1, krok H4): výběr podoby ve skladateli klávesnicí, značky v odkazu,
// tisk; promítání v podobách Jen otázka a možnosti, Otevřená otázka (Ukázat možnosti tlačítkem i klávesou M,
// po návratu zase skryté), Jen kresba; student s lištou vidí blok celý; třída s telefony; čisté bloky při každém
// promítání a deník studenta beze změny. Axe na plátně v každé podobě, snímky do Claude outputs/hodiny/.
import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const SNIMKY = 'Claude outputs/hodiny';
mkdirSync(SNIMKY, { recursive: true });
const odkaz = (nazev: string, ids: string[]) => `/hodina/?v=1&n=${encodeURIComponent(nazev)}&z=${ids.join(',')}`;
const VOLBA = 'cesta1-jak-zjistit'; // Volba se scénou, krok 2 cesty 1
const ODKRYJ = 'cesta1-podle-ceho-poznas'; // Odkryj, krok 4
const SPOR = 'cesta1-meritko-spor'; // Spor se scénou, krok 5
const VOLBA2 = 'cesta2-je-to-ona'; // Volba na jiné cestě
const KRESBA = 'lod-po-prknech'; // kresba Loď po prknech
/** Hodina s podobami: Volba jen s možnostmi, Odkryj otevřená, Spor jen s možnostmi, Volba otevřená, kresba jen kresba. */
const PODOBY = odkaz('Podoby', [`b:${VOLBA}~m`, `b:${ODKRYJ}~o`, `b:${SPOR}~m`, `b:${VOLBA2}~o`, `b:${KRESBA}~k`]);
const KRESBA2 = 'kolik-je-dost-pohar'; // kresba 340 × 240: na širokém plátně ovládání vedle
/** Promítání pro snímky: k hodině PODOBY navíc běžná kresba. */
const SNIMKOVA = odkaz('Podoby', [`b:${VOLBA}~m`, `b:${ODKRYJ}~o`, `b:${SPOR}~m`, `b:${VOLBA2}~o`, `b:${KRESBA}~k`, `b:${KRESBA2}~k`]);
const rezimy = ['light', 'dark'] as const;
const nazevRezimu = (r: (typeof rezimy)[number]) => (r === 'light' ? 'svetly' : 'tmavy');

const lista = (page: Page) => page.locator('[data-hodina-lista]');
const pocet = async (page: Page) => ((await page.locator('[data-hl-pocet]').textContent()) ?? '').replace(/\u00a0/g, ' ');
const tlMoznosti = (page: Page) => lista(page).locator('[data-hl-moznosti]');

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const h = document.documentElement.classList;
    if (!h.contains('s-hodinou')) return true;
    return !!document.querySelector('[data-hodina-lista]')?.hasAttribute('data-pripraveno') && (!h.contains('promitani') || h.contains('promitani-pripraveno'));
  });
}

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(v.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

// Výběr skladatele stojí v DOM před hodinou: od K2 větve interaktivita-v1 má navíc 34 medailonků (jeden souhrn každý).
async function tabNa(page: Page, cil: Locator, nejvic = 160) {
  for (let i = 0; i < nejvic; i++) {
    if (await cil.evaluate((el) => el === document.activeElement).catch(() => false)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Tabulátor se na prvek nedostal: ${cil}`);
}

const stav = (page: Page) =>
  page.evaluate(() => `${location.pathname}${location.hash}|${scrollY}|${document.querySelector('[data-hl-pocet]')?.textContent}`);

/** Stiskne klávesu a počká, až se promítání pohne. Vrátí false, když se nic nestalo. */
async function stisk(page: Page, klavesa: string): Promise<boolean> {
  const pred = await stav(page);
  await page.keyboard.press(klavesa);
  try {
    await expect.poll(() => stav(page).catch(() => pred), { timeout: 1500 }).not.toBe(pred);
  } catch {
    return false;
  }
  await page.waitForLoadState('load');
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await page.evaluate(() => document.fonts.ready);
  return true;
}

/** Šipkou vpřed (nebo vzad) na zastavení n z celku. */
async function naZastaveni(page: Page, n: number, celkem: number) {
  const ted = async () => Number((await pocet(page)).split(' ')[0]);
  // Pole s fokusem (Tvůj první názor) si šipky nechává; učitel na plátně klepne mimo.
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  for (let i = 0; i < 40 && (await ted()) !== n; i++) await stisk(page, (await ted()) < n ? 'ArrowRight' : 'ArrowLeft');
  expect(await pocet(page)).toMatch(new RegExp(`^${n} (z|ze) ${celkem}$`));
  await hydratovano(page);
}

/** Ostrovy bloků na stránce jsou hydratované (client:visible). */
async function hydratovano(page: Page) {
  await page.waitForFunction(() => [...document.querySelectorAll('astro-island')].every((x) => !x.hasAttribute('ssr') || !x.getClientRects().length));
}

/** Otevře hodinu z odkazu a stiskne Promítat hodinu. */
async function promitat(page: Page, adresa = PODOBY) {
  await page.goto(adresa);
  await pripravit(page);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await pripravit(page);
  await hydratovano(page);
}

/** Část bloku podle značky data-cast. */
const cast = (page: Page, blok: string, c: string) => page.locator(`#${blok} [data-cast="${c}"]`);

test('skladatel: podoba na plátně klávesnicí, hlášení, uložení; odkaz nese značky; tisk', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hodina = {
    verze: 1, id: 'hodina-podoby', nazev: 'Podoby', poznamka: '', zmeneno: '2026-10-18T09:00:00.000Z',
    zastaveni: [
      { id: 'k:kdy-mam-dobry-duvod-verit/2', poznamka: '' },
      { id: `b:${VOLBA}`, poznamka: '' },
      { id: 'b:cesta2-tentyz-stejny', poznamka: '' },
      { id: `b:${KRESBA}`, poznamka: '' },
    ],
  };
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), hodina);
  await page.goto('/hodina/nova/?hodina=hodina-podoby');
  await expect(page.locator('.zvolena > li')).toHaveCount(4);
  // Krok podobu nemá; Volba tři, Roztřiď dvě, kresba dvě.
  await expect(page.locator('.zvolena > li').nth(0).locator('select')).toHaveCount(0);
  const vyber = (i: number) => page.locator('.zvolena > li').nth(i).locator('select');
  await expect(vyber(1).locator('option')).toHaveText(['Celý blok', 'Jen otázka a možnosti', 'Otevřená otázka']);
  await expect(vyber(2).locator('option')).toHaveText(['Celý blok', 'Jen otázka a možnosti']);
  await expect(vyber(3).locator('option')).toHaveText(['Celý blok', 'Jen kresba']);
  await expect(vyber(1)).toHaveValue('cely');
  await expect(page.getByLabel('Na plátně, zastavení 2:')).toHaveCount(1);

  // Klávesnicí: tabulátorem na výběr a napsáním začátku názvu podoby (šipky na Macu otevřou nabídku).
  await tabNa(page, vyber(1));
  await page.keyboard.type('Ote');
  await expect(vyber(1)).toHaveValue('otevrena');
  await expect(page.getByRole('status')).toHaveText(/na plátně otevřená otázka\.$/);
  await tabNa(page, vyber(3));
  await page.keyboard.type('Jen');
  await expect(vyber(3)).toHaveValue('kresba');
  await expect(page.getByRole('status')).toHaveText(/Loď po prknech: na plátně jen kresba\.$|: na plátně jen kresba\.$/);

  await page.getByRole('button', { name: 'Uložit' }).click();
  const ulozena = await page.evaluate(() => JSON.parse(localStorage.getItem('atlas-hodiny')!).hodiny[0].zastaveni);
  expect(ulozena.map((z: { podoba?: string }) => z.podoba ?? 'cely')).toEqual(['cely', 'otevrena', 'cely', 'kresba']);
  const adresa = await page.locator('#hodina-odkaz').inputValue();
  expect(adresa).toContain(`b:${VOLBA}~o`);
  expect(adresa).toContain(`b:${KRESBA}~k`);
  expect(adresa).toContain('b:cesta2-tentyz-stejny,');
  // Po novém načtení drží výběr uloženou podobu.
  await page.reload();
  await expect(vyber(1)).toHaveValue('otevrena');

  // Tisk: podoba u zastavení.
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.tisk__podoba')).toHaveText(['na plátně: otevřená otázka', 'na plátně: jen kresba']);
  await page.emulateMedia({ media: 'screen' });
});

for (const sirka of [390, 1440] as const) {
  for (const rezim of rezimy) {
    test(`skladatel s výběrem podoby: ${sirka} px, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim, axe a snímek`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: sirka === 390 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: rezim });
      await page.goto('/');
      const hodina = {
        verze: 1, id: 'hodina-podoby', nazev: 'Delfy na plátně', poznamka: '', zmeneno: '2026-10-18T09:00:00.000Z',
        zastaveni: [
          { id: 'k:kdy-mam-dobry-duvod-verit/1', poznamka: 'Začít věštírnou.' },
          { id: `b:${VOLBA}`, poznamka: 'Ruce nahoru', podoba: 'otevrena' },
          { id: `b:${ODKRYJ}`, poznamka: '', podoba: 'moznosti' },
          { id: `b:${KRESBA}`, poznamka: '', podoba: 'kresba' },
        ],
      };
      await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), hodina);
      await page.goto('/hodina/nova/?hodina=hodina-podoby');
      await expect(page.locator('.zvolena > li')).toHaveCount(4);
      await expect(page.locator('.zvolena > li').nth(2).locator('select option:checked')).toHaveText('Jen otázka a odkrytí');
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.locator('#hodina').scrollIntoViewIfNeeded();
      await page.locator('.zvolena > li').nth(1).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${SNIMKY}/podoba-skladatel-${sirka}-${nazevRezimu(rezim)}.png` });
    });
  }
}

test('promítání: jen otázka a možnosti, otevřená otázka s Ukázat možnosti (tlačítko i M), jen kresba; šipky v kartách', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await promitat(page);

  // 1 · Volba, jen otázka a možnosti: bez scény, důvodu a Kam dál; zpětná vazba až po kliknutí.
  expect(await pocet(page)).toBe('1 z 5');
  await expect(page.locator(`#${VOLBA}`)).toHaveAttribute('data-podoba', 'moznosti');
  await expect(cast(page, VOLBA, 'otazka')).toBeVisible();
  await expect(cast(page, VOLBA, 'moznosti')).toBeVisible();
  await expect(cast(page, VOLBA, 'scena').first()).toBeHidden();
  for (const el of await cast(page, VOLBA, 'duvod').all()) await expect(el).toBeHidden();
  await expect(cast(page, VOLBA, 'akce').first()).toBeVisible();
  await expect(cast(page, VOLBA, 'zpetna')).toHaveCount(0);
  await expect(tlMoznosti(page)).toBeHidden();
  await axe(page);
  // Šipky v kartách patří kartám: zastavení se nepřeskočí.
  await page.locator(`#${VOLBA} input[type="radio"]`).first().focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(`#${VOLBA} input[type="radio"]`).nth(2)).toBeChecked();
  expect(await pocet(page)).toBe('1 z 5');
  await page.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(cast(page, VOLBA, 'zpetna').first()).toBeVisible();
  for (const c of ['dal', 'ulozeno']) for (const el of await cast(page, VOLBA, c).all()) await expect(el).toBeHidden();
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());

  // 2 · Odkryj, otevřená otázka: jen hlava a otázka; Ukázat možnosti ukáže tlačítko odkrytí.
  await naZastaveni(page, 2, 5);
  await expect(page.locator(`#${ODKRYJ}`)).toHaveAttribute('data-podoba', 'otevrena');
  await expect(cast(page, ODKRYJ, 'otazka')).toBeVisible();
  await expect(cast(page, ODKRYJ, 'duvod').first()).toBeHidden();
  await expect(cast(page, ODKRYJ, 'akce').first()).toBeHidden();
  const velikost = await cast(page, ODKRYJ, 'otazka').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(velikost).toBeGreaterThanOrEqual(56);
  await expect(tlMoznosti(page)).toBeVisible();
  await expect(tlMoznosti(page)).toHaveAttribute('aria-pressed', 'false');
  await axe(page);
  await tlMoznosti(page).click();
  await expect(tlMoznosti(page)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(`#${ODKRYJ}`)).toHaveAttribute('data-podoba', 'moznosti');
  await expect(cast(page, ODKRYJ, 'akce').first()).toBeVisible();
  await expect(cast(page, ODKRYJ, 'duvod').first()).toBeHidden();
  await axe(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press('m');
  await expect(tlMoznosti(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(cast(page, ODKRYJ, 'akce').first()).toBeHidden();
  await page.keyboard.press('M');
  await expect(cast(page, ODKRYJ, 'akce').first()).toBeVisible();
  // Přejít jinam a zpátky: možnosti jsou zase skryté.
  await naZastaveni(page, 3, 5);
  await naZastaveni(page, 2, 5);
  await expect(tlMoznosti(page)).toHaveAttribute('aria-pressed', 'false');
  await expect(cast(page, ODKRYJ, 'akce').first()).toBeHidden();

  // 3 · Spor, jen otázka a možnosti: strany sporu a škála, bez scény.
  await naZastaveni(page, 3, 5);
  await expect(cast(page, SPOR, 'otazka')).toBeVisible();
  await expect(page.locator(`#${SPOR} .postoje`)).toBeVisible();
  await expect(cast(page, SPOR, 'scena').first()).toBeHidden();
  await expect(page.locator(`#${SPOR} .skala`).first()).toBeVisible();
  await axe(page);

  // 4 · Volba na jiné stránce, otevřená otázka: karty skryté; M je ukáže, učitel klikne, co třída zvolila.
  await naZastaveni(page, 4, 5);
  await expect(page).toHaveURL(new RegExp(`#${VOLBA2}$`));
  await expect(cast(page, VOLBA2, 'otazka')).toBeVisible();
  await expect(cast(page, VOLBA2, 'moznosti')).toBeHidden();
  await page.keyboard.press('m');
  await expect(cast(page, VOLBA2, 'moznosti')).toBeVisible();
  await page.locator(`#${VOLBA2} label.karta`).first().click();
  await expect(page.locator(`#${VOLBA2} label.karta`).first()).toHaveClass(/karta--vybrana/);
  // M v poli nepatří liště: s fokusem v kartě se nic nepřepne.
  await page.locator(`#${VOLBA2} input[type="radio"]`).first().focus();
  await page.keyboard.press('m');
  await expect(tlMoznosti(page)).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());

  // 5 · Kresba, jen kresba: plátno a ovládání, text pod kresbou jen pro čtečky.
  await naZastaveni(page, 5, 5);
  await expect(page.locator(`#${KRESBA}`)).toHaveAttribute('data-podoba', 'kresba');
  await expect(cast(page, KRESBA, 'platno')).toBeVisible();
  const popis = cast(page, KRESBA, 'popis');
  expect((await popis.textContent())?.trim().length).toBeGreaterThan(10);
  const r = await popis.boundingBox();
  expect(r!.width).toBeLessThanOrEqual(1);
  const platno = await cast(page, KRESBA, 'platno').boundingBox();
  // Loď je široká kresba: ovládání pod ní a kresba přes celou šířku sloupce.
  await expect(page.locator(`#${KRESBA}`)).toHaveAttribute('data-siroka', '');
  expect(platno!.height).toBeGreaterThan(250);
  expect(platno!.width).toBeGreaterThan(1000);
  expect(platno!.y + platno!.height).toBeLessThanOrEqual(720);
  await expect(tlMoznosti(page)).toBeHidden();
  await axe(page);
});

for (const [w, h] of [[1280, 720], [1920, 1080]] as const) {
  for (const rezim of rezimy) {
    test(`podoby na plátně ${w} × ${h}, ${rezim === 'light' ? 'světlý' : 'tmavý'} režim: čitelné, nic nepřetéká; snímky`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ colorScheme: rezim });
      await promitat(page, SNIMKOVA);
      const jmena = ['volba-moznosti', 'odkryj-otevrena', 'spor-moznosti', 'volba-otevrena', 'kresba-siroka', 'kresba'];
      for (let i = 0; i < 6; i++) {
        await naZastaveni(page, i + 1, 6);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        // Pořadí na liště zůstane vidět celé i s tlačítkem Ukázat možnosti.
        const p = await page.locator('.hodina-lista__pocet').boundingBox();
        expect(p!.width).toBeGreaterThan(30);
        const otazka = page.locator('[data-promitane] [data-cast="otazka"]');
        if (await otazka.count()) expect(await otazka.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(40);
        await page.screenshot({ path: `${SNIMKY}/podoba-${w}x${h}-${jmena[i]}-${nazevRezimu(rezim)}.png` });
        if (i === 3) {
          await page.keyboard.press('m');
          await expect(page.locator(`#${VOLBA2} [data-cast="moznosti"]`)).toBeVisible();
          await page.screenshot({ path: `${SNIMKY}/podoba-${w}x${h}-volba-ukazane-moznosti-${nazevRezimu(rezim)}.png` });
        }
      }
    });
  }
}

for (const [w, h] of [[1280, 720], [1920, 1080]] as const) {
  test(`Roztřiď na plátně ${w} × ${h}: Dát sem pod popisem koše přes jeho šířku, název koše na jednom řádku; snímek`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await promitat(page, odkaz('Smrt', ['b:cesta8-ctyri-kose~m']));
    const kose = page.locator('#cesta8-ctyri-kose .kos');
    await expect(kose).toHaveCount(4);
    // Koše vedle sebe: tlačítka Dát sem ve stejné výšce, i když je popis jednoho kratší.
    const vysky = await page.locator('#cesta8-ctyri-kose .kos__sem').evaluateAll((v) => v.map((x) => Math.round(x.getBoundingClientRect().top)));
    expect(new Set(vysky).size, vysky.join(', ')).toBe(1);
    for (let i = 0; i < 4; i++) {
      const kos = kose.nth(i);
      const nazev = (await kos.locator('.kos__nazev').boundingBox())!;
      const popis = (await kos.locator('.kos__popis').boundingBox())!;
      const sem = (await kos.locator('.kos__sem').boundingBox())!;
      const hlava = (await kos.locator('.kos__hlava').boundingBox())!;
      expect(sem.y).toBeGreaterThanOrEqual(popis.y + popis.height - 1);
      expect(Math.abs(sem.width - hlava.width)).toBeLessThanOrEqual(1);
      // Název koše („Na to, o co přijde“) se neláme: jeden řádek.
      const radek = await kos.locator('.kos__nazev').evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
      expect(nazev.height).toBeLessThan(radek * 1.5);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `${SNIMKY}/roztrid-platno-${w}x${h}.png` });
    await axe(page);
  });
}

test('student s lištou (bez promítání) vidí blok celý; podoba se na stránce hodiny neukazuje', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PODOBY);
  await pripravit(page);
  await expect(page.locator('main')).not.toContainText(/otevřená otázka|jen kresba|na plátně/i);
  await page.locator('ol.zastaveni > li').nth(3).getByRole('link').click();
  await page.waitForURL(new RegExp(`#${VOLBA2}$`));
  await pripravit(page);
  await hydratovano(page);
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
  await expect(page.locator(`#${VOLBA2}`)).not.toHaveAttribute('data-podoba', /.*/);
  await expect(cast(page, VOLBA2, 'moznosti')).toBeVisible();
  await expect(lista(page)).toBeVisible();
  await expect(tlMoznosti(page)).toBeHidden();
  await page.goto(`/cesta/kdy-mam-dobry-duvod-verit/2/`);
  await pripravit(page);
  await expect(cast(page, VOLBA, 'scena').first()).toBeVisible();
  await expect(cast(page, VOLBA, 'duvod').first()).toBeVisible();
});

test('třída s telefony: učitel promítá otevřenou otázku, student v telefonu vidí karty celé; karty se neovlivňují', async ({ browser }) => {
  const kontext = await browser.newContext();
  const ucitel = await kontext.newPage();
  await ucitel.setViewportSize({ width: 1280, height: 720 });
  await promitat(ucitel);
  await naZastaveni(ucitel, 4, 5);
  await expect(cast(ucitel, VOLBA2, 'moznosti')).toBeHidden();

  // Student: druhá karta téhož prohlížeče (sdílí localStorage, ne sessionStorage), telefon.
  const student = await kontext.newPage();
  await student.setViewportSize({ width: 390, height: 844 });
  await student.goto(PODOBY);
  await pripravit(student);
  await student.locator('ol.zastaveni > li').nth(3).getByRole('link').click();
  await student.waitForURL(new RegExp(`#${VOLBA2}$`));
  await pripravit(student);
  await hydratovano(student);
  await expect(student.locator('html')).not.toHaveClass(/promitani/);
  expect(await pocet(student)).toBe('4 z 5');
  await expect(lista(student)).toBeVisible();
  await expect(cast(student, VOLBA2, 'moznosti')).toBeVisible();
  const karty = student.locator(`#${VOLBA2} label.karta`);
  await karty.nth(1).click();
  await student.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(cast(student, VOLBA2, 'zpetna').first()).toBeVisible();
  expect(await student.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await axe(student);
  await student.screenshot({ path: `${SNIMKY}/podoba-telefon-studenta-390-svetly.png` });

  // Učitel promítá dál beze změny; jeho blok nevidí volbu studenta (deník promítání je jen v jeho kartě).
  await ucitel.bringToFront();
  await ucitel.reload();
  await ucitel.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await expect(ucitel.locator('html')).toHaveClass(/promitani/);
  expect(await pocet(ucitel)).toBe('4 z 5');
  await ucitel.keyboard.press('m');
  await expect(cast(ucitel, VOLBA2, 'moznosti')).toBeVisible();
  await expect(ucitel.locator(`#${VOLBA2} .karta--vybrana`)).toHaveCount(0);
  // A student svou volbu má ve svém deníku.
  const ulozeno = await student.evaluate((id) => !!JSON.parse(localStorage.getItem('atlas-denik') ?? '{}').bloky?.[id], VOLBA2);
  expect(ulozeno).toBe(true);
  await kontext.close();
});

test('čisté bloky: promítání s plným deníkem začne od nuly, volba drží napříč zastaveními, deník se nezmění', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  // Plný deník: zvolená Volba, odkrytý Odkryj, zápis Tvého prvního názoru u otázky Jak mám žít?
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/2/');
  await hydratovano(page);
  await page.locator(`#${VOLBA} label.karta`).nth(1).click();
  await page.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await expect(cast(page, VOLBA, 'zpetna').first()).toBeVisible();
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/4/');
  await hydratovano(page);
  await page.locator(`#${ODKRYJ} textarea`).fill('Podle důkazů.');
  await page.locator(`#${ODKRYJ} [data-cast="akce"]`).first().click();
  await expect(cast(page, ODKRYJ, 'zpetna')).toBeVisible();
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('atlas-denik')!);
    d.zapisy.push({ id: 'otazka-jak-zit-prvni', otazka: 'Jak mám žít?', odpoved: 'Klidně.', odkaz: '/otazka/jak-zit/', kdy: '2026-10-18T09:00:00.000Z', druh: 'stanovisko' });
    localStorage.setItem('atlas-denik', JSON.stringify(d));
  });
  const pred = await page.evaluate(() => localStorage.getItem('atlas-denik'));

  // Promítat hodinu ze skladatele (uložená hodina učitele).
  const ZASTAVENI = [`b:${VOLBA}`, `b:${ODKRYJ}`, 'h:jak-zit'];
  const ulozena = { verze: 1, id: 'hodina-ciste', nazev: 'Čistě', poznamka: '', zmeneno: '2026-10-18T09:00:00.000Z', zastaveni: ZASTAVENI.map((id) => ({ id, poznamka: '' })) };
  await page.evaluate((h) => localStorage.setItem('atlas-hodiny', JSON.stringify({ verze: 1, hodiny: [h] })), ulozena);
  await page.goto('/hodina/nova/?hodina=hodina-ciste');
  await expect(page.locator('.zvolena > li')).toHaveCount(3);
  await page.getByRole('button', { name: 'Promítat hodinu' }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains('promitani-pripraveno'));
  await pripravit(page);
  await hydratovano(page);
  // Volba: žádná vybraná karta, žádná zpětná vazba, „Tvůj tah“ ne.
  await expect(page.locator(`#${VOLBA} .karta--vybrana`)).toHaveCount(0);
  await expect(cast(page, VOLBA, 'zpetna')).toHaveCount(0);
  await page.locator(`#${VOLBA} label.karta`).nth(2).click();
  await page.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  // Odkryj: nic odkrytého, prázdné pole.
  await naZastaveni(page, 2, 3);
  await expect(cast(page, ODKRYJ, 'zpetna')).toHaveCount(0);
  await expect(page.locator(`#${ODKRYJ} textarea`)).toHaveValue('');
  // Stránka otázky: jako u prázdného deníku nejdřív Tvůj první názor.
  await naZastaveni(page, 3, 3);
  await expect(page.locator('html')).toHaveAttribute('data-otazka-zavreno', '');
  // Zpátky na Volbu: volba třídy drží.
  await naZastaveni(page, 1, 3);
  await expect(page.locator(`#${VOLBA} label.karta`).nth(2)).toHaveClass(/karta--vybrana/);
  await expect(cast(page, VOLBA, 'zpetna').first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('atlas-denik'))).toBe(pred);

  // Ukončit promítání: stránka se načte znovu s deníkem studenta; deník je beze změny, deník promítání pryč.
  await lista(page).getByRole('button', { name: 'Ukončit promítání' }).click();
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
  await pripravit(page);
  await expect(lista(page).locator('[data-hl-prehled]')).toBeFocused();
  await expect(page.locator(`#${VOLBA} label.karta`).nth(1)).toHaveClass(/karta--vybrana/);
  expect(await page.evaluate(() => localStorage.getItem('atlas-denik'))).toBe(pred);
  expect(await page.evaluate(() => sessionStorage.getItem('atlas-denik-promitani'))).toBeNull();

  // Nové Promítat hodinu, teď ze stránky hodiny, je zase čisté. Stránka hodiny se zapíše do oddílu Hodiny
  // (otevřená hodina, H3); jinak se deník nezmění.
  await promitat(page, odkaz('Čistě', ZASTAVENI));
  await expect(page.locator(`#${VOLBA} .karta--vybrana`)).toHaveCount(0);
  await page.locator(`#${VOLBA} label.karta`).nth(0).click();
  await page.getByRole('button', { name: 'Tohle je můj tah' }).click();
  await lista(page).getByRole('button', { name: 'Ukončit promítání' }).click();
  await expect(page.locator('html')).not.toHaveClass(/promitani/);
  const bezHodin = (t: string | null) => {
    const { hodiny: _h, ...zbytek } = JSON.parse(t ?? '{}');
    return zbytek;
  };
  const po = await page.evaluate(() => localStorage.getItem('atlas-denik'));
  expect(bezHodin(po)).toEqual(bezHodin(pred));
  expect(JSON.parse(po!).hodiny?.[0]?.nazev).toBe('Čistě');
});
