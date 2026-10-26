// Do konce zkoušky se studenty: každá stránka sestaveného webu (dist/) má noindex, aby zveřejněný atlas nebyl ve vyhledávačích.
// Po zkoušce se značka v src/layouts/Zakladni.astro sundá a tento test se smaže v tomtéž commitu.
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '../../dist');

function html(slozka: string): string[] {
  return readdirSync(slozka).flatMap((f) => {
    const p = join(slozka, f);
    if (statSync(p).isDirectory()) return f === 'pagefind' || f === '_astro' ? [] : html(p);
    return f.endsWith('.html') ? [p] : [];
  });
}

test('každá stránka má noindex a právě jednu značku robots', () => {
  const soubory = html(DIST);
  expect(soubory.length).toBeGreaterThan(5);
  const chyby: string[] = [];
  for (const s of soubory) {
    const znacky = [...readFileSync(s, 'utf8').matchAll(/<meta name="robots" content="([^"]+)"/g)].map((m) => m[1]);
    if (znacky.length !== 1 || !znacky[0].split(',').map((x) => x.trim()).includes('noindex')) {
      chyby.push(`${s.slice(DIST.length)}: ${znacky.length ? znacky.join(' | ') : 'bez značky robots'}`);
    }
  }
  expect(chyby).toEqual([]);
});

test('robots.txt nic nezakazuje (vyhledávač musí stránku přečíst, aby noindex viděl)', () => {
  const soubor = join(DIST, 'robots.txt');
  if (!existsSync(soubor)) return;
  expect(readFileSync(soubor, 'utf8')).not.toMatch(/^\s*Disallow:\s*\/\s*$/m);
});
