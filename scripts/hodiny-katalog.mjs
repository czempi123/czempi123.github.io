// Kontrola katalogu zastavení (příprava hodiny) proti sestavenému webu: každá stránka z katalogu v dist/ existuje
// a každá kotva na ní stojí jako id prvku, a to jednou; nadtitulek bloku (štítek u studenta na stránce hodiny)
// je první nadtitulek za kotvou. Vypíše počty zastavení podle druhu a skončí „Chyb: N“.
// Spuštění po `npm run build`: node scripts/hodiny-katalog.mjs
import { readFileSync, existsSync } from 'node:fs';

const DRUHY = ['cesta', 'krok', 'blok', 'pribeh', 'profil', 'kapitola', 'oddil', 'otazka', 'hlas', 'tyden'];
const soubor = 'dist/hodina/katalog.json';
if (!existsSync(soubor)) {
  console.error(`Chybí ${soubor}: nejdřív npm run build.`);
  process.exit(1);
}
const { verze, zastaveni } = JSON.parse(readFileSync(soubor, 'utf8'));
let chyby = 0;
const chyba = (text) => {
  chyby++;
  console.log(`  ✗ ${text}`);
};
if (verze !== 1) chyba(`neznámá verze katalogu ${verze}`);

const stranky = new Map();
const html = (stranka) => {
  if (!stranky.has(stranka)) {
    const cesta = `dist${stranka}index.html`;
    stranky.set(stranka, existsSync(cesta) ? readFileSync(cesta, 'utf8') : null);
  }
  return stranky.get(stranka);
};
const pocty = Object.fromEntries(DRUHY.map((d) => [d, 0]));
const videne = new Set();
for (const z of zastaveni) {
  if (!(z.druh in pocty)) chyba(`${z.id}: neznámý druh ${z.druh}`);
  else pocty[z.druh]++;
  if (videne.has(z.id)) chyba(`${z.id}: id je v katalogu dvakrát`);
  videne.add(z.id);
  if (z.adresa !== (z.kotva ? `${z.stranka}#${z.kotva}` : z.stranka)) chyba(`${z.id}: adresa ${z.adresa} nesedí na stránku a kotvu`);
  const h = html(z.stranka);
  if (h === null) {
    chyba(`${z.id}: stránka ${z.stranka} v dist/ není`);
    continue;
  }
  if (!z.kotva) continue;
  const kolik = [...h.matchAll(new RegExp(`\\sid="${z.kotva.replace(/[-/]/g, '\\$&')}"`, 'g'))].length;
  if (kolik === 0) chyba(`${z.id}: kotva #${z.kotva} na ${z.stranka} chybí`);
  if (kolik > 1) chyba(`${z.id}: kotva #${z.kotva} je na ${z.stranka} ${kolik}×`);
  if (kolik === 1 && z.nadtitulek) {
    const od = h.search(new RegExp(`\\sid="${z.kotva.replace(/[-/]/g, '\\$&')}"`));
    const m = h.slice(od, od + 6000).match(/class="[^"]*\bt-nadtitulek\b[^"]*"[^>]*>([^<]*)</);
    const naStrance = m ? m[1].replace(/&nbsp;|\u00a0/g, ' ').replace(/&#39;/g, "'").trim() : null;
    if (naStrance !== z.nadtitulek) chyba(`${z.id}: nadtitulek v katalogu „${z.nadtitulek}“, na stránce „${naStrance ?? '—'}“`);
    else pocty.nadtitulky = (pocty.nadtitulky ?? 0) + 1;
  }
}

console.log(`Zastavení v katalogu: ${zastaveni.length}`);
for (const d of DRUHY) console.log(`  ${d.padEnd(9)} ${pocty[d]}`);
console.log(`Nadtitulků bloků ověřeno: ${pocty.nadtitulky ?? 0}`);
console.log(`Stránek: ${stranky.size}`);
console.log(`Chyb: ${chyby}`);
process.exit(chyby ? 1 : 0);
