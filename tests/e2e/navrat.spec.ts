// Návrat: nový případ, který deník nabídne nejdřív tři dny po dokončení cesty tomu, kdo má závěrečné pravidlo.
// Před třemi dny nic, po třech dnech nabídka, odložit, skrýt, uložení odpovědi a původní pravidlo beze změny;
// čas dokončení cesty, starý deník bez něj, blok v dílně a snímky na 390 a 1440 px ve světlém i tmavém režimu.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { denikPodleData } from './denik';

// Deník řadí zápisy v kapitolách podle cest; tady se čte výpis podle data (K6 dodatek).
test.beforeEach(({ page }) => denikPodleData(page));

const DEN = 24 * 60 * 60 * 1000;
const CESTY = {
  c1: { slug: 'kdy-mam-dobry-duvod-verit', nazev: 'Kdy mám dobrý důvod věřit?', pocet: 7, pravidlo: 'cesta1-moje-pravidlo', navrat: 'cesta1-navrat', text: 'Věřím tomu, co obstojí, i když hledám, co by to vyvrátilo.' },
  c6: { slug: 'kolik-je-dost', nazev: 'Kolik je dost?', pocet: 7, pravidlo: 'cesta6-moje-pravidlo', navrat: 'cesta6-navrat', text: 'Dost je, když mi nic nechybí, i když nic nepřibývá.' },
  c5: { slug: 'co-mam-ve-svych-rukou', nazev: 'Co mám ve svých rukou?', pocet: 8, pravidlo: 'cesta5-moje-pravidlo', navrat: 'cesta5-navrat', text: 'V rukou mám to, co udělám. Na zbytku mi záleží, ale nestojím na něm.' },
} as const;
type Klic = keyof typeof CESTY;

interface Priprava {
  /** před kolika dny student cestu dokončil; null = čas dokončení v deníku chybí (starý deník) */
  dokonceno: number | null;
  /** před kolika dny naposledy otevřel krok */
  kdy?: number;
  pravidlo?: boolean;
  /** otevřené kroky; výchozí všechny */
  navstivene?: number[];
}

/** Zapíše do deníku cesty, jako by je student prošel před několika dny. */
async function pripravDenik(page: Page, cesty: Partial<Record<Klic, Priprava>>, bloky: Record<string, unknown> = {}) {
  await page.goto('/denik/');
  await page.evaluate(
    ([CESTY, cesty, bloky, DEN]) => {
      const pred = (dni: number) => new Date(Date.now() - dni * DEN).toISOString();
      const d = { verze: 1, zapisy: [] as unknown[], vyzvy: [], navstivene: [], bloky, aktivita: [], cesty: {} as Record<string, unknown> };
      for (const [k, p] of Object.entries(cesty)) {
        const c = CESTY[k as keyof typeof CESTY];
        const navstivene = p.navstivene ?? Array.from({ length: c.pocet }, (_, i) => i + 1);
        d.cesty[c.slug] = {
          nazev: c.nazev, pocet: c.pocet, krok: c.pocet, navstivene, kdy: pred(p.kdy ?? p.dokonceno ?? 0),
          ...(p.dokonceno === null ? {} : { dokonceno: pred(p.dokonceno) }),
        };
        if (p.pravidlo !== false) {
          d.zapisy.push({ id: c.pravidlo, otazka: `${c.nazev} Napiš svoje pravidlo.`, odpoved: c.text, odkaz: `/cesta/${c.slug}/${c.pocet}/`, kdy: pred(p.dokonceno ?? p.kdy ?? 0) });
        }
      }
      localStorage.setItem('atlas-denik', JSON.stringify(d));
    },
    [CESTY, cesty, bloky, DEN] as const,
  );
  await page.reload();
  await pripravit(page);
}

async function pripravit(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Ostrov pod ohybem (kresba v kroku 6 cesty 1) se hydratuje, až je vidět.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
}
const denik = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('atlas-denik') ?? '{}'));
const nabidka = (page: Page) => page.getByRole('region', { name: 'Návrat', exact: true });

async function axe(page: Page) {
  const v = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const popis = v.violations.map((x) => `${x.id}: ${x.help}\n  ${x.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`).join('\n  ')}`);
  expect(popis, popis.join('\n')).toEqual([]);
}

test('Návrat: před třemi dny nic, bez pravidla nic, bez dokončené cesty nic', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const cesty of [
    { c1: { dokonceno: 2 } },
    { c1: { dokonceno: 9, pravidlo: false } },
    { c1: { dokonceno: null, kdy: 9, navstivene: [1, 2, 7] } },
    { c1: { dokonceno: null, kdy: 1 } },
  ] satisfies Partial<Record<Klic, Priprava>>[]) {
    await pripravDenik(page, cesty);
    await expect(page.getByRole('heading', { name: 'Rozpracované' })).toBeVisible();
    await expect(nabidka(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Zkusit' })).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('Návrat');
  }
});

test('Návrat po třech dnech jen klávesnicí (telefon): pravidlo ke čtení, nový případ, odpověď v deníku a pravidlo beze změny', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await pripravDenik(page, { c1: { dokonceno: 3.1 } });
  const puvodni = (await denik(page)).zapisy[0];
  const n = nabidka(page);
  await expect(n.getByRole('heading', { name: 'Návrat' })).toBeVisible();
  await expect(n).toContainText('Kdy mám dobrý důvod věřit?');
  await expect(n).toContainText('Tuhle cestu máš za sebou. Zkusíš své pravidlo na jednom novém případu?');
  // Nabídka stojí nad Rozpracovaným a nic na ní nepočítá ani nespěchá.
  expect((await n.boundingBox())!.y).toBeLessThan((await page.getByRole('heading', { name: 'Rozpracované' }).boundingBox())!.y);
  await expect(n).not.toContainText(/\d/);

  await n.getByRole('button', { name: 'Zkusit' }).focus();
  await page.keyboard.press('Enter');
  const blok = page.locator('#cesta1-navrat');
  await expect(blok).toBeVisible();
  await expect(blok.locator('.blok__nadtitulek')).toHaveText('Kdy mám dobrý důvod věřit?');
  // Pravidlo je jen ke čtení: jediné pole v bloku je nepovinný důvod.
  await expect(blok.locator('.pravidlo')).toHaveText(CESTY.c1.text);
  await expect(blok.getByRole('textbox')).toHaveCount(1);
  await expect(blok).toContainText('Představ si večer před čtvrtletkou z matematiky.');
  await expect(blok).toContainText('Máš před sebou sešit a rozhoduješ se, jestli ho zavřít.');
  await expect(blok.getByRole('heading', { name: 'Platí tvoje pravidlo i tady?' })).toBeVisible();
  const volby = blok.getByRole('radiogroup', { name: 'Platí tvoje pravidlo i tady?' }).getByRole('radio');
  await expect(volby).toHaveCount(3);
  await expect(blok.getByRole('button', { name: 'Zapsat do deníku' })).toBeDisabled();

  await page.keyboard.press('Tab');
  await expect(volby.nth(0)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(blok.getByRole('radio', { name: 'Ano' })).toBeChecked();
  await page.keyboard.press('ArrowDown');
  await expect(blok.getByRole('radio', { name: 'Upravím ho' })).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(blok.getByRole('textbox', { name: /^Proč\?/ })).toBeFocused();
  await page.keyboard.type('neříká, co dělat, když ověřit nejde');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const odpoved = blok.getByRole('region', { name: 'Tvoje odpověď' });
  await expect(odpoved).toBeFocused();
  await expect(odpoved).toContainText('Tvoje odpověď: Upravím ho.');
  await expect(odpoved).toContainText('Co mu chybělo, aby si s tímhle večerem poradilo?');
  // Nic nehodnotí: jedna věta, která se ptá dál.
  await expect(odpoved).not.toContainText(/správn|špatn|výborn|skvěl/i);
  expect((await odpoved.locator('p').last().innerText()).match(/[.!?]/g)).toHaveLength(1);
  await expect(blok).toContainText('Odpověď je v deníku. Tvoje pravidlo zůstává beze změny.');

  // Nový zápis v deníku; původní pravidlo se nepřepsalo.
  const d = await denik(page);
  expect(d.zapisy).toHaveLength(2);
  expect(d.zapisy[0]).toEqual(puvodni);
  expect(d.zapisy[1]).toMatchObject({
    id: 'cesta1-navrat',
    otazka: 'Návrat · Zpráva před čtvrtletkou: platí moje pravidlo i tady?',
    odpoved: 'Upravím ho. Proč: neříká, co dělat, když ověřit nejde.',
    odkaz: '/cesta/kdy-mam-dobry-duvod-verit/7/',
    druh: 'navrat',
  });
  await expect(page.locator('.kapitoly')).toContainText('Upravím ho. Proč: neříká, co dělat, když ověřit nejde.');
  await expect(page.locator('.kapitoly')).toContainText(CESTY.c1.text);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);

  // Po obnovení: zodpovězený návrat se už nenabízí, zápis i pravidlo zůstávají.
  await page.reload();
  await pripravit(page);
  await expect(nabidka(page)).toHaveCount(0);
  await expect(page.locator('.seznam--zapisy li')).toHaveCount(2);
  expect((await denik(page)).zapisy[0]).toEqual(puvodni);
  await page.goto('/cesta/kdy-mam-dobry-duvod-verit/7/');
  await pripravit(page);
  await expect(page.getByRole('textbox', { name: 'Kdy mám dobrý důvod něčemu věřit? Napiš svoje pravidlo.' })).toHaveValue(CESTY.c1.text);
});

test('Návrat: Později nabídku odloží (vrátí se po třech dnech), Už nenabízet ji skryje', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await pripravDenik(page, { c1: { dokonceno: 5 } });
  await nabidka(page).getByRole('button', { name: 'Později' }).click();
  const zprava = page.getByRole('status');
  await expect(zprava).toHaveText('Návrat se nabídne znovu za pár dní.');
  await expect(zprava).toBeFocused();
  await expect(nabidka(page)).toHaveCount(0);
  const odlozeno = (await denik(page)).bloky['cesta1-navrat'].odlozeno;
  expect(Date.now() - Date.parse(odlozeno)).toBeLessThan(60_000);
  await page.reload();
  await pripravit(page);
  await expect(page.getByRole('heading', { name: 'Rozpracované' })).toBeVisible();
  await expect(nabidka(page)).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveCount(0);
  // Dva dny po odložení pořád nic, po třech dnech je nabídka zpátky.
  await pripravDenik(page, { c1: { dokonceno: 9 } }, { 'cesta1-navrat': { odlozeno: new Date(Date.now() - 2 * DEN).toISOString() } });
  await expect(nabidka(page)).toHaveCount(0);
  await pripravDenik(page, { c1: { dokonceno: 9 } }, { 'cesta1-navrat': { odlozeno: new Date(Date.now() - 3.1 * DEN).toISOString() } });
  await expect(nabidka(page).getByRole('button', { name: 'Zkusit' })).toBeVisible();

  await nabidka(page).getByRole('button', { name: 'Už nenabízet' }).click();
  await expect(page.getByRole('status')).toHaveText('Tenhle návrat se už nenabídne.');
  await expect(page.getByRole('status')).toBeFocused();
  expect((await denik(page)).bloky['cesta1-navrat'].skryto).toBe(true);
  await page.reload();
  await pripravit(page);
  await expect(nabidka(page)).toHaveCount(0);
  // Skrytý se nevrátí ani za měsíc.
  await pripravDenik(page, { c1: { dokonceno: 60 } }, { 'cesta1-navrat': { skryto: true, odlozeno: new Date(Date.now() - 40 * DEN).toISOString() } });
  await expect(nabidka(page)).toHaveCount(0);
  // Odložení ani skrytí nic nezapsalo do odpovědí a pravidlo zůstalo.
  const d = await denik(page);
  expect(d.zapisy).toHaveLength(1);
  expect(d.zapisy[0].odpoved).toBe(CESTY.c1.text);
});

test('Návrat: vždy jen jeden, nejdřív u cesty dokončené nejdéle; každá cesta má svůj případ', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await pripravDenik(page, { c1: { dokonceno: 4 }, c6: { dokonceno: 6 }, c5: { dokonceno: 8 } });
  await expect(page.getByRole('button', { name: 'Zkusit' })).toHaveCount(1);
  await expect(nabidka(page).locator('.nabidka__cesta')).toHaveText('Co mám ve svých rukou?');
  await nabidka(page).getByRole('button', { name: 'Zkusit' }).click();
  let blok = page.locator('#cesta5-navrat');
  await expect(blok.locator('.pravidlo')).toHaveText(CESTY.c5.text);
  await expect(blok).toContainText('Představ si, že ti nejlepší kamarád řekne, že se o prázdninách stěhuje.');
  await blok.getByText('Ano', { exact: true }).click();
  await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(blok.getByRole('region', { name: 'Tvoje odpověď' })).toContainText('Co z toho přátelství je podle něj ve tvých rukou a co už ne?');
  // Hned po odpovědi se další návrat nenabídne; přijde při příští návštěvě deníku.
  await expect(page.getByRole('button', { name: 'Zkusit' })).toHaveCount(0);

  await page.reload();
  await pripravit(page);
  await expect(nabidka(page).locator('.nabidka__cesta')).toHaveText('Kolik je dost?');
  await nabidka(page).getByRole('button', { name: 'Zkusit' }).click();
  blok = page.locator('#cesta6-navrat');
  await expect(blok.locator('.pravidlo')).toHaveText(CESTY.c6.text);
  await expect(blok).toContainText('Představ si, že tvůj telefon funguje.');
  await expect(blok).toContainText('Na nový máš našetřeno z brigády.');
  await blok.getByText('Nevím', { exact: true }).click();
  await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
  await expect(blok.getByRole('region', { name: 'Tvoje odpověď' })).toContainText('Co vlastně chceš: ten telefon, nebo nebýt u stolu jediný?');
  const zapisy = (await denik(page)).zapisy;
  expect(zapisy.find((z: { id: string }) => z.id === 'cesta5-navrat').odpoved).toBe('Ano.');
  expect(zapisy.find((z: { id: string }) => z.id === 'cesta6-navrat')).toMatchObject({ odpoved: 'Nevím.', otazka: 'Návrat · Nový telefon: platí moje pravidlo i tady?' });
  // Začít znovu odpověď smaže a blok je znovu k vyplnění; pravidla zůstávají.
  await blok.getByRole('button', { name: 'Začít znovu' }).click();
  await expect(blok.getByRole('radio').first()).toBeFocused();
  expect((await denik(page)).zapisy.map((z: { id: string }) => z.id).sort()).toEqual(['cesta1-moje-pravidlo', 'cesta5-moje-pravidlo', 'cesta5-navrat', 'cesta6-moje-pravidlo']);
});

test('čas dokončení cesty: zapíše se při posledním kroku a pozdější otevření kroku ho neposune', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { slug, pocet } = CESTY.c1;
  for (let n = 1; n <= pocet; n++) {
    await page.goto(`/cesta/${slug}/${n}/`);
    await pripravit(page);
    const c = (await denik(page)).cesty[slug];
    if (n < pocet) expect(c.dokonceno).toBeUndefined();
    else expect(Date.now() - Date.parse(c.dokonceno)).toBeLessThan(60_000);
  }
  // Čerstvě dokončená cesta s pravidlem: deník zatím nic nenabízí.
  await page.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).fill('Moje pravidlo.');
  await page.getByRole('textbox', { name: /Napiš svoje pravidlo/ }).blur();
  await page.goto('/denik/');
  await pripravit(page);
  await expect(page.locator('.kapitoly')).toContainText('Moje pravidlo.');
  await expect(nabidka(page)).toHaveCount(0);

  // Cesta dokončená před pěti dny: návštěva kroku posune jen čas posledního kroku.
  await pripravDenik(page, { c1: { dokonceno: 5 } });
  const pred = (await denik(page)).cesty[slug];
  await page.goto(`/cesta/${slug}/3/`);
  await pripravit(page);
  const po = (await denik(page)).cesty[slug];
  expect(po.dokonceno).toBe(pred.dokonceno);
  expect(Date.parse(po.kdy)).toBeGreaterThan(Date.parse(pred.kdy));
  expect(po.krok).toBe(3);
  await page.goto('/denik/');
  await pripravit(page);
  await expect(nabidka(page).getByRole('button', { name: 'Zkusit' })).toBeVisible();
});

test('starý deník bez času dokončení: nic se nerozbije, návrat se řídí posledním otevřeným krokem', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { slug } = CESTY.c1;
  await pripravDenik(page, { c1: { dokonceno: null, kdy: 6 } });
  await expect(page.locator('.seznam--rozpracovane')).toContainText('prošel jsi celou');
  await expect(nabidka(page).getByRole('button', { name: 'Zkusit' })).toBeVisible();
  const stare = (await denik(page)).cesty[slug].kdy;
  // Další návštěva kroku zapíše čas dokončení natrvalo: ten starý, ne dnešní.
  await page.goto(`/cesta/${slug}/2/`);
  await pripravit(page);
  expect((await denik(page)).cesty[slug].dokonceno).toBe(stare);
  // Přehled cesty, Domů i deník fungují dál.
  await page.goto(`/cesta/${slug}/`);
  await expect(page.getByRole('status')).toContainText('Cestu jsi prošel celou.');
  await page.goto('/denik/');
  await pripravit(page);
  await expect(nabidka(page).getByRole('button', { name: 'Zkusit' })).toBeVisible();
});

test('Návrat: mimo deník jen tichá tečka u Deníku, bez čísla a bez nabídky', async ({ page }) => {
  // Rozhodnutí autora 12. 11. 2026 (plán po auditu, otázka 7): tečka u ikony Deník, když čeká Návrat.
  for (const sirka of [1440, 390]) {
    await page.setViewportSize({ width: sirka, height: 900 });
    await pripravDenik(page, { c1: { dokonceno: 10 } });
    await expect(nabidka(page)).toBeVisible();
    // Na stránce deníku tečka není: Návrat je tam vidět sám.
    await expect(page.locator('[data-tecka-navratu]:visible')).toHaveCount(0);
    for (const adresa of ['/', '/otazky/', '/cesta/kdy-mam-dobry-duvod-verit/7/', '/osobnost/sokrates/']) {
      await page.goto(adresa);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).not.toContainText(/Návrat\b/);
      // Tečka je jen jedna viditelná (záhlaví na notebooku, spodní lišta na telefonu), bez čísla; čtečka slyší větu.
      const tecka = page.locator('[data-tecka-navratu]:visible');
      await expect(tecka).toHaveCount(adresa.startsWith('/cesta/') && sirka < 900 ? 0 : 1);
      if (await tecka.count()) await expect(tecka).toHaveText('čeká tě návrat ke cestě');
    }
  }
  // Bez čekajícího návratu tečka nikde není.
  await page.evaluate(() => localStorage.removeItem('atlas-denik'));
  await page.goto('/');
  await expect(page.locator('[data-tecka-navratu]:visible')).toHaveCount(0);
});

for (const { sirka, vyska } of [{ sirka: 390, vyska: 844 }, { sirka: 1440, vyska: 900 }]) {
  for (const rezim of ['light', 'dark'] as const) {
    const r = rezim === 'light' ? 'svetly' : 'tmavy';
    test(`deník s Návratem · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await pripravDenik(page, { c6: { dokonceno: 4 } });
      await expect(nabidka(page).getByRole('button', { name: 'Zkusit' })).toBeVisible();
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      // Tři tlačítka nabídky jsou dotykové cíle aspoň 44 px a nepřekrývají se.
      const boxy = await Promise.all(['Zkusit', 'Později', 'Už nenabízet'].map((t) => nabidka(page).getByRole('button', { name: t }).boundingBox()));
      for (const b of boxy) expect(b!.height).toBeGreaterThanOrEqual(44);
      for (let i = 1; i < boxy.length; i++) {
        const [a, b] = [boxy[i - 1]!, boxy[i]!];
        expect(b.x >= a.x + a.width || b.y >= a.y + a.height).toBe(true);
      }
      // Pevná hlavička a spodní lišta by na snímku celé stránky ležely přes obsah.
      await page.addStyleTag({ content: 'header.hlavicka { position: static !important; } nav.lista { display: none !important; }' });
      await page.screenshot({ path: `test-results/snimky/denik-navrat-nabidka-${sirka}-${r}.png`, fullPage: true });

      await nabidka(page).getByRole('button', { name: 'Zkusit' }).click();
      const blok = page.locator('#cesta6-navrat');
      await expect(blok.getByRole('heading', { name: 'Platí tvoje pravidlo i tady?' })).toBeVisible();
      // Tři karty odpovědí mají stejnou stavbu: žádná se nezalamuje, všechny jsou stejně vysoké.
      const karty = await blok.locator('.karta').evaluateAll((k) => k.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(karty).size).toBe(1);
      expect(karty[0]).toBeLessThanOrEqual(60);
      await axe(page);
      await page.screenshot({ path: `test-results/snimky/denik-navrat-blok-${sirka}-${r}.png`, fullPage: true });
      await blok.getByText('Upravím ho', { exact: true }).click();
      await blok.getByRole('textbox', { name: /^Proč\?/ }).fill('Chybí v něm, co s věcmi, které mají všichni kolem.');
      await blok.getByRole('button', { name: 'Zapsat do deníku' }).click();
      await expect(blok.getByRole('region', { name: 'Tvoje odpověď' })).toContainText('Co do něj připíšeš o věcech, které chceš hlavně proto, že je mají druzí?');
      await axe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `test-results/snimky/denik-navrat-odpoved-${sirka}-${r}.png`, fullPage: true });
    });

    test(`blok Návrat v dílně · ${sirka} px · ${rezim === 'light' ? 'světlý' : 'tmavý'}`, async ({ page }) => {
      await page.setViewportSize({ width: sirka, height: vyska });
      await page.emulateMedia({ colorScheme: rezim, reducedMotion: 'reduce' });
      await page.goto('/dilna/bloky/');
      await page.evaluate(() => document.fonts.ready);
      const blok = page.locator('#cesta1-navrat');
      await blok.scrollIntoViewIfNeeded();
      await expect(page.locator('astro-island[component-url*="Navrat"]')).not.toHaveAttribute('ssr', /.*/);
      // Bez vlastního pravidla ukáže dílna pravidlo na ukázku.
      await expect(blok.locator('.pravidlo')).toHaveText('Věřím tomu, co obstojí, i když hledám, co by to vyvrátilo.');
      await blok.getByRole('radio').first().focus();
      await page.keyboard.press('Space');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(blok.getByRole('radio', { name: 'Nevím' })).toBeChecked();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      const odpoved = blok.getByRole('region', { name: 'Tvoje odpověď' });
      await expect(odpoved).toBeFocused();
      await expect(odpoved).toContainText('Na čem to vázne: na pravidle, nebo na tom, že tu zprávu večer nejde ověřit?');
      const v = await new AxeBuilder({ page }).include('#cesta1-navrat').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(v.violations.map((x) => x.id)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.addStyleTag({ content: 'header.hlavicka, nav.lista { visibility: hidden !important; }' });
      const clip = await blok.evaluate((e) => {
        const b = e.getBoundingClientRect();
        return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
      });
      await page.screenshot({ path: `test-results/snimky/blok-navrat-${sirka}-${r}.png`, fullPage: true, clip, animations: 'disabled' });
      // Po obnovení drží odpověď; Začít znovu ji smaže.
      await page.reload();
      await blok.scrollIntoViewIfNeeded();
      await expect(page.locator('astro-island[component-url*="Navrat"]')).not.toHaveAttribute('ssr', /.*/);
      await expect(blok.getByRole('region', { name: 'Tvoje odpověď' })).toContainText('Tvoje odpověď: Nevím.');
      await blok.getByRole('button', { name: 'Začít znovu' }).click();
      await expect(blok.getByRole('button', { name: 'Zapsat do deníku' })).toBeDisabled();
      expect((await denik(page)).zapisy ?? []).toEqual([]);
    });
  }
}
