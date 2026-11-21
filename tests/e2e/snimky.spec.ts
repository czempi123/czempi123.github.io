// Referenční snímky čtrnácti klíčových obrazovek (design-v2, O; hra herny od herna-v1, O): hlídají vzhled Spojení po každé změně, kterou jiné
// testy neuvidí (barva, papír, rozvržení). Jen Chromium. Jeden snímek pro Mac i Linux na GitHubu: písma jsou
// v atlasu lokální (stejné metriky, stejné zalomení), liší se jen vyhlazení hran, a na to stačí tolerance níž.
// Snímky jsou v tests/e2e/snimky/ (playwright.config.ts › snapshotPathTemplate). Po záměrné změně vzhledu:
//   PW_BEZ_BUILDU=1 npx playwright test tests/e2e/snimky.spec.ts --update-snapshots
// a nové snímky si prohlédni dřív, než je commitneš.
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DENIK = JSON.parse(readFileSync(join(import.meta.dirname, 'data/denik-kapitoly.json'), 'utf8')) as Record<string, unknown>;
// Pevný den: na Domů se po dnech střídá pokus a pohlednice (vyberDne), v deníku „naposledy …“.
const DEN = new Date('2026-11-16T10:00:00+01:00');
const TOLERANCE = { threshold: 0.3, maxDiffPixelRatio: 0.04, animations: 'disabled', caret: 'hide' } as const;

interface Obrazovka { nazev: string; adresa: string; sirka: 390 | 1440; rezim: 'light' | 'dark'; denik?: boolean; prvek?: string }
const OBRAZOVKY: Obrazovka[] = [
  { nazev: 'domu-390-den', adresa: '/', sirka: 390, rezim: 'light' },
  { nazev: 'domu-1440-noc', adresa: '/', sirka: 1440, rezim: 'dark' },
  { nazev: 'profil-1440-den', adresa: '/osobnost/sokrates/', sirka: 1440, rezim: 'light' },
  { nazev: 'profil-390-noc', adresa: '/osobnost/sokrates/', sirka: 390, rezim: 'dark' },
  { nazev: 'krok-cesty-spor-1440-den', adresa: '/cesta/kdy-mam-dobry-duvod-verit/5/', sirka: 1440, rezim: 'light', prvek: '.spor' },
  { nazev: 'prehled-cesty-390-den', adresa: '/cesta/kdy-mam-dobry-duvod-verit/', sirka: 390, rezim: 'light' },
  { nazev: 'velka-otazka-1440-noc', adresa: '/otazka/jak-zit/', sirka: 1440, rezim: 'dark' },
  { nazev: 'obdobi-1440-den', adresa: '/obdobi/helenismus-a-rim/', sirka: 1440, rezim: 'light' },
  { nazev: 'mapa-390-den', adresa: '/mapa/?rok=-360', sirka: 390, rezim: 'light' },
  { nazev: 'denik-kapitoly-390-noc', adresa: '/denik/', sirka: 390, rezim: 'dark', denik: true, prvek: '.kapitoly' },
  { nazev: 'pojem-390-den', adresa: '/pojem/ctnost/', sirka: 390, rezim: 'light' },
  { nazev: 'kresba-1440-noc', adresa: '/cesta/je-to-co-vidim-cela-skutecnost/1/', sirka: 1440, rezim: 'dark', prvek: '.kresba' },
  // Hra herny (herna-v1, O): Seřaď na ose s napovědami na šňůře, svisle na telefonu a v čtenářském sloupci.
  { nazev: 'hra-serad-390-den', adresa: '/obdobi/pocatky-a-klasicke-recko/', sirka: 390, rezim: 'light', prvek: '#obdobi1-serad' },
  { nazev: 'hra-serad-1440-noc', adresa: '/obdobi/pocatky-a-klasicke-recko/', sirka: 1440, rezim: 'dark', prvek: '#obdobi1-serad' },
];

async function pripravit(page: Page, o: Obrazovka) {
  await page.clock.setFixedTime(DEN);
  await page.setViewportSize({ width: o.sirka, height: o.sirka < 700 ? 844 : 900 });
  await page.emulateMedia({ colorScheme: o.rezim, reducedMotion: 'reduce' });
  if (o.denik) {
    await page.addInitScript((z) => {
      for (const [k, v] of Object.entries(z)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }, DENIK);
  }
  await page.goto(o.adresa);
  await page.evaluate(() => document.fonts.ready);
  // Ostrovy se hydratují, až jsou vidět; prvek dole na stránce se před snímkem posune do okna.
  if (o.prvek) {
    // Snímek prvku: pevné lišty by ležely přes jeho střed (docs/pouceni.md), proto se schovají.
    await page.addStyleTag({ content: 'header.hlavicka, nav.lista, .cesta-lista { visibility: hidden !important; }' });
    await page.locator(o.prvek).first().scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(400);
}

for (const o of OBRAZOVKY) {
  test(`snímek: ${o.nazev}`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'snímky jen pro Chromium');
    await pripravit(page, o);
    if (o.prvek) await expect(page.locator(o.prvek).first()).toHaveScreenshot(`${o.nazev}.png`, TOLERANCE);
    else await expect(page).toHaveScreenshot(`${o.nazev}.png`, TOLERANCE);
  });
}
