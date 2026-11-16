// Letopočet se na konci řádku nedělí: „399 př. n. l.“ má v sestaveném webu nezlomitelné mezery (CLAUDE.md › České konvence).
// Hlídá text stránek i vlastnosti ostrovů (karta v Mapě a čase, Dva životy), ne atributy alt a aria-label, které se nezalamují.
// Výpis míst podle třídy: python3 scripts/letopocty-dist.py (design-v2, O).
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '../../dist');
const ERA = /\d+(?:[–-]\d+)?[ \u00a0]?(?:př\.[ \u00a0]n\.[ \u00a0]l\.|n\.[ \u00a0]l\.)|př\. n\.|n\. l\./g;

function html(slozka: string): string[] {
  return readdirSync(slozka).flatMap((f) => {
    const p = join(slozka, f);
    if (statSync(p).isDirectory()) return f === 'pagefind' || f === '_astro' ? [] : html(p);
    return f.endsWith('.html') ? [p] : [];
  });
}

const ENT: Record<string, string> = { '&quot;': '"', '&amp;': '&', '&#39;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': '\u00a0' };
const odentituj = (s: string) => s.replace(/&(?:quot|amp|#39|lt|gt|nbsp);/g, (e) => ENT[e]).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

/** Text, který student uvidí: obsah mimo značky, skripty a styly, a vlastnosti ostrovů. */
function viditelne(s: string): string[] {
  const bez = s.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ');
  const texty = [...bez.matchAll(/>([^<]+)</g)].map((m) => odentituj(m[1]));
  const vlastnosti = [...s.matchAll(/<astro-island[^>]*\sprops="([^"]*)"/g)].map((m) => odentituj(m[1]));
  return [...texty, ...vlastnosti];
}

test('žádný letopočet v dist/ nemá obyčejnou mezeru', () => {
  const chyby: string[] = [];
  for (const s of html(DIST)) {
    for (const t of viditelne(readFileSync(s, 'utf8'))) {
      for (const m of t.matchAll(ERA)) {
        if (m[0].includes(' ')) chyby.push(`${s.slice(DIST.length)}: …${t.slice(Math.max(0, m.index! - 30), m.index! + m[0].length)}`);
      }
    }
  }
  expect(chyby).toEqual([]);
});
