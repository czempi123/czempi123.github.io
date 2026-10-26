// Licence obrázků na zveřejněném webu: každá stránka sestaveného webu (dist/), která ukazuje obrázek ze zdroje.yaml,
// ukazuje i jeho licenci (profil v Pramenech, krok cesty pod popiskem Příběhu).
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const KOREN = join(import.meta.dirname, '../..');
const DIST = join(KOREN, 'dist');

function html(slozka: string): string[] {
  return readdirSync(slozka).flatMap((f) => {
    const p = join(slozka, f);
    if (statSync(p).isDirectory()) return f === 'pagefind' || f === '_astro' ? [] : html(p);
    return f.endsWith('.html') ? [p] : [];
  });
}

const dekoduj = (t: string) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

test('stránka s obrázkem ukazuje jeho licenci a odkaz na zdroj', () => {
  const obrazky: { soubor: string; licence: string; url: string }[] = parse(readFileSync(join(KOREN, 'src/data/zdroje.yaml'), 'utf8')).obrazky;
  const chyby: string[] = [];
  let vyskytu = 0;
  for (const s of html(DIST)) {
    const text = dekoduj(readFileSync(s, 'utf8'));
    for (const o of obrazky) {
      if (!text.includes(`src="/${o.soubor}"`)) continue;
      vyskytu++;
      if (!text.includes(`>${o.licence}</a>`) || !text.includes(`href="${o.url}"`)) chyby.push(`${s.slice(DIST.length)}: ${o.soubor}`);
    }
  }
  expect(vyskytu).toBeGreaterThanOrEqual(obrazky.length);
  expect(chyby).toEqual([]);
});
