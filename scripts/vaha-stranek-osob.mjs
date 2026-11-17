// Váha stránek osob v sestaveném webu (herna-v1, K4; podklad pro revizi R): HTML, HTML po gzipu, vlastnosti ostrovů
// (props v astro-island) a skripty, které stránka načítá (jen poprvé; sdílené soubory se počítají jednou).
// node scripts/vaha-stranek-osob.mjs [dist] [--json soubor]
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'dist';
const jsonVen = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const kb = (n) => (n / 1024).toFixed(1);
const radky = [];
for (const slug of readdirSync(join(dist, 'osobnost')).sort()) {
  const f = join(dist, 'osobnost', slug, 'index.html');
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const props = [...html.matchAll(/ props="([^"]*)"/g)].reduce((s, m) => s + m[1].length, 0);
  const ostrovy = [...html.matchAll(/component-url="([^"]*)"/g)].map((m) => m[1].split('/').pop().replace(/\.[^.]*\.js$/, ''));
  radky.push({ slug, html: html.length, gzip: gzipSync(html).length, props, ostrovy: ostrovy.length, druhy: [...new Set(ostrovy)].join(' ') });
}
const soucet = (k) => radky.reduce((s, r) => s + r[k], 0);
console.log('stránka'.padEnd(26), 'HTML kB', ' gzip kB', ' props kB', ' ostrovů');
for (const r of radky) console.log(r.slug.padEnd(26), kb(r.html).padStart(7), kb(r.gzip).padStart(8), kb(r.props).padStart(9), String(r.ostrovy).padStart(8));
console.log('průměr'.padEnd(26), kb(soucet('html') / radky.length).padStart(7), kb(soucet('gzip') / radky.length).padStart(8), kb(soucet('props') / radky.length).padStart(9));
if (jsonVen) writeFileSync(jsonVen, JSON.stringify(radky, null, 1));
