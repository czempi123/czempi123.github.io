// Váha stránek osob v sestaveném webu (herna-v1, K4; podklad pro revizi R): HTML, HTML po gzipu, vlastnosti ostrovů
// (props v astro-island) a skripty, které stránka načítá (jen poprvé; sdílené soubory se počítají jednou).
// S volbou --cesty totéž pro stránky cest: přehled a každý krok (herna-v1, K5).
// node scripts/vaha-stranek-osob.mjs [dist] [--cesty] [--json soubor]
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist';
const jsonVen = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const cesty = process.argv.includes('--cesty');
const kb = (n) => (n / 1024).toFixed(1);

/** Stránky k měření: [popisek, soubor]. */
function stranky() {
  const ven = [];
  if (!cesty) {
    for (const slug of readdirSync(join(dist, 'osobnost')).sort()) ven.push([slug, join(dist, 'osobnost', slug, 'index.html')]);
    return ven;
  }
  for (const slug of readdirSync(join(dist, 'cesta')).sort()) {
    const slozka = join(dist, 'cesta', slug);
    if (!statSync(slozka).isDirectory()) continue;
    ven.push([`${slug}/`, join(slozka, 'index.html')]);
    const kroky = readdirSync(slozka).filter((x) => /^\d+$/.test(x)).sort((a, b) => a - b);
    for (const n of kroky) ven.push([`${slug}/${n}`, join(slozka, n, 'index.html')]);
  }
  return ven;
}

const radky = [];
for (const [slug, f] of stranky()) {
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const props = [...html.matchAll(/ props="([^"]*)"/g)].reduce((s, m) => s + m[1].length, 0);
  const ostrovy = [...html.matchAll(/component-url="([^"]*)"/g)].map((m) => m[1].split('/').pop().replace(/\.[^.]*\.js$/, ''));
  radky.push({ slug, html: html.length, gzip: gzipSync(html).length, props, ostrovy: ostrovy.length, druhy: [...new Set(ostrovy)].join(' ') });
}
const sirka = Math.max(26, ...radky.map((r) => r.slug.length + 1));
const soucet = (k, r = radky) => r.reduce((s, x) => s + x[k], 0);
const prumer = (nazev, r) => {
  if (!r.length) return;
  console.log(nazev.padEnd(sirka), kb(soucet('html', r) / r.length).padStart(7), kb(soucet('gzip', r) / r.length).padStart(8), kb(soucet('props', r) / r.length).padStart(9));
};
console.log('stránka'.padEnd(sirka), 'HTML kB', ' gzip kB', ' props kB', ' ostrovů');
for (const r of radky) console.log(r.slug.padEnd(sirka), kb(r.html).padStart(7), kb(r.gzip).padStart(8), kb(r.props).padStart(9), String(r.ostrovy).padStart(8));
prumer('průměr', radky);
if (cesty) {
  // Poslední krok každé cesty nese závěr cesty (a od K5 sebehodnocení): průměr zvlášť.
  const posledni = radky.filter((r, i) => !r.slug.endsWith('/') && (!radky[i + 1] || radky[i + 1].slug.endsWith('/')));
  prumer('průměr posledních kroků', posledni);
}
if (jsonVen) writeFileSync(jsonVen, JSON.stringify(radky, null, 1));
